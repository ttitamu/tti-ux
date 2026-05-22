<script setup lang="ts">
/**
 * TuxCitationExport — academic citation export menu.
 *
 * Surfaces a "Cite" button that opens a dropdown menu listing
 * common citation formats — BibTeX / RIS / APA / Chicago / MLA /
 * IEEE — with one-click copy-to-clipboard.
 *
 * Consumer passes the source citation data; this component
 * formats it for each style. Common citation fields supported:
 * authors / title / venue / year / volume / pages / doi.
 *
 * Pairs with `TuxPaperMeta`. Place near the top of a paper page
 * (in the same row as the DOI / license / funder strip), or
 * in a sticky-actions sidebar.
 */
import { computed, ref } from "vue";

export interface TuxCitationData {
  /** Author list — "Last, F.M." or "F.M. Last" forms work. */
  authors: string[];
  title: string;
  venue?: string;
  year: number;
  volume?: string | number;
  issue?: string | number;
  pages?: string;
  doi?: string;
  publisher?: string;
}

interface Props {
  citation: TuxCitationData;
  /** Trigger button label. Default "Cite". */
  label?: string;
  /** Trigger button variant. */
  variant?: "ghost" | "outline" | "solid";
}

const props = withDefaults(defineProps<Props>(), {
  label: "Cite",
  variant: "outline",
});

// ----- Format helpers ----------------------------------------------
function formatAuthorsAPA(authors: string[]): string {
  // APA: "Last, F. M., & Last, F. M." (last author preceded by &)
  if (authors.length === 0) return "";
  if (authors.length === 1) return authors[0]!;
  if (authors.length === 2) return `${authors[0]}, & ${authors[1]}`;
  return `${authors.slice(0, -1).join(", ")}, & ${authors[authors.length - 1]}`;
}

function formatAuthorsChicago(authors: string[]): string {
  // Chicago: first author "Last, First M." others "First M. Last"
  if (authors.length === 0) return "";
  if (authors.length === 1) return authors[0]!;
  return `${authors[0]}, ${authors.slice(1).join(", and ")}`;
}

function formatAuthorsIEEE(authors: string[]): string {
  // IEEE: "F. Last, F. Last, and F. Last"
  if (authors.length === 0) return "";
  if (authors.length === 1) return authors[0]!;
  if (authors.length === 2) return authors.join(" and ");
  return `${authors.slice(0, -1).join(", ")}, and ${authors[authors.length - 1]}`;
}

function bibtexId(c: TuxCitationData): string {
  const lastName = (c.authors[0] || "anon").split(",")[0]!.trim().toLowerCase().replace(/[^a-z]/g, "");
  return `${lastName}${c.year}`;
}

// ----- Per-format renderers ----------------------------------------
const formats = computed(() => {
  const c = props.citation;
  const doi = c.doi ? `https://doi.org/${c.doi}` : "";

  return [
    {
      key: "apa",
      label: "APA 7",
      text: [
        formatAuthorsAPA(c.authors),
        `(${c.year}).`,
        `${c.title}.`,
        c.venue ? `*${c.venue}*` : "",
        c.volume ? `${c.volume}${c.issue ? `(${c.issue})` : ""},` : "",
        c.pages ? `${c.pages}.` : "",
        doi,
      ].filter(Boolean).join(" "),
    },
    {
      key: "chicago",
      label: "Chicago",
      text: [
        formatAuthorsChicago(c.authors),
        `"${c.title}."`,
        c.venue ? `*${c.venue}*` : "",
        c.volume ? `${c.volume}, no. ${c.issue ?? "?"}` : "",
        `(${c.year}):`,
        c.pages ? `${c.pages}.` : "",
        doi,
      ].filter(Boolean).join(" "),
    },
    {
      key: "mla",
      label: "MLA 9",
      text: [
        `${c.authors[0] ?? ""}${c.authors.length > 1 ? ", et al" : ""}.`,
        `"${c.title}."`,
        c.venue ? `*${c.venue}*,` : "",
        c.volume ? `vol. ${c.volume},` : "",
        c.issue ? `no. ${c.issue},` : "",
        `${c.year},`,
        c.pages ? `pp. ${c.pages}.` : "",
        doi,
      ].filter(Boolean).join(" "),
    },
    {
      key: "ieee",
      label: "IEEE",
      text: [
        `${formatAuthorsIEEE(c.authors)},`,
        `"${c.title},"`,
        c.venue ? `*${c.venue}*,` : "",
        c.volume ? `vol. ${c.volume},` : "",
        c.issue ? `no. ${c.issue},` : "",
        c.pages ? `pp. ${c.pages},` : "",
        `${c.year}.`,
        doi,
      ].filter(Boolean).join(" "),
    },
    {
      key: "bibtex",
      label: "BibTeX",
      text: [
        `@article{${bibtexId(c)},`,
        `  author = {${c.authors.join(" and ")}},`,
        `  title = {${c.title}},`,
        c.venue ? `  journal = {${c.venue}},` : "",
        `  year = {${c.year}},`,
        c.volume ? `  volume = {${c.volume}},` : "",
        c.issue ? `  number = {${c.issue}},` : "",
        c.pages ? `  pages = {${c.pages}},` : "",
        c.doi ? `  doi = {${c.doi}},` : "",
        `}`,
      ].filter(Boolean).join("\n"),
    },
    {
      key: "ris",
      label: "RIS",
      text: [
        "TY  - JOUR",
        ...c.authors.map((a) => `AU  - ${a}`),
        `TI  - ${c.title}`,
        c.venue ? `T2  - ${c.venue}` : "",
        `PY  - ${c.year}`,
        c.volume ? `VL  - ${c.volume}` : "",
        c.issue ? `IS  - ${c.issue}` : "",
        c.pages ? `SP  - ${c.pages}` : "",
        c.doi ? `DO  - ${c.doi}` : "",
        "ER  - ",
      ].filter(Boolean).join("\n"),
    },
  ];
});

const copied = ref<string | null>(null);

async function copyToClipboard(key: string, text: string) {
  if (typeof navigator === "undefined" || !navigator.clipboard) return;
  try {
    await navigator.clipboard.writeText(text);
    copied.value = key;
    setTimeout(() => {
      if (copied.value === key) copied.value = null;
    }, 1800);
  } catch {
    // Clipboard write failed — silent.
  }
}
</script>

<template>
  <UDropdownMenu
    :items="[
      formats.map((f) => ({
        label: copied === f.key ? '✓ Copied — ' + f.label : f.label,
        icon: copied === f.key ? 'lucide:check' : 'lucide:copy',
        onSelect: () => copyToClipboard(f.key, f.text),
      })),
    ]"
    :popper="{ placement: 'bottom-end' }"
  >
    <UButton :variant="variant" icon="lucide:quote">
      {{ label }}
    </UButton>
  </UDropdownMenu>
</template>
