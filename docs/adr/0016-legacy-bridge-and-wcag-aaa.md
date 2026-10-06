# ADR 0016 — Legacy Modernization Bridge (`tux-bridge.css`) & WCAG 2.2 AAA Architecture

- **Date**: 2026-09-24
- **Status**: Accepted
- **Extends**: ADR-0004, ADR-0012, ADR-0014, ADR-0015

## Context

The Texas A&M Transportation Institute (TTI) operates dozens of critical web portals, research databases, and administrative tools developed over the past two decades. These applications span a wide spectrum of tech stacks:
1. Enterprise systems in ASP.NET WebForms and Razor MVC.
2. Research telemetry and crash analysis databases in PHP and Perl/CGI.
3. Marcom and project-specific websites in WordPress (Kadence and classic themes).
4. Plain static HTML reporting dashboards and intranet documentation.

Complete rewrites of these legacy tools into modern frontend frameworks (such as Vue 3 / Nuxt 4) are often infeasible due to budget constraints, active research contracts, and legacy backend dependencies. Consequently, these tools frequently suffer from:
- Cramped 20px form controls failing modern touch-target guidelines.
- Unstyled or monolithic `<table>` elements with zero padding, missing zebra striping, and poor responsive behavior.
- Inconsistent link colors and low-contrast secondary copy failing basic contrast checks.
- Browser-default or missing focus outlines (`outline: none`), blocking keyboard navigation.

Furthermore, state and federal research mandates increasingly require compliance with **WCAG 2.2**. Meeting **WCAG 2.2 Level AAA**—the highest accessibility standard—positions TTI as a benchmark institution for inclusive transportation software.

## Decision

We introduce **`tux-bridge.css`**, a zero-JavaScript, single-stylesheet drop-in bridge designed to modernize legacy TTI web interfaces while enforcing **WCAG 2.2 AAA** compliance across all native HTML elements.

### 1. Delivery Architecture
- Shipped at `kit/css/tux-bridge.css` and mirrored at `public/css/tux-bridge.css` (accessible directly at `/css/tux-bridge.css`).
- Dual-mode application:
  - **Global Mode**: Dropped directly into the `<head>` of standalone legacy applications to upgrade all native HTML tags (`table`, `th`, `td`, `input`, `select`, `textarea`, `button`, `a`, `h1`-`h6`, `fieldset`, `blockquote`).
  - **Scoped Mode (`.tux-bridge`)**: Applied as a container class to isolate modern styling to specific legacy widgets or embedded views without disrupting existing host styles.

### 2. WCAG 2.2 Level AAA Calibration
- **Criterion 1.4.6 Contrast (Enhanced - AAA)**:
  - Normal text (< 18pt or < 14pt bold) requires at least **7.0:1** contrast.
  - Aggie Maroon (`#500000` / `var(--brand-primary)`) on White achieves **15.66:1**, well exceeding the 7.0:1 threshold.
  - Primary text (`#111827` / `#1F2937`) achieves **14.68:1** to **17.74:1**.
  - Secondary text (`--text-secondary`) is calibrated to `#374151` (**10.31:1**) and `#4B5563` (**7.56:1**), guaranteeing AAA compliance for captions and table metadata.
  - Warm Gold (`#CFA935` / `var(--brand-accent)`) provides only **2.24:1** on white; it is strictly restricted to non-text accents (keylines, borders) or paired exclusively with dark backgrounds (where it achieves **7.31:1** on `#221F1F` and **6.99:1** on `#500000`).
- **Criterion 2.4.13 Focus Appearance (AAA)**:
  - All interactive elements exhibit an active focus indicator with a minimum **3px solid stroke** and **2px offset** (`outline: 3px solid var(--brand-primary); outline-offset: 2px`).
  - Features an inset/outset contrast barrier ensuring ≥ 3:1 contrast against both the element and adjacent backgrounds.
- **Criterion 2.5.8 Target Size (Enhanced - AAA)**:
  - All clickable controls (buttons, text inputs, selects, pagination triggers, checkboxes) have a minimum touch target size of **44×44 CSS pixels** (`min-height: 44px`).
- **Criterion 1.4.8 Visual Presentation (AAA)** & **1.4.12 Text Spacing**:
  - Line-height standard of `1.5` to `1.6`.
  - Max text measure maintained below 80 characters for optimal readability.
  - Left-aligned typography (no full justification).
  - Explicit tabular figures (`font-variant-numeric: tabular-nums`) on tables to prevent jitter during numerical scanning.

### 3. TTI Brand Harmony (ADR-0015 Parity)
- Rectangular 0px button geometry matching TTI Kadence institutional standards.
- Signature maroon table headers with gold accent keylines (`border-bottom: 3px solid var(--brand-accent)`).
- Clean Roboto / Inter font stack fallback.

## Consequences

- Legacy TTI portals can be modernized in minutes with zero code rewrite: simply add one `<link>` tag.
- Guarantees Texas A&M brand alignment and WCAG 2.2 AAA accessibility across older applications.
- Provides a transitional runway for research groups to migrate their software at their own pace.
