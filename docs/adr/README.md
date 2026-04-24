# Architectural Decision Records

Small, dated records of decisions that shaped tti-ux. The pattern is lifted
from [Michael Nygard's ADR template](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions.html):
context, decision, consequences.

ADRs are append-only history. When a decision changes, we don't edit the old
ADR — we write a new one and update the status of the old one to `Superseded
by ADR-NNNN`. That way the reasoning behind obsolete decisions stays
recoverable.

## Index

- [0001 — Nuxt 4 + Nuxt UI as the foundation](0001-nuxt-4-and-nuxt-ui.md)
- [0002 — `Tux*` as the component prefix](0002-tux-prefix-naming.md)
- [0003 — Standalone repo until an npm team is provisioned](0003-standalone-repo-until-npm-team.md)
- [0004 — aggieux tokens live alongside the Nuxt UI theme, not inside it](0004-aggieux-tokens-separate-from-nuxt-ui-theme.md)
- [0005 — Three-theme palette (tti / tti-dark / tti-hc)](0005-three-theme-palette.md) (toggle cycle superseded by 0006)
- [0006 — Separate high-contrast mode from the casual theme toggle](0006-separate-hc-from-casual-theme-toggle.md)

## Contributing

When you make a non-trivial call (swap a dependency, change the naming
convention, reshape the public API), write an ADR:

1. Copy the format from an existing file.
2. Number it sequentially — next ADR is the highest existing number + 1.
3. Date it in ISO format.
4. Keep it under ~1 page. ADRs that grow into full design docs belong in
   `docs/` proper, not here.

Status values: `Proposed`, `Accepted`, `Superseded by ADR-NNNN`, `Deprecated`.
