/**
 * GENERATED FILE — do not edit. Source: design/tokens.json & app/utils/tuxCatalog.ts via scripts/build-figma-kit.mjs (npm run build:figma).
 *
 * Zero-Subscription Local Figma Plugin for TUX (@tti/tti-ux).
 * Works 100% offline on the Figma Free Starter Plan:
 *   1. Syncs Paint Styles, Text Styles, and Effect Styles (no mode limits on Free tier).
 *   2. Syncs Figma Variables (auto-detects Free 1-mode limit and falls back to 3 themed collections).
 *   3. Generates Auto-Layout TUX Component Library frames directly onto the Figma canvas.
 *   4. Provides a built-in Code Connect Inspector for all 183 Tux* components without paid Dev Mode.
 */

const TUX_THEMES = {
  "tti": {
    "tti-maroon": "#5C0025",
    "tti-maroon-deep": "#500000",
    "tti-gold": "#DDAC37",
    "tti-gold-deep": "#DCAA37",
    "tti-navy": "#15457E",
    "tti-teal": "#4A8892",
    "tti-sage": "#66814F",
    "tti-charcoal": "#221F1F",
    "spectrum-maroon": "#701D35",
    "spectrum-blue": "#566A8A",
    "spectrum-teal": "#66999B",
    "spectrum-green": "#849974",
    "spectrum-gold": "#E5B350",
    "neutral-0": "#FFFFFF",
    "neutral-50": "#FAFAFA",
    "neutral-100": "#F5F5F5",
    "neutral-150": "#EFEEED",
    "neutral-200": "#E7E6E6",
    "neutral-250": "#DCDBD8",
    "neutral-300": "#D1D2D4",
    "neutral-400": "#A5A5A5",
    "neutral-450": "#9B9A96",
    "neutral-500": "#939597",
    "neutral-550": "#86847F",
    "neutral-600": "#7E7E7E",
    "neutral-650": "#6B6964",
    "neutral-700": "#5D5D5D",
    "neutral-750": "#535048",
    "neutral-800": "#4C4C4E",
    "neutral-850": "#3A3833",
    "neutral-900": "#221F1F",
    "neutral-1000": "#000000",
    "brand-primary": "#5C0025",
    "brand-primary-deep": "#500000",
    "brand-accent": "#DDAC37",
    "brand-accent-deep": "#DCAA37",
    "brand-secondary": "#15457E",
    "brand-fill": "#5C0025",
    "brand-accent-ink": "#2A0E15",
    "brand-accent-shade": "#A87B1F",
    "surface-page": "#FFFFFF",
    "surface-raised": "#FFFFFF",
    "surface-sunken": "#F5F5F5",
    "surface-border": "#E7E6E6",
    "surface-border-subtle": "#EFEEED",
    "surface-eggshell": "#F9F9F7",
    "surface-cool-gray": "#E8E8E8",
    "text-primary": "#221F1F",
    "text-secondary": "#424242",
    "text-muted": "#525252",
    "text-inverse": "#FFFFFF",
    "text-brand": "#5C0025",
    "text-on-brand": "#FFFFFF",
    "text-charcoal": "#232323",
    "text-dark": "#040404",
    "color-success": "#3D5328",
    "color-warning": "#DDAC37",
    "color-danger": "#5C0025",
    "color-error": "#A02828",
    "color-info": "#1F5D66",
    "status-ok": "#258818",
    "status-ok-fill": "#93F387",
    "status-ok-ink": "#221F1F",
    "status-warning": "#7A7A00",
    "status-warning-fill": "#ECEE55",
    "status-warning-ink": "#221F1F",
    "status-unknown": "#BC5B00",
    "status-unknown-fill": "#FF9B5A",
    "status-unknown-ink": "#221F1F",
    "status-critical": "#A02828",
    "status-critical-fill": "#FF544D",
    "status-critical-ink": "#221F1F",
    "status-maintenance": "#0566C7",
    "status-maintenance-fill": "#85BAFF",
    "status-maintenance-ink": "#221F1F",
    "status-pending": "#747474",
    "status-pending-fill": "#DEDEDE",
    "status-pending-ink": "#221F1F",
    "font-body": "\"Open Sans\", \"Helvetica Neue\", Arial, sans-serif",
    "font-display": "\"Oswald\", \"Helvetica Neue Condensed\", \"Impact\", \"Arial Narrow\", sans-serif",
    "font-bold": "\"Work Sans\", \"Helvetica Neue\", Arial, sans-serif",
    "font-elegant": "Georgia, \"Times New Roman\", Times, serif",
    "font-sans": "\"Open Sans\", \"Helvetica Neue\", Arial, sans-serif",
    "font-mono": "\"JetBrains Mono\", \"SFMono-Regular\", Consolas, \"Liberation Mono\", monospace",
    "tracking-tight": "-0.01em",
    "tracking-normal": "0",
    "tracking-wide": "0.05em",
    "tracking-wider": "0.10em",
    "shadow-sm": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    "shadow-md": "0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)",
    "shadow-lg": "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.03)",
    "focus-ring-outer": "#5C0025",
    "focus-ring-inner": "#F2E6C9",
    "shadow-focus": "0 0 0 2px #F2E6C9, 0 0 0 4px #5C0025",
    "elevation-flat": "none",
    "elevation-rest": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    "elevation-hover": "0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)",
    "elevation-overlay": "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.03)",
    "elevation-pinned": "0 4px 6px -2px rgba(0, 0, 0, 0.06)",
    "radius-none": "0",
    "radius-sm": "0.125rem",
    "radius-md": "0.375rem",
    "radius-lg": "0.5rem",
    "radius-xl": "0.75rem",
    "radius-full": "9999px",
    "motion-fast": "0.15s",
    "motion-base": "0.25s",
    "motion-slow": "0.35s",
    "ease-standard": "cubic-bezier(0.2, 0.55, 0.4, 0.9)",
    "ease-emphasis": "cubic-bezier(0.2, 0.8, 0.2, 1.2)",
    "ease-exit": "cubic-bezier(0.4, 0, 0.6, 1)",
    "ease-survey": "cubic-bezier(0.4, 0.0, 0.2, 1.0)",
    "ease-corridor": "cubic-bezier(0.2, 0.0, 0.0, 1.0)",
    "ease-arrival": "cubic-bezier(0.0, 0.0, 0.2, 1.0)",
    "space-0": "0",
    "space-2": "2px",
    "space-4": "4px",
    "space-8": "8px",
    "space-10": "10px",
    "space-12": "12px",
    "space-16": "16px",
    "space-24": "24px",
    "space-32": "32px",
    "space-40": "40px",
    "space-48": "48px",
    "space-64": "64px",
    "layout-content-max": "80rem",
    "layout-content-wide": "96rem",
    "layout-prose-max": "72ch",
    "rhythm-tight": "4px",
    "rhythm-snug": "8px",
    "rhythm-normal": "12px",
    "rhythm-loose": "16px",
    "rhythm-roomy": "24px",
    "wash-brand-4": "rgba(92, 0, 37, 0.04)",
    "wash-brand-6": "rgba(92, 0, 37, 0.06)",
    "wash-brand-8": "rgba(92, 0, 37, 0.08)",
    "wash-brand-12": "rgba(92, 0, 37, 0.12)",
    "wash-brand-18": "rgba(92, 0, 37, 0.18)",
    "wash-brand-22": "rgba(92, 0, 37, 0.22)",
    "wash-brand-35": "rgba(92, 0, 37, 0.35)",
    "color-maroon-50": "#fbf3f6",
    "color-maroon-100": "#f5e0e7",
    "color-maroon-200": "#eab5c3",
    "color-maroon-300": "#db859e",
    "color-maroon-400": "#b14a6c",
    "color-maroon-500": "#5c0025",
    "color-maroon-600": "#4d001f",
    "color-maroon-700": "#3d0018",
    "color-maroon-800": "#2e0012",
    "color-maroon-900": "#1f000c",
    "color-maroon-950": "#150008",
    "color-gold-50": "#fdf9ee",
    "color-gold-100": "#faf0d2",
    "color-gold-200": "#f4dfa1",
    "color-gold-300": "#ecca6f",
    "color-gold-400": "#e3ba4f",
    "color-gold-500": "#ddac37",
    "color-gold-600": "#b58a23",
    "color-gold-700": "#8a691b",
    "color-gold-800": "#604812",
    "color-gold-900": "#3f300b",
    "color-gold-950": "#271e07",
    "chart-1": "#5C0025",
    "chart-2": "#3F5A6F",
    "chart-3": "#C7973C",
    "chart-4": "#6B8E5A",
    "chart-5": "#8C5A3C",
    "chart-6": "#5C7080",
    "chart-7": "#A33A3A",
    "chart-8": "#3C5A87",
    "chart-9": "#6E5A7E",
    "chart-10": "#7E7350",
    "chart-cvd-1": "#0072B2",
    "chart-cvd-2": "#E69F00",
    "chart-cvd-3": "#009E73",
    "chart-cvd-4": "#F0E442",
    "chart-cvd-5": "#56B4E9",
    "chart-cvd-6": "#D55E00",
    "chart-cvd-7": "#CC79A7",
    "chart-cvd-8": "#222222",
    "map-seq-maroon-1": "#F1E4E0",
    "map-seq-maroon-2": "#DDB7AC",
    "map-seq-maroon-3": "#C58675",
    "map-seq-maroon-4": "#9E483A",
    "map-seq-maroon-5": "#500000",
    "map-seq-slate-1": "#E2E7EC",
    "map-seq-slate-2": "#B7C2CC",
    "map-seq-slate-3": "#7E94A4",
    "map-seq-slate-4": "#52677A",
    "map-seq-slate-5": "#283544",
    "map-outline": "#E7E6E6",
    "map-flow": "#5C0025"
  },
  "tti-dark": {
    "tti-maroon": "#5C0025",
    "tti-maroon-deep": "#500000",
    "tti-gold": "#DDAC37",
    "tti-gold-deep": "#DCAA37",
    "tti-navy": "#15457E",
    "tti-teal": "#4A8892",
    "tti-sage": "#66814F",
    "tti-charcoal": "#221F1F",
    "spectrum-maroon": "#94384F",
    "spectrum-blue": "#7186A8",
    "spectrum-teal": "#80B5B7",
    "spectrum-green": "#A0B790",
    "spectrum-gold": "#F0C46B",
    "neutral-0": "#FFFFFF",
    "neutral-50": "#FAFAFA",
    "neutral-100": "#F5F5F5",
    "neutral-150": "#EFEEED",
    "neutral-200": "#E7E6E6",
    "neutral-250": "#DCDBD8",
    "neutral-300": "#D1D2D4",
    "neutral-400": "#A5A5A5",
    "neutral-450": "#9B9A96",
    "neutral-500": "#939597",
    "neutral-550": "#86847F",
    "neutral-600": "#7E7E7E",
    "neutral-650": "#6B6964",
    "neutral-700": "#5D5D5D",
    "neutral-750": "#535048",
    "neutral-800": "#4C4C4E",
    "neutral-850": "#3A3833",
    "neutral-900": "#221F1F",
    "neutral-1000": "#000000",
    "brand-primary": "#6BB4C0",
    "brand-primary-deep": "#5B9CA8",
    "brand-accent": "#DDAC37",
    "brand-accent-deep": "#F0C362",
    "brand-secondary": "#8ab7e2",
    "brand-fill": "#5C0025",
    "brand-accent-ink": "#2A0E15",
    "brand-accent-shade": "#A87B1F",
    "surface-page": "#15100F",
    "surface-raised": "#221F1F",
    "surface-sunken": "#0B0908",
    "surface-border": "#3D3A3A",
    "surface-border-subtle": "#2E2B2A",
    "surface-eggshell": "#1C1817",
    "surface-cool-gray": "#262322",
    "text-primary": "#FAFAFA",
    "text-secondary": "#D1D2D4",
    "text-muted": "#B5B5B5",
    "text-inverse": "#221F1F",
    "text-brand": "#5B9CA8",
    "text-on-brand": "#FFFFFF",
    "text-charcoal": "#FAFAFA",
    "text-dark": "#FFFFFF",
    "color-success": "#ABCC8E",
    "color-warning": "#F5D98A",
    "color-danger": "#e795a8",
    "color-error": "#F59292",
    "color-info": "#9BD4E0",
    "status-ok": "#90F084",
    "status-ok-fill": "#86E67A",
    "status-ok-ink": "#221F1F",
    "status-warning": "#FDFF68",
    "status-warning-fill": "#E6E74C",
    "status-warning-ink": "#221F1F",
    "status-unknown": "#FC8731",
    "status-unknown-fill": "#FF8A37",
    "status-unknown-ink": "#221F1F",
    "status-critical": "#F14440",
    "status-critical-fill": "#FC4F49",
    "status-critical-ink": "#221F1F",
    "status-maintenance": "#53A0FF",
    "status-maintenance-fill": "#85BAFF",
    "status-maintenance-ink": "#221F1F",
    "status-pending": "#ABABAB",
    "status-pending-fill": "#D1D1D1",
    "status-pending-ink": "#221F1F",
    "font-body": "\"Open Sans\", \"Helvetica Neue\", Arial, sans-serif",
    "font-display": "\"Oswald\", \"Helvetica Neue Condensed\", \"Impact\", \"Arial Narrow\", sans-serif",
    "font-bold": "\"Work Sans\", \"Helvetica Neue\", Arial, sans-serif",
    "font-elegant": "Georgia, \"Times New Roman\", Times, serif",
    "font-sans": "\"Open Sans\", \"Helvetica Neue\", Arial, sans-serif",
    "font-mono": "\"JetBrains Mono\", \"SFMono-Regular\", Consolas, \"Liberation Mono\", monospace",
    "tracking-tight": "-0.01em",
    "tracking-normal": "0",
    "tracking-wide": "0.05em",
    "tracking-wider": "0.10em",
    "shadow-sm": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    "shadow-md": "0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)",
    "shadow-lg": "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.03)",
    "focus-ring-outer": "#6BB4C0",
    "focus-ring-inner": "#3D2E0F",
    "shadow-focus": "0 0 0 2px #3D2E0F, 0 0 0 4px #6BB4C0",
    "elevation-flat": "none",
    "elevation-rest": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    "elevation-hover": "0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)",
    "elevation-overlay": "0 10px 15px -3px rgba(0, 0, 0, 0.20), 0 4px 6px -2px rgba(0, 0, 0, 0.12)",
    "elevation-pinned": "0 4px 6px -2px rgba(0, 0, 0, 0.18)",
    "radius-none": "0",
    "radius-sm": "0.125rem",
    "radius-md": "0.375rem",
    "radius-lg": "0.5rem",
    "radius-xl": "0.75rem",
    "radius-full": "9999px",
    "motion-fast": "0.15s",
    "motion-base": "0.25s",
    "motion-slow": "0.35s",
    "ease-standard": "cubic-bezier(0.2, 0.55, 0.4, 0.9)",
    "ease-emphasis": "cubic-bezier(0.2, 0.8, 0.2, 1.2)",
    "ease-exit": "cubic-bezier(0.4, 0, 0.6, 1)",
    "ease-survey": "cubic-bezier(0.4, 0.0, 0.2, 1.0)",
    "ease-corridor": "cubic-bezier(0.2, 0.0, 0.0, 1.0)",
    "ease-arrival": "cubic-bezier(0.0, 0.0, 0.2, 1.0)",
    "space-0": "0",
    "space-2": "2px",
    "space-4": "4px",
    "space-8": "8px",
    "space-10": "10px",
    "space-12": "12px",
    "space-16": "16px",
    "space-24": "24px",
    "space-32": "32px",
    "space-40": "40px",
    "space-48": "48px",
    "space-64": "64px",
    "layout-content-max": "80rem",
    "layout-content-wide": "96rem",
    "layout-prose-max": "72ch",
    "rhythm-tight": "4px",
    "rhythm-snug": "8px",
    "rhythm-normal": "12px",
    "rhythm-loose": "16px",
    "rhythm-roomy": "24px",
    "wash-brand-4": "rgba(107, 180, 192, 0.04)",
    "wash-brand-6": "rgba(107, 180, 192, 0.06)",
    "wash-brand-8": "rgba(107, 180, 192, 0.08)",
    "wash-brand-12": "rgba(107, 180, 192, 0.12)",
    "wash-brand-18": "rgba(107, 180, 192, 0.18)",
    "wash-brand-22": "rgba(107, 180, 192, 0.22)",
    "wash-brand-35": "rgba(107, 180, 192, 0.35)",
    "color-maroon-50": "#fbf3f6",
    "color-maroon-100": "#f5e0e7",
    "color-maroon-200": "#eab5c3",
    "color-maroon-300": "#db859e",
    "color-maroon-400": "#6BB4C0",
    "color-maroon-500": "#5c0025",
    "color-maroon-600": "#4d001f",
    "color-maroon-700": "#3d0018",
    "color-maroon-800": "#2e0012",
    "color-maroon-900": "#1f000c",
    "color-maroon-950": "#150008",
    "color-gold-50": "#fdf9ee",
    "color-gold-100": "#faf0d2",
    "color-gold-200": "#f4dfa1",
    "color-gold-300": "#ecca6f",
    "color-gold-400": "#e3ba4f",
    "color-gold-500": "#ddac37",
    "color-gold-600": "#b58a23",
    "color-gold-700": "#8a691b",
    "color-gold-800": "#604812",
    "color-gold-900": "#3f300b",
    "color-gold-950": "#271e07",
    "chart-1": "#c47585",
    "chart-2": "#6B8DA3",
    "chart-3": "#E0BC60",
    "chart-4": "#93B57E",
    "chart-5": "#B58463",
    "chart-6": "#8AA0B2",
    "chart-7": "#D67272",
    "chart-8": "#6E8FBE",
    "chart-9": "#A08CB4",
    "chart-10": "#B0A578",
    "chart-cvd-1": "#56B4E9",
    "chart-cvd-2": "#F0B030",
    "chart-cvd-3": "#2AC098",
    "chart-cvd-4": "#F5EB68",
    "chart-cvd-5": "#7CD0F7",
    "chart-cvd-6": "#E87A28",
    "chart-cvd-7": "#DE91BD",
    "chart-cvd-8": "#E6E6E6",
    "map-seq-maroon-1": "#3D1110",
    "map-seq-maroon-2": "#702C28",
    "map-seq-maroon-3": "#A14A3D",
    "map-seq-maroon-4": "#C97058",
    "map-seq-maroon-5": "#E89B7E",
    "map-seq-slate-1": "#1A2129",
    "map-seq-slate-2": "#3F5A6F",
    "map-seq-slate-3": "#6F8294",
    "map-seq-slate-4": "#9CADBD",
    "map-seq-slate-5": "#C2D0DE",
    "map-outline": "rgba(255, 255, 255, 0.22)",
    "map-flow": "#E89B7E",
    "color-brand-primary": "#6BB4C0",
    "color-brand-primary-deep": "#5B9CA8",
    "color-brand-accent": "#DDAC37",
    "color-brand-accent-deep": "#F0C362",
    "color-brand-secondary": "#8ab7e2",
    "color-brand-fill": "#5C0025",
    "color-surface-page": "#15100F",
    "color-surface-raised": "#221F1F",
    "color-surface-sunken": "#0B0908",
    "color-surface-border": "#3D3A3A",
    "color-surface-border-subtle": "#2E2B2A",
    "color-surface-eggshell": "#1C1817",
    "color-surface-cool-gray": "#262322",
    "color-text-primary": "#FAFAFA",
    "color-text-secondary": "#D1D2D4",
    "color-text-muted": "#B5B5B5",
    "color-text-inverse": "#221F1F",
    "color-text-brand": "#5B9CA8",
    "color-text-on-brand": "#FFFFFF",
    "color-text-charcoal": "#FAFAFA",
    "color-text-dark": "#FFFFFF",
    "color-spectrum-maroon": "#94384F",
    "color-spectrum-blue": "#7186A8",
    "color-spectrum-teal": "#80B5B7",
    "color-spectrum-green": "#A0B790",
    "color-spectrum-gold": "#F0C46B"
  },
  "tti-hc": {
    "tti-maroon": "#5C0025",
    "tti-maroon-deep": "#500000",
    "tti-gold": "#DDAC37",
    "tti-gold-deep": "#DCAA37",
    "tti-navy": "#15457E",
    "tti-teal": "#4A8892",
    "tti-sage": "#66814F",
    "tti-charcoal": "#221F1F",
    "spectrum-maroon": "#500000",
    "spectrum-blue": "#3B4E6B",
    "spectrum-teal": "#476E70",
    "spectrum-green": "#576E4B",
    "spectrum-gold": "#C2912E",
    "neutral-0": "#FFFFFF",
    "neutral-50": "#FAFAFA",
    "neutral-100": "#F5F5F5",
    "neutral-150": "#EFEEED",
    "neutral-200": "#E7E6E6",
    "neutral-250": "#DCDBD8",
    "neutral-300": "#D1D2D4",
    "neutral-400": "#A5A5A5",
    "neutral-450": "#9B9A96",
    "neutral-500": "#939597",
    "neutral-550": "#86847F",
    "neutral-600": "#7E7E7E",
    "neutral-650": "#6B6964",
    "neutral-700": "#5D5D5D",
    "neutral-750": "#535048",
    "neutral-800": "#4C4C4E",
    "neutral-850": "#3A3833",
    "neutral-900": "#221F1F",
    "neutral-1000": "#000000",
    "brand-primary": "#500000",
    "brand-primary-deep": "#3A0000",
    "brand-accent": "#DCAA37",
    "brand-accent-deep": "#B88A21",
    "brand-secondary": "#000000",
    "brand-fill": "#500000",
    "brand-accent-ink": "#2A0E15",
    "brand-accent-shade": "#A87B1F",
    "surface-page": "#FFFFFF",
    "surface-raised": "#FFFFFF",
    "surface-sunken": "#F0F0F0",
    "surface-border": "#5D5D5D",
    "surface-border-subtle": "#5D5D5D",
    "surface-eggshell": "#FFFFFF",
    "surface-cool-gray": "#F0F0F0",
    "text-primary": "#000000",
    "text-secondary": "#221F1F",
    "text-muted": "#4D4D4D",
    "text-inverse": "#FFFFFF",
    "text-brand": "#500000",
    "text-on-brand": "#FFFFFF",
    "text-charcoal": "#000000",
    "text-dark": "#000000",
    "color-success": "#3D5328",
    "color-warning": "#DDAC37",
    "color-danger": "#500000",
    "color-error": "#A02828",
    "color-info": "#1F5D66",
    "status-ok": "#0E6800",
    "status-ok-fill": "#FFFFFF",
    "status-ok-ink": "#0E6800",
    "status-warning": "#5C5C00",
    "status-warning-fill": "#FFFFFF",
    "status-warning-ink": "#5C5C00",
    "status-unknown": "#8E4300",
    "status-unknown-fill": "#FFFFFF",
    "status-unknown-ink": "#8E4300",
    "status-critical": "#B20014",
    "status-critical-fill": "#FFFFFF",
    "status-critical-ink": "#B20014",
    "status-maintenance": "#0056AA",
    "status-maintenance-fill": "#FFFFFF",
    "status-maintenance-ink": "#0056AA",
    "status-pending": "#585858",
    "status-pending-fill": "#FFFFFF",
    "status-pending-ink": "#585858",
    "font-body": "\"Open Sans\", \"Helvetica Neue\", Arial, sans-serif",
    "font-display": "\"Oswald\", \"Helvetica Neue Condensed\", \"Impact\", \"Arial Narrow\", sans-serif",
    "font-bold": "\"Work Sans\", \"Helvetica Neue\", Arial, sans-serif",
    "font-elegant": "Georgia, \"Times New Roman\", Times, serif",
    "font-sans": "\"Open Sans\", \"Helvetica Neue\", Arial, sans-serif",
    "font-mono": "\"JetBrains Mono\", \"SFMono-Regular\", Consolas, \"Liberation Mono\", monospace",
    "tracking-tight": "-0.01em",
    "tracking-normal": "0",
    "tracking-wide": "0.05em",
    "tracking-wider": "0.10em",
    "shadow-sm": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    "shadow-md": "0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)",
    "shadow-lg": "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.03)",
    "focus-ring-outer": "#000000",
    "focus-ring-inner": "#FFFFFF",
    "shadow-focus": "0 0 0 2px #FFFFFF, 0 0 0 5px #000000",
    "elevation-flat": "none",
    "elevation-rest": "none",
    "elevation-hover": "none",
    "elevation-overlay": "0 0 0 2px #5D5D5D",
    "elevation-pinned": "0 0 0 1px #5D5D5D",
    "radius-none": "0",
    "radius-sm": "0.125rem",
    "radius-md": "0.375rem",
    "radius-lg": "0.5rem",
    "radius-xl": "0.75rem",
    "radius-full": "9999px",
    "motion-fast": "0.15s",
    "motion-base": "0.25s",
    "motion-slow": "0.35s",
    "ease-standard": "cubic-bezier(0.2, 0.55, 0.4, 0.9)",
    "ease-emphasis": "cubic-bezier(0.2, 0.8, 0.2, 1.2)",
    "ease-exit": "cubic-bezier(0.4, 0, 0.6, 1)",
    "ease-survey": "cubic-bezier(0.4, 0.0, 0.2, 1.0)",
    "ease-corridor": "cubic-bezier(0.2, 0.0, 0.0, 1.0)",
    "ease-arrival": "cubic-bezier(0.0, 0.0, 0.2, 1.0)",
    "space-0": "0",
    "space-2": "2px",
    "space-4": "4px",
    "space-8": "8px",
    "space-10": "10px",
    "space-12": "12px",
    "space-16": "16px",
    "space-24": "24px",
    "space-32": "32px",
    "space-40": "40px",
    "space-48": "48px",
    "space-64": "64px",
    "layout-content-max": "80rem",
    "layout-content-wide": "96rem",
    "layout-prose-max": "72ch",
    "rhythm-tight": "4px",
    "rhythm-snug": "8px",
    "rhythm-normal": "12px",
    "rhythm-loose": "16px",
    "rhythm-roomy": "24px",
    "wash-brand-4": "rgba(80, 0, 0, 0.04)",
    "wash-brand-6": "rgba(80, 0, 0, 0.06)",
    "wash-brand-8": "rgba(80, 0, 0, 0.08)",
    "wash-brand-12": "rgba(80, 0, 0, 0.12)",
    "wash-brand-18": "rgba(80, 0, 0, 0.18)",
    "wash-brand-22": "rgba(80, 0, 0, 0.22)",
    "wash-brand-35": "rgba(80, 0, 0, 0.35)",
    "color-maroon-50": "#fbf3f6",
    "color-maroon-100": "#f5e0e7",
    "color-maroon-200": "#eab5c3",
    "color-maroon-300": "#db859e",
    "color-maroon-400": "#500000",
    "color-maroon-500": "#500000",
    "color-maroon-600": "#4d001f",
    "color-maroon-700": "#3d0018",
    "color-maroon-800": "#2e0012",
    "color-maroon-900": "#1f000c",
    "color-maroon-950": "#150008",
    "color-gold-50": "#fdf9ee",
    "color-gold-100": "#faf0d2",
    "color-gold-200": "#f4dfa1",
    "color-gold-300": "#ecca6f",
    "color-gold-400": "#e3ba4f",
    "color-gold-500": "#ddac37",
    "color-gold-600": "#b58a23",
    "color-gold-700": "#8a691b",
    "color-gold-800": "#604812",
    "color-gold-900": "#3f300b",
    "color-gold-950": "#271e07",
    "chart-1": "#000000",
    "chart-2": "#500000",
    "chart-3": "#5D5D5D",
    "chart-4": "#8A6915",
    "chart-5": "#4A4A4A",
    "chart-6": "#1F5D66",
    "chart-7": "#6B0000",
    "chart-8": "#2A2A2A",
    "chart-9": "#6E5A7E",
    "chart-10": "#7E7350",
    "chart-cvd-1": "#005080",
    "chart-cvd-2": "#CC8000",
    "chart-cvd-3": "#007A55",
    "chart-cvd-4": "#8A6915",
    "chart-cvd-5": "#1F5D66",
    "chart-cvd-6": "#B34000",
    "chart-cvd-7": "#803366",
    "chart-cvd-8": "#000000",
    "map-seq-maroon-1": "#FFFFFF",
    "map-seq-maroon-2": "#C8C8C8",
    "map-seq-maroon-3": "#8A8A8A",
    "map-seq-maroon-4": "#4A4A4A",
    "map-seq-maroon-5": "#000000",
    "map-seq-slate-1": "#FFFFFF",
    "map-seq-slate-2": "#C8C8C8",
    "map-seq-slate-3": "#8A8A8A",
    "map-seq-slate-4": "#4A4A4A",
    "map-seq-slate-5": "#000000",
    "map-outline": "#000000",
    "map-flow": "#000000",
    "color-brand-primary": "#500000",
    "color-brand-primary-deep": "#3A0000",
    "color-brand-accent": "#DCAA37",
    "color-brand-accent-deep": "#B88A21",
    "color-brand-secondary": "#000000",
    "color-brand-fill": "#500000",
    "color-surface-page": "#FFFFFF",
    "color-surface-raised": "#FFFFFF",
    "color-surface-sunken": "#F0F0F0",
    "color-surface-border": "#5D5D5D",
    "color-surface-border-subtle": "#5D5D5D",
    "color-surface-eggshell": "#FFFFFF",
    "color-surface-cool-gray": "#F0F0F0",
    "color-text-primary": "#000000",
    "color-text-secondary": "#221F1F",
    "color-text-muted": "#4D4D4D",
    "color-text-inverse": "#FFFFFF",
    "color-text-brand": "#500000",
    "color-text-on-brand": "#FFFFFF",
    "color-text-charcoal": "#000000",
    "color-text-dark": "#000000",
    "color-spectrum-maroon": "#500000",
    "color-spectrum-blue": "#3B4E6B",
    "color-spectrum-teal": "#476E70",
    "color-spectrum-green": "#576E4B",
    "color-spectrum-gold": "#C2912E"
  }
};
const TUX_VARIABLES = [
  {
    "name": "tti/maroon",
    "cssToken": "--tti-maroon",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --tti-maroon",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--tti-maroon)",
      "ANDROID": "TuxTokens.Tti.TTI_MAROON",
      "iOS": "TuxTokens.Tti.ttiMaroon"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#5C0025",
        "rgba": {
          "r": 0.3608,
          "g": 0,
          "b": 0.1451,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#5C0025",
        "rgba": {
          "r": 0.3608,
          "g": 0,
          "b": 0.1451,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#5C0025",
        "rgba": {
          "r": 0.3608,
          "g": 0,
          "b": 0.1451,
          "a": 1
        }
      }
    }
  },
  {
    "name": "tti/maroon-deep",
    "cssToken": "--tti-maroon-deep",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --tti-maroon-deep",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--tti-maroon-deep)",
      "ANDROID": "TuxTokens.Tti.TTI_MAROON_DEEP",
      "iOS": "TuxTokens.Tti.ttiMaroonDeep"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#500000",
        "rgba": {
          "r": 0.3137,
          "g": 0,
          "b": 0,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#500000",
        "rgba": {
          "r": 0.3137,
          "g": 0,
          "b": 0,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#500000",
        "rgba": {
          "r": 0.3137,
          "g": 0,
          "b": 0,
          "a": 1
        }
      }
    }
  },
  {
    "name": "tti/gold",
    "cssToken": "--tti-gold",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --tti-gold",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--tti-gold)",
      "ANDROID": "TuxTokens.Tti.TTI_GOLD",
      "iOS": "TuxTokens.Tti.ttiGold"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#DDAC37",
        "rgba": {
          "r": 0.8667,
          "g": 0.6745,
          "b": 0.2157,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#DDAC37",
        "rgba": {
          "r": 0.8667,
          "g": 0.6745,
          "b": 0.2157,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#DDAC37",
        "rgba": {
          "r": 0.8667,
          "g": 0.6745,
          "b": 0.2157,
          "a": 1
        }
      }
    }
  },
  {
    "name": "tti/gold-deep",
    "cssToken": "--tti-gold-deep",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --tti-gold-deep",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--tti-gold-deep)",
      "ANDROID": "TuxTokens.Tti.TTI_GOLD_DEEP",
      "iOS": "TuxTokens.Tti.ttiGoldDeep"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#DCAA37",
        "rgba": {
          "r": 0.8627,
          "g": 0.6667,
          "b": 0.2157,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#DCAA37",
        "rgba": {
          "r": 0.8627,
          "g": 0.6667,
          "b": 0.2157,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#DCAA37",
        "rgba": {
          "r": 0.8627,
          "g": 0.6667,
          "b": 0.2157,
          "a": 1
        }
      }
    }
  },
  {
    "name": "tti/navy",
    "cssToken": "--tti-navy",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --tti-navy",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--tti-navy)",
      "ANDROID": "TuxTokens.Tti.TTI_NAVY",
      "iOS": "TuxTokens.Tti.ttiNavy"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#15457E",
        "rgba": {
          "r": 0.0824,
          "g": 0.2706,
          "b": 0.4941,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#15457E",
        "rgba": {
          "r": 0.0824,
          "g": 0.2706,
          "b": 0.4941,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#15457E",
        "rgba": {
          "r": 0.0824,
          "g": 0.2706,
          "b": 0.4941,
          "a": 1
        }
      }
    }
  },
  {
    "name": "tti/teal",
    "cssToken": "--tti-teal",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --tti-teal",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--tti-teal)",
      "ANDROID": "TuxTokens.Tti.TTI_TEAL",
      "iOS": "TuxTokens.Tti.ttiTeal"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#4A8892",
        "rgba": {
          "r": 0.2902,
          "g": 0.5333,
          "b": 0.5725,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#4A8892",
        "rgba": {
          "r": 0.2902,
          "g": 0.5333,
          "b": 0.5725,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#4A8892",
        "rgba": {
          "r": 0.2902,
          "g": 0.5333,
          "b": 0.5725,
          "a": 1
        }
      }
    }
  },
  {
    "name": "tti/sage",
    "cssToken": "--tti-sage",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --tti-sage",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--tti-sage)",
      "ANDROID": "TuxTokens.Tti.TTI_SAGE",
      "iOS": "TuxTokens.Tti.ttiSage"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#66814F",
        "rgba": {
          "r": 0.4,
          "g": 0.5059,
          "b": 0.3098,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#66814F",
        "rgba": {
          "r": 0.4,
          "g": 0.5059,
          "b": 0.3098,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#66814F",
        "rgba": {
          "r": 0.4,
          "g": 0.5059,
          "b": 0.3098,
          "a": 1
        }
      }
    }
  },
  {
    "name": "tti/charcoal",
    "cssToken": "--tti-charcoal",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --tti-charcoal",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--tti-charcoal)",
      "ANDROID": "TuxTokens.Tti.TTI_CHARCOAL",
      "iOS": "TuxTokens.Tti.ttiCharcoal"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#221F1F",
        "rgba": {
          "r": 0.1333,
          "g": 0.1216,
          "b": 0.1216,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#221F1F",
        "rgba": {
          "r": 0.1333,
          "g": 0.1216,
          "b": 0.1216,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#221F1F",
        "rgba": {
          "r": 0.1333,
          "g": 0.1216,
          "b": 0.1216,
          "a": 1
        }
      }
    }
  },
  {
    "name": "spectrum/maroon",
    "cssToken": "--spectrum-maroon",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --spectrum-maroon",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--spectrum-maroon)",
      "ANDROID": "TuxTokens.Tti.SPECTRUM_MAROON",
      "iOS": "TuxTokens.Tti.spectrumMaroon"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#701D35",
        "rgba": {
          "r": 0.4392,
          "g": 0.1137,
          "b": 0.2078,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#94384F",
        "rgba": {
          "r": 0.5804,
          "g": 0.2196,
          "b": 0.3098,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#500000",
        "rgba": {
          "r": 0.3137,
          "g": 0,
          "b": 0,
          "a": 1
        }
      }
    }
  },
  {
    "name": "spectrum/blue",
    "cssToken": "--spectrum-blue",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --spectrum-blue",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--spectrum-blue)",
      "ANDROID": "TuxTokens.Tti.SPECTRUM_BLUE",
      "iOS": "TuxTokens.Tti.spectrumBlue"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#566A8A",
        "rgba": {
          "r": 0.3373,
          "g": 0.4157,
          "b": 0.5412,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#7186A8",
        "rgba": {
          "r": 0.4431,
          "g": 0.5255,
          "b": 0.6588,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#3B4E6B",
        "rgba": {
          "r": 0.2314,
          "g": 0.3059,
          "b": 0.4196,
          "a": 1
        }
      }
    }
  },
  {
    "name": "spectrum/teal",
    "cssToken": "--spectrum-teal",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --spectrum-teal",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--spectrum-teal)",
      "ANDROID": "TuxTokens.Tti.SPECTRUM_TEAL",
      "iOS": "TuxTokens.Tti.spectrumTeal"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#66999B",
        "rgba": {
          "r": 0.4,
          "g": 0.6,
          "b": 0.6078,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#80B5B7",
        "rgba": {
          "r": 0.502,
          "g": 0.7098,
          "b": 0.7176,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#476E70",
        "rgba": {
          "r": 0.2784,
          "g": 0.4314,
          "b": 0.4392,
          "a": 1
        }
      }
    }
  },
  {
    "name": "spectrum/green",
    "cssToken": "--spectrum-green",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --spectrum-green",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--spectrum-green)",
      "ANDROID": "TuxTokens.Tti.SPECTRUM_GREEN",
      "iOS": "TuxTokens.Tti.spectrumGreen"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#849974",
        "rgba": {
          "r": 0.5176,
          "g": 0.6,
          "b": 0.4549,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#A0B790",
        "rgba": {
          "r": 0.6275,
          "g": 0.7176,
          "b": 0.5647,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#576E4B",
        "rgba": {
          "r": 0.3412,
          "g": 0.4314,
          "b": 0.2941,
          "a": 1
        }
      }
    }
  },
  {
    "name": "spectrum/gold",
    "cssToken": "--spectrum-gold",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --spectrum-gold",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--spectrum-gold)",
      "ANDROID": "TuxTokens.Tti.SPECTRUM_GOLD",
      "iOS": "TuxTokens.Tti.spectrumGold"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#E5B350",
        "rgba": {
          "r": 0.898,
          "g": 0.702,
          "b": 0.3137,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#F0C46B",
        "rgba": {
          "r": 0.9412,
          "g": 0.7686,
          "b": 0.4196,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#C2912E",
        "rgba": {
          "r": 0.7608,
          "g": 0.5686,
          "b": 0.1804,
          "a": 1
        }
      }
    }
  },
  {
    "name": "neutral/0",
    "cssToken": "--neutral-0",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --neutral-0",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--neutral-0)",
      "ANDROID": "TuxTokens.Tti.NEUTRAL_0",
      "iOS": "TuxTokens.Tti.neutral0"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#FFFFFF",
        "rgba": {
          "r": 1,
          "g": 1,
          "b": 1,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#FFFFFF",
        "rgba": {
          "r": 1,
          "g": 1,
          "b": 1,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#FFFFFF",
        "rgba": {
          "r": 1,
          "g": 1,
          "b": 1,
          "a": 1
        }
      }
    }
  },
  {
    "name": "neutral/50",
    "cssToken": "--neutral-50",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --neutral-50",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--neutral-50)",
      "ANDROID": "TuxTokens.Tti.NEUTRAL_50",
      "iOS": "TuxTokens.Tti.neutral50"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#FAFAFA",
        "rgba": {
          "r": 0.9804,
          "g": 0.9804,
          "b": 0.9804,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#FAFAFA",
        "rgba": {
          "r": 0.9804,
          "g": 0.9804,
          "b": 0.9804,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#FAFAFA",
        "rgba": {
          "r": 0.9804,
          "g": 0.9804,
          "b": 0.9804,
          "a": 1
        }
      }
    }
  },
  {
    "name": "neutral/100",
    "cssToken": "--neutral-100",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --neutral-100",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--neutral-100)",
      "ANDROID": "TuxTokens.Tti.NEUTRAL_100",
      "iOS": "TuxTokens.Tti.neutral100"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#F5F5F5",
        "rgba": {
          "r": 0.9608,
          "g": 0.9608,
          "b": 0.9608,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#F5F5F5",
        "rgba": {
          "r": 0.9608,
          "g": 0.9608,
          "b": 0.9608,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#F5F5F5",
        "rgba": {
          "r": 0.9608,
          "g": 0.9608,
          "b": 0.9608,
          "a": 1
        }
      }
    }
  },
  {
    "name": "neutral/150",
    "cssToken": "--neutral-150",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --neutral-150",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--neutral-150)",
      "ANDROID": "TuxTokens.Tti.NEUTRAL_150",
      "iOS": "TuxTokens.Tti.neutral150"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#EFEEED",
        "rgba": {
          "r": 0.9373,
          "g": 0.9333,
          "b": 0.9294,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#EFEEED",
        "rgba": {
          "r": 0.9373,
          "g": 0.9333,
          "b": 0.9294,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#EFEEED",
        "rgba": {
          "r": 0.9373,
          "g": 0.9333,
          "b": 0.9294,
          "a": 1
        }
      }
    }
  },
  {
    "name": "neutral/200",
    "cssToken": "--neutral-200",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --neutral-200",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--neutral-200)",
      "ANDROID": "TuxTokens.Tti.NEUTRAL_200",
      "iOS": "TuxTokens.Tti.neutral200"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#E7E6E6",
        "rgba": {
          "r": 0.9059,
          "g": 0.902,
          "b": 0.902,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#E7E6E6",
        "rgba": {
          "r": 0.9059,
          "g": 0.902,
          "b": 0.902,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#E7E6E6",
        "rgba": {
          "r": 0.9059,
          "g": 0.902,
          "b": 0.902,
          "a": 1
        }
      }
    }
  },
  {
    "name": "neutral/250",
    "cssToken": "--neutral-250",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --neutral-250",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--neutral-250)",
      "ANDROID": "TuxTokens.Tti.NEUTRAL_250",
      "iOS": "TuxTokens.Tti.neutral250"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#DCDBD8",
        "rgba": {
          "r": 0.8627,
          "g": 0.8588,
          "b": 0.8471,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#DCDBD8",
        "rgba": {
          "r": 0.8627,
          "g": 0.8588,
          "b": 0.8471,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#DCDBD8",
        "rgba": {
          "r": 0.8627,
          "g": 0.8588,
          "b": 0.8471,
          "a": 1
        }
      }
    }
  },
  {
    "name": "neutral/300",
    "cssToken": "--neutral-300",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --neutral-300",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--neutral-300)",
      "ANDROID": "TuxTokens.Tti.NEUTRAL_300",
      "iOS": "TuxTokens.Tti.neutral300"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#D1D2D4",
        "rgba": {
          "r": 0.8196,
          "g": 0.8235,
          "b": 0.8314,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#D1D2D4",
        "rgba": {
          "r": 0.8196,
          "g": 0.8235,
          "b": 0.8314,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#D1D2D4",
        "rgba": {
          "r": 0.8196,
          "g": 0.8235,
          "b": 0.8314,
          "a": 1
        }
      }
    }
  },
  {
    "name": "neutral/400",
    "cssToken": "--neutral-400",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --neutral-400",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--neutral-400)",
      "ANDROID": "TuxTokens.Tti.NEUTRAL_400",
      "iOS": "TuxTokens.Tti.neutral400"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#A5A5A5",
        "rgba": {
          "r": 0.6471,
          "g": 0.6471,
          "b": 0.6471,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#A5A5A5",
        "rgba": {
          "r": 0.6471,
          "g": 0.6471,
          "b": 0.6471,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#A5A5A5",
        "rgba": {
          "r": 0.6471,
          "g": 0.6471,
          "b": 0.6471,
          "a": 1
        }
      }
    }
  },
  {
    "name": "neutral/450",
    "cssToken": "--neutral-450",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --neutral-450",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--neutral-450)",
      "ANDROID": "TuxTokens.Tti.NEUTRAL_450",
      "iOS": "TuxTokens.Tti.neutral450"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#9B9A96",
        "rgba": {
          "r": 0.6078,
          "g": 0.6039,
          "b": 0.5882,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#9B9A96",
        "rgba": {
          "r": 0.6078,
          "g": 0.6039,
          "b": 0.5882,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#9B9A96",
        "rgba": {
          "r": 0.6078,
          "g": 0.6039,
          "b": 0.5882,
          "a": 1
        }
      }
    }
  },
  {
    "name": "neutral/500",
    "cssToken": "--neutral-500",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --neutral-500",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--neutral-500)",
      "ANDROID": "TuxTokens.Tti.NEUTRAL_500",
      "iOS": "TuxTokens.Tti.neutral500"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#939597",
        "rgba": {
          "r": 0.5765,
          "g": 0.5843,
          "b": 0.5922,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#939597",
        "rgba": {
          "r": 0.5765,
          "g": 0.5843,
          "b": 0.5922,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#939597",
        "rgba": {
          "r": 0.5765,
          "g": 0.5843,
          "b": 0.5922,
          "a": 1
        }
      }
    }
  },
  {
    "name": "neutral/550",
    "cssToken": "--neutral-550",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --neutral-550",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--neutral-550)",
      "ANDROID": "TuxTokens.Tti.NEUTRAL_550",
      "iOS": "TuxTokens.Tti.neutral550"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#86847F",
        "rgba": {
          "r": 0.5255,
          "g": 0.5176,
          "b": 0.498,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#86847F",
        "rgba": {
          "r": 0.5255,
          "g": 0.5176,
          "b": 0.498,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#86847F",
        "rgba": {
          "r": 0.5255,
          "g": 0.5176,
          "b": 0.498,
          "a": 1
        }
      }
    }
  },
  {
    "name": "neutral/600",
    "cssToken": "--neutral-600",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --neutral-600",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--neutral-600)",
      "ANDROID": "TuxTokens.Tti.NEUTRAL_600",
      "iOS": "TuxTokens.Tti.neutral600"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#7E7E7E",
        "rgba": {
          "r": 0.4941,
          "g": 0.4941,
          "b": 0.4941,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#7E7E7E",
        "rgba": {
          "r": 0.4941,
          "g": 0.4941,
          "b": 0.4941,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#7E7E7E",
        "rgba": {
          "r": 0.4941,
          "g": 0.4941,
          "b": 0.4941,
          "a": 1
        }
      }
    }
  },
  {
    "name": "neutral/650",
    "cssToken": "--neutral-650",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --neutral-650",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--neutral-650)",
      "ANDROID": "TuxTokens.Tti.NEUTRAL_650",
      "iOS": "TuxTokens.Tti.neutral650"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#6B6964",
        "rgba": {
          "r": 0.4196,
          "g": 0.4118,
          "b": 0.3922,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#6B6964",
        "rgba": {
          "r": 0.4196,
          "g": 0.4118,
          "b": 0.3922,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#6B6964",
        "rgba": {
          "r": 0.4196,
          "g": 0.4118,
          "b": 0.3922,
          "a": 1
        }
      }
    }
  },
  {
    "name": "neutral/700",
    "cssToken": "--neutral-700",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --neutral-700",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--neutral-700)",
      "ANDROID": "TuxTokens.Tti.NEUTRAL_700",
      "iOS": "TuxTokens.Tti.neutral700"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#5D5D5D",
        "rgba": {
          "r": 0.3647,
          "g": 0.3647,
          "b": 0.3647,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#5D5D5D",
        "rgba": {
          "r": 0.3647,
          "g": 0.3647,
          "b": 0.3647,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#5D5D5D",
        "rgba": {
          "r": 0.3647,
          "g": 0.3647,
          "b": 0.3647,
          "a": 1
        }
      }
    }
  },
  {
    "name": "neutral/750",
    "cssToken": "--neutral-750",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --neutral-750",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--neutral-750)",
      "ANDROID": "TuxTokens.Tti.NEUTRAL_750",
      "iOS": "TuxTokens.Tti.neutral750"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#535048",
        "rgba": {
          "r": 0.3255,
          "g": 0.3137,
          "b": 0.2824,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#535048",
        "rgba": {
          "r": 0.3255,
          "g": 0.3137,
          "b": 0.2824,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#535048",
        "rgba": {
          "r": 0.3255,
          "g": 0.3137,
          "b": 0.2824,
          "a": 1
        }
      }
    }
  },
  {
    "name": "neutral/800",
    "cssToken": "--neutral-800",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --neutral-800",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--neutral-800)",
      "ANDROID": "TuxTokens.Tti.NEUTRAL_800",
      "iOS": "TuxTokens.Tti.neutral800"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#4C4C4E",
        "rgba": {
          "r": 0.298,
          "g": 0.298,
          "b": 0.3059,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#4C4C4E",
        "rgba": {
          "r": 0.298,
          "g": 0.298,
          "b": 0.3059,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#4C4C4E",
        "rgba": {
          "r": 0.298,
          "g": 0.298,
          "b": 0.3059,
          "a": 1
        }
      }
    }
  },
  {
    "name": "neutral/850",
    "cssToken": "--neutral-850",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --neutral-850",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--neutral-850)",
      "ANDROID": "TuxTokens.Tti.NEUTRAL_850",
      "iOS": "TuxTokens.Tti.neutral850"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#3A3833",
        "rgba": {
          "r": 0.2275,
          "g": 0.2196,
          "b": 0.2,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#3A3833",
        "rgba": {
          "r": 0.2275,
          "g": 0.2196,
          "b": 0.2,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#3A3833",
        "rgba": {
          "r": 0.2275,
          "g": 0.2196,
          "b": 0.2,
          "a": 1
        }
      }
    }
  },
  {
    "name": "neutral/900",
    "cssToken": "--neutral-900",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --neutral-900",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--neutral-900)",
      "ANDROID": "TuxTokens.Tti.NEUTRAL_900",
      "iOS": "TuxTokens.Tti.neutral900"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#221F1F",
        "rgba": {
          "r": 0.1333,
          "g": 0.1216,
          "b": 0.1216,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#221F1F",
        "rgba": {
          "r": 0.1333,
          "g": 0.1216,
          "b": 0.1216,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#221F1F",
        "rgba": {
          "r": 0.1333,
          "g": 0.1216,
          "b": 0.1216,
          "a": 1
        }
      }
    }
  },
  {
    "name": "neutral/1000",
    "cssToken": "--neutral-1000",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --neutral-1000",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--neutral-1000)",
      "ANDROID": "TuxTokens.Tti.NEUTRAL_1000",
      "iOS": "TuxTokens.Tti.neutral1000"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#000000",
        "rgba": {
          "r": 0,
          "g": 0,
          "b": 0,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#000000",
        "rgba": {
          "r": 0,
          "g": 0,
          "b": 0,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#000000",
        "rgba": {
          "r": 0,
          "g": 0,
          "b": 0,
          "a": 1
        }
      }
    }
  },
  {
    "name": "brand/primary",
    "cssToken": "--brand-primary",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --brand-primary",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--brand-primary)",
      "ANDROID": "TuxTokens.Tti.BRAND_PRIMARY",
      "iOS": "TuxTokens.Tti.brandPrimary"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#5C0025",
        "rgba": {
          "r": 0.3608,
          "g": 0,
          "b": 0.1451,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#6BB4C0",
        "rgba": {
          "r": 0.4196,
          "g": 0.7059,
          "b": 0.7529,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#500000",
        "rgba": {
          "r": 0.3137,
          "g": 0,
          "b": 0,
          "a": 1
        }
      }
    }
  },
  {
    "name": "brand/primary-deep",
    "cssToken": "--brand-primary-deep",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --brand-primary-deep",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--brand-primary-deep)",
      "ANDROID": "TuxTokens.Tti.BRAND_PRIMARY_DEEP",
      "iOS": "TuxTokens.Tti.brandPrimaryDeep"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#500000",
        "rgba": {
          "r": 0.3137,
          "g": 0,
          "b": 0,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#5B9CA8",
        "rgba": {
          "r": 0.3569,
          "g": 0.6118,
          "b": 0.6588,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#3A0000",
        "rgba": {
          "r": 0.2275,
          "g": 0,
          "b": 0,
          "a": 1
        }
      }
    }
  },
  {
    "name": "brand/accent",
    "cssToken": "--brand-accent",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --brand-accent",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--brand-accent)",
      "ANDROID": "TuxTokens.Tti.BRAND_ACCENT",
      "iOS": "TuxTokens.Tti.brandAccent"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#DDAC37",
        "rgba": {
          "r": 0.8667,
          "g": 0.6745,
          "b": 0.2157,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#DDAC37",
        "rgba": {
          "r": 0.8667,
          "g": 0.6745,
          "b": 0.2157,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#DCAA37",
        "rgba": {
          "r": 0.8627,
          "g": 0.6667,
          "b": 0.2157,
          "a": 1
        }
      }
    }
  },
  {
    "name": "brand/accent-deep",
    "cssToken": "--brand-accent-deep",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --brand-accent-deep",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--brand-accent-deep)",
      "ANDROID": "TuxTokens.Tti.BRAND_ACCENT_DEEP",
      "iOS": "TuxTokens.Tti.brandAccentDeep"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#DCAA37",
        "rgba": {
          "r": 0.8627,
          "g": 0.6667,
          "b": 0.2157,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#F0C362",
        "rgba": {
          "r": 0.9412,
          "g": 0.7647,
          "b": 0.3843,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#B88A21",
        "rgba": {
          "r": 0.7216,
          "g": 0.5412,
          "b": 0.1294,
          "a": 1
        }
      }
    }
  },
  {
    "name": "brand/secondary",
    "cssToken": "--brand-secondary",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --brand-secondary",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--brand-secondary)",
      "ANDROID": "TuxTokens.Tti.BRAND_SECONDARY",
      "iOS": "TuxTokens.Tti.brandSecondary"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#15457E",
        "rgba": {
          "r": 0.0824,
          "g": 0.2706,
          "b": 0.4941,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#8AB7E2",
        "rgba": {
          "r": 0.5412,
          "g": 0.7176,
          "b": 0.8863,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#000000",
        "rgba": {
          "r": 0,
          "g": 0,
          "b": 0,
          "a": 1
        }
      }
    }
  },
  {
    "name": "brand/fill",
    "cssToken": "--brand-fill",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --brand-fill",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--brand-fill)",
      "ANDROID": "TuxTokens.Tti.BRAND_FILL",
      "iOS": "TuxTokens.Tti.brandFill"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#5C0025",
        "rgba": {
          "r": 0.3608,
          "g": 0,
          "b": 0.1451,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#5C0025",
        "rgba": {
          "r": 0.3608,
          "g": 0,
          "b": 0.1451,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#500000",
        "rgba": {
          "r": 0.3137,
          "g": 0,
          "b": 0,
          "a": 1
        }
      }
    }
  },
  {
    "name": "brand/accent-ink",
    "cssToken": "--brand-accent-ink",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --brand-accent-ink",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--brand-accent-ink)",
      "ANDROID": "TuxTokens.Tti.BRAND_ACCENT_INK",
      "iOS": "TuxTokens.Tti.brandAccentInk"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#2A0E15",
        "rgba": {
          "r": 0.1647,
          "g": 0.0549,
          "b": 0.0824,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#2A0E15",
        "rgba": {
          "r": 0.1647,
          "g": 0.0549,
          "b": 0.0824,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#2A0E15",
        "rgba": {
          "r": 0.1647,
          "g": 0.0549,
          "b": 0.0824,
          "a": 1
        }
      }
    }
  },
  {
    "name": "brand/accent-shade",
    "cssToken": "--brand-accent-shade",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --brand-accent-shade",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--brand-accent-shade)",
      "ANDROID": "TuxTokens.Tti.BRAND_ACCENT_SHADE",
      "iOS": "TuxTokens.Tti.brandAccentShade"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#A87B1F",
        "rgba": {
          "r": 0.6588,
          "g": 0.4824,
          "b": 0.1216,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#A87B1F",
        "rgba": {
          "r": 0.6588,
          "g": 0.4824,
          "b": 0.1216,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#A87B1F",
        "rgba": {
          "r": 0.6588,
          "g": 0.4824,
          "b": 0.1216,
          "a": 1
        }
      }
    }
  },
  {
    "name": "surface/page",
    "cssToken": "--surface-page",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --surface-page",
    "scopes": [
      "FRAME_FILL",
      "SHAPE_FILL"
    ],
    "codeSyntax": {
      "WEB": "var(--surface-page)",
      "ANDROID": "TuxTokens.Tti.SURFACE_PAGE",
      "iOS": "TuxTokens.Tti.surfacePage"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#FFFFFF",
        "rgba": {
          "r": 1,
          "g": 1,
          "b": 1,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#15100F",
        "rgba": {
          "r": 0.0824,
          "g": 0.0627,
          "b": 0.0588,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#FFFFFF",
        "rgba": {
          "r": 1,
          "g": 1,
          "b": 1,
          "a": 1
        }
      }
    }
  },
  {
    "name": "surface/raised",
    "cssToken": "--surface-raised",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --surface-raised",
    "scopes": [
      "FRAME_FILL",
      "SHAPE_FILL"
    ],
    "codeSyntax": {
      "WEB": "var(--surface-raised)",
      "ANDROID": "TuxTokens.Tti.SURFACE_RAISED",
      "iOS": "TuxTokens.Tti.surfaceRaised"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#FFFFFF",
        "rgba": {
          "r": 1,
          "g": 1,
          "b": 1,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#221F1F",
        "rgba": {
          "r": 0.1333,
          "g": 0.1216,
          "b": 0.1216,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#FFFFFF",
        "rgba": {
          "r": 1,
          "g": 1,
          "b": 1,
          "a": 1
        }
      }
    }
  },
  {
    "name": "surface/sunken",
    "cssToken": "--surface-sunken",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --surface-sunken",
    "scopes": [
      "FRAME_FILL",
      "SHAPE_FILL"
    ],
    "codeSyntax": {
      "WEB": "var(--surface-sunken)",
      "ANDROID": "TuxTokens.Tti.SURFACE_SUNKEN",
      "iOS": "TuxTokens.Tti.surfaceSunken"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#F5F5F5",
        "rgba": {
          "r": 0.9608,
          "g": 0.9608,
          "b": 0.9608,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#0B0908",
        "rgba": {
          "r": 0.0431,
          "g": 0.0353,
          "b": 0.0314,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#F0F0F0",
        "rgba": {
          "r": 0.9412,
          "g": 0.9412,
          "b": 0.9412,
          "a": 1
        }
      }
    }
  },
  {
    "name": "surface/border",
    "cssToken": "--surface-border",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --surface-border",
    "scopes": [
      "FRAME_FILL",
      "SHAPE_FILL"
    ],
    "codeSyntax": {
      "WEB": "var(--surface-border)",
      "ANDROID": "TuxTokens.Tti.SURFACE_BORDER",
      "iOS": "TuxTokens.Tti.surfaceBorder"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#E7E6E6",
        "rgba": {
          "r": 0.9059,
          "g": 0.902,
          "b": 0.902,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#3D3A3A",
        "rgba": {
          "r": 0.2392,
          "g": 0.2275,
          "b": 0.2275,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#5D5D5D",
        "rgba": {
          "r": 0.3647,
          "g": 0.3647,
          "b": 0.3647,
          "a": 1
        }
      }
    }
  },
  {
    "name": "surface/border-subtle",
    "cssToken": "--surface-border-subtle",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --surface-border-subtle",
    "scopes": [
      "FRAME_FILL",
      "SHAPE_FILL"
    ],
    "codeSyntax": {
      "WEB": "var(--surface-border-subtle)",
      "ANDROID": "TuxTokens.Tti.SURFACE_BORDER_SUBTLE",
      "iOS": "TuxTokens.Tti.surfaceBorderSubtle"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#EFEEED",
        "rgba": {
          "r": 0.9373,
          "g": 0.9333,
          "b": 0.9294,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#2E2B2A",
        "rgba": {
          "r": 0.1804,
          "g": 0.1686,
          "b": 0.1647,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#5D5D5D",
        "rgba": {
          "r": 0.3647,
          "g": 0.3647,
          "b": 0.3647,
          "a": 1
        }
      }
    }
  },
  {
    "name": "surface/eggshell",
    "cssToken": "--surface-eggshell",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --surface-eggshell",
    "scopes": [
      "FRAME_FILL",
      "SHAPE_FILL"
    ],
    "codeSyntax": {
      "WEB": "var(--surface-eggshell)",
      "ANDROID": "TuxTokens.Tti.SURFACE_EGGSHELL",
      "iOS": "TuxTokens.Tti.surfaceEggshell"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#F9F9F7",
        "rgba": {
          "r": 0.9765,
          "g": 0.9765,
          "b": 0.9686,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#1C1817",
        "rgba": {
          "r": 0.1098,
          "g": 0.0941,
          "b": 0.0902,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#FFFFFF",
        "rgba": {
          "r": 1,
          "g": 1,
          "b": 1,
          "a": 1
        }
      }
    }
  },
  {
    "name": "surface/cool-gray",
    "cssToken": "--surface-cool-gray",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --surface-cool-gray",
    "scopes": [
      "FRAME_FILL",
      "SHAPE_FILL"
    ],
    "codeSyntax": {
      "WEB": "var(--surface-cool-gray)",
      "ANDROID": "TuxTokens.Tti.SURFACE_COOL_GRAY",
      "iOS": "TuxTokens.Tti.surfaceCoolGray"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#E8E8E8",
        "rgba": {
          "r": 0.9098,
          "g": 0.9098,
          "b": 0.9098,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#262322",
        "rgba": {
          "r": 0.149,
          "g": 0.1373,
          "b": 0.1333,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#F0F0F0",
        "rgba": {
          "r": 0.9412,
          "g": 0.9412,
          "b": 0.9412,
          "a": 1
        }
      }
    }
  },
  {
    "name": "text/primary",
    "cssToken": "--text-primary",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --text-primary",
    "scopes": [
      "TEXT_FILL"
    ],
    "codeSyntax": {
      "WEB": "var(--text-primary)",
      "ANDROID": "TuxTokens.Tti.TEXT_PRIMARY",
      "iOS": "TuxTokens.Tti.textPrimary"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#221F1F",
        "rgba": {
          "r": 0.1333,
          "g": 0.1216,
          "b": 0.1216,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#FAFAFA",
        "rgba": {
          "r": 0.9804,
          "g": 0.9804,
          "b": 0.9804,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#000000",
        "rgba": {
          "r": 0,
          "g": 0,
          "b": 0,
          "a": 1
        }
      }
    }
  },
  {
    "name": "text/secondary",
    "cssToken": "--text-secondary",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --text-secondary",
    "scopes": [
      "TEXT_FILL"
    ],
    "codeSyntax": {
      "WEB": "var(--text-secondary)",
      "ANDROID": "TuxTokens.Tti.TEXT_SECONDARY",
      "iOS": "TuxTokens.Tti.textSecondary"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#424242",
        "rgba": {
          "r": 0.2588,
          "g": 0.2588,
          "b": 0.2588,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#D1D2D4",
        "rgba": {
          "r": 0.8196,
          "g": 0.8235,
          "b": 0.8314,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#221F1F",
        "rgba": {
          "r": 0.1333,
          "g": 0.1216,
          "b": 0.1216,
          "a": 1
        }
      }
    }
  },
  {
    "name": "text/muted",
    "cssToken": "--text-muted",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --text-muted",
    "scopes": [
      "TEXT_FILL"
    ],
    "codeSyntax": {
      "WEB": "var(--text-muted)",
      "ANDROID": "TuxTokens.Tti.TEXT_MUTED",
      "iOS": "TuxTokens.Tti.textMuted"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#525252",
        "rgba": {
          "r": 0.3216,
          "g": 0.3216,
          "b": 0.3216,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#B5B5B5",
        "rgba": {
          "r": 0.7098,
          "g": 0.7098,
          "b": 0.7098,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#4D4D4D",
        "rgba": {
          "r": 0.302,
          "g": 0.302,
          "b": 0.302,
          "a": 1
        }
      }
    }
  },
  {
    "name": "text/inverse",
    "cssToken": "--text-inverse",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --text-inverse",
    "scopes": [
      "TEXT_FILL"
    ],
    "codeSyntax": {
      "WEB": "var(--text-inverse)",
      "ANDROID": "TuxTokens.Tti.TEXT_INVERSE",
      "iOS": "TuxTokens.Tti.textInverse"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#FFFFFF",
        "rgba": {
          "r": 1,
          "g": 1,
          "b": 1,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#221F1F",
        "rgba": {
          "r": 0.1333,
          "g": 0.1216,
          "b": 0.1216,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#FFFFFF",
        "rgba": {
          "r": 1,
          "g": 1,
          "b": 1,
          "a": 1
        }
      }
    }
  },
  {
    "name": "text/brand",
    "cssToken": "--text-brand",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --text-brand",
    "scopes": [
      "TEXT_FILL"
    ],
    "codeSyntax": {
      "WEB": "var(--text-brand)",
      "ANDROID": "TuxTokens.Tti.TEXT_BRAND",
      "iOS": "TuxTokens.Tti.textBrand"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#5C0025",
        "rgba": {
          "r": 0.3608,
          "g": 0,
          "b": 0.1451,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#5B9CA8",
        "rgba": {
          "r": 0.3569,
          "g": 0.6118,
          "b": 0.6588,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#500000",
        "rgba": {
          "r": 0.3137,
          "g": 0,
          "b": 0,
          "a": 1
        }
      }
    }
  },
  {
    "name": "text/on-brand",
    "cssToken": "--text-on-brand",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --text-on-brand",
    "scopes": [
      "TEXT_FILL"
    ],
    "codeSyntax": {
      "WEB": "var(--text-on-brand)",
      "ANDROID": "TuxTokens.Tti.TEXT_ON_BRAND",
      "iOS": "TuxTokens.Tti.textOnBrand"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#FFFFFF",
        "rgba": {
          "r": 1,
          "g": 1,
          "b": 1,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#FFFFFF",
        "rgba": {
          "r": 1,
          "g": 1,
          "b": 1,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#FFFFFF",
        "rgba": {
          "r": 1,
          "g": 1,
          "b": 1,
          "a": 1
        }
      }
    }
  },
  {
    "name": "text/charcoal",
    "cssToken": "--text-charcoal",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --text-charcoal",
    "scopes": [
      "TEXT_FILL"
    ],
    "codeSyntax": {
      "WEB": "var(--text-charcoal)",
      "ANDROID": "TuxTokens.Tti.TEXT_CHARCOAL",
      "iOS": "TuxTokens.Tti.textCharcoal"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#232323",
        "rgba": {
          "r": 0.1373,
          "g": 0.1373,
          "b": 0.1373,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#FAFAFA",
        "rgba": {
          "r": 0.9804,
          "g": 0.9804,
          "b": 0.9804,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#000000",
        "rgba": {
          "r": 0,
          "g": 0,
          "b": 0,
          "a": 1
        }
      }
    }
  },
  {
    "name": "text/dark",
    "cssToken": "--text-dark",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --text-dark",
    "scopes": [
      "TEXT_FILL"
    ],
    "codeSyntax": {
      "WEB": "var(--text-dark)",
      "ANDROID": "TuxTokens.Tti.TEXT_DARK",
      "iOS": "TuxTokens.Tti.textDark"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#040404",
        "rgba": {
          "r": 0.0157,
          "g": 0.0157,
          "b": 0.0157,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#FFFFFF",
        "rgba": {
          "r": 1,
          "g": 1,
          "b": 1,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#000000",
        "rgba": {
          "r": 0,
          "g": 0,
          "b": 0,
          "a": 1
        }
      }
    }
  },
  {
    "name": "color/success",
    "cssToken": "--color-success",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --color-success",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--color-success)",
      "ANDROID": "TuxTokens.Tti.COLOR_SUCCESS",
      "iOS": "TuxTokens.Tti.colorSuccess"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#3D5328",
        "rgba": {
          "r": 0.2392,
          "g": 0.3255,
          "b": 0.1569,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#ABCC8E",
        "rgba": {
          "r": 0.6706,
          "g": 0.8,
          "b": 0.5569,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#3D5328",
        "rgba": {
          "r": 0.2392,
          "g": 0.3255,
          "b": 0.1569,
          "a": 1
        }
      }
    }
  },
  {
    "name": "color/warning",
    "cssToken": "--color-warning",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --color-warning",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--color-warning)",
      "ANDROID": "TuxTokens.Tti.COLOR_WARNING",
      "iOS": "TuxTokens.Tti.colorWarning"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#DDAC37",
        "rgba": {
          "r": 0.8667,
          "g": 0.6745,
          "b": 0.2157,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#F5D98A",
        "rgba": {
          "r": 0.9608,
          "g": 0.851,
          "b": 0.5412,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#DDAC37",
        "rgba": {
          "r": 0.8667,
          "g": 0.6745,
          "b": 0.2157,
          "a": 1
        }
      }
    }
  },
  {
    "name": "color/danger",
    "cssToken": "--color-danger",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --color-danger",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--color-danger)",
      "ANDROID": "TuxTokens.Tti.COLOR_DANGER",
      "iOS": "TuxTokens.Tti.colorDanger"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#5C0025",
        "rgba": {
          "r": 0.3608,
          "g": 0,
          "b": 0.1451,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#E795A8",
        "rgba": {
          "r": 0.9059,
          "g": 0.5843,
          "b": 0.6588,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#500000",
        "rgba": {
          "r": 0.3137,
          "g": 0,
          "b": 0,
          "a": 1
        }
      }
    }
  },
  {
    "name": "color/error",
    "cssToken": "--color-error",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --color-error",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--color-error)",
      "ANDROID": "TuxTokens.Tti.COLOR_ERROR",
      "iOS": "TuxTokens.Tti.colorError"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#A02828",
        "rgba": {
          "r": 0.6275,
          "g": 0.1569,
          "b": 0.1569,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#F59292",
        "rgba": {
          "r": 0.9608,
          "g": 0.5725,
          "b": 0.5725,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#A02828",
        "rgba": {
          "r": 0.6275,
          "g": 0.1569,
          "b": 0.1569,
          "a": 1
        }
      }
    }
  },
  {
    "name": "color/info",
    "cssToken": "--color-info",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --color-info",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--color-info)",
      "ANDROID": "TuxTokens.Tti.COLOR_INFO",
      "iOS": "TuxTokens.Tti.colorInfo"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#1F5D66",
        "rgba": {
          "r": 0.1216,
          "g": 0.3647,
          "b": 0.4,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#9BD4E0",
        "rgba": {
          "r": 0.6078,
          "g": 0.8314,
          "b": 0.8784,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#1F5D66",
        "rgba": {
          "r": 0.1216,
          "g": 0.3647,
          "b": 0.4,
          "a": 1
        }
      }
    }
  },
  {
    "name": "status/ok",
    "cssToken": "--status-ok",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --status-ok",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--status-ok)",
      "ANDROID": "TuxTokens.Tti.STATUS_OK",
      "iOS": "TuxTokens.Tti.statusOk"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#258818",
        "rgba": {
          "r": 0.1451,
          "g": 0.5333,
          "b": 0.0941,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#90F084",
        "rgba": {
          "r": 0.5647,
          "g": 0.9412,
          "b": 0.5176,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#0E6800",
        "rgba": {
          "r": 0.0549,
          "g": 0.4078,
          "b": 0,
          "a": 1
        }
      }
    }
  },
  {
    "name": "status/ok-fill",
    "cssToken": "--status-ok-fill",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --status-ok-fill",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--status-ok-fill)",
      "ANDROID": "TuxTokens.Tti.STATUS_OK_FILL",
      "iOS": "TuxTokens.Tti.statusOkFill"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#93F387",
        "rgba": {
          "r": 0.5765,
          "g": 0.9529,
          "b": 0.5294,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#86E67A",
        "rgba": {
          "r": 0.5255,
          "g": 0.902,
          "b": 0.4784,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#FFFFFF",
        "rgba": {
          "r": 1,
          "g": 1,
          "b": 1,
          "a": 1
        }
      }
    }
  },
  {
    "name": "status/ok-ink",
    "cssToken": "--status-ok-ink",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --status-ok-ink",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--status-ok-ink)",
      "ANDROID": "TuxTokens.Tti.STATUS_OK_INK",
      "iOS": "TuxTokens.Tti.statusOkInk"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#221F1F",
        "rgba": {
          "r": 0.1333,
          "g": 0.1216,
          "b": 0.1216,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#221F1F",
        "rgba": {
          "r": 0.1333,
          "g": 0.1216,
          "b": 0.1216,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#0E6800",
        "rgba": {
          "r": 0.0549,
          "g": 0.4078,
          "b": 0,
          "a": 1
        }
      }
    }
  },
  {
    "name": "status/warning",
    "cssToken": "--status-warning",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --status-warning",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--status-warning)",
      "ANDROID": "TuxTokens.Tti.STATUS_WARNING",
      "iOS": "TuxTokens.Tti.statusWarning"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#7A7A00",
        "rgba": {
          "r": 0.4784,
          "g": 0.4784,
          "b": 0,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#FDFF68",
        "rgba": {
          "r": 0.9922,
          "g": 1,
          "b": 0.4078,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#5C5C00",
        "rgba": {
          "r": 0.3608,
          "g": 0.3608,
          "b": 0,
          "a": 1
        }
      }
    }
  },
  {
    "name": "status/warning-fill",
    "cssToken": "--status-warning-fill",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --status-warning-fill",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--status-warning-fill)",
      "ANDROID": "TuxTokens.Tti.STATUS_WARNING_FILL",
      "iOS": "TuxTokens.Tti.statusWarningFill"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#ECEE55",
        "rgba": {
          "r": 0.9255,
          "g": 0.9333,
          "b": 0.3333,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#E6E74C",
        "rgba": {
          "r": 0.902,
          "g": 0.9059,
          "b": 0.298,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#FFFFFF",
        "rgba": {
          "r": 1,
          "g": 1,
          "b": 1,
          "a": 1
        }
      }
    }
  },
  {
    "name": "status/warning-ink",
    "cssToken": "--status-warning-ink",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --status-warning-ink",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--status-warning-ink)",
      "ANDROID": "TuxTokens.Tti.STATUS_WARNING_INK",
      "iOS": "TuxTokens.Tti.statusWarningInk"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#221F1F",
        "rgba": {
          "r": 0.1333,
          "g": 0.1216,
          "b": 0.1216,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#221F1F",
        "rgba": {
          "r": 0.1333,
          "g": 0.1216,
          "b": 0.1216,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#5C5C00",
        "rgba": {
          "r": 0.3608,
          "g": 0.3608,
          "b": 0,
          "a": 1
        }
      }
    }
  },
  {
    "name": "status/unknown",
    "cssToken": "--status-unknown",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --status-unknown",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--status-unknown)",
      "ANDROID": "TuxTokens.Tti.STATUS_UNKNOWN",
      "iOS": "TuxTokens.Tti.statusUnknown"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#BC5B00",
        "rgba": {
          "r": 0.7373,
          "g": 0.3569,
          "b": 0,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#FC8731",
        "rgba": {
          "r": 0.9882,
          "g": 0.5294,
          "b": 0.1922,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#8E4300",
        "rgba": {
          "r": 0.5569,
          "g": 0.2627,
          "b": 0,
          "a": 1
        }
      }
    }
  },
  {
    "name": "status/unknown-fill",
    "cssToken": "--status-unknown-fill",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --status-unknown-fill",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--status-unknown-fill)",
      "ANDROID": "TuxTokens.Tti.STATUS_UNKNOWN_FILL",
      "iOS": "TuxTokens.Tti.statusUnknownFill"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#FF9B5A",
        "rgba": {
          "r": 1,
          "g": 0.6078,
          "b": 0.3529,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#FF8A37",
        "rgba": {
          "r": 1,
          "g": 0.5412,
          "b": 0.2157,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#FFFFFF",
        "rgba": {
          "r": 1,
          "g": 1,
          "b": 1,
          "a": 1
        }
      }
    }
  },
  {
    "name": "status/unknown-ink",
    "cssToken": "--status-unknown-ink",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --status-unknown-ink",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--status-unknown-ink)",
      "ANDROID": "TuxTokens.Tti.STATUS_UNKNOWN_INK",
      "iOS": "TuxTokens.Tti.statusUnknownInk"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#221F1F",
        "rgba": {
          "r": 0.1333,
          "g": 0.1216,
          "b": 0.1216,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#221F1F",
        "rgba": {
          "r": 0.1333,
          "g": 0.1216,
          "b": 0.1216,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#8E4300",
        "rgba": {
          "r": 0.5569,
          "g": 0.2627,
          "b": 0,
          "a": 1
        }
      }
    }
  },
  {
    "name": "status/critical",
    "cssToken": "--status-critical",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --status-critical",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--status-critical)",
      "ANDROID": "TuxTokens.Tti.STATUS_CRITICAL",
      "iOS": "TuxTokens.Tti.statusCritical"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#A02828",
        "rgba": {
          "r": 0.6275,
          "g": 0.1569,
          "b": 0.1569,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#F14440",
        "rgba": {
          "r": 0.9451,
          "g": 0.2667,
          "b": 0.251,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#B20014",
        "rgba": {
          "r": 0.698,
          "g": 0,
          "b": 0.0784,
          "a": 1
        }
      }
    }
  },
  {
    "name": "status/critical-fill",
    "cssToken": "--status-critical-fill",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --status-critical-fill",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--status-critical-fill)",
      "ANDROID": "TuxTokens.Tti.STATUS_CRITICAL_FILL",
      "iOS": "TuxTokens.Tti.statusCriticalFill"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#FF544D",
        "rgba": {
          "r": 1,
          "g": 0.3294,
          "b": 0.302,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#FC4F49",
        "rgba": {
          "r": 0.9882,
          "g": 0.3098,
          "b": 0.2863,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#FFFFFF",
        "rgba": {
          "r": 1,
          "g": 1,
          "b": 1,
          "a": 1
        }
      }
    }
  },
  {
    "name": "status/critical-ink",
    "cssToken": "--status-critical-ink",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --status-critical-ink",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--status-critical-ink)",
      "ANDROID": "TuxTokens.Tti.STATUS_CRITICAL_INK",
      "iOS": "TuxTokens.Tti.statusCriticalInk"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#221F1F",
        "rgba": {
          "r": 0.1333,
          "g": 0.1216,
          "b": 0.1216,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#221F1F",
        "rgba": {
          "r": 0.1333,
          "g": 0.1216,
          "b": 0.1216,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#B20014",
        "rgba": {
          "r": 0.698,
          "g": 0,
          "b": 0.0784,
          "a": 1
        }
      }
    }
  },
  {
    "name": "status/maintenance",
    "cssToken": "--status-maintenance",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --status-maintenance",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--status-maintenance)",
      "ANDROID": "TuxTokens.Tti.STATUS_MAINTENANCE",
      "iOS": "TuxTokens.Tti.statusMaintenance"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#0566C7",
        "rgba": {
          "r": 0.0196,
          "g": 0.4,
          "b": 0.7804,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#53A0FF",
        "rgba": {
          "r": 0.3255,
          "g": 0.6275,
          "b": 1,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#0056AA",
        "rgba": {
          "r": 0,
          "g": 0.3373,
          "b": 0.6667,
          "a": 1
        }
      }
    }
  },
  {
    "name": "status/maintenance-fill",
    "cssToken": "--status-maintenance-fill",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --status-maintenance-fill",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--status-maintenance-fill)",
      "ANDROID": "TuxTokens.Tti.STATUS_MAINTENANCE_FILL",
      "iOS": "TuxTokens.Tti.statusMaintenanceFill"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#85BAFF",
        "rgba": {
          "r": 0.5216,
          "g": 0.7294,
          "b": 1,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#85BAFF",
        "rgba": {
          "r": 0.5216,
          "g": 0.7294,
          "b": 1,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#FFFFFF",
        "rgba": {
          "r": 1,
          "g": 1,
          "b": 1,
          "a": 1
        }
      }
    }
  },
  {
    "name": "status/maintenance-ink",
    "cssToken": "--status-maintenance-ink",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --status-maintenance-ink",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--status-maintenance-ink)",
      "ANDROID": "TuxTokens.Tti.STATUS_MAINTENANCE_INK",
      "iOS": "TuxTokens.Tti.statusMaintenanceInk"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#221F1F",
        "rgba": {
          "r": 0.1333,
          "g": 0.1216,
          "b": 0.1216,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#221F1F",
        "rgba": {
          "r": 0.1333,
          "g": 0.1216,
          "b": 0.1216,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#0056AA",
        "rgba": {
          "r": 0,
          "g": 0.3373,
          "b": 0.6667,
          "a": 1
        }
      }
    }
  },
  {
    "name": "status/pending",
    "cssToken": "--status-pending",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --status-pending",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--status-pending)",
      "ANDROID": "TuxTokens.Tti.STATUS_PENDING",
      "iOS": "TuxTokens.Tti.statusPending"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#747474",
        "rgba": {
          "r": 0.4549,
          "g": 0.4549,
          "b": 0.4549,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#ABABAB",
        "rgba": {
          "r": 0.6706,
          "g": 0.6706,
          "b": 0.6706,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#585858",
        "rgba": {
          "r": 0.3451,
          "g": 0.3451,
          "b": 0.3451,
          "a": 1
        }
      }
    }
  },
  {
    "name": "status/pending-fill",
    "cssToken": "--status-pending-fill",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --status-pending-fill",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--status-pending-fill)",
      "ANDROID": "TuxTokens.Tti.STATUS_PENDING_FILL",
      "iOS": "TuxTokens.Tti.statusPendingFill"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#DEDEDE",
        "rgba": {
          "r": 0.8706,
          "g": 0.8706,
          "b": 0.8706,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#D1D1D1",
        "rgba": {
          "r": 0.8196,
          "g": 0.8196,
          "b": 0.8196,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#FFFFFF",
        "rgba": {
          "r": 1,
          "g": 1,
          "b": 1,
          "a": 1
        }
      }
    }
  },
  {
    "name": "status/pending-ink",
    "cssToken": "--status-pending-ink",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --status-pending-ink",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--status-pending-ink)",
      "ANDROID": "TuxTokens.Tti.STATUS_PENDING_INK",
      "iOS": "TuxTokens.Tti.statusPendingInk"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#221F1F",
        "rgba": {
          "r": 0.1333,
          "g": 0.1216,
          "b": 0.1216,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#221F1F",
        "rgba": {
          "r": 0.1333,
          "g": 0.1216,
          "b": 0.1216,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#585858",
        "rgba": {
          "r": 0.3451,
          "g": 0.3451,
          "b": 0.3451,
          "a": 1
        }
      }
    }
  },
  {
    "name": "font/body",
    "cssToken": "--font-body",
    "resolvedType": "STRING",
    "description": "TUX canonical token --font-body",
    "scopes": [
      "FONT_FAMILY"
    ],
    "codeSyntax": {
      "WEB": "var(--font-body)",
      "ANDROID": "TuxTokens.Tti.FONT_BODY",
      "iOS": "TuxTokens.Tti.fontBody"
    },
    "valuesByMode": {
      "tti": "Open Sans",
      "tti-dark": "Open Sans",
      "tti-hc": "Open Sans"
    }
  },
  {
    "name": "font/display",
    "cssToken": "--font-display",
    "resolvedType": "STRING",
    "description": "TUX canonical token --font-display",
    "scopes": [
      "FONT_FAMILY"
    ],
    "codeSyntax": {
      "WEB": "var(--font-display)",
      "ANDROID": "TuxTokens.Tti.FONT_DISPLAY",
      "iOS": "TuxTokens.Tti.fontDisplay"
    },
    "valuesByMode": {
      "tti": "Oswald",
      "tti-dark": "Oswald",
      "tti-hc": "Oswald"
    }
  },
  {
    "name": "font/bold",
    "cssToken": "--font-bold",
    "resolvedType": "STRING",
    "description": "TUX canonical token --font-bold",
    "scopes": [
      "FONT_FAMILY"
    ],
    "codeSyntax": {
      "WEB": "var(--font-bold)",
      "ANDROID": "TuxTokens.Tti.FONT_BOLD",
      "iOS": "TuxTokens.Tti.fontBold"
    },
    "valuesByMode": {
      "tti": "Work Sans",
      "tti-dark": "Work Sans",
      "tti-hc": "Work Sans"
    }
  },
  {
    "name": "font/elegant",
    "cssToken": "--font-elegant",
    "resolvedType": "STRING",
    "description": "TUX canonical token --font-elegant",
    "scopes": [
      "FONT_FAMILY"
    ],
    "codeSyntax": {
      "WEB": "var(--font-elegant)",
      "ANDROID": "TuxTokens.Tti.FONT_ELEGANT",
      "iOS": "TuxTokens.Tti.fontElegant"
    },
    "valuesByMode": {
      "tti": "Georgia",
      "tti-dark": "Georgia",
      "tti-hc": "Georgia"
    }
  },
  {
    "name": "font/sans",
    "cssToken": "--font-sans",
    "resolvedType": "STRING",
    "description": "TUX canonical token --font-sans",
    "scopes": [
      "FONT_FAMILY"
    ],
    "codeSyntax": {
      "WEB": "var(--font-sans)",
      "ANDROID": "TuxTokens.Tti.FONT_SANS",
      "iOS": "TuxTokens.Tti.fontSans"
    },
    "valuesByMode": {
      "tti": "Open Sans",
      "tti-dark": "Open Sans",
      "tti-hc": "Open Sans"
    }
  },
  {
    "name": "font/mono",
    "cssToken": "--font-mono",
    "resolvedType": "STRING",
    "description": "TUX canonical token --font-mono",
    "scopes": [
      "FONT_FAMILY"
    ],
    "codeSyntax": {
      "WEB": "var(--font-mono)",
      "ANDROID": "TuxTokens.Tti.FONT_MONO",
      "iOS": "TuxTokens.Tti.fontMono"
    },
    "valuesByMode": {
      "tti": "JetBrains Mono",
      "tti-dark": "JetBrains Mono",
      "tti-hc": "JetBrains Mono"
    }
  },
  {
    "name": "tracking/tight",
    "cssToken": "--tracking-tight",
    "resolvedType": "STRING",
    "description": "TUX canonical token --tracking-tight",
    "scopes": [
      "ALL_SCOPES"
    ],
    "codeSyntax": {
      "WEB": "var(--tracking-tight)",
      "ANDROID": "TuxTokens.Tti.TRACKING_TIGHT",
      "iOS": "TuxTokens.Tti.trackingTight"
    },
    "valuesByMode": {
      "tti": "-0.01em",
      "tti-dark": "-0.01em",
      "tti-hc": "-0.01em"
    }
  },
  {
    "name": "tracking/normal",
    "cssToken": "--tracking-normal",
    "resolvedType": "STRING",
    "description": "TUX canonical token --tracking-normal",
    "scopes": [
      "ALL_SCOPES"
    ],
    "codeSyntax": {
      "WEB": "var(--tracking-normal)",
      "ANDROID": "TuxTokens.Tti.TRACKING_NORMAL",
      "iOS": "TuxTokens.Tti.trackingNormal"
    },
    "valuesByMode": {
      "tti": "0",
      "tti-dark": "0",
      "tti-hc": "0"
    }
  },
  {
    "name": "tracking/wide",
    "cssToken": "--tracking-wide",
    "resolvedType": "STRING",
    "description": "TUX canonical token --tracking-wide",
    "scopes": [
      "ALL_SCOPES"
    ],
    "codeSyntax": {
      "WEB": "var(--tracking-wide)",
      "ANDROID": "TuxTokens.Tti.TRACKING_WIDE",
      "iOS": "TuxTokens.Tti.trackingWide"
    },
    "valuesByMode": {
      "tti": "0.05em",
      "tti-dark": "0.05em",
      "tti-hc": "0.05em"
    }
  },
  {
    "name": "tracking/wider",
    "cssToken": "--tracking-wider",
    "resolvedType": "STRING",
    "description": "TUX canonical token --tracking-wider",
    "scopes": [
      "ALL_SCOPES"
    ],
    "codeSyntax": {
      "WEB": "var(--tracking-wider)",
      "ANDROID": "TuxTokens.Tti.TRACKING_WIDER",
      "iOS": "TuxTokens.Tti.trackingWider"
    },
    "valuesByMode": {
      "tti": "0.10em",
      "tti-dark": "0.10em",
      "tti-hc": "0.10em"
    }
  },
  {
    "name": "focus/ring-outer",
    "cssToken": "--focus-ring-outer",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --focus-ring-outer",
    "scopes": [
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--focus-ring-outer)",
      "ANDROID": "TuxTokens.Tti.FOCUS_RING_OUTER",
      "iOS": "TuxTokens.Tti.focusRingOuter"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#5C0025",
        "rgba": {
          "r": 0.3608,
          "g": 0,
          "b": 0.1451,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#6BB4C0",
        "rgba": {
          "r": 0.4196,
          "g": 0.7059,
          "b": 0.7529,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#000000",
        "rgba": {
          "r": 0,
          "g": 0,
          "b": 0,
          "a": 1
        }
      }
    }
  },
  {
    "name": "focus/ring-inner",
    "cssToken": "--focus-ring-inner",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --focus-ring-inner",
    "scopes": [
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--focus-ring-inner)",
      "ANDROID": "TuxTokens.Tti.FOCUS_RING_INNER",
      "iOS": "TuxTokens.Tti.focusRingInner"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#F2E6C9",
        "rgba": {
          "r": 0.949,
          "g": 0.902,
          "b": 0.7882,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#3D2E0F",
        "rgba": {
          "r": 0.2392,
          "g": 0.1804,
          "b": 0.0588,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#FFFFFF",
        "rgba": {
          "r": 1,
          "g": 1,
          "b": 1,
          "a": 1
        }
      }
    }
  },
  {
    "name": "radius/none",
    "cssToken": "--radius-none",
    "resolvedType": "FLOAT",
    "description": "TUX canonical token --radius-none",
    "scopes": [
      "CORNER_RADIUS"
    ],
    "codeSyntax": {
      "WEB": "var(--radius-none)",
      "ANDROID": "TuxTokens.Tti.RADIUS_NONE",
      "iOS": "TuxTokens.Tti.radiusNone"
    },
    "valuesByMode": {
      "tti": 0,
      "tti-dark": 0,
      "tti-hc": 0
    }
  },
  {
    "name": "radius/sm",
    "cssToken": "--radius-sm",
    "resolvedType": "FLOAT",
    "description": "TUX canonical token --radius-sm",
    "scopes": [
      "CORNER_RADIUS"
    ],
    "codeSyntax": {
      "WEB": "var(--radius-sm)",
      "ANDROID": "TuxTokens.Tti.RADIUS_SM",
      "iOS": "TuxTokens.Tti.radiusSm"
    },
    "valuesByMode": {
      "tti": 2,
      "tti-dark": 2,
      "tti-hc": 2
    }
  },
  {
    "name": "radius/md",
    "cssToken": "--radius-md",
    "resolvedType": "FLOAT",
    "description": "TUX canonical token --radius-md",
    "scopes": [
      "CORNER_RADIUS"
    ],
    "codeSyntax": {
      "WEB": "var(--radius-md)",
      "ANDROID": "TuxTokens.Tti.RADIUS_MD",
      "iOS": "TuxTokens.Tti.radiusMd"
    },
    "valuesByMode": {
      "tti": 6,
      "tti-dark": 6,
      "tti-hc": 6
    }
  },
  {
    "name": "radius/lg",
    "cssToken": "--radius-lg",
    "resolvedType": "FLOAT",
    "description": "TUX canonical token --radius-lg",
    "scopes": [
      "CORNER_RADIUS"
    ],
    "codeSyntax": {
      "WEB": "var(--radius-lg)",
      "ANDROID": "TuxTokens.Tti.RADIUS_LG",
      "iOS": "TuxTokens.Tti.radiusLg"
    },
    "valuesByMode": {
      "tti": 8,
      "tti-dark": 8,
      "tti-hc": 8
    }
  },
  {
    "name": "radius/xl",
    "cssToken": "--radius-xl",
    "resolvedType": "FLOAT",
    "description": "TUX canonical token --radius-xl",
    "scopes": [
      "CORNER_RADIUS"
    ],
    "codeSyntax": {
      "WEB": "var(--radius-xl)",
      "ANDROID": "TuxTokens.Tti.RADIUS_XL",
      "iOS": "TuxTokens.Tti.radiusXl"
    },
    "valuesByMode": {
      "tti": 12,
      "tti-dark": 12,
      "tti-hc": 12
    }
  },
  {
    "name": "radius/full",
    "cssToken": "--radius-full",
    "resolvedType": "FLOAT",
    "description": "TUX canonical token --radius-full",
    "scopes": [
      "CORNER_RADIUS"
    ],
    "codeSyntax": {
      "WEB": "var(--radius-full)",
      "ANDROID": "TuxTokens.Tti.RADIUS_FULL",
      "iOS": "TuxTokens.Tti.radiusFull"
    },
    "valuesByMode": {
      "tti": 9999,
      "tti-dark": 9999,
      "tti-hc": 9999
    }
  },
  {
    "name": "space/0",
    "cssToken": "--space-0",
    "resolvedType": "FLOAT",
    "description": "TUX canonical token --space-0",
    "scopes": [
      "GAP",
      "WIDTH_HEIGHT"
    ],
    "codeSyntax": {
      "WEB": "var(--space-0)",
      "ANDROID": "TuxTokens.Tti.SPACE_0",
      "iOS": "TuxTokens.Tti.space0"
    },
    "valuesByMode": {
      "tti": 0,
      "tti-dark": 0,
      "tti-hc": 0
    }
  },
  {
    "name": "space/2",
    "cssToken": "--space-2",
    "resolvedType": "FLOAT",
    "description": "TUX canonical token --space-2",
    "scopes": [
      "GAP",
      "WIDTH_HEIGHT"
    ],
    "codeSyntax": {
      "WEB": "var(--space-2)",
      "ANDROID": "TuxTokens.Tti.SPACE_2",
      "iOS": "TuxTokens.Tti.space2"
    },
    "valuesByMode": {
      "tti": 2,
      "tti-dark": 2,
      "tti-hc": 2
    }
  },
  {
    "name": "space/4",
    "cssToken": "--space-4",
    "resolvedType": "FLOAT",
    "description": "TUX canonical token --space-4",
    "scopes": [
      "GAP",
      "WIDTH_HEIGHT"
    ],
    "codeSyntax": {
      "WEB": "var(--space-4)",
      "ANDROID": "TuxTokens.Tti.SPACE_4",
      "iOS": "TuxTokens.Tti.space4"
    },
    "valuesByMode": {
      "tti": 4,
      "tti-dark": 4,
      "tti-hc": 4
    }
  },
  {
    "name": "space/8",
    "cssToken": "--space-8",
    "resolvedType": "FLOAT",
    "description": "TUX canonical token --space-8",
    "scopes": [
      "GAP",
      "WIDTH_HEIGHT"
    ],
    "codeSyntax": {
      "WEB": "var(--space-8)",
      "ANDROID": "TuxTokens.Tti.SPACE_8",
      "iOS": "TuxTokens.Tti.space8"
    },
    "valuesByMode": {
      "tti": 8,
      "tti-dark": 8,
      "tti-hc": 8
    }
  },
  {
    "name": "space/10",
    "cssToken": "--space-10",
    "resolvedType": "FLOAT",
    "description": "TUX canonical token --space-10",
    "scopes": [
      "GAP",
      "WIDTH_HEIGHT"
    ],
    "codeSyntax": {
      "WEB": "var(--space-10)",
      "ANDROID": "TuxTokens.Tti.SPACE_10",
      "iOS": "TuxTokens.Tti.space10"
    },
    "valuesByMode": {
      "tti": 10,
      "tti-dark": 10,
      "tti-hc": 10
    }
  },
  {
    "name": "space/12",
    "cssToken": "--space-12",
    "resolvedType": "FLOAT",
    "description": "TUX canonical token --space-12",
    "scopes": [
      "GAP",
      "WIDTH_HEIGHT"
    ],
    "codeSyntax": {
      "WEB": "var(--space-12)",
      "ANDROID": "TuxTokens.Tti.SPACE_12",
      "iOS": "TuxTokens.Tti.space12"
    },
    "valuesByMode": {
      "tti": 12,
      "tti-dark": 12,
      "tti-hc": 12
    }
  },
  {
    "name": "space/16",
    "cssToken": "--space-16",
    "resolvedType": "FLOAT",
    "description": "TUX canonical token --space-16",
    "scopes": [
      "GAP",
      "WIDTH_HEIGHT"
    ],
    "codeSyntax": {
      "WEB": "var(--space-16)",
      "ANDROID": "TuxTokens.Tti.SPACE_16",
      "iOS": "TuxTokens.Tti.space16"
    },
    "valuesByMode": {
      "tti": 16,
      "tti-dark": 16,
      "tti-hc": 16
    }
  },
  {
    "name": "space/24",
    "cssToken": "--space-24",
    "resolvedType": "FLOAT",
    "description": "TUX canonical token --space-24",
    "scopes": [
      "GAP",
      "WIDTH_HEIGHT"
    ],
    "codeSyntax": {
      "WEB": "var(--space-24)",
      "ANDROID": "TuxTokens.Tti.SPACE_24",
      "iOS": "TuxTokens.Tti.space24"
    },
    "valuesByMode": {
      "tti": 24,
      "tti-dark": 24,
      "tti-hc": 24
    }
  },
  {
    "name": "space/32",
    "cssToken": "--space-32",
    "resolvedType": "FLOAT",
    "description": "TUX canonical token --space-32",
    "scopes": [
      "GAP",
      "WIDTH_HEIGHT"
    ],
    "codeSyntax": {
      "WEB": "var(--space-32)",
      "ANDROID": "TuxTokens.Tti.SPACE_32",
      "iOS": "TuxTokens.Tti.space32"
    },
    "valuesByMode": {
      "tti": 32,
      "tti-dark": 32,
      "tti-hc": 32
    }
  },
  {
    "name": "space/40",
    "cssToken": "--space-40",
    "resolvedType": "FLOAT",
    "description": "TUX canonical token --space-40",
    "scopes": [
      "GAP",
      "WIDTH_HEIGHT"
    ],
    "codeSyntax": {
      "WEB": "var(--space-40)",
      "ANDROID": "TuxTokens.Tti.SPACE_40",
      "iOS": "TuxTokens.Tti.space40"
    },
    "valuesByMode": {
      "tti": 40,
      "tti-dark": 40,
      "tti-hc": 40
    }
  },
  {
    "name": "space/48",
    "cssToken": "--space-48",
    "resolvedType": "FLOAT",
    "description": "TUX canonical token --space-48",
    "scopes": [
      "GAP",
      "WIDTH_HEIGHT"
    ],
    "codeSyntax": {
      "WEB": "var(--space-48)",
      "ANDROID": "TuxTokens.Tti.SPACE_48",
      "iOS": "TuxTokens.Tti.space48"
    },
    "valuesByMode": {
      "tti": 48,
      "tti-dark": 48,
      "tti-hc": 48
    }
  },
  {
    "name": "space/64",
    "cssToken": "--space-64",
    "resolvedType": "FLOAT",
    "description": "TUX canonical token --space-64",
    "scopes": [
      "GAP",
      "WIDTH_HEIGHT"
    ],
    "codeSyntax": {
      "WEB": "var(--space-64)",
      "ANDROID": "TuxTokens.Tti.SPACE_64",
      "iOS": "TuxTokens.Tti.space64"
    },
    "valuesByMode": {
      "tti": 64,
      "tti-dark": 64,
      "tti-hc": 64
    }
  },
  {
    "name": "layout/content-max",
    "cssToken": "--layout-content-max",
    "resolvedType": "FLOAT",
    "description": "TUX canonical token --layout-content-max",
    "scopes": [
      "GAP",
      "WIDTH_HEIGHT"
    ],
    "codeSyntax": {
      "WEB": "var(--layout-content-max)",
      "ANDROID": "TuxTokens.Tti.LAYOUT_CONTENT_MAX",
      "iOS": "TuxTokens.Tti.layoutContentMax"
    },
    "valuesByMode": {
      "tti": 1280,
      "tti-dark": 1280,
      "tti-hc": 1280
    }
  },
  {
    "name": "layout/content-wide",
    "cssToken": "--layout-content-wide",
    "resolvedType": "FLOAT",
    "description": "TUX canonical token --layout-content-wide",
    "scopes": [
      "GAP",
      "WIDTH_HEIGHT"
    ],
    "codeSyntax": {
      "WEB": "var(--layout-content-wide)",
      "ANDROID": "TuxTokens.Tti.LAYOUT_CONTENT_WIDE",
      "iOS": "TuxTokens.Tti.layoutContentWide"
    },
    "valuesByMode": {
      "tti": 1536,
      "tti-dark": 1536,
      "tti-hc": 1536
    }
  },
  {
    "name": "layout/prose-max",
    "cssToken": "--layout-prose-max",
    "resolvedType": "FLOAT",
    "description": "TUX canonical token --layout-prose-max",
    "scopes": [
      "GAP",
      "WIDTH_HEIGHT"
    ],
    "codeSyntax": {
      "WEB": "var(--layout-prose-max)",
      "ANDROID": "TuxTokens.Tti.LAYOUT_PROSE_MAX",
      "iOS": "TuxTokens.Tti.layoutProseMax"
    },
    "valuesByMode": {
      "tti": 612,
      "tti-dark": 612,
      "tti-hc": 612
    }
  },
  {
    "name": "rhythm/tight",
    "cssToken": "--rhythm-tight",
    "resolvedType": "FLOAT",
    "description": "TUX canonical token --rhythm-tight",
    "scopes": [
      "GAP",
      "WIDTH_HEIGHT"
    ],
    "codeSyntax": {
      "WEB": "var(--rhythm-tight)",
      "ANDROID": "TuxTokens.Tti.RHYTHM_TIGHT",
      "iOS": "TuxTokens.Tti.rhythmTight"
    },
    "valuesByMode": {
      "tti": 4,
      "tti-dark": 4,
      "tti-hc": 4
    }
  },
  {
    "name": "rhythm/snug",
    "cssToken": "--rhythm-snug",
    "resolvedType": "FLOAT",
    "description": "TUX canonical token --rhythm-snug",
    "scopes": [
      "GAP",
      "WIDTH_HEIGHT"
    ],
    "codeSyntax": {
      "WEB": "var(--rhythm-snug)",
      "ANDROID": "TuxTokens.Tti.RHYTHM_SNUG",
      "iOS": "TuxTokens.Tti.rhythmSnug"
    },
    "valuesByMode": {
      "tti": 8,
      "tti-dark": 8,
      "tti-hc": 8
    }
  },
  {
    "name": "rhythm/normal",
    "cssToken": "--rhythm-normal",
    "resolvedType": "FLOAT",
    "description": "TUX canonical token --rhythm-normal",
    "scopes": [
      "GAP",
      "WIDTH_HEIGHT"
    ],
    "codeSyntax": {
      "WEB": "var(--rhythm-normal)",
      "ANDROID": "TuxTokens.Tti.RHYTHM_NORMAL",
      "iOS": "TuxTokens.Tti.rhythmNormal"
    },
    "valuesByMode": {
      "tti": 12,
      "tti-dark": 12,
      "tti-hc": 12
    }
  },
  {
    "name": "rhythm/loose",
    "cssToken": "--rhythm-loose",
    "resolvedType": "FLOAT",
    "description": "TUX canonical token --rhythm-loose",
    "scopes": [
      "GAP",
      "WIDTH_HEIGHT"
    ],
    "codeSyntax": {
      "WEB": "var(--rhythm-loose)",
      "ANDROID": "TuxTokens.Tti.RHYTHM_LOOSE",
      "iOS": "TuxTokens.Tti.rhythmLoose"
    },
    "valuesByMode": {
      "tti": 16,
      "tti-dark": 16,
      "tti-hc": 16
    }
  },
  {
    "name": "rhythm/roomy",
    "cssToken": "--rhythm-roomy",
    "resolvedType": "FLOAT",
    "description": "TUX canonical token --rhythm-roomy",
    "scopes": [
      "GAP",
      "WIDTH_HEIGHT"
    ],
    "codeSyntax": {
      "WEB": "var(--rhythm-roomy)",
      "ANDROID": "TuxTokens.Tti.RHYTHM_ROOMY",
      "iOS": "TuxTokens.Tti.rhythmRoomy"
    },
    "valuesByMode": {
      "tti": 24,
      "tti-dark": 24,
      "tti-hc": 24
    }
  },
  {
    "name": "wash/brand-4",
    "cssToken": "--wash-brand-4",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --wash-brand-4",
    "scopes": [
      "FRAME_FILL",
      "SHAPE_FILL"
    ],
    "codeSyntax": {
      "WEB": "var(--wash-brand-4)",
      "ANDROID": "TuxTokens.Tti.WASH_BRAND_4",
      "iOS": "TuxTokens.Tti.washBrand4"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#5C0025",
        "rgba": {
          "r": 0.3608,
          "g": 0,
          "b": 0.1451,
          "a": 0.04
        }
      },
      "tti-dark": {
        "hex": "#6BB4C0",
        "rgba": {
          "r": 0.4196,
          "g": 0.7059,
          "b": 0.7529,
          "a": 0.04
        }
      },
      "tti-hc": {
        "hex": "#500000",
        "rgba": {
          "r": 0.3137,
          "g": 0,
          "b": 0,
          "a": 0.04
        }
      }
    }
  },
  {
    "name": "wash/brand-6",
    "cssToken": "--wash-brand-6",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --wash-brand-6",
    "scopes": [
      "FRAME_FILL",
      "SHAPE_FILL"
    ],
    "codeSyntax": {
      "WEB": "var(--wash-brand-6)",
      "ANDROID": "TuxTokens.Tti.WASH_BRAND_6",
      "iOS": "TuxTokens.Tti.washBrand6"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#5C0025",
        "rgba": {
          "r": 0.3608,
          "g": 0,
          "b": 0.1451,
          "a": 0.06
        }
      },
      "tti-dark": {
        "hex": "#6BB4C0",
        "rgba": {
          "r": 0.4196,
          "g": 0.7059,
          "b": 0.7529,
          "a": 0.06
        }
      },
      "tti-hc": {
        "hex": "#500000",
        "rgba": {
          "r": 0.3137,
          "g": 0,
          "b": 0,
          "a": 0.06
        }
      }
    }
  },
  {
    "name": "wash/brand-8",
    "cssToken": "--wash-brand-8",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --wash-brand-8",
    "scopes": [
      "FRAME_FILL",
      "SHAPE_FILL"
    ],
    "codeSyntax": {
      "WEB": "var(--wash-brand-8)",
      "ANDROID": "TuxTokens.Tti.WASH_BRAND_8",
      "iOS": "TuxTokens.Tti.washBrand8"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#5C0025",
        "rgba": {
          "r": 0.3608,
          "g": 0,
          "b": 0.1451,
          "a": 0.08
        }
      },
      "tti-dark": {
        "hex": "#6BB4C0",
        "rgba": {
          "r": 0.4196,
          "g": 0.7059,
          "b": 0.7529,
          "a": 0.08
        }
      },
      "tti-hc": {
        "hex": "#500000",
        "rgba": {
          "r": 0.3137,
          "g": 0,
          "b": 0,
          "a": 0.08
        }
      }
    }
  },
  {
    "name": "wash/brand-12",
    "cssToken": "--wash-brand-12",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --wash-brand-12",
    "scopes": [
      "FRAME_FILL",
      "SHAPE_FILL"
    ],
    "codeSyntax": {
      "WEB": "var(--wash-brand-12)",
      "ANDROID": "TuxTokens.Tti.WASH_BRAND_12",
      "iOS": "TuxTokens.Tti.washBrand12"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#5C0025",
        "rgba": {
          "r": 0.3608,
          "g": 0,
          "b": 0.1451,
          "a": 0.12
        }
      },
      "tti-dark": {
        "hex": "#6BB4C0",
        "rgba": {
          "r": 0.4196,
          "g": 0.7059,
          "b": 0.7529,
          "a": 0.12
        }
      },
      "tti-hc": {
        "hex": "#500000",
        "rgba": {
          "r": 0.3137,
          "g": 0,
          "b": 0,
          "a": 0.12
        }
      }
    }
  },
  {
    "name": "wash/brand-18",
    "cssToken": "--wash-brand-18",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --wash-brand-18",
    "scopes": [
      "FRAME_FILL",
      "SHAPE_FILL"
    ],
    "codeSyntax": {
      "WEB": "var(--wash-brand-18)",
      "ANDROID": "TuxTokens.Tti.WASH_BRAND_18",
      "iOS": "TuxTokens.Tti.washBrand18"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#5C0025",
        "rgba": {
          "r": 0.3608,
          "g": 0,
          "b": 0.1451,
          "a": 0.18
        }
      },
      "tti-dark": {
        "hex": "#6BB4C0",
        "rgba": {
          "r": 0.4196,
          "g": 0.7059,
          "b": 0.7529,
          "a": 0.18
        }
      },
      "tti-hc": {
        "hex": "#500000",
        "rgba": {
          "r": 0.3137,
          "g": 0,
          "b": 0,
          "a": 0.18
        }
      }
    }
  },
  {
    "name": "wash/brand-22",
    "cssToken": "--wash-brand-22",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --wash-brand-22",
    "scopes": [
      "FRAME_FILL",
      "SHAPE_FILL"
    ],
    "codeSyntax": {
      "WEB": "var(--wash-brand-22)",
      "ANDROID": "TuxTokens.Tti.WASH_BRAND_22",
      "iOS": "TuxTokens.Tti.washBrand22"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#5C0025",
        "rgba": {
          "r": 0.3608,
          "g": 0,
          "b": 0.1451,
          "a": 0.22
        }
      },
      "tti-dark": {
        "hex": "#6BB4C0",
        "rgba": {
          "r": 0.4196,
          "g": 0.7059,
          "b": 0.7529,
          "a": 0.22
        }
      },
      "tti-hc": {
        "hex": "#500000",
        "rgba": {
          "r": 0.3137,
          "g": 0,
          "b": 0,
          "a": 0.22
        }
      }
    }
  },
  {
    "name": "wash/brand-35",
    "cssToken": "--wash-brand-35",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --wash-brand-35",
    "scopes": [
      "FRAME_FILL",
      "SHAPE_FILL"
    ],
    "codeSyntax": {
      "WEB": "var(--wash-brand-35)",
      "ANDROID": "TuxTokens.Tti.WASH_BRAND_35",
      "iOS": "TuxTokens.Tti.washBrand35"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#5C0025",
        "rgba": {
          "r": 0.3608,
          "g": 0,
          "b": 0.1451,
          "a": 0.35
        }
      },
      "tti-dark": {
        "hex": "#6BB4C0",
        "rgba": {
          "r": 0.4196,
          "g": 0.7059,
          "b": 0.7529,
          "a": 0.35
        }
      },
      "tti-hc": {
        "hex": "#500000",
        "rgba": {
          "r": 0.3137,
          "g": 0,
          "b": 0,
          "a": 0.35
        }
      }
    }
  },
  {
    "name": "color/maroon-50",
    "cssToken": "--color-maroon-50",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --color-maroon-50",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--color-maroon-50)",
      "ANDROID": "TuxTokens.Tti.COLOR_MAROON_50",
      "iOS": "TuxTokens.Tti.colorMaroon50"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#FBF3F6",
        "rgba": {
          "r": 0.9843,
          "g": 0.9529,
          "b": 0.9647,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#FBF3F6",
        "rgba": {
          "r": 0.9843,
          "g": 0.9529,
          "b": 0.9647,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#FBF3F6",
        "rgba": {
          "r": 0.9843,
          "g": 0.9529,
          "b": 0.9647,
          "a": 1
        }
      }
    }
  },
  {
    "name": "color/maroon-100",
    "cssToken": "--color-maroon-100",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --color-maroon-100",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--color-maroon-100)",
      "ANDROID": "TuxTokens.Tti.COLOR_MAROON_100",
      "iOS": "TuxTokens.Tti.colorMaroon100"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#F5E0E7",
        "rgba": {
          "r": 0.9608,
          "g": 0.8784,
          "b": 0.9059,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#F5E0E7",
        "rgba": {
          "r": 0.9608,
          "g": 0.8784,
          "b": 0.9059,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#F5E0E7",
        "rgba": {
          "r": 0.9608,
          "g": 0.8784,
          "b": 0.9059,
          "a": 1
        }
      }
    }
  },
  {
    "name": "color/maroon-200",
    "cssToken": "--color-maroon-200",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --color-maroon-200",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--color-maroon-200)",
      "ANDROID": "TuxTokens.Tti.COLOR_MAROON_200",
      "iOS": "TuxTokens.Tti.colorMaroon200"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#EAB5C3",
        "rgba": {
          "r": 0.9176,
          "g": 0.7098,
          "b": 0.7647,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#EAB5C3",
        "rgba": {
          "r": 0.9176,
          "g": 0.7098,
          "b": 0.7647,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#EAB5C3",
        "rgba": {
          "r": 0.9176,
          "g": 0.7098,
          "b": 0.7647,
          "a": 1
        }
      }
    }
  },
  {
    "name": "color/maroon-300",
    "cssToken": "--color-maroon-300",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --color-maroon-300",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--color-maroon-300)",
      "ANDROID": "TuxTokens.Tti.COLOR_MAROON_300",
      "iOS": "TuxTokens.Tti.colorMaroon300"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#DB859E",
        "rgba": {
          "r": 0.8588,
          "g": 0.5216,
          "b": 0.6196,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#DB859E",
        "rgba": {
          "r": 0.8588,
          "g": 0.5216,
          "b": 0.6196,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#DB859E",
        "rgba": {
          "r": 0.8588,
          "g": 0.5216,
          "b": 0.6196,
          "a": 1
        }
      }
    }
  },
  {
    "name": "color/maroon-400",
    "cssToken": "--color-maroon-400",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --color-maroon-400",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--color-maroon-400)",
      "ANDROID": "TuxTokens.Tti.COLOR_MAROON_400",
      "iOS": "TuxTokens.Tti.colorMaroon400"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#B14A6C",
        "rgba": {
          "r": 0.6941,
          "g": 0.2902,
          "b": 0.4235,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#6BB4C0",
        "rgba": {
          "r": 0.4196,
          "g": 0.7059,
          "b": 0.7529,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#500000",
        "rgba": {
          "r": 0.3137,
          "g": 0,
          "b": 0,
          "a": 1
        }
      }
    }
  },
  {
    "name": "color/maroon-500",
    "cssToken": "--color-maroon-500",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --color-maroon-500",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--color-maroon-500)",
      "ANDROID": "TuxTokens.Tti.COLOR_MAROON_500",
      "iOS": "TuxTokens.Tti.colorMaroon500"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#5C0025",
        "rgba": {
          "r": 0.3608,
          "g": 0,
          "b": 0.1451,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#5C0025",
        "rgba": {
          "r": 0.3608,
          "g": 0,
          "b": 0.1451,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#500000",
        "rgba": {
          "r": 0.3137,
          "g": 0,
          "b": 0,
          "a": 1
        }
      }
    }
  },
  {
    "name": "color/maroon-600",
    "cssToken": "--color-maroon-600",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --color-maroon-600",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--color-maroon-600)",
      "ANDROID": "TuxTokens.Tti.COLOR_MAROON_600",
      "iOS": "TuxTokens.Tti.colorMaroon600"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#4D001F",
        "rgba": {
          "r": 0.302,
          "g": 0,
          "b": 0.1216,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#4D001F",
        "rgba": {
          "r": 0.302,
          "g": 0,
          "b": 0.1216,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#4D001F",
        "rgba": {
          "r": 0.302,
          "g": 0,
          "b": 0.1216,
          "a": 1
        }
      }
    }
  },
  {
    "name": "color/maroon-700",
    "cssToken": "--color-maroon-700",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --color-maroon-700",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--color-maroon-700)",
      "ANDROID": "TuxTokens.Tti.COLOR_MAROON_700",
      "iOS": "TuxTokens.Tti.colorMaroon700"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#3D0018",
        "rgba": {
          "r": 0.2392,
          "g": 0,
          "b": 0.0941,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#3D0018",
        "rgba": {
          "r": 0.2392,
          "g": 0,
          "b": 0.0941,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#3D0018",
        "rgba": {
          "r": 0.2392,
          "g": 0,
          "b": 0.0941,
          "a": 1
        }
      }
    }
  },
  {
    "name": "color/maroon-800",
    "cssToken": "--color-maroon-800",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --color-maroon-800",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--color-maroon-800)",
      "ANDROID": "TuxTokens.Tti.COLOR_MAROON_800",
      "iOS": "TuxTokens.Tti.colorMaroon800"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#2E0012",
        "rgba": {
          "r": 0.1804,
          "g": 0,
          "b": 0.0706,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#2E0012",
        "rgba": {
          "r": 0.1804,
          "g": 0,
          "b": 0.0706,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#2E0012",
        "rgba": {
          "r": 0.1804,
          "g": 0,
          "b": 0.0706,
          "a": 1
        }
      }
    }
  },
  {
    "name": "color/maroon-900",
    "cssToken": "--color-maroon-900",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --color-maroon-900",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--color-maroon-900)",
      "ANDROID": "TuxTokens.Tti.COLOR_MAROON_900",
      "iOS": "TuxTokens.Tti.colorMaroon900"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#1F000C",
        "rgba": {
          "r": 0.1216,
          "g": 0,
          "b": 0.0471,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#1F000C",
        "rgba": {
          "r": 0.1216,
          "g": 0,
          "b": 0.0471,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#1F000C",
        "rgba": {
          "r": 0.1216,
          "g": 0,
          "b": 0.0471,
          "a": 1
        }
      }
    }
  },
  {
    "name": "color/maroon-950",
    "cssToken": "--color-maroon-950",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --color-maroon-950",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--color-maroon-950)",
      "ANDROID": "TuxTokens.Tti.COLOR_MAROON_950",
      "iOS": "TuxTokens.Tti.colorMaroon950"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#150008",
        "rgba": {
          "r": 0.0824,
          "g": 0,
          "b": 0.0314,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#150008",
        "rgba": {
          "r": 0.0824,
          "g": 0,
          "b": 0.0314,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#150008",
        "rgba": {
          "r": 0.0824,
          "g": 0,
          "b": 0.0314,
          "a": 1
        }
      }
    }
  },
  {
    "name": "color/gold-50",
    "cssToken": "--color-gold-50",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --color-gold-50",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--color-gold-50)",
      "ANDROID": "TuxTokens.Tti.COLOR_GOLD_50",
      "iOS": "TuxTokens.Tti.colorGold50"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#FDF9EE",
        "rgba": {
          "r": 0.9922,
          "g": 0.9765,
          "b": 0.9333,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#FDF9EE",
        "rgba": {
          "r": 0.9922,
          "g": 0.9765,
          "b": 0.9333,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#FDF9EE",
        "rgba": {
          "r": 0.9922,
          "g": 0.9765,
          "b": 0.9333,
          "a": 1
        }
      }
    }
  },
  {
    "name": "color/gold-100",
    "cssToken": "--color-gold-100",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --color-gold-100",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--color-gold-100)",
      "ANDROID": "TuxTokens.Tti.COLOR_GOLD_100",
      "iOS": "TuxTokens.Tti.colorGold100"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#FAF0D2",
        "rgba": {
          "r": 0.9804,
          "g": 0.9412,
          "b": 0.8235,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#FAF0D2",
        "rgba": {
          "r": 0.9804,
          "g": 0.9412,
          "b": 0.8235,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#FAF0D2",
        "rgba": {
          "r": 0.9804,
          "g": 0.9412,
          "b": 0.8235,
          "a": 1
        }
      }
    }
  },
  {
    "name": "color/gold-200",
    "cssToken": "--color-gold-200",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --color-gold-200",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--color-gold-200)",
      "ANDROID": "TuxTokens.Tti.COLOR_GOLD_200",
      "iOS": "TuxTokens.Tti.colorGold200"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#F4DFA1",
        "rgba": {
          "r": 0.9569,
          "g": 0.8745,
          "b": 0.6314,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#F4DFA1",
        "rgba": {
          "r": 0.9569,
          "g": 0.8745,
          "b": 0.6314,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#F4DFA1",
        "rgba": {
          "r": 0.9569,
          "g": 0.8745,
          "b": 0.6314,
          "a": 1
        }
      }
    }
  },
  {
    "name": "color/gold-300",
    "cssToken": "--color-gold-300",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --color-gold-300",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--color-gold-300)",
      "ANDROID": "TuxTokens.Tti.COLOR_GOLD_300",
      "iOS": "TuxTokens.Tti.colorGold300"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#ECCA6F",
        "rgba": {
          "r": 0.9255,
          "g": 0.7922,
          "b": 0.4353,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#ECCA6F",
        "rgba": {
          "r": 0.9255,
          "g": 0.7922,
          "b": 0.4353,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#ECCA6F",
        "rgba": {
          "r": 0.9255,
          "g": 0.7922,
          "b": 0.4353,
          "a": 1
        }
      }
    }
  },
  {
    "name": "color/gold-400",
    "cssToken": "--color-gold-400",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --color-gold-400",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--color-gold-400)",
      "ANDROID": "TuxTokens.Tti.COLOR_GOLD_400",
      "iOS": "TuxTokens.Tti.colorGold400"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#E3BA4F",
        "rgba": {
          "r": 0.8902,
          "g": 0.7294,
          "b": 0.3098,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#E3BA4F",
        "rgba": {
          "r": 0.8902,
          "g": 0.7294,
          "b": 0.3098,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#E3BA4F",
        "rgba": {
          "r": 0.8902,
          "g": 0.7294,
          "b": 0.3098,
          "a": 1
        }
      }
    }
  },
  {
    "name": "color/gold-500",
    "cssToken": "--color-gold-500",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --color-gold-500",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--color-gold-500)",
      "ANDROID": "TuxTokens.Tti.COLOR_GOLD_500",
      "iOS": "TuxTokens.Tti.colorGold500"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#DDAC37",
        "rgba": {
          "r": 0.8667,
          "g": 0.6745,
          "b": 0.2157,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#DDAC37",
        "rgba": {
          "r": 0.8667,
          "g": 0.6745,
          "b": 0.2157,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#DDAC37",
        "rgba": {
          "r": 0.8667,
          "g": 0.6745,
          "b": 0.2157,
          "a": 1
        }
      }
    }
  },
  {
    "name": "color/gold-600",
    "cssToken": "--color-gold-600",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --color-gold-600",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--color-gold-600)",
      "ANDROID": "TuxTokens.Tti.COLOR_GOLD_600",
      "iOS": "TuxTokens.Tti.colorGold600"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#B58A23",
        "rgba": {
          "r": 0.7098,
          "g": 0.5412,
          "b": 0.1373,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#B58A23",
        "rgba": {
          "r": 0.7098,
          "g": 0.5412,
          "b": 0.1373,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#B58A23",
        "rgba": {
          "r": 0.7098,
          "g": 0.5412,
          "b": 0.1373,
          "a": 1
        }
      }
    }
  },
  {
    "name": "color/gold-700",
    "cssToken": "--color-gold-700",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --color-gold-700",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--color-gold-700)",
      "ANDROID": "TuxTokens.Tti.COLOR_GOLD_700",
      "iOS": "TuxTokens.Tti.colorGold700"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#8A691B",
        "rgba": {
          "r": 0.5412,
          "g": 0.4118,
          "b": 0.1059,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#8A691B",
        "rgba": {
          "r": 0.5412,
          "g": 0.4118,
          "b": 0.1059,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#8A691B",
        "rgba": {
          "r": 0.5412,
          "g": 0.4118,
          "b": 0.1059,
          "a": 1
        }
      }
    }
  },
  {
    "name": "color/gold-800",
    "cssToken": "--color-gold-800",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --color-gold-800",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--color-gold-800)",
      "ANDROID": "TuxTokens.Tti.COLOR_GOLD_800",
      "iOS": "TuxTokens.Tti.colorGold800"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#604812",
        "rgba": {
          "r": 0.3765,
          "g": 0.2824,
          "b": 0.0706,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#604812",
        "rgba": {
          "r": 0.3765,
          "g": 0.2824,
          "b": 0.0706,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#604812",
        "rgba": {
          "r": 0.3765,
          "g": 0.2824,
          "b": 0.0706,
          "a": 1
        }
      }
    }
  },
  {
    "name": "color/gold-900",
    "cssToken": "--color-gold-900",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --color-gold-900",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--color-gold-900)",
      "ANDROID": "TuxTokens.Tti.COLOR_GOLD_900",
      "iOS": "TuxTokens.Tti.colorGold900"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#3F300B",
        "rgba": {
          "r": 0.2471,
          "g": 0.1882,
          "b": 0.0431,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#3F300B",
        "rgba": {
          "r": 0.2471,
          "g": 0.1882,
          "b": 0.0431,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#3F300B",
        "rgba": {
          "r": 0.2471,
          "g": 0.1882,
          "b": 0.0431,
          "a": 1
        }
      }
    }
  },
  {
    "name": "color/gold-950",
    "cssToken": "--color-gold-950",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --color-gold-950",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--color-gold-950)",
      "ANDROID": "TuxTokens.Tti.COLOR_GOLD_950",
      "iOS": "TuxTokens.Tti.colorGold950"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#271E07",
        "rgba": {
          "r": 0.1529,
          "g": 0.1176,
          "b": 0.0275,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#271E07",
        "rgba": {
          "r": 0.1529,
          "g": 0.1176,
          "b": 0.0275,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#271E07",
        "rgba": {
          "r": 0.1529,
          "g": 0.1176,
          "b": 0.0275,
          "a": 1
        }
      }
    }
  },
  {
    "name": "chart/1",
    "cssToken": "--chart-1",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --chart-1",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--chart-1)",
      "ANDROID": "TuxTokens.Tti.CHART_1",
      "iOS": "TuxTokens.Tti.chart1"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#5C0025",
        "rgba": {
          "r": 0.3608,
          "g": 0,
          "b": 0.1451,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#C47585",
        "rgba": {
          "r": 0.7686,
          "g": 0.4588,
          "b": 0.5216,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#000000",
        "rgba": {
          "r": 0,
          "g": 0,
          "b": 0,
          "a": 1
        }
      }
    }
  },
  {
    "name": "chart/2",
    "cssToken": "--chart-2",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --chart-2",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--chart-2)",
      "ANDROID": "TuxTokens.Tti.CHART_2",
      "iOS": "TuxTokens.Tti.chart2"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#3F5A6F",
        "rgba": {
          "r": 0.2471,
          "g": 0.3529,
          "b": 0.4353,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#6B8DA3",
        "rgba": {
          "r": 0.4196,
          "g": 0.5529,
          "b": 0.6392,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#500000",
        "rgba": {
          "r": 0.3137,
          "g": 0,
          "b": 0,
          "a": 1
        }
      }
    }
  },
  {
    "name": "chart/3",
    "cssToken": "--chart-3",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --chart-3",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--chart-3)",
      "ANDROID": "TuxTokens.Tti.CHART_3",
      "iOS": "TuxTokens.Tti.chart3"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#C7973C",
        "rgba": {
          "r": 0.7804,
          "g": 0.5922,
          "b": 0.2353,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#E0BC60",
        "rgba": {
          "r": 0.8784,
          "g": 0.7373,
          "b": 0.3765,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#5D5D5D",
        "rgba": {
          "r": 0.3647,
          "g": 0.3647,
          "b": 0.3647,
          "a": 1
        }
      }
    }
  },
  {
    "name": "chart/4",
    "cssToken": "--chart-4",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --chart-4",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--chart-4)",
      "ANDROID": "TuxTokens.Tti.CHART_4",
      "iOS": "TuxTokens.Tti.chart4"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#6B8E5A",
        "rgba": {
          "r": 0.4196,
          "g": 0.5569,
          "b": 0.3529,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#93B57E",
        "rgba": {
          "r": 0.5765,
          "g": 0.7098,
          "b": 0.4941,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#8A6915",
        "rgba": {
          "r": 0.5412,
          "g": 0.4118,
          "b": 0.0824,
          "a": 1
        }
      }
    }
  },
  {
    "name": "chart/5",
    "cssToken": "--chart-5",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --chart-5",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--chart-5)",
      "ANDROID": "TuxTokens.Tti.CHART_5",
      "iOS": "TuxTokens.Tti.chart5"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#8C5A3C",
        "rgba": {
          "r": 0.549,
          "g": 0.3529,
          "b": 0.2353,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#B58463",
        "rgba": {
          "r": 0.7098,
          "g": 0.5176,
          "b": 0.3882,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#4A4A4A",
        "rgba": {
          "r": 0.2902,
          "g": 0.2902,
          "b": 0.2902,
          "a": 1
        }
      }
    }
  },
  {
    "name": "chart/6",
    "cssToken": "--chart-6",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --chart-6",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--chart-6)",
      "ANDROID": "TuxTokens.Tti.CHART_6",
      "iOS": "TuxTokens.Tti.chart6"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#5C7080",
        "rgba": {
          "r": 0.3608,
          "g": 0.4392,
          "b": 0.502,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#8AA0B2",
        "rgba": {
          "r": 0.5412,
          "g": 0.6275,
          "b": 0.698,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#1F5D66",
        "rgba": {
          "r": 0.1216,
          "g": 0.3647,
          "b": 0.4,
          "a": 1
        }
      }
    }
  },
  {
    "name": "chart/7",
    "cssToken": "--chart-7",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --chart-7",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--chart-7)",
      "ANDROID": "TuxTokens.Tti.CHART_7",
      "iOS": "TuxTokens.Tti.chart7"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#A33A3A",
        "rgba": {
          "r": 0.6392,
          "g": 0.2275,
          "b": 0.2275,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#D67272",
        "rgba": {
          "r": 0.8392,
          "g": 0.4471,
          "b": 0.4471,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#6B0000",
        "rgba": {
          "r": 0.4196,
          "g": 0,
          "b": 0,
          "a": 1
        }
      }
    }
  },
  {
    "name": "chart/8",
    "cssToken": "--chart-8",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --chart-8",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--chart-8)",
      "ANDROID": "TuxTokens.Tti.CHART_8",
      "iOS": "TuxTokens.Tti.chart8"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#3C5A87",
        "rgba": {
          "r": 0.2353,
          "g": 0.3529,
          "b": 0.5294,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#6E8FBE",
        "rgba": {
          "r": 0.4314,
          "g": 0.5608,
          "b": 0.7451,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#2A2A2A",
        "rgba": {
          "r": 0.1647,
          "g": 0.1647,
          "b": 0.1647,
          "a": 1
        }
      }
    }
  },
  {
    "name": "chart/9",
    "cssToken": "--chart-9",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --chart-9",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--chart-9)",
      "ANDROID": "TuxTokens.Tti.CHART_9",
      "iOS": "TuxTokens.Tti.chart9"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#6E5A7E",
        "rgba": {
          "r": 0.4314,
          "g": 0.3529,
          "b": 0.4941,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#A08CB4",
        "rgba": {
          "r": 0.6275,
          "g": 0.549,
          "b": 0.7059,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#6E5A7E",
        "rgba": {
          "r": 0.4314,
          "g": 0.3529,
          "b": 0.4941,
          "a": 1
        }
      }
    }
  },
  {
    "name": "chart/10",
    "cssToken": "--chart-10",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --chart-10",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--chart-10)",
      "ANDROID": "TuxTokens.Tti.CHART_10",
      "iOS": "TuxTokens.Tti.chart10"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#7E7350",
        "rgba": {
          "r": 0.4941,
          "g": 0.451,
          "b": 0.3137,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#B0A578",
        "rgba": {
          "r": 0.6902,
          "g": 0.6471,
          "b": 0.4706,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#7E7350",
        "rgba": {
          "r": 0.4941,
          "g": 0.451,
          "b": 0.3137,
          "a": 1
        }
      }
    }
  },
  {
    "name": "chart/cvd-1",
    "cssToken": "--chart-cvd-1",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --chart-cvd-1",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--chart-cvd-1)",
      "ANDROID": "TuxTokens.Tti.CHART_CVD_1",
      "iOS": "TuxTokens.Tti.chartCvd1"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#0072B2",
        "rgba": {
          "r": 0,
          "g": 0.4471,
          "b": 0.698,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#56B4E9",
        "rgba": {
          "r": 0.3373,
          "g": 0.7059,
          "b": 0.9137,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#005080",
        "rgba": {
          "r": 0,
          "g": 0.3137,
          "b": 0.502,
          "a": 1
        }
      }
    }
  },
  {
    "name": "chart/cvd-2",
    "cssToken": "--chart-cvd-2",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --chart-cvd-2",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--chart-cvd-2)",
      "ANDROID": "TuxTokens.Tti.CHART_CVD_2",
      "iOS": "TuxTokens.Tti.chartCvd2"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#E69F00",
        "rgba": {
          "r": 0.902,
          "g": 0.6235,
          "b": 0,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#F0B030",
        "rgba": {
          "r": 0.9412,
          "g": 0.6902,
          "b": 0.1882,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#CC8000",
        "rgba": {
          "r": 0.8,
          "g": 0.502,
          "b": 0,
          "a": 1
        }
      }
    }
  },
  {
    "name": "chart/cvd-3",
    "cssToken": "--chart-cvd-3",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --chart-cvd-3",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--chart-cvd-3)",
      "ANDROID": "TuxTokens.Tti.CHART_CVD_3",
      "iOS": "TuxTokens.Tti.chartCvd3"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#009E73",
        "rgba": {
          "r": 0,
          "g": 0.6196,
          "b": 0.451,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#2AC098",
        "rgba": {
          "r": 0.1647,
          "g": 0.7529,
          "b": 0.5961,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#007A55",
        "rgba": {
          "r": 0,
          "g": 0.4784,
          "b": 0.3333,
          "a": 1
        }
      }
    }
  },
  {
    "name": "chart/cvd-4",
    "cssToken": "--chart-cvd-4",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --chart-cvd-4",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--chart-cvd-4)",
      "ANDROID": "TuxTokens.Tti.CHART_CVD_4",
      "iOS": "TuxTokens.Tti.chartCvd4"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#F0E442",
        "rgba": {
          "r": 0.9412,
          "g": 0.8941,
          "b": 0.2588,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#F5EB68",
        "rgba": {
          "r": 0.9608,
          "g": 0.9216,
          "b": 0.4078,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#8A6915",
        "rgba": {
          "r": 0.5412,
          "g": 0.4118,
          "b": 0.0824,
          "a": 1
        }
      }
    }
  },
  {
    "name": "chart/cvd-5",
    "cssToken": "--chart-cvd-5",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --chart-cvd-5",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--chart-cvd-5)",
      "ANDROID": "TuxTokens.Tti.CHART_CVD_5",
      "iOS": "TuxTokens.Tti.chartCvd5"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#56B4E9",
        "rgba": {
          "r": 0.3373,
          "g": 0.7059,
          "b": 0.9137,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#7CD0F7",
        "rgba": {
          "r": 0.4863,
          "g": 0.8157,
          "b": 0.9686,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#1F5D66",
        "rgba": {
          "r": 0.1216,
          "g": 0.3647,
          "b": 0.4,
          "a": 1
        }
      }
    }
  },
  {
    "name": "chart/cvd-6",
    "cssToken": "--chart-cvd-6",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --chart-cvd-6",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--chart-cvd-6)",
      "ANDROID": "TuxTokens.Tti.CHART_CVD_6",
      "iOS": "TuxTokens.Tti.chartCvd6"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#D55E00",
        "rgba": {
          "r": 0.8353,
          "g": 0.3686,
          "b": 0,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#E87A28",
        "rgba": {
          "r": 0.9098,
          "g": 0.4784,
          "b": 0.1569,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#B34000",
        "rgba": {
          "r": 0.702,
          "g": 0.251,
          "b": 0,
          "a": 1
        }
      }
    }
  },
  {
    "name": "chart/cvd-7",
    "cssToken": "--chart-cvd-7",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --chart-cvd-7",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--chart-cvd-7)",
      "ANDROID": "TuxTokens.Tti.CHART_CVD_7",
      "iOS": "TuxTokens.Tti.chartCvd7"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#CC79A7",
        "rgba": {
          "r": 0.8,
          "g": 0.4745,
          "b": 0.6549,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#DE91BD",
        "rgba": {
          "r": 0.8706,
          "g": 0.5686,
          "b": 0.7412,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#803366",
        "rgba": {
          "r": 0.502,
          "g": 0.2,
          "b": 0.4,
          "a": 1
        }
      }
    }
  },
  {
    "name": "chart/cvd-8",
    "cssToken": "--chart-cvd-8",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --chart-cvd-8",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--chart-cvd-8)",
      "ANDROID": "TuxTokens.Tti.CHART_CVD_8",
      "iOS": "TuxTokens.Tti.chartCvd8"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#222222",
        "rgba": {
          "r": 0.1333,
          "g": 0.1333,
          "b": 0.1333,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#E6E6E6",
        "rgba": {
          "r": 0.902,
          "g": 0.902,
          "b": 0.902,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#000000",
        "rgba": {
          "r": 0,
          "g": 0,
          "b": 0,
          "a": 1
        }
      }
    }
  },
  {
    "name": "map/seq-maroon-1",
    "cssToken": "--map-seq-maroon-1",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --map-seq-maroon-1",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--map-seq-maroon-1)",
      "ANDROID": "TuxTokens.Tti.MAP_SEQ_MAROON_1",
      "iOS": "TuxTokens.Tti.mapSeqMaroon1"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#F1E4E0",
        "rgba": {
          "r": 0.9451,
          "g": 0.8941,
          "b": 0.8784,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#3D1110",
        "rgba": {
          "r": 0.2392,
          "g": 0.0667,
          "b": 0.0627,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#FFFFFF",
        "rgba": {
          "r": 1,
          "g": 1,
          "b": 1,
          "a": 1
        }
      }
    }
  },
  {
    "name": "map/seq-maroon-2",
    "cssToken": "--map-seq-maroon-2",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --map-seq-maroon-2",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--map-seq-maroon-2)",
      "ANDROID": "TuxTokens.Tti.MAP_SEQ_MAROON_2",
      "iOS": "TuxTokens.Tti.mapSeqMaroon2"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#DDB7AC",
        "rgba": {
          "r": 0.8667,
          "g": 0.7176,
          "b": 0.6745,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#702C28",
        "rgba": {
          "r": 0.4392,
          "g": 0.1725,
          "b": 0.1569,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#C8C8C8",
        "rgba": {
          "r": 0.7843,
          "g": 0.7843,
          "b": 0.7843,
          "a": 1
        }
      }
    }
  },
  {
    "name": "map/seq-maroon-3",
    "cssToken": "--map-seq-maroon-3",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --map-seq-maroon-3",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--map-seq-maroon-3)",
      "ANDROID": "TuxTokens.Tti.MAP_SEQ_MAROON_3",
      "iOS": "TuxTokens.Tti.mapSeqMaroon3"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#C58675",
        "rgba": {
          "r": 0.7725,
          "g": 0.5255,
          "b": 0.4588,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#A14A3D",
        "rgba": {
          "r": 0.6314,
          "g": 0.2902,
          "b": 0.2392,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#8A8A8A",
        "rgba": {
          "r": 0.5412,
          "g": 0.5412,
          "b": 0.5412,
          "a": 1
        }
      }
    }
  },
  {
    "name": "map/seq-maroon-4",
    "cssToken": "--map-seq-maroon-4",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --map-seq-maroon-4",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--map-seq-maroon-4)",
      "ANDROID": "TuxTokens.Tti.MAP_SEQ_MAROON_4",
      "iOS": "TuxTokens.Tti.mapSeqMaroon4"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#9E483A",
        "rgba": {
          "r": 0.6196,
          "g": 0.2824,
          "b": 0.2275,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#C97058",
        "rgba": {
          "r": 0.7882,
          "g": 0.4392,
          "b": 0.3451,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#4A4A4A",
        "rgba": {
          "r": 0.2902,
          "g": 0.2902,
          "b": 0.2902,
          "a": 1
        }
      }
    }
  },
  {
    "name": "map/seq-maroon-5",
    "cssToken": "--map-seq-maroon-5",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --map-seq-maroon-5",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--map-seq-maroon-5)",
      "ANDROID": "TuxTokens.Tti.MAP_SEQ_MAROON_5",
      "iOS": "TuxTokens.Tti.mapSeqMaroon5"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#500000",
        "rgba": {
          "r": 0.3137,
          "g": 0,
          "b": 0,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#E89B7E",
        "rgba": {
          "r": 0.9098,
          "g": 0.6078,
          "b": 0.4941,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#000000",
        "rgba": {
          "r": 0,
          "g": 0,
          "b": 0,
          "a": 1
        }
      }
    }
  },
  {
    "name": "map/seq-slate-1",
    "cssToken": "--map-seq-slate-1",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --map-seq-slate-1",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--map-seq-slate-1)",
      "ANDROID": "TuxTokens.Tti.MAP_SEQ_SLATE_1",
      "iOS": "TuxTokens.Tti.mapSeqSlate1"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#E2E7EC",
        "rgba": {
          "r": 0.8863,
          "g": 0.9059,
          "b": 0.9255,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#1A2129",
        "rgba": {
          "r": 0.102,
          "g": 0.1294,
          "b": 0.1608,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#FFFFFF",
        "rgba": {
          "r": 1,
          "g": 1,
          "b": 1,
          "a": 1
        }
      }
    }
  },
  {
    "name": "map/seq-slate-2",
    "cssToken": "--map-seq-slate-2",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --map-seq-slate-2",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--map-seq-slate-2)",
      "ANDROID": "TuxTokens.Tti.MAP_SEQ_SLATE_2",
      "iOS": "TuxTokens.Tti.mapSeqSlate2"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#B7C2CC",
        "rgba": {
          "r": 0.7176,
          "g": 0.7608,
          "b": 0.8,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#3F5A6F",
        "rgba": {
          "r": 0.2471,
          "g": 0.3529,
          "b": 0.4353,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#C8C8C8",
        "rgba": {
          "r": 0.7843,
          "g": 0.7843,
          "b": 0.7843,
          "a": 1
        }
      }
    }
  },
  {
    "name": "map/seq-slate-3",
    "cssToken": "--map-seq-slate-3",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --map-seq-slate-3",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--map-seq-slate-3)",
      "ANDROID": "TuxTokens.Tti.MAP_SEQ_SLATE_3",
      "iOS": "TuxTokens.Tti.mapSeqSlate3"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#7E94A4",
        "rgba": {
          "r": 0.4941,
          "g": 0.5804,
          "b": 0.6431,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#6F8294",
        "rgba": {
          "r": 0.4353,
          "g": 0.5098,
          "b": 0.5804,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#8A8A8A",
        "rgba": {
          "r": 0.5412,
          "g": 0.5412,
          "b": 0.5412,
          "a": 1
        }
      }
    }
  },
  {
    "name": "map/seq-slate-4",
    "cssToken": "--map-seq-slate-4",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --map-seq-slate-4",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--map-seq-slate-4)",
      "ANDROID": "TuxTokens.Tti.MAP_SEQ_SLATE_4",
      "iOS": "TuxTokens.Tti.mapSeqSlate4"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#52677A",
        "rgba": {
          "r": 0.3216,
          "g": 0.4039,
          "b": 0.4784,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#9CADBD",
        "rgba": {
          "r": 0.6118,
          "g": 0.6784,
          "b": 0.7412,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#4A4A4A",
        "rgba": {
          "r": 0.2902,
          "g": 0.2902,
          "b": 0.2902,
          "a": 1
        }
      }
    }
  },
  {
    "name": "map/seq-slate-5",
    "cssToken": "--map-seq-slate-5",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --map-seq-slate-5",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--map-seq-slate-5)",
      "ANDROID": "TuxTokens.Tti.MAP_SEQ_SLATE_5",
      "iOS": "TuxTokens.Tti.mapSeqSlate5"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#283544",
        "rgba": {
          "r": 0.1569,
          "g": 0.2078,
          "b": 0.2667,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#C2D0DE",
        "rgba": {
          "r": 0.7608,
          "g": 0.8157,
          "b": 0.8706,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#000000",
        "rgba": {
          "r": 0,
          "g": 0,
          "b": 0,
          "a": 1
        }
      }
    }
  },
  {
    "name": "map/outline",
    "cssToken": "--map-outline",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --map-outline",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--map-outline)",
      "ANDROID": "TuxTokens.Tti.MAP_OUTLINE",
      "iOS": "TuxTokens.Tti.mapOutline"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#E7E6E6",
        "rgba": {
          "r": 0.9059,
          "g": 0.902,
          "b": 0.902,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#FFFFFF",
        "rgba": {
          "r": 1,
          "g": 1,
          "b": 1,
          "a": 0.22
        }
      },
      "tti-hc": {
        "hex": "#000000",
        "rgba": {
          "r": 0,
          "g": 0,
          "b": 0,
          "a": 1
        }
      }
    }
  },
  {
    "name": "map/flow",
    "cssToken": "--map-flow",
    "resolvedType": "COLOR",
    "description": "TUX canonical token --map-flow",
    "scopes": [
      "ALL_FILLS",
      "STROKE_COLOR"
    ],
    "codeSyntax": {
      "WEB": "var(--map-flow)",
      "ANDROID": "TuxTokens.Tti.MAP_FLOW",
      "iOS": "TuxTokens.Tti.mapFlow"
    },
    "valuesByMode": {
      "tti": {
        "hex": "#5C0025",
        "rgba": {
          "r": 0.3608,
          "g": 0,
          "b": 0.1451,
          "a": 1
        }
      },
      "tti-dark": {
        "hex": "#E89B7E",
        "rgba": {
          "r": 0.9098,
          "g": 0.6078,
          "b": 0.4941,
          "a": 1
        }
      },
      "tti-hc": {
        "hex": "#000000",
        "rgba": {
          "r": 0,
          "g": 0,
          "b": 0,
          "a": 1
        }
      }
    }
  }
];
const TUX_COMPONENTS = [
  {
    "name": "TuxAbstract",
    "tagName": "tux-abstract",
    "kind": "component",
    "family": "components",
    "category": "publishing",
    "wraps": "tux native",
    "blurb": "Structured academic abstract block.",
    "route": "/components/abstract",
    "docsUrl": "https://ux.tti.tamu.edu/components/abstract",
    "figmaNodePattern": "TUX / TuxAbstract",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxAbstract />",
      "react": "import { TuxAbstract } from \"@tti/tti-ux-react\";\n\n<TuxAbstract />",
      "webComponents": "<tux-abstract></tux-abstract>",
      "blazor": "<TuxAbstract />",
      "wordpress": "[tux_abstract]"
    }
  },
  {
    "name": "TuxAccordion",
    "tagName": "tux-accordion",
    "kind": "component",
    "family": "components",
    "category": "publishing",
    "wraps": "tux native",
    "blurb": "FAQ + publication disclosure — native details/summary, zero-JS, single-mode + slot composition.",
    "route": "/components/accordion",
    "docsUrl": "https://ux.tti.tamu.edu/components/accordion",
    "figmaNodePattern": "TUX / TuxAccordion",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxAccordion />",
      "react": "import { TuxAccordion } from \"@tti/tti-ux-react\";\n\n<TuxAccordion />",
      "webComponents": "<tux-accordion></tux-accordion>",
      "blazor": "<TuxAccordion />",
      "wordpress": "[tux_accordion]"
    }
  },
  {
    "name": "TuxAcknowledgments",
    "tagName": "tux-acknowledgments",
    "kind": "component",
    "family": "components",
    "category": "publishing",
    "wraps": "tux native",
    "blurb": "Funding + acknowledgments + ethics block.",
    "route": "/components/acknowledgments",
    "docsUrl": "https://ux.tti.tamu.edu/components/acknowledgments",
    "figmaNodePattern": "TUX / TuxAcknowledgments",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxAcknowledgments />",
      "react": "import { TuxAcknowledgments } from \"@tti/tti-ux-react\";\n\n<TuxAcknowledgments />",
      "webComponents": "<tux-acknowledgments></tux-acknowledgments>",
      "blazor": "<TuxAcknowledgments />",
      "wordpress": "[tux_acknowledgments]"
    }
  },
  {
    "name": "TuxActivityTimeline",
    "tagName": "tux-activity-timeline",
    "kind": "component",
    "family": "components",
    "category": "data-display",
    "wraps": "tux native",
    "blurb": "Editorial vertical timeline — maroon spine, mono timestamps, gold-ringed current node. Milestones, ingest feeds, session history.",
    "route": "/components/activity-timeline",
    "docsUrl": "https://ux.tti.tamu.edu/components/activity-timeline",
    "figmaNodePattern": "TUX / TuxActivityTimeline",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxActivityTimeline />",
      "react": "import { TuxActivityTimeline } from \"@tti/tti-ux-react\";\n\n<TuxActivityTimeline />",
      "webComponents": "<tux-activity-timeline></tux-activity-timeline>",
      "blazor": "<TuxActivityTimeline />",
      "wordpress": "[tux_activity_timeline]"
    }
  },
  {
    "name": "TuxAlert",
    "tagName": "tux-alert",
    "kind": "component",
    "family": "components",
    "category": "feedback",
    "wraps": "UAlert",
    "blurb": "Docusaurus-style admonitions — 8 variants including compliance and tip.",
    "route": "/components/alert",
    "docsUrl": "https://ux.tti.tamu.edu/components/alert",
    "figmaNodePattern": "TUX / TuxAlert",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxAlert />",
      "react": "import { TuxAlert } from \"@tti/tti-ux-react\";\n\n<TuxAlert />",
      "webComponents": "<tux-alert></tux-alert>",
      "blazor": "<TuxAlert />",
      "wordpress": "[tux_alert]"
    }
  },
  {
    "name": "TuxAlphaNav",
    "tagName": "tux-alpha-nav",
    "kind": "component",
    "family": "components",
    "category": "navigation",
    "wraps": "tux native",
    "blurb": "A–Z jump bar — anchor mode for in-page jumps, emit mode for filter-in-place.",
    "route": "/components/alpha-nav",
    "docsUrl": "https://ux.tti.tamu.edu/components/alpha-nav",
    "figmaNodePattern": "TUX / TuxAlphaNav",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxAlphaNav />",
      "react": "import { TuxAlphaNav } from \"@tti/tti-ux-react\";\n\n<TuxAlphaNav />",
      "webComponents": "<tux-alpha-nav></tux-alpha-nav>",
      "blazor": "<TuxAlphaNav />",
      "wordpress": "[tux_alpha_nav]"
    }
  },
  {
    "name": "TuxAnnouncementBanner",
    "tagName": "tux-announcement-banner",
    "kind": "component",
    "family": "components",
    "category": "feedback",
    "wraps": "tux native",
    "blurb": "Top-of-page dismissable strip for site-wide notices. localStorage-backed dismissal memory.",
    "route": "/components/announcement-banner",
    "docsUrl": "https://ux.tti.tamu.edu/components/announcement-banner",
    "figmaNodePattern": "TUX / TuxAnnouncementBanner",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxAnnouncementBanner />",
      "react": "import { TuxAnnouncementBanner } from \"@tti/tti-ux-react\";\n\n<TuxAnnouncementBanner />",
      "webComponents": "<tux-announcement-banner></tux-announcement-banner>",
      "blazor": "<TuxAnnouncementBanner />",
      "wordpress": "[tux_announcement_banner]"
    }
  },
  {
    "name": "TuxAppFrame",
    "tagName": "tux-app-frame",
    "kind": "component",
    "family": "components",
    "category": "navigation",
    "wraps": "tux native",
    "blurb": "Custom Tauri titlebar — traffic lights (Mac) / min-max-close (Win/Linux), brand + toolbar slots, drag regions. Replaces native window decoration.",
    "route": "/components/app-frame",
    "docsUrl": "https://ux.tti.tamu.edu/components/app-frame",
    "figmaNodePattern": "TUX / TuxAppFrame",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxAppFrame />",
      "react": "import { TuxAppFrame } from \"@tti/tti-ux-react\";\n\n<TuxAppFrame />",
      "webComponents": "<tux-app-frame></tux-app-frame>",
      "blazor": "<TuxAppFrame />",
      "wordpress": "[tux_app_frame]"
    }
  },
  {
    "name": "TuxAppSwitcher",
    "tagName": "tux-app-switcher",
    "kind": "component",
    "family": "components",
    "category": "actions",
    "wraps": "UPopover",
    "blurb": "Waffle-button popover for hopping between TTI portals — registry-fed via useTuxApps(), registry order everywhere, current tile carries aria-current.",
    "route": "/components/app-switcher",
    "docsUrl": "https://ux.tti.tamu.edu/components/app-switcher",
    "figmaNodePattern": "TUX / TuxAppSwitcher",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxAppSwitcher />",
      "react": "import { TuxAppSwitcher } from \"@tti/tti-ux-react\";\n\n<TuxAppSwitcher />",
      "webComponents": "<tux-app-switcher></tux-app-switcher>",
      "blazor": "<TuxAppSwitcher />",
      "wordpress": "[tux_app_switcher]"
    }
  },
  {
    "name": "TuxArchitectureMap",
    "tagName": "tux-architecture-map",
    "kind": "component",
    "family": "components",
    "category": "data-display",
    "wraps": "tux native (M.A.P. canvas)",
    "blurb": "Infinite-canvas Master Architecture Plan (M.A.P.) — 3-level semantic zoom (Products → People/VMs/Containers → Package Dependencies), blast-radius traversal, smoothed freehand pen, decaying laser pointer, and multi-user cursors.",
    "route": "/components/architecture-map",
    "docsUrl": "https://ux.tti.tamu.edu/components/architecture-map",
    "figmaNodePattern": "TUX / TuxArchitectureMap",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxArchitectureMap />",
      "react": "import { TuxArchitectureMap } from \"@tti/tti-ux-react\";\n\n<TuxArchitectureMap />",
      "webComponents": "<tux-architecture-map></tux-architecture-map>",
      "blazor": "<TuxArchitectureMap />",
      "wordpress": "[tux_architecture_map]"
    }
  },
  {
    "name": "TuxArtifact",
    "tagName": "tux-artifact",
    "kind": "component",
    "family": "components",
    "category": "ai",
    "wraps": "tux native",
    "blurb": "AI output container — header + actions + body slot. Wraps generated code, docs, exported datasets.",
    "route": "/components/artifact",
    "docsUrl": "https://ux.tti.tamu.edu/components/artifact",
    "figmaNodePattern": "TUX / TuxArtifact",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxArtifact />",
      "react": "import { TuxArtifact } from \"@tti/tti-ux-react\";\n\n<TuxArtifact />",
      "webComponents": "<tux-artifact></tux-artifact>",
      "blazor": "<TuxArtifact />",
      "wordpress": "[tux_artifact]"
    }
  },
  {
    "name": "TuxAuthorByline",
    "tagName": "tux-author-byline",
    "kind": "component",
    "family": "components",
    "category": "publishing",
    "wraps": "tux native",
    "blurb": "Multi-author byline with affiliations + ORCID.",
    "route": "/components/author-byline",
    "docsUrl": "https://ux.tti.tamu.edu/components/author-byline",
    "figmaNodePattern": "TUX / TuxAuthorByline",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxAuthorByline />",
      "react": "import { TuxAuthorByline } from \"@tti/tti-ux-react\";\n\n<TuxAuthorByline />",
      "webComponents": "<tux-author-byline></tux-author-byline>",
      "blazor": "<TuxAuthorByline />",
      "wordpress": "[tux_author_byline]"
    }
  },
  {
    "name": "TuxAvatar",
    "tagName": "tux-avatar",
    "kind": "component",
    "family": "components",
    "category": "feedback",
    "wraps": "tux native",
    "blurb": "Identity mark primitive — photo with initials fallback + optional status dot. Extracted from TuxUserMenu.",
    "route": "/components/avatar",
    "docsUrl": "https://ux.tti.tamu.edu/components/avatar",
    "figmaNodePattern": "TUX / TuxAvatar",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxAvatar />",
      "react": "import { TuxAvatar } from \"@tti/tti-ux-react\";\n\n<TuxAvatar />",
      "webComponents": "<tux-avatar></tux-avatar>",
      "blazor": "<TuxAvatar />",
      "wordpress": "[tux_avatar]"
    }
  },
  {
    "name": "TuxBadge",
    "tagName": "tux-badge",
    "kind": "component",
    "family": "components",
    "category": "feedback",
    "wraps": "UBadge",
    "blurb": "Unified status & taxonomy badge — classification tiers, lifecycle states, bold modes, status dots, leading icons, and facet counts.",
    "route": "/components/badge",
    "docsUrl": "https://ux.tti.tamu.edu/components/badge",
    "figmaNodePattern": "TUX / TuxBadge",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxBadge />",
      "react": "import { TuxBadge } from \"@tti/tti-ux-react\";\n\n<TuxBadge />",
      "webComponents": "<tux-badge></tux-badge>",
      "blazor": "<TuxBadge />",
      "wordpress": "[tux_badge]"
    }
  },
  {
    "name": "TuxBetaRibbon",
    "tagName": "tux-beta-ribbon",
    "kind": "component",
    "family": "components",
    "category": "feedback",
    "wraps": "tux native",
    "blurb": "Environment label — corner ribbon, top stripe, or inline pill. preview/beta/dev tones.",
    "route": "/components/beta-ribbon",
    "docsUrl": "https://ux.tti.tamu.edu/components/beta-ribbon",
    "figmaNodePattern": "TUX / TuxBetaRibbon",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxBetaRibbon />",
      "react": "import { TuxBetaRibbon } from \"@tti/tti-ux-react\";\n\n<TuxBetaRibbon />",
      "webComponents": "<tux-beta-ribbon></tux-beta-ribbon>",
      "blazor": "<TuxBetaRibbon />",
      "wordpress": "[tux_beta_ribbon]"
    }
  },
  {
    "name": "TuxBigStat",
    "tagName": "tux-big-stat",
    "kind": "component",
    "family": "components",
    "category": "data-display",
    "wraps": "tux native",
    "blurb": "Single oversized metric — three sizes, three tones, three style variants.",
    "route": "/components/big-stat",
    "docsUrl": "https://ux.tti.tamu.edu/components/big-stat",
    "figmaNodePattern": "TUX / TuxBigStat",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxBigStat />",
      "react": "import { TuxBigStat } from \"@tti/tti-ux-react\";\n\n<TuxBigStat />",
      "webComponents": "<tux-big-stat></tux-big-stat>",
      "blazor": "<TuxBigStat />",
      "wordpress": "[tux_big_stat]"
    }
  },
  {
    "name": "TuxBlockquote",
    "tagName": "tux-blockquote",
    "kind": "component",
    "family": "components",
    "category": "publishing",
    "wraps": "tux native",
    "blurb": "Standalone pull quote — centered or magazine-style drop-cap. Variant-aware rule + face.",
    "route": "/components/blockquote",
    "docsUrl": "https://ux.tti.tamu.edu/components/blockquote",
    "figmaNodePattern": "TUX / TuxBlockquote",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxBlockquote />",
      "react": "import { TuxBlockquote } from \"@tti/tti-ux-react\";\n\n<TuxBlockquote />",
      "webComponents": "<tux-blockquote></tux-blockquote>",
      "blazor": "<TuxBlockquote />",
      "wordpress": "[tux_blockquote]"
    }
  },
  {
    "name": "TuxBranchNav",
    "tagName": "tux-branch-nav",
    "kind": "component",
    "family": "components",
    "category": "navigation",
    "wraps": "tux native",
    "blurb": "‹ N of M › navigator for response alternatives. Lives in TuxChatMessage's #header-trailing slot.",
    "route": "/components/branch-nav",
    "docsUrl": "https://ux.tti.tamu.edu/components/branch-nav",
    "figmaNodePattern": "TUX / TuxBranchNav",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxBranchNav />",
      "react": "import { TuxBranchNav } from \"@tti/tti-ux-react\";\n\n<TuxBranchNav />",
      "webComponents": "<tux-branch-nav></tux-branch-nav>",
      "blazor": "<TuxBranchNav />",
      "wordpress": "[tux_branch_nav]"
    }
  },
  {
    "name": "TuxBreadcrumbs",
    "tagName": "tux-breadcrumbs",
    "kind": "component",
    "family": "components",
    "category": "navigation",
    "wraps": "tux native",
    "blurb": "Page-depth nav — home icon, italic intermediates, pipe rules collapsing to chevron on narrow.",
    "route": "/components/breadcrumbs",
    "docsUrl": "https://ux.tti.tamu.edu/components/breadcrumbs",
    "figmaNodePattern": "TUX / TuxBreadcrumbs",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxBreadcrumbs />",
      "react": "import { TuxBreadcrumbs } from \"@tti/tti-ux-react\";\n\n<TuxBreadcrumbs />",
      "webComponents": "<tux-breadcrumbs></tux-breadcrumbs>",
      "blazor": "<TuxBreadcrumbs />",
      "wordpress": "[tux_breadcrumbs]"
    }
  },
  {
    "name": "TuxButton",
    "tagName": "tux-button",
    "kind": "component",
    "family": "components",
    "category": "actions",
    "wraps": "UButton",
    "blurb": "Semantic intent prop — primary, secondary, ghost, destructive (fills on hover).",
    "route": "/components/button",
    "docsUrl": "https://ux.tti.tamu.edu/components/button",
    "figmaNodePattern": "TUX / TuxButton",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxButton />",
      "react": "import { TuxButton } from \"@tti/tti-ux-react\";\n\n<TuxButton />",
      "webComponents": "<tux-button></tux-button>",
      "blazor": "<TuxButton />",
      "wordpress": "[tux_button]"
    }
  },
  {
    "name": "TuxCTA",
    "tagName": "tux-cta",
    "kind": "component",
    "family": "components",
    "category": "publishing",
    "wraps": "tux native",
    "blurb": "Big promotional block — three tones, three style variants, action slot.",
    "route": "/components/cta",
    "docsUrl": "https://ux.tti.tamu.edu/components/cta",
    "figmaNodePattern": "TUX / TuxCTA",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxCTA />",
      "react": "import { TuxCTA } from \"@tti/tti-ux-react\";\n\n<TuxCTA />",
      "webComponents": "<tux-cta></tux-cta>",
      "blazor": "<TuxCTA />",
      "wordpress": "[tux_cta]"
    }
  },
  {
    "name": "TuxCallout",
    "tagName": "tux-callout",
    "kind": "component",
    "family": "components",
    "category": "publishing",
    "wraps": "tux native",
    "blurb": "Pulled-aside editorial accent — fact / stat / quote with style-variant left rule.",
    "route": "/components/callout",
    "docsUrl": "https://ux.tti.tamu.edu/components/callout",
    "figmaNodePattern": "TUX / TuxCallout",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxCallout />",
      "react": "import { TuxCallout } from \"@tti/tti-ux-react\";\n\n<TuxCallout />",
      "webComponents": "<tux-callout></tux-callout>",
      "blazor": "<TuxCallout />",
      "wordpress": "[tux_callout]"
    }
  },
  {
    "name": "TuxCapabilityCluster",
    "tagName": "tux-capability-cluster",
    "kind": "component",
    "family": "components",
    "category": "publishing",
    "wraps": "tux native",
    "blurb": "Orbital research capability medallions with concentric gold and maroon halos.",
    "route": "/components/capability-cluster",
    "docsUrl": "https://ux.tti.tamu.edu/components/capability-cluster",
    "figmaNodePattern": "TUX / TuxCapabilityCluster",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxCapabilityCluster />",
      "react": "import { TuxCapabilityCluster } from \"@tti/tti-ux-react\";\n\n<TuxCapabilityCluster />",
      "webComponents": "<tux-capability-cluster></tux-capability-cluster>",
      "blazor": "<TuxCapabilityCluster />",
      "wordpress": "[tux_capability_cluster]"
    }
  },
  {
    "name": "TuxCaptionedMedia",
    "tagName": "tux-captioned-media",
    "kind": "component",
    "family": "components",
    "category": "publishing",
    "wraps": "tux native",
    "blurb": "Single image + caption + credit. 16:9 / 1:1 / 4:3 / 3:4 aspect, full / wide / right alignment.",
    "route": "/components/captioned-media",
    "docsUrl": "https://ux.tti.tamu.edu/components/captioned-media",
    "figmaNodePattern": "TUX / TuxCaptionedMedia",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxCaptionedMedia />",
      "react": "import { TuxCaptionedMedia } from \"@tti/tti-ux-react\";\n\n<TuxCaptionedMedia />",
      "webComponents": "<tux-captioned-media></tux-captioned-media>",
      "blazor": "<TuxCaptionedMedia />",
      "wordpress": "[tux_captioned_media]"
    }
  },
  {
    "name": "TuxCard",
    "tagName": "tux-card",
    "kind": "component",
    "family": "components",
    "category": "data-display",
    "wraps": "tux native",
    "blurb": "Static or linked — linked mode has corner-drop hover + appearing arrow.",
    "route": "/components/card",
    "docsUrl": "https://ux.tti.tamu.edu/components/card",
    "figmaNodePattern": "TUX / TuxCard",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxCard />",
      "react": "import { TuxCard } from \"@tti/tti-ux-react\";\n\n<TuxCard />",
      "webComponents": "<tux-card></tux-card>",
      "blazor": "<TuxCard />",
      "wordpress": "[tux_card]"
    }
  },
  {
    "name": "TuxCardCarousel",
    "tagName": "tux-card-carousel",
    "kind": "component",
    "family": "components",
    "category": "data-display",
    "wraps": "UCarousel (embla) wrap",
    "blurb": "Horizontal scroll of cards — eyebrow + display title + arrows + dots. Wraps UCarousel.",
    "route": "/components/card-carousel",
    "docsUrl": "https://ux.tti.tamu.edu/components/card-carousel",
    "figmaNodePattern": "TUX / TuxCardCarousel",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxCardCarousel />",
      "react": "import { TuxCardCarousel } from \"@tti/tti-ux-react\";\n\n<TuxCardCarousel />",
      "webComponents": "<tux-card-carousel></tux-card-carousel>",
      "blazor": "<TuxCardCarousel />",
      "wordpress": "[tux_card_carousel]"
    }
  },
  {
    "name": "TuxCardSlab",
    "tagName": "tux-card-slab",
    "kind": "component",
    "family": "components",
    "category": "data-display",
    "wraps": "tux native",
    "blurb": "Full-bleed band of media-forward cards — \\\\\"browse our programs\\\\\" pattern, 2/3/4-up.",
    "route": "/components/card-slab",
    "docsUrl": "https://ux.tti.tamu.edu/components/card-slab",
    "figmaNodePattern": "TUX / TuxCardSlab",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxCardSlab />",
      "react": "import { TuxCardSlab } from \"@tti/tti-ux-react\";\n\n<TuxCardSlab />",
      "webComponents": "<tux-card-slab></tux-card-slab>",
      "blazor": "<TuxCardSlab />",
      "wordpress": "[tux_card_slab]"
    }
  },
  {
    "name": "TuxCenterBadge",
    "tagName": "tux-center-badge",
    "kind": "component",
    "family": "components",
    "category": "publishing",
    "wraps": "tux native",
    "blurb": "TTI center / division marker.",
    "route": "/components/tti-identity",
    "docsUrl": "https://ux.tti.tamu.edu/components/tti-identity",
    "figmaNodePattern": "TUX / TuxCenterBadge",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxCenterBadge />",
      "react": "import { TuxCenterBadge } from \"@tti/tti-ux-react\";\n\n<TuxCenterBadge />",
      "webComponents": "<tux-center-badge></tux-center-badge>",
      "blazor": "<TuxCenterBadge />",
      "wordpress": "[tux_center_badge]"
    }
  },
  {
    "name": "TuxECharts",
    "tagName": "tux-e-charts",
    "kind": "component",
    "family": "visualizations",
    "category": "timeseries",
    "wraps": "Apache ECharts",
    "blurb": "High-performance Canvas and WebGL interactive telemetry charts, live multi-series telemetry, and massive dataset exploration with TUX design tokens.",
    "route": "/visualizations/echarts",
    "docsUrl": "https://ux.tti.tamu.edu/visualizations/echarts",
    "figmaNodePattern": "TUX / TuxECharts",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxECharts />",
      "react": "import { TuxECharts } from \"@tti/tti-ux-react\";\n\n<TuxECharts />",
      "webComponents": "<tux-e-charts></tux-e-charts>",
      "blazor": "<TuxECharts />",
      "wordpress": "[tux_e_charts]"
    }
  },
  {
    "name": "TuxChartArea",
    "tagName": "tux-chart-area",
    "kind": "component",
    "family": "visualizations",
    "category": "timeseries",
    "wraps": "tux native SVG",
    "blurb": "Native SVG area chart — overlay or stacked variants, end-of-area labels, paired with TuxBigStat for the KPI-strip composition.",
    "route": "/visualizations/chart-area",
    "docsUrl": "https://ux.tti.tamu.edu/visualizations/chart-area",
    "figmaNodePattern": "TUX / TuxChartArea",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxChartArea />",
      "react": "import { TuxChartArea } from \"@tti/tti-ux-react\";\n\n<TuxChartArea />",
      "webComponents": "<tux-chart-area></tux-chart-area>",
      "blazor": "<TuxChartArea />",
      "wordpress": "[tux_chart_area]"
    }
  },
  {
    "name": "TuxChartBar",
    "tagName": "tux-chart-bar",
    "kind": "component",
    "family": "visualizations",
    "category": "timeseries",
    "wraps": "tux native SVG",
    "blurb": "Native SVG bar chart — single / grouped / stacked variants, vertical or horizontal, optional comparison overlay (projection vs actual).",
    "route": "/visualizations/chart-bar",
    "docsUrl": "https://ux.tti.tamu.edu/visualizations/chart-bar",
    "figmaNodePattern": "TUX / TuxChartBar",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxChartBar />",
      "react": "import { TuxChartBar } from \"@tti/tti-ux-react\";\n\n<TuxChartBar />",
      "webComponents": "<tux-chart-bar></tux-chart-bar>",
      "blazor": "<TuxChartBar />",
      "wordpress": "[tux_chart_bar]"
    }
  },
  {
    "name": "TuxChartDonut",
    "tagName": "tux-chart-donut",
    "kind": "component",
    "family": "visualizations",
    "category": "statistical",
    "wraps": "tux native SVG",
    "blurb": "Share-of-total donut — center stat slot, slice-label colored to wedge, minSlice% auto-folds tiny slices into Other.",
    "route": "/visualizations/chart-donut",
    "docsUrl": "https://ux.tti.tamu.edu/visualizations/chart-donut",
    "figmaNodePattern": "TUX / TuxChartDonut",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxChartDonut />",
      "react": "import { TuxChartDonut } from \"@tti/tti-ux-react\";\n\n<TuxChartDonut />",
      "webComponents": "<tux-chart-donut></tux-chart-donut>",
      "blazor": "<TuxChartDonut />",
      "wordpress": "[tux_chart_donut]"
    }
  },
  {
    "name": "TuxChartFrame",
    "tagName": "tux-chart-frame",
    "kind": "component",
    "family": "visualizations",
    "category": "timeseries",
    "wraps": "tux native (editorial wrapper)",
    "blurb": "Editorial wrapper that ties native chart components into the TUX type system.",
    "route": "/visualizations/chart-frame",
    "docsUrl": "https://ux.tti.tamu.edu/visualizations/chart-frame",
    "figmaNodePattern": "TUX / TuxChartFrame",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxChartFrame />",
      "react": "import { TuxChartFrame } from \"@tti/tti-ux-react\";\n\n<TuxChartFrame />",
      "webComponents": "<tux-chart-frame></tux-chart-frame>",
      "blazor": "<TuxChartFrame />",
      "wordpress": "[tux_chart_frame]"
    }
  },
  {
    "name": "TuxChartGauge",
    "tagName": "tux-chart-gauge",
    "kind": "component",
    "family": "visualizations",
    "category": "timeseries",
    "wraps": "tux native SVG",
    "blurb": "270° arc gauge for single-target metrics — needle + tone bands, or radial-progress variant. Use sparingly.",
    "route": "/visualizations/chart-gauge",
    "docsUrl": "https://ux.tti.tamu.edu/visualizations/chart-gauge",
    "figmaNodePattern": "TUX / TuxChartGauge",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxChartGauge />",
      "react": "import { TuxChartGauge } from \"@tti/tti-ux-react\";\n\n<TuxChartGauge />",
      "webComponents": "<tux-chart-gauge></tux-chart-gauge>",
      "blazor": "<TuxChartGauge />",
      "wordpress": "[tux_chart_gauge]"
    }
  },
  {
    "name": "TuxChartGeographic",
    "tagName": "tux-chart-geographic",
    "kind": "component",
    "family": "visualizations",
    "category": "geospatial",
    "wraps": "tux native (5-kind Texas map)",
    "blurb": "Texas-flavored geographic charts.",
    "route": "/visualizations/chart-geographic",
    "docsUrl": "https://ux.tti.tamu.edu/visualizations/chart-geographic",
    "figmaNodePattern": "TUX / TuxChartGeographic",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxChartGeographic />",
      "react": "import { TuxChartGeographic } from \"@tti/tti-ux-react\";\n\n<TuxChartGeographic />",
      "webComponents": "<tux-chart-geographic></tux-chart-geographic>",
      "blazor": "<TuxChartGeographic />",
      "wordpress": "[tux_chart_geographic]"
    }
  },
  {
    "name": "TuxChartHeatmap",
    "tagName": "tux-chart-heatmap",
    "kind": "component",
    "family": "visualizations",
    "category": "statistical",
    "wraps": "tux native SVG",
    "blurb": "Matrix heatmap on the sequential map ramps — crashes by day × hour, corridor demand by month. 2-D keyboard cursor, honest null cells.",
    "route": "/visualizations/chart-heatmap",
    "docsUrl": "https://ux.tti.tamu.edu/visualizations/chart-heatmap",
    "figmaNodePattern": "TUX / TuxChartHeatmap",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxChartHeatmap />",
      "react": "import { TuxChartHeatmap } from \"@tti/tti-ux-react\";\n\n<TuxChartHeatmap />",
      "webComponents": "<tux-chart-heatmap></tux-chart-heatmap>",
      "blazor": "<TuxChartHeatmap />",
      "wordpress": "[tux_chart_heatmap]"
    }
  },
  {
    "name": "TuxChartHistogram",
    "tagName": "tux-chart-histogram",
    "kind": "component",
    "family": "visualizations",
    "category": "statistical",
    "wraps": "tux native SVG",
    "blurb": "Distribution over raw samples — nice 1/2/5 bin edges, dashed gold p50/p95 percentile rules, normalize-to-share mode. The reliability chart.",
    "route": "/visualizations/chart-histogram",
    "docsUrl": "https://ux.tti.tamu.edu/visualizations/chart-histogram",
    "figmaNodePattern": "TUX / TuxChartHistogram",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxChartHistogram />",
      "react": "import { TuxChartHistogram } from \"@tti/tti-ux-react\";\n\n<TuxChartHistogram />",
      "webComponents": "<tux-chart-histogram></tux-chart-histogram>",
      "blazor": "<TuxChartHistogram />",
      "wordpress": "[tux_chart_histogram]"
    }
  },
  {
    "name": "TuxChartLine",
    "tagName": "tux-chart-line",
    "kind": "component",
    "family": "visualizations",
    "category": "timeseries",
    "wraps": "tux native SVG",
    "blurb": "Native SVG line chart — end-of-line value labels, optional previous-period overlay + confidence band, auto SR summary.",
    "route": "/visualizations/chart-line",
    "docsUrl": "https://ux.tti.tamu.edu/visualizations/chart-line",
    "figmaNodePattern": "TUX / TuxChartLine",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxChartLine />",
      "react": "import { TuxChartLine } from \"@tti/tti-ux-react\";\n\n<TuxChartLine />",
      "webComponents": "<tux-chart-line></tux-chart-line>",
      "blazor": "<TuxChartLine />",
      "wordpress": "[tux_chart_line]"
    }
  },
  {
    "name": "TuxChartSankey",
    "tagName": "tux-chart-sankey",
    "kind": "component",
    "family": "visualizations",
    "category": "statistical",
    "wraps": "tux native SVG",
    "blurb": "Multi-stage directed acyclic flow diagram — cubic-Bezier ribbons, automatic topological stage inference, and roving keyboard cursor.",
    "route": "/visualizations/chart-sankey",
    "docsUrl": "https://ux.tti.tamu.edu/visualizations/chart-sankey",
    "figmaNodePattern": "TUX / TuxChartSankey",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxChartSankey />",
      "react": "import { TuxChartSankey } from \"@tti/tti-ux-react\";\n\n<TuxChartSankey />",
      "webComponents": "<tux-chart-sankey></tux-chart-sankey>",
      "blazor": "<TuxChartSankey />",
      "wordpress": "[tux_chart_sankey]"
    }
  },
  {
    "name": "TuxChartScatter",
    "tagName": "tux-chart-scatter",
    "kind": "component",
    "family": "visualizations",
    "category": "statistical",
    "wraps": "tux native SVG",
    "blurb": "Correlation plot — x vs y dots, optional linear-regression trendline + R², bubble-chart mode via per-point size.",
    "route": "/visualizations/chart-scatter",
    "docsUrl": "https://ux.tti.tamu.edu/visualizations/chart-scatter",
    "figmaNodePattern": "TUX / TuxChartScatter",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxChartScatter />",
      "react": "import { TuxChartScatter } from \"@tti/tti-ux-react\";\n\n<TuxChartScatter />",
      "webComponents": "<tux-chart-scatter></tux-chart-scatter>",
      "blazor": "<TuxChartScatter />",
      "wordpress": "[tux_chart_scatter]"
    }
  },
  {
    "name": "TuxChartSunburst",
    "tagName": "tux-chart-sunburst",
    "kind": "component",
    "family": "visualizations",
    "category": "statistical",
    "wraps": "tux native (two-ring radial)",
    "blurb": "Radial counterpart to `TuxTreemap`.",
    "route": "/visualizations/chart-sunburst",
    "docsUrl": "https://ux.tti.tamu.edu/visualizations/chart-sunburst",
    "figmaNodePattern": "TUX / TuxChartSunburst",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxChartSunburst />",
      "react": "import { TuxChartSunburst } from \"@tti/tti-ux-react\";\n\n<TuxChartSunburst />",
      "webComponents": "<tux-chart-sunburst></tux-chart-sunburst>",
      "blazor": "<TuxChartSunburst />",
      "wordpress": "[tux_chart_sunburst]"
    }
  },
  {
    "name": "TuxChartWaterfall",
    "tagName": "tux-chart-waterfall",
    "kind": "component",
    "family": "visualizations",
    "category": "timeseries",
    "wraps": "tux native SVG",
    "blurb": "Cumulative step-delta bridge chart — start, signed deltas, subtotals, dashed connectors, and direct or inverted polarity.",
    "route": "/visualizations/chart-waterfall",
    "docsUrl": "https://ux.tti.tamu.edu/visualizations/chart-waterfall",
    "figmaNodePattern": "TUX / TuxChartWaterfall",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxChartWaterfall />",
      "react": "import { TuxChartWaterfall } from \"@tti/tti-ux-react\";\n\n<TuxChartWaterfall />",
      "webComponents": "<tux-chart-waterfall></tux-chart-waterfall>",
      "blazor": "<TuxChartWaterfall />",
      "wordpress": "[tux_chart_waterfall]"
    }
  },
  {
    "name": "TuxChatBubble",
    "tagName": "tux-chat-bubble",
    "kind": "component",
    "family": "components",
    "category": "ai",
    "wraps": "tux native",
    "blurb": "Conversational speech bubble and floating assistant launcher primitive for interactive queries.",
    "route": "/components/chat-bubble",
    "docsUrl": "https://ux.tti.tamu.edu/components/chat-bubble",
    "figmaNodePattern": "TUX / TuxChatBubble",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxChatBubble />",
      "react": "import { TuxChatBubble } from \"@tti/tti-ux-react\";\n\n<TuxChatBubble />",
      "webComponents": "<tux-chat-bubble></tux-chat-bubble>",
      "blazor": "<TuxChatBubble />",
      "wordpress": "[tux_chat_bubble]"
    }
  },
  {
    "name": "TuxChatMessage",
    "tagName": "tux-chat-message",
    "kind": "component",
    "family": "components",
    "category": "ai",
    "wraps": "tux native",
    "blurb": "One conversation turn — user or assistant role, citations slot, tool row. Powers tti-ai-chat.",
    "route": "/components/chat-message",
    "docsUrl": "https://ux.tti.tamu.edu/components/chat-message",
    "figmaNodePattern": "TUX / TuxChatMessage",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxChatMessage />",
      "react": "import { TuxChatMessage } from \"@tti/tti-ux-react\";\n\n<TuxChatMessage />",
      "webComponents": "<tux-chat-message></tux-chat-message>",
      "blazor": "<TuxChatMessage />",
      "wordpress": "[tux_chat_message]"
    }
  },
  {
    "name": "TuxCitationExport",
    "tagName": "tux-citation-export",
    "kind": "component",
    "family": "components",
    "category": "publishing",
    "wraps": "UDropdownMenu",
    "blurb": "Academic citation export menu.",
    "route": "/components/citation-export",
    "docsUrl": "https://ux.tti.tamu.edu/components/citation-export",
    "figmaNodePattern": "TUX / TuxCitationExport",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxCitationExport />",
      "react": "import { TuxCitationExport } from \"@tti/tti-ux-react\";\n\n<TuxCitationExport />",
      "webComponents": "<tux-citation-export></tux-citation-export>",
      "blazor": "<TuxCitationExport />",
      "wordpress": "[tux_citation_export]"
    }
  },
  {
    "name": "TuxCitations",
    "tagName": "tux-citations",
    "kind": "component",
    "family": "components",
    "category": "publishing",
    "wraps": "tux native",
    "blurb": "Numbered source list under an assistant message — title + path + score in a 3-col grid.",
    "route": "/components/citations",
    "docsUrl": "https://ux.tti.tamu.edu/components/citations",
    "figmaNodePattern": "TUX / TuxCitations",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxCitations />",
      "react": "import { TuxCitations } from \"@tti/tti-ux-react\";\n\n<TuxCitations />",
      "webComponents": "<tux-citations></tux-citations>",
      "blazor": "<TuxCitations />",
      "wordpress": "[tux_citations]"
    }
  },
  {
    "name": "TuxCodeBlock",
    "tagName": "tux-code-block",
    "kind": "component",
    "family": "components",
    "category": "publishing",
    "wraps": "Shiki",
    "blurb": "Standalone Shiki code block — filename, line numbers, copy. Lazy-loads grammar on mount.",
    "route": "/components/code-block",
    "docsUrl": "https://ux.tti.tamu.edu/components/code-block",
    "figmaNodePattern": "TUX / TuxCodeBlock",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxCodeBlock />",
      "react": "import { TuxCodeBlock } from \"@tti/tti-ux-react\";\n\n<TuxCodeBlock />",
      "webComponents": "<tux-code-block></tux-code-block>",
      "blazor": "<TuxCodeBlock />",
      "wordpress": "[tux_code_block]"
    }
  },
  {
    "name": "TuxCodeMaroon",
    "tagName": "tux-code-maroon",
    "kind": "component",
    "family": "components",
    "category": "feedback",
    "wraps": "tux native",
    "blurb": "Mandatory emergency alert banner — Rellis Code Maroon. Three severities, non-themed colors.",
    "route": "/components/code-maroon",
    "docsUrl": "https://ux.tti.tamu.edu/components/code-maroon",
    "figmaNodePattern": "TUX / TuxCodeMaroon",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxCodeMaroon />",
      "react": "import { TuxCodeMaroon } from \"@tti/tti-ux-react\";\n\n<TuxCodeMaroon />",
      "webComponents": "<tux-code-maroon></tux-code-maroon>",
      "blazor": "<TuxCodeMaroon />",
      "wordpress": "[tux_code_maroon]"
    }
  },
  {
    "name": "TuxColumnMapper",
    "tagName": "tux-column-mapper",
    "kind": "component",
    "family": "components",
    "category": "forms",
    "wraps": "tux native",
    "blurb": "Tabular import & schema alignment wizard — fuzzy column auto-match, sample value preview, and type validation.",
    "route": "/components/column-mapper",
    "docsUrl": "https://ux.tti.tamu.edu/components/column-mapper",
    "figmaNodePattern": "TUX / TuxColumnMapper",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxColumnMapper />",
      "react": "import { TuxColumnMapper } from \"@tti/tti-ux-react\";\n\n<TuxColumnMapper />",
      "webComponents": "<tux-column-mapper></tux-column-mapper>",
      "blazor": "<TuxColumnMapper />",
      "wordpress": "[tux_column_mapper]"
    }
  },
  {
    "name": "TuxCommandBar",
    "tagName": "tux-command-bar",
    "kind": "component",
    "family": "components",
    "category": "actions",
    "wraps": "tux native",
    "blurb": "Standardized action ribbon — contextual actions, search filter, and bulk selection mode.",
    "route": "/components/command-bar",
    "docsUrl": "https://ux.tti.tamu.edu/components/command-bar",
    "figmaNodePattern": "TUX / TuxCommandBar",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxCommandBar />",
      "react": "import { TuxCommandBar } from \"@tti/tti-ux-react\";\n\n<TuxCommandBar />",
      "webComponents": "<tux-command-bar></tux-command-bar>",
      "blazor": "<TuxCommandBar />",
      "wordpress": "[tux_command_bar]"
    }
  },
  {
    "name": "TuxCommandPalette",
    "tagName": "tux-command-palette",
    "kind": "component",
    "family": "components",
    "category": "actions",
    "wraps": "tux native",
    "blurb": "Global ⌘K jump — search + grouped commands + keyboard nav, native <dialog>.",
    "route": "/components/command-palette",
    "docsUrl": "https://ux.tti.tamu.edu/components/command-palette",
    "figmaNodePattern": "TUX / TuxCommandPalette",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxCommandPalette />",
      "react": "import { TuxCommandPalette } from \"@tti/tti-ux-react\";\n\n<TuxCommandPalette />",
      "webComponents": "<tux-command-palette></tux-command-palette>",
      "blazor": "<TuxCommandPalette />",
      "wordpress": "[tux_command_palette]"
    }
  },
  {
    "name": "TuxCommentThread",
    "tagName": "tux-comment-thread",
    "kind": "component",
    "family": "components",
    "category": "ai",
    "wraps": "tux native",
    "blurb": "Peer-review / editorial threads — root + replies, @mentions, resolve/reopen, edit/delete own.",
    "route": "/components/comment-thread",
    "docsUrl": "https://ux.tti.tamu.edu/components/comment-thread",
    "figmaNodePattern": "TUX / TuxCommentThread",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxCommentThread />",
      "react": "import { TuxCommentThread } from \"@tti/tti-ux-react\";\n\n<TuxCommentThread />",
      "webComponents": "<tux-comment-thread></tux-comment-thread>",
      "blazor": "<TuxCommentThread />",
      "wordpress": "[tux_comment_thread]"
    }
  },
  {
    "name": "TuxCommHero",
    "tagName": "tux-comm-hero",
    "kind": "component",
    "family": "components",
    "category": "publishing",
    "wraps": "tux native",
    "blurb": "Architectural portal hero with diagonal chamfer cut, gold accent block, and framed photography.",
    "route": "/components/comm-hero",
    "docsUrl": "https://ux.tti.tamu.edu/components/comm-hero",
    "figmaNodePattern": "TUX / TuxCommHero",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxCommHero />",
      "react": "import { TuxCommHero } from \"@tti/tti-ux-react\";\n\n<TuxCommHero />",
      "webComponents": "<tux-comm-hero></tux-comm-hero>",
      "blazor": "<TuxCommHero />",
      "wordpress": "[tux_comm_hero]"
    }
  },
  {
    "name": "TuxComposer",
    "tagName": "tux-composer",
    "kind": "component",
    "family": "components",
    "category": "ai",
    "wraps": "tux native",
    "blurb": "Chat input with optional compliance scope banner — model picker, corpus attach, ⌘↵ send.",
    "route": "/components/composer",
    "docsUrl": "https://ux.tti.tamu.edu/components/composer",
    "figmaNodePattern": "TUX / TuxComposer",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxComposer />",
      "react": "import { TuxComposer } from \"@tti/tti-ux-react\";\n\n<TuxComposer />",
      "webComponents": "<tux-composer></tux-composer>",
      "blazor": "<TuxComposer />",
      "wordpress": "[tux_composer]"
    }
  },
  {
    "name": "TuxConfirmDialog",
    "tagName": "tux-confirm-dialog",
    "kind": "component",
    "family": "components",
    "category": "feedback",
    "wraps": "TuxModal preset",
    "blurb": "TuxModal preset for destructive-action confirmation.",
    "route": "/components/confirm-dialog",
    "docsUrl": "https://ux.tti.tamu.edu/components/confirm-dialog",
    "figmaNodePattern": "TUX / TuxConfirmDialog",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxConfirmDialog />",
      "react": "import { TuxConfirmDialog } from \"@tti/tti-ux-react\";\n\n<TuxConfirmDialog />",
      "webComponents": "<tux-confirm-dialog></tux-confirm-dialog>",
      "blazor": "<TuxConfirmDialog />",
      "wordpress": "[tux_confirm_dialog]"
    }
  },
  {
    "name": "TuxContactCard",
    "tagName": "tux-contact-card",
    "kind": "component",
    "family": "components",
    "category": "data-display",
    "wraps": "tux native",
    "blurb": "Directory card — portrait + name + role + typed contact rows. Vertical or horizontal.",
    "route": "/components/contact-card",
    "docsUrl": "https://ux.tti.tamu.edu/components/contact-card",
    "figmaNodePattern": "TUX / TuxContactCard",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxContactCard />",
      "react": "import { TuxContactCard } from \"@tti/tti-ux-react\";\n\n<TuxContactCard />",
      "webComponents": "<tux-contact-card></tux-contact-card>",
      "blazor": "<TuxContactCard />",
      "wordpress": "[tux_contact_card]"
    }
  },
  {
    "name": "TuxContextMeter",
    "tagName": "tux-context-meter",
    "kind": "component",
    "family": "components",
    "category": "ai",
    "wraps": "UPopover",
    "blurb": "Token-utilization meter — pill + conic ring + popover with input/output/cost. Tone-codes success/warning/error.",
    "route": "/components/context-meter",
    "docsUrl": "https://ux.tti.tamu.edu/components/context-meter",
    "figmaNodePattern": "TUX / TuxContextMeter",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxContextMeter />",
      "react": "import { TuxContextMeter } from \"@tti/tti-ux-react\";\n\n<TuxContextMeter />",
      "webComponents": "<tux-context-meter></tux-context-meter>",
      "blazor": "<TuxContextMeter />",
      "wordpress": "[tux_context_meter]"
    }
  },
  {
    "name": "TuxContextPanel",
    "tagName": "tux-context-panel",
    "kind": "component",
    "family": "components",
    "category": "ai",
    "wraps": "tux native",
    "blurb": "Right-rail surface for chat grounding context (corpus, retrieval, usage). Slot-driven chrome.",
    "route": "/components/context-panel",
    "docsUrl": "https://ux.tti.tamu.edu/components/context-panel",
    "figmaNodePattern": "TUX / TuxContextPanel",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxContextPanel />",
      "react": "import { TuxContextPanel } from \"@tti/tti-ux-react\";\n\n<TuxContextPanel />",
      "webComponents": "<tux-context-panel></tux-context-panel>",
      "blazor": "<TuxContextPanel />",
      "wordpress": "[tux_context_panel]"
    }
  },
  {
    "name": "TuxConversationList",
    "tagName": "tux-conversation-list",
    "kind": "component",
    "family": "components",
    "category": "ai",
    "wraps": "tux native",
    "blurb": "Sidebar history of past conversations grouped by temporal bucket (TODAY / YESTERDAY / …).",
    "route": "/components/conversation-list",
    "docsUrl": "https://ux.tti.tamu.edu/components/conversation-list",
    "figmaNodePattern": "TUX / TuxConversationList",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxConversationList />",
      "react": "import { TuxConversationList } from \"@tti/tti-ux-react\";\n\n<TuxConversationList />",
      "webComponents": "<tux-conversation-list></tux-conversation-list>",
      "blazor": "<TuxConversationList />",
      "wordpress": "[tux_conversation_list]"
    }
  },
  {
    "name": "TuxCookieConsent",
    "tagName": "tux-cookie-consent",
    "kind": "component",
    "family": "components",
    "category": "feedback",
    "wraps": "tux native",
    "blurb": "Privacy notice — bottom-right or full-width strip. localStorage-backed decision memory; categories slot.",
    "route": "/components/cookie-consent",
    "docsUrl": "https://ux.tti.tamu.edu/components/cookie-consent",
    "figmaNodePattern": "TUX / TuxCookieConsent",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxCookieConsent />",
      "react": "import { TuxCookieConsent } from \"@tti/tti-ux-react\";\n\n<TuxCookieConsent />",
      "webComponents": "<tux-cookie-consent></tux-cookie-consent>",
      "blazor": "<TuxCookieConsent />",
      "wordpress": "[tux_cookie_consent]"
    }
  },
  {
    "name": "TuxCopyToken",
    "tagName": "tux-copy-token",
    "kind": "component",
    "family": "components",
    "category": "actions",
    "wraps": "tux native",
    "blurb": "Monospace identifier chip — smart middle-ellipsis truncation, verification badge, and one-click clipboard copy.",
    "route": "/components/copy-token",
    "docsUrl": "https://ux.tti.tamu.edu/components/copy-token",
    "figmaNodePattern": "TUX / TuxCopyToken",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxCopyToken />",
      "react": "import { TuxCopyToken } from \"@tti/tti-ux-react\";\n\n<TuxCopyToken />",
      "webComponents": "<tux-copy-token></tux-copy-token>",
      "blazor": "<TuxCopyToken />",
      "wordpress": "[tux_copy_token]"
    }
  },
  {
    "name": "TuxCorridorStrip",
    "tagName": "tux-corridor-strip",
    "kind": "component",
    "family": "components",
    "category": "data-display",
    "wraps": "tux native SVG",
    "blurb": "Linear corridor visualization.",
    "route": "/components/geospatial",
    "docsUrl": "https://ux.tti.tamu.edu/components/geospatial",
    "figmaNodePattern": "TUX / TuxCorridorStrip",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxCorridorStrip />",
      "react": "import { TuxCorridorStrip } from \"@tti/tti-ux-react\";\n\n<TuxCorridorStrip />",
      "webComponents": "<tux-corridor-strip></tux-corridor-strip>",
      "blazor": "<TuxCorridorStrip />",
      "wordpress": "[tux_corridor_strip]"
    }
  },
  {
    "name": "TuxDataTable",
    "tagName": "tux-data-table",
    "kind": "component",
    "family": "components",
    "category": "data-display",
    "wraps": "tux native",
    "blurb": "Research-deliverable table — numbered caption, uncertainty cells (value ± CI), footnote anchors, totals row, source citation. Static (printable).",
    "route": "/components/data-table",
    "docsUrl": "https://ux.tti.tamu.edu/components/data-table",
    "figmaNodePattern": "TUX / TuxDataTable",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxDataTable />",
      "react": "import { TuxDataTable } from \"@tti/tti-ux-react\";\n\n<TuxDataTable />",
      "webComponents": "<tux-data-table></tux-data-table>",
      "blazor": "<TuxDataTable />",
      "wordpress": "[tux_data_table]"
    }
  },
  {
    "name": "TuxDescriptionList",
    "tagName": "tux-description-list",
    "kind": "component",
    "family": "components",
    "category": "data-display",
    "wraps": "tux native",
    "blurb": "Term/definition pairs — native dl/dt/dd. Inline or stacked, editorial or data emphasis.",
    "route": "/components/description-list",
    "docsUrl": "https://ux.tti.tamu.edu/components/description-list",
    "figmaNodePattern": "TUX / TuxDescriptionList",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxDescriptionList />",
      "react": "import { TuxDescriptionList } from \"@tti/tti-ux-react\";\n\n<TuxDescriptionList />",
      "webComponents": "<tux-description-list></tux-description-list>",
      "blazor": "<TuxDescriptionList />",
      "wordpress": "[tux_description_list]"
    }
  },
  {
    "name": "TuxDiagram",
    "tagName": "tux-diagram",
    "kind": "component",
    "family": "components",
    "category": "publishing",
    "wraps": "Mermaid",
    "blurb": "Mermaid diagrams-as-code — flowcharts, sequences, ERDs. Lazy-loaded ~3MB; brand-themed.",
    "route": "/components/diagram",
    "docsUrl": "https://ux.tti.tamu.edu/components/diagram",
    "figmaNodePattern": "TUX / TuxDiagram",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxDiagram />",
      "react": "import { TuxDiagram } from \"@tti/tti-ux-react\";\n\n<TuxDiagram />",
      "webComponents": "<tux-diagram></tux-diagram>",
      "blazor": "<TuxDiagram />",
      "wordpress": "[tux_diagram]"
    }
  },
  {
    "name": "TuxDocsSidebar",
    "tagName": "tux-docs-sidebar",
    "kind": "component",
    "family": "components",
    "category": "navigation",
    "wraps": "tux native",
    "blurb": "Hierarchical doc-site sidebar — collapsible sections, search filter, persisted collapse state.",
    "route": "/components/docs-sidebar",
    "docsUrl": "https://ux.tti.tamu.edu/components/docs-sidebar",
    "figmaNodePattern": "TUX / TuxDocsSidebar",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxDocsSidebar />",
      "react": "import { TuxDocsSidebar } from \"@tti/tti-ux-react\";\n\n<TuxDocsSidebar />",
      "webComponents": "<tux-docs-sidebar></tux-docs-sidebar>",
      "blazor": "<TuxDocsSidebar />",
      "wordpress": "[tux_docs_sidebar]"
    }
  },
  {
    "name": "TuxDropdown",
    "tagName": "tux-dropdown",
    "kind": "component",
    "family": "components",
    "category": "navigation",
    "wraps": "tux native",
    "blurb": "Single-column dropdown from a top-bar nav item. Composes inside TuxSiteNav.",
    "route": "/components/site-nav",
    "docsUrl": "https://ux.tti.tamu.edu/components/site-nav",
    "figmaNodePattern": "TUX / TuxDropdown",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxDropdown />",
      "react": "import { TuxDropdown } from \"@tti/tti-ux-react\";\n\n<TuxDropdown />",
      "webComponents": "<tux-dropdown></tux-dropdown>",
      "blazor": "<TuxDropdown />",
      "wordpress": "[tux_dropdown]"
    }
  },
  {
    "name": "TuxEditorialArticle",
    "tagName": "tux-editorial-article",
    "kind": "component",
    "family": "components",
    "category": "publishing",
    "wraps": "tux native",
    "blurb": "Flagship publication reader parities MyTTI Inside Lane and EmDash CMS with switchable hero presentations, sticky TOC, and reading progress.",
    "route": "/components/editorial-article",
    "docsUrl": "https://ux.tti.tamu.edu/components/editorial-article",
    "figmaNodePattern": "TUX / TuxEditorialArticle",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxEditorialArticle />",
      "react": "import { TuxEditorialArticle } from \"@tti/tti-ux-react\";\n\n<TuxEditorialArticle />",
      "webComponents": "<tux-editorial-article></tux-editorial-article>",
      "blazor": "<TuxEditorialArticle />",
      "wordpress": "[tux_editorial_article]"
    }
  },
  {
    "name": "TuxEmptyState",
    "tagName": "tux-empty-state",
    "kind": "component",
    "family": "components",
    "category": "feedback",
    "wraps": "TuxCard composite",
    "blurb": "No-data placeholder — tinted icon circle, title, description, CTA slot.",
    "route": "/components/empty-state",
    "docsUrl": "https://ux.tti.tamu.edu/components/empty-state",
    "figmaNodePattern": "TUX / TuxEmptyState",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxEmptyState />",
      "react": "import { TuxEmptyState } from \"@tti/tti-ux-react\";\n\n<TuxEmptyState />",
      "webComponents": "<tux-empty-state></tux-empty-state>",
      "blazor": "<TuxEmptyState />",
      "wordpress": "[tux_empty_state]"
    }
  },
  {
    "name": "TuxEntityPicker",
    "tagName": "tux-entity-picker",
    "kind": "component",
    "family": "components",
    "category": "forms",
    "wraps": "tux native",
    "blurb": "Accessible ARIA combobox — rich two-line entity cards with code, owner, status chip, and closed-record guardrails.",
    "route": "/components/entity-picker",
    "docsUrl": "https://ux.tti.tamu.edu/components/entity-picker",
    "figmaNodePattern": "TUX / TuxEntityPicker",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxEntityPicker />",
      "react": "import { TuxEntityPicker } from \"@tti/tti-ux-react\";\n\n<TuxEntityPicker />",
      "webComponents": "<tux-entity-picker></tux-entity-picker>",
      "blazor": "<TuxEntityPicker />",
      "wordpress": "[tux_entity_picker]"
    }
  },
  {
    "name": "TuxErrorPage",
    "tagName": "tux-error-page",
    "kind": "component",
    "family": "components",
    "category": "feedback",
    "wraps": "tux native",
    "blurb": "Full-page 404/500/403/503 template — display-type code, recovery actions, support slot.",
    "route": "/components/error-page",
    "docsUrl": "https://ux.tti.tamu.edu/components/error-page",
    "figmaNodePattern": "TUX / TuxErrorPage",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxErrorPage />",
      "react": "import { TuxErrorPage } from \"@tti/tti-ux-react\";\n\n<TuxErrorPage />",
      "webComponents": "<tux-error-page></tux-error-page>",
      "blazor": "<TuxErrorPage />",
      "wordpress": "[tux_error_page]"
    }
  },
  {
    "name": "TuxEventCalendarRow",
    "tagName": "tux-event-calendar-row",
    "kind": "component",
    "family": "components",
    "category": "data-display",
    "wraps": "tux native",
    "blurb": "Institutional event row with emerald date chip, time, title, and RSVP/view action.",
    "route": "/components/event-calendar-row",
    "docsUrl": "https://ux.tti.tamu.edu/components/event-calendar-row",
    "figmaNodePattern": "TUX / TuxEventCalendarRow",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxEventCalendarRow />",
      "react": "import { TuxEventCalendarRow } from \"@tti/tti-ux-react\";\n\n<TuxEventCalendarRow />",
      "webComponents": "<tux-event-calendar-row></tux-event-calendar-row>",
      "blazor": "<TuxEventCalendarRow />",
      "wordpress": "[tux_event_calendar_row]"
    }
  },
  {
    "name": "TuxFAB",
    "tagName": "tux-fab",
    "kind": "component",
    "family": "components",
    "category": "actions",
    "wraps": "tux native",
    "blurb": "Floating Action Button. Material-pattern primary action; icon-only circle or extended pill. Honors safe-area-inset.",
    "route": "/components/fab",
    "docsUrl": "https://ux.tti.tamu.edu/components/fab",
    "figmaNodePattern": "TUX / TuxFAB",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxFAB />",
      "react": "import { TuxFAB } from \"@tti/tti-ux-react\";\n\n<TuxFAB />",
      "webComponents": "<tux-fab></tux-fab>",
      "blazor": "<TuxFAB />",
      "wordpress": "[tux_fab]"
    }
  },
  {
    "name": "TuxFactoid",
    "tagName": "tux-factoid",
    "kind": "component",
    "family": "components",
    "category": "data-display",
    "wraps": "tux native",
    "blurb": "Institutional \\\\\"by the numbers\\\\\" — 3/4/5-up oversized stats, variant-aware numerals.",
    "route": "/components/factoid",
    "docsUrl": "https://ux.tti.tamu.edu/components/factoid",
    "figmaNodePattern": "TUX / TuxFactoid",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxFactoid />",
      "react": "import { TuxFactoid } from \"@tti/tti-ux-react\";\n\n<TuxFactoid />",
      "webComponents": "<tux-factoid></tux-factoid>",
      "blazor": "<TuxFactoid />",
      "wordpress": "[tux_factoid]"
    }
  },
  {
    "name": "TuxFeedStatus",
    "tagName": "tux-feed-status",
    "kind": "component",
    "family": "components",
    "category": "feedback",
    "wraps": "tux native",
    "blurb": "Upstream connector & ingestion health monitor — sync state, lag readouts, record counts, and manual sync triggers.",
    "route": "/components/feed-status",
    "docsUrl": "https://ux.tti.tamu.edu/components/feed-status",
    "figmaNodePattern": "TUX / TuxFeedStatus",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxFeedStatus />",
      "react": "import { TuxFeedStatus } from \"@tti/tti-ux-react\";\n\n<TuxFeedStatus />",
      "webComponents": "<tux-feed-status></tux-feed-status>",
      "blazor": "<TuxFeedStatus />",
      "wordpress": "[tux_feed_status]"
    }
  },
  {
    "name": "TuxFigureCaption",
    "tagName": "tux-figure-caption",
    "kind": "component",
    "family": "components",
    "category": "publishing",
    "wraps": "tux native",
    "blurb": "Auto-numbered caption for figures, tables, exhibits, equations.",
    "route": "/components/figure-caption",
    "docsUrl": "https://ux.tti.tamu.edu/components/figure-caption",
    "figmaNodePattern": "TUX / TuxFigureCaption",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxFigureCaption />",
      "react": "import { TuxFigureCaption } from \"@tti/tti-ux-react\";\n\n<TuxFigureCaption />",
      "webComponents": "<tux-figure-caption></tux-figure-caption>",
      "blazor": "<TuxFigureCaption />",
      "wordpress": "[tux_figure_caption]"
    }
  },
  {
    "name": "TuxFileDropzone",
    "tagName": "tux-file-dropzone",
    "kind": "component",
    "family": "components",
    "category": "forms",
    "wraps": "tux native",
    "blurb": "Drag-and-drop file upload.",
    "route": "/components/file-dropzone",
    "docsUrl": "https://ux.tti.tamu.edu/components/file-dropzone",
    "figmaNodePattern": "TUX / TuxFileDropzone",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxFileDropzone />",
      "react": "import { TuxFileDropzone } from \"@tti/tti-ux-react\";\n\n<TuxFileDropzone />",
      "webComponents": "<tux-file-dropzone></tux-file-dropzone>",
      "blazor": "<TuxFileDropzone />",
      "wordpress": "[tux_file_dropzone]"
    }
  },
  {
    "name": "TuxFilterPanel",
    "tagName": "tux-filter-panel",
    "kind": "component",
    "family": "components",
    "category": "forms",
    "wraps": "tux native",
    "blurb": "Left-rail facet panel — collapsible groups, checkbox lists with counts, applied-filter chips.",
    "route": "/components/filter-panel",
    "docsUrl": "https://ux.tti.tamu.edu/components/filter-panel",
    "figmaNodePattern": "TUX / TuxFilterPanel",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxFilterPanel />",
      "react": "import { TuxFilterPanel } from \"@tti/tti-ux-react\";\n\n<TuxFilterPanel />",
      "webComponents": "<tux-filter-panel></tux-filter-panel>",
      "blazor": "<TuxFilterPanel />",
      "wordpress": "[tux_filter_panel]"
    }
  },
  {
    "name": "TuxFocusView",
    "tagName": "tux-focus-view",
    "kind": "component",
    "family": "components",
    "category": "navigation",
    "wraps": "Teleport + native",
    "blurb": "Full-viewport overlay for inspecting one piece of content — back + title + actions chrome, content slot. \\\\\"Open chart in focus mode.\\\\\"",
    "route": "/components/focus-view",
    "docsUrl": "https://ux.tti.tamu.edu/components/focus-view",
    "figmaNodePattern": "TUX / TuxFocusView",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxFocusView />",
      "react": "import { TuxFocusView } from \"@tti/tti-ux-react\";\n\n<TuxFocusView />",
      "webComponents": "<tux-focus-view></tux-focus-view>",
      "blazor": "<TuxFocusView />",
      "wordpress": "[tux_focus_view]"
    }
  },
  {
    "name": "TuxFooter",
    "tagName": "tux-footer",
    "kind": "component",
    "family": "components",
    "category": "navigation",
    "wraps": "tux native",
    "blurb": "Unified institutional footer \\\\u2014 maroon contact and resources block over accessible legal baseline.",
    "route": "/components/footer",
    "docsUrl": "https://ux.tti.tamu.edu/components/footer",
    "figmaNodePattern": "TUX / TuxFooter",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxFooter />",
      "react": "import { TuxFooter } from \"@tti/tti-ux-react\";\n\n<TuxFooter />",
      "webComponents": "<tux-footer></tux-footer>",
      "blazor": "<TuxFooter />",
      "wordpress": "[tux_footer]"
    }
  },
  {
    "name": "TuxFootnote",
    "tagName": "tux-footnote",
    "kind": "component",
    "family": "components",
    "category": "publishing",
    "wraps": "UPopover",
    "blurb": "Inline footnote reference + hover preview.",
    "route": "/components/footnote",
    "docsUrl": "https://ux.tti.tamu.edu/components/footnote",
    "figmaNodePattern": "TUX / TuxFootnote",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxFootnote />",
      "react": "import { TuxFootnote } from \"@tti/tti-ux-react\";\n\n<TuxFootnote />",
      "webComponents": "<tux-footnote></tux-footnote>",
      "blazor": "<TuxFootnote />",
      "wordpress": "[tux_footnote]"
    }
  },
  {
    "name": "TuxFormField",
    "tagName": "tux-form-field",
    "kind": "component",
    "family": "components",
    "category": "forms",
    "wraps": "tux native",
    "blurb": "Label + help + input + error stack.",
    "route": "/components/form-field",
    "docsUrl": "https://ux.tti.tamu.edu/components/form-field",
    "figmaNodePattern": "TUX / TuxFormField",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxFormField />",
      "react": "import { TuxFormField } from \"@tti/tti-ux-react\";\n\n<TuxFormField />",
      "webComponents": "<tux-form-field></tux-form-field>",
      "blazor": "<TuxFormField />",
      "wordpress": "[tux_form_field]"
    }
  },
  {
    "name": "TuxFundingSource",
    "tagName": "tux-funding-source",
    "kind": "component",
    "family": "components",
    "category": "publishing",
    "wraps": "tux native",
    "blurb": "Funder identity strip / chip.",
    "route": "/components/tti-identity",
    "docsUrl": "https://ux.tti.tamu.edu/components/tti-identity",
    "figmaNodePattern": "TUX / TuxFundingSource",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxFundingSource />",
      "react": "import { TuxFundingSource } from \"@tti/tti-ux-react\";\n\n<TuxFundingSource />",
      "webComponents": "<tux-funding-source></tux-funding-source>",
      "blazor": "<TuxFundingSource />",
      "wordpress": "[tux_funding_source]"
    }
  },
  {
    "name": "TuxGroundedSources",
    "tagName": "tux-grounded-sources",
    "kind": "component",
    "family": "components",
    "category": "ai",
    "wraps": "tux native",
    "blurb": "Verified search and retrieval citation strip with domain badges and DLP verification status.",
    "route": "/components/chat-message",
    "docsUrl": "https://ux.tti.tamu.edu/components/chat-message",
    "figmaNodePattern": "TUX / TuxGroundedSources",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxGroundedSources />",
      "react": "import { TuxGroundedSources } from \"@tti/tti-ux-react\";\n\n<TuxGroundedSources />",
      "webComponents": "<tux-grounded-sources></tux-grounded-sources>",
      "blazor": "<TuxGroundedSources />",
      "wordpress": "[tux_grounded_sources]"
    }
  },
  {
    "name": "TuxHeroCanvas",
    "tagName": "tux-hero-canvas",
    "kind": "component",
    "family": "components",
    "category": "publishing",
    "wraps": "HTML5 2D Canvas",
    "blurb": "Atmospheric celestial and telemetry hero simulation inspired by OpenAI Sol with glowing corona, stardust sparks, constellation mesh, and seamless bottom dissolve.",
    "route": "/components/hero-canvas",
    "docsUrl": "https://ux.tti.tamu.edu/components/hero-canvas",
    "figmaNodePattern": "TUX / TuxHeroCanvas",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxHeroCanvas />",
      "react": "import { TuxHeroCanvas } from \"@tti/tti-ux-react\";\n\n<TuxHeroCanvas />",
      "webComponents": "<tux-hero-canvas></tux-hero-canvas>",
      "blazor": "<TuxHeroCanvas />",
      "wordpress": "[tux_hero_canvas]"
    }
  },
  {
    "name": "TuxIconFeature",
    "tagName": "tux-icon-feature",
    "kind": "component",
    "family": "components",
    "category": "data-display",
    "wraps": "tux native",
    "blurb": "Icon + headline + body grid — classic \\\\\"our services\\\\\" block, three tones, grid or list.",
    "route": "/components/icon-feature",
    "docsUrl": "https://ux.tti.tamu.edu/components/icon-feature",
    "figmaNodePattern": "TUX / TuxIconFeature",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxIconFeature />",
      "react": "import { TuxIconFeature } from \"@tti/tti-ux-react\";\n\n<TuxIconFeature />",
      "webComponents": "<tux-icon-feature></tux-icon-feature>",
      "blazor": "<TuxIconFeature />",
      "wordpress": "[tux_icon_feature]"
    }
  },
  {
    "name": "TuxIdentity",
    "tagName": "tux-identity",
    "kind": "component",
    "family": "components",
    "category": "publishing",
    "wraps": "tux native",
    "blurb": "Header lockup — logo + wordmark. Lockup or text-only, horizontal or stacked, three levels.",
    "route": "/components/identity",
    "docsUrl": "https://ux.tti.tamu.edu/components/identity",
    "figmaNodePattern": "TUX / TuxIdentity",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxIdentity />",
      "react": "import { TuxIdentity } from \"@tti/tti-ux-react\";\n\n<TuxIdentity />",
      "webComponents": "<tux-identity></tux-identity>",
      "blazor": "<TuxIdentity />",
      "wordpress": "[tux_identity]"
    }
  },
  {
    "name": "TuxInfiniteScroll",
    "tagName": "tux-infinite-scroll",
    "kind": "component",
    "family": "components",
    "category": "navigation",
    "wraps": "tux native",
    "blurb": "IntersectionObserver sentinel that auto-fetches the next page. Honors prefers-reduced-motion + keyboard fallback.",
    "route": "/components/infinite-scroll",
    "docsUrl": "https://ux.tti.tamu.edu/components/infinite-scroll",
    "figmaNodePattern": "TUX / TuxInfiniteScroll",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxInfiniteScroll />",
      "react": "import { TuxInfiniteScroll } from \"@tti/tti-ux-react\";\n\n<TuxInfiniteScroll />",
      "webComponents": "<tux-infinite-scroll></tux-infinite-scroll>",
      "blazor": "<TuxInfiniteScroll />",
      "wordpress": "[tux_infinite_scroll]"
    }
  },
  {
    "name": "TuxInfoLabel",
    "tagName": "tux-info-label",
    "kind": "component",
    "family": "components",
    "category": "forms",
    "wraps": "UPopover",
    "blurb": "Form-field label with (i) help — hover or click popover with the explanation. For ITAR rubrics, retention classes, classifier metrics.",
    "route": "/components/info-label",
    "docsUrl": "https://ux.tti.tamu.edu/components/info-label",
    "figmaNodePattern": "TUX / TuxInfoLabel",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxInfoLabel />",
      "react": "import { TuxInfoLabel } from \"@tti/tti-ux-react\";\n\n<TuxInfoLabel />",
      "webComponents": "<tux-info-label></tux-info-label>",
      "blazor": "<TuxInfoLabel />",
      "wordpress": "[tux_info_label]"
    }
  },
  {
    "name": "TuxInlineCitation",
    "tagName": "tux-inline-citation",
    "kind": "component",
    "family": "components",
    "category": "publishing",
    "wraps": "UPopover",
    "blurb": "Academic-style inline [N] citation pill — hover reveals title + URL + excerpt + score. Composes with TuxCitations footer list.",
    "route": "/components/inline-citation",
    "docsUrl": "https://ux.tti.tamu.edu/components/inline-citation",
    "figmaNodePattern": "TUX / TuxInlineCitation",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxInlineCitation />",
      "react": "import { TuxInlineCitation } from \"@tti/tti-ux-react\";\n\n<TuxInlineCitation />",
      "webComponents": "<tux-inline-citation></tux-inline-citation>",
      "blazor": "<TuxInlineCitation />",
      "wordpress": "[tux_inline_citation]"
    }
  },
  {
    "name": "TuxKbd",
    "tagName": "tux-kbd",
    "kind": "component",
    "family": "components",
    "category": "actions",
    "wraps": "tux native",
    "blurb": "Token-styled <kbd> for shortcut hints. Mac/PC modifier normalization, three sizes, combo + sequence forms.",
    "route": "/components/kbd",
    "docsUrl": "https://ux.tti.tamu.edu/components/kbd",
    "figmaNodePattern": "TUX / TuxKbd",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxKbd />",
      "react": "import { TuxKbd } from \"@tti/tti-ux-react\";\n\n<TuxKbd />",
      "webComponents": "<tux-kbd></tux-kbd>",
      "blazor": "<TuxKbd />",
      "wordpress": "[tux_kbd]"
    }
  },
  {
    "name": "TuxKeyValueInput",
    "tagName": "tux-key-value-input",
    "kind": "component",
    "family": "components",
    "category": "forms",
    "wraps": "tux native",
    "blurb": "Schema-aware key = value metadata & tag editor — required-key checks, autocomplete suggestions, and duplicate warnings.",
    "route": "/components/key-value-input",
    "docsUrl": "https://ux.tti.tamu.edu/components/key-value-input",
    "figmaNodePattern": "TUX / TuxKeyValueInput",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxKeyValueInput />",
      "react": "import { TuxKeyValueInput } from \"@tti/tti-ux-react\";\n\n<TuxKeyValueInput />",
      "webComponents": "<tux-key-value-input></tux-key-value-input>",
      "blazor": "<TuxKeyValueInput />",
      "wordpress": "[tux_key_value_input]"
    }
  },
  {
    "name": "TuxLab",
    "tagName": "tux-lab",
    "kind": "component",
    "family": "components",
    "category": "publishing",
    "wraps": "tux native",
    "blurb": "TTI lab / center identity card.",
    "route": "/components/tti-identity",
    "docsUrl": "https://ux.tti.tamu.edu/components/tti-identity",
    "figmaNodePattern": "TUX / TuxLab",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxLab />",
      "react": "import { TuxLab } from \"@tti/tti-ux-react\";\n\n<TuxLab />",
      "webComponents": "<tux-lab></tux-lab>",
      "blazor": "<TuxLab />",
      "wordpress": "[tux_lab]"
    }
  },
  {
    "name": "TuxLeaseBadge",
    "tagName": "tux-lease-badge",
    "kind": "component",
    "family": "components",
    "category": "feedback",
    "wraps": "tux native",
    "blurb": "Time-to-live (TTL) countdown & expiration status pill with inline extend and release actions.",
    "route": "/components/lease-badge",
    "docsUrl": "https://ux.tti.tamu.edu/components/lease-badge",
    "figmaNodePattern": "TUX / TuxLeaseBadge",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxLeaseBadge />",
      "react": "import { TuxLeaseBadge } from \"@tti/tti-ux-react\";\n\n<TuxLeaseBadge />",
      "webComponents": "<tux-lease-badge></tux-lease-badge>",
      "blazor": "<TuxLeaseBadge />",
      "wordpress": "[tux_lease_badge]"
    }
  },
  {
    "name": "TuxLedgerTable",
    "tagName": "tux-ledger-table",
    "kind": "component",
    "family": "components",
    "category": "data-display",
    "wraps": "tux native",
    "blurb": "Hierarchical grouped rollup table — collapsible categories, quantity × rate math, subtotals, grand total, and CSV/TSV export.",
    "route": "/components/ledger-table",
    "docsUrl": "https://ux.tti.tamu.edu/components/ledger-table",
    "figmaNodePattern": "TUX / TuxLedgerTable",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxLedgerTable />",
      "react": "import { TuxLedgerTable } from \"@tti/tti-ux-react\";\n\n<TuxLedgerTable />",
      "webComponents": "<tux-ledger-table></tux-ledger-table>",
      "blazor": "<TuxLedgerTable />",
      "wordpress": "[tux_ledger_table]"
    }
  },
  {
    "name": "TuxLinkList",
    "tagName": "tux-link-list",
    "kind": "component",
    "family": "components",
    "category": "data-display",
    "wraps": "tux native",
    "blurb": "Categorized resource list — grouped headings, optional descriptions, featured-item left bar.",
    "route": "/components/link-list",
    "docsUrl": "https://ux.tti.tamu.edu/components/link-list",
    "figmaNodePattern": "TUX / TuxLinkList",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxLinkList />",
      "react": "import { TuxLinkList } from \"@tti/tti-ux-react\";\n\n<TuxLinkList />",
      "webComponents": "<tux-link-list></tux-link-list>",
      "blazor": "<TuxLinkList />",
      "wordpress": "[tux_link_list]"
    }
  },
  {
    "name": "TuxLinkSlab",
    "tagName": "tux-link-slab",
    "kind": "component",
    "family": "components",
    "category": "actions",
    "wraps": "tux native",
    "blurb": "Full-width band of prominent links — footer-of-section navigation, three tones.",
    "route": "/components/link-slab",
    "docsUrl": "https://ux.tti.tamu.edu/components/link-slab",
    "figmaNodePattern": "TUX / TuxLinkSlab",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxLinkSlab />",
      "react": "import { TuxLinkSlab } from \"@tti/tti-ux-react\";\n\n<TuxLinkSlab />",
      "webComponents": "<tux-link-slab></tux-link-slab>",
      "blazor": "<TuxLinkSlab />",
      "wordpress": "[tux_link_slab]"
    }
  },
  {
    "name": "TuxLoadMore",
    "tagName": "tux-load-more",
    "kind": "component",
    "family": "components",
    "category": "actions",
    "wraps": "tux native",
    "blurb": "Explicit \\\\\"Load more\\\\\" button + remaining count + terminal divider when all loaded. SEO-friendly middle ground.",
    "route": "/components/load-more",
    "docsUrl": "https://ux.tti.tamu.edu/components/load-more",
    "figmaNodePattern": "TUX / TuxLoadMore",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxLoadMore />",
      "react": "import { TuxLoadMore } from \"@tti/tti-ux-react\";\n\n<TuxLoadMore />",
      "webComponents": "<tux-load-more></tux-load-more>",
      "blazor": "<TuxLoadMore />",
      "wordpress": "[tux_load_more]"
    }
  },
  {
    "name": "TuxMapEmbed",
    "tagName": "tux-map-embed",
    "kind": "component",
    "family": "components",
    "category": "data-display",
    "wraps": "iframe / slot",
    "blurb": "Library-agnostic map embed wrapper.",
    "route": "/components/geospatial",
    "docsUrl": "https://ux.tti.tamu.edu/components/geospatial",
    "figmaNodePattern": "TUX / TuxMapEmbed",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxMapEmbed />",
      "react": "import { TuxMapEmbed } from \"@tti/tti-ux-react\";\n\n<TuxMapEmbed />",
      "webComponents": "<tux-map-embed></tux-map-embed>",
      "blazor": "<TuxMapEmbed />",
      "wordpress": "[tux_map_embed]"
    }
  },
  {
    "name": "TuxMapLegend",
    "tagName": "tux-map-legend",
    "kind": "component",
    "family": "components",
    "category": "data-display",
    "wraps": "tux native",
    "blurb": "Standalone legend for embedded maps.",
    "route": "/components/geospatial",
    "docsUrl": "https://ux.tti.tamu.edu/components/geospatial",
    "figmaNodePattern": "TUX / TuxMapLegend",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxMapLegend />",
      "react": "import { TuxMapLegend } from \"@tti/tti-ux-react\";\n\n<TuxMapLegend />",
      "webComponents": "<tux-map-legend></tux-map-legend>",
      "blazor": "<TuxMapLegend />",
      "wordpress": "[tux_map_legend]"
    }
  },
  {
    "name": "TuxMapMarker",
    "tagName": "tux-map-marker",
    "kind": "component",
    "family": "components",
    "category": "data-display",
    "wraps": "tux native SVG",
    "blurb": "Research-typed map marker.",
    "route": "/components/geospatial",
    "docsUrl": "https://ux.tti.tamu.edu/components/geospatial",
    "figmaNodePattern": "TUX / TuxMapMarker",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxMapMarker />",
      "react": "import { TuxMapMarker } from \"@tti/tti-ux-react\";\n\n<TuxMapMarker />",
      "webComponents": "<tux-map-marker></tux-map-marker>",
      "blazor": "<TuxMapMarker />",
      "wordpress": "[tux_map_marker]"
    }
  },
  {
    "name": "TuxMarkdownEditor",
    "tagName": "tux-markdown-editor",
    "kind": "component",
    "family": "components",
    "category": "forms",
    "wraps": "tux native (no deps)",
    "blurb": "Textarea with markdown shortcuts.",
    "route": "/components/markdown-editor",
    "docsUrl": "https://ux.tti.tamu.edu/components/markdown-editor",
    "figmaNodePattern": "TUX / TuxMarkdownEditor",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxMarkdownEditor />",
      "react": "import { TuxMarkdownEditor } from \"@tti/tti-ux-react\";\n\n<TuxMarkdownEditor />",
      "webComponents": "<tux-markdown-editor></tux-markdown-editor>",
      "blazor": "<TuxMarkdownEditor />",
      "wordpress": "[tux_markdown_editor]"
    }
  },
  {
    "name": "TuxMcpEmbed",
    "tagName": "tux-mcp-embed",
    "kind": "component",
    "family": "components",
    "category": "ai",
    "wraps": "tux native",
    "blurb": "Frame for interactive third-party MCP app output — app icon + name + window controls + skeleton. Sister to TuxArtifact.",
    "route": "/components/mcp-embed",
    "docsUrl": "https://ux.tti.tamu.edu/components/mcp-embed",
    "figmaNodePattern": "TUX / TuxMcpEmbed",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxMcpEmbed />",
      "react": "import { TuxMcpEmbed } from \"@tti/tti-ux-react\";\n\n<TuxMcpEmbed />",
      "webComponents": "<tux-mcp-embed></tux-mcp-embed>",
      "blazor": "<TuxMcpEmbed />",
      "wordpress": "[tux_mcp_embed]"
    }
  },
  {
    "name": "TuxMediaSlab",
    "tagName": "tux-media-slab",
    "kind": "component",
    "family": "components",
    "category": "publishing",
    "wraps": "tux native",
    "blurb": "Full-bleed hero band — overlay (drama) or split (editorial), three heights, three tones.",
    "route": "/components/media-slab",
    "docsUrl": "https://ux.tti.tamu.edu/components/media-slab",
    "figmaNodePattern": "TUX / TuxMediaSlab",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxMediaSlab />",
      "react": "import { TuxMediaSlab } from \"@tti/tti-ux-react\";\n\n<TuxMediaSlab />",
      "webComponents": "<tux-media-slab></tux-media-slab>",
      "blazor": "<TuxMediaSlab />",
      "wordpress": "[tux_media_slab]"
    }
  },
  {
    "name": "TuxMegaMenu",
    "tagName": "tux-mega-menu",
    "kind": "component",
    "family": "components",
    "category": "navigation",
    "wraps": "tux native",
    "blurb": "Full-width multi-column panel from a top-bar item, optional featured tile. Composes inside TuxSiteNav.",
    "route": "/components/site-nav",
    "docsUrl": "https://ux.tti.tamu.edu/components/site-nav",
    "figmaNodePattern": "TUX / TuxMegaMenu",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxMegaMenu />",
      "react": "import { TuxMegaMenu } from \"@tti/tti-ux-react\";\n\n<TuxMegaMenu />",
      "webComponents": "<tux-mega-menu></tux-mega-menu>",
      "blazor": "<TuxMegaMenu />",
      "wordpress": "[tux_mega_menu]"
    }
  },
  {
    "name": "TuxMenuBar",
    "tagName": "tux-menu-bar",
    "kind": "component",
    "family": "components",
    "category": "actions",
    "wraps": "UDropdownMenu",
    "blurb": "In-window File / Edit / View / Help menu strip for Windows / Linux Tauri shells. Skipped on Mac (system menu wins).",
    "route": "/components/menu-bar",
    "docsUrl": "https://ux.tti.tamu.edu/components/menu-bar",
    "figmaNodePattern": "TUX / TuxMenuBar",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxMenuBar />",
      "react": "import { TuxMenuBar } from \"@tti/tti-ux-react\";\n\n<TuxMenuBar />",
      "webComponents": "<tux-menu-bar></tux-menu-bar>",
      "blazor": "<TuxMenuBar />",
      "wordpress": "[tux_menu_bar]"
    }
  },
  {
    "name": "TuxMetroInset",
    "tagName": "tux-metro-inset",
    "kind": "component",
    "family": "visualizations",
    "category": "geospatial",
    "wraps": "tux native (neighborhood grid)",
    "blurb": "Neighborhood-grid inset for a single metro, intended for 4-up side-by-side layouts (Houston · DFW · Austin · San Antonio).",
    "route": "/visualizations/metro-inset",
    "docsUrl": "https://ux.tti.tamu.edu/visualizations/metro-inset",
    "figmaNodePattern": "TUX / TuxMetroInset",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxMetroInset />",
      "react": "import { TuxMetroInset } from \"@tti/tti-ux-react\";\n\n<TuxMetroInset />",
      "webComponents": "<tux-metro-inset></tux-metro-inset>",
      "blazor": "<TuxMetroInset />",
      "wordpress": "[tux_metro_inset]"
    }
  },
  {
    "name": "TuxMobileFrame",
    "tagName": "tux-mobile-frame",
    "kind": "component",
    "family": "components",
    "category": "publishing",
    "wraps": "tux native (CSS)",
    "blurb": "Stylized device chrome for screenshots — iOS (iPhone) or Android (Pixel) via platform prop. Doc-only marketing helper.",
    "route": "/components/mobile-frame",
    "docsUrl": "https://ux.tti.tamu.edu/components/mobile-frame",
    "figmaNodePattern": "TUX / TuxMobileFrame",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxMobileFrame />",
      "react": "import { TuxMobileFrame } from \"@tti/tti-ux-react\";\n\n<TuxMobileFrame />",
      "webComponents": "<tux-mobile-frame></tux-mobile-frame>",
      "blazor": "<TuxMobileFrame />",
      "wordpress": "[tux_mobile_frame]"
    }
  },
  {
    "name": "TuxModal",
    "tagName": "tux-modal",
    "kind": "component",
    "family": "components",
    "category": "feedback",
    "wraps": "UModal",
    "blurb": "UModal with editorial rhythm — optional eyebrow, gold-bar underlined title.",
    "route": "/components/modal",
    "docsUrl": "https://ux.tti.tamu.edu/components/modal",
    "figmaNodePattern": "TUX / TuxModal",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxModal />",
      "react": "import { TuxModal } from \"@tti/tti-ux-react\";\n\n<TuxModal />",
      "webComponents": "<tux-modal></tux-modal>",
      "blazor": "<TuxModal />",
      "wordpress": "[tux_modal]"
    }
  },
  {
    "name": "TuxNewsCollection",
    "tagName": "tux-news-collection",
    "kind": "component",
    "family": "components",
    "category": "data-display",
    "wraps": "tux native",
    "blurb": "News article list — date + thumbnail + headline + dek + read-more, stacked or grid.",
    "route": "/components/news-collection",
    "docsUrl": "https://ux.tti.tamu.edu/components/news-collection",
    "figmaNodePattern": "TUX / TuxNewsCollection",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxNewsCollection />",
      "react": "import { TuxNewsCollection } from \"@tti/tti-ux-react\";\n\n<TuxNewsCollection />",
      "webComponents": "<tux-news-collection></tux-news-collection>",
      "blazor": "<TuxNewsCollection />",
      "wordpress": "[tux_news_collection]"
    }
  },
  {
    "name": "TuxPageContainer",
    "tagName": "tux-page-container",
    "kind": "component",
    "family": "components",
    "category": "navigation",
    "wraps": "tux native",
    "blurb": "Content-width primitive — default/wide/prose measures backed by --layout-* tokens; pairs with --tux-nav-height.",
    "route": "/components/page-container",
    "docsUrl": "https://ux.tti.tamu.edu/components/page-container",
    "figmaNodePattern": "TUX / TuxPageContainer",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxPageContainer />",
      "react": "import { TuxPageContainer } from \"@tti/tti-ux-react\";\n\n<TuxPageContainer />",
      "webComponents": "<tux-page-container></tux-page-container>",
      "blazor": "<TuxPageContainer />",
      "wordpress": "[tux_page_container]"
    }
  },
  {
    "name": "TuxPageHeader",
    "tagName": "tux-page-header",
    "kind": "component",
    "family": "components",
    "category": "publishing",
    "wraps": "tux native",
    "blurb": "Eyebrow + gold-bar heading + subtitle — plain default, neutral or maroon panel, hero rhythm.",
    "route": "/components/page-header",
    "docsUrl": "https://ux.tti.tamu.edu/components/page-header",
    "figmaNodePattern": "TUX / TuxPageHeader",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxPageHeader />",
      "react": "import { TuxPageHeader } from \"@tti/tti-ux-react\";\n\n<TuxPageHeader />",
      "webComponents": "<tux-page-header></tux-page-header>",
      "blazor": "<TuxPageHeader />",
      "wordpress": "[tux_page_header]"
    }
  },
  {
    "name": "TuxPagination",
    "tagName": "tux-pagination",
    "kind": "component",
    "family": "components",
    "category": "navigation",
    "wraps": "tux native",
    "blurb": "Page-number controls — squarified active page, ellipsis truncation, optional status line.",
    "route": "/components/pagination",
    "docsUrl": "https://ux.tti.tamu.edu/components/pagination",
    "figmaNodePattern": "TUX / TuxPagination",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxPagination />",
      "react": "import { TuxPagination } from \"@tti/tti-ux-react\";\n\n<TuxPagination />",
      "webComponents": "<tux-pagination></tux-pagination>",
      "blazor": "<TuxPagination />",
      "wordpress": "[tux_pagination]"
    }
  },
  {
    "name": "TuxPaperMeta",
    "tagName": "tux-paper-meta",
    "kind": "component",
    "family": "components",
    "category": "publishing",
    "wraps": "tux native",
    "blurb": "Academic paper metadata block.",
    "route": "/components/paper-meta",
    "docsUrl": "https://ux.tti.tamu.edu/components/paper-meta",
    "figmaNodePattern": "TUX / TuxPaperMeta",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxPaperMeta />",
      "react": "import { TuxPaperMeta } from \"@tti/tti-ux-react\";\n\n<TuxPaperMeta />",
      "webComponents": "<tux-paper-meta></tux-paper-meta>",
      "blazor": "<TuxPaperMeta />",
      "wordpress": "[tux_paper_meta]"
    }
  },
  {
    "name": "TuxPeriodPicker",
    "tagName": "tux-period-picker",
    "kind": "component",
    "family": "components",
    "category": "forms",
    "wraps": "tux native",
    "blurb": "Reporting cycle, fiscal quarter & date-range selector — preset pills, cycle steppers, and prior-period comparison toggle.",
    "route": "/components/period-picker",
    "docsUrl": "https://ux.tti.tamu.edu/components/period-picker",
    "figmaNodePattern": "TUX / TuxPeriodPicker",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxPeriodPicker />",
      "react": "import { TuxPeriodPicker } from \"@tti/tti-ux-react\";\n\n<TuxPeriodPicker />",
      "webComponents": "<tux-period-picker></tux-period-picker>",
      "blazor": "<TuxPeriodPicker />",
      "wordpress": "[tux_period_picker]"
    }
  },
  {
    "name": "TuxPhotoGrid",
    "tagName": "tux-photo-grid",
    "kind": "component",
    "family": "components",
    "category": "data-display",
    "wraps": "tux native",
    "blurb": "Uniform image grid — photo (full color, captioned) or logo wall (grayscale-on-hover).",
    "route": "/components/photo-grid",
    "docsUrl": "https://ux.tti.tamu.edu/components/photo-grid",
    "figmaNodePattern": "TUX / TuxPhotoGrid",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxPhotoGrid />",
      "react": "import { TuxPhotoGrid } from \"@tti/tti-ux-react\";\n\n<TuxPhotoGrid />",
      "webComponents": "<tux-photo-grid></tux-photo-grid>",
      "blazor": "<TuxPhotoGrid />",
      "wordpress": "[tux_photo_grid]"
    }
  },
  {
    "name": "TuxPivotMatrix",
    "tagName": "tux-pivot-matrix",
    "kind": "component",
    "family": "components",
    "category": "data-display",
    "wraps": "tux native",
    "blurb": "Two-axis cross-tabulation matrix — row/column marginals, grand total, and contrast-safe sequential cell shading.",
    "route": "/components/pivot-matrix",
    "docsUrl": "https://ux.tti.tamu.edu/components/pivot-matrix",
    "figmaNodePattern": "TUX / TuxPivotMatrix",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxPivotMatrix />",
      "react": "import { TuxPivotMatrix } from \"@tti/tti-ux-react\";\n\n<TuxPivotMatrix />",
      "webComponents": "<tux-pivot-matrix></tux-pivot-matrix>",
      "blazor": "<TuxPivotMatrix />",
      "wordpress": "[tux_pivot_matrix]"
    }
  },
  {
    "name": "TuxPopover",
    "tagName": "tux-popover",
    "kind": "component",
    "family": "components",
    "category": "feedback",
    "wraps": "UPopover",
    "blurb": "Richer-than-tooltip floating panel — title + body + actions. Maroon hairline rule under title. Click default; hover for read-only.",
    "route": "/components/popover",
    "docsUrl": "https://ux.tti.tamu.edu/components/popover",
    "figmaNodePattern": "TUX / TuxPopover",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxPopover />",
      "react": "import { TuxPopover } from \"@tti/tti-ux-react\";\n\n<TuxPopover />",
      "webComponents": "<tux-popover></tux-popover>",
      "blazor": "<TuxPopover />",
      "wordpress": "[tux_popover]"
    }
  },
  {
    "name": "TuxPortalHeader",
    "tagName": "tux-portal-header",
    "kind": "component",
    "family": "components",
    "category": "navigation",
    "wraps": "tux native",
    "blurb": "Two-tier institutional header matching tti.tamu.edu — Maroon utility bar + crisp brand ribbon + mobile drawer.",
    "route": "/components/portal-shell",
    "docsUrl": "https://ux.tti.tamu.edu/components/portal-shell",
    "figmaNodePattern": "TUX / TuxPortalHeader",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxPortalHeader />",
      "react": "import { TuxPortalHeader } from \"@tti/tti-ux-react\";\n\n<TuxPortalHeader />",
      "webComponents": "<tux-portal-header></tux-portal-header>",
      "blazor": "<TuxPortalHeader />",
      "wordpress": "[tux_portal_header]"
    }
  },
  {
    "name": "TuxPortalShell",
    "tagName": "tux-portal-shell",
    "kind": "component",
    "family": "components",
    "category": "navigation",
    "wraps": "tux native",
    "blurb": "Turnkey institutional portal layout shell — sticky header, gold-rule breadcrumbs subnav, hero slot, feedback pill, and TuxFooter.",
    "route": "/components/portal-shell",
    "docsUrl": "https://ux.tti.tamu.edu/components/portal-shell",
    "figmaNodePattern": "TUX / TuxPortalShell",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxPortalShell />",
      "react": "import { TuxPortalShell } from \"@tti/tti-ux-react\";\n\n<TuxPortalShell />",
      "webComponents": "<tux-portal-shell></tux-portal-shell>",
      "blazor": "<TuxPortalShell />",
      "wordpress": "[tux_portal_shell]"
    }
  },
  {
    "name": "TuxProgram",
    "tagName": "tux-program",
    "kind": "component",
    "family": "components",
    "category": "publishing",
    "wraps": "tux native",
    "blurb": "Research-program identity card.",
    "route": "/components/tti-identity",
    "docsUrl": "https://ux.tti.tamu.edu/components/tti-identity",
    "figmaNodePattern": "TUX / TuxProgram",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxProgram />",
      "react": "import { TuxProgram } from \"@tti/tti-ux-react\";\n\n<TuxProgram />",
      "webComponents": "<tux-program></tux-program>",
      "blazor": "<TuxProgram />",
      "wordpress": "[tux_program]"
    }
  },
  {
    "name": "TuxProportionalInput",
    "tagName": "tux-proportional-input",
    "kind": "component",
    "family": "components",
    "category": "forms",
    "wraps": "tux native",
    "blurb": "Constrained fixed-sum & ratio allocation control — stacked preview bar, row lock toggles, and auto-rebalance.",
    "route": "/components/proportional-input",
    "docsUrl": "https://ux.tti.tamu.edu/components/proportional-input",
    "figmaNodePattern": "TUX / TuxProportionalInput",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxProportionalInput />",
      "react": "import { TuxProportionalInput } from \"@tti/tti-ux-react\";\n\n<TuxProportionalInput />",
      "webComponents": "<tux-proportional-input></tux-proportional-input>",
      "blazor": "<TuxProportionalInput />",
      "wordpress": "[tux_proportional_input]"
    }
  },
  {
    "name": "TuxProse",
    "tagName": "tux-prose",
    "kind": "component",
    "family": "components",
    "category": "publishing",
    "wraps": "tux native",
    "blurb": "Typographic shell for long-form markdown — H1/H2/H3/p/list/code/table/blockquote rhythm in one wrapper.",
    "route": "/components/prose",
    "docsUrl": "https://ux.tti.tamu.edu/components/prose",
    "figmaNodePattern": "TUX / TuxProse",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxProse />",
      "react": "import { TuxProse } from \"@tti/tti-ux-react\";\n\n<TuxProse />",
      "webComponents": "<tux-prose></tux-prose>",
      "blazor": "<TuxProse />",
      "wordpress": "[tux_prose]"
    }
  },
  {
    "name": "TuxQACollection",
    "tagName": "tux-qa-collection",
    "kind": "component",
    "family": "components",
    "category": "publishing",
    "wraps": "tux native",
    "blurb": "Long-form Q&A — always expanded, designed to be read top-to-bottom (companion to TuxAccordion).",
    "route": "/components/qa-collection",
    "docsUrl": "https://ux.tti.tamu.edu/components/qa-collection",
    "figmaNodePattern": "TUX / TuxQACollection",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxQACollection />",
      "react": "import { TuxQACollection } from \"@tti/tti-ux-react\";\n\n<TuxQACollection />",
      "webComponents": "<tux-qa-collection></tux-qa-collection>",
      "blazor": "<TuxQACollection />",
      "wordpress": "[tux_qa_collection]"
    }
  },
  {
    "name": "TuxRailNav",
    "tagName": "tux-rail-nav",
    "kind": "component",
    "family": "components",
    "category": "navigation",
    "wraps": "tux (no U-primitive)",
    "blurb": "Collapsible sidebar/rail navigation — native <details> disclosure groups (accessible without roleless aria-expanded), icon-only collapsed mode. tux-owned replacement for UNavigationMenu in app shells.",
    "route": "/components/rail-nav",
    "docsUrl": "https://ux.tti.tamu.edu/components/rail-nav",
    "figmaNodePattern": "TUX / TuxRailNav",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxRailNav />",
      "react": "import { TuxRailNav } from \"@tti/tti-ux-react\";\n\n<TuxRailNav />",
      "webComponents": "<tux-rail-nav></tux-rail-nav>",
      "blazor": "<TuxRailNav />",
      "wordpress": "[tux_rail_nav]"
    }
  },
  {
    "name": "TuxReactionBar",
    "tagName": "tux-reaction-bar",
    "kind": "component",
    "family": "components",
    "category": "actions",
    "wraps": "tux native",
    "blurb": "Light-touch helpful/question/disagree row. Lower friction than a feedback form; counts display-only.",
    "route": "/components/reaction-bar",
    "docsUrl": "https://ux.tti.tamu.edu/components/reaction-bar",
    "figmaNodePattern": "TUX / TuxReactionBar",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxReactionBar />",
      "react": "import { TuxReactionBar } from \"@tti/tti-ux-react\";\n\n<TuxReactionBar />",
      "webComponents": "<tux-reaction-bar></tux-reaction-bar>",
      "blazor": "<TuxReactionBar />",
      "wordpress": "[tux_reaction_bar]"
    }
  },
  {
    "name": "TuxReasoning",
    "tagName": "tux-reasoning",
    "kind": "component",
    "family": "components",
    "category": "ai",
    "wraps": "tux native",
    "blurb": "Collapsible chain-of-thought reasoning drawer with duration and token velocity metrics.",
    "route": "/components/chat-message",
    "docsUrl": "https://ux.tti.tamu.edu/components/chat-message",
    "figmaNodePattern": "TUX / TuxReasoning",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxReasoning />",
      "react": "import { TuxReasoning } from \"@tti/tti-ux-react\";\n\n<TuxReasoning />",
      "webComponents": "<tux-reasoning></tux-reasoning>",
      "blazor": "<TuxReasoning />",
      "wordpress": "[tux_reasoning]"
    }
  },
  {
    "name": "TuxRecordDiff",
    "tagName": "tux-record-diff",
    "kind": "component",
    "family": "components",
    "category": "data-display",
    "wraps": "tux native",
    "blurb": "Structured field & metric delta viewer — baseline vs current comparison, signed % change, and changes-only filter.",
    "route": "/components/record-diff",
    "docsUrl": "https://ux.tti.tamu.edu/components/record-diff",
    "figmaNodePattern": "TUX / TuxRecordDiff",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxRecordDiff />",
      "react": "import { TuxRecordDiff } from \"@tti/tti-ux-react\";\n\n<TuxRecordDiff />",
      "webComponents": "<tux-record-diff></tux-record-diff>",
      "blazor": "<TuxRecordDiff />",
      "wordpress": "[tux_record_diff]"
    }
  },
  {
    "name": "TuxRecordHighlights",
    "tagName": "tux-record-highlights",
    "kind": "component",
    "family": "components",
    "category": "data-display",
    "wraps": "tux native",
    "blurb": "Pinned entity summary bar — title, status badge, KPI metric chips, and primary action buttons.",
    "route": "/components/record-highlights",
    "docsUrl": "https://ux.tti.tamu.edu/components/record-highlights",
    "figmaNodePattern": "TUX / TuxRecordHighlights",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxRecordHighlights />",
      "react": "import { TuxRecordHighlights } from \"@tti/tti-ux-react\";\n\n<TuxRecordHighlights />",
      "webComponents": "<tux-record-highlights></tux-record-highlights>",
      "blazor": "<TuxRecordHighlights />",
      "wordpress": "[tux_record_highlights]"
    }
  },
  {
    "name": "TuxRecordMatcher",
    "tagName": "tux-record-matcher",
    "kind": "component",
    "family": "components",
    "category": "forms",
    "wraps": "tux native",
    "blurb": "Side-by-side orphan record to fuzzy candidate resolution queue with confidence badges and rule creation.",
    "route": "/components/record-matcher",
    "docsUrl": "https://ux.tti.tamu.edu/components/record-matcher",
    "figmaNodePattern": "TUX / TuxRecordMatcher",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxRecordMatcher />",
      "react": "import { TuxRecordMatcher } from \"@tti/tti-ux-react\";\n\n<TuxRecordMatcher />",
      "webComponents": "<tux-record-matcher></tux-record-matcher>",
      "blazor": "<TuxRecordMatcher />",
      "wordpress": "[tux_record_matcher]"
    }
  },
  {
    "name": "TuxRemovableChip",
    "tagName": "tux-removable-chip",
    "kind": "component",
    "family": "components",
    "category": "forms",
    "wraps": "tux native",
    "blurb": "Interactive dismissible chip — leading icon, three sizes, removable × or click-to-remove whole pill. Distinct from TuxBadge (decorative).",
    "route": "/components/removable-chip",
    "docsUrl": "https://ux.tti.tamu.edu/components/removable-chip",
    "figmaNodePattern": "TUX / TuxRemovableChip",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxRemovableChip />",
      "react": "import { TuxRemovableChip } from \"@tti/tti-ux-react\";\n\n<TuxRemovableChip />",
      "webComponents": "<tux-removable-chip></tux-removable-chip>",
      "blazor": "<TuxRemovableChip />",
      "wordpress": "[tux_removable_chip]"
    }
  },
  {
    "name": "TuxReportFrame",
    "tagName": "tux-report-frame",
    "kind": "component",
    "family": "reports",
    "category": "publishing",
    "wraps": "tux native",
    "blurb": "Page-sized canvas (letter / a4) for PDF + print. Stats, charts, prose go inside.",
    "route": "/reports/frame",
    "docsUrl": "https://ux.tti.tamu.edu/reports/frame",
    "figmaNodePattern": "TUX / TuxReportFrame",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxReportFrame />",
      "react": "import { TuxReportFrame } from \"@tti/tti-ux-react\";\n\n<TuxReportFrame />",
      "webComponents": "<tux-report-frame></tux-report-frame>",
      "blazor": "<TuxReportFrame />",
      "wordpress": "[tux_report_frame]"
    }
  },
  {
    "name": "TuxReportPrintSheet",
    "tagName": "tux-report-print-sheet",
    "kind": "component",
    "family": "reports",
    "category": "publishing",
    "wraps": "useHead injection",
    "blurb": "Drop-in print stylesheet; hides chrome, paginates with data-print-break attrs.",
    "route": "/reports/print-sheet",
    "docsUrl": "https://ux.tti.tamu.edu/reports/print-sheet",
    "figmaNodePattern": "TUX / TuxReportPrintSheet",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxReportPrintSheet />",
      "react": "import { TuxReportPrintSheet } from \"@tti/tti-ux-react\";\n\n<TuxReportPrintSheet />",
      "webComponents": "<tux-report-print-sheet></tux-report-print-sheet>",
      "blazor": "<TuxReportPrintSheet />",
      "wordpress": "[tux_report_print_sheet]"
    }
  },
  {
    "name": "TuxReportWebFrame",
    "tagName": "tux-report-web-frame",
    "kind": "component",
    "family": "reports",
    "category": "publishing",
    "wraps": "tux native",
    "blurb": "Long-form web-hosted narrative — cover, byline, lede, sticky TOC, body, footer.",
    "route": "/reports/web-frame",
    "docsUrl": "https://ux.tti.tamu.edu/reports/web-frame",
    "figmaNodePattern": "TUX / TuxReportWebFrame",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxReportWebFrame />",
      "react": "import { TuxReportWebFrame } from \"@tti/tti-ux-react\";\n\n<TuxReportWebFrame />",
      "webComponents": "<tux-report-web-frame></tux-report-web-frame>",
      "blazor": "<TuxReportWebFrame />",
      "wordpress": "[tux_report_web_frame]"
    }
  },
  {
    "name": "TuxResearcher",
    "tagName": "tux-researcher",
    "kind": "component",
    "family": "components",
    "category": "publishing",
    "wraps": "tux native",
    "blurb": "Researcher profile card.",
    "route": "/components/tti-identity",
    "docsUrl": "https://ux.tti.tamu.edu/components/tti-identity",
    "figmaNodePattern": "TUX / TuxResearcher",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxResearcher />",
      "react": "import { TuxResearcher } from \"@tti/tti-ux-react\";\n\n<TuxResearcher />",
      "webComponents": "<tux-researcher></tux-researcher>",
      "blazor": "<TuxResearcher />",
      "wordpress": "[tux_researcher]"
    }
  },
  {
    "name": "TuxResultCount",
    "tagName": "tux-result-count",
    "kind": "component",
    "family": "components",
    "category": "data-display",
    "wraps": "tux native",
    "blurb": "\\\\\"Showing 1–24 of 412 corridors · 24 per page\\\\\". Pairs with TuxPagination / TuxLoadMore / TuxInfiniteScroll.",
    "route": "/components/result-count",
    "docsUrl": "https://ux.tti.tamu.edu/components/result-count",
    "figmaNodePattern": "TUX / TuxResultCount",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxResultCount />",
      "react": "import { TuxResultCount } from \"@tti/tti-ux-react\";\n\n<TuxResultCount />",
      "webComponents": "<tux-result-count></tux-result-count>",
      "blazor": "<TuxResultCount />",
      "wordpress": "[tux_result_count]"
    }
  },
  {
    "name": "TuxRichDataGrid",
    "tagName": "tux-rich-data-grid",
    "kind": "component",
    "family": "components",
    "category": "data-display",
    "wraps": "tux native",
    "blurb": "Interactive data grid — sticky header, row selection, expandable detail, sort + filter chips, bulk-action bar. Corridor-class operational surfaces.",
    "route": "/components/rich-data-grid",
    "docsUrl": "https://ux.tti.tamu.edu/components/rich-data-grid",
    "figmaNodePattern": "TUX / TuxRichDataGrid",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxRichDataGrid />",
      "react": "import { TuxRichDataGrid } from \"@tti/tti-ux-react\";\n\n<TuxRichDataGrid />",
      "webComponents": "<tux-rich-data-grid></tux-rich-data-grid>",
      "blazor": "<TuxRichDataGrid />",
      "wordpress": "[tux_rich_data_grid]"
    }
  },
  {
    "name": "TuxRichTextEditor",
    "tagName": "tux-rich-text-editor",
    "kind": "component",
    "family": "components",
    "category": "forms",
    "wraps": "Tiptap + lowlight",
    "blurb": "Canonical WYSIWYG — Tiptap-based, 7 toolbar groups, tables, task lists, source-mode toggle, full-screen, syntax highlighting.",
    "route": "/components/rich-text-editor",
    "docsUrl": "https://ux.tti.tamu.edu/components/rich-text-editor",
    "figmaNodePattern": "TUX / TuxRichTextEditor",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxRichTextEditor />",
      "react": "import { TuxRichTextEditor } from \"@tti/tti-ux-react\";\n\n<TuxRichTextEditor />",
      "webComponents": "<tux-rich-text-editor></tux-rich-text-editor>",
      "blazor": "<TuxRichTextEditor />",
      "wordpress": "[tux_rich_text_editor]"
    }
  },
  {
    "name": "TuxRoadwayCrossSection",
    "tagName": "tux-roadway-cross-section",
    "kind": "component",
    "family": "components",
    "category": "data-display",
    "wraps": "tux native 3D + SVG",
    "blurb": "AASHTO/TxDOT geometric highway cross-section with 2D CAD blueprint profile and 3D pitched spatial perspective analysis.",
    "route": "/components/geospatial",
    "docsUrl": "https://ux.tti.tamu.edu/components/geospatial",
    "figmaNodePattern": "TUX / TuxRoadwayCrossSection",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxRoadwayCrossSection />",
      "react": "import { TuxRoadwayCrossSection } from \"@tti/tti-ux-react\";\n\n<TuxRoadwayCrossSection />",
      "webComponents": "<tux-roadway-cross-section></tux-roadway-cross-section>",
      "blazor": "<TuxRoadwayCrossSection />",
      "wordpress": "[tux_roadway_cross_section]"
    }
  },
  {
    "name": "TuxRuleBuilder",
    "tagName": "tux-rule-builder",
    "kind": "component",
    "family": "components",
    "category": "forms",
    "wraps": "tux native",
    "blurb": "Relational query UI — field + operator + value rows, AND/OR groupers, nestable. Sister to faceted TuxFilterPanel.",
    "route": "/components/rule-builder",
    "docsUrl": "https://ux.tti.tamu.edu/components/rule-builder",
    "figmaNodePattern": "TUX / TuxRuleBuilder",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxRuleBuilder />",
      "react": "import { TuxRuleBuilder } from \"@tti/tti-ux-react\";\n\n<TuxRuleBuilder />",
      "webComponents": "<tux-rule-builder></tux-rule-builder>",
      "blazor": "<TuxRuleBuilder />",
      "wordpress": "[tux_rule_builder]"
    }
  },
  {
    "name": "TuxScheduleMatrix",
    "tagName": "tux-schedule-matrix",
    "kind": "component",
    "family": "components",
    "category": "forms",
    "wraps": "tux native",
    "blurb": "Interactive day × time-block availability & schedule paint matrix with presets and 2-D keyboard navigation.",
    "route": "/components/schedule-matrix",
    "docsUrl": "https://ux.tti.tamu.edu/components/schedule-matrix",
    "figmaNodePattern": "TUX / TuxScheduleMatrix",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxScheduleMatrix />",
      "react": "import { TuxScheduleMatrix } from \"@tti/tti-ux-react\";\n\n<TuxScheduleMatrix />",
      "webComponents": "<tux-schedule-matrix></tux-schedule-matrix>",
      "blazor": "<TuxScheduleMatrix />",
      "wordpress": "[tux_schedule_matrix]"
    }
  },
  {
    "name": "TuxScrollTop",
    "tagName": "tux-scroll-top",
    "kind": "component",
    "family": "components",
    "category": "navigation",
    "wraps": "tux native",
    "blurb": "EmDash-inspired circular reading-progress button that smoothly scrolls back to the top of the page.",
    "route": "/components/scroll-top",
    "docsUrl": "https://ux.tti.tamu.edu/components/scroll-top",
    "figmaNodePattern": "TUX / TuxScrollTop",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxScrollTop />",
      "react": "import { TuxScrollTop } from \"@tti/tti-ux-react\";\n\n<TuxScrollTop />",
      "webComponents": "<tux-scroll-top></tux-scroll-top>",
      "blazor": "<TuxScrollTop />",
      "wordpress": "[tux_scroll_top]"
    }
  },
  {
    "name": "TuxSearch",
    "tagName": "tux-search",
    "kind": "component",
    "family": "components",
    "category": "forms",
    "wraps": "tux native",
    "blurb": "Branded search bar — bordered input + uppercase action button. Regular / slim / focus state.",
    "route": "/components/search",
    "docsUrl": "https://ux.tti.tamu.edu/components/search",
    "figmaNodePattern": "TUX / TuxSearch",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxSearch />",
      "react": "import { TuxSearch } from \"@tti/tti-ux-react\";\n\n<TuxSearch />",
      "webComponents": "<tux-search></tux-search>",
      "blazor": "<TuxSearch />",
      "wordpress": "[tux_search]"
    }
  },
  {
    "name": "TuxSectionHeader",
    "tagName": "tux-section-header",
    "kind": "component",
    "family": "components",
    "category": "publishing",
    "wraps": "tux native",
    "blurb": "Editorial section heading — ALL-CAPS, tracked-out, maroon underline.",
    "route": "/components/section-header",
    "docsUrl": "https://ux.tti.tamu.edu/components/section-header",
    "figmaNodePattern": "TUX / TuxSectionHeader",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxSectionHeader />",
      "react": "import { TuxSectionHeader } from \"@tti/tti-ux-react\";\n\n<TuxSectionHeader />",
      "webComponents": "<tux-section-header></tux-section-header>",
      "blazor": "<TuxSectionHeader />",
      "wordpress": "[tux_section_header]"
    }
  },
  {
    "name": "TuxSegmentedInput",
    "tagName": "tux-segmented-input",
    "kind": "component",
    "family": "components",
    "category": "forms",
    "wraps": "tux native",
    "blurb": "Formatted multi-segment monospace code input — auto-advance, smart paste-splitting, and charset validation.",
    "route": "/components/segmented-input",
    "docsUrl": "https://ux.tti.tamu.edu/components/segmented-input",
    "figmaNodePattern": "TUX / TuxSegmentedInput",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxSegmentedInput />",
      "react": "import { TuxSegmentedInput } from \"@tti/tti-ux-react\";\n\n<TuxSegmentedInput />",
      "webComponents": "<tux-segmented-input></tux-segmented-input>",
      "blazor": "<TuxSegmentedInput />",
      "wordpress": "[tux_segmented_input]"
    }
  },
  {
    "name": "TuxShortcutsHelp",
    "tagName": "tux-shortcuts-help",
    "kind": "component",
    "family": "components",
    "category": "actions",
    "wraps": "tux native (<dialog>)",
    "blurb": "Modal overlay listing every wired keyboard shortcut — combos vs sequences, opens on ?. Sibling to TuxCommandPalette.",
    "route": "/components/shortcuts-help",
    "docsUrl": "https://ux.tti.tamu.edu/components/shortcuts-help",
    "figmaNodePattern": "TUX / TuxShortcutsHelp",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxShortcutsHelp />",
      "react": "import { TuxShortcutsHelp } from \"@tti/tti-ux-react\";\n\n<TuxShortcutsHelp />",
      "webComponents": "<tux-shortcuts-help></tux-shortcuts-help>",
      "blazor": "<TuxShortcutsHelp />",
      "wordpress": "[tux_shortcuts_help]"
    }
  },
  {
    "name": "TuxSidebarBlock",
    "tagName": "tux-sidebar-block",
    "kind": "component",
    "family": "components",
    "category": "publishing",
    "wraps": "tux native",
    "blurb": "Sidebar widget wrapper — eyebrow + maroon underline + content. Default/bordered/filled.",
    "route": "/components/sidebar-block",
    "docsUrl": "https://ux.tti.tamu.edu/components/sidebar-block",
    "figmaNodePattern": "TUX / TuxSidebarBlock",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxSidebarBlock />",
      "react": "import { TuxSidebarBlock } from \"@tti/tti-ux-react\";\n\n<TuxSidebarBlock />",
      "webComponents": "<tux-sidebar-block></tux-sidebar-block>",
      "blazor": "<TuxSidebarBlock />",
      "wordpress": "[tux_sidebar_block]"
    }
  },
  {
    "name": "TuxSignoffChain",
    "tagName": "tux-signoff-chain",
    "kind": "component",
    "family": "components",
    "category": "actions",
    "wraps": "tux native",
    "blurb": "Sequential multi-party verification, attestation checkbox & continuation decision gate.",
    "route": "/components/signoff-chain",
    "docsUrl": "https://ux.tti.tamu.edu/components/signoff-chain",
    "figmaNodePattern": "TUX / TuxSignoffChain",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxSignoffChain />",
      "react": "import { TuxSignoffChain } from \"@tti/tti-ux-react\";\n\n<TuxSignoffChain />",
      "webComponents": "<tux-signoff-chain></tux-signoff-chain>",
      "blazor": "<TuxSignoffChain />",
      "wordpress": "[tux_signoff_chain]"
    }
  },
  {
    "name": "TuxSignupFeature",
    "tagName": "tux-signup-feature",
    "kind": "component",
    "family": "components",
    "category": "publishing",
    "wraps": "tux native",
    "blurb": "Newsletter signup — email input + uppercase action + consent. Three tones, three style variants.",
    "route": "/components/signup-feature",
    "docsUrl": "https://ux.tti.tamu.edu/components/signup-feature",
    "figmaNodePattern": "TUX / TuxSignupFeature",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxSignupFeature />",
      "react": "import { TuxSignupFeature } from \"@tti/tti-ux-react\";\n\n<TuxSignupFeature />",
      "webComponents": "<tux-signup-feature></tux-signup-feature>",
      "blazor": "<TuxSignupFeature />",
      "wordpress": "[tux_signup_feature]"
    }
  },
  {
    "name": "TuxSiteNav",
    "tagName": "tux-site-nav",
    "kind": "component",
    "family": "components",
    "category": "navigation",
    "wraps": "tux native",
    "blurb": "Top-bar with TuxIdentity + utility nav + primary nav. Hosts TuxDropdown / TuxMegaMenu items.",
    "route": "/components/site-nav",
    "docsUrl": "https://ux.tti.tamu.edu/components/site-nav",
    "figmaNodePattern": "TUX / TuxSiteNav",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxSiteNav />",
      "react": "import { TuxSiteNav } from \"@tti/tti-ux-react\";\n\n<TuxSiteNav />",
      "webComponents": "<tux-site-nav></tux-site-nav>",
      "blazor": "<TuxSiteNav />",
      "wordpress": "[tux_site_nav]"
    }
  },
  {
    "name": "TuxSkeleton",
    "tagName": "tux-skeleton",
    "kind": "component",
    "family": "components",
    "category": "feedback",
    "wraps": "tux native",
    "blurb": "Loading-state placeholder — primitive shapes + 6 composed presets. Honors prefers-reduced-motion.",
    "route": "/components/skeleton",
    "docsUrl": "https://ux.tti.tamu.edu/components/skeleton",
    "figmaNodePattern": "TUX / TuxSkeleton",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxSkeleton />",
      "react": "import { TuxSkeleton } from \"@tti/tti-ux-react\";\n\n<TuxSkeleton />",
      "webComponents": "<tux-skeleton></tux-skeleton>",
      "blazor": "<TuxSkeleton />",
      "wordpress": "[tux_skeleton]"
    }
  },
  {
    "name": "TuxSlideover",
    "tagName": "tux-slideover",
    "kind": "component",
    "family": "components",
    "category": "navigation",
    "wraps": "tux native",
    "blurb": "Edge-anchored drawer — row detail, filter panel, mobile nav, action sheet. Right/left/bottom anchors, native <dialog>.",
    "route": "/components/slideover",
    "docsUrl": "https://ux.tti.tamu.edu/components/slideover",
    "figmaNodePattern": "TUX / TuxSlideover",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxSlideover />",
      "react": "import { TuxSlideover } from \"@tti/tti-ux-react\";\n\n<TuxSlideover />",
      "webComponents": "<tux-slideover></tux-slideover>",
      "blazor": "<TuxSlideover />",
      "wordpress": "[tux_slideover]"
    }
  },
  {
    "name": "TuxSparkline",
    "tagName": "tux-sparkline",
    "kind": "component",
    "family": "visualizations",
    "category": "timeseries",
    "wraps": "tux native (inline SVG)",
    "blurb": "Inline mini trend line — no axes, optional area fill, last-point dot, delta arrow. Native SVG.",
    "route": "/visualizations/sparkline",
    "docsUrl": "https://ux.tti.tamu.edu/visualizations/sparkline",
    "figmaNodePattern": "TUX / TuxSparkline",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxSparkline />",
      "react": "import { TuxSparkline } from \"@tti/tti-ux-react\";\n\n<TuxSparkline />",
      "webComponents": "<tux-sparkline></tux-sparkline>",
      "blazor": "<TuxSparkline />",
      "wordpress": "[tux_sparkline]"
    }
  },
  {
    "name": "TuxSpectrumFacts",
    "tagName": "tux-spectrum-facts",
    "kind": "component",
    "family": "components",
    "category": "data-display",
    "wraps": "tux native",
    "blurb": "5-column institutional metrics banner mapping the Comm spectrum palette with icon headers and colored footers.",
    "route": "/components/spectrum-facts",
    "docsUrl": "https://ux.tti.tamu.edu/components/spectrum-facts",
    "figmaNodePattern": "TUX / TuxSpectrumFacts",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxSpectrumFacts />",
      "react": "import { TuxSpectrumFacts } from \"@tti/tti-ux-react\";\n\n<TuxSpectrumFacts />",
      "webComponents": "<tux-spectrum-facts></tux-spectrum-facts>",
      "blazor": "<TuxSpectrumFacts />",
      "wordpress": "[tux_spectrum_facts]"
    }
  },
  {
    "name": "TuxSpectrumRibbon",
    "tagName": "tux-spectrum-ribbon",
    "kind": "component",
    "family": "components",
    "category": "navigation",
    "wraps": "tux native",
    "blurb": "5-band responsive institutional brand color ribbon.",
    "route": "/components/spectrum-ribbon",
    "docsUrl": "https://ux.tti.tamu.edu/components/spectrum-ribbon",
    "figmaNodePattern": "TUX / TuxSpectrumRibbon",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxSpectrumRibbon />",
      "react": "import { TuxSpectrumRibbon } from \"@tti/tti-ux-react\";\n\n<TuxSpectrumRibbon />",
      "webComponents": "<tux-spectrum-ribbon></tux-spectrum-ribbon>",
      "blazor": "<TuxSpectrumRibbon />",
      "wordpress": "[tux_spectrum_ribbon]"
    }
  },
  {
    "name": "TuxSplashScreen",
    "tagName": "tux-splash-screen",
    "kind": "component",
    "family": "components",
    "category": "feedback",
    "wraps": "tux native",
    "blurb": "Branded app-launch overlay — brand mark + maroon hairline + status. Bridges Tauri window-show → Vue hydrate gap. Fades when loaded.",
    "route": "/components/splash-screen",
    "docsUrl": "https://ux.tti.tamu.edu/components/splash-screen",
    "figmaNodePattern": "TUX / TuxSplashScreen",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxSplashScreen />",
      "react": "import { TuxSplashScreen } from \"@tti/tti-ux-react\";\n\n<TuxSplashScreen />",
      "webComponents": "<tux-splash-screen></tux-splash-screen>",
      "blazor": "<TuxSplashScreen />",
      "wordpress": "[tux_splash_screen]"
    }
  },
  {
    "name": "TuxSplitPane",
    "tagName": "tux-split-pane",
    "kind": "component",
    "family": "components",
    "category": "navigation",
    "wraps": "tux native",
    "blurb": "In-page master-detail layout — resizable list + detail + optional bottom pane. Width persists via localStorage. URL-bound selection.",
    "route": "/components/split-pane",
    "docsUrl": "https://ux.tti.tamu.edu/components/split-pane",
    "figmaNodePattern": "TUX / TuxSplitPane",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxSplitPane />",
      "react": "import { TuxSplitPane } from \"@tti/tti-ux-react\";\n\n<TuxSplitPane />",
      "webComponents": "<tux-split-pane></tux-split-pane>",
      "blazor": "<TuxSplitPane />",
      "wordpress": "[tux_split_pane]"
    }
  },
  {
    "name": "TuxStageBoard",
    "tagName": "tux-stage-board",
    "kind": "component",
    "family": "components",
    "category": "data-display",
    "wraps": "tux native",
    "blurb": "Multi-lane workflow board — live lane count & metric rollups, priority indicators, and accessible stage controls.",
    "route": "/components/stage-board",
    "docsUrl": "https://ux.tti.tamu.edu/components/stage-board",
    "figmaNodePattern": "TUX / TuxStageBoard",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxStageBoard />",
      "react": "import { TuxStageBoard } from \"@tti/tti-ux-react\";\n\n<TuxStageBoard />",
      "webComponents": "<tux-stage-board></tux-stage-board>",
      "blazor": "<TuxStageBoard />",
      "wordpress": "[tux_stage_board]"
    }
  },
  {
    "name": "TuxStatComparison",
    "tagName": "tux-stat-comparison",
    "kind": "component",
    "family": "components",
    "category": "data-display",
    "wraps": "tux native",
    "blurb": "Before/after stat block with delta + tone. Direct or inverted polarity (down-is-good metrics). Row / stack / inline layouts.",
    "route": "/components/stat-comparison",
    "docsUrl": "https://ux.tti.tamu.edu/components/stat-comparison",
    "figmaNodePattern": "TUX / TuxStatComparison",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxStatComparison />",
      "react": "import { TuxStatComparison } from \"@tti/tti-ux-react\";\n\n<TuxStatComparison />",
      "webComponents": "<tux-stat-comparison></tux-stat-comparison>",
      "blazor": "<TuxStatComparison />",
      "wordpress": "[tux_stat_comparison]"
    }
  },
  {
    "name": "TuxStatus",
    "tagName": "tux-status",
    "kind": "component",
    "family": "components",
    "category": "feedback",
    "wraps": "tux native (tux-ops.css)",
    "blurb": "Operational state chip — ok / warning / unknown / critical / pending / maintenance. Class API is kit/css/tux-ops.css so CGI overlays and Vue share pixels.",
    "route": "/components/status",
    "docsUrl": "https://ux.tti.tamu.edu/components/status",
    "figmaNodePattern": "TUX / TuxStatus",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxStatus />",
      "react": "import { TuxStatus } from \"@tti/tti-ux-react\";\n\n<TuxStatus />",
      "webComponents": "<tux-status></tux-status>",
      "blazor": "<TuxStatus />",
      "wordpress": "[tux_status]"
    }
  },
  {
    "name": "TuxStatusToast",
    "tagName": "tux-status-toast",
    "kind": "component",
    "family": "components",
    "category": "feedback",
    "wraps": "tux native (useTuxToast bus)",
    "blurb": "Transient-notification host + useTuxToast() bus — polite live region, sticky errors, reduced-motion aware, Tauri OS-notification escalation.",
    "route": "/components/status-toast",
    "docsUrl": "https://ux.tti.tamu.edu/components/status-toast",
    "figmaNodePattern": "TUX / TuxStatusToast",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxStatusToast />",
      "react": "import { TuxStatusToast } from \"@tti/tti-ux-react\";\n\n<TuxStatusToast />",
      "webComponents": "<tux-status-toast></tux-status-toast>",
      "blazor": "<TuxStatusToast />",
      "wordpress": "[tux_status_toast]"
    }
  },
  {
    "name": "TuxStepper",
    "tagName": "tux-stepper",
    "kind": "component",
    "family": "components",
    "category": "navigation",
    "wraps": "tux native",
    "blurb": "Numbered-circle multi-step indicator — funding application, IRB submission, study onboarding.",
    "route": "/components/stepper",
    "docsUrl": "https://ux.tti.tamu.edu/components/stepper",
    "figmaNodePattern": "TUX / TuxStepper",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxStepper />",
      "react": "import { TuxStepper } from \"@tti/tti-ux-react\";\n\n<TuxStepper />",
      "webComponents": "<tux-stepper></tux-stepper>",
      "blazor": "<TuxStepper />",
      "wordpress": "[tux_stepper]"
    }
  },
  {
    "name": "TuxSuggestionChips",
    "tagName": "tux-suggestion-chips",
    "kind": "component",
    "family": "components",
    "category": "ai",
    "wraps": "tux native",
    "blurb": "Horizontal row of clickable prompt-suggestion chips. Empty-state composer or post-response follow-ups.",
    "route": "/components/suggestion-chips",
    "docsUrl": "https://ux.tti.tamu.edu/components/suggestion-chips",
    "figmaNodePattern": "TUX / TuxSuggestionChips",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxSuggestionChips />",
      "react": "import { TuxSuggestionChips } from \"@tti/tti-ux-react\";\n\n<TuxSuggestionChips />",
      "webComponents": "<tux-suggestion-chips></tux-suggestion-chips>",
      "blazor": "<TuxSuggestionChips />",
      "wordpress": "[tux_suggestion_chips]"
    }
  },
  {
    "name": "TuxTOC",
    "tagName": "tux-toc",
    "kind": "component",
    "family": "components",
    "category": "navigation",
    "wraps": "tux native",
    "blurb": "Article table-of-contents — sticky right rail with IntersectionObserver-driven active state.",
    "route": "/components/toc",
    "docsUrl": "https://ux.tti.tamu.edu/components/toc",
    "figmaNodePattern": "TUX / TuxTOC",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxTOC />",
      "react": "import { TuxTOC } from \"@tti/tti-ux-react\";\n\n<TuxTOC />",
      "webComponents": "<tux-toc></tux-toc>",
      "blazor": "<TuxTOC />",
      "wordpress": "[tux_toc]"
    }
  },
  {
    "name": "TuxTabBar",
    "tagName": "tux-tab-bar",
    "kind": "component",
    "family": "components",
    "category": "navigation",
    "wraps": "tux native",
    "blurb": "Bottom-anchored 3-5 mobile tabs — icon + label, maroon top-edge active rule, safe-area-inset-bottom honored. Tauri Mobile target.",
    "route": "/components/tab-bar",
    "docsUrl": "https://ux.tti.tamu.edu/components/tab-bar",
    "figmaNodePattern": "TUX / TuxTabBar",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxTabBar />",
      "react": "import { TuxTabBar } from \"@tti/tti-ux-react\";\n\n<TuxTabBar />",
      "webComponents": "<tux-tab-bar></tux-tab-bar>",
      "blazor": "<TuxTabBar />",
      "wordpress": "[tux_tab_bar]"
    }
  },
  {
    "name": "TuxTable",
    "tagName": "tux-table",
    "kind": "component",
    "family": "components",
    "category": "data-display",
    "wraps": "UTable",
    "blurb": "UTable with tux chrome, automatic status-cell rendering via TuxBadge.",
    "route": "/components/table",
    "docsUrl": "https://ux.tti.tamu.edu/components/table",
    "figmaNodePattern": "TUX / TuxTable",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxTable />",
      "react": "import { TuxTable } from \"@tti/tti-ux-react\";\n\n<TuxTable />",
      "webComponents": "<tux-table></tux-table>",
      "blazor": "<TuxTable />",
      "wordpress": "[tux_table]"
    }
  },
  {
    "name": "TuxTableCaption",
    "tagName": "tux-table-caption",
    "kind": "component",
    "family": "components",
    "category": "publishing",
    "wraps": "composes TuxFigureCaption",
    "blurb": "Auto-numbered caption for tables.",
    "route": "/components/table-caption",
    "docsUrl": "https://ux.tti.tamu.edu/components/table-caption",
    "figmaNodePattern": "TUX / TuxTableCaption",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxTableCaption />",
      "react": "import { TuxTableCaption } from \"@tti/tti-ux-react\";\n\n<TuxTableCaption />",
      "webComponents": "<tux-table-caption></tux-table-caption>",
      "blazor": "<TuxTableCaption />",
      "wordpress": "[tux_table_caption]"
    }
  },
  {
    "name": "TuxTabs",
    "tagName": "tux-tabs",
    "kind": "component",
    "family": "components",
    "category": "navigation",
    "wraps": "UTabs",
    "blurb": "Editorial tabs with maroon active underline. Horizontal + vertical orientations; `bold` intent for eyebrow-rhythm labels.",
    "route": "/components/tabs",
    "docsUrl": "https://ux.tti.tamu.edu/components/tabs",
    "figmaNodePattern": "TUX / TuxTabs",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxTabs />",
      "react": "import { TuxTabs } from \"@tti/tti-ux-react\";\n\n<TuxTabs />",
      "webComponents": "<tux-tabs></tux-tabs>",
      "blazor": "<TuxTabs />",
      "wordpress": "[tux_tabs]"
    }
  },
  {
    "name": "TuxTeachingPopover",
    "tagName": "tux-teaching-popover",
    "kind": "component",
    "family": "components",
    "category": "feedback",
    "wraps": "tux native",
    "blurb": "Onboarding/guided-tour tooltip — image, body, Next/Skip, step counter. On-brand variant for high emphasis.",
    "route": "/components/teaching-popover",
    "docsUrl": "https://ux.tti.tamu.edu/components/teaching-popover",
    "figmaNodePattern": "TUX / TuxTeachingPopover",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxTeachingPopover />",
      "react": "import { TuxTeachingPopover } from \"@tti/tti-ux-react\";\n\n<TuxTeachingPopover />",
      "webComponents": "<tux-teaching-popover></tux-teaching-popover>",
      "blazor": "<TuxTeachingPopover />",
      "wordpress": "[tux_teaching_popover]"
    }
  },
  {
    "name": "TuxTestimonial",
    "tagName": "tux-testimonial",
    "kind": "component",
    "family": "components",
    "category": "data-display",
    "wraps": "tux native",
    "blurb": "Attributed quotes with portrait + name + role — grid or row layout, three style variants.",
    "route": "/components/testimonial",
    "docsUrl": "https://ux.tti.tamu.edu/components/testimonial",
    "figmaNodePattern": "TUX / TuxTestimonial",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxTestimonial />",
      "react": "import { TuxTestimonial } from \"@tti/tti-ux-react\";\n\n<TuxTestimonial />",
      "webComponents": "<tux-testimonial></tux-testimonial>",
      "blazor": "<TuxTestimonial />",
      "wordpress": "[tux_testimonial]"
    }
  },
  {
    "name": "TuxThresholdBar",
    "tagName": "tux-threshold-bar",
    "kind": "component",
    "family": "components",
    "category": "data-display",
    "wraps": "tux native",
    "blurb": "Multi-segment capacity & projection bar — solid + hatched segments, proportional threshold marker, and overage alerts.",
    "route": "/components/threshold-bar",
    "docsUrl": "https://ux.tti.tamu.edu/components/threshold-bar",
    "figmaNodePattern": "TUX / TuxThresholdBar",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxThresholdBar />",
      "react": "import { TuxThresholdBar } from \"@tti/tti-ux-react\";\n\n<TuxThresholdBar />",
      "webComponents": "<tux-threshold-bar></tux-threshold-bar>",
      "blazor": "<TuxThresholdBar />",
      "wordpress": "[tux_threshold_bar]"
    }
  },
  {
    "name": "TuxTileGrid",
    "tagName": "tux-tile-grid",
    "kind": "component",
    "family": "components",
    "category": "navigation",
    "wraps": "tux native",
    "blurb": "Service launcher grid with eggshell background, line icons, titles, and descriptive subtitles.",
    "route": "/components/tile-grid",
    "docsUrl": "https://ux.tti.tamu.edu/components/tile-grid",
    "figmaNodePattern": "TUX / TuxTileGrid",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxTileGrid />",
      "react": "import { TuxTileGrid } from \"@tti/tti-ux-react\";\n\n<TuxTileGrid />",
      "webComponents": "<tux-tile-grid></tux-tile-grid>",
      "blazor": "<TuxTileGrid />",
      "wordpress": "[tux_tile_grid]"
    }
  },
  {
    "name": "TuxToolCall",
    "tagName": "tux-tool-call",
    "kind": "component",
    "family": "components",
    "category": "ai",
    "wraps": "tux native",
    "blurb": "Agent tool execution and command event card with status indicators, elapsed timing, and diff stats.",
    "route": "/components/chat-message",
    "docsUrl": "https://ux.tti.tamu.edu/components/chat-message",
    "figmaNodePattern": "TUX / TuxToolCall",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxToolCall />",
      "react": "import { TuxToolCall } from \"@tti/tti-ux-react\";\n\n<TuxToolCall />",
      "webComponents": "<tux-tool-call></tux-tool-call>",
      "blazor": "<TuxToolCall />",
      "wordpress": "[tux_tool_call]"
    }
  },
  {
    "name": "TuxTooltip",
    "tagName": "tux-tooltip",
    "kind": "component",
    "family": "components",
    "category": "feedback",
    "wraps": "UTooltip",
    "blurb": "Keyboard-accessible hover-help with optional title + hairline rule. Tuned max-width (~22ch).",
    "route": "/components/tooltip",
    "docsUrl": "https://ux.tti.tamu.edu/components/tooltip",
    "figmaNodePattern": "TUX / TuxTooltip",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxTooltip />",
      "react": "import { TuxTooltip } from \"@tti/tti-ux-react\";\n\n<TuxTooltip />",
      "webComponents": "<tux-tooltip></tux-tooltip>",
      "blazor": "<TuxTooltip />",
      "wordpress": "[tux_tooltip]"
    }
  },
  {
    "name": "TuxTree",
    "tagName": "tux-tree",
    "kind": "component",
    "family": "components",
    "category": "data-display",
    "wraps": "tux native",
    "blurb": "Hierarchical list — sitemap, corpus + filesystem browser, BI dataset explorer. Mono leaf labels, sand guide lines, persistence.",
    "route": "/components/tree",
    "docsUrl": "https://ux.tti.tamu.edu/components/tree",
    "figmaNodePattern": "TUX / TuxTree",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxTree />",
      "react": "import { TuxTree } from \"@tti/tti-ux-react\";\n\n<TuxTree />",
      "webComponents": "<tux-tree></tux-tree>",
      "blazor": "<TuxTree />",
      "wordpress": "[tux_tree]"
    }
  },
  {
    "name": "TuxTreemap",
    "tagName": "tux-treemap",
    "kind": "component",
    "family": "components",
    "category": "data-display",
    "wraps": "tux native",
    "blurb": "Squarified hierarchical-size viz — Corridor Ops' headline chart, drill-in, no external library.",
    "route": "/components/treemap",
    "docsUrl": "https://ux.tti.tamu.edu/components/treemap",
    "figmaNodePattern": "TUX / TuxTreemap",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxTreemap />",
      "react": "import { TuxTreemap } from \"@tti/tti-ux-react\";\n\n<TuxTreemap />",
      "webComponents": "<tux-treemap></tux-treemap>",
      "blazor": "<TuxTreemap />",
      "wordpress": "[tux_treemap]"
    }
  },
  {
    "name": "TuxUnitValue",
    "tagName": "tux-unit-value",
    "kind": "component",
    "family": "components",
    "category": "data-display",
    "wraps": "tux native (useTuxUnits)",
    "blurb": "Scientific transportation measurement primitive — mph ↔ km/h, VMT ↔ VKT, kip ↔ kN, ± CI, highway stationing, and global US ↔ SI toggle.",
    "route": "/components/unit-value",
    "docsUrl": "https://ux.tti.tamu.edu/components/unit-value",
    "figmaNodePattern": "TUX / TuxUnitValue",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxUnitValue />",
      "react": "import { TuxUnitValue } from \"@tti/tti-ux-react\";\n\n<TuxUnitValue />",
      "webComponents": "<tux-unit-value></tux-unit-value>",
      "blazor": "<TuxUnitValue />",
      "wordpress": "[tux_unit_value]"
    }
  },
  {
    "name": "TuxUserMenu",
    "tagName": "tux-user-menu",
    "kind": "component",
    "family": "components",
    "category": "navigation",
    "wraps": "UDropdownMenu",
    "blurb": "The suite's one identity affordance — cluster chip or rail-footer mount, state-complete (loading / signed-out / signed-in / local-only / error), law-fixed menu order.",
    "route": "/components/utility-cluster",
    "docsUrl": "https://ux.tti.tamu.edu/components/utility-cluster",
    "figmaNodePattern": "TUX / TuxUserMenu",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxUserMenu />",
      "react": "import { TuxUserMenu } from \"@tti/tti-ux-react\";\n\n<TuxUserMenu />",
      "webComponents": "<tux-user-menu></tux-user-menu>",
      "blazor": "<TuxUserMenu />",
      "wordpress": "[tux_user_menu]"
    }
  },
  {
    "name": "TuxUtilityCluster",
    "tagName": "tux-utility-cluster",
    "kind": "component",
    "family": "components",
    "category": "navigation",
    "wraps": "tux (composes TuxAppSwitcher + TuxUserMenu)",
    "blurb": "The trailing app-control cluster — search · notifications · theme · waffle · identity in law-fixed DOM order. Registry-fed waffle + role=status theme announcements.",
    "route": "/components/utility-cluster",
    "docsUrl": "https://ux.tti.tamu.edu/components/utility-cluster",
    "figmaNodePattern": "TUX / TuxUtilityCluster",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxUtilityCluster />",
      "react": "import { TuxUtilityCluster } from \"@tti/tti-ux-react\";\n\n<TuxUtilityCluster />",
      "webComponents": "<tux-utility-cluster></tux-utility-cluster>",
      "blazor": "<TuxUtilityCluster />",
      "wordpress": "[tux_utility_cluster]"
    }
  },
  {
    "name": "TuxValidationSummary",
    "tagName": "tux-validation-summary",
    "kind": "component",
    "family": "components",
    "category": "feedback",
    "wraps": "tux native",
    "blurb": "Error list at the top of a long form.",
    "route": "/components/validation-summary",
    "docsUrl": "https://ux.tti.tamu.edu/components/validation-summary",
    "figmaNodePattern": "TUX / TuxValidationSummary",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxValidationSummary />",
      "react": "import { TuxValidationSummary } from \"@tti/tti-ux-react\";\n\n<TuxValidationSummary />",
      "webComponents": "<tux-validation-summary></tux-validation-summary>",
      "blazor": "<TuxValidationSummary />",
      "wordpress": "[tux_validation_summary]"
    }
  },
  {
    "name": "TuxVizEmbed",
    "tagName": "tux-viz-embed",
    "kind": "component",
    "family": "visualizations",
    "category": "embeds",
    "wraps": "sandboxed <iframe> + poster fallback",
    "blurb": "Tableau / Power BI / Apache Superset / Grafana iframe wrapper with poster fallback.",
    "route": "/visualizations/embed",
    "docsUrl": "https://ux.tti.tamu.edu/visualizations/embed",
    "figmaNodePattern": "TUX / TuxVizEmbed",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxVizEmbed />",
      "react": "import { TuxVizEmbed } from \"@tti/tti-ux-react\";\n\n<TuxVizEmbed />",
      "webComponents": "<tux-viz-embed></tux-viz-embed>",
      "blazor": "<TuxVizEmbed />",
      "wordpress": "[tux_viz_embed]"
    }
  },
  {
    "name": "TuxVizGrid",
    "tagName": "tux-viz-grid",
    "kind": "component",
    "family": "visualizations",
    "category": "embeds",
    "wraps": "tux native (CSS Grid layout shell)",
    "blurb": "Small-multiples layout primitive — 2/3/4-up panes with shared editorial header. Container-queried.",
    "route": "/visualizations/grid",
    "docsUrl": "https://ux.tti.tamu.edu/visualizations/grid",
    "figmaNodePattern": "TUX / TuxVizGrid",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxVizGrid />",
      "react": "import { TuxVizGrid } from \"@tti/tti-ux-react\";\n\n<TuxVizGrid />",
      "webComponents": "<tux-viz-grid></tux-viz-grid>",
      "blazor": "<TuxVizGrid />",
      "wordpress": "[tux_viz_grid]"
    }
  },
  {
    "name": "TuxVizRPlot",
    "tagName": "tux-viz-r-plot",
    "kind": "component",
    "family": "visualizations",
    "category": "embeds",
    "wraps": "<img> / <object> / <iframe>",
    "blurb": "R artifact wrapper — image / svg / htmlwidget — with source-line caption gutter.",
    "route": "/visualizations/rplot",
    "docsUrl": "https://ux.tti.tamu.edu/visualizations/rplot",
    "figmaNodePattern": "TUX / TuxVizRPlot",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "<TuxVizRPlot />",
      "react": "import { TuxVizRPlot } from \"@tti/tti-ux-react\";\n\n<TuxVizRPlot />",
      "webComponents": "<tux-viz-r-plot></tux-viz-r-plot>",
      "blazor": "<TuxVizRPlot />",
      "wordpress": "[tux_viz_r_plot]"
    }
  },
  {
    "name": "useTuxPlatform",
    "tagName": "useTuxPlatform",
    "kind": "composable",
    "family": "components",
    "category": "navigation",
    "wraps": "composable",
    "blurb": "Host-OS + Tauri detection for platform-adaptive chrome.",
    "route": "/components/app-frame",
    "docsUrl": "https://ux.tti.tamu.edu/components/app-frame",
    "figmaNodePattern": "TUX / useTuxPlatform",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "const state = useTuxPlatform();",
      "react": "import { useTuxPlatform } from \"@tti/tti-ux-react\";\nconst state = useTuxPlatform();",
      "webComponents": "// Composable utility — bind via custom element properties",
      "blazor": "@inject ITuxPlatformService Service",
      "wordpress": "<?php /* TUX useTuxPlatform helper */ ?>"
    }
  },
  {
    "name": "useTuxRipple",
    "tagName": "useTuxRipple",
    "kind": "composable",
    "family": "components",
    "category": "actions",
    "wraps": "composable",
    "blurb": "Composable: Material-style tap-feedback ripple on a target element. Opt-in only; honors prefers-reduced-motion.",
    "route": "/components/ripple",
    "docsUrl": "https://ux.tti.tamu.edu/components/ripple",
    "figmaNodePattern": "TUX / useTuxRipple",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "const state = useTuxRipple();",
      "react": "import { useTuxRipple } from \"@tti/tti-ux-react\";\nconst state = useTuxRipple();",
      "webComponents": "// Composable utility — bind via custom element properties",
      "blazor": "@inject ITuxRippleService Service",
      "wordpress": "<?php /* TUX useTuxRipple helper */ ?>"
    }
  },
  {
    "name": "useTuxSwipe",
    "tagName": "useTuxSwipe",
    "kind": "composable",
    "family": "components",
    "category": "actions",
    "wraps": "composable",
    "blurb": "Composable: pointer/touch swipe detection with directional callbacks. Requires a11y-pair button per platform-awareness doctrine.",
    "route": "/components/swipe",
    "docsUrl": "https://ux.tti.tamu.edu/components/swipe",
    "figmaNodePattern": "TUX / useTuxSwipe",
    "a11y": {
      "wcagLevel": "AAA",
      "textContrast": ">= 7.0:1",
      "uiContrast": ">= 3.0:1",
      "minTouchTarget": "44x44px"
    },
    "snippets": {
      "vue": "const state = useTuxSwipe();",
      "react": "import { useTuxSwipe } from \"@tti/tti-ux-react\";\nconst state = useTuxSwipe();",
      "webComponents": "// Composable utility — bind via custom element properties",
      "blazor": "@inject ITuxSwipeService Service",
      "wordpress": "<?php /* TUX useTuxSwipe helper */ ?>"
    }
  }
];

figma.showUI(__html__, { width: 480, height: 660, themeColors: true });

function hexToRgb01(hexStr) {
  const clean = String(hexStr || "#5C0025").replace(/^#/, "");
  const full = clean.length === 3
    ? clean[0] + clean[0] + clean[1] + clean[1] + clean[2] + clean[2]
    : clean.padEnd(6, "0");
  const n = parseInt(full.slice(0, 6), 16);
  return {
    r: ((n >> 16) & 255) / 255,
    g: ((n >> 8) & 255) / 255,
    b: (n & 255) / 255,
  };
}

/**
 * 1. Sync Paint Styles, Text Styles & Effect Styles across all 3 themes
 *    (100% supported on Figma Free Starter Plan with zero mode restrictions)
 */
async function syncPaintAndTextStyles() {
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });

  const existingPaints = new Map(
    (await figma.getLocalPaintStylesAsync()).map((s) => [s.name, s]),
  );

  const styleTokens = [
    "brand-primary", "brand-primary-deep", "brand-accent", "brand-accent-deep",
    "brand-secondary", "brand-fill", "brand-accent-ink",
    "surface-page", "surface-raised", "surface-sunken", "surface-eggshell", "surface-border",
    "text-primary", "text-secondary", "text-muted", "text-on-brand",
    "status-ok", "status-warning", "status-unknown", "status-critical", "status-maintenance", "status-pending",
    "color-success", "color-warning", "color-danger", "color-error", "color-info",
    "spectrum-maroon", "spectrum-blue", "spectrum-teal", "spectrum-green", "spectrum-gold",
  ];

  let paintCount = 0;
  for (const [themeKey, themeObj] of Object.entries(TUX_THEMES)) {
    for (const tokenName of styleTokens) {
      const raw = themeObj[tokenName];
      if (!raw || !String(raw).startsWith("#")) continue;
      const styleName = "TUX / " + themeKey + " / " + tokenName;
      const style = existingPaints.get(styleName) || figma.createPaintStyle();
      style.name = styleName;
      style.description = "TUX canonical token var(--" + tokenName + ") in theme " + themeKey;
      style.paints = [{ type: "SOLID", color: hexToRgb01(raw) }];
      paintCount++;
    }
  }

  // Sync Text Styles (Free tier unlimited)
  const existingTexts = new Map(
    (await figma.getLocalTextStylesAsync()).map((s) => [s.name, s]),
  );
  const textSpecs = [
    { name: "TUX / Display / Hero (36px Bold)", size: 36, style: "Bold", lineHeight: 42 },
    { name: "TUX / Heading / H1 (28px Bold)", size: 28, style: "Bold", lineHeight: 34 },
    { name: "TUX / Heading / H2 (22px Bold)", size: 22, style: "Bold", lineHeight: 28 },
    { name: "TUX / Heading / H3 (18px Bold)", size: 18, style: "Bold", lineHeight: 24 },
    { name: "TUX / Body / Regular (16px AAA)", size: 16, style: "Regular", lineHeight: 26 },
    { name: "TUX / Body / Small (14px)", size: 14, style: "Regular", lineHeight: 22 },
    { name: "TUX / UI / Label & Button (14px Bold)", size: 14, style: "Bold", lineHeight: 20 },
    { name: "TUX / Mono / Telemetry & Kicker (12px Bold)", size: 12, style: "Bold", lineHeight: 18 },
  ];
  for (const spec of textSpecs) {
    const ts = existingTexts.get(spec.name) || figma.createTextStyle();
    ts.name = spec.name;
    ts.fontName = { family: "Inter", style: spec.style };
    ts.fontSize = spec.size;
    ts.lineHeight = { value: spec.lineHeight, unit: "PIXELS" };
  }

  // Sync Effect Styles (Free tier unlimited)
  const existingEffects = new Map(
    (await figma.getLocalEffectStylesAsync()).map((s) => [s.name, s]),
  );
  const effectSpecs = [
    {
      name: "TUX / Elevation / Raised Card",
      effects: [{ type: "DROP_SHADOW", color: { r: 0, g: 0, b: 0, a: 0.06 }, offset: { x: 0, y: 2 }, radius: 6, spread: 0, visible: true, blendMode: "NORMAL" }],
    },
    {
      name: "TUX / Elevation / Floating Overlay",
      effects: [{ type: "DROP_SHADOW", color: { r: 0, g: 0, b: 0, a: 0.14 }, offset: { x: 0, y: 8 }, radius: 24, spread: -2, visible: true, blendMode: "NORMAL" }],
    },
  ];
  for (const ef of effectSpecs) {
    const es = existingEffects.get(ef.name) || figma.createEffectStyle();
    es.name = ef.name;
    es.effects = ef.effects;
  }

  return paintCount + textSpecs.length + effectSpecs.length;
}

/**
 * 2. Sync Figma Variables with automatic Free Starter Plan 1-mode fallback
 */
async function syncFigmaVariables() {
  if (!figma.variables) {
    throw new Error("Figma Variables API is not available in this version of Figma.");
  }

  const existingCollections = await figma.variables.getLocalVariableCollectionsAsync();
  const findOrCreateCollection = (name) =>
    existingCollections.find((c) => c.name === name) ||
    figma.variables.createVariableCollection(name);

  const existingVars = await figma.variables.getLocalVariablesAsync();
  const findOrCreateVar = (name, coll, resolvedType) =>
    existingVars.find((v) => v.name === name && v.variableCollectionId === coll.id) ||
    figma.variables.createVariable(name, coll, resolvedType);

  const collection = findOrCreateCollection("TUX Institutional Tokens");
  const lightModeId = collection.modes[0].modeId;
  collection.renameMode(lightModeId, "Light (tti)");

  let darkModeId = null;
  let hcModeId = null;
  let multiModeSupported = true;

  try {
    const existingDark = collection.modes.find((m) => m.name === "Dark (tti-dark)");
    const existingHc = collection.modes.find((m) => m.name === "High Contrast AAA (tti-hc)");
    darkModeId = existingDark ? existingDark.modeId : collection.addMode("Dark (tti-dark)");
    hcModeId = existingHc ? existingHc.modeId : collection.addMode("High Contrast AAA (tti-hc)");
  } catch (_err) {
    // Figma Free Starter plan limits Variable Collections to 1 mode.
    // We automatically create 2 companion single-mode collections so free users get all 3 themes!
    multiModeSupported = false;
  }

  let createdCount = 0;

  if (multiModeSupported) {
    for (const v of TUX_VARIABLES) {
      const figVar = findOrCreateVar(v.name, collection, v.resolvedType);
      figVar.description = v.description;
      if (v.resolvedType === "COLOR") {
        figVar.setValueForMode(lightModeId, v.valuesByMode.tti.rgba);
        figVar.setValueForMode(darkModeId, v.valuesByMode["tti-dark"].rgba);
        figVar.setValueForMode(hcModeId, v.valuesByMode["tti-hc"].rgba);
      } else {
        figVar.setValueForMode(lightModeId, v.valuesByMode.tti);
        figVar.setValueForMode(darkModeId, v.valuesByMode["tti-dark"]);
        figVar.setValueForMode(hcModeId, v.valuesByMode["tti-hc"]);
      }
      createdCount++;
    }
  } else {
    const darkCollection = findOrCreateCollection("TUX Tokens — Dark (tti-dark)");
    const darkSingleModeId = darkCollection.modes[0].modeId;
    darkCollection.renameMode(darkSingleModeId, "Dark (tti-dark)");

    const hcCollection = findOrCreateCollection("TUX Tokens — High Contrast (tti-hc)");
    const hcSingleModeId = hcCollection.modes[0].modeId;
    hcCollection.renameMode(hcSingleModeId, "High Contrast AAA (tti-hc)");

    for (const v of TUX_VARIABLES) {
      const vLight = findOrCreateVar(v.name, collection, v.resolvedType);
      const vDark = findOrCreateVar(v.name, darkCollection, v.resolvedType);
      const vHc = findOrCreateVar(v.name, hcCollection, v.resolvedType);

      if (v.resolvedType === "COLOR") {
        vLight.setValueForMode(lightModeId, v.valuesByMode.tti.rgba);
        vDark.setValueForMode(darkSingleModeId, v.valuesByMode["tti-dark"].rgba);
        vHc.setValueForMode(hcSingleModeId, v.valuesByMode["tti-hc"].rgba);
      } else {
        vLight.setValueForMode(lightModeId, v.valuesByMode.tti);
        vDark.setValueForMode(darkSingleModeId, v.valuesByMode["tti-dark"]);
        vHc.setValueForMode(hcSingleModeId, v.valuesByMode["tti-hc"]);
      }
      createdCount++;
    }
  }

  return { createdCount, multiModeSupported };
}

/**
 * 3. Programmatically generate Auto-Layout TUX Component Kit on the active Figma page
 */
async function generateAutoLayoutKitOnCanvas() {
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });

  let componentCount = 0;

  const rootFrame = figma.createFrame();
  rootFrame.name = "TUX — Institutional Figma UI Kit (Free Starter Plan Compatible)";
  rootFrame.layoutMode = "VERTICAL";
  rootFrame.primaryAxisSizingMode = "AUTO";
  rootFrame.counterAxisSizingMode = "AUTO";
  rootFrame.paddingTop = 32;
  rootFrame.paddingBottom = 32;
  rootFrame.paddingLeft = 32;
  rootFrame.paddingRight = 32;
  rootFrame.itemSpacing = 24;
  rootFrame.fills = [{ type: "SOLID", color: hexToRgb01(TUX_THEMES.tti["surface-eggshell"]) }];

  // 1. Masthead Component
  const header = figma.createComponent();
  header.name = "TUX / TuxPortalHeader";
  header.layoutMode = "VERTICAL";
  header.primaryAxisSizingMode = "AUTO";
  header.counterAxisSizingMode = "AUTO";
  header.paddingTop = 20;
  header.paddingBottom = 20;
  header.paddingLeft = 24;
  header.paddingRight = 24;
  header.itemSpacing = 6;
  header.fills = [{ type: "SOLID", color: hexToRgb01(TUX_THEMES.tti["brand-fill"]) }];

  const title = figma.createText();
  title.fontName = { family: "Inter", style: "Bold" };
  title.fontSize = 20;
  title.characters = "TEXAS A&M TRANSPORTATION INSTITUTE · TUX DESIGN SYSTEM KIT";
  title.fills = [{ type: "SOLID", color: hexToRgb01("#FFFFFF") }];

  const sub = figma.createText();
  sub.fontName = { family: "Inter", style: "Regular" };
  sub.fontSize = 12;
  sub.characters = "WCAG 2.2 Level AAA (≥ 7.0:1 Contrast · ≥ 44×44px Touch Targets) · Free Starter Plan Kit";
  sub.fills = [{ type: "SOLID", color: hexToRgb01(TUX_THEMES.tti["brand-accent"]) }];

  header.appendChild(title);
  header.appendChild(sub);
  rootFrame.appendChild(header);
  componentCount++;

  // 2. 5-Band Spectrum Ribbon Component
  const ribbonComp = figma.createComponent();
  ribbonComp.name = "TUX / TuxSpectrumRibbon";
  ribbonComp.layoutMode = "HORIZONTAL";
  ribbonComp.primaryAxisSizingMode = "AUTO";
  ribbonComp.counterAxisSizingMode = "AUTO";
  ribbonComp.itemSpacing = 0;

  const spectrumColors = [
    ["Maroon", TUX_THEMES.tti["spectrum-maroon"]],
    ["Slate Blue", TUX_THEMES.tti["spectrum-blue"]],
    ["Slate Teal", TUX_THEMES.tti["spectrum-teal"]],
    ["Sage Green", TUX_THEMES.tti["spectrum-green"]],
    ["Ochre Gold", TUX_THEMES.tti["spectrum-gold"]],
  ];
  for (const [bandName, hex] of spectrumColors) {
    const band = figma.createRectangle();
    band.name = "Spectrum / " + bandName;
    band.resize(140, 12);
    band.fills = [{ type: "SOLID", color: hexToRgb01(hex) }];
    ribbonComp.appendChild(band);
  }
  rootFrame.appendChild(ribbonComp);
  componentCount++;

  // 3. Button Components Row
  const buttonRow = figma.createFrame();
  buttonRow.name = "TUX / Buttons Row (44px AAA)";
  buttonRow.layoutMode = "HORIZONTAL";
  buttonRow.primaryAxisSizingMode = "AUTO";
  buttonRow.counterAxisSizingMode = "AUTO";
  buttonRow.itemSpacing = 16;
  buttonRow.fills = [];

  const buttonVariants = [
    { name: "TUX / TuxButton / Primary", bg: TUX_THEMES.tti["brand-primary"], fg: "#FFFFFF", border: null, label: "Primary Action" },
    { name: "TUX / TuxButton / Secondary", bg: TUX_THEMES.tti["surface-page"], fg: TUX_THEMES.tti["text-primary"], border: TUX_THEMES.tti["surface-border"], label: "Secondary" },
    { name: "TUX / TuxButton / Ghost", bg: TUX_THEMES.tti["surface-sunken"], fg: TUX_THEMES.tti["text-secondary"], border: null, label: "Ghost Action" },
    { name: "TUX / TuxButton / Destructive", bg: TUX_THEMES.tti["surface-page"], fg: TUX_THEMES.tti["color-error"], border: TUX_THEMES.tti["color-error"], label: "Destructive" },
  ];

  for (const b of buttonVariants) {
    const btnComp = figma.createComponent();
    btnComp.name = b.name;
    btnComp.layoutMode = "HORIZONTAL";
    btnComp.primaryAxisAlignItems = "CENTER";
    btnComp.counterAxisAlignItems = "CENTER";
    btnComp.paddingLeft = 20;
    btnComp.paddingRight = 20;
    btnComp.paddingTop = 12;
    btnComp.paddingBottom = 12;
    btnComp.cornerRadius = 2;
    btnComp.fills = [{ type: "SOLID", color: hexToRgb01(b.bg) }];
    if (b.border) {
      btnComp.strokes = [{ type: "SOLID", color: hexToRgb01(b.border) }];
      btnComp.strokeWeight = 1.5;
    }

    const txt = figma.createText();
    txt.fontName = { family: "Inter", style: "Bold" };
    txt.fontSize = 14;
    txt.characters = b.label;
    txt.fills = [{ type: "SOLID", color: hexToRgb01(b.fg) }];
    btnComp.appendChild(txt);
    buttonRow.appendChild(btnComp);
    componentCount++;
  }
  rootFrame.appendChild(buttonRow);

  // 4. Badges & Status Chips Row
  const badgeRow = figma.createFrame();
  badgeRow.name = "TUX / Badges & Status Row";
  badgeRow.layoutMode = "HORIZONTAL";
  badgeRow.primaryAxisSizingMode = "AUTO";
  badgeRow.counterAxisSizingMode = "AUTO";
  badgeRow.itemSpacing = 12;
  badgeRow.fills = [];

  const badgeVariants = [
    { name: "TUX / TuxBadge / Restricted", bg: TUX_THEMES.tti["brand-primary"], fg: "#FFFFFF", label: "RESTRICTED" },
    { name: "TUX / TuxBadge / LOS A", bg: TUX_THEMES.tti["status-ok"], fg: "#FFFFFF", label: "LOS A · Free Flow" },
    { name: "TUX / TuxStatus / OK", bg: TUX_THEMES.tti["status-ok-fill"], fg: TUX_THEMES.tti["status-ok-ink"], label: "OK" },
    { name: "TUX / TuxStatus / WARNING", bg: TUX_THEMES.tti["status-warning-fill"], fg: TUX_THEMES.tti["status-warning-ink"], label: "WARNING" },
    { name: "TUX / TuxStatus / CRITICAL", bg: TUX_THEMES.tti["status-critical-fill"], fg: TUX_THEMES.tti["status-critical-ink"], label: "CRITICAL" },
  ];

  for (const bv of badgeVariants) {
    const chip = figma.createComponent();
    chip.name = bv.name;
    chip.layoutMode = "HORIZONTAL";
    chip.primaryAxisAlignItems = "CENTER";
    chip.counterAxisAlignItems = "CENTER";
    chip.paddingLeft = 12;
    chip.paddingRight = 12;
    chip.paddingTop = 6;
    chip.paddingBottom = 6;
    chip.cornerRadius = 3;
    chip.fills = [{ type: "SOLID", color: hexToRgb01(bv.bg) }];

    const txt = figma.createText();
    txt.fontName = { family: "Inter", style: "Bold" };
    txt.fontSize = 12;
    txt.characters = bv.label;
    txt.fills = [{ type: "SOLID", color: hexToRgb01(bv.fg) }];
    chip.appendChild(txt);
    badgeRow.appendChild(chip);
    componentCount++;
  }
  rootFrame.appendChild(badgeRow);

  // 5. Card & BigStat Row
  const cardRow = figma.createFrame();
  cardRow.name = "TUX / Cards & KPI Row";
  cardRow.layoutMode = "HORIZONTAL";
  cardRow.primaryAxisSizingMode = "AUTO";
  cardRow.counterAxisSizingMode = "AUTO";
  cardRow.itemSpacing = 20;
  cardRow.fills = [];

  const cardComp = figma.createComponent();
  cardComp.name = "TUX / TuxCard";
  cardComp.layoutMode = "VERTICAL";
  cardComp.primaryAxisSizingMode = "AUTO";
  cardComp.counterAxisSizingMode = "AUTO";
  cardComp.paddingTop = 20;
  cardComp.paddingBottom = 20;
  cardComp.paddingLeft = 20;
  cardComp.paddingRight = 20;
  cardComp.itemSpacing = 8;
  cardComp.cornerRadius = 6;
  cardComp.fills = [{ type: "SOLID", color: hexToRgb01(TUX_THEMES.tti["surface-page"]) }];
  cardComp.strokes = [{ type: "SOLID", color: hexToRgb01(TUX_THEMES.tti["surface-border"]) }];

  const cardKicker = figma.createText();
  cardKicker.fontName = { family: "Inter", style: "Bold" };
  cardKicker.fontSize = 11;
  cardKicker.characters = "CONNECTED CORRIDORS · TXDOT";
  cardKicker.fills = [{ type: "SOLID", color: hexToRgb01(TUX_THEMES.tti["brand-primary"]) }];

  const cardTitle = figma.createText();
  cardTitle.fontName = { family: "Inter", style: "Bold" };
  cardTitle.fontSize = 18;
  cardTitle.characters = "Automated Freight Platooning Study";
  cardTitle.fills = [{ type: "SOLID", color: hexToRgb01(TUX_THEMES.tti["text-primary"]) }];

  const cardBody = figma.createText();
  cardBody.fontName = { family: "Inter", style: "Regular" };
  cardBody.fontSize = 13;
  cardBody.characters = "Field evaluation of V2X low-latency BSM telemetry along I-10.";
  cardBody.fills = [{ type: "SOLID", color: hexToRgb01(TUX_THEMES.tti["text-secondary"]) }];

  cardComp.appendChild(cardKicker);
  cardComp.appendChild(cardTitle);
  cardComp.appendChild(cardBody);
  cardRow.appendChild(cardComp);
  componentCount++;

  const statComp = figma.createComponent();
  statComp.name = "TUX / TuxBigStat";
  statComp.layoutMode = "VERTICAL";
  statComp.primaryAxisSizingMode = "AUTO";
  statComp.counterAxisSizingMode = "AUTO";
  statComp.paddingTop = 20;
  statComp.paddingBottom = 20;
  statComp.paddingLeft = 20;
  statComp.paddingRight = 20;
  statComp.itemSpacing = 6;
  statComp.cornerRadius = 6;
  statComp.fills = [{ type: "SOLID", color: hexToRgb01(TUX_THEMES.tti["surface-page"]) }];
  statComp.strokes = [{ type: "SOLID", color: hexToRgb01(TUX_THEMES.tti["surface-border"]) }];

  const statLabel = figma.createText();
  statLabel.fontName = { family: "Inter", style: "Bold" };
  statLabel.fontSize = 11;
  statLabel.characters = "SPONSORED RESEARCH EXPENDITURE";
  statLabel.fills = [{ type: "SOLID", color: hexToRgb01(TUX_THEMES.tti["text-muted"]) }];

  const statValue = figma.createText();
  statValue.fontName = { family: "Inter", style: "Bold" };
  statValue.fontSize = 36;
  statValue.characters = "$126.4M (+14.2% YoY)";
  statValue.fills = [{ type: "SOLID", color: hexToRgb01(TUX_THEMES.tti["brand-primary"]) }];

  statComp.appendChild(statLabel);
  statComp.appendChild(statValue);
  cardRow.appendChild(statComp);
  componentCount++;

  rootFrame.appendChild(cardRow);

  figma.currentPage.appendChild(rootFrame);
  figma.viewport.scrollAndZoomIntoView([rootFrame]);
  return componentCount;
}

// Selection listener for Free Code Connect Inspector
figma.on("selectionchange", () => {
  const sel = figma.currentPage.selection[0];
  if (!sel) return;
  const matched = TUX_COMPONENTS.find(
    (c) => sel.name.toLowerCase().includes(c.name.toLowerCase()) || sel.name.toLowerCase().includes(c.tagName.toLowerCase()),
  );
  if (matched) {
    figma.ui.postMessage({ type: "selection-matched", component: matched });
  }
});

figma.ui.onmessage = async (msg) => {
  try {
    if (msg.type === "sync-styles") {
      const count = await syncPaintAndTextStyles();
      figma.notify("TUX: Synced " + count + " Paint, Text & Effect Styles.");
      figma.ui.postMessage({ type: "status", text: "Synced " + count + " Paint, Text & Effect Styles across all 3 themes." });
    } else if (msg.type === "sync-variables") {
      const res = await syncFigmaVariables();
      const modeMsg = res.multiModeSupported
        ? "3-mode collection"
        : "3 single-mode collections (Free Starter Plan auto-fallback)";
      figma.notify("TUX: Synced " + res.createdCount + " Figma Variables (" + modeMsg + ").");
      figma.ui.postMessage({
        type: "status",
        text: "Synced " + res.createdCount + " Figma Variables (" + modeMsg + ").",
      });
    } else if (msg.type === "generate-kit") {
      const count = await generateAutoLayoutKitOnCanvas();
      figma.notify("TUX: Generated " + count + " Auto-Layout components on canvas.");
      figma.ui.postMessage({
        type: "status",
        text: "Generated " + count + " Auto-Layout master components on canvas.",
      });
    }
  } catch (err) {
    figma.notify("TUX Error: " + err.message, { error: true });
    figma.ui.postMessage({ type: "status", text: "Error: " + err.message });
  }
};
