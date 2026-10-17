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
    tok = os.environ.get("FORGEJO_TOKEN") or os.environ.get("FORGEJO_ADMIN_TOKEN")
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


def _contents_get(org, repo, path, ref=None):
    """Return the contents-API object for a file, or None if absent."""
    p = "/repos/{}/{}/contents/{}".format(
        urllib.parse.quote(org), urllib.parse.quote(repo), urllib.parse.quote(path))
    if ref:
        p += "?ref=" + urllib.parse.quote(ref)
    return _get_opt(p)


def _put_file(org, repo, path, content_bytes, apply, branch=None, base=None,
               new_branch=False):
    """Create-or-update one file. Returns 'created' | 'updated' | 'unchanged'.

    With `branch`, writes to that branch instead of the default one. The
    create-vs-update decision is then made against the file AS IT EXISTS ON
    THAT BRANCH, not on the default branch: a stale working branch can already
    carry the file while the default does not, and a create against an
    existing path 422s (the same bug seed-baseline.sh documents).
    """
    b64 = base64.b64encode(content_bytes).decode()
    ref = branch or base
    existing = _contents_get(org, repo, path, ref=ref)
    base_has_it = False
    if existing is None and branch and base:
        # Nothing on the working branch. In dry-run the branch does not exist
        # yet, so fall back to the base to classify honestly: reporting
        # "created" for a file the base already carries would read as "this is
        # new" when it is really an overwrite. (In apply mode the branch is cut
        # from base first, so this path is only hit during dry-run.)
        base_existing = _contents_get(org, repo, path, ref=base)
        if base_existing is not None:
            base_has_it = True
            try:
                cur = base64.b64decode(base_existing.get("content", "") or "")
            except Exception:
                cur = None
            if cur == content_bytes:
                return "unchanged"
    if existing is not None:
        try:
            cur = base64.b64decode(existing.get("content", "") or "")
        except Exception:
            cur = None
        if cur == content_bytes:
            return "unchanged"
        action = "updated"
    else:
        action = "updated" if base_has_it else "created"
    if not apply:
        return action  # dry-run: report what would happen
    body = {"message": "G2: {} boards-rollup Action".format(action), "content": b64}
    if branch:
        if new_branch:
            # Create the branch AND commit in one call. Creating it first with
            # POST /branches would give it the BASE branch's head, firing a push
            # event that starts a run pinned to the BASE SHA; the next write
            # supersedes and cancels that run, and a cancelled run writes a
            # commit_status of `failure` (there is no `cancelled` state). That
            # painted a red X on 13 green default branches on 2026-08-18.
            body["new_branch"] = branch
        else:
            body["branch"] = branch
    # Forgejo contents API: POST creates, PUT updates (PUT requires the prior sha).
    if existing is not None:
        body["sha"] = existing["sha"]
        method = "PUT"
    else:
        method = "POST"
    _req(method, "/repos/{}/{}/contents/{}".format(
        urllib.parse.quote(org), urllib.parse.quote(repo), urllib.parse.quote(path)), body)
    return action


G2_PR_BRANCH = "chore/g2-rollup-injection-fix"


def _default_branch(org, repo):
    meta = _get_opt("/repos/{}/{}".format(
        urllib.parse.quote(org), urllib.parse.quote(repo)))
    return (meta or {}).get("default_branch") or "main"


def _branch_exists(org, repo, branch):
    return _get_opt("/repos/{}/{}/branches/{}".format(
        urllib.parse.quote(org), urllib.parse.quote(repo),
        urllib.parse.quote(branch))) is not None


def _ensure_pr(org, repo, branch, base, title, body):
    """Open the PR. Returns a short status string; already-exists is fine."""
    try:
        pr = _req("POST", "/repos/{}/{}/pulls".format(
            urllib.parse.quote(org), urllib.parse.quote(repo)),
            {"title": title, "head": branch, "base": base, "body": body})
        return "opened #{}".format((pr or {}).get("number", "?"))
    except Exception:
        return "exists / update pushed to branch"


_PR_TITLE = "fix(G2): pass owner/repo through env: in boards-rollup"
_PR_BODY = (
    "Re-vendors the canonical `boards-rollup.yml`, which passes "
    "`github.repository_owner` and `github.event.repository.name` through "
    "`env:` instead of interpolating them directly into the `run:` block.\n\n"
    "Found by the H2 baseline gate's semgrep step "
    "(`tti.gha-interpolation-in-run`) during the K 1.4 triage on 2026-08-18: "
    "the canonical file was fixed but the vendored copies were never "
    "re-seeded, so six repos still ran the old form.\n\n"
    "Exploitability is low. Forgejo constrains owner and repo names to "
    "AlphaDashDot, so neither value can carry shell metacharacters today -- "
    "this restores the invariant rather than closing a live hole.\n\n"
    "`.forgejo/boards/_boards.py` is re-vendored alongside (install-g2.sh "
    "ships both). That delta is purely additive: G3/G4 analytics helpers the "
    "Action itself never calls."
)


def cmd_install(org, repo_only, apply, use_pr=False):
    """Vendor the G2 boards-rollup Action into each repo in the org (or --repo).
    Idempotent: re-run to propagate _boards.py changes. Dry-run unless --apply.

    With --pr, writes to a working branch and opens a pull request instead of
    committing straight to the default branch. Required for branch-protected
    repos, which reject direct contents-API commits outright, and the
    reviewable default for repos owned by another team.
    """
    payloads = {}
    for path, src in _G2_FILES.items():
        with open(src, "rb") as f:
            payloads[path] = f.read()
    touched = 0
    for repo in _repos(org, repo_only):
        base = _default_branch(org, repo) if use_pr else None
        branch = G2_PR_BRANCH if use_pr else None
        made_branch = False
        repo_touched = 0
        for path, content in payloads.items():
            # First write on a not-yet-existing branch creates it inline.
            needs_create = bool(use_pr and apply and not made_branch
                                and not _branch_exists(org, repo, branch))
            res = _put_file(org, repo, path, content, apply, branch=branch,
                            base=base, new_branch=needs_create)
            if use_pr and apply and res != "unchanged":
                made_branch = True
            mark = {"created": u"\u2713", "updated": u"\u2713", "unchanged": "="}[res]
            if res != "unchanged":
                touched += 1
                repo_touched += 1
            verb = res if apply or res == "unchanged" else "WOULD be " + res
            where = " [{}]".format(branch) if use_pr else ""
            print(u"{} {}/{} :: {}{} \u2014 {}".format(mark, org, repo, path, where, verb))
        if use_pr and repo_touched:
            if apply:
                state = _ensure_pr(org, repo, branch, base, _PR_TITLE, _PR_BODY)
                print(u"  PR {}/{}: {}  ({} \u2192 {})".format(org, repo, state, branch, base))
            else:
                print(u"  PR {}/{}: WOULD open {} \u2192 {}".format(org, repo, branch, base))
    tail = "installed/updated" if apply else "would change (dry-run; pass --apply)"
    print(u"\n{} file(s) {}.".format(touched, tail))


# --- G3/G4: analytics + roadmap JSON -----------------------------------------
# One JSON blob for the static dashboard (branding/boards/index.html). Served
# from the PUBLIC assets tree, so entities living in PRIVATE repos are redacted
# to "(private)" — their numbers still count in the aggregates, their names and
# titles never leave the forge. Thin-history tolerant: cycle time / throughput /
# flow come from the live API (created_at/closed_at need no snapshots); burndown
# series render whatever the snapshots/ CSVs have accumulated so far.

def _iso_dt(s):
    try:
        return datetime.datetime.fromisoformat((s or "").replace("Z", "+00:00"))
    except ValueError:
        return None


def _week_key(dt):
    monday = dt.date() - datetime.timedelta(days=dt.weekday())
    return monday.isoformat()


def _label_of(issue, prefix):
    for lab in issue.get("labels") or []:
        if lab["name"].startswith(prefix):
            return lab["name"][len(prefix):]
    return None


def _org_analytics(org, weeks=12, cycle_days=90):
    now = datetime.datetime.now(datetime.timezone.utc)
    week_keys = [_week_key(now - datetime.timedelta(weeks=w)) for w in range(weeks - 1, -1, -1)]
    o = {"repos": [], "epics": [], "milestones": [], "types": {}, "cycle": {},
         "flow": {"weeks": week_keys, "created": [0] * weeks, "closed": [0] * weeks},
         "totals": {"open_issues": 0, "closed_issues": 0, "open_points": 0, "closed_points": 0}}
    repo_objs = _get_paged("/orgs/{}/repos".format(urllib.parse.quote(org)))
    widx = {k: i for i, k in enumerate(week_keys)}
    cycle_samples = []
    private = set()
    for r in repo_objs:
        repo = r["name"]
        if r.get("private"):
            private.add(repo)
        disp = "(private)" if r.get("private") else repo
        issues = _issues(org, repo)
        open_i = [i for i in issues if i["state"] == "open"]
        closed_i = [i for i in issues if i["state"] == "closed"]
        op, cp = sum(map(_points_of, open_i)), sum(map(_points_of, closed_i))
        o["totals"]["open_issues"] += len(open_i)
        o["totals"]["closed_issues"] += len(closed_i)
        o["totals"]["open_points"] += op
        o["totals"]["closed_points"] += cp
        if issues:
            o["repos"].append({"repo": disp, "open": len(open_i), "closed": len(closed_i),
                               "open_points": op, "closed_points": cp})
        for i in issues:
            t = _label_of(i, "type/")
            if t:
                o["types"][t] = o["types"].get(t, 0) + 1
            c = _iso_dt(i.get("created_at"))
            if c and _week_key(c) in widx:
                o["flow"]["created"][widx[_week_key(c)]] += 1
            if i["state"] == "closed":
                cl = _iso_dt(i.get("closed_at"))
                if cl and _week_key(cl) in widx:
                    o["flow"]["closed"][widx[_week_key(cl)]] += 1
                if cl and c and (now - cl).days <= cycle_days:
                    cycle_samples.append(max((cl - c).total_seconds() / 86400.0, 0.0))
        # Epics (G1 convention: type/epic parent + `Epic: #n` child marker).
        for epic in (i for i in issues if _has_label(i, "type/epic")):
            child_re = re.compile(_EPIC_RE_TMPL.format(epic["number"]))
            children = [i for i in issues
                        if i["number"] != epic["number"] and child_re.search(i.get("body") or "")]
            done = sum(1 for c2 in children if c2["state"] == "closed")
            o["epics"].append({
                "repo": disp, "number": epic["number"],
                "title": "(private epic)" if repo in private else epic["title"],
                "state": epic["state"], "children": len(children), "done": done,
                "points_total": sum(map(_points_of, children)),
                "points_done": sum(_points_of(c2) for c2 in children if c2["state"] == "closed"),
            })
        # Milestones (G4 roadmap rows) — points from the issues we already hold.
        for m in _get_paged("/repos/{}/{}/milestones?state=all".format(
                urllib.parse.quote(org), urllib.parse.quote(repo))):
            mine = [i for i in issues if (i.get("milestone") or {}).get("title") == m["title"]]
            mo = [i for i in mine if i["state"] == "open"]
            mc = [i for i in mine if i["state"] == "closed"]
            o["milestones"].append({
                "repo": disp,
                "title": "(private milestone)" if repo in private else m["title"],
                "state": m.get("state", ""), "due_on": (m.get("due_on") or "")[:10],
                "open": len(mo), "closed": len(mc),
                "open_points": sum(map(_points_of, mo)),
                "closed_points": sum(map(_points_of, mc)),
            })
    if cycle_samples:
        cycle_samples.sort()
        n = len(cycle_samples)
        o["cycle"] = {"n": n,
                      "median_days": round(cycle_samples[n // 2], 1),
                      "p85_days": round(cycle_samples[min(int(n * 0.85), n - 1)], 1)}
    # Burndown series from the accumulated snapshot CSVs (redact private repos).
    o["burndown"] = {}
    snap_dir = os.path.join(HERE, "snapshots", org)
    if os.path.isdir(snap_dir):
        for fn in sorted(os.listdir(snap_dir)):
            if not fn.endswith(".csv"):
                continue
            repo_part = fn.split("__", 1)[0]
            key = "(private)" if repo_part in private else fn[:-4].replace("__", " · ")
            try:
                with open(os.path.join(snap_dir, fn), newline="") as f:
                    rows = list(csv.DictReader(f))[-90:]
            except OSError:
                continue
            if rows:
                o["burndown"][key] = [{"date": r["date"],
                                       "open_points": int(r.get("open_points") or 0),
                                       "closed_points": int(r.get("closed_points") or 0),
                                       "total_points": int(r.get("total_points") or 0)}
                                      for r in rows]
    return o


def cmd_analytics(orgs, out_file):
    data = {"generated_at": datetime.datetime.now(datetime.timezone.utc)
            .strftime("%Y-%m-%dT%H:%M:%SZ"), "orgs": {}}
    for org in orgs:
        if _get_opt("/orgs/{}".format(urllib.parse.quote(org))) is None:
            print("· org '{}' not found — skipped".format(org))
            continue
        data["orgs"][org] = _org_analytics(org)
        t = data["orgs"][org]["totals"]
        print("✓ {}: {} repos w/ issues · {} open / {} closed issues · {} epics · {} milestones".format(
            org, len(data["orgs"][org]["repos"]), t["open_issues"], t["closed_issues"],
            len(data["orgs"][org]["epics"]), len(data["orgs"][org]["milestones"])))
    out = out_file or os.path.join(HERE, "snapshots", "analytics.json")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    with open(out, "w") as f:
        json.dump(data, f, separators=(",", ":"))
    print("→ {}".format(out))


def main(argv):
    if len(argv) < 2:
        sys.exit(__doc__)
    cmd = argv[1]
    rest = argv[2:]
    if not rest or rest[0].startswith("-"):
        sys.exit("Usage: _boards.py {} <org> [--repo NAME] [--apply] [--pr] [--out DIR]".format(cmd))
    org = rest[0]
    repo_only = None
    out_dir = None
    apply = False
    use_pr = False
    i = 1
    while i < len(rest):
        a = rest[i]
        if a == "--apply":
            apply = True
        elif a == "--pr":
            use_pr = True
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
    elif cmd == "analytics":
        # org arg is comma-separable: `analytics tti,nis --out FILE`
        cmd_analytics([x for x in org.split(",") if x], out_dir)
    elif cmd == "demo":
        cmd_demo(org, repo_only)
    elif cmd == "install":
        cmd_install(org, repo_only, apply, use_pr)
    else:
        sys.exit("Unknown command: " + cmd)


if __name__ == "__main__":
    main(sys.argv)
