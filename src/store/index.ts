import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Quote, Customer, Invoice, InventoryItem, Settings, TableConfiguration, QuoteLineItem, Organization, PricingTierConfig } from '@/types';
import { generateId, generateQuoteNumber, generateInvoiceNumber } from '@/lib/utils';

interface AppState {
  // Organizations
  organizations: Organization[];
  addOrganization: (org: Omit<Organization, 'id' | 'createdAt' | 'updatedAt'>) => Organization;
  updateOrganization: (id: string, updates: Partial<Organization>) => void;
  deleteOrganization: (id: string) => void;
  getOrganization: (id: string) => Organization | undefined;

  // Quotes
  quotes: Quote[];
  addQuote: (quote: Omit<Quote, 'id' | 'quoteNumber' | 'createdAt' | 'updatedAt'>) => Quote;
  updateQuote: (id: string, updates: Partial<Quote>) => void;
  deleteQuote: (id: string) => void;
  getQuote: (id: string) => Quote | undefined;

  // Customers
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => Customer;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  getCustomer: (id: string) => Customer | undefined;

  // Invoices
  invoices: Invoice[];
  addInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt' | 'updatedAt'>) => Invoice;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  getInvoice: (id: string) => Invoice | undefined;
  convertQuoteToInvoice: (quoteId: string) => Invoice | null;

  // Inventory
  inventory: InventoryItem[];
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => InventoryItem;
  updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;

  // Settings
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => void;

  // Current Configuration (for configurator)
  currentConfig: Partial<TableConfiguration>;
  updateCurrentConfig: (updates: Partial<TableConfiguration>) => void;
  resetCurrentConfig: () => void;

  // Pricing Helpers
  getCustomerDiscount: (customerId: string) => number;
  applyTierPricing: (listPrice: number, customerId: string) => number;

  // UI State
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

// 50/20/10 Trade Discount Scheme
// These are discounts OFF list price (not cumulative)
const pricingTiers: PricingTierConfig[] = [
  {
    id: 'premier',
    name: 'Premier Partner',
    discountPercent: 50,
    description: '50% off list price. Reserved for high-volume dealers, major accounts, and strategic partners.',
    minAnnualVolume: 500000,
  },
  {
    id: 'preferred',
    name: 'Preferred Account',
    discountPercent: 20,
    description: '20% off list price. For established accounts with consistent purchasing history.',
    minAnnualVolume: 100000,
  },
  {
    id: 'standard',
    name: 'Standard Account',
    discountPercent: 10,
    description: '10% off list price. Entry-level trade pricing for qualified businesses.',
    minAnnualVolume: 25000,
  },
];

const defaultSettings: Settings = {
  company: {
    name: 'TableX',
    tagline: 'The Table Experts',
    address: '500 Third Avenue',
    city: 'Jasper',
    state: 'IN',
    zip: '47546',
    phone: '(812) 482-3204',
    email: 'sales@tablex.com',
    website: 'https://tablex.com',
    warranty: '50 Year Limited Warranty (1 year for electrical components)',
    certifications: ['BIFMA Certified', 'Made in USA', 'Built-to-Order'],
  },
  pricing: {
    defaultMargin: 35,
    taxRate: 7.0,
    quoteValidityDays: 30,
    pricingTiers: pricingTiers,
  },
  shipping: {
    freeShippingThreshold: 3000, // Orders over $3000 list get free standard shipping
    baseShippingRate: 295,
    expeditedMultiplier: 1.75,
  },
  preferences: {
    theme: 'system',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
  },
};

const defaultConfig: Partial<TableConfiguration> = {
  baseSeries: 'foundation',
  height: 'standard-29',
  finish: 'black',
  isChrome: false,
  folding: false,
  flipTop: false,
  nesting: false,
  footRing: false,
  topShape: 'rectangle',
  topWidth: 60,
  topDepth: 30,
  topMaterial: 'hpl',
  edgeType: '3p-standard',
  accessories: [],
};

// Demo Organizations - Major accounts
const demoOrganizations: Organization[] = [
  {
    id: 'org-1',
    name: 'University of Notre Dame',
    type: 'university',
    pricingTier: 'premier',
    accountNumber: 'ND-001-2018',
    website: 'https://nd.edu',
    address: {
      street: '400 Main Building',
      city: 'Notre Dame',
      state: 'IN',
      zip: '46556',
      country: 'USA',
    },
    notes: 'Long-standing partner since 2018. Prefers Foundation and Elite series. Annual campus furniture refresh program. Contact before end of fiscal year (June).',
    createdAt: '2018-03-15T10:00:00Z',
    updatedAt: '2024-01-10T14:30:00Z',
  },
  {
    id: 'org-2',
    name: 'Library of Congress',
    type: 'government',
    pricingTier: 'premier',
    accountNumber: 'LOC-GSA-2020',
    website: 'https://loc.gov',
    address: {
      street: '101 Independence Ave SE',
      city: 'Washington',
      state: 'DC',
      zip: '20540',
      country: 'USA',
    },
    notes: 'GSA Schedule holder. Tax exempt. Requires compliance documentation. Prefers American-made products. Multiple reading rooms with ongoing furniture needs.',
    createdAt: '2020-06-01T09:00:00Z',
    updatedAt: '2024-02-05T11:00:00Z',
  },
  {
    id: 'org-3',
    name: 'Herman Miller',
    type: 'dealer',
    pricingTier: 'premier',
    accountNumber: 'HM-DLR-2019',
    website: 'https://hermanmiller.com',
    address: {
      street: '855 East Main Avenue',
      city: 'Zeeland',
      state: 'MI',
      zip: '49464',
      country: 'USA',
    },
    notes: 'Strategic dealer partner. Specs TableX tables with Herman Miller seating. White-label opportunities discussed. Quarterly business reviews.',
    createdAt: '2019-09-20T13:00:00Z',
    updatedAt: '2024-01-25T16:00:00Z',
  },
  {
    id: 'org-4',
    name: 'Mayo Clinic',
    type: 'healthcare',
    pricingTier: 'preferred',
    accountNumber: 'MC-HC-2021',
    website: 'https://mayoclinic.org',
    address: {
      street: '200 First Street SW',
      city: 'Rochester',
      state: 'MN',
      zip: '55905',
      country: 'USA',
    },
    notes: 'Healthcare spec requires antimicrobial surfaces. Solid Surface tops preferred. Growing account with expansion plans.',
    createdAt: '2021-04-10T08:00:00Z',
    updatedAt: '2024-02-01T10:00:00Z',
  },
  {
    id: 'org-5',
    name: 'WeWork',
    type: 'corporate',
    pricingTier: 'preferred',
    accountNumber: 'WW-CORP-2022',
    website: 'https://wework.com',
    address: {
      street: '75 Rockefeller Plaza',
      city: 'New York',
      state: 'NY',
      zip: '10019',
      country: 'USA',
    },
    notes: 'Coworking spaces need durable, modern tables. Electric height-adjustable popular. QuickShip program important for fast buildouts.',
    createdAt: '2022-01-15T11:00:00Z',
    updatedAt: '2023-12-20T09:00:00Z',
  },
  {
    id: 'org-6',
    name: 'Denver Public Schools',
    type: 'k12',
    pricingTier: 'standard',
    accountNumber: 'DPS-K12-2023',
    website: 'https://dpsk12.org',
    address: {
      street: '1860 Lincoln Street',
      city: 'Denver',
      state: 'CO',
      zip: '80203',
      country: 'USA',
    },
    notes: 'New account. Fundamental series fits budget. Summer delivery windows only. Tax exempt - education.',
    createdAt: '2023-08-01T10:00:00Z',
    updatedAt: '2024-01-05T14:00:00Z',
  },
];

// Demo Customers - Departments/contacts within organizations
const demoCustomers: Customer[] = [
  {
    id: 'cust-1',
    organizationId: 'org-1',
    companyName: 'Hesburgh Libraries',
    contacts: [
      { id: 'cont-1', name: 'Margaret Sullivan', email: 'msullivan@nd.edu', phone: '574-631-6258', role: 'Director of Facilities', isPrimary: true },
      { id: 'cont-2', name: 'Thomas Chen', email: 'tchen@nd.edu', phone: '574-631-6259', role: 'Procurement Specialist', isPrimary: false },
    ],
    address: { street: 'Hesburgh Library', city: 'Notre Dame', state: 'IN', zip: '46556', country: 'USA' },
    tags: ['education', 'library', 'premier'],
    notes: 'Annual study table refresh program. Prefers matching finishes across floors.',
    createdAt: '2018-03-15T10:00:00Z',
    updatedAt: '2024-01-10T14:30:00Z',
  },
  {
    id: 'cust-2',
    organizationId: 'org-1',
    companyName: 'Mendoza College of Business',
    contacts: [
      { id: 'cont-3', name: 'Robert Martinez', email: 'rmartinez@nd.edu', phone: '574-631-8488', role: 'Operations Manager', isPrimary: true },
    ],
    address: { street: 'Mendoza College of Business', city: 'Notre Dame', state: 'IN', zip: '46556', country: 'USA' },
    tags: ['education', 'business-school', 'premier'],
    notes: 'Executive conference tables. Premium finishes. Height-adjustable for presentations.',
    createdAt: '2019-08-20T09:00:00Z',
    updatedAt: '2024-02-01T11:00:00Z',
  },
  {
    id: 'cust-3',
    organizationId: 'org-2',
    companyName: 'Main Reading Room',
    contacts: [
      { id: 'cont-4', name: 'Dr. Patricia Williams', email: 'pwilliams@loc.gov', phone: '202-707-5000', role: 'Chief of Collections', isPrimary: true },
      { id: 'cont-5', name: 'James Anderson', email: 'janderson@loc.gov', phone: '202-707-5001', role: 'Facilities Coordinator', isPrimary: false },
    ],
    address: { street: 'Thomas Jefferson Building', city: 'Washington', state: 'DC', zip: '20540', country: 'USA' },
    tags: ['government', 'library', 'historic', 'premier'],
    notes: 'Historic building - custom wood edge finishes required. All orders need GSA compliance docs.',
    createdAt: '2020-06-01T09:00:00Z',
    updatedAt: '2024-02-05T11:00:00Z',
  },
  {
    id: 'cust-4',
    organizationId: 'org-3',
    companyName: 'Herman Miller Contract Division',
    contacts: [
      { id: 'cont-6', name: 'Sarah Johnson', email: 'sjohnson@hermanmiller.com', phone: '616-654-3000', role: 'VP Strategic Partnerships', isPrimary: true },
      { id: 'cont-7', name: 'Michael Torres', email: 'mtorres@hermanmiller.com', phone: '616-654-3001', role: 'Product Manager - Tables', isPrimary: false },
    ],
    address: { street: '855 East Main Avenue', city: 'Zeeland', state: 'MI', zip: '49464', country: 'USA' },
    tags: ['dealer', 'strategic-partner', 'premier'],
    notes: 'Drop-ship to end customers. White-label packaging available. Net 45 terms.',
    createdAt: '2019-09-20T13:00:00Z',
    updatedAt: '2024-01-25T16:00:00Z',
  },
  {
    id: 'cust-5',
    organizationId: 'org-4',
    companyName: 'Mayo Clinic - Rochester Campus',
    contacts: [
      { id: 'cont-8', name: 'Dr. Emily Chang', email: 'echang@mayo.edu', phone: '507-284-2511', role: 'Facilities Planning Director', isPrimary: true },
    ],
    address: { street: '200 First Street SW', city: 'Rochester', state: 'MN', zip: '55905', country: 'USA' },
    tags: ['healthcare', 'preferred'],
    notes: 'Requires healthcare-grade surfaces. Phenolic Epoxy for lab tables. Antimicrobial edge bands.',
    createdAt: '2021-04-10T08:00:00Z',
    updatedAt: '2024-02-01T10:00:00Z',
  },
  {
    id: 'cust-6',
    organizationId: 'org-5',
    companyName: 'WeWork - Manhattan',
    contacts: [
      { id: 'cont-9', name: 'Alex Rivera', email: 'arivera@wework.com', phone: '212-389-0500', role: 'Regional Facilities Manager', isPrimary: true },
    ],
    address: { street: '75 Rockefeller Plaza', city: 'New York', state: 'NY', zip: '10019', country: 'USA' },
    tags: ['corporate', 'coworking', 'preferred'],
    notes: 'Multiple locations. Standard specs: Surge electric desks, Foundation conference tables. Fast turnaround needed.',
    createdAt: '2022-01-15T11:00:00Z',
    updatedAt: '2023-12-20T09:00:00Z',
  },
  {
    id: 'cust-7',
    organizationId: 'org-6',
    companyName: 'Denver Public Schools - Facilities',
    contacts: [
      { id: 'cont-10', name: 'Maria Garcia', email: 'mgarcia@dpsk12.org', phone: '720-423-3200', role: 'Procurement Director', isPrimary: true },
    ],
    address: { street: '1860 Lincoln Street', city: 'Denver', state: 'CO', zip: '80203', country: 'USA' },
    tags: ['k12', 'education', 'standard'],
    notes: 'Budget-focused. Fundamental series preferred. Summer delivery only - schools closed.',
    createdAt: '2023-08-01T10:00:00Z',
    updatedAt: '2024-01-05T14:00:00Z',
  },
];

const demoQuotes: Quote[] = [
  {
    id: 'quote-1',
    quoteNumber: 'QT-24-0001',
    customerId: 'cust-1',
    customerName: 'Hesburgh Libraries',
    projectName: 'Study Hall Table Refresh - 3rd Floor',
    lineItems: [
      {
        id: 'li-1',
        configuration: {
          id: 'config-1',
          baseSeries: 'foundation',
          height: 'standard-29',
          finish: 'dolphin',
          isChrome: false,
          folding: false,
          flipTop: false,
          nesting: false,
          footRing: false,
          topShape: 'rectangle',
          topWidth: 72,
          topDepth: 36,
          topMaterial: 'hpl',
          edgeType: '3w-wood',
          accessories: ['power-grommet-dual'],
          calculatedPrice: 1485,
        },
        quantity: 24,
        unitPrice: 742.50, // 50% off list (Premier tier)
        totalPrice: 17820,
      },
    ],
    subtotal: 17820,
    discountType: 'fixed',
    discountValue: 0, // Tier pricing already applied
    discountAmount: 0,
    taxRate: 0, // Tax exempt - education
    taxAmount: 0,
    total: 17820,
    status: 'sent',
    notes: 'Tax exempt - Educational institution. Summer delivery preferred.',
    internalNotes: 'Premier tier pricing applied (50% off list). Long-standing account.',
    validUntil: '2024-04-15T00:00:00Z',
    createdAt: '2024-02-14T11:00:00Z',
    updatedAt: '2024-02-14T11:00:00Z',
    sentAt: '2024-02-14T15:00:00Z',
  },
  {
    id: 'quote-2',
    quoteNumber: 'QT-24-0002',
    customerId: 'cust-3',
    customerName: 'Main Reading Room',
    projectName: 'Jefferson Building - Reading Tables',
    lineItems: [
      {
        id: 'li-2',
        configuration: {
          id: 'config-2',
          baseSeries: 'elite',
          height: 'standard-29',
          finish: 'windsor-mahogany',
          isChrome: false,
          folding: false,
          flipTop: false,
          nesting: false,
          footRing: false,
          topShape: 'rectangle',
          topWidth: 96,
          topDepth: 42,
          topMaterial: 'hpl',
          edgeType: '3w-wood',
          accessories: ['wm-j-channel'],
          calculatedPrice: 2850,
        },
        quantity: 12,
        unitPrice: 1425, // 50% off list (Premier tier)
        totalPrice: 17100,
      },
    ],
    subtotal: 17100,
    discountType: 'fixed',
    discountValue: 0,
    discountAmount: 0,
    taxRate: 0, // Government - tax exempt
    taxAmount: 0,
    total: 17100,
    status: 'accepted',
    notes: 'GSA Schedule pricing. Historic building - requires approval for finish samples.',
    internalNotes: 'Premier tier (50% off). Government account - ensure compliance docs included.',
    validUntil: '2024-05-01T00:00:00Z',
    createdAt: '2024-02-18T09:30:00Z',
    updatedAt: '2024-02-28T14:00:00Z',
  },
  {
    id: 'quote-3',
    quoteNumber: 'QT-24-0003',
    customerId: 'cust-6',
    customerName: 'WeWork - Manhattan',
    projectName: 'Hudson Yards Location - Hot Desks',
    lineItems: [
      {
        id: 'li-3',
        configuration: {
          id: 'config-3',
          baseSeries: 'surge',
          height: 'electric',
          finish: 'arctic',
          isChrome: false,
          folding: false,
          flipTop: false,
          nesting: false,
          footRing: false,
          topShape: 'rectangle',
          topWidth: 60,
          topDepth: 30,
          topMaterial: 'hpl',
          edgeType: '3k-standard',
          accessories: ['power-pop-up', 'wm-spine'],
          calculatedPrice: 1685,
        },
        quantity: 40,
        unitPrice: 1348, // 20% off list (Preferred tier)
        totalPrice: 53920,
      },
    ],
    subtotal: 53920,
    discountType: 'fixed',
    discountValue: 0,
    discountAmount: 0,
    taxRate: 8.875, // NYC sales tax
    taxAmount: 4785.40,
    total: 58705.40,
    status: 'draft',
    notes: 'QuickShip if possible - location opening in 6 weeks.',
    internalNotes: 'Preferred tier pricing (20% off). Check inventory for QuickShip availability.',
    validUntil: '2024-04-01T00:00:00Z',
    createdAt: '2024-02-22T16:00:00Z',
    updatedAt: '2024-02-22T16:00:00Z',
  },
  {
    id: 'quote-4',
    quoteNumber: 'QT-24-0004',
    customerId: 'cust-7',
    customerName: 'Denver Public Schools - Facilities',
    projectName: 'Elementary Schools Classroom Tables',
    lineItems: [
      {
        id: 'li-4',
        configuration: {
          id: 'config-4',
          baseSeries: 'fundamental',
          height: 'standard-29',
          finish: 'black',
          isChrome: false,
          folding: true,
          flipTop: false,
          nesting: true,
          footRing: false,
          topShape: 'rectangle',
          topWidth: 60,
          topDepth: 24,
          topMaterial: 'hpl',
          edgeType: '3p-standard',
          accessories: [],
          calculatedPrice: 695,
        },
        quantity: 150,
        unitPrice: 625.50, // 10% off list (Standard tier)
        totalPrice: 93825,
      },
    ],
    subtotal: 93825,
    discountType: 'fixed',
    discountValue: 0,
    discountAmount: 0,
    taxRate: 0, // Tax exempt - K12
    taxAmount: 0,
    total: 93825,
    status: 'sent',
    notes: 'Tax exempt - Educational institution. Delivery June 1-15 only (schools closed).',
    internalNotes: 'Standard tier (10% off). New account - growth potential. Summer delivery window tight.',
    validUntil: '2024-05-15T00:00:00Z',
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-01T14:00:00Z',
    sentAt: '2024-03-01T14:30:00Z',
  },
];

const demoInvoices: Invoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV-24-0001',
    quoteId: 'quote-2',
    customerId: 'cust-3',
    customerName: 'Main Reading Room',
    lineItems: demoQuotes[1].lineItems,
    subtotal: 17100,
    discountAmount: 0,
    taxAmount: 0,
    total: 17100,
    amountPaid: 17100,
    amountDue: 0,
    status: 'paid',
    payments: [
      { id: 'pay-1', amount: 17100, method: 'wire', reference: 'GSA-TRF-2024-0301', date: '2024-03-05T00:00:00Z', notes: 'Government wire transfer' },
    ],
    dueDate: '2024-04-01T00:00:00Z',
    issuedDate: '2024-03-01T00:00:00Z',
    paidDate: '2024-03-05T00:00:00Z',
    notes: 'GSA Schedule order - compliance docs attached.',
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-05T14:00:00Z',
  },
];

const demoInventory: InventoryItem[] = [
  { id: 'inv-item-1', sku: 'BASE-FND-BLK', name: 'Foundation Base - Black', category: 'base', quantity: 45, reorderPoint: 20, reorderQuantity: 50, unitCost: 185, supplier: 'In-House Manufacturing' },
  { id: 'inv-item-2', sku: 'BASE-FND-ARC', name: 'Foundation Base - Arctic', category: 'base', quantity: 32, reorderPoint: 15, reorderQuantity: 40, unitCost: 185, supplier: 'In-House Manufacturing' },
  { id: 'inv-item-3', sku: 'BASE-FND-DLP', name: 'Foundation Base - Dolphin', category: 'base', quantity: 28, reorderPoint: 15, reorderQuantity: 40, unitCost: 185, supplier: 'In-House Manufacturing' },
  { id: 'inv-item-4', sku: 'BASE-ELT-BLK', name: 'Elite Base - Black', category: 'base', quantity: 18, reorderPoint: 10, reorderQuantity: 25, unitCost: 285, supplier: 'In-House Manufacturing' },
  { id: 'inv-item-5', sku: 'BASE-SRG-ELC', name: 'Surge Electric Base Assembly', category: 'base', quantity: 12, reorderPoint: 10, reorderQuantity: 25, unitCost: 425, supplier: 'Linak USA', notes: '1 year warranty on electrical' },
  { id: 'inv-item-6', sku: 'TOP-HPL-WHT-4x8', name: 'HPL Sheet - Designer White (4x8)', category: 'top', quantity: 28, reorderPoint: 10, reorderQuantity: 20, unitCost: 95, supplier: 'Wilsonart' },
  { id: 'inv-item-7', sku: 'TOP-HPL-OAK-4x8', name: 'HPL Sheet - Montana Oak (4x8)', category: 'top', quantity: 18, reorderPoint: 10, reorderQuantity: 20, unitCost: 115, supplier: 'Formica' },
  { id: 'inv-item-8', sku: 'TOP-HPL-MAH-4x8', name: 'HPL Sheet - Windsor Mahogany (4x8)', category: 'top', quantity: 8, reorderPoint: 8, reorderQuantity: 15, unitCost: 125, supplier: 'Wilsonart', notes: 'Premium finish - longer lead time' },
  { id: 'inv-item-9', sku: 'EDG-3W-OAK', name: '3mm Wood Edge - Oak (250 LF roll)', category: 'finish', quantity: 6, reorderPoint: 4, reorderQuantity: 8, unitCost: 185, supplier: 'EdgeCo' },
  { id: 'inv-item-10', sku: 'EDG-3W-MAH', name: '3mm Wood Edge - Mahogany (250 LF roll)', category: 'finish', quantity: 3, reorderPoint: 3, reorderQuantity: 6, unitCost: 210, supplier: 'EdgeCo' },
  { id: 'inv-item-11', sku: 'ACC-PWR-POP', name: 'Pop-Up Power Tower (2 outlet + 2 USB)', category: 'accessory', quantity: 65, reorderPoint: 25, reorderQuantity: 50, unitCost: 85, supplier: 'Doug Mockett' },
  { id: 'inv-item-12', sku: 'ACC-PWR-GRM', name: 'Power Grommet - Dual Outlet', category: 'accessory', quantity: 120, reorderPoint: 50, reorderQuantity: 100, unitCost: 45, supplier: 'Doug Mockett' },
  { id: 'inv-item-13', sku: 'ACC-WM-JCHN', name: 'Wire Management J-Channel (6 ft)', category: 'accessory', quantity: 85, reorderPoint: 40, reorderQuantity: 80, unitCost: 22, supplier: 'In-House Manufacturing' },
  { id: 'inv-item-14', sku: 'ACC-CST-2HD', name: 'Casters - 2" Heavy-Duty (set of 4)', category: 'hardware', quantity: 90, reorderPoint: 50, reorderQuantity: 100, unitCost: 42, supplier: 'Shepherd Caster' },
  { id: 'inv-item-15', sku: 'ACC-GLI-STD', name: 'Floor Glides - Standard (set of 4)', category: 'hardware', quantity: 200, reorderPoint: 100, reorderQuantity: 200, unitCost: 8, supplier: 'Shepherd Caster' },
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Organizations
      organizations: demoOrganizations,
      addOrganization: (org) => {
        const newOrg: Organization = {
          ...org,
          id: generateId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ organizations: [...state.organizations, newOrg] }));
        return newOrg;
      },
      updateOrganization: (id, updates) => {
        set((state) => ({
          organizations: state.organizations.map((o) =>
            o.id === id ? { ...o, ...updates, updatedAt: new Date().toISOString() } : o
          ),
        }));
      },
      deleteOrganization: (id) => {
        set((state) => ({ organizations: state.organizations.filter((o) => o.id !== id) }));
      },
      getOrganization: (id) => get().organizations.find((o) => o.id === id),

      // Quotes
      quotes: demoQuotes,
      addQuote: (quote) => {
        const newQuote: Quote = {
          ...quote,
          id: generateId(),
          quoteNumber: generateQuoteNumber(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ quotes: [...state.quotes, newQuote] }));
        return newQuote;
      },
      updateQuote: (id, updates) => {
        set((state) => ({
          quotes: state.quotes.map((q) =>
            q.id === id ? { ...q, ...updates, updatedAt: new Date().toISOString() } : q
          ),
        }));
      },
      deleteQuote: (id) => {
        set((state) => ({ quotes: state.quotes.filter((q) => q.id !== id) }));
      },
      getQuote: (id) => get().quotes.find((q) => q.id === id),

      // Customers
      customers: demoCustomers,
      addCustomer: (customer) => {
        const newCustomer: Customer = {
          ...customer,
          id: generateId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ customers: [...state.customers, newCustomer] }));
        return newCustomer;
      },
      updateCustomer: (id, updates) => {
        set((state) => ({
          customers: state.customers.map((c) =>
            c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
          ),
        }));
      },
      deleteCustomer: (id) => {
        set((state) => ({ customers: state.customers.filter((c) => c.id !== id) }));
      },
      getCustomer: (id) => get().customers.find((c) => c.id === id),

      // Invoices
      invoices: demoInvoices,
      addInvoice: (invoice) => {
        const newInvoice: Invoice = {
          ...invoice,
          id: generateId(),
          invoiceNumber: generateInvoiceNumber(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ invoices: [...state.invoices, newInvoice] }));
        return newInvoice;
      },
      updateInvoice: (id, updates) => {
        set((state) => ({
          invoices: state.invoices.map((i) =>
            i.id === id ? { ...i, ...updates, updatedAt: new Date().toISOString() } : i
          ),
        }));
      },
      deleteInvoice: (id) => {
        set((state) => ({ invoices: state.invoices.filter((i) => i.id !== id) }));
      },
      getInvoice: (id) => get().invoices.find((i) => i.id === id),
      convertQuoteToInvoice: (quoteId) => {
        const quote = get().getQuote(quoteId);
        if (!quote || quote.status !== 'accepted') return null;

        const invoice = get().addInvoice({
          quoteId: quote.id,
          customerId: quote.customerId,
          customerName: quote.customerName,
          lineItems: quote.lineItems,
          subtotal: quote.subtotal,
          discountAmount: quote.discountAmount,
          taxAmount: quote.taxAmount,
          total: quote.total,
          amountPaid: 0,
          amountDue: quote.total,
          status: 'draft',
          payments: [],
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          issuedDate: new Date().toISOString(),
        });

        return invoice;
      },

      // Inventory
      inventory: demoInventory,
      addInventoryItem: (item) => {
        const newItem: InventoryItem = { ...item, id: generateId() };
        set((state) => ({ inventory: [...state.inventory, newItem] }));
        return newItem;
      },
      updateInventoryItem: (id, updates) => {
        set((state) => ({
          inventory: state.inventory.map((i) => (i.id === id ? { ...i, ...updates } : i)),
        }));
      },
      deleteInventoryItem: (id) => {
        set((state) => ({ inventory: state.inventory.filter((i) => i.id !== id) }));
      },

      // Settings
      settings: defaultSettings,
      updateSettings: (updates) => {
        set((state) => ({
          settings: {
            ...state.settings,
            ...updates,
            company: { ...state.settings.company, ...updates.company },
            pricing: { ...state.settings.pricing, ...updates.pricing },
            shipping: { ...state.settings.shipping, ...updates.shipping },
            preferences: { ...state.settings.preferences, ...updates.preferences },
          },
        }));
      },

      // Pricing Helpers
      getCustomerDiscount: (customerId) => {
        const customer = get().getCustomer(customerId);
        if (!customer?.organizationId) return 0;

        const org = get().getOrganization(customer.organizationId);
        if (!org) return 0;

        const tier = get().settings.pricing.pricingTiers.find(t => t.id === org.pricingTier);
        return tier?.discountPercent || 0;
      },
      applyTierPricing: (listPrice, customerId) => {
        const discount = get().getCustomerDiscount(customerId);
        return listPrice * (1 - discount / 100);
      },

      // Current Configuration
      currentConfig: defaultConfig,
      updateCurrentConfig: (updates) => {
        set((state) => ({ currentConfig: { ...state.currentConfig, ...updates } }));
      },
      resetCurrentConfig: () => {
        set({ currentConfig: defaultConfig });
      },

      // UI State
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      theme: 'system',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'quotex-storage',
      partialize: (state) => ({
        organizations: state.organizations,
        quotes: state.quotes,
        customers: state.customers,
        invoices: state.invoices,
        inventory: state.inventory,
        settings: state.settings,
        theme: state.theme,
      }),
    }
  )
);
