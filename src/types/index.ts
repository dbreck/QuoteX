// Core Types for QuoteX

export type BaseSeriesType =
  | 'ultra' | 'foundation' | 'fundamental' | 'trig' | 'stretch'
  | 'elite' | 'revel' | 'app' | 'element' | 'justice'
  | 'artisan' | 'primary-disc' | 'primary-column' | 'puddle'
  | 'exclaim' | 'vertigo' | 'surge';

export type HeightOption =
  | 'standard-29' | 'counter-balance' | 'short-balance'
  | 'pneumatic' | 'electric' | 'battery-electric' | 'ratchet' | 'crank';

export type TopShape =
  | 'rectangle' | 'square' | 'round' | 'boat-shaped' | 'racetrack'
  | 'ellipse' | 'half-round' | 'trapezoid' | 'd-shaped' | 'squircle';

export type TopMaterial =
  | 'hpl' | 'butcher-block' | 'solid-surface' | 'stainless-steel' | 'phenolic-epoxy';

export type EdgeType =
  | '3p-standard' | '3p-match' | '3p-reeded' | '3k-standard' | '3k-match' | '3w-wood' | '2p-acrylic';

export interface FinishColor {
  id: string;
  name: string;
  hex: string;
  category: 'neutral' | 'warm' | 'cool' | 'bold' | 'metallic';
}

export interface BaseSeries {
  id: BaseSeriesType;
  name: string;
  description: string;
  basePrice: number;
  supportsFolding: boolean;
  supportsFlipTop: boolean;
  supportsNesting: boolean;
  supportsChrome: boolean;
  heightOptions: HeightOption[];
  image: string;
}

export interface TopOption {
  id: TopShape;
  name: string;
  icon: string;
  priceMultiplier: number;
}

export interface MaterialOption {
  id: TopMaterial;
  name: string;
  description: string;
  pricePerSqFt: number;
}

export interface EdgeOption {
  id: EdgeType;
  name: string;
  pricePerLinearFt: number;
}

export interface Accessory {
  id: string;
  name: string;
  category: 'panel' | 'wire-management' | 'caster' | 'power' | 'other';
  price: number;
  description: string;
}

export interface TableConfiguration {
  id: string;
  baseSeries: BaseSeriesType;
  height: HeightOption;
  finish: string;
  isChrome: boolean;
  folding: boolean;
  flipTop: boolean;
  nesting: boolean;
  footRing: boolean;
  topShape: TopShape;
  topWidth: number;
  topDepth: number;
  topMaterial: TopMaterial;
  laminateId?: string;
  edgeType: EdgeType;
  accessories: string[];
  calculatedPrice: number;
}

export interface QuoteLineItem {
  id: string;
  configuration: TableConfiguration;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

export type QuoteStatus = 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired';

export interface Quote {
  id: string;
  quoteNumber: string;
  customerId: string;
  customerName: string;
  projectName: string;
  lineItems: QuoteLineItem[];
  subtotal: number;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discountAmount: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  status: QuoteStatus;
  notes?: string;
  internalNotes?: string;
  validUntil: string;
  createdAt: string;
  updatedAt: string;
  sentAt?: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  isPrimary: boolean;
}

export interface Customer {
  id: string;
  companyName: string;
  contacts: Contact[];
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  tags: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'partial' | 'overdue' | 'cancelled';

export interface Payment {
  id: string;
  amount: number;
  method: 'check' | 'wire' | 'credit-card' | 'ach' | 'other';
  reference?: string;
  date: string;
  notes?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  quoteId: string;
  customerId: string;
  customerName: string;
  lineItems: QuoteLineItem[];
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
  amountPaid: number;
  amountDue: number;
  status: InvoiceStatus;
  payments: Payment[];
  dueDate: string;
  issuedDate: string;
  paidDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: 'base' | 'top' | 'finish' | 'accessory' | 'hardware';
  quantity: number;
  reorderPoint: number;
  reorderQuantity: number;
  unitCost: number;
  supplier?: string;
  lastRestocked?: string;
  notes?: string;
}

export interface DashboardMetrics {
  quotesThisMonth: number;
  quotesLastMonth: number;
  revenueThisMonth: number;
  revenueLastMonth: number;
  pendingQuotes: number;
  conversionRate: number;
  averageQuoteValue: number;
  topProducts: { name: string; count: number }[];
}

export interface Settings {
  company: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    logo?: string;
  };
  pricing: {
    defaultMargin: number;
    taxRate: number;
    quoteValidityDays: number;
  };
  preferences: {
    theme: 'light' | 'dark' | 'system';
    currency: string;
    dateFormat: string;
  };
}
