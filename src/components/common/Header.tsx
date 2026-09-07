import React, { useEffect } from 'react';
import {
  Search,
  Bell,
  Building2,
  ChevronDown,
  UserCheck,
  RotateCcw,
  Sparkles,
  Smartphone,
  ShieldAlert,
  SlidersHorizontal,
  LogOut,
  ExternalLink,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  PanelLeft
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  onOpenNotifications?: () => void;
  unreadNotificationsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNotifications, unreadNotificationsCount }) => {
  const {
    property,
    currentUser,
    setIsSearchOpen,
    setActiveTab,
    payments,
    notifications,
    setIsNotificationsOpen,
    isSidebarCollapsed,
    toggleSidebar
  } = useApp();

  const pendingPaymentsCount = payments.filter(p => p.status === 'PENDING').length;
  const unreadCount = unreadNotificationsCount !== undefined
    ? unreadNotificationsCount
    : notifications.filter(n => !n.read).length;

  const handleOpenNotifications = onOpenNotifications || (() => {
    setIsNotificationsOpen(true);
  });

  // Global shortcut (Ctrl+B / Cmd+B) to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar]);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/[0.07] bg-[#071014]/90 backdrop-blur-md px-3 sm:px-6">
      {/* Left: Sidebar Toggle Button & Property Selector */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Toggle Side Panel Button */}
        <button
          id="btn-header-toggle-sidebar"
          onClick={toggleSidebar}
          className="p-2 rounded-lg text-slate-300 hover:text-white bg-[#0B171B] border border-white/[0.08] hover:border-teal-500/40 hover:bg-white/[0.06] transition-all cursor-pointer flex items-center justify-center shadow-xs group"
          title={isSidebarCollapsed ? "Expand side panel (Ctrl+B)" : "Collapse side panel (Ctrl+B)"}
          aria-label="Toggle Side Panel"
        >
          {/* Mobile menu icon */}
          <span className="lg:hidden">
            <Menu className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform" />
          </span>
          {/* Desktop panel toggle icon */}
          <span className="hidden lg:inline-flex items-center">
            {isSidebarCollapsed ? (
              <PanelLeftOpen className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform" />
            ) : (
              <PanelLeftClose className="w-4 h-4 text-slate-300 group-hover:text-teal-300 transition-colors" />
            )}
          </span>
        </button>

        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#0B171B] border border-white/[0.08] text-sm font-medium text-slate-200 shadow-sm">
          <div className="w-6 h-6 rounded-md bg-teal-500/10 border border-teal-500/25 flex items-center justify-center text-teal-400">
            <Building2 className="w-3.5 h-3.5" />
          </div>
          <span className="hidden sm:inline font-semibold">{property?.name || 'Boarding House'}</span>
          <span className="sm:hidden font-semibold">{(property?.name || 'Boarding House').split(' ')[0]}</span>
          <span className="text-xs px-1.5 py-0.5 rounded bg-white/[0.06] text-slate-400 font-normal">
            {property?.city || 'Davao City'}
          </span>
        </div>

        {/* Pending Verification Quick Pill */}
        {pendingPaymentsCount > 0 && (
          <button
            onClick={() => setActiveTab('payments')}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold hover:bg-amber-500/20 transition-colors animate-pulse cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            {pendingPaymentsCount} Payment{pendingPaymentsCount > 1 ? 's' : ''} to Verify
          </button>
        )}
      </div>

      {/* Right Controls: Search, Notifications, User */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Global Search Bar */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-400 bg-[#0B171B] border border-white/[0.08] hover:border-teal-500/40 rounded-lg transition-all group cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-400" />
          <span className="hidden md:inline">Search tenants, rooms, bills...</span>
          <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white/[0.06] rounded border border-white/[0.08]">
            ⌘K
          </kbd>
        </button>

        {/* Owner Admin Badge / Profile Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border bg-gradient-to-r from-teal-950/60 to-emerald-950/60 border-teal-500/40 text-teal-300 shadow-sm shadow-teal-500/10">
          <UserCheck className="w-3.5 h-3.5 text-teal-400" />
          <span className="hidden sm:inline">Owner:</span>
          <span className="font-bold text-slate-100">{currentUser?.name || 'Jan'}</span>
        </div>

        {/* Notifications Button */}
        <button
          onClick={handleOpenNotifications}
          className="relative p-2 rounded-lg text-slate-400 hover:text-slate-200 bg-[#0B171B] border border-white/[0.08] hover:border-white/20 transition-colors cursor-pointer"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-teal-500 text-[10px] font-bold text-black ring-2 ring-[#071014]">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Profile Mini */}
        <div className="flex items-center gap-2.5 pl-1 sm:pl-2">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
            alt={currentUser?.name || 'User'}
            className="w-8 h-8 rounded-full border border-teal-500/30 object-cover"
          />
          <div className="hidden xl:block text-left">
            <div className="text-xs font-semibold text-slate-200 leading-tight">{currentUser?.name || 'Jan'}</div>
            <div className="text-[10px] text-teal-400 font-medium">Owner Admin</div>
          </div>
        </div>
      </div>
    </header>
  );
};
