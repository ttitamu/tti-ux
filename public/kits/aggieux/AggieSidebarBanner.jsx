/* global React, PageShell, AGGIE_CATALOG, LucideIcon */
/*
 * AggieSidebarBanner.jsx — Batch 12: Sidebar / Sign-up / Social / Custom content.
 *
 *   Sidebar components — five sidebar-rail widgets at canonical 270-px
 *                        column width:
 *                          • Sidebar Card     basic / with media / with CTA
 *                          • Sidebar Alert    success / warning / info / important
 *                          • Sidebar Captioned Media   image / video
 *                          • Sidebar Description List  vertical key/value pairs
 *                          • Sidebar Icon List         tinted-circle bullets
 *                          • Sidebar Contact Card      faculty / staff portrait
 *                        Card chrome: 12px radius, 2px solid #A7A7A7
 *                        border, 24px padding (per Figma 1.7).
 *
 *   Sign-up feature   — newsletter signup band. Heading + dek +
 *                        bordered email input + uppercase action +
 *                        consent line. Per Figma: 1500-wide, 48px
 *                        padding, 564-wide content column inside.
 *                        Tones: neutral / maroon / gold (Vue
 *                        TuxSignupFeature canonical).
 *                        Style variants change the heading face.
 *
 *   Social media banner — horizontal social-icon row centered between
 *                        two thin black rules (or just centered icons
 *                        when divider=false). Heights vary by icon
 *                        treatment. 4 / 5 / 6 icons typical.
 *
 *   Custom content    — empty-state showcase frame for arbitrary
 *                        embeds (treemap, map, third-party widget).
 *                        Spec is *just* the frame: no fixed inner
 *                        layout. Heading + optional sidebar slot +
 *                        slot for the embed.
 *
 * Helper prefix: SB (SidebarBanner). All shared helpers prefixed to
 * avoid Babel cross-file collisions.
 */

// ════════════════════════════════════════════════════════════════════════
// Shared helpers (SB prefix)
// ════════════════════════════════════════════════════════════════════════

function SBBox({ dark = false, label, padded = true, children }) {
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

function SBSectionLabel({ children }) {
  return (
    <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 12, marginTop: 16 }}>{children}</div>
  );
}

function SBSpecRow({ children }) {
  return (
    <div style={{ marginTop: 28, padding: "14px 18px", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>{children}</div>
  );
}

function SBSpec({ label, value, note }) {
  return (
    <div>
      <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--brand-primary)", marginTop: 3, fontWeight: 500 }}>{value}</div>
      {note && <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 2, lineHeight: 1.4 }}>{note}</div>}
    </div>
  );
}

function SBIntro({ children }) {
  return (
    <div style={{ padding: "16px 20px", marginBottom: 28, background: "color-mix(in srgb, var(--brand-primary) 5%, transparent)", borderLeft: "3px solid var(--brand-primary)", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0", fontSize: "0.92rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>
      {children}
    </div>
  );
}

// Shared style signature used by sign-up + social-banner section headings
function SBStyleSig({ style, width = 220, color }) {
  const c = color || "var(--brand-primary)";
  if (style === "bold") {
    return (
      <div style={{ display: "flex", gap: 5, alignItems: "center", marginBottom: 14 }}>
        <div style={{ width: width * 0.55, height: 5, background: c, opacity: 1 }} />
        <div style={{ width: width * 0.18, height: 5, background: c, opacity: 0.5 }} />
        <div style={{ width: width * 0.08, height: 5, background: c, opacity: 0.25 }} />
      </div>
    );
  }
  if (style === "elegant") {
    return (
      <div style={{
        width, height: 11, marginBottom: 14,
        backgroundImage: `repeating-linear-gradient(135deg, ${c} 0, ${c} 1px, transparent 1px, transparent 6px)`,
        maskImage: "linear-gradient(90deg, black 0%, black 75%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(90deg, black 0%, black 75%, transparent 100%)",
      }} />
    );
  }
  return (
    <div style={{ width, height: 1, marginBottom: 14, background: `linear-gradient(90deg, transparent 0%, ${c} 8%, ${c} 92%, transparent 100%)` }} />
  );
}

// ════════════════════════════════════════════════════════════════════════
// SIDEBAR COMPONENTS
// ════════════════════════════════════════════════════════════════════════

const SIDEBAR_W = 270;          // canonical sidebar column width per Figma 1.7
const SIDEBAR_RADIUS = 12;
const SIDEBAR_BORDER = "2px solid #A7A7A7";

// ── Sidebar Card: heading + paragraph, optional media + CTA
function SBSidebarCard({ dark, hasMedia, hasCTA }) {
  const titleColor = dark ? "#fff" : "var(--text-primary)";
  const bodyColor = dark ? "rgba(255,255,255,0.86)" : "var(--text-secondary)";
  const ctaColor = dark ? "var(--brand-accent)" : "var(--brand-primary)";

  return (
    <div style={{
      width: SIDEBAR_W,
      borderRadius: SIDEBAR_RADIUS,
      border: dark ? "2px solid rgba(255,255,255,0.45)" : SIDEBAR_BORDER,
      padding: "24px",
      background: "transparent",
      display: "flex", flexDirection: "column", gap: 12,
    }}>
      {hasMedia && (
        <div style={{
          width: 222, height: 124, marginBottom: 4,
          background: dark ? "rgba(255,255,255,0.12)" : "var(--surface-sunken)",
          borderRadius: 4,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: dark ? "rgba(255,255,255,0.55)" : "var(--text-muted)",
        }}>
          <LucideIcon name="image" size={28} />
        </div>
      )}
      <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 500, lineHeight: 1.18, color: titleColor }}>Quick facts</div>
      <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: 14, lineHeight: 1.55, color: bodyColor }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean at leo ut eros vehicula consequat.
      </p>
      {hasCTA && (
        <a href="#" onClick={(e) => e.preventDefault()} style={{
          fontFamily: "var(--font-body-bold)", fontSize: 12, fontWeight: 700,
          textTransform: "uppercase", letterSpacing: "0.08em",
          color: ctaColor, textDecoration: "none",
          display: "inline-flex", alignItems: "center", gap: 4, marginTop: 4,
        }}>
          Learn more <LucideIcon name="arrow-right" size={14} />
        </a>
      )}
    </div>
  );
}

// ── Sidebar Alert: leading icon + heading + body in tinted card
function SBSidebarAlert({ dark, type = "important" }) {
  const palette = {
    success:   { fg: "#3D5328", bg: "rgba(61,83,40,0.08)", icon: "circle-check" },
    warning:   { fg: "#A06A1A", bg: "rgba(160,106,26,0.08)", icon: "triangle-alert" },
    info:      { fg: "#1F5D66", bg: "rgba(31,93,102,0.08)", icon: "info" },
    important: { fg: "var(--brand-primary)", bg: "color-mix(in srgb, var(--brand-primary) 6%, transparent)", icon: "alert-circle" },
  };
  const p = palette[type];
  const fg = dark ? "#fff" : p.fg;
  const titleColor = dark ? "#fff" : "var(--text-primary)";
  const bodyColor = dark ? "rgba(255,255,255,0.86)" : "var(--text-secondary)";
  const bg = dark ? "rgba(255,255,255,0.08)" : p.bg;

  return (
    <div style={{
      width: SIDEBAR_W,
      borderRadius: SIDEBAR_RADIUS,
      border: dark ? "2px solid rgba(255,255,255,0.45)" : `2px solid ${p.fg}`,
      background: bg,
      padding: 20,
      display: "flex", gap: 12, alignItems: "flex-start",
    }}>
      <div style={{
        width: 32, height: 32, flexShrink: 0,
        borderRadius: "50%",
        border: `1.5px solid ${fg}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: fg,
      }}>
        <LucideIcon name={p.icon} size={16} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{
          fontFamily: "var(--font-body-bold)", fontSize: 11, fontWeight: 700,
          textTransform: "uppercase", letterSpacing: "0.12em",
          color: fg, marginBottom: 4,
        }}>{type}</div>
        <div style={{ fontFamily: "var(--font-body-bold)", fontSize: 14, fontWeight: 700, lineHeight: 1.3, color: titleColor, marginBottom: 4 }}>
          Heads-up notice
        </div>
        <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: 13, lineHeight: 1.5, color: bodyColor }}>
          Aenean at leo ut eros vehicula consequat. Ut at nulla tristique.
        </p>
      </div>
    </div>
  );
}

// ── Sidebar Captioned Media: image / video aspect tile + caption
function SBSidebarCaptionedMedia({ dark, kind = "image" }) {
  const captionColor = dark ? "rgba(255,255,255,0.8)" : "var(--text-secondary)";
  return (
    <div style={{ width: SIDEBAR_W, display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{
        width: SIDEBAR_W, aspectRatio: "16/9",
        background: dark ? "rgba(255,255,255,0.12)" : "var(--surface-sunken)",
        borderRadius: 4, position: "relative",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: dark ? "rgba(255,255,255,0.55)" : "var(--text-muted)",
      }}>
        <LucideIcon name={kind === "video" ? "play" : "image"} size={32} />
        {kind === "video" && (
          <div style={{
            position: "absolute", inset: 0,
            border: "1.5px solid rgba(0,0,0,0.18)",
            background: "rgba(0,0,0,0.06)",
            borderRadius: 4,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%",
              background: "rgba(255,255,255,0.92)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--brand-primary)",
            }}>
              <LucideIcon name="play" size={18} />
            </div>
          </div>
        )}
      </div>
      <p style={{ margin: 0, fontFamily: "var(--font-body)", fontStyle: "italic", fontSize: 13, lineHeight: 1.5, color: captionColor }}>
        Caption text describing the {kind} runs here, two lines max.
      </p>
    </div>
  );
}

// ── Sidebar Description List: vertical term/def stack
function SBSidebarDescriptionList({ dark }) {
  const items = [
    ["Department", "Engineering"],
    ["Established", "1950"],
    ["Director", "Dr. Reynolds"],
    ["Phone", "(979) 317-2000"],
  ];
  const fg = dark ? "#fff" : "var(--text-primary)";
  const muted = dark ? "rgba(255,255,255,0.72)" : "var(--text-muted)";
  const border = dark ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.12)";

  return (
    <div style={{
      width: SIDEBAR_W,
      borderRadius: SIDEBAR_RADIUS,
      border: dark ? "2px solid rgba(255,255,255,0.45)" : SIDEBAR_BORDER,
      padding: 24,
    }}>
      <div style={{
        fontFamily: "var(--font-body-bold)", fontSize: 11, fontWeight: 700,
        textTransform: "uppercase", letterSpacing: "0.14em",
        color: dark ? "var(--brand-accent)" : "var(--brand-primary)",
        paddingBottom: 8, borderBottom: `2px solid ${dark ? "var(--brand-accent)" : "var(--brand-primary)"}`,
        marginBottom: 12,
      }}>
        Quick facts
      </div>
      {items.map(([term, def], i) => (
        <div key={term} style={{
          padding: "10px 0",
          borderBottom: i === items.length - 1 ? "0" : `1px solid ${border}`,
        }}>
          <div style={{ fontFamily: "var(--font-body-bold)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: muted, marginBottom: 2 }}>{term}</div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 600, color: fg }}>{def}</div>
        </div>
      ))}
    </div>
  );
}

// ── Sidebar Icon List: tinted circle + label rows
function SBSidebarIconList({ dark }) {
  const items = [
    { icon: "phone", label: "Call us" },
    { icon: "mail", label: "Email staff" },
    { icon: "map-pin", label: "Visit campus" },
    { icon: "file-text", label: "Annual report" },
  ];
  const fg = dark ? "#fff" : "var(--text-primary)";
  const tint = dark ? "rgba(255,255,255,0.12)" : "color-mix(in srgb, var(--brand-primary) 10%, transparent)";
  const tintFg = dark ? "var(--brand-accent)" : "var(--brand-primary)";

  return (
    <div style={{ width: SIDEBAR_W, display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{
        fontFamily: "var(--font-body-bold)", fontSize: 11, fontWeight: 700,
        textTransform: "uppercase", letterSpacing: "0.14em",
        color: tintFg,
        paddingBottom: 8, borderBottom: `2px solid ${tintFg}`,
        marginBottom: 4,
      }}>
        Get in touch
      </div>
      {items.map((it) => (
        <a key={it.label} href="#" onClick={(e) => e.preventDefault()} style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "8px 0",
          textDecoration: "none",
          color: fg,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: tint, color: tintFg,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <LucideIcon name={it.icon} size={16} />
          </div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 600 }}>{it.label}</div>
          <LucideIcon name="chevron-right" size={14} style={{ marginLeft: "auto", opacity: 0.6 }} />
        </a>
      ))}
    </div>
  );
}

// ── Sidebar Contact Card: portrait + name + role + contact rows
function SBSidebarContactCard({ dark }) {
  const fg = dark ? "#fff" : "var(--text-primary)";
  const muted = dark ? "rgba(255,255,255,0.72)" : "var(--text-muted)";
  const link = dark ? "var(--brand-accent)" : "var(--brand-primary)";

  return (
    <div style={{
      width: SIDEBAR_W,
      borderRadius: SIDEBAR_RADIUS,
      border: dark ? "2px solid rgba(255,255,255,0.45)" : SIDEBAR_BORDER,
      padding: 24,
      display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 12,
    }}>
      <div style={{
        width: 88, height: 88, borderRadius: "50%",
        background: "linear-gradient(135deg, color-mix(in srgb, var(--brand-primary) 80%, transparent), color-mix(in srgb, var(--brand-primary) 50%, transparent))",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "rgba(255,255,255,0.85)",
        fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 500,
      }}>SR</div>
      <div>
        <div style={{ fontFamily: "var(--font-body-bold)", fontSize: 16, fontWeight: 700, color: fg, lineHeight: 1.2 }}>Dr. Sarah Reynolds</div>
        <div style={{ fontFamily: "var(--font-body)", fontStyle: "italic", fontSize: 13, color: muted, marginTop: 2 }}>Director, Mobility Division</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, fontFamily: "var(--font-body)", fontSize: 13, color: muted, marginTop: 4 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <LucideIcon name="mail" size={13} style={{ color: link }} />
          <a href="mailto:s-reynolds@tti.tamu.edu" onClick={(e) => e.preventDefault()} style={{ color: link, textDecoration: "none" }}>s-reynolds@tti.tamu.edu</a>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <LucideIcon name="phone" size={13} style={{ color: link }} />
          <span>(979) 317-2842</span>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// SIGN-UP FEATURE
// ════════════════════════════════════════════════════════════════════════

function SBSignupFeature({ style = "default", tone = "neutral", dark = false }) {
  // Background + foreground tokens per tone
  let bg, titleColor, bodyColor, eyebrowColor, inputBg, inputBorder, inputColor, btnBg, btnFg, btnHoverBg, consentColor;
  if (tone === "maroon") {
    bg = "var(--brand-primary)";
    titleColor = "#fff";
    bodyColor = "rgba(255,255,255,0.85)";
    eyebrowColor = "rgba(255,255,255,0.72)";
    inputBg = "rgba(0,0,0,0.18)";
    inputBorder = "rgba(255,255,255,0.9)";
    inputColor = "#fff";
    btnBg = "var(--brand-accent)";
    btnFg = "#2A0E15";
    consentColor = "rgba(255,255,255,0.72)";
  } else if (tone === "gold") {
    bg = "var(--brand-accent)";
    titleColor = "#2A0E15";
    bodyColor = "rgba(42,14,21,0.85)";
    eyebrowColor = "rgba(42,14,21,0.72)";
    inputBg = "rgba(255,255,255,0.18)";
    inputBorder = "#2A0E15";
    inputColor = "#2A0E15";
    btnBg = "#2A0E15";
    btnFg = "var(--brand-accent)";
    consentColor = "rgba(42,14,21,0.72)";
  } else {
    bg = dark ? "rgba(255,255,255,0.06)" : "var(--surface-sunken)";
    titleColor = dark ? "#fff" : "var(--text-primary)";
    bodyColor = dark ? "rgba(255,255,255,0.85)" : "var(--text-secondary)";
    eyebrowColor = dark ? "rgba(255,255,255,0.7)" : "var(--brand-primary)";
    inputBg = dark ? "rgba(0,0,0,0.25)" : "#fff";
    inputBorder = dark ? "rgba(255,255,255,0.45)" : "var(--text-primary)";
    inputColor = dark ? "#fff" : "var(--text-primary)";
    btnBg = "var(--brand-primary)";
    btnFg = "#fff";
    consentColor = dark ? "rgba(255,255,255,0.7)" : "var(--text-muted)";
  }

  // Heading face per style variant
  let titleStyle;
  if (style === "bold") {
    titleStyle = { fontFamily: "var(--font-body-bold)", fontWeight: 700, fontStyle: "italic", textTransform: "uppercase", letterSpacing: "0.01em", fontSize: 32, lineHeight: 1.05 };
  } else if (style === "elegant") {
    titleStyle = { fontFamily: "var(--font-elegant, Georgia, serif)", fontWeight: 400, fontStyle: "italic", textTransform: "uppercase", letterSpacing: "-0.005em", fontSize: 36, lineHeight: 1.05 };
  } else {
    titleStyle = { fontFamily: "var(--font-display)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.01em", fontSize: 30, lineHeight: 1.1 };
  }

  return (
    <div style={{
      background: bg, color: titleColor,
      padding: "48px 56px",
      display: "grid",
      gridTemplateColumns: "1.2fr 1fr",
      gap: 56,
      alignItems: "center",
    }}>
      <div>
        <SBStyleSig style={style} width={180} color={tone === "gold" ? "#2A0E15" : (tone === "maroon" ? "var(--brand-accent)" : "var(--brand-primary)")} />
        <div style={{
          fontFamily: "var(--font-body-bold)", fontSize: 11, fontWeight: 700,
          textTransform: "uppercase", letterSpacing: "0.14em",
          color: eyebrowColor, marginBottom: 14,
        }}>Stay informed</div>
        <h3 style={{ ...titleStyle, color: titleColor, margin: 0 }}>Subscribe to our quarterly bulletin</h3>
        <p style={{ margin: "16px 0 0", fontFamily: "var(--font-body)", fontSize: 15.5, lineHeight: 1.6, color: bodyColor, maxWidth: 420 }}>
          Field reports, policy briefs, and program announcements from across the Institute. Eight to ten dispatches a year.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{
          display: "flex",
          border: `2px solid ${inputBorder}`,
          background: inputBg,
          height: 50,
        }}>
          <div style={{
            flex: 1, display: "flex", alignItems: "center",
            padding: "0 14px",
            fontFamily: "var(--font-body-bold)", fontSize: 14, fontWeight: 600,
            color: inputColor,
            fontStyle: "italic",
            opacity: 0.85,
          }}>your@email.edu</div>
          <button type="button" style={{
            flexShrink: 0, padding: "0 22px",
            fontFamily: "var(--font-body-bold)", fontSize: 13, fontWeight: 700,
            textTransform: "uppercase", letterSpacing: "0.08em",
            background: btnBg, color: btnFg,
            border: 0, cursor: "pointer",
          }}>Subscribe</button>
        </div>
        <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: 12, lineHeight: 1.5, color: consentColor }}>
          We never share your address. Unsubscribe in one click.
        </p>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// SOCIAL MEDIA BANNER
// ════════════════════════════════════════════════════════════════════════

function SBSocialBanner({ dark = false, count = 5, hasDivider = true, hasHeading = false, style = "default" }) {
  const icons = ["facebook", "twitter", "linkedin", "youtube", "instagram", "github"].slice(0, count);
  const fg = dark ? "#fff" : "#000";
  const ruleColor = dark ? "rgba(255,255,255,0.55)" : "#000";

  let titleStyle;
  if (style === "bold") {
    titleStyle = { fontFamily: "var(--font-body-bold)", fontWeight: 700, fontStyle: "italic", textTransform: "uppercase", letterSpacing: "0.01em", fontSize: 22 };
  } else if (style === "elegant") {
    titleStyle = { fontFamily: "var(--font-elegant, Georgia, serif)", fontWeight: 400, fontStyle: "italic", textTransform: "uppercase", letterSpacing: "0", fontSize: 24 };
  } else {
    titleStyle = { fontFamily: "var(--font-display)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.01em", fontSize: 22 };
  }

  return (
    <div style={{
      padding: "32px 0",
      display: "flex", flexDirection: "column", alignItems: "center", gap: hasHeading ? 18 : 0,
    }}>
      {hasHeading && (
        <h3 style={{ ...titleStyle, color: fg, margin: 0 }}>Follow Us</h3>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 24, width: "100%", maxWidth: 720, padding: "0 24px" }}>
        {hasDivider && <div style={{ flex: 1, height: 1, background: ruleColor }} />}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {icons.map((name) => (
            <a key={name} href="#" onClick={(e) => e.preventDefault()} aria-label={name} style={{
              width: 40, height: 40, borderRadius: "50%",
              border: `1.5px solid ${fg}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: fg, textDecoration: "none",
            }}>
              <LucideIcon name={name} size={18} />
            </a>
          ))}
        </div>
        {hasDivider && <div style={{ flex: 1, height: 1, background: ruleColor }} />}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// CUSTOM CONTENT — empty showcase frame
// ════════════════════════════════════════════════════════════════════════

function SBCustomContent({ dark, twoColumn = false, hasDivider = true, sidebar = "none", style = "default" }) {
  const fg = dark ? "#fff" : "var(--text-primary)";
  const muted = dark ? "rgba(255,255,255,0.7)" : "var(--text-muted)";
  const placeholderBg = dark ? "rgba(255,255,255,0.06)" : "var(--surface-sunken)";

  let titleStyle;
  if (style === "bold") {
    titleStyle = { fontFamily: "var(--font-body-bold)", fontWeight: 700, fontStyle: "italic", textTransform: "uppercase", letterSpacing: "0.01em", fontSize: 26 };
  } else if (style === "elegant") {
    titleStyle = { fontFamily: "var(--font-elegant, Georgia, serif)", fontWeight: 400, fontStyle: "italic", textTransform: "uppercase", letterSpacing: "-0.005em", fontSize: 28 };
  } else {
    titleStyle = { fontFamily: "var(--font-display)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.01em", fontSize: 24 };
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <SBStyleSig style={style} width={180} color={dark ? "var(--brand-accent)" : "var(--brand-primary)"} />
        <div style={{
          fontFamily: "var(--font-body-bold)", fontSize: 11, fontWeight: 700,
          textTransform: "uppercase", letterSpacing: "0.14em",
          color: dark ? "rgba(255,255,255,0.75)" : "var(--brand-primary)",
          marginBottom: 6,
        }}>Section heading</div>
        <h3 style={{ ...titleStyle, color: fg, margin: 0 }}>Custom embed area</h3>
      </div>
      {hasDivider && <div style={{ height: 1, background: dark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.12)" }} />}
      <div style={{
        display: "grid",
        gridTemplateColumns: sidebar !== "none" ? `1fr ${SIDEBAR_W}px` : (twoColumn ? "1fr 1fr" : "1fr"),
        gap: 32,
      }}>
        <div style={{
          background: placeholderBg,
          minHeight: 260,
          border: `2px dashed ${dark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.18)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: muted,
          fontFamily: "var(--font-body)", fontSize: 13, textAlign: "center", padding: 24,
        }}>
          {twoColumn ? (
            <span>Embed slot — column 1<br />(treemap, map, custom widget)</span>
          ) : (
            <span>Embed slot — fill with arbitrary content<br />(treemap, map, third-party widget, video, code sample, etc.)</span>
          )}
        </div>
        {twoColumn && sidebar === "none" && (
          <div style={{
            background: placeholderBg,
            minHeight: 260,
            border: `2px dashed ${dark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.18)"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: muted,
            fontFamily: "var(--font-body)", fontSize: 13, textAlign: "center", padding: 24,
          }}>Embed slot — column 2</div>
        )}
        {sidebar !== "none" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {sidebar === "card" && <SBSidebarCard dark={dark} hasMedia={false} hasCTA />}
            {sidebar === "alert" && <SBSidebarAlert dark={dark} type="important" />}
            {sidebar === "facts" && <SBSidebarDescriptionList dark={dark} />}
          </div>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// PAGES
// ════════════════════════════════════════════════════════════════════════

function SidebarComponentsPage() {
  const item = AGGIE_CATALOG.find((x) => x.id === "sidebar-components");
  return (
    <PageShell item={item}>
      <SBIntro>
        <strong>Sidebar widgets</strong> — six rail components, all snapped to the canonical 270-px sidebar column. Cards use a 2px #A7A7A7 border with 12px radius and 24px padding (per Figma 1.7). Compose two or three widgets vertically inside a sidebar; the production rule is one heading widget (Description list, Icon list) plus one media widget (Captioned media, Card with media) plus optional alert.
      </SBIntro>

      <SBSectionLabel>Sidebar Card — three media states</SBSectionLabel>
      <SBBox label="Light" dark={false}>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          <SBSidebarCard dark={false} hasMedia={false} hasCTA={false} />
          <SBSidebarCard dark={false} hasMedia={true} hasCTA={false} />
          <SBSidebarCard dark={false} hasMedia={false} hasCTA={true} />
        </div>
      </SBBox>
      <SBBox label="Dark" dark={true}>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          <SBSidebarCard dark={true} hasMedia={false} hasCTA={false} />
          <SBSidebarCard dark={true} hasMedia={true} hasCTA={false} />
          <SBSidebarCard dark={true} hasMedia={false} hasCTA={true} />
        </div>
      </SBBox>

      <SBSectionLabel>Sidebar Alert — four message types</SBSectionLabel>
      <SBBox label="Light" dark={false}>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          <SBSidebarAlert dark={false} type="success" />
          <SBSidebarAlert dark={false} type="warning" />
          <SBSidebarAlert dark={false} type="info" />
          <SBSidebarAlert dark={false} type="important" />
        </div>
      </SBBox>
      <SBBox label="Dark" dark={true}>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          <SBSidebarAlert dark={true} type="success" />
          <SBSidebarAlert dark={true} type="important" />
        </div>
      </SBBox>

      <SBSectionLabel>Sidebar Captioned Media — image + video</SBSectionLabel>
      <SBBox label="Light" dark={false}>
        <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
          <SBSidebarCaptionedMedia dark={false} kind="image" />
          <SBSidebarCaptionedMedia dark={false} kind="video" />
        </div>
      </SBBox>

      <SBSectionLabel>Sidebar Description List + Icon List</SBSectionLabel>
      <SBBox label="Light" dark={false}>
        <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
          <SBSidebarDescriptionList dark={false} />
          <SBSidebarIconList dark={false} />
        </div>
      </SBBox>
      <SBBox label="Dark" dark={true}>
        <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
          <SBSidebarDescriptionList dark={true} />
          <SBSidebarIconList dark={true} />
        </div>
      </SBBox>

      <SBSectionLabel>Sidebar Contact Card</SBSectionLabel>
      <SBBox label="Light" dark={false}>
        <SBSidebarContactCard dark={false} />
      </SBBox>
      <SBBox label="Dark" dark={true}>
        <SBSidebarContactCard dark={true} />
      </SBBox>

      <SBSpecRow>
        <SBSpec label="Column width" value="270px" note="Canonical sidebar rail; do not exceed" />
        <SBSpec label="Card chrome" value="12px / 2px" note="Border radius / border weight (#A7A7A7)" />
        <SBSpec label="Card padding" value="24px" note="All sides inside the card" />
        <SBSpec label="Stack rule" value="≤3 widgets" note="Heading widget + media + optional alert" />
      </SBSpecRow>
    </PageShell>
  );
}

function SignupFeaturePage() {
  const item = AGGIE_CATALOG.find((x) => x.id === "signup-feature");
  return (
    <PageShell item={item}>
      <SBIntro>
        <strong>Sign-up feature</strong> — newsletter signup band. Heading + dek + bordered email input + uppercase action + consent line. Self-contained; no nested components. Three tones (neutral / maroon / gold) and three style variants. The action button is always Work Sans 700 uppercase regardless of style — buttons are constants in this system.
      </SBIntro>

      <SBSectionLabel>Default style — three tones</SBSectionLabel>
      <SBBox label="Neutral" dark={false} padded={false}>
        <SBSignupFeature style="default" tone="neutral" />
      </SBBox>
      <SBBox label="Maroon" dark={false} padded={false}>
        <SBSignupFeature style="default" tone="maroon" />
      </SBBox>
      <SBBox label="Gold" dark={false} padded={false}>
        <SBSignupFeature style="default" tone="gold" />
      </SBBox>

      <SBSectionLabel>Bold style — neutral + maroon</SBSectionLabel>
      <SBBox label="Neutral" dark={false} padded={false}>
        <SBSignupFeature style="bold" tone="neutral" />
      </SBBox>
      <SBBox label="Maroon" dark={false} padded={false}>
        <SBSignupFeature style="bold" tone="maroon" />
      </SBBox>

      <SBSectionLabel>Elegant style — neutral + gold</SBSectionLabel>
      <SBBox label="Neutral" dark={false} padded={false}>
        <SBSignupFeature style="elegant" tone="neutral" />
      </SBBox>
      <SBBox label="Gold" dark={false} padded={false}>
        <SBSignupFeature style="elegant" tone="gold" />
      </SBBox>

      <SBSpecRow>
        <SBSpec label="Frame width" value="1500px" note="Canonical max; embeds inside any container ≥720" />
        <SBSpec label="Padding" value="48px" note="All sides; condense to 32 on narrow containers" />
        <SBSpec label="Input height" value="50px" note="2px border, currentColor; button matches height" />
        <SBSpec label="Action button" value="WS 700 uppercase" note="Constant across style variants" />
      </SBSpecRow>
    </PageShell>
  );
}

function SocialBannerPage() {
  const item = AGGIE_CATALOG.find((x) => x.id === "social-banner");
  return (
    <PageShell item={item}>
      <SBIntro>
        <strong>Social media banner</strong> — horizontal row of social-icon links, optionally flanked by thin black rules and headed by an uppercase title. Sized to the 1152-px content column on a 1500-px frame; padding is 48px top + bottom. Three icon counts (4 / 5 / 6); icons are circle-outlined at 40×40.
      </SBIntro>

      <SBSectionLabel>With dividers — 4 / 5 / 6 icons</SBSectionLabel>
      <SBBox label="Light, no heading" dark={false} padded={false}>
        <SBSocialBanner dark={false} count={4} hasDivider={true} hasHeading={false} />
      </SBBox>
      <SBBox label="Light, with heading" dark={false} padded={false}>
        <SBSocialBanner dark={false} count={5} hasDivider={true} hasHeading={true} />
      </SBBox>
      <SBBox label="Light, six icons" dark={false} padded={false}>
        <SBSocialBanner dark={false} count={6} hasDivider={true} hasHeading={true} />
      </SBBox>

      <SBSectionLabel>Without dividers</SBSectionLabel>
      <SBBox label="Light" dark={false} padded={false}>
        <SBSocialBanner dark={false} count={5} hasDivider={false} hasHeading={true} />
      </SBBox>

      <SBSectionLabel>Dark mode</SBSectionLabel>
      <SBBox label="Dark, with dividers + heading" dark={true} padded={false}>
        <SBSocialBanner dark={true} count={5} hasDivider={true} hasHeading={true} />
      </SBBox>
      <SBBox label="Dark, no dividers" dark={true} padded={false}>
        <SBSocialBanner dark={true} count={5} hasDivider={false} hasHeading={false} />
      </SBBox>

      <SBSectionLabel>Style variants — heading face</SBSectionLabel>
      <SBBox label="Bold" dark={false} padded={false}>
        <SBSocialBanner dark={false} count={5} hasDivider={true} hasHeading={true} style="bold" />
      </SBBox>
      <SBBox label="Elegant" dark={false} padded={false}>
        <SBSocialBanner dark={false} count={5} hasDivider={true} hasHeading={true} style="elegant" />
      </SBBox>

      <SBSpecRow>
        <SBSpec label="Banner width" value="1152px" note="Content column, centers within 1500-frame" />
        <SBSpec label="Vertical padding" value="48px" note="Top + bottom" />
        <SBSpec label="Icon target" value="40×40" note="1.5px circle outline; 18px glyph" />
        <SBSpec label="Icon gap" value="18px" note="Between icons; 24px to flanking rules" />
      </SBSpecRow>
    </PageShell>
  );
}

function CustomContentPage() {
  const item = AGGIE_CATALOG.find((x) => x.id === "custom-content");
  return (
    <PageShell item={item}>
      <SBIntro>
        <strong>Custom content</strong> — the empty-frame escape hatch for content that doesn't fit any other component. Provides the heading rhythm (eyebrow + signature rule + display title) plus a dashed slot for arbitrary embeds. Three layouts: single column, two column, single + sidebar widget. Use when shipping a treemap, custom map, third-party widget, video frame, or code sample that lives inside the same vertical rhythm as its neighbors.
      </SBIntro>

      <SBSectionLabel>Single column — default style</SBSectionLabel>
      <SBBox label="Light" dark={false}>
        <SBCustomContent dark={false} twoColumn={false} hasDivider={true} sidebar="none" style="default" />
      </SBBox>

      <SBSectionLabel>Two columns</SBSectionLabel>
      <SBBox label="Light" dark={false}>
        <SBCustomContent dark={false} twoColumn={true} hasDivider={true} sidebar="none" style="default" />
      </SBBox>

      <SBSectionLabel>With sidebar widget — card / alert / facts</SBSectionLabel>
      <SBBox label="Sidebar = card" dark={false}>
        <SBCustomContent dark={false} twoColumn={false} hasDivider={true} sidebar="card" style="default" />
      </SBBox>
      <SBBox label="Sidebar = alert" dark={false}>
        <SBCustomContent dark={false} twoColumn={false} hasDivider={true} sidebar="alert" style="default" />
      </SBBox>
      <SBBox label="Sidebar = description list" dark={false}>
        <SBCustomContent dark={false} twoColumn={false} hasDivider={true} sidebar="facts" style="default" />
      </SBBox>

      <SBSectionLabel>Style variants — heading face</SBSectionLabel>
      <SBBox label="Bold" dark={false}>
        <SBCustomContent dark={false} twoColumn={false} hasDivider={true} sidebar="none" style="bold" />
      </SBBox>
      <SBBox label="Elegant" dark={false}>
        <SBCustomContent dark={false} twoColumn={false} hasDivider={true} sidebar="none" style="elegant" />
      </SBBox>

      <SBSectionLabel>Dark mode</SBSectionLabel>
      <SBBox label="Dark, with sidebar" dark={true}>
        <SBCustomContent dark={true} twoColumn={false} hasDivider={true} sidebar="card" style="default" />
      </SBBox>

      <SBSpecRow>
        <SBSpec label="Heading rhythm" value="sig + eyebrow + title" note="Style signature on top, eyebrow, then display title" />
        <SBSpec label="Embed slot" value="2px dashed" note="Placeholder; consumer fills with arbitrary content" />
        <SBSpec label="Sidebar width" value="270px" note="Matches Sidebar-components canonical column" />
        <SBSpec label="Min slot height" value="260px" note="Default minimum; expands with content" />
      </SBSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════════════

window.SidebarComponentsPage = SidebarComponentsPage;
window.SignupFeaturePage = SignupFeaturePage;
window.SocialBannerPage = SocialBannerPage;
window.CustomContentPage = CustomContentPage;
