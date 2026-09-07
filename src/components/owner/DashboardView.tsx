import React, { useState } from 'react';
import {
  BedDouble,
  Users,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  TrendingUp,
  ArrowUpRight,
  Zap,
  Plus,
  ArrowRight,
  Calendar,
  Sparkles,
  ShieldAlert,
  ChevronRight,
  Filter
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatPHP, formatDate } from '../../utils/formatters';
import { StatusBadge } from '../common/StatusBadge';

export const DashboardView: React.FC = () => {
  const {
    property,
    rooms,
    tenants,
    payments,
    invoices,
    setActiveTab,
    setSelectedReceipt,
    approvePayment
  } = useApp();

  const [revenueFilter, setRevenueFilter] = useState<'7D' | '30D' | '3M' | '12M'>('30D');
  const [hoveredDataPoint, setHoveredDataPoint] = useState<{
    label: string;
    rent: number;
    utilities: number;
    total: number;
  } | null>(null);

  // Computed KPIs
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter(r => r.status === 'OCCUPIED').length;
  const availableRooms = rooms.filter(r => r.status === 'AVAILABLE').length;
  const reservedRooms = rooms.filter(r => r.status === 'RESERVED').length;
  const maintenanceRooms = rooms.filter(r => r.status === 'MAINTENANCE').length;
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  // Revenue & Balance
  const monthlyRevenue = payments
    .filter(p => p.status === 'PAID')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const outstandingBalance = tenants.reduce((acc, curr) => acc + curr.currentBalance, 0);

  const pendingPayments = payments.filter(p => p.status === 'PENDING');

  // Chart data based on selected filter
  const chartDatasets = {
    '7D': [
      { label: 'Aug 12', rent: 3500, utilities: 800, total: 4300 },
      { label: 'Aug 13', rent: 0, utilities: 450, total: 450 },
      { label: 'Aug 14', rent: 4200, utilities: 950, total: 5150 },
      { label: 'Aug 15', rent: 4500, utilities: 1100, total: 5600 },
      { label: 'Aug 16', rent: 3500, utilities: 600, total: 4100 },
      { label: 'Aug 17', rent: 7000, utilities: 1350, total: 8350 },
      { label: 'Aug 18', rent: 4500, utilities: 1200, total: 5700 }
    ],
    '30D': [
      { label: 'Week 1', rent: 28500, utilities: 4200, total: 32700 },
      { label: 'Week 2', rent: 34000, utilities: 5800, total: 39800 },
      { label: 'Week 3', rent: 26500, utilities: 3900, total: 30400 },
      { label: 'Week 4', rent: 16000, utilities: 2400, total: 18400 }
    ],
    '3M': [
      { label: 'June 2026', rent: 98000, utilities: 14200, total: 112200 },
      { label: 'July 2026', rent: 102500, utilities: 15800, total: 118300 },
      { label: 'Aug 2026', rent: 105000, utilities: 16500, total: 121500 }
    ],
    '12M': [
      { label: 'Jan', rent: 85000, utilities: 12000, total: 97000 },
      { label: 'Feb', rent: 88000, utilities: 12500, total: 100500 },
      { label: 'Mar', rent: 92000, utilities: 13000, total: 105000 },
      { label: 'Apr', rent: 94000, utilities: 13500, total: 107500 },
      { label: 'May', rent: 96000, utilities: 14000, total: 110000 },
      { label: 'Jun', rent: 98000, utilities: 14200, total: 112200 },
      { label: 'Jul', rent: 102500, utilities: 15800, total: 118300 },
      { label: 'Aug', rent: 105000, utilities: 16500, total: 121500 }
    ]
  };

  const currentChartData = chartDatasets[revenueFilter];
  const maxTotal = Math.max(...currentChartData.map(d => d.total));

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
            Good morning, Jan <span className="text-2xl">👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Here's what's happening with <span className="text-teal-300 font-semibold">{property?.name || 'Boarding House'}</span> today.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab('rooms')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-[#101F23] hover:bg-white/[0.06] border border-white/[0.08] transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-teal-400" />
            Add Room
          </button>
          <button
            onClick={() => setActiveTab('tenants')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-400 hover:opacity-90 shadow-md shadow-teal-500/20 transition-all cursor-pointer"
          >
            <Users className="w-3.5 h-3.5" />
            Manage Tenants
          </button>
        </div>
      </div>

      {/* Pending Payment Verification Notice Banner */}
      {pendingPayments.length > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-[#101F23] to-[#101F23] border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg shadow-amber-500/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-100 flex items-center gap-2">
                <span>{pendingPayments.length} Payment Verification Required</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                  GCash & Maya
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {pendingPayments[0].tenantName} uploaded payment proof for Room {pendingPayments[0].roomNumber} ({formatPHP(pendingPayments[0].amount)}).
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('verification')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors shrink-0 shadow-md shadow-amber-500/20"
          >
            Review & Approve <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* KPI CARDS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3.5">
        {/* Total Rooms */}
        <div className="p-4 rounded-2xl bg-[#101F23] border border-white/[0.06] hover:border-teal-500/30 transition-all group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Total Rooms</span>
            <BedDouble className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-extrabold text-slate-100 font-mono">{totalRooms}</div>
          <p className="text-[10px] text-slate-400 mt-1">3 Floors total</p>
        </div>

        {/* Occupied */}
        <div className="p-4 rounded-2xl bg-[#101F23] border border-white/[0.06] hover:border-emerald-500/30 transition-all group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Occupied</span>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">{occupiedRooms}</div>
          <p className="text-[10px] text-emerald-400/80 mt-1">Active residents</p>
        </div>

        {/* Available */}
        <div className="p-4 rounded-2xl bg-[#101F23] border border-white/[0.06] hover:border-teal-500/30 transition-all group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Available</span>
            <span className="w-2 h-2 rounded-full bg-teal-400" />
          </div>
          <div className="text-2xl font-extrabold text-teal-300 font-mono">{availableRooms}</div>
          <p className="text-[10px] text-teal-300/80 mt-1">Ready for move-in</p>
        </div>

        {/* Occupancy Rate */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-950/30 via-[#101F23] to-[#101F23] border border-teal-500/30 transition-all">
          <div className="flex items-center justify-between text-teal-300 mb-2">
            <span className="text-xs font-semibold">Occupancy Rate</span>
            <TrendingUp className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-extrabold text-teal-300 font-mono">{occupancyRate}%</div>
          <p className="text-[10px] text-teal-400/80 mt-1">+4% vs last month</p>
        </div>

        {/* Monthly Revenue */}
        <div className="p-4 rounded-2xl bg-[#101F23] border border-white/[0.06] hover:border-teal-500/30 transition-all group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Monthly Revenue</span>
            <CreditCard className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-100 font-mono">
            {formatPHP(monthlyRevenue)}
          </div>
          <p className="text-[10px] text-teal-400 mt-1 flex items-center gap-0.5 font-semibold">
            <ArrowUpRight className="w-3 h-3" /> Collected this mo.
          </p>
        </div>

        {/* Outstanding Balance */}
        <div className="p-4 rounded-2xl bg-[#101F23] border border-white/[0.06] hover:border-rose-500/30 transition-all group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Outstanding</span>
            <AlertCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-rose-400 font-mono">
            {formatPHP(outstandingBalance)}
          </div>
          <p className="text-[10px] text-rose-400/80 mt-1">Rent & utilities due</p>
        </div>
      </div>

      {/* 2-COLUMN SECTION: REVENUE CHART & OCCUPANCY BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* REVENUE OVERVIEW INTERACTIVE CHART (2 COLUMNS) */}
        <div className="lg:col-span-2 rounded-2xl bg-[#101F23] border border-white/[0.06] p-5 sm:p-6 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <span>Revenue Overview</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/25">
                    Philippine Pesos (PHP)
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Income trajectory separated by room rent and shared utility collections.
                </p>
              </div>

              {/* Chart Filters */}
              <div className="flex items-center p-1 rounded-xl bg-[#0B171B] border border-white/[0.08]">
                {(['7D', '30D', '3M', '12M'] as const).map(filter => (
                  <button
                    key={filter}
                    onClick={() => setRevenueFilter(filter)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                      revenueFilter === filter
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Bar/Area Chart Display */}
            <div className="relative pt-6 pb-2">
              {/* Tooltip on hover */}
              {hoveredDataPoint && (
                <div className="absolute top-0 right-4 p-2.5 rounded-xl bg-[#071014] border border-teal-500/40 shadow-xl text-xs z-10 animate-in fade-in duration-100">
                  <div className="font-bold text-slate-200 mb-1">{hoveredDataPoint.label}</div>
                  <div className="flex items-center justify-between gap-4 text-teal-300 font-mono text-[11px]">
                    <span>Rent:</span>
                    <span>{formatPHP(hoveredDataPoint.rent)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-cyan-300 font-mono text-[11px]">
                    <span>Utilities:</span>
                    <span>{formatPHP(hoveredDataPoint.utilities)}</span>
                  </div>
                  <div className="border-t border-white/10 mt-1 pt-1 flex items-center justify-between gap-4 font-bold text-slate-100 font-mono">
                    <span>Total:</span>
                    <span>{formatPHP(hoveredDataPoint.total)}</span>
                  </div>
                </div>
              )}

              {/* Chart Bars */}
              <div className="h-48 flex items-end gap-3 sm:gap-6 pt-4 border-b border-white/[0.08]">
                {currentChartData.map((d, index) => {
                  const rentHeight = maxTotal > 0 ? (d.rent / maxTotal) * 100 : 0;
                  const utilHeight = maxTotal > 0 ? (d.utilities / maxTotal) * 100 : 0;
                  const isHovered = hoveredDataPoint?.label === d.label;

                  return (
                    <div
                      key={index}
                      className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                      onMouseEnter={() => setHoveredDataPoint(d)}
                      onMouseLeave={() => setHoveredDataPoint(null)}
                    >
                      <div className="w-full max-w-[48px] flex flex-col justify-end h-full relative">
                        {/* Stacked Bars */}
                        <div
                          className="w-full rounded-t-lg overflow-hidden flex flex-col justify-end transition-all duration-300 group-hover:brightness-125"
                          style={{ height: `${(d.total / maxTotal) * 100}%` }}
                        >
                          {/* Utilities top portion */}
                          <div
                            className="w-full bg-cyan-400 transition-all"
                            style={{ height: `${(d.utilities / d.total) * 100}%` }}
                          />
                          {/* Rent bottom portion */}
                          <div
                            className="w-full bg-gradient-to-t from-teal-600 to-teal-400 transition-all"
                            style={{ height: `${(d.rent / d.total) * 100}%` }}
                          />
                        </div>
                      </div>
                      <span className={`text-[10px] mt-2 font-medium tracking-tight ${isHovered ? 'text-teal-300 font-bold' : 'text-slate-400'}`}>
                        {d.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Chart Legend */}
          <div className="flex items-center justify-between pt-4 text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-teal-500" />
                <span>Room Rent</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-cyan-400" />
                <span>Utility Surcharges</span>
              </div>
            </div>
            <span className="text-[11px] font-mono text-teal-400">
              Hover bar for exact ₱ breakdown
            </span>
          </div>
        </div>

        {/* OCCUPANCY OVERVIEW CARD (1 COLUMN) */}
        <div className="rounded-2xl bg-[#101F23] border border-white/[0.06] p-5 sm:p-6 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-100">Occupancy Overview</h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20">
                Floor 1-3
              </span>
            </div>

            {/* Circular / Horizontal Progress Summary */}
            <div className="p-4 rounded-xl bg-[#0B171B] border border-white/[0.06] text-center my-2">
              <div className="text-4xl font-extrabold text-teal-300 font-mono tracking-tight">
                {occupancyRate}%
              </div>
              <div className="text-xs font-bold text-slate-200 mt-1">
                {occupiedRooms} / {totalRooms} Rooms Occupied
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {availableRooms} room{availableRooms !== 1 ? 's' : ''} vacant • {reservedRooms} reserved
              </p>

              {/* Progress Bar */}
              <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex mt-4 p-0.5">
                <div
                  className="h-full bg-teal-400 rounded-l-full"
                  style={{ width: `${(occupiedRooms / totalRooms) * 100}%` }}
                  title={`Occupied: ${occupiedRooms}`}
                />
                <div
                  className="h-full bg-cyan-400"
                  style={{ width: `${(reservedRooms / totalRooms) * 100}%` }}
                  title={`Reserved: ${reservedRooms}`}
                />
                <div
                  className="h-full bg-amber-400"
                  style={{ width: `${(maintenanceRooms / totalRooms) * 100}%` }}
                  title={`Maintenance: ${maintenanceRooms}`}
                />
                <div
                  className="h-full bg-slate-600 rounded-r-full"
                  style={{ width: `${(availableRooms / totalRooms) * 100}%` }}
                  title={`Available: ${availableRooms}`}
                />
              </div>
            </div>

            {/* Breakdown List */}
            <div className="space-y-2.5 mt-4 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
                  <span className="text-slate-300 font-medium">Occupied</span>
                </div>
                <span className="font-mono font-bold text-slate-100">{occupiedRooms} Rooms</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  <span className="text-slate-300 font-medium">Reserved</span>
                </div>
                <span className="font-mono font-bold text-slate-100">{reservedRooms} Rooms</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                  <span className="text-slate-300 font-medium">Available</span>
                </div>
                <span className="font-mono font-bold text-slate-100">{availableRooms} Rooms</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="text-slate-300 font-medium">Maintenance</span>
                </div>
                <span className="font-mono font-bold text-slate-100">{maintenanceRooms} Rooms</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('rooms')}
            className="w-full mt-4 py-2 rounded-xl text-xs font-bold text-teal-300 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/25 transition-colors flex items-center justify-center gap-1"
          >
            Open Interactive Floor Map <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* RECENT PAYMENTS TABLE */}
      <div className="rounded-2xl bg-[#101F23] border border-white/[0.06] p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-100">Recent Payment Transactions</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live transaction ledger across GCash, Maya, Bank Transfer, and Over-the-counter Cash.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('payments')}
            className="text-xs font-bold text-teal-400 hover:underline flex items-center gap-1"
          >
            View All Ledger <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Tenant</th>
                <th className="py-3 px-3">Room</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3">Type & Channel</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-slate-200">
              {payments.slice(0, 6).map(payment => (
                <tr key={payment.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-300 font-bold text-[10px] flex items-center justify-center">
                        {payment.tenantName.charAt(0)}
                      </div>
                      <span>{payment.tenantName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono font-medium text-teal-300">
                    Room {payment.roomNumber}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-100">
                    {formatPHP(payment.amount)}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-slate-200">
                      {payment.type === 'RENT_UTILITIES' ? 'Rent + Utilities' : payment.type}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      {payment.method} • {payment.referenceNumber}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400 font-mono">
                    {formatDate(payment.date)}
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge type="payment" status={payment.status} size="sm" />
                  </td>
                  <td className="py-3 px-3 text-right">
                    {payment.status === 'PAID' ? (
                      <button
                        onClick={() => setSelectedReceipt(payment)}
                        className="px-2.5 py-1 rounded-lg bg-teal-500/10 text-teal-300 hover:bg-teal-500/20 border border-teal-500/30 text-[11px] font-semibold transition-colors"
                      >
                        Receipt #{payment.receiptNumber.split('-').pop()}
                      </button>
                    ) : payment.status === 'PENDING' ? (
                      <button
                        onClick={() => setActiveTab('verification')}
                        className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 text-[11px] font-bold transition-colors"
                      >
                        Verify Proof
                      </button>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
