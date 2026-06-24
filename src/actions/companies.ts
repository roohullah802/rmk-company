'use server';

import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/db/mongodb';
import CompanyModel from '@/lib/models/Company';
import { requireRole } from '@/lib/auth/helpers';

export async function getCompanies() {
  await connectDB();
  const companies = await CompanyModel.find().sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(companies));
}

export async function createCompany(data: {
  name: string;
  description: string;
  logo: string;
  contact: string;
  email: string;
  website?: string;
}) {
  await requireRole(['admin', 'manager']);
  await connectDB();
  const company = await CompanyModel.create(data);
  revalidatePath('/dashboard/companies');
  return JSON.parse(JSON.stringify(company));
}

export async function updateCompany(id: string, data: Partial<{
  name: string;
  description: string;
  logo: string;
  contact: string;
  email: string;
  website: string;
}>) {
  await requireRole(['admin', 'manager']);
  await connectDB();
  const company = await CompanyModel.findByIdAndUpdate(id, data, { new: true }).lean();
  revalidatePath('/dashboard/companies');
  return JSON.parse(JSON.stringify(company));
}

export async function deleteCompany(id: string) {
  await requireRole(['admin']);
  await connectDB();
  await CompanyModel.findByIdAndDelete(id);
  revalidatePath('/dashboard/companies');
  return { success: true };
}
