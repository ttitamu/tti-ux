#!/usr/bin/env node
/**
 * build-map-api.mjs — Writes the API snapshots of the Modular Architecture Map
 * (M.A.P.) and checks them:
 *
 *   api/map-runtime.api.md    every export of the published runtime typings
 *                             (`runtime/tuxArchitectureMap.d.mts`,
 *                             `runtime/tuxArchitectureMapSample.d.mts`): the
 *                             `@public` ones with their declarations, the
 *                             `@internal` ones by name.
 *   api/map-component.api.md  the contract of `<TuxArchitectureMap>`: props
 *                             with defaults, events, v-model bindings, slots,
 *                             exposed members and exported types.
 *
 * The snapshots are committed. A change to the public surface therefore shows
 * up in review as a diff of a sorted, readable file, and `--check` (part of
 * the package's `test` script) fails until the snapshot is regenerated on
 * purpose (`tti/tti-ux#161`).
 *
 * It also refuses, in both modes:
 *   - an export tagged neither `@public` nor `@internal`, or both;
 *   - a `@public` declaration that names an `@internal` type;
 *   - a value the runtime `.mjs` exports that the typings do not declare, or
 *     the reverse.
 *
 * Usage:
 *   node packages/diagrams/scripts/build-map-api.mjs          # write the snapshots
 *   node packages/diagrams/scripts/build-map-api.mjs --check  # verify they are current
 *   node packages/diagrams/scripts/build-map-api.mjs --json   # print the collected surface
 *
 * Run `build-map-runtime.mjs` first: the runtime snapshot is read from the
 * built typings, so it describes what is published.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(__dirname, "..");
const apiDir = path.join(pkgRoot, "api");
const REGENERATE = "npm run build:api -w @tti/tti-ux-diagrams";

const RUNTIME_ENTRIES = [
  { entry: "@tti/tti-ux-diagrams/runtime/tuxArchitectureMap", stem: "tuxArchitectureMap" },
  { entry: "@tti/tti-ux-diagrams/runtime/tuxArchitectureMapSample", stem: "tuxArchitectureMapSample" },
];
const COMPONENT = {
  name: "TuxArchitectureMap",
  relPath: "app/components/TuxArchitectureMap.vue",
};
const RUNTIME_SNAPSHOT = path.join(apiDir, "map-runtime.api.md");
const COMPONENT_SNAPSHOT = path.join(apiDir, "map-component.api.md");

const KIND_ORDER = ["const", "function", "interface", "type"];
const KIND_HEADINGS = { const: "Constants", function: "Functions", interface: "Interfaces", type: "Type aliases" };

let ts;
try {
  const mod = await import("typescript");
  ts = mod.default ?? mod;
} catch {
  console.error("build-map-api: `typescript` is required (`npm ci`).");
  process.exit(1);
}

/** Codepoint order: the same on every platform and locale. */
function byCodepoint(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

function rel(p) {
  return path.relative(pkgRoot, p).replace(/\\/g, "/");
}

const printer = ts.createPrinter({ removeComments: true, newLine: ts.NewLineKind.LineFeed });

function printNode(node, sf) {
  return printer.printNode(ts.EmitHint.Unspecified, node, sf).replace(/\r\n/g, "\n").trim();
}

/** One line, single spaces: for types shown inside a list item. */
function inline(text) {
  return text.replace(/\s+/g, " ").trim();
}

function isExported(node) {
  return (ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export) !== 0
    || Boolean(node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword));
}

function declarationsOf(statement) {
  if (ts.isFunctionDeclaration(statement) && statement.name) return [{ name: statement.name.text, kind: "function" }];
  if (ts.isInterfaceDeclaration(statement)) return [{ name: statement.name.text, kind: "interface" }];
  if (ts.isTypeAliasDeclaration(statement)) return [{ name: statement.name.text, kind: "type" }];
  if (ts.isClassDeclaration(statement) && statement.name) return [{ name: statement.name.text, kind: "class" }];
  if (ts.isEnumDeclaration(statement)) return [{ name: statement.name.text, kind: "enum" }];
  if (ts.isVariableStatement(statement)) {
    return statement.declarationList.declarations
      .filter((d) => ts.isIdentifier(d.name))
      .map((d) => ({ name: d.name.text, kind: "const" }));
  }
  return null;
}

// ============================================================================
// Runtime typings
// ============================================================================

function collectRuntimeEntry({ entry, stem }, problems) {
  const dmtsPath = path.join(pkgRoot, "runtime", `${stem}.d.mts`);
  const mjsPath = path.join(pkgRoot, "runtime", `${stem}.mjs`);
  for (const p of [dmtsPath, mjsPath]) {
    if (!existsSync(p)) {
      problems.push(`${rel(p)} is missing; run \`npm run build:runtime -w @tti/tti-ux-diagrams\` first.`);
      return { entry, items: [] };
    }
  }
  const sf = ts.createSourceFile(dmtsPath, readFileSync(dmtsPath, "utf8"), ts.ScriptTarget.ES2022, true, ts.ScriptKind.TS);
  const items = [];
  for (const statement of sf.statements) {
    if (ts.isExportDeclaration(statement)) {
      // `export {};` marks the file as a module and exports nothing.
      const named = statement.exportClause && ts.isNamedExports(statement.exportClause) ? statement.exportClause.elements : null;
      if (statement.moduleSpecifier || !named || named.length > 0) {
        problems.push(`${rel(dmtsPath)}: re-exports (\`${inline(statement.getText(sf))}\`) are not supported by the API snapshot; declare the export in place or teach scripts/build-map-api.mjs about it.`);
      }
      continue;
    }
    if (ts.isExportAssignment(statement)) {
      problems.push(`${rel(dmtsPath)}: a default export is not part of the runtime's contract.`);
      continue;
    }
    if (!isExported(statement)) continue;
    const declared = declarationsOf(statement);
    if (!declared) {
      problems.push(`${rel(dmtsPath)}: unsupported exported statement \`${inline(statement.getText(sf)).slice(0, 80)}\`.`);
      continue;
    }
    const tags = ts.getJSDocTags(statement).map((t) => t.tagName.text);
    const isPublic = tags.includes("public");
    const isInternal = tags.includes("internal");
    const text = printNode(statement, sf);
    for (const { name, kind } of declared) {
      if (isPublic === isInternal) {
        problems.push(
          `${entry}: \`${name}\` is tagged ${isPublic ? "both @public and @internal" : "neither @public nor @internal"}. `
          + "Every export of the map runtime carries exactly one of them in its TSDoc comment "
          + "(`@public`: consumers may rely on it; `@internal`: may change without notice).",
        );
      }
      items.push({
        name,
        kind,
        release: isInternal && !isPublic ? "internal" : "public",
        deprecated: tags.includes("deprecated"),
        text,
        node: statement,
      });
    }
  }

  const seen = new Set();
  for (const item of items) {
    if (seen.has(item.name) && item.kind !== "function") problems.push(`${entry}: \`${item.name}\` is exported more than once.`);
    seen.add(item.name);
  }

  // A public declaration must be usable without an internal name.
  const internalNames = new Set(items.filter((i) => i.release === "internal").map((i) => i.name));
  for (const item of items) {
    if (item.release !== "public") continue;
    const used = new Set();
    const visit = (n) => {
      if (ts.isIdentifier(n) && internalNames.has(n.text) && n.text !== item.name) {
        const p = n.parent;
        const isMemberName = p && (ts.isPropertySignature(p) || ts.isMethodSignature(p) || ts.isParameter(p) || ts.isPropertyAssignment(p)) && p.name === n;
        if (!isMemberName) used.add(n.text);
      }
      ts.forEachChild(n, visit);
    };
    visit(item.node);
    for (const name of [...used].sort(byCodepoint)) {
      problems.push(`${entry}: public \`${item.name}\` names internal \`${name}\`. Mark \`${name}\` @public, or keep it out of the public declaration.`);
    }
  }

  // The typings and the module must agree on what is exported at run time.
  const js = ts.createSourceFile(mjsPath, readFileSync(mjsPath, "utf8"), ts.ScriptTarget.ES2022, false, ts.ScriptKind.JS);
  const jsValues = new Set();
  for (const statement of js.statements) {
    if (ts.isExportDeclaration(statement) || ts.isExportAssignment(statement)) {
      problems.push(`${rel(mjsPath)}: \`${inline(statement.getText(js)).slice(0, 80)}\` is not supported by the API snapshot.`);
      continue;
    }
    if (!isExported(statement)) continue;
    for (const d of declarationsOf(statement) ?? []) jsValues.add(d.name);
  }
  const typedValues = new Set(items.filter((i) => i.kind !== "interface" && i.kind !== "type").map((i) => i.name));
  for (const name of [...jsValues].sort(byCodepoint)) {
    if (!typedValues.has(name)) problems.push(`${rel(mjsPath)} exports \`${name}\`, which ${rel(dmtsPath)} does not declare.`);
  }
  for (const name of [...typedValues].sort(byCodepoint)) {
    if (!jsValues.has(name)) problems.push(`${rel(dmtsPath)} declares \`${name}\`, which ${rel(mjsPath)} does not export.`);
  }

  items.sort((a, b) => byCodepoint(a.name, b.name));
  return { entry, items: items.map(({ node: _node, ...item }) => item) };
}

function renderRuntimeSnapshot(entries) {
  const out = [
    "# Architecture map runtime: API surface",
    "",
    "<!-- GENERATED by scripts/build-map-api.mjs from runtime/*.d.mts. DO NOT EDIT. -->",
    `<!-- Regenerate: ${REGENERATE} -->`,
    "",
    "Every export of the published runtime entry points, sorted by name within its kind.",
    "`@public` exports are listed with their declarations: consumers may rely on them, and",
    "a change here is a change to the package's API. `@internal` exports are listed by name:",
    "they stay importable, and they may change or go away in any release without notice.",
    "",
  ];
  for (const { entry, items } of entries) {
    const pub = items.filter((i) => i.release === "public");
    const internal = items.filter((i) => i.release === "internal");
    out.push(`## \`${entry}\``, "", `${pub.length} public, ${internal.length} internal.`, "");
    out.push(`### Public (${pub.length})`, "");
    const kinds = [...new Set([...KIND_ORDER, ...pub.map((i) => i.kind).sort(byCodepoint)])];
    for (const kind of kinds) {
      const group = pub.filter((i) => i.kind === kind);
      if (!group.length) continue;
      out.push(`#### ${KIND_HEADINGS[kind] ?? kind} (${group.length})`, "");
      for (const item of group) {
        out.push(`##### \`${item.name}\`${item.deprecated ? " (deprecated)" : ""}`, "", "```ts", item.text, "```", "");
      }
    }
    out.push(`### Internal (${internal.length})`, "");
    if (!internal.length) out.push("None.", "");
    else {
      for (const item of internal) out.push(`- \`${item.name}\` (${item.kind})`);
      out.push("");
    }
  }
  return `${out.join("\n").trimEnd()}\n`;
}

/** Reads a runtime snapshot back into `entry::name` → `{ release, text }` for a readable diff. */
function parseRuntimeSnapshot(text) {
  const map = new Map();
  let entry = "";
  let release = "";
  let name = null;
  let block = null;
  for (const line of text.split("\n")) {
    if (block) {
      if (line === "```") {
        map.set(`${entry}::${name}`, { release: "public", text: block.join("\n") });
        block = null;
        name = null;
      } else block.push(line);
      continue;
    }
    let m;
    if ((m = /^## `(.+)`$/.exec(line))) entry = m[1];
    else if (/^### Public/.test(line)) release = "public";
    else if (/^### Internal/.test(line)) release = "internal";
    else if ((m = /^##### `(\w+)`( \(deprecated\))?$/.exec(line))) name = `${m[1]}${m[2] ? " [deprecated]" : ""}`;
    else if (line === "```ts" && name) block = [];
    else if (release === "internal" && (m = /^- `(\w+)` \((\w+)\)$/.exec(line))) map.set(`${entry}::${m[1]}`, { release: "internal", text: m[2] });
  }
  return map;
}

function describeRuntimeDrift(committed, generated) {
  const before = parseRuntimeSnapshot(committed);
  const after = parseRuntimeSnapshot(generated);
  const plain = (key) => key.replace(" [deprecated]", "");
  const beforeByName = new Map([...before].map(([k, v]) => [plain(k), { key: k, ...v }]));
  const afterByName = new Map([...after].map(([k, v]) => [plain(k), { key: k, ...v }]));
  const lines = [];
  for (const [key, now] of afterByName) {
    const was = beforeByName.get(key);
    const label = key.replace("::", " :: ");
    if (!was) lines.push(`  + added (${now.release}): ${label}`);
    else if (was.release !== now.release) lines.push(`  ~ ${was.release} -> ${now.release}: ${label}`);
    else if (was.key !== now.key) lines.push(`  ~ deprecation changed: ${label}`);
    else if (was.text !== now.text) lines.push(`  ~ ${now.release === "public" ? "declaration changed" : "kind changed"}: ${label}`);
  }
  for (const [key, was] of beforeByName) {
    if (!afterByName.has(key)) lines.push(`  - removed (${was.release}): ${key.replace("::", " :: ")}`);
  }
  return lines.sort(byCodepoint);
}

// ============================================================================
// Component contract
// ============================================================================

function unwrap(node) {
  let n = node;
  while (n && (ts.isParenthesizedExpression(n) || ts.isAsExpression(n) || ts.isSatisfiesExpression(n) || ts.isNonNullExpression(n))) n = n.expression;
  return n;
}

function findMacroCalls(sf, macro) {
  const calls = [];
  const visit = (n) => {
    if (ts.isCallExpression(n) && ts.isIdentifier(n.expression) && n.expression.text === macro) calls.push(n);
    ts.forEachChild(n, visit);
  };
  visit(sf);
  return calls;
}

function memberName(member) {
  if (!member.name) return null;
  if (ts.isIdentifier(member.name) || ts.isStringLiteral(member.name) || ts.isNumericLiteral(member.name)) return member.name.text;
  return member.name.getText();
}

function resolveTypeMembers(typeNode, sf, problems, what) {
  if (!typeNode) return null;
  if (ts.isTypeLiteralNode(typeNode)) return typeNode.members;
  if (ts.isTypeReferenceNode(typeNode) && ts.isIdentifier(typeNode.typeName)) {
    const name = typeNode.typeName.text;
    for (const statement of sf.statements) {
      if (ts.isInterfaceDeclaration(statement) && statement.name.text === name) {
        if (statement.heritageClauses?.length) problems.push(`${COMPONENT.relPath}: ${what} interface \`${name}\` extends another type; the snapshot lists only its own members.`);
        return statement.members;
      }
      if (ts.isTypeAliasDeclaration(statement) && statement.name.text === name) return resolveTypeMembers(statement.type, sf, problems, what);
    }
  }
  problems.push(`${COMPONENT.relPath}: cannot read the ${what} type \`${inline(typeNode.getText(sf)).slice(0, 80)}\`; declare it as an interface or a type literal in the component.`);
  return null;
}

async function collectComponent(problems) {
  const vuePath = path.join(pkgRoot, COMPONENT.relPath);
  let sfc;
  try {
    sfc = await import("@vue/compiler-sfc");
  } catch {
    problems.push("`@vue/compiler-sfc` is required to read the component contract (`npm ci`).");
    return null;
  }
  const { descriptor, errors } = sfc.parse(readFileSync(vuePath, "utf8").replace(/\r\n/g, "\n"), { filename: vuePath });
  if (errors.length) {
    problems.push(`${COMPONENT.relPath}: ${errors.map((e) => e.message).join("; ")}`);
    return null;
  }
  const scriptText = [descriptor.script?.content ?? "", descriptor.scriptSetup?.content ?? ""].join("\n");
  const sf = ts.createSourceFile(`${COMPONENT.name}.ts`, scriptText, ts.ScriptTarget.ES2022, true, ts.ScriptKind.TS);

  // Props and their defaults
  const props = [];
  let propsTypeName = null;
  const [propsCall, ...extraProps] = findMacroCalls(sf, "defineProps");
  if (extraProps.length) problems.push(`${COMPONENT.relPath}: more than one defineProps() call.`);
  const defaults = new Map();
  for (const call of findMacroCalls(sf, "withDefaults")) {
    const arg = unwrap(call.arguments[1]);
    if (!arg || !ts.isObjectLiteralExpression(arg)) {
      problems.push(`${COMPONENT.relPath}: withDefaults() needs an object literal for the snapshot to read the defaults.`);
      continue;
    }
    for (const p of arg.properties) {
      const name = memberName(p);
      if (!name || !ts.isPropertyAssignment(p)) {
        problems.push(`${COMPONENT.relPath}: unsupported entry in withDefaults(): \`${inline(p.getText(sf)).slice(0, 60)}\`.`);
        continue;
      }
      defaults.set(name, inline(printNode(p.initializer, sf)));
    }
  }
  if (propsCall) {
    const typeArg = propsCall.typeArguments?.[0];
    if (typeArg && ts.isTypeReferenceNode(typeArg) && ts.isIdentifier(typeArg.typeName)) propsTypeName = typeArg.typeName.text;
    const runtimeArg = unwrap(propsCall.arguments[0]);
    if (typeArg) {
      for (const member of resolveTypeMembers(typeArg, sf, problems, "props") ?? []) {
        const name = memberName(member);
        if (!name || !ts.isPropertySignature(member)) {
          problems.push(`${COMPONENT.relPath}: unsupported props member \`${inline(member.getText(sf)).slice(0, 60)}\`.`);
          continue;
        }
        props.push({
          name,
          optional: Boolean(member.questionToken),
          type: member.type ? inline(printNode(member.type, sf)) : "any",
          default: defaults.has(name) ? defaults.get(name) : null,
        });
      }
    } else if (runtimeArg && ts.isObjectLiteralExpression(runtimeArg)) {
      for (const p of runtimeArg.properties) {
        const name = memberName(p);
        if (name) props.push({ name, optional: true, type: ts.isPropertyAssignment(p) ? inline(printNode(p.initializer, sf)) : "any", default: null });
      }
    } else if (runtimeArg && ts.isArrayLiteralExpression(runtimeArg)) {
      for (const e of runtimeArg.elements) if (ts.isStringLiteral(e)) props.push({ name: e.text, optional: true, type: "any", default: null });
    } else problems.push(`${COMPONENT.relPath}: cannot read defineProps().`);
  }
  for (const name of defaults.keys()) {
    if (!props.some((p) => p.name === name)) problems.push(`${COMPONENT.relPath}: withDefaults() names \`${name}\`, which is not a prop.`);
  }

  // defineModel() declares a prop and its update event in one call.
  const models = [];
  for (const call of findMacroCalls(sf, "defineModel")) {
    const first = unwrap(call.arguments[0]);
    const name = first && ts.isStringLiteral(first) ? first.text : "modelValue";
    models.push(name);
    props.push({ name, optional: true, type: call.typeArguments?.[0] ? inline(printNode(call.typeArguments[0], sf)) : "any", default: null });
  }

  // Events
  const events = [];
  const [emitsCall, ...extraEmits] = findMacroCalls(sf, "defineEmits");
  if (extraEmits.length) problems.push(`${COMPONENT.relPath}: more than one defineEmits() call.`);
  if (emitsCall) {
    const typeArg = emitsCall.typeArguments?.[0];
    const runtimeArg = unwrap(emitsCall.arguments[0]);
    if (typeArg) {
      for (const member of resolveTypeMembers(typeArg, sf, problems, "emits") ?? []) {
        if (ts.isCallSignatureDeclaration(member)) {
          const [first, ...rest] = member.parameters;
          const lit = first?.type && ts.isLiteralTypeNode(first.type) && ts.isStringLiteral(first.type.literal) ? first.type.literal.text : null;
          if (!lit) {
            problems.push(`${COMPONENT.relPath}: unsupported emits signature \`${inline(member.getText(sf)).slice(0, 80)}\`; name one event per call signature.`);
            continue;
          }
          events.push({ name: lit, payload: rest.map((p) => inline(printNode(p, sf))).join(", ") });
        } else if (ts.isPropertySignature(member) && member.type) {
          events.push({ name: memberName(member), payload: inline(printNode(member.type, sf)) });
        } else problems.push(`${COMPONENT.relPath}: unsupported emits member \`${inline(member.getText(sf)).slice(0, 80)}\`.`);
      }
    } else if (runtimeArg && ts.isArrayLiteralExpression(runtimeArg)) {
      for (const e of runtimeArg.elements) if (ts.isStringLiteral(e)) events.push({ name: e.text, payload: "..." });
    } else if (runtimeArg && ts.isObjectLiteralExpression(runtimeArg)) {
      for (const p of runtimeArg.properties) if (memberName(p)) events.push({ name: memberName(p), payload: "..." });
    } else problems.push(`${COMPONENT.relPath}: cannot read defineEmits().`);
  }
  for (const name of models) events.push({ name: `update:${name}`, payload: "value" });

  // Slots: declared (defineSlots) and rendered (<slot> in the template)
  const slots = new Map();
  for (const call of findMacroCalls(sf, "defineSlots")) {
    for (const member of resolveTypeMembers(call.typeArguments?.[0], sf, problems, "slots") ?? []) {
      const name = memberName(member);
      if (name) slots.set(name, inline(printNode(member, sf)));
    }
  }
  const walkTemplate = (node) => {
    if (!node) return;
    if (node.type === 1 && node.tag === "slot") {
      const nameProp = node.props.find((p) => (p.type === 6 && p.name === "name") || (p.type === 7 && p.name === "bind" && p.arg?.content === "name"));
      const name = !nameProp ? "default" : nameProp.type === 6 ? (nameProp.value?.content ?? "default") : `[${nameProp.exp?.content ?? "dynamic"}]`;
      const scope = node.props
        .filter((p) => p !== nameProp && !(p.type === 7 && p.name !== "bind"))
        .map((p) => (p.type === 6 ? p.name : (p.arg?.content ?? "[spread]")))
        .sort(byCodepoint);
      if (!slots.has(name)) slots.set(name, scope.length ? `slot props: ${scope.join(", ")}` : "no slot props");
    }
    for (const child of node.children ?? []) walkTemplate(child);
    for (const branch of node.branches ?? []) walkTemplate(branch);
  };
  walkTemplate(descriptor.template?.ast);

  // Exposed members
  const exposed = [];
  for (const call of findMacroCalls(sf, "defineExpose")) {
    const arg = unwrap(call.arguments[0]);
    if (!arg || !ts.isObjectLiteralExpression(arg)) {
      problems.push(`${COMPONENT.relPath}: defineExpose() needs an object literal for the snapshot to read it.`);
      continue;
    }
    for (const p of arg.properties) {
      const name = memberName(p);
      if (name) exposed.push(name);
      else problems.push(`${COMPONENT.relPath}: unsupported entry in defineExpose(): \`${inline(p.getText(sf)).slice(0, 60)}\`.`);
    }
  }

  // Types the component file exports
  const exportedTypes = [];
  for (const statement of sf.statements) {
    if (!isExported(statement)) continue;
    for (const d of declarationsOf(statement) ?? []) {
      exportedTypes.push({ name: d.name, kind: d.kind, text: d.name === propsTypeName ? null : printNode(statement, sf) });
    }
  }

  const eventNames = new Set(events.map((e) => e.name));
  return {
    name: COMPONENT.name,
    file: COMPONENT.relPath,
    props: props.sort((a, b) => byCodepoint(a.name, b.name)),
    events: events.sort((a, b) => byCodepoint(a.name, b.name)),
    models: props.map((p) => p.name).filter((n) => eventNames.has(`update:${n}`)).sort(byCodepoint),
    slots: [...slots].map(([name, detail]) => ({ name, detail })).sort((a, b) => byCodepoint(a.name, b.name)),
    exposed: exposed.sort(byCodepoint),
    exportedTypes: exportedTypes.sort((a, b) => byCodepoint(a.name, b.name)),
    propsTypeName,
  };
}

function renderComponentSnapshot(c) {
  const out = [
    `# \`<${c.name}>\`: component contract`,
    "",
    `<!-- GENERATED by scripts/build-map-api.mjs from ${c.file}. DO NOT EDIT. -->`,
    `<!-- Regenerate: ${REGENERATE} -->`,
    "",
    "What a page that renders the component can rely on: its props and their defaults, the",
    "events it emits, its `v-model` bindings, its slots, the members it exposes on a template",
    "ref, and the types its file exports. Sorted by name. Everything else in the component is",
    "internal.",
    "",
    `## Props (${c.props.length})`,
    "",
  ];
  if (!c.props.length) out.push("None.");
  for (const p of c.props) {
    out.push(`- \`${p.name}${p.optional ? "?" : ""}: ${p.type}\`${p.default === null ? "" : ` (default: \`${p.default}\`)`}`);
  }
  out.push("", `## Events (${c.events.length})`, "");
  if (!c.events.length) out.push("None.");
  for (const e of c.events) out.push(`- \`${e.name}\`${e.payload ? `: \`(${e.payload})\`` : ""}`);
  out.push("", `## v-model bindings (${c.models.length})`, "", "A prop with a matching `update:<prop>` event.", "");
  if (!c.models.length) out.push("None.");
  for (const m of c.models) out.push(`- \`v-model:${m}\``);
  out.push("", `## Slots (${c.slots.length})`, "");
  if (!c.slots.length) out.push("None.");
  for (const s of c.slots) out.push(`- \`${s.name}\`: ${s.detail}`);
  out.push("", `## Exposed members (${c.exposed.length})`, "");
  if (!c.exposed.length) out.push("None: the component calls no `defineExpose()`, so a template ref gives access to nothing.");
  for (const e of c.exposed) out.push(`- \`${e}\``);
  out.push("", `## Exported types (${c.exportedTypes.length})`, "");
  if (!c.exportedTypes.length) out.push("None.");
  for (const t of c.exportedTypes) {
    if (t.text === null) out.push(`- \`${t.name}\` (${t.kind}): the props listed above.`, "");
    else out.push(`- \`${t.name}\` (${t.kind}):`, "", "  ```ts", ...t.text.split("\n").map((l) => `  ${l}`), "  ```", "");
  }
  return `${out.join("\n").trimEnd()}\n`;
}

function describeLineDrift(committed, generated) {
  const before = new Set(committed.split("\n"));
  const after = new Set(generated.split("\n"));
  const lines = [];
  for (const l of generated.split("\n")) if (l.trim() && !before.has(l)) lines.push(`  + ${l}`);
  for (const l of committed.split("\n")) if (l.trim() && !after.has(l)) lines.push(`  - ${l}`);
  return lines;
}

// ============================================================================
// Main
// ============================================================================

const isCheck = process.argv.includes("--check");
const isJson = process.argv.includes("--json");
const problems = [];
const runtimeEntries = RUNTIME_ENTRIES.map((e) => collectRuntimeEntry(e, problems));
const component = await collectComponent(problems);

if (problems.length) {
  console.error("build-map-api: the map's API surface is not well formed:");
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}

if (isJson) {
  // Wait for the write: exiting right after a large write to a pipe truncates it.
  await new Promise((resolve) => process.stdout.write(`${JSON.stringify({ runtime: runtimeEntries, component }, null, 2)}\n`, resolve));
  process.exit(0);
}

const targets = [
  { path: RUNTIME_SNAPSHOT, content: renderRuntimeSnapshot(runtimeEntries), drift: describeRuntimeDrift, what: "the map runtime's exports" },
  { path: COMPONENT_SNAPSHOT, content: renderComponentSnapshot(component), drift: describeLineDrift, what: `<${COMPONENT.name}>'s props, events, slots or exposed members` },
];

if (isCheck) {
  let failed = false;
  for (const t of targets) {
    const current = existsSync(t.path) ? readFileSync(t.path, "utf8").replace(/\r\n/g, "\n") : null;
    if (current === t.content) continue;
    failed = true;
    if (current === null) {
      console.error(`${rel(t.path)} is missing; run \`${REGENERATE}\`.`);
      continue;
    }
    console.error(`${rel(t.path)} is out of date: ${t.what} changed without the snapshot.`);
    const drift = t.drift(current, t.content);
    const shown = drift.slice(0, 40);
    for (const line of shown) console.error(line);
    if (drift.length > shown.length) console.error(`  ... and ${drift.length - shown.length} more`);
    if (!drift.length) console.error("  (layout only: no export or declaration differs)");
  }
  if (failed) {
    console.error(
      "\nIf the change is intended, run "
      + `\`${REGENERATE}\`, review the diff of api/*.api.md and commit it with the change. `
      + "A removed or changed @public entry is a breaking change for consumers; a new export needs @public or @internal.",
    );
    process.exit(1);
  }
  console.log("api/map-runtime.api.md and api/map-component.api.md are up to date.");
  process.exit(0);
}

mkdirSync(apiDir, { recursive: true });
for (const t of targets) {
  writeFileSync(t.path, t.content, "utf8");
  console.log(`Wrote ${rel(t.path)} (${t.content.length} bytes).`);
}
