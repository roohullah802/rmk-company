'use client';

import { useState, useEffect } from 'react';
import { getProjects, createProject, updateProject, deleteProject } from '@/actions/projects';
import { getCompanies } from '@/actions/companies';
import { Plus, Edit, Trash2, X, Loader2, Sparkles, FolderOpen, MapPin, Calendar, Building2 } from 'lucide-react';

export default function DashboardProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [timeline, setTimeline] = useState('');
  const [status, setStatus] = useState<'planning' | 'ongoing' | 'completed'>('planning');
  const [companyId, setCompanyId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [projList, compList] = await Promise.all([getProjects(), getCompanies()]);
      setProjects(projList);
      setCompanies(compList);
    } catch {
      setError('Could not load projects and client companies database listings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openNewModal = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setLocation('');
    setTimeline('');
    setStatus('planning');
    setCompanyId('');
    setImageUrl('');
    setIsFeatured(false);
    setIsModalOpen(true);
  };

  const openEditModal = (p: any) => {
    setEditingId(p._id);
    setTitle(p.title);
    setDescription(p.description);
    setLocation(p.location);
    setTimeline(p.timeline);
    setStatus(p.status);
    setCompanyId(p.companyId?._id || p.companyId || '');
    setImageUrl(p.images?.[0] || '');
    setIsFeatured(p.isFeatured || false);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setError('');

    const payload = {
      title,
      description,
      location,
      timeline,
      status,
      companyId: companyId || undefined,
      images: imageUrl ? [imageUrl] : [],
      isFeatured,
    };

    try {
      if (editingId) {
        await updateProject(editingId, payload);
      } else {
        await createProject(payload);
      }
      setIsModalOpen(false);
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Operation failed. Verify credentials.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project record?')) return;
    setActionLoading(true);
    try {
      await deleteProject(id);
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Deletion failed. Check permissions.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Project Portfolios</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage public construction and excavation portfolio pieces.</p>
        </div>
        <button onClick={openNewModal} className="btn-primary text-xs font-bold px-4 py-2.5 flex items-center gap-2">
          <Plus className="h-4.5 w-4.5 text-zinc-950" />
          Create Project Record
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
      ) : projects.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900 border border-zinc-800 rounded-xl space-y-4">
          <FolderOpen className="h-10 w-10 text-zinc-650 mx-auto" />
          <p className="text-zinc-500 text-xs">No project entries available in database.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Project Title</th>
                <th>Location</th>
                <th>Associated Client</th>
                <th>Status</th>
                <th>Featured</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p._id}>
                  <td className="font-bold text-white">{p.title}</td>
                  <td className="flex items-center gap-1.5 text-zinc-400">
                    <MapPin className="h-3.5 w-3.5 text-brand-amber" />
                    {p.location}
                  </td>
                  <td>
                    {p.companyId?.name ? (
                      <span className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
                        <Building2 className="h-3.5 w-3.5 text-zinc-550" />
                        {p.companyId.name}
                      </span>
                    ) : (
                      <span className="text-xs text-zinc-600">—</span>
                    )}
                  </td>
                  <td>
                    <span className={`badge text-[9px] py-0.5 px-2 ${
                      p.status === 'completed' ? 'badge-green' : p.status === 'ongoing' ? 'badge-amber' : 'badge-blue'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td>
                    {p.isFeatured ? (
                      <span className="badge badge-amber text-[9px] py-0.5 px-1.5 flex items-center gap-1 w-fit">
                        <Sparkles className="h-3 w-3" />
                        Yes
                      </span>
                    ) : (
                      <span className="text-xs text-zinc-500">No</span>
                    )}
                  </td>
                  <td className="text-right">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 bg-zinc-900 border border-zinc-800 hover:border-brand-amber hover:text-brand-amber rounded-lg transition-colors text-zinc-400 cursor-pointer"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
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
              {editingId ? 'Edit Project Profile' : 'New Project Profile'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="label">Project Title</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., Karakoram Excavation"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Site Location</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., Lahore, Pakistan"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="label">Timeline / Schedule</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., Jan 2026 - May 2026"
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Client Company</label>
                  <select
                    value={companyId}
                    onChange={(e) => setCompanyId(e.target.value)}
                    className="input"
                  >
                    <option value="">Select Associated Company (Optional)</option>
                    {companies.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="label">Current Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="input"
                  >
                    <option value="planning">Planning</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="label">Media Image URL</label>
                  <input
                    type="url"
                    placeholder="Paste ImageKit URL link"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="label">Detailed Description</label>
                <textarea
                  required
                  placeholder="Summarize excavation operations and logistics scope..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="textarea h-24"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-800 text-brand-amber focus:ring-brand-amber/30 h-4 w-4"
                />
                <label htmlFor="featured" className="text-xs font-semibold text-zinc-300 select-none">
                  Highlight as Featured Project on Public Homepage
                </label>
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
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
