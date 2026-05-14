/* global React, PageShell, AGGIE_CATALOG, LucideIcon */
/*
 * AggieCollab.jsx — Batch A.3: Editorial collaboration atoms.
 *
 *   Comment thread  — Threaded annotation on a research draft. Author
 *                     avatar, timestamp, status (open / resolved), reply
 *                     chain. Used by the editorial review workflow on
 *                     reports and ADRs.
 *
 *   Reaction bar    — Lightweight inline reactions (👍 / 👀 / 🎯). For
 *                     quick signal on long-form drafts without forcing
 *                     a full comment.
 *
 * Helper prefix: CR (Collab/Reactions).
 *
 * NOTE: emoji only used in the reaction bar where the meaning is the
 * symbol itself. No decorative emoji elsewhere.
 */

// ════════════════════════════════════════════════════════════════════════
// Shared helpers (CR prefix)
// ════════════════════════════════════════════════════════════════════════

function CRBox({ dark = false, label, padded = true, children }) {
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
      <div style={{ padding: padded ? 24 : 0, background: dark ? "var(--brand-primary)" : "var(--surface-page)" }}>{children}</div>
    </div>
  );
}

function CRSectionLabel({ children }) {
  return (
    <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 12, marginTop: 28 }}>{children}</div>
  );
}

function CRSpecRow({ children }) {
  return (
    <div style={{ marginTop: 28, padding: "14px 18px", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>{children}</div>
  );
}

function CRSpec({ label, value, note }) {
  return (
    <div>
      <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--brand-primary)", marginTop: 3, fontWeight: 500 }}>{value}</div>
      {note && <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 2, lineHeight: 1.4 }}>{note}</div>}
    </div>
  );
}

function CRIntro({ children }) {
  return (
    <div style={{ padding: "16px 20px", marginBottom: 28, background: "color-mix(in srgb, var(--brand-primary) 5%, transparent)", borderLeft: "3px solid var(--brand-primary)", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0", fontSize: "0.92rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>
      {children}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Avatar — initials in maroon-tinted disc
// ════════════════════════════════════════════════════════════════════════

const CR_USERS = {
  ma: { initials: "MA", name: "Marisol Alvarez", role: "Senior Research Scientist", hue: 0 },
  jt: { initials: "JT", name: "Jordan Tate",     role: "Editor",                      hue: 28 },
  rh: { initials: "RH", name: "Renee Huang",     role: "Project Director",            hue: 220 },
  dk: { initials: "DK", name: "Devon Kim",       role: "Visualization Lead",          hue: 160 },
};

function CRAvatar({ user, size = 32 }) {
  const u = CR_USERS[user] || CR_USERS.ma;
  return (
    <div
      aria-hidden
      style={{
        width: size, height: size,
        borderRadius: "50%",
        flexShrink: 0,
        background: `linear-gradient(135deg, oklch(0.62 0.13 ${u.hue}), oklch(0.45 0.16 ${u.hue}))`,
        color: "white",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--font-display)", fontWeight: 600,
        fontSize: size * 0.38,
        letterSpacing: "0.02em",
      }}
    >
      {u.initials}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Comment — single message in a thread
// ════════════════════════════════════════════════════════════════════════

function CRComment({ user, time, body, isReply = false, edited = false }) {
  const u = CR_USERS[user] || CR_USERS.ma;
  return (
    <div style={{ display: "grid", gridTemplateColumns: `${isReply ? 28 : 32}px 1fr`, gap: 12, marginLeft: isReply ? 32 : 0 }}>
      <CRAvatar user={user} size={isReply ? 28 : 32} />
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
          <span style={{ fontSize: "0.86rem", fontWeight: 600, color: "var(--text-primary)" }}>{u.name}</span>
          <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{time}</span>
          {edited && <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontStyle: "italic" }}>edited</span>}
        </div>
        <div style={{ fontSize: "0.9rem", lineHeight: 1.55, color: "var(--text-secondary)" }}>
          {body}
        </div>
        {!isReply && (
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 8 }}>
            <button style={{ background: "none", border: "none", padding: 0, color: "var(--text-muted)", fontSize: "0.78rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4, fontFamily: "inherit" }}>
              <LucideIcon name="message-circle" size={12} /> Reply
            </button>
            <button style={{ background: "none", border: "none", padding: 0, color: "var(--text-muted)", fontSize: "0.78rem", cursor: "pointer", fontFamily: "inherit" }}>React</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Comment thread — a single anchored conversation
// ════════════════════════════════════════════════════════════════════════

function CRStatusBadge({ status = "open" }) {
  const cfg = {
    open:     { label: "Open",     color: "var(--brand-accent)",   bg: "color-mix(in srgb, var(--brand-accent) 15%, transparent)" },
    resolved: { label: "Resolved", color: "var(--color-success)",  bg: "color-mix(in srgb, var(--color-success) 12%, transparent)" },
  }[status];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "2px 8px",
      borderRadius: "var(--radius-pill, 999px)",
      background: cfg.bg,
      color: cfg.color,
      fontFamily: "var(--font-body-bold)", fontWeight: 700,
      fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.08em",
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: cfg.color }} />
      {cfg.label}
    </span>
  );
}

function CRThread({ status = "open", anchor = "Section 3.2 · paragraph 4", children }) {
  return (
    <article style={{ border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)", overflow: "hidden", maxWidth: 540 }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderBottom: "1px solid var(--surface-border)", background: "var(--surface-sunken)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <LucideIcon name="message-square-text" size={13} />
          <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            <span style={{ color: "var(--text-muted)" }}>Anchored to </span>
            <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{anchor}</span>
          </span>
        </div>
        <CRStatusBadge status={status} />
      </header>
      <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 16 }}>
        {children}
      </div>
      <footer style={{ padding: "10px 12px 12px", borderTop: "1px solid var(--surface-border)", background: "var(--surface-page)" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <CRAvatar user="ma" size={26} />
          <div style={{ flex: 1, border: "1px solid var(--surface-border)", borderRadius: "var(--radius-sm)", background: "var(--surface-raised)", padding: "8px 10px" }}>
            <div style={{ fontSize: "0.84rem", color: "var(--text-muted)" }}>Reply…</div>
          </div>
          <button style={{ padding: "8px 12px", border: "none", background: "var(--brand-primary)", color: "white", fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", borderRadius: "var(--radius-sm)", cursor: "pointer", alignSelf: "flex-start" }}>Send</button>
        </div>
      </footer>
    </article>
  );
}

/* Compact, inline-marginal variant — sits in the gutter next to a draft */
function CRMarginalThread({ count = 3 }) {
  return (
    <button style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 10px 6px 8px", border: "1px solid var(--surface-border)", background: "var(--surface-raised)", borderRadius: "var(--radius-pill, 999px)", cursor: "pointer", boxShadow: "var(--shadow-sm)" }}>
      <span style={{ display: "inline-flex" }}>
        <CRAvatar user="ma" size={20} />
        <span style={{ marginLeft: -6 }}><CRAvatar user="jt" size={20} /></span>
      </span>
      <span style={{ fontSize: "0.78rem", color: "var(--text-primary)", fontWeight: 600 }}>{count}</span>
      <LucideIcon name="message-circle" size={12} />
    </button>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Reaction bar
// ════════════════════════════════════════════════════════════════════════

function CRReaction({ emoji, count, mine = false, label }) {
  return (
    <button
      aria-pressed={mine}
      aria-label={`${label} — ${count} ${count === 1 ? "reaction" : "reactions"}${mine ? ", you reacted" : ""}`}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "3px 9px 3px 7px",
        border: `1px solid ${mine ? "var(--brand-primary)" : "var(--surface-border)"}`,
        background: mine ? "color-mix(in srgb, var(--brand-primary) 8%, var(--surface-raised))" : "var(--surface-raised)",
        color: mine ? "var(--brand-primary)" : "var(--text-secondary)",
        borderRadius: "var(--radius-pill, 999px)",
        cursor: "pointer",
        fontFamily: "var(--font-mono)", fontSize: "0.78rem", fontWeight: 600,
        lineHeight: 1.4,
      }}
    >
      <span style={{ fontSize: "0.95rem", lineHeight: 1, fontFamily: "system-ui, sans-serif" }}>{emoji}</span>
      <span>{count}</span>
    </button>
  );
}

function CRReactionBar({ items, showAdd = true }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
      {items.map((r, i) => <CRReaction key={i} {...r} />)}
      {showAdd && (
        <button
          aria-label="Add reaction"
          style={{
            width: 28, height: 28,
            border: "1px dashed var(--surface-border)",
            background: "transparent",
            color: "var(--text-muted)",
            borderRadius: "50%",
            cursor: "pointer",
            display: "inline-flex", alignItems: "center", justifyContent: "center", padding: 0,
          }}
        >
          <LucideIcon name="plus" size={12} />
        </button>
      )}
    </div>
  );
}

/* The full picker affordance — opened by the "+" trigger */
function CRReactionPicker() {
  const choices = [
    { emoji: "👍", label: "Agree" },
    { emoji: "👀", label: "Reviewing" },
    { emoji: "🎯", label: "On target" },
    { emoji: "💡", label: "Insight" },
    { emoji: "❓", label: "Question" },
    { emoji: "⚠️", label: "Concern" },
  ];
  return (
    <div style={{ display: "inline-block", padding: "8px 10px", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)", boxShadow: "var(--shadow-md)" }}>
      <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 6 }}>
        React
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        {choices.map((c, i) => (
          <button
            key={i}
            title={c.label}
            style={{ width: 32, height: 32, border: "1px solid transparent", background: "transparent", borderRadius: "var(--radius-sm)", cursor: "pointer", fontSize: "1.1rem", fontFamily: "system-ui, sans-serif", padding: 0 }}
          >
            {c.emoji}
          </button>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Inline-draft demo — shows everything composed on a draft excerpt
// ════════════════════════════════════════════════════════════════════════

function CRDraftDemo() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 24, alignItems: "start" }}>
      <article>
        <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 8 }}>
          §3.2 · Field measurement protocol
        </div>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.01em", margin: "0 0 14px", color: "var(--text-primary)" }}>
          Calibration of vehicle counters
        </h3>
        <p style={{ fontSize: "0.92rem", lineHeight: 1.7, color: "var(--text-secondary)", margin: "0 0 14px" }}>
          Counters were re-baselined every fourteen days against a reference loop installed in the median of each instrumented segment. The reference loop's count was treated as ground truth for the duration of the calibration window.
        </p>
        <p style={{ position: "relative", fontSize: "0.92rem", lineHeight: 1.7, color: "var(--text-secondary)", margin: "0 0 14px", padding: "8px 12px", background: "color-mix(in srgb, var(--brand-accent) 10%, transparent)", borderLeft: "3px solid var(--brand-accent)", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0" }}>
          Where the counter and reference disagreed by more than 3.5%, the counter was field-serviced before the next data window opened.
          <span style={{ position: "absolute", top: 8, right: -34 }}>
            <CRMarginalThread count={3} />
          </span>
        </p>
        <div style={{ marginTop: 16 }}>
          <CRReactionBar
            items={[
              { emoji: "👀", count: 4, mine: true,  label: "Reviewing" },
              { emoji: "🎯", count: 2, mine: false, label: "On target" },
              { emoji: "❓", count: 1, mine: false, label: "Question" },
            ]}
          />
        </div>
      </article>
      <aside style={{ position: "sticky", top: 20 }}>
        <CRThread status="open" anchor="§3.2 · paragraph 3">
          <CRComment user="jt" time="2 hours ago" body={<>Should we cite the AASHTO procedure here? The 3.5% threshold reads as a TTI house rule otherwise.</>} />
          <CRComment user="ma" time="1 hour ago" isReply body={<>Good catch — adding the reference. Will pull the exact subsection in revision 4.</>} />
          <CRComment user="rh" time="34 min ago" isReply edited body={<>Approved pending the citation.</>} />
        </CRThread>
      </aside>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// PAGE
// ════════════════════════════════════════════════════════════════════════

function CommentReactionPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "comment-thread");
  return (
    <PageShell item={item}>
      <CRIntro>
        Two atoms for the editorial review workflow on long-form research output. <strong>Comment threads</strong> anchor a conversation to a specific paragraph or figure — open / resolved status, threaded replies, marginal indicator. <strong>Reactions</strong> give a lightweight signal where a full comment would be overkill: agreement, attention, concern.
      </CRIntro>

      {/* Comment thread */}
      <CRSectionLabel>Comment thread · full</CRSectionLabel>
      <CRBox label="Open thread — anchored to a draft section">
        <CRThread status="open" anchor="§3.2 · paragraph 4">
          <CRComment user="jt" time="2 hours ago" body={<>Should we cite the AASHTO procedure here? The 3.5% threshold reads as a TTI house rule otherwise.</>} />
          <CRComment user="ma" time="1 hour ago" isReply body={<>Good catch — adding the reference. Will pull the exact subsection in revision 4.</>} />
          <CRComment user="rh" time="34 min ago" isReply edited body={<>Approved pending the citation.</>} />
        </CRThread>
      </CRBox>
      <CRBox label="Resolved thread — collapsed status, kept for audit trail">
        <CRThread status="resolved" anchor="Figure 4.1 caption">
          <CRComment user="dk" time="yesterday" body={<>The legend ordering doesn't match the chart's stack order. Flipping in v4.</>} />
          <CRComment user="dk" time="yesterday" isReply body={<>Done — confirmed against the source CSV.</>} />
        </CRThread>
      </CRBox>

      {/* Marginal indicator */}
      <CRSectionLabel>Comment thread · marginal indicator</CRSectionLabel>
      <CRBox label="Pill-shaped indicator that lives in the document gutter">
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <CRMarginalThread count={1} />
          <CRMarginalThread count={3} />
          <CRMarginalThread count={12} />
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Click to open the thread popover anchored to the paragraph.</span>
        </div>
      </CRBox>

      {/* Reactions */}
      <CRSectionLabel>Reaction bar</CRSectionLabel>
      <CRBox label="Default — applied reactions, mine highlighted">
        <CRReactionBar
          items={[
            { emoji: "👍", count: 8, mine: false, label: "Agree" },
            { emoji: "👀", count: 4, mine: true,  label: "Reviewing" },
            { emoji: "🎯", count: 2, mine: false, label: "On target" },
            { emoji: "❓", count: 1, mine: false, label: "Question" },
          ]}
        />
      </CRBox>
      <CRBox label="Empty state — only the add affordance is shown">
        <CRReactionBar items={[]} />
      </CRBox>
      <CRBox label="Picker — opened from the add affordance">
        <CRReactionPicker />
      </CRBox>

      {/* Composed */}
      <CRSectionLabel>Composed · draft + thread + reactions</CRSectionLabel>
      <CRBox label="Editorial review surface — anchored thread in the right rail, reactions inline">
        <CRDraftDemo />
      </CRBox>

      {/* Reaction vocabulary */}
      <CRSectionLabel>Reaction vocabulary</CRSectionLabel>
      <div style={{ overflow: "hidden", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", marginBottom: 16 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.86rem" }}>
          <thead>
            <tr style={{ background: "var(--surface-sunken)" }}>
              {["Glyph", "Name", "Meaning", "Use when"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", borderBottom: "1px solid var(--surface-border)" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["👍", "Agree",      "Endorse, no further action",          "You read it and concur"],
              ["👀", "Reviewing",  "Acknowledged, will read in detail",   "Triaging a long thread"],
              ["🎯", "On target",  "Hits the brief",                      "Aligns with project goals"],
              ["💡", "Insight",    "New finding worth surfacing",         "Idea reframes a section"],
              ["❓", "Question",   "Open inquiry, no comment yet",        "You'll write a comment shortly"],
              ["⚠️", "Concern",    "Blocks progress, needs a comment",    "Use sparingly — escalates"],
            ].map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} style={{ padding: "10px 14px", borderBottom: i === 5 ? "none" : "1px solid var(--surface-border)", color: j > 1 ? "var(--text-secondary)" : "var(--text-primary)", fontWeight: j === 1 ? 600 : 400, fontSize: j === 0 ? "1.1rem" : "0.86rem", lineHeight: 1.5, fontFamily: j === 0 ? "system-ui, sans-serif" : "inherit" }}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CRSpecRow>
        <CRSpec label="Avatar"          value="oklch · 32px / 26px" note="Author hue derived from user-id hash" />
        <CRSpec label="Status badge"    value="open · resolved" note="Accent for open, success for resolved" />
        <CRSpec label="Reaction set"    value="6 fixed glyphs" note="Curated vocabulary — not free emoji" />
        <CRSpec label="Anchor"          value="Section + ¶ ref" note="Threads survive document re-rendering" />
      </CRSpecRow>
    </PageShell>
  );
}

Object.assign(window, { CommentReactionPage });
