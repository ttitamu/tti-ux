/* global React, PageShell, AGGIE_CATALOG, LucideIcon */
/*
 * AggieAIStudio.jsx — INF-3 batch: new TUX components for AI + dashboard surfaces.
 *
 *   Adaptive card — structured response card for AI/agent output, structured
 *                   tool results, and chat-embedded information. Sits inside
 *                   conversational surfaces (tti-ai-studio) or as inline
 *                   results in research apps. Distinct from `card-groups` (an
 *                   editorial card collection) and from `callouts` (inline body
 *                   highlight): adaptive-card is content rendered FROM tool
 *                   output or an agent action, not authored editorial copy.
 *   Metric tile   — single-statistic dashboard tile. Title + 1–3 data points
 *                   with descriptive labels + optional trend delta + optional
 *                   CTA. Distinct from `factoids` (a hero row of giant numbers
 *                   for marketing) and `stat-comparison` (side-by-side hero
 *                   stats): metric-tile is small enough to tile in a
 *                   dashboard grid, with hover affordance and a "view details"
 *                   drill-in.
 *
 * Lineage (INF-3):
 *   • Adaptive card — anatomy informed by Microsoft Teams Adaptive Cards
 *                     (16 frames: Anatomy, Behavior, Starter-Cards,
 *                     Inspiration-Gallery). Teams ships a "container with
 *                     stacked elements + action row" pattern; TUX adopts
 *                     the structure and swaps in: TTI editorial typography
 *                     for the title, JetBrains Mono for inline numbers,
 *                     maroon ghost-link CTA, signature-rule under the title
 *                     on hero variants.
 *   • Metric tile   — anatomy informed by Teams Data-visualization Number
 *                     chart (25 frames in the Data-visualization page).
 *                     Teams uses a 296×304 card with title, 1–3 stacked
 *                     numbers, and a "View details" link. TUX adopts the
 *                     anatomy and adds: trend delta with arrow + tone,
 *                     tabular-nums numerics, JetBrains Mono labels, maroon
 *                     primary numbers.
 *
 * Identity stays TUX: maroon brand, Work Sans 700 caps for labels, JetBrains
 * Mono for numerics, two-ring focus. Never lift Segoe UI or Teams purple.
 *
 * Helper prefix: AC (AICard). Local helpers — never import a generic
 * SectionLabel/Box/Spec from another batch (Babel scope collisions).
 */

// ════════════════════════════════════════════════════════════════════════
// Shared helpers (AC prefix)
// ════════════════════════════════════════════════════════════════════════

function ACBox({ dark = false, label, padded = true, children }) {
  return (
    <div style={{ border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", overflow: "hidden", marginBottom: 16 }}>
      <div style={{
        padding: "7px 14px", fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em",
        color: dark ? "rgba(255,255,255,0.8)" : "var(--text-muted)", fontFamily: "var(--font-body-bold)",
        background: dark ? "var(--brand-primary)" : "var(--surface-sunken)",
        borderBottom: "1px solid var(--surface-border)", display: "flex", justifyContent: "space-between",
      }}>
        <span>{label}</span>
        <span style={{ fontFamily: "var(--font-mono)", fontWeight: 500, opacity: 0.7 }}>on {dark ? "dark" : "light"}</span>
      </div>
      <div style={{ padding: padded ? 32 : 0, background: dark ? "var(--brand-primary)" : "var(--surface-page)" }}>{children}</div>
    </div>
  );
}

function ACSectionLabel({ children }) {
  return (
    <h3 style={{
      fontFamily: "var(--font-body)", fontSize: "0.72rem", fontWeight: 600, textTransform: "lowercase",
      letterSpacing: "0.10em", color: "var(--text-muted)", margin: "32px 0 12px",
    }}>{children}</h3>
  );
}

function ACSpecRow({ children }) {
  return (
    <div style={{ marginTop: 28, padding: "14px 18px", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 18 }}>
      {children}
    </div>
  );
}

function ACSpec({ label, value, note }) {
  return (
    <div>
      <div style={{ fontFamily: "var(--font-body-bold)", fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontWeight: 500, fontSize: "0.82rem", color: "var(--text-primary)", marginBottom: 4 }}>{value}</div>
      {note ? <div style={{ fontFamily: "var(--font-body)", fontSize: "0.74rem", color: "var(--text-muted)", lineHeight: 1.4 }}>{note}</div> : null}
    </div>
  );
}

function ACIntro({ children }) {
  return (
    <div style={{ borderLeft: "3px solid var(--brand-primary)", padding: "8px 16px", margin: "0 0 28px", background: "var(--surface-raised)", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0" }}>
      <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: "0.9rem", lineHeight: 1.55, color: "var(--text-primary)", maxWidth: 760 }}>{children}</p>
    </div>
  );
}

const TONE_COLORS = {
  default: { accent: "var(--brand-primary)", tint: "transparent",                  icon: "sparkles" },
  info:    { accent: "var(--brand-primary)", tint: "rgba(92, 0, 37, 0.05)",        icon: "info" },
  success: { accent: "var(--color-success)", tint: "rgba(45, 107, 47, 0.06)",      icon: "check-circle-2" },
  warning: { accent: "var(--color-warning)", tint: "rgba(220, 138, 25, 0.06)",     icon: "alert-triangle" },
  error:   { accent: "var(--color-error)",   tint: "rgba(176, 28, 32, 0.06)",      icon: "alert-octagon" },
};

// ════════════════════════════════════════════════════════════════════════
// ADAPTIVE CARD primitive
// ════════════════════════════════════════════════════════════════════════

function AdaptiveCard({ tone = "default", source, sourceIcon = "bot", timestamp, title, body, attachments, primaryAction, secondaryActions, dark = false, accentBar = true }) {
  const t = TONE_COLORS[tone];
  return (
    <div style={{
      width: 420,
      background: dark ? "#1A0A12" : "#FFFFFF",
      border: dark ? "1px solid rgba(255,255,255,0.10)" : "1px solid var(--surface-border)",
      borderLeft: accentBar ? `3px solid ${t.accent}` : (dark ? "1px solid rgba(255,255,255,0.10)" : "1px solid var(--surface-border)"),
      borderRadius: "var(--radius-md)",
      boxShadow: dark ? "0 0 2px rgba(0,0,0,0.4), 0 4px 12px rgba(0,0,0,0.25)" : "0 0 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)",
      overflow: "hidden",
      fontFamily: "var(--font-body)",
    }}>
      {(source || timestamp) ? (
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "10px 16px",
          borderBottom: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid var(--surface-border)",
          background: dark ? "rgba(255,255,255,0.04)" : t.tint,
        }}>
          <div style={{
            width: 22, height: 22, borderRadius: "50%",
            background: dark ? "rgba(221,172,55,0.18)" : "rgba(92,0,37,0.08)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <LucideIcon name={sourceIcon} size={13} color={dark ? "var(--brand-accent)" : "var(--brand-primary)"} strokeWidth={2.25} />
          </div>
          <span style={{
            fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.74rem",
            textTransform: "uppercase", letterSpacing: "0.10em",
            color: dark ? "rgba(255,255,255,0.85)" : "var(--text-primary)",
          }}>{source}</span>
          {timestamp ? (
            <>
              <span style={{ color: dark ? "rgba(255,255,255,0.45)" : "var(--text-muted)" }}>·</span>
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: "0.72rem", fontWeight: 500,
                color: dark ? "rgba(255,255,255,0.65)" : "var(--text-muted)",
              }}>{timestamp}</span>
            </>
          ) : null}
          <button aria-label="More actions" style={{
            marginLeft: "auto", background: "transparent", border: "none",
            cursor: "pointer", padding: 4, borderRadius: 4,
            color: dark ? "rgba(255,255,255,0.65)" : "var(--text-muted)",
          }}>
            <LucideIcon name="more-horizontal" size={16} />
          </button>
        </div>
      ) : null}

      <div style={{ padding: 16 }}>
        {title ? (
          <div style={{
            fontFamily: "var(--font-display, var(--font-body-bold))",
            fontWeight: 700, fontSize: "1.05rem", lineHeight: 1.25,
            color: dark ? "#FFFFFF" : "var(--text-primary)",
            marginBottom: body ? 8 : 0,
            letterSpacing: "-0.005em",
          }}>{title}</div>
        ) : null}
        {body ? (
          <div style={{
            fontSize: "0.86rem", lineHeight: 1.55,
            color: dark ? "rgba(255,255,255,0.82)" : "var(--text-primary)",
          }}>{body}</div>
        ) : null}
      </div>

      {attachments && attachments.length ? (
        <div style={{
          padding: "0 16px 12px",
          display: "flex", flexDirection: "column", gap: 6,
        }}>
          {attachments.map((a, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "8px 10px",
              background: dark ? "rgba(255,255,255,0.05)" : "var(--surface-sunken)",
              borderRadius: "var(--radius-sm)",
              border: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid var(--surface-border)",
            }}>
              <LucideIcon name={a.icon || "file"} size={14} color={dark ? "var(--brand-accent)" : "var(--brand-primary)"} />
              <span style={{
                fontFamily: "var(--font-mono)", fontWeight: 500, fontSize: "0.76rem",
                color: dark ? "rgba(255,255,255,0.85)" : "var(--text-primary)",
                flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>{a.name}</span>
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: "0.7rem",
                color: dark ? "rgba(255,255,255,0.55)" : "var(--text-muted)",
              }}>{a.meta}</span>
            </div>
          ))}
        </div>
      ) : null}

      {(primaryAction || (secondaryActions && secondaryActions.length)) ? (
        <div style={{
          padding: "10px 16px",
          borderTop: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid var(--surface-border)",
          background: dark ? "rgba(255,255,255,0.02)" : "var(--surface-raised)",
          display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
        }}>
          {primaryAction ? (
            <button onClick={primaryAction.onClick} style={{
              padding: "7px 14px",
              background: dark ? "var(--brand-accent)" : "var(--brand-primary)",
              color: dark ? "var(--brand-primary)" : "#FFFFFF",
              border: "none", borderRadius: "var(--radius-sm)", cursor: "pointer",
              fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.72rem",
              letterSpacing: "0.10em", textTransform: "uppercase",
            }}>{primaryAction.label}</button>
          ) : null}
          {(secondaryActions || []).map((a, i) => (
            <button key={i} onClick={a.onClick} style={{
              padding: "6px 12px", background: "transparent",
              color: dark ? "var(--brand-accent)" : "var(--brand-primary)",
              border: "none", borderRadius: "var(--radius-sm)", cursor: "pointer",
              fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.72rem",
              letterSpacing: "0.10em", textTransform: "uppercase",
            }}>{a.label}</button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// METRIC TILE primitive
// ════════════════════════════════════════════════════════════════════════

function MetricTile({ title, points, trend, cta, dark = false, info }) {
  // points = [{ value, label, unit? }, ...]  (1–3 items)
  return (
    <div style={{
      width: 296,
      background: dark ? "rgba(255,255,255,0.04)" : "#FFFFFF",
      border: dark ? "1px solid rgba(255,255,255,0.10)" : "1px solid var(--surface-border)",
      borderRadius: "var(--radius-md)",
      padding: 20,
      boxShadow: dark ? "none" : "0 1px 2px rgba(0,0,0,0.04), 0 2px 6px rgba(0,0,0,0.05)",
      display: "flex", flexDirection: "column", gap: 14,
      fontFamily: "var(--font-body)",
      transition: "transform 160ms ease-out, box-shadow 160ms ease-out",
      cursor: cta ? "pointer" : "default",
    }}
    onMouseEnter={(e) => { if (cta) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = dark ? "0 4px 16px rgba(0,0,0,0.3)" : "0 1px 2px rgba(0,0,0,0.04), 0 6px 16px rgba(0,0,0,0.10)"; } }}
    onMouseLeave={(e) => { if (cta) { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = dark ? "none" : "0 1px 2px rgba(0,0,0,0.04), 0 2px 6px rgba(0,0,0,0.05)"; } }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <div style={{
          fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.72rem",
          textTransform: "uppercase", letterSpacing: "0.12em",
          color: dark ? "rgba(255,255,255,0.78)" : "var(--text-muted)",
          flex: 1, minWidth: 0,
        }}>{title}</div>
        {info ? (
          <button aria-label={`About ${title}`} style={{
            width: 18, height: 18, borderRadius: "50%",
            background: "transparent", border: dark ? "1px solid rgba(255,255,255,0.32)" : "1px solid var(--surface-border)",
            color: dark ? "rgba(255,255,255,0.65)" : "var(--text-muted)",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            padding: 0, flexShrink: 0,
          }}>
            <LucideIcon name="info" size={10} />
          </button>
        ) : null}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: points.length > 1 ? 14 : 4 }}>
        {points.map((p, i) => (
          <div key={i}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{
                fontFamily: "var(--font-mono)", fontWeight: 500,
                fontSize: points.length === 1 ? "2.4rem" : "1.4rem",
                lineHeight: 1, fontVariantNumeric: "tabular-nums",
                color: dark ? "var(--brand-accent)" : "var(--brand-primary)",
                letterSpacing: "-0.02em",
              }}>{p.value}</span>
              {p.unit ? (
                <span style={{
                  fontFamily: "var(--font-mono)", fontWeight: 500, fontSize: "0.82rem",
                  color: dark ? "rgba(255,255,255,0.65)" : "var(--text-muted)",
                }}>{p.unit}</span>
              ) : null}
              {p.delta && i === 0 ? (
                <span style={{
                  marginLeft: "auto",
                  display: "inline-flex", alignItems: "center", gap: 4,
                  fontFamily: "var(--font-mono)", fontWeight: 500, fontSize: "0.76rem",
                  color: p.delta.direction === "up"
                    ? (p.delta.good === false ? "var(--color-error)" : "var(--color-success)")
                    : (p.delta.good === true ? "var(--color-success)" : "var(--color-error)"),
                  fontVariantNumeric: "tabular-nums",
                }}>
                  <LucideIcon name={p.delta.direction === "up" ? "trending-up" : "trending-down"} size={12} />
                  {p.delta.value}
                </span>
              ) : null}
            </div>
            <div style={{
              marginTop: 4, fontSize: "0.78rem",
              color: dark ? "rgba(255,255,255,0.72)" : "var(--text-muted)",
              lineHeight: 1.4,
            }}>{p.label}</div>
          </div>
        ))}
      </div>

      {cta ? (
        <a href={cta.href || "#"} onClick={(e) => { e.preventDefault(); cta.onClick?.(); }} style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          marginTop: "auto",
          paddingTop: 10,
          borderTop: dark ? "1px solid rgba(255,255,255,0.10)" : "1px solid var(--surface-border)",
          fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.72rem",
          textTransform: "uppercase", letterSpacing: "0.10em",
          color: dark ? "var(--brand-accent)" : "var(--brand-primary)",
          textDecoration: "none",
        }}>
          {cta.label}
          <LucideIcon name="arrow-right" size={12} />
        </a>
      ) : null}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// ADAPTIVE CARD PAGE
// ════════════════════════════════════════════════════════════════════════

function AdaptiveCardPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "adaptive-card");
  return (
    <PageShell item={item}>
      <ACIntro>
        Structured response card for AI agents and tool output, rendered inside
        conversational surfaces (tti-ai-studio) or as inline results in research apps.
        Composes from <strong>five slots</strong>: source header (sender + timestamp + menu),
        title, body (rich content), attachments (file/data references), and an action
        row. Tones map the alerts vocabulary — use sparingly; most cards are{" "}
        <em>default</em> (no accent).
      </ACIntro>

      <ACSectionLabel>1 · Minimal — title + body + action</ACSectionLabel>
      <ACBox label="agent reply with single primary action">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
          <AdaptiveCard
            source="Corridor Agent" sourceIcon="bot" timestamp="just now"
            title="3 corridors match your criteria"
            body="I-35 (Hays–Travis), US 290 (Travis–Hays), and SH 71 (Bastrop). Want me to load the comparison view?"
            primaryAction={{ label: "Load comparison", onClick: () => {} }}
            secondaryActions={[{ label: "Refine", onClick: () => {} }]}
          />
        </div>
      </ACBox>

      <ACSectionLabel>2 · With source + attachments — tool output</ACSectionLabel>
      <ACBox label="header + body + attachments + actions">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
          <AdaptiveCard
            source="Export tool" sourceIcon="download" timestamp="2 min ago" tone="info"
            title="Export ready — 3 files"
            body="Your dataset has been compiled and is ready to download. Files expire after 24 hours."
            attachments={[
              { name: "corridors-2026-q2.csv",  meta: "2.4 MB", icon: "file-spreadsheet" },
              { name: "methodology.pdf",        meta: "180 KB", icon: "file-text" },
              { name: "crosswalk.json",         meta: "12 KB",  icon: "braces" },
            ]}
            primaryAction={{ label: "Download all", onClick: () => {} }}
            secondaryActions={[{ label: "Share link", onClick: () => {} }, { label: "Dismiss", onClick: () => {} }]}
          />
        </div>
      </ACBox>

      <ACSectionLabel>3 · Tones — success · warning · error</ACSectionLabel>
      <ACBox label="status-coded results">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
          <AdaptiveCard
            source="Validation" sourceIcon="check-check" timestamp="just now" tone="success"
            title="All 1,240 rows passed validation"
            body="Mileposts in range · AADT non-negative · timestamps monotonic. Ready to publish."
            primaryAction={{ label: "Publish dataset", onClick: () => {} }}
            secondaryActions={[{ label: "View report", onClick: () => {} }]}
          />
          <AdaptiveCard
            source="Validation" sourceIcon="alert-triangle" timestamp="just now" tone="warning"
            title="38 rows flagged for review"
            body="Suspicious AADT values (>2× corridor average). They won't block publish but should be eyeballed first."
            primaryAction={{ label: "Open review", onClick: () => {} }}
            secondaryActions={[{ label: "Ignore", onClick: () => {} }]}
          />
          <AdaptiveCard
            source="Connection" sourceIcon="alert-octagon" timestamp="just now" tone="error"
            title="Couldn't reach TxDOT API"
            body="3 retries failed. The dashboard is using cached data from this morning. Maps will not update until reconnected."
            primaryAction={{ label: "Retry now", onClick: () => {} }}
            secondaryActions={[{ label: "Work offline", onClick: () => {} }]}
          />
        </div>
      </ACBox>

      <ACSectionLabel>4 · On dark — embedded in dark surfaces</ACSectionLabel>
      <ACBox dark label="info + success · on dark">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
          <AdaptiveCard dark
            source="Corridor Agent" sourceIcon="bot" timestamp="just now"
            title="3 corridors match your criteria"
            body="I-35 (Hays–Travis), US 290 (Travis–Hays), and SH 71 (Bastrop)."
            primaryAction={{ label: "Load comparison", onClick: () => {} }}
            secondaryActions={[{ label: "Refine", onClick: () => {} }]}
          />
          <AdaptiveCard dark
            source="Export tool" sourceIcon="download" timestamp="2 min ago" tone="info"
            title="Export ready"
            body="Files expire in 24 hours."
            attachments={[
              { name: "corridors-2026-q2.csv", meta: "2.4 MB", icon: "file-spreadsheet" },
            ]}
            primaryAction={{ label: "Download", onClick: () => {} }}
          />
        </div>
      </ACBox>

      <ACSpecRow>
        <ACSpec label="Width"      value="420px" note="Fixed; body wraps. Min 320 in narrow chat columns." />
        <ACSpec label="Slots"      value="header · title · body · attachments · actions" note="All optional; render any combination." />
        <ACSpec label="Accent bar" value="3px left" note="Tone color on left edge; default tone uses brand maroon." />
        <ACSpec label="Source"     value="icon + name + time" note="Source name in Work Sans 700 caps; time in JetBrains Mono." />
        <ACSpec label="Title face" value="font-display"  note="Style-aware — uses the variant's display face." />
        <ACSpec label="Lineage"    value="Teams Adaptive Cards" note="Anatomy only · TUX type, maroon, signature." />
      </ACSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// METRIC TILE PAGE
// ════════════════════════════════════════════════════════════════════════

function MetricTilePage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "metric-tile");
  return (
    <PageShell item={item}>
      <ACIntro>
        Small dashboard tile for a single statistic — title + 1–3 data points +
        optional trend delta + optional drill-in CTA. Tile-sized for grid composition
        (typically 4-up across a 1280px dashboard width). Distinct from{" "}
        <code>factoids</code>, which is a hero row of giant numbers for marketing
        landing pages, and <code>stat-comparison</code>, which is the side-by-side
        before/after treatment. Use metric-tile for operational dashboards.
      </ACIntro>

      <ACSectionLabel>1 · Single point — the canonical KPI tile</ACSectionLabel>
      <ACBox label="title + one number + label + delta + CTA">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
          <MetricTile
            title="Active corridors"
            points={[{ value: "324", label: "Across 12 districts", delta: { direction: "up", value: "+8 this month", good: true } }]}
            cta={{ label: "View all", onClick: () => {} }}
          />
          <MetricTile
            title="Crashes YTD"
            points={[{ value: "1,847", label: "Statewide · severity 3+", delta: { direction: "down", value: "−6%", good: true } }]}
            cta={{ label: "Open report", onClick: () => {} }}
          />
          <MetricTile
            title="Pavement condition score"
            points={[{ value: "72.4", unit: "/100", label: "Weighted by AADT", delta: { direction: "down", value: "−1.2 vs Q1", good: false } }]}
            info
            cta={{ label: "Drill in", onClick: () => {} }}
          />
        </div>
      </ACBox>

      <ACSectionLabel>2 · Multiple points — stacked metrics under one title</ACSectionLabel>
      <ACBox label="two + three data points">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
          <MetricTile
            title="Operations"
            points={[
              { value: "98.7", unit: "%", label: "Uptime · this month" },
              { value: "42", label: "Active alerts" },
            ]}
            cta={{ label: "Open dashboard", onClick: () => {} }}
          />
          <MetricTile
            title="Research output · YTD"
            points={[
              { value: "127", label: "Publications" },
              { value: "38", label: "Datasets released" },
              { value: "12", label: "Active grants" },
            ]}
            cta={{ label: "View library", onClick: () => {} }}
          />
        </div>
      </ACBox>

      <ACSectionLabel>3 · No CTA — display-only metric</ACSectionLabel>
      <ACBox label="static stat with info button">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
          <MetricTile
            title="Coverage area"
            points={[{ value: "268,597", unit: "mi²", label: "Texas · TxDOT centerline miles" }]}
            info
          />
          <MetricTile
            title="Survey rhythm"
            points={[{ value: "30", unit: "days", label: "Median response window" }]}
            info
          />
        </div>
      </ACBox>

      <ACSectionLabel>4 · Dashboard grid — 4 tiles across</ACSectionLabel>
      <ACBox label="canonical dashboard composition · 4-up" padded={false}>
        <div style={{ padding: 24, background: "var(--surface-sunken)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
          <MetricTile title="Active corridors"  points={[{ value: "324",  label: "12 districts",        delta: { direction: "up",   value: "+8",   good: true } }]} cta={{ label: "View", onClick: () => {} }} />
          <MetricTile title="Crashes YTD"       points={[{ value: "1,847", label: "Statewide · sev 3+", delta: { direction: "down", value: "−6%",  good: true } }]} cta={{ label: "View", onClick: () => {} }} />
          <MetricTile title="Pavement score"    points={[{ value: "72.4", unit: "/100", label: "Weighted by AADT", delta: { direction: "down", value: "−1.2", good: false } }]} cta={{ label: "View", onClick: () => {} }} />
          <MetricTile title="Open work orders"  points={[{ value: "284",  label: "Across all districts", delta: { direction: "up",   value: "+21", good: false } }]} cta={{ label: "View", onClick: () => {} }} />
        </div>
      </ACBox>

      <ACSectionLabel>5 · On dark — dashboards over a maroon shell</ACSectionLabel>
      <ACBox dark label="three tiles · on dark">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
          <MetricTile dark title="Active corridors" points={[{ value: "324",  label: "12 districts",       delta: { direction: "up",   value: "+8",  good: true } }]}  cta={{ label: "View", onClick: () => {} }} />
          <MetricTile dark title="Crashes YTD"      points={[{ value: "1,847", label: "Statewide · sev 3+", delta: { direction: "down", value: "−6%", good: true } }]} cta={{ label: "View", onClick: () => {} }} />
          <MetricTile dark title="Pavement score"   points={[{ value: "72.4", unit: "/100", label: "Weighted by AADT" }]} info />
        </div>
      </ACBox>

      <ACSpecRow>
        <ACSpec label="Width"       value="296px (default)"   note="Grid-friendly; tiles flex inside a 4-column grid." />
        <ACSpec label="Number face" value="JetBrains Mono 500" note="Tabular-nums; primary number in maroon (gold on dark)." />
        <ACSpec label="Hero size"   value="2.4rem · single"    note="Single-point tiles get hero scale; multi-point tiles use 1.4rem." />
        <ACSpec label="Delta"       value="arrow + tone"       note="Good-direction prop chooses tone — up isn't always good." />
        <ACSpec label="Hover"       value="lift 2px · shadow"  note="Only when CTA present — read as a link target." />
        <ACSpec label="Lineage"     value="Teams Data-viz Number chart" note="Anatomy only · TUX type and maroon." />
      </ACSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Export to window
// ════════════════════════════════════════════════════════════════════════

window.AdaptiveCardPage = AdaptiveCardPage;
window.MetricTilePage = MetricTilePage;
