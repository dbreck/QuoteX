# QuoteX - TableX Quoting System

## Project Overview
QuoteX is a comprehensive CPQ (Configure, Price, Quote) system built for TableX (tablex.com), a commercial table manufacturing company. The system enables sales teams to configure complex table products, generate professional quotes, manage customers, and track invoices.

## Tech Stack
- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **State Management:** Zustand with localStorage persistence
- **Charts:** Recharts
- **UI Components:** Radix UI primitives
- **PDF Generation:** jsPDF + html2canvas
- **Icons:** Lucide React

## Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/          # Main dashboard with KPIs
│   ├── configurator/       # Visual table configurator
│   ├── quotes/             # Quote management (list, new, [id])
│   ├── customers/          # CRM - Organizations & Customers
│   ├── inventory/          # Inventory management
│   ├── invoices/           # Invoice management
│   └── settings/           # Company & pricing settings
├── components/
│   ├── layout/             # Sidebar, Header
│   ├── ui/                 # Reusable UI components
│   ├── configurator/       # Table configurator components
│   ├── quotes/             # Quote-related components
│   └── customers/          # CRM components
├── lib/
│   ├── utils.ts            # Utility functions (cn, formatCurrency)
│   └── pdf.ts              # PDF generation utilities
├── store/
│   └── index.ts            # Zustand store with all state
├── types/
│   └── index.ts            # TypeScript type definitions
└── data/
    ├── base-series.ts      # Table base configurations
    ├── finishes.ts         # Powdercoat finish options
    ├── laminates.ts        # HPL laminate options
    └── edges.ts            # Edge type options
```

## Key Features

### 1. Visual Table Configurator
- Step-by-step product builder
- Base series selection (17+ options)
- Height/mechanism options
- Finish color picker with swatches
- Top shape selector with visual icons
- Material and laminate picker
- Edge selection
- Accessories multi-select
- Real-time price calculation

### 2. Quote Management
- Create quotes with multiple configured products
- Quantity adjustments per line item
- Discount support (percentage or fixed)
- Tax calculation
- Customer assignment
- Status workflow: Draft → Sent → Accepted/Rejected
- PDF export

### 3. CRM (Organizations & Customers)
- **Organizations:** Parent companies with pricing tiers
  - Premier (50% off list)
  - Preferred (20% off list)
  - Standard (10% off list)
- **Customers:** Departments/divisions under organizations
- Contact management
- Quote history per customer

### 4. Invoice System
- Convert accepted quotes to invoices
- Status tracking: Draft → Sent → Paid → Overdue
- Payment recording
- Due date management

### 5. Inventory Management
- Component stock levels
- Low stock alerts
- Reorder points
- Cost tracking

### 6. Settings
- Company information
- Pricing tier configuration
- Tax rates
- Shipping settings

## Brand Colors
- **Green:** #8dc63f (brand-green)
- **Navy:** #1a3c5c (brand-navy)
- **White:** #ffffff

## Development

### Commands
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Local Development
The app uses localStorage for data persistence in the MVP. All data (quotes, customers, organizations, invoices, inventory) is stored in the browser.

### Deployment
- Hosted on Vercel
- Auto-deploys from `main` branch on GitHub
- Production URL: https://quotex-tablex.vercel.app

## Current Version
**v0.1.0-alpha** - Initial alpha release

## Roadmap
- [ ] Backend API integration
- [ ] User authentication
- [ ] Multi-user support
- [ ] Real inventory sync
- [ ] Email notifications
- [ ] Advanced reporting
- [ ] 3D table preview
