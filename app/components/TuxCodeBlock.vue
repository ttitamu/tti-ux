<script setup lang="ts">
import type { BundledLanguage } from "shiki";
import TuxCodeBlockImpl from "../../packages/code/app/components/TuxCodeBlock.vue";

interface Props {
  /** Source code as a string. Required. */
  code: string;
  /** Shiki language id — `ts`, `python`, `bash`, `json`, `vue`, etc.
   *  Falls back to `text` (no highlighting) for unknown langs. */
  lang?: BundledLanguage | "text";
  /** Optional caption — typically a filename like
   *  `app/components/TuxButton.vue` or `landscape/agent.py:42`. */
  filename?: string;
  /** Show 1-indexed line numbers in the gutter. */
  lineNumbers?: boolean;
  /** Hide the copy button. */
  noCopy?: boolean;
  /** Hide the download button. */
  noDownload?: boolean;
  /** Override the suggested filename for downloads. Falls back to
   *  `filename` (basename) or `code.{ext}` derived from `lang`. */
  downloadName?: string;
}

const props = withDefaults(defineProps<Props>(), {
  lang: "text",
  filename: undefined,
  lineNumbers: false,
  noCopy: false,
  noDownload: false,
  downloadName: undefined,
});
</script>

<template>
  <TuxCodeBlockImpl v-bind="props" />
</template>
