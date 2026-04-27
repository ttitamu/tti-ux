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
// **The black legal strip is mandatory and non-configurable.** Per
// CLAUDE.md and AggieUX policy, the TAMUS lockup, the
// "Coordinated Statewide Transportation Research Program" tagline
// (TTI-specific), and the state-agency link list ship verbatim on
// every TTI surface. Don't add knobs for those — propose changes
// upstream first.
//
// The maroon marketing section IS configurable: pass `social` and
// `columns` to populate it. Pass nothing and you get just the
// identity block, which is the right shape for an app dashboard.

interface SocialLink {
  /** Lucide icon name, e.g. "lucide:linkedin", "lucide:facebook". */
  icon: string;
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
  /** Social-platform links. Renders as an icon row beneath the address. */
  social?: SocialLink[];
  /** Right-side resource/policy columns. Two is canonical; three+
   *  works on wide containers. Pass empty to suppress. */
  columns?: Column[];
  /** Year for the © line. Defaults to current year. */
  year?: number;
}

withDefaults(defineProps<Props>(), {
  name: "Texas A&M Transportation Institute",
  address: "3135 TAMU\nCollege Station, TX 77843-3135",
  phone: "(979) 317-2000",
  logo: "/logo.svg",
  logoSize: 80,
  social: () => [],
  columns: () => [],
  year: () => new Date().getFullYear(),
});

// State-agency link list. **Mandatory order, mandatory labels** per
// AggieUX rules. Don't rename or remove without coordinating with
// TAMUS compliance.
const stateLinks = [
  { label: "State Link Policy",                 href: "https://statelinkpolicy.texas.gov/" },
  { label: "Texas Veterans Portal",             href: "https://veterans.portal.texas.gov/" },
  { label: "Open Records / Public Information", href: "https://www.tamus.edu/open-records/" },
  { label: "Risk, Fraud & Misconduct Hotline",  href: "https://www.tamus.edu/business/risk-management/" },
  { label: "Statewide Search",                  href: "https://www.tsl.texas.gov/trail/" },
  { label: "Site Links & Policies",             href: "https://www.tamus.edu/site-policies/" },
];

function isInternal(href: string | undefined, to: string | undefined) {
  if (to) return true;
  if (!href) return false;
  return href.startsWith("/") || href.startsWith("#");
}

function linkAttrs(item: ColumnLink) {
  if (item.to) return { component: "NuxtLink" as const, to: item.to };
  if (item.href) {
    if (isInternal(item.href, undefined)) {
      return { component: "NuxtLink" as const, to: item.href };
    }
    return { component: "a" as const, href: item.href, target: "_blank", rel: "noopener" };
  }
  return { component: "span" as const };
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
                <Icon
                  :name="s.icon"
                  class="tux-footer__social-icon"
                  aria-hidden="true"
                />
              </a>
            </li>
          </ul>
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
              <component
                v-bind="linkAttrs(link)"
                :is="linkAttrs(link).component"
                class="tux-footer__column-link"
              >{{ link.label }}</component>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- ────────── BLACK LEGAL STRIP (MANDATORY) ────────── -->
    <div class="tux-footer__legal">
      <div class="tux-footer__legal-inner">
        <!-- TAMUS lockup -->
        <a
          href="https://www.tamus.edu/"
          target="_blank"
          rel="noopener"
          class="tux-footer__lockup"
          aria-label="The Texas A&M University System"
        >
          <span class="tux-footer__lockup-glyph" aria-hidden="true">A</span>
          <span class="tux-footer__lockup-text">
            <span class="tux-footer__lockup-eyebrow">A Member of</span>
            <span class="tux-footer__lockup-name">The Texas A&amp;M University System</span>
          </span>
        </a>

        <!-- Tagline + © + state links + optional preferences -->
        <div class="tux-footer__legal-content">
          <p class="tux-footer__tagline">
            Coordinated Statewide Transportation Research Program
          </p>
          <p class="tux-footer__copy">
            © {{ year }} {{ name }} · {{ address.split("\n").join(" · ") }}
          </p>
          <ul class="tux-footer__legal-links">
            <li v-for="l in stateLinks" :key="l.label">
              <a
                :href="l.href"
                target="_blank"
                rel="noopener"
                class="tux-footer__legal-link"
              >{{ l.label }}</a>
            </li>
          </ul>

          <div v-if="$slots.preferences" class="tux-footer__preferences">
            <slot name="preferences" />
          </div>
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
  background: var(--brand-primary);
  color: rgba(255, 255, 255, 0.85);
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
    "social social";
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
  margin: 0 0 0.5rem;
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 1rem;
  color: #fff;
  line-height: 1.3;
}

.tux-footer__address-line,
.tux-footer__phone {
  margin: 0;
  color: rgba(255, 255, 255, 0.85);
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
  width: 2.5rem;
  height: 2.5rem;
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
  width: 1.125rem;
  height: 1.125rem;
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
  color: rgba(255, 255, 255, 0.85);
  text-decoration: underline;
  text-underline-offset: 3px;
  text-decoration-thickness: 1px;
  text-decoration-color: rgba(255, 255, 255, 0.4);
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
  padding: 1.25rem 1.5rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  align-items: flex-start;
}

@container tux-footer (min-width: 48rem) {
  .tux-footer__legal-inner {
    grid-template-columns: auto 1fr;
    gap: 2rem;
    padding: 1.5rem 2rem;
  }
}

.tux-footer__lockup {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: inherit;
  flex-shrink: 0;
}

.tux-footer__lockup:hover .tux-footer__lockup-name,
.tux-footer__lockup:focus-visible .tux-footer__lockup-name {
  text-decoration: underline;
  text-underline-offset: 2px;
  outline: none;
}

.tux-footer__lockup-glyph {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(221, 172, 55, 0.3);
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 500;
  color: var(--brand-accent);
  flex-shrink: 0;
}

.tux-footer__lockup-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.tux-footer__lockup-eyebrow {
  font-size: 0.625rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
}

.tux-footer__lockup-name {
  font-family: var(--font-bold);
  font-weight: 600;
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.9);
}

.tux-footer__legal-content {
  min-width: 0;
}

.tux-footer__tagline {
  margin: 0 0 0.25rem;
  color: rgba(255, 255, 255, 0.55);
}

.tux-footer__copy {
  margin: 0 0 0.5rem;
}

.tux-footer__legal-links {
  list-style: none;
  margin: 0.375rem 0 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.875rem;
}

.tux-footer__legal-link {
  color: var(--brand-accent);
  text-decoration: none;
  border-bottom: 1px solid var(--brand-accent);
  padding-bottom: 1px;
  transition: opacity 0.15s ease;
}

.tux-footer__legal-link:hover,
.tux-footer__legal-link:focus-visible {
  opacity: 0.8;
  outline: none;
}

/* Optional preferences slot — accessibility toggles, locale switcher,
   etc. Subtle, below the legal links so it doesn't compete with the
   compliance copy. */
.tux-footer__preferences {
  margin-top: 0.75rem;
  padding-top: 0.625rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 0.6875rem;
  color: rgba(255, 255, 255, 0.55);
  display: flex;
  flex-wrap: wrap;
  gap: 0.875rem;
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
