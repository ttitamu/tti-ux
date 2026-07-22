<script setup lang="ts">
useHead({ title: "TuxErrorPage · TUX" });

const fourOhFourVue = `<tux-error-page code="404" />`;

const fiveHundredVue = `<tux-error-page code="500">
  <template #support>
    Need help? File a ticket at
    <a href="https://helpdesk.tti.tamu.edu" class="link-tti">helpdesk.tti.tamu.edu</a>
    or call (979) 317-2345 \u00b7 incident #INC-029141.
  </template>
</tux-error-page>`;

const customVue = `<tux-error-page
  code="403"
  title="Restricted to TAMUS sponsors"
  lede="This corridor study is gated to TxDOT \u00b7 FHWA sponsors. Sign in with a sponsor account."
  :actions="[
    { label: 'Sign in as sponsor', to: '/sign-in?role=sponsor', intent: 'primary', icon: 'lucide:log-in' },
    { label: 'Public dashboards',  to: '/dashboards',           intent: 'ghost',   icon: 'lucide:bar-chart-3' },
  ]"
/>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="status states" title="TuxErrorPage">
      Full-page template for 404 / 500 / 403 / 503 scenarios. Status
      code in display type, editorial title + lede, recovery actions,
      optional support / status-page link block. Use as the
      <code>error.vue</code> Nuxt route in consuming apps, or inline
      via the <code>inline</code> prop.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">404 \u00b7 default</p>
      <h2 class="heading--bold text-xl font-bold">Not found</h2>
      <TuxExample class="mt-4" :vue="fourOhFourVue">
        <TuxErrorPage code="404" inline />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">500 \u00b7 with support slot</p>
      <h2 class="heading--bold text-xl font-bold">Server error</h2>
      <TuxExample class="mt-4" :vue="fiveHundredVue">
        <TuxErrorPage code="500" inline>
          <template #support>
            Need help? File a ticket at
            <a href="https://helpdesk.tti.tamu.edu" class="link-tti">helpdesk.tti.tamu.edu</a>
            or call (979) 317-2345 · incident #INC-029141.
          </template>
        </TuxErrorPage>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">403 \u00b7 custom copy + actions</p>
      <h2 class="heading--bold text-xl font-bold">Override defaults</h2>
      <TuxExample class="mt-4" :vue="customVue">
        <TuxErrorPage
          code="403"
          title="Restricted to TAMUS sponsors"
          lede="This corridor study is gated to TxDOT · FHWA sponsors. Sign in with a sponsor account."
          inline
          :actions="[
            { label: 'Sign in as sponsor', to: '/sign-in?role=sponsor', intent: 'primary', icon: 'lucide:log-in' },
            { label: 'Public dashboards',  to: '/dashboards',           intent: 'ghost',   icon: 'lucide:bar-chart-3' },
          ]"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">notes</p>
      <h2 class="heading--bold text-lg font-bold">As a Nuxt error route</h2>
      <p class="mt-2 text-text-secondary leading-relaxed">
        For app-level errors, drop into <code>app/error.vue</code> and
        forward the Nuxt <code>error</code> object's <code>statusCode</code>:
        <code>&lt;TuxErrorPage :code="String(error.statusCode)" /&gt;</code>.
        Defaults are provided for 404 / 500 / 403 / 503; anything else
        falls back to a generic template.
      </p>
    </section>
  </div>
</template>
