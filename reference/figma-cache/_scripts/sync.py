#!/usr/bin/env python3
"""Sync the Figma "Figs" project listing into reference/figma-cache/.

Idempotent: skips files that already have a fleshed-out NOTES.md (page
inventory present) and a cover.png. Re-run safely after adding files
to the Figma project, or pass --force to refetch everything.

Sequential + rate-limit-aware. Figma's REST API throttles aggressively
above ~3 req/s; parallelizing trips 429 immediately.

Usage:
  python3 sync.py                  # sync any files missing data
  python3 sync.py --refresh-list   # refetch PROJECT-FILES.json first
  python3 sync.py --force          # refetch everything (overwrites stubs)
  python3 sync.py --rebuild-index  # after sync, run rebuild-index.py

Token: ~/.figma_token (perm 600)
Project: 603237365 ("Figs")
"""
import argparse, json, os, re, sys, time, urllib.request, urllib.error
from pathlib import Path

REPO = Path(__file__).resolve().parents[3]
CACHE = REPO / "reference/figma-cache"
PROJECT_ID = "603237365"
TOKEN_PATH = Path.home() / ".figma_token"

# Initial priority triage from 2026-05-19 conversation. Hand-edit freely.
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
    "Charts UI Kit (Community)",
    "Data Visualization Graphs _ Charts Kit (Community)",
    "Data table design components. Free UI Kit (Community)",
    "Snow Dashboard UI Kit (Community)",
    "Chat UI kit (Community)",
    "Chat Input Box (Community)",
    "ChatGPT UI Kit, AI Chat (Community)",
    "MCP Apps for Claude (Community)",
    "Microsoft 365 UI Kit (Community)",
    "Microsoft Fabric UI kit (Community)",
    "Microsoft Fabric page templates (Community)",
    "Microsoft Fabric visuals kit (Community)",
    "Microsoft Teams UI Kit (Community)",
    "SharePoint Web UI Kit (Community)",
    "Empty State Illustration Kit (Community)",
    "Calendar Interactive UI Kit (Community)",
    "Interactive Dropdown (Community)",
    "Interactive Dropdown (Community) (1)",
    "Progress Bar UI Kit (Community)",
    "Order list page (Community)",
    "Dashboard - Free UI Kit \U0001f5a5 (Community)",
    "Dashboard UI Kit - Dashboard, Free Admin Dashboard (Community)",
    "Microsoft Store Asset Guidance (Community)",
    # Platform-aware Tauri target sweep (2026-05-22):
    "Windows UI kit (Community)",
    "iOS 26 Liquid Glass (Community)",
    "iOS and iPadOS 26 (Community)",
    "macOS 26 (Community)",
    "macOS Browser UI Kit (Big Sur Update) (Community)",
    "visionOS 26 (Community)",
    "Apple Widgets UI Kit (Community)",
    "Template for SF Symbol Creator (Community)",
    "Material 3 Design Kit (Community)",
    "Android UI Kit (Community)",
    "50 Mobile Bottom Navigation Bar (Community)",
    "Tailwind Headless UI with Animations (Community)",
    "\U0001f6a0 Scrollbar Kit MacOS & Windows (Community)",
    "UI Prep Layout Grids 8.0 (Community)",
}

def priority(name):
    if name in HIGH: return "high"
    if name in MED:  return "medium"
    return "skip"

def slugify(name):
    s = re.sub(r"\(Community\)", "", name)
    s = re.sub(r"[^A-Za-z0-9]+", "-", s).strip("-").lower()
    return s[:60] or "file"

# ---- Rate-limit-aware sequential GET ----
REQ_INTERVAL = 1.5
_last_req = [0.0]

def api_get(path):
    for attempt in range(5):
        wait = REQ_INTERVAL - (time.time() - _last_req[0])
        if wait > 0:
            time.sleep(wait)
        _last_req[0] = time.time()
        try:
            req = urllib.request.Request(
                f"https://api.figma.com/v1{path}",
                headers={"X-Figma-Token": TOKEN},
            )
            with urllib.request.urlopen(req, timeout=60) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            if e.code == 429:
                wait = 30 * (attempt + 1)
                print(f"    429 → sleeping {wait}s", flush=True)
                time.sleep(wait)
                continue
            return {"error": True, "status": e.code, "msg": str(e)}
        except Exception as e:
            return {"error": True, "msg": str(e)}
    return {"error": True, "msg": "exhausted retries"}

def pick_cover_node(pages):
    """Choose a representative frame to render as cover thumbnail."""
    ALLOWED = {"FRAME", "COMPONENT", "COMPONENT_SET", "SECTION"}
    # Strategy 1: a page named "cover" → its first allowed child
    for p in pages:
        if "cover" in p["name"].lower():
            for c in p.get("children", []):
                if c.get("type") in ALLOWED:
                    return c["id"]
    # Strategy 2: first allowed child of first page
    if pages:
        for c in pages[0].get("children", []):
            if c.get("type") in ALLOWED:
                return c["id"]
    # Strategy 3: first allowed child anywhere
    for p in pages:
        for c in p.get("children", []):
            if c.get("type") in ALLOWED:
                return c["id"]
    return None

def needs_sync(folder, force):
    notes = folder / "NOTES.md"
    cover = folder / "cover.png"
    if force:
        return True, True
    needs_struct = not (notes.exists() and re.search(r"^## Pages \(\d+\)", notes.read_text(), re.M))
    needs_cover = not cover.exists()
    return needs_struct, needs_cover

def write_notes(folder, f, structure):
    pages = structure["document"]["children"]
    pages_md = "\n".join(
        f"- `{p['id']}` — {p['name']} _({len(p.get('children', []))} top-level children)_"
        for p in pages
    )
    pri = priority(f["name"])
    (folder / "NOTES.md").write_text(f"""# {f["name"]}

**Source:** Figma file `{f['key']}`
**Captured:** {time.strftime('%Y-%m-%d')}
**Priority:** {pri}
**Status:** stub — not yet absorbed

![cover](./cover.png)

## Pages ({len(pages)})

{pages_md}

## Skip

_TBD_

## Absorb

_TBD_

## Tension

_TBD_

## Decisions

_None yet._

## Open follow-ups

- Render previews of priority pages and write per-page NOTES.md
""")

def main():
    global TOKEN
    ap = argparse.ArgumentParser()
    ap.add_argument("--refresh-list", action="store_true")
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--rebuild-index", action="store_true")
    args = ap.parse_args()

    TOKEN = TOKEN_PATH.read_text().strip()

    listing = CACHE / "PROJECT-FILES.json"
    if args.refresh_list or not listing.exists():
        print(f"Refetching project listing for {PROJECT_ID}…", flush=True)
        data = api_get(f"/projects/{PROJECT_ID}/files")
        if data.get("error"):
            sys.exit(f"failed to fetch listing: {data}")
        listing.write_text(json.dumps(data, indent=2))
        print(f"  saved {listing}")

    project = json.loads(listing.read_text())
    files = project["files"]

    # Build unique slugs
    slugs, seen = {}, set()
    for f in files:
        base = slugify(f["name"])
        slug = base
        i = 2
        while slug in seen:
            slug = f"{base}-{i}"
            i += 1
        seen.add(slug)
        slugs[f["key"]] = slug

    todo = []
    for f in files:
        folder = CACHE / slugs[f["key"]]
        folder.mkdir(parents=True, exist_ok=True)
        ns, nc = needs_sync(folder, args.force)
        if ns or nc:
            todo.append((f, folder, ns, nc))

    print(f"\nSyncing {len(todo)} of {len(files)} files\n", flush=True)

    for i, (f, folder, need_struct, need_cover) in enumerate(todo, 1):
        slug = slugs[f["key"]]
        label = f"[{i:>2}/{len(todo)}] {slug:<50}"

        structure = None
        if need_struct:
            print(f"{label}  struct…", flush=True)
            structure = api_get(f"/files/{f['key']}?depth=2")
            if structure.get("error"):
                print(f"  struct ERR: {structure.get('msg','?')[:60]}")
                (folder / "NOTES.md").write_text(
                    f"# {f['name']}\n\n**Source:** Figma file `{f['key']}`\n"
                    f"**Priority:** {priority(f['name'])}\n\n"
                    f"**Status:** error fetching — `{structure.get('msg','?')}`\n"
                )
                continue
            write_notes(folder, f, structure)
            print(f"  struct ok ({len(structure['document']['children'])} pages)")

        if need_cover:
            if structure is None:
                structure = api_get(f"/files/{f['key']}?depth=2")
                if structure.get("error"):
                    print(f"  cover skip (no structure)")
                    continue
            node_id = pick_cover_node(structure["document"]["children"])
            if not node_id:
                print(f"  cover skip (no renderable node)")
                continue
            print(f"{label}  cover…", flush=True)
            resp = api_get(f"/images/{f['key']}?ids={node_id}&scale=0.25&format=png")
            if resp.get("error"):
                print(f"  cover ERR: {resp.get('msg','?')[:60]}")
                continue
            url = resp.get("images", {}).get(node_id)
            if not url:
                print(f"  cover ERR: no url returned ({resp.get('err','')[:60]})")
                continue
            urllib.request.urlretrieve(url, folder / "cover.png")
            print(f"  cover ok")

    print("\nDone.", flush=True)

    if args.rebuild_index:
        import subprocess
        subprocess.run([sys.executable, str(Path(__file__).parent / "rebuild-index.py")], check=True)

if __name__ == "__main__":
    main()
