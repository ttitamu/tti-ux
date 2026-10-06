<script setup lang="ts">
import tuxModalSource from "~/components/TuxModal.vue?raw";
import type { TuxPropControl, TuxPlaygroundPreset } from "~/components/TuxPlayground.vue";

useHead({ title: "TuxModal · TUX" });

const playgroundOpen = ref(false);
const basic = ref(false);
const confirm = ref(false);

const modalControls: TuxPropControl[] = [
  {
    prop: "title",
    label: "Modal Title",
    type: "text",
    defaultValue: "Confirm Operations Dispatch",
    description: "Rendered with the signature Aggie gold-bar heading",
  },
  {
    prop: "eyebrow",
    label: "Eyebrow Category",
    type: "text",
    defaultValue: "action · field operations",
    description: "Institutional eyebrow tag positioned above title",
  },
  {
    prop: "body",
    label: "Modal Body Content",
    type: "text",
    defaultValue: "Staged parameters will be dispatched to the RELLIS Proving Grounds telemetry server.",
  },
  {
    prop: "confirmIntent",
    label: "Primary Button Intent",
    type: "select",
    options: ["primary", "destructive", "secondary"],
    defaultValue: "primary",
  },
  {
    prop: "confirmLabel",
    label: "Primary Button Label",
    type: "text",
    defaultValue: "Dispatch Now",
  },
  {
    prop: "showFooter",
    label: "Include Action Footer",
    type: "boolean",
    defaultValue: true,
  },
];

const modalPresets: TuxPlaygroundPreset[] = [
  {
    name: "confirm-action",
    label: "Confirm Action",
    description: "Standard workflow confirmation dialog with primary button",
    icon: "lucide:check-circle",
    values: {
      title: "Confirm Operations Dispatch",
      eyebrow: "action · field operations",
      body: "Staged parameters will be dispatched to the RELLIS Proving Grounds telemetry server.",
      confirmIntent: "primary",
      confirmLabel: "Dispatch Now",
      showFooter: true,
    },
  },
  {
    name: "delete-destructive",
    label: "Destructive Confirmation",
    description: "Critical action modal with fill-on-hover danger styling",
    icon: "lucide:trash-2",
    values: {
      title: "Delete Simulation Corridor?",
      eyebrow: "destructive action · safety critical",
      body: "This will permanently remove the modeled pavement strata and corridor calibration telemetry. This action cannot be undone.",
      confirmIntent: "destructive",
      confirmLabel: "Delete Corridor",
      showFooter: true,
    },
  },
  {
    name: "notice-dialog",
    label: "Informational Notice",
    description: "Eyebrow header notice without confirmation footer",
    icon: "lucide:info",
    values: {
      title: "Automated Data Ingestion Active",
      eyebrow: "system status · lonestar feed",
      body: "The TxDOT Lonestar corridor stream is currently ingesting 1,420 vehicles per hour across general purpose lanes.",
      confirmIntent: "primary",
      confirmLabel: "Acknowledge",
      showFooter: false,
    },
  },
];

const basicVue = `<tux-button intent="primary" @click="open = true">Open basic modal</tux-button>
<tux-modal v-model:open="open" eyebrow="action" title="Confirm changes">
  <p>A basic modal with an eyebrow label above the title. The gold bar under
     the title is the tux signature.</p>
</tux-modal>`;

const confirmVue = `<tux-button intent="destructive" icon="lucide:trash-2" @click="open = true">
  Delete record…
</tux-button>
<tux-modal v-model:open="open" eyebrow="destructive action" title="Delete record?">
  <p>This will permanently remove the record and all associated revisions.
     Consumers with outstanding references will see a 404.</p>
  <template #footer>
    <div class="flex justify-end gap-2 w-full">
      <tux-button intent="ghost" @click="open = false">Cancel</tux-button>
      <tux-button intent="destructive" @click="open = false">Delete</tux-button>
    </div>
  </template>
</tux-modal>`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component" title="TuxModal">
      Wraps <code>UModal</code>. Pass <code>title</code> (rendered with the
      gold-bar <code>heading--bold</code> utility) and an optional
      <code>eyebrow</code> for editorial rhythm. Body goes in the default
      slot; footer in <code>#footer</code>.
      <br><br>
      <span class="text-sm text-text-muted">Note: the HTML tab on this page
      captures the trigger button, not the modal itself — when closed, the
      modal doesn't exist in the DOM. Open it and inspect via browser
      devtools.</span>
    </TuxPageHeader>

    <!-- Interactive Props Workbench -->
    <section>
      <TuxPlayground
        tag="tux-modal"
        component-name="TuxModal"
        title="TuxModal Workbench"
        eyebrow="Interactive Component Playground"
        :controls="modalControls"
        :presets="modalPresets"
        :source="tuxModalSource"
        :code-template="(values) => {
          const footerBlock = values.showFooter
            ? `\n  <template #footer>\n    <div class=\x22flex justify-end gap-2 w-full\x22>\n      <tux-button intent=\x22ghost\x22 @click=\x22open = false\x22>Cancel</tux-button>\n      <tux-button intent=\x22${values.confirmIntent}\x22 @click=\x22open = false\x22>${values.confirmLabel}</tux-button>\n    </div>\n  </template>`
            : '';
          return `<tux-button intent=\x22${values.confirmIntent}\x22 @click=\x22open = true\x22>Open ${values.title}</tux-button>\n<tux-modal v-model:open=\x22open\x22 eyebrow=\x22${values.eyebrow}\x22 title=\x22${values.title}\x22>\n  <p>${values.body}</p>${footerBlock}\n</tux-modal>`;
        }"
      >
        <template #default="{ values }">
          <div class="flex flex-col items-center gap-4">
            <TuxButton
              :intent="values.confirmIntent"
              icon="lucide:maximize-2"
              @click="playgroundOpen = true"
            >
              Open {{ values.title }}
            </TuxButton>
            <p class="text-xs text-text-muted">Click button to launch interactive modal with current prop state.</p>

            <TuxModal
              v-model:open="playgroundOpen"
              :eyebrow="values.eyebrow || undefined"
              :title="values.title"
            >
              <p class="text-text-secondary leading-relaxed">
                {{ values.body }}
              </p>
              <template v-if="values.showFooter" #footer>
                <div class="flex justify-end gap-2 w-full">
                  <TuxButton intent="ghost" @click="playgroundOpen = false">Cancel</TuxButton>
                  <TuxButton :intent="values.confirmIntent" @click="playgroundOpen = false">
                    {{ values.confirmLabel }}
                  </TuxButton>
                </div>
              </template>
            </TuxModal>
          </div>
        </template>
      </TuxPlayground>
    </section>

    <section>
      <p class="eyebrow">basic</p>
      <h2 class="heading--bold text-xl font-bold">Title + eyebrow</h2>
      <TuxExample class="mt-4" :vue="basicVue" :source="tuxModalSource">
        <TuxButton intent="primary" @click="basic = true">Open basic modal</TuxButton>
        <TuxModal v-model:open="basic" eyebrow="action" title="Confirm changes">
          <p class="text-text-secondary leading-relaxed">
            A basic modal with an eyebrow label above the title. The gold bar
            under the title is the tux signature — the same utility we use
            for section headings.
          </p>
        </TuxModal>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">with footer</p>
      <h2 class="heading--bold text-xl font-bold">Confirm pattern</h2>
      <TuxExample class="mt-4" :vue="confirmVue" :source="tuxModalSource">
        <TuxButton intent="destructive" icon="lucide:trash-2" @click="confirm = true">
          Delete record…
        </TuxButton>
        <TuxModal v-model:open="confirm" eyebrow="destructive action" title="Delete record?">
          <p class="text-text-secondary leading-relaxed">
            This will permanently remove the record and all associated
            revisions. Consumers with outstanding references will see a 404.
          </p>
          <template #footer>
            <div class="flex justify-end gap-2 w-full">
              <TuxButton intent="ghost" @click="confirm = false">Cancel</TuxButton>
              <TuxButton intent="destructive" @click="confirm = false">Delete</TuxButton>
            </div>
          </template>
        </TuxModal>
      </TuxExample>
    </section>
  </div>
</template>
