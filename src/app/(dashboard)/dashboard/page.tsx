import { getCurrentDBUser } from '@/lib/auth/helpers';
import connectDB from '@/lib/db/mongodb';
import ProjectModel from '@/lib/models/Project';
import WorkerModel from '@/lib/models/Worker';
import CompanyModel from '@/lib/models/Company';
import MessageModel from '@/lib/models/Message';
import { Truck, FolderOpen, Building2, MessageSquare, Plus, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const user = await getCurrentDBUser();
  
  await connectDB();

  let stats = { projects: 0, workers: 0, companies: 0, messages: 0 };
  let recentProjects: any[] = [];
  let recentMessages: any[] = [];

  try {
    const [projectCount, workerCount, companyCount, messageCount] = await Promise.all([
      ProjectModel.countDocuments(),
      WorkerModel.countDocuments(),
      CompanyModel.countDocuments(),
      MessageModel.countDocuments({ status: 'unread' }),
    ]);

    stats = {
      projects: projectCount,
      workers: workerCount,
      companies: companyCount,
      messages: messageCount,
    };

    recentProjects = await ProjectModel.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('companyId')
      .lean();

    recentMessages = await MessageModel.find({ status: 'unread' })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
  } catch (err) {
    console.error('Error fetching dashboard database statistics:', err);
  }

  const statCards = [
    { label: 'Total Projects', value: stats.projects, icon: FolderOpen, color: 'text-blue-500 bg-blue-500/10 border-blue-500/25', link: '/dashboard/projects' },
    { label: 'Private Workforce', value: stats.workers, icon: Truck, color: 'text-green-500 bg-green-500/10 border-green-500/25', link: '/dashboard/workers', requiresPrivilege: true },
    { label: 'Registered Clients', value: stats.companies, icon: Building2, color: 'text-amber-500 bg-brand-amber/10 border-brand-amber/25', link: '/dashboard/companies' },
    { label: 'Unread Messages', value: stats.messages, icon: MessageSquare, color: 'text-orange-500 bg-brand-orange/10 border-brand-orange/25', link: '/dashboard/messages', requiresPrivilege: true },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Welcome, {user?.name}</h1>
          <p className="text-sm text-zinc-500 mt-1">Here is a snapshot of RMK operations and site logistics.</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard/projects"
            className="btn-primary text-xs font-bold px-4 py-2.5 flex items-center gap-2"
          >
            <Plus className="h-4 w-4 text-zinc-950" />
            New Project Record
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          // Hide workers and messages tabs from viewer roles
          if (card.requiresPrivilege && user?.role === 'viewer') return null;
          
          return (
            <Link
              key={idx}
              href={card.link}
              className={`p-6 bg-zinc-900 border rounded-xl flex items-center justify-between transition-all hover:scale-[1.02] hover:border-brand-amber/40 ${card.color}`}
            >
              <div className="space-y-2">
                <span className="text-2xl sm:text-3xl font-black text-white">{card.value}</span>
                <p className="text-xs text-zinc-400 font-semibold">{card.label}</p>
              </div>
              <div className="p-3 bg-zinc-950 rounded-xl">
                <Icon className="h-5 w-5" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Grid Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Projects (Col-Span 7) */}
        <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-zinc-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FolderOpen className="h-4.5 w-4.5 text-brand-amber" />
              Recent Infrastructure Projects
            </h3>
            <Link href="/dashboard/projects" className="text-xs font-semibold text-brand-amber hover:text-brand-amber-light flex items-center gap-1">
              Manage <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {recentProjects.length === 0 ? (
            <div className="text-center py-10 text-zinc-500 text-xs">No project records found.</div>
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Location</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentProjects.map((p: any) => (
                    <tr key={p._id}>
                      <td className="font-semibold text-white max-w-[200px] truncate">{p.title}</td>
                      <td>{p.location}</td>
                      <td>
                        <span className={`badge text-[9px] py-0.5 px-1.5 ${
                          p.status === 'completed' ? 'badge-green' : 'badge-amber'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Messages (Col-Span 5) */}
        {user?.role !== 'viewer' && (
          <div className="lg:col-span-5 bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-zinc-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MessageSquare className="h-4.5 w-4.5 text-brand-amber" />
                Unread Client Inquiries
              </h3>
              <Link href="/dashboard/messages" className="text-xs font-semibold text-brand-amber hover:text-brand-amber-light flex items-center gap-1">
                Inbox <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {recentMessages.length === 0 ? (
              <div className="text-center py-10 text-zinc-500 text-xs">No unread messages.</div>
            ) : (
              <div className="space-y-4">
                {recentMessages.map((m: any) => (
                  <div key={m._id} className="p-4 bg-zinc-950 border border-zinc-850 rounded-lg space-y-2">
                    <div className="flex justify-between items-start gap-4">
                      <h4 className="text-xs font-bold text-white truncate">{m.name}</h4>
                      <span className="text-[10px] text-zinc-500 flex items-center gap-1 whitespace-nowrap">
                        <Clock className="h-3 w-3" />
                        {new Date(m.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-[11px] font-semibold text-brand-amber truncate">{m.subject}</p>
                    <p className="text-xs text-zinc-400 line-clamp-1 leading-relaxed">{m.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
