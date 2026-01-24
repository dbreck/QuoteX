import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Quote, Customer, Invoice, InventoryItem, Settings, TableConfiguration, QuoteLineItem } from '@/types';
import { generateId, generateQuoteNumber, generateInvoiceNumber } from '@/lib/utils';

interface AppState {
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

  // UI State
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

const defaultSettings: Settings = {
  company: {
    name: 'TableX',
    address: '123 Manufacturing Way, Suite 100, Industrial City, ST 12345',
    phone: '(555) 123-4567',
    email: 'sales@tablex.com',
    website: 'https://tablex.com',
  },
  pricing: {
    defaultMargin: 35,
    taxRate: 7.5,
    quoteValidityDays: 30,
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

// Demo data
const demoCustomers: Customer[] = [
  {
    id: 'cust-1',
    companyName: 'Acme Corporation',
    contacts: [
      { id: 'cont-1', name: 'John Smith', email: 'john@acme.com', phone: '555-0101', role: 'Procurement Manager', isPrimary: true },
      { id: 'cont-2', name: 'Sarah Johnson', email: 'sarah@acme.com', phone: '555-0102', role: 'Office Manager', isPrimary: false },
    ],
    address: { street: '100 Business Park Dr', city: 'Chicago', state: 'IL', zip: '60601', country: 'USA' },
    tags: ['enterprise', 'repeat-customer'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'cust-2',
    companyName: 'TechStart Inc',
    contacts: [
      { id: 'cont-3', name: 'Emily Chen', email: 'emily@techstart.io', phone: '555-0201', role: 'CEO', isPrimary: true },
    ],
    address: { street: '50 Innovation Blvd', city: 'San Francisco', state: 'CA', zip: '94102', country: 'USA' },
    tags: ['startup', 'tech'],
    createdAt: '2024-02-01T14:30:00Z',
    updatedAt: '2024-02-01T14:30:00Z',
  },
  {
    id: 'cust-3',
    companyName: 'University of State',
    contacts: [
      { id: 'cont-4', name: 'Dr. Michael Brown', email: 'mbrown@ustate.edu', phone: '555-0301', role: 'Facilities Director', isPrimary: true },
    ],
    address: { street: '1 University Way', city: 'Austin', state: 'TX', zip: '78701', country: 'USA' },
    tags: ['education', 'government'],
    createdAt: '2024-02-10T09:00:00Z',
    updatedAt: '2024-02-10T09:00:00Z',
  },
];

const demoQuotes: Quote[] = [
  {
    id: 'quote-1',
    quoteNumber: 'QT-24-0001',
    customerId: 'cust-1',
    customerName: 'Acme Corporation',
    projectName: 'Conference Room Refresh',
    lineItems: [
      {
        id: 'li-1',
        configuration: {
          id: 'config-1',
          baseSeries: 'foundation',
          height: 'standard-29',
          finish: 'black',
          isChrome: false,
          folding: true,
          flipTop: false,
          nesting: true,
          footRing: false,
          topShape: 'rectangle',
          topWidth: 72,
          topDepth: 36,
          topMaterial: 'hpl',
          edgeType: '3p-standard',
          accessories: ['wm-j-channel'],
          calculatedPrice: 1245,
        },
        quantity: 8,
        unitPrice: 1245,
        totalPrice: 9960,
      },
    ],
    subtotal: 9960,
    discountType: 'percentage',
    discountValue: 10,
    discountAmount: 996,
    taxRate: 7.5,
    taxAmount: 672.30,
    total: 9636.30,
    status: 'sent',
    notes: 'Delivery to loading dock B',
    validUntil: '2024-03-15T00:00:00Z',
    createdAt: '2024-02-14T11:00:00Z',
    updatedAt: '2024-02-14T11:00:00Z',
    sentAt: '2024-02-14T15:00:00Z',
  },
  {
    id: 'quote-2',
    quoteNumber: 'QT-24-0002',
    customerId: 'cust-2',
    customerName: 'TechStart Inc',
    projectName: 'New Office Setup',
    lineItems: [
      {
        id: 'li-2',
        configuration: {
          id: 'config-2',
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
        quantity: 20,
        unitPrice: 1685,
        totalPrice: 33700,
      },
    ],
    subtotal: 33700,
    discountType: 'fixed',
    discountValue: 2000,
    discountAmount: 2000,
    taxRate: 8.25,
    taxAmount: 2615.25,
    total: 34315.25,
    status: 'accepted',
    validUntil: '2024-03-20T00:00:00Z',
    createdAt: '2024-02-18T09:30:00Z',
    updatedAt: '2024-02-20T14:00:00Z',
  },
  {
    id: 'quote-3',
    quoteNumber: 'QT-24-0003',
    customerId: 'cust-3',
    customerName: 'University of State',
    projectName: 'Library Study Tables',
    lineItems: [
      {
        id: 'li-3',
        configuration: {
          id: 'config-3',
          baseSeries: 'fundamental',
          height: 'standard-29',
          finish: 'dolphin',
          isChrome: false,
          folding: false,
          flipTop: false,
          nesting: false,
          footRing: false,
          topShape: 'rectangle',
          topWidth: 48,
          topDepth: 24,
          topMaterial: 'hpl',
          edgeType: '3p-standard',
          accessories: ['power-grommet-dual'],
          calculatedPrice: 745,
        },
        quantity: 50,
        unitPrice: 745,
        totalPrice: 37250,
      },
    ],
    subtotal: 37250,
    discountType: 'percentage',
    discountValue: 15,
    discountAmount: 5587.50,
    taxRate: 0,
    taxAmount: 0,
    total: 31662.50,
    status: 'draft',
    notes: 'Tax exempt - educational institution',
    validUntil: '2024-04-01T00:00:00Z',
    createdAt: '2024-02-22T16:00:00Z',
    updatedAt: '2024-02-22T16:00:00Z',
  },
];

const demoInvoices: Invoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV-24-0001',
    quoteId: 'quote-2',
    customerId: 'cust-2',
    customerName: 'TechStart Inc',
    lineItems: demoQuotes[1].lineItems,
    subtotal: 33700,
    discountAmount: 2000,
    taxAmount: 2615.25,
    total: 34315.25,
    amountPaid: 17157.63,
    amountDue: 17157.62,
    status: 'partial',
    payments: [
      { id: 'pay-1', amount: 17157.63, method: 'wire', reference: 'TRF-2024-0215', date: '2024-02-25T00:00:00Z' },
    ],
    dueDate: '2024-03-25T00:00:00Z',
    issuedDate: '2024-02-21T00:00:00Z',
    createdAt: '2024-02-21T10:00:00Z',
    updatedAt: '2024-02-25T14:00:00Z',
  },
];

const demoInventory: InventoryItem[] = [
  { id: 'inv-item-1', sku: 'BASE-FND-001', name: 'Foundation Base - Black', category: 'base', quantity: 45, reorderPoint: 20, reorderQuantity: 50, unitCost: 185 },
  { id: 'inv-item-2', sku: 'BASE-FND-002', name: 'Foundation Base - Arctic', category: 'base', quantity: 32, reorderPoint: 15, reorderQuantity: 40, unitCost: 185 },
  { id: 'inv-item-3', sku: 'BASE-SRG-001', name: 'Surge Electric Base', category: 'base', quantity: 12, reorderPoint: 10, reorderQuantity: 25, unitCost: 425 },
  { id: 'inv-item-4', sku: 'TOP-HPL-WHT', name: 'HPL Top - Designer White (4x8)', category: 'top', quantity: 28, reorderPoint: 10, reorderQuantity: 20, unitCost: 95 },
  { id: 'inv-item-5', sku: 'TOP-HPL-OAK', name: 'HPL Top - Montana Oak (4x8)', category: 'top', quantity: 8, reorderPoint: 10, reorderQuantity: 20, unitCost: 115 },
  { id: 'inv-item-6', sku: 'ACC-PWR-POP', name: 'Pop-Up Power Tower', category: 'accessory', quantity: 65, reorderPoint: 25, reorderQuantity: 50, unitCost: 85 },
  { id: 'inv-item-7', sku: 'ACC-CST-2HD', name: '2" Heavy-Duty Casters (set)', category: 'accessory', quantity: 120, reorderPoint: 50, reorderQuantity: 100, unitCost: 42 },
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
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
            preferences: { ...state.settings.preferences, ...updates.preferences },
          },
        }));
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
