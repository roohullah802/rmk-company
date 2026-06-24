'use client';

import { useState, useEffect } from 'react';
import { getCompanies, createCompany, updateCompany, deleteCompany } from '@/actions/companies';
import { Plus, Edit, Trash2, X, Loader2, Building, Mail, Phone, Globe, FolderSync } from 'lucide-react';
import Image from 'next/image';

export default function DashboardCompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');

  const loadCompanies = async () => {
    setLoading(true);
    try {
      const data = await getCompanies();
      setCompanies(data);
    } catch {
      setError('Could not connect to companies database collection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const openNewModal = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setLogo('');
    setContact('');
    setEmail('');
    setWebsite('');
    setIsModalOpen(true);
  };

  const openEditModal = (c: any) => {
    setEditingId(c._id);
    setName(c.name);
    setDescription(c.description);
    setLogo(c.logo || '');
    setContact(c.contact);
    setEmail(c.email);
    setWebsite(c.website || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setError('');

    const payload = {
      name,
      description,
      logo,
      contact,
      email,
      website: website || undefined,
    };

    try {
      if (editingId) {
        await updateCompany(editingId, payload);
      } else {
        await createCompany(payload);
      }
      setIsModalOpen(false);
      await loadCompanies();
    } catch (err: any) {
      setError(err.message || 'Operation failed. Check permissions.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this company? Any linked project profile will lose its client connection.')) return;
    setActionLoading(true);
    try {
      await deleteCompany(id);
      await loadCompanies();
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
          <h1 className="text-2xl sm:text-3xl font-black text-white">Partner Companies</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage clients, developers, and partner corporations for project associations.</p>
        </div>
        <button onClick={openNewModal} className="btn-primary text-xs font-bold px-4 py-2.5 flex items-center gap-2">
          <Plus className="h-4.5 w-4.5 text-zinc-950" />
          Add Client Company
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
      ) : companies.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900 border border-zinc-800 rounded-xl space-y-4">
          <Building className="h-10 w-10 text-zinc-650 mx-auto" />
          <p className="text-zinc-500 text-xs">No client companies registered.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {companies.map((c) => (
            <div key={c._id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col justify-between h-full relative overflow-hidden group hover:border-brand-amber/30 transition-all">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-zinc-850 group-hover:bg-brand-amber transition-colors" />
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-brand-amber font-extrabold text-lg overflow-hidden relative">
                    {c.logo ? (
                      <Image src={c.logo} alt={c.name} fill className="object-cover" />
                    ) : (
                      c.name[0].toUpperCase()
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-white leading-snug">{c.name}</h3>
                    {c.website ? (
                      <a href={c.website} target="_blank" rel="noreferrer" className="text-[10px] text-brand-amber hover:underline flex items-center gap-1 mt-0.5">
                        <Globe className="h-3 w-3" />
                        {c.website.replace(/(^\w+:|^)\/\//, '')}
                      </a>
                    ) : (
                      <span className="text-[10px] text-zinc-500">No Web Link</span>
                    )}
                  </div>
                </div>

                <p className="text-zinc-400 text-xs leading-relaxed line-clamp-3">
                  {c.description}
                </p>

                <div className="pt-4 border-t border-zinc-850 space-y-2 text-xs text-zinc-500">
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-brand-amber" />
                    <span>{c.contact}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-brand-amber" />
                    <span className="truncate">{c.email}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-6 mt-6 border-t border-zinc-850 justify-end">
                <button
                  onClick={() => openEditModal(c)}
                  className="px-3 py-1.5 bg-zinc-950 border border-zinc-800 hover:border-brand-amber hover:text-brand-amber rounded-lg text-xs font-semibold text-zinc-400 transition-colors cursor-pointer"
                >
                  Edit Details
                </button>
                <button
                  onClick={() => handleDelete(c._id)}
                  disabled={actionLoading}
                  className="p-2 bg-zinc-950 border border-zinc-800 hover:border-red-500 hover:text-red-500 rounded-lg text-zinc-400 transition-colors cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
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
              {editingId ? 'Edit Partner Company' : 'New Partner Company'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="label">Company Name</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., DHA Lahore"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Logo Image URL</label>
                  <input
                    type="url"
                    placeholder="Paste ImageKit URL logo link"
                    value={logo}
                    onChange={(e) => setLogo(e.target.value)}
                    className="input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="label">Contact Phone</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., +92 42 111-222-333"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="E.g., contracting@company.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="label">Company Website URL</label>
                <input
                  type="url"
                  placeholder="E.g., https://company.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="input"
                />
              </div>

              <div>
                <label className="label">Brief Description / Partnership Details</label>
                <textarea
                  required
                  placeholder="Outline client operations, developer profile, or contract scope..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="textarea h-24"
                />
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
                  Save Company
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
