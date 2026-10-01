<script setup lang="ts">
import tuxEventCalendarRowSource from "~/components/TuxEventCalendarRow.vue?raw";

useHead({ title: "TuxEventCalendarRow · TUX" });

const lastAction = ref("");

function onAction(eventTitle: string) {
  lastAction.value = `RSVP clicked for: ${eventTitle} at ${new Date().toLocaleTimeString()}`;
}

const snippet = `<TuxEventCalendarRow
  day="30"
  month="SEP"
  title="Autonomous Shuttle Proving Ground Demonstration"
  time="Wednesday, September 30, 2026 @ 10:00 am - 12:00 pm"
  location="RELLIS Proving Grounds, Runway 35L"
  category="Field Demonstration"
  action-text="RSVP"
  chip-tone="green"
  @action-click="onAction"
/>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader
      eyebrow="data display & events"
      title="TuxEventCalendarRow"
    >
      The institutional event calendar row from my.tti.tamu.edu (Kadence + Tribe Events parity).
      Features the signature square Green Date Chip, high-contrast typography, location tag, and action CTA.
    </TuxPageHeader>

    <!-- Interactive Demo -->
    <section class="space-y-4">
      <TuxSectionHeader variant="two-tone-rule" title="LIVE" secondary-title="CALENDAR ROWS" />

      <div class="bg-surface-raised border border-surface-border shadow-xs divide-y divide-surface-border">
        <TuxEventCalendarRow
          day="30"
          month="SEP"
          title="Autonomous Shuttle Proving Ground Demonstration"
          time="Wednesday, September 30, 2026 @ 10:00 am - 12:00 pm"
          location="RELLIS Proving Grounds, Runway 35L"
          category="Field Demonstration"
          action-text="RSVP"
          chip-tone="green"
          @action-click="onAction('Autonomous Shuttle Demonstration')"
        />

        <TuxEventCalendarRow
          day="05"
          month="OCT"
          title="Annual Texas Multimodal Freight Advisory Council"
          time="Monday, October 5, 2026 @ 1:30 pm - 4:00 pm"
          location="TTI Headquarters Auditorium"
          category="Council Meeting"
          action-text="Register"
          chip-tone="maroon"
          @action-click="onAction('Freight Advisory Council')"
        />

        <TuxEventCalendarRow
          day="14"
          month="OCT"
          title="MASH Barrier Crash Test #4732: Heavy Vehicle Redirection"
          time="Wednesday, October 14, 2026 @ 9:00 am - 11:00 am"
          location="Impact Proving Ground Test Pad 2"
          category="Safety Certification"
          action-text="Observer Access"
          chip-tone="gold"
          @action-click="onAction('MASH Crash Test')"
        />
      </div>

      <div v-if="lastAction" class="p-3 bg-surface-sunken border border-surface-border text-xs font-mono text-brand-primary">
        {{ lastAction }}
      </div>

      <TuxCodeBlock :code="snippet" lang="vue" filename="Template Usage" />
    </section>

    <!-- Source Code Tab -->
    <section class="space-y-4">
      <TuxSectionHeader variant="two-tone-rule" title="COMPONENT" secondary-title="SOURCE" />
      <TuxCodeBlock :code="tuxEventCalendarRowSource" lang="vue" filename="app/components/TuxEventCalendarRow.vue" />
    </section>
  </div>
</template>
