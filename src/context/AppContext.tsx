import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  User,
  Role,
  Property,
  Room,
  RoomStatus,
  Tenant,
  Payment,
  RentInvoice,
  UtilityReading,
  MaintenanceRequest,
  Announcement,
  Expense,
  TenantApplication,
  AppNotification,
  SubscriptionPlanId
} from '../types';
import {
  INITIAL_PROPERTY,
  INITIAL_ROOMS,
  INITIAL_TENANTS,
  INITIAL_PAYMENTS,
  INITIAL_INVOICES,
  INITIAL_UTILITY_READINGS,
  INITIAL_MAINTENANCE,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_EXPENSES,
  INITIAL_APPLICATIONS,
  INITIAL_NOTIFICATIONS
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface AppContextType {
  // Authentication & Role
  currentUser: User;
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  switchUserToTenant: (tenantId: string) => void;
  switchUserToOwner: () => void;
  isAuthenticated: boolean;
  login: (email: string, role: Role) => void;
  logout: () => void;
  isOnboarding: boolean;
  setIsOnboarding: (val: boolean) => void;
  completeOnboarding: (propertyData: Partial<Property>) => void;

  // Active View Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Property
  property: Property;
  updateProperty: (updates: Partial<Property>) => void;

  // Rooms
  rooms: Room[];
  addRoom: (room: Omit<Room, 'id' | 'propertyId'>) => void;
  updateRoom: (id: string, updates: Partial<Room>) => void;
  deleteRoom: (id: string) => void;
  setRoomBedCapacity: (roomId: string, capacity: number) => void;
  batchSetTotalRooms: (targetTotalRooms: number, options?: { defaultCapacity?: number; defaultRent?: number; floors?: number }) => void;
  batchUpdateRooms: (updatesList: Array<{ id: string; capacity?: number; monthlyRent?: number; roomNumber?: string; floor?: number; status?: RoomStatus }>) => void;
  setupRoomsByFloors: (floorConfigs: Array<{ floor: number; roomCount: number; bedsPerRoom: number; monthlyRent: number; startRoomNumber?: number; amenities?: string[] }>) => void;
  clearAllRooms: () => void;

  // Tenants
  tenants: Tenant[];
  selectedTenant: Tenant | null;
  setSelectedTenant: (tenant: Tenant | null) => void;
  addTenant: (tenantData: Omit<Tenant, 'id' | 'propertyId' | 'userId'>) => void;
  updateTenant: (id: string, updates: Partial<Tenant>) => void;
  deleteTenant: (id: string) => void;

  // Payments & Verification
  payments: Payment[];
  selectedReceipt: Payment | null;
  setSelectedReceipt: (payment: Payment | null) => void;
  approvePayment: (paymentId: string) => void;
  rejectPayment: (paymentId: string, reason: string) => void;
  submitPayment: (paymentData: Omit<Payment, 'id' | 'receiptNumber' | 'status' | 'propertyId'>) => void;

  // Invoices & Rent
  invoices: RentInvoice[];
  recordCashPayment: (invoiceId: string, amount: number, notes?: string) => void;
  sendRentReminder: (invoiceId: string, reminderType: '3_DAYS' | 'DUE_DATE' | 'OVERDUE') => void;
  addLateFee: (invoiceId: string, amount: number) => void;
  waiveLateFee: (invoiceId: string) => void;
  generateMonthlyInvoices: (monthYear: string) => void;

  // Utilities
  utilityReadings: UtilityReading[];
  recordUtilityReading: (reading: Omit<UtilityReading, 'id' | 'propertyId' | 'totalBill' | 'consumption' | 'allocatedAmountPerTenant'>) => void;

  // Maintenance
  maintenanceRequests: MaintenanceRequest[];
  createMaintenanceRequest: (data: Omit<MaintenanceRequest, 'id' | 'ticketNumber' | 'propertyId' | 'status' | 'createdAt'>) => void;
  updateMaintenanceStatus: (id: string, status: MaintenanceRequest['status'], adminNotes?: string, assignedStaff?: string) => void;

  // Announcements
  announcements: Announcement[];
  createAnnouncement: (announcement: Omit<Announcement, 'id' | 'propertyId' | 'date'>) => void;
  deleteAnnouncement: (id: string) => void;

  // Expenses
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id' | 'propertyId'>) => void;

  // Tenant Applications
  applications: TenantApplication[];
  approveApplication: (applicationId: string, assignedRoomId: string, assignedBed: string) => void;
  rejectApplication: (applicationId: string) => void;
  submitApplication: (appData: Omit<TenantApplication, 'id' | 'propertyId' | 'status' | 'submittedDate'>) => void;

  // Notifications
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Subscription
  subscriptionPlan: SubscriptionPlanId;
  updateSubscriptionPlan: (plan: SubscriptionPlanId) => void;

  // Search & Modals & Sidebar
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  toggleSidebar: () => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  // Reset to Demo
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const safeLoad = <T,>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(key);
    if (!saved || saved === 'undefined' || saved === 'null') return fallback;
    const parsed = JSON.parse(saved);
    if (parsed === null || parsed === undefined) return fallback;
    if (typeof fallback === 'object' && !Array.isArray(fallback) && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return { ...fallback, ...parsed };
    }
    return parsed;
  } catch {
    return fallback;
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local storage state initialization with safe fallbacks
  const [property, setProperty] = useState<Property>(() => safeLoad('bh_property', INITIAL_PROPERTY));
  const [rooms, setRooms] = useState<Room[]>(() => safeLoad('bh_rooms', INITIAL_ROOMS));
  const [tenants, setTenants] = useState<Tenant[]>(() => safeLoad('bh_tenants', INITIAL_TENANTS));
  const [payments, setPayments] = useState<Payment[]>(() => safeLoad('bh_payments', INITIAL_PAYMENTS));
  const [invoices, setInvoices] = useState<RentInvoice[]>(() => safeLoad('bh_invoices', INITIAL_INVOICES));
  const [utilityReadings, setUtilityReadings] = useState<UtilityReading[]>(() => safeLoad('bh_utilityReadings', INITIAL_UTILITY_READINGS));
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>(() => safeLoad('bh_maintenance', INITIAL_MAINTENANCE));
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => safeLoad('bh_announcements', INITIAL_ANNOUNCEMENTS));
  const [expenses, setExpenses] = useState<Expense[]>(() => safeLoad('bh_expenses', INITIAL_EXPENSES));
  const [applications, setApplications] = useState<TenantApplication[]>(() => safeLoad('bh_applications', INITIAL_APPLICATIONS));
  const [notifications, setNotifications] = useState<AppNotification[]>(() => safeLoad('bh_notifications', INITIAL_NOTIFICATIONS));

  const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionPlanId>('BUSINESS');

  // Active User State
  const [currentRole, setCurrentRole] = useState<Role>('OWNER');
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'user-owner-01',
    name: 'Jan',
    email: 'jan.owner@boardinghub.ph',
    role: 'OWNER',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    subscriptionPlan: 'BUSINESS',
    createdAt: '2025-01-10'
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isOnboarding, setIsOnboarding] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<Payment | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('bh_sidebar_collapsed');
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const toggleSidebar = () => {
    // If mobile width, toggle mobile sidebar; else toggle desktop collapse
    if (window.innerWidth < 1024) {
      setIsMobileSidebarOpen(prev => !prev);
    } else {
      setIsSidebarCollapsed(prev => {
        const next = !prev;
        try {
          localStorage.setItem('bh_sidebar_collapsed', JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
    }
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('bh_property', JSON.stringify(property));
    localStorage.setItem('bh_rooms', JSON.stringify(rooms));
    localStorage.setItem('bh_tenants', JSON.stringify(tenants));
    localStorage.setItem('bh_payments', JSON.stringify(payments));
    localStorage.setItem('bh_invoices', JSON.stringify(invoices));
    localStorage.setItem('bh_utilityReadings', JSON.stringify(utilityReadings));
    localStorage.setItem('bh_maintenance', JSON.stringify(maintenanceRequests));
    localStorage.setItem('bh_announcements', JSON.stringify(announcements));
    localStorage.setItem('bh_expenses', JSON.stringify(expenses));
    localStorage.setItem('bh_applications', JSON.stringify(applications));
    localStorage.setItem('bh_notifications', JSON.stringify(notifications));
  }, [property, rooms, tenants, payments, invoices, utilityReadings, maintenanceRequests, announcements, expenses, applications, notifications]);

  // Toast Helper
  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = 'toast_' + Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // User Switching
  const switchUserToTenant = (tenantId: string) => {
    const foundTenant = tenants.find(t => t.id === tenantId) || tenants[0];
    if (foundTenant) {
      setCurrentRole('TENANT');
      setCurrentUser({
        id: foundTenant.userId || 'user-tenant-' + foundTenant.id,
        name: foundTenant.name || 'Tenant',
        email: foundTenant.email || 'tenant@boardinghub.ph',
        role: 'TENANT',
        avatar: foundTenant.avatar,
        phone: foundTenant.phone,
        propertyId: property?.id || 'prop-01',
        tenantId: foundTenant.id,
        createdAt: foundTenant.moveInDate || '2025-01-10'
      });
      setActiveTab('tenant-home');
      addToast({
        type: 'info',
        title: `Switched View: ${foundTenant.name || 'Tenant'}`,
        message: `Now experiencing the tenant mobile portal for Room ${(foundTenant.roomId || '').replace('room-', '') || '101'}.`
      });
    }
  };

  const switchUserToOwner = () => {
    setCurrentRole('OWNER');
    setCurrentUser({
      id: 'user-owner-01',
      name: 'Jan',
      email: 'jan.owner@boardinghub.ph',
      role: 'OWNER',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      subscriptionPlan: subscriptionPlan,
      createdAt: '2025-01-10'
    });
    setActiveTab('dashboard');
    addToast({
      type: 'info',
      title: 'Switched to Owner Mode',
      message: 'Returned to property management dashboard.'
    });
  };

  const login = (email: string, role: Role) => {
    setIsAuthenticated(true);
    if (role === 'OWNER') {
      setCurrentRole('OWNER');
      setCurrentUser({
        id: 'user-owner-01',
        name: 'Jan',
        email,
        role: 'OWNER',
        subscriptionPlan: 'BUSINESS',
        createdAt: '2025-01-10'
      });
      setActiveTab('dashboard');
    } else {
      const tenant = tenants[0] || {
        id: 'tenant-demo-01',
        userId: 'user-tenant-01',
        name: 'Demo Tenant',
        email: email || 'tenant@boardinghub.ph',
        role: 'TENANT',
        propertyId: property?.id || 'prop-01',
        moveInDate: '2025-01-10',
        roomId: 'room-101',
        bedLabel: 'Bed A'
      };
      setCurrentRole('TENANT');
      setCurrentUser({
        id: tenant.userId || 'user-tenant-01',
        name: tenant.name || 'Demo Tenant',
        email: email || tenant.email || 'tenant@boardinghub.ph',
        role: 'TENANT',
        propertyId: property?.id || 'prop-01',
        tenantId: tenant.id,
        createdAt: tenant.moveInDate || '2025-01-10'
      });
      setActiveTab('tenant-home');
    }
    addToast({
      type: 'success',
      title: 'Welcome to BoardingHub',
      message: `Signed in successfully as ${role === 'OWNER' ? 'Property Owner' : 'Tenant'}.`
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    addToast({
      type: 'info',
      title: 'Logged Out',
      message: 'You have been signed out safely.'
    });
  };

  const completeOnboarding = (propertyData: Partial<Property>) => {
    setProperty(prev => ({
      ...prev,
      ...propertyData
    }));
    setIsOnboarding(false);
    setActiveTab('dashboard');
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // fallback
    }
    addToast({
      type: 'success',
      title: 'Property Ready!',
      message: `${propertyData.name || 'Your property'} dashboard has been generated.`
    });
  };

  // Property Actions
  const updateProperty = (updates: Partial<Property>) => {
    setProperty(prev => ({ ...prev, ...updates }));
    addToast({
      type: 'success',
      title: 'Settings Saved',
      message: 'Property details updated successfully.'
    });
  };

  // Room Actions
  const addRoom = (roomData: Omit<Room, 'id' | 'propertyId'>) => {
    const newRoom: Room = {
      ...roomData,
      id: `room-${roomData.roomNumber.toLowerCase().replace(/\s+/g, '-')}`,
      propertyId: property.id
    };
    setRooms(prev => [...prev, newRoom]);
    setProperty(prev => ({ ...prev, totalRooms: prev.totalRooms + 1 }));
    addToast({
      type: 'success',
      title: `Room ${newRoom.roomNumber} Added`,
      message: `Floor ${newRoom.floor} with capacity for ${newRoom.capacity} tenants.`
    });
  };

  const updateRoom = (id: string, updates: Partial<Room>) => {
    setRooms(prev => prev.map(r => {
      if (r.id === id) {
        const updated = { ...r, ...updates };
        // If capacity changed, update status if needed
        if (updates.capacity !== undefined) {
          const cap = Math.max(1, updates.capacity);
          updated.capacity = cap;
          if (updated.occupiedBeds >= cap && updated.occupiedBeds > 0) {
            updated.status = 'OCCUPIED';
          } else if (updated.status === 'OCCUPIED' && updated.occupiedBeds < cap) {
            updated.status = 'AVAILABLE';
          }
        }
        return updated;
      }
      return r;
    }));
    addToast({
      type: 'success',
      title: 'Room Updated',
      message: 'Room details and bed capacity saved.'
    });
  };

  const setRoomBedCapacity = (id: string, capacity: number) => {
    const validCapacity = Math.max(1, Math.min(20, Math.round(capacity)));
    setRooms(prev => prev.map(r => {
      if (r.id === id) {
        const newStatus = r.occupiedBeds >= validCapacity && r.occupiedBeds > 0 
          ? 'OCCUPIED' 
          : (r.status === 'OCCUPIED' && r.occupiedBeds < validCapacity ? 'AVAILABLE' : r.status);
        return {
          ...r,
          capacity: validCapacity,
          status: newStatus
        };
      }
      return r;
    }));
    addToast({
      type: 'success',
      title: 'Bed Capacity Updated',
      message: `Room capacity set to ${validCapacity} bed${validCapacity > 1 ? 's' : ''}.`
    });
  };

  const batchSetTotalRooms = (
    targetTotalRooms: number,
    options?: { defaultCapacity?: number; defaultRent?: number; floors?: number }
  ) => {
    const target = Math.max(1, Math.min(100, Math.round(targetTotalRooms)));
    const defaultCapacity = options?.defaultCapacity || 4;
    const defaultRent = options?.defaultRent || property.defaultMonthlyRent || 3500;
    const floorsCount = options?.floors || property.totalFloors || 3;

    setRooms(prev => {
      const currentCount = prev.length;
      if (target === currentCount) {
        return prev;
      }

      if (target > currentCount) {
        // Add new rooms
        const newRooms: Room[] = [];
        const needed = target - currentCount;
        const roomsPerFloor = Math.max(1, Math.ceil(target / floorsCount));

        for (let i = 0; i < needed; i++) {
          const roomIndex = currentCount + i + 1;
          const floor = Math.min(floorsCount, Math.floor((roomIndex - 1) / roomsPerFloor) + 1);
          const roomInFloor = ((roomIndex - 1) % roomsPerFloor) + 1;
          const roomNumber = `${floor}${roomInFloor < 10 ? '0' + roomInFloor : roomInFloor}`;
          
          let finalRoomNum = roomNumber;
          let counter = 1;
          while (prev.some(r => r.roomNumber === finalRoomNum) || newRooms.some(r => r.roomNumber === finalRoomNum)) {
            const nextNum = roomInFloor + counter;
            finalRoomNum = `${floor}${nextNum < 10 ? '0' + nextNum : nextNum}`;
            counter++;
          }

          newRooms.push({
            id: `room-${finalRoomNum.toLowerCase().replace(/\s+/g, '-')}`,
            propertyId: property.id,
            roomNumber: finalRoomNum,
            floor,
            capacity: defaultCapacity,
            occupiedBeds: 0,
            monthlyRent: defaultRent,
            status: 'AVAILABLE',
            amenities: ['Aircon', 'Bunk Beds', 'Study Desks', 'Ensuite Bathroom']
          });
        }

        return [...prev, ...newRooms];
      } else {
        // Decrease rooms - prioritize removing vacant rooms with 0 tenants
        const toRemoveCount = currentCount - target;
        let removed = 0;
        const vacantRooms = [...prev].filter(r => r.occupiedBeds === 0).reverse();
        const idsToRemove = new Set<string>();

        for (const r of vacantRooms) {
          if (removed < toRemoveCount) {
            idsToRemove.add(r.id);
            removed++;
          }
        }

        // If vacant wasn't enough, remove from tail
        if (removed < toRemoveCount) {
          const tailRooms = [...prev].reverse();
          for (const r of tailRooms) {
            if (!idsToRemove.has(r.id) && idsToRemove.size < toRemoveCount) {
              idsToRemove.add(r.id);
            }
          }
        }

        return prev.filter(r => !idsToRemove.has(r.id));
      }
    });

    setProperty(prev => ({ ...prev, totalRooms: target }));
    addToast({
      type: 'success',
      title: 'Property Room Count Configured',
      message: `Total property inventory adjusted to ${target} rooms.`
    });
  };

  const batchUpdateRooms = (
    updatesList: Array<{ id: string; capacity?: number; monthlyRent?: number; roomNumber?: string; floor?: number; status?: RoomStatus }>
  ) => {
    setRooms(prev => {
      const updateMap = new Map(updatesList.map(u => [u.id, u]));
      return prev.map(r => {
        const u = updateMap.get(r.id);
        if (!u) return r;
        const newCap = u.capacity !== undefined ? Math.max(1, u.capacity) : r.capacity;
        const updated = {
          ...r,
          ...u,
          capacity: newCap
        };
        if (updated.occupiedBeds >= newCap && updated.occupiedBeds > 0) {
          updated.status = 'OCCUPIED';
        }
        return updated;
      });
    });
    addToast({
      type: 'success',
      title: 'Room Settings Applied',
      message: `Bulk changes applied to ${updatesList.length} room(s).`
    });
  };

  const setupRoomsByFloors = (
    floorConfigs: Array<{ floor: number; roomCount: number; bedsPerRoom: number; monthlyRent: number; startRoomNumber?: number; amenities?: string[] }>
  ) => {
    const generatedRooms: Room[] = [];

    floorConfigs.forEach(fc => {
      const count = Math.max(0, Math.min(50, Math.round(fc.roomCount)));
      const beds = Math.max(1, Math.min(20, Math.round(fc.bedsPerRoom || 4)));
      const rent = Math.max(0, Math.round(fc.monthlyRent || property.defaultMonthlyRent || 3500));
      const defaultAmenities = fc.amenities && fc.amenities.length > 0 
        ? fc.amenities 
        : ['Aircon', 'Bunk Beds', 'Study Desks', 'Ensuite Bathroom'];

      for (let i = 1; i <= count; i++) {
        const roomNum = fc.startRoomNumber !== undefined
          ? `${fc.startRoomNumber + i - 1}`
          : `${fc.floor}${i < 10 ? '0' + i : i}`;

        generatedRooms.push({
          id: `room-f${fc.floor}-${i}-${Date.now().toString().slice(-4)}`,
          propertyId: property.id,
          roomNumber: roomNum,
          floor: fc.floor,
          capacity: beds,
          occupiedBeds: 0,
          monthlyRent: rent,
          status: 'AVAILABLE',
          amenities: defaultAmenities
        });
      }
    });

    setRooms(generatedRooms);
    const maxFloor = floorConfigs.length > 0 ? Math.max(...floorConfigs.map(f => f.floor)) : 1;
    setProperty(prev => ({
      ...prev,
      totalRooms: generatedRooms.length,
      totalFloors: maxFloor
    }));

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    addToast({
      type: 'success',
      title: 'Floor & Room Layout Created!',
      message: `Successfully configured ${generatedRooms.length} rooms across ${floorConfigs.length} floor(s).`
    });
  };

  const clearAllRooms = () => {
    setRooms([]);
    setProperty(prev => ({ ...prev, totalRooms: 0 }));
    addToast({
      type: 'info',
      title: 'All Rooms Cleared',
      message: 'Room inventory has been emptied. You can now input rooms per floor.'
    });
  };

  const deleteRoom = (id: string) => {
    const room = rooms.find(r => r.id === id);
    setRooms(prev => prev.filter(r => r.id !== id));
    setProperty(prev => ({ ...prev, totalRooms: Math.max(0, prev.totalRooms - 1) }));
    addToast({
      type: 'info',
      title: 'Room Deleted',
      message: `Room ${room?.roomNumber || id} was removed.`
    });
  };

  // Tenant Actions
  const addTenant = (tenantData: Omit<Tenant, 'id' | 'propertyId' | 'userId'>) => {
    const newTenantId = `tenant-${Date.now()}`;
    const newTenant: Tenant = {
      ...tenantData,
      id: newTenantId,
      userId: `user-${newTenantId}`,
      propertyId: property.id
    };
    setTenants(prev => [...prev, newTenant]);

    // Update Room occupied count & status
    setRooms(prev => prev.map(r => {
      if (r.id === newTenant.roomId) {
        const newOccupied = Math.min(r.capacity, r.occupiedBeds + 1);
        return {
          ...r,
          occupiedBeds: newOccupied,
          status: newOccupied >= r.capacity ? 'OCCUPIED' : r.status
        };
      }
      return r;
    }));

    // Create Initial Rent Invoice
    const newInvoice: RentInvoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-2026-${Date.now().toString().slice(-4)}`,
      tenantId: newTenantId,
      tenantName: newTenant.name,
      roomId: newTenant.roomId,
      roomNumber: newTenant.roomId.replace('room-', ''),
      propertyId: property.id,
      monthYear: 'August 2026',
      baseRent: newTenant.monthlyRent,
      electricityAmount: 0,
      waterAmount: 0,
      wifiAmount: 0,
      lateFee: 0,
      discount: 0,
      totalAmount: newTenant.monthlyRent,
      amountPaid: 0,
      dueDate: '2026-09-05',
      status: 'PENDING',
      remindersSentCount: 0
    };
    setInvoices(prev => [newInvoice, ...prev]);

    addToast({
      type: 'success',
      title: 'Tenant Registered',
      message: `${newTenant.name} assigned to Room ${newTenant.roomId.replace('room-', '')} (${newTenant.bedLabel}).`
    });
  };

  const updateTenant = (id: string, updates: Partial<Tenant>) => {
    setTenants(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    if (selectedTenant && selectedTenant.id === id) {
      setSelectedTenant(prev => prev ? { ...prev, ...updates } : null);
    }
    addToast({
      type: 'success',
      title: 'Tenant Profile Updated',
      message: 'Information saved successfully.'
    });
  };

  const deleteTenant = (id: string) => {
    const tenant = tenants.find(t => t.id === id);
    if (tenant) {
      // Free up bed in room
      setRooms(prev => prev.map(r => {
        if (r.id === tenant.roomId) {
          const newOccupied = Math.max(0, r.occupiedBeds - 1);
          return {
            ...r,
            occupiedBeds: newOccupied,
            status: newOccupied === 0 ? 'AVAILABLE' : r.status
          };
        }
        return r;
      }));
      setTenants(prev => prev.filter(t => t.id !== id));
      if (selectedTenant?.id === id) setSelectedTenant(null);
      addToast({
        type: 'info',
        title: 'Tenant Removed',
        message: `${tenant.name} has been removed from active records.`
      });
    }
  };

  // Payment Verification Workflow
  const approvePayment = (paymentId: string) => {
    const payment = payments.find(p => p.id === paymentId);
    if (!payment) return;

    // 1. Mark payment as PAID & set verified time
    const updatedPayment: Payment = {
      ...payment,
      status: 'PAID',
      verifiedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setPayments(prev => prev.map(p => p.id === paymentId ? updatedPayment : p));

    // 2. Update tenant balance
    setTenants(prev => prev.map(t => {
      if (t.id === payment.tenantId) {
        const newBal = Math.max(0, t.currentBalance - payment.amount);
        return {
          ...t,
          currentBalance: newBal,
          status: newBal === 0 ? 'ACTIVE' : t.status
        };
      }
      return t;
    }));

    // 3. Mark corresponding invoice as paid
    setInvoices(prev => prev.map(inv => {
      if (inv.tenantId === payment.tenantId && inv.status !== 'PAID') {
        const newPaid = inv.amountPaid + payment.amount;
        return {
          ...inv,
          amountPaid: newPaid,
          status: newPaid >= inv.totalAmount ? 'PAID' : 'PARTIAL'
        };
      }
      return inv;
    }));

    // 4. Send notification to tenant
    const tenantNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: payment.tenantId,
      title: 'Payment Verified & Approved! 🧾',
      message: `Your payment of ₱${payment.amount.toLocaleString()} (Ref: ${payment.referenceNumber}) has been approved. Digital receipt #${payment.receiptNumber} generated.`,
      type: 'PAYMENT_APPROVED',
      read: false,
      createdAt: 'Just now',
      linkTab: 'payments'
    };
    setNotifications(prev => [tenantNotif, ...prev]);

    // Trigger confetti celebration
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      // ignore
    }

    addToast({
      type: 'success',
      title: 'Payment Approved',
      message: `Receipt #${payment.receiptNumber} generated. ₱${payment.amount.toLocaleString()} credited to ${payment.tenantName}.`
    });

    // Auto-open receipt modal for owner review
    setSelectedReceipt(updatedPayment);
  };

  const rejectPayment = (paymentId: string, reason: string) => {
    const payment = payments.find(p => p.id === paymentId);
    if (!payment) return;

    setPayments(prev => prev.map(p => {
      if (p.id === paymentId) {
        return {
          ...p,
          status: 'REJECTED',
          rejectionReason: reason
        };
      }
      return p;
    }));

    const tenantNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: payment.tenantId,
      title: 'Payment Verification Issue',
      message: `Your payment reference ${payment.referenceNumber} could not be verified: "${reason}". Please resubmit valid proof.`,
      type: 'PAYMENT_REJECTED',
      read: false,
      createdAt: 'Just now',
      linkTab: 'payments'
    };
    setNotifications(prev => [tenantNotif, ...prev]);

    addToast({
      type: 'warning',
      title: 'Payment Rejected',
      message: `Tenant ${payment.tenantName} was notified to provide correct proof.`
    });
  };

  const submitPayment = (paymentData: Omit<Payment, 'id' | 'receiptNumber' | 'status' | 'propertyId'>) => {
    const receiptNum = `BH-2026-${String(Date.now()).slice(-4)}`;
    const newPayment: Payment = {
      ...paymentData,
      id: `pay-${Date.now()}`,
      receiptNumber: receiptNum,
      propertyId: property.id,
      status: 'PENDING'
    };

    setPayments(prev => [newPayment, ...prev]);

    // Notify Owner
    const ownerNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: 'user-owner-01',
      title: 'Payment Verification Required',
      message: `${newPayment.tenantName} submitted ${newPayment.method} payment of ₱${newPayment.amount.toLocaleString()} (Ref: ${newPayment.referenceNumber}) for Room ${newPayment.roomNumber}.`,
      type: 'PAYMENT_RECEIVED',
      read: false,
      createdAt: 'Just now',
      linkTab: 'verification'
    };
    setNotifications(prev => [ownerNotif, ...prev]);

    addToast({
      type: 'success',
      title: 'Payment Proof Uploaded',
      message: `Reference #${newPayment.referenceNumber} sent to property manager for approval.`
    });
  };

  // Invoicing & Rent Management
  const recordCashPayment = (invoiceId: string, amount: number, notes?: string) => {
    const inv = invoices.find(i => i.id === invoiceId);
    if (!inv) return;

    const receiptNum = `BH-2026-CASH-${String(Date.now()).slice(-4)}`;
    const newPayment: Payment = {
      id: `pay-${Date.now()}`,
      receiptNumber: receiptNum,
      tenantId: inv.tenantId,
      tenantName: inv.tenantName,
      roomId: inv.roomId,
      roomNumber: inv.roomNumber,
      propertyId: property.id,
      amount,
      rentAmount: amount,
      type: 'RENT',
      method: 'CASH',
      referenceNumber: `CASH-${Date.now().toString().slice(-6)}`,
      status: 'PAID',
      date: new Date().toISOString().split('T')[0],
      forMonth: inv.monthYear,
      verifiedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      notes: notes || 'Cash received over-the-counter.'
    };

    setPayments(prev => [newPayment, ...prev]);

    // Update invoice
    setInvoices(prev => prev.map(i => {
      if (i.id === invoiceId) {
        const newAmountPaid = i.amountPaid + amount;
        return {
          ...i,
          amountPaid: newAmountPaid,
          status: newAmountPaid >= i.totalAmount ? 'PAID' : 'PARTIAL'
        };
      }
      return i;
    }));

    // Update tenant balance
    setTenants(prev => prev.map(t => {
      if (t.id === inv.tenantId) {
        const newBal = Math.max(0, t.currentBalance - amount);
        return {
          ...t,
          currentBalance: newBal,
          status: newBal === 0 ? 'ACTIVE' : t.status
        };
      }
      return t;
    }));

    addToast({
      type: 'success',
      title: 'Cash Payment Recorded',
      message: `₱${amount.toLocaleString()} received from ${inv.tenantName}. Receipt #${receiptNum} created.`
    });

    setSelectedReceipt(newPayment);
  };

  const sendRentReminder = (invoiceId: string, reminderType: '3_DAYS' | 'DUE_DATE' | 'OVERDUE') => {
    const inv = invoices.find(i => i.id === invoiceId);
    if (!inv) return;

    let reminderText = '';
    if (reminderType === '3_DAYS') {
      reminderText = `Friendly reminder: Your rent of ₱${inv.totalAmount.toLocaleString()} is due in 3 days (${inv.dueDate}).`;
    } else if (reminderType === 'DUE_DATE') {
      reminderText = `Your rent of ₱${inv.totalAmount.toLocaleString()} is due today. Please settle via GCash or Maya.`;
    } else {
      reminderText = `Your rent payment is overdue. Outstanding balance: ₱${(inv.totalAmount - inv.amountPaid).toLocaleString()}. Please pay promptly to avoid penalty fees.`;
    }

    setInvoices(prev => prev.map(i => {
      if (i.id === invoiceId) {
        return {
          ...i,
          remindersSentCount: i.remindersSentCount + 1,
          lastReminderDate: new Date().toISOString().split('T')[0]
        };
      }
      return i;
    }));

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: inv.tenantId,
      title: reminderType === 'OVERDUE' ? 'Rent Overdue Notice' : 'Rent Due Reminder',
      message: reminderText,
      type: 'RENT_DUE',
      read: false,
      createdAt: 'Just now',
      linkTab: 'tenant-home'
    };
    setNotifications(prev => [notif, ...prev]);

    addToast({
      type: 'success',
      title: 'Reminder Sent',
      message: `Notice dispatched to ${inv.tenantName} via in-app notification and SMS gateway simulator.`
    });
  };

  const addLateFee = (invoiceId: string, amount: number) => {
    setInvoices(prev => prev.map(i => {
      if (i.id === invoiceId) {
        const newLate = i.lateFee + amount;
        const newTotal = i.baseRent + i.electricityAmount + i.waterAmount + i.wifiAmount + newLate - i.discount;
        return {
          ...i,
          lateFee: newLate,
          totalAmount: newTotal
        };
      }
      return i;
    }));

    const inv = invoices.find(i => i.id === invoiceId);
    if (inv) {
      setTenants(prev => prev.map(t => {
        if (t.id === inv.tenantId) {
          return { ...t, currentBalance: t.currentBalance + amount, status: 'OVERDUE' };
        }
        return t;
      }));
    }

    addToast({
      type: 'warning',
      title: 'Late Fee Added',
      message: `₱${amount} late penalty added to invoice.`
    });
  };

  const waiveLateFee = (invoiceId: string) => {
    const inv = invoices.find(i => i.id === invoiceId);
    if (!inv || inv.lateFee === 0) return;

    const waived = inv.lateFee;
    setInvoices(prev => prev.map(i => {
      if (i.id === invoiceId) {
        const newTotal = i.baseRent + i.electricityAmount + i.waterAmount + i.wifiAmount - i.discount;
        return {
          ...i,
          lateFee: 0,
          totalAmount: newTotal
        };
      }
      return i;
    }));

    setTenants(prev => prev.map(t => {
      if (t.id === inv.tenantId) {
        return { ...t, currentBalance: Math.max(0, t.currentBalance - waived) };
      }
      return t;
    }));

    addToast({
      type: 'info',
      title: 'Late Fee Waived',
      message: `₱${waived} penalty fee removed from invoice.`
    });
  };

  const generateMonthlyInvoices = (monthYear: string) => {
    const activeTenants = tenants.filter(t => t.status !== 'FORMER');
    const newInvoices: RentInvoice[] = activeTenants.map(t => ({
      id: `inv-${Date.now()}-${t.id}`,
      invoiceNumber: `INV-2026-${Date.now().toString().slice(-4)}-${t.id.slice(-2)}`,
      tenantId: t.id,
      tenantName: t.name,
      roomId: t.roomId,
      roomNumber: t.roomId.replace('room-', ''),
      propertyId: property.id,
      monthYear,
      baseRent: t.monthlyRent,
      electricityAmount: 0,
      waterAmount: property.waterRate,
      wifiAmount: property.utilitiesIncluded.includes('WIFI') ? 0 : property.wifiFlatRate,
      lateFee: 0,
      discount: 0,
      totalAmount: t.monthlyRent + (property.utilitiesIncluded.includes('WIFI') ? 0 : property.wifiFlatRate) + property.waterRate,
      amountPaid: 0,
      dueDate: `2026-09-${String(property.rentDueDateDay).padStart(2, '0')}`,
      status: 'PENDING',
      remindersSentCount: 0
    }));

    setInvoices(prev => [...newInvoices, ...prev]);

    // Update balances
    setTenants(prev => prev.map(t => {
      const invForTenant = newInvoices.find(i => i.tenantId === t.id);
      if (invForTenant) {
        return {
          ...t,
          currentBalance: t.currentBalance + invForTenant.totalAmount
        };
      }
      return t;
    }));

    addToast({
      type: 'success',
      title: 'Invoices Generated',
      message: `${newInvoices.length} rent bills created for ${monthYear}.`
    });
  };

  // Utility Readings & Splitting
  const recordUtilityReading = (readingData: Omit<UtilityReading, 'id' | 'propertyId' | 'totalBill' | 'consumption' | 'allocatedAmountPerTenant'>) => {
    const consumption = Math.max(0, readingData.currentReading - readingData.previousReading);
    const totalBill = consumption * readingData.rate;
    const activeTenantCount = Math.max(1, tenants.filter(t => t.status === 'ACTIVE').length);
    const allocatedPerTenant = readingData.splitMethod === 'EQUAL' ? totalBill / activeTenantCount : totalBill;

    const newReading: UtilityReading = {
      ...readingData,
      id: `util-${Date.now()}`,
      propertyId: property.id,
      consumption,
      totalBill,
      allocatedAmountPerTenant: allocatedPerTenant
    };

    setUtilityReadings(prev => [newReading, ...prev]);

    // Append to current month pending invoices
    if (readingData.type === 'ELECTRICITY') {
      setInvoices(prev => prev.map(inv => {
        if (inv.status !== 'PAID') {
          const newTotal = inv.totalAmount + allocatedPerTenant;
          return {
            ...inv,
            electricityAmount: allocatedPerTenant,
            totalAmount: newTotal
          };
        }
        return inv;
      }));
    }

    addToast({
      type: 'success',
      title: 'Utility Reading Logged',
      message: `${readingData.type}: ${consumption} ${readingData.unit} consumed (₱${totalBill.toLocaleString()}). Split allocated to tenants.`
    });
  };

  // Maintenance Requests
  const createMaintenanceRequest = (data: Omit<MaintenanceRequest, 'id' | 'ticketNumber' | 'propertyId' | 'status' | 'createdAt'>) => {
    const ticketNum = `#${1040 + maintenanceRequests.length + 1}`;
    const newReq: MaintenanceRequest = {
      ...data,
      id: `maint-${Date.now()}`,
      ticketNumber: ticketNum,
      propertyId: property.id,
      status: 'NEW',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setMaintenanceRequests(prev => [newReq, ...prev]);

    // Notify Owner
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: 'user-owner-01',
      title: `Maintenance Request ${ticketNum}`,
      message: `${newReq.tenantName} reported "${newReq.title}" for Room ${newReq.roomNumber} (${newReq.priority} Priority).`,
      type: 'MAINTENANCE_NEW',
      read: false,
      createdAt: 'Just now',
      linkTab: 'maintenance'
    };
    setNotifications(prev => [notif, ...prev]);

    addToast({
      type: 'success',
      title: 'Ticket Submitted',
      message: `Request ${ticketNum} dispatched to the caretaker and property manager.`
    });
  };

  const updateMaintenanceStatus = (id: string, status: MaintenanceRequest['status'], adminNotes?: string, assignedStaff?: string) => {
    setMaintenanceRequests(prev => prev.map(m => {
      if (m.id === id) {
        return {
          ...m,
          status,
          adminNotes: adminNotes ?? m.adminNotes,
          assignedStaff: assignedStaff ?? m.assignedStaff,
          resolvedAt: status === 'RESOLVED' ? new Date().toISOString().replace('T', ' ').substring(0, 16) : m.resolvedAt
        };
      }
      return m;
    }));

    const req = maintenanceRequests.find(m => m.id === id);
    if (req) {
      const tenantNotif: AppNotification = {
        id: `notif-${Date.now()}`,
        userId: req.tenantId,
        title: `Maintenance ${req.ticketNumber} Update`,
        message: `Status updated to "${status}". ${adminNotes ? `Note: ${adminNotes}` : ''}`,
        type: 'MAINTENANCE_UPDATE',
        read: false,
        createdAt: 'Just now',
        linkTab: 'maintenance'
      };
      setNotifications(prev => [tenantNotif, ...prev]);
    }

    addToast({
      type: 'info',
      title: 'Maintenance Updated',
      message: `Ticket marked as ${status}.`
    });
  };

  // Announcements
  const createAnnouncement = (data: Omit<Announcement, 'id' | 'propertyId' | 'date'>) => {
    const newAnn: Announcement = {
      ...data,
      id: `ann-${Date.now()}`,
      propertyId: property.id,
      date: new Date().toISOString().split('T')[0]
    };

    setAnnouncements(prev => [newAnn, ...prev]);

    // Send broadcast notification to all tenants
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: 'ALL',
      title: `Notice: ${newAnn.title}`,
      message: newAnn.content.slice(0, 90) + '...',
      type: 'ANNOUNCEMENT',
      read: false,
      createdAt: 'Just now',
      linkTab: 'announcements'
    };
    setNotifications(prev => [notif, ...prev]);

    addToast({
      type: 'success',
      title: 'Announcement Published',
      message: `Broadcasted to ${newAnn.target === 'ALL' ? 'all tenants' : newAnn.target}.`
    });
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    addToast({
      type: 'info',
      title: 'Announcement Removed',
      message: 'Notice removed from bulletin.'
    });
  };

  // Expenses
  const addExpense = (data: Omit<Expense, 'id' | 'propertyId'>) => {
    const newExp: Expense = {
      ...data,
      id: `exp-${Date.now()}`,
      propertyId: property.id
    };
    setExpenses(prev => [newExp, ...prev]);
    addToast({
      type: 'success',
      title: 'Expense Logged',
      message: `₱${data.amount.toLocaleString()} for ${data.description}.`
    });
  };

  // Tenant Applications
  const submitApplication = (appData: Omit<TenantApplication, 'id' | 'propertyId' | 'status' | 'submittedDate'>) => {
    const newApp: TenantApplication = {
      ...appData,
      id: `app-${Date.now()}`,
      propertyId: property.id,
      status: 'PENDING',
      submittedDate: new Date().toISOString().split('T')[0]
    };
    setApplications(prev => [newApp, ...prev]);

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: 'user-owner-01',
      title: 'New Prospective Tenant Application',
      message: `${newApp.fullName} applied for Room ${newApp.preferredRoomNumber}.`,
      type: 'APPLICATION',
      read: false,
      createdAt: 'Just now',
      linkTab: 'applications'
    };
    setNotifications(prev => [notif, ...prev]);

    addToast({
      type: 'success',
      title: 'Application Received',
      message: 'Your tenancy application is being reviewed by the property owner.'
    });
  };

  const approveApplication = (applicationId: string, assignedRoomId: string, assignedBed: string) => {
    const app = applications.find(a => a.id === applicationId);
    if (!app) return;

    setApplications(prev => prev.map(a => a.id === applicationId ? { ...a, status: 'APPROVED' } : a));

    // Convert into active Tenant
    const room = rooms.find(r => r.id === assignedRoomId);
    const monthlyRent = room?.monthlyRent || 3500;

    addTenant({
      roomId: assignedRoomId,
      bedLabel: assignedBed,
      name: app.fullName,
      email: app.email,
      phone: app.contactNumber,
      emergencyContactName: app.emergencyContact.split('-')[0]?.trim() || 'Guardian',
      emergencyContactPhone: app.emergencyContact.split('-')[1]?.trim() || app.contactNumber,
      emergencyRelationship: 'Guardian',
      occupation: app.occupation,
      moveInDate: app.targetMoveInDate,
      monthlyRent,
      depositAmount: monthlyRent * 2,
      currentBalance: monthlyRent,
      status: 'ACTIVE',
      notes: `Converted from application. ${app.notes || ''}`
    });

    addToast({
      type: 'success',
      title: 'Application Approved!',
      message: `${app.fullName} is now an active tenant in Room ${assignedRoomId.replace('room-', '')}.`
    });
  };

  const rejectApplication = (applicationId: string) => {
    setApplications(prev => prev.map(a => a.id === applicationId ? { ...a, status: 'REJECTED' } : a));
    addToast({
      type: 'info',
      title: 'Application Declined',
      message: 'Applicant record updated.'
    });
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    addToast({
      type: 'info',
      title: 'All Caught Up',
      message: 'All notifications marked as read.'
    });
  };

  // Subscription
  const updateSubscriptionPlan = (plan: SubscriptionPlanId) => {
    setSubscriptionPlan(plan);
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
    addToast({
      type: 'success',
      title: `Plan Upgraded: ${plan}`,
      message: `Your BoardingHub workspace now includes all ${plan} tier capabilities.`
    });
  };

  // Reset Demo
  const resetDemoData = () => {
    setProperty(INITIAL_PROPERTY);
    setRooms(INITIAL_ROOMS);
    setTenants(INITIAL_TENANTS);
    setPayments(INITIAL_PAYMENTS);
    setInvoices(INITIAL_INVOICES);
    setUtilityReadings(INITIAL_UTILITY_READINGS);
    setMaintenanceRequests(INITIAL_MAINTENANCE);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setExpenses(INITIAL_EXPENSES);
    setApplications(INITIAL_APPLICATIONS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setSubscriptionPlan('BUSINESS');
    localStorage.clear();
    addToast({
      type: 'info',
      title: 'Demo Data Restored',
      message: 'Workspace reset to default Philippine boarding house state.'
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        setCurrentRole,
        switchUserToTenant,
        switchUserToOwner,
        isAuthenticated,
        login,
        logout,
        isOnboarding,
        setIsOnboarding,
        completeOnboarding,
        activeTab,
        setActiveTab,
        property,
        updateProperty,
        rooms,
        addRoom,
        updateRoom,
        deleteRoom,
        setRoomBedCapacity,
        batchSetTotalRooms,
        batchUpdateRooms,
        setupRoomsByFloors,
        clearAllRooms,
        tenants,
        selectedTenant,
        setSelectedTenant,
        addTenant,
        updateTenant,
        deleteTenant,
        payments,
        selectedReceipt,
        setSelectedReceipt,
        approvePayment,
        rejectPayment,
        submitPayment,
        invoices,
        recordCashPayment,
        sendRentReminder,
        addLateFee,
        waiveLateFee,
        generateMonthlyInvoices,
        utilityReadings,
        recordUtilityReading,
        maintenanceRequests,
        createMaintenanceRequest,
        updateMaintenanceStatus,
        announcements,
        createAnnouncement,
        deleteAnnouncement,
        expenses,
        addExpense,
        applications,
        approveApplication,
        rejectApplication,
        submitApplication,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        subscriptionPlan,
        updateSubscriptionPlan,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
        toggleSidebar,
        isSearchOpen,
        setIsSearchOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        searchQuery,
        setSearchQuery,
        toasts,
        addToast,
        removeToast,
        resetDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
