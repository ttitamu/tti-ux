<script setup lang="ts">
useHead({ title: "Inline validation · Forms · TUX" });

// ── Live character counter ────────────────────────────────────
const summary = ref("Quarterly summary of corridor-program work");
const summaryMax = 280;
const summaryRemaining = computed(() => summaryMax - summary.value.length);
const summaryNearLimit = computed(() => summaryRemaining.value <= 20);
const summaryOverLimit = computed(() => summaryRemaining.value < 0);

// ── Phone mask ────────────────────────────────────────────────
const phone = ref("");
function maskPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  if (digits.length === 0) return "";
  if (digits.length < 4) return `(${digits}`;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}
function onPhoneInput(e: Event) {
  const input = e.target as HTMLInputElement;
  phone.value = maskPhone(input.value);
}

// ── NIH grant mask: 1 R01 GM123456-01A1 (we'll do the simple 7-char project ID)
const grantId = ref("");
function maskGrant(raw: string): string {
  // NIH-ish: 3 letters, 6 digits — simplified.
  const cleaned = raw.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 9);
  const letters = cleaned.slice(0, 3).replace(/[^A-Z]/g, "");
  const digits = cleaned.slice(letters.length).replace(/[^0-9]/g, "").slice(0, 6);
  if (!letters) return "";
  if (!digits) return letters;
  return `${letters}-${digits}`;
}
function onGrantInput(e: Event) {
  const input = e.target as HTMLInputElement;
  grantId.value = maskGrant(input.value);
}

// ── Async "this email is taken" ────────────────────────────────
const email = ref("");
const emailStatus = ref<"idle" | "checking" | "available" | "taken" | "invalid">("idle");
let emailTimer: ReturnType<typeof setTimeout> | null = null;

function emailValid(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function onEmailInput() {
  if (emailTimer) clearTimeout(emailTimer);
  if (!email.value) { emailStatus.value = "idle"; return; }
  if (!emailValid(email.value)) { emailStatus.value = "invalid"; return; }
  emailStatus.value = "checking";
  emailTimer = setTimeout(() => {
    // Simulate: emails containing "taken" are unavailable.
    emailStatus.value = email.value.includes("taken") ? "taken" : "available";
  }, 700);
}
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="forms · primitive" title="Inline validation">
      Live validation patterns — masked inputs, character counters,
      async availability checks. These compose plain
      <code>UInput</code> + a Vue ref + a small handler. No new
      component to ship; the patterns are the shipped primitive.
    </TuxPageHeader>

    <section>
      <p class="eyebrow">live counter</p>
      <h2 class="heading--bold text-xl font-bold">Character remaining</h2>
      <UFormField label="Project summary" help="Max 280 characters.">
        <UTextarea v-model="summary" :rows="3" />
        <template #help>
          <span
            class="text-xs"
            :class="summaryOverLimit ? 'text-text-error'
                  : summaryNearLimit ? 'text-text-error'
                  : 'text-text-muted'"
          >
            {{ summaryRemaining }} characters remaining
          </span>
        </template>
      </UFormField>
    </section>

    <section>
      <p class="eyebrow">masked input</p>
      <h2 class="heading--bold text-xl font-bold">Phone number</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UFormField label="US phone (auto-formats)" help="Type digits; mask formats automatically.">
          <UInput
            :model-value="phone"
            placeholder="(979) 317-2345"
            @input="onPhoneInput"
          />
        </UFormField>
        <UFormField label="NIH-style grant ID" help="LET-NUM format, e.g. GM-123456.">
          <UInput
            :model-value="grantId"
            placeholder="GM-123456"
            @input="onGrantInput"
          />
        </UFormField>
      </div>
      <p class="mt-3 text-xs text-text-muted">
        Bound: <code class="font-mono">phone={{ phone || "(empty)" }}</code> ·
        <code class="font-mono">grantId={{ grantId || "(empty)" }}</code>
      </p>
    </section>

    <section>
      <p class="eyebrow">async availability</p>
      <h2 class="heading--bold text-xl font-bold">"This email is taken"</h2>
      <UFormField
        label="Sponsor contact email"
        :error="emailStatus === 'taken' ? 'That email is already on file.'
              : emailStatus === 'invalid' ? 'Enter a valid email.'
              : undefined"
      >
        <UInput
          v-model="email"
          placeholder="contact@example.org"
          @input="onEmailInput"
        />
        <template #help>
          <span class="text-xs flex items-center gap-1.5">
            <template v-if="emailStatus === 'idle'">
              <UIcon name="lucide:info" class="w-3 h-3 opacity-60" />
              <span class="text-text-muted">Try "taken@example.org" to see the conflict state.</span>
            </template>
            <template v-else-if="emailStatus === 'checking'">
              <UIcon name="lucide:loader-circle" class="w-3 h-3 animate-spin" />
              <span class="text-text-muted">Checking availability…</span>
            </template>
            <template v-else-if="emailStatus === 'available'">
              <UIcon name="lucide:check-circle-2" class="w-3 h-3 text-text-success" />
              <span class="text-text-success">Available.</span>
            </template>
            <template v-else-if="emailStatus === 'invalid'">
              <UIcon name="lucide:alert-triangle" class="w-3 h-3 text-text-error" />
              <span class="text-text-error">Invalid format.</span>
            </template>
          </span>
        </template>
      </UFormField>
    </section>

    <section>
      <p class="eyebrow">notes</p>
      <h2 class="heading--bold text-lg font-bold">Why no Tux wrapper</h2>
      <p class="mt-2 text-text-secondary leading-relaxed">
        Each of these is ten lines of Vue. Wrapping them in a single
        component would obscure intent and lock the host app into one
        masking convention. The patterns here transfer cleanly to any
        consumer (PECAN admin, tti-ai-studio settings, sponsor-portal
        forms) — copy the handler, point it at the right ref.
      </p>
    </section>
  </div>
</template>
