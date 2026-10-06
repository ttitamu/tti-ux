<script setup lang="ts">
useHead({ title: "Logos & Brand Assets · TUX" });

const { copied, copiedKey, copy } = useTuxClipboard();

// Interactive background for previewing transparency
type PreviewBg = "checkerboard" | "white" | "dark" | "maroon";
const previewBg = ref<PreviewBg>("checkerboard");

const bgStyles: Record<PreviewBg, string> = {
  checkerboard: "bg-surface-sunken bg-[radial-gradient(var(--surface-border)_1.5px,transparent_1.5px)] [background-size:16px_16px]",
  white: "bg-white text-slate-900 border border-slate-200",
  dark: "bg-[#15100F] text-white border border-[#3D3A3A]",
  maroon: "bg-[#500000] text-white border border-[#3A0000]",
};

const cdnBase = "https://cdn.jsdelivr.net/gh/ttitamu/tti-ux@main/public/resources/logos";
const githubRawBase = "https://raw.githubusercontent.com/ttitamu/tti-ux/main/public/resources/logos";
const forgejoBase = "https://code.tti.tamu.edu/tti/tti-ux/raw/branch/main/public/resources/logos";

interface LogoItem {
  id: string;
  name: string;
  file: string;
  desc: string;
  dimensions: string;
  bytes: number;
  sizeKb: string;
  recommendedFor: string;
  bestOn: string;
}

const fullLockups: LogoItem[] = [
  {
    id: "logo-keyline",
    name: "TTI Dual-Mode Keyline (Copilot Chat Ready)",
    file: "tti-logo-keyline.png",
    desc: "Collegiate silhouette: bold 4.5px white contour hugging letterforms. 100% invisible on light grounds; lights up with high contrast on dark mode. Zero clumsy square box.",
    dimensions: "680 × 131 px",
    bytes: 9198,
    sizeKb: "8.98 KB",
    recommendedFor: "M365 Copilot Chat footer, dual-theme pages, mixed light/dark surfaces.",
    bestOn: "BOTH Light and Dark backgrounds",
  },
  {
    id: "logo-color",
    name: "TTI Official Color Lockup",
    file: "tti-logo-color.png",
    desc: "Official institutional logo. Maroon (#500000) road glyph mark with pure Black wordmark text.",
    dimensions: "680 × 131 px",
    bytes: 7719,
    sizeKb: "7.54 KB",
    recommendedFor: "Light surfaces, default web navigation bars, M365 light themes.",
    bestOn: "White / light backgrounds",
  },
  {
    id: "logo-black",
    name: "TTI Monochrome Black",
    file: "tti-logo-black.png",
    desc: "Single-ink solid black lockup. Road glyph and wordmark text both in pure #000000.",
    dimensions: "680 × 131 px",
    bytes: 9280,
    sizeKb: "9.06 KB",
    recommendedFor: "High-contrast monochrome print, grayscale docs, technical papers.",
    bestOn: "White / grayscale backgrounds",
  },
  {
    id: "logo-white",
    name: "TTI Monochrome White (Reversed)",
    file: "tti-logo-white.png",
    desc: "Reversed solid white lockup. Road glyph and wordmark text both in pure #FFFFFF with smooth alpha edges.",
    dimensions: "680 × 131 px",
    bytes: 9272,
    sizeKb: "9.05 KB",
    recommendedFor: "M365 dark headers, Maroon navbars, slides, dark mode apps.",
    bestOn: "Dark / Maroon backgrounds",
  },
  {
    id: "logo-maroon",
    name: "TTI All-Maroon Lockup",
    file: "tti-logo-maroon.png",
    desc: "Unified single-ink Maroon (#500000) lockup for marketing materials and editorial layouts.",
    dimensions: "680 × 131 px",
    bytes: 9732,
    sizeKb: "9.50 KB",
    recommendedFor: "Marketing pages, branded covers, single-color maroon print.",
    bestOn: "White / cream backgrounds",
  },
];

const squareMarks: LogoItem[] = [
  {
    id: "glyph-color-sq",
    name: "Road Glyph · Color (Square)",
    file: "tti-glyph-color-square.png",
    desc: "Centered Maroon (#500000) road glyph on 512×512 transparent canvas.",
    dimensions: "512 × 512 px",
    bytes: 3568,
    sizeKb: "3.48 KB",
    recommendedFor: "App tiles, M365 app launcher icons, avatars, social icons.",
    bestOn: "Light backgrounds",
  },
  {
    id: "glyph-keyline-sq",
    name: "Road Glyph · Keyline (Square)",
    file: "tti-glyph-keyline-square.png",
    desc: "Centered Maroon (#500000) road glyph with precision white contour for dual-theme app tiles.",
    dimensions: "512 × 512 px",
    bytes: 3700,
    sizeKb: "3.61 KB",
    recommendedFor: "App launcher tiles & avatars rendered across both light/dark surfaces.",
    bestOn: "BOTH Light and Dark backgrounds",
  },
  {
    id: "glyph-white-sq",
    name: "Road Glyph · White (Square)",
    file: "tti-glyph-white-square.png",
    desc: "Centered solid white (#FFFFFF) road glyph on 512×512 transparent canvas.",
    dimensions: "512 × 512 px",
    bytes: 3757,
    sizeKb: "3.67 KB",
    recommendedFor: "Dark mode avatars, app tiles, footers, dark status cards.",
    bestOn: "Dark / Maroon backgrounds",
  },
  {
    id: "glyph-black-sq",
    name: "Road Glyph · Black (Square)",
    file: "tti-glyph-black-square.png",
    desc: "Centered solid black (#000000) road glyph on 512×512 transparent canvas.",
    dimensions: "512 × 512 px",
    bytes: 3636,
    sizeKb: "3.55 KB",
    recommendedFor: "Monochrome app icons, print avatars, documents.",
    bestOn: "Light backgrounds",
  },
  {
    id: "glyph-maroon-sq",
    name: "Road Glyph · Maroon (Square)",
    file: "tti-glyph-maroon-square.png",
    desc: "Centered Maroon (#500000) road glyph on 512×512 transparent canvas.",
    dimensions: "512 × 512 px",
    bytes: 3634,
    sizeKb: "3.55 KB",
    recommendedFor: "Marketing square badges, favicons, branding.",
    bestOn: "Light backgrounds",
  },
];
</script>

<template>
  <div class="space-y-12 w-full max-w-7xl 2xl:max-w-[1536px]">
    <TuxPageHeader eyebrow="foundations · resources" title="Logos & Brand Assets">
      Canonical, high-resolution transparent PNG logos for the Texas A&amp;M
      Transportation Institute (TTI). Every asset is precision-engineered to be
      <strong>strictly under 10 KB</strong> with 100% alpha transparency,
      making them directly compliant with the Microsoft 365 Admin Center
      organization theme limit and ready for embedding anywhere across the web.
    </TuxPageHeader>

    <!-- M365 Callout Notice -->
    <TuxAlert
      variant="important"
      title="Microsoft 365 Admin Center Ready"
      description="Microsoft 365 Custom Themes enforce a strict 10 KB (10,240 bytes) limit for navbar logos. All horizontal lockups below are 680×131 px (delivering 2.8×–5.6× Retina sharpness at standard header sizes) while weighing between 7.5 KB and 9.5 KB."
    />

    <!-- Interactive Background Selector -->
    <section class="space-y-3">
      <div class="flex flex-wrap items-center justify-between gap-4 border-b border-surface-border pb-3">
        <div>
          <h2 class="text-lg font-bold">Full Horizontal Lockups</h2>
          <p class="text-xs text-text-muted">680 × 131 px · Transparent PNG · &lt; 10 KB</p>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs font-semibold text-text-secondary">Preview surface:</span>
          <div class="inline-flex rounded-md border border-surface-border p-0.5 bg-surface-sunken">
            <button
              type="button"
              class="px-2.5 py-1 text-xs font-medium rounded transition-colors"
              :class="previewBg === 'checkerboard' ? 'bg-surface-raised font-bold shadow-xs' : 'text-text-muted hover:text-text-primary'"
              @click="previewBg = 'checkerboard'"
            >
              Grid (Alpha)
            </button>
            <button
              type="button"
              class="px-2.5 py-1 text-xs font-medium rounded transition-colors"
              :class="previewBg === 'white' ? 'bg-surface-raised font-bold shadow-xs' : 'text-text-muted hover:text-text-primary'"
              @click="previewBg = 'white'"
            >
              Light
            </button>
            <button
              type="button"
              class="px-2.5 py-1 text-xs font-medium rounded transition-colors"
              :class="previewBg === 'dark' ? 'bg-surface-raised font-bold shadow-xs' : 'text-text-muted hover:text-text-primary'"
              @click="previewBg = 'dark'"
            >
              Dark
            </button>
            <button
              type="button"
              class="px-2.5 py-1 text-xs font-medium rounded transition-colors"
              :class="previewBg === 'maroon' ? 'bg-surface-raised font-bold shadow-xs' : 'text-text-muted hover:text-text-primary'"
              @click="previewBg = 'maroon'"
            >
              Maroon
            </button>
          </div>
        </div>
      </div>

      <!-- Lockup Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <div
          v-for="item in fullLockups"
          :key="item.id"
          class="rounded-lg border border-surface-border bg-surface-raised flex flex-col overflow-hidden shadow-xs"
        >
          <!-- Live Preview Canvas -->
          <div
            class="h-36 flex items-center justify-center p-6 transition-colors duration-200"
            :class="bgStyles[previewBg]"
          >
            <img
              :src="`/resources/logos/${item.file}`"
              :alt="item.name"
              class="max-h-14 max-w-full object-contain"
            />
          </div>

          <!-- Metadata & Actions -->
          <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
            <div>
              <div class="flex items-start justify-between gap-2">
                <h3 class="font-bold text-base text-text-primary">{{ item.name }}</h3>
                <TuxBadge tone="success" class="shrink-0">✓ {{ item.sizeKb }}</TuxBadge>
              </div>
              <p class="text-xs text-text-secondary mt-1.5 leading-relaxed">{{ item.desc }}</p>
              
              <div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-muted">
                <span><strong>Dimensions:</strong> {{ item.dimensions }}</span>
                <span><strong>Bytes:</strong> {{ item.bytes.toLocaleString() }} B</span>
                <span><strong>Best on:</strong> {{ item.bestOn }}</span>
              </div>
            </div>

            <!-- URL Copy & Download Buttons -->
            <div class="pt-3 border-t border-surface-border space-y-2">
              <div class="text-[11px] font-semibold text-text-muted uppercase tracking-wider">Direct Resource URLs</div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <TuxButton
                  intent="secondary"
                  size="xs"
                  class="w-full justify-center text-xs"
                  @click="copy(`${cdnBase}/${item.file}`, `cdn-${item.id}`)"
                >
                  <UIcon :name="copied && copiedKey === `cdn-${item.id}` ? 'lucide:check' : 'lucide:copy'" class="size-3.5 mr-1" />
                  {{ copied && copiedKey === `cdn-${item.id}` ? 'Copied CDN URL' : 'Copy CDN URL' }}
                </TuxButton>

                <TuxButton
                  intent="secondary"
                  size="xs"
                  class="w-full justify-center text-xs"
                  @click="copy(`${githubRawBase}/${item.file}`, `raw-${item.id}`)"
                >
                  <UIcon :name="copied && copiedKey === `raw-${item.id}` ? 'lucide:check' : 'lucide:copy'" class="size-3.5 mr-1" />
                  {{ copied && copiedKey === `raw-${item.id}` ? 'Copied Raw URL' : 'Copy GitHub Raw' }}
                </TuxButton>
              </div>

              <div class="flex items-center justify-between gap-2 pt-1">
                <button
                  type="button"
                  class="text-[11px] text-text-brand hover:underline font-mono truncate"
                  @click="copy(`/resources/logos/${item.file}`, `local-${item.id}`)"
                >
                  {{ copied && copiedKey === `local-${item.id}` ? '✓ Local path copied!' : `/resources/logos/${item.file}` }}
                </button>
                <a
                  :href="`/resources/logos/${item.file}`"
                  :download="item.file"
                  class="inline-flex items-center text-xs font-semibold text-text-brand hover:underline shrink-0"
                >
                  <UIcon name="lucide:download" class="size-3.5 mr-1" />
                  Download
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Square Glyph Icons / Avatars -->
    <section class="space-y-3">
      <div class="border-b border-surface-border pb-3">
        <h2 class="text-lg font-bold">Square Road Glyph (Avatars &amp; App Tiles)</h2>
        <p class="text-xs text-text-muted">512 × 512 px · Centered on transparent canvas · &lt; 4 KB</p>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
        <div
          v-for="item in squareMarks"
          :key="item.id"
          class="rounded-lg border border-surface-border bg-surface-raised flex flex-col overflow-hidden shadow-xs"
        >
          <!-- Live Preview Canvas -->
          <div
            class="h-28 flex items-center justify-center p-3 transition-colors duration-200"
            :class="bgStyles[previewBg]"
          >
            <img
              :src="`/resources/logos/${item.file}`"
              :alt="item.name"
              class="max-h-16 max-w-16 object-contain"
            />
          </div>

          <div class="p-3 flex-1 flex flex-col justify-between space-y-2">
            <div>
              <div class="font-bold text-xs truncate">{{ item.name }}</div>
              <div class="text-[11px] text-text-muted mt-0.5">{{ item.sizeKb }} · 512×512</div>
            </div>

            <div class="space-y-1 pt-2 border-t border-surface-border">
              <TuxButton
                intent="secondary"
                size="xs"
                class="w-full justify-center text-[11px] py-1"
                @click="copy(`${cdnBase}/${item.file}`, `cdn-${item.id}`)"
              >
                <UIcon :name="copied && copiedKey === `cdn-${item.id}` ? 'lucide:check' : 'lucide:copy'" class="size-3 mr-1" />
                {{ copied && copiedKey === `cdn-${item.id}` ? 'Copied' : 'Copy URL' }}
              </TuxButton>
              <a
                :href="`/resources/logos/${item.file}`"
                :download="item.file"
                class="block text-center text-[11px] font-semibold text-text-brand hover:underline py-0.5"
              >
                Download
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Microsoft 365 Admin Center Guide -->
    <section class="space-y-4 pt-4 border-t border-surface-border">
      <div>
        <p class="eyebrow">integration guide</p>
        <h2 class="text-xl font-bold">Using in Microsoft 365 Admin Center</h2>
        <p class="text-sm text-text-secondary mt-1">
          Follow these steps to brand your organization's Microsoft 365 tenant (SharePoint, Outlook Web, Teams, and Office suite).
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="p-5 rounded-lg border border-surface-border bg-surface-raised space-y-2">
          <div class="size-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-sm">1</div>
          <h3 class="font-bold text-sm">Open Theme Settings</h3>
          <p class="text-xs text-text-secondary leading-relaxed">
            In the <a href="https://admin.microsoft.com" target="_blank" rel="noopener" class="text-text-brand underline font-semibold">Microsoft 365 admin center</a>, navigate to <strong>Settings</strong> → <strong>Org settings</strong> → <strong>Organization profile</strong> tab → <strong>Custom themes</strong>.
          </p>
        </div>

        <div class="p-5 rounded-lg border border-surface-border bg-surface-raised space-y-2">
          <div class="size-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-sm">2</div>
          <h3 class="font-bold text-sm">Upload Optimized Logo</h3>
          <p class="text-xs text-text-secondary leading-relaxed">
            Under <strong>Logo image</strong>, upload <code>tti-logo-white.png</code> (if your header theme is dark or maroon) or <code>tti-logo-color.png</code> (if light). Both strictly comply with the 10 KB file cap.
          </p>
        </div>

        <div class="p-5 rounded-lg border border-surface-border bg-surface-raised space-y-2">
          <div class="size-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-sm">3</div>
          <h3 class="font-bold text-sm">Set Navigation URL</h3>
          <p class="text-xs text-text-secondary leading-relaxed">
            Set <strong>On click, open this URL</strong> to <code>https://tti.tamu.edu</code> (or your department portal). Click <strong>Save changes</strong> to publish across the organization.
          </p>
        </div>
      </div>

      <!-- URL Formats Reference Table -->
      <div class="mt-6 rounded-lg border border-surface-border overflow-hidden bg-surface-raised">
        <div class="p-4 bg-surface-sunken border-b border-surface-border font-bold text-sm">
          URL Schemes for External Embedding
        </div>
        <div class="divide-y divide-surface-border text-xs font-mono">
          <div class="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span class="font-sans font-semibold text-text-primary block text-sm">jsDelivr CDN (Recommended for Web &amp; M365)</span>
              <span class="text-text-muted select-all">{{ cdnBase }}/tti-logo-color.png</span>
            </div>
            <TuxButton intent="secondary" size="xs" @click="copy(`${cdnBase}/tti-logo-color.png`, 'cdn-ref')">
              {{ copied && copiedKey === 'cdn-ref' ? 'Copied' : 'Copy' }}
            </TuxButton>
          </div>
          <div class="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span class="font-sans font-semibold text-text-primary block text-sm">GitHub Raw</span>
              <span class="text-text-muted select-all">{{ githubRawBase }}/tti-logo-color.png</span>
            </div>
            <TuxButton intent="secondary" size="xs" @click="copy(`${githubRawBase}/tti-logo-color.png`, 'raw-ref')">
              {{ copied && copiedKey === 'raw-ref' ? 'Copied' : 'Copy' }}
            </TuxButton>
          </div>
          <div class="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span class="font-sans font-semibold text-text-primary block text-sm">Internal TTI Forgejo</span>
              <span class="text-text-muted select-all">{{ forgejoBase }}/tti-logo-color.png</span>
            </div>
            <TuxButton intent="secondary" size="xs" @click="copy(`${forgejoBase}/tti-logo-color.png`, 'forgejo-ref')">
              {{ copied && copiedKey === 'forgejo-ref' ? 'Copied' : 'Copy' }}
            </TuxButton>
          </div>
        </div>
      </div>
    </section>

    <!-- High-Resolution Masters Link -->
    <section class="p-6 rounded-lg border border-surface-border bg-surface-sunken flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h3 class="font-bold text-sm text-text-primary">Need print-ready 5000px high-resolution masters?</h3>
        <p class="text-xs text-text-secondary mt-1">
          Full 5000×970 px master PNGs for billboards, event signage, report covers, and Adobe Illustrator/Photoshop are preserved in <code>/resources/logos/hires/</code>.
        </p>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <a
          href="/resources/logos/hires/tti-logo-color-hires.png"
          download="tti-logo-color-hires.png"
          class="inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded border border-surface-border bg-surface-raised hover:bg-surface-page transition-colors"
        >
          <UIcon name="lucide:download" class="size-3.5 mr-1" />
          Color Master (139 KB)
        </a>
        <a
          href="/resources/logos/hires/tti-logo-white-hires.png"
          download="tti-logo-white-hires.png"
          class="inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded border border-surface-border bg-surface-raised hover:bg-surface-page transition-colors"
        >
          <UIcon name="lucide:download" class="size-3.5 mr-1" />
          White Master (128 KB)
        </a>
      </div>
    </section>
  </div>
</template>
