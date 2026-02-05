export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  profileImageUrl?: string;
  role: 'client' | 'admin' | 'superadmin' | 'employee';
  garageId?: string;
  companyName?: string;
  siret?: string;
  tvaNumber?: string;
  companyAddress?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Quote {
  id: string;
  reference?: string;
  quoteNumber?: string;
  clientId?: string;
  userId?: string;
  serviceId?: string;
  vehicleBrand?: string;
  vehicleModel?: string;
  vehiclePlate?: string;
  vehicleVin?: string;
  items?: QuoteItem[];
  notes?: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'draft' | 'sent';
  totalHT?: number;
  totalTTC?: number;
  validUntil?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface QuoteItem {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Invoice {
  id: string;
  number?: string;
  invoiceNumber?: string;
  quoteId?: string;
  clientId?: string;
  userId?: string;
  amount: number;
  totalHT?: number;
  totalTTC?: number;
  dueDate?: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled' | 'draft' | 'sent';
  paymentMethod?: 'card' | 'wire_transfer' | 'cash' | 'check';
  paidAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Reservation {
  id: string;
  clientId?: string;
  userId?: string;
  serviceId?: string;
  serviceName?: string;
  date: string;
  time?: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  assignedTo?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  basePrice?: number;
  price?: number;
  duration?: number;
  estimatedDuration?: number;
  category?: string;
  imageUrl?: string;
  isActive: boolean;
  garageId?: string;
  customFormFields?: any;
  createdAt?: string;
  updatedAt?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead?: boolean;
  read?: boolean;
  relatedId?: string;
  createdAt: string;
}

export interface Garage {
  id: string;
  name: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  website?: string;
  siret?: string;
  tva?: string;
  iban?: string;
  bic?: string;
  bankName?: string;
  defaultTaxRate?: number;
}

export interface Analytics {
  globalRevenue: number;
  pendingRevenue: number;
  avgInvoiceAmount: number;
  conversionRate: string;
  totalInvoices: number;
  totalQuotes: number;
  totalReservations: number;
  monthlyRevenue: { name: string; total: number }[];
  weeklyRevenue: { name: string; total: number }[];
  revenueByPaymentMethod: { method: string; amount: number }[];
  revenueByService: { name: string; revenue: number; count: number }[];
  invoiceStatusStats: { paid: number; pending: number; overdue: number; cancelled: number };
  quoteStatusStats: { pending: number; approved: number; rejected: number; completed: number };
  currentMonth: {
    revenue: number;
    pending: number;
    invoiceCount: number;
    quoteCount: number;
    paidCount: number;
    growth: string;
    monthName: string;
  };
}
