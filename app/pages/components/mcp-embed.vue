<script setup>
useHead({ title: "TuxMcpEmbed · TUX" });

const loading = ref(true);
const events = ref([]);

function logEvent(name) {
  events.value = [
    { name, at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) },
    ...events.value,
  ].slice(0, 6);
}

function toggleLoading() {
  loading.value = !loading.value;
}

const basicVue = `<tux-mcp-embed
  app-name="Linear"
  app-icon="lucide:square-kanban"
  source="mcp://linear · v1.2.0"
  @collapse="onCollapse"
  @expand="onExpand"
  @exit="onExit"
>
  <iframe :src="appUrl" class="w-full h-72" />
</tux-mcp-embed>`;

const loadingVue = `<tux-mcp-embed
  app-name="Notion"
  app-icon="lucide:notebook"
  source="mcp://notion · workspace.tti"
  :loading="loading"
>
  <iframe :src="notionUrl" class="w-full h-64" />
</tux-mcp-embed>`;

const fixedVue = `<tux-mcp-embed
  app-name="Figma"
  app-icon="lucide:component"
  source="mcp://figma · TUX library"
  :collapsible="false"
  :expandable="false"
>
  <div class="figma-canvas">...</div>
</tux-mcp-embed>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component · ai surface" title="TuxMcpEmbed">
      Interactive third-party app frame for the MCP shape — when the
      assistant hands off to <em>Linear</em> / <em>Notion</em> /
      <em>Figma</em> and renders the app's UI inline in the
      conversation. Sister to <code>TuxArtifact</code>, not a
      replacement: that's for static AI-generated output (code, doc,
      image); this is for live third-party surfaces. Window-chrome
      action set (collapse · expand · exit) instead of the file-chrome
      set (copy · download · regenerate · share).
    </TuxPageHeader>

    <section>
      <p class="eyebrow">flagship · inline app card</p>
      <h2 class="heading--bold text-xl font-bold">Default inline display</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        The default shape — fits inline after an assistant turn, just
        like <code>TuxArtifact</code>. The accent strip on the left
        edge signals "this is third-party, not first-party output."
        Click the controls; they all emit events the host wires up.
      </p>
      <TuxExample class="mt-4" :vue="basicVue">
        <TuxMcpEmbed
          app-name="Linear"
          app-icon="lucide:square-kanban"
          source="mcp://linear · v1.2.0"
          @collapse="logEvent('collapse')"
          @expand="logEvent('expand')"
          @exit="logEvent('exit')"
        >
          <div class="mcp-demo__app">
            <p class="eyebrow">MOBILITY · sprint 8</p>
            <ul class="mcp-demo__issues">
              <li class="mcp-demo__issue">
                <span class="mcp-demo__issue-id">MOB-412</span>
                <span class="mcp-demo__issue-title">Segment-level outliers in corridor-strip rendering</span>
                <span class="mcp-demo__issue-status mcp-demo__issue-status--in-progress">in progress</span>
              </li>
              <li class="mcp-demo__issue">
                <span class="mcp-demo__issue-id">MOB-417</span>
                <span class="mcp-demo__issue-title">TuxMapMarker cluster glyph contrast in dark theme</span>
                <span class="mcp-demo__issue-status mcp-demo__issue-status--todo">todo</span>
              </li>
              <li class="mcp-demo__issue">
                <span class="mcp-demo__issue-id">MOB-419</span>
                <span class="mcp-demo__issue-title">36-month follow-up CSV ingestion timeout</span>
                <span class="mcp-demo__issue-status mcp-demo__issue-status--review">review</span>
              </li>
            </ul>
          </div>
        </TuxMcpEmbed>
      </TuxExample>
      <p v-if="events.length" class="mt-3 text-xs text-text-muted font-mono">
        events:
        <span v-for="(e, i) in events" :key="i">
          {{ i === 0 ? '' : ' · ' }}{{ e.at }} {{ e.name }}
        </span>
      </p>
    </section>

    <section>
      <p class="eyebrow">async lifecycle · skeleton</p>
      <h2 class="heading--bold text-xl font-bold">Loading state</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        MCP apps initialize over the network. Pass
        <code>loading</code> while the connection establishes; the
        component renders three shimmer bars + a content block in
        place of the slot. Honors <code>prefers-reduced-motion</code>
        with a static muted fill.
      </p>
      <TuxExample class="mt-4" :vue="loadingVue">
        <div class="space-y-3">
          <TuxMcpEmbed
            app-name="Notion"
            app-icon="lucide:notebook"
            source="mcp://notion · workspace.tti"
            :loading="loading"
          >
            <div class="mcp-demo__app">
              <p class="text-sm">Connected. Doc loaded.</p>
            </div>
          </TuxMcpEmbed>
          <button type="button" class="popover-demo__trigger" @click="toggleLoading">
            {{ loading ? "Finish loading" : "Reset to loading" }}
          </button>
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">fixed chrome</p>
      <h2 class="heading--bold text-xl font-bold">Hide window controls</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Some surfaces don't want collapse / expand / exit — pinned
        canvas tools, hero embeds, in-page demos. Disable individually
        via <code>:collapsible="false"</code> /
        <code>:expandable="false"</code> /
        <code>:closable="false"</code>.
      </p>
      <TuxExample class="mt-4" :vue="fixedVue">
        <TuxMcpEmbed
          app-name="Figma"
          app-icon="lucide:component"
          source="mcp://figma · TUX library"
          :collapsible="false"
          :expandable="false"
        >
          <div class="mcp-demo__app mcp-demo__app--figma">
            <p class="text-sm text-text-secondary">
              TUX component library mirror — 132 components synced.
            </p>
          </div>
        </TuxMcpEmbed>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">when to reach for which</p>
      <h2 class="heading--bold text-xl font-bold">MCP display taxonomy</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        From the MCP Apps for Claude reference. Pick the tier that
        matches the assistant's intent — inline-card for a single
        result the user reads and reacts to; inline-carousel for a
        small browse-then-pick set; full-screen for the
        focus-and-work mode this component's <code>expand</code>
        event triggers.
      </p>
      <ul class="mt-3 text-sm text-text-secondary leading-relaxed list-disc pl-5 space-y-1 max-w-2xl">
        <li>
          <strong>Inline card</strong> — one MCP result rendered
          right after the assistant turn. Use
          <code>TuxMcpEmbed</code> alone.
        </li>
        <li>
          <strong>Inline carousel</strong> — 3+ comparable results
          (places, sources, items). Use <code>TuxCardCarousel</code>
          with one <code>TuxMcpEmbed</code> per slide, sized to
          ~320–360px wide.
        </li>
        <li>
          <strong>Full screen</strong> — user wants to focus and
          work. Host listens for <code>@expand</code> and switches
          to a focus-view layout (e.g. <code>TuxFocusView</code> or
          a slideover) holding the same embed.
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.mcp-demo__app {
  padding: 1rem;
  background: var(--surface-page);
}
.mcp-demo__app--figma {
  background: linear-gradient(135deg, var(--surface-page), color-mix(in srgb, var(--brand-accent) 6%, var(--surface-page)));
  min-height: 6rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mcp-demo__issues {
  list-style: none;
  margin: 0.5rem 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.mcp-demo__issue {
  display: grid;
  grid-template-columns: 5rem 1fr auto;
  gap: 0.625rem;
  align-items: center;
  font-size: 0.8125rem;
  padding: 0.5rem 0.75rem;
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
}
.mcp-demo__issue-id {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  color: var(--text-muted);
}
.mcp-demo__issue-title {
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.mcp-demo__issue-status {
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.125rem 0.375rem;
  border-radius: 9999px;
  border: 1px solid var(--surface-border);
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-weight: 600;
}
.mcp-demo__issue-status--in-progress {
  color: var(--brand-primary);
  border-color: color-mix(in srgb, var(--brand-primary) 40%, transparent);
}
.mcp-demo__issue-status--review {
  color: var(--brand-accent);
  border-color: color-mix(in srgb, var(--brand-accent) 40%, transparent);
}
.mcp-demo__issue-status--todo { color: var(--text-muted); }

.popover-demo__trigger {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  font-family: var(--font-sans);
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: 0.375rem;
  cursor: pointer;
  color: var(--text-primary);
}
.popover-demo__trigger:hover {
  border-color: var(--brand-primary);
  color: var(--brand-primary);
}
</style>
