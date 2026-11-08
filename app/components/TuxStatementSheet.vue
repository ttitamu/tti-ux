<script setup lang="ts">
/**
 * TuxStatementSheet — institutional resource chargeback voucher and
 * period statement with Warm Gold keyline, issuer/recipient account cards,
 * itemized quantity × unitRate ledger, adjustments, net total, digital
 * attestation stamps, and print / CSV export actions.
 */
import { computed, ref } from "vue";

export interface StatementParty {
  name: string;
  code?: string;
  department?: string;
  contact?: string;
}

export interface StatementLineItem {
  id: string;
  category: string;
  description: string;
  quantity: number;
  unit: string;
  unitRate: number;
  amount?: number;
}

export interface StatementApprovalStamp {
  id: string;
  role: string;
  signer: string;
  status: "approved" | "pending" | "rejected";
  timestamp?: string;
  decisionNote?: string;
}

interface StatementAdjustment {
  label: string;
  amount: number;
}

interface Props {
  /** Unique voucher or statement identifier. */
  statementId: string;
  /** Statement document heading. */
  title?: string;
  /** Human-readable billing or metering period label. */
  periodLabel: string;
  /** Statement issue date string. */
  issueDate: string;
  /** Lifecycle settlement status of the statement. */
  status?: "draft" | "pending" | "settled" | "void";
  /** Issuing resource pool or institutional division metadata. */
  issuer: StatementParty;
  /** Recipient study, account, or research division metadata. */
  recipient: StatementParty;
  /** Itemized resource consumption lines. */
  lines: StatementLineItem[];
  /** Optional credits, offsets, or surcharge adjustments applied to subtotal. */
  adjustments?: StatementAdjustment[];
  /** Optional digital attestation and fiscal signoff stamps. */
  approvals?: StatementApprovalStamp[];
  /** Optional remittance or internal journal reference identifier. */
  remittanceRef?: string;
  /** Optional cryptographic verification digest token. */
  digest?: string;
  /** Currency symbol prepended to monetary amounts. */
  currencySymbol?: string;
  /** Render Print and Export CSV action buttons in the statement header. */
  showPrintAction?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Resource Chargeback Statement",
  status: "settled",
  adjustments: () => [],
  approvals: () => [],
  remittanceRef: undefined,
  digest: undefined,
  currencySymbol: "$",
  showPrintAction: true,
});

const emit = defineEmits<{
  print: [statementId: string];
  exportCsv: [statementId: string];
}>();

const copiedCsv = ref(false);

function lineAmount(line: StatementLineItem): number {
  if (line.amount !== undefined) return line.amount;
  return line.quantity * line.unitRate;
}

const subtotal = computed(() => {
  let sum = 0;
  for (const line of props.lines) {
    sum += lineAmount(line);
  }
  return sum;
});

const adjustmentsTotal = computed(() => {
  let sum = 0;
  for (const adj of props.adjustments) {
    sum += adj.amount;
  }
  return sum;
});

const netTotal = computed(() => subtotal.value + adjustmentsTotal.value);

function formatMoney(val: number, decimals = 2): string {
  const sign = val < 0 ? "-" : "";
  const formatted = Math.abs(val).toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${sign}${props.currencySymbol}${formatted}`;
}

function formatUnitRate(rate: number): string {
  const decimals = rate !== 0 && Math.abs(rate) < 0.1 ? 4 : 2;
  return formatMoney(rate, decimals);
}

function formatQuantity(qty: number, unit: string): string {
  const num = Number.isInteger(qty)
    ? qty.toLocaleString("en-US")
    : qty.toLocaleString("en-US", { maximumFractionDigits: 2 });
  return `${num} ${unit}`;
}

function statusText(st: NonNullable<Props["status"]>): string {
  if (st === "settled") return "Settled";
  if (st === "pending") return "Pending Settlement";
  if (st === "void") return "Void";
  return "Draft";
}

function stampStatusLabel(st: StatementApprovalStamp["status"]): string {
  if (st === "approved") return "Approved";
  if (st === "rejected") return "Rejected";
  return "Pending";
}

function escapeCsvCell(raw: string): string {
  if (/[",\r\n]/.test(raw)) {
    return `"${raw.replace(/"/g, '""')}"`;
  }
  return raw;
}

function buildCsv(): string {
  const rows: string[][] = [
    ["Statement ID", "Category", "Description", "Quantity", "Unit", "Unit Rate", "Amount"],
  ];
  for (const line of props.lines) {
    rows.push([
      props.statementId,
      line.category,
      line.description,
      String(line.quantity),
      line.unit,
      line.unitRate.toFixed(4),
      lineAmount(line).toFixed(2),
    ]);
  }
  rows.push([props.statementId, "", "Subtotal", "", "", "", subtotal.value.toFixed(2)]);
  for (const adj of props.adjustments) {
    rows.push([props.statementId, "Adjustment", adj.label, "", "", "", adj.amount.toFixed(2)]);
  }
  rows.push([props.statementId, "", "Net Statement Total", "", "", "", netTotal.value.toFixed(2)]);
  return rows.map((r) => r.map(escapeCsvCell).join(",")).join("\n");
}

function handleExportCsv() {
  const csv = buildCsv();
  if (globalThis.navigator?.clipboard?.writeText) {
    globalThis.navigator.clipboard.writeText(csv).catch(() => {});
  }
  copiedCsv.value = true;
  setTimeout(() => {
    copiedCsv.value = false;
  }, 1800);
  emit("exportCsv", props.statementId);
}

function handlePrint() {
  try {
    globalThis.window?.print?.();
  } catch {
    // Ignore unimplemented print in headless test environments
  }
  emit("print", props.statementId);
}
</script>

<template>
  <article
    class="tux-statement-sheet"
    :aria-label="`${title} ${statementId}`"
  >
    <header class="tux-statement-sheet__header">
      <div class="tux-statement-sheet__doc-meta">
        <div class="tux-statement-sheet__top-badges">
          <span class="tux-statement-sheet__id-badge">{{ statementId }}</span>
          <span class="tux-statement-sheet__status-pill">
            <span
              class="tux-statement-sheet__dot"
              :class="`tux-statement-sheet__dot--${status}`"
              aria-hidden="true"
            />
            <span>{{ statusText(status) }}</span>
          </span>
        </div>

        <h2 class="tux-statement-sheet__title">{{ title }}</h2>

        <div class="tux-statement-sheet__dates">
          <span>Billing Period: <strong>{{ periodLabel }}</strong></span>
          <span aria-hidden="true">&middot;</span>
          <span>Issued: <strong>{{ issueDate }}</strong></span>
        </div>
      </div>

      <div
        v-if="showPrintAction"
        class="tux-statement-sheet__actions"
        role="group"
        aria-label="Statement export and print controls"
      >
        <button
          type="button"
          class="tux-statement-sheet__btn"
          :aria-label="`Export CSV for statement ${statementId}`"
          @click="handleExportCsv"
        >
          {{ copiedCsv ? "Copied CSV" : "Export CSV" }}
        </button>
        <button
          type="button"
          class="tux-statement-sheet__btn tux-statement-sheet__btn--primary"
          :aria-label="`Print statement ${statementId}`"
          @click="handlePrint"
        >
          Print Statement
        </button>
      </div>
    </header>

    <div class="tux-statement-sheet__parties">
      <div class="tux-statement-sheet__party-card">
        <h3 class="tux-statement-sheet__party-heading">Issuer</h3>
        <div class="tux-statement-sheet__party-title-line">
          <strong class="tux-statement-sheet__party-name">{{ issuer.name }}</strong>
          <span v-if="issuer.code" class="tux-statement-sheet__code">{{ issuer.code }}</span>
        </div>
        <p v-if="issuer.department" class="tux-statement-sheet__party-detail">
          {{ issuer.department }}
        </p>
        <p v-if="issuer.contact" class="tux-statement-sheet__party-detail tux-statement-sheet__party-detail--mono">
          {{ issuer.contact }}
        </p>
      </div>

      <div class="tux-statement-sheet__party-card">
        <h3 class="tux-statement-sheet__party-heading">Recipient / Account</h3>
        <div class="tux-statement-sheet__party-title-line">
          <strong class="tux-statement-sheet__party-name">{{ recipient.name }}</strong>
          <span v-if="recipient.code" class="tux-statement-sheet__code">{{ recipient.code }}</span>
        </div>
        <p v-if="recipient.department" class="tux-statement-sheet__party-detail">
          {{ recipient.department }}
        </p>
        <p v-if="recipient.contact" class="tux-statement-sheet__party-detail tux-statement-sheet__party-detail--mono">
          {{ recipient.contact }}
        </p>
      </div>
    </div>

    <div
      class="tux-statement-sheet__scroll"
      tabindex="0"
      role="region"
      :aria-label="`Itemized charges for statement ${statementId}`"
    >
      <table class="tux-statement-sheet__table">
        <caption class="tux-statement-sheet__sr-only">
          Itemized resource consumption lines and net statement total for {{ statementId }}
        </caption>
        <thead>
          <tr>
            <th scope="col" class="tux-statement-sheet__th">Description</th>
            <th scope="col" class="tux-statement-sheet__th">Category</th>
            <th scope="col" class="tux-statement-sheet__th tux-statement-sheet__th--num">Quantity</th>
            <th scope="col" class="tux-statement-sheet__th tux-statement-sheet__th--num">Unit Rate</th>
            <th scope="col" class="tux-statement-sheet__th tux-statement-sheet__th--num">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="line in lines"
            :key="line.id"
            class="tux-statement-sheet__row"
          >
            <th scope="row" class="tux-statement-sheet__row-th">
              {{ line.description }}
            </th>
            <td class="tux-statement-sheet__td">
              <span class="tux-statement-sheet__category-tag">{{ line.category }}</span>
            </td>
            <td class="tux-statement-sheet__td tux-statement-sheet__td--num">
              {{ formatQuantity(line.quantity, line.unit) }}
            </td>
            <td class="tux-statement-sheet__td tux-statement-sheet__td--num">
              {{ formatUnitRate(line.unitRate) }} / {{ line.unit }}
            </td>
            <td class="tux-statement-sheet__td tux-statement-sheet__td--num tux-statement-sheet__td--amount">
              {{ formatMoney(lineAmount(line)) }}
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="tux-statement-sheet__subtotal-row">
            <th scope="row" colspan="4" class="tux-statement-sheet__foot-th">
              Subtotal
            </th>
            <td class="tux-statement-sheet__foot-td">
              {{ formatMoney(subtotal) }}
            </td>
          </tr>
          <tr
            v-for="(adj, idx) in adjustments"
            :key="`adj-${idx}`"
            class="tux-statement-sheet__adj-row"
          >
            <th scope="row" colspan="4" class="tux-statement-sheet__foot-th tux-statement-sheet__foot-th--regular">
              {{ adj.label }}
            </th>
            <td class="tux-statement-sheet__foot-td">
              {{ adj.amount > 0 ? `+${formatMoney(adj.amount)}` : formatMoney(adj.amount) }}
            </td>
          </tr>
          <tr class="tux-statement-sheet__net-row">
            <th scope="row" colspan="4" class="tux-statement-sheet__net-th">
              Net Statement Total
            </th>
            <td class="tux-statement-sheet__net-td">
              {{ formatMoney(netTotal) }}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>

    <div
      v-if="approvals && approvals.length > 0"
      class="tux-statement-sheet__stamps-section"
    >
      <h3 class="tux-statement-sheet__section-heading">
        Attestation &amp; Signoff Stamps
      </h3>
      <div class="tux-statement-sheet__stamps-grid">
        <div
          v-for="stamp in approvals"
          :key="stamp.id"
          class="tux-statement-sheet__stamp-card"
        >
          <div class="tux-statement-sheet__stamp-top">
            <span class="tux-statement-sheet__stamp-role">{{ stamp.role }}</span>
            <span class="tux-statement-sheet__status-pill">
              <span
                class="tux-statement-sheet__dot"
                :class="`tux-statement-sheet__dot--stamp-${stamp.status}`"
                aria-hidden="true"
              />
              <span>{{ stampStatusLabel(stamp.status) }}</span>
            </span>
          </div>
          <strong class="tux-statement-sheet__stamp-signer">{{ stamp.signer }}</strong>
          <time
            v-if="stamp.timestamp"
            class="tux-statement-sheet__stamp-time"
            :datetime="stamp.timestamp"
          >
            {{ stamp.timestamp }}
          </time>
          <p v-if="stamp.decisionNote" class="tux-statement-sheet__stamp-note">
            {{ stamp.decisionNote }}
          </p>
        </div>
      </div>
    </div>

    <footer
      v-if="remittanceRef || digest"
      class="tux-statement-sheet__footer"
    >
      <div v-if="remittanceRef" class="tux-statement-sheet__token-group">
        <span class="tux-statement-sheet__token-label">Remittance Ref:</span>
        <code class="tux-statement-sheet__token">{{ remittanceRef }}</code>
      </div>
      <div v-if="digest" class="tux-statement-sheet__token-group">
        <span class="tux-statement-sheet__token-label">Verification Digest:</span>
        <code class="tux-statement-sheet__token">{{ digest }}</code>
      </div>
    </footer>
  </article>
</template>

<style scoped>
.tux-statement-sheet {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding: var(--space-24);
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-top: 3px solid var(--accent-gold, var(--brand-accent));
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-family: var(--font-body);
}

.tux-statement-sheet *,
.tux-statement-sheet *::before,
.tux-statement-sheet *::after {
  box-sizing: border-box;
}

.tux-statement-sheet__sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.tux-statement-sheet__header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-16);
  padding-bottom: var(--space-16);
  border-bottom: 1px solid var(--surface-border);
  min-width: 0;
}

.tux-statement-sheet__doc-meta {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  flex: 1 1 240px;
  min-width: 0;
}

.tux-statement-sheet__top-badges {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-8);
}

.tux-statement-sheet__id-badge {
  display: inline-block;
  padding: 2px var(--space-10);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-primary);
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
}

.tux-statement-sheet__status-pill {
  display: inline-flex;
  align-items: center;
  gap: var(--space-8);
  padding: 2px var(--space-10);
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-primary);
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-full);
}

.tux-statement-sheet__dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

.tux-statement-sheet__dot--settled,
.tux-statement-sheet__dot--stamp-approved {
  background: var(--status-ok);
}

.tux-statement-sheet__dot--pending,
.tux-statement-sheet__dot--stamp-pending {
  background: var(--status-warning);
}

.tux-statement-sheet__dot--draft {
  background: var(--status-maintenance);
}

.tux-statement-sheet__dot--void,
.tux-statement-sheet__dot--stamp-rejected {
  background: var(--status-critical);
}

.tux-statement-sheet__title {
  margin: 0;
  font-family: var(--font-bold);
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.25;
  color: var(--text-primary);
}

.tux-statement-sheet__dates {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-8);
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.tux-statement-sheet__dates strong {
  color: var(--text-primary);
  font-family: var(--font-mono);
}

.tux-statement-sheet__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-8);
}

.tux-statement-sheet__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: var(--space-8) var(--space-12);
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--text-primary);
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.tux-statement-sheet__btn:hover {
  border-color: var(--brand-primary);
}

.tux-statement-sheet__btn--primary {
  background-color: var(--brand-fill);
  color: var(--text-on-brand);
  border-color: var(--brand-fill);
}

.tux-statement-sheet__btn--primary:hover {
  background-color: var(--tti-maroon-deep);
  border-color: var(--tti-maroon-deep);
  color: var(--text-on-brand);
}

.tux-statement-sheet__parties {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 250px), 1fr));
  gap: var(--space-12);
  min-width: 0;
}

.tux-statement-sheet__party-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-12);
  background: var(--surface-eggshell);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  min-width: 0;
}

.tux-statement-sheet__party-heading {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider);
  color: var(--text-secondary);
}

.tux-statement-sheet__party-title-line {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-8);
}

.tux-statement-sheet__party-name {
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--text-primary);
}

.tux-statement-sheet__code {
  display: inline-block;
  padding: 2px var(--space-8);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-primary);
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
}

.tux-statement-sheet__party-detail {
  margin: 0;
  font-size: 0.8125rem;
  color: var(--text-secondary);
  overflow-wrap: anywhere;
}

.tux-statement-sheet__party-detail--mono {
  font-family: var(--font-mono);
  font-size: 0.75rem;
}

.tux-statement-sheet__scroll {
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  background: var(--surface-raised);
}

.tux-statement-sheet__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.tux-statement-sheet__th {
  padding: var(--space-12);
  text-align: left;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider);
  color: var(--text-secondary);
  background: var(--surface-sunken);
  border-bottom: 2px solid var(--surface-border);
  white-space: nowrap;
}

.tux-statement-sheet__th--num {
  text-align: right;
}

.tux-statement-sheet__row {
  border-bottom: 1px solid var(--surface-border-subtle);
}

.tux-statement-sheet__row-th {
  padding: var(--space-12);
  text-align: left;
  font-weight: 600;
  color: var(--text-primary);
  min-width: 200px;
}

.tux-statement-sheet__td {
  padding: var(--space-12);
  color: var(--text-primary);
  vertical-align: middle;
  white-space: nowrap;
}

.tux-statement-sheet__category-tag {
  display: inline-block;
  padding: 2px var(--space-8);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-primary);
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
}

.tux-statement-sheet__td--num {
  text-align: right;
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
}

.tux-statement-sheet__td--amount {
  font-weight: 700;
}

.tux-statement-sheet__subtotal-row {
  background: var(--surface-eggshell);
  border-top: 2px solid var(--surface-border);
}

.tux-statement-sheet__adj-row {
  background: var(--surface-eggshell);
  border-top: 1px solid var(--surface-border-subtle);
}

.tux-statement-sheet__foot-th {
  padding: var(--space-10) var(--space-12);
  text-align: right;
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--text-primary);
}

.tux-statement-sheet__foot-th--regular {
  font-weight: 600;
  color: var(--text-secondary);
}

.tux-statement-sheet__foot-td {
  padding: var(--space-10) var(--space-12);
  text-align: right;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.tux-statement-sheet__net-row {
  background: var(--surface-sunken);
  border-top: 2px solid var(--accent-gold, var(--brand-accent));
}

.tux-statement-sheet__net-th {
  padding: var(--space-12);
  text-align: right;
  font-family: var(--font-bold);
  font-size: 0.9375rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  color: var(--text-primary);
}

.tux-statement-sheet__net-td {
  padding: var(--space-12);
  text-align: right;
  font-family: var(--font-mono);
  font-size: 1.0625rem;
  font-weight: 700;
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.tux-statement-sheet__stamps-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-10);
  min-width: 0;
}

.tux-statement-sheet__section-heading {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider);
  color: var(--text-secondary);
}

.tux-statement-sheet__stamps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
  gap: var(--space-10);
  min-width: 0;
}

.tux-statement-sheet__stamp-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-12);
  background: var(--surface-eggshell);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  min-width: 0;
}

.tux-statement-sheet__stamp-top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-8);
}

.tux-statement-sheet__stamp-role {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-secondary);
}

.tux-statement-sheet__stamp-signer {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--text-primary);
}

.tux-statement-sheet__stamp-time {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.tux-statement-sheet__stamp-note {
  margin: var(--space-2) 0 0;
  font-size: 0.75rem;
  line-height: 1.4;
  color: var(--text-secondary);
}

.tux-statement-sheet__footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-12);
  padding-top: var(--space-12);
  border-top: 1px solid var(--surface-border);
  min-width: 0;
}

.tux-statement-sheet__token-group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-8);
  min-width: 0;
}

.tux-statement-sheet__token-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-secondary);
}

.tux-statement-sheet__token {
  padding: 2px var(--space-8);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-primary);
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  overflow-wrap: anywhere;
}

.tux-statement-sheet button:focus-visible,
.tux-statement-sheet__scroll:focus-visible {
  outline: 3px solid var(--focus-ring, var(--focus-ring-outer));
  outline-offset: 2px;
}

@media (max-width: 480px) {
  .tux-statement-sheet {
    padding: var(--space-16);
  }
}

@media print {
  .tux-statement-sheet__actions {
    display: none;
  }
}
</style>
