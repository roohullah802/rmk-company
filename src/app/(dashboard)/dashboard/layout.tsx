import { auth } from '@clerk/nextjs/server';
import { getCurrentDBUser, syncClerkUser } from '@/lib/auth/helpers';
import { redirect } from 'next/navigation';
import { SignOutButton } from '@clerk/nextjs';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { Clock, LogOut, HardHat } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }

  let dbUser = await getCurrentDBUser();
  if (!dbUser) {
    dbUser = await syncClerkUser();
  }

  // If user is still not approved, render lock screen
  if (!dbUser || !dbUser.isApproved) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-hero grid-overlay p-4">
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-brand-amber" />
          
          <div className="flex justify-center gap-2 items-center">
            <div className="p-2 bg-brand-amber/10 rounded-lg text-brand-amber">
              <HardHat className="h-6 w-6 animate-bounce" />
            </div>
            <span className="text-xl font-black text-white">RMK Dashboard</span>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-brand-amber/5 rounded-full w-fit mx-auto border border-brand-amber/15 text-brand-amber">
              <Clock className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold text-white">Access Pending Approval</h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Your account <strong>({dbUser?.email})</strong> has been created. An administrator must approve your dashboard access before you can login.
            </p>
          </div>

          <div className="pt-4 border-t border-zinc-850">
            <SignOutButton>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer">
                <LogOut className="h-4 w-4" />
                Sign Out of Account
              </button>
            </SignOutButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-zinc-950 text-white">
      {/* Sidebar navigation */}
      <DashboardSidebar user={{ name: dbUser.name, email: dbUser.email, role: dbUser.role }} />
      
      {/* Main dashboard viewport */}
      <main className="flex-1 min-w-0 p-8 lg:p-12 overflow-y-auto max-h-screen">
        {children}
      </main>
    </div>
  );
}
