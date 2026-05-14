/* global React, PageShell, AGGIE_CATALOG, LucideIcon */
/*
 * AggieLoadMore.jsx — Batch A.2: Progressive disclosure for long lists.
 *
 *   Result count    — "Showing X of Y" header strip with sort + view
 *                     controls. Sits at the top of any list view.
 *
 *   Load more       — Explicit button at the bottom of a list. The
 *                     library's preferred pattern: keyboard reachable,
 *                     screen-reader announceable, footer-friendly.
 *
 *   Infinite scroll — Sentinel-driven auto-load. Used sparingly — feed
 *                     pages and search results. Always paired with a
 *                     "Back to top" affordance and a final-page sentinel.
 *
 * Helper prefix: LM (Load More).
 */

const { useState: _lmUseState } = React;

// ════════════════════════════════════════════════════════════════════════
// Shared helpers (LM prefix)
// ════════════════════════════════════════════════════════════════════════

function LMBox({ dark = false, label, padded = true, children }) {
  return (
    <div style={{ border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", overflow: "hidden", marginBottom: 16 }}>
      <div style={{
        padding: "7px 14px", fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em",
        color: dark ? "rgba(255,255,255,0.85)" : "var(--text-muted)", fontFamily: "var(--font-body-bold)",
        background: dark ? "var(--brand-primary)" : "var(--surface-sunken)",
        borderBottom: "1px solid var(--surface-border)", display: "flex", justifyContent: "space-between",
      }}>
        <span>{label}</span>
        <span style={{ fontFamily: "var(--font-mono)", fontWeight: 500, opacity: 0.7 }}>on {dark ? "dark" : "light"}</span>
      </div>
      <div style={{ padding: padded ? 28 : 0, background: dark ? "var(--brand-primary)" : "var(--surface-page)" }}>{children}</div>
    </div>
  );
}

function LMSectionLabel({ children }) {
  return (
    <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 12, marginTop: 28 }}>{children}</div>
  );
}

function LMSpecRow({ children }) {
  return (
    <div style={{ marginTop: 28, padding: "14px 18px", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>{children}</div>
  );
}

function LMSpec({ label, value, note }) {
  return (
    <div>
      <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--brand-primary)", marginTop: 3, fontWeight: 500 }}>{value}</div>
      {note && <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 2, lineHeight: 1.4 }}>{note}</div>}
    </div>
  );
}

function LMIntro({ children }) {
  return (
    <div style={{ padding: "16px 20px", marginBottom: 28, background: "color-mix(in srgb, var(--brand-primary) 5%, transparent)", borderLeft: "3px solid var(--brand-primary)", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0", fontSize: "0.92rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>
      {children}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Result count strip
// ════════════════════════════════════════════════════════════════════════

function LMResultCount({ shown = 24, total = 187, query = "freight corridor", showSort = true, showView = true }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "var(--surface-raised)", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)" }}>
      <div style={{ fontSize: "0.86rem", color: "var(--text-secondary)" }}>
        Showing <strong style={{ color: "var(--text-primary)" }}>1–{shown}</strong> of <strong style={{ color: "var(--text-primary)" }}>{total.toLocaleString()}</strong>
        {query && <> for "<strong style={{ color: "var(--brand-primary)", fontStyle: "italic" }}>{query}</strong>"</>}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {showSort && (
          <label style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.8rem", color: "var(--text-secondary)" }}>
            Sort
            <select style={{ padding: "5px 8px", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-sm)", background: "var(--surface-page)", fontSize: "0.8rem", fontFamily: "inherit", color: "var(--text-primary)" }}>
              <option>Most recent</option>
              <option>Most relevant</option>
              <option>A → Z</option>
            </select>
          </label>
        )}
        {showView && (
          <div role="radiogroup" aria-label="View" style={{ display: "inline-flex", padding: 2, background: "var(--surface-sunken)", borderRadius: "var(--radius-sm)" }}>
            {[
              { id: "list", icon: "list" },
              { id: "grid", icon: "grid-3x3" },
            ].map((v, i) => (
              <button key={v.id} aria-checked={i === 0} role="radio" style={{ width: 28, height: 24, border: "none", background: i === 0 ? "var(--surface-raised)" : "transparent", color: i === 0 ? "var(--brand-primary)" : "var(--text-muted)", borderRadius: "calc(var(--radius-sm) - 2px)", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
                <LucideIcon name={v.icon} size={13} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* Compact variant for sidebars / dense surfaces */
function LMResultCountCompact({ shown, total }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--surface-border)" }}>
      <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
        Results
      </div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--text-secondary)" }}>
        {shown} <span style={{ color: "var(--text-muted)" }}>of</span> {total}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Mock list rows
// ════════════════════════════════════════════════════════════════════════

const LM_RESULTS = [
  { date: "2025-11-04", title: "Freight corridor performance, I-35 segment", kind: "Report" },
  { date: "2025-10-22", title: "Truck parking demand model — Phase II findings", kind: "Working paper" },
  { date: "2025-10-09", title: "Border crossing wait-time variability, 2020–2025", kind: "Dataset" },
  { date: "2025-09-28", title: "Pavement condition scoring, statewide rollup", kind: "Report" },
  { date: "2025-09-17", title: "Multimodal hub siting framework", kind: "Working paper" },
];

function LMResultRow({ date, title, kind }) {
  return (
    <li style={{ display: "grid", gridTemplateColumns: "100px 1fr 120px", gap: 16, alignItems: "center", padding: "14px 4px", borderBottom: "1px solid var(--surface-border)" }}>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--text-muted)" }}>{date}</span>
      <a href="#" onClick={(e) => e.preventDefault()} style={{ fontSize: "0.92rem", color: "var(--text-primary)", textDecoration: "none", fontWeight: 500 }}>{title}</a>
      <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", fontWeight: 700, justifySelf: "end" }}>{kind}</span>
    </li>
  );
}

function LMResultList({ rows = LM_RESULTS }) {
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
      {rows.map((r, i) => <LMResultRow key={i} {...r} />)}
    </ul>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Load more — three states
// ════════════════════════════════════════════════════════════════════════

function LMLoadMoreButton({ state = "idle", remaining = 163 }) {
  const cfg = {
    idle:    { label: `Load 24 more — ${remaining.toLocaleString()} remaining`, icon: "chevron-down", disabled: false, busy: false },
    loading: { label: "Loading…",                                                icon: "loader",       disabled: true,  busy: true },
    done:    { label: "End of results",                                          icon: "check",        disabled: true,  busy: false },
  }[state];

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "20px 0 4px" }}>
      <button
        disabled={cfg.disabled}
        aria-busy={cfg.busy || undefined}
        style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "11px 22px",
          border: `1px solid ${state === "done" ? "var(--surface-border)" : "var(--brand-primary)"}`,
          background: state === "done" ? "var(--surface-sunken)" : "var(--surface-raised)",
          color: state === "done" ? "var(--text-muted)" : "var(--brand-primary)",
          fontFamily: "var(--font-body-bold)", fontWeight: 700,
          fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.1em",
          borderRadius: "var(--radius-sm)",
          cursor: cfg.disabled ? "default" : "pointer",
          minWidth: 280, justifyContent: "center",
        }}
      >
        <LucideIcon name={cfg.icon} size={13} />
        {cfg.label}
      </button>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Infinite scroll — sentinel + back-to-top + done-state
// ════════════════════════════════════════════════════════════════════════

function LMInfiniteSentinel({ state = "idle" }) {
  if (state === "loading") {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "24px 0", color: "var(--text-muted)", fontSize: "0.82rem" }}>
        <LucideIcon name="loader" size={14} />
        <span>Loading more results…</span>
      </div>
    );
  }
  if (state === "done") {
    return (
      <div style={{ padding: "26px 0 12px", textAlign: "center" }}>
        <div style={{ width: 60, height: 1, background: "var(--surface-border)", margin: "0 auto 10px" }} />
        <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", fontWeight: 700 }}>
          End of results — 187 of 187
        </div>
      </div>
    );
  }
  return (
    <div aria-hidden style={{ height: 12 }} />
  );
}

function LMBackToTop() {
  return (
    <div style={{ position: "absolute", bottom: 16, right: 16 }}>
      <button
        aria-label="Back to top"
        style={{
          width: 40, height: 40, borderRadius: "50%",
          border: "1px solid var(--surface-border)",
          background: "var(--surface-raised)",
          color: "var(--text-secondary)",
          boxShadow: "var(--shadow-md)",
          cursor: "pointer",
          display: "inline-flex", alignItems: "center", justifyContent: "center", padding: 0,
        }}
      >
        <LucideIcon name="arrow-up" size={16} />
      </button>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// PAGE
// ════════════════════════════════════════════════════════════════════════

function LoadMorePage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "load-more");
  return (
    <PageShell item={item}>
      <LMIntro>
        Three patterns for revealing more rows in a long list. Pick by user intent: <strong>numbered pagination</strong> (covered separately) for browsing reports; <strong>load more</strong> for general catalog views — keyboard accessible, footer-friendly; <strong>infinite scroll</strong> only for feed-shaped data where the user is grazing, paired with a result-count header so the list still has a sense of size.
      </LMIntro>

      {/* Result count */}
      <LMSectionLabel>Result count strip</LMSectionLabel>
      <LMBox label="Default — header above any list view">
        <LMResultCount />
      </LMBox>
      <LMBox label="Without view toggle — for single-template pages">
        <LMResultCount showView={false} />
      </LMBox>
      <LMBox label="Compact — sidebar / dense surface" padded={false}>
        <div style={{ padding: "20px 24px", maxWidth: 280 }}>
          <LMResultCountCompact shown={24} total={187} />
        </div>
      </LMBox>

      {/* Load more — three states */}
      <LMSectionLabel>Load more · idle · loading · done</LMSectionLabel>
      <LMBox label="Idle — primary outline button, count of remaining items">
        <LMResultList />
        <LMLoadMoreButton state="idle" remaining={163} />
      </LMBox>
      <LMBox label="Loading — busy state, spinner replaces chevron">
        <LMResultList rows={LM_RESULTS.slice(0, 3)} />
        <LMLoadMoreButton state="loading" />
      </LMBox>
      <LMBox label="Done — terminal sentinel, no further action">
        <LMResultList rows={LM_RESULTS.slice(0, 2)} />
        <LMLoadMoreButton state="done" />
      </LMBox>

      {/* Infinite scroll */}
      <LMSectionLabel>Infinite scroll · sentinel + back-to-top</LMSectionLabel>
      <LMBox label="Loading — quiet inline indicator at the foot of loaded rows" padded={false}>
        <div style={{ position: "relative", padding: "20px 24px 60px" }}>
          <LMResultList />
          <LMInfiniteSentinel state="loading" />
          <LMBackToTop />
        </div>
      </LMBox>
      <LMBox label="Done — explicit terminal sentinel so users know they've reached the end" padded={false}>
        <div style={{ position: "relative", padding: "20px 24px 60px" }}>
          <LMResultList />
          <LMInfiniteSentinel state="done" />
          <LMBackToTop />
        </div>
      </LMBox>

      {/* Decision matrix */}
      <LMSectionLabel>When to use which</LMSectionLabel>
      <div style={{ overflow: "hidden", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", marginBottom: 16 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.86rem" }}>
          <thead>
            <tr style={{ background: "var(--surface-sunken)" }}>
              {["Pattern", "Use when", "Avoid when", "Pairs with"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", borderBottom: "1px solid var(--surface-border)" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["Numbered pagination", "Users return to a known page (publication archive, tables of record)", "Items are added rapidly so page numbers shift", "Pagination component"],
              ["Load more", "General catalog views, news, search — default choice", "Need to deep-link to a specific item past page 1", "Result count strip"],
              ["Infinite scroll", "Feed-shaped grazing — social, image streams", "List has a footer or items must be reached by keyboard alone", "Result count + back-to-top"],
            ].map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} style={{ padding: "12px 14px", borderBottom: i === 2 ? "none" : "1px solid var(--surface-border)", color: j === 0 ? "var(--text-primary)" : "var(--text-secondary)", fontWeight: j === 0 ? 600 : 400, lineHeight: 1.55 }}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <LMSpecRow>
        <LMSpec label="Page size"      value="24 / 48 / 96" note="User-selectable on result-count strip" />
        <LMSpec label="Button"         value="outline · primary" note="Same Work Sans 700 uppercase as all CTAs" />
        <LMSpec label="Sentinel root"  value="800px" note="IntersectionObserver rootMargin for early prefetch" />
        <LMSpec label="A11y"           value="aria-busy / live=polite" note="Announce row-count change on each load" />
      </LMSpecRow>
    </PageShell>
  );
}

Object.assign(window, { LoadMorePage });
