import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "~": fileURLToPath(new URL("../../app", import.meta.url)),
      // the root layer's app/, as nuxt.config.ts defines it (3.4.1's imports from a sub-layer)
      "#tux": fileURLToPath(new URL("../../app", import.meta.url)),
      "@tti/tti-ux": fileURLToPath(new URL("../../app", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    globals: true,
    include: ["tests/**/*.test.ts"],
  },
});
