import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "~": fileURLToPath(new URL("../../app", import.meta.url)),
      "~~": fileURLToPath(new URL("../..", import.meta.url)),
      "@tti/tti-ux": fileURLToPath(new URL("../../app", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    globals: true,
    include: ["tests/**/*.test.ts"],
    hookTimeout: 60000,
    testTimeout: 60000,
  },
});
