/* global React, ReactDOM, lucide, AggieHeader, AggieSidebar, AggiePage, AGGIE_CATALOG */
/*
 * App.jsx — top-level shell. Wires together header + sidebar + page router.
 *
 * Route state is held in the URL hash (#page-id) so deep links work and
 * reloads preserve position.
 */

const { useState, useEffect } = React;

// ─── LucideIcon — tiny wrapper over window.lucide for the other files ──────
function LucideIcon({ name, size = 16, color = "currentColor", strokeWidth = 1.75, style }) {
  const icons = (window.lucide && window.lucide.icons) || {};
  const key = name
    .split("-")
    .map((p, i) => (i === 0 ? p : p.charAt(0).toUpperCase() + p.slice(1)))
    .join("");
  const PascalKey = key.charAt(0).toUpperCase() + key.slice(1);
  const spec = icons[PascalKey] || icons[name] || null;
  if (!spec) {
    return <span style={{ display: "inline-block", width: size, height: size, background: "color-mix(in srgb, currentColor 20%, transparent)", borderRadius: 2, ...style }} title={`[missing icon: ${name}]`} />;
  }

  // Lucide 0.469 ships icons as array specs:
  //   ["svg", {defaultAttrs}, [["path", {d: "..."}], ["circle", {cx:...}], ...]]
  // Or sometimes just the children array: [[tag, attrs], ...]
  // Handle both shapes defensively.
  let children = [];
  if (Array.isArray(spec)) {
    // Shape A: ["svg", attrs, children]
    if (typeof spec[0] === "string" && spec[0] === "svg") {
      children = spec[2] || [];
    } else {
      // Shape B: bare array of child specs
      children = spec;
    }
  } else if (spec && Array.isArray(spec.children)) {
    children = spec.children;
  } else if (spec && spec.toSvg) {
    // Older lucide versions — fall back to the string API
    const svg = spec.toSvg({ width: size, height: size, stroke: color, "stroke-width": strokeWidth });
    return <span style={{ display: "inline-flex", alignItems: "center", ...style }} dangerouslySetInnerHTML={{ __html: svg }} />;
  }

  const renderChild = (child, i) => {
    if (!Array.isArray(child)) return null;
    const [tag, attrs = {}] = child;
    // Convert kebab-case SVG attrs to React style where needed
    const p = {};
    for (const k in attrs) {
      if (k === "stroke-width") p.strokeWidth = attrs[k];
      else if (k === "stroke-linecap") p.strokeLinecap = attrs[k];
      else if (k === "stroke-linejoin") p.strokeLinejoin = attrs[k];
      else if (k === "fill-rule") p.fillRule = attrs[k];
      else if (k === "clip-rule") p.clipRule = attrs[k];
      else p[k] = attrs[k];
    }
    return React.createElement(tag, { key: i, ...p });
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: "inline-block", verticalAlign: "middle", ...style }}
    >
      {children.map(renderChild)}
    </svg>
  );
}

window.LucideIcon = LucideIcon;

// ─── App ───────────────────────────────────────────────────────────────────
// Three themes ship in colors_and_type.css: tti (light), tti-dark, tti-hc.
// We persist the choice in localStorage so reloads keep it.
const THEME_STORAGE_KEY = "aggieux:theme";
const THEMES = [
  { id: "tti",      label: "Light",         icon: "sun"      },
  { id: "tti-dark", label: "Dark",          icon: "moon"     },
  { id: "tti-hc",   label: "High contrast", icon: "contrast" },
];

function App() {
  const [route, setRoute] = useState(() => (location.hash || "#intro").slice(1) || "intro");
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem(THEME_STORAGE_KEY) || "tti"; }
    catch (e) { return "tti"; }
  });

  // Apply data-theme to <html> so every component re-themes via tokens.
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem(THEME_STORAGE_KEY, theme); } catch (e) { /* ignore */ }
  }, [theme]);

  useEffect(() => {
    const onHash = () => setRoute((location.hash || "#intro").slice(1) || "intro");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const navigate = (id) => {
    setRoute(id);
    history.replaceState(null, "", `#${id}`);
    const main = document.getElementById("aggie-main");
    if (main) main.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AggieHeader theme={theme} onSetTheme={setTheme} themes={THEMES} />
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <AggieSidebar route={route} onNavigate={navigate} />
        <main id="aggie-main" style={{ flex: 1, overflowY: "auto", background: "var(--surface-page)", color: "var(--text-primary)", transition: "background 200ms, color 200ms" }}>
          <AggiePage id={route} />
        </main>
      </div>
    </div>
  );
}

// ─── Boot ──────────────────────────────────────────────────────────────────
(function boot() {
  const start = () => {
    if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(<App />);
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
