'use server';

import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/db/mongodb';
import UserModel from '@/lib/models/User';
import { requireRole } from '@/lib/auth/helpers';

export async function getUsers() {
  await requireRole(['admin']);
  await connectDB();
  const users = await UserModel.find().sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(users));
}

export async function updateUserApproval(userId: string, isApproved: boolean) {
  await requireRole(['admin']);
  await connectDB();
  const user = await UserModel.findByIdAndUpdate(userId, { isApproved }, { new: true }).lean();
  revalidatePath('/dashboard/users');
  return JSON.parse(JSON.stringify(user));
}

export async function updateUserRole(userId: string, role: 'admin' | 'manager' | 'viewer') {
  await requireRole(['admin']);
  await connectDB();
  const user = await UserModel.findByIdAndUpdate(userId, { role }, { new: true }).lean();
  revalidatePath('/dashboard/users');
  return JSON.parse(JSON.stringify(user));
}

export async function deleteUser(userId: string) {
  await requireRole(['admin']);
  await connectDB();
  await UserModel.findByIdAndDelete(userId);
  revalidatePath('/dashboard/users');
  return { success: true };
}
