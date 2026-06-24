import imagekit from '@/lib/imagekit';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const authParams = imagekit.getAuthenticationParameters();
  return NextResponse.json(authParams);
}
