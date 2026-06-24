'use client';

import { useState, useEffect } from 'react';
import { getWorkers, createWorker, updateWorker, deleteWorker } from '@/actions/workers';
import { Plus, Edit, Trash2, X, Loader2, ShieldAlert, BadgeInfo, Star } from 'lucide-react';

export default function DashboardWorkersPage() {
  const [workers, setWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [cnic, setCnic] = useState('');
  const [drivingLicense, setDrivingLicense] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [assignedMachine, setAssignedMachine] = useState('');
  const [experience, setExperience] = useState<number>(0);
  const [status, setStatus] = useState<'active' | 'on-leave' | 'inactive'>('active');

  const loadWorkers = async () => {
    setLoading(true);
    try {
      const data = await getWorkers();
      setWorkers(data);
    } catch {
      setError('Access Denied or Database connection error.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkers();
  }, []);

  const openNewModal = () => {
    setEditingId(null);
    setName('');
    setCnic('');
    setDrivingLicense('');
    setContact('');
    setEmail('');
    setAssignedMachine('');
    setExperience(0);
    setStatus('active');
    setIsModalOpen(true);
  };

  const openEditModal = (w: any) => {
    setEditingId(w._id);
    setName(w.name);
    setCnic(w.cnic);
    setDrivingLicense(w.drivingLicense);
    setContact(w.contact);
    setEmail(w.email);
    setAssignedMachine(w.assignedMachine);
    setExperience(w.experience);
    setStatus(w.status);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setError('');

    const payload = {
      name,
      cnic,
      drivingLicense,
      contact,
      email,
      assignedMachine,
      experience: Number(experience),
    };

    try {
      if (editingId) {
        await updateWorker(editingId, { ...payload, status });
      } else {
        await createWorker(payload);
      }
      setIsModalOpen(false);
      await loadWorkers();
    } catch (err: any) {
      setError(err.message || 'Operation failed. Verify requirements.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this worker record? This action is irreversible.')) return;
    setActionLoading(true);
    try {
      await deleteWorker(id);
      await loadWorkers();
    } catch (err: any) {
      setError(err.message || 'Deletion failed. Check permissions.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Privacy Notice Banner */}
      <div className="p-4 bg-brand-orange/5 border border-brand-orange/15 rounded-xl flex gap-3 items-start">
        <ShieldAlert className="h-5 w-5 text-brand-orange flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Private & Protected Records</h4>
          <p className="text-zinc-400 text-xs leading-relaxed">
            Worker files, CNIC numbers, driving licenses, and contact lists are strictly confidential and encrypted in transit. This database is NEVER exposed to the public domain.
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Workforce & Operators</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage excavator operators and mechanical support staff.</p>
        </div>
        <button onClick={openNewModal} className="btn-primary text-xs font-bold px-4 py-2.5 flex items-center gap-2">
          <Plus className="h-4.5 w-4.5 text-zinc-950" />
          Add Worker Record
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/25 text-red-400 text-xs rounded-lg">
          {error}
        </div>
      )}

      {/* Grid List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 text-brand-amber animate-spin" />
        </div>
      ) : workers.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900 border border-zinc-800 rounded-xl space-y-4">
          <BadgeInfo className="h-10 w-10 text-zinc-650 mx-auto" />
          <p className="text-zinc-500 text-xs">No worker records currently exist.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Operator Name</th>
                <th>CNIC Number</th>
                <th>Assigned Machine</th>
                <th>Contact</th>
                <th>Experience</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {workers.map((w) => (
                <tr key={w._id}>
                  <td className="font-bold text-white">
                    <div>{w.name}</div>
                    <div className="text-[10px] text-zinc-500 font-semibold">{w.email}</div>
                  </td>
                  <td className="text-zinc-400 font-mono text-xs">{w.cnic}</td>
                  <td className="font-semibold text-brand-amber text-xs">{w.assignedMachine}</td>
                  <td className="text-zinc-450">{w.contact}</td>
                  <td>
                    <span className="flex items-center gap-1 text-zinc-450 text-xs">
                      <Star className="h-3.5 w-3.5 fill-brand-amber text-brand-amber" />
                      {w.experience} Years
                    </span>
                  </td>
                  <td>
                    <span className={`badge text-[9px] py-0.5 px-2 ${
                      w.status === 'active' ? 'badge-green' : w.status === 'on-leave' ? 'badge-amber' : 'badge-gray'
                    }`}>
                      {w.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => openEditModal(w)}
                        className="p-1.5 bg-zinc-900 border border-zinc-800 hover:border-brand-amber hover:text-brand-amber rounded-lg transition-colors text-zinc-400 cursor-pointer"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(w._id)}
                        disabled={actionLoading}
                        className="p-1.5 bg-zinc-900 border border-zinc-800 hover:border-red-500 hover:text-red-500 rounded-lg transition-colors text-zinc-400 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold text-white">
              {editingId ? 'Edit Operator File' : 'New Operator File'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="label">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., Ali Akbar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">CNIC Number</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., 35201-xxxxxxx-x"
                    value={cnic}
                    onChange={(e) => setCnic(e.target.value)}
                    className="input font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="label">Driving License Number</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., LHR-12345-HMV"
                    value={drivingLicense}
                    onChange={(e) => setDrivingLicense(e.target.value)}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Contact Number</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., +92 321 1234567"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="label">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="E.g., operator@rmk.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Assigned Excavator/Machine</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., Komatsu PC300 (Fleet #04)"
                    value={assignedMachine}
                    onChange={(e) => setAssignedMachine(e.target.value)}
                    className="input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="label">Experience (Years)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={experience}
                    onChange={(e) => setExperience(Number(e.target.value))}
                    className="input"
                  />
                </div>
                {editingId && (
                  <div>
                    <label className="label">Work Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="input"
                    >
                      <option value="active">Active Duty</option>
                      <option value="on-leave">On Leave</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-zinc-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="btn-primary flex items-center gap-2 px-6"
                >
                  {actionLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Save Operator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
