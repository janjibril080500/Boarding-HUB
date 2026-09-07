import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  Search,
  Filter,
  DollarSign,
  TrendingDown,
  Calendar,
  Building,
  Tag,
  Download,
  Printer
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatPHP, formatDate } from '../../utils/formatters';

export const ExpensesView: React.FC = () => {
  const { expenses, addExpense, addToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newExpense, setNewExpense] = useState({
    title: '',
    category: 'MAINTENANCE' as const,
    amount: 1500,
    date: new Date().toISOString().split('T')[0],
    paidTo: 'Kuya Boy Maintenance',
    paymentMethod: 'CASH' as const,
    receiptNumber: `EXP-${Date.now().toString().slice(-4)}`,
    notes: ''
  });

  const filteredExpenses = expenses.filter(exp => {
    const matchesSearch = exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.paidTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || exp.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalSpent = filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.title || !newExpense.amount) return;

    addExpense(newExpense);
    addToast({
      title: 'Expense Logged',
      message: `Successfully logged ${formatPHP(newExpense.amount)} for "${newExpense.title}".`,
      type: 'success'
    });
    setIsModalOpen(false);
    setNewExpense({
      title: '',
      category: 'MAINTENANCE',
      amount: 1500,
      date: new Date().toISOString().split('T')[0],
      paidTo: 'Kuya Boy Maintenance',
      paymentMethod: 'CASH',
      receiptNumber: `EXP-${Date.now().toString().slice(-4)}`,
      notes: ''
    });
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
            Expenses & Operating Outflow
            <span className="text-xs px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 font-bold font-mono">
              {expenses.length} Records
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track caretaker salaries, electricity bills, PLDT internet, cleaning supplies, and repair contractor costs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-400 hover:opacity-90 shadow-md shadow-teal-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Log New Expense
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-[#101F23] border border-rose-500/20">
          <span className="text-xs text-rose-300 font-semibold">Total Filtered Outflow</span>
          <div className="text-2xl font-extrabold text-rose-400 font-mono mt-1">
            {formatPHP(totalSpent)}
          </div>
          <span className="text-[10px] text-slate-400">All categories</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#101F23] border border-white/[0.06]">
          <span className="text-xs text-slate-400 font-semibold">Staff & Caretaker</span>
          <div className="text-2xl font-extrabold text-slate-100 font-mono mt-1">
            {formatPHP(expenses.filter(e => e.category === 'STAFF').reduce((a, b) => a + b.amount, 0))}
          </div>
          <span className="text-[10px] text-teal-400">Monthly payroll</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#101F23] border border-white/[0.06]">
          <span className="text-xs text-slate-400 font-semibold">Utilities Paid</span>
          <div className="text-2xl font-extrabold text-slate-100 font-mono mt-1">
            {formatPHP(expenses.filter(e => e.category === 'UTILITIES').reduce((a, b) => a + b.amount, 0))}
          </div>
          <span className="text-[10px] text-cyan-400">Electric & Water bills</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#101F23] border border-white/[0.06]">
          <span className="text-xs text-slate-400 font-semibold">Repairs & Maintenance</span>
          <div className="text-2xl font-extrabold text-slate-100 font-mono mt-1">
            {formatPHP(expenses.filter(e => e.category === 'MAINTENANCE').reduce((a, b) => a + b.amount, 0))}
          </div>
          <span className="text-[10px] text-amber-400">Parts & Labor</span>
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
            placeholder="Search expense description, payee, receipt..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0B171B] border border-white/[0.08] text-xs text-slate-100 placeholder-slate-500 focus:border-teal-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#0B171B] border border-white/[0.08] text-slate-200 font-medium focus:border-teal-500 focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="MAINTENANCE">Maintenance & Repairs</option>
            <option value="UTILITIES">Utilities (Davao Light / Water)</option>
            <option value="STAFF">Staff & Caretakers</option>
            <option value="SUPPLIES">Cleaning & Supplies</option>
            <option value="TAXES">Barangay & Taxes</option>
            <option value="INTERNET">Internet & WiFi</option>
          </select>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="rounded-2xl bg-[#101F23] border border-white/[0.06] shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] text-slate-400 font-semibold uppercase tracking-wider text-[10px] bg-[#0B171B]">
                <th className="py-3 px-4">Receipt Ref</th>
                <th className="py-3 px-4">Expense Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Paid To</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-slate-200">
              {filteredExpenses.map(exp => (
                <tr key={exp.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-300">{exp.receiptNumber}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-100">{exp.title}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20 text-[10px] font-bold">
                      {exp.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{exp.paidTo}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-rose-400">{formatPHP(exp.amount)}</td>
                  <td className="py-3.5 px-4 text-slate-400">{exp.paymentMethod}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">{formatDate(exp.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-100">
          <div className="w-full max-w-md rounded-2xl bg-[#0B171B] border border-teal-500/30 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-teal-400" />
              Log Property Expense
            </h3>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Expense Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Davao Light Electric Bill, Floor 2 Mops"
                  value={newExpense.title}
                  onChange={e => setNewExpense({ ...newExpense, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#101F23] border border-white/[0.08] text-slate-100 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Amount (PHP) *</label>
                  <input
                    type="number"
                    required
                    value={newExpense.amount}
                    onChange={e => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-[#101F23] border border-white/[0.08] text-slate-100 font-mono focus:border-teal-500 focus:outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={newExpense.category}
                    onChange={e => setNewExpense({ ...newExpense, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-[#101F23] border border-white/[0.08] text-slate-100 focus:border-teal-500 focus:outline-none"
                  >
                    <option value="MAINTENANCE">Maintenance & Repairs</option>
                    <option value="UTILITIES">Utilities (Electric/Water)</option>
                    <option value="STAFF">Staff & Caretaker Salary</option>
                    <option value="SUPPLIES">Cleaning & House Supplies</option>
                    <option value="INTERNET">Internet & Fiber Link</option>
                    <option value="TAXES">Barangay Permits & Taxes</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Paid To</label>
                  <input
                    type="text"
                    value={newExpense.paidTo}
                    onChange={e => setNewExpense({ ...newExpense, paidTo: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#101F23] border border-white/[0.08] text-slate-100 focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Payment Method</label>
                  <select
                    value={newExpense.paymentMethod}
                    onChange={e => setNewExpense({ ...newExpense, paymentMethod: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-[#101F23] border border-white/[0.08] text-slate-100 focus:border-teal-500 focus:outline-none"
                  >
                    <option value="CASH">Cash</option>
                    <option value="GCASH">GCash</option>
                    <option value="MAYA">Maya</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                  </select>
                </div>
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
                  Save Expense Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
