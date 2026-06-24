'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignOutButton } from '@clerk/nextjs';
import {
  LayoutDashboard,
  FolderOpen,
  HardHat,
  Building2,
  MessageSquare,
  Settings,
  Users,
  LogOut,
  ChevronRight
} from 'lucide-react';

interface DashboardSidebarProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
}

export default function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname();

  const links = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'manager', 'viewer'] },
    { name: 'Projects', href: '/dashboard/projects', icon: FolderOpen, roles: ['admin', 'manager', 'viewer'] },
    { name: 'Workers', href: '/dashboard/workers', icon: HardHat, roles: ['admin', 'manager'] },
    { name: 'Companies', href: '/dashboard/companies', icon: Building2, roles: ['admin', 'manager', 'viewer'] },
    { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare, roles: ['admin', 'manager'] },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings, roles: ['admin'] },
    { name: 'Users', href: '/dashboard/users', icon: Users, roles: ['admin'] },
  ];

  return (
    <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col justify-between h-screen sticky top-0 flex-shrink-0">
      {/* Top Section */}
      <div className="flex flex-col flex-1 min-h-0">
        {/* Brand Logo */}
        <div className="h-20 border-b border-zinc-800 flex items-center px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-brand-amber to-brand-orange rounded-lg">
              <HardHat className="h-5 w-5 text-zinc-950" />
            </div>
            <span className="text-xl font-black text-white">RMK Dashboard</span>
          </Link>
        </div>

        {/* User Card */}
        <div className="p-5 border-b border-zinc-800 bg-zinc-950/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-amber/15 border border-brand-amber/30 flex items-center justify-center font-bold text-brand-amber">
              {user.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-white truncate leading-tight">{user.name}</h4>
              <p className="text-xs text-zinc-500 truncate mt-0.5">{user.email}</p>
            </div>
          </div>
          <div className="mt-3 flex">
            <span className={`badge text-[10px] py-0.5 px-2 ${
              user.role === 'admin' 
                ? 'badge-amber' 
                : user.role === 'manager' 
                ? 'badge-blue' 
                : 'badge-gray'
            }`}>
              {user.role}
            </span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
          {links
            .filter((link) => link.roles.includes(user.role))
            .map((link) => {
              const Icon = link.icon;
              // Handles exact active state or subpath active state
              const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));
              
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`sidebar-link ${isActive ? 'active' : ''}`}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="flex-grow text-xs">{link.name}</span>
                  {isActive && <ChevronRight className="h-3 w-3 text-brand-amber" />}
                </Link>
              );
            })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-950/20">
        <SignOutButton>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/5 text-sm font-medium transition-all cursor-pointer border border-transparent hover:border-red-500/10">
            <LogOut className="h-4 w-4" />
            <span className="text-xs">Sign Out</span>
          </button>
        </SignOutButton>
      </div>
    </aside>
  );
}
