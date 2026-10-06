import type { TuxOpsState } from "../../utils/tux-ops";

export const hosts: {
  name: string;
  service: string;
  state: TuxOpsState;
  duration: string;
  info: string;
}[] = [
  {
    name: "code.tti.tamu.edu",
    service: "HTTPS",
    state: "ok",
    duration: "14d 3h",
    info: "HTTP OK 200 — 0.082s",
  },
  {
    name: "atlas.tti.tamu.edu",
    service: "PHP origin",
    state: "critical",
    duration: "23m",
    info: "HTTP CRITICAL — 502",
  },
  {
    name: "aap.tti.tamu.edu",
    service: "API",
    state: "warning",
    duration: "2h 11m",
    info: "latency 1.4s (warn 1.0)",
  },
  {
    name: "azure-estate",
    service: "Arc agent health",
    state: "unknown",
    duration: "41m",
    info: "22/38 agents not reporting",
  },
  {
    name: "lab-gpu-04",
    service: "SSH",
    state: "maintenance",
    duration: "4h",
    info: "scheduled downtime",
  },
];

export const kpis: { value: string; label: string; state: TuxOpsState }[] = [
  { value: "74", label: "Hosts up", state: "ok" },
  { value: "3", label: "Unhandled", state: "critical" },
  { value: "1", label: "In downtime", state: "maintenance" },
];

export const loadTrend = [0.42, 0.38, 0.51, 0.47, 0.62, 0.58, 0.71, 0.66, 0.54, 0.49];
