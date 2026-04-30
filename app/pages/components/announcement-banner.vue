<script setup lang="ts">
useHead({ title: "TuxAnnouncementBanner · TUX" });

const infoVue = `<tux-announcement-banner
  id="campus-closure-2026-q2"
  tone="info"
  eyebrow="campus notice"
  message="TTI offices will be closed Friday, May 23 for staff development."
  :action="{ label: 'Read more', to: '/news/2026-05-23-closure' }"
/>`;

const warningVue = `<tux-announcement-banner
  tone="warning"
  eyebrow="scheduled maintenance"
  message="PECAN will be unavailable Saturday 2\u20134am for index rebuild."
  :action="{ label: 'Status page', href: 'https://status.tti.tamu.edu' }"
/>`;

const urgentVue = `<tux-announcement-banner
  tone="urgent"
  eyebrow="security advisory"
  message="Reset your TAMUS password by EOW \u2014 see ticket SEC-2041."
  :action="{ label: 'Reset password', href: 'https://account.tamus.edu' }"
/>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="banners & tags" title="TuxAnnouncementBanner">
      Top-of-page dismissable strip for site-wide notices. Distinct from
      <code>TuxAlert</code> (inline page-body admonition) — this is
      chrome that sits above the page header, full-width, persists across
      routes, and remembers dismissal in <code>localStorage</code> by
      <code>id</code>.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">info \u00b7 default</p>
      <h2 class="heading--bold text-xl font-bold">Campus closure notice</h2>
      <TuxExample class="mt-4" :vue="infoVue">
        <TuxAnnouncementBanner
          tone="info"
          eyebrow="campus notice"
          message="TTI offices will be closed Friday, May 23 for staff development."
          :action="{ label: 'Read more', to: '/news/2026-05-23-closure' }"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">warning</p>
      <h2 class="heading--bold text-xl font-bold">Scheduled maintenance</h2>
      <TuxExample class="mt-4" :vue="warningVue">
        <TuxAnnouncementBanner
          tone="warning"
          eyebrow="scheduled maintenance"
          message="PECAN will be unavailable Saturday 2–4am for index rebuild."
          :action="{ label: 'Status page', href: 'https://status.tti.tamu.edu' }"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">urgent \u00b7 maroon fill</p>
      <h2 class="heading--bold text-xl font-bold">Security advisory</h2>
      <TuxExample class="mt-4" :vue="urgentVue">
        <TuxAnnouncementBanner
          tone="urgent"
          eyebrow="security advisory"
          message="Reset your TAMUS password by EOW — see ticket SEC-2041."
          :action="{ label: 'Reset password', href: 'https://account.tamus.edu' }"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">success</p>
      <h2 class="heading--bold text-xl font-bold">Quiet positive notice</h2>
      <TuxExample class="mt-4">
        <TuxAnnouncementBanner
          tone="success"
          message="FY26 Q1 sponsored-research dashboard is now live on tti.tamu.edu."
          :action="{ label: 'View dashboard', to: '/dashboards/q1' }"
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">persistence</p>
      <h2 class="heading--bold text-lg font-bold">Dismissal memory</h2>
      <p class="mt-2 text-text-secondary leading-relaxed">
        Pass <code>id="some-stable-key"</code> and dismissal persists in
        <code>localStorage</code> as <code>tux-announcement-{id}</code>.
        Omit <code>id</code> for non-persistent banners (request-scoped
        UI state). The <code>dismiss</code> event also fires for
        consumers driving their own persistence layer.
      </p>
    </section>
  </div>
</template>
