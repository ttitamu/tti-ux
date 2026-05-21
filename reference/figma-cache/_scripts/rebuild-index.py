#!/usr/bin/env python3
"""Rebuild reference/figma-cache/INDEX.md from on-disk state.

No API calls — reads each <slug>/NOTES.md to extract page counts + status
(absorbed if a per-page NOTES.md exists under the file folder, stub
otherwise). Run after any change that should be reflected in the index.

Usage:
  python3 rebuild-index.py
"""
import json, re
from pathlib import Path

REPO = Path(__file__).resolve().parents[3]
CACHE = REPO / "reference/figma-cache"

HIGH = {
    "Aggie UX Design System _ v1.7.0 (Community)",
    "@shadcn_ui - Design System (Community)",
    "shadcn_ui components with variables & Tailwind classes - Updated January 2026 (Community)",
    "TailwindCSS v4.2.4 Design System (Community)",
    "Primer Web (Community)",
    "Microsoft Fluent 2 Web (Community)",
    "@vercel AI Elements ✨ (Community)",
    "Backstage Design System (Community)",
}
MED = {
    "Charts UI Responsive Components Chart.js Chartist Apex Charts and Recharts (Community)",
    "Charts UI Kit (Community)", "Data Visualization Graphs _ Charts Kit (Community)",
    "Data table design components. Free UI Kit (Community)", "Snow Dashboard UI Kit (Community)",
    "Chat UI kit (Community)", "Chat Input Box (Community)", "ChatGPT UI Kit, AI Chat (Community)",
    "MCP Apps for Claude (Community)",
    "Microsoft 365 UI Kit (Community)", "Microsoft Fabric UI kit (Community)",
    "Microsoft Fabric page templates (Community)", "Microsoft Fabric visuals kit (Community)",
    "Microsoft Teams UI Kit (Community)", "SharePoint Web UI Kit (Community)",
    "Empty State Illustration Kit (Community)", "Calendar Interactive UI Kit (Community)",
    "Interactive Dropdown (Community)", "Interactive Dropdown (Community) (1)",
    "Progress Bar UI Kit (Community)", "Order list page (Community)",
    "Dashboard - Free UI Kit \U0001f5a5 (Community)",
    "Dashboard UI Kit - Dashboard, Free Admin Dashboard (Community)",
    "Microsoft Store Asset Guidance (Community)",
}

def priority(name):
    if name in HIGH: return "high"
    if name in MED:  return "medium"
    return "skip"

def slugify(name):
    s = re.sub(r"\(Community\)", "", name)
    s = re.sub(r"[^A-Za-z0-9]+", "-", s).strip("-").lower()
    return s[:60] or "file"

def main():
    project = json.loads((CACHE / "PROJECT-FILES.json").read_text())
    files = project["files"]
    slugs, seen = {}, set()
    for f in files:
        base = slugify(f["name"])
        slug = base
        i = 2
        while slug in seen:
            slug = f"{base}-{i}"; i += 1
        seen.add(slug)
        slugs[f["key"]] = slug

    rows_by_pri = {"high": [], "medium": [], "skip": []}
    totals = {"high": 0, "medium": 0, "skip": 0,
              "absorbed": 0, "stub": 0, "error": 0, "cover_ok": 0}
    for f in files:
        key = f["key"]; slug = slugs[key]; name = f["name"]; pri = priority(name)
        totals[pri] += 1
        folder = CACHE / slug
        has_cover = (folder / "cover.png").exists()
        if has_cover:
            totals["cover_ok"] += 1
        txt = (folder / "NOTES.md").read_text() if (folder / "NOTES.md").exists() else ""
        m = re.search(r"^## Pages \((\d+)\)", txt, re.M)
        page_count = m.group(1) if m else "?"
        if "error fetching" in txt:
            status = "error"
            totals["error"] += 1
        else:
            # Either signal counts as absorbed:
            #   (a) `**Status:** absorbed` in file-level NOTES.md, OR
            #   (b) any subfolder with its own NOTES.md (per-page deep dive).
            sm = re.search(r"^\*\*Status:\*\*\s+(\w+)", txt, re.M)
            explicit = sm.group(1) if sm else None
            has_sub = any(
                (p2.is_dir() and (p2 / "NOTES.md").exists())
                for p2 in (folder.iterdir() if folder.exists() else [])
            )
            if explicit == "absorbed" or has_sub:
                status = "absorbed"
            elif explicit == "skip":
                status = "skip"
            else:
                status = "stub"
            totals[status] = totals.get(status, 0) + 1
        rows_by_pri[pri].append((name, slug, page_count, status, has_cover))

    def render_rows(rows):
        rows.sort(key=lambda r: r[0].lower())
        return "\n".join(
            f"| {'🖼' if hc else ' '} | [{n}]({s}/NOTES.md) | {pc} | {st} |"
            for n, s, pc, st, hc in rows
        )

    out = f"""# Figma absorption index

Local cache of Figma files surveyed for TUX. Each entry below is a
folder under `reference/figma-cache/` containing a cover thumbnail and
a stub `NOTES.md` with page inventory. Per-page deep dives go in
subfolders alongside `<slug>/<page-slug>/NOTES.md`.

**Source project:** `{project.get('name','?')}` (Figma project `603237365`).
Listing cached in [`PROJECT-FILES.json`](PROJECT-FILES.json).

**Totals:** {len(files)} files · {totals['cover_ok']} with cover ·
{totals['absorbed']} absorbed · {totals['stub']} stub · {totals['error']} fetch errors.

## Why this exists

We're translating {len(files)} reference Figma files into TUX without
losing TTI's editorial character. "Absorb the thinking, skip the
chrome." This index is the running log so we can see at a glance what's
been processed and what landed in the codebase.

## Convention

- One folder per file: `<file-slug>/`
- File-level `NOTES.md` with page inventory + Skip/Absorb/Tension/Decisions
- One folder per absorbed page beneath: `<file-slug>/<page-slug>/NOTES.md` + PNGs
- 🖼 = cover thumbnail present
- Priority bucket reflects likely value to TUX (initial triage; revise freely)

## High signal ({totals['high']})

These directly inform TUX foundations. Process first.

| | File | Pages | Status |
|---|---|---|---|
{render_rows(rows_by_pri['high'])}

## Medium signal ({totals['medium']})

Useful for specific surfaces (charts, chat, Microsoft suite, individual
patterns). Skim covers; deep-dive only the relevant pages.

| | File | Pages | Status |
|---|---|---|---|
{render_rows(rows_by_pri['medium'])}

## Skip / skim ({totals['skip']})

Native platform kits, mockups, or non-shadcn-family systems. Kept for
reference but probably not absorbed into TUX. Scan covers for surprises.

| | File | Pages | Status |
|---|---|---|---|
{render_rows(rows_by_pri['skip'])}
"""
    (CACHE / "INDEX.md").write_text(out)
    print(f"Rebuilt INDEX.md: {len(files)} files, {totals['cover_ok']} covers, "
          f"{totals['absorbed']} absorbed, {totals['stub']} stub, {totals['error']} errors")

if __name__ == "__main__":
    main()
