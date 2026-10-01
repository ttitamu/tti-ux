import { assertNever } from "./types";
import { isSafeHttpUrl } from "./embed";

export const MODULE_KINDS = [
  "hero",
  "callout",
  "split",
  "cards",
  "steps",
  "cta",
  "stats",
] as const;
export type ModuleKind = (typeof MODULE_KINDS)[number];

export const CALLOUT_TONES = ["note", "warn", "tip", "important"] as const;
export type CalloutTone = (typeof CALLOUT_TONES)[number];

export type ModuleFieldKind = "text" | "textarea" | "url" | "select";

export interface ModuleField {
  key: string;
  label: string;
  kind: ModuleFieldKind;
  options?: { value: string; label: string }[];
}

export interface ModuleSpec {
  kind: ModuleKind;
  label: string;
  hint: string;
  defaults: Record<string, string>;
  fields: ModuleField[];
}

function text(key: string, label: string): ModuleField {
  return { key, label, kind: "text" };
}

function area(key: string, label: string): ModuleField {
  return { key, label, kind: "textarea" };
}

function url(key: string, label: string): ModuleField {
  return { key, label, kind: "url" };
}

export const MODULES: Record<ModuleKind, ModuleSpec> = {
  hero: {
    kind: "hero",
    label: "Hero Header",
    hint: "Full-width page opener with eyebrow, title, lead, and primary action",
    defaults: {
      eyebrow: "Research Program",
      title: "Connected Corridors Initiative",
      lead: "Accelerating automated and connected vehicle research across Texas multimodal transportation networks.",
      actionLabel: "Explore Program Data",
      actionHref: "/research/connected-corridors",
    },
    fields: [
      text("eyebrow", "Eyebrow"),
      text("title", "Title"),
      area("lead", "Lead description"),
      text("actionLabel", "Button label"),
      url("actionHref", "Button URL"),
    ],
  },
  callout: {
    kind: "callout",
    label: "Callout Alert",
    hint: "Admonition callout matching TUX tone standards",
    defaults: {
      tone: "warn",
      title: "Active Field Operations",
      body: "Sensor calibration is currently underway on the RELLIS test track. Real-time telemetry may experience intermittent latency.",
    },
    fields: [
      {
        key: "tone",
        label: "Tone",
        kind: "select",
        options: [
          { value: "note", label: "Note (Neutral)" },
          { value: "tip", label: "Tip (Helpful)" },
          { value: "warn", label: "Warning (Caution)" },
          { value: "important", label: "Important (Maroon)" },
        ],
      },
      text("title", "Title"),
      area("body", "Body"),
    ],
  },
  split: {
    kind: "split",
    label: "Split Focus",
    hint: "Two columns: narrative prose beside an aligned aside panel",
    defaults: {
      kicker: "Architecture Focus",
      title: "Dual Data Pipeline",
      body: "Edge sensors collect continuous LiDAR and radar point clouds at 50Hz, while centralized aggregators compute rolling safety indices.",
      asideTitle: "Implementation Specs",
      asideBody: "Requires Rust edge agent v2.4+ and WebSocket telemetry gateway connection.",
    },
    fields: [
      text("kicker", "Kicker"),
      text("title", "Title"),
      area("body", "Body narrative"),
      text("asideTitle", "Aside title"),
      area("asideBody", "Aside details"),
    ],
  },
  cards: {
    kind: "cards",
    label: "Card Grid",
    hint: "Three structured cards in a responsive row",
    defaults: {
      heading: "Key Research Thrusts",
      c1Title: "V2X Telemetry",
      c1Body: "Standardized roadside unit protocols and low-latency packet routing.",
      c1Href: "/research/v2x",
      c2Title: "Pavement Sensing",
      c2Body: "Embedded fiber-optic strain arrays evaluating freight corridor degradation.",
      c2Href: "/research/pavement",
      c3Title: "Safety Analytics",
      c3Body: "Computer vision conflict detection algorithms deployed at high-incident intersections.",
      c3Href: "/research/safety",
    },
    fields: [
      text("heading", "Section Heading"),
      text("c1Title", "Card 1 title"),
      area("c1Body", "Card 1 description"),
      url("c1Href", "Card 1 URL"),
      text("c2Title", "Card 2 title"),
      area("c2Body", "Card 2 description"),
      url("c2Href", "Card 2 URL"),
      text("c3Title", "Card 3 title"),
      area("c3Body", "Card 3 description"),
      url("c3Href", "Card 3 URL"),
    ],
  },
  steps: {
    kind: "steps",
    label: "Procedure Steps",
    hint: "Numbered timeline procedure for runbooks and field instructions",
    defaults: {
      heading: "Field Deployment Sequence",
      s1Title: "Site Verification & Safety Perimeter",
      s1Body: "Establish warning signage and confirm high-visibility gear prior to entering shoulder.",
      s2Title: "Sensor Mounting & Alignment",
      s2Body: "Affix optical sensor brackets at 4.2m elevation and calibrate laser level.",
      s3Title: "Network Handshake & Baseline Ingestion",
      s3Body: "Verify telemetry heartbeat packets with central operations server.",
    },
    fields: [
      text("heading", "Heading"),
      text("s1Title", "Step 1 title"),
      area("s1Body", "Step 1 description"),
      text("s2Title", "Step 2 title"),
      area("s2Body", "Step 2 description"),
      text("s3Title", "Step 3 title"),
      area("s3Body", "Step 3 description"),
    ],
  },
  cta: {
    kind: "cta",
    label: "Call to Action",
    hint: "Closing institutional CTA band with action button",
    defaults: {
      title: "Collaborate With TTI Researchers",
      body: "Connect with our research teams to explore sponsored projects, technical evaluations, or data partnerships.",
      actionLabel: "Contact the Research Team",
      actionHref: "mailto:research@tti.tamu.edu",
    },
    fields: [
      text("title", "Headline"),
      area("body", "Description"),
      text("actionLabel", "Button label"),
      url("actionHref", "Button destination"),
    ],
  },
  stats: {
    kind: "stats",
    label: "Big Statistics",
    hint: "Three prominent metric figures with labels",
    defaults: {
      v1: "$126M+",
      l1: "Annual Research Expenditures",
      v2: "700+",
      l2: "Research Professionals & Staff",
      v3: "2,000+",
      l3: "Active Transportation Projects",
    },
    fields: [
      text("v1", "Stat 1 Value"),
      text("l1", "Stat 1 Label"),
      text("v2", "Stat 2 Value"),
      text("l2", "Stat 2 Label"),
      text("v3", "Stat 3 Value"),
      text("l3", "Stat 3 Label"),
    ],
  },
};

export const MODULE_LIST: ModuleSpec[] = MODULE_KINDS.map((kind) => MODULES[kind]);

export function isModuleKind(value: string): value is ModuleKind {
  return (MODULE_KINDS as readonly string[]).includes(value);
}

export function isCalloutTone(value: string): value is CalloutTone {
  return (CALLOUT_TONES as readonly string[]).includes(value);
}

export function moduleSpec(kind: ModuleKind): ModuleSpec {
  return MODULES[kind];
}

export function sanitizeHref(value: string): string {
  const href = value.trim();
  if (!href) return "";
  if (href.startsWith("/") && !href.startsWith("//")) return href;
  if (href.startsWith("mailto:")) return href;
  return isSafeHttpUrl(href) ? href : "";
}

function asRecord(raw: unknown): Record<string, unknown> {
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>;
      }
    } catch {
      return {};
    }
    return {};
  }
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    return raw as Record<string, unknown>;
  }
  return {};
}

export function sanitizePayload(kind: ModuleKind, raw: unknown): Record<string, string> {
  const spec = moduleSpec(kind);
  const input = asRecord(raw);
  const out: Record<string, string> = { ...spec.defaults };
  for (const field of spec.fields) {
    const value = String(input[field.key] ?? out[field.key] ?? "").slice(0, 2000);
    switch (field.kind) {
      case "url":
        out[field.key] = sanitizeHref(value);
        break;
      case "select": {
        const allowed = field.options?.map((option) => option.value) ?? [];
        out[field.key] = allowed.includes(value) ? value : (allowed[0] ?? "");
        break;
      }
      case "text":
      case "textarea":
        out[field.key] = value;
        break;
      default:
        assertNever(field.kind, "module field kind");
    }
  }
  if (typeof input._width === "string") {
    const trimmed = input._width.trim();
    const match = trimmed.match(/^(\d{2,3})%$/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num >= 20 && num <= 100) {
        out._width = `${num}%`;
      }
    } else {
      const standardWidths = ["100%", "92%", "83%", "75%", "67%", "66%", "58%", "50%", "42%", "33%", "25%"];
      if (standardWidths.includes(trimmed)) {
        out._width = trimmed;
      }
    }
  }
  if (input._colStart != null) {
    const cs = parseInt(String(input._colStart), 10);
    if (!Number.isNaN(cs) && cs >= 1 && cs <= 12) {
      out._colStart = String(cs);
    }
  }
  if (input._colSpan != null) {
    const cp = parseInt(String(input._colSpan), 10);
    if (!Number.isNaN(cp) && cp >= 1 && cp <= 12) {
      out._colSpan = String(cp);
    }
  }
  if (typeof input._align === "string") {
    const a = input._align.trim().toLowerCase();
    if (["left", "center", "right"].includes(a)) {
      out._align = a;
    }
  }
  return out;
}

export interface ModuleGridStyle {
  width: string;
  maxWidth: string;
  marginLeft: string;
  marginRight: string;
}

export function calcGridColumnFromCoord(
  clientX: number,
  parentRect: { left: number; width: number },
  cols = 12
): number {
  if (parentRect.width <= 0) return 1;
  const relX = clientX - parentRect.left;
  const colFraction = (relX / parentRect.width) * cols;
  return Math.max(1, Math.min(cols, Math.round(colFraction)));
}

export function moduleGridStyle(payload: Record<string, string>): ModuleGridStyle {
  const align = (payload._align || "").toLowerCase();
  const colStart = Math.min(12, Math.max(1, parseInt(payload._colStart || "1", 10) || 1));
  const colSpan = Math.min(13 - colStart, Math.max(1, parseInt(payload._colSpan || "12", 10) || 12));

  if (align === "center") {
    const w = payload._width || `${Math.round((colSpan / 12) * 100)}%`;
    return {
      width: w,
      maxWidth: "100%",
      marginLeft: "auto",
      marginRight: "auto",
    };
  } else if (align === "left") {
    const w = payload._width || `${Math.round((colSpan / 12) * 100)}%`;
    return {
      width: w,
      maxWidth: "100%",
      marginLeft: "0",
      marginRight: "auto",
    };
  } else if (align === "right") {
    const w = payload._width || `${Math.round((colSpan / 12) * 100)}%`;
    return {
      width: w,
      maxWidth: "100%",
      marginLeft: "auto",
      marginRight: "0",
    };
  }

  // Custom 12-column track offset and span
  if (colStart > 1 || colSpan < 12) {
    const leftPct = `${Math.round(((colStart - 1) / 12) * 10000) / 100}%`;
    const widthPct = `${Math.round((colSpan / 12) * 10000) / 100}%`;
    return {
      width: widthPct,
      maxWidth: "100%",
      marginLeft: leftPct,
      marginRight: "auto",
    };
  }

  const w = payload._width || "100%";
  return {
    width: w,
    maxWidth: "100%",
    marginLeft: w === "100%" ? "0" : "auto",
    marginRight: w === "100%" ? "0" : "auto",
  };
}

export function calloutTone(payload: Record<string, string>): CalloutTone {
  return isCalloutTone(payload.tone || "") ? (payload.tone as CalloutTone) : "warn";
}

export function calloutToneLabel(tone: CalloutTone): string {
  switch (tone) {
    case "note": return "Note";
    case "tip": return "Tip";
    case "warn": return "Warning";
    case "important": return "Important";
    default: return assertNever(tone, "callout tone");
  }
}

export interface ModuleCard {
  title: string;
  body: string;
  href: string;
}

export interface ModuleStep {
  title: string;
  body: string;
}

export interface ModuleStat {
  value: string;
  label: string;
}

export function moduleCards(payload: Record<string, string>): ModuleCard[] {
  return [1, 2, 3]
    .map((n) => ({
      title: payload[`c${n}Title`] || "",
      body: payload[`c${n}Body`] || "",
      href: payload[`c${n}Href`] || "",
    }))
    .filter((card) => card.title || card.body);
}

export function moduleSteps(payload: Record<string, string>): ModuleStep[] {
  return [1, 2, 3]
    .map((n) => ({
      title: payload[`s${n}Title`] || "",
      body: payload[`s${n}Body`] || "",
    }))
    .filter((step) => step.title || step.body);
}

export function moduleStats(payload: Record<string, string>): ModuleStat[] {
  return [1, 2, 3]
    .map((n) => ({
      value: payload[`v${n}`] || "",
      label: payload[`l${n}`] || "",
    }))
    .filter((stat) => stat.value || stat.label);
}

export interface ModuleAction {
  label: string;
  to: string;
  external: boolean;
}

export function isInternalHref(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//");
}

export function moduleAction(label: string, href: string): ModuleAction | null {
  const text = label.trim();
  const dest = sanitizeHref(href);
  if (!text || !dest) return null;
  return {
    label: text,
    to: dest,
    external: !isInternalHref(dest),
  };
}
