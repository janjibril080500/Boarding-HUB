import React, { useState } from 'react';
import {
  Megaphone,
  Plus,
  Trash2,
  Calendar,
  Send,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Bell
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDate } from '../../utils/formatters';

export const AnnouncementsView: React.FC = () => {
  const { announcements, createAnnouncement, deleteAnnouncement, addToast } = useApp();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'GENERAL' | 'MAINTENANCE' | 'RULES' | 'EMERGENCY'>('GENERAL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    createAnnouncement({
      title,
      content,
      category,
      author: 'Jan Dela Cruz (Owner)'
    });

    addToast({
      title: 'Announcement Published',
      message: `"${title}" has been broadcast to all active residents.`,
      type: 'success'
    });

    setTitle('');
    setContent('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
            Announcements & Bulletins
            <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold font-mono">
              {announcements.length} Active Notices
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Broadcast emergency alerts, scheduled power/water interruptions, curfew policies, and boarding house rules.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-400 hover:opacity-90 shadow-md shadow-teal-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Broadcast Notice
        </button>
      </div>

      {/* Grid of Announcements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {announcements.map(ann => (
          <div key={ann.id} className="p-5 rounded-2xl bg-[#101F23] border border-white/[0.06] shadow-xl flex flex-col justify-between space-y-4 hover:border-teal-500/30 transition-all">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-teal-500/15 text-teal-300 border border-teal-500/30">
                  {ann.category}
                </span>
                <span className="text-xs text-slate-400 font-mono">{formatDate(ann.date)}</span>
              </div>

              <h3 className="text-base font-bold text-slate-100">{ann.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{ann.content}</p>
            </div>

            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">Posted by {ann.author || 'Property Admin'}</span>
              <button
                onClick={() => deleteAnnouncement(ann.id)}
                className="text-slate-400 hover:text-rose-400 p-1 rounded transition-colors"
                title="Delete announcement"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-100">
          <div className="w-full max-w-md rounded-2xl bg-[#0B171B] border border-teal-500/30 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-teal-400" />
              Post Boarding House Notice
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Notice Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Davao Light Scheduled Interruption Saturday"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#101F23] border border-white/[0.08] text-slate-100 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-[#101F23] border border-white/[0.08] text-slate-100 focus:border-teal-500 focus:outline-none"
                >
                  <option value="GENERAL">General Notice</option>
                  <option value="MAINTENANCE">Scheduled Maintenance & Repairs</option>
                  <option value="RULES">House Rules & Curfew Policy</option>
                  <option value="EMERGENCY">Urgent / Emergency Alert</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Content / Details *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="State the schedule, rules, or actions required from tenants..."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#101F23] border border-white/[0.08] text-slate-100 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.06] text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-400 hover:opacity-90 shadow-md shadow-teal-500/20"
                >
                  Dispatch to Tenants
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
