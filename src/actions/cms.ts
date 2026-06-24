'use server';

import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/db/mongodb';
import CmsSettingsModel from '@/lib/models/CmsSettings';
import { requireRole } from '@/lib/auth/helpers';

export async function getCmsSettings() {
  await connectDB();
  let settings = await CmsSettingsModel.findOne().lean();
  if (!settings) {
    settings = await CmsSettingsModel.create({});
  }
  return JSON.parse(JSON.stringify(settings));
}

export async function updateCmsSettings(data: Partial<{
  homeStats: { excavators: string; projects: string; companies: string; experience: string };
  aboutContent: string;
  heroTagline: string;
  testimonials: Array<{ name: string; role: string; company: string; content: string; rating: number }>;
  contactInfo: { phone: string; email: string; address: string };
}>) {
  await requireRole(['admin']);
  await connectDB();
  const settings = await CmsSettingsModel.findOneAndUpdate(
    {},
    { $set: data },
    { upsert: true, returnDocument: 'after' }
  ).lean();
  revalidatePath('/');
  revalidatePath('/about');
  revalidatePath('/contact');
  revalidatePath('/dashboard/settings');
  return JSON.parse(JSON.stringify(settings));
}
