/* global React, PageShell, AGGIE_CATALOG, LucideIcon */
/*
 * AggieImageLightbox.jsx — INF-3 deferred fold: the image-lightbox family.
 *
 *   Image lightbox — full-viewport modal for previewing photography and
 *                    document imagery. Composes from a chrome bar (title +
 *                    meta + close), the image stage (with optional zoom),
 *                    an action bar (download, share, copy link), a counter
 *                    (3 of 12), arrow nav, and an optional thumbnail strip.
 *                    Distinct from `photo-grid` (the launcher) and from
 *                    `captioned-media` (inline body imagery): lightbox is
 *                    full-bleed escape-trap focus.
 *
 * Lineage (INF-3):
 *   • Microsoft Teams Lightbox-view (11 frames: Anatomy, Filmstrip,
 *     Zoom, Caption, With-Annotations). Teams ships a full-viewport
 *     scrim, top-strip chrome, bottom action row, and an opt-in
 *     filmstrip. TUX adopts the structure and swaps in TTI editorial
 *     typography for caption + meta, JetBrains Mono for the counter
 *     and zoom level, maroon CTA accents, and a Lucide icon set.
 *
 * Identity stays TUX: scrim is near-black warm tone (not Teams purple-grey),
 * accents maroon-on-light / gold-on-dark, never Segoe UI.
 *
 * Helper prefix: LB (Lightbox). Local helpers only — never declare a
 * generic SectionLabel / Box / SpecRow in this file.
 */

// ════════════════════════════════════════════════════════════════════════
// Shared helpers (LB prefix)
// ════════════════════════════════════════════════════════════════════════

function LBBox({ label, padded = true, children }) {
  return (
    <div style={{ border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", overflow: "hidden", marginBottom: 16 }}>
      <div style={{
        padding: "7px 14px", fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em",
        color: "var(--text-muted)", fontFamily: "var(--font-body-bold)",
        background: "var(--surface-sunken)",
        borderBottom: "1px solid var(--surface-border)",
      }}>{label}</div>
      <div style={{ padding: padded ? 0 : 0, background: "var(--surface-page)" }}>{children}</div>
    </div>
  );
}

function LBSectionLabel({ children }) {
  return (
    <h3 style={{
      fontFamily: "var(--font-body)", fontSize: "0.72rem", fontWeight: 600, textTransform: "lowercase",
      letterSpacing: "0.10em", color: "var(--text-muted)", margin: "32px 0 12px",
    }}>{children}</h3>
  );
}

function LBSpecRow({ children }) {
  return (
    <div style={{ marginTop: 28, padding: "14px 18px", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 18 }}>
      {children}
    </div>
  );
}

function LBSpec({ label, value, note }) {
  return (
    <div>
      <div style={{ fontFamily: "var(--font-body-bold)", fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontWeight: 500, fontSize: "0.82rem", color: "var(--text-primary)", marginBottom: 4 }}>{value}</div>
      {note ? <div style={{ fontFamily: "var(--font-body)", fontSize: "0.74rem", color: "var(--text-muted)", lineHeight: 1.4 }}>{note}</div> : null}
    </div>
  );
}

function LBIntro({ children }) {
  return (
    <div style={{ borderLeft: "3px solid var(--brand-primary)", padding: "8px 16px", margin: "0 0 28px", background: "var(--surface-raised)", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0" }}>
      <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: "0.9rem", lineHeight: 1.55, color: "var(--text-primary)", maxWidth: 760 }}>{children}</p>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Placeholder image — a TTI proving-ground style striped panel.
// We never ship pretend photos; we ship monochromatic stripes with a hint
// of what should fill the slot. Reading order: aspect → caption.
// ════════════════════════════════════════════════════════════════════════

function LBPlaceholder({ aspect = "16/9", label = "image placeholder", tone = "field", style }) {
  const palette = {
    field:   { a: "#3A2C26", b: "#2A1F1B", text: "rgba(255,255,255,0.55)" },
    sky:     { a: "#2A3540", b: "#1F2731", text: "rgba(255,255,255,0.55)" },
    asphalt: { a: "#2E2E2E", b: "#1E1E1E", text: "rgba(255,255,255,0.55)" },
    maroon:  { a: "#5C0025", b: "#3A0017", text: "rgba(255,255,255,0.55)" },
  }[tone] || { a: "#3A2C26", b: "#2A1F1B", text: "rgba(255,255,255,0.55)" };
  return (
    <div style={{
      aspectRatio: aspect,
      width: "100%",
      backgroundImage: `repeating-linear-gradient(135deg, ${palette.a} 0 12px, ${palette.b} 12px 24px)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "var(--font-mono)", fontSize: "0.72rem",
      color: palette.text, letterSpacing: "0.04em",
      ...style,
    }}>
      {label}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// LIGHTBOX primitive — renders the *frame* of the lightbox, not the page
// behind it (which we mock with a faint blurred surface inside each demo).
// ════════════════════════════════════════════════════════════════════════

function LBLightbox({
  title, meta, counter, zoom,
  image, caption, attribution,
  filmstrip, filmstripActive = 0,
  showAnnotations = false,
  variant = "default",  // 'default' | 'caption' | 'filmstrip' | 'document'
  pageHeight = 480,
}) {
  return (
    <div style={{
      position: "relative",
      width: "100%",
      height: pageHeight,
      background: "#0E0907",   // warm near-black scrim
      overflow: "hidden",
      fontFamily: "var(--font-body)",
      color: "#FFFFFF",
      borderRadius: "var(--radius-md)",
      display: "flex", flexDirection: "column",
    }}>
      {/* faint hint of page-behind */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(ellipse at top, rgba(92,0,37,0.06), transparent 60%)",
        pointerEvents: "none",
      }} />

      {/* ── Top chrome ──────────────────────────────────────── */}
      <div style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: "14px 20px",
        background: "rgba(0,0,0,0.32)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        position: "relative", zIndex: 2,
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {title ? (
            <div style={{
              fontFamily: "var(--font-display, var(--font-body-bold))",
              fontWeight: 500, fontSize: "1.05rem", lineHeight: 1.2,
              textTransform: "uppercase", letterSpacing: "0.01em",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>{title}</div>
          ) : null}
          {meta ? (
            <div style={{
              marginTop: 3,
              fontFamily: "var(--font-mono)", fontSize: "0.72rem", fontWeight: 500,
              color: "rgba(255,255,255,0.65)",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>{meta}</div>
          ) : null}
        </div>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
          <LBIconBtn icon="info" label="Info" />
          <LBIconBtn icon="share-2" label="Share" />
          <LBIconBtn icon="download" label="Download" />
          <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.14)", margin: "0 6px" }} />
          <LBIconBtn icon="x" label="Close · Esc" />
        </span>
      </div>

      {/* ── Stage ───────────────────────────────────────────── */}
      <div style={{
        flex: 1, position: "relative", display: "flex",
        alignItems: "center", justifyContent: "center",
        padding: variant === "filmstrip" ? "20px 60px 0" : "20px 60px",
        minHeight: 0,
      }}>
        {/* prev / next arrows */}
        <LBArrow side="left" />
        <LBArrow side="right" />

        {/* image stage */}
        <div style={{
          maxWidth: variant === "document" ? 360 : 640,
          width: "100%",
          maxHeight: "100%",
          position: "relative",
          boxShadow: "0 8px 28px rgba(0,0,0,0.5)",
        }}>
          {image}

          {showAnnotations ? (
            <>
              <LBAnnotation x={18} y={32} n="1" />
              <LBAnnotation x={62} y={48} n="2" />
              <LBAnnotation x={42} y={72} n="3" />
            </>
          ) : null}
        </div>
      </div>

      {/* ── Caption (caption variant) ────────────────────────── */}
      {variant === "caption" && caption ? (
        <div style={{
          padding: "12px 24px 18px",
          background: "rgba(0,0,0,0.32)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}>
          <div style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.88rem", lineHeight: 1.55,
            color: "rgba(255,255,255,0.92)",
            maxWidth: 760,
          }}>{caption}</div>
          {attribution ? (
            <div style={{
              marginTop: 6,
              fontFamily: "var(--font-mono)", fontSize: "0.7rem", fontWeight: 500,
              color: "rgba(255,255,255,0.55)", letterSpacing: "0.04em",
            }}>{attribution}</div>
          ) : null}
        </div>
      ) : null}

      {/* ── Filmstrip (filmstrip variant) ────────────────────── */}
      {variant === "filmstrip" && filmstrip ? (
        <div style={{
          padding: "12px 20px 14px",
          background: "rgba(0,0,0,0.32)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex", alignItems: "center", gap: 8, overflowX: "auto",
        }}>
          {filmstrip.map((f, i) => (
            <div key={i} style={{
              flexShrink: 0,
              width: 78, height: 52,
              border: i === filmstripActive ? "2px solid var(--brand-accent)" : "2px solid transparent",
              outline: i === filmstripActive ? "none" : "1px solid rgba(255,255,255,0.10)",
              borderRadius: 3,
              overflow: "hidden", cursor: "pointer",
              opacity: i === filmstripActive ? 1 : 0.65,
              transition: "opacity 120ms ease-out",
            }}>
              <LBPlaceholder aspect="3/2" label="" tone={f.tone || "field"} />
            </div>
          ))}
        </div>
      ) : null}

      {/* ── Bottom counter + zoom strip ──────────────────────── */}
      <div style={{
        padding: "10px 20px",
        display: "flex", alignItems: "center", gap: 14,
        background: "rgba(0,0,0,0.36)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        position: "relative", zIndex: 2,
      }}>
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: "0.74rem", fontWeight: 500,
          color: "rgba(255,255,255,0.75)", fontVariantNumeric: "tabular-nums",
        }}>{counter || "3 of 12"}</span>

        <span style={{ flex: 1 }} />

        {/* zoom cluster */}
        <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
          <LBIconBtn icon="zoom-out"   label="Zoom out · −" small />
          <span style={{
            display: "inline-block", minWidth: 56, textAlign: "center",
            fontFamily: "var(--font-mono)", fontSize: "0.74rem", fontWeight: 500,
            color: "rgba(255,255,255,0.85)", fontVariantNumeric: "tabular-nums",
          }}>{zoom || "100%"}</span>
          <LBIconBtn icon="zoom-in"  label="Zoom in · +" small />
          <LBIconBtn icon="maximize" label="Fit to screen" small />
        </span>

        <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.14)" }} />

        {/* rotate / annotate cluster */}
        <LBIconBtn icon="rotate-cw"          label="Rotate" small />
        <LBIconBtn icon="message-square-plus" label="Annotate" small />
      </div>
    </div>
  );
}

function LBIconBtn({ icon, label, small }) {
  const sz = small ? 32 : 34;
  return (
    <button title={label} style={{
      width: sz, height: sz,
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      background: "transparent", border: "1px solid transparent",
      borderRadius: "var(--radius-sm)",
      color: "rgba(255,255,255,0.85)",
      cursor: "pointer", flexShrink: 0,
    }}>
      <LucideIcon name={icon} size={small ? 14 : 16} />
    </button>
  );
}

function LBArrow({ side }) {
  return (
    <button aria-label={side === "left" ? "Previous · ←" : "Next · →"} style={{
      position: "absolute",
      [side]: 14,
      top: "50%", transform: "translateY(-50%)",
      width: 40, height: 40,
      borderRadius: "50%",
      background: "rgba(0,0,0,0.45)",
      border: "1px solid rgba(255,255,255,0.10)",
      color: "rgba(255,255,255,0.92)",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      cursor: "pointer",
      zIndex: 1,
    }}>
      <LucideIcon name={side === "left" ? "chevron-left" : "chevron-right"} size={18} />
    </button>
  );
}

function LBAnnotation({ x, y, n }) {
  return (
    <span style={{
      position: "absolute",
      left: `${x}%`, top: `${y}%`,
      width: 22, height: 22, borderRadius: "50%",
      background: "var(--brand-accent)", color: "var(--brand-primary)",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.7rem",
      boxShadow: "0 0 0 3px rgba(221,172,55,0.30), 0 2px 6px rgba(0,0,0,0.4)",
      pointerEvents: "none",
    }}>{n}</span>
  );
}

// ════════════════════════════════════════════════════════════════════════
// PAGE
// ════════════════════════════════════════════════════════════════════════

function ImageLightboxPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "image-lightbox");

  return (
    <PageShell item={item}>
      <LBIntro>
        Full-viewport modal for previewing photography and document imagery —
        the focused-view pair to <code>photo-grid</code>. Composes from a
        chrome bar (title + meta + close), the image stage with prev/next
        arrows, a counter + zoom strip, and one of three opt-in tails:
        a caption + attribution, a filmstrip of siblings, or numbered
        annotation markers. Distinct from{" "}
        <code>captioned-media</code> (inline body imagery) and{" "}
        <code>video-embed</code> (always-in-flow player).
      </LBIntro>

      {/* ── 1. Default ──────────────────────────────────────── */}
      <LBSectionLabel>1 · Default — single image, no caption</LBSectionLabel>
      <LBBox label="single image · chrome + counter + zoom · keyboard nav">
        <LBLightbox
          title="Proving Ground · Test Track"
          meta="Bryan, Texas · 2026-04-12"
          counter="1 of 1"
          zoom="100%"
          image={<LBPlaceholder aspect="16/9" label="proving-ground · 16:9 hero" tone="asphalt" />}
        />
      </LBBox>

      {/* ── 2. With caption ─────────────────────────────────── */}
      <LBSectionLabel>2 · With caption + attribution</LBSectionLabel>
      <LBBox label="news-story imagery · caption pulls from CMS · attribution mono">
        <LBLightbox
          variant="caption"
          title="Corridor 35 · Hays County reconstruction"
          meta="Series · 12 images · uploaded 2026-04-18"
          counter="3 of 12"
          zoom="100%"
          image={<LBPlaceholder aspect="3/2" label="corridor view · 3:2" tone="field" />}
          caption="Crews lay subgrade on the southbound lanes of I-35 just north of Kyle. The reconstruction is part of a 14-mile widening that began in 2024 and is expected to complete in late 2027."
          attribution="Photo · J. Rivera · TTI Communications · CC-BY-4.0"
        />
      </LBBox>

      {/* ── 3. With filmstrip ───────────────────────────────── */}
      <LBSectionLabel>3 · With filmstrip — sibling navigation</LBSectionLabel>
      <LBBox label="photo-grid launcher · scrollable thumbnails · active marked maroon-on-gold">
        <LBLightbox
          variant="filmstrip"
          title="2026 Crash safety study · imagery library"
          meta="Series · 8 images · taken by various"
          counter="3 of 8"
          zoom="100%"
          image={<LBPlaceholder aspect="16/9" label="study photo · 16:9" tone="asphalt" />}
          filmstrip={[
            { tone: "field"   },
            { tone: "asphalt" },
            { tone: "sky"     },
            { tone: "field"   },
            { tone: "asphalt" },
            { tone: "maroon"  },
            { tone: "sky"     },
            { tone: "field"   },
          ]}
          filmstripActive={2}
        />
      </LBBox>

      {/* ── 4. Document mode ───────────────────────────────── */}
      <LBSectionLabel>4 · Document mode — portrait imagery, PDFs, scanned reports</LBSectionLabel>
      <LBBox label="narrow stage · zoom defaults to fit-width · rotate enabled">
        <LBLightbox
          variant="default"
          title="Annual report · 2025"
          meta="Page 14 of 64 · application/pdf · 4.8 MB"
          counter="14 of 64"
          zoom="125%"
          image={<LBPlaceholder aspect="3/4" label="document page · 8.5×11 portrait" tone="sky" />}
        />
      </LBBox>

      {/* ── 5. With annotations ─────────────────────────────── */}
      <LBSectionLabel>5 · With annotations — pinned numerical markers</LBSectionLabel>
      <LBBox label="research review · numbered pins reference footnotes elsewhere">
        <LBLightbox
          variant="caption"
          title="Intersection · US 290 × FM 1431"
          meta="Aerial · 2026-03-22 · sUAS"
          counter="2 of 5"
          zoom="150%"
          image={<LBPlaceholder aspect="16/9" label="aerial · 16:9" tone="asphalt" />}
          showAnnotations
          caption={
            <span>
              Pin <strong>1</strong> shows the eastbound queue at peak PM. <strong>2</strong> marks the proposed
              channelization island. <strong>3</strong> identifies the relocated pedestrian crossing per the 2025
              corridor study.
            </span>
          }
          attribution="Imagery · TTI · CC-BY-4.0 · captured under FAA part 107"
        />
      </LBBox>

      <LBSpecRow>
        <LBSpec label="Scrim"        value="#0E0907 · 100%"     note="Warm near-black; never pure black. Backdrop-blur layer on chrome." />
        <LBSpec label="Top chrome"   value="title + meta + ✕"   note="Display face for title; JetBrains Mono for meta line." />
        <LBSpec label="Counter"      value="JetBrains Mono"     note="`N of M` · tabular-nums · bottom-left." />
        <LBSpec label="Zoom step"    value="25 / 50 / 100 / 150 / 200 / 400" note="Keyboard: + / − / 0 (reset) / F (fit)." />
        <LBSpec label="Arrows"       value="40×40 · 45% scrim"  note="Hidden when N ≤ 1. Keyboard: ← / →." />
        <LBSpec label="Filmstrip"    value="78×52 thumbs"       note="Active gets 2px gold border + 1.0 opacity." />
        <LBSpec label="Close"        value="✕ + Esc"            note="Both work; Esc dismisses even when zoomed." />
        <LBSpec label="Lineage"      value="Teams Lightbox-view" note="Anatomy only · TUX type, warm scrim, maroon/gold." />
      </LBSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Export
// ════════════════════════════════════════════════════════════════════════

window.ImageLightboxPage = ImageLightboxPage;
