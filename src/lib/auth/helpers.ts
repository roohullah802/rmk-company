import { auth, currentUser } from '@clerk/nextjs/server';
import connectDB from '@/lib/db/mongodb';
import UserModel from '@/lib/models/User';

export type UserRole = 'admin' | 'manager' | 'viewer';

export interface DBUser {
  _id: string;
  clerkId: string;
  email: string;
  name: string;
  role: UserRole;
  isApproved: boolean;
  createdAt: Date;
}

export async function getCurrentDBUser(): Promise<DBUser | null> {
  const { userId } = await auth();
  if (!userId) return null;

  await connectDB();
  const user = await UserModel.findOne({ clerkId: userId }).lean();
  return user as DBUser | null;
}

export async function requireApprovedUser(): Promise<DBUser> {
  const user = await getCurrentDBUser();
  if (!user || !user.isApproved) {
    throw new Error('Access denied: User not approved');
  }
  return user;
}

export async function requireRole(roles: UserRole[]): Promise<DBUser> {
  const user = await requireApprovedUser();
  if (!roles.includes(user.role)) {
    throw new Error(`Access denied: Requires one of roles: ${roles.join(', ')}`);
  }
  return user;
}

export async function syncClerkUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  await connectDB();

  const existingUsers = await UserModel.countDocuments();
  const isFirstUser = existingUsers === 0;

  const email = clerkUser.emailAddresses[0]?.emailAddress || '';
  
  const user = await UserModel.findOneAndUpdate(
    { $or: [{ clerkId: clerkUser.id }, { email }] },
    {
      $set: {
        clerkId: clerkUser.id,
        email,
        name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
      },
      $setOnInsert: {
        role: isFirstUser ? 'admin' : 'viewer',
        isApproved: isFirstUser,
      },
    },
    { upsert: true, returnDocument: 'after' }
  ).lean();

  return user as any as DBUser;
}
