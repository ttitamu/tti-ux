/* global React, PageShell, AGGIE_CATALOG, LucideIcon */
/*
 * AggieBanners.jsx — Batch 20:
 *   Announcement banner (overlay)
 *   Cookie consent (overlay)
 *   Beta ribbon (overlay)
 *   Badges, chips, tags (component primitives)
 *
 * The "page-edge chrome and inline status atoms" family. Buttons + form
 * controls remain Work Sans 700 uppercase regardless of style variant —
 * these atoms inherit that vocabulary.
 *
 * Helper prefix: BN.
 */

const { useState: _bnUseState, useEffect: _bnUseEffect } = React;

// ════════════════════════════════════════════════════════════════════════
// Shared helpers (BN prefix)
// ════════════════════════════════════════════════════════════════════════

function BNBox({ dark = false, label, padded = true, children }) {
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
      <div style={{ padding: padded ? 28 : 0, background: dark ? "var(--brand-primary)" : "var(--surface-page)" }}>{children}</div>
    </div>
  );
}

function BNSectionLabel({ children }) {
  return (
    <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 12, marginTop: 16 }}>{children}</div>
  );
}

function BNSpecRow({ children }) {
  return (
    <div style={{ marginTop: 28, padding: "14px 18px", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>{children}</div>
  );
}

function BNSpec({ label, value, note }) {
  return (
    <div>
      <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--brand-primary)", marginTop: 3, fontWeight: 500 }}>{value}</div>
      {note && <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 2, lineHeight: 1.4 }}>{note}</div>}
    </div>
  );
}

function BNIntro({ children }) {
  return (
    <div style={{ padding: "16px 20px", marginBottom: 28, background: "color-mix(in srgb, var(--brand-primary) 5%, transparent)", borderLeft: "3px solid var(--brand-primary)", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0", fontSize: "0.92rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>
      {children}
    </div>
  );
}

// Style signature — only used by announcement-banner (style-aware).
function BNStyleSig({ style, width = 60, color = "var(--brand-primary)", accent = "var(--brand-accent)" }) {
  if (style === "bold") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <div style={{ width: width * 0.55, height: 4, background: color, borderRadius: 2 }} />
        <div style={{ width: width * 0.18, height: 4, background: color, borderRadius: 2, opacity: 0.5 }} />
        <div style={{ width: width * 0.08, height: 4, background: color, borderRadius: 2, opacity: 0.25 }} />
      </div>
    );
  }
  if (style === "elegant") {
    return (
      <div style={{
        width, height: 5,
        backgroundImage: `repeating-linear-gradient(135deg, ${accent} 0 1px, transparent 1px 4px)`,
        WebkitMaskImage: "linear-gradient(90deg, transparent, black 15%, black 85%, transparent)",
        maskImage: "linear-gradient(90deg, transparent, black 15%, black 85%, transparent)",
      }} />
    );
  }
  return (
    <div style={{ width, height: 1, background: `linear-gradient(90deg, transparent 0%, ${color} 15%, ${color} 85%, transparent 100%)` }} />
  );
}

// ════════════════════════════════════════════════════════════════════════
// 1 — AnnouncementBannerPage
// ════════════════════════════════════════════════════════════════════════

const ANNOUNCE_TONES = {
  info:     { label: "Info",     icon: "info",        bg: "color-mix(in srgb, var(--brand-primary) 4%, var(--surface-page))", border: "var(--brand-primary)",  fg: "var(--text-primary)",   accent: "var(--brand-primary)" },
  advisory: { label: "Advisory", icon: "alert-circle", bg: "color-mix(in srgb, var(--brand-accent) 8%, var(--surface-page))",  border: "var(--brand-accent)",   fg: "var(--text-primary)",   accent: "var(--brand-accent)" },
  urgent:   { label: "Urgent",   icon: "alert-triangle", bg: "var(--brand-primary)",                                            border: "var(--brand-primary)",  fg: "#FFFFFF",               accent: "#FFFFFF" },
};

function AnnouncementBanner({ tone = "info", style = "default", title, body, action, onDismiss, host = "tti.tamu.edu" }) {
  const t = ANNOUNCE_TONES[tone];
  const isUrgent = tone === "urgent";
  return (
    <div style={{
      background: t.bg,
      borderTop: isUrgent ? "none" : `2px solid ${t.border}`,
      borderBottom: `1px solid ${isUrgent ? "rgba(255,255,255,0.15)" : "var(--surface-border)"}`,
      color: t.fg,
      position: "relative",
    }}>
      <div style={{ padding: "14px 24px", display: "flex", alignItems: "flex-start", gap: 14, maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ flexShrink: 0, marginTop: 2, color: t.accent, display: "flex", alignItems: "center", justifyContent: "center", width: 22, height: 22 }}>
          <LucideIcon name={t.icon} size={20} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: title && body ? 4 : 0, flexWrap: "wrap" }}>
            <span style={{
              fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em",
              fontFamily: "var(--font-body-bold)",
              padding: "2px 8px",
              border: `1px solid ${isUrgent ? "rgba(255,255,255,0.55)" : t.accent}`,
              color: isUrgent ? "#FFFFFF" : t.accent,
              background: isUrgent ? "rgba(255,255,255,0.08)" : "transparent",
            }}>{t.label}</span>
            {title && (
              <span style={{
                fontFamily: style === "elegant" ? "var(--font-elegant, Georgia, serif)" : style === "bold" ? "var(--font-body-bold)" : "var(--font-display)",
                fontStyle: style === "elegant" ? "italic" : "normal",
                fontWeight: style === "bold" ? 700 : 500,
                textTransform: style === "elegant" ? "none" : "uppercase",
                letterSpacing: style === "elegant" ? 0 : "0.02em",
                fontSize: "0.95rem",
                lineHeight: 1.25,
              }}>{title}</span>
            )}
          </div>
          {body && (
            <div style={{ fontSize: "0.86rem", lineHeight: 1.5, color: isUrgent ? "rgba(255,255,255,0.92)" : "var(--text-secondary)" }}>
              {body}
            </div>
          )}
        </div>
        {action && (
          <a href="#" onClick={(e) => e.preventDefault()} style={{
            flexShrink: 0,
            fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em",
            fontFamily: "var(--font-body-bold)",
            color: isUrgent ? "#FFFFFF" : t.accent,
            border: `1px solid ${isUrgent ? "#FFFFFF" : t.accent}`,
            padding: "8px 14px", textDecoration: "none",
            background: "transparent", cursor: "pointer",
            display: "inline-flex", alignItems: "center", gap: 6,
            whiteSpace: "nowrap",
          }}>
            {action} <LucideIcon name="arrow-right" size={13} />
          </a>
        )}
        {onDismiss && (
          <button onClick={onDismiss} aria-label="Dismiss" style={{
            flexShrink: 0,
            background: "transparent",
            border: "none",
            color: isUrgent ? "rgba(255,255,255,0.85)" : "var(--text-muted)",
            cursor: "pointer",
            padding: 4,
            display: "flex", alignItems: "center", justifyContent: "center",
            marginTop: 2,
          }}>
            <LucideIcon name="x" size={18} />
          </button>
        )}
      </div>
      {/* host strip — quick reminder of which site is broadcasting */}
      <div style={{
        padding: "4px 24px",
        fontSize: "0.62rem", fontFamily: "var(--font-mono)",
        textTransform: "uppercase", letterSpacing: "0.1em",
        color: isUrgent ? "rgba(255,255,255,0.55)" : "var(--text-muted)",
        borderTop: `1px solid ${isUrgent ? "rgba(255,255,255,0.1)" : "var(--surface-border)"}`,
        background: isUrgent ? "rgba(0,0,0,0.18)" : "transparent",
        maxWidth: "none", textAlign: "right",
      }}>
        broadcast · {host}
      </div>
    </div>
  );
}

function AnnouncementBannerPage() {
  const item = AGGIE_CATALOG.find(c => c.id === "announcement-banner");
  const [dismissed, setDismissed] = _bnUseState({});
  const dismiss = (k) => setDismissed(d => ({ ...d, [k]: true }));

  return (
    <PageShell item={item}>
      <BNIntro>
        Top-of-page institutional banner. Three tones, three style voices, and a host strip identifying which TTI/TAMU site is broadcasting. Sits <em>above</em> the utility nav — never inside the article body. Use sparingly: at most one banner active per session.
      </BNIntro>

      <BNSectionLabel>Three tones</BNSectionLabel>

      <BNBox label="info — research milestones, publications, deadline reminders">
        <FrameStrip>
          {!dismissed.info && (
            <AnnouncementBanner
              tone="info"
              style="default"
              title="2026 Research Awards open for nominations"
              body="Submit through the Faculty portal by April 15. Two new categories this cycle — Connected Mobility and Resilient Infrastructure."
              action="Nominate"
              onDismiss={() => dismiss("info")}
            />
          )}
          {dismissed.info && <FrameDismissedNote onReset={() => dismiss("info")} />}
        </FrameStrip>
      </BNBox>

      <BNBox label="advisory — schedule disruptions, system maintenance, advisories">
        <FrameStrip>
          {!dismissed.advisory && (
            <AnnouncementBanner
              tone="advisory"
              style="default"
              title="Bryan-CS proving ground closed Apr 30 – May 2"
              body="Quarterly maintenance affects all reservation slots. Bryan-NW remains available; reroute requests via the scheduling desk."
              action="Reschedule"
              onDismiss={() => dismiss("advisory")}
            />
          )}
          {dismissed.advisory && <FrameDismissedNote onReset={() => dismiss("advisory")} />}
        </FrameStrip>
      </BNBox>

      <BNBox label="urgent — code-maroon-adjacent advisories, weather, safety, system outages">
        <FrameStrip>
          {!dismissed.urgent && (
            <AnnouncementBanner
              tone="urgent"
              style="default"
              title="Severe weather closure — Riverside campus"
              body="All TTI buildings on the Riverside campus will be closed through 6 PM. Field operations stand down. See TAMU Code Maroon for safety guidance."
              action="Status page"
              onDismiss={() => dismiss("urgent")}
            />
          )}
          {dismissed.urgent && <FrameDismissedNote onReset={() => dismiss("urgent")} />}
        </FrameStrip>
      </BNBox>

      <BNSectionLabel>Style variants — info banner across the three voices</BNSectionLabel>

      <BNBox label="default — Oswald display title, hairline accent">
        <FrameStrip>
          <AnnouncementBanner
            tone="info"
            style="default"
            title="Quarterly impact report now published"
            body="Findings from 84 active studies, in one downloadable digest."
            action="Read"
          />
        </FrameStrip>
      </BNBox>

      <BNBox label="bold — Work Sans bold-italic title">
        <FrameStrip>
          <AnnouncementBanner
            tone="info"
            style="bold"
            title="Quarterly impact report now published"
            body="Findings from 84 active studies, in one downloadable digest."
            action="Read"
          />
        </FrameStrip>
      </BNBox>

      <BNBox label="elegant — Georgia italic title">
        <FrameStrip>
          <AnnouncementBanner
            tone="info"
            style="elegant"
            title="Quarterly impact report now published"
            body="Findings from 84 active studies, in one downloadable digest."
            action="Read"
          />
        </FrameStrip>
      </BNBox>

      <BNSectionLabel>Compact variant — title-only</BNSectionLabel>

      <BNBox label="single-line — when there's no body copy, the banner stays compact">
        <FrameStrip>
          <AnnouncementBanner
            tone="info"
            style="default"
            title="Submission window for 2026 grants closes Friday"
            action="Submit"
          />
        </FrameStrip>
      </BNBox>

      <BNSpecRow>
        <BNSpec label="placement"      value="above utility-nav" note="Banner is the topmost row of the document, full bleed." />
        <BNSpec label="dismiss"        value="per-session" note="Dismissed state stored under sessionStorage[`banner:${id}`]; resets on new tab." />
        <BNSpec label="active limit"   value="1 banner / page" note="Show the highest-tone unread banner; queue the rest for the In-Tray overlay." />
        <BNSpec label="urgent fallback" value="Code Maroon" note="True emergencies (weather, safety) defer to the system Code Maroon banner — see Specialized." />
      </BNSpecRow>
    </PageShell>
  );
}

// Simulated browser frame — keeps the banner anchored to a fake page chrome
// so it doesn't read as just another card.
function FrameStrip({ children }) {
  return (
    <div style={{ border: "1px solid var(--surface-border)", borderRadius: "var(--radius-sm)", overflow: "hidden", background: "var(--surface-page)" }}>
      <div style={{
        padding: "8px 12px", display: "flex", alignItems: "center", gap: 8,
        background: "var(--surface-sunken)", borderBottom: "1px solid var(--surface-border)",
      }}>
        <div style={{ display: "flex", gap: 6 }}>
          {["#E55", "#FB3", "#7C7"].map((c, i) => <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: c, opacity: 0.45 }} />)}
        </div>
        <div style={{
          flex: 1, height: 18, borderRadius: 3, background: "var(--surface-page)",
          border: "1px solid var(--surface-border)",
          fontSize: "0.65rem", fontFamily: "var(--font-mono)", color: "var(--text-muted)",
          padding: "0 8px", display: "flex", alignItems: "center",
        }}>tti.tamu.edu/research</div>
      </div>
      {children}
      {/* faux page below banner */}
      <div style={{ padding: "32px 24px 40px", background: "var(--surface-page)" }}>
        <div style={{ width: 220, height: 12, background: "var(--surface-sunken)", borderRadius: 2, marginBottom: 14 }} />
        <div style={{ width: 380, height: 22, background: "var(--surface-sunken)", borderRadius: 2, marginBottom: 12 }} />
        <div style={{ width: 460, height: 8, background: "var(--surface-sunken)", borderRadius: 2, marginBottom: 6, opacity: 0.7 }} />
        <div style={{ width: 420, height: 8, background: "var(--surface-sunken)", borderRadius: 2, opacity: 0.7 }} />
      </div>
    </div>
  );
}

function FrameDismissedNote({ onReset }) {
  return (
    <div style={{ padding: "12px 24px", borderBottom: "1px solid var(--surface-border)", background: "var(--surface-sunken)", fontSize: "0.78rem", color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ fontFamily: "var(--font-mono)" }}>banner dismissed</span>
      <button onClick={onReset} style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "var(--font-body-bold)", color: "var(--brand-primary)", background: "transparent", border: "1px solid var(--brand-primary)", padding: "4px 10px", cursor: "pointer" }}>Restore</button>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 2 — CookieConsentPage
// ════════════════════════════════════════════════════════════════════════

function CookieConsent({ expanded = false, onToggle, onAccept, onEssential }) {
  const [prefs, setPrefs] = _bnUseState({ essential: true, analytics: true, research: false });
  const togglePref = (k) => setPrefs(p => ({ ...p, [k]: !p[k] }));

  return (
    <div style={{
      borderTop: "3px solid var(--brand-primary)",
      background: "var(--surface-page)",
      boxShadow: "0 -10px 30px -8px rgba(0,0,0,0.12)",
    }}>
      <div style={{ padding: "20px 28px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: expanded ? "1fr" : "1fr auto", gap: 24, alignItems: "flex-start" }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ color: "var(--brand-primary)", display: "flex" }}><LucideIcon name="cookie" size={18} /></div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--text-primary)" }}>
                Cookies on TTI sites
              </div>
            </div>
            <div style={{ fontSize: "0.84rem", lineHeight: 1.55, color: "var(--text-secondary)", maxWidth: 720 }}>
              We use cookies to keep TTI sites running, measure how research content is used, and remember your preferences. Some cookies are set by Texas A&amp;M University System partners. Read the{" "}
              <a href="#" onClick={(e) => e.preventDefault()} style={{ color: "var(--brand-primary)", fontWeight: 500 }}>privacy notice</a>{" "}
              or the{" "}
              <a href="#" onClick={(e) => e.preventDefault()} style={{ color: "var(--brand-primary)", fontWeight: 500 }}>full cookie policy</a>.
            </div>

            {expanded && (
              <div style={{ marginTop: 18, border: "1px solid var(--surface-border)", borderRadius: "var(--radius-sm)", overflow: "hidden" }}>
                <CookieRow
                  title="Essential"
                  body="Authentication, session, security. These are always on — turning them off would break login and CSRF protection."
                  count="4 cookies"
                  required
                  on={prefs.essential}
                  onToggle={() => {}}
                />
                <CookieRow
                  title="Analytics"
                  body="Aggregate site analytics — which research pages people read, where they come from. No identifiable data leaves Texas A&amp;M servers."
                  count="6 cookies"
                  on={prefs.analytics}
                  onToggle={() => togglePref("analytics")}
                />
                <CookieRow
                  title="Research personalization"
                  body="Remembers your saved searches, recently viewed publications, and faculty bookmarks across visits. Only stored locally."
                  count="3 cookies"
                  on={prefs.research}
                  onToggle={() => togglePref("research")}
                  last
                />
              </div>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: expanded ? "row" : "column", gap: 8, justifyContent: expanded ? "flex-end" : "flex-start", flexWrap: "wrap", marginTop: expanded ? 12 : 0 }}>
            <CookieBtn variant="primary" onClick={onAccept}>Accept all</CookieBtn>
            <CookieBtn variant="secondary" onClick={onEssential}>Essential only</CookieBtn>
            <CookieBtn variant="ghost" onClick={onToggle}>{expanded ? "Hide details" : "Customize"}</CookieBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

function CookieRow({ title, body, count, required, on, onToggle, last }) {
  return (
    <div style={{ padding: "14px 18px", borderBottom: last ? "none" : "1px solid var(--surface-border)", display: "grid", gridTemplateColumns: "1fr auto", gap: 18, alignItems: "flex-start" }}>
      <div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 3 }}>
          <span style={{ fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.85rem", color: "var(--text-primary)" }}>{title}</span>
          {required && <span style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>Required</span>}
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-muted)", marginLeft: "auto" }}>{count}</span>
        </div>
        <div style={{ fontSize: "0.78rem", lineHeight: 1.55, color: "var(--text-secondary)" }}>{body}</div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        disabled={required}
        onClick={onToggle}
        style={{
          width: 40, height: 22, borderRadius: 11, border: "none",
          background: on ? "var(--brand-primary)" : "var(--surface-border)",
          cursor: required ? "not-allowed" : "pointer", opacity: required ? 0.55 : 1,
          padding: 0, position: "relative", flexShrink: 0,
        }}
      >
        <span style={{
          position: "absolute", top: 3, left: on ? 21 : 3,
          width: 16, height: 16, borderRadius: "50%", background: "#FFFFFF",
          transition: "left 0.18s ease", boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
        }} />
      </button>
    </div>
  );
}

function CookieBtn({ variant, onClick, children }) {
  const styles = {
    primary:   { background: "var(--brand-primary)", color: "#FFF",                      border: "1px solid var(--brand-primary)" },
    secondary: { background: "transparent",          color: "var(--brand-primary)",      border: "1px solid var(--brand-primary)" },
    ghost:     { background: "transparent",          color: "var(--text-secondary)",     border: "1px solid var(--surface-border)" },
  }[variant];
  return (
    <button onClick={onClick} style={{
      ...styles,
      padding: "10px 18px",
      fontFamily: "var(--font-body-bold)", fontWeight: 700,
      fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: "0.12em",
      cursor: "pointer", whiteSpace: "nowrap",
    }}>{children}</button>
  );
}

function CookieConsentPage() {
  const item = AGGIE_CATALOG.find(c => c.id === "cookie-consent");
  const [expanded, setExpanded] = _bnUseState(false);
  const [state, setState] = _bnUseState("idle"); // idle | accepted-all | essential-only

  return (
    <PageShell item={item}>
      <BNIntro>
        Bottom-anchored consent strip. Texas A&amp;M System sites operate under the state's privacy framework — consent here is informational rather than legally gating, but the same UI applies to TTI's tools that integrate third-party analytics. <strong>Customize</strong> opens a panel with toggles per cookie group.
      </BNIntro>

      <BNSectionLabel>Live demo — toggle Customize to see expanded form</BNSectionLabel>

      <BNBox label="anchored at bottom-of-viewport" padded={false}>
        <div style={{ background: "var(--surface-sunken)", padding: 24 }}>
          <div style={{ height: 220, background: "var(--surface-page)", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-sm)", padding: 20, color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: 0 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: 8 }}>page content</div>
            <div style={{ width: 280, height: 14, background: "var(--surface-sunken)", borderRadius: 2, marginBottom: 10 }} />
            <div style={{ width: 360, height: 8, background: "var(--surface-sunken)", borderRadius: 2, marginBottom: 6 }} />
            <div style={{ width: 320, height: 8, background: "var(--surface-sunken)", borderRadius: 2, marginBottom: 6 }} />
            <div style={{ width: 380, height: 8, background: "var(--surface-sunken)", borderRadius: 2 }} />
          </div>
          {state === "idle" ? (
            <CookieConsent
              expanded={expanded}
              onToggle={() => setExpanded(!expanded)}
              onAccept={() => setState("accepted-all")}
              onEssential={() => setState("essential-only")}
            />
          ) : (
            <div style={{ borderTop: "3px solid var(--brand-primary)", background: "var(--surface-page)", padding: "16px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                <strong style={{ color: "var(--text-primary)", fontFamily: "var(--font-body-bold)" }}>Preferences saved.</strong>{" "}
                {state === "accepted-all" ? "All cookie groups enabled." : "Only essential cookies will be set."}
              </div>
              <button onClick={() => { setState("idle"); setExpanded(false); }} style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "var(--font-body-bold)", color: "var(--brand-primary)", background: "transparent", border: "1px solid var(--brand-primary)", padding: "6px 12px", cursor: "pointer" }}>Show again</button>
            </div>
          )}
        </div>
      </BNBox>

      <BNSectionLabel>Compact (collapsed) state</BNSectionLabel>
      <BNBox label="single-row layout — message + three actions, no detail">
        <CookieConsent expanded={false} onToggle={() => {}} onAccept={() => {}} onEssential={() => {}} />
      </BNBox>

      <BNSpecRow>
        <BNSpec label="position"  value="fixed bottom" note="z-index 60. Above page content, below modal scrim." />
        <BNSpec label="storage"   value="localStorage" note="Saved preferences keyed under tti.cookieConsent.v2." />
        <BNSpec label="categories" value="3 standard" note="Essential (always on) · Analytics · Research personalization." />
        <BNSpec label="resurface" value="13 months" note="Renewal interval per TAMUS guidance; users can also revisit via the footer link." />
      </BNSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 3 — BetaRibbonPage
// ════════════════════════════════════════════════════════════════════════

const BETA_KINDS = {
  beta:    { label: "Beta",    color: "var(--brand-accent)" },
  alpha:   { label: "Alpha",   color: "#A5471F" },
  preview: { label: "Preview", color: "var(--brand-primary)" },
};

function BetaCornerRibbon({ kind = "beta" }) {
  const k = BETA_KINDS[kind];
  return (
    <div style={{
      position: "absolute", top: 0, right: 0, width: 130, height: 130, overflow: "hidden", pointerEvents: "none",
    }}>
      <div style={{
        position: "absolute",
        top: 24, right: -32,
        width: 170,
        background: k.color,
        color: "#FFFFFF",
        textAlign: "center",
        padding: "5px 0",
        transform: "rotate(45deg)",
        fontFamily: "var(--font-body-bold)", fontWeight: 700,
        fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.18em",
        boxShadow: "0 2px 6px rgba(0,0,0,0.18)",
      }}>{k.label}</div>
    </div>
  );
}

function BetaInlineBanner({ kind = "beta", productName = "PECAN", feedbackUrl = "#" }) {
  const k = BETA_KINDS[kind];
  return (
    <div style={{
      background: "color-mix(in srgb, var(--brand-accent) 7%, var(--surface-page))",
      borderBottom: `1px solid var(--surface-border)`,
      borderTop: `2px solid ${k.color}`,
      padding: "10px 24px",
      display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap",
    }}>
      <span style={{
        fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em",
        fontFamily: "var(--font-body-bold)",
        padding: "3px 9px", color: "#FFFFFF", background: k.color,
      }}>{k.label}</span>
      <span style={{ fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>
        <strong style={{ color: "var(--text-primary)", fontFamily: "var(--font-body-bold)" }}>{productName}</strong> is in {k.label.toLowerCase()} — interfaces, data exports, and integrations may change without notice.
      </span>
      <a href={feedbackUrl} onClick={(e) => e.preventDefault()} style={{
        marginLeft: "auto",
        fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em",
        fontFamily: "var(--font-body-bold)", color: "var(--brand-primary)",
        textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6,
        padding: "6px 12px", border: "1px solid var(--brand-primary)",
      }}>
        Send feedback <LucideIcon name="external-link" size={12} />
      </a>
    </div>
  );
}

function BetaStackedBanner({ kind = "beta", productName = "PECAN" }) {
  const k = BETA_KINDS[kind];
  return (
    <div style={{
      borderTop: `3px solid ${k.color}`,
      background: "var(--surface-raised)",
      borderBottom: "1px solid var(--surface-border)",
      padding: "18px 28px",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{
              fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em",
              fontFamily: "var(--font-body-bold)",
              padding: "3px 9px", color: "#FFFFFF", background: k.color,
            }}>{k.label}</span>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.02em", fontWeight: 500, color: "var(--text-primary)" }}>
              {productName} — pre-release access
            </span>
          </div>
          <div style={{ fontSize: "0.85rem", lineHeight: 1.55, color: "var(--text-secondary)", maxWidth: 580 }}>
            You're using a working preview. Data is real but interfaces will change. Help us improve the release: report issues, share feedback, or join the user-research panel.
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <CookieBtn variant="primary">Send feedback</CookieBtn>
          <CookieBtn variant="secondary">Release notes</CookieBtn>
          <CookieBtn variant="ghost">Join panel</CookieBtn>
        </div>
      </div>
    </div>
  );
}

function BetaRibbonPage() {
  const item = AGGIE_CATALOG.find(c => c.id === "beta-ribbon");
  return (
    <PageShell item={item}>
      <BNIntro>
        Pre-release flag for internal/research apps. Three variants: a corner ribbon for visual flair, an inline banner for top-of-page persistence, and a stacked banner for first-launch onboarding. Each pairs with a feedback channel — beta state without a way to report bugs is just a label.
      </BNIntro>

      <BNSectionLabel>Corner ribbon — top-right of an app's hero or login</BNSectionLabel>

      <BNBox label="three kinds — beta · alpha · preview">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {["beta", "alpha", "preview"].map(k => (
            <div key={k} style={{ position: "relative", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-sm)", height: 200, background: "var(--surface-raised)", overflow: "hidden", padding: 22 }}>
              <BetaCornerRibbon kind={k} />
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: 8 }}>app login screen</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.02em", color: "var(--text-primary)", marginBottom: 6 }}>PECAN</div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: 14 }}>Sign in with TAMU credentials.</div>
              <div style={{ width: "100%", height: 36, border: "1px solid var(--surface-border)", borderRadius: 3, background: "var(--surface-page)", marginBottom: 8 }} />
              <div style={{ width: "100%", height: 36, background: "var(--brand-primary)", borderRadius: 3 }} />
            </div>
          ))}
        </div>
      </BNBox>

      <BNSectionLabel>Inline banner — persistent reminder above app content</BNSectionLabel>
      <BNBox label="beta — paired with a Send feedback action" padded={false}>
        <BetaInlineBanner kind="beta" productName="PECAN" />
        <FauxAppShell title="Field Studies" />
      </BNBox>
      <BNBox label="alpha — louder, fewer assurances about data persistence" padded={false}>
        <BetaInlineBanner kind="alpha" productName="Lyceum" />
        <FauxAppShell title="Pavement Sensor Lab" />
      </BNBox>

      <BNSectionLabel>Stacked banner — first-launch onboarding</BNSectionLabel>
      <BNBox label="full-feedback variant — appears the first time a user visits" padded={false}>
        <BetaStackedBanner kind="beta" productName="PECAN" />
        <FauxAppShell title="Project Dashboard" />
      </BNBox>

      <BNSpecRow>
        <BNSpec label="kinds"      value="beta · alpha · preview" note="Each maps to a recognizable color — accent gold (beta), rust (alpha), maroon (preview)." />
        <BNSpec label="placement"  value="page-level"             note="One per app, attached to either the hero, the chrome, or the first-launch shell." />
        <BNSpec label="feedback"   value="required"               note="Each variant includes a feedback path — issue tracker, panel signup, or release notes." />
        <BNSpec label="dismiss"    value="never"                  note="Beta status persists until the app graduates. The inline banner can collapse but doesn't disappear." />
      </BNSpecRow>
    </PageShell>
  );
}

function FauxAppShell({ title }) {
  return (
    <div style={{ padding: "24px 28px", background: "var(--surface-page)" }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: 8 }}>app · {title.toLowerCase()}</div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.02em", color: "var(--text-primary)", marginBottom: 14 }}>{title}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ height: 96, background: "var(--surface-raised)", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-sm)", padding: 14 }}>
            <div style={{ width: 60, height: 8, background: "var(--surface-sunken)", borderRadius: 2, marginBottom: 8 }} />
            <div style={{ width: 40, height: 18, background: "var(--surface-sunken)", borderRadius: 2 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 4 — BadgeChipTagPage
// ════════════════════════════════════════════════════════════════════════

const TONE_MAP = {
  neutral: { fg: "var(--text-secondary)",      bg: "var(--surface-sunken)",                                     border: "var(--surface-border)" },
  brand:   { fg: "var(--brand-primary)",       bg: "color-mix(in srgb, var(--brand-primary) 9%, transparent)",  border: "color-mix(in srgb, var(--brand-primary) 30%, transparent)" },
  accent:  { fg: "#7A4A0F",                    bg: "color-mix(in srgb, var(--brand-accent) 22%, transparent)",  border: "color-mix(in srgb, var(--brand-accent) 50%, transparent)" },
  success: { fg: "#1F6240",                    bg: "color-mix(in srgb, var(--color-success) 14%, transparent)", border: "color-mix(in srgb, var(--color-success) 36%, transparent)" },
  warning: { fg: "#7A4A0F",                    bg: "color-mix(in srgb, var(--color-warning) 16%, transparent)", border: "color-mix(in srgb, var(--color-warning) 40%, transparent)" },
  danger:  { fg: "#8E1E1E",                    bg: "color-mix(in srgb, var(--color-danger) 12%, transparent)",  border: "color-mix(in srgb, var(--color-danger) 35%, transparent)" },
};

// ── Badge — small numeric / dot indicator on icons or avatars
function Badge({ count, dot = false, max = 99, anchor }) {
  if (dot) {
    return <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "var(--color-danger)", border: "1.5px solid var(--surface-page)", verticalAlign: "middle" }} />;
  }
  const display = count > max ? `${max}+` : count;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      minWidth: 18, height: 18, padding: "0 5px",
      background: "var(--color-danger)", color: "#FFFFFF",
      fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: "0.65rem", lineHeight: 1,
      borderRadius: 9, border: "1.5px solid var(--surface-page)",
    }}>{display}</span>
  );
}

// ── Chip — interactive (filter, removable, choice)
function Chip({ children, tone = "neutral", removable, on, onClick, onRemove, leadingIcon, size = "md" }) {
  const t = TONE_MAP[tone];
  const padding = size === "sm" ? "3px 10px" : "5px 12px";
  const fontSize = size === "sm" ? "0.7rem" : "0.78rem";

  // Selected (chip-on) state — fills with brand
  const selectedStyle = on ? {
    background: "var(--brand-primary)", color: "#FFFFFF", border: "1px solid var(--brand-primary)",
  } : {
    background: t.bg, color: t.fg, border: `1px solid ${t.border}`,
  };
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...selectedStyle,
        display: "inline-flex", alignItems: "center", gap: 6,
        padding, fontSize,
        fontFamily: "var(--font-body-bold)", fontWeight: 600,
        cursor: onClick ? "pointer" : "default",
        height: size === "sm" ? 24 : 28,
      }}
    >
      {leadingIcon && <LucideIcon name={leadingIcon} size={size === "sm" ? 11 : 13} />}
      <span>{children}</span>
      {removable && (
        <span
          onClick={(e) => { e.stopPropagation(); onRemove && onRemove(); }}
          style={{ marginLeft: 2, opacity: 0.75, display: "inline-flex" }}
        >
          <LucideIcon name="x" size={size === "sm" ? 12 : 13} />
        </span>
      )}
    </button>
  );
}

// ── Tag — semantic, non-interactive label for content metadata
function Tag({ children, tone = "neutral", size = "md" }) {
  const t = TONE_MAP[tone];
  const padding = size === "sm" ? "1px 7px" : "2px 9px";
  const fontSize = size === "sm" ? "0.6rem" : "0.68rem";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding, fontSize,
      fontFamily: "var(--font-body-bold)", fontWeight: 700,
      textTransform: "uppercase", letterSpacing: "0.1em",
      color: t.fg, background: t.bg,
      border: `1px solid ${t.border}`,
    }}>{children}</span>
  );
}

function BadgeChipTagPage() {
  const item = AGGIE_CATALOG.find(c => c.id === "badge-chip-tag");
  const [chips, setChips] = _bnUseState(["Mobility", "Connected vehicles", "2024"]);
  const [filters, setFilters] = _bnUseState({ recent: true, peer: false, openAccess: true });
  const [size, setSize] = _bnUseState("md");

  return (
    <PageShell item={item}>
      <BNIntro>
        Three primitives, one family. <strong>Badges</strong> are tiny indicators that sit on icons or avatars (a notification count, an unread dot). <strong>Chips</strong> are interactive — they filter, toggle, or remove. <strong>Tags</strong> are semantic and read-only — they describe content (a tone-coded research domain, a publication year). Same color tones across all three, same uppercase voice on chips and tags.
      </BNIntro>

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        <div style={{ display: "inline-flex", border: "1px solid var(--surface-border)", borderRadius: 3, overflow: "hidden", background: "var(--surface-page)" }}>
          {["sm", "md"].map(s => (
            <button key={s} onClick={() => setSize(s)} style={{
              padding: "5px 12px", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em",
              fontFamily: "var(--font-body-bold)", border: "none", cursor: "pointer",
              background: size === s ? "var(--brand-primary)" : "transparent",
              color: size === s ? "#FFFFFF" : "var(--text-secondary)",
            }}>{s}</button>
          ))}
        </div>
      </div>

      {/* ─── Badges ─── */}
      <BNSectionLabel>Badges — numeric indicator + dot variant</BNSectionLabel>
      <BNBox label="badges sit on icons, avatars, or nav items">
        <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
          <div style={{ position: "relative", display: "inline-flex", padding: 8, border: "1px solid var(--surface-border)", borderRadius: "var(--radius-sm)" }}>
            <LucideIcon name="bell" size={20} />
            <span style={{ position: "absolute", top: 2, right: 2 }}><Badge count={3} /></span>
          </div>
          <div style={{ position: "relative", display: "inline-flex", padding: 8, border: "1px solid var(--surface-border)", borderRadius: "var(--radius-sm)" }}>
            <LucideIcon name="inbox" size={20} />
            <span style={{ position: "absolute", top: 2, right: 2 }}><Badge count={42} /></span>
          </div>
          <div style={{ position: "relative", display: "inline-flex", padding: 8, border: "1px solid var(--surface-border)", borderRadius: "var(--radius-sm)" }}>
            <LucideIcon name="message-square" size={20} />
            <span style={{ position: "absolute", top: 2, right: 2 }}><Badge count={128} max={99} /></span>
          </div>
          <div style={{ position: "relative", display: "inline-flex", padding: 8, border: "1px solid var(--surface-border)", borderRadius: "var(--radius-sm)" }}>
            <LucideIcon name="user" size={20} />
            <span style={{ position: "absolute", top: 2, right: 2 }}><Badge dot /></span>
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "4px 14px", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-sm)" }}>
            <span style={{ fontSize: "0.85rem", fontFamily: "var(--font-body-bold)", fontWeight: 600 }}>Inbox</span>
            <Badge count={7} />
          </div>
        </div>
      </BNBox>

      {/* ─── Chips ─── */}
      <BNSectionLabel>Chips — interactive filter / removable / choice</BNSectionLabel>
      <BNBox label="filter chips — toggle on/off, multi-select">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            { id: "recent", label: "Last 12 months" },
            { id: "peer", label: "Peer-reviewed" },
            { id: "openAccess", label: "Open access" },
            { id: "tti", label: "TTI authors" },
            { id: "txdot", label: "TxDOT-funded" },
          ].map(({ id, label }) => (
            <Chip
              key={id}
              size={size}
              on={filters[id]}
              onClick={() => setFilters(f => ({ ...f, [id]: !f[id] }))}
              leadingIcon={filters[id] ? "check" : null}
            >{label}</Chip>
          ))}
        </div>
      </BNBox>

      <BNBox label="removable chips — applied filters with × handle">
        {chips.length === 0 ? (
          <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontStyle: "italic" }}>No filters applied.</div>
        ) : (
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: "var(--font-body-bold)", color: "var(--text-muted)", marginRight: 4 }}>Applied:</span>
            {chips.map(c => (
              <Chip key={c} size={size} tone="brand" removable onRemove={() => setChips(chips.filter(x => x !== c))}>{c}</Chip>
            ))}
            <button onClick={() => setChips([])} style={{
              marginLeft: 4, fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em",
              fontFamily: "var(--font-body-bold)", color: "var(--brand-primary)",
              background: "transparent", border: "none", cursor: "pointer", padding: "4px 6px",
            }}>Clear all</button>
          </div>
        )}
      </BNBox>

      <BNBox label="choice chips — single-select segmented from a list">
        <ChoiceChipDemo size={size} />
      </BNBox>

      {/* ─── Tags ─── */}
      <BNSectionLabel>Tags — semantic, tone-coded, non-interactive</BNSectionLabel>
      <BNBox label="six tones — each maps to a content category">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Tag size={size} tone="neutral">Methodology</Tag>
          <Tag size={size} tone="brand">Mobility</Tag>
          <Tag size={size} tone="accent">Featured</Tag>
          <Tag size={size} tone="success">Published</Tag>
          <Tag size={size} tone="warning">In review</Tag>
          <Tag size={size} tone="danger">Withdrawn</Tag>
        </div>
      </BNBox>

      <BNBox label="in context — a publication card with metadata tags">
        <div style={{ maxWidth: 580, padding: 22, border: "1px solid var(--surface-border)", background: "var(--surface-raised)", borderRadius: "var(--radius-md)" }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
            <Tag size="sm" tone="brand">Connected vehicles</Tag>
            <Tag size="sm" tone="success">Open access</Tag>
            <Tag size="sm" tone="neutral">2025</Tag>
          </div>
          <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", fontWeight: 500, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.02em", color: "var(--text-primary)", lineHeight: 1.25 }}>
            Sensor-fusion latency in mixed-traffic corridors
          </h4>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: 8, fontFamily: "var(--font-mono)" }}>
            Park, J. · Reséndiz, A. · Patel, K. — TRR Vol. 2698
          </div>
          <p style={{ fontSize: "0.86rem", lineHeight: 1.55, color: "var(--text-secondary)", margin: 0 }}>
            Field measurements across three Texas corridors quantify the perception-to-decision lag of cooperative perception protocols under mixed automation levels.
          </p>
        </div>
      </BNBox>

      {/* ─── On dark ─── */}
      <BNSectionLabel>On dark — same tones invert correctly</BNSectionLabel>
      <BNBox dark label="three primitives on a maroon surface">
        <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ position: "relative", display: "inline-flex", padding: 8, border: "1px solid rgba(255,255,255,0.25)", borderRadius: "var(--radius-sm)" }}>
            <span style={{ color: "#FFF" }}><LucideIcon name="bell" size={20} /></span>
            <span style={{ position: "absolute", top: 2, right: 2 }}><Badge count={3} /></span>
          </div>
          <Chip size={size} on>Mobility</Chip>
          <Chip size={size} tone="brand" removable onRemove={() => {}}>Filter</Chip>
          <Tag size={size} tone="brand">Mobility</Tag>
          <Tag size={size} tone="accent">Featured</Tag>
        </div>
      </BNBox>

      <BNSpecRow>
        <BNSpec label="badge size"      value="18px round" note="Numeric or 8px dot variant. Sits with 1.5px page-color border to mask the underlying icon." />
        <BNSpec label="chip height"     value="24 / 28px"  note="sm fits in dense filter bars; md is the default for filter rows and applied filters." />
        <BNSpec label="tag tones"       value="6 semantic" note="neutral · brand · accent · success · warning · danger. Each derived from color-mix() of the brand or state token." />
        <BNSpec label="interaction"     value="chip-only"  note="Chips fire onClick, badges and tags don't. Tags inside an article body never become links — that's a chip's job." />
      </BNSpecRow>
    </PageShell>
  );
}

function ChoiceChipDemo({ size }) {
  const [active, setActive] = _bnUseState("recent");
  const opts = [
    { id: "recent",  label: "Most recent" },
    { id: "cited",   label: "Most cited" },
    { id: "alpha",   label: "Alphabetical" },
    { id: "type",    label: "By type" },
  ];
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
      <span style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: "var(--font-body-bold)", color: "var(--text-muted)" }}>Sort:</span>
      {opts.map(o => (
        <Chip key={o.id} size={size} on={active === o.id} onClick={() => setActive(o.id)}>{o.label}</Chip>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Export
// ════════════════════════════════════════════════════════════════════════

Object.assign(window, {
  AnnouncementBannerPage,
  CookieConsentPage,
  BetaRibbonPage,
  BadgeChipTagPage,
});
