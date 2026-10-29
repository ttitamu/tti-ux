<script setup>
// Per ADR-0010, keep top-level <script setup> expressions plain JS.
useHead({ title: "TuxLeaseBadge · TUX" });

const lidarHours = ref(18);
const actionLog = ref("");

function onExtendLidar() {
  lidarHours.value += 72;
  actionLog.value = `Extended Mobile LiDAR Van #04 lease by +72h (${lidarHours.value}h remaining).`;
}

function onReleaseLidar() {
  lidarHours.value = -1;
  actionLog.value = "Released Mobile LiDAR Van #04 back to equipment pool.";
}

const interactiveVue = `<tux-lease-badge
  label="Mobile LiDAR Van #04"
  :remaining-hours="lidarHours"
  expires-label="2026-11-15"
  extendable
  releasable
  @extend="onExtendLidar"
  @release="onReleaseLidar"
/>`;

const matrixVue = `<div class="flex flex-col gap-3">
  <tux-lease-badge label="High-Speed Runway Pad B" :remaining-hours="342" expires-label="2026-11-12" />
  <tux-lease-badge label="Portable WIM Trailer #11" :remaining-hours="18" expires-label="2026-10-30" />
  <tux-lease-badge label="Work-Zone Radar Pod #02" :remaining-hours="-48" />
  <tux-lease-badge label="Permanent Reference Loop" />
</div>`;

const propsTs = `export type LeaseBadgeState = "active" | "expiring" | "expired" | "indefinite";

interface Props {
  label?: string;
  remainingHours?: number; // negative = expired, undefined = indefinite
  expiresLabel?: string;
  warningHours?: number;   // default 72
  extendable?: boolean;    // default false
  releasable?: boolean;    // default false
  extendLabel?: string;    // default "Extend"
  releaseLabel?: string;   // default "Release"
}`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component · status & lifecycle" title="TuxLeaseBadge">
      Time-to-live (TTL) countdown and expiration status pill with optional
      44×44px inline lifecycle actions. Derives <code>active</code>,
      <code>expiring</code>, <code>expired</code>, and <code>indefinite</code>
      postures automatically from <code>remainingHours</code>.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">flagship · interactive equipment checkout</p>
      <h2 class="heading--bold text-xl font-bold">Expiring field asset lease with Extend &amp; Release</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        When <code>remainingHours</code> drops at or below
        <code>warningHours</code> (default <code>72</code>), the badge switches
        to high-contrast warning posture. Enable <code>extendable</code> and
        <code>releasable</code> to expose keyboard-accessible 44px lifecycle
        controls inline.
      </p>
      <TuxExample class="mt-4" :vue="interactiveVue">
        <div class="space-y-3">
          <TuxLeaseBadge
            label="Mobile LiDAR Van #04"
            :remaining-hours="lidarHours"
            expires-label="2026-11-15"
            extendable
            releasable
            @extend="onExtendLidar"
            @release="onReleaseLidar"
          />
          <p class="text-xs font-mono text-text-muted">
            {{ actionLog || "state: expiring within 72h window · click Extend (+72h) or Release" }}
          </p>
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">state matrix · four automatic postures</p>
      <h2 class="heading--bold text-xl font-bold">Active, expiring, expired, and indefinite</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Each state pairs semantic border and surface tokens with a distinct
        micro-glyph so status remains unmistakable across monochrome and color-vision-deficient
        modes.
      </p>
      <TuxExample class="mt-4" :vue="matrixVue">
        <div class="flex flex-col items-start gap-3">
          <TuxLeaseBadge
            label="High-Speed Runway Pad B"
            :remaining-hours="342"
            expires-label="2026-11-12"
          />
          <TuxLeaseBadge
            label="Portable WIM Trailer #11"
            :remaining-hours="18"
            expires-label="2026-10-30"
          />
          <TuxLeaseBadge
            label="Work-Zone Radar Pod #02"
            :remaining-hours="-48"
          />
          <TuxLeaseBadge label="Permanent Reference Loop" />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">api contract</p>
      <h2 class="heading--bold text-xl font-bold">Props &amp; derived states</h2>
      <TuxCodeBlock class="mt-4" :code="propsTs" lang="ts" filename="TuxLeaseBadge.ts" />
    </section>
  </div>
</template>
