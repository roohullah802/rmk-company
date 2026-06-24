'use client';

import { useState, useEffect } from 'react';
import { getUsers, updateUserApproval, updateUserRole, deleteUser } from '@/actions/users';
import { useUser } from '@clerk/nextjs';
import { Users, Loader2, Check, ShieldAlert, Award, UserMinus } from 'lucide-react';

export default function DashboardUsersPage() {
  const { user: currentClerkUser } = useUser();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch {
      setError('Access Denied. Admin permissions required.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleApprovalToggle = async (id: string, isApproved: boolean) => {
    setActionLoading(true);
    try {
      await updateUserApproval(id, isApproved);
      await loadUsers();
    } catch (err: any) {
      setError(err.message || 'Approval state change failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRoleChange = async (id: string, role: 'admin' | 'manager' | 'viewer') => {
    setActionLoading(true);
    try {
      await updateUserRole(id, role);
      await loadUsers();
    } catch (err: any) {
      setError(err.message || 'Role change failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this user from the system database?')) return;
    setActionLoading(true);
    try {
      await deleteUser(id);
      await loadUsers();
    } catch (err: any) {
      setError(err.message || 'Deletion failed.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">System Users</h1>
          <p className="text-sm text-zinc-500 mt-1">Approve registered Clerk users and assign roles (RBAC).</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/25 text-red-400 text-xs rounded-lg flex gap-2 items-center">
          <ShieldAlert className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 text-brand-amber animate-spin" />
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900 border border-zinc-800 rounded-xl space-y-4">
          <Users className="h-10 w-10 text-zinc-650 mx-auto" />
          <p className="text-zinc-500 text-xs">No registered system users.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Profile Details</th>
                <th>Joined Date</th>
                <th>Access Level / Role</th>
                <th>Approved Access</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isSelf = currentClerkUser?.id === u.clerkId;
                return (
                  <tr key={u._id} className={isSelf ? 'bg-brand-amber/5' : ''}>
                    <td className="font-bold text-white">
                      <div className="flex items-center gap-2">
                        {u.name}
                        {isSelf && (
                          <span className="text-[10px] bg-brand-amber/20 text-brand-amber border border-brand-amber/35 px-1.5 py-0.5 rounded font-black">
                            Self
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-zinc-500 font-semibold">{u.email}</div>
                    </td>
                    <td className="text-zinc-500 text-xs">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <select
                        disabled={isSelf || actionLoading}
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value as any)}
                        className="bg-zinc-900 border border-zinc-800 text-xs text-white rounded px-2.5 py-1.5 focus:border-brand-amber outline-none disabled:opacity-50"
                      >
                        <option value="viewer">Viewer (Read-only)</option>
                        <option value="manager">Manager (CRUD)</option>
                        <option value="admin">Administrator (Full)</option>
                      </select>
                    </td>
                    <td>
                      <div className="flex items-center">
                        <button
                          disabled={isSelf || actionLoading}
                          onClick={() => handleApprovalToggle(u._id, !u.isApproved)}
                          className={`w-10 h-6 rounded-full p-1 transition-colors duration-200 cursor-pointer ${
                            u.isApproved ? 'bg-green-600' : 'bg-zinc-800'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                              u.isApproved ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </td>
                    <td className="text-right">
                      <button
                        disabled={isSelf || actionLoading}
                        onClick={() => handleDelete(u._id)}
                        className="p-1.5 bg-zinc-900 border border-zinc-800 hover:border-red-500 hover:text-red-500 rounded-lg text-zinc-400 transition-all disabled:opacity-40 disabled:hover:border-zinc-800 disabled:hover:text-zinc-400 cursor-pointer"
                      >
                        <UserMinus className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
