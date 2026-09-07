import React, { useState } from 'react';
import {
  Zap,
  Droplets,
  Wifi,
  Calculator,
  Plus,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Download
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatPHP } from '../../utils/formatters';

export const UtilitiesManagementView: React.FC = () => {
  const { property, tenants, rooms, utilityReadings, recordUtilityReading, addToast } = useApp();

  const [selectedMonth, setSelectedMonth] = useState('August 2026');
  const [activeUtilityTab, setActiveUtilityTab] = useState<'ELECTRICITY' | 'WATER' | 'WIFI'>('ELECTRICITY');

  // Submeter reading state
  const [readings, setReadings] = useState([
    { roomNumber: '101', prevKwh: 420, currKwh: 485, rate: property.electricityRate || 12.5, tenantCount: 3 },
    { roomNumber: '102', prevKwh: 310, currKwh: 395, rate: property.electricityRate || 12.5, tenantCount: 4 },
    { roomNumber: '103', prevKwh: 200, currKwh: 260, rate: property.electricityRate || 12.5, tenantCount: 2 },
    { roomNumber: '104', prevKwh: 150, currKwh: 195, rate: property.electricityRate || 12.5, tenantCount: 4 },
    { roomNumber: '105', prevKwh: 280, currKwh: 340, rate: property.electricityRate || 12.5, tenantCount: 2 },
    { roomNumber: '201', prevKwh: 500, currKwh: 590, rate: property.electricityRate || 12.5, tenantCount: 4 },
    { roomNumber: '202', prevKwh: 380, currKwh: 460, rate: property.electricityRate || 12.5, tenantCount: 4 },
    { roomNumber: '205', prevKwh: 220, currKwh: 275, rate: property.electricityRate || 12.5, tenantCount: 2 },
    { roomNumber: '301', prevKwh: 450, currKwh: 530, rate: property.electricityRate || 12.5, tenantCount: 4 },
    { roomNumber: '305', prevKwh: 210, currKwh: 270, rate: property.electricityRate || 12.5, tenantCount: 2 }
  ]);

  const totalKwh = readings.reduce((acc, curr) => acc + (curr.currKwh - curr.prevKwh), 0);
  const totalElectricBill = totalKwh * (property.electricityRate || 12.5);

  const handleUpdateReading = (index: number, currKwh: number) => {
    const updated = [...readings];
    updated[index].currKwh = currKwh;
    setReadings(updated);
  };

  const handleApplyToInvoices = () => {
    addToast({
      title: 'Submeter Readings Applied',
      message: `Updated submeter electric charges across ${readings.length} rooms for ${selectedMonth}.`,
      type: 'success'
    });
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
            Utility & Submeter Billing
            <span className="text-xs px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 font-bold font-mono">
              PH Submeter Engine
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Compute individual room electricity submeters, distribute water utility shares, and manage high-speed fiber Wi-Fi.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleApplyToInvoices}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-400 hover:opacity-90 shadow-md shadow-teal-500/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            Apply to Next Invoices
          </button>
        </div>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-[#101F23] border border-amber-500/30">
          <span className="text-xs text-amber-300 font-semibold flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" /> Total Electric Consumption
          </span>
          <div className="text-2xl font-extrabold text-amber-300 font-mono mt-1">
            {totalKwh} kWh
          </div>
          <span className="text-[10px] text-slate-400">@ ₱{property.electricityRate || 12.50}/kWh = {formatPHP(totalElectricBill)}</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#101F23] border border-cyan-500/30">
          <span className="text-xs text-cyan-300 font-semibold flex items-center gap-1.5">
            <Droplets className="w-3.5 h-3.5" /> Water Bill Collection
          </span>
          <div className="text-2xl font-extrabold text-cyan-300 font-mono mt-1">
            {formatPHP((property.waterRate || 180) * tenants.length)}
          </div>
          <span className="text-[10px] text-slate-400">₱{property.waterRate || 180}/tenant × {tenants.length} tenants</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#101F23] border border-indigo-500/30">
          <span className="text-xs text-indigo-300 font-semibold flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5" /> Fiber Internet
          </span>
          <div className="text-2xl font-extrabold text-indigo-300 font-mono mt-1">
            500 Mbps
          </div>
          <span className="text-[10px] text-slate-400">PLDT Enterprise Dual Link</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#101F23] border border-white/[0.06]">
          <span className="text-xs text-slate-400 font-semibold">Total Utility Recovery</span>
          <div className="text-2xl font-extrabold text-teal-300 font-mono mt-1">
            {formatPHP(totalElectricBill + (property.waterRate || 180) * tenants.length)}
          </div>
          <span className="text-[10px] text-slate-400">100% tenant cost recovery</span>
        </div>
      </div>

      {/* Submeter Table */}
      <div className="rounded-2xl bg-[#101F23] border border-white/[0.06] shadow-xl overflow-hidden">
        <div className="p-4 border-b border-white/[0.08] flex items-center justify-between bg-[#0B171B]">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Zap className="w-4 h-4 text-teal-400" />
            Active Room Submeter Readings for {selectedMonth}
          </h3>
          <span className="text-xs text-slate-400">Rate: ₱{property.electricityRate || 12.50} / kWh</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] text-slate-400 font-semibold uppercase tracking-wider text-[10px] bg-[#0B171B]">
                <th className="py-3 px-4">Room No.</th>
                <th className="py-3 px-4">Occupants</th>
                <th className="py-3 px-4">Previous (kWh)</th>
                <th className="py-3 px-4">Current Reading (kWh)</th>
                <th className="py-3 px-4">Usage (kWh)</th>
                <th className="py-3 px-4">Total Amount (PHP)</th>
                <th className="py-3 px-4">Per Occupant Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-slate-200">
              {readings.map((r, idx) => {
                const consumed = Math.max(0, r.currKwh - r.prevKwh);
                const cost = consumed * r.rate;
                const perTenant = r.tenantCount > 0 ? cost / r.tenantCount : cost;

                return (
                  <tr key={r.roomNumber} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-teal-300">Room {r.roomNumber}</td>
                    <td className="py-3.5 px-4 text-slate-300">{r.tenantCount} residents</td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">{r.prevKwh}</td>
                    <td className="py-3.5 px-4">
                      <input
                        type="number"
                        value={r.currKwh}
                        onChange={e => handleUpdateReading(idx, parseFloat(e.target.value) || 0)}
                        className="w-24 px-2 py-1 rounded-lg bg-[#0B171B] border border-white/[0.1] text-slate-100 font-mono font-bold focus:border-teal-500 focus:outline-none"
                      />
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-300">{consumed} kWh</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-100">{formatPHP(cost)}</td>
                    <td className="py-3.5 px-4 font-mono text-teal-300">{formatPHP(perTenant)} / person</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
