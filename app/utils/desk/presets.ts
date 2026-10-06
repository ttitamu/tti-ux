import type { JSONContent } from "@tiptap/core";

export type TuxDeskPresetCategory =
  | "research"
  | "technical"
  | "academic"
  | "operations"
  | "starter";

export interface TuxDeskBlockChip {
  kind: string;
  label: string;
  tone?: "brand" | "neutral" | "ok" | "warning" | "info";
}

export interface TuxDeskPreset {
  id: string;
  title: string;
  description: string;
  category: TuxDeskPresetCategory;
  categoryLabel: string;
  icon: string;
  badgeTone: "brand" | "neutral" | "ok" | "warning" | "info";
  suggestedSlug: string;
  reviewCadenceDays: number;
  blocksSummary: TuxDeskBlockChip[];
  doc: JSONContent;
}

export const TUX_DESK_PRESETS: TuxDeskPreset[] = [
  {
    id: "research-program",
    title: "Connected Corridors Initiative",
    description: "Flagship strategic research program landing page with institutional hero, scale metrics, research cards, and facility split.",
    category: "research",
    categoryLabel: "Research Program",
    icon: "lucide:layers",
    badgeTone: "brand",
    suggestedSlug: "connected-corridors",
    reviewCadenceDays: 90,
    blocksSummary: [
      { kind: "hero", label: "Hero Banner", tone: "brand" },
      { kind: "callout", label: "Field Calibration", tone: "warning" },
      { kind: "stats", label: "Scale Metrics", tone: "ok" },
      { kind: "cards", label: "Research Thrusts", tone: "neutral" },
      { kind: "split", label: "Dual Pipeline", tone: "neutral" },
      { kind: "cta", label: "Collaboration CTA", tone: "brand" },
    ],
    doc: {
      type: "doc",
      content: [
        {
          type: "deskModule",
          attrs: {
            kind: "hero",
            payload: {
              eyebrow: "Research Program",
              title: "Connected Corridors Initiative",
              lead: "Accelerating automated and connected vehicle research across Texas multimodal transportation networks.",
              actionLabel: "Explore Program Data",
              actionHref: "/research/connected-corridors",
            },
          },
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "The Texas A&M Transportation Institute operates advanced roadside sensing arrays and edge telemetry across designated test corridors. Non-technical research personnel and staff can assemble articles and project summaries using canonical TUX design system components without writing HTML, markdown, or Git pull requests.",
            },
          ],
        },
        {
          type: "deskModule",
          attrs: {
            kind: "callout",
            payload: {
              tone: "warn",
              title: "Active Field Calibration",
              body: "Sensor calibration is currently underway on the RELLIS test track. Real-time telemetry may experience intermittent latency.",
            },
          },
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Institutional Scale & Research Velocity" }],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "By embedding canonical TUX components directly into the TipTap document schema, every page authored in Desk adheres to TTI brand standards, WCAG 2.2 AA accessibility, and responsive typography out of the box.",
            },
          ],
        },
        {
          type: "deskModule",
          attrs: {
            kind: "stats",
            payload: {
              v1: "$126M+",
              l1: "Annual Research Expenditures",
              v2: "700+",
              l2: "Research Professionals & Staff",
              v3: "2,000+",
              l3: "Active Transportation Projects",
            },
          },
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Multimodal Research Domains" }],
        },
        {
          type: "deskModule",
          attrs: {
            kind: "cards",
            payload: {
              heading: "Core Research Focus Areas",
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
          },
        },
        {
          type: "deskModule",
          attrs: {
            kind: "split",
            payload: {
              kicker: "Architecture Focus",
              title: "Dual Data Pipeline",
              body: "Edge sensors collect continuous LiDAR and radar point clouds at 50Hz, while centralized aggregators compute rolling safety indices.",
              asideTitle: "Implementation Specs",
              asideBody: "Requires Rust edge agent v2.4+ and WebSocket telemetry gateway connection.",
            },
          },
        },
        {
          type: "deskModule",
          attrs: {
            kind: "cta",
            payload: {
              title: "Partner with the Connected Corridors Team",
              body: "Join state agencies, OEMs, and municipal partners validating connected infrastructure on Texas highways.",
              actionLabel: "Contact Program Directors",
              actionHref: "mailto:connected-corridors@tti.tamu.edu",
            },
          },
        },
      ],
    },
  },
  {
    id: "field-evaluation",
    title: "Automated Freight Platooning Field Trial",
    description: "Technical testbed evaluation report with calibration notes, numbered procedure steps, live operational telemetry stats, and sponsor citations.",
    category: "technical",
    categoryLabel: "Technical Report",
    icon: "lucide:cpu",
    badgeTone: "info",
    suggestedSlug: "freight-platooning-trial",
    reviewCadenceDays: 30,
    blocksSummary: [
      { kind: "hero", label: "Technical Hero", tone: "brand" },
      { kind: "callout", label: "Track Telemetry Alert", tone: "info" },
      { kind: "steps", label: "Test Protocol", tone: "neutral" },
      { kind: "stats", label: "Performance Metrics", tone: "ok" },
      { kind: "split", label: "Sponsor Specs", tone: "neutral" },
      { kind: "cta", label: "Data Archive CTA", tone: "brand" },
    ],
    doc: {
      type: "doc",
      content: [
        {
          type: "deskModule",
          attrs: {
            kind: "hero",
            payload: {
              eyebrow: "Technical Evaluation Report",
              title: "Automated Freight Platooning Field Trial",
              lead: "Empirical aerodynamic drag reduction and V2V wireless packet delivery verification across three Class 8 heavy vehicles.",
              actionLabel: "Download Data Manifest",
              actionHref: "/data/freight-platooning.csv",
            },
          },
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Controlled proving ground evaluations conducted at the RELLIS Campus measured steady-state follow distances between 12 and 24 meters at 65 mph highway cruising speeds. This report summarizes the wireless propagation reliability, brake reaction latency, and empirical fuel burn measurements.",
            },
          ],
        },
        {
          type: "deskModule",
          attrs: {
            kind: "callout",
            payload: {
              tone: "tip",
              title: "Dedicated DSRC & C-V2X Telemetry",
              body: "Dual-redundant 5.9 GHz communication transceivers recorded 0 dropped brake synchronization pulses across 1,200 continuous test laps.",
            },
          },
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Three-Stage Testing Protocol" }],
        },
        {
          type: "deskModule",
          attrs: {
            kind: "steps",
            payload: {
              heading: "Proving Ground Sequence",
              s1Title: "Baseline Optical & Radar Calibration",
              s1Body: "Static target alignment verify laser rangefinder precision within ±1.5cm across lead, middle, and trailing tractor units.",
              s2Title: "Synchronized Longitudinal Control",
              s2Body: "Coordinated braking pulses triggered at random 0.1s intervals to test automated reaction latency against manual driver baselines.",
              s3Title: "Aerodynamic Drag & Fuel Flow Sampling",
              s3Body: "Continuous Coriolis fuel flow meters measured steady-state consumption across 20-mile constant speed loops.",
            },
          },
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Empirical Performance Metrics" }],
        },
        {
          type: "deskModule",
          attrs: {
            kind: "stats",
            payload: {
              v1: "-14.2%",
              l1: "Trailing Vehicle Fuel Burn",
              v2: "42ms",
              l2: "Automated Braking Latency",
              v3: "99.98%",
              l3: "V2V Packet Delivery Ratio",
            },
          },
        },
        {
          type: "deskModule",
          attrs: {
            kind: "split",
            payload: {
              kicker: "Testbed Configuration",
              title: "RELLIS Proving Ground Track 4",
              body: "Tests executed under FHWA grant DTFH61-22-C-00018 with TxDOT Commercial Vehicle Operations oversight on a 2.5-mile concrete runway loop.",
              asideTitle: "Instrumentation Suite",
              asideBody: "Class 8 Kenworth T680 tractors equipped with Wabco OnGuard collision mitigation and Oxford RT3000 GNSS/INS inertial navigation.",
            },
          },
        },
        {
          type: "deskModule",
          attrs: {
            kind: "cta",
            payload: {
              title: "Access Raw Telemetry & Rosbags",
              body: "Full CAN bus logs, IMU motion time series, and 100Hz fuel sensor feeds are preserved in the TTI Data Repository under CC-BY-4.0.",
              actionLabel: "Access Repository Archive",
              actionHref: "https://dataverse.tdl.org/dataverse/tti",
            },
          },
        },
      ],
    },
  },
  {
    id: "academic-publication",
    title: "Dynamic Managed Lanes Pricing Under Multi-Corridor Congestion",
    description: "Peer-reviewed academic paper summary with DOI attribution, formal abstract, empirical findings cards, policy implications, and citation exporter.",
    category: "academic",
    categoryLabel: "Academic Paper",
    icon: "lucide:graduation-cap",
    badgeTone: "neutral",
    suggestedSlug: "managed-lanes-pricing-study",
    reviewCadenceDays: 180,
    blocksSummary: [
      { kind: "hero", label: "Publication Hero", tone: "brand" },
      { kind: "callout", label: "Journal Attribution", tone: "neutral" },
      { kind: "cards", label: "Key Findings", tone: "ok" },
      { kind: "split", label: "Policy Implications", tone: "neutral" },
      { kind: "cta", label: "Citation Exporter", tone: "brand" },
    ],
    doc: {
      type: "doc",
      content: [
        {
          type: "deskModule",
          attrs: {
            kind: "hero",
            payload: {
              eyebrow: "Peer-Reviewed Publication",
              title: "Dynamic Managed Lanes Pricing Under Multi-Corridor Congestion",
              lead: "A macroscopic fundamental diagram approach to time-varying tolling algorithms that prevents shockwave spillover onto general purpose lanes.",
              actionLabel: "Download Full Paper (PDF)",
              actionHref: "https://doi.org/10.1016/j.trb.2025.102830",
            },
          },
        },
        {
          type: "deskModule",
          attrs: {
            kind: "callout",
            payload: {
              tone: "note",
              title: "Transportation Research Part B: Methodological (2025)",
              body: "Authors: G. Goodin, M. Burris, S. Turner, P. Carlson. DOI: 10.1016/j.trb.2025.102830. Funding provided by Texas Department of Transportation Research Project 0-7089.",
            },
          },
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Executive Abstract" }],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Dynamic tolling in express lanes often optimizes throughput within the managed facility while inadvertently exacerbating bottlenecks at merge and egress tapers. This research introduces a network-level feedback controller that balances density gradients across parallel facilities, mitigating breakdown phenomena before queue propagation becomes irreversible.",
            },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Empirical Findings & Insights" }],
        },
        {
          type: "deskModule",
          attrs: {
            kind: "cards",
            payload: {
              heading: "Key Behavioral Discoveries",
              c1Title: "Spillover Prevention",
              c1Body: "Dynamic price rate throttling delayed mainline bottleneck breakdown by an average of 34 minutes during peak morning surges.",
              c1Href: "#methodology",
              c2Title: "Value of Reliability",
              c2Body: "Commuters demonstrated willingness to pay $1.85/min saved under 95th-percentile buffer index guarantees.",
              c2Href: "#travel-time-reliability",
              c3Title: "Revenue Neutrality",
              c3Body: "Overall corridor toll yield remained consistent while improving total passenger-miles traveled by 18.6%.",
              c3Href: "#revenue-analysis",
            },
          },
        },
        {
          type: "deskModule",
          attrs: {
            kind: "split",
            payload: {
              kicker: "Policy Recommendations",
              title: "Translating Models to State DOT Operations",
              body: "State highway agencies can implement the 5-minute predictive smoothing filter directly within existing TransCore and Kapsch roadside tolling backends without hardware replacements.",
              asideTitle: "Corridor Testbeds",
              asideBody: "Calibrated against 36 months of continuous loop detector and RFID transponder data on Austin MoPac Express and Dallas LBJ TEXpress.",
            },
          },
        },
        {
          type: "deskModule",
          attrs: {
            kind: "cta",
            payload: {
              title: "Cite This Publication",
              body: "BibTeX, RIS, and APA reference formats are available for academic citations. Source code for the macroscopic simulation is open-source.",
              actionLabel: "Copy BibTeX Citation",
              actionHref: "#citation-export",
            },
          },
        },
      ],
    },
  },
  {
    id: "corridor-advisory",
    title: "I-35 Central Corridor Smart Workzone Telemetry",
    description: "Real-time corridor advisory bulletin featuring urgency status banners, phased implementation milestones, active roadside telemetry stats, and agency contacts.",
    category: "operations",
    categoryLabel: "Corridor Advisory",
    icon: "lucide:shield-alert",
    badgeTone: "warning",
    suggestedSlug: "i35-corridor-advisory",
    reviewCadenceDays: 14,
    blocksSummary: [
      { kind: "hero", label: "Operations Hero", tone: "brand" },
      { kind: "callout", label: "Active Construction Alert", tone: "warning" },
      { kind: "steps", label: "Harmonization Phases", tone: "neutral" },
      { kind: "stats", label: "Roadside Radar Units", tone: "ok" },
      { kind: "split", label: "Workzone Limits", tone: "neutral" },
      { kind: "cta", label: "TMC Dispatch CTA", tone: "brand" },
    ],
    doc: {
      type: "doc",
      content: [
        {
          type: "deskModule",
          attrs: {
            kind: "hero",
            payload: {
              eyebrow: "Operational Status Advisory",
              title: "I-35 Central Corridor Smart Workzone Telemetry",
              lead: "Active queue warning systems, variable speed limit harmonizers, and automated intrusion alarms deployed across Mileposts 228–241.",
              actionLabel: "View Real-Time Speed Map",
              actionHref: "/visualizations/metro-inset",
            },
          },
        },
        {
          type: "deskModule",
          attrs: {
            kind: "callout",
            payload: {
              tone: "important",
              title: "Nighttime Single-Lane Closures Scheduled",
              body: "Northbound mainlanes reduced to single-lane between 9:00 PM and 5:30 AM through Thursday. Expect delay times of 18–25 minutes.",
            },
          },
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Smart Workzone Architecture & Phasing" }],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "To protect both construction personnel and the traveling public, TTI and TxDOT have deployed automated queue warning trailers linked directly into regional Traffic Management Centers. Advisory speeds step down in 10-mph increments as queues form.",
            },
          ],
        },
        {
          type: "deskModule",
          attrs: {
            kind: "steps",
            payload: {
              heading: "Incident & Queue Harmonization Sequence",
              s1Title: "Upstream Microwave Radar Ingestion",
              s1Body: "Solar-powered roadside microwave detectors identify vehicle slowdowns below 45 mph within 3 seconds of onset.",
              s2Title: "Automated Portable DMS Activation",
              s2Body: "Dynamic Message Signs 2 and 4 miles upstream flash real-time queue warnings and recommended detour exits.",
              s3Title: "Workzone Worker Intrusion Warning",
              s3Body: "Ultrasonic perimeter sensors trigger high-decibel audible sirens if unauthorized vehicles breach buffer drums.",
            },
          },
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Corridor Deployment Scale" }],
        },
        {
          type: "deskModule",
          attrs: {
            kind: "stats",
            payload: {
              v1: "18",
              l1: "Roadside Microwave Radar Units",
              v2: "4",
              l2: "Solar Portable DMS Trailers",
              v3: "12.4 Mi",
              l3: "Instrumented Safety Zone",
            },
          },
        },
        {
          type: "deskModule",
          attrs: {
            kind: "split",
            payload: {
              kicker: "Emergency Protocols",
              title: "Incident Management Coordination",
              body: "Crash and breakdown incidents inside the workzone trigger priority dispatch for HERO roadside assistance vehicles stationed at Exit 234.",
              asideTitle: "Agency Contacts",
              asideBody: "Austin TMC Operations: 512-555-0199. Workzone Field Manager: MP-230 Dispatch Office.",
            },
          },
        },
        {
          type: "deskModule",
          attrs: {
            kind: "cta",
            payload: {
              title: "Report Workzone Safety Issues",
              body: "Contractors, law enforcement, and field inspectors can submit instant hazard reports directly to the Austin District Operations Desk.",
              actionLabel: "Submit Safety Report",
              actionHref: "tel:5125550199",
            },
          },
        },
      ],
    },
  },
  {
    id: "minimal-starter",
    title: "Clean Starter Canvas",
    description: "Minimalist starting template with a hero banner, initial narrative block, and guidance callout for building a customized document from scratch.",
    category: "starter",
    categoryLabel: "Blank Starter",
    icon: "lucide:file-text",
    badgeTone: "brand",
    suggestedSlug: "untitled-page",
    reviewCadenceDays: 90,
    blocksSummary: [
      { kind: "hero", label: "Page Header", tone: "brand" },
      { kind: "paragraph", label: "Narrative Body", tone: "neutral" },
      { kind: "callout", label: "Editorial Note", tone: "info" },
    ],
    doc: {
      type: "doc",
      content: [
        {
          type: "deskModule",
          attrs: {
            kind: "hero",
            payload: {
              eyebrow: "Research Section",
              title: "New Documentation Page",
              lead: "Provide an executive summary of this initiative, laboratory program, or engineering guidance document.",
              actionLabel: "Primary Action",
              actionHref: "#",
            },
          },
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Begin typing your narrative prose here. Use the formatting toolbar above for bold, italic, headings, lists, and links, or click 'Add Block' to insert canonical TUX components like stats, callouts, cards, and steps.",
            },
          ],
        },
        {
          type: "deskModule",
          attrs: {
            kind: "callout",
            payload: {
              tone: "note",
              title: "Getting Started with Tux Desk",
              body: "Every block is editable visually on the canvas and bidirectionally synchronized with Markdown/MDC and HTML source code.",
            },
          },
        },
      ],
    },
  },
];

export function getDeskPresets(): TuxDeskPreset[] {
  return TUX_DESK_PRESETS;
}

export function getDeskPreset(id: string): TuxDeskPreset | undefined {
  return TUX_DESK_PRESETS.find((p) => p.id === id);
}

export function clonePresetDoc(id: string): JSONContent | null {
  const preset = getDeskPreset(id);
  if (!preset) return null;
  return JSON.parse(JSON.stringify(preset.doc));
}
