import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import ui from "@nuxt/ui/vite";

// Spike Vite config. Resolves all deps from the repo-root node_modules.
//   - vue(): compiles the .vue SFCs (normal mode; we wrap them with
//     defineCustomElement at runtime in main.ts).
//   - ui():  the official @nuxt/ui/vite plugin — gives us Nuxt UI's
//     component auto-import (UBadge, UIcon), composables, and the Tailwind
//     theme integration, OUTSIDE Nuxt. This is the crux of the spike.
//   - AutoImport(['vue']): replicates Nuxt's Vue auto-imports (computed, …)
//     that the SFCs rely on.
export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
  plugins: [
    vue(),
    // Nuxt UI's own vite plugin bundles unplugin-auto-import; configure it
    // here (instead of adding a second instance) to also auto-import Vue
    // core (computed, …) like Nuxt does.
    //
    // `ui.colors` replicates app/app.config.ts so Nuxt UI's semantic
    // aliases map onto the TTI palettes (primary → maroon). The maroon
    // shade vars (--color-maroon-50…950) come from tokens.css, imported
    // in main.css. This is the brand-parity step for Nuxt-UI-wrapped
    // components — proves it's a config port, not a blocker.
    ui({
      autoImport: { imports: ["vue"] },
      ui: {
        colors: {
          primary: "maroon",
          neutral: "stone",
          info: "teal",
          success: "emerald",
          warning: "amber",
          error: "red",
        },
      },
    }),
  ],
  server: { port: 5199 },
});
