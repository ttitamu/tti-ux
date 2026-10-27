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
  }
];

figma.showUI(__html__, { width: 460, height: 620, themeColors: true });

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
 * 1. Sync Paint Styles across all 3 themes (100% supported on Figma Free Starter Plan)
 */
async function syncPaintAndTextStyles() {
  const existingPaints = new Map(
    (await figma.getLocalPaintStylesAsync()).map((s) => [s.name, s]),
  );

  const styleTokens = [
    "brand-primary", "brand-primary-deep", "brand-accent", "brand-accent-deep",
    "brand-secondary", "brand-fill", "brand-accent-ink",
    "surface-page", "surface-raised", "surface-sunken", "surface-eggshell", "surface-border",
    "text-primary", "text-secondary", "text-muted", "text-on-brand",
    "status-ok", "status-warning", "status-unknown", "status-critical", "status-maintenance",
    "color-success", "color-warning", "color-danger", "color-error", "color-info",
    "spectrum-maroon", "spectrum-blue", "spectrum-teal", "spectrum-green", "spectrum-gold",
  ];

  let count = 0;
  for (const [themeKey, themeObj] of Object.entries(TUX_THEMES)) {
    for (const tokenName of styleTokens) {
      const raw = themeObj[tokenName];
      if (!raw || !String(raw).startsWith("#")) continue;
      const styleName = "TUX / " + themeKey + " / " + tokenName;
      const style = existingPaints.get(styleName) || figma.createPaintStyle();
      style.name = styleName;
      style.description = "TUX canonical token var(--" + tokenName + ") in theme " + themeKey;
      style.paints = [{ type: "SOLID", color: hexToRgb01(raw) }];
      count++;
    }
  }
  return count;
}

/**
 * 2. Sync Figma Variables with automatic Free Starter Plan 1-mode fallback
 */
async function syncFigmaVariables() {
  if (!figma.variables) {
    throw new Error("Figma Variables API is not available in this version of Figma.");
  }

  const collection = figma.variables.createVariableCollection("TUX Institutional Tokens");
  const lightModeId = collection.modes[0].modeId;
  collection.renameMode(lightModeId, "Light (tti)");

  let darkModeId = null;
  let hcModeId = null;
  let multiModeSupported = true;

  try {
    darkModeId = collection.addMode("Dark (tti-dark)");
    hcModeId = collection.addMode("High Contrast AAA (tti-hc)");
  } catch (_err) {
    // Figma Free Starter plan limits Variable Collections to 1 mode.
    // We automatically create 2 companion single-mode collections so free users get all 3 themes!
    multiModeSupported = false;
  }

  let createdCount = 0;

  if (multiModeSupported) {
    for (const v of TUX_VARIABLES) {
      const figVar = figma.variables.createVariable(v.name, collection, v.resolvedType);
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
    const darkCollection = figma.variables.createVariableCollection("TUX Tokens — Dark (tti-dark)");
    const darkSingleModeId = darkCollection.modes[0].modeId;
    darkCollection.renameMode(darkSingleModeId, "Dark (tti-dark)");

    const hcCollection = figma.variables.createVariableCollection("TUX Tokens — High Contrast (tti-hc)");
    const hcSingleModeId = hcCollection.modes[0].modeId;
    hcCollection.renameMode(hcSingleModeId, "High Contrast AAA (tti-hc)");

    for (const v of TUX_VARIABLES) {
      const vLight = figma.variables.createVariable(v.name, collection, v.resolvedType);
      const vDark = figma.variables.createVariable(v.name, darkCollection, v.resolvedType);
      const vHc = figma.variables.createVariable(v.name, hcCollection, v.resolvedType);

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

  const rootFrame = figma.createFrame();
  rootFrame.name = "TUX v3.0 — Institutional Figma UI Kit (WCAG 2.2 AAA)";
  rootFrame.layoutMode = "VERTICAL";
  rootFrame.primaryAxisSizingMode = "AUTO";
  rootFrame.counterAxisSizingMode = "AUTO";
  rootFrame.paddingTop = 32;
  rootFrame.paddingBottom = 32;
  rootFrame.paddingLeft = 32;
  rootFrame.paddingRight = 32;
  rootFrame.itemSpacing = 24;
  rootFrame.fills = [{ type: "SOLID", color: hexToRgb01(TUX_THEMES.tti["surface-eggshell"]) }];

  // Header Banner
  const header = figma.createFrame();
  header.name = "TUX / Masthead Banner";
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
  sub.characters = "100% W3C WCAG 2.2 Level AAA (≥ 7.0:1 Contrast · ≥ 44×44px Touch Targets) · Generated Zero-Subscription Kit";
  sub.fills = [{ type: "SOLID", color: hexToRgb01(TUX_THEMES.tti["brand-accent"]) }];

  header.appendChild(title);
  header.appendChild(sub);
  rootFrame.appendChild(header);

  // 5-Band Spectrum Ribbon Component
  const ribbonComp = figma.createComponent();
  ribbonComp.name = "TUX / TuxSpectrumRibbon";
  ribbonComp.layoutMode = "HORIZONTAL";
  ribbonComp.primaryAxisSizingMode = "AUTO";
  ribbonComp.counterAxisSizingMode = "AUTO";
  ribbonComp.itemSpacing = 0;

  const spectrumColors = [
    ["Maroon", TUX_THEMES.tti["brand-primary-deep"]],
    ["Navy", TUX_THEMES.tti["tti-navy"]],
    ["Teal", TUX_THEMES.tti["color-info"]],
    ["Green", TUX_THEMES.tti["color-success"]],
    ["Gold", TUX_THEMES.tti["brand-accent"]],
  ];
  for (const [bandName, hex] of spectrumColors) {
    const band = figma.createRectangle();
    band.name = "Spectrum / " + bandName;
    band.resize(136, 12);
    band.fills = [{ type: "SOLID", color: hexToRgb01(hex) }];
    ribbonComp.appendChild(band);
  }
  rootFrame.appendChild(ribbonComp);

  // Button Components Row
  const buttonRow = figma.createFrame();
  buttonRow.name = "TUX / Buttons Row (44px AAA)";
  buttonRow.layoutMode = "HORIZONTAL";
  buttonRow.primaryAxisSizingMode = "AUTO";
  buttonRow.counterAxisSizingMode = "AUTO";
  buttonRow.itemSpacing = 16;
  buttonRow.fills = [];

  const buttonVariants = [
    { name: "TUX / TuxButton / Primary", bg: TUX_THEMES.tti["brand-primary"], fg: "#FFFFFF", label: "Primary Action" },
    { name: "TUX / TuxButton / Accent Gold", bg: TUX_THEMES.tti["brand-accent"], fg: TUX_THEMES.tti["brand-accent-ink"], label: "Warm Gold CTA" },
    { name: "TUX / TuxButton / Critical", bg: TUX_THEMES.tti["status-critical"], fg: "#FFFFFF", label: "Critical Stop" },
    { name: "TUX / TuxButton / Dark Primary", bg: TUX_THEMES["tti-dark"]["brand-primary"], fg: TUX_THEMES["tti-dark"]["surface-page"], label: "Dark Mode Action" },
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
    btnComp.fills = [{ type: "SOLID", color: hexToRgb01(b.bg) }];

    const txt = figma.createText();
    txt.fontName = { family: "Inter", style: "Bold" };
    txt.fontSize = 14;
    txt.characters = b.label;
    txt.fills = [{ type: "SOLID", color: hexToRgb01(b.fg) }];
    btnComp.appendChild(txt);
    buttonRow.appendChild(btnComp);
  }
  rootFrame.appendChild(buttonRow);

  figma.currentPage.appendChild(rootFrame);
  figma.viewport.scrollAndZoomIntoView([rootFrame]);
  return 6;
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
      figma.notify("✓ TUX: Synced " + count + " Paint Styles across Light, Dark & High-Contrast!");
      figma.ui.postMessage({ type: "status", text: "Synced " + count + " Paint Styles across all 3 themes." });
    } else if (msg.type === "sync-variables") {
      const res = await syncFigmaVariables();
      const modeMsg = res.multiModeSupported
        ? "3-mode collection"
        : "3 single-mode collections (Free Starter Plan auto-fallback)";
      figma.notify("✓ TUX: Created " + res.createdCount + " Figma Variables (" + modeMsg + ")!");
      figma.ui.postMessage({
        type: "status",
        text: "Created " + res.createdCount + " Figma Variables (" + modeMsg + ").",
      });
    } else if (msg.type === "generate-kit") {
      const count = await generateAutoLayoutKitOnCanvas();
      figma.notify("✓ TUX: Generated Auto-Layout Component Kit on canvas!");
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
