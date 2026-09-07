import React from 'react';

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-white/[0.06] rounded-lg" />
          <div className="h-4 w-72 bg-white/[0.04] rounded-lg" />
        </div>
        <div className="h-10 w-32 bg-white/[0.06] rounded-xl" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-28 bg-[#101F23] border border-white/[0.06] rounded-2xl p-4 space-y-3">
            <div className="h-4 w-24 bg-white/[0.06] rounded" />
            <div className="h-7 w-32 bg-white/[0.08] rounded" />
          </div>
        ))}
      </div>

      {/* Chart & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-80 bg-[#101F23] border border-white/[0.06] rounded-2xl p-6" />
        <div className="h-80 bg-[#101F23] border border-white/[0.06] rounded-2xl p-6" />
      </div>
    </div>
  );
};

export const TableSkeleton: React.FC = () => {
  return (
    <div className="rounded-2xl bg-[#101F23] border border-white/[0.06] p-4 space-y-4 animate-pulse">
      <div className="h-10 bg-white/[0.04] rounded-xl" />
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="h-12 bg-white/[0.02] rounded-lg flex items-center justify-between px-4">
          <div className="h-4 w-32 bg-white/[0.06] rounded" />
          <div className="h-4 w-20 bg-white/[0.04] rounded" />
          <div className="h-4 w-24 bg-white/[0.06] rounded" />
          <div className="h-6 w-16 bg-white/[0.08] rounded-full" />
        </div>
      ))}
    </div>
  );
};
