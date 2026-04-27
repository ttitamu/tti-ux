<script setup lang="ts">
// TuxMarketingFooter — institutional marketing footer.
//
// Distinct from TuxFooter (slim app-chrome footer for PECAN /
// tti-ai-studio dashboards). This is the richer maroon-background
// footer modeled on tti.tamu.edu and tamu.edu — used on public-facing
// sites: the tti-ux style guide, marcom landing pages, the docs site.
//
// Layout (>= 64rem container width):
//
//   ┌──────────────────────────────────────────────────────────────┐
//   │  [logo]   [name + address + phone]    [col]    [col]    │
//   │  [socials row]                                              │
//   └──────────────────────────────────────────────────────────────┘
//
// Pair this with `<TuxSubfooter>` directly below for the mandatory
// TAMUS member-of strip. The marketing footer carries the marketing-
// shape link inventory; the subfooter carries the legal compliance
// strip. Both ship together on every public TTI surface.

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
  /** Institution name. Defaults to TTI. */
  name?: string;
  /** Multi-line address. Splits on newlines. */
  address?: string;
  /** Phone number, displayed as a tel: link. */
  phone?: string | null;
  /** Logo path; defaults to the system /logo.svg (light variant). */
  logo?: string;
  /** Logo width in px. */
  logoSize?: number;
  /** Social-platform links. Renders as an icon row beneath the logo. */
  social?: SocialLink[];
  /** Columns of resource/policy links on the right. Two columns is the
   *  canonical shape; three works on wide containers. */
  columns?: Column[];
}

withDefaults(defineProps<Props>(), {
  name: "Texas A&M Transportation Institute",
  address: "3135 TAMU\nCollege Station, TX 77843-3135",
  phone: "(979) 317-2000",
  logo: "/logo.svg",
  logoSize: 80,
  social: () => [],
  columns: () => [],
});

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
  <footer class="tux-marketing-footer">
    <div class="tux-marketing-footer__inner">
      <!-- Identity column: logo + name + address + phone + socials -->
      <div class="tux-marketing-footer__identity">
        <img
          :src="logo"
          alt=""
          aria-hidden="true"
          :width="logoSize"
          :height="logoSize"
          class="tux-marketing-footer__logo"
        >

        <div class="tux-marketing-footer__identity-text">
          <p class="tux-marketing-footer__name">{{ name }}</p>
          <p
            v-for="line in address.split('\n')"
            :key="line"
            class="tux-marketing-footer__address-line"
          >{{ line }}</p>
          <p v-if="phone" class="tux-marketing-footer__phone">
            <a :href="`tel:${phone.replace(/\D/g, '')}`" class="tux-marketing-footer__phone-link">{{ phone }}</a>
          </p>
        </div>

        <ul v-if="social.length > 0" class="tux-marketing-footer__social">
          <li v-for="s in social" :key="s.label">
            <a
              :href="s.href"
              target="_blank"
              rel="noopener"
              :aria-label="s.label"
              class="tux-marketing-footer__social-link"
            >
              <Icon :name="s.icon" class="tux-marketing-footer__social-icon" aria-hidden="true" />
            </a>
          </li>
        </ul>
      </div>

      <!-- Right-side columns of links -->
      <div
        v-for="col in columns"
        :key="col.heading"
        class="tux-marketing-footer__column"
      >
        <p class="tux-marketing-footer__column-heading">{{ col.heading }}</p>
        <ul class="tux-marketing-footer__column-list">
          <li v-for="link in col.links" :key="link.label">
            <component
              v-bind="linkAttrs(link)"
              :is="linkAttrs(link).component"
              class="tux-marketing-footer__column-link"
            >{{ link.label }}</component>
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.tux-marketing-footer {
  container-type: inline-size;
  container-name: tux-marketing-footer;

  /* Maroon ground — same brand-primary token used elsewhere, so a
     theme repaint cascades cleanly. The dark text in the rest of
     the page becomes light-on-maroon here; we set explicit white
     tones rather than rely on a token flip. */
  background: var(--brand-primary);
  color: rgba(255, 255, 255, 0.85);
  font-family: var(--font-body);
}

.tux-marketing-footer__inner {
  max-width: 80rem;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
}

@container tux-marketing-footer (min-width: 48rem) {
  .tux-marketing-footer__inner {
    grid-template-columns: minmax(20rem, 1.4fr) repeat(auto-fit, minmax(11rem, 1fr));
    gap: 3rem;
    padding: 3rem 2rem;
  }
}

/* Identity block */
.tux-marketing-footer__identity {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-areas:
    "logo text"
    "social social";
  gap: 1rem 1.25rem;
  align-items: start;
}

.tux-marketing-footer__logo {
  grid-area: logo;
  flex-shrink: 0;
  /* The /logo.svg ships in maroon-on-white; on a maroon ground we
     need the light variant. The system already has logo-dark.svg
     for dark surfaces — use it here. Inline so consumers without
     the dark variant can still pass a custom logo prop. */
  filter: brightness(0) invert(1) opacity(0.95);
}

.tux-marketing-footer__identity-text {
  grid-area: text;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.875rem;
  line-height: 1.5;
}

.tux-marketing-footer__name {
  margin: 0 0 0.5rem;
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 1rem;
  color: #fff;
  line-height: 1.3;
}

.tux-marketing-footer__address-line,
.tux-marketing-footer__phone {
  margin: 0;
  color: rgba(255, 255, 255, 0.85);
}

.tux-marketing-footer__phone-link {
  color: inherit;
  text-decoration: none;
  transition: color 0.15s ease;
}

.tux-marketing-footer__phone-link:hover,
.tux-marketing-footer__phone-link:focus-visible {
  color: var(--brand-accent);
  outline: none;
}

/* Social row */
.tux-marketing-footer__social {
  grid-area: social;
  list-style: none;
  margin: 0.75rem 0 0;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.tux-marketing-footer__social-link {
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

.tux-marketing-footer__social-link:hover,
.tux-marketing-footer__social-link:focus-visible {
  background: var(--brand-accent);
  color: var(--brand-primary);
  outline: none;
  transform: translateY(-1px);
}

.tux-marketing-footer__social-icon {
  width: 1.125rem;
  height: 1.125rem;
}

/* Right-side columns */
.tux-marketing-footer__column {
  /* Vertical hairline divider between identity + columns on wide
     screens, matching the tti.tamu.edu footer rhythm. Only the
     first sibling column gets the leading divider so we don't
     double-stripe between pure column siblings. */
  position: relative;
}

@container tux-marketing-footer (min-width: 48rem) {
  .tux-marketing-footer__column:first-of-type::before {
    content: "";
    position: absolute;
    left: -1.5rem;
    top: 0;
    bottom: 0;
    width: 1px;
    background: rgba(255, 255, 255, 0.18);
  }
}

.tux-marketing-footer__column-heading {
  margin: 0 0 0.875rem;
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 0.6875rem;
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.95);
}

.tux-marketing-footer__column-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.tux-marketing-footer__column-link {
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.85);
  text-decoration: underline;
  text-underline-offset: 3px;
  text-decoration-thickness: 1px;
  text-decoration-color: rgba(255, 255, 255, 0.4);
  transition: color 0.15s ease, text-decoration-color 0.15s ease;
}

.tux-marketing-footer__column-link:hover,
.tux-marketing-footer__column-link:focus-visible {
  color: var(--brand-accent);
  text-decoration-color: var(--brand-accent);
  outline: none;
}
</style>
