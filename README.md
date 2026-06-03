# @tti/ux

TTI design system — CSS tokens + components, published to the TTI self-hosted Forgejo npm registry.

The point: replace `<script src="cdn.example.com/...">` and copy-pasted color hex codes across researcher project sites with a single versioned, SCA-scanned npm package.

## Consume

```bash
# In your project's .npmrc
@tti:registry=http://forgejo.tti.local/api/packages/tti/npm/

# Install
npm install @tti/ux
```

```html
<link rel="stylesheet" href="/node_modules/@tti/ux/dist/index.css">

<button class="tti-button">Click me</button>
```

## Build

```bash
npm run build   # → dist/
```

## Publish

Push a tag (`v0.1.0`, `v0.2.0`, …). The `publish` workflow runs Trivy, builds, and pushes to the registry.
