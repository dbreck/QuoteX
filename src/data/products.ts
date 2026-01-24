import type { BaseSeries, FinishColor, TopOption, MaterialOption, EdgeOption, Accessory, HeightOption } from '@/types';

export const baseSeries: BaseSeries[] = [
  {
    id: 'ultra',
    name: 'Ultra',
    description: 'Sleek L-shaped tubular steel base with minimalist aesthetic',
    basePrice: 425,
    supportsFolding: false,
    supportsFlipTop: false,
    supportsNesting: false,
    supportsChrome: false,
    heightOptions: ['standard-29', 'counter-balance', 'pneumatic'],
    image: '/images/bases/ultra.svg'
  },
  {
    id: 'foundation',
    name: 'Foundation',
    description: 'Versatile 4-prong tubular base, flexible and affordable',
    basePrice: 385,
    supportsFolding: true,
    supportsFlipTop: true,
    supportsNesting: true,
    supportsChrome: true,
    heightOptions: ['standard-29', 'counter-balance', 'short-balance', 'pneumatic', 'electric', 'ratchet', 'crank'],
    image: '/images/bases/foundation.svg'
  },
  {
    id: 'fundamental',
    name: 'Fundamental',
    description: 'Classic X-base design with exceptional stability',
    basePrice: 395,
    supportsFolding: true,
    supportsFlipTop: true,
    supportsNesting: true,
    supportsChrome: true,
    heightOptions: ['standard-29', 'counter-balance', 'pneumatic', 'electric'],
    image: '/images/bases/fundamental.svg'
  },
  {
    id: 'trig',
    name: 'Trig',
    description: 'Modern triangular base with battery-electric option',
    basePrice: 445,
    supportsFolding: false,
    supportsFlipTop: false,
    supportsNesting: false,
    supportsChrome: false,
    heightOptions: ['standard-29', 'battery-electric', 'pneumatic'],
    image: '/images/bases/trig.svg'
  },
  {
    id: 'stretch',
    name: 'Stretch',
    description: 'Extended 4-prong base for larger surfaces',
    basePrice: 465,
    supportsFolding: true,
    supportsFlipTop: true,
    supportsNesting: true,
    supportsChrome: true,
    heightOptions: ['standard-29', 'counter-balance', 'pneumatic', 'electric'],
    image: '/images/bases/stretch.svg'
  },
  {
    id: 'elite',
    name: 'Elite',
    description: 'Premium 4-prong base with refined details',
    basePrice: 525,
    supportsFolding: true,
    supportsFlipTop: true,
    supportsNesting: false,
    supportsChrome: false,
    heightOptions: ['standard-29', 'counter-balance', 'pneumatic'],
    image: '/images/bases/elite.svg'
  },
  {
    id: 'revel',
    name: 'Revel',
    description: 'Elegant 3-prong base with curved arms',
    basePrice: 485,
    supportsFolding: false,
    supportsFlipTop: true,
    supportsNesting: false,
    supportsChrome: false,
    heightOptions: ['standard-29', 'pneumatic'],
    image: '/images/bases/revel.svg'
  },
  {
    id: 'app',
    name: 'App',
    description: 'Compact disc base ideal for small spaces',
    basePrice: 295,
    supportsFolding: false,
    supportsFlipTop: false,
    supportsNesting: false,
    supportsChrome: false,
    heightOptions: ['standard-29'],
    image: '/images/bases/app.svg'
  },
  {
    id: 'element',
    name: 'Element',
    description: 'Modern 4-arm base with tapered ends',
    basePrice: 455,
    supportsFolding: false,
    supportsFlipTop: false,
    supportsNesting: false,
    supportsChrome: false,
    heightOptions: ['standard-29', 'counter-balance', 'pneumatic'],
    image: '/images/bases/element.svg'
  },
  {
    id: 'justice',
    name: 'Justice',
    description: 'Heavy-duty T-base for industrial applications',
    basePrice: 545,
    supportsFolding: false,
    supportsFlipTop: false,
    supportsNesting: false,
    supportsChrome: false,
    heightOptions: ['standard-29', 'crank'],
    image: '/images/bases/justice.svg'
  },
  {
    id: 'artisan',
    name: 'Artisan',
    description: 'Open-frame cube base with industrial character',
    basePrice: 625,
    supportsFolding: false,
    supportsFlipTop: false,
    supportsNesting: false,
    supportsChrome: false,
    heightOptions: ['standard-29'],
    image: '/images/bases/artisan.svg'
  },
  {
    id: 'primary-disc',
    name: 'Primary Disc',
    description: 'Classic round disc base with column',
    basePrice: 325,
    supportsFolding: false,
    supportsFlipTop: false,
    supportsNesting: false,
    supportsChrome: true,
    heightOptions: ['standard-29', 'counter-balance'],
    image: '/images/bases/primary-disc.svg'
  },
  {
    id: 'primary-column',
    name: 'Primary Column',
    description: 'Clean column base with minimal footprint',
    basePrice: 345,
    supportsFolding: false,
    supportsFlipTop: false,
    supportsNesting: false,
    supportsChrome: true,
    heightOptions: ['standard-29', 'counter-balance'],
    image: '/images/bases/primary-column.svg'
  },
  {
    id: 'puddle',
    name: 'Puddle',
    description: 'Organic disc base with flowing edges',
    basePrice: 365,
    supportsFolding: false,
    supportsFlipTop: false,
    supportsNesting: false,
    supportsChrome: true,
    heightOptions: ['standard-29'],
    image: '/images/bases/puddle.svg'
  },
  {
    id: 'exclaim',
    name: 'Exclaim',
    description: 'Dramatic X-shaped base statement piece',
    basePrice: 575,
    supportsFolding: false,
    supportsFlipTop: false,
    supportsNesting: false,
    supportsChrome: true,
    heightOptions: ['standard-29'],
    image: '/images/bases/exclaim.svg'
  },
  {
    id: 'vertigo',
    name: 'VertiGO',
    description: 'Height-adjustable base with pneumatic lift',
    basePrice: 785,
    supportsFolding: false,
    supportsFlipTop: false,
    supportsNesting: false,
    supportsChrome: false,
    heightOptions: ['pneumatic', 'electric'],
    image: '/images/bases/vertigo.svg'
  },
  {
    id: 'surge',
    name: 'Surge',
    description: 'Electric height-adjustable with programmable presets',
    basePrice: 895,
    supportsFolding: false,
    supportsFlipTop: false,
    supportsNesting: false,
    supportsChrome: false,
    heightOptions: ['electric'],
    image: '/images/bases/surge.svg'
  }
];

export const heightOptions: { id: HeightOption; name: string; priceAdder: number }[] = [
  { id: 'standard-29', name: 'Standard Height (29")', priceAdder: 0 },
  { id: 'counter-balance', name: 'Counter-Balance (Desk to Standing)', priceAdder: 285 },
  { id: 'short-balance', name: 'Short-Balance (Occasional to Desk)', priceAdder: 245 },
  { id: 'pneumatic', name: 'Pneumatic (Desk to Standing)', priceAdder: 325 },
  { id: 'electric', name: 'Electric (Programmable Keypad)', priceAdder: 485 },
  { id: 'battery-electric', name: 'Battery Electric', priceAdder: 545 },
  { id: 'ratchet', name: 'Ratchet (Desk to Counter)', priceAdder: 185 },
  { id: 'crank', name: 'Crank (Desk to Bar)', priceAdder: 225 }
];

export const finishColors: FinishColor[] = [
  // Neutrals
  { id: 'linen', name: 'Linen', hex: '#F5F5DC', category: 'neutral' },
  { id: 'arctic', name: 'Arctic', hex: '#F8F8FF', category: 'neutral' },
  { id: 'dolphin', name: 'Dolphin', hex: '#8B8B8B', category: 'neutral' },
  { id: 'cannon', name: 'Cannon', hex: '#4A4A4A', category: 'neutral' },
  { id: 'flint', name: 'Flint', hex: '#696969', category: 'neutral' },
  { id: 'phantom', name: 'Phantom', hex: '#2F2F2F', category: 'neutral' },
  { id: 'black', name: 'Black', hex: '#1A1A1A', category: 'neutral' },
  { id: 'structured-black', name: 'Structured Black', hex: '#0D0D0D', category: 'neutral' },
  { id: 'jet', name: 'Jet', hex: '#343434', category: 'neutral' },
  { id: 'cinder', name: 'Cinder', hex: '#3D3D3D', category: 'neutral' },

  // Metallics
  { id: 'glitz', name: 'Glitz', hex: '#C0C0C0', category: 'metallic' },
  { id: 'satin-silver', name: 'Satin Silver', hex: '#B8B8B8', category: 'metallic' },
  { id: 'silver-frost', name: 'Silver Frost', hex: '#D3D3D3', category: 'metallic' },
  { id: 'structured-slate', name: 'Structured Slate', hex: '#708090', category: 'metallic' },
  { id: 'pearl', name: 'Pearl', hex: '#FDEEF4', category: 'metallic' },
  { id: 'nickel', name: 'Nickel', hex: '#A9A9A9', category: 'metallic' },
  { id: 'pewter', name: 'Pewter', hex: '#96A8A1', category: 'metallic' },
  { id: 'bronze', name: 'Bronze', hex: '#8B7355', category: 'metallic' },

  // Warm
  { id: 'creme', name: 'Crème', hex: '#FFFDD0', category: 'warm' },
  { id: 'sand', name: 'Sand', hex: '#C2B280', category: 'warm' },
  { id: 'storm', name: 'Storm', hex: '#7A7A52', category: 'warm' },
  { id: 'fawn', name: 'Fawn', hex: '#E5AA70', category: 'warm' },

  // Bold
  { id: 'poppy', name: 'Poppy', hex: '#E35335', category: 'bold' },
  { id: 'rosey', name: 'Rosey', hex: '#FF6B6B', category: 'bold' },
  { id: 'scarlet', name: 'Scarlet', hex: '#FF2400', category: 'bold' },

  // Cool
  { id: 'kiwi', name: 'Kiwi', hex: '#8EE53F', category: 'cool' },
  { id: 'kale', name: 'Kale', hex: '#4A7023', category: 'cool' },
  { id: 'evergreen', name: 'Evergreen', hex: '#05472A', category: 'cool' },
  { id: 'horizon', name: 'Horizon', hex: '#4F9BDF', category: 'cool' },
  { id: 'lagoon', name: 'Lagoon', hex: '#00758F', category: 'cool' },
  { id: 'moonlight', name: 'Moonlight', hex: '#B0C4DE', category: 'cool' }
];

export const topShapes: TopOption[] = [
  { id: 'rectangle', name: 'Rectangle', icon: '▬', priceMultiplier: 1.0 },
  { id: 'square', name: 'Square', icon: '■', priceMultiplier: 1.0 },
  { id: 'round', name: 'Round', icon: '●', priceMultiplier: 1.15 },
  { id: 'boat-shaped', name: 'Boat-Shaped', icon: '⬬', priceMultiplier: 1.25 },
  { id: 'racetrack', name: 'Racetrack', icon: '⬭', priceMultiplier: 1.2 },
  { id: 'ellipse', name: 'Ellipse', icon: '⬯', priceMultiplier: 1.18 },
  { id: 'half-round', name: 'Half-Round', icon: '◗', priceMultiplier: 1.12 },
  { id: 'trapezoid', name: 'Trapezoid', icon: '⏢', priceMultiplier: 1.22 },
  { id: 'd-shaped', name: 'D-Shaped', icon: '◖', priceMultiplier: 1.15 },
  { id: 'squircle', name: 'Squircle', icon: '▢', priceMultiplier: 1.1 }
];

export const topMaterials: MaterialOption[] = [
  { id: 'hpl', name: 'High Pressure Laminate', description: '50+ patterns available', pricePerSqFt: 12 },
  { id: 'butcher-block', name: 'Butcher Block', description: 'Maple finish', pricePerSqFt: 28 },
  { id: 'solid-surface', name: 'Solid Surface', description: 'Premium seamless look', pricePerSqFt: 45 },
  { id: 'stainless-steel', name: 'Stainless Steel', description: 'Industrial durability', pricePerSqFt: 65 },
  { id: 'phenolic-epoxy', name: 'Phenolic Epoxy Resin', description: 'Chemical resistant', pricePerSqFt: 85 }
];

export const edgeOptions: EdgeOption[] = [
  { id: '3p-standard', name: '3mm Flat Edge - Standard Colors', pricePerLinearFt: 4 },
  { id: '3p-match', name: '3mm Flat Edge - Match to HPL', pricePerLinearFt: 6 },
  { id: '3p-reeded', name: '3mm Reeded Edge', pricePerLinearFt: 8 },
  { id: '3k-standard', name: '3mm Knife Edge - Standard Colors', pricePerLinearFt: 10 },
  { id: '3k-match', name: '3mm Knife Edge - Match to HPL', pricePerLinearFt: 12 },
  { id: '3w-wood', name: '3mm Wood Edge', pricePerLinearFt: 15 },
  { id: '2p-acrylic', name: '2mm 3D Acrylic Edge', pricePerLinearFt: 18 }
];

export const accessories: Accessory[] = [
  // Panels
  { id: 'panel-frosted-modesty', name: 'Frosted Acrylic Modesty Panel', category: 'panel', price: 145, description: 'Conceals legs while maintaining open feel' },
  { id: 'panel-frosted-privacy', name: 'Frosted Acrylic Privacy Panel', category: 'panel', price: 185, description: 'Full privacy screening' },
  { id: 'panel-laminate-modesty', name: 'Laminate Modesty Panel', category: 'panel', price: 125, description: 'Matches table top laminate' },
  { id: 'panel-laminate-privacy', name: 'Laminate Privacy Panel', category: 'panel', price: 165, description: 'Full laminate privacy screen' },
  { id: 'panel-metal-modesty', name: 'Metal Modesty Panel', category: 'panel', price: 195, description: 'Durable steel construction' },
  { id: 'panel-mesh-modesty', name: 'Mesh Modesty Panel', category: 'panel', price: 155, description: 'Ventilated design' },

  // Wire Management
  { id: 'wm-leg-cover', name: 'Snap-On Leg Cover (Round)', category: 'wire-management', price: 45, description: 'Conceals wiring in round columns' },
  { id: 'wm-magnetic-cover', name: 'Magnetic Leg Cover (Square)', category: 'wire-management', price: 55, description: 'Conceals wiring in square columns' },
  { id: 'wm-access-door', name: 'Access Door in Column', category: 'wire-management', price: 65, description: 'Easy wire access point' },
  { id: 'wm-cable-gripper', name: 'Cable Grippers', category: 'wire-management', price: 25, description: 'Organizes loose cables' },
  { id: 'wm-j-channel', name: 'J-Channel', category: 'wire-management', price: 35, description: 'Under-surface cable routing' },
  { id: 'wm-spine', name: 'Vertical Wire Management Spine', category: 'wire-management', price: 85, description: 'Floor to surface cable path' },

  // Casters
  { id: 'caster-15', name: '1.5" Locking Casters', category: 'caster', price: 65, description: 'Compact mobility' },
  { id: 'caster-2', name: '2" Locking Casters', category: 'caster', price: 75, description: 'Standard mobility (Set of 4)' },
  { id: 'caster-2-hd', name: '2" Heavy-Duty Locking Casters', category: 'caster', price: 95, description: 'For heavier loads' },
  { id: 'caster-3', name: '3" Locking Casters', category: 'caster', price: 115, description: 'Smooth rolling on carpet' },
  { id: 'caster-3-industrial', name: '3" Industrial Locking Casters', category: 'caster', price: 145, description: 'For Justice & Artisan series' },

  // Power
  { id: 'power-grommet-single', name: 'Single Power Grommet', category: 'power', price: 85, description: '1 outlet + 2 USB' },
  { id: 'power-grommet-dual', name: 'Dual Power Grommet', category: 'power', price: 125, description: '2 outlets + 4 USB' },
  { id: 'power-edge', name: 'Edge-Mount Power', category: 'power', price: 145, description: 'Side-accessible power' },
  { id: 'power-pop-up', name: 'Pop-Up Power Tower', category: 'power', price: 195, description: 'Retractable power module' },
  { id: 'power-daisy', name: 'Daisy Chain Power Kit', category: 'power', price: 75, description: 'Connect multiple tables' },

  // Other
  { id: 'ganging-quick', name: 'Quick Connect Ganging', category: 'other', price: 45, description: 'Link tables together' },
  { id: 'foot-ring', name: 'Foot Ring', category: 'other', price: 125, description: 'For counter/bar height tables' },
  { id: 'mini-drawer', name: 'Mini Drawer', category: 'other', price: 165, description: 'Under-surface storage' }
];

export const hplLaminates = [
  { id: 'hpl-white', name: 'Designer White', hex: '#FFFFFF' },
  { id: 'hpl-fog', name: 'Fog', hex: '#E8E8E8' },
  { id: 'hpl-grey', name: 'Folkstone Grey', hex: '#A0A0A0' },
  { id: 'hpl-graphite', name: 'Graphite', hex: '#4A4A4A' },
  { id: 'hpl-black', name: 'Black', hex: '#1A1A1A' },
  { id: 'hpl-maple', name: 'Natural Maple', hex: '#E8D4B8' },
  { id: 'hpl-oak', name: 'Montana Oak', hex: '#C4A67C' },
  { id: 'hpl-walnut', name: 'Columbian Walnut', hex: '#5D4037' },
  { id: 'hpl-cherry', name: 'Wild Cherry', hex: '#8B4513' },
  { id: 'hpl-mahogany', name: 'Figured Mahogany', hex: '#6B3E26' }
];

export function calculateTablePrice(config: Partial<import('@/types').TableConfiguration>): number {
  let price = 0;

  // Base price
  const base = baseSeries.find(b => b.id === config.baseSeries);
  if (base) price += base.basePrice;

  // Height adjustment
  const height = heightOptions.find(h => h.id === config.height);
  if (height) price += height.priceAdder;

  // Chrome upcharge
  if (config.isChrome) price += 150;

  // Feature upcharges
  if (config.folding) price += 125;
  if (config.flipTop) price += 145;
  if (config.nesting) price += 165;
  if (config.footRing) price += 125;

  // Top calculation
  if (config.topWidth && config.topDepth) {
    const sqFt = (config.topWidth * config.topDepth) / 144;
    const material = topMaterials.find(m => m.id === config.topMaterial);
    if (material) price += sqFt * material.pricePerSqFt;

    // Shape multiplier
    const shape = topShapes.find(s => s.id === config.topShape);
    if (shape) price *= shape.priceMultiplier;

    // Edge pricing
    const perimeter = 2 * (config.topWidth + config.topDepth) / 12;
    const edge = edgeOptions.find(e => e.id === config.edgeType);
    if (edge) price += perimeter * edge.pricePerLinearFt;
  }

  // Accessories
  if (config.accessories) {
    config.accessories.forEach(accId => {
      const acc = accessories.find(a => a.id === accId);
      if (acc) price += acc.price;
    });
  }

  return Math.round(price * 100) / 100;
}
