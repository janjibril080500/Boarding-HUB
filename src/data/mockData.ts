import {
  Property,
  Room,
  Tenant,
  Payment,
  RentInvoice,
  UtilityReading,
  MaintenanceRequest,
  Announcement,
  Expense,
  MarketplaceListing,
  TenantApplication,
  AppNotification,
  SubscriptionPlan
} from '../types';

export const INITIAL_PROPERTY: Property = {
  id: 'prop-owner-01',
  ownerId: 'user-owner-01',
  name: 'Boarding House',
  tagline: 'Safe, Clean & Accessible Student & Professional Dormitory',
  type: 'BOARDING_HOUSE',
  address: '42 Acacia Street, Matina',
  city: 'Davao City',
  province: 'Davao del Sur',
  contactNumber: '+63 917 845 2931',
  email: 'owner@boardinghub.ph',
  totalFloors: 3,
  totalRooms: 15,
  defaultMonthlyRent: 3500,
  utilitiesIncluded: ['WIFI'],
  electricityRate: 12.50, // ₱12.50 per kWh
  waterRate: 180.00, // ₱180.00 base/tenant
  wifiFlatRate: 250.00, // included or ₱250
  rentDueDateDay: 5,
  gracePeriodDays: 3,
  lateFeeAmount: 200,
  image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80',
  createdAt: '2025-01-10'
};

export const INITIAL_ROOMS: Room[] = [
  // Floor 1 (5 rooms)
  {
    id: 'room-101',
    propertyId: 'prop-owner-01',
    roomNumber: '101',
    floor: 1,
    capacity: 4,
    occupiedBeds: 1,
    monthlyRent: 3500,
    status: 'OCCUPIED',
    amenities: ['Aircon', 'Bunk Beds', 'Study Desks', 'Ensuite Bathroom', 'Wi-Fi']
  },
  {
    id: 'room-102',
    propertyId: 'prop-owner-01',
    roomNumber: '102',
    floor: 1,
    capacity: 4,
    occupiedBeds: 0,
    monthlyRent: 3500,
    status: 'AVAILABLE',
    amenities: ['Aircon', 'Bunk Beds', 'Study Desks', 'Wi-Fi']
  },
  {
    id: 'room-103',
    propertyId: 'prop-owner-01',
    roomNumber: '103',
    floor: 1,
    capacity: 2,
    occupiedBeds: 0,
    monthlyRent: 4200,
    status: 'AVAILABLE',
    amenities: ['Aircon', 'Twin Beds', 'Balcony', 'Ensuite Bathroom', 'Wi-Fi']
  },
  {
    id: 'room-104',
    propertyId: 'prop-owner-01',
    roomNumber: '104',
    floor: 1,
    capacity: 4,
    occupiedBeds: 0,
    monthlyRent: 3500,
    status: 'AVAILABLE',
    amenities: ['Aircon', 'Bunk Beds', 'Study Desks', 'Wi-Fi']
  },
  {
    id: 'room-105',
    propertyId: 'prop-owner-01',
    roomNumber: '105',
    floor: 1,
    capacity: 4,
    occupiedBeds: 0,
    monthlyRent: 3500,
    status: 'AVAILABLE',
    amenities: ['Aircon', 'Bunk Beds', 'Study Desks', 'Ensuite Bathroom', 'Wi-Fi']
  },

  // Floor 2 (5 rooms)
  {
    id: 'room-201',
    propertyId: 'prop-owner-01',
    roomNumber: '201',
    floor: 2,
    capacity: 4,
    occupiedBeds: 0,
    monthlyRent: 3500,
    status: 'AVAILABLE',
    amenities: ['Aircon', 'Bunk Beds', 'Study Desks', 'Ensuite Bathroom', 'Wi-Fi']
  },
  {
    id: 'room-202',
    propertyId: 'prop-owner-01',
    roomNumber: '202',
    floor: 2,
    capacity: 4,
    occupiedBeds: 0,
    monthlyRent: 3500,
    status: 'AVAILABLE',
    amenities: ['Aircon', 'Bunk Beds', 'Study Desks', 'Wi-Fi']
  },
  {
    id: 'room-203',
    propertyId: 'prop-owner-01',
    roomNumber: '203',
    floor: 2,
    capacity: 2,
    occupiedBeds: 0,
    monthlyRent: 4200,
    status: 'AVAILABLE',
    amenities: ['Aircon', 'Twin Beds', 'Balcony', 'Ensuite Bathroom', 'Wi-Fi']
  },
  {
    id: 'room-204',
    propertyId: 'prop-owner-01',
    roomNumber: '204',
    floor: 2,
    capacity: 4,
    occupiedBeds: 0,
    monthlyRent: 3500,
    status: 'AVAILABLE',
    amenities: ['Aircon', 'Bunk Beds', 'Study Desks', 'Wi-Fi']
  },
  {
    id: 'room-205',
    propertyId: 'prop-owner-01',
    roomNumber: '205',
    floor: 2,
    capacity: 4,
    occupiedBeds: 0,
    monthlyRent: 3500,
    status: 'AVAILABLE',
    amenities: ['Aircon', 'Bunk Beds', 'Study Desks', 'Ensuite Bathroom', 'Wi-Fi']
  },

  // Floor 3 (5 rooms)
  {
    id: 'room-301',
    propertyId: 'prop-owner-01',
    roomNumber: '301',
    floor: 3,
    capacity: 4,
    occupiedBeds: 0,
    monthlyRent: 3500,
    status: 'AVAILABLE',
    amenities: ['Aircon', 'Bunk Beds', 'Study Desks', 'Ensuite Bathroom', 'Wi-Fi']
  },
  {
    id: 'room-302',
    propertyId: 'prop-owner-01',
    roomNumber: '302',
    floor: 3,
    capacity: 4,
    occupiedBeds: 0,
    monthlyRent: 3500,
    status: 'AVAILABLE',
    amenities: ['Aircon', 'Bunk Beds', 'Study Desks', 'Wi-Fi']
  },
  {
    id: 'room-303',
    propertyId: 'prop-owner-01',
    roomNumber: '303',
    floor: 3,
    capacity: 2,
    occupiedBeds: 0,
    monthlyRent: 4200,
    status: 'AVAILABLE',
    amenities: ['Aircon', 'Twin Beds', 'Balcony', 'Ensuite Bathroom', 'Wi-Fi']
  },
  {
    id: 'room-304',
    propertyId: 'prop-owner-01',
    roomNumber: '304',
    floor: 3,
    capacity: 4,
    occupiedBeds: 0,
    monthlyRent: 3500,
    status: 'AVAILABLE',
    amenities: ['Aircon', 'Bunk Beds', 'Study Desks', 'Wi-Fi']
  },
  {
    id: 'room-305',
    propertyId: 'prop-owner-01',
    roomNumber: '305',
    floor: 3,
    capacity: 4,
    occupiedBeds: 0,
    monthlyRent: 3500,
    status: 'AVAILABLE',
    amenities: ['Aircon', 'Bunk Beds', 'Study Desks', 'Ensuite Bathroom', 'Wi-Fi']
  }
];

export const INITIAL_TENANTS: Tenant[] = [];

export const INITIAL_PAYMENTS: Payment[] = [];

export const INITIAL_INVOICES: RentInvoice[] = [];

export const INITIAL_UTILITY_READINGS: UtilityReading[] = [];

export const INITIAL_MAINTENANCE: MaintenanceRequest[] = [];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-001',
    propertyId: 'prop-jibril-01',
    title: 'Water Service Scheduled Interruption (Davao Water District)',
    content: 'Scheduled DCWD pipe maintenance will temporarily interrupt water service on August 20, 2026 from 9:00 AM to 12:00 PM. Please store sufficient water in advance. The overhead backup water tank will be activated for common CRs.',
    target: 'ALL',
    priority: 'IMPORTANT',
    date: '2026-08-17',
    scheduledTime: '9:00 AM – 12:00 PM',
    author: 'Jan (Property Manager)'
  },
  {
    id: 'ann-002',
    propertyId: 'prop-jibril-01',
    title: 'Fiber Internet Speed Upgrade',
    content: 'We have upgraded our PLDT Home Enterprise fiber connection to 600 Mbps with new Wi-Fi 6 mesh routers on each floor. Check the study lounge board for new access credentials.',
    target: 'ALL',
    priority: 'NORMAL',
    date: '2026-08-10',
    author: 'Jan (Property Manager)'
  },
  {
    id: 'ann-003',
    propertyId: 'prop-jibril-01',
    title: 'Floor 2 Deep Cleaning & Pest Control',
    content: 'Routine monthly deep cleaning and certified organic misting for Floor 2 hallway and common areas will take place on Saturday, 1:00 PM.',
    target: 'FLOOR_2',
    priority: 'NORMAL',
    date: '2026-08-08',
    author: 'Jan (Property Manager)'
  }
];

export const INITIAL_EXPENSES: Expense[] = [
  { id: 'exp-01', propertyId: 'prop-jibril-01', category: 'REPAIRS', description: 'Aircon Repair & Freon Refill (Room 105 & 201)', amount: 2500, date: '2026-08-15' },
  { id: 'exp-02', propertyId: 'prop-jibril-01', category: 'INTERNET', description: 'PLDT Enterprise Fiber 600Mbps Monthly Bill', amount: 3500, date: '2026-08-12' },
  { id: 'exp-03', propertyId: 'prop-jibril-01', category: 'ELECTRICITY', description: 'Davao Light Main Property Power Bill', amount: 14800, date: '2026-08-10' },
  { id: 'exp-04', propertyId: 'prop-jibril-01', category: 'WATER', description: 'Davao City Water District (DCWD) August Bill', amount: 3400, date: '2026-08-10' },
  { id: 'exp-05', propertyId: 'prop-jibril-01', category: 'SALARIES', description: 'Caretaker & Security Guard Bi-Monthly Salary', amount: 16000, date: '2026-08-15' },
  { id: 'exp-06', propertyId: 'prop-jibril-01', category: 'CLEANING', description: 'Sanitation Supplies & Common Area Detergents', amount: 1850, date: '2026-08-05' },
  { id: 'exp-07', propertyId: 'prop-jibril-01', category: 'SUPPLIES', description: 'LED tubes, shower cartridges, spare door keys', amount: 1150, date: '2026-08-02' }
];

export const MARKETPLACE_LISTINGS: MarketplaceListing[] = [
  {
    id: 'mkt-01',
    name: 'Jibril Boarding House',
    tagline: 'Premium Bedspace & Private Rooms near Ateneo de Davao',
    location: 'Matina, Davao City',
    city: 'Davao City',
    startingPrice: 3500,
    availableRooms: 3,
    totalRooms: 30,
    rating: 4.9,
    reviewCount: 48,
    roomTypes: ['Single Private', '2-Bed Sharing', '4-Bed Dormitory'],
    amenities: ['Wi-Fi 600 Mbps', 'Aircon', 'CCTV 24/7', 'Kitchen Access', 'Study Area', 'Laundry Area', 'Backup Generator'],
    imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
    contactNumber: '+63 917 845 2931'
  },
  {
    id: 'mkt-02',
    name: 'Eagle Heights Dormitel',
    tagline: 'Modern Student Residences beside University of Mindanao',
    location: 'Bolton Street, Davao City',
    city: 'Davao City',
    startingPrice: 3800,
    availableRooms: 5,
    totalRooms: 40,
    rating: 4.7,
    reviewCount: 36,
    roomTypes: ['2-Bed Sharing', '4-Bed Dormitory'],
    amenities: ['Wi-Fi', 'Aircon', 'CCTV', 'Study Hall', 'Cafe on Ground Floor'],
    imageUrl: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
    contactNumber: '+63 922 411 9088'
  },
  {
    id: 'mkt-03',
    name: 'San Pedro Executive Residences',
    tagline: 'All-Studio Apartments for Young BPO Professionals',
    location: 'Bajada, Davao City',
    city: 'Davao City',
    startingPrice: 6500,
    availableRooms: 2,
    totalRooms: 18,
    rating: 4.8,
    reviewCount: 22,
    roomTypes: ['Studio Solo', '1-Bedroom Executive'],
    amenities: ['Aircon', 'High Speed Fiber', 'Private Balcony', 'Induction Cooker', 'Covered Parking'],
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    contactNumber: '+63 918 776 2200'
  }
];

export const INITIAL_APPLICATIONS: TenantApplication[] = [
  {
    id: 'app-001',
    propertyId: 'prop-jibril-01',
    preferredRoomId: 'room-106',
    preferredRoomNumber: '106',
    fullName: 'Christian Lloyd Bautista',
    email: 'clloyd.bautista@gmail.com',
    contactNumber: '+63 995 882 1199',
    targetMoveInDate: '2026-09-01',
    occupation: 'Software QA Engineer - Davao IT Park',
    monthlyBudget: 4000,
    emergencyContact: 'Teresa Bautista (Mother) - 09951122334',
    idDocumentName: 'PhilHealth-ID.pdf',
    status: 'PENDING',
    submittedDate: '2026-08-17',
    notes: 'Looking for 4-bed aircon room with quiet study desk.'
  },
  {
    id: 'app-002',
    propertyId: 'prop-jibril-01',
    preferredRoomId: 'room-110',
    preferredRoomNumber: '110',
    fullName: 'Jasmine Rose Alcantara',
    email: 'jasmine.alcantara@gmail.com',
    contactNumber: '+63 916 432 9012',
    targetMoveInDate: '2026-08-25',
    occupation: 'Accountancy Student - San Pedro College',
    monthlyBudget: 4500,
    emergencyContact: 'Manuel Alcantara (Father) - 09167788990',
    idDocumentName: 'SPC-School-ID.pdf',
    status: 'PENDING',
    submittedDate: '2026-08-16',
    notes: 'Prefers 2-bed room on 1st or 2nd floor.'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-01',
    userId: 'user-owner-01',
    title: 'Payment Verification Required',
    message: 'Juan Dela Cruz uploaded GCash proof (₱3,500) for Room 101. Reference: GC-901847129.',
    type: 'PAYMENT_RECEIVED',
    read: false,
    createdAt: '10 mins ago',
    linkTab: 'payments'
  },
  {
    id: 'notif-02',
    userId: 'user-owner-01',
    title: 'New Maintenance Ticket #1042',
    message: 'Sarah Santos reported a broken shower valve in Room 203 (High Priority).',
    type: 'MAINTENANCE_NEW',
    read: false,
    createdAt: '45 mins ago',
    linkTab: 'maintenance'
  },
  {
    id: 'notif-03',
    userId: 'user-owner-01',
    title: 'New Tenant Application',
    message: 'Christian Lloyd Bautista applied for Room 106 (Move-in: Sept 1, 2026).',
    type: 'APPLICATION',
    read: false,
    createdAt: '2 hours ago',
    linkTab: 'applications'
  },
  {
    id: 'notif-04',
    userId: 'user-tenant-01',
    title: 'Payment Submitted for Review',
    message: 'Your payment of ₱3,500 (Ref: GC-901847129) is awaiting property owner verification.',
    type: 'PAYMENT_RECEIVED',
    read: false,
    createdAt: '10 mins ago',
    linkTab: 'payments'
  },
  {
    id: 'notif-05',
    userId: 'user-tenant-01',
    title: 'Water Service Interruption on Aug 20',
    message: 'Scheduled maintenance from 9:00 AM to 12:00 PM. Please store backup water.',
    type: 'ANNOUNCEMENT',
    read: false,
    createdAt: '1 day ago',
    linkTab: 'announcements'
  }
];

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'FREE',
    name: 'Free',
    priceMonthly: 0,
    roomLimit: 5,
    description: 'Perfect for small boarding houses and starters.',
    features: [
      'Up to 5 Rooms',
      'Basic Tenant Management',
      'Rent Due Tracking',
      'Standard Cash Receipts',
      'Email Support'
    ]
  },
  {
    id: 'STARTER',
    name: 'Starter',
    priceMonthly: 149,
    roomLimit: 20,
    badge: 'Great Value',
    description: 'Ideal for growing dorms with up to 20 rooms.',
    features: [
      'Up to 20 Rooms',
      'GCash & Maya Payment Proofs',
      'Maintenance Request Tracker',
      'Tenant Portal Access',
      'Announcements System',
      'Financial Summary Reports'
    ]
  },
  {
    id: 'BUSINESS',
    name: 'Business',
    priceMonthly: 299,
    roomLimit: 50,
    badge: 'Most Popular',
    highlight: true,
    description: 'Complete power suite for medium dorms and bedspace buildings.',
    features: [
      'Up to 50 Rooms',
      'Utility Meter & Split Billing (kWh / m³)',
      'Automated Digital Receipts (PDF & Print)',
      'Automated Rent Reminders (SMS/Email simulation)',
      'Staff Accounts & Role Permissions',
      'Expense & Profit Margin Tracking',
      'Public Marketplace Listing'
    ]
  },
  {
    id: 'PROPERTY',
    name: 'Property Enterprise',
    priceMonthly: 599,
    roomLimit: 'Unlimited',
    badge: 'Enterprise',
    description: 'Unlimited scale for multiple properties and large dormitories.',
    features: [
      'Unlimited Rooms & Buildings',
      'Multi-Property Dashboard Switcher',
      'Advanced P&L and Tax Exporting',
      'Priority 24/7 Philippine Phone & Chat Support',
      'Dedicated Account Manager',
      'Custom Branding & Tenant Agreements'
    ]
  }
];
