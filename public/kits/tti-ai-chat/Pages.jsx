/* global React, TuxButton, TuxBadge, TuxCard, TuxAlert, TuxSectionHeader, TuxPageHeader, LucideIcon, ChatIcon, ChatSidebar, ChatTopBar, MessageBubble, Composer, ModelChip */

const { useState: _useState } = React;

// Seed conversation history shown in the chat view
const SEED_MESSAGES = [
  {
    role: "user",
    timestamp: "11:07am",
    content: "What's the current retention policy for the SHRP2 raw video archive, and who do I contact to extend it past the 10-year window?",
  },
  {
    role: "assistant",
    timestamp: "11:07am",
    model: "gpt-4o-mini",
    content: (
      <>
        <p style={{ margin: "0 0 12px" }}>
          The SHRP2 naturalistic driving data archive sits under the <code>pubprot/shrp2-video</code> share and follows the <strong>10-year minimum retention</strong> rule set by the TRB Data Enclave agreement, measured from the close-out of the last derivative project.
        </p>
        <p style={{ margin: "0 0 12px" }}>
          Three things to know:
        </p>
        <ul style={{ margin: "0 0 12px", paddingLeft: 22, lineHeight: 1.7 }}>
          <li>Extension requests go to the <strong>TTI Research Data Steward</strong>, not central IT. Current steward is listed in the directory entry for <code>data-steward@tti.tamu.edu</code>.</li>
          <li>Extensions are granted in 2-year increments with a written justification (active project, derivative analysis pending publication, legal hold).</li>
          <li>Blob storage cost after year 10 moves from central-IT-absorbed to PI-billed.</li>
        </ul>
        <p style={{ margin: 0 }}>
          See the tokens page for internal reference, or the full policy at <a className="link-tti" href="#" style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>policies.tti.tamu.edu/data/retention</a>.
        </p>
      </>
    ),
    sources: [
      { path: "policies/data-retention.md#shrp2", note: "TRB Data Enclave agreement, §4.2" },
      { path: "directory/data-steward.yaml", note: "current steward contact" },
      { path: "runbooks/extend-retention.md", note: "submission template + SLA" },
    ],
  },
  {
    role: "user",
    timestamp: "11:09am",
    content: "Can you draft the extension request email for me? It's for the lane-change dataset — project id LC-2019-114.",
  },
  {
    role: "assistant",
    timestamp: "11:09am",
    model: "gpt-4o-mini",
    content: (
      <>
        <p style={{ margin: "0 0 10px" }}>Here's a draft — fill in the bracketed slots before sending.</p>
        <pre style={{ background: "var(--surface-sunken)", padding: "14px 16px", borderRadius: "var(--radius-md)", borderLeft: "3px solid var(--brand-accent)", fontSize: "0.8125rem", fontFamily: "var(--font-mono)", lineHeight: 1.65, whiteSpace: "pre-wrap", margin: 0 }}>{`To: data-steward@tti.tamu.edu
Subject: Retention extension — LC-2019-114 (lane-change dataset)

Hi [steward name],

Requesting a 2-year retention extension for project LC-2019-114
(lane-change naturalistic driving dataset, SHRP2 derivative).

Justification:
  - Manuscript in revision at [journal]; reviewers have asked for
    a supplementary analysis pending access to the raw video.
  - Estimated completion: [month, year].
  - Est. storage footprint: 4.2 TB, unchanged from prior period.

PI: Anthony Guevara (anthony.guevara@tti.tamu.edu)
Cost center: [ledger code]

Happy to complete the formal extension form if preferred.

Thanks,
Anthony`}
        </pre>
      </>
    ),
  },
];

const SEED_CONVERSATIONS = [
  { id: "c1", title: "SHRP2 retention extension",       subtitle: "Draft email for LC-2019-114…",              timestamp: "11:09",  group: "today",    pinned: true },
  { id: "c2", title: "TuxCard hover math",              subtitle: "Why is it -6/+6 instead of -4/+4?",          timestamp: "10:22", group: "today" },
  { id: "c3", title: "Q1 factsheet copy review",        subtitle: "Shortened the lede to two sentences.",       timestamp: "09:40", group: "today" },
  { id: "c4", title: "OpenSearch patch window",         subtitle: "What's the rollback plan if indices…",       timestamp: "Wed",   group: "earlier" },
  { id: "c5", title: "ITAR classifier PII overlap",     subtitle: "The overlap between 'sensitive' and…",       timestamp: "Tue",   group: "earlier" },
  { id: "c6", title: "Dark-mode token drift",           subtitle: "Three tokens diverge between light…",        timestamp: "Mon",   group: "earlier" },
];

// ─── Empty / welcome state ─────────────────────────────────────────────────
function WelcomeState({ onSubmit }) {
  const prompts = [
    "Summarize the last run of the ITAR classifier on /mnt/research/public.",
    "Draft a data-retention extension email for project LC-2019-114.",
    "What's the approval path for a new S3 bucket under the research prefix?",
    "Diff the tti and tti-hc themes — which tokens change?",
  ];
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px" }}>
      <TuxPageHeader eyebrow="tti-ai-chat" title="Start a conversation">
        Grounded in TTI research-IT runbooks, data-steward policies, and the tti-ux docs. Responses cite the pages they're pulled from. Never paste ITAR or HIPAA content into this tool — it logs.
      </TuxPageHeader>

      <TuxAlert variant="important" title="Scope reminder">
        This instance is approved for <strong>internal unclassified</strong> work only. For sensitive-data questions, use the air-gapped review portal instead.
      </TuxAlert>

      <div style={{ marginTop: 36 }}>
        <TuxSectionHeader level={3}>suggested prompts</TuxSectionHeader>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
          {prompts.map((p) => (
            <button
              key={p}
              onClick={() => onSubmit(p)}
              style={{
                textAlign: "left",
                padding: "14px 16px",
                border: "1px solid var(--surface-border)",
                borderRadius: "var(--radius-md)",
                background: "var(--surface-raised)",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: "0.8125rem",
                lineHeight: 1.5,
                color: "var(--text-primary)",
                transition: "border-color 150ms, background 150ms",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--brand-primary)"; e.currentTarget.style.background = "color-mix(in srgb, var(--brand-primary) 3%, var(--surface-raised))"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--surface-border)"; e.currentTarget.style.background = "var(--surface-raised)"; }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Active conversation view ─────────────────────────────────────────────
function ConversationView({ messages, onSend, model }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
      <div style={{ flex: 1, overflow: "auto", padding: "0 32px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          {messages.map((m, i) => (
            <MessageBubble
              key={i}
              role={m.role}
              model={m.model}
              timestamp={m.timestamp}
              sources={m.sources}
            >
              {typeof m.content === "string" ? <p style={{ margin: 0 }}>{m.content}</p> : m.content}
            </MessageBubble>
          ))}
        </div>
      </div>
      <div style={{ padding: "14px 32px 22px", borderTop: "1px solid var(--surface-border)", background: "var(--surface-raised)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <Composer onSend={onSend} model={model} />
          <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", textAlign: "center", margin: "10px 0 0", letterSpacing: "0.01em" }}>
            Responses are generated — verify against the cited sources before acting. Conversations are logged for 90 days under <code>research-audit/llm-chat</code>.
          </p>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  SEED_MESSAGES,
  SEED_CONVERSATIONS,
  WelcomeState,
  ConversationView,
});
