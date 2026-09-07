import React, { useState } from 'react';
import {
  Wrench,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Plus,
  User,
  DollarSign,
  FileImage,
  Sparkles,
  X,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MaintenanceRequest, MaintenanceStatus, MaintenancePriority } from '../../types';
import { formatPHP, formatDate } from '../../utils/formatters';
import { StatusBadge } from '../common/StatusBadge';
import { EmptyState } from '../common/EmptyState';

export const MaintenanceManagementView: React.FC = () => {
  const { maintenanceRequests, updateMaintenanceStatus, createExpense, rooms, tenants } = useApp();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<MaintenanceStatus | 'ALL'>('ALL');
  const [selectedTicket, setSelectedTicket] = useState<MaintenanceRequest | null>(null);

  // Resolution Form Modal
  const [isResolveModalOpen, setIsResolveModalOpen] = useState<boolean>(false);
  const [resolutionNotes, setResolutionNotes] = useState<string>('Repaired and tested. Tenant confirmed working.');
  const [repairCost, setRepairCost] = useState<number>(450);
  const [assignedTo, setAssignedTo] = useState<string>('Kuya Boy Maintenance');

  const filteredTickets = maintenanceRequests.filter(ticket => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.roomNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleResolveTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTicket) {
      updateMaintenanceStatus(selectedTicket.id, 'RESOLVED', resolutionNotes, repairCost, assignedTo);

      if (repairCost > 0) {
        createExpense({
          title: `Repair: ${selectedTicket.title} (Room ${selectedTicket.roomNumber})`,
          amount: repairCost,
          category: 'MAINTENANCE',
          date: new Date().toISOString().split('T')[0],
          paidTo: assignedTo || 'Contractor',
          paymentMethod: 'CASH',
          receiptNumber: `EXP-MNT-${Date.now().toString().slice(-4)}`,
          notes: `Linked to maintenance ticket ${selectedTicket.ticketNumber}`
        });
      }

      setIsResolveModalOpen(false);
      setSelectedTicket(null);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
            Maintenance & Repairs Center
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold font-mono">
              {maintenanceRequests.filter(m => m.status !== 'RESOLVED').length} Active
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track plumbing, electrical, aircon, and facility repairs submitted by boarding house tenants.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-[#101F23] border border-amber-500/30">
          <span className="text-xs text-amber-300 font-semibold">Pending Review</span>
          <div className="text-2xl font-extrabold text-amber-300 font-mono mt-1">
            {maintenanceRequests.filter(m => m.status === 'PENDING').length}
          </div>
          <span className="text-[10px] text-amber-400/80">Awaiting assignment</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#101F23] border border-cyan-500/30">
          <span className="text-xs text-cyan-300 font-semibold">In Progress</span>
          <div className="text-2xl font-extrabold text-cyan-300 font-mono mt-1">
            {maintenanceRequests.filter(m => m.status === 'IN_PROGRESS').length}
          </div>
          <span className="text-[10px] text-cyan-400/80">Staff on site</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#101F23] border border-emerald-500/30">
          <span className="text-xs text-emerald-300 font-semibold">Resolved</span>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">
            {maintenanceRequests.filter(m => m.status === 'RESOLVED').length}
          </div>
          <span className="text-[10px] text-emerald-400/80">Completed successfully</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#101F23] border border-white/[0.06]">
          <span className="text-xs text-slate-400 font-semibold">Total Repair Spend</span>
          <div className="text-2xl font-extrabold text-slate-100 font-mono mt-1">
            {formatPHP(maintenanceRequests.reduce((acc, curr) => acc + (curr.cost || 0), 0))}
          </div>
          <span className="text-[10px] text-slate-400">Total expense incurred</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-[#101F23] border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search ticket number, problem, or room..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0B171B] border border-white/[0.08] text-xs text-slate-100 placeholder-slate-500 focus:border-teal-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as MaintenanceStatus | 'ALL')}
            className="px-3 py-1.5 rounded-xl bg-[#0B171B] border border-white/[0.08] text-slate-200 font-medium focus:border-teal-500 focus:outline-none"
          >
            <option value="ALL">All Ticket Statuses</option>
            <option value="PENDING">Pending Review</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* TICKETS LIST */}
      {filteredTickets.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="No Maintenance Tickets"
          description="All reported boarding house facilities and utilities are currently operating in good condition."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTickets.map(ticket => (
            <div
              key={ticket.id}
              onClick={() => setSelectedTicket(ticket)}
              className="p-5 rounded-2xl bg-[#101F23] border border-white/[0.06] hover:border-teal-500/40 hover:bg-[#14282D] transition-all cursor-pointer shadow-lg flex flex-col justify-between group"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div>
                    <span className="font-mono text-[10px] font-bold text-teal-400 uppercase">
                      {ticket.ticketNumber} • {ticket.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-100 group-hover:text-teal-300 transition-colors mt-0.5">
                      {ticket.title}
                    </h3>
                  </div>
                  <StatusBadge type="priority" status={ticket.priority} size="sm" />
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
                  {ticket.description}
                </p>

                {ticket.photoUrl && (
                  <div className="h-28 rounded-xl overflow-hidden border border-white/10 mb-3 bg-black/40">
                    <img
                      src={ticket.photoUrl}
                      alt="Ticket Issue"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
              </div>

              {/* Footer Meta */}
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">
                    Filed by {ticket.tenantName} (Room {ticket.roomNumber})
                  </span>
                  <span className="font-mono text-slate-400 text-[10px]">{formatDate(ticket.createdAt)}</span>
                </div>
                <StatusBadge type="maintenance" status={ticket.status} size="sm" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TICKET DETAILS MODAL */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-100">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#0B171B] border border-teal-500/30 shadow-2xl p-6 space-y-5">
            <div className="flex justify-between items-start border-b border-white/[0.08] pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-teal-400 uppercase">
                  {selectedTicket.ticketNumber} • Room {selectedTicket.roomNumber}
                </span>
                <h3 className="text-lg font-extrabold text-slate-100 mt-1">
                  {selectedTicket.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#101F23] border border-white/[0.06]">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Category</span>
                  <p className="font-bold text-slate-200 mt-0.5">{selectedTicket.category}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Priority</span>
                  <div className="mt-0.5">
                    <StatusBadge type="priority" status={selectedTicket.priority} size="sm" />
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Tenant</span>
                  <p className="font-bold text-slate-200 mt-0.5">{selectedTicket.tenantName}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Current Status</span>
                  <div className="mt-0.5">
                    <StatusBadge type="maintenance" status={selectedTicket.status} size="sm" />
                  </div>
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block mb-1">
                  Problem Description
                </span>
                <p className="p-3.5 rounded-xl bg-[#101F23] border border-white/[0.06] text-slate-200 leading-relaxed">
                  {selectedTicket.description}
                </p>
              </div>

              {selectedTicket.photoUrl && (
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block mb-1">
                    Uploaded Issue Photo
                  </span>
                  <div className="h-44 rounded-xl overflow-hidden border border-white/10 bg-black/40">
                    <img
                      src={selectedTicket.photoUrl}
                      alt="Proof"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}

              {selectedTicket.resolutionNotes && (
                <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-200">
                  <span className="text-[10px] font-bold uppercase text-emerald-400 block mb-1">
                    Resolution Completed (Cost: {formatPHP(selectedTicket.cost || 0)})
                  </span>
                  <p>{selectedTicket.resolutionNotes}</p>
                  <span className="text-[10px] text-emerald-300/80 block mt-1">Handled by: {selectedTicket.assignedTo}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
              {selectedTicket.status === 'PENDING' && (
                <button
                  onClick={() => {
                    updateMaintenanceStatus(selectedTicket.id, 'IN_PROGRESS', undefined, undefined, 'Kuya Boy Maintenance');
                    setSelectedTicket(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 border border-cyan-500/30"
                >
                  Mark In Progress
                </button>
              )}

              {selectedTicket.status !== 'RESOLVED' && (
                <button
                  onClick={() => setIsResolveModalOpen(true)}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-400 hover:opacity-90 shadow-md shadow-teal-500/20 ml-auto"
                >
                  Mark as Resolved & Log Expense
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* RESOLUTION MODAL */}
      {isResolveModalOpen && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-100">
          <div className="w-full max-w-md rounded-2xl bg-[#0B171B] border border-teal-500/30 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-100">Complete Repair & Log Cost</h3>

            <form onSubmit={handleResolveTicket} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Handled By / Contractor</label>
                <input
                  type="text"
                  value={assignedTo}
                  onChange={e => setAssignedTo(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#101F23] border border-white/[0.08] text-slate-100 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Repair / Parts Cost (PHP)</label>
                <input
                  type="number"
                  value={repairCost}
                  onChange={e => setRepairCost(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-[#101F23] border border-white/[0.08] text-slate-100 focus:border-teal-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Resolution Work Notes</label>
                <textarea
                  rows={2}
                  value={resolutionNotes}
                  onChange={e => setResolutionNotes(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#101F23] border border-white/[0.08] text-slate-100 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsResolveModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.06] text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-400"
                >
                  Save & Complete Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
