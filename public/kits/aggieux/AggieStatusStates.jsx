/* global React, PageShell, AGGIE_CATALOG, LucideIcon */
/*
 * AggieStatusStates.jsx — Batch 19:
 *   Empty states
 *   Error pages (404 / 500)
 *   Skeleton loaders
 *   Steppers (horizontal + vertical)
 *
 * The "what shows up when there's nothing, something broke, or
 * something's loading" family. Editorial — every state still earns
 * its style signature (hairline / stacked-bars / hashed). No spinning
 * gears, no "oops!" cartoons.
 *
 * Helper prefix: SS.
 */

// ════════════════════════════════════════════════════════════════════════
// Shared helpers (SS prefix)
// ════════════════════════════════════════════════════════════════════════

function SSBox({ dark = false, label, padded = true, children }) {
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

function SSSectionLabel({ children }) {
  return (
    <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 12, marginTop: 16 }}>{children}</div>
  );
}

function SSSpecRow({ children }) {
  return (
    <div style={{ marginTop: 28, padding: "14px 18px", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>{children}</div>
  );
}

function SSSpec({ label, value, note }) {
  return (
    <div>
      <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--brand-primary)", marginTop: 3, fontWeight: 500 }}>{value}</div>
      {note && <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 2, lineHeight: 1.4 }}>{note}</div>}
    </div>
  );
}

function SSIntro({ children }) {
  return (
    <div style={{ padding: "16px 20px", marginBottom: 28, background: "color-mix(in srgb, var(--brand-primary) 5%, transparent)", borderLeft: "3px solid var(--brand-primary)", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0", fontSize: "0.92rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>
      {children}
    </div>
  );
}

// Style signature — recurring per-style rule.
function SSStyleSig({ style, width = 60, color = "var(--brand-primary)", accent = "var(--brand-accent)" }) {
  if (style === "bold") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <div style={{ width: width * 0.55, height: 5, background: color, borderRadius: 2 }} />
        <div style={{ width: width * 0.18, height: 5, background: color, borderRadius: 2, opacity: 0.5 }} />
        <div style={{ width: width * 0.08, height: 5, background: color, borderRadius: 2, opacity: 0.25 }} />
      </div>
    );
  }
  if (style === "elegant") {
    return (
      <div style={{
        width, height: 6,
        backgroundImage: `repeating-linear-gradient(135deg, ${accent} 0 1px, transparent 1px 5px)`,
        WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 15%, black 85%, transparent 100%)",
        maskImage: "linear-gradient(90deg, transparent 0%, black 15%, black 85%, transparent 100%)",
        opacity: 0.75,
      }} />
    );
  }
  // default — hairline fade
  return (
    <div style={{ width, height: 1, background: `linear-gradient(90deg, transparent 0%, ${color} 15%, ${color} 85%, transparent 100%)`, opacity: 0.85 }} />
  );
}

// ════════════════════════════════════════════════════════════════════════
// EMPTY STATE
// ════════════════════════════════════════════════════════════════════════
//
// Three flavors:
//   first-run   — invitation to start, e.g. "no projects yet"
//   search-empty — query returned no matches
//   list-empty   — generic empty list (filtered, etc.)
//
// All three share the same anatomy: editorial mark + eyebrow + title + body
// + recovery action. The "illustration" is a SVG abstraction, not a cartoon.

function SSEmptyMark({ kind, style = "default", dark = false }) {
  const stroke = dark ? "rgba(255,255,255,0.7)" : "var(--text-muted)";
  const accent = dark ? "var(--brand-accent)" : "var(--brand-primary)";

  // Each kind gets a distinct geometric mark — never a cartoon icon.
  if (kind === "search-empty") {
    return (
      <svg width="88" height="88" viewBox="0 0 88 88" fill="none" aria-hidden="true">
        {/* dotted grid suggesting a searched space */}
        {[...Array(6)].map((_, r) => [...Array(6)].map((_, c) => (
          <circle key={`${r}-${c}`} cx={14 + c * 12} cy={14 + r * 12} r="1.2" fill={stroke} opacity={0.35} />
        )))}
        {/* magnifier ring at center, off-axis */}
        <circle cx="44" cy="44" r="20" stroke={accent} strokeWidth="2" fill="none" />
        <line x1="58.5" y1="58.5" x2="74" y2="74" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
        {/* hairline fade beneath */}
        <line x1="14" y1="80" x2="74" y2="80" stroke={accent} strokeWidth="1" opacity="0.4" />
      </svg>
    );
  }
  if (kind === "first-run") {
    return (
      <svg width="88" height="88" viewBox="0 0 88 88" fill="none" aria-hidden="true">
        {/* an empty editorial frame — corners only, like a cropped composition */}
        <path d="M14 14 L14 30 M14 14 L30 14" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M74 14 L74 30 M74 14 L58 14" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M14 74 L14 58 M14 74 L30 74" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M74 74 L74 58 M74 74 L58 74" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
        {/* signature mark inside */}
        <line x1="32" y1="44" x2="56" y2="44" stroke={stroke} strokeWidth="1.5" />
        <line x1="32" y1="50" x2="48" y2="50" stroke={stroke} strokeWidth="1.5" opacity="0.5" />
      </svg>
    );
  }
  // list-empty — three empty rows
  return (
    <svg width="88" height="88" viewBox="0 0 88 88" fill="none" aria-hidden="true">
      {[28, 44, 60].map((y, i) => (
        <g key={y}>
          <rect x="14" y={y - 4} width="60" height="8" rx="1" stroke={stroke} strokeWidth="1.2" strokeDasharray="2 3" fill="none" />
          <line x1="14" y1={y} x2={14 + 60 * (1 - i * 0.2)} y2={y} stroke={accent} strokeWidth="1.5" opacity={0.6 - i * 0.15} />
        </g>
      ))}
    </svg>
  );
}

function SSEmptyState({
  kind = "list-empty", // first-run | search-empty | list-empty
  style = "default",
  eyebrow = "no results",
  title = "Nothing matched your filters",
  body = "Try broadening your filters or clearing the search query.",
  primaryAction = "Clear filters",
  secondaryAction = null,
  dark = false,
  size = "md", // sm | md | lg
}) {
  const padding = size === "sm" ? "32px 28px" : size === "lg" ? "72px 48px" : "52px 36px";
  const titleSize = size === "sm" ? "1.15rem" : size === "lg" ? "1.85rem" : "1.5rem";

  const txt = dark ? "rgba(255,255,255,0.95)" : "var(--text-primary)";
  const subTxt = dark ? "rgba(255,255,255,0.75)" : "var(--text-secondary)";
  const muted = dark ? "rgba(255,255,255,0.6)" : "var(--text-muted)";

  // Per-style title face
  const titleStyle = style === "elegant"
    ? { fontFamily: "Georgia, serif", fontStyle: "italic", letterSpacing: "-0.005em", textTransform: "none", fontWeight: 400 }
    : style === "bold"
    ? { fontFamily: "var(--font-body-bold)", textTransform: "uppercase", letterSpacing: 0, fontWeight: 700 }
    : { fontFamily: "var(--font-display)", textTransform: "uppercase", letterSpacing: "0.01em", fontWeight: 500 };

  return (
    <div style={{
      padding, textAlign: "center",
      border: dark ? "1px solid rgba(255,255,255,0.18)" : "1px solid var(--surface-border)",
      borderRadius: "var(--radius-md)",
      background: dark ? "transparent" : "var(--surface-raised)",
    }}>
      <div style={{ display: "inline-flex", justifyContent: "center", marginBottom: 18 }}>
        <SSEmptyMark kind={kind} style={style} dark={dark} />
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
        <SSStyleSig style={style} width={64} color={dark ? "var(--brand-accent)" : "var(--brand-primary)"} accent={dark ? "var(--brand-accent)" : "var(--brand-accent)"} />
      </div>
      <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: muted, fontFamily: "var(--font-body-bold)", marginBottom: 10 }}>
        {eyebrow}
      </div>
      <h3 style={{ ...titleStyle, fontSize: titleSize, color: txt, margin: "0 0 10px", lineHeight: 1.2 }}>{title}</h3>
      <p style={{ fontSize: "0.95rem", lineHeight: 1.6, color: subTxt, maxWidth: 460, margin: "0 auto 22px" }}>{body}</p>
      {(primaryAction || secondaryAction) && (
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          {primaryAction && (
            <button style={{
              fontFamily: "var(--font-body-bold)", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em",
              padding: "11px 22px", borderRadius: "var(--radius-sm)",
              background: dark ? "var(--brand-accent)" : "var(--brand-primary)",
              color: dark ? "var(--brand-primary-deep)" : "#fff",
              border: 0, cursor: "pointer",
            }}>{primaryAction}</button>
          )}
          {secondaryAction && (
            <button style={{
              fontFamily: "var(--font-body-bold)", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em",
              padding: "11px 22px", borderRadius: "var(--radius-sm)",
              background: "transparent", color: dark ? "rgba(255,255,255,0.95)" : "var(--brand-primary)",
              border: `1px solid ${dark ? "rgba(255,255,255,0.5)" : "var(--brand-primary)"}`, cursor: "pointer",
            }}>{secondaryAction}</button>
          )}
        </div>
      )}
    </div>
  );
}

function EmptyStatePage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "empty-state");
  return (
    <PageShell item={item}>
      <SSIntro>
        Empty states are not failure modes — they're invitations. Every empty state earns the same editorial rhythm as any other section: eyebrow, title, supporting copy, recovery action. The illustration is a geometric mark, never a cartoon. Three kinds: <strong>first-run</strong> (a fresh feature with nothing in it yet), <strong>search-empty</strong> (a query returned no matches), and <strong>list-empty</strong> (filtered to nothing).
      </SSIntro>

      <SSSectionLabel>First-run · invitation to start</SSSectionLabel>
      <SSBox dark={false} label="No projects yet — first-time landing on a feature">
        <SSEmptyState
          kind="first-run"
          style="default"
          eyebrow="research portal"
          title="Start your first project"
          body="Projects organize publications, datasets, and collaborators. Once you create one, drafts and uploads land here automatically."
          primaryAction="Create project"
          secondaryAction="Read the guide"
          size="lg"
        />
      </SSBox>

      <SSSectionLabel>Search-empty · the query returned nothing</SSSectionLabel>
      <SSBox dark={false} label="Inside a directory or publication search result">
        <SSEmptyState
          kind="search-empty"
          style="default"
          eyebrow="no matches"
          title={'No publications match "autonomous mediation"'}
          body="We searched titles, abstracts, and authors. Try a broader phrase, or browse by research area instead."
          primaryAction="Browse all publications"
          secondaryAction="Clear search"
        />
      </SSBox>

      <SSSectionLabel>List-empty · filters left nothing</SSSectionLabel>
      <SSBox dark={false} label="Compact size — fits inside a card or filtered table">
        <SSEmptyState
          kind="list-empty"
          style="default"
          eyebrow="filtered to zero"
          title="No upcoming events match these filters"
          body="Three filters are applied. Remove one to widen the range."
          primaryAction="Clear all filters"
          size="sm"
        />
      </SSBox>

      <SSSectionLabel>Style variants · same content, three signatures</SSSectionLabel>
      <SSBox dark={false} label="Bold style · stacked-bars signature, uppercase Work Sans title">
        <SSEmptyState
          kind="first-run"
          style="bold"
          eyebrow="connected vehicle program"
          title="No pilots scheduled yet"
          body="Pilot studies require a signed safety review before they appear here."
          primaryAction="Submit safety review"
        />
      </SSBox>

      <SSBox dark={false} label="Elegant style · italic Georgia title, soft-hash signature">
        <SSEmptyState
          kind="first-run"
          style="elegant"
          eyebrow="annual report 2026"
          title="A blank canvas, ready for your first contribution"
          body="The annual report is composed from research-area summaries. Add yours and it appears here in editorial order."
          primaryAction="Begin your section"
          secondaryAction="See last year's report"
          size="lg"
        />
      </SSBox>

      <SSSectionLabel>On dark surface</SSSectionLabel>
      <SSBox dark={true} label="Empty state on brand maroon">
        <SSEmptyState
          kind="search-empty"
          style="default"
          eyebrow="archive search"
          title="No archived reports from 2018"
          body="The archive currently spans 2019 onward. Older records are held by the TAMUS Library."
          primaryAction="Visit the library"
          secondaryAction="Reset search"
          dark
        />
      </SSBox>

      <SSSpecRow>
        <SSSpec label="Kinds" value="first-run · search-empty · list-empty" note="distinct geometric mark per kind" />
        <SSSpec label="Sizes" value="sm · md · lg" note="32px / 52px / 72px vertical padding" />
        <SSSpec label="Mark" value="88×88 SVG" note="geometric, never a cartoon" />
        <SSSpec label="Anatomy" value="mark · sig · eyebrow · title · body · actions" note="primary always present" />
      </SSSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// ERROR PAGE
// ════════════════════════════════════════════════════════════════════════
//
// 404 (not found) and 500 (server error). Editorial — these are full-page
// templates, not panels. Big code, signature rule, recovery actions, plus a
// compact "system status" line for 500s.

function SSErrorPage({
  code = "404",
  style = "default",
  eyebrow = "Page not found",
  title = "We can't find the page you were looking for",
  body = "The link may be out of date, or the page may have been retired. Use the navigation, search, or jump to a recent landing point.",
  primaryAction = "Return home",
  secondaryAction = "Search the site",
  systemStatus = null, // for 500-class errors
}) {
  const titleStyle = style === "elegant"
    ? { fontFamily: "Georgia, serif", fontStyle: "italic", letterSpacing: "-0.005em", textTransform: "none", fontWeight: 400 }
    : style === "bold"
    ? { fontFamily: "var(--font-body-bold)", textTransform: "uppercase", letterSpacing: 0, fontWeight: 700 }
    : { fontFamily: "var(--font-display)", textTransform: "uppercase", letterSpacing: "0.01em", fontWeight: 500 };

  return (
    <div style={{
      padding: "64px 56px 72px",
      background: "var(--surface-page)",
      borderTop: "4px solid var(--brand-primary)",
    }}>
      <div style={{ maxWidth: 720 }}>
        {/* Massive code mark */}
        <div style={{
          fontFamily: "var(--font-display)",
          fontSize: "8.5rem",
          fontWeight: 500,
          lineHeight: 0.9,
          color: "var(--brand-primary)",
          letterSpacing: "-0.02em",
          marginBottom: 8,
        }}>{code}</div>

        <SSStyleSig style={style} width={120} />

        <div style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", margin: "20px 0 12px" }}>
          {eyebrow}
        </div>

        <h1 style={{ ...titleStyle, fontSize: "2.2rem", color: "var(--text-primary)", margin: "0 0 16px", lineHeight: 1.15, maxWidth: 600 }}>
          {title}
        </h1>

        <p style={{ fontSize: "1rem", lineHeight: 1.65, color: "var(--text-secondary)", margin: "0 0 28px", maxWidth: 560 }}>
          {body}
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 36 }}>
          <button style={{
            fontFamily: "var(--font-body-bold)", fontSize: "0.82rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em",
            padding: "13px 26px", borderRadius: "var(--radius-sm)",
            background: "var(--brand-primary)", color: "#fff", border: 0, cursor: "pointer",
          }}>{primaryAction}</button>
          {secondaryAction && (
            <button style={{
              fontFamily: "var(--font-body-bold)", fontSize: "0.82rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em",
              padding: "13px 26px", borderRadius: "var(--radius-sm)",
              background: "transparent", color: "var(--brand-primary)",
              border: "1px solid var(--brand-primary)", cursor: "pointer",
            }}>{secondaryAction}</button>
          )}
        </div>

        {systemStatus && (
          <div style={{
            padding: "14px 18px",
            border: "1px solid var(--surface-border)",
            borderLeft: "3px solid var(--color-info)",
            borderRadius: "0 var(--radius-sm) var(--radius-sm) 0",
            background: "var(--surface-raised)",
            display: "flex", gap: 14, alignItems: "flex-start",
          }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--color-success)", marginTop: 7, flexShrink: 0, boxShadow: "0 0 0 3px color-mix(in srgb, var(--color-success) 25%, transparent)" }} />
            <div>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 3 }}>
                System status
              </div>
              <div style={{ fontSize: "0.92rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                {systemStatus}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ErrorPagePage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "error-page");
  return (
    <PageShell item={item}>
      <SSIntro>
        Full-page error templates for the two everyday cases. <strong>404</strong> is a missing-page wayfinding moment. <strong>500</strong> is a "we know, we're on it" service moment — it includes a system-status line so users know they're not alone with the failure. The big code mark up top, signature rule below, then the editorial title-body-actions rhythm.
      </SSIntro>

      <SSSectionLabel>404 — page not found</SSSectionLabel>
      <SSBox dark={false} label="Default style · standalone full-page template" padded={false}>
        <SSErrorPage
          code="404"
          style="default"
          eyebrow="Page not found"
          title="We can't find the page you were looking for"
          body="The link may be out of date, or the page may have been retired. Use the navigation above, search, or jump to a recent landing point."
          primaryAction="Return home"
          secondaryAction="Search the site"
        />
      </SSBox>

      <SSSectionLabel>500 — server error · with system-status line</SSSectionLabel>
      <SSBox dark={false} label="Includes a live system-status indicator + recovery copy" padded={false}>
        <SSErrorPage
          code="500"
          style="default"
          eyebrow="Service interruption"
          title="Something on our end isn't responding"
          body="Our system flagged this and the on-call engineer has been paged. You don't need to do anything — try again in a minute. If it persists, contact research-it."
          primaryAction="Try again"
          secondaryAction="Visit status page"
          systemStatus="Publication API returned errors at 3:42 p.m. CDT. Recovery in progress — most pages are back online."
        />
      </SSBox>

      <SSSectionLabel>Bold style — louder voice, same anatomy</SSSectionLabel>
      <SSBox dark={false} label="403 — permission denied · bold style variant" padded={false}>
        <SSErrorPage
          code="403"
          style="bold"
          eyebrow="Access restricted"
          title="You don't have permission to view this"
          body="This page is restricted to TTI staff. Sign in with your TAMU NetID, or request access from the page owner."
          primaryAction="Sign in"
          secondaryAction="Request access"
        />
      </SSBox>

      <SSSectionLabel>Elegant style — editorial 410</SSSectionLabel>
      <SSBox dark={false} label="410 — content retired · elegant style" padded={false}>
        <SSErrorPage
          code="410"
          style="elegant"
          eyebrow="This page has been retired"
          title="The publication you were looking for is no longer here"
          body="This research output was archived to the TAMUS Library in March 2026. Follow the link below for the canonical archived version, or browse current publications."
          primaryAction="Open archived version"
          secondaryAction="Browse current publications"
        />
      </SSBox>

      <SSSpecRow>
        <SSSpec label="Codes" value="404 · 410 · 500 · 403" note="any code; copy adapts" />
        <SSSpec label="Code mark" value="8.5rem · maroon" note="display face, tight tracking" />
        <SSSpec label="Top rule" value="4px maroon" note="stand-in for page-header signature" />
        <SSSpec label="Status line" value="optional" note="500-class errors only" />
      </SSSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// SKELETON LOADER
// ════════════════════════════════════════════════════════════════════════
//
// Shimmer skeletons for cards, list rows, table rows, and an article body.
// Always uses a neutral surface — no maroon shimmer (would feel branded /
// permanent). Honors prefers-reduced-motion via a low-motion variant.

const SKELETON_KEYFRAMES = `
@keyframes ss-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
@media (prefers-reduced-motion: reduce) {
  .ss-skeleton-shimmer { animation: none !important; }
}
`;

function SSSkeleton({ width = "100%", height = 14, radius = 3, lowMotion = false, style: extra = {} }) {
  return (
    <div
      className={lowMotion ? "" : "ss-skeleton-shimmer"}
      style={{
        width, height, borderRadius: radius,
        background: lowMotion
          ? "var(--surface-sunken)"
          : "linear-gradient(90deg, var(--surface-sunken) 0%, color-mix(in srgb, var(--surface-sunken) 60%, var(--surface-border)) 50%, var(--surface-sunken) 100%)",
        backgroundSize: "200% 100%",
        animation: lowMotion ? "none" : "ss-shimmer 1.6s ease-in-out infinite",
        ...extra,
      }}
    />
  );
}

function SSCardSkeleton({ lowMotion = false }) {
  return (
    <div style={{ padding: 18, border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)" }}>
      <SSSkeleton height={140} radius={4} lowMotion={lowMotion} />
      <div style={{ marginTop: 16 }}>
        <SSSkeleton width="40%" height={10} lowMotion={lowMotion} />
      </div>
      <div style={{ marginTop: 12 }}>
        <SSSkeleton width="92%" height={18} lowMotion={lowMotion} />
      </div>
      <div style={{ marginTop: 8 }}>
        <SSSkeleton width="68%" height={18} lowMotion={lowMotion} />
      </div>
      <div style={{ marginTop: 18, display: "flex", gap: 8 }}>
        <SSSkeleton width={70} height={22} radius={999} lowMotion={lowMotion} />
        <SSSkeleton width={90} height={22} radius={999} lowMotion={lowMotion} />
      </div>
    </div>
  );
}

function SSListRowSkeleton({ lowMotion = false }) {
  return (
    <div style={{ display: "flex", gap: 14, alignItems: "center", padding: "14px 0", borderBottom: "1px solid var(--surface-border)" }}>
      <SSSkeleton width={42} height={42} radius="50%" lowMotion={lowMotion} />
      <div style={{ flex: 1 }}>
        <SSSkeleton width="35%" height={14} lowMotion={lowMotion} />
        <div style={{ marginTop: 8 }}>
          <SSSkeleton width="70%" height={11} lowMotion={lowMotion} />
        </div>
      </div>
      <SSSkeleton width={60} height={11} lowMotion={lowMotion} />
    </div>
  );
}

function SSTableSkeleton({ lowMotion = false }) {
  const cols = [22, 34, 22, 22];
  return (
    <div style={{ border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", overflow: "hidden", background: "var(--surface-raised)" }}>
      {/* Header row */}
      <div style={{ display: "flex", padding: "12px 16px", background: "var(--surface-sunken)", borderBottom: "1px solid var(--surface-border)", gap: 16 }}>
        {cols.map((w, i) => <SSSkeleton key={i} width={`${w}%`} height={10} lowMotion={lowMotion} />)}
      </div>
      {[...Array(5)].map((_, r) => (
        <div key={r} style={{ display: "flex", padding: "14px 16px", borderBottom: r < 4 ? "1px solid var(--surface-border)" : "none", gap: 16 }}>
          {cols.map((w, i) => <SSSkeleton key={i} width={`${w * (0.85 + ((r * i) % 5) * 0.04)}%`} height={12} lowMotion={lowMotion} />)}
        </div>
      ))}
    </div>
  );
}

function SSArticleSkeleton({ lowMotion = false }) {
  return (
    <div>
      <SSSkeleton width="32%" height={10} lowMotion={lowMotion} />
      <div style={{ marginTop: 14 }}>
        <SSSkeleton width="88%" height={36} lowMotion={lowMotion} />
      </div>
      <div style={{ marginTop: 8 }}>
        <SSSkeleton width="60%" height={36} lowMotion={lowMotion} />
      </div>
      <div style={{ marginTop: 26 }}>
        <SSSkeleton width={72} height={3} lowMotion={lowMotion} />
      </div>
      <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 8 }}>
        <SSSkeleton width="100%" height={12} lowMotion={lowMotion} />
        <SSSkeleton width="98%" height={12} lowMotion={lowMotion} />
        <SSSkeleton width="94%" height={12} lowMotion={lowMotion} />
        <SSSkeleton width="46%" height={12} lowMotion={lowMotion} />
      </div>
      <div style={{ marginTop: 24 }}>
        <SSSkeleton width={220} height={140} radius={4} lowMotion={lowMotion} />
      </div>
      <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 8 }}>
        <SSSkeleton width="96%" height={12} lowMotion={lowMotion} />
        <SSSkeleton width="92%" height={12} lowMotion={lowMotion} />
        <SSSkeleton width="40%" height={12} lowMotion={lowMotion} />
      </div>
    </div>
  );
}

function SkeletonLoaderPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "skeleton-loader");
  return (
    <PageShell item={item}>
      <style>{SKELETON_KEYFRAMES}</style>
      <SSIntro>
        Skeleton placeholders for content that's about to arrive. Always neutral — never tinted maroon, which would read as branded permanent UI. The shimmer is a 1.6-second ease-in-out gradient sweep. <code>prefers-reduced-motion</code> swaps to a static fill automatically; the <code>lowMotion</code> prop forces the same. Use one shape per content type — don't try to mock the eventual content exactly.
      </SSIntro>

      <SSSectionLabel>Card grid · 3-up</SSSectionLabel>
      <SSBox dark={false} label="Skeleton card matches the standard card-group layout">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          <SSCardSkeleton />
          <SSCardSkeleton />
          <SSCardSkeleton />
        </div>
      </SSBox>

      <SSSectionLabel>List rows · contact-card or news-list</SSSectionLabel>
      <SSBox dark={false} label="Avatar circle + two text lines + meta">
        <div style={{ background: "var(--surface-raised)", padding: "0 16px", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)" }}>
          <SSListRowSkeleton />
          <SSListRowSkeleton />
          <SSListRowSkeleton />
          <SSListRowSkeleton />
        </div>
      </SSBox>

      <SSSectionLabel>Table</SSSectionLabel>
      <SSBox dark={false} label="Header row + five body rows">
        <SSTableSkeleton />
      </SSBox>

      <SSSectionLabel>Article body · long-form publication</SSSectionLabel>
      <SSBox dark={false} label="Eyebrow + title + signature mark + paragraph runs + figure">
        <div style={{ maxWidth: 580 }}>
          <SSArticleSkeleton />
        </div>
      </SSBox>

      <SSSectionLabel>Reduced motion · static fill</SSSectionLabel>
      <SSBox dark={false} label="Same skeleton with shimmer disabled — auto-applied via media query">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
          <SSCardSkeleton lowMotion />
          <SSCardSkeleton lowMotion />
        </div>
      </SSBox>

      <SSSpecRow>
        <SSSpec label="Shimmer" value="1.6s ease-in-out" note="200% bg-position sweep" />
        <SSSpec label="Reduced motion" value="static fill" note="auto via @media — no JS" />
        <SSSpec label="Tones" value="surface-sunken → border" note="never branded; neutral only" />
        <SSSpec label="Shapes" value="card · list-row · table · article" note="one per content type" />
      </SSSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// STEPPER
// ════════════════════════════════════════════════════════════════════════
//
// Numbered-circle multi-step indicator for funding-application or
// study-submission flows. Three states per step: complete, current, upcoming.
// Horizontal (top of form) + vertical (sidebar) variants.

function SSStepCircle({ state, num, size = 32 }) {
  const bg = state === "complete" ? "var(--brand-primary)"
           : state === "current"  ? "var(--surface-page)"
           : "var(--surface-page)";
  const border = state === "current" ? "var(--brand-primary)"
              : state === "upcoming" ? "var(--surface-border)"
              : "var(--brand-primary)";
  const color = state === "complete" ? "#fff"
              : state === "current"  ? "var(--brand-primary)"
              : "var(--text-muted)";

  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: bg,
      border: `2px solid ${border}`,
      color,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: size > 30 ? "0.9rem" : "0.78rem",
      flexShrink: 0,
      boxShadow: state === "current" ? "0 0 0 4px color-mix(in srgb, var(--brand-primary) 15%, transparent)" : "none",
      transition: "box-shadow 0.2s ease",
    }}>
      {state === "complete" ? "✓" : num}
    </div>
  );
}

function SSStepperHorizontal({ steps, current = 1 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, width: "100%" }}>
      {steps.map((s, i) => {
        const state = i < current ? "complete" : i === current ? "current" : "upcoming";
        const isLast = i === steps.length - 1;
        return (
          <React.Fragment key={i}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, gap: 8, minWidth: 0 }}>
              <SSStepCircle state={state} num={i + 1} />
              <div style={{ textAlign: "center", maxWidth: 140 }}>
                <div style={{
                  fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em",
                  color: state === "upcoming" ? "var(--text-muted)" : "var(--brand-primary)",
                  fontFamily: "var(--font-body-bold)",
                }}>Step {i + 1}</div>
                <div style={{
                  fontSize: "0.85rem", marginTop: 3, lineHeight: 1.3,
                  color: state === "upcoming" ? "var(--text-muted)" : "var(--text-primary)",
                  fontWeight: state === "current" ? 600 : 400,
                }}>{s}</div>
              </div>
            </div>
            {!isLast && (
              <div style={{
                flex: 1, height: 2,
                background: i < current ? "var(--brand-primary)" : "var(--surface-border)",
                margin: "0 12px",
                marginBottom: 44, // align line to circle center
                alignSelf: "flex-start",
                marginTop: 15,
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function SSStepperVertical({ steps, current = 1 }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {steps.map((s, i) => {
        const state = i < current ? "complete" : i === current ? "current" : "upcoming";
        const isLast = i === steps.length - 1;
        return (
          <div key={i} style={{ display: "flex", gap: 16, position: "relative" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
              <SSStepCircle state={state} num={i + 1} size={36} />
              {!isLast && (
                <div style={{
                  width: 2, flex: 1,
                  background: i < current ? "var(--brand-primary)" : "var(--surface-border)",
                  margin: "4px 0",
                  minHeight: 36,
                }} />
              )}
            </div>
            <div style={{ paddingBottom: isLast ? 0 : 22, paddingTop: 4, flex: 1 }}>
              <div style={{
                fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em",
                color: state === "upcoming" ? "var(--text-muted)" : "var(--brand-primary)",
                fontFamily: "var(--font-body-bold)",
              }}>
                Step {i + 1}{state === "complete" ? " · complete" : state === "current" ? " · in progress" : ""}
              </div>
              <div style={{
                fontFamily: "var(--font-display)", textTransform: "uppercase", letterSpacing: "0.01em",
                fontSize: "1.05rem", marginTop: 4, lineHeight: 1.25,
                color: state === "upcoming" ? "var(--text-muted)" : "var(--text-primary)",
                fontWeight: 500,
              }}>{s.title || s}</div>
              {s.body && (
                <div style={{
                  fontSize: "0.88rem", marginTop: 6, lineHeight: 1.55,
                  color: state === "upcoming" ? "var(--text-muted)" : "var(--text-secondary)",
                }}>{s.body}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StepperPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "stepper");

  const flow4 = ["Project basics", "Team & access", "Compliance review", "Submit"];
  const flow6 = ["Identification", "Funding source", "Methodology", "Team", "Compliance", "Review & sign"];

  const verticalSteps = [
    { title: "Project basics",       body: "Title, abstract, primary research area." },
    { title: "Funding source",       body: "Sponsor, contract, fiscal year." },
    { title: "Compliance review",    body: "IRB, IACUC, export-control, data-management." },
    { title: "Team and access",      body: "PI, co-Is, students, external collaborators." },
    { title: "Final review",         body: "Confirm, e-sign, route for approval." },
  ];

  return (
    <PageShell item={item}>
      <SSIntro>
        Numbered-circle progress indicator for multi-step flows — funding applications, study submissions, registration. Three states per step: <strong>complete</strong> (filled maroon, check mark), <strong>current</strong> (outlined maroon, soft halo), <strong>upcoming</strong> (outlined neutral). Horizontal sits at the top of a form; vertical lives in a sidebar with descriptions per step.
      </SSIntro>

      <SSSectionLabel>Horizontal · 4-step flow · current = step 2</SSSectionLabel>
      <SSBox dark={false} label="Sits above the active form section">
        <SSStepperHorizontal steps={flow4} current={1} />
      </SSBox>

      <SSSectionLabel>Horizontal · 6-step flow · current = step 4</SSSectionLabel>
      <SSBox dark={false} label="Wider flow — labels truncate via maxWidth">
        <SSStepperHorizontal steps={flow6} current={3} />
      </SSBox>

      <SSSectionLabel>Vertical · in a sidebar with step descriptions</SSSectionLabel>
      <SSBox dark={false} label="Pairs with a long form on the right; this lives in a 280px rail">
        <div style={{ maxWidth: 360 }}>
          <SSStepperVertical steps={verticalSteps} current={2} />
        </div>
      </SSBox>

      <SSSectionLabel>Compact horizontal · all steps complete</SSSectionLabel>
      <SSBox dark={false} label="Confirmation screen — review before final submit">
        <SSStepperHorizontal steps={flow4} current={4} />
      </SSBox>

      <SSSectionLabel>First-step state · nothing complete yet</SSSectionLabel>
      <SSBox dark={false} label="The very first time a user lands on the form">
        <SSStepperHorizontal steps={flow4} current={0} />
      </SSBox>

      <SSSpecRow>
        <SSSpec label="States" value="complete · current · upcoming" note="check / number / number" />
        <SSSpec label="Circle size" value="32px (h) · 36px (v)" note="vertical reads larger to fit body copy" />
        <SSSpec label="Connector" value="2px line" note="maroon if step is past, neutral otherwise" />
        <SSSpec label="Halo" value="4px soft halo" note="current step only — light maroon mix" />
      </SSSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Exports
// ════════════════════════════════════════════════════════════════════════

Object.assign(window, {
  EmptyStatePage,
  ErrorPagePage,
  SkeletonLoaderPage,
  StepperPage,
});
