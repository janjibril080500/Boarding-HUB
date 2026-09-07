import React from 'react';
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  Phone,
  Mail,
  Calendar,
  BedDouble,
  User,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDate } from '../../utils/formatters';

export const TenantInquiriesView: React.FC = () => {
  const { applications, approveApplication, rejectApplication, rooms, addToast } = useApp();

  const handleApprove = (appId: string) => {
    approveApplication(appId, 'room-106', 'Bed A');
    addToast({
      title: 'Application Approved',
      message: 'Applicant has been assigned to Room 106 and invited to the portal.',
      type: 'success'
    });
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
            Tenant Inquiries & Bedspace Applications
            <span className="text-xs px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 font-bold font-mono">
              {applications.length} Applications
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Screen incoming student and professional inquiries, check employment/school IDs, and assign rooms.
          </p>
        </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {applications.map(app => (
          <div key={app.id} className="p-5 rounded-2xl bg-[#101F23] border border-white/[0.06] shadow-xl space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono font-bold text-teal-400 uppercase">
                  Applied for Room {app.targetRoomNumber || '106'} • Bedspace
                </span>
                <h3 className="text-base font-bold text-slate-100 mt-0.5">{app.applicantName}</h3>
                <p className="text-xs text-slate-400">{app.occupation}</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                {app.status}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#0B171B] border border-white/[0.04] space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Mobile Phone:</span>
                <span className="font-mono text-slate-200">{app.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Email Address:</span>
                <span className="text-slate-200">{app.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Target Move-in:</span>
                <span className="font-mono text-teal-300">{app.moveInTarget}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Notes from applicant:</span>
                <span className="text-slate-300 italic">"{app.notes || 'Looking for a quiet room with strong WiFi.'}"</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-white/[0.06]">
              <button
                onClick={() => rejectApplication(app.id)}
                className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-rose-500/10 text-slate-400 hover:text-rose-300 text-xs transition-colors"
              >
                Decline
              </button>
              <button
                onClick={() => handleApprove(app.id)}
                className="px-4 py-1.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-400 hover:opacity-90 shadow-md shadow-teal-500/20"
              >
                Approve & Assign Bed
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
