import React, { useState } from 'react';
import {
  UserCog,
  Plus,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  DollarSign
} from 'lucide-react';
import { formatPHP } from '../../utils/formatters';

export const StaffManagementView: React.FC = () => {
  const [staffList, setStaffList] = useState([
    {
      id: 'staff-1',
      name: 'Boy "Kuya Boy" Ramos',
      role: 'Head Caretaker & Maintenance',
      phone: '+63 917 555 0192',
      email: 'boy.ramos@boardinghub.ph',
      status: 'ACTIVE',
      monthlySalary: 12000,
      assignedFloors: 'Floors 1, 2, 3',
      shift: 'Day Shift (7:00 AM – 4:00 PM)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    },
    {
      id: 'staff-2',
      name: 'Maria "Ate Maria" Santos',
      role: 'Common Area Custodian & Cleaning',
      phone: '+63 920 888 1234',
      email: 'maria.santos@boardinghub.ph',
      status: 'ACTIVE',
      monthlySalary: 9500,
      assignedFloors: 'Common Hallways, Stairs, Bathrooms',
      shift: 'Morning Shift (6:00 AM – 2:00 PM)',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
    },
    {
      id: 'staff-3',
      name: 'Nestor Magallanes',
      role: 'Night Security Guard',
      phone: '+63 919 444 8976',
      email: 'nestor.security@boardinghub.ph',
      status: 'ACTIVE',
      monthlySalary: 11000,
      assignedFloors: 'Main Gate & Perimeter',
      shift: 'Night Shift (7:00 PM – 7:00 AM)',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
    }
  ]);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
            Staff, Caretakers & Security
            <span className="text-xs px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 font-bold font-mono">
              3 On-Duty Staff
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your on-site boarding house caretakers, daily cleaners, gate guards, and maintenance contractors.
          </p>
        </div>
      </div>

      {/* Staff Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {staffList.map(staff => (
          <div key={staff.id} className="p-5 rounded-2xl bg-[#101F23] border border-white/[0.06] shadow-xl space-y-4">
            <div className="flex items-center gap-3.5">
              <img
                src={staff.avatar}
                alt={staff.name}
                className="w-12 h-12 rounded-2xl object-cover border-2 border-teal-500/30 shadow-md"
              />
              <div>
                <h3 className="text-base font-bold text-slate-100">{staff.name}</h3>
                <span className="text-xs text-teal-300 font-medium">{staff.role}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#0B171B] border border-white/[0.04] space-y-2 text-xs text-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Shift Schedule:</span>
                <span className="font-semibold text-slate-200">{staff.shift}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Assignment:</span>
                <span className="text-slate-200">{staff.assignedFloors}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Monthly Compensation:</span>
                <span className="font-mono font-bold text-teal-300">{formatPHP(staff.monthlySalary)}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs">
              <a
                href={`tel:${staff.phone}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500/10 text-teal-300 hover:bg-teal-500/20 border border-teal-500/30 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                Call Mobile
              </a>
              <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Active Staff
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
