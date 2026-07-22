<script setup lang="ts">
useHead({ title: "TuxMenuBar · TUX" });

const platform = useTuxPlatform();

const menus = [
  {
    label: "File",
    items: [
      [
        { label: "New project", icon: "lucide:file-plus", kbds: ["meta", "n"] },
        { label: "Open…",   icon: "lucide:folder-open", kbds: ["meta", "o"] },
      ],
      [
        { label: "Save",         icon: "lucide:save",     kbds: ["meta", "s"] },
        { label: "Save as…", icon: "lucide:save-all", kbds: ["meta", "shift", "s"] },
      ],
      [
        { label: "Quit", kbds: ["meta", "q"] },
      ],
    ],
  },
  {
    label: "Edit",
    items: [
      [
        { label: "Undo", icon: "lucide:undo", kbds: ["meta", "z"] },
        { label: "Redo", icon: "lucide:redo", kbds: ["meta", "shift", "z"] },
      ],
      [
        { label: "Cut", icon: "lucide:scissors", kbds: ["meta", "x"] },
        { label: "Copy", icon: "lucide:copy", kbds: ["meta", "c"] },
        { label: "Paste", icon: "lucide:clipboard", kbds: ["meta", "v"] },
      ],
    ],
  },
  {
    label: "View",
    items: [
      [
        { label: "Toggle sidebar", icon: "lucide:sidebar", kbds: ["meta", "b"] },
        { label: "Toggle focus mode", icon: "lucide:focus", kbds: ["meta", "."] },
      ],
    ],
  },
  {
    label: "Help",
    items: [
      [
        { label: "Documentation", icon: "lucide:book-open" },
        { label: "Keyboard shortcuts", icon: "lucide:keyboard", kbds: ["meta", "/"] },
        { label: "About Landscape", icon: "lucide:info" },
      ],
    ],
  },
];

const basicVue = `<tux-menu-bar :menus="menus" />`;
</script>

<template>
  <div class="space-y-10">
    <TuxPageHeader eyebrow="component · platform-aware chrome" title="TuxMenuBar">
      In-window menu strip for Windows / Linux Tauri shells. The classic
      File / Edit / View / Help row anchored under the titlebar. On macOS,
      the component renders nothing — Mac users expect the system menu
      strip at the top of the screen (populate it via Tauri Rust config).
      <br><br>
      <span class="text-sm text-text-muted">
        Detected host: <code>{{ platform.os }}</code>. On Mac, pass
        <code>renderOnMac</code> to force the component to render anyway
        (useful for demos like this one).
      </span>
    </TuxPageHeader>

    <section>
      <p class="eyebrow">basic</p>
      <h2 class="heading--bold text-xl font-bold">Four-menu strip</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        Each menu definition has a <code>label</code> and
        <code>items</code> (array-of-arrays per
        <code>UDropdownMenu</code> convention — outer groups create
        divider sections). Shortcuts render via the same kbd grammar
        TuxKbd uses, so they get platform-correct labels automatically.
      </p>
      <TuxExample class="mt-4" :vue="basicVue">
        <TuxMenuBar :menus="menus" :render-on-mac="true" />
      </TuxExample>
    </section>

    <section>
      <p class="eyebrow">when not to render</p>
      <h2 class="heading--bold text-xl font-bold">macOS skip</h2>
      <p class="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
        By default the component renders nothing on macOS / iOS. macOS
        users expect their menus at the **top of the screen** as a
        system strip — drawing a fake one in-window would conflict
        visually and feel non-native. Tauri's Rust side populates the
        system menu via the menu builder; on Win/Linux, this component
        is the fallback.
      </p>
    </section>
  </div>
</template>
