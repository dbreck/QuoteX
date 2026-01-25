# Changelog

All notable changes to QuoteX will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0-alpha] - 2025-01-25

### Added
- **Dashboard** with KPIs, revenue charts, quote pipeline, and recent activity
- **Visual Table Configurator** with step-by-step product builder
  - 17+ base series options (Ultra, Foundation, Trig, Elite, etc.)
  - Height options (Standard, Counter, Pneumatic, Electric, etc.)
  - 30+ powdercoat finishes with color swatches
  - Chrome option support
  - Top shapes (Rectangle, Round, Boat, Racetrack, etc.)
  - Top materials (HPL, Butcher Block, Solid Surface, etc.)
  - 50+ HPL laminate options
  - 36 edge options
  - Accessories (Modesty Panels, Wire Management, Casters, Power)
  - Real-time price calculation
- **Quote Management**
  - Create/edit/delete quotes
  - Multiple line items per quote
  - Quantity adjustments
  - Discount support (percentage and fixed)
  - Tax calculation
  - Status workflow (Draft → Sent → Accepted/Rejected)
  - PDF export with professional formatting
- **CRM System**
  - Organizations with pricing tiers (Premier 50%, Preferred 20%, Standard 10%)
  - Customer management (departments/divisions)
  - Contact management with primary contact designation
  - Quote history per customer
  - Demo data for Notre Dame, Library of Congress, Herman Miller, etc.
- **Invoice System**
  - Convert quotes to invoices
  - Invoice status tracking (Draft, Sent, Paid, Partial, Overdue)
  - Payment recording
  - Due date management
- **Inventory Management**
  - Component stock tracking
  - Low stock alerts
  - Reorder points
  - Cost tracking
- **Settings**
  - Company information configuration
  - Pricing tier management
  - Tax rate settings
  - Shipping configuration
- **UI/UX**
  - Collapsible sidebar navigation
  - TableX brand colors (Green #8dc63f, Navy #1a3c5c)
  - Responsive design
  - Professional aesthetic
  - Smooth animations and transitions

### Technical
- Next.js 16 with App Router
- TypeScript throughout
- Tailwind CSS v4
- Zustand state management with localStorage persistence
- Radix UI components
- Recharts for data visualization
- jsPDF + html2canvas for PDF generation

### Known Limitations
- Data stored in localStorage (browser-only, no sync)
- Single-user mode (no authentication)
- Mock inventory data
- No email notifications

---

## Future Releases

### Planned for v0.2.0
- Backend API integration
- User authentication
- Database persistence

### Planned for v0.3.0
- Multi-user support
- Role-based permissions
- Audit logging

### Planned for v1.0.0
- Production-ready release
- Full TableX product catalog integration
- Real-time inventory sync
- Email notifications
- Advanced reporting
