import React, { useEffect, useState } from 'react';
import { Search, X, Users, BedDouble, CreditCard, Wrench, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatPHP } from '../../utils/formatters';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    tenants,
    rooms,
    payments,
    maintenanceRequests,
    setActiveTab,
    setSelectedTenant,
    setSelectedReceipt
  } = useApp();

  const [query, setQuery] = useState(searchQuery);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const trimmed = query.trim().toLowerCase();

  const matchingTenants = trimmed
    ? tenants.filter(t => (t.name || '').toLowerCase().includes(trimmed) || (t.email || '').toLowerCase().includes(trimmed) || (t.roomId || '').includes(trimmed))
    : tenants.slice(0, 3);

  const matchingRooms = trimmed
    ? rooms.filter(r => (r.roomNumber || '').toLowerCase().includes(trimmed) || `room ${r.roomNumber || ''}`.includes(trimmed))
    : rooms.slice(0, 3);

  const matchingPayments = trimmed
    ? payments.filter(p => (p.tenantName || '').toLowerCase().includes(trimmed) || (p.referenceNumber || '').toLowerCase().includes(trimmed) || (p.receiptNumber || '').toLowerCase().includes(trimmed))
    : payments.slice(0, 3);

  const matchingMaintenance = trimmed
    ? maintenanceRequests.filter(m => (m.title || '').toLowerCase().includes(trimmed) || (m.ticketNumber || '').toLowerCase().includes(trimmed) || (m.tenantName || '').toLowerCase().includes(trimmed))
    : maintenanceRequests.slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-100">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#0B171B] border border-teal-500/30 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.08] bg-[#101F23]">
          <Search className="w-5 h-5 text-teal-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search tenants, room numbers, GCash reference, invoices..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* Tenants Group */}
          <div>
            <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-400 text-[10px] mb-2 px-1">
              <Users className="w-3 h-3 text-teal-400" />
              <span>Tenants ({matchingTenants.length})</span>
            </div>
            <div className="space-y-1">
              {matchingTenants.map(tenant => (
                <button
                  key={tenant.id}
                  onClick={() => {
                    setSelectedTenant(tenant);
                    setActiveTab('tenants');
                    setIsSearchOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.06] text-left transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={tenant.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
                      alt={tenant.name || 'Tenant'}
                      className="w-7 h-7 rounded-full object-cover border border-white/10"
                    />
                    <div>
                      <div className="font-semibold text-slate-100 group-hover:text-teal-300">
                        {tenant.name || 'Tenant'}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Room {(tenant.roomId || '').replace('room-', '') || '101'} • {tenant.bedLabel || 'Bed'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-mono font-semibold ${tenant.currentBalance > 0 ? 'text-rose-400' : 'text-teal-400'}`}>
                      {tenant.currentBalance > 0 ? `Due ${formatPHP(tenant.currentBalance)}` : 'Settled'}
                    </div>
                    <span className="text-[10px] text-slate-400 flex items-center justify-end gap-1 group-hover:text-teal-300">
                      View Profile <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Rooms Group */}
          <div>
            <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-400 text-[10px] mb-2 px-1">
              <BedDouble className="w-3 h-3 text-teal-400" />
              <span>Rooms ({matchingRooms.length})</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {matchingRooms.map(room => (
                <button
                  key={room.id}
                  onClick={() => {
                    setActiveTab('rooms');
                    setIsSearchOpen(false);
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#101F23] hover:bg-white/[0.06] text-left transition-colors border border-white/[0.04]"
                >
                  <div>
                    <div className="font-bold text-slate-100">Room {room.roomNumber}</div>
                    <div className="text-[11px] text-slate-400">Floor {room.floor} • {room.occupiedBeds}/{room.capacity} beds</div>
                  </div>
                  <span className="text-[11px] font-mono text-teal-400">{formatPHP(room.monthlyRent)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Payments Group */}
          <div>
            <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-400 text-[10px] mb-2 px-1">
              <CreditCard className="w-3 h-3 text-teal-400" />
              <span>Payments & Invoices</span>
            </div>
            <div className="space-y-1">
              {matchingPayments.map(payment => (
                <button
                  key={payment.id}
                  onClick={() => {
                    if (payment.status === 'PAID') {
                      setSelectedReceipt(payment);
                    } else {
                      setActiveTab('verification');
                    }
                    setIsSearchOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.06] text-left transition-colors"
                >
                  <div>
                    <div className="font-semibold text-slate-100">
                      {payment.tenantName} — {payment.referenceNumber}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {payment.method} • {payment.date} • Room {payment.roomNumber}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-teal-300">{formatPHP(payment.amount)}</span>
                    <div className="text-[10px] text-slate-400 uppercase">{payment.status}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Maintenance Group */}
          <div>
            <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-400 text-[10px] mb-2 px-1">
              <Wrench className="w-3 h-3 text-teal-400" />
              <span>Maintenance Tickets</span>
            </div>
            <div className="space-y-1">
              {matchingMaintenance.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab('maintenance');
                    setIsSearchOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.06] text-left transition-colors"
                >
                  <div>
                    <div className="font-semibold text-slate-100 truncate max-w-xs">
                      {item.ticketNumber} — {item.title}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Room {item.roomNumber} • By {item.tenantName}
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/[0.06] text-amber-300 font-semibold">
                    {item.status}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-[#071014] border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400">
          <span>Tip: Click any tenant to inspect full billing ledger & documents</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};
