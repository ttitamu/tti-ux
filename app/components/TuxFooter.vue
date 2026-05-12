<script setup lang="ts">
// TuxFooter — the unified institutional footer.
//
// One footer to rule them all. Earlier we shipped three separate
// pieces (slim TuxFooter for app dashboards, TuxMarketingFooter for
// marcom surfaces, TuxSubfooter for the TAMUS legal strip), but in
// practice tti.tamu.edu / tamu.edu / pvamu.edu all run the same
// shape — a maroon marketing block stacked on a black legal strip —
// and our consumers (PECAN, tti-ai-studio, the style guide, marcom
// pages) all need the same thing. So this is one component.
//
// Layout:
//
//   ┌──────────────────── maroon ────────────────────┐
//   │  [logo]  [name + address + phone]              │
//   │          [social row]                          │
//   │                          [col]    [col]    [col] │
//   └────────────────────────────────────────────────┘
//   ┌──────────────────── black ─────────────────────┐
//   │  [A member of TAMUS]   tagline + © + state     │
//   │                        compliance links        │
//   │                        [#preferences slot]     │
//   └────────────────────────────────────────────────┘
//
// The black legal strip is intentionally minimal — TAMUS lockup
// left, © + name right, optional #preferences slot below. The
// TTI-specific tagline ("Coordinated Statewide Transportation
// Research Program") lives in the marketing section just below
// the institution name, where it carries more editorial weight.
//
// **State-agency compliance links** (Veterans Portal, Open Records,
// Risk/Fraud Hotline, etc.) belong in the user-passed `columns` —
// the production tti.tamu.edu / tamu.edu pattern is to surface
// them in the marketing-shape link inventory, not duplicate them
// in a sub-bar. Earlier versions of this component shipped a
// non-configurable legal-link list at the bottom; that left the
// rendered footer with awkward duplication (Texas Veterans Portal
// appearing twice, etc.) and was dropped in favor of the
// production pattern.
//
// The maroon marketing section is configurable: pass `social` and
// `columns` to populate it. Pass nothing and you get just the
// identity block + the TAMUS lockup strip, which is the right
// shape for an app dashboard.

interface SocialLink {
  /** Lucide icon name, e.g. "lucide:linkedin", "lucide:facebook".
   *  Either `icon` or `svg` must be provided. */
  icon?: string;
  /** Inline `<svg>…</svg>` markup. Used when the platform lacks a
   *  Lucide glyph (Threads is the canonical case). The SVG should use
   *  `fill="currentColor"` and a 0 0 24 24 viewBox to sit cleanly
   *  alongside the Lucide icons. */
  svg?: string;
  /** Platform name for aria-label. */
  label: string;
  /** Profile URL. */
  href: string;
}

interface ColumnLink {
  label: string;
  href?: string;
  to?: string;
}

interface Column {
  heading: string;
  links: ColumnLink[];
}

interface Props {
  /** Institution name. Defaults to TTI; override for sibling
   *  institutions (PVAMU, Tarleton, WTAMU, etc.). */
  name?: string;
  /** Multi-line address. Splits on newlines. */
  address?: string;
  /** Phone number; rendered as a tel: link. */
  phone?: string | null;
  /** Logo path. Defaults to the system /logo.svg. */
  logo?: string;
  /** Logo width in px. */
  logoSize?: number;
  /** Optional full institutional lockup (logo + wordmark) rendered
   *  beneath the social row. Use the white-on-transparent variant
   *  since it sits on the maroon marketing ground. Pass `null` to
   *  hide; sibling institutions override with their own artwork. */
  brandLockup?: string | null;
  /** Alt text for `brandLockup`. */
  brandLockupAlt?: string;
  /** Social-platform links. Renders as an icon row beneath the address. */
  social?: SocialLink[];
  /** Right-side resource/policy columns. Two is canonical; three+
   *  works on wide containers. Include any state-agency compliance
   *  links your institution requires (Veterans Portal, Open Records,
   *  Risk/Fraud Hotline) here — there's no longer a separate legal
   *  link list at the bottom. */
  columns?: Column[];
  /** TTI-specific research-program tagline rendered as a small
   *  italic line below the institution name. Override or pass
   *  empty for sibling institutions with different mandate text. */
  tagline?: string;
  /** Year for the © line. Defaults to current year. */
  year?: number;
  /** Full override for the copyright line. If provided, replaces the
   *  default "© {year} {name}" rendering. Use to match institutional
   *  comm-team wording verbatim (e.g. "© Copyright 2026 TTI"). */
  copyrightText?: string;
  /** If provided, wraps the copyright line in an external link —
   *  typically to the institution's copyright-statement page. */
  copyrightHref?: string;
}

withDefaults(defineProps<Props>(), {
  name: "Texas A&M Transportation Institute",
  address: "3135 TAMU\nCollege Station, TX 77843-3135",
  phone: "(979) 317-2000",
  logo: "/logo.svg",
  logoSize: 80,
  brandLockup: "/TTI_white.png",
  brandLockupAlt: "Texas A&M Transportation Institute",
  social: () => [],
  columns: () => [],
  tagline: "Coordinated Statewide Transportation Research Program",
  year: () => new Date().getFullYear(),
  copyrightText: "",
  copyrightHref: "",
});

function isInternal(href: string) {
  return href.startsWith("/") || href.startsWith("#");
}
</script>

<template>
  <footer class="tux-footer">
    <!-- ────────── MAROON MARKETING SECTION ────────── -->
    <div class="tux-footer__marketing">
      <div class="tux-footer__marketing-inner">
        <!-- Identity column: logo + name + address + phone + socials -->
        <div class="tux-footer__identity">
          <img
            :src="logo"
            alt=""
            aria-hidden="true"
            :width="logoSize"
            :height="logoSize"
            class="tux-footer__logo"
          >

          <div class="tux-footer__identity-text">
            <p class="tux-footer__name">{{ name }}</p>
            <p v-if="tagline" class="tux-footer__tagline">{{ tagline }}</p>
            <p
              v-for="line in address.split('\n')"
              :key="line"
              class="tux-footer__address-line"
            >{{ line }}</p>
            <p v-if="phone" class="tux-footer__phone">
              <a
                :href="`tel:${phone.replace(/\D/g, '')}`"
                class="tux-footer__phone-link"
              >{{ phone }}</a>
            </p>
          </div>

          <ul v-if="social.length > 0" class="tux-footer__social">
            <li v-for="s in social" :key="s.label">
              <a
                :href="s.href"
                target="_blank"
                rel="noopener"
                :aria-label="s.label"
                class="tux-footer__social-link"
              >
                <!-- v-html for the `svg` branch is safe here: the markup
                     is component-author-provided (never user-input) and
                     declared inline in the consumer's social[] array.
                     The only consumer today is the Threads brand glyph,
                     which Lucide doesn't carry. -->
                <span
                  v-if="s.svg"
                  class="tux-footer__social-icon"
                  aria-hidden="true"
                  v-html="s.svg"
                />
                <Icon
                  v-else-if="s.icon"
                  :name="s.icon"
                  class="tux-footer__social-icon"
                  aria-hidden="true"
                />
              </a>
            </li>
          </ul>

          <img
            v-if="brandLockup"
            :src="brandLockup"
            :alt="brandLockupAlt"
            class="tux-footer__brand-lockup"
          >
        </div>

        <!-- Right-side columns of links -->
        <div
          v-for="col in columns"
          :key="col.heading"
          class="tux-footer__column"
        >
          <p class="tux-footer__column-heading">{{ col.heading }}</p>
          <ul class="tux-footer__column-list">
            <li v-for="link in col.links" :key="link.label">
              <!-- Explicit v-if branches (not `<component :is>`) for the
                   same click-reliability reason as the Tux nav components:
                   resolving NuxtLink from a string was eating clicks
                   intermittently. Static branches give vue-router the
                   resolved component at compile time. -->
              <NuxtLink
                v-if="link.to"
                :to="link.to"
                class="tux-footer__column-link"
              >{{ link.label }}</NuxtLink>
              <NuxtLink
                v-else-if="link.href && isInternal(link.href)"
                :to="link.href"
                class="tux-footer__column-link"
              >{{ link.label }}</NuxtLink>
              <a
                v-else-if="link.href"
                :href="link.href"
                target="_blank"
                rel="noopener"
                class="tux-footer__column-link"
              >{{ link.label }}</a>
              <span v-else class="tux-footer__column-link">{{ link.label }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- ────────── BLACK LEGAL STRIP — minimal: TAMUS line left,
         © right, optional preferences below if used. State-agency
         links live in `columns` above (production tti.tamu.edu /
         tamu.edu pattern). The left side renders as a single plain
         link to match the comm-team's Kadence footer; the © line
         optionally wraps in `copyrightHref` to the institution's
         copyright-statement page. ────────── -->
    <div class="tux-footer__legal">
      <div class="tux-footer__legal-inner">
        <a
          href="https://www.tamus.edu/"
          target="_blank"
          rel="noopener"
          class="tux-footer__tamus-link"
        >A member of the Texas A&amp;M University System</a>

        <p class="tux-footer__copy">
          <a
            v-if="copyrightHref"
            :href="copyrightHref"
            target="_blank"
            rel="noopener"
            class="tux-footer__copy-link"
          >{{ copyrightText || `© ${year} ${name}` }}</a>
          <template v-else>{{ copyrightText || `© ${year} ${name}` }}</template>
        </p>
      </div>

      <div v-if="$slots.preferences" class="tux-footer__preferences">
        <div class="tux-footer__preferences-inner">
          <slot name="preferences" />
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.tux-footer {
  container-type: inline-size;
  container-name: tux-footer;
  font-family: var(--font-body);
}

/* ──────── MAROON MARKETING ──────── */
.tux-footer__marketing {
  /* --brand-fill (always dark maroon) instead of --brand-primary
     because brand-primary lightens in dark mode for text legibility,
     which would push white-on-maroon-fill text below WCAG AA. */
  background: var(--brand-fill);
  color: rgba(255, 255, 255, 0.92);
}

.tux-footer__marketing-inner {
  max-width: 80rem;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
}

@container tux-footer (min-width: 48rem) {
  .tux-footer__marketing-inner {
    grid-template-columns: minmax(20rem, 1.4fr) repeat(auto-fit, minmax(11rem, 1fr));
    gap: 3rem;
    padding: 3rem 2rem;
  }
}

/* Identity block */
.tux-footer__identity {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-areas:
    "logo text"
    "social social"
    "lockup lockup";
  gap: 1rem 1.25rem;
  align-items: start;
}

.tux-footer__logo {
  grid-area: logo;
  flex-shrink: 0;
  /* /logo.svg ships in maroon-on-white; on a maroon ground we want
     a light variant. Inverting via filter avoids requiring callers
     to also pass a dark-bg logo. */
  filter: brightness(0) invert(1) opacity(0.95);
}

.tux-footer__identity-text {
  grid-area: text;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.875rem;
  line-height: 1.5;
}

.tux-footer__name {
  margin: 0 0 0.125rem;
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 1rem;
  color: #fff;
  line-height: 1.3;
}

.tux-footer__tagline {
  margin: 0 0 0.5rem;
  font-family: var(--font-elegant), serif;
  font-style: italic;
  font-size: 0.8125rem;
  color: var(--brand-accent);
  line-height: 1.35;
  max-width: 22rem;
}

.tux-footer__address-line,
.tux-footer__phone {
  margin: 0;
  color: rgba(255, 255, 255, 0.92);
}

.tux-footer__phone-link {
  color: inherit;
  text-decoration: none;
  transition: color 0.15s ease;
}

.tux-footer__phone-link:hover,
.tux-footer__phone-link:focus-visible {
  color: var(--brand-accent);
  outline: none;
}

/* Social row */
.tux-footer__social {
  grid-area: social;
  list-style: none;
  margin: 0.75rem 0 0;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.tux-footer__social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  /* 2.75rem = 44px — WCAG 2.5.5 (AAA) target-size minimum, matching
     the comm-team Kadence footer's 44px icon size. */
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  color: #fff;
  background: rgba(255, 255, 255, 0.06);
  transition: background-color 0.15s ease, color 0.15s ease, transform 0.15s ease;
}

.tux-footer__social-link:hover,
.tux-footer__social-link:focus-visible {
  background: var(--brand-accent);
  color: var(--brand-primary);
  outline: none;
  transform: translateY(-1px);
}

.tux-footer__social-icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* When the social entry ships its own inline SVG (e.g. Threads), the
   icon class lands on a <span> wrapper rather than on the <svg>
   itself, so we stretch the inner SVG to fill it. The Lucide <Icon>
   path renders the <svg> directly and is unaffected. We force `fill`
   onto the descendant <path> too — SVG fill inheritance from <svg>
   to descendant shapes isn't reliable across browsers when the
   markup comes in via v-html with default presentation attrs. */
.tux-footer__social-icon > svg {
  width: 100%;
  height: 100%;
  display: block;
  fill: currentColor;
}

.tux-footer__social-icon > svg path,
.tux-footer__social-icon > svg circle,
.tux-footer__social-icon > svg rect {
  fill: currentColor;
}

/* Institutional brand lockup — official logo+wordmark artwork
   beneath the social row. Renders the white-on-transparent variant
   on the maroon ground. Capped at a print-card size so it doesn't
   compete with the identity-block name. */
.tux-footer__brand-lockup {
  grid-area: lockup;
  display: block;
  margin-top: 1rem;
  width: auto;
  height: auto;
  max-width: 16rem;
  max-height: 2.75rem;
  object-fit: contain;
  object-position: left center;
}

/* Right-side marketing columns */
.tux-footer__column {
  position: relative;
}

@container tux-footer (min-width: 48rem) {
  .tux-footer__column:first-of-type::before {
    content: "";
    position: absolute;
    left: -1.5rem;
    top: 0;
    bottom: 0;
    width: 1px;
    background: rgba(255, 255, 255, 0.18);
  }
}

.tux-footer__column-heading {
  margin: 0 0 0.875rem;
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 0.6875rem;
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.95);
}

.tux-footer__column-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.tux-footer__column-link {
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.92);
  text-decoration: underline;
  text-underline-offset: 3px;
  text-decoration-thickness: 1px;
  text-decoration-color: rgba(255, 255, 255, 0.5);
  transition: color 0.15s ease, text-decoration-color 0.15s ease;
}

.tux-footer__column-link:hover,
.tux-footer__column-link:focus-visible {
  color: var(--brand-accent);
  text-decoration-color: var(--brand-accent);
  outline: none;
}

/* ──────── BLACK LEGAL STRIP ──────── */
.tux-footer__legal {
  background: #1f1c1c;
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.75rem;
  line-height: 1.6;
}

.tux-footer__legal-inner {
  max-width: 80rem;
  margin: 0 auto;
  padding: 0.875rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  align-items: flex-start;
}

@container tux-footer (min-width: 48rem) {
  .tux-footer__legal-inner {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
    padding: 0.875rem 2rem;
  }
}

/* Plain link to TAMUS — single line, matches the comm-team Kadence
   footer rather than a stacked eyebrow + name lockup. The underline
   on hover/focus is the only affordance; the row reads as ordinary
   legal-strip prose otherwise. */
.tux-footer__tamus-link {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  flex-shrink: 0;
  transition: color 0.15s ease;
}

.tux-footer__tamus-link:hover,
.tux-footer__tamus-link:focus-visible {
  color: #fff;
  text-decoration: underline;
  text-underline-offset: 2px;
  outline: none;
}

.tux-footer__copy {
  margin: 0;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  text-align: right;
}

.tux-footer__copy-link {
  color: inherit;
  text-decoration: none;
  transition: color 0.15s ease;
}

.tux-footer__copy-link:hover,
.tux-footer__copy-link:focus-visible {
  color: #fff;
  text-decoration: underline;
  text-underline-offset: 2px;
  outline: none;
}

@container tux-footer (max-width: 48rem) {
  .tux-footer__copy {
    text-align: left;
  }
}

/* Optional preferences slot — accessibility toggles, locale switcher,
   etc. Subtle row beneath the legal strip so it doesn't compete with
   the lockup or copyright. */
.tux-footer__preferences {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: #1f1c1c;
  color: rgba(255, 255, 255, 0.55);
}

.tux-footer__preferences-inner {
  max-width: 80rem;
  margin: 0 auto;
  padding: 0.5rem 1.5rem;
  font-size: 0.6875rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.875rem;
}

@container tux-footer (min-width: 48rem) {
  .tux-footer__preferences-inner {
    padding: 0.5rem 2rem;
  }
}

.tux-footer__preferences :deep(button) {
  display: inline-flex;
  align-items: center;
  gap: 0.3125rem;
  background: transparent;
  border: 0;
  padding: 0;
  font: inherit;
  color: inherit;
  cursor: pointer;
  transition: color 0.15s ease;
}

.tux-footer__preferences :deep(button:hover),
.tux-footer__preferences :deep(button:focus-visible) {
  color: var(--brand-accent);
  outline: none;
}
</style>
