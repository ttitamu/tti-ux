# Tauri bindings

> **Status:** doctrine (2026-05-22). Companion to
> [`platform-awareness.md`](./platform-awareness.md). Enumerates
> which TUX components call which Tauri APIs, and what each one
> does in plain-web mode.

TUX components stay **runtime-agnostic**: every component must work
in a plain Nuxt SSR + browser build with no Tauri runtime. The
Tauri enhancements are **progressive enrichments** — when
`useTuxPlatform().tauri === true`, components can opt into native
APIs (window controls, share sheet, file dialog, notifications).
When false, they fall back to the equivalent web platform API or
to a graceful no-op.

This doc keeps the consumer aware of which TUX components call
which Tauri APIs so they can:
- Add the right Tauri Rust capability allowlist entries.
- Understand what the web fallback looks like.
- Stub Tauri APIs in tests.

## The capability allowlist

Tauri 2.x requires explicit capability declarations in
`src-tauri/capabilities/*.json`. Any TUX component that calls a
Tauri API needs the corresponding capability allowed. The table
below lists the capability + the TUX component that needs it.

| Capability | Used by | What it does |
|---|---|---|
| `core:window:allow-close` | `TuxAppFrame` | Close button |
| `core:window:allow-minimize` | `TuxAppFrame` | Minimize button |
| `core:window:allow-toggle-maximize` | `TuxAppFrame` | Zoom (Mac) / Maximize (Win) button |
| `core:window:allow-is-maximized` | `TuxAppFrame` | Read maximize state on mount |
| `core:window:allow-start-dragging` | `TuxAppFrame` | Drag-region on titlebar |
| `core:event:allow-listen` | `TuxAppFrame` (future) | Subscribe to window-resize / focus events |
| `dialog:allow-save` | `TuxCodeBlock` (future) | Save-as dialog for code download |
| `dialog:allow-open` | (future TuxFilePicker) | Open-file dialog |
| `notification:default` | `TuxStatusToast` (future) | OS notification fallback for toasts when window is unfocused |
| `os:default` | `useTuxPlatform` | OS family + version detection |

## Component → Tauri API reference

### `TuxAppFrame`

The single component that talks to Tauri most. Imports
`@tauri-apps/api/window` **dynamically** so the static dependency
graph stays clean for plain-web builds.

```ts
// Dynamic import keeps Tauri off the plain-web bundle.
const mod = await import("@tauri-apps/api/window");
const win = mod.getCurrentWindow();
await win.close();          // close button
await win.minimize();       // minimize button
await win.toggleMaximize(); // zoom/maximize button
const max = await win.isMaximized(); // for initial icon state
```

**Web fallback:** controls render but click-handlers are no-ops.
Useful for screenshot generation + showcase routes.

**Drag region:** `data-tauri-drag-region` on the titlebar element;
inner controls carry `data-tauri-drag-region="false"`. Tauri's
WebView handles the rest.

### `TuxArtifact` — share action (future enhancement)

When a researcher clicks the share button on a generated artifact:

```ts
// Tauri path:
const mod = await import("@tauri-apps/plugin-clipboard-manager");
await mod.writeText(url);

// Web path:
if ("share" in navigator) {
  await navigator.share({ title, text, url });
} else {
  await navigator.clipboard.writeText(url);
}
```

**Decision tree** (host owns this — TUX exposes the action button +
emits `share`):
- iOS / Android: prefer the OS share sheet via `navigator.share`.
- macOS in Tauri: prefer `tauri-plugin-shell` to invoke the share
  sheet via `osascript`; fall back to clipboard.
- Windows in Tauri: clipboard (Win11's share sheet is reachable
  but inconsistent across builds).
- Linux in Tauri: clipboard.
- Plain web on desktop: clipboard.

### `TuxCodeBlock` — download (future enhancement)

The existing download button uses `<a download>` (creates a Blob).
A Tauri enhancement would use the native save dialog:

```ts
// Tauri path:
const dialog = await import("@tauri-apps/plugin-dialog");
const fs = await import("@tauri-apps/plugin-fs");
const path = await dialog.save({
  defaultPath: filename,
  filters: [{ name: "Code", extensions: ["ts", "js", "vue"] }],
});
if (path) await fs.writeTextFile(path, code);

// Web path (current):
const blob = new Blob([code], { type: "text/plain" });
const url = URL.createObjectURL(blob);
const a = document.createElement("a");
a.href = url; a.download = filename; a.click();
URL.revokeObjectURL(url);
```

### `TuxStatusToast` — system notification (future enhancement)

When the Tauri window is **unfocused**, toasts should escalate to
native notifications so the user sees them on the OS notification
center:

```ts
import { isPermissionGranted, requestPermission, sendNotification }
  from "@tauri-apps/plugin-notification";

const visible = !document.hidden;
if (!visible && useTuxPlatform().value.tauri) {
  let permissionGranted = await isPermissionGranted();
  if (!permissionGranted) {
    permissionGranted = (await requestPermission()) === "granted";
  }
  if (permissionGranted) {
    sendNotification({ title, body });
  }
}
```

**Web fallback:** standard `Notification` API where permitted; the
in-page toast always renders regardless.

### `useTuxPlatform` — OS detection

Already documented in the composable itself. Detection priority:

1. `globalThis.__TAURI_INTERNALS__` → Tauri runtime.
2. `globalThis.__TAURI_OS_PLUGIN_INTERNALS__` → Tauri 2.x os plugin.
3. `navigator.platform` + `navigator.userAgent` → fallback.

The composable **never imports** `@tauri-apps/api/os` statically —
detection is best-effort based on global presence. This keeps the
plain-web bundle small.

### Future: `TuxFilePicker`

Spec for when a consumer needs file selection (e.g., import a
corpus into Landscape):

```ts
const dialog = await import("@tauri-apps/plugin-dialog");
const file = await dialog.open({
  multiple: false,
  filters: [{ name: "Corpus", extensions: ["jsonl", "csv", "parquet"] }],
});
// `file` is the absolute path; consumer reads via @tauri-apps/plugin-fs.
```

**Web fallback:** standard `<input type="file">`. The Tauri path
gives the user a real file path (which the Rust side can stream
without needing the file uploaded into JS memory); the web path
gives a `File` object the consumer reads via FileReader.

## Capability allowlist template

For consumer apps that ship a Tauri shell with TUX components,
copy this baseline into `src-tauri/capabilities/main.json`:

```json
{
  "$schema": "../gen/schemas/desktop-schema.json",
  "identifier": "main-capability",
  "description": "TUX baseline capabilities",
  "windows": ["main"],
  "permissions": [
    "core:default",
    "core:window:allow-close",
    "core:window:allow-minimize",
    "core:window:allow-toggle-maximize",
    "core:window:allow-is-maximized",
    "core:window:allow-start-dragging",
    "core:event:allow-listen",
    "os:default",
    "clipboard-manager:default",
    "dialog:allow-save",
    "dialog:allow-open",
    "notification:default"
  ]
}
```

Add per-app capabilities (network, fs scopes, shell allowlists)
on top. The baseline above is what TUX components need at a
minimum.

## Where things lived before

Pre-2026-05-22, TUX was web-only — none of these bindings existed.
The dynamic-import + capability-allowlist pattern landed with the
[platform-aware Tauri build sprint](../CHANGELOG.md#added--platform-aware-tauri-build-sprint-2026-05-22).
This doc consolidates the bindings so consumer apps know what's
expected.

## When to add a new binding

Don't add a Tauri API call to a TUX component "just in case." The
bar:

- A consumer app actually needs the enhancement.
- The web fallback is genuinely worse for the user.
- The component owner adds the binding **and** updates this doc in
  the same PR.

Most TUX components stay pure Vue / web platform. The bindings
above are the exception, not the rule.
