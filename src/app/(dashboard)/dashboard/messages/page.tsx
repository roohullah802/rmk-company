'use client';

import { useState, useEffect } from 'react';
import { getMessages, updateMessageStatus, deleteMessage } from '@/actions/messages';
import { MessageSquare, Calendar, Mail, CheckCircle, Reply, Trash2, Loader2, ChevronDown, ChevronUp } from 'lucide-react';

export default function DashboardMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Filtering & expanding state
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'read' | 'replied'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const data = await getMessages();
      setMessages(data);
    } catch {
      setError('Could not retrieve contact submissions database records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleStatusChange = async (id: string, status: 'read' | 'replied') => {
    setActionLoading(true);
    try {
      await updateMessageStatus(id, status);
      await loadMessages();
    } catch (err: any) {
      setError(err.message || 'Status update failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this message?')) return;
    setActionLoading(true);
    try {
      await deleteMessage(id);
      await loadMessages();
    } catch (err: any) {
      setError(err.message || 'Deletion failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredMessages = messages.filter((m) => {
    if (activeTab === 'all') return true;
    return m.status === activeTab;
  });

  const unreadCount = messages.filter((m) => m.status === 'unread').length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Inquiries Inbox</h1>
          <p className="text-sm text-zinc-500 mt-1">Review contact requests and equipment quotes submitted via public website form.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/25 text-red-400 text-xs rounded-lg">
          {error}
        </div>
      )}

      {/* Tabs Menu */}
      <div className="flex border-b border-zinc-800 gap-6">
        {(['all', 'unread', 'read', 'replied'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setExpandedId(null);
            }}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors relative cursor-pointer ${
              activeTab === tab ? 'text-brand-amber' : 'text-zinc-500 hover:text-white'
            }`}
          >
            {tab}
            {tab === 'unread' && unreadCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-brand-orange text-white rounded-full font-black">
                {unreadCount}
              </span>
            )}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-amber" />
            )}
          </button>
        ))}
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 text-brand-amber animate-spin" />
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900 border border-zinc-800 rounded-xl space-y-4">
          <MessageSquare className="h-10 w-10 text-zinc-650 mx-auto" />
          <p className="text-zinc-500 text-xs">No inquiries in this tab.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMessages.map((m) => {
            const isExpanded = expandedId === m._id;
            return (
              <div
                key={m._id}
                className={`bg-zinc-900 border rounded-xl overflow-hidden transition-all ${
                  isExpanded ? 'border-brand-amber/40 shadow-xl' : 'border-zinc-850 hover:border-zinc-800'
                }`}
              >
                {/* Header Summary Row */}
                <div
                  onClick={() => toggleExpand(m._id)}
                  className="p-5 flex items-center justify-between gap-6 cursor-pointer select-none hover:bg-zinc-950/20 transition-colors"
                >
                  <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">{m.name}</h4>
                      <p className="text-[10px] text-zinc-500 truncate font-semibold mt-0.5">{m.email}</p>
                    </div>
                    <div className="md:col-span-2 min-w-0">
                      <p className="text-xs font-semibold text-brand-amber truncate">{m.subject}</p>
                      <p className="text-xs text-zinc-400 truncate mt-0.5">{m.message}</p>
                    </div>
                    <div className="text-[10px] text-zinc-550 font-medium flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(m.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`badge text-[9px] py-0.5 px-2 ${
                      m.status === 'unread' ? 'badge-amber' : m.status === 'read' ? 'badge-blue' : 'badge-green'
                    }`}>
                      {m.status}
                    </span>
                    {isExpanded ? <ChevronUp className="h-4 w-4 text-zinc-450" /> : <ChevronDown className="h-4 w-4 text-zinc-450" />}
                  </div>
                </div>

                {/* Expanded Details Panel */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-zinc-850 bg-zinc-950/30 space-y-6">
                    <div className="space-y-3 pt-3">
                      <h5 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Message Content:</h5>
                      <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-900 border border-zinc-850 p-4 rounded-lg whitespace-pre-wrap">
                        {m.message}
                      </p>
                    </div>

                    {/* Actions Panel */}
                    <div className="flex flex-wrap gap-2 justify-between items-center border-t border-zinc-850 pt-4 mt-4">
                      <div className="flex gap-2">
                        {m.status === 'unread' && (
                          <button
                            onClick={() => handleStatusChange(m._id, 'read')}
                            disabled={actionLoading}
                            className="btn-secondary text-[11px] font-bold px-3 py-1.5 flex items-center gap-1.5"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Mark as Read
                          </button>
                        )}
                        {m.status !== 'replied' && (
                          <button
                            onClick={() => handleStatusChange(m._id, 'replied')}
                            disabled={actionLoading}
                            className="btn-primary text-[11px] font-bold px-3 py-1.5 flex items-center gap-1.5"
                          >
                            <Reply className="h-4 w-4 text-zinc-950" />
                            Mark as Replied
                          </button>
                        )}
                        <a
                          href={`mailto:${m.email}?subject=RE: ${m.subject}`}
                          className="btn-ghost text-[11px] font-semibold flex items-center gap-1.5"
                        >
                          <Mail className="h-4 w-4" />
                          Reply via Email Client
                        </a>
                      </div>

                      <button
                        onClick={() => handleDelete(m._id)}
                        disabled={actionLoading}
                        className="p-2 bg-zinc-900 border border-zinc-800 hover:border-red-500 hover:text-red-500 rounded-lg text-zinc-400 transition-all cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
