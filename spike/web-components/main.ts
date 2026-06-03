// Spike entry: compile two REAL tux components (unmodified source) into
// light-DOM custom elements and register them. Tests ADR-0012's core
// unknown — does a Nuxt-UI-wrapped component survive the custom-element
// boundary outside Nuxt?
import "./main.css";
import { defineCustomElement } from "vue";
import uiPlugin from "@nuxt/ui/vue-plugin";

// Pull the canonical component source directly — no copies, no edits.
import TuxBigStat from "../../app/components/TuxBigStat.vue";
import TuxBadge from "../../app/components/TuxBadge.vue";

// shadowRoot: false => light DOM, so the global stylesheet (Tailwind +
// tokens + tux.css) applies exactly as in the Nuxt app. This is the
// visual-parity mechanism from the migration thesis.

// TEST A — baseline: tux-native (no Nuxt UI), scoped styles + token vars.
customElements.define(
  "tux-big-stat",
  defineCustomElement(TuxBigStat, { shadowRoot: false }),
);

// TEST B — the real risk: wraps Nuxt UI's UBadge + UIcon. Install the
// Nuxt UI Vue plugin into the element's internal app via configureApp
// (Vue 3.5 feature).
customElements.define(
  "tux-badge",
  defineCustomElement(TuxBadge, {
    shadowRoot: false,
    configureApp(app) {
      app.use(uiPlugin);
    },
  }),
);

// Surface any registration-time errors on the page for the spike report.
window.addEventListener("error", (e) => {
  const el = document.getElementById("errors");
  if (el) el.textContent += `\n[error] ${e.message}`;
});
