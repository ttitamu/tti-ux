/**
 * tuxTokensCatalog — structured inventory of TUX design tokens for tooling,
 * documentation search, and the Command Palette 2.0 (⌘K) Token Inspector.
 *
 * Source of truth: design/tokens.json + kit/react/tux-tokens.ts.
 */

export type TuxTokenCategory =
  | "brand"
  | "semantic"
  | "surface"
  | "text"
  | "status"
  | "ops"
  | "wash"
  | "radius"
  | "shadow"
  | "typography";

export interface TuxTokenEntry {
  /** Full CSS variable name, e.g. "--brand-primary" */
  name: string;
  /** Clean token identifier, e.g. "brand-primary" */
  cleanName: string;
  /** Concrete CSS value or hex in the default TTI theme */
  value: string;
  /** Semantic category */
  category: TuxTokenCategory;
  /** Role description or documentation context */
  description: string;
  /** Whether this token resolves to a visual color */
  isColor: boolean;
}

export const tuxTokensCatalog: TuxTokenEntry[] = [
  // -------------------------------------------------------------------------
  // 1. Institutional Brand Palette
  // -------------------------------------------------------------------------
  {
    name: "--tti-maroon",
    cleanName: "tti-maroon",
    value: "#5C0025",
    category: "brand",
    description: "Primary brand anchor. Sampled from TTI print collateral and institutional identity.",
    isColor: true,
  },
  {
    name: "--tti-maroon-deep",
    cleanName: "tti-maroon-deep",
    value: "#500000",
    category: "brand",
    description: "High-contrast maroon from 508-accessible guidelines. Used for strict AA/AAA contrast.",
    isColor: true,
  },
  {
    name: "--tti-gold",
    cleanName: "tti-gold",
    value: "#DDAC37",
    category: "brand",
    description: "Primary accent. Signature warm-ochre gold — not bright yellow.",
    isColor: true,
  },
  {
    name: "--tti-gold-deep",
    cleanName: "tti-gold-deep",
    value: "#DCAA37",
    category: "brand",
    description: "High-contrast gold variant meeting enhanced accessibility ratios.",
    isColor: true,
  },
  {
    name: "--tti-navy",
    cleanName: "tti-navy",
    value: "#15457E",
    category: "brand",
    description: "Secondary accent. Used in data visualizations, inline links, and infographics.",
    isColor: true,
  },
  {
    name: "--tti-teal",
    cleanName: "tti-teal",
    value: "#4A8892",
    category: "brand",
    description: "Tertiary category color for multi-series chart and corridor differentiation.",
    isColor: true,
  },
  {
    name: "--tti-sage",
    cleanName: "tti-sage",
    value: "#66814F",
    category: "brand",
    description: "Tertiary category color for environmental and transit metrics.",
    isColor: true,
  },
  {
    name: "--tti-charcoal",
    cleanName: "tti-charcoal",
    value: "#221F1F",
    category: "brand",
    description: "Institutional body copy. Softer than pure black to harmonize with print collateral.",
    isColor: true,
  },
  {
    name: "--spectrum-maroon",
    cleanName: "spectrum-maroon",
    value: "#701D35",
    category: "brand",
    description: "Institutional spectrum band 1 — Maroon (my.tti.tamu.edu).",
    isColor: true,
  },
  {
    name: "--spectrum-blue",
    cleanName: "spectrum-blue",
    value: "#566A8A",
    category: "brand",
    description: "Institutional spectrum band 2 — Slate Blue (my.tti.tamu.edu).",
    isColor: true,
  },
  {
    name: "--spectrum-teal",
    cleanName: "spectrum-teal",
    value: "#66999B",
    category: "brand",
    description: "Institutional spectrum band 3 — Slate Teal (my.tti.tamu.edu).",
    isColor: true,
  },
  {
    name: "--spectrum-green",
    cleanName: "spectrum-green",
    value: "#849974",
    category: "brand",
    description: "Institutional spectrum band 4 — Sage Green (my.tti.tamu.edu).",
    isColor: true,
  },
  {
    name: "--spectrum-gold",
    cleanName: "spectrum-gold",
    value: "#E5B350",
    category: "brand",
    description: "Institutional spectrum band 5 — Warm Ochre Gold (my.tti.tamu.edu).",
    isColor: true,
  },

  // -------------------------------------------------------------------------
  // 2. Semantic Actions & Core Fills
  // -------------------------------------------------------------------------
  {
    name: "--brand-primary",
    cleanName: "brand-primary",
    value: "#5C0025",
    category: "semantic",
    description: "Primary action button fill, brand headers, and landmark highlights.",
    isColor: true,
  },
  {
    name: "--brand-primary-deep",
    cleanName: "brand-primary-deep",
    value: "#500000",
    category: "semantic",
    description: "High-contrast primary brand action fill.",
    isColor: true,
  },
  {
    name: "--brand-accent",
    cleanName: "brand-accent",
    value: "#DDAC37",
    category: "semantic",
    description: "Decorative gold bar accents, warning callouts, and secondary indicators.",
    isColor: true,
  },
  {
    name: "--brand-accent-deep",
    cleanName: "brand-accent-deep",
    value: "#DCAA37",
    category: "semantic",
    description: "High-contrast accent fill.",
    isColor: true,
  },
  {
    name: "--brand-secondary",
    cleanName: "brand-secondary",
    value: "#15457E",
    category: "semantic",
    description: "Secondary actions, badges, and inline hyperlinks.",
    isColor: true,
  },
  {
    name: "--brand-fill",
    cleanName: "brand-fill",
    value: "#5C0025",
    category: "semantic",
    description: "Solid institutional hero background fill.",
    isColor: true,
  },

  // -------------------------------------------------------------------------
  // 3. Surfaces & Borders
  // -------------------------------------------------------------------------
  {
    name: "--surface-page",
    cleanName: "surface-page",
    value: "#FFFFFF",
    category: "surface",
    description: "Default canvas and root page background.",
    isColor: true,
  },
  {
    name: "--surface-raised",
    cleanName: "surface-raised",
    value: "#FFFFFF",
    category: "surface",
    description: "Elevated surfaces: cards, modals, dropdown menus, and sticky headers.",
    isColor: true,
  },
  {
    name: "--surface-sunken",
    cleanName: "surface-sunken",
    value: "#F5F5F5",
    category: "surface",
    description: "Sunken surfaces: code blocks, footer containers, and inset wells.",
    isColor: true,
  },
  {
    name: "--surface-border",
    cleanName: "surface-border",
    value: "#E7E6E6",
    category: "surface",
    description: "Structural borders, card outlines, and component dividers.",
    isColor: true,
  },
  {
    name: "--surface-border-subtle",
    cleanName: "surface-border-subtle",
    value: "#EFEEED",
    category: "surface",
    description: "Hairline table borders and secondary divider rules.",
    isColor: true,
  },
  {
    name: "--surface-eggshell",
    cleanName: "surface-eggshell",
    value: "#F9F9F7",
    category: "surface",
    description: "Warm eggshell editorial wash sampled from my.tti.tamu.edu intranet.",
    isColor: true,
  },
  {
    name: "--surface-cool-gray",
    cleanName: "surface-cool-gray",
    value: "#E8E8E8",
    category: "surface",
    description: "Cool-gray architectural hero canvas sampled from tti.tamu.edu centers/directory.",
    isColor: true,
  },

  // -------------------------------------------------------------------------
  // 4. Text & Typography Colors
  // -------------------------------------------------------------------------
  {
    name: "--text-primary",
    cleanName: "text-primary",
    value: "#221F1F",
    category: "text",
    description: "High-emphasis body copy, headings, and active labels.",
    isColor: true,
  },
  {
    name: "--text-secondary",
    cleanName: "text-secondary",
    value: "#424242",
    category: "text",
    description: "Medium-emphasis text: descriptions, form hints, and table headers.",
    isColor: true,
  },
  {
    name: "--text-muted",
    cleanName: "text-muted",
    value: "#525252",
    category: "text",
    description: "Low-emphasis text: timestamps, footnotes, and metadata tags.",
    isColor: true,
  },
  {
    name: "--text-brand",
    cleanName: "text-brand",
    value: "#5C0025",
    category: "text",
    description: "Maroon branded text accents and active navigation items.",
    isColor: true,
  },
  {
    name: "--text-inverse",
    cleanName: "text-inverse",
    value: "#FFFFFF",
    category: "text",
    description: "High-contrast text on dark fills, buttons, and hero banners.",
    isColor: true,
  },
  {
    name: "--text-on-brand",
    cleanName: "text-on-brand",
    value: "#FFFFFF",
    category: "text",
    description: "Text explicitly placed on maroon brand backgrounds.",
    isColor: true,
  },
  {
    name: "--text-charcoal",
    cleanName: "text-charcoal",
    value: "#232323",
    category: "text",
    description: "High-contrast editorial charcoal text from Comm design language.",
    isColor: true,
  },
  {
    name: "--text-dark",
    cleanName: "text-dark",
    value: "#040404",
    category: "text",
    description: "Near-black primary heading text from public redesign.",
    isColor: true,
  },

  // -------------------------------------------------------------------------
  // 5. Status & Editorial Feedback
  // -------------------------------------------------------------------------
  {
    name: "--color-success",
    cleanName: "color-success",
    value: "#3D5328",
    category: "status",
    description: "Success states, completed workflows, and positive verification.",
    isColor: true,
  },
  {
    name: "--color-warning",
    cleanName: "color-warning",
    value: "#DDAC37",
    category: "status",
    description: "Advisory notices, cautions, and non-blocking warnings.",
    isColor: true,
  },
  {
    name: "--color-danger",
    cleanName: "color-danger",
    value: "#5C0025",
    category: "status",
    description: "Brand-aligned destructive actions and danger alerts.",
    isColor: true,
  },
  {
    name: "--color-error",
    cleanName: "color-error",
    value: "#A02828",
    category: "status",
    description: "Validation errors, failed requests, and critical alerts.",
    isColor: true,
  },
  {
    name: "--color-info",
    cleanName: "color-info",
    value: "#1F5D66",
    category: "status",
    description: "Informational callouts, telemetry tips, and system guidance.",
    isColor: true,
  },

  // -------------------------------------------------------------------------
  // 6. Operational Telemetry Ramp (ADR-0013 / ADR-0014)
  // -------------------------------------------------------------------------
  {
    name: "--status-ok",
    cleanName: "status-ok",
    value: "#258818",
    category: "ops",
    description: "Operational status: Normal / Nominal operation.",
    isColor: true,
  },
  {
    name: "--status-ok-fill",
    cleanName: "status-ok-fill",
    value: "#93F387",
    category: "ops",
    description: "Operational telemetry pill fill: Normal status.",
    isColor: true,
  },
  {
    name: "--status-warning",
    cleanName: "status-warning",
    value: "#7A7A00",
    category: "ops",
    description: "Operational status: Warning / Slowed flow or moderate disruption.",
    isColor: true,
  },
  {
    name: "--status-warning-fill",
    cleanName: "status-warning-fill",
    value: "#ECEE55",
    category: "ops",
    description: "Operational telemetry pill fill: Warning status.",
    isColor: true,
  },
  {
    name: "--status-critical",
    cleanName: "status-critical",
    value: "#A02828",
    category: "ops",
    description: "Operational status: Critical incident / Lane blockage / Sensor failure.",
    isColor: true,
  },
  {
    name: "--status-critical-fill",
    cleanName: "status-critical-fill",
    value: "#FF544D",
    category: "ops",
    description: "Operational telemetry pill fill: Critical status.",
    isColor: true,
  },
  {
    name: "--status-maintenance",
    cleanName: "status-maintenance",
    value: "#0566C7",
    category: "ops",
    description: "Operational status: Scheduled maintenance / Planned construction.",
    isColor: true,
  },
  {
    name: "--status-maintenance-fill",
    cleanName: "status-maintenance-fill",
    value: "#85BAFF",
    category: "ops",
    description: "Operational telemetry pill fill: Maintenance status.",
    isColor: true,
  },
  {
    name: "--status-unknown",
    cleanName: "status-unknown",
    value: "#BC5B00",
    category: "ops",
    description: "Operational status: Degraded / Stale telemetry / Offline edge device.",
    isColor: true,
  },
  {
    name: "--status-pending",
    cleanName: "status-pending",
    value: "#747474",
    category: "ops",
    description: "Operational status: Pending sensor sync / Standby node.",
    isColor: true,
  },

  // -------------------------------------------------------------------------
  // 7. Wash Ladder (Opacity Tints)
  // -------------------------------------------------------------------------
  {
    name: "--wash-brand-4",
    cleanName: "wash-brand-4",
    value: "color-mix(in srgb, var(--brand-primary) 4%, transparent)",
    category: "wash",
    description: "4% maroon wash for delicate canvas tinting and card backdrops.",
    isColor: true,
  },
  {
    name: "--wash-brand-6",
    cleanName: "wash-brand-6",
    value: "color-mix(in srgb, var(--brand-primary) 6%, transparent)",
    category: "wash",
    description: "6% maroon wash for table row hovers and list item active backdrops.",
    isColor: true,
  },
  {
    name: "--wash-brand-8",
    cleanName: "wash-brand-8",
    value: "color-mix(in srgb, var(--brand-primary) 8%, transparent)",
    category: "wash",
    description: "8% maroon wash for interactive hover states.",
    isColor: true,
  },
  {
    name: "--wash-brand-12",
    cleanName: "wash-brand-12",
    value: "color-mix(in srgb, var(--brand-primary) 12%, transparent)",
    category: "wash",
    description: "12% maroon wash for active pill backgrounds and tags.",
    isColor: true,
  },
  {
    name: "--wash-brand-18",
    cleanName: "wash-brand-18",
    value: "color-mix(in srgb, var(--brand-primary) 18%, transparent)",
    category: "wash",
    description: "18% maroon wash for focused outlines and selection pills.",
    isColor: true,
  },
  {
    name: "--wash-brand-22",
    cleanName: "wash-brand-22",
    value: "color-mix(in srgb, var(--brand-primary) 22%, transparent)",
    category: "wash",
    description: "22% maroon wash for pressed states and active border rings.",
    isColor: true,
  },
  {
    name: "--wash-brand-35",
    cleanName: "wash-brand-35",
    value: "color-mix(in srgb, var(--brand-primary) 35%, transparent)",
    category: "wash",
    description: "35% maroon wash for high-emphasis tinted badges and tabs.",
    isColor: true,
  },

  // -------------------------------------------------------------------------
  // 8. Radii, Shadows, Focus & Typography
  // -------------------------------------------------------------------------
  {
    name: "--radius-sm",
    cleanName: "radius-sm",
    value: "0.125rem",
    category: "radius",
    description: "Small border radius (2px) for tags, indicators, and chips.",
    isColor: false,
  },
  {
    name: "--radius-md",
    cleanName: "radius-md",
    value: "0.375rem",
    category: "radius",
    description: "Medium border radius (6px) for standard buttons, inputs, and cards.",
    isColor: false,
  },
  {
    name: "--radius-lg",
    cleanName: "radius-lg",
    value: "0.5rem",
    category: "radius",
    description: "Large border radius (8px) for containers and modal dialogs.",
    isColor: false,
  },
  {
    name: "--radius-xl",
    cleanName: "radius-xl",
    value: "0.75rem",
    category: "radius",
    description: "Extra large border radius (12px) for hero cards and feature slabs.",
    isColor: false,
  },
  {
    name: "--radius-full",
    cleanName: "radius-full",
    value: "9999px",
    category: "radius",
    description: "Full pill radius for badges, avatars, and status dots.",
    isColor: false,
  },
  {
    name: "--shadow-sm",
    cleanName: "shadow-sm",
    value: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    category: "shadow",
    description: "Subtle drop shadow for flat cards and dropdown items.",
    isColor: false,
  },
  {
    name: "--shadow-md",
    cleanName: "shadow-md",
    value: "0 4px 6px -1px rgba(0, 0, 0, 0.08)",
    category: "shadow",
    description: "Medium shadow for hovering cards and sticky headers.",
    isColor: false,
  },
  {
    name: "--shadow-lg",
    cleanName: "shadow-lg",
    value: "0 10px 15px -3px rgba(0, 0, 0, 0.08)",
    category: "shadow",
    description: "High elevation shadow for command palette, drawers, and dialogs.",
    isColor: false,
  },
  {
    name: "--shadow-focus",
    cleanName: "shadow-focus",
    value: "0 0 0 2px #F2E6C9, 0 0 0 4px #5C0025",
    category: "shadow",
    description: "Accessible double focus ring: gold inner + maroon outer.",
    isColor: false,
  },
  {
    name: "--font-sans",
    cleanName: "font-sans",
    value: '"Open Sans", "Helvetica Neue", Arial, sans-serif',
    category: "typography",
    description: "Primary UI and body typography family.",
    isColor: false,
  },
  {
    name: "--font-mono",
    cleanName: "font-mono",
    value: '"JetBrains Mono", "SFMono-Regular", Consolas, monospace',
    category: "typography",
    description: "Monospace code, telemetry values, and coordinate display.",
    isColor: false,
  },
  {
    name: "--font-display",
    cleanName: "font-display",
    value: '"Oswald", "Helvetica Neue Condensed", sans-serif',
    category: "typography",
    description: "Display typography for large metric hero banners and report covers.",
    isColor: false,
  },
];

/**
 * Filter design tokens by search query against name, category, or role description.
 */
export function searchTuxTokens(query: string, maxResults = 30): TuxTokenEntry[] {
  const q = query.trim().toLowerCase().replace(/^(--|\$|token:)/, "");
  if (!q) return tuxTokensCatalog.slice(0, maxResults);

  return tuxTokensCatalog
    .filter((token) => {
      const matchName = token.name.toLowerCase().includes(q);
      const matchClean = token.cleanName.toLowerCase().includes(q);
      const matchDesc = token.description.toLowerCase().includes(q);
      const matchVal = token.value.toLowerCase().includes(q);
      const matchCat = token.category.toLowerCase().includes(q);
      return matchName || matchClean || matchDesc || matchVal || matchCat;
    })
    .slice(0, maxResults);
}
