import React from 'react';
import { RoomStatus, PaymentStatus, TenantStatus, MaintenanceStatus, MaintenancePriority } from '../../types';

interface StatusBadgeProps {
  type: 'room' | 'payment' | 'tenant' | 'maintenance' | 'priority' | 'invoice';
  status: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  type,
  status,
  size = 'md',
  className = ''
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  // Room Status
  if (type === 'room') {
    const roomStatus = status as RoomStatus;
    switch (roomStatus) {
      case 'OCCUPIED':
        return (
          <span className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 ${sizeClasses} ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Occupied
          </span>
        );
      case 'AVAILABLE':
        return (
          <span className={`inline-flex items-center gap-1.5 rounded-full bg-teal-500/10 border border-teal-500/25 text-teal-300 ${sizeClasses} ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
            Available
          </span>
        );
      case 'RESERVED':
        return (
          <span className={`inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 ${sizeClasses} ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            Reserved
          </span>
        );
      case 'MAINTENANCE':
        return (
          <span className={`inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 ${sizeClasses} ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Maintenance
          </span>
        );
      default:
        return null;
    }
  }

  // Payment Status
  if (type === 'payment' || type === 'invoice') {
    const payStatus = status as PaymentStatus | 'PARTIAL';
    switch (payStatus) {
      case 'PAID':
        return (
          <span className={`inline-flex items-center gap-1.5 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 font-semibold ${sizeClasses} ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
            Paid
          </span>
        );
      case 'PENDING':
        return (
          <span className={`inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 ${sizeClasses} ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            Pending Review
          </span>
        );
      case 'OVERDUE':
        return (
          <span className={`inline-flex items-center gap-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 ${sizeClasses} ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            Overdue
          </span>
        );
      case 'REJECTED':
        return (
          <span className={`inline-flex items-center gap-1.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-300 ${sizeClasses} ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            Rejected
          </span>
        );
      case 'PARTIAL':
        return (
          <span className={`inline-flex items-center gap-1.5 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-300 ${sizeClasses} ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            Partial Paid
          </span>
        );
      default:
        return null;
    }
  }

  // Tenant Status
  if (type === 'tenant') {
    const tenantStatus = status as TenantStatus;
    switch (tenantStatus) {
      case 'ACTIVE':
        return (
          <span className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 ${sizeClasses} ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Active
          </span>
        );
      case 'PENDING':
        return (
          <span className={`inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 ${sizeClasses} ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Pending Review
          </span>
        );
      case 'OVERDUE':
        return (
          <span className={`inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 border border-rose-500/25 text-rose-300 ${sizeClasses} ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            Rent Overdue
          </span>
        );
      case 'FORMER':
        return (
          <span className={`inline-flex items-center gap-1.5 rounded-full bg-slate-500/10 border border-slate-500/25 text-slate-400 ${sizeClasses} ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Former
          </span>
        );
      default:
        return null;
    }
  }

  // Maintenance Status
  if (type === 'maintenance') {
    const maintStatus = status as MaintenanceStatus;
    switch (maintStatus) {
      case 'NEW':
        return (
          <span className={`inline-flex items-center gap-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 ${sizeClasses} ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            New
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className={`inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 ${sizeClasses} ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            In Progress
          </span>
        );
      case 'RESOLVED':
        return (
          <span className={`inline-flex items-center gap-1.5 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 ${sizeClasses} ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
            Resolved
          </span>
        );
      default:
        return null;
    }
  }

  // Priority
  if (type === 'priority') {
    const prio = status as MaintenancePriority;
    switch (prio) {
      case 'URGENT':
      case 'HIGH':
        return (
          <span className={`inline-flex items-center gap-1 rounded-md bg-rose-500/15 border border-rose-500/30 text-rose-300 font-semibold ${sizeClasses} ${className}`}>
            High Priority
          </span>
        );
      case 'MEDIUM':
        return (
          <span className={`inline-flex items-center gap-1 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 ${sizeClasses} ${className}`}>
            Medium
          </span>
        );
      case 'LOW':
        return (
          <span className={`inline-flex items-center gap-1 rounded-md bg-slate-500/15 border border-slate-500/30 text-slate-300 ${sizeClasses} ${className}`}>
            Low
          </span>
        );
      default:
        return null;
    }
  }

  return (
    <span className={`inline-flex items-center rounded-full bg-slate-800 border border-slate-700 text-slate-300 ${sizeClasses} ${className}`}>
      {status}
    </span>
  );
};
