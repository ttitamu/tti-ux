<script setup lang="ts">
import tuxCopyTokenSource from "~/components/TuxCopyToken.vue?raw";

useHead({ title: "TuxCopyToken · TUX" });

const lastCopied = ref("");

function onTokenCopy(val: string) {
  lastCopied.value = val;
}

const copyTokenControls = [
  {
    prop: "label",
    label: "Prefix Label",
    type: "text" as const,
    defaultValue: "URI",
    description: "Optional structured prefix tag (e.g. URI, UUID, SHA-256, DOI)",
  },
  {
    prop: "value",
    label: "Identifier Value",
    type: "text" as const,
    defaultValue: "urn:tti:corridor:ih35:station-0482-northbound",
    description: "Full raw identifier copied to the clipboard on click",
  },
  {
    prop: "maxLength",
    label: "Max Visual Length",
    type: "select" as const,
    options: [
      { label: "Full length (0 / disabled)", value: 0 },
      { label: "Compact (18 chars)", value: 18 },
      { label: "Standard (26 chars)", value: 26 },
      { label: "Wide (34 chars)", value: 34 },
    ],
    defaultValue: 26,
    description: "Middle-truncates visually as head…tail while copying full raw value",
  },
  {
    prop: "verified",
    label: "Verified Badge",
    type: "boolean" as const,
    defaultValue: true,
    description: "Display high-contrast verification indicator",
  },
  {
    prop: "copyLabel",
    label: "Copy ARIA Label",
    type: "text" as const,
    defaultValue: "Copy dataset URI",
    description: "Accessible name for the 44x44px copy action button",
  },
];

const copyTokenPresets = [
  {
    name: "dataset-uri",
    label: "Corridor Dataset URI",
    description: "Truncated dataset URN with verified provenance badge",
    icon: "lucide:database",
    values: {
      label: "URI",
      value: "urn:tti:corridor:ih35:station-0482-northbound",
      maxLength: 26,
      verified: true,
      copyLabel: "Copy dataset URI",
    },
  },
  {
    name: "sensor-uuid",
    label: "Roadside LiDAR UUID",
    description: "Middle-truncated v4 UUID for connected-corridor field hardware",
    icon: "lucide:radio",
    values: {
      label: "UUID",
      value: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      maxLength: 20,
      verified: true,
      copyLabel: "Copy sensor UUID",
    },
  },
  {
    name: "archive-digest",
    label: "SHA-256 Telemetry Digest",
    description: "Cryptographic checksum for immutable Parquet archive verification",
    icon: "lucide:shield-check",
    values: {
      label: "SHA-256",
      value: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      maxLength: 22,
      verified: true,
      copyLabel: "Copy SHA-256 digest",
    },
  },
  {
    name: "station-ref",
    label: "Short Station Reference",
    description: "Untruncated weigh-in-motion station code",
    icon: "lucide:hash",
    values: {
      label: "REF",
      value: "WIM-TX-IH10-0194",
      maxLength: 0,
      verified: false,
      copyLabel: "Copy station reference",
    },
  },
];

const catalogVue = `<div class="flex flex-wrap gap-3">
  <tux-copy-token
    label="URI"
    value="urn:tti:corridor:ih35:station-0482-northbound"
    :max-length="26"
    verified
    copy-label="Copy corridor dataset URI"
  />
  <tux-copy-token
    label="UUID"
    value="f47ac10b-58cc-4372-a567-0e02b2c3d479"
    :max-length="20"
    copy-label="Copy roadside sensor UUID"
  />
  <tux-copy-token
    label="DOI"
    value="10.5555/tti.mobility.2026.084"
    verified
    copy-label="Copy publication DOI"
  />
</div>`;

const truncationVue = `<div class="space-y-3">
  <tux-copy-token
    label="SHA-256"
    value="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    :max-length="20"
    verified
    copy-label="Copy telemetry archive checksum"
  />
  <tux-copy-token
    value="sensor://rellis-proving-ground/intersection-04/radar-west-lane-2"
    :max-length="30"
    copy-label="Copy sensor stream endpoint"
  />
</div>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component · telemetry & metadata" title="TuxCopyToken">
      Monospace structured identifier chip with optional
      <code>head…tail</code> middle-ellipsis truncation, provenance
      verification badge, and 1-click clipboard copy. Use for dataset
      URIs, roadside sensor UUIDs, SHA-256 archive digests, DOIs, and
      station reference codes where operators compare both prefix and
      suffix characters at a glance while copying the full raw token.
    </TuxPageHeader>

    <section>
      <TuxPlayground
        tag="tux-copy-token"
        component-name="TuxCopyToken"
        title="Copy Token & Provenance Chip Workbench"
        eyebrow="Interactive Component Lab"
        :controls="copyTokenControls"
        :presets="copyTokenPresets"
        :source="tuxCopyTokenSource"
        :code-template="(values) => {
          const labelAttr = values.label ? `\n  label=\x22${values.label}\x22` : '';
          const maxAttr = values.maxLength > 0 ? `\n  :max-length=\x22${values.maxLength}\x22` : '';
          const verAttr = values.verified ? '\n  verified' : '';
          const copyAttr = values.copyLabel && values.copyLabel !== 'Copy identifier'
            ? `\n  copy-label=\x22${values.copyLabel}\x22`
            : '';
          return `<tux-copy-token${labelAttr}\n  value=\x22${values.value}\x22${maxAttr}${verAttr}${copyAttr}\n/>`;
        }"
      >
        <template #default="{ values }">
          <div class="flex flex-col items-center gap-3 py-4">
            <TuxCopyToken
              :label="values.label || undefined"
              :value="values.value"
              :max-length="values.maxLength > 0 ? Number(values.maxLength) : undefined"
              :verified="values.verified"
              :copy-label="values.copyLabel || 'Copy identifier'"
              @copy="onTokenCopy"
            />
            <p v-if="lastCopied" class="text-xs font-mono text-text-muted">
              Last emitted payload: <code>{{ lastCopied }}</code>
            </p>
          </div>
        </template>
      </TuxPlayground>
    </section>

    <section>
      <p class="eyebrow">structured identifiers</p>
      <h2 class="heading--bold text-xl font-bold">Dataset URIs, Sensor UUIDs &amp; DOIs</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Pair a concise uppercase <code>label</code> prefix with the
        monospace token so operators immediately distinguish a dataset
        URN from a hardware UUID or publication DOI inside dense metadata
        headers and inspection drawers.
      </p>
      <TuxExample class="mt-4" :vue="catalogVue" :source="tuxCopyTokenSource">
        <div class="flex flex-wrap gap-3">
          <TuxCopyToken
            label="URI"
            value="urn:tti:corridor:ih35:station-0482-northbound"
            :max-length="26"
            verified
            copy-label="Copy corridor dataset URI"
            @copy="onTokenCopy"
          />
          <TuxCopyToken
            label="UUID"
            value="f47ac10b-58cc-4372-a567-0e02b2c3d479"
            :max-length="20"
            copy-label="Copy roadside sensor UUID"
            @copy="onTokenCopy"
          />
          <TuxCopyToken
            label="DOI"
            value="10.5555/tti.mobility.2026.084"
            verified
            copy-label="Copy publication DOI"
            @copy="onTokenCopy"
          />
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">middle-ellipsis truncation</p>
      <h2 class="heading--bold text-xl font-bold">Preserving head &amp; tail context on long digests</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        End-truncating a 64-character SHA-256 digest or deep sensor stream
        URI hides the terminal lane or checksum digits engineers actually
        verify. Setting <code>:max-length</code> visually renders
        <code>head…tail</code> while keeping the full raw string in both
        the hover <code>title</code> and clipboard payload.
      </p>
      <TuxExample class="mt-4" :vue="truncationVue">
        <div class="flex flex-col items-start gap-3">
          <TuxCopyToken
            label="SHA-256"
            value="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
            :max-length="20"
            verified
            copy-label="Copy telemetry archive checksum"
            @copy="onTokenCopy"
          />
          <TuxCopyToken
            value="sensor://rellis-proving-ground/intersection-04/radar-west-lane-2"
            :max-length="30"
            copy-label="Copy sensor stream endpoint"
            @copy="onTokenCopy"
          />
        </div>
      </TuxExample>
    </section>
  </div>
</template>
