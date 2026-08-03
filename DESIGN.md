---
version: alpha
name: Formulari Ubat PKD Kuala Langat v2
description: Official Clinical Reference Guide & Drug Formulary Progressive Web Application for Pejabat Kesihatan Daerah Kuala Langat.
colors:
  brand-50: "#f0fdfa"
  brand-100: "#ccfbf1"
  brand-200: "#99f6e4"
  brand-300: "#5eead4"
  brand-400: "#2dd4bf"
  brand-500: "#14b8a6"
  brand-600: "#0d9488"
  brand-700: "#0f766e"
  brand-800: "#115e59"
  brand-900: "#134e4a"
typography:
  sans:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
  heading:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: 700
    lineHeight: 1.2
  mono:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1
rounded:
  base: 12px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
components:
  button-primary:
    backgroundColor: "{colors.brand-600}"
    textColor: "#ffffff"
    rounded: "{rounded.base}"
    padding: 8px 16px
  button-primary-hover:
    backgroundColor: "{colors.brand-500}"
  card:
    backgroundColor: "#ffffff"
    rounded: "{rounded.base}"
    padding: 16px
---

# Overview

Formulari Ubat PKD Kuala Langat v2 is an offline-first Progressive Web Application designed for medical officers, pharmacists, and healthcare personnel. It provides high-performance, responsive clinical medication search and detailed formulary lookups across low-light clinic environments and mobile devices.

## Colors

The application uses an institutional clinical color scheme centered around the Healthcare Teal brand palette (`--color-brand-*`), perfectly aligned with the app's official medical cross and pill logo assets, complemented by an Amber status palette for restricted Quota Control drugs and Slate background surfaces.

- **Brand Accent:** `--color-brand-600` (`#0d9488`) serves as the primary action token for active filter states, focus rings, call-to-action buttons, and system accents.
- **Quota Status:** `amber-500` (`#f59e0b`) signals administrative Quota Control restrictions across card left borders, status badges, and filter chips.
- **Theme Surfaces:** Dual-theme light and dark mode adaptive slates (`slate-50`/`white` light mode vs `slate-900`/`slate-800` dark mode), with dynamic `<meta name="theme-color">` status bar synchronization.

## Typography

Set entirely in self-hosted Inter variable font with strict readable hierarchy:

- **Headlines:** `text-balance` wrapping with `font-bold` weight for crisp screen legibility.
- **Body & Clinical Descriptions:** `text-pretty` for natural multi-line line breaks across dosage, contraindications, and clinical indications.
- **Codes & Metadata:** `font-mono` with `tabular-nums` for MDC numbers, MAL registration codes, build hashes, and filter counts.

## Layout & Visual Hierarchy

Dynamic 100% viewport container bounded at `max-w-4xl` centered layout.
- **Hero Focal Level 1 (Search Box):** Positioned immediately below the header with elevated visual styling (shadow-md/xl, glowing brand border focus ring, `type="search"`, `role="search"`, and desktop `Cmd+K` / `/` shortcut badges).
- **Filter Controls (Level 2):** High-contrast category filter chips immediately below search with `min-h-[44px]` touch targets.
- **Quick History (Level 3):** Contextual dropdown panel for recent searches that appears organically when the Search Input is focused and empty, avoiding persistent visual clutter.
- **Medication List (Level 4):** Windowed list utilizing `@tanstack/react-virtual` with dynamic DOM element height measurement (`measureElement`) for 60fps scrolling.

## Accessibility & WCAG 2.2 Compliance

- **Focus Appearance (2.4.13):** Explicit high-contrast focus rings (`focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900`) across all interactive controls.
- **Target Size Minimum (2.5.8):** All interactive buttons, inputs, chips, and close controls enforce minimum 44px touch target bounds (`min-h-[44px]`).
- **Accessible Names (4.1.2):** Every form control and icon-only button provides explicit `<label>` or `aria-label` definitions with `aria-hidden="true"` on decorative icons.
- **Keyboard Navigation:** Full keyboard support including `/` and `Cmd+K` / `Ctrl+K` to jump to search, `Escape` to close dialogs, and native `<button>` element semantics for all cards and chips.

## Do's and Don'ts

- Do use `--color-brand-*` tokens for all primary actions, active filter states, and focus rings.
- Don't use `<div>` or `<span>` as clickable elements; use native `<button>` or `<a>` elements with proper `type` attributes.
- Do enforce `min-h-[44px]` touch target boundaries on all interactive elements per WCAG 2.2.
- Don't remove focus outlines without providing a visible `focus-visible:ring-2` replacement.
