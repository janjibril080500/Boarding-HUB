import React, { useState } from 'react';
import {
  Settings,
  Building2,
  Zap,
  Droplets,
  Wifi,
  Save,
  ShieldAlert,
  Sliders,
  BedDouble,
  Minus,
  Plus,
  ArrowRight,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Grid
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatPHP } from '../../utils/formatters';

export const PropertySettingsView: React.FC = () => {
  const {
    property,
    rooms,
    updateProperty,
    setRoomBedCapacity,
    batchSetTotalRooms,
    batchUpdateRooms,
    setActiveTab,
    addToast
  } = useApp();

  const [formData, setFormData] = useState({
    name: property?.name || 'Boarding House',
    tagline: property?.tagline || '',
    address: property?.address || '42 Acacia Street',
    city: property?.city || 'Davao City',
    province: property?.province || 'Davao del Sur',
    contactNumber: property?.contactNumber || '+63 917 845 2931',
    email: property?.email || 'owner@boardinghub.ph',
    totalFloors: property?.totalFloors || 3,
    defaultMonthlyRent: property?.defaultMonthlyRent || 3500,
    electricityRate: property?.electricityRate || 12.5,
    waterRate: property?.waterRate || 180,
    wifiFlatRate: property?.wifiFlatRate || 250,
    rentDueDateDay: property?.rentDueDateDay || 5,
    gracePeriodDays: property?.gracePeriodDays || 3,
    lateFeeAmount: property?.lateFeeAmount || 200
  });

  // Room count setting state
  const [targetRoomsCount, setTargetRoomsCount] = useState<number>(rooms.length);
  const [defaultBedsPerRoom, setDefaultBedsPerRoom] = useState<number>(4);
  const [isRoomBedTableExpanded, setIsRoomBedTableExpanded] = useState<boolean>(true);

  // Local state for inline room bed edits
  const [localRoomBeds, setLocalRoomBeds] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    rooms.forEach(r => {
      map[r.id] = r.capacity;
    });
    return map;
  });

  const totalBeds = rooms.reduce((acc, r) => acc + (localRoomBeds[r.id] ?? r.capacity), 0);
  const occupiedBeds = rooms.reduce((acc, r) => acc + r.occupiedBeds, 0);

  const handleSaveGeneralSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateProperty(formData);
    addToast({
      title: 'Settings Saved',
      message: 'Property configuration and utility tariff rates have been updated.',
      type: 'success'
    });
  };

  const handleApplyRoomCountChange = () => {
    batchSetTotalRooms(targetRoomsCount, {
      defaultCapacity: defaultBedsPerRoom,
      defaultRent: formData.defaultMonthlyRent,
      floors: formData.totalFloors
    });
  };

  const handleUpdateBedCount = (roomId: string, delta: number) => {
    setLocalRoomBeds(prev => {
      const current = prev[roomId] ?? rooms.find(r => r.id === roomId)?.capacity ?? 4;
      const next = Math.max(1, Math.min(20, current + delta));
      // Save directly to AppContext
      setRoomBedCapacity(roomId, next);
      return { ...prev, [roomId]: next };
    });
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
            Property & Room Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configure property details, adjust number of rooms, customize bed capacity per unit, and set utility tariffs.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('rooms')}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-teal-300 bg-[#101F23] border border-teal-500/30 hover:bg-teal-500/10 transition-all cursor-pointer self-start sm:self-auto"
        >
          <span>View Room Map</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* SECTION 1: ROOMS & BED CAPACITY CONFIGURATION */}
      <div className="p-6 rounded-2xl bg-[#101F23] border border-teal-500/30 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.08] pb-3.5">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <BedDouble className="w-4 h-4 text-teal-400" />
            Rooms & Bed Capacity Configuration
          </h3>
          <span className="text-xs text-teal-300 font-mono font-semibold">
            {rooms.length} Active Rooms • {totalBeds} Total Beds
          </span>
        </div>

        {/* Room Count Adjustment Box */}
        <div className="p-4 rounded-xl bg-[#0B171B] border border-white/[0.08] space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-slate-200 block">
                Total Number of Rooms
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Set how many room units your boarding house operates.
              </p>
            </div>

            {/* Stepper + Quick Action */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center bg-[#101F23] rounded-xl border border-white/[0.08] p-1">
                <button
                  type="button"
                  onClick={() => setTargetRoomsCount(prev => Math.max(1, prev - 1))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-rose-400 hover:bg-white/[0.06] transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={targetRoomsCount}
                  onChange={e => setTargetRoomsCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                  className="w-16 text-center font-mono font-bold text-base text-teal-300 bg-transparent focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setTargetRoomsCount(prev => Math.min(100, prev + 1))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-teal-300 hover:bg-white/[0.06] transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleApplyRoomCountChange}
                disabled={targetRoomsCount === rooms.length}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-400 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-teal-500/20 transition-all cursor-pointer"
              >
                Apply Room Count ({targetRoomsCount})
              </button>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-white/[0.04]">
            <span className="text-[11px] text-slate-400 mr-2">Quick Presets:</span>
            {[10, 15, 20, 25, 30, 40, 50].map(cnt => (
              <button
                key={cnt}
                type="button"
                onClick={() => setTargetRoomsCount(cnt)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                  targetRoomsCount === cnt
                    ? 'bg-teal-500/20 border border-teal-500/40 text-teal-300'
                    : 'bg-[#101F23] border border-white/[0.06] text-slate-400 hover:text-slate-200'
                }`}
              >
                {cnt} Rooms
              </button>
            ))}
          </div>
        </div>

        {/* Bed Capacity Controls per Room (Expandable Table) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <Grid className="w-4 h-4 text-cyan-400" />
              Edit Number of Beds for Each Room Unit
            </span>

            <button
              type="button"
              onClick={() => setIsRoomBedTableExpanded(!isRoomBedTableExpanded)}
              className="text-xs text-teal-300 hover:text-teal-200 flex items-center gap-1 cursor-pointer"
            >
              <span>{isRoomBedTableExpanded ? 'Hide Table' : 'Show All Rooms'}</span>
              {isRoomBedTableExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {isRoomBedTableExpanded && (
            <div className="border border-white/[0.08] rounded-xl overflow-hidden bg-[#0B171B]">
              <div className="max-h-80 overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="sticky top-0 bg-[#101F23] border-b border-white/[0.08] text-[10px] text-slate-400 uppercase font-semibold">
                    <tr>
                      <th className="p-3">Room Unit</th>
                      <th className="p-3">Floor</th>
                      <th className="p-3">Number of Beds (Capacity)</th>
                      <th className="p-3">Current Residents</th>
                      <th className="p-3">Monthly Rent</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {rooms.map(room => {
                      const currentBeds = localRoomBeds[room.id] ?? room.capacity;
                      return (
                        <tr key={room.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-3 font-bold text-slate-100 font-mono">
                            Room {room.roomNumber}
                          </td>
                          <td className="p-3 text-slate-400">
                            Floor {room.floor}
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center bg-[#101F23] rounded-lg border border-white/[0.08] p-0.5">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateBedCount(room.id, -1)}
                                  disabled={currentBeds <= 1 || room.occupiedBeds > currentBeds - 1}
                                  className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-rose-400 disabled:opacity-30 transition-colors"
                                  title="Decrease beds"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="font-mono font-bold text-teal-300 w-8 text-center text-xs">
                                  {currentBeds}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateBedCount(room.id, 1)}
                                  disabled={currentBeds >= 20}
                                  className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-teal-300 transition-colors"
                                  title="Increase beds"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                              <span className="text-[11px] text-slate-400">
                                Bed spaces
                              </span>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="font-mono text-slate-300">
                              {room.occupiedBeds} occupied
                            </span>
                          </td>
                          <td className="p-3 font-mono text-teal-300 font-semibold">
                            {formatPHP(room.monthlyRent)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: GENERAL PROPERTY IDENTITY FORM */}
      <form onSubmit={handleSaveGeneralSettings} className="space-y-6 text-xs">
        <div className="p-6 rounded-2xl bg-[#101F23] border border-white/[0.08] shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 border-b border-white/[0.06] pb-3">
            <Building2 className="w-4 h-4 text-teal-400" />
            General Boarding House Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Property Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#0B171B] border border-white/[0.08] text-slate-100 focus:border-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Tagline / Subheading</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#0B171B] border border-white/[0.08] text-slate-100 focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-semibold mb-1">Street Address *</label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#0B171B] border border-white/[0.08] text-slate-100 focus:border-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">City / Municipality *</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={e => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#0B171B] border border-white/[0.08] text-slate-100 focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Total Floors</label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.totalFloors}
                onChange={e => setFormData({ ...formData, totalFloors: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 rounded-xl bg-[#0B171B] border border-white/[0.08] text-slate-100 font-mono focus:border-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Default Monthly Rent (₱)</label>
              <input
                type="number"
                step="100"
                value={formData.defaultMonthlyRent}
                onChange={e => setFormData({ ...formData, defaultMonthlyRent: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl bg-[#0B171B] border border-white/[0.08] text-slate-100 font-mono focus:border-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Province *</label>
              <input
                type="text"
                required
                value={formData.province}
                onChange={e => setFormData({ ...formData, province: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#0B171B] border border-white/[0.08] text-slate-100 focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Contact Phone / GCash *</label>
              <input
                type="text"
                required
                value={formData.contactNumber}
                onChange={e => setFormData({ ...formData, contactNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#0B171B] border border-white/[0.08] text-slate-100 focus:border-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Official Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#0B171B] border border-white/[0.08] text-slate-100 focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: UTILITY TARIFF RATES */}
        <div className="p-6 rounded-2xl bg-[#101F23] border border-white/[0.08] shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 border-b border-white/[0.06] pb-3">
            <Zap className="w-4 h-4 text-amber-400" />
            Utility & Billing Tariff Defaults
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Electricity Rate (₱ / kWh)</label>
              <input
                type="number"
                step="0.1"
                value={formData.electricityRate}
                onChange={e => setFormData({ ...formData, electricityRate: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl bg-[#0B171B] border border-white/[0.08] text-slate-100 font-mono focus:border-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Water Rate (₱ / tenant / mo)</label>
              <input
                type="number"
                value={formData.waterRate}
                onChange={e => setFormData({ ...formData, waterRate: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl bg-[#0B171B] border border-white/[0.08] text-slate-100 font-mono focus:border-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Wi-Fi Share (₱ / mo)</label>
              <input
                type="number"
                value={formData.wifiFlatRate}
                onChange={e => setFormData({ ...formData, wifiFlatRate: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl bg-[#0B171B] border border-white/[0.08] text-slate-100 font-mono focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Rent Due Date (Day of Month)</label>
              <input
                type="number"
                min="1"
                max="31"
                value={formData.rentDueDateDay}
                onChange={e => setFormData({ ...formData, rentDueDateDay: parseInt(e.target.value) || 5 })}
                className="w-full px-3 py-2 rounded-xl bg-[#0B171B] border border-white/[0.08] text-slate-100 font-mono focus:border-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Grace Period (Days)</label>
              <input
                type="number"
                value={formData.gracePeriodDays}
                onChange={e => setFormData({ ...formData, gracePeriodDays: parseInt(e.target.value) || 3 })}
                className="w-full px-3 py-2 rounded-xl bg-[#0B171B] border border-white/[0.08] text-slate-100 font-mono focus:border-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Late Payment Penalty (PHP)</label>
              <input
                type="number"
                value={formData.lateFeeAmount}
                onChange={e => setFormData({ ...formData, lateFeeAmount: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl bg-[#0B171B] border border-white/[0.08] text-slate-100 font-mono focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-400 hover:opacity-90 shadow-md shadow-teal-500/20 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Save Configuration Changes
          </button>
        </div>
      </form>
    </div>
  );
};
