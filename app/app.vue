<script setup lang="ts">
// Style-guide shell: minimal header (logo + theme toggle) and a grouped
// sidebar that does all the navigation. Main content fills the rest.

// Version surfaced in the header pill + welcome page. Sourced from
// package.json so a `npm version` bump propagates without code edits.
import pkg from "../package.json";
import {
  tuxCatalog,
  catalogByCategory,
  catalogByVizCategory,
  type TuxCatalogFamily,
  TUX_COMPONENT_CATEGORIES,
  TUX_VIZ_CATEGORIES,
} from "./utils/tuxCatalog";
import { tuxTokensCatalog } from "./utils/tuxTokensCatalog";
import type { Command, CommandGroup } from "./components/TuxCommandPalette.vue";

const pkgVersion = pkg.version;
const colorMode = useColorMode();
const route = useRoute();
const router = useRouter();
const toast = useTuxToast();

// Header theme toggle now lives inside TuxUtilityCluster (light ↔ dark
// only). High-contrast stays a footer affordance per ADR-0006.
const isHighContrast = computed(() => colorMode.preference === "tti-hc");

function toggleHighContrast() {
  colorMode.preference = isHighContrast.value ? "tti" : "tti-hc";
}

// Sidebar nav — grouped by role so newcomers orient by "what are you looking
// for?" rather than alphabetical. Icons are Lucide; mostly mnemonic.
//
// Shape is the `TuxDocsSidebar` tree: top-level entries are collapsible
// section parents (no `to`, no `icon` — uppercase eyebrow alone reads as
// the group header, matching the AggieUX reference-kit pattern). Leaves
// keep their Lucide glyphs.
// The Components / Reports / Visualizations groups derive from
// app/utils/tuxCatalog.ts — the single catalog source of truth
// (tests/tux-catalog.test.ts enforces it against the filesystem, the
// showcase routes, and design/components.md). Hand-listed entries here
// are doc pages only.
const catalogNav = (family: TuxCatalogFamily) =>
  tuxCatalog
    .filter((e) => e.family === family)
    .map((e) => ({ label: e.name, to: e.to, icon: e.icon }));

interface HighLevelArea {
  id: string;
  label: string;
  shortLabel?: string;
  icon: string;
  to: string;
  eyebrow?: string;
  groupTitles: string[];
}

const highLevelAreas: HighLevelArea[] = [
  {
    id: "foundations",
    label: "Foundations",
    shortLabel: "Foundations",
    icon: "lucide:palette",
    to: "/tokens",
    eyebrow: "Design Language",
    groupTitles: ["01 // Doctrine", "02 // Foundations"],
  },
  {
    id: "components",
    label: "Component Lab",
    shortLabel: "Components",
    icon: "lucide:blocks",
    to: "/components",
    eyebrow: "UI Primitives & Kits",
    groupTitles: [
      "03 // Overview & Doctrine",
      "03a // Actions & Commands",
      "03b // Navigation & Layout",
      "03c // Data Display & Tables",
      "03d // Feedback & Alerts",
      "03e // Forms & Controls",
      "03f // AI & Conversational",
      "03g // Research & Publishing",
      "05 // Suites & Kits",
    ],
  },
  {
    id: "visualizations",
    label: "Data & Telemetry",
    shortLabel: "Telemetry",
    icon: "lucide:chart-pie",
    to: "/visualizations",
    eyebrow: "BI & Visualization",
    groupTitles: [
      "06 // Overview & Foundations",
      "06a // Timeseries & Trends",
      "06b // Geospatial & Maps",
      "06c // Statistical & Distributions",
      "06d // BI & Analytics Embeds",
      "06e // Publishing & Print Reports",
    ],
  },
  {
    id: "editorial",
    label: "Research Index",
    shortLabel: "Research",
    icon: "lucide:newspaper",
    to: "/admin",
    eyebrow: "Publications & Releases",
    groupTitles: ["04 // Research Index", "04b // Content Governance"],
  },
  {
    id: "docs",
    label: "Docs & SDKs",
    shortLabel: "Docs",
    icon: "lucide:book-open",
    to: "/docs",
    eyebrow: "Guides & Architecture",
    groupTitles: ["00 // Overview", "00b // Architecture & ADRs"],
  },
];

const activeAreaId = ref<string>("foundations");

watchEffect(() => {
  const p = route.path;
  if (p.startsWith("/admin") || p.startsWith("/desk") || p.startsWith("/p/")) {
    activeAreaId.value = "editorial";
  } else if (
    p.startsWith("/visualizations") ||
    p.startsWith("/reports") ||
    p.startsWith("/design/chart-foundations")
  ) {
    activeAreaId.value = "visualizations";
  } else if (
    p.startsWith("/components") ||
    p.startsWith("/forms") ||
    p.startsWith("/examples") ||
    p.startsWith("/patterns") ||
    p.startsWith("/kits") ||
    p.startsWith("/design/components") ||
    p.startsWith("/design/compositions") ||
    p.startsWith("/design/ops-surfaces")
  ) {
    activeAreaId.value = "components";
  } else if (
    p.startsWith("/docs") ||
    p === "/" ||
    p.startsWith("/getting-started") ||
    p.startsWith("/install") ||
    p.startsWith("/changelog")
  ) {
    activeAreaId.value = "docs";
  } else {
    activeAreaId.value = "foundations";
  }
});

const currentArea = computed(() => {
  return highLevelAreas.find((a) => a.id === activeAreaId.value) || highLevelAreas[0];
});

// Top navigation sliding active indicator state & physics
const navLinksRefs = ref<Record<string, HTMLElement>>({});
const navContainerRef = ref<HTMLElement | null>(null);
const indicatorReady = ref(false);
const pillMetrics = ref({ left: 0, width: 0, height: 0, top: 0 });

function setNavLinkRef(id: string, el: any) {
  if (el) {
    navLinksRefs.value[id] = el.$el || el;
  }
}

function updateNavIndicator() {
  const activeEl = navLinksRefs.value[currentArea.value.id];
  const container = navContainerRef.value;
  if (!activeEl || !container) return;

  const activeRect = activeEl.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  pillMetrics.value = {
    left: activeRect.left - containerRect.left,
    width: activeRect.width,
    top: activeRect.top - containerRect.top,
    height: activeRect.height,
  };
  indicatorReady.value = true;
}

watch(() => currentArea.value.id, () => {
  nextTick(updateNavIndicator);
});

const navPillStyle = computed(() => {
  if (!indicatorReady.value || pillMetrics.value.width === 0) {
    return { opacity: 0 };
  }
  return {
    transform: `translate3d(${pillMetrics.value.left}px, ${pillMetrics.value.top}px, 0)`,
    width: `${pillMetrics.value.width}px`,
    height: `${pillMetrics.value.height}px`,
    opacity: 1,
  };
});

const navUnderlineStyle = computed(() => {
  if (!indicatorReady.value || pillMetrics.value.width === 0) {
    return { opacity: 0 };
  }
  const inset = 8;
  const width = Math.max(16, pillMetrics.value.width - (inset * 2));
  const left = pillMetrics.value.left + inset;
  return {
    transform: `translate3d(${left}px, 0, 0)`,
    width: `${width}px`,
    opacity: 1,
  };
});

// Version Switcher Dropdown & Visual Era Simulation
const selectedVersion = ref<string>(`v${pkgVersion}`);
const versionMenuOpen = ref(false);
const versionDropdownRef = ref<HTMLElement | null>(null);

const releases = [
  {
    version: "v3.0.0",
    title: "Comm Rebrand & Tokens",
    era: "Modern Marcom Rebrand · 5-Band Spectrum & Sharp Geometry",
    badge: "Current",
    badgeClass: "bg-wash-brand-12 text-brand-primary border border-brand-primary/20",
    route: "/",
  },
  {
    version: "v2.2.0",
    title: "Batch M Visualizations",
    era: "Batch M Era · Maroon & Gold Keylines with Rounded Geometry",
    badge: "LTS",
    badgeClass: "bg-surface-sunken text-text-muted border border-surface-border",
    route: "/changelog#220",
  },
  {
    version: "v2.1.0",
    title: "Ops Board & Telemetry",
    era: "Operational Telemetry Era · High-Density CRT & Emerald Accents",
    badge: "Stable",
    badgeClass: "bg-surface-sunken text-text-muted border border-surface-border",
    route: "/changelog#210",
  },
  {
    version: "v2.0.0",
    title: "Nuxt 4 / Tailwind v4",
    era: "Core Architecture Era · Neutral Minimal Monochrome",
    badge: "Archive",
    badgeClass: "bg-surface-sunken text-text-muted border border-surface-border",
    route: "/changelog#200",
  },
  {
    version: "v1.8.0",
    title: "Web Components Core",
    era: "Legacy Components Era · Retro Pill Buttons & Gradient Headers",
    badge: "Legacy",
    badgeClass: "bg-surface-sunken text-text-muted border border-surface-border",
    route: "/changelog#180",
  },
];

const activeRelease = computed(() => {
  return releases.find((r) => r.version === selectedVersion.value) || releases[0];
});

function selectVersion(ver: typeof releases[0]) {
  versionMenuOpen.value = false;
  selectedVersion.value = ver.version;
  if (typeof window !== "undefined") {
    window.sessionStorage.setItem("tux-preview-version", ver.version);
    document.documentElement.setAttribute("data-tux-version", ver.version.replace(/^v/, ""));
  }
  toast.info(
    `Visual Era: ${ver.version}`,
    `${ver.title} — ${ver.era}`
  );
}

function handleGlobalClick(event: MouseEvent) {
  if (versionDropdownRef.value && !versionDropdownRef.value.contains(event.target as Node)) {
    versionMenuOpen.value = false;
  }
}

interface Crumb {
  label: string;
  to?: string;
  href?: string;
}

const breadcrumbTrail = computed<Crumb[]>(() => {
  if (Array.isArray(route.meta?.breadcrumbs) && route.meta.breadcrumbs.length > 0) {
    return route.meta.breadcrumbs as Crumb[];
  }

  const p = route.path;
  if (p === "/" || !p) {
    return [];
  }

  const crumbs: Crumb[] = [{ label: "Home", to: "/" }];

  if (p.startsWith("/components")) {
    if (p === "/components") {
      crumbs.push({ label: "Component Lab" });
      return crumbs;
    }
    crumbs.push({ label: "Component Lab", to: "/components" });

    const entry = tuxCatalog.find((e) => e.to === p);
    if (entry) {
      if (entry.category) {
        const catMeta = TUX_COMPONENT_CATEGORIES.find((c) => c.id === entry.category);
        if (catMeta) {
          crumbs.push({
            label: catMeta.label,
            to: `/components?cat=${catMeta.id}`,
          });
        }
      }
      crumbs.push({ label: entry.name });
      return crumbs;
    }

    const slug = p.replace("/components/", "").replace(/-/g, " ");
    const formatted = slug.charAt(0).toUpperCase() + slug.slice(1);
    crumbs.push({ label: formatted });
    return crumbs;
  }

  if (p.startsWith("/visualizations") || p.startsWith("/reports")) {
    const isReports = p.startsWith("/reports");
    const parentTo = isReports ? "/reports" : "/visualizations";
    const parentLabel = isReports ? "Reports & Briefs" : "Data & Telemetry";

    if (p === parentTo) {
      crumbs.push({ label: parentLabel });
      return crumbs;
    }
    crumbs.push({ label: parentLabel, to: parentTo });

    const entry = tuxCatalog.find((e) => e.to === p);
    if (entry) {
      if (entry.vizCategory) {
        const vizMeta = TUX_VIZ_CATEGORIES.find((v) => v.id === entry.vizCategory);
        if (vizMeta) {
          crumbs.push({ label: vizMeta.label });
        }
      }
      crumbs.push({ label: entry.name });
      return crumbs;
    }

    const slug = p.split("/").filter(Boolean).pop() || "";
    const formatted = slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    crumbs.push({ label: formatted });
    return crumbs;
  }

  if (p.startsWith("/tokens") || p.startsWith("/design/")) {
    crumbs.push({ label: "Foundations", to: "/tokens" });
    if (p === "/tokens") {
      return crumbs;
    }
    if (p === "/contrast-audit") {
      crumbs.push({ label: "Contrast Audit (WCAG AAA)" });
      return crumbs;
    }
    const slug = p.split("/").filter(Boolean).pop() || "";
    const formatted = slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    crumbs.push({ label: formatted });
    return crumbs;
  }

  if (p.startsWith("/news/") || p.startsWith("/admin") || p.startsWith("/desk") || p.startsWith("/p/")) {
    crumbs.push({ label: "Research Index", to: "/admin" });
    if (p === "/admin") {
      return crumbs;
    }
    const slug = p.split("/").filter(Boolean).pop() || "";
    const formatted = slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    crumbs.push({ label: formatted });
    return crumbs;
  }

  if (p.startsWith("/docs") || p.startsWith("/getting-started") || p.startsWith("/install") || p.startsWith("/changelog")) {
    crumbs.push({ label: "Docs & SDKs", to: "/docs" });
    if (p === "/docs") {
      return crumbs;
    }
    const slug = p.split("/").filter(Boolean).pop() || "";
    const formatted = slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    crumbs.push({ label: formatted });
    return crumbs;
  }

  crumbs.push({ label: currentArea.value.label, to: currentArea.value.to });
  const lastSeg = p.split("/").filter(Boolean).pop() || "";
  if (lastSeg) {
    const formatted = lastSeg.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    crumbs.push({ label: formatted });
  }
  return crumbs;
});

const shouldShowBreadcrumbs = computed(() => {
  if (route.path === "/" || !route.path) return false;
  if (route.meta?.layout === false) return false;
  if (route.meta?.hideBreadcrumbs || route.meta?.hideGlobalBreadcrumbs) return false;

  const localBreadcrumbPrefixes = [
    "/install",
    "/docs",
    "/changelog",
    "/p",
    "/examples",
    "/design",
    "/news",
    "/components/portal-shell",
  ];
  if (localBreadcrumbPrefixes.some((prefix) => route.path === prefix || route.path.startsWith(`${prefix}/`))) {
    return false;
  }

  return breadcrumbTrail.value.length > 1;
});

const showAllAreasInSidebar = ref(false);

const activeSidebarSections = computed(() => {
  if (showAllAreasInSidebar.value) {
    return navTree;
  }
  const titles = new Set(currentArea.value.groupTitles);
  const matched = navTree.filter((g) => titles.has(g.label));
  return matched.length > 0 ? matched : navTree;
});

const navTree = [
  {
    label: "00 // Overview",
    children: [
      { label: "Home",            to: "/",                icon: "lucide:home" },
      { label: "Getting started", to: "/getting-started", icon: "lucide:compass" },
      { label: "Install",         to: "/install",         icon: "lucide:package-plus" },
      { label: "  · Power BI setup", to: "/install/power-bi", icon: "lucide:chart-column" },
      { label: "Changelog",       to: "/changelog",       icon: "lucide:scroll-text" },
    ],
  },
  {
    label: "00b // Architecture & ADRs",
    children: [
      { label: "ADR Index", to: "/docs/adr", icon: "lucide:layers" },
      { label: "Visual language", to: "/design/visual-language-evolution", icon: "lucide:eye" },
      { label: "Kit pipeline", to: "/design/kit-pipeline", icon: "lucide:workflow" },
    ],
  },
  {
    label: "01 // Doctrine",
    children: [
      { label: "Doctrine",     to: "/design/tux",                 icon: "lucide:book-open" },
      { label: "Unification plan", to: "/design/unification-plan", icon: "lucide:combine" },
      { label: "Palette",      to: "/design/palette",             icon: "lucide:swatch-book" },
      { label: "Platform awareness", to: "/design/platform-awareness", icon: "lucide:monitor-smartphone" },
      { label: "  · Tauri bindings", to: "/design/tauri-bindings", icon: "lucide:app-window" },
      { label: "Visual language", to: "/design/visual-language-evolution", icon: "lucide:eye" },
      { label: "Roadmap",      to: "/design/roadmap",             icon: "lucide:map" },
    ],
  },
  {
    label: "02 // Foundations",
    children: [
      { label: "Tokens",         to: "/tokens",         icon: "lucide:palette" },
      { label: "Token Playground", to: "/tokens/playground", icon: "lucide:sliders" },
      { label: "Typography",     to: "/typography",     icon: "lucide:type" },
      { label: "Style variants", to: "/style-variants", icon: "lucide:layout-template" },
      { label: "Motion",         to: "/motion",         icon: "lucide:zap" },
      { label: "Icons",          to: "/icons",          icon: "lucide:sparkles" },
      { label: "Logos & brand",  to: "/resources/logos", icon: "lucide:stamp" },
      { label: "Specimens",      to: "/preview",        icon: "lucide:image" },
      { label: "Markdown",       to: "/markdown",       icon: "lucide:file-text" },
      { label: "Accessibility",  to: "/accessibility",  icon: "lucide:accessibility" },
      { label: "Contrast audit", to: "/contrast-audit", icon: "lucide:contrast" },
    ],
  },
  {
    label: "03 // Overview & Doctrine",
    children: [
      { label: "Components doctrine", to: "/design/components", icon: "lucide:book-marked" },
      { label: "All components index", to: "/components", icon: "lucide:blocks" },
    ],
  },
  {
    label: "03a // Actions & Commands",
    children: catalogByCategory("actions"),
  },
  {
    label: "03b // Navigation & Layout",
    children: catalogByCategory("navigation"),
  },
  {
    label: "03c // Data Display & Tables",
    children: catalogByCategory("data-display"),
  },
  {
    label: "03d // Feedback & Alerts",
    children: catalogByCategory("feedback"),
  },
  {
    label: "03e // Forms & Controls",
    children: [
      ...catalogByCategory("forms"),
      { label: "Forms guide",          to: "/forms",                    icon: "lucide:clipboard-list" },
      { label: "  · Text field",     to: "/forms/text-field",         icon: "lucide:type" },
      { label: "  · Select",         to: "/forms/select",             icon: "lucide:list" },
      { label: "  · Choice",         to: "/forms/choice",             icon: "lucide:check-square" },
      { label: "  · Date picker",    to: "/forms/date-picker",        icon: "lucide:calendar" },
      { label: "  · File upload",    to: "/forms/file-upload",        icon: "lucide:upload" },
      { label: "  · Inline validation", to: "/forms/inline-validation", icon: "lucide:check-circle-2" },
      { label: "  · All-in-one demo", to: "/forms/all-in-one",        icon: "lucide:layout-panel-left" },
    ],
  },
  {
    label: "03f // AI & Conversational",
    children: catalogByCategory("ai"),
  },
  {
    label: "03g // Research & Publishing",
    children: catalogByCategory("publishing"),
  },
  {
    label: "04 // Editorial CMS",
    children: [
      { label: "Editorial Desk", to: "/admin", icon: "lucide:layout-dashboard" },
      { label: "Editor Playground", to: "/desk", icon: "lucide:layout-template" },
      { label: "  · Corridor Runbook", to: "/p/corridor-telemetry-runbook", icon: "lucide:file-text" },
      { label: "  · Welcome Article", to: "/p/welcome-to-tux-desk", icon: "lucide:file-text" },
    ],
  },
  {
    label: "04b // Content Governance",
    children: [
      { label: "Document Verification", to: "/admin", icon: "lucide:shield-check" },
      { label: "Review Cadence", to: "/admin", icon: "lucide:calendar-clock" },
      { label: "Reader Issues Triage", to: "/admin", icon: "lucide:life-buoy" },
    ],
  },
  {
    label: "05 // Suites & Kits",
    children: [
      { label: "Kits overview", to: "/examples", icon: "lucide:library" },
      { label: "Compositions doctrine", to: "/design/compositions", icon: "lucide:blocks" },
      { label: "Operational surfaces", to: "/design/ops-surfaces", icon: "lucide:heart-pulse" },
      { label: "  · Atlas audit portal", to: "/examples/atlas", icon: "lucide:shield-check" },
      { label: "  · TTI Code / Forgejo", to: "/examples/forgejo-code", icon: "lucide:git-branch" },
      { label: "  · Comm public portal", to: "/examples/comm-portal", icon: "lucide:globe" },
      { label: "  · MyTTI intranet", to: "/examples/intranet-dashboard", icon: "lucide:building-2" },
      { label: "  · Center landing", to: "/examples/center-landing", icon: "lucide:landmark" },
      { label: "  · Corridor analytics", to: "/examples/corridor-analytics", icon: "lucide:route" },
      { label: "  · Landscape dashboard", to: "/examples/landscape-dashboard", icon: "lucide:map" },
      { label: "  · Ops board", to: "/examples/ops-board", icon: "lucide:heart-pulse" },
      { label: "  · Paper page", to: "/examples/paper-page", icon: "lucide:file-text" },
      { label: "  · Research landing", to: "/examples/research-landing", icon: "lucide:milestone" },
      { label: "  · Sidebar shell", to: "/examples/sidebar-shell", icon: "lucide:panel-left" },
      { label: "  · tti-ai-studio session", to: "/examples/tti-ai-studio-session", icon: "lucide:bot" },
      { label: "  · Error boundaries", to: "/examples/error-pages", icon: "lucide:alert-octagon" },
      { label: "Patterns", to: "/patterns", icon: "lucide:layers-2" },
      { label: "Reference designs", to: "/kits", icon: "lucide:archive" },
    ],
  },
  {
    label: "06 // Overview & Foundations",
    children: [
      { label: "Visualizations overview", to: "/visualizations", icon: "lucide:chart-pie" },
      { label: "Reports overview", to: "/reports", icon: "lucide:file-output" },
      { label: "Chart foundations", to: "/design/chart-foundations", icon: "lucide:area-chart" },
    ],
  },
  {
    label: "06a // Timeseries & Trends",
    children: catalogByVizCategory("timeseries"),
  },
  {
    label: "06b // Geospatial & Maps",
    children: catalogByVizCategory("geospatial"),
  },
  {
    label: "06c // Statistical & Distributions",
    children: catalogByVizCategory("statistical"),
  },
  {
    label: "06d // BI & Analytics Embeds",
    children: catalogByVizCategory("embeds"),
  },
  {
    label: "06e // Publishing & Print Reports",
    children: catalogNav("reports"),
  },
];

// Mobile sidebar toggle — below md, sidebar slides in from the left.
const sidebarOpen = ref(false);
// Desktop sidebar collapse — lets workspace/builder pages use full fluid width.
const desktopSidebarCollapsed = ref(false);

const isFullWidth = computed(() => {
  return Boolean(
    route.meta?.fullWidth ||
    route.path.startsWith('/desk') ||
    route.path.startsWith('/admin')
  );
});

watch(() => route.fullPath, () => {
  sidebarOpen.value = false;
});

// Auto-collapse sidebar on tablet viewports (<1024px) or builder/admin pages on desktop for maximum workspace
// and initialize window listeners for navigation indicators and version dropdown
onMounted(() => {
  if (typeof window !== "undefined") {
    if (window.innerWidth < 1024 || isFullWidth.value) {
      desktopSidebarCollapsed.value = true;
    }
    const saved = window.sessionStorage.getItem("tux-preview-version");
    if (saved && releases.some((r) => r.version === saved)) {
      selectedVersion.value = saved;
      document.documentElement.setAttribute("data-tux-version", saved.replace(/^v/, ""));
    } else {
      document.documentElement.setAttribute("data-tux-version", pkgVersion);
    }
    window.addEventListener("click", handleGlobalClick);
    window.addEventListener("resize", updateNavIndicator);
    nextTick(() => {
      updateNavIndicator();
      setTimeout(updateNavIndicator, 150);
    });
  }
});

onUnmounted(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("click", handleGlobalClick);
    window.removeEventListener("resize", updateNavIndicator);
  }
});

// Global command palette + shortcuts-help overlay. Mounted once at the
// shell so any page benefits from ⌘K and ?. The palette's groups derive
// from actions, tuxCatalog, tuxTokensCatalog, and navTree for universal jump.
const paletteRef = ref<{ open: (initialTab?: string) => void; close: () => void } | null>(null);
const shortcutsHelpRef = ref<{ open: () => void; close: () => void; toggle: () => void } | null>(null);

const { setFramework } = useTuxFramework();

const actionCommands: Command[] = [
  {
    id: "act-toggle-theme",
    label: "Toggle light / dark mode",
    description: "Flip between standard institutional light mode and dark palette",
    icon: "lucide:moon",
    shortcut: "⌘ ⇧ D",
    category: "actions",
    badge: "Theme",
    badgeTone: "brand",
    action: () => {
      colorMode.preference = colorMode.preference === "tti-dark" ? "tti" : "tti-dark";
      toast.info("Theme switched", colorMode.preference === "tti-dark" ? "Active theme: Dark" : "Active theme: Light");
    },
  },
  {
    id: "act-toggle-hc",
    label: "Toggle high-contrast (508 mode)",
    description: "Activate WCAG AAA / Section 508 high-contrast color scheme",
    icon: "lucide:eye",
    category: "actions",
    badge: "A11y",
    badgeTone: "warning",
    action: () => {
      toggleHighContrast();
      toast.info("Accessibility mode", isHighContrast.value ? "508 High-Contrast Active" : "Standard Palette Restored");
    },
  },
  {
    id: "act-framework-vue",
    label: "Switch framework: Vue 3 / Nuxt",
    description: "Target canonical Single File Components (@tti/tti-ux)",
    icon: "lucide:code",
    category: "actions",
    badge: "Framework",
    badgeTone: "brand",
    action: () => setFramework("vue"),
  },
  {
    id: "act-framework-react",
    label: "Switch framework: React JSX",
    description: "Target React component library (@tti/tti-ux-react)",
    icon: "lucide:atom",
    category: "actions",
    badge: "Framework",
    badgeTone: "brand",
    action: () => setFramework("react"),
  },
  {
    id: "act-framework-wc",
    label: "Switch framework: Web Components",
    description: "Target custom elements (<tux-*>) (@tti/tti-ux-elements)",
    icon: "lucide:code-xml",
    category: "actions",
    badge: "Framework",
    badgeTone: "brand",
    action: () => setFramework("wc"),
  },
  {
    id: "act-framework-razor",
    label: "Switch framework: .NET Razor / Blazor",
    description: "Target ASP.NET Core Tag Helpers and Blazor components",
    icon: "lucide:binary",
    category: "actions",
    badge: "Framework",
    badgeTone: "brand",
    action: () => setFramework("razor"),
  },
  {
    id: "act-toggle-sidebar",
    label: "Toggle sidebar mini-rail",
    description: "Expand or collapse the primary navigation sidebar",
    icon: "lucide:panel-left",
    shortcut: "[",
    category: "actions",
    badge: "Layout",
    badgeTone: "neutral",
    action: () => {
      desktopSidebarCollapsed.value = !desktopSidebarCollapsed.value;
    },
  },
  {
    id: "act-copy-url",
    label: "Copy current page URL",
    description: "Copy shareable permalink to clipboard",
    icon: "lucide:link",
    category: "actions",
    badge: "Share",
    badgeTone: "neutral",
    action: async () => {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Copied to clipboard", window.location.href);
      }
    },
  },
];

const tokenCommands: Command[] = tuxTokensCatalog.map((t) => ({
  id: `token-${t.cleanName}`,
  label: t.name,
  description: `${t.value} · ${t.description}`,
  category: "tokens",
  badge: t.category,
  badgeTone: t.category === "brand" ? "brand" : t.category === "ops" ? "ok" : "neutral",
  tokenValue: t.value,
  isColor: t.isColor,
  copyText: `var(${t.name})`,
}));

const componentCommands: Command[] = tuxCatalog
  .filter((c) => c.family === "components")
  .map((c) => ({
    id: `cmp-${c.name.toLowerCase()}`,
    label: c.name,
    description: c.blurb,
    icon: c.icon,
    to: c.to,
    category: "components",
    badge: c.category || "component",
    badgeTone: "brand",
  }));

const docCommands: CommandGroup[] = navTree.map((section) => ({
  heading: section.label,
  category: "docs" as const,
  items: (section.children ?? [])
    .filter((c) => !!c.to)
    .map((c) => ({
      id: `${section.label}-${c.label}`.toLowerCase().replace(/\s+/g, "-"),
      label: c.label,
      icon: c.icon,
      to: c.to,
      category: "docs" as const,
      badge: "Doc",
      badgeTone: "neutral" as const,
    })),
}));

const paletteGroups = computed<CommandGroup[]>(() => [
  {
    heading: "⚡ Quick Actions",
    category: "actions",
    items: actionCommands,
  },
  {
    heading: "🧩 Component Lab (150+ Components)",
    category: "components",
    items: componentCommands,
  },
  {
    heading: "🎨 Design Tokens & Palette",
    category: "tokens",
    items: tokenCommands,
  },
  ...docCommands,
]);

// Help-overlay groups document every shortcut wired below. Keep this
// in sync with the `defineShortcuts` block — if you add a binding,
// add a row here so users can discover it via ?.
const shortcutGroups = [
  {
    heading: "Navigation & Palette",
    items: [
      { keys: ["meta", "k"], label: "Open command palette", description: "Search commands, components, and tokens" },
      { keys: ["/"], label: "Open command palette", description: "GitHub-style alias for ⌘K" },
      { keys: ["?"], label: "Show this shortcuts overlay" },
    ],
  },
  {
    heading: "Command Palette Filters",
    items: [
      { keys: [">"], label: "Quick Actions", description: "Filter to system actions and toggles" },
      { keys: ["@"], label: "Components", description: "Filter to 150+ Component Lab entries" },
      { keys: ["-", "-"], label: "Design Tokens", description: "Filter to tokens, swatches, and CSS variables" },
      { keys: ["#"], label: "Documentation", description: "Filter to guides and architecture records" },
    ],
  },
  {
    heading: "Jump to",
    items: [
      { keys: ["g", "c"], label: "Components catalog", description: "Goes to /components" },
      { keys: ["g", "t"], label: "Tokens", description: "Goes to /tokens" },
      { keys: ["g", "d"], label: "Doctrine", description: "Goes to /design/tux" },
      { keys: ["g", "h"], label: "Home", description: "Goes to /" },
    ],
  },
  {
    heading: "Inside the command palette",
    items: [
      { keys: ["arrowup"], label: "Previous result" },
      { keys: ["arrowdown"], label: "Next result" },
      { keys: ["enter"], label: "Run selected / Copy token" },
      { keys: ["escape"], label: "Close" },
    ],
  },
];

// Use Nuxt UI's defineShortcuts at the shell so every binding gets
// platform-correct meta/ctrl handling and respects "usingInput" (we
// don't want the route-jump sequences firing while someone's typing
// in TuxSearch's filter).
defineShortcuts({
  "/": {
    handler: () => paletteRef.value?.open(),
  },
  "?": {
    handler: () => shortcutsHelpRef.value?.toggle(),
  },
  // Hyphen, not underscore: defineShortcuts uses `_` for combos (modifier
  // held with key, e.g. meta_k) and `-` for sequences (press g, then t —
  // GitHub idiom). Sequences time out after 800ms by default.
  "g-c": () => router.push("/components"),
  "g-t": () => router.push("/tokens"),
  "g-d": () => router.push("/design/tux"),
  "g-h": () => router.push("/"),
});

// Marketing-footer config — mirrors the comm-team's Kadence footer
// for tti.tamu.edu so consumers (Landscape, ai-studio, marcom pages,
// this style guide) inherit the production handles and link
// inventory verbatim. Threads ships as inline SVG since Lucide
// doesn't carry the brand mark yet — see TuxFooter's `svg` field.
const footerSocial = [
  { icon: "lucide:linkedin",  label: "LinkedIn",  href: "https://www.linkedin.com/company/texasa-mtransportationinstitute" },
  { icon: "lucide:facebook",  label: "Facebook",  href: "https://www.facebook.com/ttitamu" },
  { icon: "lucide:instagram", label: "Instagram", href: "https://www.instagram.com/ttitamu/" },
  { icon: "lucide:youtube",   label: "YouTube",   href: "https://www.youtube.com/ttitamu" },
  {
    label: "Threads",
    href: "https://www.threads.com/@ttitamu",
    // Simple Icons "threads" path — CC0. Inline because Lucide
    // lacks a Threads glyph.
    svg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" aria-hidden="true"><path fill="currentColor" d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.598.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291 1.062-.06 2.046.04 2.916.282-.115-.651-.34-1.176-.679-1.567-.485-.561-1.235-.847-2.228-.853h-.028c-.798 0-1.881.221-2.572 1.247l-1.737-1.166c.925-1.373 2.428-2.13 4.32-2.13h.043c3.176.02 5.072 1.97 5.263 5.36q.18.077.347.158c2.318 1.09 3.609 2.96 3.633 5.27.024 2.7-1.27 4.85-3.836 6.55-1.945 1.21-4.46 1.79-7.18 1.79zm1.359-9.93q-.41 0-.823.025c-1.265.073-2.058.692-2.005 1.586.06 1.022 1.151 1.499 2.179 1.491 1.061-.034 2.105-.405 2.205-2.602q-.769-.235-1.556-.5z"/></svg>',
  },
  { icon: "lucide:twitter",   label: "X (Twitter)", href: "https://twitter.com/TTITAMU" },
];

// Two columns mirror the Kadence source: TTI-owned URLs for the
// Policies set; canonical state URLs for State Resources. The only
// non-Kadence extra is the internal WCAG audit page — it's
// style-guide-specific (production tti.tamu.edu doesn't expose an
// accessibility audit), but valuable surfacing it here for
// designers/auditors landing on the system docs.
const footerColumns = [
  {
    heading: "State Resources",
    links: [
      { label: "The State of Texas",          href: "https://www.texas.gov/" },
      { label: "Texas Homeland Security",     href: "https://gov.texas.gov/" },
      { label: "Texas Veterans Portal",       href: "https://veterans.portal.texas.gov/" },
      { label: "State Expenditure Database",  href: "https://comptroller.texas.gov/transparency/" },
      { label: "Statewide Search",            href: "https://www.tsl.texas.gov/trail/index.html" },
      { label: "State Auditor's Office Hotline", href: "https://sao.fraud.texas.gov/" },
    ],
  },
  {
    heading: "Policies",
    links: [
      { label: "Risk, Fraud & Misconduct Hotline", href: "https://secure.ethicspoint.com/domain/media/en/gui/19681/index.html" },
      { label: "Digital Accessibility",       href: "https://tti.tamu.edu/notices-policies/accessibility-policy/" },
      { label: "Site Policies",               href: "https://tti.tamu.edu/notices-policies/" },
      { label: "Open Records Policy",         href: "https://tti.tamu.edu/notices-policies/open-records-policy/" },
      { label: "Statutorily Required Reports", href: "https://tti.tamu.edu/notices-policies/statereq-reports/" },
      { label: "TTI Rules",                   href: "https://tti.tamu.edu/notices-policies/rules/" },
      { label: "Veterans",                    href: "https://tti.tamu.edu/notices-policies/veterans/" },
      { label: "Equal Opportunity",           href: "https://tti.tamu.edu/jobs/commitment-to-equal-opportunity/" },
      { label: "Jobs",                        href: "https://tti.tamu.edu/jobs/" },
      { label: "Accessibility (WCAG 2.2 Level AAA)", to: "/accessibility" },
    ],
  },
];

// Copyright line formatted to match the Kadence footer ("© Copyright
// {year} … (TTI)") and linked to the institutional copyright-
// statement page.
const copyrightLine = `© Copyright ${new Date().getFullYear()} Texas A&M Transportation Institute (TTI)`;
</script>

<template>
  <UApp>
    <!-- Global command palette + keyboard-shortcut overlay. Mounted once;
         the shell-level defineShortcuts block above drives both. -->
    <ClientOnly>
      <TuxCommandPalette
        ref="paletteRef"
        :groups="paletteGroups"
      />
      <TuxShortcutsHelp
        ref="shortcutsHelpRef"
        :groups="shortcutGroups"
      />
      <!-- Toast host — dogfoods the v1.8.0 TuxStatusToast; every page can
           fire via useTuxToast() (the /components/status-toast demo does). -->
      <TuxStatusToast />
      <!-- Global reading-progress return-to-top button -->
      <TuxScrollTop />
    </ClientOnly>

    <!-- Standalone full-viewport pages (layout: false) bypass the style guide shell -->
    <template v-if="route.meta?.layout === false">
      <NuxtPage />
    </template>

    <div v-else class="min-h-screen flex flex-col bg-surface-eggshell text-text-primary">
      <!-- Accessible Skip to Content Link (WCAG 2.4.1) -->
      <a href="#main-content" class="tux-skip-link">
        Skip to main content
      </a>

      <!-- Historical Visual Era Simulation Notice Banner -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div
          v-if="selectedVersion !== `v${pkgVersion}`"
          class="tux-archive-banner bg-amber-500/10 dark:bg-amber-500/15 border-b border-amber-500/30 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 text-text-primary sticky top-0 z-40 backdrop-blur-md"
        >
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center justify-center px-1.5 py-0.5 rounded-none bg-amber-600 text-white font-mono font-bold text-[10px]">
              {{ selectedVersion }}
            </span>
            <span>
              Previewing visual era tokens for <strong>TUX {{ selectedVersion }}</strong> ({{ activeRelease.title }} · {{ activeRelease.era }}).
            </span>
          </div>
          <div class="flex items-center gap-3">
            <NuxtLink :to="activeRelease.route" class="text-text-secondary hover:text-brand-primary underline text-xs">
              Changelog notes
            </NuxtLink>
            <button
              type="button"
              class="px-2.5 py-1 text-xs font-mono font-bold bg-brand-primary text-text-inverse rounded-none hover:bg-brand-primary-deep transition-colors cursor-pointer border-0 shadow-xs"
              @click="selectVersion(releases[0])"
            >
              Restore v{{ pkgVersion }} (Latest)
            </button>
          </div>
        </div>
      </Transition>

      <header
        class="tti-shell-header sticky top-0 z-30"
        role="banner"
      >
        <div class="px-2 sm:px-4 lg:px-3 xl:px-6 py-2 sm:py-3 flex items-center gap-1 sm:gap-2 lg:gap-1.5 xl:gap-4">
          <UButton
            icon="lucide:menu"
            color="neutral"
            variant="ghost"
            size="sm"
            class="md:hidden"
            aria-label="Open navigation"
            @click="sidebarOpen = !sidebarOpen;"
          />

          <!-- Dogfood: the style guide uses its own TuxIdentity for the
               header lockup. `level="center"` puts the institutional
               line above the product name, the same rhythm consuming
               apps will use. `logoSize` is shrunk a hair (32px) so the
               header keeps the same vertical density it had before. -->
          <div class="flex items-center gap-2 sm:gap-3 shrink-0">
            <TuxIdentity
              level="center"
              superhead="Texas A&M Transportation Institute"
              name="tti-ux"
              href="/"
              :logo-size="32"
            />
            <!-- Version Switcher Dropdown -->
            <div ref="versionDropdownRef" class="relative hidden sm:inline-block shrink-0">
              <button
                type="button"
                class="tux-version-switcher-btn inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-semibold bg-surface-sunken hover:bg-surface-raised border border-surface-border hover:border-brand-primary/40 text-text-secondary hover:text-text-primary transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-brand-primary whitespace-nowrap"
                :aria-expanded="versionMenuOpen"
                aria-haspopup="true"
                aria-label="Select system release version"
                @click="versionMenuOpen = !versionMenuOpen"
              >
                <span
                  class="w-1.5 h-1.5 rounded-full shrink-0"
                  :class="selectedVersion === `v${pkgVersion}` ? 'bg-status-ok' : 'bg-status-warning animate-pulse'"
                />
                <span class="font-bold text-text-primary">{{ selectedVersion }}</span>
                <span
                  class="text-[9px] uppercase tracking-wide font-bold px-1 rounded hidden 2xl:inline"
                  :class="selectedVersion === `v${pkgVersion}` ? 'text-brand-primary bg-wash-brand-12' : 'text-amber-700 dark:text-amber-300 bg-amber-500/15'"
                >
                  {{ selectedVersion === `v${pkgVersion}` ? 'latest' : 'simulated' }}
                </span>
                <UIcon name="lucide:chevron-down" class="w-3.5 h-3.5 text-text-muted transition-transform duration-200 shrink-0" :class="{ 'rotate-180': versionMenuOpen }" />
              </button>

              <!-- Dropdown Popover Menu -->
              <Transition
                enter-active-class="transition duration-150 ease-out"
                enter-from-class="opacity-0 translate-y-1 scale-95"
                enter-to-class="opacity-100 translate-y-0 scale-100"
                leave-active-class="transition duration-100 ease-in"
                leave-from-class="opacity-100 translate-y-0 scale-100"
                leave-to-class="opacity-0 translate-y-1 scale-95"
              >
                <div
                  v-if="versionMenuOpen"
                  class="tux-version-menu absolute left-0 top-full mt-1.5 w-64 bg-surface-raised border border-surface-border shadow-xl z-50 py-1.5 focus:outline-none"
                  role="menu"
                  aria-orientation="vertical"
                >
                  <div class="px-3 py-1.5 border-b border-surface-border text-[10px] font-mono uppercase tracking-widest text-text-muted flex items-center justify-between">
                    <span>TUX Release History</span>
                    <span class="text-brand-primary font-bold">SemVer 2.0</span>
                  </div>

                  <div class="py-1">
                    <button
                      v-for="ver in releases"
                      :key="ver.version"
                      type="button"
                      class="w-full text-left px-3 py-1.5 flex items-center justify-between text-xs hover:bg-surface-sunken transition-colors cursor-pointer group"
                      :class="ver.version === selectedVersion ? 'text-brand-primary font-bold bg-wash-brand-8' : 'text-text-secondary'"
                      @click="selectVersion(ver)"
                    >
                      <div class="flex items-center gap-2">
                        <UIcon
                          :name="ver.version === selectedVersion ? 'lucide:check-circle' : 'lucide:circle'"
                          class="w-3.5 h-3.5"
                          :class="ver.version === selectedVersion ? 'text-brand-primary' : 'text-text-muted group-hover:text-text-secondary'"
                        />
                        <span class="font-mono">{{ ver.version }}</span>
                        <span v-if="ver.badge" class="text-[9px] font-mono px-1 py-0.2 rounded" :class="ver.badgeClass">
                          {{ ver.badge }}
                        </span>
                      </div>
                      <span class="text-[11px] text-text-muted group-hover:text-text-secondary">{{ ver.title }}</span>
                    </button>
                  </div>

                  <div class="border-t border-surface-border my-1" />

                  <NuxtLink
                    to="/changelog"
                    class="w-full text-left px-3 py-1.5 flex items-center gap-2 text-xs text-text-secondary hover:text-brand-primary hover:bg-surface-sunken transition-colors no-underline"
                    @click="versionMenuOpen = false"
                  >
                    <UIcon name="lucide:scroll-text" class="w-3.5 h-3.5" />
                    <span>View Full Changelog</span>
                  </NuxtLink>
                  <a
                    href="https://github.com/ttitamu/tti-ux/releases"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="w-full text-left px-3 py-1.5 flex items-center justify-between text-xs text-text-secondary hover:text-brand-primary hover:bg-surface-sunken transition-colors no-underline"
                    @click="versionMenuOpen = false"
                  >
                    <div class="flex items-center gap-2">
                      <UIcon name="lucide:github" class="w-3.5 h-3.5" />
                      <span>Release Archives</span>
                    </div>
                    <UIcon name="lucide:external-link" class="w-3 h-3 text-text-muted" />
                  </a>
                </div>
              </Transition>
            </div>
          </div>

          <!-- Mobile/Compact Area Switcher (< lg) -->
          <div class="lg:hidden relative flex items-center ml-0.5 sm:ml-2 shrink-0">
            <select
              v-model="activeAreaId"
              class="text-[11px] sm:text-xs font-bold uppercase tracking-wider bg-surface-sunken border border-surface-border rounded-md px-1 sm:px-2 py-1 text-brand-primary focus:outline-none focus:border-brand-primary font-mono cursor-pointer max-w-[95px] sm:max-w-none truncate"
              aria-label="Select work area"
              @change="navigateTo(currentArea.to)"
            >
              <option v-for="area in highLevelAreas" :key="area.id" :value="area.id">
                {{ area.shortLabel || area.label }}
              </option>
            </select>
          </div>

          <!-- Desktop High-Level Area Switcher (lg+) with sliding indicator -->
          <nav
            ref="navContainerRef"
            class="tux-top-nav hidden lg:flex items-center gap-0.5 xl:gap-1.5 ml-0.5 xl:ml-3 relative shrink-0"
            aria-label="Primary areas"
          >
            <!-- Sliding active pill highlight -->
            <div
              class="tux-nav-sliding-pill"
              :style="navPillStyle"
              aria-hidden="true"
            />

            <!-- Sliding active underline indicator -->
            <div
              class="tux-nav-sliding-underline"
              :style="navUnderlineStyle"
              aria-hidden="true"
            />

            <NuxtLink
              v-for="area in highLevelAreas"
              :key="area.id"
              :ref="(el) => setNavLinkRef(area.id, el)"
              :to="area.to"
              class="tux-top-nav-link"
              :class="{ 'tux-top-nav-link--active': currentArea.id === area.id }"
              @click="activeAreaId = area.id; showAllAreasInSidebar = false"
            >
              <UIcon :name="area.icon" class="w-3.5 h-3.5 mr-1 shrink-0" />
              <span class="hidden 2xl:inline">{{ area.label }}</span>
              <span class="2xl:hidden">{{ area.shortLabel || area.label }}</span>
            </NuxtLink>
          </nav>

          <div class="flex-1 min-w-[8px]" />

          <!-- Multi-language code preference switcher -->
          <div class="hidden md:inline-flex items-center">
            <TuxFrameworkSwitcher mode="compact" class="mr-1 sm:mr-2 shrink-0" />
          </div>

          <!-- Utility Cluster with Quick Search Trigger -->
          <TuxUtilityCluster current="tux" class="shrink-0">
            <template #search>
              <button
                type="button"
                class="tux-header-search-btn inline-flex"
                aria-label="Open command palette (Press ⌘K or /)"
                title="Open command palette (Press ⌘K or /)"
                @click="paletteRef?.open()"
              >
                <UIcon name="lucide:search" class="w-3.5 h-3.5 shrink-0" />
                <span class="tux-header-search-label hidden 2xl:inline">Quick search...</span>
                <span class="tux-header-search-label hidden xl:inline 2xl:hidden">Search...</span>
                <kbd class="tux-header-search-kbd hidden sm:inline shrink-0">⌘K</kbd>
              </button>
            </template>
          </TuxUtilityCluster>
        </div>
      </header>

      <div class="flex flex-1 min-h-0 min-w-0">
        <!-- Sidebar backdrop (mobile only) -->
        <div
          v-if="sidebarOpen"
          class="fixed inset-0 z-10 bg-black/40 md:hidden"
          aria-hidden="true"
          @click="sidebarOpen = false"
        />

        <!-- Sidebar — fixed-positioned on mobile (slides in from left
             with the menu toggle), static-positioned on desktop. We use
             `md:transform-none` (rather than `md:translate-x-0`) so the
             desktop sidebar doesn't carry a `transform` declaration —
             a transformed static element creates a stacking context that
             paints over the sticky header (z-index doesn't apply to
             static elements, so the header's z-30 wouldn't help).
             The chrome (border, surface, slide-in) is provided here; the
             inner `<TuxDocsSidebar>` carries the navigation landmark,
             collapsible groups, active-trail highlighting, filter, and
             sessionStorage-persisted collapse state. The outer is a
             plain <div> to avoid a duplicate "navigation" landmark. -->
        <!-- Sticky on desktop so the sidebar stays pinned to the
             viewport as the page scrolls — otherwise the flex row's
             stretch makes the sidebar as tall as the main content,
             and you scroll past it (and the tapered hairline rides
             down into the footer). `md:self-start` opts this child
             out of the flex parent's default stretch so sticky can
             actually take effect, and `md:max-h-[calc(100vh-57px)]`
             caps the sidebar at the viewport minus the 57px sticky
             header. `overflow-x-hidden` on the inner scroll wrapper
             clips any horizontal overflow from long item labels
             (the leaf links also truncate with ellipsis, but this is
             a belt-and-braces guard so a runaway label can never
             trigger a horizontal scrollbar). -->
        <!-- Sidebar — Reactive Dual-Mode (w-80 expanded, w-16 collapsed) -->
        <div
          :class="[
            'tti-shell-sidebar bg-surface-raised flex-shrink-0 transition-all duration-200 border-r border-surface-border relative',
            desktopSidebarCollapsed ? 'w-16' : 'w-72 lg:w-80',
            'md:sticky md:top-[57px] md:self-start md:h-[calc(100vh-57px)] md:max-h-[calc(100vh-57px)] md:flex md:flex-col md:overflow-hidden',
            'md:translate-x-0 md:transform-none',
            'fixed inset-y-0 left-0 top-[57px] z-20 h-[calc(100vh-57px)] flex flex-col overflow-hidden',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
          ]"
        >
          <TuxReactiveSidebar
            :sections="activeSidebarSections"
            :all-sections="navTree"
            :show-all="showAllAreasInSidebar"
            :collapsed="desktopSidebarCollapsed"
            :active-area-title="currentArea.label"
            :active-area-icon="currentArea.icon"
            :search="true"
            @update:show-all="showAllAreasInSidebar = $event"
            @toggle-collapse="desktopSidebarCollapsed = !desktopSidebarCollapsed"
          />
        </div>

        <main id="main-content" class="flex-1 min-w-0" tabindex="-1">
          <div
            :class="[
              isFullWidth
                ? 'w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6'
                : 'w-full max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8',
            ]"
          >
            <!-- Global Breadcrumbs for Deep Navigation Trail -->
            <div
              v-if="shouldShowBreadcrumbs"
              class="tux-shell-breadcrumbs mb-4 sm:mb-6"
            >
              <TuxBreadcrumbs :trail="breadcrumbTrail" />
            </div>

            <NuxtLayout>
              <NuxtPage />
            </NuxtLayout>
          </div>
        </main>
      </div>

      <!-- Dogfood: real TuxFooter. The
           high-contrast toggle is an opt-in accessibility control, not
           a chrome theme — it lives in the footer's #preferences slot so
           users don't get pushed through it during casual theme
           switching (see ADR-0006). -->
      <TuxFooter
        :columns="footerColumns"
        :social="footerSocial"
        tagline=""
        :copyright-text="copyrightLine"
        copyright-href="https://tti.tamu.edu/notices-policies/copyright-statement/"
      >
        <template #preferences>
          <ClientOnly>
            <button
              type="button"
              :aria-pressed="isHighContrast"
              :title="
                isHighContrast
                  ? 'High-contrast mode is on — click to exit'
                  : 'Enable WCAG AAA high-contrast mode (accessibility)'
              "
              @click="toggleHighContrast"
            >
              <UIcon name="lucide:accessibility" class="w-3.5 h-3.5" />
              <span>
                {{ isHighContrast ? "Exit high-contrast" : "High-contrast mode" }}
              </span>
            </button>
            <template #fallback>
              <span class="inline-flex items-center gap-1">
                <UIcon name="lucide:accessibility" class="w-3.5 h-3.5" />
                <span>High-contrast mode</span>
              </span>
            </template>
          </ClientOnly>
        </template>
      </TuxFooter>
    </div>
  </UApp>
</template>

<style scoped>
/* Tapered hairlines — mirrors the pattern shipped in tti-ai-studio
   (studio-shell): a 1px line drawn via a pseudo-element with a
   linear-gradient background that fades to transparent at both ends
   and holds the border color through the middle. Reads as a soft
   ruled line rather than a hard corner-to-corner stroke, giving the
   shell a more modern, sleek feel. The 18%/82% stops match the
   ai-studio values for cross-product consistency. */
.tti-shell-header {
  position: sticky;
  background-color: var(--surface-raised);
  transition: background-color var(--motion-fast) var(--ease-standard), border-color var(--motion-fast) var(--ease-standard);
}

[data-theme="tti-dark"] .tti-shell-header {
  background-color: var(--surface-page);
}

.tti-shell-header::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 3px;
  background: linear-gradient(
    to right,
    var(--spectrum-maroon) 0%,
    var(--spectrum-maroon) 20%,
    var(--spectrum-blue) 20%,
    var(--spectrum-blue) 40%,
    var(--spectrum-teal) 40%,
    var(--spectrum-teal) 60%,
    var(--spectrum-green) 60%,
    var(--spectrum-green) 80%,
    var(--spectrum-gold) 80%,
    var(--spectrum-gold) 100%
  );
  z-index: 10;
}

.tti-shell-header::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background: linear-gradient(
    to right,
    transparent 0%,
    var(--surface-border) 18%,
    var(--surface-border) 82%,
    transparent 100%
  );
  pointer-events: none;
}

.tux-nav-sliding-pill {
  position: absolute;
  top: 0;
  left: 0;
  border-radius: var(--radius-sm);
  background: color-mix(in srgb, var(--brand-primary) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--brand-primary) 18%, transparent);
  pointer-events: none;
  z-index: 1;
  transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1),
              width 0.28s cubic-bezier(0.16, 1, 0.3, 1),
              height 0.28s cubic-bezier(0.16, 1, 0.3, 1),
              opacity 0.15s ease;
  will-change: transform, width;
}

[data-theme="tti-dark"] .tux-nav-sliding-pill {
  background: color-mix(in srgb, var(--brand-accent) 18%, transparent);
  border-color: color-mix(in srgb, var(--brand-accent) 22%, transparent);
}

.tux-nav-sliding-underline {
  position: absolute;
  bottom: -9px;
  left: 0;
  height: 2px;
  background: var(--brand-accent);
  border-radius: var(--radius-full);
  box-shadow: 0 0 8px color-mix(in srgb, var(--brand-accent) 50%, transparent);
  pointer-events: none;
  z-index: 2;
  transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1),
              width 0.28s cubic-bezier(0.16, 1, 0.3, 1),
              opacity 0.15s ease;
  will-change: transform, width;
}

@media (prefers-reduced-motion: reduce) {
  .tux-nav-sliding-pill,
  .tux-nav-sliding-underline {
    transition: none !important;
  }
}

.tux-top-nav-link {
  position: relative;
  z-index: 3;
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.25rem;
  font-family: var(--font-bold);
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: var(--text-secondary);
  border-radius: var(--radius-sm);
  transition: color var(--motion-fast) var(--ease-standard);
  text-decoration: none;
  background: transparent;
  white-space: nowrap;
  flex-shrink: 0;
}

@media (min-width: 1280px) {
  .tux-top-nav-link {
    padding: 0.3125rem 0.6rem;
    font-size: 0.75rem;
    letter-spacing: 0.04em;
  }
}

@media (min-width: 1536px) {
  .tux-top-nav-link {
    padding: 0.375rem 0.75rem;
  }
}

.tux-top-nav-link:hover {
  color: var(--text-primary);
}

.tux-top-nav-link--active {
  color: var(--brand-primary);
}

[data-theme="tti-dark"] .tux-top-nav-link--active {
  color: var(--brand-accent);
}

.tux-version-switcher-btn {
  font-feature-settings: "tnum";
}

.tux-version-menu {
  border-radius: var(--radius-md);
}

.tux-header-search-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.3125rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-muted);
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: all var(--motion-fast) var(--ease-standard);
}

@media (min-width: 1280px) {
  .tux-header-search-btn {
    gap: 0.5rem;
    padding: 0.3125rem 0.625rem;
  }
}

/* Collapse long institutional superhead on screens under 2xl (1536px) to avoid header crowding */
@media (max-width: 1535px) {
  .tti-shell-header :deep(.tux-identity__superhead) {
    display: none;
  }
}

.tux-header-search-btn:hover {
  color: var(--text-primary);
  border-color: var(--brand-primary);
  background: var(--surface-raised);
}

.tux-header-search-kbd {
  padding: 0.125rem 0.375rem;
  font-family: var(--font-mono);
  font-size: 0.625rem;
  font-weight: 600;
  border-radius: var(--radius-sm);
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  color: var(--text-primary);
}

.tti-shell-sidebar::after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width: 1px;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    var(--surface-border) 18%,
    var(--surface-border) 82%,
    transparent 100%
  );
  pointer-events: none;
}

/* Version chip next to the header lockup. Monospace + brand maroon
   to read as "this is a system token, not editorial copy". The
   weight is heavier than the address copy so it pops against the
   wordmark without competing with the lockup itself. */
.tux-version-pill {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.4375rem;
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 600;
  line-height: 1.2;
  color: var(--brand-primary);
  background: color-mix(in srgb, var(--brand-primary) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--brand-primary) 22%, transparent);
  border-radius: var(--radius-sm);
  letter-spacing: 0.01em;
  white-space: nowrap;
}

[data-theme="tti-dark"] .tux-version-pill {
  color: var(--brand-accent);
  background: color-mix(in srgb, var(--brand-accent) 12%, transparent);
  border-color: color-mix(in srgb, var(--brand-accent) 22%, transparent);
}

/* Accessible Skip to Main Content Link (WCAG 2.4.1) */
.tux-skip-link {
  position: fixed;
  top: -9999px;
  left: 1rem;
  z-index: 1000;
  background-color: var(--brand-primary);
  color: var(--neutral-0);
  padding: 0.625rem 1.25rem;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  font-weight: 700;
  text-decoration: none;
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-lg);
  border: 2px solid var(--neutral-0);
  transition: top var(--motion-fast) var(--ease-standard);
}

.tux-skip-link:focus {
  top: 1rem;
  outline: 3px solid var(--focus-ring-outer);
  outline-offset: 2px;
  box-shadow: var(--shadow-focus);
}

/* Shell breadcrumb container spacing */
.tux-shell-breadcrumbs {
  padding-bottom: 0.5rem;
}
</style>
