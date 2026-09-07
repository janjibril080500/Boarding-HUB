import React, { useState, useEffect } from 'react';
import {
  BedDouble,
  Grid,
  Layers,
  Plus,
  Search,
  Users,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  X,
  Edit2,
  Trash2,
  DollarSign,
  Info,
  Sparkles,
  Sliders,
  Settings2,
  Maximize2,
  Minus,
  Save,
  Check,
  Building,
  RotateCcw,
  Copy,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Room, RoomStatus, FloorRoomConfig } from '../../types';
import { formatPHP } from '../../utils/formatters';
import { StatusBadge } from '../common/StatusBadge';

export const RoomsManagementView: React.FC = () => {
  const {
    property,
    rooms,
    tenants,
    addRoom,
    updateRoom,
    deleteRoom,
    setRoomBedCapacity,
    batchSetTotalRooms,
    batchUpdateRooms,
    setupRoomsByFloors,
    clearAllRooms,
    setActiveTab,
    setSelectedTenant,
    addToast
  } = useApp();

  const [viewMode, setViewMode] = useState<'GRID' | 'FLOOR'>('GRID');
  const [selectedFloor, setSelectedFloor] = useState<number | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<RoomStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // Modals
  const [isAddRoomOpen, setIsAddRoomOpen] = useState<boolean>(false);
  const [isEditRoomOpen, setIsEditRoomOpen] = useState<boolean>(false);
  const [isInventoryConfigOpen, setIsInventoryConfigOpen] = useState<boolean>(false);
  const [isConfirmClearOpen, setIsConfirmClearOpen] = useState<boolean>(false);

  // Floor-by-Floor Architect State (used for both empty setup and configuration modal)
  const [numFloors, setNumFloors] = useState<number>(property.totalFloors || 3);
  const [floorConfigs, setFloorConfigs] = useState<FloorRoomConfig[]>([
    { floor: 1, roomCount: 4, bedsPerRoom: 4, monthlyRent: property.defaultMonthlyRent || 3500, startRoomNumber: 101 },
    { floor: 2, roomCount: 4, bedsPerRoom: 4, monthlyRent: property.defaultMonthlyRent || 3500, startRoomNumber: 201 },
    { floor: 3, roomCount: 4, bedsPerRoom: 4, monthlyRent: property.defaultMonthlyRent || 3500, startRoomNumber: 301 }
  ]);

  // Synchronize floor configs when numFloors changes
  const handleSetNumFloors = (newCount: number) => {
    const validCount = Math.max(1, Math.min(10, newCount));
    setNumFloors(validCount);
    setFloorConfigs(prev => {
      const next: FloorRoomConfig[] = [];
      for (let f = 1; f <= validCount; f++) {
        const existing = prev.find(p => p.floor === f);
        if (existing) {
          next.push(existing);
        } else {
          const sample = prev[0] || { roomCount: 4, bedsPerRoom: 4, monthlyRent: 3500 };
          next.push({
            floor: f,
            roomCount: sample.roomCount || 4,
            bedsPerRoom: sample.bedsPerRoom || 4,
            monthlyRent: sample.monthlyRent || property.defaultMonthlyRent || 3500,
            startRoomNumber: f * 100 + 1
          });
        }
      }
      return next;
    });
  };

  const handleUpdateFloorConfig = (floorNum: number, field: keyof FloorRoomConfig, value: number) => {
    setFloorConfigs(prev =>
      prev.map(fc => {
        if (fc.floor !== floorNum) return fc;
        return {
          ...fc,
          [field]: value
        };
      })
    );
  };

  const handleCopyFloor1ToAll = () => {
    if (floorConfigs.length === 0) return;
    const base = floorConfigs[0];
    setFloorConfigs(prev =>
      prev.map(fc => ({
        ...fc,
        roomCount: base.roomCount,
        bedsPerRoom: base.bedsPerRoom,
        monthlyRent: base.monthlyRent,
        startRoomNumber: fc.floor * 100 + 1
      }))
    );
    addToast({
      type: 'info',
      title: 'Floor 1 Applied to All',
      message: `Copied ${base.roomCount} rooms & ${base.bedsPerRoom} beds/room to all floors.`
    });
  };

  const handleApplyFloorArchitect = () => {
    const totalConfiguredRooms = floorConfigs.reduce((acc, fc) => acc + (fc.roomCount || 0), 0);
    if (totalConfiguredRooms === 0) {
      addToast({
        type: 'error',
        title: 'Zero Rooms Configured',
        message: 'Please specify at least 1 room on any floor.'
      });
      return;
    }
    setupRoomsByFloors(floorConfigs);
    setIsInventoryConfigOpen(false);
  };

  // Edit Single Room State
  const [editingRoom, setEditingRoom] = useState<{
    id: string;
    roomNumber: string;
    floor: number;
    capacity: number;
    monthlyRent: number;
    status: RoomStatus;
    amenities: string;
  } | null>(null);

  // Add Single Room State
  const [newRoomData, setNewRoomData] = useState<{
    roomNumber: string;
    floor: number;
    capacity: number;
    monthlyRent: number;
    status: RoomStatus;
    amenities: string;
  }>({
    roomNumber: '',
    floor: 1,
    capacity: 4,
    monthlyRent: property.defaultMonthlyRent || 3500,
    status: 'AVAILABLE',
    amenities: 'Aircon, Bunk Beds, Study Desks, Ensuite Bathroom'
  });

  // Batch Config Modal State
  const [configTargetRooms, setConfigTargetRooms] = useState<number>(rooms.length);
  const [configDefaultBeds, setConfigDefaultBeds] = useState<number>(4);
  const [configFloors, setConfigFloors] = useState<number>(property.totalFloors || 3);
  const [bulkRoomEdits, setBulkRoomEdits] = useState<Array<{
    id: string;
    roomNumber: string;
    floor: number;
    capacity: number;
    monthlyRent: number;
    status: RoomStatus;
  }>>([]);
  const [configTab, setConfigTab] = useState<'FLOORS' | 'COUNT' | 'MATRIX'>('FLOORS');

  // Open Edit Modal for a single room
  const openEditRoomModal = (room: Room) => {
    setEditingRoom({
      id: room.id,
      roomNumber: room.roomNumber,
      floor: room.floor,
      capacity: room.capacity,
      monthlyRent: room.monthlyRent,
      status: room.status,
      amenities: room.amenities.join(', ')
    });
    setIsEditRoomOpen(true);
  };

  // Open Inventory Configuration Modal
  const openInventoryConfig = () => {
    setConfigTargetRooms(rooms.length);
    setConfigFloors(property.totalFloors || 3);
    setBulkRoomEdits(
      rooms.map(r => ({
        id: r.id,
        roomNumber: r.roomNumber,
        floor: r.floor,
        capacity: r.capacity,
        monthlyRent: r.monthlyRent,
        status: r.status
      }))
    );
    setIsInventoryConfigOpen(true);
  };

  // Filtered rooms
  const filteredRooms = rooms.filter(room => {
    const matchesFloor = selectedFloor === 'ALL' || room.floor === selectedFloor;
    const matchesStatus = statusFilter === 'ALL' || room.status === statusFilter;
    const matchesSearch =
      room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `room ${room.roomNumber}`.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFloor && matchesStatus && matchesSearch;
  });

  // Metrics
  const totalBeds = rooms.reduce((acc, r) => acc + r.capacity, 0);
  const occupiedBeds = rooms.reduce((acc, r) => acc + r.occupiedBeds, 0);
  const availableBeds = Math.max(0, totalBeds - occupiedBeds);
  const occupancyPercentage = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  // Extract unique floors
  const distinctFloors: number[] = Array.from(new Set<number>(rooms.map(r => Number(r.floor)))).sort((a, b) => a - b);
  const floorList = distinctFloors.length > 0 ? distinctFloors : [1, 2, 3];

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomData.roomNumber.trim()) {
      addToast({
        type: 'error',
        title: 'Room Number Required',
        message: 'Please enter a valid room number (e.g. 101).'
      });
      return;
    }

    addRoom({
      roomNumber: newRoomData.roomNumber.trim(),
      floor: newRoomData.floor,
      capacity: Math.max(1, newRoomData.capacity),
      occupiedBeds: 0,
      monthlyRent: newRoomData.monthlyRent,
      status: newRoomData.status,
      amenities: newRoomData.amenities.split(',').map(a => a.trim()).filter(Boolean)
    });
    setIsAddRoomOpen(false);
    setNewRoomData({
      roomNumber: '',
      floor: 1,
      capacity: 4,
      monthlyRent: property.defaultMonthlyRent || 3500,
      status: 'AVAILABLE',
      amenities: 'Aircon, Bunk Beds, Study Desks, Ensuite Bathroom'
    });
  };

  const handleSaveEditRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoom) return;

    updateRoom(editingRoom.id, {
      roomNumber: editingRoom.roomNumber.trim(),
      floor: editingRoom.floor,
      capacity: Math.max(1, editingRoom.capacity),
      monthlyRent: editingRoom.monthlyRent,
      status: editingRoom.status,
      amenities: editingRoom.amenities.split(',').map(a => a.trim()).filter(Boolean)
    });

    if (selectedRoom && selectedRoom.id === editingRoom.id) {
      setSelectedRoom(prev =>
        prev
          ? {
              ...prev,
              roomNumber: editingRoom.roomNumber.trim(),
              floor: editingRoom.floor,
              capacity: Math.max(1, editingRoom.capacity),
              monthlyRent: editingRoom.monthlyRent,
              status: editingRoom.status,
              amenities: editingRoom.amenities.split(',').map(a => a.trim()).filter(Boolean)
            }
          : null
      );
    }

    setIsEditRoomOpen(false);
    setEditingRoom(null);
  };

  const handleUpdateRoomStatus = (roomId: string, status: RoomStatus) => {
    updateRoom(roomId, { status });
    if (selectedRoom && selectedRoom.id === roomId) {
      setSelectedRoom(prev => (prev ? { ...prev, status } : null));
    }
  };

  const handleQuickAdjustBeds = (roomId: string, currentCapacity: number, delta: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newCap = Math.max(1, Math.min(20, currentCapacity + delta));
    setRoomBedCapacity(roomId, newCap);
    if (selectedRoom && selectedRoom.id === roomId) {
      setSelectedRoom(prev => (prev ? { ...prev, capacity: newCap } : null));
    }
  };

  const handleApplyRoomCount = () => {
    batchSetTotalRooms(configTargetRooms, {
      defaultCapacity: configDefaultBeds,
      defaultRent: property.defaultMonthlyRent || 3500,
      floors: configFloors
    });
    setIsInventoryConfigOpen(false);
  };

  const handleSaveBulkMatrix = () => {
    batchUpdateRooms(bulkRoomEdits);
    setIsInventoryConfigOpen(false);
  };

  // Calculations for Floor Architect preview
  const architectTotalRooms = floorConfigs.reduce((acc, fc) => acc + (Number(fc.roomCount) || 0), 0);
  const architectTotalBeds = floorConfigs.reduce(
    (acc, fc) => acc + (Number(fc.roomCount) || 0) * (Number(fc.bedsPerRoom) || 0),
    0
  );
  const architectEstimatedMonthlyRevenue = floorConfigs.reduce(
    (acc, fc) => acc + (Number(fc.roomCount) || 0) * (Number(fc.bedsPerRoom) || 0) * (Number(fc.monthlyRent) || 0),
    0
  );

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
            Room Inventory & Capacity
            <span className="text-xs px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 font-bold font-mono">
              {rooms.length} Rooms
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Owner inventory manager: configure number of rooms per floor, edit beds per room, and monitor live resident occupancy.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          {/* Configure Floors & Rooms button */}
          <button
            id="btn-open-room-config"
            onClick={openInventoryConfig}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-teal-300 bg-[#0B171B] border border-teal-500/30 hover:bg-teal-500/10 hover:border-teal-500/50 shadow-sm transition-all cursor-pointer"
          >
            <Settings2 className="w-4 h-4 text-teal-400" />
            Configure Floors & Beds
          </button>

          {/* Add Single Room button */}
          <button
            id="btn-add-single-room"
            onClick={() => setIsAddRoomOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-400 hover:opacity-90 shadow-md shadow-teal-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Room Unit
          </button>

          {/* Empty / Clear Rooms Button */}
          {rooms.length > 0 && (
            <button
              id="btn-clear-all-rooms"
              onClick={() => setIsConfirmClearOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/25 hover:bg-rose-500/20 hover:border-rose-500/40 transition-all cursor-pointer"
              title="Empty rooms to reconfigure floor layout"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Empty Rooms Tab
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* EMPTY STATE: FLOOR & ROOM ARCHITECT STUDIO                                */}
      {/* ========================================================================= */}
      {rooms.length === 0 ? (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
          {/* Main Architect Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0B171B] border-2 border-teal-500/40 shadow-2xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold font-mono">
                  <Building className="w-3.5 h-3.5" />
                  Owner Setup Studio
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100">
                  Input How Many Rooms & Beds Per Floor
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
                  Your boarding house currently has no rooms configured. Define how many floors you have, specify the exact number of rooms on each floor, and set the bed capacity per room.
                </p>
              </div>

              {/* Number of Floors Stepper */}
              <div className="p-4 rounded-2xl bg-[#101F23] border border-white/[0.08] flex items-center gap-4 shrink-0">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">
                    Number of Floors
                  </span>
                  <span className="text-xs text-slate-400">Boarding House Levels</span>
                </div>
                <div className="flex items-center bg-[#0B171B] rounded-xl border border-white/[0.1] p-1">
                  <button
                    type="button"
                    onClick={() => handleSetNumFloors(numFloors - 1)}
                    disabled={numFloors <= 1}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:bg-white/[0.08] hover:text-rose-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-mono font-extrabold text-lg text-teal-300">
                    {numFloors}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSetNumFloors(numFloors + 1)}
                    disabled={numFloors >= 10}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:bg-white/[0.08] hover:text-teal-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick helper action */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold">
                <Layers className="w-4 h-4 text-teal-400" />
                <span>Configure Floor Details:</span>
              </div>
              <button
                type="button"
                onClick={handleCopyFloor1ToAll}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#101F23] border border-teal-500/30 text-teal-300 hover:bg-teal-500/10 text-xs font-semibold transition-all cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy Floor 1 configuration to all floors
              </button>
            </div>

            {/* Per-Floor Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {floorConfigs.map(fc => (
                <div
                  key={fc.floor}
                  className="p-5 rounded-2xl bg-[#101F23] border border-white/[0.08] hover:border-teal-500/40 transition-all space-y-4 relative group"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-300 font-extrabold text-xs flex items-center justify-center font-mono">
                        F{fc.floor}
                      </span>
                      <h3 className="font-extrabold text-slate-100 text-sm">
                        FLOOR {fc.floor}
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-teal-400/90 font-semibold">
                      {fc.roomCount * fc.bedsPerRoom} Bed Spaces
                    </span>
                  </div>

                  {/* Rooms on this Floor */}
                  <div className="space-y-1.5">
                    <label className="block text-slate-300 text-xs font-bold">
                      Number of Rooms on Floor {fc.floor} *
                    </label>
                    <div className="flex items-center bg-[#0B171B] rounded-xl border border-white/[0.08] p-1">
                      <button
                        type="button"
                        onClick={() => handleUpdateFloorConfig(fc.floor, 'roomCount', Math.max(0, fc.roomCount - 1))}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-white/[0.08] hover:text-rose-400"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="number"
                        min="0"
                        max="50"
                        value={fc.roomCount}
                        onChange={e =>
                          handleUpdateFloorConfig(fc.floor, 'roomCount', Math.max(0, parseInt(e.target.value) || 0))
                        }
                        className="w-full text-center font-mono font-bold text-teal-300 bg-transparent focus:outline-none text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => handleUpdateFloorConfig(fc.floor, 'roomCount', Math.min(50, fc.roomCount + 1))}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-white/[0.08] hover:text-teal-300"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Beds Each Room on this floor */}
                  <div className="space-y-1.5">
                    <label className="block text-slate-300 text-xs font-bold">
                      Beds Each Room (Capacity) *
                    </label>
                    <div className="flex items-center bg-[#0B171B] rounded-xl border border-white/[0.08] p-1">
                      <button
                        type="button"
                        onClick={() => handleUpdateFloorConfig(fc.floor, 'bedsPerRoom', Math.max(1, fc.bedsPerRoom - 1))}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-white/[0.08] hover:text-rose-400"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={fc.bedsPerRoom}
                        onChange={e =>
                          handleUpdateFloorConfig(fc.floor, 'bedsPerRoom', Math.max(1, parseInt(e.target.value) || 1))
                        }
                        className="w-full text-center font-mono font-bold text-teal-300 bg-transparent focus:outline-none text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => handleUpdateFloorConfig(fc.floor, 'bedsPerRoom', Math.min(20, fc.bedsPerRoom + 1))}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-white/[0.08] hover:text-teal-300"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Monthly Rent & Start Room # */}
                  <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                    <div>
                      <label className="block text-slate-400 text-[10px] font-semibold uppercase mb-1">
                        Rent per Bed (PHP)
                      </label>
                      <input
                        type="number"
                        step="100"
                        value={fc.monthlyRent}
                        onChange={e =>
                          handleUpdateFloorConfig(fc.floor, 'monthlyRent', parseFloat(e.target.value) || 0)
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#0B171B] border border-white/[0.08] text-slate-100 font-mono text-xs focus:border-teal-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-[10px] font-semibold uppercase mb-1">
                        Starts At Room #
                      </label>
                      <input
                        type="number"
                        value={fc.startRoomNumber || fc.floor * 100 + 1}
                        onChange={e =>
                          handleUpdateFloorConfig(
                            fc.floor,
                            'startRoomNumber',
                            parseInt(e.target.value) || fc.floor * 100 + 1
                          )
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#0B171B] border border-white/[0.08] text-slate-100 font-mono text-xs focus:border-teal-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary & Live Calculation Bar */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-950/40 via-[#101F23] to-[#101F23] border border-teal-500/30 flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full lg:w-auto text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] font-bold uppercase">Total Floors</span>
                  <p className="text-lg font-extrabold text-slate-100 font-mono">{numFloors} Floors</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-bold uppercase">Total Rooms to Create</span>
                  <p className="text-lg font-extrabold text-teal-300 font-mono">{architectTotalRooms} Rooms</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-bold uppercase">Total Bed Capacity</span>
                  <p className="text-lg font-extrabold text-emerald-400 font-mono">{architectTotalBeds} Beds</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-bold uppercase">Potential Monthly Gross</span>
                  <p className="text-lg font-extrabold text-cyan-300 font-mono">
                    {formatPHP(architectEstimatedMonthlyRevenue)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setIsAddRoomOpen(true)}
                  className="px-4 py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
                >
                  + Add Single Unit Instead
                </button>
                <button
                  type="button"
                  id="btn-generate-rooms-architect"
                  onClick={handleApplyFloorArchitect}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-extrabold text-slate-950 bg-gradient-to-r from-teal-400 via-teal-300 to-cyan-400 hover:opacity-90 shadow-xl shadow-teal-500/25 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  Generate {architectTotalRooms} Rooms & Start Managing
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* POPULATED ROOMS VIEW: STATS, FILTER BAR, AND ROOM CARDS                   */
        /* ========================================================================= */
        <>
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-2xl bg-[#101F23] border border-white/[0.06] flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 font-semibold uppercase">Total Rooms</span>
                <div className="text-2xl font-extrabold text-slate-100 font-mono mt-0.5">{rooms.length}</div>
                <span className="text-[10px] text-slate-400">{distinctFloors.length} Floors</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                <Building className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#101F23] border border-white/[0.06] flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 font-semibold uppercase">Total Beds</span>
                <div className="text-2xl font-extrabold text-teal-300 font-mono mt-0.5">{totalBeds}</div>
                <span className="text-[10px] text-teal-300/80">{availableBeds} beds vacant</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                <BedDouble className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#101F23] border border-white/[0.06] flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 font-semibold uppercase">Occupied Beds</span>
                <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-0.5">{occupiedBeds}</div>
                <span className="text-[10px] text-emerald-400/80">{tenants.length} active residents</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Users className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-950/30 via-[#101F23] to-[#101F23] border border-teal-500/30 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-teal-300 font-semibold uppercase">Occupancy Rate</span>
                <div className="text-2xl font-extrabold text-teal-300 font-mono mt-0.5">
                  {occupancyPercentage}%
                </div>
                <span className="text-[10px] text-teal-400/80">Capacity utilized</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-300 font-bold font-mono">
                %
              </div>
            </div>
          </div>

          {/* Search, Floor Filter, and View Mode Switcher */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#101F23] border border-white/[0.06]">
            <div className="flex flex-wrap items-center gap-2.5 flex-1">
              {/* Search Bar */}
              <div className="relative flex-1 min-w-[200px] max-w-md">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search room (e.g. 101, 202)..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#0B171B] border border-white/[0.08] text-xs text-slate-200 placeholder:text-slate-500 focus:border-teal-500 focus:outline-none"
                />
              </div>

              {/* Floor Selector */}
              <div className="flex items-center gap-1 bg-[#0B171B] p-1 rounded-xl border border-white/[0.08] text-xs">
                <span className="text-[10px] text-slate-400 px-2 uppercase font-semibold">Floor:</span>
                <button
                  onClick={() => setSelectedFloor('ALL')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    selectedFloor === 'ALL'
                      ? 'bg-teal-500/20 text-teal-300 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  All ({rooms.length})
                </button>
                {distinctFloors.map(floorNum => {
                  const count = rooms.filter(r => r.floor === floorNum).length;
                  return (
                    <button
                      key={floorNum}
                      onClick={() => setSelectedFloor(floorNum)}
                      className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                        selectedFloor === floorNum
                          ? 'bg-teal-500/20 text-teal-300 font-bold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      F{floorNum} ({count})
                    </button>
                  );
                })}
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as RoomStatus | 'ALL')}
                className="px-3 py-1.5 rounded-xl bg-[#0B171B] border border-white/[0.08] text-xs text-slate-200 focus:border-teal-500 focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="AVAILABLE">Available</option>
                <option value="OCCUPIED">Occupied</option>
                <option value="RESERVED">Reserved</option>
                <option value="MAINTENANCE">Maintenance</option>
              </select>
            </div>

            {/* View Switcher (Grid vs Floor Layout) */}
            <div className="flex items-center gap-1 bg-[#0B171B] p-1 rounded-xl border border-white/[0.08]">
              <button
                onClick={() => setViewMode('GRID')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'GRID' ? 'bg-teal-500/20 text-teal-300 shadow-xs' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                Grid View
              </button>
              <button
                onClick={() => setViewMode('FLOOR')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'FLOOR' ? 'bg-teal-500/20 text-teal-300 shadow-xs' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Floor Groups
              </button>
            </div>
          </div>

          {/* GRID VIEW */}
          {viewMode === 'GRID' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredRooms.map(room => {
                const roomTenants = tenants.filter(t => t.roomId === room.id);
                const isFull = room.occupiedBeds >= room.capacity;

                return (
                  <div
                    key={room.id}
                    onClick={() => setSelectedRoom(room)}
                    className="p-4 rounded-2xl bg-[#101F23] border border-white/[0.06] hover:border-teal-500/40 hover:bg-[#13262B] transition-all cursor-pointer group flex flex-col justify-between shadow-sm"
                  >
                    <div>
                      {/* Room Card Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#0B171B] text-teal-300 border border-white/[0.06] uppercase">
                            Floor {room.floor}
                          </span>
                          <h3 className="text-lg font-extrabold text-slate-100 group-hover:text-teal-300 transition-colors flex items-center gap-1.5 mt-1">
                            ROOM {room.roomNumber}
                          </h3>
                        </div>
                        <StatusBadge type="room" status={room.status} size="sm" />
                      </div>

                      {/* Bed Capacity Stepper & Visual Progress */}
                      <div className="p-2.5 rounded-xl bg-[#0B171B] border border-white/[0.04] mb-3 space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-slate-300 flex items-center gap-1">
                            <BedDouble className="w-3.5 h-3.5 text-teal-400" />
                            Beds:
                          </span>

                          {/* Quick Bed Stepper */}
                          <div
                            className="flex items-center gap-1.5 bg-[#101F23] px-1.5 py-0.5 rounded-lg border border-white/[0.08]"
                            onClick={e => e.stopPropagation()}
                          >
                            <button
                              onClick={e => handleQuickAdjustBeds(room.id, room.capacity, -1, e)}
                              disabled={room.capacity <= 1 || room.occupiedBeds > room.capacity - 1}
                              className="w-4 h-4 rounded flex items-center justify-center text-slate-400 hover:text-rose-400 hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                              title="Reduce 1 bed"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-mono text-teal-300 font-bold text-xs min-w-[2.5rem] text-center">
                              {room.occupiedBeds}/{room.capacity}
                            </span>
                            <button
                              onClick={e => handleQuickAdjustBeds(room.id, room.capacity, 1, e)}
                              disabled={room.capacity >= 20}
                              className="w-4 h-4 rounded flex items-center justify-center text-slate-400 hover:text-teal-300 hover:bg-white/[0.06] transition-colors"
                              title="Add 1 bed space"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Capacity Progress Bar */}
                        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              isFull ? 'bg-amber-400' : 'bg-teal-400'
                            }`}
                            style={{
                              width: `${Math.min(100, (room.occupiedBeds / (room.capacity || 1)) * 100)}%`
                            }}
                          />
                        </div>
                      </div>

                      {/* Residents Preview */}
                      {roomTenants.length > 0 && (
                        <div className="space-y-1 mb-3">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Residents:</span>
                          {roomTenants.slice(0, 2).map(t => (
                            <div key={t.id} className="text-xs text-slate-300 truncate flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                              <span className="truncate">{t.name}</span>
                              <span className="text-[10px] text-slate-400 shrink-0">({t.bedLabel})</span>
                            </div>
                          ))}
                          {roomTenants.length > 2 && (
                            <span className="text-[10px] text-teal-400 font-semibold block">
                              +{roomTenants.length - 2} more resident(s)
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Footer Rent & Quick Actions */}
                    <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Rate</span>
                        <span className="font-mono font-bold text-slate-100">{formatPHP(room.monthlyRent)}/mo</span>
                      </div>

                      <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => openEditRoomModal(room)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-teal-300 hover:bg-white/[0.06] transition-colors"
                          title="Edit Room & Beds"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <span
                          onClick={() => setSelectedRoom(room)}
                          className="text-[11px] font-semibold text-teal-400 group-hover:translate-x-0.5 transition-transform cursor-pointer pl-1"
                        >
                          Details →
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* FLOOR VIEW */}
          {viewMode === 'FLOOR' && (
            <div className="space-y-8">
              {floorList.map(floorNum => {
                const floorRooms = rooms.filter(r => r.floor === floorNum);
                if (selectedFloor !== 'ALL' && selectedFloor !== floorNum) return null;

                const floorTotalBeds = floorRooms.reduce((acc, r) => acc + r.capacity, 0);
                const floorOccupied = floorRooms.reduce((acc, r) => acc + r.occupiedBeds, 0);

                return (
                  <div key={floorNum} className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-white/[0.08] gap-2">
                      <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-teal-400" />
                        FLOOR {floorNum}
                      </h3>
                      <span className="text-xs text-slate-400 font-medium">
                        {floorRooms.length} Rooms • {floorOccupied}/{floorTotalBeds} Beds Occupied
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
                      {floorRooms.map(room => (
                        <div
                          key={room.id}
                          onClick={() => setSelectedRoom(room)}
                          className="p-3.5 rounded-xl bg-[#101F23] border border-white/[0.06] hover:border-teal-500/40 hover:bg-[#14282D] transition-all cursor-pointer group flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-bold text-slate-100 text-sm group-hover:text-teal-300">
                                ROOM {room.roomNumber}
                              </span>
                              <StatusBadge type="room" status={room.status} size="sm" />
                            </div>

                            {/* Bed stepper */}
                            <div
                              className="flex items-center justify-between text-xs text-slate-300 bg-[#0B171B] p-1.5 rounded-lg mb-2"
                              onClick={e => e.stopPropagation()}
                            >
                              <span className="text-[11px] text-slate-400">Beds:</span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={e => handleQuickAdjustBeds(room.id, room.capacity, -1, e)}
                                  disabled={room.capacity <= 1 || room.occupiedBeds > room.capacity - 1}
                                  className="w-3.5 h-3.5 rounded flex items-center justify-center text-slate-400 hover:text-rose-400 disabled:opacity-30"
                                >
                                  <Minus className="w-2.5 h-2.5" />
                                </button>
                                <span className="font-mono font-bold text-teal-300 text-xs px-1">
                                  {room.occupiedBeds}/{room.capacity}
                                </span>
                                <button
                                  onClick={e => handleQuickAdjustBeds(room.id, room.capacity, 1, e)}
                                  disabled={room.capacity >= 20}
                                  className="w-3.5 h-3.5 rounded flex items-center justify-center text-slate-400 hover:text-teal-300"
                                >
                                  <Plus className="w-2.5 h-2.5" />
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs">
                            <span className="font-mono text-slate-300 font-bold">{formatPHP(room.monthlyRent)}</span>
                            <span className="text-[10px] text-teal-400 group-hover:translate-x-0.5 transition-transform">
                              Details →
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ========================================================================= */}
      {/* ROOM DETAILS DRAWER / MODAL                                               */}
      {/* ========================================================================= */}
      {selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-100">
          <div className="w-full max-w-xl rounded-2xl bg-[#0B171B] border border-teal-500/30 p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-white/[0.08] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 font-mono font-bold">
                    Floor {selectedRoom.floor}
                  </span>
                  <h2 className="text-xl font-extrabold text-slate-100">
                    Room {selectedRoom.roomNumber}
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Bed capacity: {selectedRoom.capacity} beds • {selectedRoom.occupiedBeds} occupied
                </p>
              </div>
              <button
                onClick={() => setSelectedRoom(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            {/* Bed Spaces Grid */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Bed Spaces & Resident Assignments
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {Array.from({ length: selectedRoom.capacity }).map((_, index) => {
                  const letter = String.fromCharCode(65 + index); // Bed A, Bed B...
                  const roomTenants = tenants.filter(t => t.roomId === selectedRoom.id);
                  const assignedTenant = roomTenants[index] || null;

                  return (
                    <div
                      key={index}
                      className={`p-3 rounded-xl border transition-all ${
                        assignedTenant
                          ? 'bg-[#101F23] border-teal-500/30'
                          : 'bg-[#0B171B] border-dashed border-white/[0.12] text-slate-500'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold font-mono text-slate-200">
                          Bed {letter}
                        </span>
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                            assignedTenant ? 'bg-teal-500/20 text-teal-300' : 'bg-white/[0.06] text-slate-400'
                          }`}
                        >
                          {assignedTenant ? 'Occupied' : 'Vacant'}
                        </span>
                      </div>

                      {assignedTenant ? (
                        <div
                          onClick={() => {
                            setSelectedTenant(assignedTenant);
                            setActiveTab('tenants');
                            setSelectedRoom(null);
                          }}
                          className="cursor-pointer group"
                        >
                          <p className="text-xs font-bold text-slate-100 truncate group-hover:text-teal-300">
                            {assignedTenant.name}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            Rent: {formatPHP(assignedTenant.monthlyRent)}
                          </p>
                        </div>
                      ) : (
                        <div className="text-[11px] text-slate-500 italic flex items-center gap-1 pt-1">
                          <CheckCircle2 className="w-3 h-3 text-slate-600" /> Ready to assign
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Room Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 rounded-xl bg-[#101F23] border border-white/[0.06] text-xs">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Total Capacity</span>
                <p className="font-bold text-slate-200 mt-0.5 font-mono">{selectedRoom.capacity} Beds</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Occupied</span>
                <p className="font-bold text-teal-300 mt-0.5 font-mono">{selectedRoom.occupiedBeds} Beds</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Available</span>
                <p className="font-bold text-emerald-400 mt-0.5 font-mono">
                  {Math.max(0, selectedRoom.capacity - selectedRoom.occupiedBeds)} Beds
                </p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Monthly Rate</span>
                <p className="font-bold text-teal-300 mt-0.5 font-mono">{formatPHP(selectedRoom.monthlyRent)}</p>
              </div>
            </div>

            {/* Amenities Tag Cloud */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Room Amenities & Inclusions
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedRoom.amenities && selectedRoom.amenities.length > 0 ? (
                  selectedRoom.amenities.map((amenity, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-300 text-[11px] font-medium"
                    >
                      {amenity}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500">Standard furnishings included</span>
                )}
              </div>
            </div>

            {/* Room Management Actions */}
            <div className="pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpdateRoomStatus(selectedRoom.id, 'AVAILABLE')}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/30 cursor-pointer"
                >
                  Mark Available
                </button>
                <button
                  onClick={() => handleUpdateRoomStatus(selectedRoom.id, 'MAINTENANCE')}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30 cursor-pointer"
                >
                  Set Maintenance
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const hasTenants = tenants.some(t => t.roomId === selectedRoom.id);
                    if (hasTenants) {
                      addToast({
                        type: 'error',
                        title: 'Cannot Delete Room',
                        message: 'This room has active registered residents. Reassign them first.'
                      });
                      return;
                    }
                    deleteRoom(selectedRoom.id);
                    setSelectedRoom(null);
                  }}
                  className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 cursor-pointer"
                  title="Delete Room Unit"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setActiveTab('tenants');
                    setSelectedRoom(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-400 hover:opacity-90 shadow-md shadow-teal-500/20 cursor-pointer"
                >
                  + Add Tenant Here
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EDIT SINGLE ROOM & BEDS MODAL                                             */}
      {/* ========================================================================= */}
      {isEditRoomOpen && editingRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-100">
          <div className="w-full max-w-md rounded-2xl bg-[#0B171B] border border-teal-500/30 p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/[0.08] pb-3">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-teal-400" />
                Edit Room {editingRoom.roomNumber} & Beds
              </h3>
              <button
                onClick={() => {
                  setIsEditRoomOpen(false);
                  setEditingRoom(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditRoom} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Room Number *</label>
                  <input
                    type="text"
                    required
                    value={editingRoom.roomNumber}
                    onChange={e => setEditingRoom({ ...editingRoom, roomNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#101F23] border border-white/[0.08] text-slate-100 focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Floor Level *</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={editingRoom.floor}
                    onChange={e => setEditingRoom({ ...editingRoom, floor: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 rounded-xl bg-[#101F23] border border-white/[0.08] text-slate-100 focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Bed Capacity with Stepper */}
              <div className="p-3.5 rounded-xl bg-[#101F23] border border-white/[0.08] space-y-2">
                <label className="block text-slate-200 font-bold">Number of Beds (Bed Capacity) *</label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-[#0B171B] rounded-xl border border-white/[0.08] p-1">
                    <button
                      type="button"
                      onClick={() => setEditingRoom({ ...editingRoom, capacity: Math.max(1, editingRoom.capacity - 1) })}
                      className="p-1 rounded-lg text-slate-300 hover:bg-white/[0.06] hover:text-rose-400"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      required
                      value={editingRoom.capacity}
                      onChange={e => setEditingRoom({ ...editingRoom, capacity: parseInt(e.target.value) || 1 })}
                      className="w-16 text-center font-mono font-bold text-teal-300 bg-transparent focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setEditingRoom({ ...editingRoom, capacity: Math.min(20, editingRoom.capacity + 1) })}
                      className="p-1 rounded-lg text-slate-300 hover:bg-white/[0.06] hover:text-teal-300"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-400">Total rentable bed slots</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Monthly Rent (PHP) *</label>
                  <input
                    type="number"
                    step="100"
                    required
                    value={editingRoom.monthlyRent}
                    onChange={e => setEditingRoom({ ...editingRoom, monthlyRent: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-[#101F23] border border-white/[0.08] text-slate-100 font-mono focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Room Status</label>
                  <select
                    value={editingRoom.status}
                    onChange={e => setEditingRoom({ ...editingRoom, status: e.target.value as RoomStatus })}
                    className="w-full px-3 py-2 rounded-xl bg-[#101F23] border border-white/[0.08] text-slate-100 focus:border-teal-500 focus:outline-none"
                  >
                    <option value="AVAILABLE">Available</option>
                    <option value="OCCUPIED">Occupied</option>
                    <option value="RESERVED">Reserved</option>
                    <option value="MAINTENANCE">Maintenance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Amenities (Comma separated)</label>
                <input
                  type="text"
                  value={editingRoom.amenities}
                  onChange={e => setEditingRoom({ ...editingRoom, amenities: e.target.value })}
                  placeholder="Aircon, Bunk Beds, Study Desks, Ensuite Bath"
                  className="w-full px-3 py-2 rounded-xl bg-[#101F23] border border-white/[0.08] text-slate-100 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditRoomOpen(false);
                    setEditingRoom(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-white/[0.06] text-slate-300 hover:bg-white/[0.1] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-400 hover:opacity-90 shadow-md shadow-teal-500/20 cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD SINGLE ROOM MODAL                                                     */}
      {/* ========================================================================= */}
      {isAddRoomOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-100">
          <div className="w-full max-w-md rounded-2xl bg-[#0B171B] border border-teal-500/30 p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/[0.08] pb-3">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <BedDouble className="w-5 h-5 text-teal-400" />
                Add New Room Unit
              </h3>
              <button
                onClick={() => setIsAddRoomOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Room Number *</label>
                  <input
                    type="text"
                    required
                    value={newRoomData.roomNumber}
                    onChange={e => setNewRoomData({ ...newRoomData, roomNumber: e.target.value })}
                    placeholder="e.g. 101"
                    className="w-full px-3 py-2 rounded-xl bg-[#101F23] border border-white/[0.08] text-slate-100 focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Floor Level *</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={newRoomData.floor}
                    onChange={e => setNewRoomData({ ...newRoomData, floor: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 rounded-xl bg-[#101F23] border border-white/[0.08] text-slate-100 focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Bed Capacity Field with Stepper */}
              <div className="p-3.5 rounded-xl bg-[#101F23] border border-white/[0.08] space-y-1.5">
                <label className="block text-slate-200 font-bold">Number of Beds (Bed Capacity) *</label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-[#0B171B] rounded-xl border border-white/[0.08] p-1">
                    <button
                      type="button"
                      onClick={() => setNewRoomData({ ...newRoomData, capacity: Math.max(1, newRoomData.capacity - 1) })}
                      className="p-1 rounded-lg text-slate-300 hover:bg-white/[0.06] hover:text-rose-400"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      required
                      value={newRoomData.capacity}
                      onChange={e => setNewRoomData({ ...newRoomData, capacity: parseInt(e.target.value) || 1 })}
                      className="w-16 text-center font-mono font-bold text-teal-300 bg-transparent focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setNewRoomData({ ...newRoomData, capacity: Math.min(20, newRoomData.capacity + 1) })}
                      className="p-1 rounded-lg text-slate-300 hover:bg-white/[0.06] hover:text-teal-300"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-400">Bed spaces available for rent</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Monthly Rent (PHP) *</label>
                  <input
                    type="number"
                    step="100"
                    required
                    value={newRoomData.monthlyRent}
                    onChange={e => setNewRoomData({ ...newRoomData, monthlyRent: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-[#101F23] border border-white/[0.08] text-slate-100 font-mono focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Initial Status</label>
                  <select
                    value={newRoomData.status}
                    onChange={e => setNewRoomData({ ...newRoomData, status: e.target.value as RoomStatus })}
                    className="w-full px-3 py-2 rounded-xl bg-[#101F23] border border-white/[0.08] text-slate-100 focus:border-teal-500 focus:outline-none"
                  >
                    <option value="AVAILABLE">Available</option>
                    <option value="OCCUPIED">Occupied</option>
                    <option value="RESERVED">Reserved</option>
                    <option value="MAINTENANCE">Maintenance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Amenities (Comma separated)</label>
                <input
                  type="text"
                  value={newRoomData.amenities}
                  onChange={e => setNewRoomData({ ...newRoomData, amenities: e.target.value })}
                  placeholder="Aircon, Bunk Beds, Study Desks, Ensuite Bath"
                  className="w-full px-3 py-2 rounded-xl bg-[#101F23] border border-white/[0.08] text-slate-100 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddRoomOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.06] text-slate-300 hover:bg-white/[0.1] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-400 hover:opacity-90 shadow-md shadow-teal-500/20 cursor-pointer"
                >
                  Add Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FULL INVENTORY & ROOM COUNT CONFIGURATION MODAL                           */}
      {/* ========================================================================= */}
      {isInventoryConfigOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-100">
          <div className="w-full max-w-4xl rounded-2xl bg-[#0B171B] border border-teal-500/40 p-6 space-y-5 shadow-2xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-white/[0.08] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                    <Settings2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-extrabold text-slate-100">
                      Configure Rooms & Bed Spaces
                    </h2>
                    <p className="text-xs text-slate-400">
                      Input how many rooms per floor, change total rooms count, or edit bed numbers per unit.
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsInventoryConfigOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Sub Tabs */}
            <div className="flex items-center gap-2 border-b border-white/[0.08] pb-2 text-xs font-semibold overflow-x-auto">
              <button
                onClick={() => setConfigTab('FLOORS')}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                  configTab === 'FLOORS'
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-4 h-4" /> 1. Rooms per Floor Architect
              </button>
              <button
                onClick={() => setConfigTab('COUNT')}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                  configTab === 'COUNT'
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sliders className="w-4 h-4" /> 2. Total Rooms Count
              </button>
              <button
                onClick={() => setConfigTab('MATRIX')}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                  configTab === 'MATRIX'
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Grid className="w-4 h-4" /> 3. Per-Room Bed Matrix
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto pr-1">
              {configTab === 'FLOORS' && (
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#101F23] border border-white/[0.08]">
                    <div>
                      <span className="font-bold text-slate-100 text-sm block">Number of Floors</span>
                      <span className="text-slate-400 text-[11px]">Adjust building levels</span>
                    </div>
                    <div className="flex items-center bg-[#0B171B] rounded-xl border border-white/[0.1] p-1">
                      <button
                        type="button"
                        onClick={() => handleSetNumFloors(numFloors - 1)}
                        disabled={numFloors <= 1}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 hover:bg-white/[0.08] hover:text-rose-400 disabled:opacity-30"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-10 text-center font-mono font-bold text-teal-300">{numFloors}</span>
                      <button
                        type="button"
                        onClick={() => handleSetNumFloors(numFloors + 1)}
                        disabled={numFloors >= 10}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 hover:bg-white/[0.08] hover:text-teal-300 disabled:opacity-30"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {floorConfigs.map(fc => (
                      <div
                        key={fc.floor}
                        className="p-4 rounded-xl bg-[#101F23] border border-white/[0.08] space-y-3"
                      >
                        <div className="flex items-center justify-between pb-1.5 border-b border-white/[0.06]">
                          <span className="font-bold text-slate-100 text-xs flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded bg-teal-500/20 text-teal-300 flex items-center justify-center font-mono text-[10px]">
                              F{fc.floor}
                            </span>
                            Floor {fc.floor}
                          </span>
                          <span className="text-[10px] font-mono text-teal-300">
                            {fc.roomCount * fc.bedsPerRoom} Beds
                          </span>
                        </div>

                        <div>
                          <label className="block text-slate-300 text-[11px] font-semibold mb-1">
                            Rooms on this floor:
                          </label>
                          <div className="flex items-center bg-[#0B171B] rounded-lg border border-white/[0.08] p-0.5">
                            <button
                              type="button"
                              onClick={() => handleUpdateFloorConfig(fc.floor, 'roomCount', Math.max(0, fc.roomCount - 1))}
                              className="w-7 h-7 rounded flex items-center justify-center text-slate-400 hover:text-rose-400"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <input
                              type="number"
                              min="0"
                              max="50"
                              value={fc.roomCount}
                              onChange={e =>
                                handleUpdateFloorConfig(fc.floor, 'roomCount', Math.max(0, parseInt(e.target.value) || 0))
                              }
                              className="w-full text-center font-mono font-bold text-teal-300 bg-transparent focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleUpdateFloorConfig(fc.floor, 'roomCount', Math.min(50, fc.roomCount + 1))}
                              className="w-7 h-7 rounded flex items-center justify-center text-slate-400 hover:text-teal-300"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-slate-300 text-[11px] font-semibold mb-1">
                            Beds each room:
                          </label>
                          <div className="flex items-center bg-[#0B171B] rounded-lg border border-white/[0.08] p-0.5">
                            <button
                              type="button"
                              onClick={() => handleUpdateFloorConfig(fc.floor, 'bedsPerRoom', Math.max(1, fc.bedsPerRoom - 1))}
                              className="w-7 h-7 rounded flex items-center justify-center text-slate-400 hover:text-rose-400"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <input
                              type="number"
                              min="1"
                              max="20"
                              value={fc.bedsPerRoom}
                              onChange={e =>
                                handleUpdateFloorConfig(fc.floor, 'bedsPerRoom', Math.max(1, parseInt(e.target.value) || 1))
                              }
                              className="w-full text-center font-mono font-bold text-teal-300 bg-transparent focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleUpdateFloorConfig(fc.floor, 'bedsPerRoom', Math.min(20, fc.bedsPerRoom + 1))}
                              className="w-7 h-7 rounded flex items-center justify-center text-slate-400 hover:text-teal-300"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-slate-400 text-[10px] uppercase font-semibold mb-1">
                            Rate / Bed (PHP)
                          </label>
                          <input
                            type="number"
                            step="100"
                            value={fc.monthlyRent}
                            onChange={e =>
                              handleUpdateFloorConfig(fc.floor, 'monthlyRent', parseFloat(e.target.value) || 0)
                            }
                            className="w-full px-2.5 py-1 rounded bg-[#0B171B] border border-white/[0.08] text-slate-100 font-mono text-xs focus:border-teal-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold block">
                        Will generate {architectTotalRooms} rooms ({architectTotalBeds} beds total)
                      </span>
                      <span className="text-slate-400 text-[11px]">
                        Applying will replace room layout with this floor-by-floor blueprint.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyFloorArchitect}
                      className="px-4 py-2 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-400 hover:opacity-90 shadow-sm cursor-pointer"
                    >
                      Save Floor Blueprint
                    </button>
                  </div>
                </div>
              )}

              {configTab === 'COUNT' && (
                <div className="space-y-5 text-xs">
                  {/* Current vs Target */}
                  <div className="p-4 rounded-2xl bg-[#101F23] border border-white/[0.08] space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200 text-sm">
                        Set Total Number of Rooms
                      </span>
                      <span className="text-xs px-2.5 py-1 rounded-lg bg-teal-500/10 text-teal-300 border border-teal-500/20 font-mono font-bold">
                        Currently: {rooms.length} Rooms
                      </span>
                    </div>

                    {/* Room Stepper */}
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center bg-[#0B171B] rounded-2xl border border-white/[0.1] p-1.5">
                        <button
                          type="button"
                          onClick={() => setConfigTargetRooms(prev => Math.max(1, prev - 1))}
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-300 hover:bg-white/[0.08] hover:text-rose-400 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={configTargetRooms}
                          onChange={e =>
                            setConfigTargetRooms(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))
                          }
                          className="w-20 text-center font-mono font-extrabold text-xl text-teal-300 bg-transparent focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setConfigTargetRooms(prev => Math.min(100, prev + 1))}
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-300 hover:bg-white/[0.08] hover:text-teal-300 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Quick Presets */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-slate-400 text-[11px] mr-1">Presets:</span>
                        {[5, 10, 15, 20, 30, 40, 50].map(val => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setConfigTargetRooms(val)}
                            className={`px-2.5 py-1 rounded-lg border font-mono font-semibold cursor-pointer transition-all ${
                              configTargetRooms === val
                                ? 'bg-teal-500/20 border-teal-500/40 text-teal-300'
                                : 'bg-[#0B171B] border-white/[0.08] text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {val} Rooms
                          </button>
                        ))}
                      </div>
                    </div>

                    {configTargetRooms !== rooms.length && (
                      <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs">
                        {configTargetRooms > rooms.length
                          ? `➕ Will add ${configTargetRooms - rooms.length} new room units distributed across ${configFloors} floor(s).`
                          : `⚠️ Will remove ${rooms.length - configTargetRooms} vacant room(s) to reach ${configTargetRooms} rooms.`}
                      </div>
                    )}
                  </div>

                  {/* Floor & Default Bed Specs for New Rooms */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-[#101F23] border border-white/[0.08] space-y-2">
                      <label className="block text-slate-200 font-bold">Floors in Boarding House</label>
                      <select
                        value={configFloors}
                        onChange={e => setConfigFloors(parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-2 rounded-xl bg-[#0B171B] border border-white/[0.08] text-slate-100 font-medium focus:border-teal-500 focus:outline-none"
                      >
                        <option value="1">1 Floor (Bungalow)</option>
                        <option value="2">2 Floors</option>
                        <option value="3">3 Floors (Default)</option>
                        <option value="4">4 Floors</option>
                        <option value="5">5 Floors</option>
                      </select>
                      <p className="text-[11px] text-slate-400">
                        Generated rooms will be numbered accordingly (e.g. 101, 201, 301).
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#101F23] border border-white/[0.08] space-y-2">
                      <label className="block text-slate-200 font-bold">Default Bed Capacity per Room</label>
                      <select
                        value={configDefaultBeds}
                        onChange={e => setConfigDefaultBeds(parseInt(e.target.value) || 4)}
                        className="w-full px-3 py-2 rounded-xl bg-[#0B171B] border border-white/[0.08] text-slate-100 font-medium focus:border-teal-500 focus:outline-none"
                      >
                        <option value="1">1 Bed (Single Private Unit)</option>
                        <option value="2">2 Beds (Twin Sharing)</option>
                        <option value="4">4 Beds (Quad Bedspace - Standard)</option>
                        <option value="6">6 Beds (6-Person Dormitory)</option>
                        <option value="8">8 Beds (8-Person Dormitory)</option>
                      </select>
                      <p className="text-[11px] text-slate-400">
                        New rooms will start with this bed capacity. (You can customize individual rooms anytime).
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {configTab === 'MATRIX' && (
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Directly edit the bed count and monthly rental for each room:</span>
                    <span className="text-teal-300 font-mono font-bold">{bulkRoomEdits.length} Rooms Listed</span>
                  </div>

                  <div className="border border-white/[0.08] rounded-xl overflow-hidden">
                    <div className="max-h-72 overflow-y-auto">
                      <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-[#0B171B] border-b border-white/[0.08] text-[11px] text-slate-400 uppercase font-semibold">
                          <tr>
                            <th className="p-2.5">Room #</th>
                            <th className="p-2.5">Floor</th>
                            <th className="p-2.5">Number of Beds</th>
                            <th className="p-2.5">Rate (PHP)</th>
                            <th className="p-2.5">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04] bg-[#101F23]">
                          {bulkRoomEdits.map((item, idx) => (
                            <tr key={item.id} className="hover:bg-white/[0.02]">
                              <td className="p-2.5 font-bold text-slate-100">
                                <input
                                  type="text"
                                  value={item.roomNumber}
                                  onChange={e => {
                                    const val = e.target.value;
                                    setBulkRoomEdits(prev =>
                                      prev.map((r, i) => (i === idx ? { ...r, roomNumber: val } : r))
                                    );
                                  }}
                                  className="w-20 px-2 py-1 rounded bg-[#0B171B] border border-white/[0.08] text-slate-100 font-mono"
                                />
                              </td>
                              <td className="p-2.5 text-slate-400 font-mono">Floor {item.floor}</td>
                              <td className="p-2.5">
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setBulkRoomEdits(prev =>
                                        prev.map((r, i) =>
                                          i === idx ? { ...r, capacity: Math.max(1, r.capacity - 1) } : r
                                        )
                                      );
                                    }}
                                    className="p-1 rounded bg-[#0B171B] hover:text-rose-400 border border-white/[0.08]"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="w-10 text-center font-bold text-teal-300 font-mono">
                                    {item.capacity}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setBulkRoomEdits(prev =>
                                        prev.map((r, i) =>
                                          i === idx ? { ...r, capacity: Math.min(20, r.capacity + 1) } : r
                                        )
                                      );
                                    }}
                                    className="p-1 rounded bg-[#0B171B] hover:text-teal-300 border border-white/[0.08]"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                  <span className="text-[10px] text-slate-400 ml-1">beds</span>
                                </div>
                              </td>
                              <td className="p-2.5">
                                <input
                                  type="number"
                                  step="100"
                                  value={item.monthlyRent}
                                  onChange={e => {
                                    const val = parseFloat(e.target.value) || 0;
                                    setBulkRoomEdits(prev =>
                                      prev.map((r, i) => (i === idx ? { ...r, monthlyRent: val } : r))
                                    );
                                  }}
                                  className="w-24 px-2 py-1 rounded bg-[#0B171B] border border-white/[0.08] text-slate-100 font-mono"
                                />
                              </td>
                              <td className="p-2.5">
                                <select
                                  value={item.status}
                                  onChange={e => {
                                    const val = e.target.value as RoomStatus;
                                    setBulkRoomEdits(prev =>
                                      prev.map((r, i) => (i === idx ? { ...r, status: val } : r))
                                    );
                                  }}
                                  className="px-2 py-1 rounded bg-[#0B171B] border border-white/[0.08] text-slate-200"
                                >
                                  <option value="AVAILABLE">Available</option>
                                  <option value="OCCUPIED">Occupied</option>
                                  <option value="RESERVED">Reserved</option>
                                  <option value="MAINTENANCE">Maintenance</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-between items-center pt-3 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => setIsInventoryConfigOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/[0.06] text-slate-300 hover:bg-white/[0.1] text-xs cursor-pointer"
              >
                Cancel
              </button>

              {configTab === 'FLOORS' ? (
                <button
                  type="button"
                  onClick={handleApplyFloorArchitect}
                  className="flex items-center gap-2 px-6 py-2 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-400 hover:opacity-90 shadow-md shadow-teal-500/20 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  Save Floor Layout ({architectTotalRooms} Rooms)
                </button>
              ) : configTab === 'COUNT' ? (
                <button
                  type="button"
                  onClick={handleApplyRoomCount}
                  className="flex items-center gap-2 px-6 py-2 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-400 hover:opacity-90 shadow-md shadow-teal-500/20 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  Apply Room Count ({configTargetRooms} Units)
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSaveBulkMatrix}
                  className="flex items-center gap-2 px-6 py-2 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-400 hover:opacity-90 shadow-md shadow-teal-500/20 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  Save Bed Capacities & Rates
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CONFIRM EMPTY ROOMS MODAL                                                 */}
      {/* ========================================================================= */}
      {isConfirmClearOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-100">
          <div className="w-full max-w-md rounded-2xl bg-[#0B171B] border border-rose-500/40 p-6 space-y-4 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">
                  Empty All Rooms?
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  This will clear the room inventory. The app will return to the setup screen so you can input how many rooms per floor and bed capacities from scratch.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => setIsConfirmClearOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/[0.06] text-slate-300 hover:bg-white/[0.1] text-xs cursor-pointer font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  clearAllRooms();
                  setIsConfirmClearOpen(false);
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold text-rose-100 bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-600/30 cursor-pointer"
              >
                Yes, Empty Rooms Tab
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
