import React from 'react';
import {
  LayoutDashboard,
  Building,
  BedDouble,
  Users,
  CreditCard,
  Zap,
  Wrench,
  Megaphone,
  Receipt,
  BarChart3,
  UserCog,
  FileCheck2,
  Settings,
  Sparkles,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  X
} from 'lucide-react';
import { Logo } from './Logo';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  isCollapsed?: boolean;
  setIsCollapsed?: (val: boolean | ((prev: boolean) => boolean)) => void;
  isMobileOpen?: boolean;
  setIsMobileOpen?: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed: propIsCollapsed,
  setIsCollapsed: propSetIsCollapsed,
  isMobileOpen: propIsMobileOpen,
  setIsMobileOpen: propSetIsMobileOpen
}) => {
  const {
    property,
    rooms,
    activeTab,
    setActiveTab,
    payments,
    maintenanceRequests,
    applications,
    subscriptionPlan,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen
  } = useApp();

  const isCollapsed = propIsCollapsed !== undefined ? propIsCollapsed : isSidebarCollapsed;
  const setIsCollapsed = propSetIsCollapsed || setIsSidebarCollapsed;
  const isMobileOpen = propIsMobileOpen !== undefined ? propIsMobileOpen : isMobileSidebarOpen;
  const setIsMobileOpen = propSetIsMobileOpen || setIsMobileSidebarOpen;

  const pendingPaymentsCount = payments.filter(p => p.status === 'PENDING').length;
  const newMaintenanceCount = maintenanceRequests.filter(m => m.status === 'NEW').length;
  const pendingApplicationsCount = applications.filter(a => a.status === 'PENDING').length;

  const ownerNavMain = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'properties', label: 'Property Profile', icon: Building },
    { id: 'rooms', label: 'Rooms & Beds', icon: BedDouble },
    { id: 'tenants', label: 'Tenants & Beds', icon: Users },
    { id: 'payments', label: 'Payments Ledger', icon: CreditCard, badge: pendingPaymentsCount > 0 ? pendingPaymentsCount : null },
    { id: 'utilities', label: 'Utility Billing', icon: Zap },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench, badge: newMaintenanceCount > 0 ? newMaintenanceCount : null },
    { id: 'announcements', label: 'Announcements', icon: Megaphone }
  ];

  const ownerNavBusiness = [
    { id: 'expenses', label: 'Expenses & Opex', icon: Receipt },
    { id: 'reports', label: 'Financial Reports', icon: BarChart3 },
    { id: 'staff', label: 'Staff & Caretakers', icon: UserCog },
    { id: 'applications', label: 'Tenant Inquiries', icon: FileCheck2, badge: pendingApplicationsCount > 0 ? pendingApplicationsCount : null }
  ];

  const ownerNavSystem = [
    { id: 'subscription', label: 'Plan & Billing', icon: Sparkles, tag: subscriptionPlan },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help & PH Support', icon: HelpCircle }
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/75 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="app-main-sidebar"
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 flex flex-col h-full shrink-0 border-r border-white/[0.08] bg-[#0B171B] transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Sidebar Header / Logo */}
        <div className={`flex h-16 items-center border-b border-white/[0.07] ${isCollapsed ? 'justify-between px-3' : 'justify-between px-4'}`}>
          <Logo size={isCollapsed ? 'sm' : 'md'} showTagline={false} showText={!isCollapsed} />
          
          <div className="flex items-center gap-1">
            {/* Desktop collapse/expand toggle */}
            <button
              id="btn-sidebar-collapse"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] transition-colors cursor-pointer"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4 text-teal-400" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            {/* Mobile close button */}
            <button
              id="btn-sidebar-mobile-close"
              onClick={() => setIsMobileOpen(false)}
              className="flex lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] transition-colors cursor-pointer"
              title="Close sidebar"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5 text-slate-300" />
            </button>
          </div>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* SECTION: MAIN */}
          <div>
            {!isCollapsed && (
              <div className="px-3 mb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Owner Management
              </div>
            )}
            <div className="space-y-1">
              {ownerNavMain.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center ${
                      isCollapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2'
                    } rounded-xl text-xs font-semibold transition-all group relative cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-teal-500/20 via-teal-500/10 to-transparent text-teal-300 border-l-2 border-teal-400 font-bold shadow-sm shadow-teal-500/10'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                    }`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-teal-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                    {!isCollapsed && item.badge && (
                      <span className="ml-auto px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                        {item.badge}
                      </span>
                    )}
                    {isCollapsed && item.badge && (
                      <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-teal-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION: BUSINESS */}
          <div>
            {!isCollapsed && (
              <div className="px-3 mb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Financials & Growth
              </div>
            )}
            <div className="space-y-1">
              {ownerNavBusiness.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center ${
                      isCollapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2'
                    } rounded-xl text-xs font-semibold transition-all group relative cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-teal-500/20 via-teal-500/10 to-transparent text-teal-300 border-l-2 border-teal-400 font-bold shadow-sm shadow-teal-500/10'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                    }`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-teal-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                    {!isCollapsed && item.badge && (
                      <span className="ml-auto px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION: SYSTEM */}
          <div>
            {!isCollapsed && (
              <div className="px-3 mb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                System & Plan
              </div>
            )}
            <div className="space-y-1">
              {ownerNavSystem.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center ${
                      isCollapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2'
                    } rounded-xl text-xs font-semibold transition-all group relative cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-teal-500/20 via-teal-500/10 to-transparent text-teal-300 border-l-2 border-teal-400 font-bold shadow-sm shadow-teal-500/10'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                    }`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-teal-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                    {!isCollapsed && item.tag && (
                      <span className="ml-auto px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider bg-teal-500/15 text-teal-300 border border-teal-500/30">
                        {item.tag}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Footer with Live Property & Room Stats */}
        {!isCollapsed ? (
          <div className="p-3 border-t border-white/[0.07] bg-[#071014]/60">
            <div className="p-3 rounded-xl bg-gradient-to-br from-teal-950/40 via-[#101F23] to-[#0B171B] border border-teal-500/20">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-teal-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                  <span className="truncate">{property.city || 'Davao City, PH'}</span>
                </div>
                <span className="text-[10px] font-semibold text-teal-400/80">Owner Hub</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                {rooms.length > 0 ? `${rooms.length} room(s) configured` : 'Room setup required'}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-2 border-t border-white/[0.07] bg-[#071014]/60 flex justify-center">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400" title="Owner Admin Mode">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
