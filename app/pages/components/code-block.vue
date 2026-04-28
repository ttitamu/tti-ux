<script setup lang="ts">
useHead({ title: "TuxCodeBlock · TUX" });

const tsCode = `// Drift reconciler — closes stale local→central mismatches every hour.
import { schedule } from "./scheduler";
import { fetchCentralIndex, fetchAgentIndex } from "./indices";
import { closeDriftEntry } from "./drift";

schedule.hourly(async () => {
  const [central, agent] = await Promise.all([
    fetchCentralIndex(),
    fetchAgentIndex(),
  ]);

  for (const path of central.keys()) {
    if (!agent.has(path)) {
      await closeDriftEntry(path, "missing-on-agent");
    }
  }
});`;

const pyCode = `# pecan agent watch — long-running file event shipper
import asyncio
from pecan.agent import Watcher
from pecan.transport import EventChannel

async def main(roots: list[str]) -> None:
    async with EventChannel() as channel:
        watcher = Watcher(roots=roots, channel=channel)
        await watcher.run()  # blocks until SIGTERM

if __name__ == "__main__":
    asyncio.run(main(["/research", "/scratch"]))`;

const jsonCode = `{
  "$schema": "https://design-tokens.github.io/community-group/format/",
  "_meta": {
    "name": "tux",
    "version": "0.1.0"
  },
  "themes": {
    "tti": {
      "brand": {
        "primary": { "value": "#5C0025" },
        "accent":  { "value": "#DDAC37" }
      }
    }
  }
}`;

const bashCode = `# Spin up a local PECAN agent + ship events
$ pecan agent token --scope=corpus:grants-2024 --ttl=24h
> tier3_a1b2c3d4e5...

$ PECAN_TOKEN=tier3_... pecan agent watch /research/grants --root=local
[12:14:08] watcher: 4 paths registered, 12,480 inodes tracked
[12:14:09] heartbeat: ok (latency 38ms)`;

const exampleVue = `<TuxCodeBlock
  lang="ts"
  filename="src/drift-reconciler.ts"
  :code="tsCode"
  line-numbers
/>`;
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="component" title="TuxCodeBlock">
      Standalone Shiki-backed code block. For docs, blog posts, ADRs,
      anywhere a code sample lives outside the
      <code>TuxExample</code> component-demo flow. Supports any
      Shiki-bundled language; loads the requested grammar lazily on
      mount. Theme tracks page color-mode (light / dark / high-contrast).
    </TuxPageHeader>

    <section>
      <p class="eyebrow">canonical · TypeScript</p>
      <h2 class="heading--bold text-xl font-bold">With filename + line numbers</h2>
      <TuxExample class="mt-4" :vue="exampleVue">
        <TuxCodeBlock
          lang="ts"
          filename="src/drift-reconciler.ts"
          :code="tsCode"
          line-numbers
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">multi-language · python</p>
      <h2 class="heading--bold text-xl font-bold">PECAN agent CLI source</h2>
      <p class="text-sm text-text-secondary mb-3">
        Full Shiki language support — Python, Go, Rust, Vue, Svelte, SQL,
        TOML, YAML, anything in the bundled set.
      </p>
      <TuxExample class="mt-4">
        <TuxCodeBlock
          lang="python"
          filename="pecan/agent/__main__.py"
          :code="pyCode"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">json · token excerpt</p>
      <h2 class="heading--bold text-xl font-bold">Configuration / data formats</h2>
      <TuxExample class="mt-4">
        <TuxCodeBlock
          lang="json"
          filename="design/tokens.json"
          :code="jsonCode"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">bash · shell session</p>
      <h2 class="heading--bold text-xl font-bold">Terminal output</h2>
      <p class="text-sm text-text-secondary mb-3">
        For shell sessions and CLI traces. Render the prompt + command +
        output in the same block; Shiki's bash grammar handles it.
      </p>
      <TuxExample class="mt-4">
        <TuxCodeBlock lang="bash" :code="bashCode" />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">props</p>
      <h2 class="heading--bold text-xl font-bold">Props reference</h2>
      <ul class="mt-4 space-y-2 text-sm">
        <li><code>code</code> — the source as a string. Required.</li>
        <li><code>lang</code> — Shiki language id (<code>"ts"</code>, <code>"python"</code>, <code>"vue"</code>, etc). Defaults to <code>"text"</code> (no highlighting).</li>
        <li><code>filename</code> — caption shown in the header bar (e.g. <code>"app/components/TuxButton.vue"</code>).</li>
        <li><code>lineNumbers</code> — show 1-indexed gutter numbers.</li>
        <li><code>noCopy</code> — hide the copy button.</li>
        <li>Copy button appears on hover; "Copied" feedback on click.</li>
      </ul>
    </section>
  </div>
</template>
