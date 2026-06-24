'use server';

import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/db/mongodb';
import WorkerModel from '@/lib/models/Worker';
import { requireRole } from '@/lib/auth/helpers';

export async function getWorkers() {
  await requireRole(['admin', 'manager']);
  await connectDB();
  const workers = await WorkerModel.find().sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(workers));
}

export async function createWorker(data: {
  name: string;
  cnic: string;
  drivingLicense: string;
  contact: string;
  email: string;
  assignedMachine: string;
  experience: number;
}) {
  await requireRole(['admin', 'manager']);
  await connectDB();
  const worker = await WorkerModel.create(data);
  revalidatePath('/dashboard/workers');
  return JSON.parse(JSON.stringify(worker));
}

export async function updateWorker(id: string, data: Partial<{
  name: string;
  cnic: string;
  drivingLicense: string;
  contact: string;
  email: string;
  assignedMachine: string;
  experience: number;
  status: 'active' | 'on-leave' | 'inactive';
}>) {
  await requireRole(['admin', 'manager']);
  await connectDB();
  const worker = await WorkerModel.findByIdAndUpdate(id, data, { new: true }).lean();
  revalidatePath('/dashboard/workers');
  return JSON.parse(JSON.stringify(worker));
}

export async function deleteWorker(id: string) {
  await requireRole(['admin']);
  await connectDB();
  await WorkerModel.findByIdAndDelete(id);
  revalidatePath('/dashboard/workers');
  return { success: true };
}
