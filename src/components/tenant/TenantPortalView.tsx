import React, { useState } from 'react';
import {
  Home,
  CreditCard,
  Receipt,
  Wrench,
  Megaphone,
  User,
  QrCode,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  Zap,
  Droplets,
  Wifi,
  Sparkles,
  Phone,
  ShieldCheck,
  Send,
  Camera,
  Calendar,
  DollarSign,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatPHP, formatDate } from '../../utils/formatters';
import { StatusBadge } from '../common/StatusBadge';
import { PaymentMethod, Tenant, Room } from '../../types';

export const TenantPortalView: React.FC = () => {
  const {
    property,
    currentUser,
    tenants,
    rooms,
    payments,
    invoices,
    maintenanceRequests,
    announcements,
    submitPayment,
    createMaintenanceRequest,
    setSelectedReceipt,
    addToast,
    activeTab,
    setActiveTab
  } = useApp();

  // Fallback defaults in case no tenants/rooms exist yet
  const fallbackTenant: Tenant = {
    id: 'tenant-demo',
    userId: currentUser?.id || 'user-tenant-demo',
    propertyId: property?.id || 'prop-01',
    roomId: 'room-101',
    bedLabel: 'Bed A',
    name: currentUser?.name || 'Resident',
    phone: '+63 917 123 4567',
    email: currentUser?.email || 'resident@boardinghub.ph',
    monthlyRent: 3500,
    depositAmount: 3500,
    advanceAmount: 3500,
    moveInDate: '2025-01-10',
    idType: 'UMID',
    idNumber: 'CRN-0111-2394819-2',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    emergencyContact: {
      name: 'Emergency Contact',
      relationship: 'Parent',
      phone: '+63 917 000 0000'
    },
    status: 'ACTIVE',
    currentBalance: 0
  };

  const fallbackRoom: Room = {
    id: 'room-101',
    propertyId: property?.id || 'prop-01',
    roomNumber: '101',
    floor: 1,
    capacity: 4,
    occupiedBeds: 1,
    monthlyRent: 3500,
    status: 'OCCUPIED',
    amenities: ['Aircon', 'Wi-Fi']
  };

  // Find tenant record with fallback
  const currentTenant = tenants.find(t => t.id === currentUser.tenantId || t.email === currentUser.email) || tenants[0] || fallbackTenant;
  const currentRoom = rooms.find(r => r.id === currentTenant?.roomId) || rooms[0] || fallbackRoom;

  // Tenant Sub-tabs or direct routing
  const [subTab, setSubTab] = useState<'HOME' | 'PAY' | 'HISTORY' | 'MAINTENANCE' | 'NOTICES' | 'PROFILE'>('HOME');

  // Payment Form State
  const [payAmount, setPayAmount] = useState<number>(currentTenant?.currentBalance || 3500);
  const [payMethod, setPayMethod] = useState<PaymentMethod>('GCASH');
  const [referenceCode, setReferenceCode] = useState<string>('90214820912');
  const [forMonth, setForMonth] = useState<string>('September 2026');
  const [proofImage, setProofImage] = useState<string | null>(
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80'
  );
  const [isSubmittingPay, setIsSubmittingPay] = useState(false);

  // Maintenance Form State
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketCategory, setTicketCategory] = useState<'PLUMBING' | 'ELECTRICAL' | 'AIRCON' | 'CARPENTRY' | 'OTHER'>('PLUMBING');
  const [ticketPriority, setTicketPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');
  const [ticketDesc, setTicketDesc] = useState('');
  const [ticketPhoto, setTicketPhoto] = useState<string | null>(
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80'
  );

  // Filter tenant-specific data
  const tenantPayments = payments.filter(p => p.tenantName === currentTenant?.name || p.tenantId === currentTenant?.id);
  const tenantInvoices = invoices.filter(i => i.tenantId === currentTenant?.id || i.tenantName === currentTenant?.name);
  const tenantTickets = maintenanceRequests.filter(m => m.tenantName === currentTenant?.name || m.roomNumber === currentRoom?.roomNumber);

  // Handle Pay Form Submission
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payAmount || !referenceCode) {
      addToast({ title: 'Incomplete Details', message: 'Please provide amount and transaction reference number.', type: 'warning' });
      return;
    }

    setIsSubmittingPay(true);
    setTimeout(() => {
      submitPayment({
        tenantName: currentTenant.name,
        tenantId: currentTenant.id,
        roomNumber: currentRoom.roomNumber,
        amount: payAmount,
        method: payMethod,
        referenceNumber: referenceCode,
        date: new Date().toISOString().split('T')[0],
        proofImageUrl: proofImage || undefined,
        forMonth: forMonth,
        rentAmount: Math.min(payAmount, currentTenant.monthlyRent),
        electricityAmount: Math.max(0, payAmount - currentTenant.monthlyRent),
        waterAmount: 180,
        wifiAmount: 250
      });

      setIsSubmittingPay(false);
      setSubTab('HISTORY');
    }, 600);
  };

  // Handle Maintenance Ticket Submission
  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketTitle || !ticketDesc) {
      addToast({ title: 'Missing Information', message: 'Please describe the facility issue.', type: 'warning' });
      return;
    }

    createMaintenanceRequest({
      title: ticketTitle,
      category: ticketCategory,
      priority: ticketPriority,
      description: ticketDesc,
      roomNumber: currentRoom.roomNumber,
      tenantName: currentTenant.name,
      photoUrl: ticketPhoto || undefined
    });

    setTicketTitle('');
    setTicketDesc('');
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Top Tenant Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-teal-950/60 via-[#101F23] to-[#0B171B] border border-teal-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <img
            src={currentTenant.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
            alt={currentTenant.name}
            className="w-12 h-12 rounded-2xl object-cover border-2 border-teal-400/50 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-100">{currentTenant.name}</h2>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                Resident #{currentTenant.id.replace('tenant-', '')}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {property.name} • Room <span className="text-teal-300 font-bold font-mono">{currentRoom.roomNumber}</span> ({currentTenant.bedLabel})
            </p>
          </div>
        </div>

        {/* Quick Quick Status Pill */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="px-3.5 py-2 rounded-xl bg-[#0B171B] border border-white/[0.08] text-right">
            <span className="text-[10px] text-slate-400 font-semibold block">Outstanding Due</span>
            <span className={`text-base font-extrabold font-mono ${currentTenant.currentBalance > 0 ? 'text-amber-400' : 'text-teal-400'}`}>
              {formatPHP(currentTenant.currentBalance)}
            </span>
          </div>
          {currentTenant.currentBalance > 0 && (
            <button
              onClick={() => setSubTab('PAY')}
              className="px-4 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-400 hover:opacity-90 shadow-md shadow-teal-500/20 transition-all"
            >
              Pay via GCash
            </button>
          )}
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setSubTab('HOME')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
            subTab === 'HOME' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' : 'bg-[#101F23] text-slate-400 hover:text-slate-200 border border-white/[0.06]'
          }`}
        >
          <Home className="w-4 h-4" />
          Overview & Bill
        </button>
        <button
          onClick={() => setSubTab('PAY')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
            subTab === 'PAY' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' : 'bg-[#101F23] text-slate-400 hover:text-slate-200 border border-white/[0.06]'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          Pay Rent / QR PH
        </button>
        <button
          onClick={() => setSubTab('HISTORY')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
            subTab === 'HISTORY' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' : 'bg-[#101F23] text-slate-400 hover:text-slate-200 border border-white/[0.06]'
          }`}
        >
          <Receipt className="w-4 h-4" />
          Receipts ({tenantPayments.length})
        </button>
        <button
          onClick={() => setSubTab('MAINTENANCE')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
            subTab === 'MAINTENANCE' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' : 'bg-[#101F23] text-slate-400 hover:text-slate-200 border border-white/[0.06]'
          }`}
        >
          <Wrench className="w-4 h-4" />
          Repairs ({tenantTickets.length})
        </button>
        <button
          onClick={() => setSubTab('NOTICES')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
            subTab === 'NOTICES' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' : 'bg-[#101F23] text-slate-400 hover:text-slate-200 border border-white/[0.06]'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          House Notices
        </button>
        <button
          onClick={() => setSubTab('PROFILE')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
            subTab === 'PROFILE' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' : 'bg-[#101F23] text-slate-400 hover:text-slate-200 border border-white/[0.06]'
          }`}
        >
          <User className="w-4 h-4" />
          Profile & Agreement
        </button>
      </div>

      {/* VIEW: HOME OVERVIEW */}
      {subTab === 'HOME' && (
        <div className="space-y-6">
          {/* Current Month Statement Card */}
          <div className="p-5 rounded-2xl bg-[#101F23] border border-teal-500/20 shadow-xl space-y-4">
            <div className="flex justify-between items-start border-b border-white/[0.06] pb-3">
              <div>
                <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider font-mono">
                  Statement of Account • September 2026
                </span>
                <h3 className="text-lg font-bold text-slate-100 mt-0.5">
                  Monthly Rent & Utility Breakdown
                </h3>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold font-mono ${
                currentTenant.currentBalance > 0 ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
              }`}>
                {currentTenant.currentBalance > 0 ? 'Due by Sept 5, 2026' : 'Fully Settled'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#0B171B] border border-white/[0.06]">
                <div className="flex items-center gap-2 text-slate-400 font-semibold mb-1">
                  <Home className="w-3.5 h-3.5 text-teal-400" />
                  <span>Bedspace Rent</span>
                </div>
                <div className="text-base font-extrabold text-slate-100 font-mono">
                  {formatPHP(currentTenant.monthlyRent)}
                </div>
                <span className="text-[10px] text-slate-400">Fixed rate</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0B171B] border border-white/[0.06]">
                <div className="flex items-center gap-2 text-slate-400 font-semibold mb-1">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Electricity Submeter</span>
                </div>
                <div className="text-base font-extrabold text-slate-100 font-mono">
                  {formatPHP(620)}
                </div>
                <span className="text-[10px] text-slate-400">49.6 kWh @ ₱12.50</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0B171B] border border-white/[0.06]">
                <div className="flex items-center gap-2 text-slate-400 font-semibold mb-1">
                  <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Water Utility</span>
                </div>
                <div className="text-base font-extrabold text-slate-100 font-mono">
                  {formatPHP(180)}
                </div>
                <span className="text-[10px] text-slate-400">Equal resident split</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0B171B] border border-white/[0.06]">
                <div className="flex items-center gap-2 text-slate-400 font-semibold mb-1">
                  <Wifi className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Fiber Wi-Fi</span>
                </div>
                <div className="text-base font-extrabold text-emerald-400 font-mono">
                  Included (₱0)
                </div>
                <span className="text-[10px] text-slate-400">500 Mbps Shared</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-r from-teal-950/40 to-cyan-950/40 border border-teal-500/30 flex justify-between items-center">
              <div>
                <span className="text-xs text-slate-300 font-semibold">Total Amount Payable</span>
                <p className="text-[11px] text-slate-400">Includes rent + electricity share + water</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-extrabold text-teal-300 font-mono">
                  {formatPHP(currentTenant.currentBalance)}
                </span>
              </div>
            </div>
          </div>

          {/* Quick House Notices & Room Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-[#101F23] border border-white/[0.06] space-y-3">
              <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-teal-400" />
                Latest House Announcements
              </h4>
              <div className="space-y-2 text-xs">
                {announcements.slice(0, 2).map(ann => (
                  <div key={ann.id} className="p-3 rounded-xl bg-[#0B171B] border border-white/[0.04]">
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-bold text-slate-200">{ann.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{formatDate(ann.date)}</span>
                    </div>
                    <p className="text-slate-400 mt-1 line-clamp-2 leading-relaxed">{ann.content}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#101F23] border border-white/[0.06] space-y-3">
              <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                Boarding House Key Contacts & Rules
              </h4>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex justify-between p-2.5 rounded-xl bg-[#0B171B] border border-white/[0.04]">
                  <span className="text-slate-400">Caretaker On-Duty:</span>
                  <span className="font-semibold text-slate-200">Kuya Boy (+63 917 555 0192)</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-xl bg-[#0B171B] border border-white/[0.04]">
                  <span className="text-slate-400">Night Curfew:</span>
                  <span className="font-semibold text-amber-300">11:00 PM (Gate locked)</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-xl bg-[#0B171B] border border-white/[0.04]">
                  <span className="text-slate-400">Wi-Fi Network:</span>
                  <span className="font-mono text-teal-300">Jibril_BH_5G (Pass: bhdavao2026)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: PAY RENT / GCASH */}
      {subTab === 'PAY' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: QR Code & Instructions */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl bg-[#101F23] border border-teal-500/30 text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold">
                <QrCode className="w-4 h-4" />
                Official Property QR PH
              </div>

              {/* QR Graphic Mock */}
              <div className="w-48 h-48 mx-auto bg-white p-3 rounded-2xl shadow-xl flex flex-col items-center justify-center border-4 border-teal-500">
                <div className="w-full h-full bg-slate-900 rounded-xl flex flex-col items-center justify-center p-2 text-center">
                  <QrCode className="w-24 h-24 text-teal-400" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest mt-1">
                    GCash / Maya / QR PH
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm font-bold text-slate-100">Scan to Pay via Any Bank or E-Wallet</p>
                <p className="text-xs text-slate-400 mt-0.5">Account Name: <strong className="text-slate-200">Jan Dela Cruz (Owner)</strong></p>
                <p className="text-xs font-mono text-teal-400 font-bold mt-1">GCash No: 0917 845 2931</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0B171B] border border-white/[0.06] text-xs text-slate-400 space-y-1.5">
              <div className="font-bold text-slate-200">Payment Steps:</div>
              <p>1. Open your GCash / Maya or bank app.</p>
              <p>2. Send amount ({formatPHP(payAmount)}) to the number or scan QR.</p>
              <p>3. Take a screenshot of the confirmation receipt.</p>
              <p>4. Enter reference code and upload screenshot on the right.</p>
            </div>
          </div>

          {/* Right: Payment Submission Form */}
          <div className="lg:col-span-7">
            <div className="p-6 rounded-2xl bg-[#101F23] border border-white/[0.08] shadow-xl space-y-4">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-teal-400" />
                Submit Payment Confirmation Proof
              </h3>

              <form onSubmit={handlePaymentSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Amount Paid (PHP) *</label>
                    <input
                      type="number"
                      required
                      value={payAmount}
                      onChange={e => setPayAmount(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl bg-[#0B171B] border border-white/[0.08] text-slate-100 font-mono font-bold focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Payment Method *</label>
                    <select
                      value={payMethod}
                      onChange={e => setPayMethod(e.target.value as PaymentMethod)}
                      className="w-full px-3 py-2 rounded-xl bg-[#0B171B] border border-white/[0.08] text-slate-100 focus:border-teal-500 focus:outline-none"
                    >
                      <option value="GCASH">GCash</option>
                      <option value="MAYA">Maya</option>
                      <option value="BANK_TRANSFER">Bank Transfer (BDO/BPI)</option>
                      <option value="CASH">Cash Over-the-counter</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Transaction Ref No. *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 90214820912"
                      value={referenceCode}
                      onChange={e => setReferenceCode(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#0B171B] border border-white/[0.08] text-slate-100 font-mono focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Billing Month *</label>
                    <input
                      type="text"
                      value={forMonth}
                      onChange={e => setForMonth(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#0B171B] border border-white/[0.08] text-slate-100 focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Screenshot Upload Simulator */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Upload Receipt Screenshot</label>
                  <div className="border-2 border-dashed border-white/10 rounded-xl p-4 text-center hover:border-teal-500/40 transition-colors bg-[#0B171B]">
                    {proofImage ? (
                      <div className="flex items-center justify-between gap-3 p-2 bg-[#101F23] rounded-lg">
                        <img src={proofImage} alt="Proof" className="w-12 h-12 object-cover rounded" />
                        <span className="text-[11px] text-teal-300 font-mono">receipt_screenshot.png</span>
                        <button
                          type="button"
                          onClick={() => setProofImage(null)}
                          className="text-rose-400 hover:text-rose-300 text-[10px]"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                        <p className="text-slate-300 font-semibold">Click or drag receipt screenshot</p>
                        <p className="text-[10px] text-slate-400">PNG, JPG up to 10MB</p>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingPay}
                  className="w-full py-3 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-400 hover:opacity-90 shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {isSubmittingPay ? 'Submitting Payment Proof...' : 'Submit Payment for Verification'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: PAYMENT RECEIPTS */}
      {subTab === 'HISTORY' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-slate-100">Official Payment History & Receipts</h3>
            <span className="text-xs text-slate-400">{tenantPayments.length} recorded payments</span>
          </div>

          <div className="rounded-2xl bg-[#101F23] border border-white/[0.06] shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/[0.08] text-slate-400 font-semibold uppercase tracking-wider text-[10px] bg-[#0B171B]">
                    <th className="py-3 px-4">Receipt No</th>
                    <th className="py-3 px-4">Period</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Method</th>
                    <th className="py-3 px-4">Reference</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Official Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] text-slate-200">
                  {tenantPayments.map(p => (
                    <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-teal-300">{p.receiptNumber}</td>
                      <td className="py-3.5 px-4">{p.forMonth}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-100">{formatPHP(p.amount)}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20 text-[10px] font-bold">
                          {p.method}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-400">{p.referenceNumber}</td>
                      <td className="py-3.5 px-4">
                        <StatusBadge type="payment" status={p.status} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {p.status === 'PAID' ? (
                          <button
                            onClick={() => setSelectedReceipt(p)}
                            className="px-2.5 py-1 rounded-lg bg-teal-500/10 text-teal-300 hover:bg-teal-500/20 border border-teal-500/30 text-[11px] font-semibold"
                          >
                            View Receipt
                          </button>
                        ) : (
                          <span className="text-[10px] text-amber-400">Verifying...</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: MAINTENANCE & REPAIRS */}
      {subTab === 'MAINTENANCE' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5">
            <div className="p-5 rounded-2xl bg-[#101F23] border border-white/[0.08] shadow-xl space-y-4">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-teal-400" />
                Report Facility Problem
              </h3>

              <form onSubmit={handleTicketSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Issue Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shower faucet leaking, AC not cooling"
                    value={ticketTitle}
                    onChange={e => setTicketTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B171B] border border-white/[0.08] text-slate-100 focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Category</label>
                    <select
                      value={ticketCategory}
                      onChange={e => setTicketCategory(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-[#0B171B] border border-white/[0.08] text-slate-100 focus:border-teal-500 focus:outline-none"
                    >
                      <option value="PLUMBING">Plumbing</option>
                      <option value="ELECTRICAL">Electrical</option>
                      <option value="AIRCON">Aircon</option>
                      <option value="CARPENTRY">Carpentry / Door</option>
                      <option value="OTHER">Other Issue</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Urgency</label>
                    <select
                      value={ticketPriority}
                      onChange={e => setTicketPriority(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-[#0B171B] border border-white/[0.08] text-slate-100 focus:border-teal-500 focus:outline-none"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High Priority</option>
                      <option value="URGENT">Urgent (Emergency)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Detailed Description *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Explain the location in room, when it started..."
                    value={ticketDesc}
                    onChange={e => setTicketDesc(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[#0B171B] border border-white/[0.08] text-slate-100 focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-400 hover:opacity-90 shadow-md shadow-teal-500/20"
                >
                  Dispatch Maintenance Request
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-3">
            <h4 className="text-sm font-bold text-slate-100">My Reported Tickets ({tenantTickets.length})</h4>
            <div className="space-y-3">
              {tenantTickets.map(ticket => (
                <div key={ticket.id} className="p-4 rounded-xl bg-[#101F23] border border-white/[0.06] space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono text-teal-400 uppercase font-bold">{ticket.ticketNumber}</span>
                      <h5 className="text-sm font-bold text-slate-100">{ticket.title}</h5>
                    </div>
                    <StatusBadge type="maintenance" status={ticket.status} size="sm" />
                  </div>
                  <p className="text-xs text-slate-300">{ticket.description}</p>
                  {ticket.resolutionNotes && (
                    <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-[11px] text-emerald-300">
                      <strong>Resolved:</strong> {ticket.resolutionNotes}
                    </div>
                  )}
                  <span className="text-[10px] text-slate-400 font-mono block">Filed on {formatDate(ticket.createdAt)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW: NOTICES */}
      {subTab === 'NOTICES' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-100">Boarding House Bulletin & Rules</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {announcements.map(ann => (
              <div key={ann.id} className="p-5 rounded-2xl bg-[#101F23] border border-white/[0.06] space-y-3">
                <div className="flex justify-between items-start">
                  <span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/30 text-[10px] font-bold">
                    {ann.category || 'NOTICE'}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{formatDate(ann.date)}</span>
                </div>
                <h4 className="text-base font-bold text-slate-100">{ann.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{ann.content}</p>
                <div className="text-[10px] text-slate-400 pt-2 border-t border-white/[0.04]">
                  Posted by Property Administration
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: PROFILE */}
      {subTab === 'PROFILE' && (
        <div className="p-6 rounded-2xl bg-[#101F23] border border-white/[0.08] shadow-xl space-y-6">
          <div className="flex items-center gap-4 pb-4 border-b border-white/[0.06]">
            <img
              src={currentTenant.avatar}
              alt={currentTenant.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-500/40"
            />
            <div>
              <h3 className="text-lg font-bold text-slate-100">{currentTenant.name}</h3>
              <p className="text-xs text-slate-400">{currentTenant.occupation}</p>
              <span className="text-[11px] text-teal-300 font-mono">Move-in date: {currentTenant.moveInDate}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-[#0B171B] border border-white/[0.06] space-y-1">
              <span className="text-slate-400 font-semibold">Contact Email</span>
              <p className="text-slate-200 font-medium">{currentTenant.email}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#0B171B] border border-white/[0.06] space-y-1">
              <span className="text-slate-400 font-semibold">Mobile Number</span>
              <p className="text-slate-200 font-mono">{currentTenant.phone}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#0B171B] border border-white/[0.06] space-y-1">
              <span className="text-slate-400 font-semibold">Emergency Contact</span>
              <p className="text-slate-200 font-medium">{currentTenant.emergencyContactName} ({currentTenant.emergencyRelationship})</p>
              <p className="text-slate-400 text-[11px] font-mono">{currentTenant.emergencyContactPhone}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#0B171B] border border-white/[0.06] space-y-1">
              <span className="text-slate-400 font-semibold">Security Deposit on Record</span>
              <p className="text-teal-300 font-mono font-bold text-sm">{formatPHP(currentTenant.depositAmount)}</p>
              <span className="text-[10px] text-slate-400">Refundable upon clearance</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
