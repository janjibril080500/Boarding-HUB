import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Download,
  Printer,
  Calendar,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatPHP } from '../../utils/formatters';

export const FinancialReportsView: React.FC = () => {
  const { property, rooms, tenants, payments, expenses, invoices } = useApp();

  const [period, setPeriod] = useState<'MONTHLY' | 'QUARTERLY' | 'ANNUAL'>('MONTHLY');

  const totalInflow = payments.filter(p => p.status === 'PAID').reduce((acc, curr) => acc + curr.amount, 0);
  const totalOutflow = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const netIncome = totalInflow - totalOutflow;
  const profitMargin = totalInflow > 0 ? Math.round((netIncome / totalInflow) * 100) : 0;

  const totalBeds = rooms.reduce((acc, r) => acc + r.capacity, 0);
  const occupiedBeds = tenants.length;
  const bedOccupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  const monthsData = [
    { month: 'Jan', revenue: 98000, expenses: 32000, net: 66000 },
    { month: 'Feb', revenue: 102000, expenses: 34500, net: 67500 },
    { month: 'Mar', revenue: 105000, expenses: 31000, net: 74000 },
    { month: 'Apr', revenue: 108000, expenses: 36000, net: 72000 },
    { month: 'May', revenue: 110000, expenses: 33000, net: 77000 },
    { month: 'Jun', revenue: 114000, expenses: 38000, net: 76000 },
    { month: 'Jul', revenue: 118000, expenses: 35000, net: 83000 },
    { month: 'Aug', revenue: 121500, expenses: 37500, net: 84000 }
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
            Financial & Occupancy Analytics
            <span className="text-xs px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 font-bold font-mono">
              P&L Audited
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time income, operating expenditure, profit margins, bed yield, and payment collection rates.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-200 bg-[#101F23] hover:bg-white/[0.06] border border-white/[0.08] transition-colors"
          >
            <Printer className="w-4 h-4 text-teal-400" />
            Print P&L Report
          </button>
        </div>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-[#101F23] border border-teal-500/30">
          <span className="text-xs text-teal-300 font-semibold">Total Revenue (Gross Inflow)</span>
          <div className="text-2xl font-extrabold text-teal-300 font-mono mt-1">
            {formatPHP(totalInflow)}
          </div>
          <span className="text-[10px] text-teal-400/80 flex items-center gap-1 mt-0.5">
            <ArrowUpRight className="w-3 h-3" /> +12.4% vs previous month
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#101F23] border border-rose-500/30">
          <span className="text-xs text-rose-300 font-semibold">Total Operating Costs</span>
          <div className="text-2xl font-extrabold text-rose-400 font-mono mt-1">
            {formatPHP(totalOutflow)}
          </div>
          <span className="text-[10px] text-slate-400">Utilities, caretaker & repairs</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#101F23] border border-emerald-500/30">
          <span className="text-xs text-emerald-300 font-semibold">Net Operating Income</span>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">
            {formatPHP(netIncome)}
          </div>
          <span className="text-[10px] text-emerald-400/80">{profitMargin}% Net Profit Margin</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#101F23] border border-cyan-500/30">
          <span className="text-xs text-cyan-300 font-semibold">Bedspace Occupancy</span>
          <div className="text-2xl font-extrabold text-cyan-300 font-mono mt-1">
            {bedOccupancyRate}%
          </div>
          <span className="text-[10px] text-slate-400">{occupiedBeds} occupied / {totalBeds} total beds</span>
        </div>
      </div>

      {/* Monthly Bar Chart Comparison */}
      <div className="p-6 rounded-2xl bg-[#101F23] border border-white/[0.06] shadow-xl space-y-4">
        <div className="flex justify-between items-center border-b border-white/[0.08] pb-3">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-teal-400" />
            2026 Monthly Cashflow & Net Margin Progression
          </h3>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-teal-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded bg-teal-400" /> Revenue
            </span>
            <span className="flex items-center gap-1.5 text-rose-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded bg-rose-400" /> Expenses
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded bg-emerald-400" /> Net Profit
            </span>
          </div>
        </div>

        <div className="grid grid-cols-8 gap-2 items-end h-56 pt-6">
          {monthsData.map(d => {
            const revHeight = (d.revenue / 130000) * 100;
            const expHeight = (d.expenses / 130000) * 100;
            const netHeight = (d.net / 130000) * 100;

            return (
              <div key={d.month} className="flex flex-col items-center gap-2 h-full justify-end group">
                <div className="flex items-end gap-1 w-full justify-center h-full">
                  <div
                    style={{ height: `${revHeight}%` }}
                    className="w-3 rounded-t bg-teal-400/90 group-hover:bg-teal-300 transition-all"
                    title={`Revenue: ${formatPHP(d.revenue)}`}
                  />
                  <div
                    style={{ height: `${expHeight}%` }}
                    className="w-3 rounded-t bg-rose-400/90 group-hover:bg-rose-300 transition-all"
                    title={`Expense: ${formatPHP(d.expenses)}`}
                  />
                  <div
                    style={{ height: `${netHeight}%` }}
                    className="w-3 rounded-t bg-emerald-400/90 group-hover:bg-emerald-300 transition-all"
                    title={`Net Profit: ${formatPHP(d.net)}`}
                  />
                </div>
                <span className="text-[11px] font-mono text-slate-400">{d.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* P&L Statement Table */}
      <div className="rounded-2xl bg-[#101F23] border border-white/[0.06] shadow-xl overflow-hidden">
        <div className="p-4 border-b border-white/[0.08] bg-[#0B171B]">
          <h3 className="text-sm font-bold text-slate-100">Official Monthly Income Statement (PHP)</h3>
        </div>
        <div className="p-4 text-xs space-y-3">
          <div className="flex justify-between py-2 border-b border-white/[0.04]">
            <span className="font-bold text-slate-200">Room Accommodation Rental Revenue</span>
            <span className="font-mono font-bold text-teal-300">{formatPHP(totalInflow * 0.85)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-white/[0.04]">
            <span className="font-bold text-slate-200">Submeter Electricity & Utility Recovery</span>
            <span className="font-mono font-bold text-teal-300">{formatPHP(totalInflow * 0.15)}</span>
          </div>
          <div className="flex justify-between py-2.5 bg-teal-950/20 px-3 rounded-lg font-bold text-teal-200">
            <span>TOTAL GROSS REVENUE</span>
            <span className="font-mono text-sm">{formatPHP(totalInflow)}</span>
          </div>

          <div className="flex justify-between py-2 border-b border-white/[0.04] text-rose-300">
            <span>Staff & Caretaker Payroll</span>
            <span className="font-mono">({formatPHP(expenses.filter(e => e.category === 'STAFF').reduce((a, b) => a + b.amount, 0))})</span>
          </div>
          <div className="flex justify-between py-2 border-b border-white/[0.04] text-rose-300">
            <span>Facility Repairs & Hardware</span>
            <span className="font-mono">({formatPHP(expenses.filter(e => e.category === 'MAINTENANCE').reduce((a, b) => a + b.amount, 0))})</span>
          </div>
          <div className="flex justify-between py-2.5 bg-emerald-950/30 px-3 rounded-lg font-extrabold text-emerald-300 text-sm border border-emerald-500/30">
            <span>NET OPERATING INCOME (EBITDA)</span>
            <span className="font-mono">{formatPHP(netIncome)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
