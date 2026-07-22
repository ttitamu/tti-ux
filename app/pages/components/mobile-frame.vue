<script setup>
useHead({ title: "TuxMobileFrame · TUX" });

const iosVue = `<tux-mobile-frame platform="ios" :width="280" color="natural">
  <img src="/screenshots/landscape-mobile.png" alt="" />
</tux-mobile-frame>`;

const androidVue = `<tux-mobile-frame platform="android" :width="280" color="obsidian">
  <img src="/screenshots/landscape-mobile.png" alt="" />
</tux-mobile-frame>`;

const sideBySideVue = `<div class="flex gap-6">
  <tux-mobile-frame platform="ios" :width="240" />
  <tux-mobile-frame platform="android" :width="240" />
</div>`;
</script>

<template>
  <div class="space-y-12">
    <TuxPageHeader eyebrow="component · documentation" title="TuxMobileFrame">
      Stylized device chrome for marketing screenshots and
      stakeholder reviews. Single component, two platforms — pass
      <code>platform="ios"</code> for iPhone 16 Pro shape or
      <code>platform="android"</code> for Pixel 9 shape. Both share
      the same <code>:width</code> pivot so they sit cleanly
      side-by-side in cross-platform mockups.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">flagship · iOS</p>
      <h2 class="heading--bold text-xl font-bold">iPhone — Dynamic Island + status bar + home indicator</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Default 280px wide; everything (bezel, screen radius, side
        buttons, island, indicator) scales from that single number.
        Drop any element into the slot — an image, a live TUX
        composition, or a placeholder.
      </p>
      <TuxExample class="mt-4" :vue="iosVue">
        <div class="flex justify-center p-4">
          <TuxMobileFrame platform="ios" :width="280" color="natural">
            <div class="mf-demo">
              <p class="mf-demo__eyebrow">corridor · landscape</p>
              <h3 class="mf-demo__title">FM-60 / Wellborn</h3>
              <div class="mf-demo__stat">
                <span class="mf-demo__stat-num">38<small>%</small></span>
                <span class="mf-demo__stat-label">compliance Q1</span>
              </div>
              <ul class="mf-demo__list">
                <li>Last inspected · 12 May</li>
                <li>Treatment · rumble strips</li>
                <li>Beacon battery · 18%</li>
              </ul>
              <button type="button" class="mf-demo__cta">Open ticket</button>
            </div>
          </TuxMobileFrame>
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">ios · variants</p>
      <h2 class="heading--bold text-xl font-bold">Four iPhone bezel colors</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Real iPhone 16 Pro finishes (natural / black / white) plus a
        TTI maroon for branded marketing surfaces.
      </p>
      <TuxExample class="mt-4">
        <div class="flex flex-wrap gap-4 justify-center p-4">
          <TuxMobileFrame platform="ios" :width="160" color="natural"><div class="placeholder">natural</div></TuxMobileFrame>
          <TuxMobileFrame platform="ios" :width="160" color="black"><div class="placeholder">black</div></TuxMobileFrame>
          <TuxMobileFrame platform="ios" :width="160" color="white"><div class="placeholder">white</div></TuxMobileFrame>
          <TuxMobileFrame platform="ios" :width="160" color="maroon"><div class="placeholder">maroon</div></TuxMobileFrame>
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">flagship · Android</p>
      <h2 class="heading--bold text-xl font-bold">Pixel — center punch-hole camera + gesture nav</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Pixel 9 proportions; <code>navStyle</code> switches between
        gesture pill (Android 12+) and three-button (legacy).
        <code>:notch="false"</code> hides the center punch-hole for
        surfaces that prefer a clean top edge.
      </p>
      <TuxExample class="mt-4" :vue="androidVue">
        <div class="flex justify-center p-4">
          <TuxMobileFrame platform="android" :width="280" color="obsidian">
            <div class="mf-demo">
              <p class="mf-demo__eyebrow">corridor · landscape</p>
              <h3 class="mf-demo__title">FM-60 / Wellborn</h3>
              <div class="mf-demo__stat">
                <span class="mf-demo__stat-num">38<small>%</small></span>
                <span class="mf-demo__stat-label">compliance Q1</span>
              </div>
              <ul class="mf-demo__list">
                <li>Last inspected · 12 May</li>
                <li>Treatment · rumble strips</li>
                <li>Beacon battery · 18%</li>
              </ul>
              <button type="button" class="mf-demo__cta">Open ticket</button>
            </div>
          </TuxMobileFrame>
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">android · variants</p>
      <h2 class="heading--bold text-xl font-bold">Three Pixel finishes + maroon</h2>
      <TuxExample class="mt-4">
        <div class="flex flex-wrap gap-4 justify-center p-4">
          <TuxMobileFrame platform="android" :width="160" color="obsidian"><div class="placeholder">obsidian</div></TuxMobileFrame>
          <TuxMobileFrame platform="android" :width="160" color="porcelain"><div class="placeholder">porcelain</div></TuxMobileFrame>
          <TuxMobileFrame platform="android" :width="160" color="hazel"><div class="placeholder">hazel</div></TuxMobileFrame>
          <TuxMobileFrame platform="android" :width="160" color="maroon"><div class="placeholder">maroon</div></TuxMobileFrame>
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">android · nav options</p>
      <h2 class="heading--bold text-xl font-bold">Gesture · three-button · none</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Gesture (default, modern Android), three-button (legacy /
        accessibility-preferred users), or none (kiosk / fullscreen
        contexts).
      </p>
      <TuxExample class="mt-4">
        <div class="flex flex-wrap gap-4 justify-center p-4">
          <TuxMobileFrame platform="android" :width="180" color="obsidian" nav-style="gesture"><div class="placeholder">gesture</div></TuxMobileFrame>
          <TuxMobileFrame platform="android" :width="180" color="obsidian" nav-style="three-button"><div class="placeholder">three-button</div></TuxMobileFrame>
          <TuxMobileFrame platform="android" :width="180" color="obsidian" nav-style="none"><div class="placeholder">none</div></TuxMobileFrame>
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">cross-platform mockup</p>
      <h2 class="heading--bold text-xl font-bold">Side-by-side comparison</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Both platforms share the same width / scale pivot — pass the
        same <code>:width</code> to each and they pair cleanly. The
        canonical "here's the app on iOS and Android" marketing
        layout.
      </p>
      <TuxExample class="mt-4" :vue="sideBySideVue">
        <div class="flex gap-6 justify-center p-4 flex-wrap">
          <TuxMobileFrame platform="ios" :width="240" color="natural"><div class="placeholder">iOS</div></TuxMobileFrame>
          <TuxMobileFrame platform="android" :width="240" color="obsidian"><div class="placeholder">Android</div></TuxMobileFrame>
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">when to reach for which</p>
      <h2 class="heading--bold text-xl font-bold">Frame vs runtime chrome</h2>
      <ul class="mt-3 text-sm text-text-secondary leading-relaxed list-disc pl-5 space-y-1 max-w-2xl">
        <li>
          <strong>Marketing / docs screenshot</strong> →
          <code>TuxMobileFrame</code>. Static frame around a slot;
          doesn't react to platform APIs.
        </li>
        <li>
          <strong>Tauri Mobile app chrome (runtime)</strong> →
          <code>TuxAppFrame</code> + <code>TuxTabBar</code> +
          <code>useTuxPlatform()</code>. The platform-awareness
          doctrine lives in
          <code>design/platform-awareness.md</code>.
        </li>
        <li>
          <strong>Both</strong> on the same page (marketing site
          showing what the live app looks like) — perfectly fine;
          they don't conflict.
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, color-mix(in srgb, var(--brand-primary) 12%, var(--surface-sunken)), var(--surface-sunken));
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.mf-demo {
  display: flex;
  flex-direction: column;
  padding: 3.5rem 1.25rem 2rem;
  height: 100%;
  background: linear-gradient(180deg, color-mix(in srgb, var(--brand-primary) 8%, var(--surface-raised)), var(--surface-raised));
  color: var(--text-primary);
}
.mf-demo__eyebrow {
  font-family: var(--font-mono);
  font-size: 0.5625rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--brand-primary);
  margin: 0 0 0.125rem;
}
.mf-demo__title {
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: 700;
  margin: 0 0 0.875rem;
  color: var(--text-primary);
}
.mf-demo__stat {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 0.875rem;
}
.mf-demo__stat-num {
  font-family: var(--font-display);
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--brand-primary);
  line-height: 1;
  font-variant-numeric: tabular-nums;
}
.mf-demo__stat-num small {
  font-size: 1rem;
  margin-left: 0.0625rem;
}
.mf-demo__stat-label {
  font-size: 0.625rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.mf-demo__list {
  list-style: none;
  margin: 0 0 auto;
  padding: 0;
  font-size: 0.6875rem;
  color: var(--text-secondary);
  line-height: 1.65;
}
.mf-demo__cta {
  font: inherit;
  font-size: 0.75rem;
  font-weight: 600;
  background: var(--brand-primary);
  color: var(--brand-on-primary, white);
  border: none;
  border-radius: 0.5rem;
  padding: 0.625rem;
  margin-top: 0.875rem;
  cursor: pointer;
}
</style>
