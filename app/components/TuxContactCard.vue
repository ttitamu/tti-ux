<script setup lang="ts">
// TuxContactCard — faculty/staff directory card.
//
// One person, one card. Two layouts:
//   - vertical (default) — portrait above, name + role + contact below.
//                          Right for grid directory pages (TuxContactCard
//                          composed in a CSS grid by the consumer).
//   - horizontal         — portrait left, name + role + contact right.
//                          Right for inline content where directory cards
//                          appear alongside copy.
//
// Each contact item is a typed link — email, phone, web, location. Icons
// match Lucide's transportation/communication set. The component handles
// `mailto:` and `tel:` href formatting automatically.

interface ContactItem {
  type: "email" | "phone" | "web" | "location" | "office";
  value: string;
  /** Override the rendered text; defaults to `value`. */
  label?: string;
}

interface Props {
  /** Display name. Required. */
  name: string;
  /** Job title / role. */
  role?: string;
  /** Department or affiliation line under role. */
  affiliation?: string;
  /** Optional credentials line ("Ph.D.", "P.E.", etc.). Renders next to name. */
  credentials?: string;
  /** Portrait URL. If omitted, renders an initial-based gradient placeholder. */
  image?: string;
  /** Letter shown in the placeholder. Defaults to first letter of name. */
  initial?: string;
  /** Placeholder gradient tone — maroon (default), gold, navy. */
  tone?: "maroon" | "gold" | "navy";
  /** Contact rows. */
  contacts?: ContactItem[];
  /** Layout. */
  layout?: "vertical" | "horizontal";
}

const props = withDefaults(defineProps<Props>(), {
  role: undefined,
  affiliation: undefined,
  credentials: undefined,
  image: undefined,
  initial: undefined,
  tone: "maroon",
  contacts: () => [],
  layout: "vertical",
});

const initialChar = computed(() => props.initial ?? props.name.charAt(0).toUpperCase());

const contactIconMap: Record<ContactItem["type"], string> = {
  email: "lucide:mail",
  phone: "lucide:phone",
  web: "lucide:globe",
  location: "lucide:map-pin",
  office: "lucide:building",
};

function contactHref(item: ContactItem): string | undefined {
  if (item.type === "email") return `mailto:${item.value}`;
  if (item.type === "phone") return `tel:${item.value.replace(/[^\d+]/g, "")}`;
  if (item.type === "web")   return item.value;
  return undefined;
}
</script>

<template>
  <article
    class="tux-contact-card"
    :class="`tux-contact-card--${layout}`"
  >
    <div class="tux-contact-card__portrait-wrap">
      <img
        v-if="image"
        :src="image"
        :alt="`Portrait of ${name}`"
        class="tux-contact-card__portrait tux-contact-card__portrait--image"
      >
      <span
        v-else
        class="tux-contact-card__portrait"
        :class="`tux-contact-card__portrait--${tone}`"
        aria-hidden="true"
      >{{ initialChar }}</span>
    </div>

    <div class="tux-contact-card__body">
      <header class="tux-contact-card__header">
        <h3 class="tux-contact-card__name">
          {{ name }}<span
            v-if="credentials"
            class="tux-contact-card__credentials"
          >, {{ credentials }}</span>
        </h3>
        <p v-if="role" class="tux-contact-card__role">{{ role }}</p>
        <p v-if="affiliation" class="tux-contact-card__affiliation">{{ affiliation }}</p>
      </header>

      <ul v-if="contacts.length > 0" class="tux-contact-card__contacts">
        <li
          v-for="(item, idx) in contacts"
          :key="idx"
          class="tux-contact-card__contact"
        >
          <Icon
            :name="contactIconMap[item.type]"
            class="tux-contact-card__contact-icon"
            aria-hidden="true"
          />
          <a
            v-if="contactHref(item)"
            :href="contactHref(item)"
            class="tux-contact-card__contact-link"
          >{{ item.label ?? item.value }}</a>
          <span v-else class="tux-contact-card__contact-text">{{ item.label ?? item.value }}</span>
        </li>
      </ul>
    </div>
  </article>
</template>

<style scoped>
.tux-contact-card {
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  display: flex;
  font-family: var(--font-body);
}

/* Vertical layout — portrait above body */
.tux-contact-card--vertical {
  flex-direction: column;
}

.tux-contact-card--vertical .tux-contact-card__portrait-wrap {
  aspect-ratio: 4/3;
  width: 100%;
  background: var(--surface-sunken);
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 2px solid var(--brand-primary);
}

.tux-contact-card--vertical .tux-contact-card__body {
  padding: 1.125rem 1.25rem 1.25rem;
}

/* Horizontal layout — portrait left, body right */
.tux-contact-card--horizontal {
  flex-direction: row;
  align-items: stretch;
}

.tux-contact-card--horizontal .tux-contact-card__portrait-wrap {
  width: 7.5rem;
  flex-shrink: 0;
  background: var(--surface-sunken);
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 2px solid var(--brand-primary);
}

.tux-contact-card--horizontal .tux-contact-card__body {
  padding: 1.125rem 1.375rem 1.125rem 1.375rem;
  flex: 1;
  min-width: 0;
}

/* Portrait */
.tux-contact-card__portrait {
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-size: 2rem;
  color: #fff;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
}

.tux-contact-card--vertical .tux-contact-card__portrait {
  width: 6.25rem;
  height: 6.25rem;
  font-size: 2.5rem;
}

.tux-contact-card__portrait--maroon {
  background: linear-gradient(135deg, var(--brand-primary), var(--brand-primary-deep));
}
.tux-contact-card__portrait--gold {
  background: linear-gradient(135deg, var(--brand-accent), #A87B1F);
  color: #2A0E15;
}
.tux-contact-card__portrait--navy {
  background: linear-gradient(135deg, #2E4A6B, #1A2E45);
}

.tux-contact-card__portrait::after {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.18) 0%, transparent 50%);
  pointer-events: none;
}

.tux-contact-card__portrait--image {
  width: 100%;
  height: 100%;
  border-radius: 0;
  object-fit: cover;
}

.tux-contact-card--horizontal .tux-contact-card__portrait--image {
  width: 100%;
  height: 100%;
}

/* Header */
.tux-contact-card__header {
  margin-bottom: 0.875rem;
}

.tux-contact-card__name {
  margin: 0;
  font-family: var(--font-bold);
  font-weight: 700;
  font-size: 1.0625rem;
  line-height: 1.3;
  color: var(--text-primary);
}

.tux-contact-card__credentials {
  font-weight: 500;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.tux-contact-card__role {
  margin: 0.1875rem 0 0;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  line-height: 1.4;
}

.tux-contact-card__affiliation {
  margin: 0.0625rem 0 0;
  font-size: 0.8125rem;
  color: var(--text-muted);
  line-height: 1.4;
}

/* Contacts */
.tux-contact-card__contacts {
  list-style: none;
  margin: 0;
  padding: 0.875rem 0 0;
  border-top: 1px solid var(--surface-border);
  display: flex;
  flex-direction: column;
  gap: 0.4375rem;
}

.tux-contact-card__contact {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  font-size: 0.8125rem;
  line-height: 1.4;
  min-width: 0;
}

.tux-contact-card__contact-icon {
  width: 0.8125rem;
  height: 0.8125rem;
  color: var(--brand-primary);
  flex-shrink: 0;
  position: relative;
  top: 1px;
}

.tux-contact-card__contact-link {
  color: var(--brand-secondary);
  text-decoration: none;
  word-break: break-word;
  transition: color 0.15s ease, text-decoration-color 0.15s ease;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 2px;
  text-decoration-color: color-mix(in srgb, var(--brand-secondary) 30%, transparent);
}

.tux-contact-card__contact-link:hover,
.tux-contact-card__contact-link:focus-visible {
  color: var(--brand-primary);
  text-decoration-color: currentColor;
  outline: none;
}

.tux-contact-card__contact-text {
  color: var(--text-secondary);
  word-break: break-word;
}
</style>
