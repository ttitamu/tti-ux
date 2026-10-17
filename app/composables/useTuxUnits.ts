/**
 * useTuxUnits — Global TTI Transportation Engineering Unit System
 * composable (US Customary / AASHTO vs. Metric SI).
 *
 * Synchronizes measurement conversions across all `<TuxUnitValue>`
 * instances on the page with deterministic conversion factors for
 * speed, corridor distance, VMT/VKT, structural load (kip/kN),
 * pavement pressure (psi/kPa), freight tonnage, temperature, and
 * invariant traffic indices (AADT, PCE, SN40R).
 */
import type { Ref } from "vue";
import { useTuxPersistedRef } from "./useTuxPersistedRef";

export type TuxUnitSystem = "us" | "si";

export type TuxTransportationUnit =
  | "mph"
  | "mi"
  | "vmt"
  | "ft"
  | "in"
  | "kip"
  | "psi"
  | "ton"
  | "F"
  | "AADT"
  | "vph"
  | "PCE"
  | "SN"
  | "g"
  | "dB"
  | "%";

export interface TuxUnitSpec {
  usSymbol: string;
  siSymbol: string;
  name: string;
  toSi: (val: number) => number;
  deltaToSi: (delta: number) => number;
  convertible: boolean;
}

export const TUX_UNIT_SPECS: Record<TuxTransportationUnit, TuxUnitSpec> = {
  mph: {
    usSymbol: "mph",
    siSymbol: "km/h",
    name: "Corridor Speed",
    toSi: (v) => v * 1.609344,
    deltaToSi: (d) => d * 1.609344,
    convertible: true,
  },
  mi: {
    usSymbol: "mi",
    siSymbol: "km",
    name: "Centerline / Corridor Length",
    toSi: (v) => v * 1.609344,
    deltaToSi: (d) => d * 1.609344,
    convertible: true,
  },
  vmt: {
    usSymbol: "VMT",
    siSymbol: "VKT",
    name: "Vehicle Distance Traveled",
    toSi: (v) => v * 1.609344,
    deltaToSi: (d) => d * 1.609344,
    convertible: true,
  },
  ft: {
    usSymbol: "ft",
    siSymbol: "m",
    name: "Geometric Width / Clearance",
    toSi: (v) => v * 0.3048,
    deltaToSi: (d) => d * 0.3048,
    convertible: true,
  },
  in: {
    usSymbol: "in",
    siSymbol: "mm",
    name: "Pavement Layer / Rut Depth",
    toSi: (v) => v * 25.4,
    deltaToSi: (d) => d * 25.4,
    convertible: true,
  },
  kip: {
    usSymbol: "kip",
    siSymbol: "kN",
    name: "Axle / Structural Impact Load",
    toSi: (v) => v * 4.4482216,
    deltaToSi: (d) => d * 4.4482216,
    convertible: true,
  },
  psi: {
    usSymbol: "psi",
    siSymbol: "kPa",
    name: "Pavement / Subgrade Modulus",
    toSi: (v) => v * 6.894757,
    deltaToSi: (d) => d * 6.894757,
    convertible: true,
  },
  ton: {
    usSymbol: "tons",
    siSymbol: "t",
    name: "Freight Corridor Tonnage",
    toSi: (v) => v * 0.9071847,
    deltaToSi: (d) => d * 0.9071847,
    convertible: true,
  },
  F: {
    usSymbol: "°F",
    siSymbol: "°C",
    name: "Pavement / Ambient Temperature",
    toSi: (v) => ((v - 32) * 5) / 9,
    deltaToSi: (d) => (d * 5) / 9,
    convertible: true,
  },
  AADT: {
    usSymbol: "AADT",
    siSymbol: "AADT",
    name: "Annual Average Daily Traffic (veh/day)",
    toSi: (v) => v,
    deltaToSi: (d) => d,
    convertible: false,
  },
  vph: {
    usSymbol: "vph",
    siSymbol: "veh/h",
    name: "Hourly Lane Flow Rate",
    toSi: (v) => v,
    deltaToSi: (d) => d,
    convertible: false,
  },
  PCE: {
    usSymbol: "PCE",
    siSymbol: "PCE",
    name: "Passenger Car Equivalents (HCM)",
    toSi: (v) => v,
    deltaToSi: (d) => d,
    convertible: false,
  },
  SN: {
    usSymbol: "SN40R",
    siSymbol: "SN65R",
    name: "Locked-Wheel Skid Number",
    toSi: (v) => v,
    deltaToSi: (d) => d,
    convertible: false,
  },
  g: {
    usSymbol: "g",
    siSymbol: "g",
    name: "Crash Test Deceleration (MASH)",
    toSi: (v) => v,
    deltaToSi: (d) => d,
    convertible: false,
  },
  dB: {
    usSymbol: "dBA",
    siSymbol: "dBA",
    name: "Tire-Pavement Acoustic Level",
    toSi: (v) => v,
    deltaToSi: (d) => d,
    convertible: false,
  },
  "%": {
    usSymbol: "%",
    siSymbol: "%",
    name: "Grade / Share Percentage",
    toSi: (v) => v,
    deltaToSi: (d) => d,
    convertible: false,
  },
};

export interface ConvertedUnitResult {
  numericValue: number;
  formattedValue: string;
  formattedCi?: string;
  unitSymbol: string;
  unitName: string;
  convertible: boolean;
  system: TuxUnitSystem;
}

export function formatEngineeringUnit(
  value: number,
  unit: TuxTransportationUnit,
  system: TuxUnitSystem = "us",
  options: { decimals?: number; ci?: number } = {},
): ConvertedUnitResult {
  const spec = TUX_UNIT_SPECS[unit] ?? {
    usSymbol: String(unit),
    siSymbol: String(unit),
    name: String(unit),
    toSi: (v: number) => v,
    deltaToSi: (d: number) => d,
    convertible: false,
  };

  const decimals = options.decimals ?? (Number.isInteger(value) && system === "us" ? 0 : 1);
  const numericValue = system === "si" ? spec.toSi(value) : value;
  const formattedValue = numericValue.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  let formattedCi: string | undefined;
  if (typeof options.ci === "number" && Number.isFinite(options.ci)) {
    const ciVal = system === "si" ? spec.deltaToSi(options.ci) : options.ci;
    formattedCi = ciVal.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }

  return {
    numericValue,
    formattedValue,
    formattedCi,
    unitSymbol: system === "si" ? spec.siSymbol : spec.usSymbol,
    unitName: spec.name,
    convertible: spec.convertible,
    system,
  };
}

/**
 * Format a centerline distance in feet as civil-engineering highway stationing
 * (1 station = 100 ft -> e.g. 1250 ft -> "STA 12+50", 52800 ft -> "STA 528+00").
 */
export function formatStationing(feet: number, decimals = 0): string {
  const absFeet = Math.max(0, feet);
  const stations = Math.floor(absFeet / 100);
  const remainder = absFeet - stations * 100;
  const stationStr = String(stations).padStart(2, "0");
  const remStr =
    decimals > 0
      ? remainder.toFixed(decimals).padStart(3 + decimals, "0")
      : String(Math.round(remainder)).padStart(2, "0");
  return `STA ${stationStr}+${remStr}`;
}

let sharedUnitSystem: Ref<TuxUnitSystem> | null = null;

export function useTuxUnits() {
  if (!sharedUnitSystem) {
    sharedUnitSystem = useTuxPersistedRef<TuxUnitSystem>(
      () => "tux-unit-system",
      "us",
    );
  }

  function toggleUnitSystem() {
    if (sharedUnitSystem) {
      sharedUnitSystem.value = sharedUnitSystem.value === "us" ? "si" : "us";
    }
  }

  function setUnitSystem(sys: TuxUnitSystem) {
    if (sharedUnitSystem) {
      sharedUnitSystem.value = sys;
    }
  }

  return {
    unitSystem: sharedUnitSystem,
    toggleUnitSystem,
    setUnitSystem,
    formatEngineeringUnit,
    formatStationing,
  };
}
