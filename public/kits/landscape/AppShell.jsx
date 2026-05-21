/* global React, TuxSectionHeader, TuxPageHeader, TuxButton, TuxBadge, TuxCard, TuxAlert, LucideIcon */
const { useState } = React;

function Sidebar({ route, onNavigate }) {
  const nav = [
    { id: "home", label: "Overview", icon: "home" },
    { id: "scans", label: "Scans", icon: "folder-search" },
    { id: "classifiers", label: "Classifiers", icon: "filter" },
    { id: "indices", label: "Indices", icon: "database" },
    { id: "settings", label: "Settings", icon: "settings" },
  ];
  return (
    <aside
      style={{
        width: 220,
        background: "var(--surface-raised)",
        borderRight: "1px solid var(--surface-border)",
        padding: "20px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 22,
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 6px" }}>
        <img src="../../assets/logo.svg" alt="" style={{ width: 28, height: 28 }} />
        <div>
          <div style={{ fontSize: "0.875rem", fontWeight: 700, letterSpacing: "0.04em" }}>tti-ux</div>
          <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "var(--tracking-wider)" }}>
            PECAN · data index
          </div>
        </div>
      </div>
      <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {nav.map((n) => {
          const active = route === n.id;
          return (
            <a
              key={n.id}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onNavigate(n.id);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 10px",
                borderRadius: "var(--radius-md)",
                fontSize: "0.875rem",
                fontWeight: active ? 600 : 500,
                color: active ? "var(--brand-primary)" : "var(--text-primary)",
                background: active
                  ? "color-mix(in srgb, var(--brand-primary) 8%, transparent)"
                  : "transparent",
                textDecoration: "none",
                borderLeft: active ? "3px solid var(--brand-primary)" : "3px solid transparent",
                paddingLeft: active ? 7 : 10,
              }}
            >
              <LucideIcon name={n.icon} size={16} />
              {n.label}
            </a>
          );
        })}
      </nav>
      <div style={{ marginTop: "auto", borderTop: "1px solid var(--surface-border)", paddingTop: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.8rem" }}>
          <div style={{ width: 28, height: 28, borderRadius: 9999, background: "var(--brand-primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 700 }}>
            AG
          </div>
          <div>
            <div style={{ fontWeight: 600 }}>A. Guevara</div>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>IT · TTI</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function TopBar({ title }) {
  return (
    <div
      style={{
        height: 56,
        borderBottom: "1px solid var(--surface-border)",
        background: "var(--surface-raised)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "var(--tracking-wider)", color: "var(--text-muted)" }}>
          pecan
        </span>
        <span style={{ color: "var(--text-muted)" }}>/</span>
        <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>{title}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ position: "relative" }}>
          <input
            placeholder="Search paths, classifiers, scan IDs…"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.8rem",
              width: 320,
              padding: "7px 10px 7px 32px",
              border: "1px solid var(--surface-border)",
              borderRadius: "var(--radius-md)",
              background: "var(--surface-page)",
            }}
          />
          <span style={{ position: "absolute", left: 10, top: 8, color: "var(--text-muted)" }}>
            <LucideIcon name="search" size={14} />
          </span>
        </div>
        <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)" }}>
          <LucideIcon name="bell" size={18} />
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { Sidebar, TopBar });
