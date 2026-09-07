import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  FileText,
  AlertCircle,
  CheckCircle2,
  X,
  CreditCard,
  Wrench,
  ShieldCheck,
  Download,
  Trash2,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Tenant, TenantStatus } from '../../types';
import { formatPHP, formatDate } from '../../utils/formatters';
import { StatusBadge } from '../common/StatusBadge';
import { EmptyState } from '../common/EmptyState';

export const TenantsManagementView: React.FC = () => {
  const {
    tenants,
    rooms,
    payments,
    invoices,
    maintenanceRequests,
    selectedTenant,
    setSelectedTenant,
    addTenant,
    updateTenant,
    deleteTenant,
    setSelectedReceipt,
    createPayment,
    setActiveTab
  } = useApp();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<TenantStatus | 'ALL'>('ALL');
  const [roomFilter, setRoomFilter] = useState<string>('ALL');

  // Add Tenant Modal
  const [isAddTenantOpen, setIsAddTenantOpen] = useState<boolean>(false);
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState<boolean>(false);
  const [recordAmount, setRecordAmount] = useState<number>(3500);
  const [recordMethod, setRecordMethod] = useState<'CASH' | 'GCASH' | 'MAYA' | 'BANK_TRANSFER'>('CASH');
  const [recordRef, setRecordRef] = useState<string>('OR-MANUAL-01');

  const [newTenantData, setNewTenantData] = useState<{
    name: string;
    email: string;
    phone: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
    roomId: string;
    bedLabel: string;
    moveInDate: string;
    leaseEndDate: string;
    monthlyRent: number;
    securityDeposit: number;
    idType: string;
    idNumber: string;
  }>({
    name: '',
    email: '',
    phone: '+63 9',
    emergencyContactName: '',
    emergencyContactPhone: '+63 9',
    roomId: rooms[0]?.id || 'room-101',
    bedLabel: 'Bed A (Lower)',
    moveInDate: new Date().toISOString().split('T')[0],
    leaseEndDate: '2027-02-01',
    monthlyRent: 3500,
    securityDeposit: 3500,
    idType: 'Philippine National ID',
    idNumber: 'PH-ID-992384'
  });

  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch =
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.roomId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || tenant.status === statusFilter;
    const matchesRoom = roomFilter === 'ALL' || tenant.roomId === roomFilter;
    return matchesSearch && matchesStatus && matchesRoom;
  });

  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    addTenant({
      name: newTenantData.name,
      email: newTenantData.email,
      phone: newTenantData.phone,
      emergencyContact: {
        name: newTenantData.emergencyContactName,
        phone: newTenantData.emergencyContactPhone,
        relationship: 'Parent / Guardian'
      },
      roomId: newTenantData.roomId,
      bedLabel: newTenantData.bedLabel,
      moveInDate: newTenantData.moveInDate,
      leaseEndDate: newTenantData.leaseEndDate,
      monthlyRent: newTenantData.monthlyRent,
      securityDeposit: newTenantData.securityDeposit,
      currentBalance: 0,
      status: 'ACTIVE',
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 50)}?w=150&auto=format&fit=crop&q=80`,
      idDocumentUrl: 'https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=600&auto=format&fit=crop&q=80',
      idType: newTenantData.idType,
      idNumber: newTenantData.idNumber
    });
    setIsAddTenantOpen(false);
  };

  const handleManualPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTenant) {
      createPayment({
        invoiceId: `inv-manual-${Date.now()}`,
        tenantId: selectedTenant.id,
        tenantName: selectedTenant.name,
        roomNumber: selectedTenant.roomId.replace('room-', ''),
        amount: recordAmount,
        type: 'RENT',
        method: recordMethod,
        referenceNumber: recordRef,
        notes: 'Owner recorded over-the-counter cash / direct settlement.'
      });
      setIsRecordPaymentOpen(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
            Tenant Resident Directory
            <span className="text-xs px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 font-bold font-mono">
              {tenants.length} Tenants
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage resident profiles, lease contracts, emergency contacts, and individual balance ledgers.
          </p>
        </div>

        <button
          onClick={() => setIsAddTenantOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-400 hover:opacity-90 shadow-lg shadow-teal-500/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add New Tenant
        </button>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-[#101F23] border border-white/[0.06] flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-lg">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by tenant name, email, or room..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0B171B] border border-white/[0.08] text-xs text-slate-100 placeholder-slate-500 focus:border-teal-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as TenantStatus | 'ALL')}
            className="px-3 py-1.5 rounded-xl bg-[#0B171B] border border-white/[0.08] text-slate-200 font-medium focus:border-teal-500 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Resident</option>
            <option value="OVERDUE">Overdue Balance</option>
            <option value="MOVING_OUT">Moving Out Soon</option>
            <option value="INACTIVE">Inactive / Past</option>
          </select>

          {/* Room Filter */}
          <select
            value={roomFilter}
            onChange={e => setRoomFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#0B171B] border border-white/[0.08] text-slate-200 font-medium focus:border-teal-500 focus:outline-none"
          >
            <option value="ALL">All Assigned Rooms</option>
            {rooms.map(r => (
              <option key={r.id} value={r.id}>
                Room {r.roomNumber}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TENANTS TABLE */}
      {filteredTenants.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Tenants Found"
          description="Try adjusting your search criteria or register a new tenant to an available bedspace."
          actionLabel="Register First Tenant"
          onAction={() => setIsAddTenantOpen(true)}
        />
      ) : (
        <div className="rounded-2xl bg-[#101F23] border border-white/[0.06] shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.08] text-slate-400 font-semibold uppercase tracking-wider text-[10px] bg-[#0B171B]">
                  <th className="py-3.5 px-4">Resident Name</th>
                  <th className="py-3.5 px-4">Room & Bed</th>
                  <th className="py-3.5 px-4">Contact Info</th>
                  <th className="py-3.5 px-4">Move-in Date</th>
                  <th className="py-3.5 px-4">Monthly Rate</th>
                  <th className="py-3.5 px-4">Balance Status</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Ledger</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-slate-200">
                {filteredTenants.map(tenant => (
                  <tr
                    key={tenant.id}
                    onClick={() => setSelectedTenant(tenant)}
                    className="hover:bg-[#14282D] transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={tenant.avatar}
                          alt={tenant.name}
                          className="w-8 h-8 rounded-full object-cover border border-teal-500/30 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-slate-100 group-hover:text-teal-300 transition-colors">
                            {tenant.name}
                          </div>
                          <div className="text-[10px] text-slate-400">{tenant.idType || 'Verified ID'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-teal-300">
                        Room {tenant.roomId.replace('room-', '')}
                      </span>
                      <span className="text-[10px] text-slate-400 block">{tenant.bedLabel}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-300">{tenant.phone}</div>
                      <div className="text-[10px] text-slate-400">{tenant.email}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-mono">
                      {formatDate(tenant.moveInDate)}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-100">
                      {formatPHP(tenant.monthlyRent)}
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      {tenant.currentBalance > 0 ? (
                        <span className="font-bold text-rose-400">
                          Due {formatPHP(tenant.currentBalance)}
                        </span>
                      ) : (
                        <span className="text-teal-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Settled
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge type="tenant" status={tenant.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="px-2.5 py-1 rounded-lg bg-teal-500/10 text-teal-300 hover:bg-teal-500/20 border border-teal-500/30 text-[11px] font-semibold transition-colors">
                        View Profile →
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* COMPREHENSIVE TENANT PROFILE DRAWER / MODAL */}
      {selectedTenant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-100">
          <div className="relative w-full max-w-2xl rounded-2xl bg-[#0B171B] border border-teal-500/30 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Drawer Header */}
            <div className="p-6 bg-gradient-to-r from-teal-950/40 via-[#0B171B] to-[#0B171B] border-b border-white/[0.08] flex items-start justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={selectedTenant.avatar}
                  alt={selectedTenant.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-teal-400 shadow-xl"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-extrabold text-slate-100">{selectedTenant.name}</h2>
                    <StatusBadge type="tenant" status={selectedTenant.status} size="sm" />
                  </div>
                  <p className="text-xs text-teal-300 mt-0.5 font-mono">
                    Room {selectedTenant.roomId.replace('room-', '')} • {selectedTenant.bedLabel}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTenant(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-200">
              {/* Financial Summary Strip */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-[#101F23] border border-white/[0.06] text-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Monthly Rent</span>
                  <div className="text-base font-extrabold text-slate-100 font-mono mt-0.5">
                    {formatPHP(selectedTenant.monthlyRent)}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Security Deposit</span>
                  <div className="text-base font-extrabold text-teal-300 font-mono mt-0.5">
                    {formatPHP(selectedTenant.securityDeposit)}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Current Balance</span>
                  <div className={`text-base font-extrabold font-mono mt-0.5 ${selectedTenant.currentBalance > 0 ? 'text-rose-400' : 'text-teal-400'}`}>
                    {formatPHP(selectedTenant.currentBalance)}
                  </div>
                </div>
              </div>

              {/* Personal & Emergency Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#101F23] border border-white/[0.06] space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Contact Details
                  </span>
                  <div className="flex items-center gap-2 text-slate-200">
                    <Phone className="w-3.5 h-3.5 text-teal-400" />
                    <span>{selectedTenant.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-200">
                    <Mail className="w-3.5 h-3.5 text-teal-400" />
                    <span>{selectedTenant.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-teal-400" />
                    <span>Move-in: {formatDate(selectedTenant.moveInDate)}</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#101F23] border border-white/[0.06] space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Emergency Contact (PH)
                  </span>
                  <div className="font-semibold text-slate-100">
                    {selectedTenant.emergencyContact?.name || 'Not provided'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Relationship: {selectedTenant.emergencyContact?.relationship || 'N/A'}
                  </div>
                  {selectedTenant.emergencyContact?.phone && (
                    <div className="flex items-center gap-2 text-teal-300 font-mono">
                      <Phone className="w-3.5 h-3.5" />
                      <span>{selectedTenant.emergencyContact.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Philippine ID Verification Document */}
              <div className="p-4 rounded-xl bg-[#101F23] border border-white/[0.06]">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    Verified Government ID ({selectedTenant.idType})
                  </span>
                  <span className="font-mono text-teal-300 text-[11px]">
                    No: {selectedTenant.idNumber}
                  </span>
                </div>
                {selectedTenant.idDocumentUrl && (
                  <div className="h-28 rounded-lg overflow-hidden border border-white/10 bg-black/40">
                    <img
                      src={selectedTenant.idDocumentUrl}
                      alt="ID Document"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Payment History & Ledger for this tenant */}
              <div>
                <div className="flex justify-between items-center mb-2.5">
                  <h4 className="font-bold text-slate-100 uppercase tracking-wider text-[11px]">
                    Recent Invoices & Transactions
                  </h4>
                  <button
                    onClick={() => setIsRecordPaymentOpen(true)}
                    className="text-teal-400 hover:text-teal-300 font-semibold text-[11px] flex items-center gap-1"
                  >
                    + Record Cash / Maya Payment
                  </button>
                </div>

                <div className="space-y-2">
                  {payments.filter(p => p.tenantId === selectedTenant.id || p.tenantName === selectedTenant.name).map(p => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#101F23] border border-white/[0.04]"
                    >
                      <div>
                        <div className="font-semibold text-slate-200">
                          {p.referenceNumber} • {p.method}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {formatDate(p.date)} • {p.type}
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-3">
                        <div>
                          <div className="font-mono font-bold text-teal-300">{formatPHP(p.amount)}</div>
                          <span className="text-[10px] text-slate-400">{p.status}</span>
                        </div>
                        {p.status === 'PAID' && (
                          <button
                            onClick={() => setSelectedReceipt(p)}
                            className="px-2 py-1 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20 text-[10px] font-semibold"
                          >
                            Receipt
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 bg-[#071014] border-t border-white/[0.08] flex items-center justify-between">
              <button
                onClick={() => {
                  deleteTenant(selectedTenant.id);
                  setSelectedTenant(null);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20"
              >
                <Trash2 className="w-3.5 h-3.5" /> End Lease / Remove
              </button>
              <button
                onClick={() => setIsRecordPaymentOpen(true)}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-400 hover:opacity-90 shadow-md shadow-teal-500/20 cursor-pointer"
              >
                <DollarSign className="w-4 h-4" /> Record Settlement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RECORD CASH / MANUAL PAYMENT MODAL */}
      {isRecordPaymentOpen && selectedTenant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-100">
          <div className="w-full max-w-md rounded-2xl bg-[#0B171B] border border-teal-500/30 p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-white/[0.08] pb-3">
              <h3 className="text-base font-bold text-slate-100">Record Direct Payment</h3>
              <button onClick={() => setIsRecordPaymentOpen(false)} className="text-slate-400 hover:text-slate-200">
                ✕
              </button>
            </div>

            <form onSubmit={handleManualPaymentSubmit} className="space-y-3.5 text-xs">
              <div className="p-3 rounded-xl bg-[#101F23] border border-white/[0.06]">
                <div className="text-slate-400">Crediting to:</div>
                <div className="font-bold text-slate-100">{selectedTenant.name} (Room {selectedTenant.roomId.replace('room-', '')})</div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Amount Paid (PHP) *</label>
                <input
                  type="number"
                  required
                  value={recordAmount}
                  onChange={e => setRecordAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-[#101F23] border border-white/[0.08] text-slate-100 focus:border-teal-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Payment Method</label>
                <select
                  value={recordMethod}
                  onChange={e => setRecordMethod(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-[#101F23] border border-white/[0.08] text-slate-100 focus:border-teal-500 focus:outline-none"
                >
                  <option value="CASH">Over-the-counter Cash</option>
                  <option value="GCASH">GCash Manual</option>
                  <option value="MAYA">Maya Direct</option>
                  <option value="BANK_TRANSFER">Bank Deposit (BDO / BPI / UnionBank)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Official Reference / OR Number</label>
                <input
                  type="text"
                  value={recordRef}
                  onChange={e => setRecordRef(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#101F23] border border-white/[0.08] text-slate-100 focus:border-teal-500 focus:outline-none font-mono"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setIsRecordPaymentOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.06] text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-400"
                >
                  Issue Receipt & Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD TENANT MODAL */}
      {isAddTenantOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-100">
          <div className="w-full max-w-xl rounded-2xl bg-[#0B171B] border border-teal-500/30 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-white/[0.08] pb-3">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-400" />
                Register New Resident Tenant
              </h3>
              <button
                onClick={() => setIsAddTenantOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTenant} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={newTenantData.name}
                    onChange={e => setNewTenantData({ ...newTenantData, name: e.target.value })}
                    placeholder="e.g. Christian Paul Ramos"
                    className="w-full px-3 py-2 rounded-xl bg-[#101F23] border border-white/[0.08] text-slate-100 focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={newTenantData.email}
                    onChange={e => setNewTenantData({ ...newTenantData, email: e.target.value })}
                    placeholder="tenant@gmail.com"
                    className="w-full px-3 py-2 rounded-xl bg-[#101F23] border border-white/[0.08] text-slate-100 focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Mobile Phone (PH) *</label>
                  <input
                    type="text"
                    required
                    value={newTenantData.phone}
                    onChange={e => setNewTenantData({ ...newTenantData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#101F23] border border-white/[0.08] text-slate-100 focus:border-teal-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Emergency Contact Phone *</label>
                  <input
                    type="text"
                    required
                    value={newTenantData.emergencyContactPhone}
                    onChange={e => setNewTenantData({ ...newTenantData, emergencyContactPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#101F23] border border-white/[0.08] text-slate-100 focus:border-teal-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Assign Room *</label>
                  <select
                    value={newTenantData.roomId}
                    onChange={e => {
                      const room = rooms.find(r => r.id === e.target.value);
                      setNewTenantData({
                        ...newTenantData,
                        roomId: e.target.value,
                        monthlyRent: room?.monthlyRent || 3500
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-[#101F23] border border-white/[0.08] text-slate-100 focus:border-teal-500 focus:outline-none"
                  >
                    {rooms.map(r => (
                      <option key={r.id} value={r.id}>
                        Room {r.roomNumber} (Floor {r.floor} • {r.occupiedBeds}/{r.capacity} beds)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Bed Assignment *</label>
                  <input
                    type="text"
                    required
                    value={newTenantData.bedLabel}
                    onChange={e => setNewTenantData({ ...newTenantData, bedLabel: e.target.value })}
                    placeholder="e.g. Bed A (Lower)"
                    className="w-full px-3 py-2 rounded-xl bg-[#101F23] border border-white/[0.08] text-slate-100 focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Agreed Monthly Rent (PHP) *</label>
                  <input
                    type="number"
                    required
                    value={newTenantData.monthlyRent}
                    onChange={e => setNewTenantData({ ...newTenantData, monthlyRent: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-[#101F23] border border-white/[0.08] text-slate-100 focus:border-teal-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Security Deposit Held (PHP)</label>
                  <input
                    type="number"
                    value={newTenantData.securityDeposit}
                    onChange={e => setNewTenantData({ ...newTenantData, securityDeposit: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-[#101F23] border border-white/[0.08] text-slate-100 focus:border-teal-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddTenantOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.06] text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-400 hover:opacity-90 shadow-md shadow-teal-500/20"
                >
                  Complete Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
