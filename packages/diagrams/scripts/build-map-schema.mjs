#!/usr/bin/env node
/**
 * build-map-schema.mjs — Writes the JSON Schema of the architecture model from its TypeScript types
 * (`TuxMapLevelModel` in `app/utils/tuxArchitectureMap.ts`), so the two cannot drift (`tti/tti-ux#163`).
 *
 * It writes two things:
 *   - `schema/tux-map-1.schema.json`: the schema of `"tux-map/1"` (JSON Schema 2020-12), with the doc comments
 *     of the types as descriptions. Published with the package, for any validator.
 *   - the block between `// <generated:map-schema>` and `// </generated:map-schema>` in
 *     `app/utils/tuxArchitectureMap.ts`: the same schema without descriptions, which `validateMapModel` reads.
 *     It lives in that file because the runtime is that one file, compiled alone, with no import.
 *
 * The schema says what the types say and nothing more: a property the type does not name is allowed, so a
 * document written for a later release still passes.
 *
 * Usage:
 *   node packages/diagrams/scripts/build-map-schema.mjs          # write both
 *   node packages/diagrams/scripts/build-map-schema.mjs --check  # exit 1 when either is out of date
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(__dirname, "..");
const srcPath = path.join(pkgRoot, "app", "utils", "tuxArchitectureMap.ts");
const ROOT_TYPE = "TuxMapLevelModel";
const SCHEMA_NAME_CONST = "TUX_MAP_SCHEMA";
const BEGIN = "// <generated:map-schema>";
const END = "// </generated:map-schema>";
const EMBED_CONST = "MAP_SHAPE_SCHEMA";

const isCheck = process.argv.includes("--check");

const program = ts.createProgram([srcPath], {
  strict: true,
  noEmit: true,
  skipLibCheck: true,
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  types: [],
});
const checker = program.getTypeChecker();
const source = program.getSourceFile(srcPath);
if (!source) throw new Error(`build-map-schema: cannot read ${srcPath}`);

function fail(message) {
  console.error(`build-map-schema: ${message}`);
  process.exit(1);
}

/** The named declarations of the source file that become `$defs`. */
const declared = new Map();
let schemaName = "";
for (const stmt of source.statements) {
  if ((ts.isInterfaceDeclaration(stmt) || ts.isTypeAliasDeclaration(stmt)) && !stmt.typeParameters) {
    declared.set(stmt.name.text, stmt);
  }
  if (ts.isVariableStatement(stmt)) {
    for (const d of stmt.declarationList.declarations) {
      if (ts.isIdentifier(d.name) && d.name.text === SCHEMA_NAME_CONST) {
        const t = checker.getTypeAtLocation(d.name);
        if (t.isStringLiteral()) schemaName = t.value;
      }
    }
  }
}
if (!declared.has(ROOT_TYPE)) fail(`${ROOT_TYPE} is not declared in ${path.relative(pkgRoot, srcPath)}`);
if (!schemaName) fail(`${SCHEMA_NAME_CONST} is not a string literal`);

const defs = {};
const building = new Set();

function docOf(symbol) {
  const text = ts.displayPartsToString(symbol.getDocumentationComment(checker)).replace(/\s+/g, " ").trim();
  return text || undefined;
}

/** The declared name of a type, when it is one of this file's interfaces or (non-generic) type aliases. */
function nameOf(type) {
  const symbol = type.aliasSymbol ?? type.symbol;
  const name = symbol?.name;
  if (!name || !declared.has(name)) return undefined;
  if (type.aliasSymbol && type.aliasTypeArguments?.length) return undefined;
  const decl = declared.get(name);
  return symbol.declarations?.includes(decl) ? name : undefined;
}

function convert(type, where) {
  const name = nameOf(type);
  if (name && name !== ROOT_TYPE) {
    if (!(name in defs) && !building.has(name)) {
      building.add(name);
      const body = convertBody(type, name);
      const doc = docOf(type.aliasSymbol ?? type.symbol);
      defs[name] = doc ? { description: doc, ...body } : body;
      building.delete(name);
    }
    return { $ref: `#/$defs/${name}` };
  }
  return convertBody(type, where);
}

function convertBody(type, where) {
  const f = type.flags;
  if (f & (ts.TypeFlags.Any | ts.TypeFlags.Unknown)) return {};
  if (f & ts.TypeFlags.StringLiteral) return { const: type.value };
  if (f & ts.TypeFlags.NumberLiteral) return { const: type.value };
  if (f & ts.TypeFlags.BooleanLiteral) return { const: checker.typeToString(type) === "true" };
  if (f & ts.TypeFlags.String) return { type: "string" };
  if (f & ts.TypeFlags.Number) return { type: "number" };
  if (f & ts.TypeFlags.Boolean) return { type: "boolean" };
  if (type.isUnion()) {
    const members = type.types.filter((t) => !(t.flags & ts.TypeFlags.Undefined));
    if (members.length > 0 && members.every((t) => t.flags & ts.TypeFlags.StringLiteral)) {
      return { type: "string", enum: members.map((t) => t.value) };
    }
    const bools = members.filter((t) => t.flags & ts.TypeFlags.BooleanLiteral);
    const rest = members.filter((t) => !(t.flags & ts.TypeFlags.BooleanLiteral));
    const anyOf = rest.map((t) => convert(t, where));
    if (bools.length === 2) anyOf.push({ type: "boolean" });
    else if (bools.length === 1) anyOf.push(convertBody(bools[0], where));
    return anyOf.length === 1 ? anyOf[0] : { anyOf };
  }
  if (checker.isTupleType(type)) {
    const items = checker.getTypeArguments(type).map((t) => convert(t, where));
    return { type: "array", prefixItems: items, minItems: items.length, maxItems: items.length };
  }
  if (checker.isArrayType(type)) {
    return { type: "array", items: convert(checker.getTypeArguments(type)[0], where) };
  }
  if (f & (ts.TypeFlags.Object | ts.TypeFlags.Intersection)) {
    if (type.getCallSignatures().length > 0) fail(`${where}: a function type has no JSON form`);
    const out = { type: "object" };
    const props = checker.getPropertiesOfType(type);
    if (props.length > 0) {
      out.properties = {};
      const required = [];
      for (const prop of props) {
        const optional = Boolean(prop.flags & ts.SymbolFlags.Optional);
        const decl = prop.valueDeclaration;
        // The declared type node keeps the name of an alias (`kind?: TuxMapElementKind`), which the
        // property's own type loses once `undefined` is added to it.
        const propType =
          decl && ts.isPropertySignature(decl) && decl.type
            ? checker.getTypeFromTypeNode(decl.type)
            : checker.getNonNullableType(checker.getTypeOfSymbol(prop));
        const schema = convert(propType, `${where}.${prop.name}`);
        const doc = docOf(prop);
        out.properties[prop.name] = doc ? { description: doc, ...schema } : schema;
        if (!optional) required.push(prop.name);
      }
      if (required.length > 0) out.required = required;
    }
    const index = checker.getIndexInfoOfType(type, ts.IndexKind.String);
    if (index) {
      const values = convert(index.type, `${where}[]`);
      if (Object.keys(values).length > 0) out.additionalProperties = values;
    }
    return out;
  }
  return fail(`${where}: no JSON Schema for the type '${checker.typeToString(type)}'`);
}

const rootDecl = declared.get(ROOT_TYPE);
const rootType = checker.getTypeAtLocation(rootDecl.name);
const rootBody = convertBody(rootType, ROOT_TYPE);
const sortedDefs = Object.fromEntries(Object.keys(defs).sort().map((k) => [k, defs[k]]));

const fileName = `${schemaName.replace(/[^A-Za-z0-9]+/g, "-")}.schema.json`;
const schemaPath = path.join(pkgRoot, "schema", fileName);
const full = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: fileName,
  title: schemaName,
  description:
    `The architecture model "${schemaName}" (${ROOT_TYPE}). Generated from the TypeScript types by ` +
    "scripts/build-map-schema.mjs; do not edit. Properties the schema does not name are allowed.",
  ...rootBody,
  $defs: sortedDefs,
};
const fullText = `${JSON.stringify(full, null, 2)}\n`;

function strip(node) {
  if (Array.isArray(node)) return node.map(strip);
  if (node === null || typeof node !== "object") return node;
  const out = {};
  for (const [k, v] of Object.entries(node)) {
    if (k === "description" && typeof v === "string") continue;
    // `properties` maps names to schemas: a property called "description" is kept
    out[k] = k === "properties" ? Object.fromEntries(Object.entries(v).map(([pk, pv]) => [pk, strip(pv)])) : strip(v);
  }
  return out;
}
const compactRoot = strip(rootBody);
const compactDefs = strip(sortedDefs);
const embedded = [
  BEGIN,
  `// Written by scripts/build-map-schema.mjs from ${ROOT_TYPE} and the types it is made of; do not edit.`,
  `// The same schema, with descriptions, is published as schema/${fileName}.`,
  "// prettier-ignore",
  `const ${EMBED_CONST}: MapShapeSchema = {`,
  ...Object.entries(compactRoot).map(([k, v]) => `  ${k}: ${JSON.stringify(v)},`),
  "  $defs: {",
  ...Object.entries(compactDefs).map(([k, v]) => `    ${k}: ${JSON.stringify(v)},`),
  "  },",
  "};",
  END,
].join("\n");

const srcText = readFileSync(srcPath, "utf8");
const begin = srcText.indexOf(BEGIN);
const end = srcText.indexOf(END);
if (begin < 0 || end < begin) fail(`the ${BEGIN} … ${END} block is missing from ${path.relative(pkgRoot, srcPath)}`);
const nextSrc = srcText.slice(0, begin) + embedded + srcText.slice(end + END.length);

const relSchema = path.relative(pkgRoot, schemaPath).replace(/\\/g, "/");
const relSrc = path.relative(pkgRoot, srcPath).replace(/\\/g, "/");
if (isCheck) {
  const stale = [];
  if (!existsSync(schemaPath) || readFileSync(schemaPath, "utf8").replace(/\r\n/g, "\n") !== fullText) {
    stale.push(relSchema);
  }
  if (nextSrc !== srcText) stale.push(`the generated schema block in ${relSrc}`);
  if (stale.length > 0) {
    console.error(
      `${stale.join(" and ")} ${stale.length === 1 ? "is" : "are"} out of date with the model types; ` +
        "run `npm --prefix packages/diagrams run build:schema`, then `build:runtime`.",
    );
    process.exit(1);
  }
  console.log(`${relSchema} and the schema block in ${relSrc} are up to date.`);
} else {
  mkdirSync(path.dirname(schemaPath), { recursive: true });
  writeFileSync(schemaPath, fullText);
  if (nextSrc !== srcText) writeFileSync(srcPath, nextSrc);
  console.log(
    `Wrote ${relSchema} (${Buffer.byteLength(fullText)} bytes) and the schema block in ${relSrc} ` +
      `(${Buffer.byteLength(embedded)} bytes, ${Object.keys(sortedDefs).length} definitions).`,
  );
}
