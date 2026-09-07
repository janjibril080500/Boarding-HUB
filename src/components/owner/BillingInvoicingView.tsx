import React, { useState } from 'react';
import {
  FileText,
  Zap,
  Droplets,
  Wifi,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  Printer,
  Sparkles,
  Calculator,
  Download,
  DollarSign
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Invoice, InvoiceStatus } from '../../types';
import { formatPHP, formatDate } from '../../utils/formatters';
import { StatusBadge } from '../common/StatusBadge';
import { EmptyState } from '../common/EmptyState';

export const BillingInvoicingView: React.FC = () => {
  const { invoices, tenants, rooms, property, generateBulkMonthlyInvoices, createInvoice, addToast, setSelectedReceipt, payments } = useApp();

  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState<boolean>(false);
  const [isSubmeterCalcOpen, setIsSubmeterCalcOpen] = useState<boolean>(false);

  // Submeter Calculator State
  const [submeterData, setSubmeterData] = useState({
    tenantId: tenants[0]?.id || '',
    prevReading: 120,
    currReading: 175,
    electricRate: property.electricityRate || 12.5,
    waterShare: property.waterRate || 180,
    wifiShare: property.wifiFlatRate || 250,
    dueDate: '2026-09-05'
  });

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch =
      inv.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.roomNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const selectedTenantForSubmeter = tenants.find(t => t.id === submeterData.tenantId);
  const kwhConsumed = Math.max(0, submeterData.currReading - submeterData.prevReading);
  const electricCost = kwhConsumed * submeterData.electricRate;
  const rentCost = selectedTenantForSubmeter?.monthlyRent || 3500;
  const totalBill = rentCost + electricCost + submeterData.waterShare + submeterData.wifiShare;

  const handleCreateSubmeterInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTenantForSubmeter) return;

    createInvoice({
      tenantId: selectedTenantForSubmeter.id,
      tenantName: selectedTenantForSubmeter.name || 'Tenant',
      roomNumber: (selectedTenantForSubmeter.roomId || '').replace('room-', '') || '101',
      billingMonth: 'September 2026',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: submeterData.dueDate,
      rentAmount: rentCost,
      electricityAmount: electricCost,
      waterAmount: submeterData.waterShare,
      wifiAmount: submeterData.wifiShare,
      otherAmount: 0,
      totalAmount: totalBill,
      status: 'PENDING',
      lineItems: [
        { id: 'li-1', description: `Room ${(selectedTenantForSubmeter.roomId || '').replace('room-', '') || '101'} Monthly Rent`, amount: rentCost, category: 'RENT' },
        { id: 'li-2', description: `Electricity Submeter (${kwhConsumed} kWh @ ₱${submeterData.electricRate})`, amount: electricCost, category: 'ELECTRICITY' },
        { id: 'li-3', description: 'Water Utility Shared Consumption', amount: submeterData.waterShare, category: 'WATER' },
        { id: 'li-4', description: 'High-Speed Fiber Wi-Fi Maintenance', amount: submeterData.wifiShare, category: 'WIFI' }
      ]
    });

    setIsSubmeterCalcOpen(false);
  };

  const handleSendReminder = (invoice: Invoice) => {
    addToast(
      'SMS & Portal Notice Dispatched',
      `Payment reminder successfully sent to ${invoice.tenantName} for Invoice ${invoice.invoiceNumber} (${formatPHP(invoice.totalAmount)}).`,
      'info'
    );
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
            Billing & Invoicing Engine
            <span className="text-xs px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 font-bold font-mono">
              {invoices.length} Invoices
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Automated monthly billing, submeter electricity calculation, water share distribution, and instant tenant notifications.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => setIsSubmeterCalcOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-200 bg-[#101F23] hover:bg-white/[0.06] border border-white/[0.08] transition-colors"
          >
            <Calculator className="w-4 h-4 text-teal-400" />
            Submeter Calculator
          </button>
          <button
            onClick={() => generateBulkMonthlyInvoices('September 2026')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-400 hover:opacity-90 shadow-lg shadow-teal-500/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            1-Click Bulk Generate
          </button>
        </div>
      </div>

      {/* Summary KPI Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-[#101F23] border border-white/[0.06]">
          <span className="text-xs text-slate-400 font-semibold">Total Invoiced</span>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-100 font-mono mt-1">
            {formatPHP(invoices.reduce((acc, curr) => acc + curr.totalAmount, 0))}
          </div>
          <span className="text-[10px] text-slate-400">{invoices.length} generated statements</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#101F23] border border-emerald-500/20">
          <span className="text-xs text-emerald-400 font-semibold">Collected & Settled</span>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono mt-1">
            {formatPHP(invoices.filter(i => i.status === 'PAID').reduce((acc, curr) => acc + curr.totalAmount, 0))}
          </div>
          <span className="text-[10px] text-emerald-400/80">{invoices.filter(i => i.status === 'PAID').length} invoices fully cleared</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#101F23] border border-amber-500/20">
          <span className="text-xs text-amber-400 font-semibold">Pending Collection</span>
          <div className="text-xl sm:text-2xl font-extrabold text-amber-300 font-mono mt-1">
            {formatPHP(invoices.filter(i => i.status === 'PENDING').reduce((acc, curr) => acc + curr.totalAmount, 0))}
          </div>
          <span className="text-[10px] text-amber-400/80">{invoices.filter(i => i.status === 'PENDING').length} awaiting tenant GCash/Maya</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#101F23] border border-rose-500/20">
          <span className="text-xs text-rose-400 font-semibold">Overdue Invoices</span>
          <div className="text-xl sm:text-2xl font-extrabold text-rose-400 font-mono mt-1">
            {formatPHP(invoices.filter(i => i.status === 'OVERDUE').reduce((acc, curr) => acc + curr.totalAmount, 0))}
          </div>
          <span className="text-[10px] text-rose-400/80">{invoices.filter(i => i.status === 'OVERDUE').length} past due date</span>
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
            placeholder="Search invoice number, tenant, or room..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0B171B] border border-white/[0.08] text-xs text-slate-100 placeholder-slate-500 focus:border-teal-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as InvoiceStatus | 'ALL')}
            className="px-3 py-1.5 rounded-xl bg-[#0B171B] border border-white/[0.08] text-slate-200 font-medium focus:border-teal-500 focus:outline-none"
          >
            <option value="ALL">All Invoice Statuses</option>
            <option value="PAID">Paid</option>
            <option value="PENDING">Pending</option>
            <option value="OVERDUE">Overdue</option>
            <option value="DRAFT">Draft</option>
          </select>
        </div>
      </div>

      {/* INVOICES TABLE */}
      {filteredInvoices.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No Invoices Found"
          description="Click '1-Click Bulk Generate' to create September 2026 rent and utility billing for all active tenants."
        />
      ) : (
        <div className="rounded-2xl bg-[#101F23] border border-white/[0.06] shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.08] text-slate-400 font-semibold uppercase tracking-wider text-[10px] bg-[#0B171B]">
                  <th className="py-3.5 px-4">Invoice No.</th>
                  <th className="py-3.5 px-4">Resident & Room</th>
                  <th className="py-3.5 px-4">Rent</th>
                  <th className="py-3.5 px-4">Electricity</th>
                  <th className="py-3.5 px-4">Water & WiFi</th>
                  <th className="py-3.5 px-4">Total Due</th>
                  <th className="py-3.5 px-4">Due Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-slate-200">
                {filteredInvoices.map(invoice => (
                  <tr key={invoice.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-teal-300">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-100">{invoice.tenantName}</div>
                      <div className="text-[10px] text-teal-300 font-mono">Room {invoice.roomNumber}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-200">
                      {formatPHP(invoice.rentAmount)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {invoice.electricityAmount ? formatPHP(invoice.electricityAmount) : '—'}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {formatPHP((invoice.waterAmount || 0) + (invoice.wifiAmount || 0))}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-100 text-sm">
                      {formatPHP(invoice.totalAmount)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {formatDate(invoice.dueDate)}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge type="invoice" status={invoice.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {invoice.status !== 'PAID' && (
                          <button
                            onClick={() => handleSendReminder(invoice)}
                            className="p-1.5 rounded-lg bg-teal-500/10 text-teal-300 hover:bg-teal-500/20 border border-teal-500/20 transition-colors"
                            title="Send SMS/Portal Payment Reminder"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {invoice.status === 'PAID' ? (
                          <button
                            onClick={() => {
                              const matchingPayment = payments.find(p => p.tenantName === invoice.tenantName && p.status === 'PAID');
                              if (matchingPayment) setSelectedReceipt(matchingPayment);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-teal-500/10 text-teal-300 hover:bg-teal-500/20 border border-teal-500/30 text-[11px] font-semibold"
                          >
                            Receipt
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-500">Unpaid</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBMETER & UTILITY CALCULATOR MODAL */}
      {isSubmeterCalcOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-100">
          <div className="w-full max-w-lg rounded-2xl bg-[#0B171B] border border-teal-500/30 p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-white/[0.08] pb-3">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-teal-400" />
                Submeter Electricity & Utility Calculator
              </h3>
              <button
                onClick={() => setIsSubmeterCalcOpen(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmeterInvoice} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Tenant *</label>
                <select
                  value={submeterData.tenantId}
                  onChange={e => setSubmeterData({ ...submeterData, tenantId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#101F23] border border-white/[0.08] text-slate-100 focus:border-teal-500 focus:outline-none"
                >
                  {tenants.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name} (Room {t.roomId.replace('room-', '')} • {t.bedLabel})
                    </option>
                  ))}
                </select>
              </div>

              {/* Submeter Readings */}
              <div className="p-3.5 rounded-xl bg-[#101F23] border border-white/[0.06] space-y-3">
                <div className="flex items-center gap-2 font-bold text-teal-300 text-xs">
                  <Zap className="w-4 h-4" />
                  <span>Electric Submeter Reading (kWh)</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1 text-[11px]">Previous Reading</label>
                    <input
                      type="number"
                      value={submeterData.prevReading}
                      onChange={e => setSubmeterData({ ...submeterData, prevReading: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#0B171B] border border-white/[0.08] text-slate-100 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 text-[11px]">Current Reading</label>
                    <input
                      type="number"
                      value={submeterData.currReading}
                      onChange={e => setSubmeterData({ ...submeterData, currReading: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#0B171B] border border-white/[0.08] text-slate-100 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 text-[11px]">Rate (₱/kWh)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={submeterData.electricRate}
                      onChange={e => setSubmeterData({ ...submeterData, electricRate: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#0B171B] border border-white/[0.08] text-slate-100 font-mono"
                    />
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-[#071014] text-teal-300 font-mono text-[11px] flex justify-between">
                  <span>Consumption: {kwhConsumed} kWh</span>
                  <span className="font-bold">Total Electricity: {formatPHP(electricCost)}</span>
                </div>
              </div>

              {/* Fixed Utility Shares */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Water Fixed Share (₱)</label>
                  <input
                    type="number"
                    value={submeterData.waterShare}
                    onChange={e => setSubmeterData({ ...submeterData, waterShare: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-[#101F23] border border-white/[0.08] text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Wi-Fi Fee Share (₱)</label>
                  <input
                    type="number"
                    value={submeterData.wifiShare}
                    onChange={e => setSubmeterData({ ...submeterData, wifiShare: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-[#101F23] border border-white/[0.08] text-slate-100 font-mono"
                  />
                </div>
              </div>

              {/* Total Live Preview */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-teal-950/50 to-cyan-950/50 border border-teal-500/30 flex justify-between items-center">
                <div>
                  <div className="text-[10px] uppercase font-bold text-teal-300">Total Computed Invoice</div>
                  <div className="text-xs text-slate-400 mt-0.5">Rent + Electricity + Water + Wi-Fi</div>
                </div>
                <div className="text-xl font-extrabold text-teal-300 font-mono">
                  {formatPHP(totalBill)}
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSubmeterCalcOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.06] text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-400 hover:opacity-90 shadow-md shadow-teal-500/20"
                >
                  Generate & Send Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
