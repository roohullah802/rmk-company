'use client';

import { useState, useEffect } from 'react';
import { getCmsSettings, updateCmsSettings } from '@/actions/cms';
import { Loader2, Save, BadgeCheck, ShieldAlert, Star, Plus, Trash2 } from 'lucide-react';

export default function DashboardSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [activeTab, setActiveTab] = useState<'stats' | 'about' | 'testimonials' | 'contact'>('stats');

  // Form states
  const [heroTagline, setHeroTagline] = useState('');
  const [aboutContent, setAboutContent] = useState('');
  const [stats, setStats] = useState({ excavators: '30+', projects: '20+', companies: '3+', experience: '10+' });
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [contact, setContact] = useState({ phone: '', email: '', address: '' });

  // Testimonial Modal/Add State
  const [tName, setTName] = useState('');
  const [tRole, setTRole] = useState('');
  const [tCompany, setTCompany] = useState('');
  const [tContent, setTContent] = useState('');
  const [tRating, setTRating] = useState(5);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await getCmsSettings();
      setHeroTagline(data.heroTagline || '');
      setAboutContent(data.aboutContent || '');
      setStats({
        excavators: data.homeStats?.excavators || '30+',
        projects: data.homeStats?.projects || '20+',
        companies: data.homeStats?.companies || '3+',
        experience: data.homeStats?.experience || '10+',
      });
      setTestimonials(data.testimonials || []);
      setContact({
        phone: data.contactInfo?.phone || '',
        email: data.contactInfo?.email || '',
        address: data.contactInfo?.address || '',
      });
    } catch {
      setError('Could not connect to CMS Settings database document.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setSuccess(false);
    setError('');

    const payload = {
      heroTagline,
      aboutContent,
      homeStats: stats,
      testimonials,
      contactInfo: contact,
    };

    try {
      await updateCmsSettings(payload);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Saving configuration parameters failed.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleAddTestimonial = () => {
    if (!tName || !tRole || !tCompany || !tContent) {
      alert('Fill all testimonial fields first.');
      return;
    }
    const newT = { name: tName, role: tRole, company: tCompany, content: tContent, rating: Number(tRating) };
    setTestimonials([...testimonials, newT]);
    setTName('');
    setTRole('');
    setTCompany('');
    setTContent('');
    setTRating(5);
  };

  const handleRemoveTestimonial = (idx: number) => {
    setTestimonials(testimonials.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Website CMS Panel</h1>
          <p className="text-sm text-zinc-500 mt-1">Configure layout, headers, statistics and reviews for the public website homepage.</p>
        </div>
      </div>

      {success && (
        <div className="p-4 bg-green-500/10 border border-green-500/25 text-green-400 text-xs rounded-lg flex gap-2 items-center">
          <BadgeCheck className="h-5 w-5 flex-shrink-0" />
          <span>CMS configuration saved and revalidated successfully.</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/25 text-red-400 text-xs rounded-lg flex gap-2 items-center">
          <ShieldAlert className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-zinc-800 gap-6">
        {[
          { label: 'Counters & Stats', value: 'stats' },
          { label: 'Hero & About Fleet', value: 'about' },
          { label: 'Testimonials', value: 'testimonials' },
          { label: 'Contact Coordinates', value: 'contact' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value as any)}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors relative cursor-pointer ${
              activeTab === tab.value ? 'text-brand-amber' : 'text-zinc-500 hover:text-white'
            }`}
          >
            {tab.label}
            {activeTab === tab.value && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-amber" />
            )}
          </button>
        ))}
      </div>

      {/* Forms */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 text-brand-amber animate-spin" />
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-8 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          {/* Tab 1: Stats */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider border-l-2 border-brand-amber pl-3">
                Home Stats Counters
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div>
                  <label className="label text-xs">Excavators Fleet Count</label>
                  <input
                    type="text"
                    required
                    value={stats.excavators}
                    onChange={(e) => setStats({ ...stats, excavators: e.target.value })}
                    className="input font-bold"
                  />
                </div>
                <div>
                  <label className="label text-xs">Completed Projects Count</label>
                  <input
                    type="text"
                    required
                    value={stats.projects}
                    onChange={(e) => setStats({ ...stats, projects: e.target.value })}
                    className="input font-bold"
                  />
                </div>
                <div>
                  <label className="label text-xs">Partner Companies Count</label>
                  <input
                    type="text"
                    required
                    value={stats.companies}
                    onChange={(e) => setStats({ ...stats, companies: e.target.value })}
                    className="input font-bold"
                  />
                </div>
                <div>
                  <label className="label text-xs">Years Experience Count</label>
                  <input
                    type="text"
                    required
                    value={stats.experience}
                    onChange={(e) => setStats({ ...stats, experience: e.target.value })}
                    className="input font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Hero & About */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider border-l-2 border-brand-amber pl-3">
                Hero Heading & Story
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="label text-xs">Hero Tagline / Heading Title</label>
                  <input
                    type="text"
                    required
                    value={heroTagline}
                    onChange={(e) => setHeroTagline(e.target.value)}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label text-xs">About Us Content Description</label>
                  <textarea
                    required
                    value={aboutContent}
                    onChange={(e) => setAboutContent(e.target.value)}
                    className="textarea h-36"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Testimonials */}
          {activeTab === 'testimonials' && (
            <div className="space-y-8">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider border-l-2 border-brand-amber pl-3">
                Testimonial Reviews Manager
              </h3>

              {/* Add testimonial panel */}
              <div className="bg-zinc-950/30 border border-zinc-850 p-5 rounded-xl space-y-4">
                <h4 className="text-xs font-bold text-white">Add Customer Review</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Name"
                      value={tName}
                      onChange={(e) => setTName(e.target.value)}
                      className="input text-xs"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Role (E.g., Site Engineer)"
                      value={tRole}
                      onChange={(e) => setTRole(e.target.value)}
                      className="input text-xs"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Company (E.g., DHA)"
                      value={tCompany}
                      onChange={(e) => setTCompany(e.target.value)}
                      className="input text-xs"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
                  <div className="sm:col-span-3">
                    <input
                      type="text"
                      placeholder="Testimonial review text..."
                      value={tContent}
                      onChange={(e) => setTContent(e.target.value)}
                      className="input text-xs"
                    />
                  </div>
                  <div>
                    <select
                      value={tRating}
                      onChange={(e) => setTRating(Number(e.target.value))}
                      className="input text-xs font-bold text-brand-amber"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                      <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                      <option value={3}>⭐⭐⭐ (3 Stars)</option>
                    </select>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAddTestimonial}
                  className="btn-secondary text-[11px] font-bold py-2 px-4 flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Review to Stack
                </button>
              </div>

              {/* List of active reviews */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-white border-b border-zinc-800 pb-2">Active Reviews on Home Page:</h4>
                {testimonials.length === 0 ? (
                  <p className="text-xs text-zinc-650 italic">No testimonials added yet. Add reviews using panel above.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {testimonials.map((t, idx) => (
                      <div key={idx} className="bg-zinc-950 p-4 border border-zinc-850 rounded-lg flex justify-between gap-4 items-start">
                        <div className="space-y-2">
                          <div className="flex gap-0.5">
                            {[...Array(t.rating || 5)].map((_, starIdx) => (
                              <Star key={starIdx} className="h-3 w-3 fill-brand-amber text-brand-amber" />
                            ))}
                          </div>
                          <p className="text-xs text-zinc-400 italic font-medium leading-relaxed">&ldquo;{t.content}&rdquo;</p>
                          <div className="text-[10px] text-zinc-500 font-bold">
                            {t.name} ({t.role}, {t.company})
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveTestimonial(idx)}
                          className="p-1.5 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-red-500 rounded-lg cursor-pointer flex-shrink-0"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 4: Contact */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider border-l-2 border-brand-amber pl-3">
                Operations Contact Coordinates
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="label text-xs">Hotline Phone</label>
                    <input
                      type="text"
                      required
                      value={contact.phone}
                      onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label text-xs">Email Address</label>
                    <input
                      type="email"
                      required
                      value={contact.email}
                      onChange={(e) => setContact({ ...contact, email: e.target.value })}
                      className="input"
                    />
                  </div>
                </div>
                <div>
                  <label className="label text-xs">Headquarters Address</label>
                  <input
                    type="text"
                    required
                    value={contact.address}
                    onChange={(e) => setContact({ ...contact, address: e.target.value })}
                    className="input"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Submit Save */}
          <div className="pt-6 border-t border-zinc-800 flex justify-end">
            <button
              type="submit"
              disabled={saveLoading}
              className="btn-primary flex items-center gap-2 px-8"
            >
              {saveLoading ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : <Save className="h-4.5 w-4.5 text-zinc-950" />}
              Save All Configuration
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
