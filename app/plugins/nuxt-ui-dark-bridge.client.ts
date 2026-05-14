/**
 * Bridge @nuxtjs/color-mode preferences to Nuxt UI's `.dark` class.
 *
 * Nuxt UI's runtime (see node_modules/@nuxt/ui/dist/runtime/plugins/colors.js)
 * gates its dark mode on `&:where(.dark, .dark *)`. Concretely, this CSS
 * injected at runtime decides what `--ui-primary` resolves to:
 *
 *     :root, :host, .light { --ui-primary: var(--ui-color-primary-500); }
 *     .dark                { --ui-primary: var(--ui-color-primary-400); }
 *
 * Our theme system uses `@nuxtjs/color-mode` configured with
 * `classSuffix: ""` and `dataValue: "theme"`, so toggling to dark sets
 * `<html class="tti-dark" data-theme="tti-dark">` — but never `.dark`.
 * Without this bridge, every Nuxt UI primitive (UButton, UInput,
 * UBadge, USelect, etc.) renders in light mode regardless of theme:
 * primary stays at shade 500, neutral stays light, etc.
 *
 * This plugin watches `colorMode.value` and toggles `.dark` on <html>
 * when we're in `tti-dark`. The `tti-hc` theme is light-surfaced (pure
 * black text on pure white per ADR-0005), so Nuxt UI's light path is
 * correct for it and we leave `.dark` off in HC.
 *
 * Brief FOUC trade-off: the color-mode boot script (`script.min.js`,
 * inlined into the document head) sets `[data-theme]` and the theme
 * class *before* Vue hydrates, but this Vue plugin only runs on
 * hydration. So on a fresh load while in `tti-dark`, Nuxt UI
 * primitives flash light-mode briefly before this plugin adds `.dark`.
 * If/when that becomes visible (it shouldn't be — the surrounding page
 * is dark from tokens.css regardless), the harder fix is patching the
 * boot script to add both classes at once.
 */
export default defineNuxtPlugin(() => {
  const colorMode = useColorMode();

  watchEffect(() => {
    const root = document.documentElement;
    if (colorMode.value === "tti-dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  });
});
