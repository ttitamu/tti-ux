/**
 * One document with every kind of shape error the schema reports (#163): a required field left out, a value of
 * another JSON type, an element kind and an enum value this release does not list. Nothing in it is a structure
 * error (every id is unique, every relationship has both ends), so the validator has warnings and no issue.
 */
import { TUX_MAP_SCHEMA } from "../../app/utils/tuxArchitectureMap";

export function everyShapeError(): Record<string, any> {
  const doc: Record<string, any> = {
    schema: TUX_MAP_SCHEMA,
    level1: { elements: [], rels: [] },
    level2: { boundary: "sys", elements: [{ id: "c-a", name: "A" }], rels: [] },
    level3: { "c-a": [{ id: "k-one", name: "One" }] },
    level4: { groups: [], nodes: [{ id: "vm", kind: "vm", title: "VM", role: "host" }], links: [] },
  };
  doc.level1.elements = [
    { id: "sys", kind: "queue", status: "retired", at: [1], runs: 7, source: "a/b.ts", children: {}, live: [] },
    "sys-2",
    null,
    { id: 9, name: ["n"] },
  ];
  doc.level1.rels = { from: "sys", to: "sys" };
  doc.level2.boundary = 4;
  doc.level2.elements.push({ id: "c-b", name: "B", deployed: { vm: true }, roadmap: "12", diff: { changeType: "moved" } });
  doc.level2.rels = [{ from: "c-a", to: "c-b", label: 5 }, { from: "c-a", to: "c-b", violations: [{ severity: "fatal" }] }];
  doc.level3["c-a"].push({ id: "k-two", name: "Two", childRels: "none", vendoredCopies: [1] });
  doc.level3["c-b"] = "k-three";
  doc.level4.zones = "left";
  doc.level4.nodes.push({ id: "vm-2", hosts: "c-a", facts: { rules: [{ direction: "sideways" }], images: "x" } });
  doc.level4.links = [{ from: "vm", to: "vm-2", label: 5 }];
  doc.subgraphs = { "k-one": { elements: "f-a", rels: 3 }, "k-two": [], "k-three": { stratum: 1 } };
  doc.links = { from: "k-one", to: "k-two" };
  doc.linkTiers = [];
  doc.stopKinds = "calls";
  doc.aliases = { old: 1 };
  doc.routes = [{ pattern: 1 }];
  return doc;
}
