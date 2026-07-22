# Microsoft Store Asset Guidance (Community)

**Source:** Figma file `AB3klc5ASVy2MfUHHHTIiC`
**Captured:** 2026-05-19
**Absorbed:** 2026-05-22
**Priority:** medium → skip
**Status:** absorbed — no new components; out-of-scope reference

![cover](./cover.png)

## What it is

A 5-page spec for **submitting apps to the Microsoft Store** —
required asset sizes, icon templates, marketing-screenshot
guidance. Pure submission-process reference; not a UI/design
system.

The cover shows an "app name" tile with version + category + Get
button + screenshot strip + ESRB rating — exactly the Microsoft
Store listing card.

## Pages (5)

- `1:5` — Cover _(skip)_
- `4012:551` — separator _(skip)_
- `2100:84` — Change Log _(skip)_
- `4011:2171` — **Asset Guidance** _(3 frames — required sizes,
  icon templates, screenshot specs)_
- `22:1214` — **Templates** _(1 frame — production-ready PSD-style
  templates)_

## Skip

- **Everything.** TTI doesn't ship apps to the Microsoft Store.
  Landscape and tti-ai-studio are web apps consumed at TTI-hosted
  URLs. Zero adjacency to TUX's surface.

## Absorb

- **None.** The closest crumb might be "favicon + apple-touch-icon
  size spec," which we already handle through `public/favicon/`
  conventions — nothing new from this file.

## Tension

- **None.** No temptation, no edge case. File is irrelevant to TUX.

## Decisions

- **No new components.** Out-of-scope; close audit.
- **Downgrade priority** to skip on next INDEX rebuild. This file
  was mis-bucketed as medium; should always have been skip.

## Open follow-ups

- Audit closed. No follow-ups.
