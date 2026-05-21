/* global React, TuxSectionHeader, TuxPageHeader, TuxButton, TuxBadge, TuxCard, TuxAlert, LucideIcon */
const { useState } = React;

// ─── OverviewPage ───────────────────────────────────────────────────────────
function OverviewPage({ onNavigate }) {
  const stats = [
    { label: "Active scans", value: "3", sub: "1 running" },
    { label: "Files indexed", value: "412,847", sub: "+12,402 today" },
    { label: "Classifiers", value: "18", sub: "2 in review" },
    { label: "Sensitive hits", value: "247", sub: "needs triage" },
  ];
  return (
    <div>
      <TuxPageHeader eyebrow="overview" title="PECAN dashboard">
        Sensitive-data classifier for TTI research storage. Live across <code>/mnt/research</code>
        {" "}and three S3 buckets.
      </TuxPageHeader>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        {stats.map((s) => (
          <div key={s.label} style={{ border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)", padding: 16 }}>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "var(--tracking-wider)" }}>
              {s.label}
            </div>
            <div style={{ fontSize: "1.875rem", fontWeight: 700, fontFamily: "var(--font-sans)", margin: "4px 0 2px" }}>{s.value}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <TuxAlert
        variant="compliance"
        title="Export controlled"
        description="Bucket ttitrs-lidar-2026 contains ITAR-designated records. Do not share outside TAMUS."
      />

      <div style={{ height: 24 }} />
      <TuxSectionHeader level={2} subtitle="Scans completed, in progress, or queued in the last 24 hours.">
        Recent activity
      </TuxSectionHeader>

      <div style={{ border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
          <thead style={{ background: "color-mix(in srgb, var(--brand-primary) 6%, var(--surface-raised))" }}>
            <tr>
              {["Path", "Files", "Sensitivity", "Status", "Started"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "10px 14px", textTransform: "uppercase", letterSpacing: "var(--tracking-wider)", fontSize: "0.7rem", fontWeight: 600, color: "var(--text-secondary)", fontFamily: "var(--font-sans)" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { p: "/mnt/research/grants/q1", f: "12,402", tier: "sensitive", status: "completed", t: "09:14" },
              { p: "/mnt/research/grants/q2", f: "3,847", tier: "internal", status: "running", t: "11:02" },
              { p: "/mnt/research/datasets/lidar", f: "12", tier: "restricted", status: "failed", t: "07:40" },
              { p: "s3://ttitrs-surveys-2026", f: "8,213", tier: "public", status: "queued", t: "—" },
            ].map((r) => (
              <tr key={r.p} style={{ borderTop: "1px solid var(--surface-border)" }}>
                <td style={{ padding: "10px 14px", fontFamily: "var(--font-mono)" }}>{r.p}</td>
                <td style={{ padding: "10px 14px", fontFamily: "var(--font-mono)", textAlign: "right", width: 100 }}>{r.f}</td>
                <td style={{ padding: "10px 14px" }}><TuxBadge tier={r.tier} /></td>
                <td style={{ padding: "10px 14px" }}><TuxBadge status={r.status} /></td>
                <td style={{ padding: "10px 14px", fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>{r.t}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ height: 28 }} />
      <TuxSectionHeader level={2}>Tools</TuxSectionHeader>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        <TuxCard onClick={() => onNavigate("scans")}>
          <p className="eyebrow">scans</p>
          <h3 style={{ fontSize: "1.125rem", fontWeight: 700, margin: 0 }}>Start a new scan</h3>
          <p style={{ marginTop: 8, fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            Point the indexer at a directory or bucket.
          </p>
        </TuxCard>
        <TuxCard onClick={() => onNavigate("classifiers")}>
          <p className="eyebrow">classifiers</p>
          <h3 style={{ fontSize: "1.125rem", fontWeight: 700, margin: 0 }}>Review drift</h3>
          <p style={{ marginTop: 8, fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            Two classifiers flagged for re-training.
          </p>
        </TuxCard>
        <TuxCard onClick={() => onNavigate("indices")}>
          <p className="eyebrow">indices</p>
          <h3 style={{ fontSize: "1.125rem", fontWeight: 700, margin: 0 }}>Export results</h3>
          <p style={{ marginTop: 8, fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            Download CSV or hand off to OpenSearch.
          </p>
        </TuxCard>
      </div>
    </div>
  );
}

// ─── ScansPage ──────────────────────────────────────────────────────────────
function ScansPage({ onStartNew }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <TuxPageHeader eyebrow="scans" title="All scans">
          Every classifier run tracked here. Filter by tier, status, or classifier.
        </TuxPageHeader>
        <TuxButton intent="primary" icon="plus" onClick={onStartNew}>New scan</TuxButton>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {["All", "Running", "Completed", "Failed", "Queued"].map((f, i) => (
          <button key={f} style={{
            padding: "6px 12px",
            borderRadius: 9999,
            border: "1px solid var(--surface-border)",
            fontSize: "0.8rem",
            background: i === 0 ? "var(--text-primary)" : "var(--surface-raised)",
            color: i === 0 ? "#fff" : "var(--text-primary)",
            fontWeight: 500,
            cursor: "pointer",
          }}>{f}</button>
        ))}
      </div>

      <div style={{ border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
          <thead style={{ background: "color-mix(in srgb, var(--brand-primary) 6%, var(--surface-raised))" }}>
            <tr>
              {["Scan ID", "Root", "Classifiers", "Hits", "Status", ""].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "10px 14px", textTransform: "uppercase", letterSpacing: "var(--tracking-wider)", fontSize: "0.7rem", fontWeight: 600, color: "var(--text-secondary)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { id: "7f5bd95a", root: "/mnt/research/grants/q1", cls: ["pii:us_ssn", "pii:email"], hits: 142, status: "completed" },
              { id: "a12c4408", root: "/mnt/research/grants/q2", cls: ["pii:us_ssn", "pii:us_phone", "pii:email"], hits: 47, status: "running" },
              { id: "3ee7a115", root: "/mnt/research/datasets/lidar", cls: ["itar:category_xv"], hits: 0, status: "failed" },
              { id: "0090bc2d", root: "s3://ttitrs-surveys-2026", cls: ["pii:email"], hits: 0, status: "queued" },
            ].map((r) => (
              <tr key={r.id} style={{ borderTop: "1px solid var(--surface-border)" }}>
                <td style={{ padding: "10px 14px", fontFamily: "var(--font-mono)" }}>{r.id}</td>
                <td style={{ padding: "10px 14px", fontFamily: "var(--font-mono)" }}>{r.root}</td>
                <td style={{ padding: "10px 14px" }}>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {r.cls.map((c) => <TuxBadge key={c} kind="tag">{c}</TuxBadge>)}
                  </div>
                </td>
                <td style={{ padding: "10px 14px", fontFamily: "var(--font-mono)", textAlign: "right", width: 80 }}>{r.hits}</td>
                <td style={{ padding: "10px 14px" }}><TuxBadge status={r.status} /></td>
                <td style={{ padding: "10px 14px", textAlign: "right" }}>
                  <LucideIcon name="chevron-right" size={16} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── NewScanPage ────────────────────────────────────────────────────────────
function NewScanPage({ onCancel, onSubmit }) {
  const [form, setForm] = useState({ name: "Q1 research grants", root: "/mnt/research/grants/q1", retention: "90 days" });
  const [classifiers, setClassifiers] = useState({ us_ssn: true, us_phone: true, email: false, itar: false });
  const field = (label, children) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
      <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)" }}>{label}</label>
      {children}
    </div>
  );
  const inputStyle = {
    fontFamily: "var(--font-sans)",
    fontSize: "0.875rem",
    padding: "8px 10px",
    border: "1px solid var(--surface-border)",
    borderRadius: "var(--radius-md)",
    background: "var(--surface-raised)",
    color: "var(--text-primary)",
  };
  return (
    <div>
      <TuxPageHeader eyebrow="scans · new" title="Start a new scan">
        Define a scan's root, classifiers, and retention. Scans run in the background and notify on completion.
      </TuxPageHeader>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 32 }}>
        <div style={{ border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)", padding: 24 }}>
          <TuxSectionHeader level={3}>Configuration</TuxSectionHeader>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {field("Scan name", <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} />)}
            {field("Retention", (
              <select value={form.retention} onChange={(e) => setForm({ ...form, retention: e.target.value })} style={inputStyle}>
                <option>30 days</option><option>90 days</option><option>Indefinite</option>
              </select>
            ))}
          </div>
          {field("Root path", <input value={form.root} onChange={(e) => setForm({ ...form, root: e.target.value })} style={{ ...inputStyle, fontFamily: "var(--font-mono)" }} />)}

          <div style={{ height: 12 }} />
          <TuxSectionHeader level={3}>Classifiers</TuxSectionHeader>
          {[
            ["us_ssn", "pii:us_ssn", "US Social Security Numbers"],
            ["us_phone", "pii:us_phone", "US phone numbers"],
            ["email", "pii:email", "Email addresses"],
            ["itar", "itar:category_xv", "ITAR Category XV — spacecraft"],
          ].map(([k, tag, desc]) => (
            <label key={k} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderTop: "1px solid var(--surface-border)", fontSize: "0.875rem" }}>
              <input type="checkbox" checked={classifiers[k]} onChange={(e) => setClassifiers({ ...classifiers, [k]: e.target.checked })} style={{ accentColor: "var(--brand-primary)" }} />
              <TuxBadge kind="tag">{tag}</TuxBadge>
              <span style={{ color: "var(--text-secondary)" }}>{desc}</span>
            </label>
          ))}

          <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
            <TuxButton intent="primary" icon="play" onClick={onSubmit}>Start scan</TuxButton>
            <TuxButton intent="ghost" onClick={onCancel}>Cancel</TuxButton>
          </div>
        </div>

        <div>
          <TuxAlert
            variant="important"
            title="Retention notice"
            description="Scan metadata persists per TAMUS records retention schedule. File contents are never stored."
          />
          <div style={{ height: 16 }} />
          <TuxAlert
            variant="warning"
            title="Heads up"
            description="This path contains 12,000+ files. First scan may take ~8 minutes."
          />
        </div>
      </div>
    </div>
  );
}

// ─── ClassifiersPage ────────────────────────────────────────────────────────
function ClassifiersPage() {
  return (
    <div>
      <TuxPageHeader eyebrow="classifiers" title="Classifier catalog">
        Detectors registered in PECAN. Precision and recall measured against the Q4 2025 gold set.
      </TuxPageHeader>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {[
          { tag: "pii:us_ssn", name: "US Social Security Number", p: 0.994, r: 0.981, drift: false },
          { tag: "pii:us_phone", name: "US phone number", p: 0.967, r: 0.952, drift: false },
          { tag: "pii:email", name: "Email address", p: 0.998, r: 0.991, drift: false },
          { tag: "itar:category_xv", name: "ITAR Category XV (spacecraft)", p: 0.912, r: 0.884, drift: true },
        ].map((c) => (
          <div key={c.tag} style={{ border: c.drift ? "2px solid var(--brand-primary)" : "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)", padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <TuxBadge kind="tag">{c.tag}</TuxBadge>
              {c.drift ? <TuxBadge status="running"><span style={{ fontWeight: 600 }}>drift</span></TuxBadge> : null}
            </div>
            <h3 style={{ margin: "10px 0 4px", fontSize: "1rem", fontWeight: 700 }}>{c.name}</h3>
            <div style={{ display: "flex", gap: 20, marginTop: 12, fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>
              <div>
                <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "var(--tracking-wider)" }}>precision</div>
                <div style={{ fontWeight: 600 }}>{c.p.toFixed(3)}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "var(--tracking-wider)" }}>recall</div>
                <div style={{ fontWeight: 600 }}>{c.r.toFixed(3)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { OverviewPage, ScansPage, NewScanPage, ClassifiersPage });
