/* global React, PageShell, AGGIE_CATALOG, LucideIcon */
/*
 * AggieDisclosure.jsx — Batch 10: Accordion / disclosure patterns.
 *
 *   Accordion groups        — generic FAQ-style expand/collapse rows.
 *   Publication accordion   — accordion tuned for academic publications:
 *                             title row, expanded panel shows authors, year,
 *                             abstract, citation, BibTeX/PDF download.
 *   Q&A collections         — editorial Q&A pattern: question prompt above
 *                             long-form answer; answers stay open by default
 *                             (it's an article, not a hide-and-show).
 *
 * Helper prefix: DC (DisClosure). All helpers prefixed to avoid Babel
 * cross-file scope collisions.
 */

// ════════════════════════════════════════════════════════════════════════
// Shared helpers (DC prefix)
// ════════════════════════════════════════════════════════════════════════

function DCBox({ dark = false, label, padded = true, children }) {
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

function DCSectionLabel({ children }) {
  return (
    <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)", marginBottom: 12, marginTop: 16 }}>{children}</div>
  );
}

function DCSpecRow({ children }) {
  return (
    <div style={{ marginTop: 28, padding: "14px 18px", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>{children}</div>
  );
}

function DCSpec({ label, value, note }) {
  return (
    <div>
      <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "var(--font-body-bold)" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--brand-primary)", marginTop: 3, fontWeight: 500 }}>{value}</div>
      {note && <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 2, lineHeight: 1.4 }}>{note}</div>}
    </div>
  );
}

function DCIntro({ children }) {
  return (
    <div style={{ padding: "16px 20px", marginBottom: 28, background: "color-mix(in srgb, var(--brand-primary) 5%, transparent)", borderLeft: "3px solid var(--brand-primary)", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0", fontSize: "0.92rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>
      {children}
    </div>
  );
}

function DCSig({ style, dark, width = 80 }) {
  const c = dark ? "rgba(255,255,255,0.9)" : "var(--brand-primary)";
  if (style === "bold") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <span style={{ display: "block", width: width * 0.55, height: 5, borderRadius: 3, background: c }} />
        <span style={{ display: "block", width: width * 0.18, height: 5, borderRadius: 3, background: c, opacity: 0.5 }} />
        <span style={{ display: "block", width: width * 0.08, height: 5, borderRadius: 3, background: c, opacity: 0.25 }} />
      </div>
    );
  }
  if (style === "elegant") {
    const accent = dark ? "rgba(255,255,255,0.9)" : "var(--brand-accent)";
    return (
      <div style={{
        width, height: 7,
        backgroundImage: `repeating-linear-gradient(135deg, ${accent} 0 1px, transparent 1px 5px)`,
        WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 15%, black 85%, transparent 100%)",
        maskImage: "linear-gradient(90deg, transparent 0%, black 15%, black 85%, transparent 100%)",
        opacity: 0.75,
      }} />
    );
  }
  return (
    <div style={{
      width, height: 1,
      background: `linear-gradient(90deg, transparent 0%, ${c} 15%, ${c} 85%, transparent 100%)`,
      opacity: 0.85,
    }} />
  );
}

function DCSectionHead({ style, dark, eyebrow, title, lede }) {
  const headColor = dark ? "white" : "var(--text-primary)";
  const ledeColor = dark ? "rgba(255,255,255,0.85)" : "var(--text-secondary)";
  const eyebrowColor = dark ? "rgba(255,255,255,0.75)" : "var(--text-muted)";

  let headFamily = "var(--font-display)";
  let headTransform = "uppercase";
  let headWeight = 500;
  let headStyle = "normal";
  let headLetter = "0.01em";
  let headSize = "1.55rem";

  if (style === "bold") {
    headFamily = "var(--font-body-bold)";
    headWeight = 700;
    headTransform = "none";
    headLetter = 0;
  } else if (style === "elegant") {
    headFamily = "var(--font-elegant, Georgia, serif)";
    headWeight = 400;
    headStyle = "italic";
    headTransform = "none";
    headLetter = "-0.005em";
    headSize = "1.7rem";
  }

  return (
    <div style={{ marginBottom: 24 }}>
      {eyebrow && (
        <div style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: eyebrowColor, fontFamily: "var(--font-body-bold)", marginBottom: 8 }}>{eyebrow}</div>
      )}
      <h3 style={{ fontFamily: headFamily, fontSize: headSize, fontWeight: headWeight, fontStyle: headStyle, textTransform: headTransform, letterSpacing: headLetter, margin: "0 0 12px", lineHeight: 1.15, color: headColor }}>{title}</h3>
      <DCSig style={style} dark={dark} width={86} />
      {lede && (
        <p style={{ margin: "14px 0 0", fontSize: "0.95rem", lineHeight: 1.6, color: ledeColor, maxWidth: 580 }}>{lede}</p>
      )}
    </div>
  );
}

// Inline icon helper
function DCIcon({ name, size = 18, color }) {
  if (window.LucideIcon) {
    return <LucideIcon name={name} size={size} color={color || "currentColor"} strokeWidth={1.75} />;
  }
  return <span style={{ display: "inline-block", width: size, height: size, background: "currentColor", opacity: 0.4, borderRadius: 2 }} />;
}

// ════════════════════════════════════════════════════════════════════════
// Generic <DCDisclosure> primitive
// Stateful expand/collapse row with title bar + animated panel.
// ════════════════════════════════════════════════════════════════════════
function DCDisclosure({ open: controlledOpen, defaultOpen = false, onToggle, header, children, dark, dense = false }) {
  const isControlled = typeof controlledOpen === "boolean";
  const [stateOpen, setStateOpen] = React.useState(defaultOpen);
  const open = isControlled ? controlledOpen : stateOpen;

  const toggle = () => {
    if (!isControlled) setStateOpen((s) => !s);
    if (onToggle) onToggle(!open);
  };

  const borderColor = dark ? "rgba(255,255,255,0.16)" : "var(--surface-border)";

  return (
    <div style={{ borderTop: `1px solid ${borderColor}` }}>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        style={{
          width: "100%", textAlign: "left", appearance: "none",
          background: "transparent", border: 0, cursor: "pointer",
          padding: dense ? "14px 4px" : "20px 4px",
          display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: 16,
          color: dark ? "white" : "var(--text-primary)",
          font: "inherit",
        }}
      >
        {header}
        <span style={{
          width: 28, height: 28, borderRadius: 14,
          border: dark ? "1px solid rgba(255,255,255,0.4)" : "1px solid var(--surface-border)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: dark ? "white" : "var(--brand-primary)",
          background: dark ? "rgba(255,255,255,0.08)" : "var(--surface-page)",
          transition: "transform 200ms ease, background 150ms ease",
          transform: open ? "rotate(45deg)" : "rotate(0deg)",
          flexShrink: 0,
        }}>
          <DCIcon name="plus" size={14} />
        </span>
      </button>
      {open && (
        <div style={{
          padding: dense ? "0 4px 16px" : "0 4px 24px",
          fontSize: "0.95rem", lineHeight: 1.65,
          color: dark ? "rgba(255,255,255,0.85)" : "var(--text-secondary)",
          maxWidth: 720,
        }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Accordion Groups
// Generic FAQ-style — title bar + paragraph body. Single-open or
// many-open behavior; we show both via a small group prop.
// ════════════════════════════════════════════════════════════════════════

const FAQ_DATA = [
  {
    q: "How do I propose a research project to TTI?",
    a: "Sponsored research can come through TxDOT's research program, federal solicitations (FHWA, NHTSA, FMCSA), or as a direct contract. Start by emailing research@tti.tamu.edu with a 1-page concept; we'll route it to the relevant program manager and reply within five business days.",
  },
  {
    q: "What's the typical project timeline?",
    a: "Most TTI studies run 12–36 months. Pre-construction studies and quick-turn safety analyses can wrap in under a year; long-term performance evaluations and CAV deployments often run multi-year with phased deliverables.",
  },
  {
    q: "Can I license a TTI tool or model?",
    a: "Yes — most TTI software, design tools, and predictive models are licensable through Texas A&M Innovation. Common licensees include state DOTs, MPOs, consulting engineers, and infrastructure operators. Pricing depends on use class.",
  },
  {
    q: "How do I get involved as a graduate student?",
    a: "GRA positions are tied to faculty research portfolios. Browse the People page, identify a researcher whose program aligns with your interests, and reach out directly. Most divisions also post open GRA roles on the Texas A&M employment system.",
  },
];

function AccordionItem({ q, a, dark, mode = "single", index, openIndex, setOpenIndex }) {
  const isOpen = mode === "single" ? openIndex === index : openIndex.includes(index);
  const handleToggle = () => {
    if (mode === "single") {
      setOpenIndex(isOpen ? -1 : index);
    } else {
      setOpenIndex(isOpen ? openIndex.filter((i) => i !== index) : [...openIndex, index]);
    }
  };

  return (
    <DCDisclosure
      open={isOpen}
      onToggle={handleToggle}
      dark={dark}
      header={
        <span style={{
          fontFamily: "var(--font-body-bold)", fontSize: "1rem", fontWeight: 600,
          letterSpacing: 0, color: dark ? "white" : "var(--text-primary)",
          lineHeight: 1.35, paddingRight: 12,
        }}>{q}</span>
      }
    >
      <p style={{ margin: 0 }}>{a}</p>
    </DCDisclosure>
  );
}

function AccordionGroup({ data, dark, mode = "single", initialOpen = 0 }) {
  const [openIndex, setOpenIndex] = React.useState(
    mode === "single" ? initialOpen : (initialOpen === -1 ? [] : [initialOpen])
  );
  return (
    <div style={{
      borderBottom: dark ? "1px solid rgba(255,255,255,0.16)" : "1px solid var(--surface-border)",
    }}>
      {data.map((item, i) => (
        <AccordionItem
          key={i}
          index={i}
          q={item.q}
          a={item.a}
          dark={dark}
          mode={mode}
          openIndex={openIndex}
          setOpenIndex={setOpenIndex}
        />
      ))}
    </div>
  );
}

function AccordionGroupsPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "accordion-groups");
  return (
    <PageShell item={item}>
      <DCIntro>
        Accordion groups are the FAQ workhorse — title-bar rows that expand to reveal a paragraph or two of answer. Two behavior modes: <strong>single-open</strong> (default — opening one row closes the others, classic FAQ) and <strong>many-open</strong> (each row toggles independently, better for dense reference content).
      </DCIntro>

      <DCSectionLabel>single-open · default</DCSectionLabel>
      <DCBox label="accordion · single-open · default">
        <DCSectionHead style="default" eyebrow="FAQ" title="Frequently asked" lede="The questions sponsors, students, and partners ask most." />
        <AccordionGroup data={FAQ_DATA} dark={false} mode="single" initialOpen={0} />
      </DCBox>

      <DCSectionLabel>many-open · bold</DCSectionLabel>
      <DCBox label="accordion · many-open · bold">
        <DCSectionHead style="bold" eyebrow="Reference" title="Sponsor handbook" lede="Independent sections — open as many as you need; we won't auto-close the others on you." />
        <AccordionGroup data={FAQ_DATA} dark={false} mode="many" initialOpen={-1} />
      </DCBox>

      <DCSectionLabel>single-open · elegant</DCSectionLabel>
      <DCBox label="accordion · single-open · elegant">
        <DCSectionHead style="elegant" eyebrow="Inquiries" title="Common questions" lede="Patient answers to recurring ones, kept under a single roof." />
        <AccordionGroup data={FAQ_DATA.slice(0, 3)} dark={false} mode="single" initialOpen={0} />
      </DCBox>

      <DCSectionLabel>single-open · on dark · default</DCSectionLabel>
      <DCBox dark label="accordion · single-open · on dark · default">
        <DCSectionHead style="default" dark eyebrow="FAQ" title="Frequently asked" />
        <AccordionGroup data={FAQ_DATA} dark={true} mode="single" initialOpen={0} />
      </DCBox>

      <DCSpecRow>
        <DCSpec label="behavior"     value="single / many" note="Single-open is the FAQ default; many-open for reference content." />
        <DCSpec label="trigger"      value="full-width row" note="Whole bar is the click target, not just the +/− affordance." />
        <DCSpec label="indicator"    value="+ → ×"          note="A 28px circle housing a +. Rotates 45° on open." />
        <DCSpec label="aria"         value="aria-expanded" note="Plus aria-controls on the panel for AT semantics." />
      </DCSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Publication Accordion
// Tuned for academic publications: row shows title; expanded panel
// shows authors, year, journal, abstract, and citation/PDF actions.
// ════════════════════════════════════════════════════════════════════════

const PUB_DATA = [
  {
    title: "Vulnerable Road User Outcomes at Signalized Intersections: A Twelve-City Study",
    authors: "Park, S.; Quintero, A.; Brennan, T. M.; Geedipally, S. R.",
    year: "2024",
    journal: "Transportation Research Record",
    volume: "Volume 2678 · Issue 9 · pp. 412–429",
    abstract: "We analyze 14,322 pedestrian and cyclist crash events at signalized intersections across twelve U.S. cities (2018–2022), correlating outcome severity with intersection geometry, signal phasing, and approach-leg vehicle volume. Results show signal-phase modifications can reduce KSI outcomes by 22–34%, with stronger effects at four-leg intersections and on principal arterials.",
    type: "Peer-reviewed article",
    pdfSize: "PDF · 4.1 MB",
  },
  {
    title: "Forecasting Truck Volumes on Rural Texas Corridors with Mixed-Effect Regression",
    authors: "Brennan, T. M.; Lee, K.; Hammond, R.",
    year: "2023",
    journal: "Journal of Transportation Engineering, Part A",
    volume: "Volume 149 · Issue 11",
    abstract: "Using nine years of WIM-station truck count data from 47 rural Texas corridors, we develop a hierarchical mixed-effect model that improves 5-year truck-volume forecasts by 18.4% RMSE over the current TxDOT planning baseline. Implementation guidance is provided for direct integration into the Texas Statewide Analysis Model.",
    type: "Peer-reviewed article",
    pdfSize: "PDF · 2.8 MB",
  },
  {
    title: "Resilience of Inland Waterway Freight to Compound Climate Events",
    authors: "Geedipally, S. R.; Park, S.; Quintero, A.; Bonneson, J. A.",
    year: "2025",
    journal: "TTI Technical Report",
    volume: "TTI-0-7203-R1 · 84 pp.",
    abstract: "A two-year study commissioned by TxDOT and the U.S. Maritime Administration on the cascading impacts of low-water and high-water events on Texas inland waterway freight. The report presents a probabilistic disruption model, four corridor-specific case studies, and a resilience-investment prioritization framework.",
    type: "Technical report",
    pdfSize: "PDF · 7.6 MB",
  },
];

function PubItem({ pub, dark, index, openIndex, setOpenIndex }) {
  const isOpen = openIndex === index;
  const handleToggle = () => setOpenIndex(isOpen ? -1 : index);

  return (
    <DCDisclosure
      open={isOpen}
      onToggle={handleToggle}
      dark={dark}
      header={
        <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingRight: 12 }}>
          <div style={{
            fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
            color: dark ? "rgba(255,255,255,0.7)" : "var(--text-muted)",
            fontFamily: "var(--font-body-bold)",
          }}>{pub.type} · {pub.year}</div>
          <div style={{
            fontFamily: "var(--font-display)", fontSize: "1.05rem", fontWeight: 500,
            textTransform: "uppercase", letterSpacing: "0.01em",
            color: dark ? "white" : "var(--text-primary)", lineHeight: 1.25,
          }}>{pub.title}</div>
          <div style={{
            fontSize: "0.85rem", color: dark ? "rgba(255,255,255,0.78)" : "var(--text-secondary)",
            fontStyle: "italic",
          }}>{pub.authors}</div>
        </div>
      }
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 32, alignItems: "start", marginTop: 8 }}>
        <div>
          <div style={{
            fontSize: "0.78rem", fontFamily: "var(--font-mono)",
            color: dark ? "rgba(255,255,255,0.7)" : "var(--text-muted)",
            marginBottom: 12,
          }}>
            {pub.journal} · {pub.volume}
          </div>
          <p style={{ margin: 0, fontSize: "0.92rem", lineHeight: 1.7 }}>{pub.abstract}</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 180 }}>
          <PubAction icon="file-down" label="Download" sub={pub.pdfSize} dark={dark} primary />
          <PubAction icon="quote" label="Cite (BibTeX)" dark={dark} />
          <PubAction icon="external-link" label="DOI / publisher" dark={dark} />
        </div>
      </div>
    </DCDisclosure>
  );
}

function PubAction({ icon, label, sub, primary, dark }) {
  const baseColor = primary ? (dark ? "white" : "var(--brand-primary)") : (dark ? "rgba(255,255,255,0.85)" : "var(--text-primary)");
  const borderColor = primary
    ? (dark ? "rgba(255,255,255,0.5)" : "var(--brand-primary)")
    : (dark ? "rgba(255,255,255,0.25)" : "var(--surface-border)");

  return (
    <a href="#" onClick={(e) => e.preventDefault()} style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "9px 14px",
      border: `1px solid ${borderColor}`,
      borderRadius: 3,
      color: baseColor, textDecoration: "none",
      fontFamily: "var(--font-body-bold)", fontSize: "0.7rem", fontWeight: 700,
      letterSpacing: "0.1em", textTransform: "uppercase",
      background: primary ? (dark ? "rgba(255,255,255,0.08)" : "color-mix(in srgb, var(--brand-primary) 6%, transparent)") : "transparent",
    }}>
      <DCIcon name={icon} size={14} />
      <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <span>{label}</span>
        {sub && <span style={{ fontSize: "0.62rem", fontFamily: "var(--font-mono)", fontWeight: 500, letterSpacing: 0, textTransform: "none", opacity: 0.75 }}>{sub}</span>}
      </div>
    </a>
  );
}

function PublicationAccordionPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "publication-accordion");
  const [openA, setOpenA] = React.useState(0);
  const [openB, setOpenB] = React.useState(-1);
  const [openC, setOpenC] = React.useState(0);

  return (
    <PageShell item={item}>
      <DCIntro>
        Publication accordions are tuned for citation lists — the row gives you publication-type chip, title, and authors at a glance; the panel reveals the full abstract plus citation/download actions in a right-aligned action stack. Always single-open: we want users to focus on one paper at a time.
      </DCIntro>

      <DCSectionLabel>publications list · default</DCSectionLabel>
      <DCBox label="publication-accordion · default">
        <DCSectionHead style="default" eyebrow="Recent work" title="Selected publications" lede="Peer-reviewed articles and technical reports authored by TTI researchers and their collaborators." />
        <div style={{ borderBottom: "1px solid var(--surface-border)" }}>
          {PUB_DATA.map((p, i) => <PubItem key={i} pub={p} dark={false} index={i} openIndex={openA} setOpenIndex={setOpenA} />)}
        </div>
      </DCBox>

      <DCSectionLabel>publications list · all-collapsed start · bold</DCSectionLabel>
      <DCBox label="publication-accordion · bold">
        <DCSectionHead style="bold" eyebrow="Recent work" title="Featured research" lede="Open any entry to read its abstract and grab the citation. We default everything closed for a cleaner overview." />
        <div style={{ borderBottom: "1px solid var(--surface-border)" }}>
          {PUB_DATA.map((p, i) => <PubItem key={i} pub={p} dark={false} index={i} openIndex={openB} setOpenIndex={setOpenB} />)}
        </div>
      </DCBox>

      <DCSectionLabel>publications list · on dark · default</DCSectionLabel>
      <DCBox dark label="publication-accordion · on dark · default">
        <DCSectionHead style="default" dark eyebrow="Recent work" title="Selected publications" />
        <div style={{ borderBottom: "1px solid rgba(255,255,255,0.16)" }}>
          {PUB_DATA.map((p, i) => <PubItem key={i} pub={p} dark={true} index={i} openIndex={openC} setOpenIndex={setOpenC} />)}
        </div>
      </DCBox>

      <DCSpecRow>
        <DCSpec label="row layout"   value="chip · title · authors" note="Type+year eyebrow, Oswald title, italic authors line." />
        <DCSpec label="panel"        value="abstract + actions" note="Two-column inside: prose left, right-aligned action stack." />
        <DCSpec label="actions"      value="download · cite · doi" note="Primary 'Download' is filled-tint; secondary actions are bordered only." />
        <DCSpec label="behavior"     value="single-open"        note="One paper at a time keeps focus." />
      </DCSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Q&A Collections
// Editorial pattern — question prompt above long-form answer.
// Default: open by default, scrollable. It's an article, not a hide/show.
// ════════════════════════════════════════════════════════════════════════

const QA_DATA = [
  {
    q: "What's the difference between operational research and capacity research?",
    a: [
      "We use \"operational\" to describe research that improves how an existing piece of infrastructure performs day-to-day — signal timing, work-zone management, freight routing, work-zone safety. The asset is fixed; we're tuning the dials.",
      "\"Capacity\" research, by contrast, is about how much more of a thing the asset can absorb — additional vehicles, freight tonnage, modal mix — and what design or policy investments would expand that ceiling. The two pair naturally: a capacity study often points at operational levers as the cheapest near-term win.",
    ],
  },
  {
    q: "How does TTI decide which corridors to study?",
    a: [
      "Most TxDOT-sponsored work comes with the corridor pre-selected — the agency has a pavement, safety, or freight-movement question on a specific stretch of road, and we scope the study around it. About a third of our portfolio runs that way.",
      "The remainder is investigator-initiated: faculty propose a corridor or class of corridors that lets them ask a research question with broader generalizability. Selection criteria mix data availability, geographic diversity, and an explicit \"can the answer travel?\" filter — work that only describes one corridor isn't research, it's consulting.",
    ],
  },
  {
    q: "When does TTI work get implemented in the field?",
    a: [
      "The fastest path to implementation runs through the Texas DOT — about 60% of TTI projects have a TxDOT champion at kickoff, and roughly half of those produce design-manual or operational-procedure changes within 18 months of project closeout.",
      "Federal implementation is slower but broader: NCHRP-syntheses and FHWA-sponsored research feed into national design standards (AASHTO, MUTCD) on a 3–7 year cycle. Some of TTI's most-cited work — vulnerable-road-user safety, work-zone speed limits, crash-cushion design — has shaped national practice over decades, not quarters.",
    ],
  },
];

function QABlock({ item, style, dark, index }) {
  const qFamily = style === "elegant" ? "var(--font-elegant, Georgia, serif)" : "var(--font-display)";
  const qStyle = style === "elegant" ? "italic" : "normal";
  const qWeight = style === "elegant" ? 400 : (style === "bold" ? 700 : 500);
  const qTransform = style === "default" ? "uppercase" : "none";
  const qFamilyResolved = style === "bold" ? "var(--font-body-bold)" : qFamily;

  return (
    <article style={{
      paddingTop: index === 0 ? 0 : 36,
      paddingBottom: 36,
      borderBottom: dark ? "1px solid rgba(255,255,255,0.14)" : "1px solid var(--surface-border)",
    }}>
      <div style={{
        fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
        color: dark ? "rgba(255,255,255,0.65)" : "var(--text-muted)",
        fontFamily: "var(--font-body-bold)", marginBottom: 10,
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <span style={{
          width: 24, height: 24, borderRadius: 12,
          background: dark ? "rgba(255,255,255,0.15)" : "color-mix(in srgb, var(--brand-primary) 9%, transparent)",
          color: dark ? "white" : "var(--brand-primary)",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          fontSize: "0.65rem", fontFamily: "var(--font-mono)", fontWeight: 600, letterSpacing: 0,
        }}>Q</span>
        Question {String(index + 1).padStart(2, "0")}
      </div>
      <h3 style={{
        margin: "0 0 18px",
        fontFamily: qFamilyResolved, fontSize: "1.45rem",
        fontWeight: qWeight, fontStyle: qStyle,
        textTransform: qTransform,
        letterSpacing: qTransform === "uppercase" ? "0.01em" : (style === "elegant" ? "-0.005em" : 0),
        color: dark ? "white" : "var(--text-primary)", lineHeight: 1.2,
      }}>{item.q}</h3>

      <div style={{
        fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
        color: dark ? "rgba(255,255,255,0.65)" : "var(--text-muted)",
        fontFamily: "var(--font-body-bold)", marginBottom: 8,
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <span style={{
          width: 24, height: 24, borderRadius: 12,
          background: dark ? "rgba(255,255,255,0.06)" : "var(--surface-sunken)",
          color: dark ? "rgba(255,255,255,0.75)" : "var(--text-secondary)",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          fontSize: "0.65rem", fontFamily: "var(--font-mono)", fontWeight: 600, letterSpacing: 0,
        }}>A</span>
        Answer
      </div>
      {item.a.map((para, i) => (
        <p key={i} style={{
          margin: i === 0 ? "0 0 14px" : "0 0 14px",
          fontSize: "1rem", lineHeight: 1.75,
          color: dark ? "rgba(255,255,255,0.85)" : "var(--text-secondary)",
          maxWidth: 700,
        }}>{para}</p>
      ))}
    </article>
  );
}

function QACollectionsPage() {
  const item = (window.AGGIE_CATALOG || []).find(c => c.id === "qa-collections");
  return (
    <PageShell item={item}>
      <DCIntro>
        Q&A collections are an editorial pattern — long-form answers laid out like an interview transcript. <strong>Always open</strong>: this isn't FAQ disclosure, it's a piece of writing. Question gets a marker bubble + display-face heading; answer is body type with a quieter A-bubble eyebrow.
      </DCIntro>

      <DCSectionLabel>default · open by default</DCSectionLabel>
      <DCBox label="q-and-a · always-open · default">
        <DCSectionHead style="default" eyebrow="Field notes" title="Conversations with our researchers" lede="Three questions we get often — answered at the length the answers actually deserve." />
        {QA_DATA.map((d, i) => <QABlock key={i} item={d} style="default" dark={false} index={i} />)}
      </DCBox>

      <DCSectionLabel>bold</DCSectionLabel>
      <DCBox label="q-and-a · bold">
        <DCSectionHead style="bold" eyebrow="Field notes" title="Three things sponsors ask us" />
        {QA_DATA.map((d, i) => <QABlock key={i} item={d} style="bold" dark={false} index={i} />)}
      </DCBox>

      <DCSectionLabel>elegant</DCSectionLabel>
      <DCBox label="q-and-a · elegant">
        <DCSectionHead style="elegant" eyebrow="Conversations" title="Notes from a research practice" />
        {QA_DATA.slice(0, 2).map((d, i) => <QABlock key={i} item={d} style="elegant" dark={false} index={i} />)}
      </DCBox>

      <DCSectionLabel>on dark · default</DCSectionLabel>
      <DCBox dark label="q-and-a · on dark · default">
        <DCSectionHead style="default" dark eyebrow="Field notes" title="Conversations with our researchers" />
        {QA_DATA.slice(0, 2).map((d, i) => <QABlock key={i} item={d} style="default" dark={true} index={i} />)}
      </DCBox>

      <DCSpecRow>
        <DCSpec label="behavior"  value="always open"     note="No accordion mechanic. It's editorial, not disclosure." />
        <DCSpec label="markers"   value="Q · A bubbles"    note="24px circle markers; primary tint for Q, neutral for A." />
        <DCSpec label="question"  value="display face"    note="1.45rem display, style-aware casing/italic." />
        <DCSpec label="answer"    value="body @ 1rem"      note="Long-form prose, max-width 700px, line-height 1.75." />
      </DCSpecRow>
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Export
// ════════════════════════════════════════════════════════════════════════
Object.assign(window, {
  AccordionGroupsPage,
  PublicationAccordionPage,
  QACollectionsPage,
});
