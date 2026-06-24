import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import connectDB from '@/lib/db/mongodb';
import UserModel from '@/lib/models/User';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'No webhook secret' }, { status: 500 });
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  await connectDB();

  if (evt.type === 'user.created') {
    const { id, email_addresses, first_name, last_name } = evt.data;
    const existingCount = await UserModel.countDocuments();
    const isFirst = existingCount === 0;
    const email = email_addresses[0]?.email_address || '';

    await UserModel.findOneAndUpdate(
      { $or: [{ clerkId: id }, { email }] },
      {
        $set: {
          clerkId: id,
          email,
          name: `${first_name || ''} ${last_name || ''}`.trim(),
        },
        $setOnInsert: {
          role: isFirst ? 'admin' : 'viewer',
          isApproved: isFirst,
        },
      },
      { upsert: true, returnDocument: 'after' }
    );
  }

  if (evt.type === 'user.deleted') {
    await UserModel.findOneAndDelete({ clerkId: evt.data.id });
  }

  return NextResponse.json({ success: true });
}
