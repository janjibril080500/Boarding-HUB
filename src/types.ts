export type Role = 'OWNER' | 'TENANT';

export type RoomStatus = 'OCCUPIED' | 'AVAILABLE' | 'RESERVED' | 'MAINTENANCE';

export type PaymentType = 'RENT' | 'UTILITIES' | 'RENT_UTILITIES' | 'DEPOSIT' | 'OTHER';

export type PaymentMethod = 'GCASH' | 'MAYA' | 'BANK_TRANSFER' | 'CASH';

export type PaymentStatus = 'PAID' | 'PENDING' | 'OVERDUE' | 'REJECTED';

export type MaintenancePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type MaintenanceStatus = 'NEW' | 'IN_PROGRESS' | 'RESOLVED';

export type UtilityType = 'ELECTRICITY' | 'WATER' | 'WIFI' | 'OTHER';

export type UtilitySplitMethod = 'EQUAL' | 'PER_ROOM' | 'PER_TENANT' | 'CUSTOM';

export type TenantStatus = 'ACTIVE' | 'PENDING' | 'OVERDUE' | 'FORMER';

export type SubscriptionPlanId = 'FREE' | 'STARTER' | 'BUSINESS' | 'PROPERTY';

export interface FloorRoomConfig {
  floor: number;
  roomCount: number;
  bedsPerRoom: number;
  monthlyRent: number;
  startRoomNumber?: number; // e.g. 101, 201, 301
  amenities?: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  phone?: string;
  propertyId?: string; // If tenant, property they belong to
  tenantId?: string;   // If tenant, link to tenant record
  subscriptionPlan?: SubscriptionPlanId;
  createdAt: string;
}

export interface Property {
  id: string;
  ownerId: string;
  name: string;
  tagline?: string;
  type: 'BOARDING_HOUSE' | 'DORMITORY' | 'BEDSPACE' | 'APARTMENT';
  address: string;
  city: string;
  province: string;
  contactNumber: string;
  email: string;
  totalFloors: number;
  totalRooms: number;
  defaultMonthlyRent: number;
  utilitiesIncluded: UtilityType[];
  electricityRate: number; // in PHP per kWh
  waterRate: number; // in PHP per m3 or flat
  wifiFlatRate: number; // in PHP per month
  rentDueDateDay: number; // e.g., 5th of each month
  gracePeriodDays: number;
  lateFeeAmount: number;
  image?: string;
  createdAt: string;
}

export interface Room {
  id: string;
  propertyId: string;
  roomNumber: string;
  floor: number;
  capacity: number;
  occupiedBeds: number;
  monthlyRent: number;
  status: RoomStatus;
  amenities: string[];
  description?: string;
}

export interface Tenant {
  id: string;
  userId: string;
  propertyId: string;
  roomId: string;
  bedLabel: string; // e.g. "Bed A", "Bed B"
  name: string;
  email: string;
  phone: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyRelationship?: string;
  emergencyContact?: {
    name?: string;
    phone?: string;
    relationship?: string;
  };
  occupation?: string;
  moveInDate: string;
  leaseEndDate?: string;
  monthlyRent: number;
  depositAmount?: number;
  securityDeposit?: number;
  advanceAmount?: number;
  currentBalance: number;
  status: TenantStatus;
  avatar?: string;
  idDocumentUrl?: string;
  idType?: string;
  idNumber?: string;
  notes?: string;
}

export interface Payment {
  id: string;
  receiptNumber: string;
  tenantId: string;
  tenantName: string;
  roomId: string;
  roomNumber: string;
  propertyId: string;
  amount: number;
  rentAmount?: number;
  electricityAmount?: number;
  waterAmount?: number;
  wifiAmount?: number;
  otherAmount?: number;
  type: PaymentType;
  method: PaymentMethod;
  referenceNumber: string;
  proofImageUrl?: string;
  status: PaymentStatus;
  date: string;
  forMonth: string; // e.g. "August 2026"
  verifiedAt?: string;
  rejectionReason?: string;
  notes?: string;
}

export interface RentInvoice {
  id: string;
  invoiceNumber: string;
  tenantId: string;
  tenantName: string;
  roomId: string;
  roomNumber: string;
  propertyId: string;
  monthYear: string; // "August 2026"
  baseRent: number;
  electricityAmount: number;
  waterAmount: number;
  wifiAmount: number;
  lateFee: number;
  discount: number;
  totalAmount: number;
  amountPaid: number;
  dueDate: string;
  status: 'PAID' | 'PARTIAL' | 'PENDING' | 'OVERDUE';
  remindersSentCount: number;
  lastReminderDate?: string;
}

export interface UtilityReading {
  id: string;
  propertyId: string;
  type: UtilityType;
  monthYear: string;
  previousReading: number;
  currentReading: number;
  consumption: number;
  unit: string; // kWh or m3
  rate: number;
  totalBill: number;
  splitMethod: UtilitySplitMethod;
  allocatedAmountPerTenant: number;
  dateRecorded: string;
}

export interface MaintenanceRequest {
  id: string;
  ticketNumber: string;
  tenantId: string;
  tenantName: string;
  roomId: string;
  roomNumber: string;
  propertyId: string;
  title: string;
  description: string;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  imageUrl?: string;
  assignedStaff?: string;
  adminNotes?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface Announcement {
  id: string;
  propertyId: string;
  title: string;
  content: string;
  target: 'ALL' | 'FLOOR_1' | 'FLOOR_2' | 'FLOOR_3' | string;
  priority: 'NORMAL' | 'IMPORTANT' | 'URGENT';
  date: string;
  scheduledTime?: string;
  author: string;
}

export interface Expense {
  id: string;
  propertyId: string;
  category: 'ELECTRICITY' | 'WATER' | 'INTERNET' | 'REPAIRS' | 'CLEANING' | 'SALARIES' | 'SUPPLIES' | 'PROPERTY_TAX' | 'OTHER';
  description: string;
  amount: number;
  date: string;
  receiptUrl?: string;
}

export interface MarketplaceListing {
  id: string;
  name: string;
  tagline: string;
  location: string;
  city: string;
  startingPrice: number;
  availableRooms: number;
  totalRooms: number;
  rating: number;
  reviewCount: number;
  roomTypes: string[];
  amenities: string[];
  imageUrl: string;
  contactNumber: string;
}

export interface TenantApplication {
  id: string;
  propertyId: string;
  preferredRoomId: string;
  preferredRoomNumber: string;
  fullName: string;
  email: string;
  contactNumber: string;
  targetMoveInDate: string;
  occupation: string;
  monthlyBudget: number;
  emergencyContact: string;
  idDocumentName?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedDate: string;
  notes?: string;
}

export interface AppNotification {
  id: string;
  userId: string; // recipient or 'OWNER'
  title: string;
  message: string;
  type: 'PAYMENT_RECEIVED' | 'PAYMENT_APPROVED' | 'PAYMENT_REJECTED' | 'MAINTENANCE_NEW' | 'MAINTENANCE_UPDATE' | 'RENT_DUE' | 'ANNOUNCEMENT' | 'APPLICATION';
  read: boolean;
  createdAt: string;
  linkTab?: string;
}

export interface SubscriptionPlan {
  id: SubscriptionPlanId;
  name: string;
  priceMonthly: number;
  roomLimit: number | 'Unlimited';
  badge?: string;
  description: string;
  features: string[];
  highlight?: boolean;
}

export type Invoice = RentInvoice;
export type InvoiceStatus = 'PAID' | 'PARTIAL' | 'PENDING' | 'OVERDUE';
