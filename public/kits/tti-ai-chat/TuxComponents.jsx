/* global React */
const { useState } = React;

// ─── TuxSectionHeader ───────────────────────────────────────────────────────
function TuxSectionHeader({ level = 2, children, subtitle }) {
  const Tag = `h${level}`;
  const sizes = { 1: "1.5rem", 2: "1.125rem", 3: "0.875rem" };
  return (
    <header style={{ marginBottom: 24 }}>
      <Tag
        style={{
          display: "inline-block",
          textTransform: "uppercase",
          fontWeight: 700,
          letterSpacing: "var(--tracking-wider)",
          fontSize: sizes[level],
          paddingBottom: 6,
          borderBottom: "2px solid var(--brand-primary)",
          margin: 0,
          color: "var(--text-primary)",
        }}
      >
        {children}
      </Tag>
      {subtitle ? (
        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: 8 }}>
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}

// ─── TuxPageHeader ──────────────────────────────────────────────────────────
function TuxPageHeader({ eyebrow, title, children }) {
  return (
    <header style={{ marginBottom: 28 }}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h1 className="heading--bold" style={{ fontSize: "2rem", fontWeight: 700, margin: 0 }}>
        {title}
      </h1>
      {children ? (
        <div style={{ marginTop: 12, maxWidth: 640, color: "var(--text-secondary)", lineHeight: 1.6 }}>
          {children}
        </div>
      ) : null}
    </header>
  );
}

// ─── TuxButton ──────────────────────────────────────────────────────────────
function TuxButton({ intent = "primary", icon, children, onClick, disabled, type = "button" }) {
  const base = {
    fontFamily: "var(--font-sans)",
    fontSize: "0.875rem",
    fontWeight: 500,
    padding: "8px 16px",
    borderRadius: "var(--radius-md)",
    cursor: disabled ? "not-allowed" : "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    border: "1px solid transparent",
    transition: "background 180ms ease-out, color 180ms ease-out",
    opacity: disabled ? 0.5 : 1,
  };
  const intents = {
    primary: { background: "var(--brand-primary)", color: "#fff" },
    secondary: { background: "transparent", color: "var(--text-primary)", borderColor: "var(--surface-border)" },
    ghost: { background: "transparent", color: "var(--text-primary)" },
    destructive: { background: "transparent", color: "var(--color-error)", borderColor: "var(--color-error)" },
  };
  const [hover, setHover] = useState(false);
  const hoverStyles = {
    primary: { background: "#4d001f" },
    secondary: { background: "var(--surface-sunken)" },
    ghost: { background: "color-mix(in srgb, var(--brand-primary) 6%, transparent)" },
    destructive: { background: "var(--color-error)", color: "#fff" },
  };
  const style = { ...base, ...intents[intent], ...(hover && !disabled ? hoverStyles[intent] : {}) };
  return (
    <button
      type={type}
      style={style}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {icon ? <LucideIcon name={icon} size={14} /> : null}
      {children}
    </button>
  );
}

// ─── TuxBadge ───────────────────────────────────────────────────────────────
function TuxBadge({ tier, status, kind = "default", count, children }) {
  const mode = tier ? "tier" : status ? "status" : "kind";
  const base = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: "0.75rem",
    fontWeight: 600,
    padding: "3px 10px",
    borderRadius: 9999,
    lineHeight: 1.4,
  };
  const styles = {
    tier: {
      public: { background: "color-mix(in srgb, var(--color-info) 12%, transparent)", color: "var(--color-info)" },
      internal: { background: "var(--surface-sunken)", color: "var(--text-secondary)" },
      sensitive: { background: "color-mix(in srgb, var(--brand-primary) 12%, transparent)", color: "var(--brand-primary)" },
      restricted: { background: "var(--brand-primary)", color: "#fff" },
    },
    status: {
      completed: { background: "color-mix(in srgb, var(--color-success) 12%, transparent)", color: "var(--color-success)" },
      running: { background: "color-mix(in srgb, var(--brand-accent) 18%, transparent)", color: "#6a3e00" },
      failed: { background: "color-mix(in srgb, var(--color-error) 12%, transparent)", color: "var(--color-error)" },
      queued: { background: "var(--surface-sunken)", color: "var(--text-secondary)" },
    },
  };
  const dot = {
    completed: "var(--color-success)",
    running: "var(--brand-accent)",
    failed: "var(--color-error)",
    queued: "var(--text-muted)",
  };
  let style = base;
  if (mode === "tier") style = { ...base, ...styles.tier[tier] };
  else if (mode === "status") style = { ...base, ...styles.status[status] };
  else if (kind === "tag") style = { ...base, background: "transparent", border: "1px solid var(--surface-border)", color: "var(--text-secondary)", fontFamily: "var(--font-mono)", fontWeight: 400 };
  else style = { ...base, background: "var(--surface-sunken)", color: "var(--text-secondary)" };
  return (
    <span style={style}>
      {mode === "status" ? (
        status === "running" ? (
          <LucideIcon name="loader" size={10} spin />
        ) : (
          <span style={{ width: 6, height: 6, borderRadius: 9999, background: dot[status], display: "inline-block" }} />
        )
      ) : null}
      {children || tier || status}
      {count != null ? <span style={{ marginLeft: 2 }}>{count}</span> : null}
    </span>
  );
}

// ─── TuxCard ────────────────────────────────────────────────────────────────
function TuxCard({ to, onClick, children, padded = true }) {
  const [hover, setHover] = useState(false);
  const linked = !!(to || onClick);
  const pad = padded ? 24 : 0;
  const baseStatic = {
    border: "2px solid var(--brand-primary)",
    borderRadius: "var(--radius-lg)",
    background: "var(--surface-raised)",
    padding: pad,
  };
  const baseLinked = {
    ...baseStatic,
    display: "block",
    textDecoration: "none",
    color: "inherit",
    cursor: "pointer",
    position: "relative",
    transition: "transform 350ms cubic-bezier(0.2,0.8,0.2,1), box-shadow 350ms cubic-bezier(0.2,0.8,0.2,1), background 250ms",
    transform: hover ? "translate(6px, -6px)" : "translate(0,0)",
    boxShadow: hover ? "-6px 6px 0 0 var(--brand-primary)" : "none",
    background: hover
      ? "color-mix(in srgb, var(--brand-primary) 3%, var(--surface-raised))"
      : "var(--surface-raised)",
  };
  if (linked) {
    return (
      <a
        href={to || "#"}
        onClick={(e) => {
          if (onClick) {
            e.preventDefault();
            onClick(e);
          }
        }}
        style={baseLinked}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 18,
            right: 18,
            color: "var(--brand-primary)",
            transform: hover ? "translate(2px,-2px)" : "translate(0,0)",
            opacity: hover ? 1 : 0.55,
            transition: "all 250ms",
          }}
        >
          <LucideIcon name="arrow-up-right" size={22} />
        </span>
        {children}
      </a>
    );
  }
  return <div style={baseStatic}>{children}</div>;
}

// ─── TuxAlert ───────────────────────────────────────────────────────────────
function TuxAlert({ variant = "info", title, description, icon, children }) {
  const variantMap = {
    note: { bg: "var(--surface-sunken)", bar: "var(--text-muted)", color: "var(--text-primary)", icon: "pencil" },
    tip: { bg: "#f3efff", bar: "#7c3aed", color: "#4c1d95", icon: "lightbulb" },
    info: { bg: "#e6f2f4", bar: "var(--color-info)", color: "#134e5a", icon: "info" },
    important: { bg: "color-mix(in srgb, var(--brand-primary) 5%, var(--surface-raised))", bar: "var(--brand-primary)", color: "var(--text-primary)", icon: "bookmark" },
    success: { bg: "color-mix(in srgb, var(--color-success) 8%, var(--surface-raised))", bar: "var(--color-success)", color: "#2d4523", icon: "check-circle" },
    warning: { bg: "#fdf6e3", bar: "var(--brand-accent)", color: "#6a3e00", icon: "triangle-alert" },
    danger: { bg: "#fdecec", bar: "var(--color-error)", color: "#7a1f1f", icon: "circle-x" },
    compliance: { bg: "var(--brand-primary)", bar: "transparent", color: "#fff", icon: "shield-alert" },
  };
  const v = variantMap[variant];
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        padding: "12px 14px",
        borderRadius: "var(--radius-md)",
        background: v.bg,
        borderLeft: v.bar === "transparent" ? "none" : `4px solid ${v.bar}`,
        color: v.color,
        fontSize: "0.875rem",
        lineHeight: 1.5,
      }}
    >
      <LucideIcon name={icon || v.icon} size={18} />
      <div style={{ flex: 1 }}>
        {title ? <div style={{ fontWeight: 700, marginBottom: description || children ? 4 : 0 }}>{title}</div> : null}
        {description ? <div style={{ opacity: 0.92 }}>{description}</div> : null}
        {children}
      </div>
    </div>
  );
}

// ─── LucideIcon — minimal SVG set ───────────────────────────────────────────
function LucideIcon({ name, size = 16, spin = false }) {
  const paths = {
    "arrow-up-right": "M7 17L17 7M7 7h10v10",
    "arrow-right": "M5 12h14M13 5l7 7-7 7",
    "arrow-left": "M19 12H5M11 5l-7 7 7 7",
    play: "M6 3l14 9-14 9V3z",
    pause: "M6 4h4v16H6zM14 4h4v16h-4z",
    plus: "M12 5v14M5 12h14",
    search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4.3-4.3",
    pencil: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z",
    info: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8v0M12 11v5",
    lightbulb: "M9 18h6M10 22h4M9 14a6 6 0 1 1 6 0c-1 1-1 2-1 3H10c0-1 0-2-1-3z",
    bookmark: "M5 3h14v18l-7-4-7 4V3z",
    "check-circle": "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM8 12l3 3 5-6",
    check: "M4 12l5 5L20 6",
    "triangle-alert": "M12 3l10 18H2L12 3zM12 9v5M12 17v0",
    "circle-x": "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM9 9l6 6M15 9l-9 6",
    "shield-alert": "M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6l8-3zM12 8v4M12 16v0",
    folder: "M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z",
    "folder-search": "M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6zM14 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM16 16l2 2",
    home: "M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1V11z",
    database: "M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3v12c0 1.7-3.6 3-8 3s-8-1.3-8-3V6zM4 6c0 1.7 3.6 3 8 3s8-1.3 8-3M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3",
    settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15l1.5 1-2 3.5-2-.5a8 8 0 0 1-1.5.8l-.3 1.7h-4l-.3-1.7a8 8 0 0 1-1.5-.8l-2 .5-2-3.5 1.5-1a8 8 0 0 1 0-2l-1.5-1 2-3.5 2 .5a8 8 0 0 1 1.5-.8l.3-1.7h4l.3 1.7a8 8 0 0 1 1.5.8l2-.5 2 3.5-1.5 1a8 8 0 0 1 0 2z",
    menu: "M3 6h18M3 12h18M3 18h18",
    bell: "M6 8a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6zM10 21a2 2 0 0 0 4 0",
    user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c1-4 4-6 8-6s7 2 8 6",
    download: "M12 3v12M7 10l5 5 5-5M4 21h16",
    loader: "M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2 2M16.4 16.4l2 2M5.6 18.4l2-2M16.4 7.6l2-2",
    x: "M6 6l12 12M18 6L6 18",
    filter: "M3 5h18l-7 9v6l-4-2v-4L3 5z",
    "file-text": "M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6zM14 3v6h6M8 13h8M8 17h6",
    "chevron-right": "M9 6l6 6-6 6",
    clock: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2",
  };
  const d = paths[name] || paths.info;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={spin ? { animation: "tux-spin 0.9s linear infinite" } : {}}
    >
      <path d={d} />
    </svg>
  );
}

Object.assign(window, {
  TuxSectionHeader,
  TuxPageHeader,
  TuxButton,
  TuxBadge,
  TuxCard,
  TuxAlert,
  LucideIcon,
});
