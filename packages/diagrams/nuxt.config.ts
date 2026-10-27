import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineNuxtConfig } from "nuxt/config";

const layerDir = dirname(fileURLToPath(import.meta.url));

export default defineNuxtConfig({
  components: [
    {
      path: resolve(layerDir, "app/components"),
      global: true,
    },
  ],
  imports: {
    dirs: [
      resolve(layerDir, "app/composables"),
      resolve(layerDir, "app/utils"),
    ],
  },
});
