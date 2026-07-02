#!/usr/bin/env python3
"""Boards-parity automation core (Area G1).

Host-side, stdlib-only (no pip deps), idempotent. Invoked by the rollup.sh /
burndown.sh wrappers, which source ../.env first so creds arrive via the
environment. Talks to the Forgejo API across an entire org.

Auth (in priority order):
  FORGEJO_TOKEN                          — a PAT (preferred)
  FORGEJO_ADMIN_USER + FORGEJO_ADMIN_PASS — basic auth fallback (what .env carries)
Base URL: FORGEJO_URL (e.g. http://localhost:3939)

Commands:
  rollup   <org> [--repo NAME] [--apply]   recompute epic roll-ups (dry-run default)
  burndown <org> [--repo NAME] [--out DIR] snapshot milestone points to CSV (read-only on server)
  install  <org> [--repo NAME] [--apply]   vendor the G2 event-driven roll-up Action into repos (dry-run default)

Why a python file and not inline `python3 -c`: the CLAUDE.md brace-expansion
gotcha — multi-line dict/JSON literals inside $(python3 -c "...") get torn apart
by bash. Keep the logic in a real file.
"""
import base64
import csv
import datetime
import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request

BASE = os.environ.get("FORGEJO_URL", "http://localhost:3939").rstrip("/")
API = BASE + "/api/v1"
HERE = os.path.dirname(os.path.abspath(__file__))


def _auth_header():
    tok = os.environ.get("FORGEJO_TOKEN")
    if tok:
        return "token " + tok
    user = os.environ.get("FORGEJO_ADMIN_USER")
    pw = os.environ.get("FORGEJO_ADMIN_PASS")
    if user and pw:
        raw = "{}:{}".format(user, pw).encode()
        return "Basic " + base64.b64encode(raw).decode()
    sys.exit("No credentials: set FORGEJO_TOKEN or FORGEJO_ADMIN_USER/PASS (source ../.env).")


AUTH = _auth_header()


def _req(method, path, body=None):
    url = path if path.startswith("http") else API + path
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method=method)
    req.add_header("Authorization", AUTH)
    if data is not None:
        req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req) as r:
            txt = r.read().decode()
            return json.loads(txt) if txt else None
    except urllib.error.HTTPError as e:
        sys.exit("HTTP {} on {} {}\n{}".format(e.code, method, url, e.read().decode()[:500]))


def _get_opt(path):
    """GET that returns None on 404 instead of exiting (for existence checks)."""
    req = urllib.request.Request(API + path, method="GET")
    req.add_header("Authorization", AUTH)
    try:
        with urllib.request.urlopen(req) as r:
            t = r.read().decode()
            return json.loads(t) if t else None
    except urllib.error.HTTPError as e:
        if e.code == 404:
            return None
        sys.exit("HTTP {} on GET {}\n{}".format(e.code, path, e.read().decode()[:500]))


def _get_paged(path):
    """GET all pages. path may already contain a query string."""
    out = []
    page = 1
    sep = "&" if "?" in path else "?"
    while True:
        chunk = _req("GET", "{}{}limit=50&page={}".format(path, sep, page))
        if not chunk:
            break
        out.extend(chunk)
        if len(chunk) < 50:
            break
        page += 1
    return out


def _repos(org, only=None):
    repos = _get_paged("/orgs/{}/repos".format(urllib.parse.quote(org)))
    names = [r["name"] for r in repos]
    if only:
        names = [n for n in names if n == only]
    return names


_POINTS_RE = re.compile(r"^points/(\d+)$")
_EPIC_RE_TMPL = r"(?im)^\s*Epic:\s*#{}\b"
ROLLUP_START = "<!-- rollup:start -->"
ROLLUP_END = "<!-- rollup:end -->"


def _points_of(issue):
    for lab in issue.get("labels") or []:
        m = _POINTS_RE.match(lab["name"])
        if m:
            return int(m.group(1))
    return 0


def _has_label(issue, name):
    return any((lab["name"] == name) for lab in (issue.get("labels") or []))


def _issues(org, repo):
    # type=issues excludes PRs; state=all to compute totals.
    p = "/repos/{}/{}/issues?type=issues&state=all".format(
        urllib.parse.quote(org), urllib.parse.quote(repo))
    return _get_paged(p)


def _render_rollup(children):
    closed = [c for c in children if c["state"] == "closed"]
    tot_pts = sum(_points_of(c) for c in children)
    done_pts = sum(_points_of(c) for c in closed)
    pct = int(round(100 * len(closed) / len(children))) if children else 0
    lines = [ROLLUP_START,
             "### 📊 Epic roll-up",
             "**{}/{} issues closed ({}%)** · **{}/{} points done**".format(
                 len(closed), len(children), pct, done_pts, tot_pts),
             ""]
    for c in sorted(children, key=lambda x: x["number"]):
        box = "x" if c["state"] == "closed" else " "
        lines.append("- [{}] #{} {}".format(box, c["number"], c["title"]))
    lines.append("")
    lines.append("_Updated by boards/rollup.sh — do not edit between the markers._")
    lines.append(ROLLUP_END)
    return "\n".join(lines)


def _upsert_block(body, block):
    body = body or ""
    if ROLLUP_START in body and ROLLUP_END in body:
        return re.sub(re.escape(ROLLUP_START) + r".*?" + re.escape(ROLLUP_END),
                      lambda _: block, body, flags=re.S)
    sep = "\n\n" if body.strip() else ""
    return body.rstrip() + sep + block + "\n"


def cmd_rollup(org, repo_only, apply):
    changed = 0
    for repo in _repos(org, repo_only):
        issues = _issues(org, repo)
        epics = [i for i in issues if _has_label(i, "type/epic")]
        for epic in epics:
            child_re = re.compile(_EPIC_RE_TMPL.format(epic["number"]))
            children = [i for i in issues
                        if i["number"] != epic["number"] and child_re.search(i.get("body") or "")]
            if not children:
                print("· {}/{} #{} '{}' — no children (Epic: #{} marker)".format(
                    org, repo, epic["number"], epic["title"], epic["number"]))
                continue
            block = _render_rollup(children)
            new_body = _upsert_block(epic.get("body") or "", block)
            if new_body == (epic.get("body") or ""):
                print("= {}/{} #{} — up to date".format(org, repo, epic["number"]))
                continue
            changed += 1
            if apply:
                _req("PATCH", "/repos/{}/{}/issues/{}".format(
                    urllib.parse.quote(org), urllib.parse.quote(repo), epic["number"]),
                    {"body": new_body})
                print("✓ {}/{} #{} — roll-up updated ({} children)".format(
                    org, repo, epic["number"], len(children)))
            else:
                print("~ {}/{} #{} '{}' — WOULD update ({} children):".format(
                    org, repo, epic["number"], epic["title"], len(children)))
                for line in block.splitlines():
                    print("    " + line)
    print("\n{} epic(s) {}.".format(changed, "updated" if apply else "would change (dry-run; pass --apply)"))


def cmd_burndown(org, repo_only, out_dir):
    today = datetime.date.today().isoformat()
    out_dir = out_dir or os.path.join(HERE, "snapshots", org)
    os.makedirs(out_dir, exist_ok=True)
    rows_written = 0
    for repo in _repos(org, repo_only):
        ms = _get_paged("/repos/{}/{}/milestones?state=all".format(
            urllib.parse.quote(org), urllib.parse.quote(repo)))
        for m in ms:
            name = m["title"]
            mi = _get_paged("/repos/{}/{}/issues?type=issues&state=all&milestones={}".format(
                urllib.parse.quote(org), urllib.parse.quote(repo), urllib.parse.quote(name)))
            open_i = [i for i in mi if i["state"] == "open"]
            closed_i = [i for i in mi if i["state"] == "closed"]
            open_pts = sum(_points_of(i) for i in open_i)
            closed_pts = sum(_points_of(i) for i in closed_i)
            row = {
                "date": today,
                "milestone": name,
                "state": m.get("state", ""),
                "open_issues": len(open_i),
                "closed_issues": len(closed_i),
                "open_points": open_pts,
                "closed_points": closed_pts,
                "total_points": open_pts + closed_pts,
                "due_on": (m.get("due_on") or "")[:10],
            }
            safe = re.sub(r"[^A-Za-z0-9._-]+", "-", "{}__{}".format(repo, name)).strip("-")
            path = os.path.join(out_dir, safe + ".csv")
            new = not os.path.exists(path)
            # Idempotent per day: drop any existing row for today, then append.
            existing = []
            if not new:
                with open(path, newline="") as f:
                    existing = [r for r in csv.DictReader(f) if r.get("date") != today]
            with open(path, "w", newline="") as f:
                w = csv.DictWriter(f, fieldnames=list(row.keys()))
                w.writeheader()
                for r in existing:
                    w.writerow(r)
                w.writerow(row)
            rows_written += 1
            print("✓ {}/{} · {} — {} open / {} closed pts → {}".format(
                org, repo, name, open_pts, closed_pts, os.path.relpath(path, HERE)))
    print("\n{} milestone snapshot(s) written for {}.".format(rows_written, today))


DEMO_REPO = "boards-demo"
# (title, body, [label names], in_sprint, close)  — order matters: epic first.
_DEMO = [
    ("Design-system v2 refresh",
     "Parent epic for the v2 refresh. Children carry an `Epic: #<n>` marker so "
     "boards/rollup.sh can roll their completion + points up here.",
     ["type/epic", "priority/p1", "state/in-progress"], False, False),
    ("Dark-mode color palette", "Full dark-theme token set.",
     ["type/story", "points/5", "priority/p1", "state/in-progress"], True, False),
    ("Token contrast WCAG pass", "Audit + fix contrast ratios to AA.",
     ["type/story", "points/3", "priority/p2", "state/review"], True, True),
    ("Component spacing scale", "Adopt a 4/8px spacing scale.",
     ["type/story", "points/8", "priority/p2", "state/ready"], True, False),
    ("Migrate icons to an SVG sprite", "Replace the icon font with a sprite.",
     ["type/task", "points/2", "state/ready"], True, False),
    ("Button focus ring clipped in Safari", "Standalone bug — not under the epic.",
     ["type/bug", "points/1", "priority/p1", "state/triage"], True, False),
    ("Investigate container queries", "Time-boxed research spike.",
     ["type/spike", "priority/p3", "state/triage"], False, False),
]


def cmd_demo(org, repo):
    """Seed a SANDBOX repo with a typed/pointed epic+stories+sprint to look at.
    Idempotent. Safe to delete the repo afterwards. Labels must already exist
    (run boards/labels.sh first)."""
    repo = repo or DEMO_REPO
    rp = "/repos/{}/{}".format(urllib.parse.quote(org), urllib.parse.quote(repo))
    if _get_opt(rp) is None:
        _req("POST", "/orgs/{}/repos".format(urllib.parse.quote(org)),
             {"name": repo, "description": "Boards-parity demo (Area G1) — safe to delete",
              "auto_init": True, "default_branch": "main"})
        print("✓ created sandbox repo {}/{}".format(org, repo))
    else:
        print("= repo {}/{} already exists".format(org, repo))

    labels = {l["name"]: l["id"] for l in _get_paged("/orgs/{}/labels".format(urllib.parse.quote(org)))}
    needed = sorted({n for d in _DEMO for n in d[2]})
    missing = [n for n in needed if n not in labels]
    if missing:
        sys.exit("Missing org labels {} — run boards/labels.sh {} first.".format(missing, org))

    ms = _get_paged(rp + "/milestones?state=all")
    mid = next((m["id"] for m in ms if m["title"] == "Sprint 1"), None)
    if mid is None:
        mid = _req("POST", rp + "/milestones", {"title": "Sprint 1", "description": "Demo sprint"})["id"]
        print("✓ created milestone 'Sprint 1'")

    existing = {i["title"]: i for i in _get_paged(rp + "/issues?type=issues&state=all")}
    epic_num = None
    for title, body, lbls, in_sprint, close in _DEMO:
        if epic_num is not None and "type/epic" not in lbls and any("type/story" == x or "type/task" == x for x in lbls):
            body = "Epic: #{}\n\n{}".format(epic_num, body)
        iss = existing.get(title)
        if iss is None:
            payload = {"title": title, "body": body, "labels": [labels[x] for x in lbls]}
            if in_sprint:
                payload["milestone"] = mid
            iss = _req("POST", rp + "/issues", payload)
            existing[title] = iss
            print("✓ #{} {}".format(iss["number"], title))
        else:
            print("= #{} {} (exists)".format(iss["number"], title))
        if "type/epic" in lbls:
            epic_num = iss["number"]
        if close and iss["state"] != "closed":
            _req("PATCH", rp + "/issues/{}".format(iss["number"]), {"state": "closed"})
            print("  closed #{} (gives the roll-up + burndown some progress)".format(iss["number"]))

    print("\nSeeded {}/{}. Next:".format(org, repo))
    print("  boards/rollup.sh {} --repo {} --apply".format(org, repo))
    print("  boards/burndown.sh {} --repo {}".format(org, repo))
    print("  Then make the board in the UI (API can't): {}/{}/{} → Projects → "
          "New Project → Automated Kanban.".format(BASE, org, repo))


# --- G2: vendor the event-driven roll-up Action into repos -----------------
# The Action needs two files committed in each target repo: the workflow and a
# copy of THIS core (so the runner executes the same rollup logic the host timer
# does — no forked code). install puts both via the contents API: create when
# absent, update when changed, skip when identical. Default branch (branch omitted
# → Forgejo uses the repo default).
_G2_FILES = {
    ".forgejo/workflows/boards-rollup.yml": os.path.join(HERE, "workflows", "boards-rollup.yml"),
    ".forgejo/boards/_boards.py": os.path.join(HERE, "_boards.py"),
}


def _contents_get(org, repo, path):
    """Return the contents-API object for a file, or None if absent."""
    p = "/repos/{}/{}/contents/{}".format(
        urllib.parse.quote(org), urllib.parse.quote(repo), urllib.parse.quote(path))
    return _get_opt(p)


def _put_file(org, repo, path, content_bytes, apply):
    """Create-or-update one file. Returns 'created' | 'updated' | 'unchanged'."""
    b64 = base64.b64encode(content_bytes).decode()
    existing = _contents_get(org, repo, path)
    if existing is not None:
        try:
            cur = base64.b64decode(existing.get("content", "") or "")
        except Exception:
            cur = None
        if cur == content_bytes:
            return "unchanged"
        action = "updated"
    else:
        action = "created"
    if not apply:
        return action  # dry-run: report what would happen
    body = {"message": "G2: {} boards-rollup Action".format(action), "content": b64}
    # Forgejo contents API: POST creates, PUT updates (PUT requires the prior sha).
    if existing is not None:
        body["sha"] = existing["sha"]
        method = "PUT"
    else:
        method = "POST"
    _req(method, "/repos/{}/{}/contents/{}".format(
        urllib.parse.quote(org), urllib.parse.quote(repo), urllib.parse.quote(path)), body)
    return action


def cmd_install(org, repo_only, apply):
    """Vendor the G2 boards-rollup Action into each repo in the org (or --repo).
    Idempotent: re-run to propagate _boards.py changes. Dry-run unless --apply."""
    payloads = {}
    for path, src in _G2_FILES.items():
        with open(src, "rb") as f:
            payloads[path] = f.read()
    touched = 0
    for repo in _repos(org, repo_only):
        for path, content in payloads.items():
            res = _put_file(org, repo, path, content, apply)
            mark = {"created": "✓", "updated": "✓", "unchanged": "="}[res]
            if res != "unchanged":
                touched += 1
            verb = res if apply or res == "unchanged" else "WOULD be " + res
            print("{} {}/{} :: {} — {}".format(mark, org, repo, path, verb))
    tail = "installed/updated" if apply else "would change (dry-run; pass --apply)"
    print("\n{} file(s) {}.".format(touched, tail))


def main(argv):
    if len(argv) < 2:
        sys.exit(__doc__)
    cmd = argv[1]
    rest = argv[2:]
    if not rest or rest[0].startswith("-"):
        sys.exit("Usage: _boards.py {} <org> [--repo NAME] [--apply] [--out DIR]".format(cmd))
    org = rest[0]
    repo_only = None
    out_dir = None
    apply = False
    i = 1
    while i < len(rest):
        a = rest[i]
        if a == "--apply":
            apply = True
        elif a == "--repo":
            i += 1
            repo_only = rest[i]
        elif a == "--out":
            i += 1
            out_dir = rest[i]
        else:
            sys.exit("Unknown arg: " + a)
        i += 1
    if cmd == "rollup":
        cmd_rollup(org, repo_only, apply)
    elif cmd == "burndown":
        cmd_burndown(org, repo_only, out_dir)
    elif cmd == "demo":
        cmd_demo(org, repo_only)
    elif cmd == "install":
        cmd_install(org, repo_only, apply)
    else:
        sys.exit("Unknown command: " + cmd)


if __name__ == "__main__":
    main(sys.argv)
