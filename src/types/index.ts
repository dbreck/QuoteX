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

// Pricing Tiers - 50/20/10 Trade Discount Scheme
// These represent discounts OFF LIST PRICE (not cumulative)
// Premier: 50% off list = pays 50% of list price
// Preferred: 20% off list = pays 80% of list price
// Standard: 10% off list = pays 90% of list price
export type PricingTier = 'premier' | 'preferred' | 'standard';

export interface PricingTierConfig {
  id: PricingTier;
  name: string;
  discountPercent: number; // 50, 20, or 10
  description: string;
  minAnnualVolume?: number; // Minimum annual purchase to qualify
}

// Organization represents the parent company/institution
export interface Organization {
  id: string;
  name: string;
  type: 'university' | 'government' | 'corporate' | 'healthcare' | 'k12' | 'dealer' | 'other';
  pricingTier: PricingTier;
  accountNumber?: string;
  website?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  organizationId?: string; // Links to parent Organization
  companyName: string; // Department or division name
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

// CRM Activity Tracking
export type ActivityType = 'note' | 'quote_created' | 'quote_sent' | 'call' | 'email' | 'meeting';

export interface Activity {
  id: string;
  organizationId?: string;
  customerId?: string;
  quoteId?: string;
  type: ActivityType;
  content: string;
  createdAt: string;
  createdBy?: string;
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
    tagline?: string;
    address: string;
    city?: string;
    state?: string;
    zip?: string;
    phone: string;
    email: string;
    website: string;
    logo?: string;
    warranty?: string;
    certifications?: string[];
  };
  pricing: {
    defaultMargin: number;
    taxRate: number;
    quoteValidityDays: number;
    pricingTiers: PricingTierConfig[];
  };
  shipping: {
    freeShippingThreshold: number; // Orders above this get free shipping
    baseShippingRate: number;
    expeditedMultiplier: number;
  };
  preferences: {
    theme: 'light' | 'dark' | 'system';
    currency: string;
    dateFormat: string;
  };
}
