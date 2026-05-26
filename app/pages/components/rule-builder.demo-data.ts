import type { FieldDef, Group } from "~/components/TuxRuleBuilder.vue";

// Sibling demo data per ADR-0011. Field catalogs + initial trees are
// the kind of structured fixtures that need explicit types to be
// useful, and pages can't hold those annotations inline.

export const corridorFields: FieldDef[] = [
  { key: "corridor",   label: "Corridor",        type: "string" },
  { key: "miles",      label: "Length (mi)",     type: "number" },
  { key: "compliance", label: "Compliance (%)",  type: "number" },
  {
    key: "district",
    label: "TxDOT district",
    type: "select",
    options: [
      { value: "AUS", label: "Austin" },
      { value: "BRY", label: "Bryan" },
      { value: "DAL", label: "Dallas" },
      { value: "FTW", label: "Fort Worth" },
      { value: "HOU", label: "Houston" },
      { value: "SAT", label: "San Antonio" },
    ],
  },
  {
    key: "treatment",
    label: "Treatment",
    type: "select",
    options: [
      { value: "none",    label: "Untreated (control)" },
      { value: "lights",  label: "Lit beacons" },
      { value: "rumble",  label: "Rumble strips" },
      { value: "signage", label: "Editorial signage" },
    ],
  },
  { key: "lastInspected", label: "Last inspected", type: "date" },
  { key: "isActive",      label: "Active",         type: "boolean" },
];

export const initialQuery: Group = {
  id: "root",
  kind: "group",
  combinator: "AND",
  children: [
    {
      id: "r-1",
      kind: "rule",
      field: "miles",
      operator: ">",
      value: 5,
    },
    {
      id: "g-1",
      kind: "group",
      combinator: "OR",
      children: [
        {
          id: "r-2",
          kind: "rule",
          field: "district",
          operator: "is",
          value: "BRY",
        },
        {
          id: "r-3",
          kind: "rule",
          field: "district",
          operator: "is",
          value: "AUS",
        },
      ],
    },
    {
      id: "r-4",
      kind: "rule",
      field: "compliance",
      operator: "between",
      value: [40, 60],
    },
  ],
};

export const emptyQuery: Group = {
  id: "root",
  kind: "group",
  combinator: "AND",
  children: [],
};
