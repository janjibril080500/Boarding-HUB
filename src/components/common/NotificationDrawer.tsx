import React from 'react';
import { X, CheckCheck, Bell, CreditCard, Wrench, Megaphone, FileCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NotificationDrawerProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen: propIsOpen, onClose: propOnClose }) => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setActiveTab,
    currentRole,
    currentUser,
    isNotificationsOpen,
    setIsNotificationsOpen
  } = useApp();

  const isOpen = propIsOpen !== undefined ? propIsOpen : (isNotificationsOpen || false);
  const onClose = propOnClose || (() => setIsNotificationsOpen(false));

  if (!isOpen) return null;

  // Filter notifications for active role
  const filteredNotifications = notifications.filter(n => {
    if (currentRole === 'OWNER') {
      return n.userId === 'user-owner-01' || n.userId === 'ALL';
    }
    return n.userId === currentUser.id || n.userId === currentUser.tenantId || n.userId === 'ALL';
  });

  const handleNotificationClick = (id: string, linkTab?: string) => {
    markNotificationRead(id);
    if (linkTab) {
      setActiveTab(linkTab);
      onClose();
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'PAYMENT_RECEIVED':
      case 'PAYMENT_APPROVED':
      case 'PAYMENT_REJECTED':
        return <CreditCard className="w-4 h-4 text-teal-400" />;
      case 'MAINTENANCE_NEW':
      case 'MAINTENANCE_UPDATE':
        return <Wrench className="w-4 h-4 text-amber-400" />;
      case 'ANNOUNCEMENT':
        return <Megaphone className="w-4 h-4 text-cyan-400" />;
      case 'APPLICATION':
        return <FileCheck className="w-4 h-4 text-indigo-400" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-100">
      <div
        className="w-full max-w-md h-full bg-[#0B171B] border-l border-white/[0.08] shadow-2xl flex flex-col animate-in slide-in-from-right duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08] bg-[#071014]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Activity Center</h3>
              <p className="text-[11px] text-slate-400">
                {currentRole === 'OWNER' ? 'Property alerts & updates' : 'Personal tenant notifications'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={markAllNotificationsRead}
              className="text-xs text-teal-400 hover:text-teal-300 font-semibold px-2 py-1 rounded hover:bg-white/[0.04] transition-colors"
              title="Mark all as read"
            >
              <CheckCheck className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              <Bell className="w-8 h-8 mx-auto mb-2 text-slate-500" />
              No notifications yet.
            </div>
          ) : (
            filteredNotifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif.id, notif.linkTab)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  notif.read
                    ? 'bg-[#101F23]/60 border-white/[0.04] text-slate-400 hover:bg-[#101F23]'
                    : 'bg-[#101F23] border-teal-500/30 text-slate-200 shadow-md shadow-teal-500/5 hover:border-teal-500/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[#071014] border border-white/[0.06] shrink-0 mt-0.5">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-100 truncate">{notif.title}</h4>
                      <span className="text-[10px] text-slate-400 shrink-0 font-mono">{notif.createdAt}</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{notif.message}</p>
                    {notif.linkTab && (
                      <span className="inline-block text-[11px] text-teal-400 font-semibold mt-2 hover:underline">
                        View details →
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
