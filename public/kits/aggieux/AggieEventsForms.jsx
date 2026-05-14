/* global React, PageShell, AGGIE_CATALOG, LucideIcon */
/*
 * AggieEventsForms.jsx — Batch 16:
 *   Calendar / event widgets
 *   Inline feed group
 *   Example forms
 *   Code Maroon banner
 *
 * Code Maroon comes straight from TuxCodeMaroon.vue in the repo:
 * three severities (alert / warning / info) with hard-coded colors
 * (#b3261e / #c47800 / #15457e), siren / triangle-alert / info icon,
 * title + message + details link + optional dismiss button. Sticky
 * variant. Pulses by default. Hard-coded — does NOT honor style
 * variants or dark mode.
 *
 * Helper prefix: EV (Events).
 */

// ════════════════════════════════════════════════════════════════════════
// Shared helpers (EV prefix)
// ════════════════════════════════════════════════════════════════════════

function EVBox({ dark = false, label, padded = true, children }) {
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

function EVSectionLabel({ children }) {
  return (
    <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 12, marginTop: 16 }}>{children}</div>
  );
}

function EVSpecRow({ children }) {
  return (
    <div style={{ marginTop: 28, padding: "14px 18px", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>{children}</div>
  );
}

function EVSpec({ label, value, note }) {
  return (
    <div>
      <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--brand-primary)", marginTop: 3, fontWeight: 500 }}>{value}</div>
      {note && <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 2, lineHeight: 1.4 }}>{note}</div>}
    </div>
  );
}

function EVIntro({ children }) {
  return (
    <div style={{ padding: "16px 20px", marginBottom: 28, background: "color-mix(in srgb, var(--brand-primary) 5%, transparent)", borderLeft: "3px solid var(--brand-primary)", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0", fontSize: "0.92rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>
      {children}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// CALENDAR / EVENT WIDGETS
// ════════════════════════════════════════════════════════════════════════

const EV_EVENTS = [
  { date: "May 14",     dow: "Thu", year: "2026", title: "Texas Connected & Automated Vehicles Workshop", time: "9:00 a.m. – 4:30 p.m. CDT", venue: "TTI Headquarters · Bryan-College Station", tag: "Workshop" },
  { date: "May 22",     dow: "Fri", year: "2026", title: "Roadside Safety Annual Symposium",              time: "8:30 a.m. – 5:00 p.m. CDT", venue: "Rellis Campus · Building 7029",            tag: "Symposium" },
  { date: "Jun 03–05",  dow: "Wed", year: "2026", title: "TRB Visualization in Transportation",           time: "All day",                    venue: "Austin Convention Center",                  tag: "Conference" },
  { date: "Jun 18",     dow: "Thu", year: "2026", title: "Pavement Maintenance Field Workshop",           time: "10:00 a.m. – 2:00 p.m. CDT", venue: "Riverside Annex · Field Lab 4",             tag: "Workshop" },
];

function EVDateBlock({ date, dow, year }) {
  // Date stack — day-of-week eyebrow, big maroon date, year sub.
  const [m, d] = date.split(" ");
  return (
    <div style={{
      width: 90, flexShrink: 0,
      padding: "12px 8px",
      borderRight: "2px solid var(--brand-primary)",
      textAlign: "center",
    }}>
      <div style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>{dow}</div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem", fontWeight: 500, textTransform: "uppercase", color: "var(--text-primary)", marginTop: 4 }}>{m}</div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: "1.95rem", fontWeight: 500, color: "var(--brand-primary)", lineHeight: 1, marginTop: 2 }}>{d}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 6 }}>{year}</div>
    </div>
  );
}

function EVEventCard({ ev }) {
  return (
    <div style={{
      display: "flex", gap: 18, padding: "8px 8px 8px 0",
      border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)",
      background: "var(--surface-page)", overflow: "hidden",
    }}>
      <EVDateBlock date={ev.date} dow={ev.dow} year={ev.year} />
      <div style={{ flex: 1, padding: "14px 14px 14px 0", display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em",
            color: "var(--brand-primary)", fontFamily: "var(--font-body-bold)",
            border: "1px solid color-mix(in srgb, var(--brand-primary) 35%, transparent)",
            padding: "2px 8px", borderRadius: 999,
          }}>{ev.tag}</span>
        </div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.005em", color: "var(--text-primary)", lineHeight: 1.2 }}>
          {ev.title}
        </div>
        <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap", marginTop: 4 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.83rem", color: "var(--text-secondary)" }}>
            <LucideIcon name="clock" size={14} /> {ev.time}
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.83rem", color: "var(--text-secondary)" }}>
            <LucideIcon name="map-pin" size={14} /> {ev.venue}
          </span>
        </div>
      </div>
    </div>
  );
}

function EVMiniCal({ month = "May", year = "2026", highlight = [14, 22], today = 12 }) {
  // 7-col calendar grid. May 2026 starts on Friday.
  // For mock purposes we hard-code first day-of-week and length.
  const firstDayOfWeek = 5; // 0=Sun
  const daysInMonth = 31;
  const cells = [];
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const dows = ["S","M","T","W","T","F","S"];

  return (
    <div style={{
      width: 280, flexShrink: 0,
      border: "1px solid var(--surface-border)",
      borderRadius: "var(--radius-md)",
      background: "var(--surface-page)", padding: 16,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <button style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-secondary)", padding: 4 }}><LucideIcon name="chevron-left" size={16} /></button>
        <div style={{
          fontFamily: "var(--font-display)", fontSize: "0.95rem", fontWeight: 500,
          textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--text-primary)",
        }}>{month} {year}</div>
        <button style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-secondary)", padding: 4 }}><LucideIcon name="chevron-right" size={16} /></button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 4 }}>
        {dows.map((d, i) => (
          <div key={i} style={{ textAlign: "center", fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", padding: "4px 0" }}>{d}</div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
        {cells.map((d, i) => {
          if (d === null) return <div key={i} />;
          const isHighlight = highlight.includes(d);
          const isToday = d === today;
          return (
            <button key={i} style={{
              aspectRatio: "1 / 1", border: "none", padding: 0, cursor: "pointer",
              background: isHighlight ? "var(--brand-primary)" : isToday ? "color-mix(in srgb, var(--brand-primary) 12%, transparent)" : "transparent",
              color: isHighlight ? "#fff" : isToday ? "var(--brand-primary)" : "var(--text-primary)",
              fontFamily: "var(--font-body)", fontWeight: isHighlight || isToday ? 700 : 500,
              fontSize: "0.82rem", borderRadius: 4,
              border: isToday && !isHighlight ? "1px solid color-mix(in srgb, var(--brand-primary) 40%, transparent)" : "none",
            }}>{d}</button>
          );
        })}
      </div>

      <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--surface-border)", display: "flex", gap: 14, flexWrap: "wrap", fontSize: "0.7rem", color: "var(--text-muted)" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 10, height: 10, background: "var(--brand-primary)", borderRadius: 2 }} /> Event
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 10, height: 10, background: "color-mix(in srgb, var(--brand-primary) 12%, transparent)", border: "1px solid color-mix(in srgb, var(--brand-primary) 40%, transparent)", borderRadius: 2 }} /> Today
        </span>
      </div>
    </div>
  );
}

function EVAgendaRow({ ev, last }) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "100px 1fr",
      gap: 18, padding: "12px 0",
      borderBottom: last ? "none" : "1px solid rgb(229,229,229)",
    }}>
      <div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 600 }}>{ev.dow}</div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", fontWeight: 500, color: "var(--brand-primary)", marginTop: 2 }}>{ev.date}</div>
      </div>
      <div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "0.98rem", fontWeight: 500, textTransform: "uppercase", color: "var(--text-primary)", lineHeight: 1.25, marginBottom: 4 }}>
          {ev.title}
        </div>
        <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", display: "flex", gap: 14, flexWrap: "wrap" }}>
          <span>{ev.time}</span>
          <span style={{ color: "rgba(0,0,0,0.2)" }}>·</span>
          <span>{ev.venue}</span>
        </div>
      </div>
    </div>
  );
}

const EV_AGENDA_ROW_DUMMY = "agenda";

const drBtnPrimaryEv = { padding: "7px 14px", background: "var(--brand-primary)", border: "none", borderRadius: "var(--radius-sm)", fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.09em", color: "white", cursor: "pointer" };
const drBtnGhostEv = { padding: "7px 14px", background: "transparent", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-sm)", fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.09em", color: "var(--text-primary)", cursor: "pointer" };

function CalendarEventPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "calendar-event");

  return (
    <PageShell item={item}>
      <EVIntro>
        <strong>Calendar / event widgets</strong> — event surfaces in three densities. The
        full <em>event card</em> stacks a date block (left) against a title + tag + time +
        venue (right). The <em>mini-cal</em> widget pairs a 7-column month grid with a
        compact agenda list — built for sidebars. The <em>agenda list</em> packs many
        upcoming events into a stacked rhythm without imagery.
      </EVIntro>

      <EVSectionLabel>Event card — full width</EVSectionLabel>
      <EVBox label="Light · 4 upcoming events">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {EV_EVENTS.map((ev, i) => <EVEventCard key={i} ev={ev} />)}
        </div>
      </EVBox>

      <EVSectionLabel>Mini-cal + agenda — sidebar widget</EVSectionLabel>
      <EVBox label="Light · 280-px calendar paired with upcoming list">
        <div style={{ display: "flex", gap: 28, alignItems: "flex-start", flexWrap: "wrap" }}>
          <EVMiniCal />
          <div style={{ flex: 1, minWidth: 320 }}>
            <div style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 8 }}>
              upcoming
            </div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.01em", margin: "0 0 12px", lineHeight: 1.2 }}>
              May–June 2026
            </h3>
            <div style={{ background: "var(--surface-page)", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", padding: "4px 16px" }}>
              {EV_EVENTS.map((ev, i) => (
                <EVAgendaRow key={i} ev={ev} last={i === EV_EVENTS.length - 1} />
              ))}
            </div>
            <a style={{
              display: "inline-flex", alignItems: "center", gap: 6, marginTop: 14,
              fontFamily: "var(--font-body-bold)", fontWeight: 700, fontStyle: "italic",
              fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.06em",
              color: "var(--brand-primary)", textDecoration: "none",
            }}>
              View full calendar <LucideIcon name="arrow-up-right" size={12} />
            </a>
          </div>
        </div>
      </EVBox>

      <EVSectionLabel>Dark — event card on maroon</EVSectionLabel>
      <EVBox label="Dark · 2 events" dark>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {EV_EVENTS.slice(0, 2).map((ev, i) => (
            <div key={i} style={{
              display: "flex", gap: 18, padding: "8px 8px 8px 0",
              border: "1px solid rgba(255,255,255,0.18)", borderRadius: "var(--radius-md)",
              background: "rgba(255,255,255,0.06)", overflow: "hidden",
            }}>
              <div style={{
                width: 90, flexShrink: 0, padding: "12px 8px",
                borderRight: "2px solid #F4D58D", textAlign: "center",
              }}>
                <div style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-body-bold)" }}>{ev.dow}</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem", fontWeight: 500, textTransform: "uppercase", color: "rgba(255,255,255,0.95)", marginTop: 4 }}>{ev.date.split(" ")[0]}</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.95rem", fontWeight: 500, color: "#F4D58D", lineHeight: 1, marginTop: 2 }}>{ev.date.split(" ")[1]}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "rgba(255,255,255,0.6)", marginTop: 6 }}>{ev.year}</div>
              </div>
              <div style={{ flex: 1, padding: "14px 14px 14px 0", display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{
                  alignSelf: "flex-start",
                  fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em",
                  color: "#F4D58D", fontFamily: "var(--font-body-bold)",
                  border: "1px solid rgba(244,213,141,0.5)",
                  padding: "2px 8px", borderRadius: 999,
                }}>{ev.tag}</span>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", fontWeight: 500, textTransform: "uppercase", color: "#fff", lineHeight: 1.2 }}>
                  {ev.title}
                </div>
                <div style={{ display: "flex", gap: 18, flexWrap: "wrap", marginTop: 4, color: "rgba(255,255,255,0.85)", fontSize: "0.83rem" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><LucideIcon name="clock" size={14} /> {ev.time}</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><LucideIcon name="map-pin" size={14} /> {ev.venue}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </EVBox>

      <EVSpecRow>
        <EVSpec label="event card" value="90px date / 1fr body" note="Date block left-bordered with 2px maroon rule. Tag pill + 4-line metadata." />
        <EVSpec label="mini-cal" value="280px wide" note="7-col grid; today = light fill, event = filled maroon. Legend below." />
        <EVSpec label="agenda row" value="100 / 1fr" note="Compact list — date eyebrow + title + time/venue. No imagery." />
        <EVSpec label="dark accent" value="--brand-accent" note="Date number + tag pill use gold instead of maroon on dark backgrounds." />
      </EVSpecRow>

      <EVSectionLabel>Refit · Range selector for calendar views (Batch H)</EVSectionLabel>
      <EVBox label="Top-of-calendar control · pairs with `date-range-picker` family">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14, padding: "10px 14px", background: "var(--surface-raised)", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>Range</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "5px 12px", border: "1px solid var(--brand-primary)", borderRadius: "var(--radius-sm)", background: "color-mix(in srgb, var(--brand-primary) 5%, transparent)" }}>
              <LucideIcon name="calendar-days" size={13} color="var(--brand-primary)" />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", fontWeight: 600, color: "var(--brand-primary)" }}>May 1 → May 31, 2026</span>
              <span style={{ fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.7rem", color: "var(--brand-primary)", textTransform: "uppercase", letterSpacing: "0.09em", paddingLeft: 8, borderLeft: "1px solid color-mix(in srgb, var(--brand-primary) 30%, transparent)" }}>31 days</span>
            </span>
          </div>
          <div style={{ display: "inline-flex", padding: 2, background: "var(--surface-sunken)", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-sm)" }}>
            {["Month", "Week", "Day", "Agenda"].map((v, i) => (
              <button key={v} style={{ padding: "5px 12px", border: "none", background: i === 0 ? "var(--surface-raised)" : "transparent", color: i === 0 ? "var(--brand-primary)" : "var(--text-secondary)", fontFamily: "var(--font-body-bold)", fontWeight: 700, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", borderRadius: "calc(var(--radius-sm) - 2px)", cursor: "pointer" }}>{v}</button>
            ))}
          </div>
        </div>
        <div style={{ marginTop: 14, padding: "10px 14px", background: "var(--surface-sunken)", borderRadius: 3, fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.55 }}>
          Use this header above the month grid or agenda list. Clicking the range pill opens the <code>date-range-picker</code> popover; the segmented control switches between Month / Week / Day / Agenda views.
        </div>
      </EVBox>

      <EVSectionLabel>Refit · Event detail popover (Batch H)</EVSectionLabel>
      <EVBox label="Anchored to an agenda row or grid cell · richer than a tooltip">
        <div style={{ display: "flex", justifyContent: "center", padding: "20px 0" }}>
          <div style={{ width: 360, background: "var(--surface-raised)", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", boxShadow: "var(--elevation-overlay, var(--shadow-lg))", overflow: "hidden" }}>
            {/* Color band */}
            <div style={{ height: 4, background: "var(--brand-primary)" }} />
            <div style={{ padding: "14px 18px 16px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "2px 9px", border: "1px solid var(--brand-primary)", borderRadius: 999, fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--brand-primary)", fontFamily: "var(--font-body-bold)" }}>
                  <LucideIcon name="presentation" size={10} />
                  Symposium
                </span>
                <button aria-label="Close" style={{ background: "transparent", border: "none", padding: 2, color: "var(--text-muted)", cursor: "pointer" }}>
                  <LucideIcon name="x" size={13} />
                </button>
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.01em", lineHeight: 1.25, marginBottom: 6 }}>
                Connected freight corridor · annual review
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "16px 1fr", rowGap: 5, columnGap: 8, fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: 10 }}>
                <LucideIcon name="calendar" size={13} />
                <span><strong style={{ color: "var(--text-primary)", fontFamily: "var(--font-body-bold)", fontWeight: 600 }}>Wed, May 27, 2026</strong> · 9:00 AM – 4:30 PM CDT</span>
                <LucideIcon name="map-pin" size={13} />
                <span>TTI Headquarters · Bryan, TX · Carter Auditorium</span>
                <LucideIcon name="users" size={13} />
                <span>Open to TTI staff + invited partners · 42 RSVPs</span>
                <LucideIcon name="link" size={13} />
                <span><a href="#" onClick={(e) => e.preventDefault()} style={{ color: "var(--brand-primary)", fontFamily: "var(--font-mono)", fontSize: "0.78rem" }}>cfc-symposium-2026.tti.tamu.edu</a></span>
              </div>
              <p style={{ marginTop: 12, fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.55, paddingTop: 10, borderTop: "1px solid var(--surface-border)" }}>
                Annual review of TTI's connected-freight-corridor research portfolio. Six 45-min sessions, two breakout panels, closing keynote by Dr. M. Reyes on the I-35 Capital Express findings.
              </p>
              <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button style={drBtnPrimaryEv}>RSVP</button>
                <button style={drBtnGhostEv}>Add to calendar</button>
                <button style={drBtnGhostEv}>Share</button>
              </div>
            </div>
          </div>
        </div>
      </EVBox>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// INLINE FEED GROUP
// ════════════════════════════════════════════════════════════════════════

function EVFeedItem({ source, sourceIcon, ts, body, accent, dark = false }) {
  return (
    <div style={{
      padding: "14px 0",
      borderBottom: dark ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgb(229,229,229)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <div style={{
          width: 22, height: 22, borderRadius: 4,
          background: accent, color: "#fff",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
        }}>
          <LucideIcon name={sourceIcon} size={12} />
        </div>
        <span style={{
          fontFamily: "var(--font-body-bold)", fontWeight: 700,
          fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.08em",
          color: dark ? "#fff" : "var(--text-primary)",
        }}>{source}</span>
        <span style={{ width: 3, height: 3, borderRadius: "50%", background: dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)" }} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: dark ? "rgba(255,255,255,0.65)" : "var(--text-muted)" }}>{ts}</span>
      </div>
      <div style={{
        fontSize: "0.92rem", lineHeight: 1.55,
        color: dark ? "rgba(255,255,255,0.92)" : "var(--text-secondary)",
      }}>
        {body}
      </div>
    </div>
  );
}

function InlineFeedGroupPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "inline-feed-group");

  const FEED_ITEMS = [
    {
      source: "Press release",  sourceIcon: "newspaper",
      ts: "2 hours ago",
      body: "TTI awarded $4.2M FHWA contract to study automated truck-platooning impacts on Texas freight corridors. The four-year program begins this fall.",
      accent: "var(--brand-primary)",
    },
    {
      source: "Researcher post", sourceIcon: "user",
      ts: "Yesterday",
      body: "Dr. Marcus Caldwell on the Center for Air Quality blog — 'Why we're rethinking near-roadway PM 2.5 monitoring after the 2024 ozone-season data.'",
      accent: "#15457e",
    },
    {
      source: "Media mention",   sourceIcon: "tv",
      ts: "Mar 28",
      body: "TTI's connected-vehicle testbed featured in The Texas Tribune's coverage of the I-35 corridor modernization plan.",
      accent: "#c47800",
    },
    {
      source: "Publication",     sourceIcon: "file-text",
      ts: "Mar 22",
      body: "New report: 'Pavement performance under extreme heat — a 5-year longitudinal study across the El Paso district.' Open access in the TTI repository.",
      accent: "var(--brand-primary)",
    },
  ];

  return (
    <PageShell item={item}>
      <EVIntro>
        <strong>Inline feed group</strong> — embeddable activity stream that aggregates
        from multiple sources (press releases, researcher posts, media mentions,
        publications). Each row carries a small source-tag chip + timestamp + body. The
        block is meant to live inside another page, not stand alone — so it ships its
        own heading + signature rule, then a tight stacked list.
      </EVIntro>

      <EVSectionLabel>Light — 4 sources mixed</EVSectionLabel>
      <EVBox label="Light · default style">
        <div>
          <div style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 8 }}>
            in the news
          </div>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.01em", margin: "0 0 8px", lineHeight: 1.15 }}>
            Latest from TTI
          </h3>
          <div style={{ width: 64, height: 1, background: "linear-gradient(90deg, transparent 0%, var(--brand-primary) 15%, var(--brand-primary) 85%, transparent 100%)", marginBottom: 8 }} />
          <div>
            {FEED_ITEMS.map((it, i) => <EVFeedItem key={i} {...it} />)}
          </div>
          <a style={{
            display: "inline-flex", alignItems: "center", gap: 6, marginTop: 16,
            fontFamily: "var(--font-body-bold)", fontWeight: 700, fontStyle: "italic",
            fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.06em",
            color: "var(--brand-primary)",
          }}>
            See all activity <LucideIcon name="arrow-up-right" size={12} />
          </a>
        </div>
      </EVBox>

      <EVSectionLabel>Single-source — only press releases</EVSectionLabel>
      <EVBox label="Light · filtered to one source">
        <div>
          <div style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 8 }}>
            press
          </div>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.01em", margin: "0 0 16px", lineHeight: 1.15 }}>
            Recent announcements
          </h3>
          <div>
            {FEED_ITEMS.filter(f => f.source === "Press release").map((it, i) => <EVFeedItem key={i} {...it} />)}
            {[
              { source: "Press release", sourceIcon: "newspaper", ts: "Mar 14", body: "TTI partners with Texas Tech and UTSA on a new $11.6M USDOT pooled-fund study of multimodal freight resilience.", accent: "var(--brand-primary)" },
              { source: "Press release", sourceIcon: "newspaper", ts: "Mar 02", body: "Center for Transportation Safety releases the 2025 Texas Crash Cost Estimate — economic loss methodology now in v3.0.", accent: "var(--brand-primary)" },
            ].map((it, i) => <EVFeedItem key={`extra-${i}`} {...it} />)}
          </div>
        </div>
      </EVBox>

      <EVSectionLabel>Dark — on maroon</EVSectionLabel>
      <EVBox label="Dark · default" dark>
        <div>
          <div style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-body-bold)", marginBottom: 8 }}>
            in the news
          </div>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.01em", margin: "0 0 8px", lineHeight: 1.15, color: "#fff" }}>
            Latest from TTI
          </h3>
          <div style={{ width: 64, height: 1, background: "linear-gradient(90deg, transparent 0%, #F4D58D 15%, #F4D58D 85%, transparent 100%)", marginBottom: 8 }} />
          <div>
            {FEED_ITEMS.slice(0, 3).map((it, i) => <EVFeedItem key={i} {...it} dark />)}
          </div>
        </div>
      </EVBox>

      <EVSpecRow>
        <EVSpec label="row" value="22px chip + body" note="Source pill (icon+label) + timestamp on row 1; body text on row 2." />
        <EVSpec label="source colors" value="per-source" note="Press = maroon, researcher = navy, media = amber, publication = maroon." />
        <EVSpec label="divider" value="1px hairline" note="Between every item; no divider after the last item." />
        <EVSpec label="usage" value="inline embed" note="Always lives inside another page — ships its own heading + signature rule." />
      </EVSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// EXAMPLE FORMS
// ════════════════════════════════════════════════════════════════════════

function EVField({ label, required, hint, error, children }) {
  return (
    <label style={{ display: "block", marginBottom: 18 }}>
      <span style={{
        display: "block",
        fontFamily: "var(--font-body-bold)", fontWeight: 700,
        fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.1em",
        color: error ? "#b3261e" : "var(--text-primary)",
        marginBottom: 6,
      }}>
        {label}
        {required && <span style={{ color: "var(--brand-primary)", marginLeft: 4 }}>*</span>}
      </span>
      {children}
      {hint && !error && <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 5 }}>{hint}</div>}
      {error && <div style={{ fontSize: "0.78rem", color: "#b3261e", marginTop: 5, display: "flex", alignItems: "center", gap: 6 }}><LucideIcon name="alert-circle" size={13} /> {error}</div>}
    </label>
  );
}

const EV_INPUT_STYLE = {
  width: "100%", padding: "10px 12px",
  border: "1px solid var(--surface-border)", borderRadius: "var(--radius-sm)",
  fontFamily: "var(--font-body)", fontSize: "0.92rem",
  background: "var(--surface-page)", color: "var(--text-primary)",
  boxSizing: "border-box",
};

const EV_INPUT_ERROR_STYLE = {
  ...EV_INPUT_STYLE,
  borderColor: "#b3261e",
  borderWidth: 2,
  padding: "9px 11px",
};

function ExampleFormsPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "example-forms");

  return (
    <PageShell item={item}>
      <EVIntro>
        <strong>Example forms</strong> — three reference layouts for the most common
        institutional forms: <em>Contact</em> (3 fields, single column), <em>Event
        registration</em> (8 fields, two-column grid for personal + meal/access), and
        <em>RFP submission</em> (long-form with file upload). All share the same field
        atom — uppercase label + required asterisk + input + hint or error. Buttons stay
        Work Sans 700 regardless of style variant.
      </EVIntro>

      <EVSectionLabel>Contact form — single column</EVSectionLabel>
      <EVBox label="Light · 3 fields + textarea + submit">
        <form style={{ maxWidth: 560 }}>
          <EVField label="Full name" required>
            <input style={EV_INPUT_STYLE} placeholder="Jane Aggie" defaultValue="" />
          </EVField>
          <EVField label="Email address" required hint="We'll only use this to reply.">
            <input type="email" style={EV_INPUT_STYLE} placeholder="you@example.com" />
          </EVField>
          <EVField label="What can we help with?" required>
            <select style={EV_INPUT_STYLE} defaultValue="">
              <option value="">Select a topic…</option>
              <option>Research collaboration</option>
              <option>Press inquiry</option>
              <option>Speaker request</option>
              <option>Other</option>
            </select>
          </EVField>
          <EVField label="Your message" required hint="Up to 500 characters.">
            <textarea style={{ ...EV_INPUT_STYLE, minHeight: 110, resize: "vertical" }} placeholder="Tell us about your project, deadline, and any context that would help us route this correctly." />
          </EVField>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 24 }}>
            <button style={{
              padding: "12px 26px", border: "none", background: "var(--brand-primary)",
              color: "#fff", fontFamily: "var(--font-body-bold)", fontWeight: 700,
              fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.12em", cursor: "pointer",
              borderRadius: "var(--radius-sm)",
            }}>Send message</button>
            <button style={{
              padding: "12px 18px", border: "1px solid var(--surface-border)", background: "transparent",
              color: "var(--text-primary)", fontFamily: "var(--font-body-bold)", fontWeight: 700,
              fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.12em", cursor: "pointer",
              borderRadius: "var(--radius-sm)",
            }}>Cancel</button>
          </div>
        </form>
      </EVBox>

      <EVSectionLabel>Event registration — two columns</EVSectionLabel>
      <EVBox label="Light · 8 fields, grid layout, with hint + error states">
        <form>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px", maxWidth: 720 }}>
            <EVField label="First name" required>
              <input style={EV_INPUT_STYLE} defaultValue="Marisol" />
            </EVField>
            <EVField label="Last name" required>
              <input style={EV_INPUT_STYLE} defaultValue="Adler" />
            </EVField>
            <EVField label="Email" required error="Please enter a valid email address.">
              <input type="email" style={EV_INPUT_ERROR_STYLE} defaultValue="marisol@" />
            </EVField>
            <EVField label="Affiliation" required>
              <input style={EV_INPUT_STYLE} defaultValue="Texas A&M Transportation Institute" />
            </EVField>
            <EVField label="Role">
              <select style={EV_INPUT_STYLE} defaultValue="researcher">
                <option value="">Select role…</option>
                <option value="researcher">Researcher / faculty</option>
                <option value="grad">Graduate student</option>
                <option value="agency">Agency partner</option>
                <option value="industry">Industry</option>
              </select>
            </EVField>
            <EVField label="Session preference" hint="Optional — we'll do our best to honor.">
              <select style={EV_INPUT_STYLE} defaultValue="">
                <option value="">No preference</option>
                <option>Track A — Connected Vehicles</option>
                <option>Track B — Pavement & Materials</option>
                <option>Track C — Human Factors</option>
              </select>
            </EVField>
            <EVField label="Dietary needs">
              <input style={EV_INPUT_STYLE} placeholder="Vegetarian, gluten-free, kosher, etc." />
            </EVField>
            <EVField label="Accessibility needs">
              <input style={EV_INPUT_STYLE} placeholder="ASL, captions, mobility — we'll plan accordingly." />
            </EVField>
          </div>
          <label style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: 8 }}>
            <input type="checkbox" defaultChecked style={{ marginTop: 3 }} />
            <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              I understand my contact information will be used solely for event coordination and will not be shared with third parties.
            </span>
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 24 }}>
            <button style={{
              padding: "12px 26px", border: "none", background: "var(--brand-primary)",
              color: "#fff", fontFamily: "var(--font-body-bold)", fontWeight: 700,
              fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.12em", cursor: "pointer",
              borderRadius: "var(--radius-sm)",
            }}>Register</button>
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
              <span style={{ color: "var(--brand-primary)" }}>*</span> required
            </span>
          </div>
        </form>
      </EVBox>

      <EVSectionLabel>RFP submission — long-form with file upload</EVSectionLabel>
      <EVBox label="Light · proposal-submission flow">
        <form style={{ maxWidth: 720 }}>
          <EVField label="Project title" required>
            <input style={EV_INPUT_STYLE} defaultValue="Quantifying truck-platooning impacts on rural Texas corridors" />
          </EVField>
          <EVField label="Principal investigator" required>
            <input style={EV_INPUT_STYLE} defaultValue="Dr. Diego Alvarez, TTI Freight Mobility" />
          </EVField>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
            <EVField label="Proposed start date" required>
              <input type="date" style={EV_INPUT_STYLE} defaultValue="2026-09-01" />
            </EVField>
            <EVField label="Duration (months)" required>
              <input type="number" style={EV_INPUT_STYLE} defaultValue="48" min="1" max="60" />
            </EVField>
            <EVField label="Total budget request" required hint="USD. Include indirects.">
              <input type="text" style={EV_INPUT_STYLE} defaultValue="$4,200,000" />
            </EVField>
            <EVField label="Funding agency" required>
              <select style={EV_INPUT_STYLE} defaultValue="fhwa">
                <option value="fhwa">FHWA</option>
                <option value="usdot">USDOT</option>
                <option value="txdot">TxDOT</option>
                <option value="nsf">NSF</option>
                <option value="other">Other</option>
              </select>
            </EVField>
          </div>
          <EVField label="Project narrative" required hint="Up to 2,500 words. Markdown supported.">
            <textarea style={{ ...EV_INPUT_STYLE, minHeight: 120 }} placeholder="Background, objectives, methodology, deliverables, broader impacts…" />
          </EVField>
          <EVField label="Attach proposal package" hint="PDF or ZIP, up to 50MB.">
            <div style={{
              border: "1px dashed var(--surface-border)", borderRadius: "var(--radius-sm)",
              padding: "20px 24px", display: "flex", alignItems: "center", gap: 14,
              background: "var(--surface-sunken)",
            }}>
              <LucideIcon name="upload-cloud" size={28} color="var(--text-muted)" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.88rem", color: "var(--text-primary)", fontWeight: 500 }}>Drop files here, or <span style={{ color: "var(--brand-primary)", textDecoration: "underline", textDecorationStyle: "dotted", textUnderlineOffset: 3, fontWeight: 600 }}>browse</span></div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>One file at a time · max 50MB</div>
              </div>
            </div>
          </EVField>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 24, paddingTop: 18, borderTop: "1px solid var(--surface-border)" }}>
            <button style={{
              padding: "12px 26px", border: "none", background: "var(--brand-primary)",
              color: "#fff", fontFamily: "var(--font-body-bold)", fontWeight: 700,
              fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.12em", cursor: "pointer",
              borderRadius: "var(--radius-sm)",
            }}>Submit proposal</button>
            <button style={{
              padding: "12px 18px", border: "1px solid var(--surface-border)", background: "transparent",
              color: "var(--text-primary)", fontFamily: "var(--font-body-bold)", fontWeight: 700,
              fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.12em", cursor: "pointer",
              borderRadius: "var(--radius-sm)",
            }}>Save draft</button>
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginLeft: "auto" }}>
              Last saved <span style={{ fontFamily: "var(--font-mono)" }}>14:32 CDT</span>
            </span>
          </div>
        </form>
      </EVBox>

      <EVSpecRow>
        <EVSpec label="label" value="0.72rem · 700 · upper" note="Work Sans bold, 0.1em letter-spacing. Required = maroon asterisk." />
        <EVSpec label="input" value="10px / 12px pad" note="1px border, 4px radius. Error = 2px red border + icon + message." />
        <EVSpec label="hint" value="0.78rem muted" note="Sits below input; replaced by error message when validation fails." />
        <EVSpec label="buttons" value="Work Sans 700" note="Constant — buttons never style-switch. Primary = maroon fill, secondary = ghost." />
      </EVSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// CODE MAROON BANNER
//   Mirrors TuxCodeMaroon.vue — alert / warning / info severities,
//   hard-coded colors, role=alert, slide-in transition, optional
//   dismiss + sticky variants.
// ════════════════════════════════════════════════════════════════════════

const CM_SEVERITY = {
  alert:   { bg: "#b3261e", icon: "siren",          title: "Emergency alert",    label: "ALERT" },
  warning: { bg: "#c47800", icon: "triangle-alert", title: "Weather advisory",   label: "WARNING" },
  info:    { bg: "#15457e", icon: "info",           title: "Code Maroon notice", label: "INFO" },
};

function CMBanner({ severity = "alert", title, message, dismissible = false, sticky = false, pulse = true }) {
  const cfg = CM_SEVERITY[severity];
  const t = title || cfg.title;
  return (
    <aside
      role="alert"
      aria-live="assertive"
      style={{
        background: cfg.bg, color: "#fff",
        fontFamily: "var(--font-body-bold)",
        position: sticky ? "sticky" : "static",
        top: sticky ? 0 : undefined,
        zIndex: sticky ? 100 : undefined,
        width: "100%",
      }}>
      <div style={{
        padding: "12px 20px",
        display: "flex", alignItems: "center", gap: 14,
        maxWidth: 1280, margin: "0 auto",
        flexWrap: "wrap",
      }}>
        <div style={{
          flexShrink: 0,
          animation: pulse && severity !== "info" ? "cm-pulse 2s ease-in-out infinite" : "none",
        }}>
          <LucideIcon name={cfg.icon} size={20} color="#fff" />
        </div>
        <div style={{ flex: 1, minWidth: 240, display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{
            fontWeight: 700, fontSize: "0.72rem",
            textTransform: "uppercase", letterSpacing: "0.14em",
            opacity: 0.9,
          }}>{t}</span>
          {message && (
            <span style={{
              fontFamily: "var(--font-body)", fontWeight: 500,
              fontSize: "0.92rem", lineHeight: 1.45,
            }}>{message}</span>
          )}
        </div>
        <a href="https://rellis.tamus.edu/emergency/" target="_blank" rel="noopener" style={{
          color: "#fff", textDecoration: "underline", textUnderlineOffset: 3,
          textDecorationColor: "rgba(255,255,255,0.5)",
          fontWeight: 700, fontSize: "0.78rem",
          textTransform: "uppercase", letterSpacing: "0.06em",
          display: "inline-flex", alignItems: "center", gap: 6,
          flexShrink: 0,
        }}>
          View details <LucideIcon name="arrow-up-right" size={13} color="#fff" />
        </a>
        {dismissible && (
          <button aria-label="Dismiss alert" style={{
            background: "rgba(255,255,255,0.08)", border: "none", color: "#fff",
            width: 32, height: 32, borderRadius: 4, cursor: "pointer",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <LucideIcon name="x" size={16} color="#fff" />
          </button>
        )}
      </div>
    </aside>
  );
}

function CodeMaroonBannerPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "code-maroon-banner");

  return (
    <PageShell item={item}>
      <style>{`@keyframes cm-pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.7; transform: scale(1.08); } }`}</style>

      <EVIntro>
        <strong>Code Maroon banner</strong> — TAMUS's mandatory emergency-notification surface.
        TTI/RELLIS routes through <code>rellis.tamus.edu/emergency/</code>. When active, the
        banner pins above all chrome until the alert clears upstream or the user dismisses
        it (when allowed). <strong>This banner does not theme.</strong> Severity colors
        (alert / warning / info) are hard-coded — they don't honor <code>data-theme</code>
        or style variants. Visual recognition outranks brand consistency in emergencies.
        Source of truth: <code>app/components/TuxCodeMaroon.vue</code>.
      </EVIntro>

      <EVSectionLabel>Severity = alert (red, urgent)</EVSectionLabel>
      <EVBox label="Alert · pulse + emergency icon" padded={false}>
        <CMBanner
          severity="alert"
          title="Emergency alert"
          message="Severe thunderstorm warning in effect for Brazos County until 9:45 p.m. CDT. Take shelter indoors immediately."
        />
      </EVBox>

      <EVSectionLabel>Severity = warning (amber, advisory)</EVSectionLabel>
      <EVBox label="Warning · pulse + triangle-alert icon" padded={false}>
        <CMBanner
          severity="warning"
          title="Weather advisory"
          message="Heat index is forecast to exceed 105 °F across the Bryan-College Station area between 1 p.m. and 7 p.m. tomorrow."
        />
      </EVBox>

      <EVSectionLabel>Severity = info (navy, informational, no pulse)</EVSectionLabel>
      <EVBox label="Info · static icon · dismissible" padded={false}>
        <CMBanner
          severity="info"
          title="Code Maroon test"
          message="A scheduled test of the Code Maroon emergency-notification system will run today at 11:55 a.m. CDT. No action required."
          dismissible
        />
      </EVBox>

      <EVSectionLabel>Sticky variant — pinned at viewport top</EVSectionLabel>
      <EVBox label="Sticky · alert + dismiss" padded={false}>
        <div style={{ height: 220, overflowY: "auto", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-sm)" }}>
          <CMBanner
            severity="alert"
            sticky
            dismissible
            title="Emergency alert"
            message="Active shooter reported at the Memorial Student Center. Run, hide, fight. Follow instructions from officers on scene."
          />
          <div style={{ padding: 28, fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.65 }}>
            <p>(Scrollable container demonstrating sticky pin behavior.)</p>
            <p>The banner stays anchored to the top of the scroll region while page content moves underneath. In production, <code>sticky</code> is paired with <code>position: sticky; top: 0; z-index: 100</code> on the viewport itself.</p>
            <p>Mount the banner above your site header — never below it. If a Code Maroon alert is active, it must be the first thing visible on every page of every TAMUS web property.</p>
            <p>Real consumers fetch alert state from the institutional feed (Rellis API or Code Maroon RSS) and drive <code>active</code> + <code>message</code> from that. Pass <code>:active="false"</code> when no alert is in effect.</p>
            <p>Dismiss is non-default. Emergency messages are non-dismissible by institutional convention; only test/info messages should opt in to dismiss.</p>
          </div>
        </div>
      </EVBox>

      <EVSectionLabel>Title-only variant (no message body)</EVSectionLabel>
      <EVBox label="Alert · short title only" padded={false}>
        <CMBanner severity="alert" title="Code Maroon active — see emergency portal" />
      </EVBox>

      <EVSpecRow>
        <EVSpec label="alert" value="#b3261e" note="Red · siren icon · pulses 2s ease-in-out infinite. Default severity." />
        <EVSpec label="warning" value="#c47800" note="Amber · triangle-alert icon · pulses." />
        <EVSpec label="info" value="#15457e" note="Navy · info icon · NO pulse. Used for tests + non-urgent advisories." />
        <EVSpec label="rules" value="role=alert · aria-live" note="Mounts above site chrome. NEVER themes — colors are fixed across light/dark/style variants." />
      </EVSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// EXPORT
// ════════════════════════════════════════════════════════════════════════

Object.assign(window, { CalendarEventPage, InlineFeedGroupPage, ExampleFormsPage, CodeMaroonBannerPage });
