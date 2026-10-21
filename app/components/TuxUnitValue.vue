<script setup lang="ts">
/**
 * TuxUnitValue — Scientific & civil-engineering measurement primitive
 * for Texas A&M Transportation Institute (TTI) telemetry, reports, and tables.
 *
 * Formats transportation quantities (mph ↔ km/h, mi ↔ km, VMT ↔ VKT,
 * kip ↔ kN, psi ↔ kPa, tons ↔ t, °F ↔ °C, AADT, PCE, SN40R) with
 * tabular numerals, optional ± confidence intervals, optional highway
 * stationing markers (e.g. "STA 04+50"), and a live US Customary ↔ Metric (SI)
 * toggle synchronized across the page via `useTuxUnits()`.
 */
import { computed } from "vue";
import {
  formatEngineeringUnit,
  useTuxUnits,
  type TuxTransportationUnit,
  type TuxUnitSystem,
} from "../composables/useTuxUnits";

interface Props {
  /** Base numeric value (authored in US Customary units by default). */
  value: number;
  /** Transportation / pavement engineering unit code. */
  unit: TuxTransportationUnit;
  /** Optional 95% confidence interval half-width (± CI). */
  ci?: number;
  /** Decimal precision override. */
  decimals?: number;
  /** Optional metric label or corridor caption. */
  label?: string;
  /** Optional civil-engineering stationing or milepost reference (e.g. "STA 14+20" or "IH-35 RM 234"). */
  station?: string;
  /** Display scale: inline (prose/table cell), pill (chip), or card (stat tile). */
  variant?: "inline" | "pill" | "card";
  /** Show interactive US ↔ SI unit-system toggle button. */
  interactive?: boolean;
  /** Optional explicit unit-system override ("us" | "si"); defaults to global useTuxUnits(). */
  system?: TuxUnitSystem;
  /** Optional TTI 5-band research division accent ("maroon" | "blue" | "teal" | "green" | "gold"). */
  division?: "maroon" | "blue" | "teal" | "green" | "gold";
}

const props = withDefaults(defineProps<Props>(), {
  ci: undefined,
  decimals: undefined,
  label: "",
  station: "",
  variant: "inline",
  interactive: false,
  system: undefined,
  division: undefined,
});

const { unitSystem, toggleUnitSystem } = useTuxUnits();

const effectiveSystem = computed<TuxUnitSystem>(
  () => props.system ?? unitSystem.value,
);

const converted = computed(() =>
  formatEngineeringUnit(props.value, props.unit, effectiveSystem.value, {
    decimals: props.decimals,
    ci: props.ci,
  }),
);
</script>

<template>
  <span
    class="tux-unit-value"
    :class="[
      `tux-unit-value--${variant}`,
      division ? `tux-unit-value--division-${division}` : '',
    ]"
  >
    <span v-if="station || label" class="tux-unit-value__header">
      <span v-if="station" class="tux-unit-value__station">{{ station }}</span>
      <span v-if="label" class="tux-unit-value__label">{{ label }}</span>
    </span>

    <span class="tux-unit-value__reading">
      <span class="tux-unit-value__number">{{ converted.formattedValue }}</span>
      <span
        v-if="converted.formattedCi"
        class="tux-unit-value__ci"
        title="95% Confidence Interval"
      >
        ± {{ converted.formattedCi }}
      </span>
      <abbr class="tux-unit-value__symbol" :title="converted.unitName">
        {{ converted.unitSymbol }}
      </abbr>

      <button
        v-if="interactive && converted.convertible"
        type="button"
        class="tux-unit-value__toggle"
        :aria-label="effectiveSystem === 'us' ? 'US → SI (Switch to Metric SI)' : 'SI → US (Switch to US Customary)'"
        @click="toggleUnitSystem"
      >
        {{ effectiveSystem === "us" ? "US → SI" : "SI → US" }}
      </button>
    </span>
  </span>
</template>

<style scoped>
.tux-unit-value {
  --unit-accent: var(--brand-primary);
  font-family: var(--font-body);
  font-variant-numeric: tabular-nums;
  color: var(--text-primary);
}

.tux-unit-value--division-maroon {
  --unit-accent: var(--spectrum-maroon, var(--brand-primary));
}
.tux-unit-value--division-blue {
  --unit-accent: var(--spectrum-blue, var(--brand-secondary));
}
.tux-unit-value--division-teal {
  --unit-accent: var(--spectrum-teal, var(--brand-primary));
}
.tux-unit-value--division-green {
  --unit-accent: var(--spectrum-green, var(--color-success));
}
.tux-unit-value--division-gold {
  --unit-accent: var(--spectrum-gold, var(--brand-accent));
}

.tux-unit-value--inline {
  display: inline-flex;
  align-items: baseline;
  gap: 0.35rem;
}

.tux-unit-value--pill {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.2rem 0.6rem;
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-left: 3px solid var(--unit-accent);
  border-radius: var(--radius-sm);
}

.tux-unit-value--card {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 0.875rem 1rem;
  background: var(--surface-raised);
  border: 1px solid var(--surface-border);
  border-top: 3px solid var(--unit-accent);
  border-radius: var(--radius-md);
}

.tux-unit-value__header {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
}

.tux-unit-value__station {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.08rem 0.375rem;
  background: color-mix(in srgb, var(--unit-accent) 12%, transparent);
  color: var(--text-primary);
  border-radius: var(--radius-sm);
}

.tux-unit-value__label {
  font-family: var(--font-bold);
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-secondary);
}

.tux-unit-value__reading {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.3rem;
}

.tux-unit-value__number {
  font-family: var(--font-mono);
  font-weight: 700;
  color: var(--text-primary);
}

.tux-unit-value--card .tux-unit-value__number {
  font-size: 1.5rem;
  line-height: 1.15;
}

.tux-unit-value__ci {
  font-family: var(--font-mono);
  font-size: 0.78em;
  color: var(--text-secondary);
}

.tux-unit-value__symbol {
  font-family: var(--font-mono);
  font-size: 0.78em;
  font-weight: 600;
  color: var(--text-secondary);
  text-decoration: underline dotted var(--surface-border);
  cursor: help;
}

.tux-unit-value__toggle {
  margin-left: 0.25rem;
  padding: 0.1rem 0.4rem;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--text-primary);
  background: var(--surface-sunken);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.tux-unit-value__toggle:hover {
  border-color: var(--unit-accent);
  background: color-mix(in srgb, var(--unit-accent) 12%, transparent);
}
</style>
