<script setup lang="ts">
useHead({ title: "TuxIdentity · tti-ux" });

const exampleVue = `<TuxIdentity
  level="institution"
  orientation="horizontal"
  kind="lockup"
  name="Texas A&M Transportation Institute"
  href="/"
/>`;
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="component" title="TuxIdentity">
      Institutional header lockup. Two kinds (lockup with logo / text-only),
      two orientations (horizontal / stacked), three hierarchy levels
      (institution / center / department). Pair with
      <code>&lt;TuxFooter&gt;</code> + the mandatory TAMUS subfooter on
      every shipped surface.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">canonical</p>
      <h2 class="heading--bold text-xl font-bold">Header chrome — institution lockup</h2>
      <p class="text-sm text-text-secondary mb-3">
        The most common use: top-left of every product. Horizontal layout,
        logo + wordmark, links home.
      </p>
      <TuxExample class="mt-4" :vue="exampleVue">
        <TuxIdentity
          level="institution"
          orientation="horizontal"
          kind="lockup"
          name="Texas A&M Transportation Institute"
          href="/"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">three levels</p>
      <h2 class="heading--bold text-xl font-bold">Institution / center / department</h2>
      <p class="text-sm text-text-secondary mb-3">
        Each successive level adds a superhead context line. Department
        also gets a thin maroon rule between the superhead chain and the
        department name — visual cue for "this is the leaf".
      </p>
      <TuxExample class="mt-4">
        <div class="space-y-6">
          <TuxIdentity
            level="institution"
            name="Texas A&M Transportation Institute"
          />
          <TuxIdentity
            level="center"
            superhead="Texas A&M Transportation Institute"
            name="Center for Transportation Safety"
          />
          <TuxIdentity
            level="department"
            superhead="Center for Transportation Safety"
            name="Networking & Information Services"
          />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">stacked</p>
      <h2 class="heading--bold text-xl font-bold">Hero / landing-cover orientation</h2>
      <p class="text-sm text-text-secondary mb-3">
        Pass <code>orientation="stacked"</code> for landing-page heroes
        and slide title plates — logo on top, text centered.
      </p>
      <TuxExample class="mt-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div class="border border-surface-border rounded-md p-8 flex justify-center">
            <TuxIdentity
              orientation="stacked"
              kind="lockup"
              level="institution"
              name="Texas A&M Transportation Institute"
            />
          </div>
          <div class="border border-surface-border rounded-md p-8 flex justify-center">
            <TuxIdentity
              orientation="stacked"
              kind="text"
              level="institution"
              name="Texas A&M Transportation Institute"
            />
          </div>
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">text-only</p>
      <h2 class="heading--bold text-xl font-bold">No logo</h2>
      <p class="text-sm text-text-secondary mb-3">
        Pass <code>kind="text"</code> when the surface already shows the
        logo elsewhere (footer-of-page, watermark) and the header should
        be wordmark-only.
      </p>
      <TuxExample class="mt-4">
        <TuxIdentity
          kind="text"
          level="department"
          superhead="Center for Transportation Safety"
          name="Connected & Automated Vehicles Program"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">props</p>
      <h2 class="heading--bold text-xl font-bold">Props reference</h2>
      <ul class="mt-4 space-y-2 text-sm">
        <li><code>name</code> — display name. Required.</li>
        <li><code>superhead</code> — eyebrow above. Required for <code>center</code> + <code>department</code>; ignored on <code>institution</code>.</li>
        <li><code>level</code> — <code>"institution" | "center" | "department"</code>. Defaults to <code>"institution"</code>.</li>
        <li><code>orientation</code> — <code>"horizontal" | "stacked"</code>. Defaults to <code>"horizontal"</code>.</li>
        <li><code>kind</code> — <code>"lockup" | "text"</code>. Defaults to <code>"lockup"</code>.</li>
        <li><code>href</code> — wraps the lockup as a link. Internal paths use NuxtLink; external use plain <code>&lt;a&gt;</code>.</li>
        <li><code>logoSize</code> — override default logo px. Defaults: 46 (horizontal), 56 (stacked).</li>
      </ul>
    </section>
  </div>
</template>
