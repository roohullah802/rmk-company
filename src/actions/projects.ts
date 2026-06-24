'use server';

import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/db/mongodb';
import ProjectModel from '@/lib/models/Project';
import { requireApprovedUser, requireRole } from '@/lib/auth/helpers';

export async function getProjects(filter?: { status?: string; location?: string }) {
  await connectDB();
  const query: Record<string, unknown> = {};
  if (filter?.status) query.status = filter.status;
  if (filter?.location) query.location = new RegExp(filter.location, 'i');
  const projects = await ProjectModel.find(query).sort({ createdAt: -1 }).populate('companyId').lean();
  return JSON.parse(JSON.stringify(projects));
}

export async function getFeaturedProjects() {
  await connectDB();
  const projects = await ProjectModel.find({ isFeatured: true }).limit(6).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(projects));
}

export async function getProjectById(id: string) {
  await connectDB();
  const project = await ProjectModel.findById(id).populate('companyId').lean();
  return JSON.parse(JSON.stringify(project));
}

export async function createProject(data: {
  title: string;
  description: string;
  location: string;
  timeline: string;
  status: 'planning' | 'ongoing' | 'completed';
  images: string[];
  companyId?: string;
  isFeatured?: boolean;
}) {
  await requireRole(['admin', 'manager']);
  await connectDB();
  const project = await ProjectModel.create(data);
  revalidatePath('/projects');
  revalidatePath('/dashboard/projects');
  return JSON.parse(JSON.stringify(project));
}

export async function updateProject(id: string, data: Partial<{
  title: string;
  description: string;
  location: string;
  timeline: string;
  status: 'planning' | 'ongoing' | 'completed';
  images: string[];
  companyId: string;
  isFeatured: boolean;
}>) {
  await requireRole(['admin', 'manager']);
  await connectDB();
  const project = await ProjectModel.findByIdAndUpdate(id, data, { new: true }).lean();
  revalidatePath('/projects');
  revalidatePath(`/projects/${id}`);
  revalidatePath('/dashboard/projects');
  return JSON.parse(JSON.stringify(project));
}

export async function deleteProject(id: string) {
  await requireRole(['admin']);
  await connectDB();
  await ProjectModel.findByIdAndDelete(id);
  revalidatePath('/projects');
  revalidatePath('/dashboard/projects');
  return { success: true };
}
