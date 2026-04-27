<script setup lang="ts">
useHead({ title: "TuxCodeMaroon · tti-ux" });

const showAlert    = ref(true);
const showWarning  = ref(true);
const showInfo     = ref(true);
const dismissible  = ref(false);

const exampleVue = `<TuxCodeMaroon
  :active="hasAlert"
  severity="alert"
  title="Code Maroon active"
  message="Shelter in place. Avoid the Rellis Headquarters Building until further notice."
  details-url="https://rellis.tamus.edu/emergency/"
/>`;
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="component" title="TuxCodeMaroon">
      Institutional emergency alert banner. TAMUS's Code Maroon is the
      mandatory emergency-notification system; Rellis Campus (where
      TTI lives) routes through
      <a class="link-tti" href="https://rellis.tamus.edu/emergency/" target="_blank" rel="noopener">rellis.tamus.edu/emergency/</a>.
      When an alert is active, this banner pins to the top of every
      page above all other chrome.
    </TuxPageHeader>

    <section class="space-y-3">
      <p class="eyebrow">non-negotiable</p>
      <h2 class="heading--bold text-xl font-bold">This banner doesn't theme</h2>
      <p class="max-w-3xl text-sm text-text-secondary leading-relaxed">
        Code Maroon is system-wide safety messaging, not a brand
        surface. Severity colors (alert / warning / info) are
        hard-coded — they don't honor <code>data-theme="tti-dark"</code>
        or <code>tti-hc</code>. Visual recognition matters more than
        palette consistency during emergencies. The banner also
        defaults to <strong>non-dismissible</strong>; pass
        <code>dismissible</code> only when institutional policy allows it.
      </p>
    </section>

    <section>
      <p class="eyebrow">canonical · alert severity</p>
      <h2 class="heading--bold text-xl font-bold">Active emergency</h2>
      <p class="text-sm text-text-secondary mb-3">
        The default. Bright red, white text, pulsing siren icon. Use
        for active emergencies — shelter-in-place, evacuation, severe
        weather.
      </p>
      <TuxExample class="mt-4" :vue="exampleVue">
        <div class="flex gap-3 mb-4">
          <TuxButton intent="secondary" size="sm" @click="showAlert = !showAlert">
            {{ showAlert ? "Clear alert" : "Trigger alert" }}
          </TuxButton>
        </div>
        <TuxCodeMaroon
          :active="showAlert"
          severity="alert"
          title="Code Maroon active"
          message="Shelter in place. Avoid the Rellis Headquarters Building until further notice."
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">warning severity</p>
      <h2 class="heading--bold text-xl font-bold">Advisory</h2>
      <p class="text-sm text-text-secondary mb-3">
        Amber. Use for advisories — weather watches, scheduled drills,
        non-emergency safety reminders.
      </p>
      <TuxExample class="mt-4">
        <div class="flex gap-3 mb-4">
          <TuxButton intent="secondary" size="sm" @click="showWarning = !showWarning">
            {{ showWarning ? "Clear warning" : "Trigger warning" }}
          </TuxButton>
        </div>
        <TuxCodeMaroon
          :active="showWarning"
          severity="warning"
          title="Severe thunderstorm watch"
          message="In effect through 10 PM. Outdoor field operations are paused; check with your supervisor."
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">info severity</p>
      <h2 class="heading--bold text-xl font-bold">Drill / scheduled disruption</h2>
      <p class="text-sm text-text-secondary mb-3">
        Navy. Use for scheduled tests of the Code Maroon system, or
        non-urgent operational notices that need top-of-page placement.
      </p>
      <TuxExample class="mt-4">
        <div class="flex gap-3 mb-4">
          <TuxButton intent="secondary" size="sm" @click="showInfo = !showInfo">
            {{ showInfo ? "Clear notice" : "Trigger notice" }}
          </TuxButton>
        </div>
        <TuxCodeMaroon
          :active="showInfo"
          severity="info"
          title="Scheduled test · Wednesday 11:00 AM"
          message="The Code Maroon system will run a scheduled test. No action required; this is not a real emergency."
        />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">dismissible</p>
      <h2 class="heading--bold text-xl font-bold">Allow dismissal</h2>
      <p class="text-sm text-text-secondary mb-3">
        Pass <code>dismissible</code> + a <code>v-model</code> for the
        dismissed state. Default is non-dismissible — emergency
        messaging is meant to stay until the alert clears upstream.
      </p>
      <TuxExample class="mt-4">
        <div class="flex gap-3 mb-4">
          <TuxButton intent="secondary" size="sm" @click="dismissible = !dismissible">
            Restore banner
          </TuxButton>
        </div>
        <TuxCodeMaroon
          :active="!dismissible"
          severity="warning"
          title="Power maintenance"
          message="HVAC systems in Building 4202 will cycle between 2 PM and 4 PM. Some labs will be temporarily warm."
          dismissible
          @dismiss="dismissible = true"
        />
      </TuxExample>
    </section>

    <section class="space-y-3">
      <p class="eyebrow">production wiring</p>
      <h2 class="heading--bold text-xl font-bold">Where this lives in the page</h2>
      <p class="max-w-3xl text-sm text-text-secondary leading-relaxed">
        Mount <strong>above</strong> your TuxIdentity / site header so
        it's the first thing in the document order. Pass
        <code>sticky</code> to keep it pinned as users scroll. Drive
        <code>active</code> + <code>message</code> from your alert
        feed (Rellis emergency API, RSS poll, server-pushed event) —
        not from a hard-coded prop.
      </p>
      <pre class="text-xs bg-surface-sunken border border-surface-border rounded p-4 overflow-x-auto"><code>&lt;script setup&gt;
const { active, severity, title, message } = useRellisAlertFeed();
&lt;/script&gt;

&lt;template&gt;
  &lt;TuxCodeMaroon
    :active="active"
    :severity="severity"
    :title="title"
    :message="message"
    sticky
  /&gt;
  &lt;header&gt;
    &lt;TuxIdentity ... /&gt;
  &lt;/header&gt;
  &lt;NuxtPage /&gt;
  &lt;TuxFooter ... /&gt;
  &lt;TuxSubfooter /&gt;
&lt;/template&gt;</code></pre>
    </section>

    <section>
      <p class="eyebrow">props</p>
      <h2 class="heading--bold text-xl font-bold">Props + events</h2>
      <ul class="mt-4 space-y-2 text-sm">
        <li><code>active</code> — show the banner. Defaults to <code>false</code> so an unconfigured banner renders nothing.</li>
        <li><code>severity</code> — <code>"alert" | "warning" | "info"</code>. Defaults to <code>"alert"</code>.</li>
        <li><code>title</code> — short banner title. Defaults to <code>"Emergency alert"</code>.</li>
        <li><code>message</code> — alert body text.</li>
        <li><code>detailsUrl</code> — link to full alert page. Defaults to the Rellis emergency portal; override for non-Rellis consumers.</li>
        <li><code>detailsLabel</code> — link text. Defaults to <code>"View details"</code>.</li>
        <li><code>dismissible</code> — show X button. Defaults to <code>false</code>.</li>
        <li><code>v-model</code> — dismissal state.</li>
        <li><code>sticky</code> — pin to top of viewport on scroll.</li>
        <li>Emits <code>@dismiss</code> when the user clicks the X.</li>
      </ul>
    </section>
  </div>
</template>
