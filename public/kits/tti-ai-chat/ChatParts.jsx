/* global React, TuxButton, TuxBadge, TuxSectionHeader, TuxAlert, LucideIcon */

const { useState: _us, useRef: _ur, useEffect: _ue } = React;

// ─── ChatSidebar ────────────────────────────────────────────────────────────
function ChatSidebar({ active, onPick, onNew }) {
  const convos = [
    { group: "TODAY", items: [
      { id: "c1", t: "ITAR classifier retraining scope", meta: "4 turns" },
      { id: "c2", t: "Summarize Q1 RELLIS field tests", meta: "12 turns" },
    ]},
    { group: "YESTERDAY", items: [
      { id: "c3", t: "Extract funding sources from grant PDFs", meta: "27 turns · 3 corpora" },
      { id: "c4", t: "Draft HIPAA DPIA template", meta: "6 turns" },
    ]},
    { group: "THIS WEEK", items: [
      { id: "c5", t: "Compare 2023 vs 2024 crash reports", meta: "18 turns · BI corpus" },
      { id: "c6", t: "Generate handoff notes for PECAN v1.2", meta: "9 turns" },
      { id: "c7", t: "Read TxDOT rule 43 TAC 31.12 ", meta: "5 turns" },
    ]},
  ];
  return (
    <aside style={{ width: 300, background: "var(--surface-sunken)", borderRight: "1px solid var(--surface-border)", display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "18px 18px 12px", borderBottom: "1px solid var(--surface-border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="../../assets/logo.svg" width="26" height="26" alt="" />
          <div>
            <div style={{ fontSize: "0.88rem", fontWeight: 700, lineHeight: 1.1 }}>tti-ai-chat</div>
            <div style={{ fontSize: "0.64rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "var(--tracking-wider)", marginTop: 2 }}>internal only · v0.4</div>
          </div>
        </div>
        <button
          onClick={onNew}
          style={{ marginTop: 14, width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "var(--brand-primary)", color: "#fff", border: "none", borderRadius: "var(--radius-md)", fontFamily: "inherit", fontSize: "0.825rem", fontWeight: 500, cursor: "pointer" }}
        >
          <LucideIcon name="plus" size={14} />
          New conversation
        </button>
      </div>
      <div style={{ flex: 1, overflow: "auto", padding: "8px 8px" }}>
        {convos.map((g) => (
          <div key={g.group} style={{ marginBottom: 12 }}>
            <div style={{ padding: "10px 12px 6px", fontFamily: "var(--font-mono)", fontSize: "0.66rem", textTransform: "uppercase", letterSpacing: "var(--tracking-wider)", color: "var(--text-muted)" }}>{g.group}</div>
            {g.items.map((it) => (
              <a
                key={it.id}
                href="#"
                onClick={(e) => { e.preventDefault(); onPick(it.id); }}
                style={{
                  display: "block", padding: "8px 12px", borderRadius: "var(--radius-sm)",
                  textDecoration: "none", color: "var(--text-primary)",
                  background: active === it.id ? "color-mix(in srgb, var(--brand-primary) 10%, transparent)" : "transparent",
                  borderLeft: active === it.id ? "3px solid var(--brand-primary)" : "3px solid transparent",
                }}
              >
                <div style={{ fontSize: "0.825rem", fontWeight: active === it.id ? 600 : 500, marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.t}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-muted)" }}>{it.meta}</div>
              </a>
            ))}
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid var(--surface-border)", padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--brand-primary)", color: "#fff", display: "grid", placeItems: "center", fontSize: "0.76rem", fontWeight: 600 }}>AG</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "0.8rem", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>A. Guevara</div>
          <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>CTR · scan tier 3</div>
        </div>
        <LucideIcon name="settings" size={16} />
      </div>
    </aside>
  );
}

// ─── ConversationHeader ─────────────────────────────────────────────────────
function ConversationHeader({ title }) {
  return (
    <div style={{ padding: "14px 32px", borderBottom: "1px solid var(--surface-border)", display: "flex", alignItems: "center", gap: 16, background: "var(--surface-raised)" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p className="eyebrow" style={{ margin: "0 0 2px" }}>conversation · 4 turns</p>
        <h2 style={{ fontSize: "1rem", fontWeight: 600, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</h2>
      </div>
      <TuxBadge tier="sensitive">ITAR</TuxBadge>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--text-secondary)", padding: "5px 10px", background: "var(--surface-sunken)", borderRadius: "var(--radius-md)" }}>
        <LucideIcon name="database" size={13} />
        grants-2024 · classifiers · 3 docs
      </div>
      <TuxButton intent="ghost" icon="download">Export</TuxButton>
    </div>
  );
}

// ─── Message — user / assistant ─────────────────────────────────────────────
function Message({ role, children, meta, citations }) {
  const isUser = role === "user";
  return (
    <div style={{ padding: "24px 32px", background: isUser ? "transparent" : "var(--surface-sunken)", borderBottom: "1px solid var(--surface-border)" }}>
      <div style={{ maxWidth: 820, margin: "0 auto", display: "grid", gridTemplateColumns: "40px 1fr", gap: 16 }}>
        <div>
          {isUser ? (
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--surface-border)", color: "var(--text-secondary)", display: "grid", placeItems: "center", fontSize: "0.76rem", fontWeight: 600 }}>AG</div>
          ) : (
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--brand-primary)", display: "grid", placeItems: "center" }}>
              <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 800, fontSize: "0.95rem", color: "var(--brand-accent)", lineHeight: 1 }}>tx</div>
            </div>
          )}
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 6 }}>
            <div style={{ fontWeight: 600, fontSize: "0.825rem" }}>
              {isUser ? "Anthony Guevara" : "tti-ai"}
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-muted)" }}>
              {isUser ? "10:42:14 CDT" : "10:42:17 CDT · anthropic/haiku-4.5 · 2.1s"}
            </div>
          </div>
          <div style={{ fontSize: "0.9375rem", lineHeight: 1.65, color: "var(--text-primary)" }}>{children}</div>
          {citations ? <Citations list={citations} /> : null}
          {meta ? (
            <div style={{ marginTop: 14, display: "flex", gap: 8, alignItems: "center" }}>
              {meta}
            </div>
          ) : null}
          {!isUser ? <AssistantToolbar /> : null}
        </div>
      </div>
    </div>
  );
}

function Citations({ list }) {
  return (
    <div style={{ marginTop: 16, padding: "12px 14px", background: "var(--surface-raised)", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)" }}>
      <div className="eyebrow" style={{ marginBottom: 10 }}>sources · {list.length}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {list.map((c, i) => (
          <a key={i} href="#" onClick={(e) => e.preventDefault()} style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 12, textDecoration: "none", color: "inherit", alignItems: "baseline" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--brand-primary)", fontWeight: 600 }}>[{i + 1}]</span>
            <span>
              <div style={{ fontSize: "0.825rem", fontWeight: 500 }}>{c.title}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 2 }}>{c.path}</div>
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-muted)" }}>{c.score}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

function AssistantToolbar() {
  const [fb, setFb] = _us(null);
  const tool = (icon, label, onClick, active) => (
    <button onClick={onClick} title={label} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "5px 8px", background: active ? "color-mix(in srgb, var(--brand-primary) 10%, transparent)" : "transparent", color: active ? "var(--brand-primary)" : "var(--text-muted)", border: "1px solid transparent", borderRadius: "var(--radius-sm)", cursor: "pointer", fontFamily: "inherit", fontSize: "0.72rem" }}>
      <LucideIcon name={icon} size={13} />
      {label}
    </button>
  );
  return (
    <div style={{ marginTop: 12, display: "flex", gap: 2, marginLeft: -6 }}>
      {tool("check", "Copy", () => {})}
      {tool("arrow-up-right", "Open", () => {})}
      {tool("check-circle", "Helpful", () => setFb("up"), fb === "up")}
      {tool("circle-x", "Not helpful", () => setFb("down"), fb === "down")}
    </div>
  );
}

// ─── Composer ───────────────────────────────────────────────────────────────
function Composer() {
  const [val, setVal] = _us("");
  const [model, setModel] = _us("haiku-4.5");
  return (
    <div style={{ padding: "16px 32px 24px", background: "var(--surface-raised)", borderTop: "1px solid var(--surface-border)" }}>
      <div style={{ maxWidth: 880, margin: "0 auto" }}>
        <TuxAlert variant="compliance" icon="shield-alert">
          <strong>ITAR scope.</strong> This conversation is restricted to personnel cleared for export-controlled content. Citations and model responses are logged to the audit trail.
        </TuxAlert>
        <div style={{ marginTop: 14, border: "2px solid var(--brand-primary)", borderRadius: "var(--radius-lg)", background: "var(--surface-raised)", overflow: "hidden" }}>
          <textarea
            value={val}
            onChange={(e) => setVal(e.target.value)}
            placeholder="Ask about grants-2024, RELLIS field tests, or any ingested corpus…"
            rows={3}
            style={{ width: "100%", border: "none", outline: "none", resize: "none", padding: "14px 16px", fontFamily: "inherit", fontSize: "0.9375rem", lineHeight: 1.5, color: "var(--text-primary)", background: "transparent", boxSizing: "border-box" }}
          />
          <div style={{ padding: "8px 12px", borderTop: "1px solid var(--surface-border)", display: "flex", alignItems: "center", gap: 8, background: "var(--surface-sunken)" }}>
            <button style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 10px", background: "transparent", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-sm)", fontSize: "0.76rem", fontFamily: "inherit", color: "var(--text-secondary)", cursor: "pointer" }}>
              <LucideIcon name="plus" size={12} /> Attach corpus
            </button>
            <select value={model} onChange={(e) => setModel(e.target.value)} style={{ padding: "5px 10px", fontFamily: "var(--font-mono)", fontSize: "0.76rem", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-sm)", background: "var(--surface-raised)", color: "var(--text-secondary)" }}>
              <option value="haiku-4.5">anthropic/haiku-4.5</option>
              <option value="sonnet-4">anthropic/sonnet-4</option>
              <option value="llama-3-70b-tti">llama-3-70b-tti (on-prem)</option>
            </select>
            <div style={{ flex: 1 }} />
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-muted)" }}>
              {val.length} / 32000
            </div>
            <TuxButton intent="primary" icon="arrow-right" onClick={() => setVal("")}>
              Send
            </TuxButton>
          </div>
        </div>
        <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 14, justifyContent: "center", fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
          <span>⌘↵ send</span>
          <span>·</span>
          <span>/ corpus to switch context</span>
          <span>·</span>
          <span>shift↵ newline</span>
        </div>
      </div>
    </div>
  );
}

// ─── ContextPanel — right-rail corpus/settings ──────────────────────────────
function ContextPanel() {
  return (
    <aside style={{ width: 320, borderLeft: "1px solid var(--surface-border)", background: "var(--surface-raised)", display: "flex", flexDirection: "column", height: "100%", overflow: "auto" }}>
      <div style={{ padding: "22px 22px 8px" }}>
        <TuxSectionHeader level={3} subtitle="Docs the model will ground answers against.">CORPUS</TuxSectionHeader>
      </div>
      <div style={{ padding: "0 22px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          { name: "grants-2024", tier: "restricted", count: "1,204 docs" },
          { name: "classifiers-docs", tier: "internal", count: "312 docs" },
          { name: "txdot-rule-43", tier: "public", count: "1 doc · §31.12" },
        ].map((c) => (
          <div key={c.name} style={{ padding: "10px 12px", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", gap: 10 }}>
            <LucideIcon name="folder-search" size={16} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", fontWeight: 500 }}>{c.name}</div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginTop: 2 }}>{c.count}</div>
            </div>
            <TuxBadge tier={c.tier} />
          </div>
        ))}
        <button style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px", background: "transparent", border: "1px dashed var(--surface-border)", borderRadius: "var(--radius-md)", color: "var(--text-secondary)", fontFamily: "inherit", fontSize: "0.8rem", cursor: "pointer" }}>
          <LucideIcon name="plus" size={13} /> Attach another corpus
        </button>
      </div>

      <div style={{ padding: "12px 22px 8px" }}>
        <TuxSectionHeader level={3} subtitle="What the retriever will surface.">RETRIEVAL</TuxSectionHeader>
      </div>
      <div style={{ padding: "0 22px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
        <Stat label="top-k" value="8" />
        <Stat label="min-score" value="0.72" />
        <Stat label="rerank" value="cohere-v3" />
        <Stat label="context window" value="32,000 tok" />
      </div>

      <div style={{ padding: "12px 22px 8px" }}>
        <TuxSectionHeader level={3} subtitle="This session · logged to audit trail.">USAGE</TuxSectionHeader>
      </div>
      <div style={{ padding: "0 22px 28px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <BigFigure value="4,218" unit="tok in" />
          <BigFigure value="1,094" unit="tok out" />
          <BigFigure value="$0.03" unit="billed" tone="accent" />
          <BigFigure value="2.1s" unit="latency" />
        </div>
      </div>
    </aside>
  );
}

function Stat({ label, value }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", fontSize: "0.8rem", padding: "4px 0" }}>
      <span style={{ color: "var(--text-secondary)" }}>{label}</span>
      <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}>{value}</span>
    </div>
  );
}

function BigFigure({ value, unit, tone }) {
  const color = tone === "accent" ? "var(--brand-accent)" : "var(--brand-primary)";
  return (
    <div style={{ borderTop: "2px solid var(--brand-primary)", paddingTop: 10 }}>
      <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 800, fontSize: "1.75rem", color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "var(--tracking-wider)", color: "var(--text-muted)", marginTop: 4 }}>{unit}</div>
    </div>
  );
}

Object.assign(window, {
  ChatSidebar,
  ConversationHeader,
  Message,
  Composer,
  ContextPanel,
});
