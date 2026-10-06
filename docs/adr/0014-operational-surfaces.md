# ADR 0014 — operational surfaces are a kit target, not a host fork

- **Date**: 2026-09-15
- **Status**: Accepted

## Context

The Nagios Core overlay (`nagios-stack`) had to paint a CGI it does
not own, then emit an owned operator document for pages operators
live on. Two things TUX did not yet ship as first-class:

1. A **class API** for the status ramp (ADR-0013 gave tokens only).
2. A **TuxExample tab** for that API, parallel to Vue / HTML /
   Source (and to the Power BI tab on charts).

Without those, every ops consumer re-ports heading keylines, row
tints, and chips, and eventually mints a hex. The overlay also
tempted putting Core selectors (`.serviceOK`) in the kit — which
would make tti-ux a Nagios fork.

## Decision

**Ship `kit/css/tux-ops.css` as a hand-maintained recipe layer**
(same tier as `tux-bootstrap.css`: token-referencing, not
token-emitting). Vue `TuxStatus` is a thin wrapper over those
classes. `TuxExample` gains an optional `css` tab. Host selectors
stay in the consuming repo.

The style-guide page `/components/status` shows Vue, HTML, CSS,
and Source for the same chip. `/examples/ops-board` is the
composition.

## Consequences

- Overlay consumers vendor `tux-tokens.css` + `tux-ops.css` and
  map. They do not open a PR to tti-ux for `.statusBGCRITICAL`.
- `TuxBadge status=` remains job lifecycle. Feeding OK/CRITICAL
  through it is a misuse; the catalog page says so.
- A hex in `tux-ops.css` is a CI failure (`tests/tux-ops-kit.test.ts`).
