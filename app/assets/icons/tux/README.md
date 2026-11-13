# TUX icons (`tux:`)

The few icons TUX draws that are not Lucide's. The layer registers this folder as the `tux` icon
collection (`nuxt.config.ts`, `icon.customCollections`), so a component writes
`<Icon name="tux:accessibility" />`. `tux-icons.json` holds the same icons as an Iconify collection,
for consumers that build their own sprite or inline them (`@tti/tti-ux/app/assets/icons/tux/tux-icons.json`).
A test keeps the two in step.

| Icon | Source | Meaning |
|---|---|---|
| `tux:accessibility` | Tabler Icons 3.51.0 `accessible` | Accessibility settings: the universal-access figure, for digital surfaces (the wheelchair is physical access) |
| `tux:accessibility-active` | Tabler Icons 3.51.0 `accessible-filled` | The same, filled: a setting the control holds is on (not the default) |

Tabler Icons is MIT-licensed, © 2020–2026 Paweł Kuna; the licence is `LICENSE-tabler` beside this
file and travels with every copy.
