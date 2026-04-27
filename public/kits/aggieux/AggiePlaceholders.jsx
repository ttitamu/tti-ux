/* global React */
/*
 * AggiePlaceholders.jsx — reusable "image/media went here" placeholders.
 *
 * Stylized gradient boxes with a dimensions label, per the style guide choice.
 * Three flavors matching the style variants:
 *   - MediaBox style="default"  → soft gradient + centered label
 *   - MediaBox style="bold"     → saturated maroon block + hash crop mark
 *   - MediaBox style="elegant"  → tonal tint + thin ruled border + serif caption
 */

function MediaBox({ w = 480, h = 270, style = "default", label, ratio, onDark = false, ...rest }) {
  const aspect = ratio || `${w} / ${h}`;
  const common = {
    width: "100%",
    aspectRatio: aspect,
    borderRadius: "var(--radius-md)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    ...rest.style,
  };

  if (style === "bold") {
    return (
      <div style={{ ...common, background: "linear-gradient(135deg, #5C0025 0%, #3A0017 100%)", color: "#fff" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(90deg, rgba(221,172,55,0.16) 0 2px, transparent 2px 18px)", opacity: 0.7 }} />
        <div style={{ position: "relative", textAlign: "center" }}>
          <div style={{ fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", opacity: 0.75, marginBottom: 6, fontFamily: "var(--font-body-bold)" }}>media</div>
          <div style={{ fontSize: "0.95rem", fontFamily: "var(--font-mono)", opacity: 0.9 }}>{label || `${w} × ${h}`}</div>
        </div>
        <CornerMarks color="rgba(221,172,55,0.5)" />
      </div>
    );
  }

  if (style === "elegant") {
    return (
      <div style={{ ...common, background: onDark ? "color-mix(in srgb, var(--brand-accent) 14%, #2a0c0c)" : "color-mix(in srgb, var(--brand-accent) 10%, #faf7f3)", border: `1px solid ${onDark ? "rgba(221,172,55,0.3)" : "rgba(175,136,70,0.4)"}`, color: onDark ? "#fff" : "var(--brand-primary)" }}>
        <div style={{ position: "absolute", inset: 8, border: `1px dashed ${onDark ? "rgba(221,172,55,0.35)" : "rgba(175,136,70,0.35)"}`, borderRadius: 4 }} />
        <div style={{ position: "relative", textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-elegant, Georgia, serif)", fontStyle: "italic", fontSize: "1.1rem", marginBottom: 4 }}>{label || "media"}</div>
          <div style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", opacity: 0.65 }}>{w} × {h}</div>
        </div>
      </div>
    );
  }

  // default
  return (
    <div style={{ ...common, background: onDark ? "linear-gradient(135deg, #3c2029 0%, #2a0f18 100%)" : "linear-gradient(135deg, color-mix(in srgb, var(--brand-primary) 8%, #fff) 0%, color-mix(in srgb, var(--brand-primary) 15%, #fff) 100%)", color: onDark ? "#fff" : "var(--text-secondary)" }}>
      <div style={{ position: "absolute", top: 12, left: 12, fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: "var(--font-body-bold)", opacity: 0.7 }}>media</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", opacity: 0.85 }}>{label || `${w} × ${h}`}</div>
    </div>
  );
}

function CornerMarks({ color = "currentColor", size = 12 }) {
  const s = { position: "absolute", width: size, height: size, borderColor: color, borderStyle: "solid" };
  return (
    <>
      <div style={{ ...s, top: 8, left: 8, borderWidth: "1px 0 0 1px" }} />
      <div style={{ ...s, top: 8, right: 8, borderWidth: "1px 1px 0 0" }} />
      <div style={{ ...s, bottom: 8, left: 8, borderWidth: "0 0 1px 1px" }} />
      <div style={{ ...s, bottom: 8, right: 8, borderWidth: "0 1px 1px 0" }} />
    </>
  );
}

// ─── AvatarBox — smaller placeholder tuned for contact/testimonial cards ──
function AvatarBox({ size = 96, initials = "TTI", onDark = false }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: onDark ? "color-mix(in srgb, #fff 12%, transparent)" : "color-mix(in srgb, var(--brand-primary) 12%, #fff)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 500, fontSize: size * 0.35, color: onDark ? "#fff" : "var(--brand-primary)", letterSpacing: "0.02em" }}>
      {initials}
    </div>
  );
}

Object.assign(window, { MediaBox, AvatarBox, CornerMarks });
