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

## Layout

Dynamic 100% viewport container bounded at `max-w-4xl` centered layout. List windowing utilizes `@tanstack/react-virtual` with dynamic DOM element height measurement (`measureElement`) to guarantee smooth 60fps scrolling without card overlap or irregular vertical gaps.

## Elevation & Depth

Visual hierarchy is maintained via crisp borders (`border-slate-200`/`border-slate-700`), subtle shadows (`shadow-sm`), and translucent glassmorphic panel backdrops (`backdrop-blur-md`) rather than heavy drop shadows.

## Shapes

All containers, input fields, cards, and modal dialogs utilize a unified `12px` (`rounded-xl` / `rounded-2xl`) corner radius. Status badges and pill buttons use full circular rounding (`rounded-full`).

## Components

- **Buttons:** Tactile `active:scale-95` press feedback with `disabled:opacity-60` protection and spinning refresh state during asynchronous operations.
- **Modal Dialogs:** Native HTML5 `<dialog>` elements with backdrop blur overlays, focus trapping, scroll locking, and Escape key handling.
- **Cards:** Accessible focus rings (`focus:ring-brand-500`), single-line header title truncation, and clear metadata tags.

## Do's and Don'ts

- Do use `--color-brand-*` tokens for all primary actions, active filter states, and focus rings.
- Don't hardcode static dark slate background classes without paired `dark:` light mode variants.
- Do use `tabular-nums` for numerical data, MDC codes, and MAL numbers.
- Don't combine `text-balance` with single-line `truncate` heading elements.
