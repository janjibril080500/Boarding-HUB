import React, { useState } from 'react';
import {
  Building2,
  BedDouble,
  Zap,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  MapPin,
  Phone,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Property, UtilityType } from '../../types';
import { Logo } from '../common/Logo';

export const OwnerOnboardingWizard: React.FC = () => {
  const { completeOnboarding, property, setIsOnboarding, setActiveTab } = useApp();
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [formData, setFormData] = useState({
    name: property?.name || 'Boarding House',
    type: 'BOARDING_HOUSE' as Property['type'],
    address: property?.address || '42 Acacia Street, Matina',
    city: property?.city || 'Davao City',
    province: property?.province || 'Davao del Sur',
    contactNumber: property?.contactNumber || '+63 917 845 2931',
    totalFloors: 3,
    totalRooms: 30,
    capacityPerRoom: 4,
    defaultMonthlyRent: 3500,
    utilities: ['ELECTRICITY', 'WATER', 'WIFI'] as UtilityType[],
    electricityRate: 12.50,
    waterRate: 180.00,
    wifiFlatRate: 250.00
  });

  const toggleUtility = (type: UtilityType) => {
    setFormData(prev => ({
      ...prev,
      utilities: prev.utilities.includes(type)
        ? prev.utilities.filter(u => u !== type)
        : [...prev.utilities, type]
    }));
  };

  const handleFinish = () => {
    completeOnboarding({
      name: formData.name,
      type: formData.type,
      address: formData.address,
      city: formData.city,
      province: formData.province,
      contactNumber: formData.contactNumber,
      totalFloors: formData.totalFloors,
      totalRooms: formData.totalRooms,
      defaultMonthlyRent: formData.defaultMonthlyRent,
      utilitiesIncluded: formData.utilities,
      electricityRate: formData.electricityRate,
      waterRate: formData.waterRate,
      wifiFlatRate: formData.wifiFlatRate
    });
    setIsOnboarding(false);
    setActiveTab('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#071014] text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl">
        {/* Top Branding & Skip Option */}
        <div className="flex items-center justify-between mb-6 px-1">
          <Logo size="md" showTagline />
          <button
            type="button"
            onClick={() => {
              setIsOnboarding(false);
              setActiveTab('dashboard');
            }}
            className="text-xs text-teal-400 hover:text-teal-300 font-semibold px-3 py-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 transition-all cursor-pointer"
          >
            Skip to Dashboard →
          </button>
        </div>

        {/* Wizard Card Container */}
        <div className="rounded-2xl bg-[#0B171B] border border-teal-500/20 shadow-2xl p-6 sm:p-8">
          {/* Progress Indicator 1 -> 2 -> 3 -> 4 */}
          <div className="mb-8">
            <div className="flex items-center justify-between relative">
              {/* Progress Line */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/[0.08] -translate-y-1/2 -z-0" />
              <div
                className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-teal-500 to-cyan-400 -translate-y-1/2 transition-all duration-300 -z-0"
                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
              />

              {[1, 2, 3, 4].map(step => {
                const isPassed = step < currentStep;
                const isCurrent = step === currentStep;
                return (
                  <div key={step} className="flex flex-col items-center relative z-10">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        isPassed
                          ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/30'
                          : isCurrent
                          ? 'bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 ring-4 ring-teal-500/20 font-extrabold'
                          : 'bg-[#101F23] border border-white/[0.1] text-slate-400'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-5 h-5" /> : step === 4 ? '✓' : step}
                    </div>
                    <span className={`text-[10px] font-semibold mt-2 ${isCurrent ? 'text-teal-300' : 'text-slate-400'}`}>
                      {step === 1 && 'Property Info'}
                      {step === 2 && 'Floor & Rooms'}
                      {step === 3 && 'Utilities'}
                      {step === 4 && 'Launch'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 1: PROPERTY INFO */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-teal-400" />
                  Property Information
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Enter your boarding house or apartment establishment details.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Property Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Jibril Boarding House"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#101F23] border border-white/[0.08] text-sm text-slate-100 placeholder-slate-500 focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Property Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value as Property['type'] })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#101F23] border border-white/[0.08] text-sm text-slate-100 focus:border-teal-500 focus:outline-none"
                  >
                    <option value="BOARDING_HOUSE">Boarding House (Bedspace)</option>
                    <option value="DORMITORY">Student Dormitory</option>
                    <option value="BEDSPACE">Bedspace Facility</option>
                    <option value="APARTMENT">Apartment Complex</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Official Contact Number *
                  </label>
                  <input
                    type="text"
                    value={formData.contactNumber}
                    onChange={e => setFormData({ ...formData, contactNumber: e.target.value })}
                    placeholder="+63 917 845 2931"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#101F23] border border-white/[0.08] text-sm text-slate-100 placeholder-slate-500 focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    placeholder="e.g. 42 Acacia Street, Matina"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#101F23] border border-white/[0.08] text-sm text-slate-100 placeholder-slate-500 focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    City / Municipality *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Davao City"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#101F23] border border-white/[0.08] text-sm text-slate-100 placeholder-slate-500 focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Province *
                  </label>
                  <input
                    type="text"
                    value={formData.province}
                    onChange={e => setFormData({ ...formData, province: e.target.value })}
                    placeholder="e.g. Davao del Sur"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#101F23] border border-white/[0.08] text-sm text-slate-100 placeholder-slate-500 focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PROPERTY SETUP */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <BedDouble className="w-5 h-5 text-teal-400" />
                  Building & Room Structure
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Configure floors, rooms, and standard monthly rent rates.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Number of Floors
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.totalFloors}
                    onChange={e => setFormData({ ...formData, totalFloors: parseInt(e.target.value) || 1 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#101F23] border border-white/[0.08] text-sm text-slate-100 focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Total Rooms in Building
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.totalRooms}
                    onChange={e => setFormData({ ...formData, totalRooms: parseInt(e.target.value) || 1 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#101F23] border border-white/[0.08] text-sm text-slate-100 focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Default Bed Capacity per Room
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={formData.capacityPerRoom}
                    onChange={e => setFormData({ ...formData, capacityPerRoom: parseInt(e.target.value) || 1 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#101F23] border border-white/[0.08] text-sm text-slate-100 focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Default Monthly Rent (PHP)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-sm text-teal-400 font-bold">₱</span>
                    <input
                      type="number"
                      step="100"
                      value={formData.defaultMonthlyRent}
                      onChange={e => setFormData({ ...formData, defaultMonthlyRent: parseFloat(e.target.value) || 0 })}
                      className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-[#101F23] border border-white/[0.08] text-sm text-slate-100 focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#101F23] border border-teal-500/20 text-xs text-slate-300">
                <span className="font-bold text-teal-300">Auto-Generation Preview:</span> We will generate {formData.totalRooms} room profiles numbered 101, 102... with floor segmentation ready for immediate tenant assignments.
              </div>
            </div>
          )}

          {/* STEP 3: UTILITIES */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-teal-400" />
                  Utilities & Billing Configuration
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Select utilities you provide and customize standard billing rates.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'ELECTRICITY' as UtilityType, label: 'Electricity (kWh)', icon: '⚡' },
                  { id: 'WATER' as UtilityType, label: 'Water (m³)', icon: '💧' },
                  { id: 'WIFI' as UtilityType, label: 'Wi-Fi Fiber', icon: '📶' },
                  { id: 'OTHER' as UtilityType, label: 'Gas / Other', icon: '🔥' }
                ].map(item => {
                  const isChecked = formData.utilities.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleUtility(item.id)}
                      className={`p-3.5 rounded-xl border text-center transition-all ${
                        isChecked
                          ? 'bg-teal-500/20 border-teal-400 text-teal-200 shadow-md shadow-teal-500/10'
                          : 'bg-[#101F23] border-white/[0.08] text-slate-400 hover:border-white/20'
                      }`}
                    >
                      <div className="text-2xl mb-1">{item.icon}</div>
                      <div className="text-xs font-semibold">{item.label}</div>
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Electricity Rate (₱/kWh)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.electricityRate}
                    onChange={e => setFormData({ ...formData, electricityRate: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#101F23] border border-white/[0.08] text-sm text-slate-100 focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Water Share / Tenant (₱)
                  </label>
                  <input
                    type="number"
                    step="10"
                    value={formData.waterRate}
                    onChange={e => setFormData({ ...formData, waterRate: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#101F23] border border-white/[0.08] text-sm text-slate-100 focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Wi-Fi Monthly Fee (₱)
                  </label>
                  <input
                    type="number"
                    step="50"
                    value={formData.wifiFlatRate}
                    onChange={e => setFormData({ ...formData, wifiFlatRate: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#101F23] border border-white/[0.08] text-sm text-slate-100 focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: COMPLETE & LAUNCH */}
          {currentStep === 4 && (
            <div className="space-y-6 text-center py-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center mx-auto text-slate-950 shadow-xl shadow-teal-500/20 animate-bounce">
                <Sparkles className="w-8 h-8" />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-100">
                  Ready to Launch {formData.name}!
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mt-2 leading-relaxed">
                  Your property workspace has been configured with {formData.totalRooms} rooms across {formData.totalFloors} floors in {formData.city}.
                </p>
              </div>

              <div className="max-w-md mx-auto p-4 rounded-xl bg-[#101F23] border border-white/[0.08] text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Establishment:</span>
                  <span className="font-bold text-slate-200">{formData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Location:</span>
                  <span className="text-slate-200">{formData.city}, {formData.province}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Rooms & Capacity:</span>
                  <span className="text-teal-300 font-semibold">{formData.totalRooms} Rooms ({formData.totalFloors} Floors)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Default Rent:</span>
                  <span className="font-mono text-teal-300 font-bold">₱{formData.defaultMonthlyRent.toLocaleString()} / mo</span>
                </div>
              </div>
            </div>
          )}

          {/* Wizard Action Buttons */}
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-white/[0.08]">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-white/[0.06] hover:bg-white/[0.1] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>
            ) : (
              <div />
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => Math.min(4, prev + 1))}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-400 hover:opacity-90 shadow-lg shadow-teal-500/20 transition-all cursor-pointer"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-extrabold text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-400 hover:opacity-90 shadow-xl shadow-teal-500/30 transition-all cursor-pointer"
              >
                Generate Property Dashboard
                <Sparkles className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
