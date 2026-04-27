<script setup lang="ts">
useHead({ title: "TuxDiagram · tti-ux" });

// Mermaid requires labels containing HTML or special chars to be
// double-quoted — the `<br/>` would otherwise break the parser at
// the `<` character. Same applies to parens, braces, and `:` etc.
const flowchart = `flowchart TD
  A[File event on disk] --> B{"Watcher coalesce<br/>(250ms window)"}
  B --> C[Batch event payload]
  C --> D{Heartbeat OK?}
  D -->|yes| E[Ship to central index]
  D -->|no| F[Buffer locally]
  F --> G{Reconnect}
  G --> E
  E --> H["Drift reconciler<br/>hourly sweep"]`;

const sequence = `sequenceDiagram
  participant U as User
  participant S as tti-ai-studio
  participant R as Retrieval
  participant L as Opus 4.7
  participant P as PECAN index

  U->>S: Ask question (scoped to corpus)
  S->>R: Retrieve top-k passages
  R->>P: Vector + keyword query
  P-->>R: Ranked passages + ITAR markers
  R-->>S: Context window assembled
  S->>L: Prompt + context + system rules
  L-->>S: Streamed answer + cited spans
  S-->>U: Answer with [1][2][3] citations`;

const erd = `erDiagram
  CORPUS ||--o{ DOCUMENT : contains
  DOCUMENT ||--o{ CHUNK : split-into
  CHUNK ||--o{ EMBEDDING : has
  CORPUS {
    string id PK
    string name
    string tier
    string sponsor_grant
  }
  DOCUMENT {
    string id PK
    string corpus_id FK
    string path
    int    size_bytes
    bool   itar
  }`;

const exampleVue = `<TuxDiagram
  eyebrow="Figure 1"
  caption="Agent watcher event flow."
  :code="flowchart"
/>`;
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="component" title="TuxDiagram">
      Mermaid wrapper for diagrams-as-code. Architecture diagrams,
      flowcharts, sequence diagrams, ERDs, gantt charts. Mermaid is a
      ~3MB dependency, so this component <strong>lazy-imports</strong>
      it on mount — pages that don't render a diagram pay nothing.
      Theme tracks page color-mode; brand maroon + neutrals are mapped
      into Mermaid's theme variables so diagrams read as part of the
      system.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">canonical · flowchart</p>
      <h2 class="heading--bold text-xl font-bold">Agent watcher event flow</h2>
      <TuxExample class="mt-4" :vue="exampleVue">
        <TuxDiagram
          eyebrow="Figure 1"
          caption="How an agent's local file events get to the central index. Heartbeat-aware buffering keeps disconnected agents from losing data."
          :code="flowchart"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">sequence diagram</p>
      <h2 class="heading--bold text-xl font-bold">tti-ai-studio session flow</h2>
      <p class="text-sm text-text-secondary mb-3">
        Sequence diagrams show actors and message order. Right for
        explaining RAG pipelines, auth flows, agent ↔ central
        protocols — anything where the order matters.
      </p>
      <TuxExample class="mt-4">
        <TuxDiagram
          eyebrow="Figure 2"
          caption="One question, end-to-end. The retrieval step also fetches ITAR markers so the studio can refuse out-of-scope exports."
          :code="sequence"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">entity-relationship</p>
      <h2 class="heading--bold text-xl font-bold">Corpus / document / chunk schema</h2>
      <TuxExample class="mt-4">
        <TuxDiagram
          eyebrow="Figure 3"
          caption="PECAN's index schema, simplified. Real schema has audit trails, classifier outputs, and retention metadata."
          :code="erd"
        />
      </TuxExample>
    </section>

    <section class="space-y-3">
      <p class="eyebrow">composition</p>
      <h2 class="heading--bold text-xl font-bold">Markdown source for diagrams</h2>
      <p class="text-sm text-text-secondary max-w-3xl leading-relaxed">
        For docs surfaces that author content in markdown, the same
        diagram works as either a <code>::tux-diagram</code> block (with
        the Mermaid source as the body) or a fenced <code>```mermaid</code>
        block (which MDC also handles). The Vue version is for
        Vue-authored pages; the markdown shorthand is for authors who
        don't want to leave the prose.
      </p>
      <TuxCodeBlock
        lang="md"
        filename="docs/agent-watcher.md"
        :code="`# Agent watcher

How a file event gets from disk to the central index:

::tux-diagram{eyebrow=\&quot;Figure 1\&quot; caption=\&quot;Watcher event flow.\&quot;}
flowchart TD
  A[File event on disk] --&gt; B{Watcher coalesce}
  B --&gt; C[Batch event payload]
  C --&gt; D[Ship to central index]
::`"
      />
    </section>

    <section>
      <p class="eyebrow">props</p>
      <h2 class="heading--bold text-xl font-bold">Props reference</h2>
      <ul class="mt-4 space-y-2 text-sm">
        <li><code>code</code> — Mermaid source as a string. Required.</li>
        <li><code>eyebrow</code> — small label above (e.g. <code>"Figure 3"</code>).</li>
        <li><code>caption</code> — figcaption below the rendered diagram.</li>
        <li>Mermaid loads lazily on mount; the diagram re-renders when the color-mode flips.</li>
        <li>Render errors surface inline with the Mermaid parser message — useful when authoring.</li>
      </ul>
    </section>
  </div>
</template>
