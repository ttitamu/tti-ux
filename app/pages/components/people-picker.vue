<script setup>
// Per ADR-0010, keep top-level <script setup> expressions plain JS;
// typed people live in the sibling demo-data module (ADR-0011).
import tuxPeoplePickerSource from "~/components/TuxPeoplePicker.vue?raw";
import { assignable, personById, sample, searchPeople } from "./people-picker.demo-data";

useHead({ title: "TuxPeoplePicker · TUX" });

// ── 1 · The item panel: a popover over the Assignees field ─────────
const panelOpen = ref(false);
const panelAssignees = ref(["arojo", "lnguyen"]);
const canAssign = ref(true);
const panelPeople = computed(() => panelAssignees.value.map(personById).filter(Boolean));

// ── 2 · Server-side search with a fake delay ─────────────────────
const remoteQuery = ref("");
const remoteScope = ref("repo");
const remotePeople = ref(assignable);
const remoteLoading = ref(false);
const remoteSelected = ref(["cokafor"]);
const remoteLog = ref([]);
const remotePicker = ref(null);
let debounce;
let latest = 0;

function search() {
  clearTimeout(debounce);
  debounce = setTimeout(async () => {
    const mine = ++latest;
    remoteLoading.value = true;
    const found = await searchPeople(remoteQuery.value, remoteScope.value);
    if (mine !== latest) return; // a newer search is in flight
    remotePeople.value = found;
    remoteLoading.value = false;
  }, 200);
}
watch([remoteQuery, remoteScope], search);

function onRemoteToggle(id, selected) {
  const p = personById(id);
  const line = `${selected ? "Assigned" : "Unassigned"} ${p ? p.name : id}`;
  remoteLog.value = [line, ...remoteLog.value].slice(0, 4);
}

function toggleScope() {
  remoteScope.value = remoteScope.value === "repo" ? "directory" : "repo";
  // The footer button took focus; hand it back to the search field.
  if (remotePicker.value) remotePicker.value.focus();
}

// ── 3 · Single select ──────────────────────────────────────────────
const owner = ref(["rdelgado"]);
const ownerName = computed(() => {
  const p = personById(owner.value[0] || "");
  return p ? p.name : "No owner";
});

// ── 4 · States ─────────────────────────────────────────────────────
const stateSelected = ref(["arojo"]);
const narrowSelected = ref(["lnguyen", "spena"]);

const popoverVue = `<UPopover v-model:open="open" :ui="{ content: 'p-0' }">
  <UButton icon="lucide:user-round-plus" variant="ghost" color="neutral" size="xs">
    Edit
  </UButton>
  <template #content>
    <!-- Escape emits close and stops there, so the enclosing
         <dialog> side panel stays open — close the popover yourself. -->
    <TuxPeoplePicker
      v-model="assignees"
      :people="assignable"
      label="Assignees"
      @close="open = false"
    />
  </template>
</UPopover>`;

const remoteVue = `<TuxPeoplePicker
  v-model="assignees"
  v-model:query="query"
  :people="results"
  :loading="searching"
  remote
  label="Assignees"
  @toggle="(id, selected) => selected ? assign(id) : unassign(id)"
>
  <template #footer>
    <UButton variant="link" size="xs" @click="scope = 'directory'">
      Search the whole TTI directory
    </UButton>
  </template>
</TuxPeoplePicker>

// The picker emits update:query on every keystroke — debounce here.
watch(query, debounce(async (q) => {
  searching.value = true;
  results.value = await api.searchPeople(repo, q);   // Forgejo + Entra
  searching.value = false;
}, 200));`;

const singleVue = `<TuxPeoplePicker
  v-model="owner"
  :people="assignable"
  :multiple="false"
  label="Owner"
  placeholder="Find the owner"
/>`;

const statesVue = `<!-- A search in flight: the list stays, the field spins -->
<TuxPeoplePicker v-model="ids" :people="people" loading />

<!-- In flight with nothing to show yet -->
<TuxPeoplePicker :people="[]" loading />

<!-- Nothing matches -->
<TuxPeoplePicker :people="[]" query="zz" empty-text="No one on this repo matches" />

<!-- The search failed: the empty slot carries the message and a retry -->
<TuxPeoplePicker :people="[]" remote>
  <template #empty>
    The directory didn't answer. <UButton variant="link" size="xs">Try again</UButton>
  </template>
</TuxPeoplePicker>`;

const narrowVue = `<!-- Fill a phone-width panel instead of the 20rem default -->
<TuxPeoplePicker
  v-model="ids"
  :people="people"
  style="--tux-people-picker-width: 100%"
/>`;

const shapeTs = `type Tone = "info" | "success" | "warning" | "error" | "neutral" | "muted";

interface TuxPerson {
  id: string;                               // login
  name: string;                             // "Rojo, Alex"
  subtitle?: string;                        // "Student Technician · NET" or "@login"
  avatar?: string;                          // photo URL; initials when absent/broken
  status?: { label: string; tone: Tone };   // { label: "Needs access", tone: "warning" }
  disabled?: boolean;                       // shown, not selectable — status says why
}

// Pure helpers, exported from app/utils/tuxPeople.ts:
tuxPersonInitials("Rojo, Alex")            // "AR"
tuxFilterPeople(people, "alex rojo")       // token match: name, subtitle, login
tuxOrderPeople(people, selectedIds, true)  // de-dupe, selected first, stable
tuxTogglePerson(ids, id, multiple)         // { next, changes: [[id, selected]] }`;

const keys = [
  { key: "↓ / ↑", does: "Move the active person, wrapping at the ends." },
  { key: "Home / End", does: "First / last person. With Shift, Ctrl, Alt or ⌘ they stay text-caret keys." },
  { key: "Enter", does: "Toggle the active person (single select: replace). Never submits a surrounding form." },
  { key: "Escape", does: "Emit close. Propagation is stopped and default prevented, so the enclosing dialog stays open." },
  { key: "Typing", does: "Emits update:query at once and makes the first match active, so Enter picks it (remote: once the new results arrive)." },
];
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component · work surface" title="TuxPeoplePicker">
      Assign people to a piece of work. A search box over a list of
      people — avatar, name, a subtitle such as "Student Technician ·
      NET", and a status when something stands in the way ("Needs
      access"). On the forge the list is Forgejo's assignable users
      enriched with each person's Entra ID profile, searched on the
      server as you type, and it sits in a popover in the Roadmap item
      panel. It follows the WAI-ARIA combobox pattern: focus stays in the
      field and the arrow keys move through the list.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">flagship · roadmap item panel</p>
      <h2 class="heading--bold text-xl font-bold">In a popover, in a side panel</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        The item panel's Assignees field opens the picker in a
        <code>UPopover</code>. People already assigned sort to the top
        (and stay put while you pick, so a row never jumps out from
        under the pointer). Escape closes the popover only — the
        picker stops the key, so the panel's modal dialog does not close
        with it. Turn off "Can assign" for the read-only view: someone
        without write access sees the assignees, not the picker.
      </p>
      <TuxExample class="mt-4" :vue="popoverVue" :source="tuxPeoplePickerSource">
        <div class="max-w-md rounded-md border border-surface-border bg-surface-raised">
          <div class="border-b border-surface-border-subtle px-4 py-3">
            <p class="eyebrow">Production host · #189</p>
            <p class="font-semibold text-text-primary">Create the prod resource group, vnet and NSG</p>
          </div>
          <div class="space-y-3 px-4 py-3 text-sm">
            <div class="flex items-center justify-between gap-2">
              <span class="font-semibold text-text-secondary">Assignees</span>
              <UPopover
                v-if="canAssign"
                v-model:open="panelOpen"
                :content="{ align: 'end', sideOffset: 6 }"
                :ui="{ content: 'p-0 overflow-hidden' }"
              >
                <UButton icon="lucide:user-round-plus" variant="ghost" color="neutral" size="xs">
                  Edit
                </UButton>
                <template #content>
                  <TuxPeoplePicker
                    v-model="panelAssignees"
                    :people="assignable"
                    label="Assignees"
                    @close="panelOpen = false"
                  />
                </template>
              </UPopover>
            </div>
            <ul v-if="panelPeople.length" class="space-y-2">
              <li v-for="p in panelPeople" :key="p.id" class="flex items-center gap-2">
                <TuxAvatar :name="p.name" :photo-url="p.avatar" size="sm" />
                <span class="text-text-primary">{{ p.name }}</span>
              </li>
            </ul>
            <p v-else class="text-text-muted">No one assigned</p>
            <p v-if="!canAssign" class="text-xs text-text-muted">
              Only people with write access to this repository can assign.
            </p>
            <USwitch v-model="canAssign" label="Can assign" size="sm" />
          </div>
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">remote · server-side search</p>
      <h2 class="heading--bold text-xl font-bold">Search as you type</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        With <code>remote</code>, the picker never filters: it emits
        <code>update:query</code> on every keystroke and shows
        <code>people</code> as given. This demo debounces 200&nbsp;ms and
        answers after a fake 450&nbsp;ms round trip; while
        <code>loading</code>, the field spins and the last results stay —
        but none of them is made active until the new results land, so
        Enter never picks a stale row.
        The footer widens the search to the whole TTI directory, where
        people without access to the repo show as "Needs access" and
        cannot be picked. <code>toggle(id, selected)</code> is what the
        forge turns into assign / unassign calls.
      </p>
      <TuxExample class="mt-4" :vue="remoteVue">
        <div class="flex flex-wrap items-start gap-6">
          <div class="rounded-md border border-surface-border overflow-hidden">
            <TuxPeoplePicker
              ref="remotePicker"
              v-model="remoteSelected"
              v-model:query="remoteQuery"
              :people="remotePeople"
              :loading="remoteLoading"
              :autofocus="false"
              remote
              label="Assignees"
              :empty-text="remoteScope === 'repo' ? 'No one on this repo matches' : 'No one in the directory matches'"
              @toggle="onRemoteToggle"
            >
              <template #footer>
                <UButton
                  variant="link"
                  size="xs"
                  :icon="remoteScope === 'repo' ? 'lucide:building-2' : 'lucide:folder-git-2'"
                  class="px-0"
                  @click="toggleScope"
                >
                  {{ remoteScope === "repo" ? "Search the whole TTI directory" : "Only people on this repo" }}
                </UButton>
              </template>
            </TuxPeoplePicker>
          </div>
          <div class="min-w-[12rem] text-sm">
            <p class="eyebrow">emitted</p>
            <dl class="mt-2 space-y-1 text-text-secondary">
              <div><dt class="inline font-semibold">query:</dt> <dd class="inline font-mono">"{{ remoteQuery }}"</dd></div>
              <div><dt class="inline font-semibold">v-model:</dt> <dd class="inline font-mono">{{ JSON.stringify(remoteSelected) }}</dd></div>
            </dl>
            <ol class="mt-2 space-y-1 text-text-muted">
              <li v-for="(line, i) in remoteLog" :key="i">{{ line }}</li>
            </ol>
          </div>
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">single select</p>
      <h2 class="heading--bold text-xl font-bold">One owner per area of work</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        <code>:multiple="false"</code> drops the checkbox for a bare check
        and makes a pick replace the selection. <code>toggle</code> reports
        the replaced person deselected first, then the new one selected;
        picking the owner again clears it.
      </p>
      <TuxExample class="mt-4" :vue="singleVue">
        <div class="space-y-3">
          <p class="text-sm text-text-secondary">
            Epic #186 · Production host — owner: <strong class="text-text-primary">{{ ownerName }}</strong>
          </p>
          <div class="inline-block rounded-md border border-surface-border overflow-hidden">
            <TuxPeoplePicker
              v-model="owner"
              :people="assignable"
              :multiple="false"
              :autofocus="false"
              label="Owner"
              placeholder="Find the owner"
            />
          </div>
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">states</p>
      <h2 class="heading--bold text-xl font-bold">Loading, empty, failed, can't be picked</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        A search in flight keeps the list (the listbox is
        <code>aria-busy</code>); with nothing to show yet it says
        "Searching…" rather than "No one matches". A failed search is
        the consumer's to explain — the <code>empty</code> slot takes the
        message and a retry. Disabled people stay in the list and in
        keyboard reach so their status ("Needs access", "Left TTI") is
        read, but can't be picked.
      </p>
      <TuxExample class="mt-4" :vue="statesVue">
        <div class="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(20rem,1fr))]">
          <div class="rounded-md border border-surface-border overflow-hidden">
            <TuxPeoplePicker v-model="stateSelected" :people="sample" :autofocus="false" loading query="a" remote />
          </div>
          <div class="rounded-md border border-surface-border overflow-hidden">
            <TuxPeoplePicker :people="[]" :autofocus="false" loading query="okaf" remote />
          </div>
          <div class="rounded-md border border-surface-border overflow-hidden">
            <TuxPeoplePicker :people="[]" :autofocus="false" query="zz" empty-text="No one on this repo matches" />
          </div>
          <div class="rounded-md border border-surface-border overflow-hidden">
            <TuxPeoplePicker :people="[]" :autofocus="false" query="rojo" remote>
              <template #empty>
                The directory didn't answer.
                <UButton variant="link" size="xs" class="px-0">Try again</UButton>
              </template>
            </TuxPeoplePicker>
          </div>
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">narrow · phone panel</p>
      <h2 class="heading--bold text-xl font-bold">Down to a phone</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        The picker is 20rem by default and never wider than its
        container. It is an inline-size container: below 21rem a status
        badge drops under the person's title instead of squeezing the
        name, and long titles wrap to two lines. Set
        <code>--tux-people-picker-width: 100%</code> to fill a panel.
      </p>
      <TuxExample class="mt-4" :vue="narrowVue">
        <div class="flex flex-wrap items-start gap-6">
          <div class="w-[340px] max-w-full rounded-md border border-surface-border overflow-hidden">
            <TuxPeoplePicker
              v-model="narrowSelected"
              :people="[...assignable.slice(0, 5), sample[2]]"
              :autofocus="false"
              style="--tux-people-picker-width: 100%"
            />
          </div>
          <div class="w-[16rem] max-w-full rounded-md border border-surface-border overflow-hidden">
            <TuxPeoplePicker
              v-model="narrowSelected"
              :people="[...assignable.slice(0, 5), sample[2]]"
              :autofocus="false"
              style="--tux-people-picker-width: 100%; --tux-people-picker-max-height: 14rem"
            />
          </div>
        </div>
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">keyboard · a11y</p>
      <h2 class="heading--bold text-xl font-bold">The keyboard contract</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        The field is a <code>role="combobox"</code> with
        <code>aria-controls</code> and <code>aria-activedescendant</code>;
        people are <code>role="option"</code> rows with
        <code>aria-selected</code> and <code>aria-disabled</code>. Selection
        shows as a filled checkbox (a check in single mode), never colour
        alone, and a polite status line announces "Searching…" and the
        result count.
      </p>
      <div class="mt-4 overflow-x-auto">
        <table class="w-full max-w-3xl text-sm">
          <thead>
            <tr class="border-b border-surface-border text-left">
              <th class="py-2 pr-4 font-semibold">Key</th>
              <th class="py-2 font-semibold">What it does</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="k in keys" :key="k.key" class="border-b border-surface-border-subtle align-top">
              <td class="py-2 pr-4 font-mono whitespace-nowrap">{{ k.key }}</td>
              <td class="py-2 text-text-secondary">{{ k.does }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <TuxCodeBlock class="mt-6" :code="shapeTs" lang="ts" filename="app/utils/tuxPeople.ts" />
    </section>
  </div>
</template>
