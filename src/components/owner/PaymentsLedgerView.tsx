import React, { useState } from 'react';
import {
  CreditCard,
  Search,
  Filter,
  Download,
  Printer,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowUpDown,
  DollarSign
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Payment, PaymentMethod, PaymentStatus } from '../../types';
import { formatPHP, formatDate } from '../../utils/formatters';
import { StatusBadge } from '../common/StatusBadge';
import { EmptyState } from '../common/EmptyState';

export const PaymentsLedgerView: React.FC = () => {
  const { payments, setSelectedReceipt, addToast } = useApp();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [methodFilter, setMethodFilter] = useState<PaymentMethod | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'ALL'>('ALL');

  const filteredPayments = payments.filter(p => {
    const matchesSearch =
      p.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.roomNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMethod = methodFilter === 'ALL' || p.method === methodFilter;
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesMethod && matchesStatus;
  });

  const totalCollected = filteredPayments
    .filter(p => p.status === 'PAID')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const handleExportCSV = () => {
    const headers = ['Receipt No', 'Tenant Name', 'Room', 'Amount (PHP)', 'Method', 'Reference No', 'Date', 'Status'];
    const rows = filteredPayments.map(p => [
      p.receiptNumber,
      `"${p.tenantName}"`,
      p.roomNumber,
      p.amount,
      p.method,
      p.referenceNumber,
      p.date,
      p.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BoardingHub-Payments-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('CSV Exported', 'Payments spreadsheet has been generated successfully.', 'success');
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
            Payment & Collections Ledger
            <span className="text-xs px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 font-bold font-mono">
              {filteredPayments.length} Records
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Complete audited transaction history across GCash, Maya, Over-the-counter Cash, and Bank Transfers.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-200 bg-[#101F23] hover:bg-white/[0.06] border border-white/[0.08] transition-colors"
          >
            <Printer className="w-4 h-4 text-teal-400" />
            Print Ledger
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-400 hover:opacity-90 shadow-md shadow-teal-500/20 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-[#101F23] border border-white/[0.06]">
          <span className="text-xs text-slate-400 font-semibold">Total Filtered Inflow</span>
          <div className="text-xl sm:text-2xl font-extrabold text-teal-300 font-mono mt-1">
            {formatPHP(totalCollected)}
          </div>
          <span className="text-[10px] text-slate-400">Verified & deposited</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#101F23] border border-white/[0.06]">
          <span className="text-xs text-slate-400 font-semibold">GCash Inflow</span>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-100 font-mono mt-1">
            {formatPHP(filteredPayments.filter(p => p.method === 'GCASH' && p.status === 'PAID').reduce((a, b) => a + b.amount, 0))}
          </div>
          <span className="text-[10px] text-teal-400">Primary channel</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#101F23] border border-white/[0.06]">
          <span className="text-xs text-slate-400 font-semibold">Maya & Bank</span>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-100 font-mono mt-1">
            {formatPHP(filteredPayments.filter(p => (p.method === 'MAYA' || p.method === 'BANK_TRANSFER') && p.status === 'PAID').reduce((a, b) => a + b.amount, 0))}
          </div>
          <span className="text-[10px] text-cyan-400">Digital transfers</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#101F23] border border-white/[0.06]">
          <span className="text-xs text-slate-400 font-semibold">Cash On-Hand</span>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-100 font-mono mt-1">
            {formatPHP(filteredPayments.filter(p => p.method === 'CASH' && p.status === 'PAID').reduce((a, b) => a + b.amount, 0))}
          </div>
          <span className="text-[10px] text-emerald-400">Direct receipts</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-[#101F23] border border-white/[0.06] flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-lg">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search reference no, tenant, or receipt..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0B171B] border border-white/[0.08] text-xs text-slate-100 placeholder-slate-500 focus:border-teal-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
          {/* Method Filter */}
          <select
            value={methodFilter}
            onChange={e => setMethodFilter(e.target.value as PaymentMethod | 'ALL')}
            className="px-3 py-1.5 rounded-xl bg-[#0B171B] border border-white/[0.08] text-slate-200 font-medium focus:border-teal-500 focus:outline-none"
          >
            <option value="ALL">All Payment Methods</option>
            <option value="GCASH">GCash</option>
            <option value="MAYA">Maya</option>
            <option value="CASH">Cash (Over-the-counter)</option>
            <option value="BANK_TRANSFER">Bank Transfer</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as PaymentStatus | 'ALL')}
            className="px-3 py-1.5 rounded-xl bg-[#0B171B] border border-white/[0.08] text-slate-200 font-medium focus:border-teal-500 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="PAID">Paid / Approved</option>
            <option value="PENDING">Pending Approval</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      {filteredPayments.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="No Transactions Found"
          description="Try adjusting your filter criteria or search query."
        />
      ) : (
        <div className="rounded-2xl bg-[#101F23] border border-white/[0.06] shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.08] text-slate-400 font-semibold uppercase tracking-wider text-[10px] bg-[#0B171B]">
                  <th className="py-3.5 px-4">Receipt Number</th>
                  <th className="py-3.5 px-4">Tenant Name</th>
                  <th className="py-3.5 px-4">Room</th>
                  <th className="py-3.5 px-4">Amount Paid</th>
                  <th className="py-3.5 px-4">Method & Channel</th>
                  <th className="py-3.5 px-4">Reference Code</th>
                  <th className="py-3.5 px-4">Date Recorded</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Digital Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-slate-200">
                {filteredPayments.map(payment => (
                  <tr key={payment.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-200">
                      {payment.receiptNumber}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-100">
                      {payment.tenantName}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-teal-300 font-medium">
                      Room {payment.roomNumber}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-teal-300 text-sm">
                      {formatPHP(payment.amount)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20 text-[10px] font-bold">
                        {payment.method}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {payment.referenceNumber}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      {formatDate(payment.date)}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge type="payment" status={payment.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {payment.status === 'PAID' ? (
                        <button
                          onClick={() => setSelectedReceipt(payment)}
                          className="px-2.5 py-1 rounded-lg bg-teal-500/10 text-teal-300 hover:bg-teal-500/20 border border-teal-500/30 text-[11px] font-semibold transition-colors"
                        >
                          View Receipt
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-500">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
