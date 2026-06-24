'use server';

import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/db/mongodb';
import MessageModel from '@/lib/models/Message';
import { requireRole } from '@/lib/auth/helpers';

export async function submitContactMessage(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  await connectDB();
  const msg = await MessageModel.create(data);
  return JSON.parse(JSON.stringify(msg));
}

export async function getMessages() {
  await requireRole(['admin', 'manager']);
  await connectDB();
  const messages = await MessageModel.find().sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(messages));
}

export async function updateMessageStatus(id: string, status: 'read' | 'replied') {
  await requireRole(['admin', 'manager']);
  await connectDB();
  const msg = await MessageModel.findByIdAndUpdate(id, { status }, { new: true }).lean();
  revalidatePath('/dashboard/messages');
  return JSON.parse(JSON.stringify(msg));
}

export async function deleteMessage(id: string) {
  await requireRole(['admin']);
  await connectDB();
  await MessageModel.findByIdAndDelete(id);
  revalidatePath('/dashboard/messages');
  return { success: true };
}
