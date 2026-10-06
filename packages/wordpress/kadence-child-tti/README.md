# TTI Kadence Child Theme (v3.0.0)

Official child theme for [Kadence](https://www.kadencewp.com/) adhering to Texas A&M Transportation Institute (TTI) Communications & Marketing brand guidelines and W3C WCAG 2.2 Level AAA standards.

## Features
- **Official Brand Colors**: Automatically injects Aggie Maroon (`#500000`), Deep Maroon (`#3C0000`), and Warm Gold (`#CFA935`) into the Kadence Customizer color palette.
- **Rectangular Button Geometry**: Restricts all buttons to `border-radius: 0px` matching TTI's corporate web design system.
- **Signature Heading Rhythm**: Provides the official Aggie Maroon heading with a 2px Warm Gold underline rule.
- **WCAG 2.2 Level AAA Compliance**: Enqueues `tux-bridge.css` and `tux-tokens.css` ensuring $44\times 44\text{px}$ minimum touch targets, $7:1$ text contrast, and $3\text{px}$ high-contrast focus rings.
- **Tier 1 Institutional Utility Bar**: Renders the top maroon utility bar with direct links to TTI Jobs, Pressroom, Directory, and Contact.

## Installation

### Method 1: WordPress Admin Upload
1. Ensure the parent theme **Kadence** is installed (`Appearance -> Themes`).
2. Download or zip the `kadence-child-tti` directory:
   ```bash
   zip -r kadence-child-tti.zip kadence-child-tti/
   ```
3. In WordPress Admin, navigate to `Appearance -> Themes -> Add New -> Upload Theme`.
4. Upload `kadence-child-tti.zip` and click **Activate**.

### Method 2: Manual / Git Deployment
Copy or symlink `kadence-child-tti` into your WordPress installation:
```bash
wp-content/themes/kadence-child-tti/
```
Navigate to `Appearance -> Themes` and click **Activate**.
