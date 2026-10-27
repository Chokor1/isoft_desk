---
name: ISOFT Desk
description: The Frappe v13 desk shell for ISOFT ERP, with a theme-following sidebar, a calm top bar and module pages that show what is waiting.
colors:
  isoft-blue: "#0079c2"
  isoft-blue-deep: "#006aa9"
  isoft-blue-strong: "#0a93e0"
  isoft-blue-tint: "#e2f5ff"
  on-accent: "#ffffff"
  cool-ground: "#f4f6f8"
  surface: "#ffffff"
  ink: "#14202b"
  ink-muted: "#4f5f6f"
  ink-faint: "#6b7b8a"
  rule: "#e1e6eb"
  rule-strong: "#c9d2db"
  hover-wash: "#eef2f5"
  side-ink: "#33424f"
  side-ink-muted: "#5f6f7e"
  side-strong: "#0b1b2a"
  state-ok: "#1f7a4d"
  state-warn: "#a15c07"
  state-bad: "#b42318"
  dark-blue: "#0879be"
  dark-blue-hover: "#1488cf"
  dark-blue-strong: "#3fb5ff"
  dark-blue-text: "#6dcbff"
  dark-side-active: "#7fd6ff"
  dark-blue-tint: "#0c3350"
  dark-ground: "#0e151c"
  dark-surface: "#151f29"
  dark-hover-wash: "#1b2733"
  dark-rule: "#243240"
  dark-rule-strong: "#34475a"
  dark-ink: "#e6edf3"
  dark-ink-muted: "#a3b3c2"
  dark-ink-faint: "#8696a6"
  dark-side-ink: "#c3d1de"
  dark-side-ink-muted: "#8a9bab"
  dark-state-ok: "#4cc38a"
  dark-state-warn: "#e7a54a"
  dark-state-bad: "#f2766b"
  login-ground: "#eef3f7"
  login-door: "#f6f9fb"
  login-door-mid: "#ebf0f5"
  login-door-seam: "#e4ebf1"
  login-interior-floor: "#e7eef4"
  login-glow: "#008cd2"
  login-shade: "#0f2236"
  login-trace: "#3c648c"
  login-title: "#0b3a57"
  login-chip-ink: "#1b2a38"
  login-core-label: "#3c6482"
  login-core-mid: "#4aa8e0"
  login-core-deep: "#0b5d8f"
  core-dark-top: "#060a12"
  core-dark-ground: "#0a1120"
  core-dark-glow: "#5db4e6"
  core-dark-title: "#d6f0ff"
  core-dark-sub: "#a9e0ff"
typography:
  count:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "26px"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.01em"
    fontFeature: "tnum"
  body:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.35
    fontFeature: "tnum"
  title:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.35
  meta:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.35
  label:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "0.06em"
  label-small:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "0.06em"
  core-title:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif"
    fontSize: "48px"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "6px"
  core-sub:
    fontFamily: "ui-monospace, Menlo, Consolas, monospace"
    fontSize: "12px"
    fontWeight: 400
    letterSpacing: "4px"
rounded:
  xs: "3px"
  sm: "4px"
  md: "6px"
  menu: "8px"
spacing:
  hair: "2px"
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "28px"
  xxl: "32px"
  sidebar: "232px"
  rail: "60px"
  drawer: "272px"
components:
  sidebar:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.side-ink}"
    typography: "{typography.body}"
    width: "{spacing.sidebar}"
  sidebar-dark:
    backgroundColor: "{colors.dark-surface}"
    textColor: "{colors.dark-side-ink}"
  sidebar-rail:
    width: "{spacing.rail}"
  sidebar-group:
    textColor: "{colors.side-ink}"
    typography: "{typography.title}"
    rounded: "{rounded.md}"
    padding: "7px 10px"
    height: "34px"
  sidebar-item:
    textColor: "{colors.side-ink}"
    rounded: "{rounded.md}"
    padding: "6px 8px 6px 10px"
    height: "30px"
  sidebar-item-hover:
    backgroundColor: "{colors.hover-wash}"
    textColor: "{colors.side-strong}"
  sidebar-item-active:
    backgroundColor: "{colors.isoft-blue-tint}"
    textColor: "{colors.isoft-blue}"
  sidebar-item-active-dark:
    backgroundColor: "{colors.dark-blue-tint}"
    textColor: "{colors.dark-side-active}"
  sidebar-direct-link:
    textColor: "{colors.side-ink}"
    typography: "{typography.title}"
    rounded: "{rounded.md}"
    padding: "7px 10px"
    height: "34px"
  sidebar-direct-link-active:
    backgroundColor: "{colors.isoft-blue-tint}"
    textColor: "{colors.isoft-blue}"
  sidebar-search:
    backgroundColor: "{colors.hover-wash}"
    textColor: "{colors.side-strong}"
    rounded: "{rounded.md}"
    height: "32px"
    padding: "0 10px 0 32px"
  company-switcher:
    textColor: "{colors.side-ink}"
    rounded: "{rounded.md}"
    padding: "6px 8px"
  menu:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.side-ink}"
    rounded: "{rounded.menu}"
    padding: "6px"
  topbar-menu:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.menu}"
    padding: "6px"
  topbar-menu-dark:
    backgroundColor: "{colors.dark-surface}"
    textColor: "{colors.dark-ink}"
  topbar-menu-item:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "7px 10px"
  topbar-menu-item-hover:
    backgroundColor: "{colors.hover-wash}"
    textColor: "{colors.ink}"
  topbar-menu-toggle:
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.md}"
  topbar-menu-toggle-open:
    backgroundColor: "{colors.hover-wash}"
    textColor: "{colors.ink}"
  notification-tab:
    textColor: "{colors.ink-muted}"
    typography: "{typography.title}"
  notification-tab-active:
    textColor: "{colors.ink}"
  notification-item:
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
  notification-time:
    textColor: "{colors.ink-faint}"
  notification-footer:
    textColor: "{colors.isoft-blue}"
    typography: "{typography.title}"
  search-results:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.menu}"
    padding: "6px"
  search-result:
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "8px 10px"
  search-result-selected:
    backgroundColor: "{colors.hover-wash}"
  search-result-mark:
    textColor: "{colors.isoft-blue}"
  search-result-mark-dark:
    textColor: "{colors.dark-blue-text}"
  app-launcher:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.menu}"
  app-launcher-tile-hover:
    backgroundColor: "{colors.hover-wash}"
  button-primary:
    backgroundColor: "{colors.isoft-blue}"
    textColor: "{colors.on-accent}"
  button-primary-hover:
    backgroundColor: "{colors.isoft-blue-deep}"
  button-primary-dark:
    backgroundColor: "{colors.dark-blue}"
    textColor: "{colors.on-accent}"
  button-primary-dark-hover:
    backgroundColor: "{colors.dark-blue-hover}"
  topbar:
    backgroundColor: "{colors.surface}"
  topbar-search:
    backgroundColor: "{colors.cool-ground}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
  topbar-app-button:
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.md}"
    size: "34px"
  waiting-tile:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "14px 16px 13px"
  waiting-tile-zero:
    textColor: "{colors.ink-faint}"
  waiting-tile-bad:
    textColor: "{colors.state-bad}"
  waiting-tile-warn:
    textColor: "{colors.state-warn}"
  quick-link:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.title}"
    rounded: "{rounded.md}"
    padding: "5px 12px"
    height: "30px"
  quick-link-hover:
    textColor: "{colors.isoft-blue}"
  link-index-hover-dark:
    textColor: "{colors.dark-blue-text}"
  index-heading:
    textColor: "{colors.ink-muted}"
    typography: "{typography.label}"
  index-link:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    padding: "7px 0"
  index-link-disabled:
    textColor: "{colors.ink-faint}"
  tooltip:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "8px 10px"
  login-ground:
    backgroundColor: "{colors.login-ground}"
  login-door:
    backgroundColor: "{colors.login-door}"
  login-module-chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.login-chip-ink}"
  login-core-disc:
    backgroundColor: "{colors.login-core-mid}"
    textColor: "{colors.login-core-label}"
  login-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.login-chip-ink}"
  login-input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
  login-button:
    backgroundColor: "{colors.isoft-blue}"
    textColor: "{colors.on-accent}"
  login-button-hover:
    backgroundColor: "{colors.isoft-blue-deep}"
  loading-screen:
    backgroundColor: "{colors.login-ground}"
    textColor: "{colors.login-title}"
    typography: "{typography.core-title}"
  loading-screen-dark:
    backgroundColor: "{colors.core-dark-ground}"
    textColor: "{colors.core-dark-title}"
  loading-screen-sub:
    typography: "{typography.core-sub}"
  list-toolbar:
    backgroundColor: "{colors.surface}"
    padding: "10px 14px"
  list-search:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "0 10px 0 32px"
    height: "30px"
  list-chip:
    backgroundColor: "{colors.isoft-blue-tint}"
    textColor: "{colors.isoft-blue}"
    typography: "{typography.title}"
    rounded: "{rounded.md}"
    padding: "0 0 0 10px"
    height: "28px"
  list-chip-dark:
    backgroundColor: "{colors.dark-blue-tint}"
    textColor: "{colors.dark-blue-text}"
  list-add-filter:
    textColor: "{colors.isoft-blue}"
    typography: "{typography.title}"
    rounded: "{rounded.md}"
    padding: "0 8px"
    height: "28px"
  list-add-filter-hover:
    backgroundColor: "{colors.hover-wash}"
  list-filter-panel:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.menu}"
    padding: "12px"
    width: "560px"
  list-filter-label:
    textColor: "{colors.ink-muted}"
  list-header:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-muted}"
    height: "34px"
  list-row:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    padding: "0 14px 0 0"
    height: "36px"
  list-row-hover:
    backgroundColor: "{colors.hover-wash}"
  list-figure-column:
    textColor: "{colors.ink}"
    width: "8.75rem"
  list-activity:
    textColor: "{colors.ink-faint}"
    typography: "{typography.meta}"
    width: "104px"
  list-status-ok:
    textColor: "{colors.state-ok}"
    typography: "{typography.title}"
  list-status-warn:
    textColor: "{colors.state-warn}"
    typography: "{typography.title}"
  list-status-bad:
    textColor: "{colors.state-bad}"
    typography: "{typography.title}"
  list-status-neutral:
    textColor: "{colors.ink-muted}"
    typography: "{typography.title}"
  list-paging-button:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    height: "30px"
  list-paging-current:
    backgroundColor: "{colors.isoft-blue-tint}"
    textColor: "{colors.isoft-blue}"
  report-row:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    height: "36px"
  report-filter-input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.meta}"
    rounded: "{rounded.md}"
    height: "26px"
  query-report-card:
    backgroundColor: "{colors.surface}"
  query-report-card-dark:
    backgroundColor: "{colors.dark-surface}"
  query-report-fold:
    backgroundColor: "{colors.surface}"
    padding: "10px 14px"
  query-report-chip:
    backgroundColor: "{colors.isoft-blue-tint}"
    textColor: "{colors.isoft-blue}"
    typography: "{typography.title}"
    rounded: "{rounded.md}"
    padding: "0 10px"
    height: "28px"
  query-report-chip-dark:
    backgroundColor: "{colors.dark-blue-tint}"
    textColor: "{colors.dark-blue-text}"
  query-report-toggle:
    textColor: "{colors.isoft-blue}"
    typography: "{typography.title}"
    rounded: "{rounded.md}"
    padding: "0 8px"
    height: "28px"
  query-report-toggle-hover:
    backgroundColor: "{colors.hover-wash}"
  query-report-filters:
    backgroundColor: "{colors.surface}"
    padding: "14px"
  query-report-filter-label:
    textColor: "{colors.ink-muted}"
  query-report-filter-control:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    height: "30px"
  query-report-filter-control-invalid:
    textColor: "{colors.state-bad}"
  query-report-summary:
    backgroundColor: "{colors.surface}"
    padding: "12px 14px"
  query-report-summary-label:
    textColor: "{colors.ink-muted}"
    typography: "{typography.meta}"
  query-report-chart-band:
    backgroundColor: "{colors.surface}"
    padding: "8px 14px 0"
  query-report-totals-row:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
  form-connection-chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "0 10px"
    height: "28px"
  form-connection-toggle:
    textColor: "{colors.isoft-blue}"
    typography: "{typography.title}"
    rounded: "{rounded.md}"
    padding: "0 4px"
    height: "28px"
  form-totals-strip:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
  form-totals-cell:
    textColor: "{colors.ink}"
    padding: "10px 18px 11px"
  form-totals-cell-hover:
    backgroundColor: "{colors.hover-wash}"
  form-totals-label:
    textColor: "{colors.ink-muted}"
    typography: "{typography.meta}"
  form-totals-overdue:
    textColor: "{colors.state-bad}"
  form-section-links:
    backgroundColor: "{colors.cool-ground}"
    padding: "6px 0"
  form-section-links-stuck:
    backgroundColor: "{colors.surface}"
  form-section-link:
    textColor: "{colors.ink-muted}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "0 10px"
    height: "28px"
  form-section-link-hover:
    backgroundColor: "{colors.hover-wash}"
    textColor: "{colors.ink}"
  form-section-link-active:
    backgroundColor: "{colors.isoft-blue-tint}"
    textColor: "{colors.isoft-blue}"
    typography: "{typography.title}"
  form-section-link-active-dark:
    backgroundColor: "{colors.dark-blue-tint}"
    textColor: "{colors.dark-blue-text}"
  form-section-card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
  form-section-head:
    textColor: "{colors.ink}"
  form-field-label:
    textColor: "{colors.ink-muted}"
  form-input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
  form-input-invalid:
    textColor: "{colors.state-bad}"
  form-grid:
    rounded: "{rounded.md}"
  form-grid-header:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-muted}"
  form-grid-row-hover:
    backgroundColor: "{colors.hover-wash}"
  form-status-dark-ok:
    textColor: "{colors.dark-state-ok}"
  form-status-dark-warn:
    textColor: "{colors.dark-state-warn}"
  form-status-dark-bad:
    textColor: "{colors.dark-state-bad}"
  form-status-dark-neutral:
    textColor: "{colors.dark-ink-muted}"
---

# Design System: ISOFT Desk

## Overview

**Creative North Star: "The Category Standard, Played Straight"**

ISOFT Desk is a shell, not a skin. It replaces the Frappe v13 desk's navigation and module pages with the polish users already know from Odoo 17, Linear, Stripe Dashboard and ERPNext v15: a theme-following sidebar on the left, a slim white top bar, and module pages that answer "what is waiting for me in this company" before anything else. The people using it are accounting, sales, stock and management staff on 1366x768 laptops, working in Portuguese or English. They arrive with a job, do it and leave. Density is moderate (13px body, 30 to 34px rows), and every surface is flat, white or slate, and separated by 1px tinted rules.

The world is quiet so that state can be loud. ISOFT cyan-blue is the only accent. It marks where you are, the primary action, focus and links. Green, amber and red appear only when a count means something needs attention. The v13 desk's cyan-topped card grid, star watermark and flat 20-item module list are removed on purpose.

The scope is deliberately narrow. Everything lives under `body.isd-on`, so a user outside the pilot, or a site with the app switched off, sees the standard desk unchanged. Since phase 2, the List and Report views of every DocType (`/app/<doctype>` and `/view/report`) are restyled: one toolbar line of search, filter chips and "+ Add filter" over a full-width table whose amounts are never cut. Since phase 3, the form of every DocType (Isoft apps' included) is restyled too: a compact Connections row, a totals strip on transactions and links to the form's own sections over core's layout, with core's sections, fields and child tables on the desk's surfaces. The form's structure stays the DocType's and Customize Form's; the desk only reads it. Since phase 4, every query and script report (`/app/query-report/<name>`, ERPNext's and the Isoft apps') is restyled too: each filter is named above its control, and once the report has run with data the filters fold to one line of value chips over the report's summary, chart and grid. Which filters a report has, and how its chart looks, stay the report's own. Kanban, Image, Tree and Calendar views and dialogs keep core styling inside the shell (the form rules are scoped to the page, so a dialog opened over a form keeps core's look too).

Two surfaces sit before the shell and follow different rules. The login page is the incumbent core "vault" (two doors, module chips wired into an authentication core, the card at the seam), and core's dark vault is its design, not this app's. The app only adds a light recolouring of it, picked from the theme this browser last used on the desk. The loading screen (core's splash and the post-login boot cover) is drawn from the vault interior's own recipe, "ISOFT ERP" over "ENTERPRISE CORE · ONLINE" on the gridded core ground with its breathing glow, so after login the room the doors open onto simply stays on screen until the desk is ready: one screen, not two. Both paint before the shell exists, so they carry literal colours from this palette instead of the `--isd-*` tokens.

**Key Characteristics:**
- Theme-following sidebar: a white panel with a 1px rule in light mode, deep slate in dark mode.
- One accent, the ISOFT ERP logo's blue, in three strengths: a fill, a line and a text shade. Semantic colours carry state only.
- Inter with tabular figures. Counts are large, and labels sit below them.
- 6px radii everywhere, 8px on menus. Menus and popovers are the only things with a shadow, apart from the stuck form section links, which carry core's own page-head shadow.
- Every top-bar menu (Help, user, notifications, search results, the ISOFT applications launcher) sits on the desk's own surface, rule and shadow.
- Fully scoped (`body.isd-on`). List and Report views, every form and every query and script report are restyled from core's own controls; Kanban, Image, Tree and Calendar views and dialogs keep core styling.
- Query and script reports keep their own filters and chart: the desk names the filters, folds them to value chips once the report has data, and puts the summary, chart band, grid and totals on its surfaces.
- Forms keep the DocType's structure untouched: the desk adds a Connections row, a totals strip and section links on top, and dresses core's sections, fields and tables.
- The login vault opens in the browser's last desk theme; the light vault is a recolour, never a relayout.
- Every load shows the vault interior, light or dark, in the desk theme the server rendered.

## Colors

A cool slate-and-white neutral field with one saturated blue, and semantic hues kept for state. Each light token has a dark counterpart, which is swapped in under `[data-theme="dark"]`.

### Primary
The accent is tuned to the ISOFT ERP logo and split by job, because one blue cannot be both a white-ink fill and a 3:1 hairline on white.
- **Logo Blue** (isoft-blue / dark-blue): the solid fill of the primary button, with white ink (on-accent) in both themes. In light mode the same shade is the text accent: links, quick-link hover text, the active sidebar item and core's `--primary`.
- **Logo Blue Deep** (isoft-blue-deep / dark-blue-hover): the primary button on hover and press. In dark mode it lightens instead of darkening.
- **Logo Blue Bright** (isoft-blue-strong / dark-blue-strong): lines, never text. Tile and quick-link hover borders, the 2px tile focus outline, the top-bar and sidebar search focus borders, the first chart series and its legend dot, the focus border of editable form inputs and report filter inputs, the hover border of form Connections chips and the 2px keyboard ring on the form's added controls. It is also the brand blue of the sidebar's own highlights.
- **Sky Link Blue** (dark-blue-text): the dark-mode text accent for links and core's `--primary`. The dark active sidebar item uses the paler **Sky Active** (dark-side-active).
- **Blue Tint** (isoft-blue-tint / dark-blue-tint): the active sidebar item background, the current option in a menu, the 3px focus halo on top-bar search and on the list search and filter inputs, the sidebar scrollbar thumb, list filter chips, report value chips, the current page size in the list pager, the current form section link and the 3px focus halo of editable form inputs and report filter inputs.

### Neutral
- **Cool Ground** (cool-ground / dark-ground): the page ground behind all work surfaces, also painted on `html` so overscroll never flashes another colour.
- **Surface** (surface / dark-surface): the top bar, sidebar, menus, tiles, quick links and chart widget, and on forms the section cards, editable inputs, the totals strip, Connections chips and the stuck section-link band, and the whole query or script report card (filters, value-chip row, summary, chart band, grid and totals row, which core paints grey in dark mode), in both modes. The sidebar and the top bar share one surface so they meet without a seam; a Rule separates them from the ground.
- **Ink, Ink Muted, Ink Faint**: primary text; secondary text (context line, breadcrumbs, index headings, tile DocType line); and zero counts, disabled links, placeholders and a report's footer message.
- **Side Ink / Side Ink Muted / Side Strong**: sidebar text at rest; section labels, the version number and icons; hovered and open-group text.
- **Rule / Rule Strong**: 1px separators. Rule sits between index rows, around tiles and around the top bar. Rule Strong goes under index headings and around quick links, on forms around editable inputs and Connections chips and under child-table headers, and on reports around filter inputs and over the totals row.
- **Hover Wash**: the hover background in the sidebar and the top bar, and the sidebar search field; on forms, the hover of totals cells, section links and child-table rows.

### State
- **OK / Warn / Bad** (state-ok, state-warn, state-bad and their dark counterparts): only for counts and states that need action. Shipped counts use `bad` (overdue invoices, rejected by AGT). The stylesheet also supports `warn`. On forms, State Bad marks an overdue outstanding amount and its days late, and a missing mandatory or invalid field (border and label).

### Login Surface (light vault)
Cool and pale, so the vault reads as the same room with the lights on. Defined in `isd_login.css` under `html[data-isd-login="light"]`; the dark vault's colours stay in core's `login.scss`.
- **Login Ground** (login-ground): the page and vault background behind the doors.
- **Door Steel** (login-door, login-door-mid, login-door-seam): the door gradient, pale at the edges and darkest at the 50% seam, over a faint 3px Login Shade line texture. The inner edge of each door is a 1px blue rule at 24%.
- **Interior** (login-door to login-interior-floor): the revealed core behind the doors, a vertical gradient under a 9% blue radial wash, with 46px gridlines in blue at 7%.
- **Core Glow** (login-glow): the one glow hue of the light vault. It lights the core halo (22%), the core disc shadow (35%), the interior glow (18%), the title text-shadow (25%) and the card's outer halo (8%).
- **Core Disc** (surface to login-core-mid to login-core-deep): a radial sphere, white highlight at 38% from the top. Its ring is blue at 30% and its label is Login Core Label.
- **Module Chips**: Surface to a pale cool white, a 1px blue border at 22%, Logo Blue icons and Login Chip Ink labels. The traces that wire them to the core are Login Trace at 32%.
- **Title** (login-title): the interior title; its subtitle is the same ink at 62%.
- **Accent**: the light vault uses the desk's own Logo Blue (isoft-blue) and Logo Blue Deep (isoft-blue-deep) for every solid blue: chip icons, the focus border, links and the button. It has no accent of its own. The translucent blue percentages above (wash, gridlines, door rule, chip, ring and card borders) are computed from Logo Blue, rgb(0,121,194).
- **Card, inputs, button**: the card is Surface at 86% with a blue border at 20% and Login Chip Ink text; its heading and subtitle are Side Ink. Inputs are Surface with a Rule Strong border, Ink text, Ink Faint placeholders and icons, and a Logo Blue border with a 3px 15% Logo Blue halo on focus. The button is Logo Blue with white ink and a soft blue shadow, Logo Blue Deep on hover. Show/forgot/sign-up links are Logo Blue, and the sign-up line is Ink Muted.
- **Login Shade** (login-shade): the cool ink behind every light-vault shadow and door rule. It is never used as a fill.

### Loading Screen (the vault interior)
Defined in `isd_loader.css` as seven `--isd-core-*` properties on `html` (ground, base, grid, glow, title, title-glow, sub, plus the font stack), switched by `data-theme`. Both themes copy the vault interior layer for layer, the dark one from core's `login.scss` and the light one from the light vault.
- **Dark:** ground is a vertical gradient from Core Dark Top to Core Dark Ground under a 10% Core Dark Glow radial wash; gridlines are Core Dark Glow at 7%; the glow is Core Dark Glow at 28%. The title is Core Dark Title with a Core Dark Glow text-shadow at 60%, and the subtitle is Core Dark Sub at 70%.
- **Light:** Login Door to Login Interior Floor under a 9% blue wash, gridlines in blue at 7%, the glow in Login Glow at 18%, the title in Login Title with a Login Glow shadow at 25%, and the subtitle in Login Title at 62%.
- **Base** (the page behind the cover and splash): Core Dark Ground in dark mode and Login Ground in light mode, so nothing flashes between the vault and the cover.

### Named Rules
**The One Accent Rule.** Inside the desk shell, ISOFT blue is the only hue that is not about state. A second brand colour, a gradient or a coloured section header does not belong there. The login vault and the loading screen are blue worlds too: their glow hues are blues from the same family, never a second hue. The one exception is the applications launcher's app icon tones: each tone names an app, so they keep their own hue while everything around them takes the desk tokens. In List and Report views, blue workflow states (core's blue, light-blue, cyan and purple indicators: Submitted, Enabled, To Bill and the like) read as neutral Ink Muted, so blue never stands for a state. The same holds for a form's status in the page head in dark mode.

**The Fill, Line, Text Rule.** Each accent job has its own shade. Fills carry white ink (Logo Blue, about 4.8:1). Lines, borders, focus outlines and chart series use Logo Blue Bright, which holds 3:1 against the surface but is too light for text. Text uses the text shade (Logo Blue in light mode, Sky Link Blue in dark mode). Never set text in the line shade, and never use the fill shade for hairlines.

**The Vault Is Core's Rule.** The dark vault (core `login.scss` and `www/login.html`) is the incumbent design and stays where it is. This app only recolours it, under `html[data-isd-login="light"]`. Doors, chips, traces, core and card keep core's geometry, motion and gradients, and the light variant swaps their colours one for one. The single change that reaches both themes is a repair: core's breathing keyframes drop the glow's centring translate, so the app re-runs the same breath (`isd-vi-breathe`, 3.6s, opacity 0.55 to 0.9, scale 1 to 1.12) with the translate kept, and the glow sits centred on the title as core intended.

**The Colour Is State Rule.** A tile count turns red or amber only when its definition carries a tone and the count is above zero. A zero count goes faint, never green. The module page's chart draws series 1 in Logo Blue Bright and further series in Ink Faint and Rule Strong, with no area fill. A query or script report's chart is the report's: its colours and type stay as the report sets them, and the desk only sets its axis and legend text in Ink Muted (The Filters Are The Report's Rule). On a form, the outstanding amount turns State Bad only on a submitted document with money still owed past its due date, and the due date then names the days late in State Bad; an outstanding that is not late stays Ink.

## Typography

**Body Font:** Inter (core Frappe v13 stack, inherited; the app sets no font-family of its own)

**Character:** One neutral grotesque at small, controlled sizes. Hierarchy comes from weight and from one large number, not from a display face. Module pages turn on tabular figures so counts line up.

### Hierarchy
- **Count** (600, 26px, 1.15, -0.01em, tabular): the number on a waiting tile, the largest type the shell adds.
- **Title** (500, 13px): tile labels, quick links and sidebar group buttons.
- **Body** (400, 13px, 1.35): sidebar items, index links and the module context line ("ITEC LDA · October 2026").
- **Meta** (400, 12px): the tile DocType line, the sidebar version and tooltips.
- **Label** (600, 12px, 0.06em, uppercase): link-index card headings.
- **Label Small** (600, 11px, 0.06em, uppercase): menu titles (the company menu and rail flyouts). The sidebar lists its groups with no section label.
- **Form sizes:** totals-strip values 600 at 17px (15px on phones), tabular; form section heads 600 at 13px; field labels and child-table headers 500 at 12px. They live in the forms stylesheet only, not as tokens.
- **Report sizes:** filter labels 500 at 12px; value chips and the Edit/Hide filters toggle 500 at 13px; summary values 600 at 17px, tabular, over 12px labels; the totals row 600. They live in the reports stylesheet only, not as tokens.

Page titles and every other text size come from core. On phones the form title wraps at 17px.

### Loading Screen Type
- **Core Title** (800, 48px, 6px tracking): "ISOFT ERP", as the vault interior's title, in the system font stack the vault uses (`--isd-core-font`), not Inter.
- **Core Sub** (400, 12px, 4px tracking, monospace): "ENTERPRISE CORE · ONLINE", 12px below the title. It is the only monospace in the app, copied from the vault interior.

### Named Rules
**The Names Read As Names Rule.** Some core translations start in lowercase ("cotação"). Tile labels, DocType lines, quick links, index links, index headings, form totals labels and section links capitalise their first letter, through CSS `::first-letter` or, for New buttons, in JS.

**The Own Context Rule.** Every interface string the app adds is translated with context "ISOFT Desk" (`__(text, replace, "ISOFT Desk")`), so it never overrides another app's translation of the same English word. Labels that belong to core (DocType names, workspace labels) use plain `__()`.

**The Two Lines Rule.** Sidebar labels wrap to at most two lines and never truncate to one. Long Portuguese names stay readable.

## Layout

- **Shell:** a fixed left sidebar 232px wide, and `.main-section` offset by the same width. On forms (the `Form` route) and on query and script reports (the `query-report` route, for their columns) the sidebar collapses to a 60px rail; on forms, the core left column (attachments, tags, shares) starts hidden, and the form takes the full remaining width. Core's own sidebar toggle can still reopen that column. Inside the form, the layout (field order, sections, columns, widths) is the DocType's; see The Structure Is The DocType's Rule. Users can also collapse to the rail by choice, and the preference persists.
- **Hidden routes:** the full-screen POS (`posapp`) and Isoft pages that draw their own fixed sidebar (Invenza, SAF-T Center, Insights, Angola HR dashboard, Location Manager, Command Center, Intelize, FE Angola dashboard) hide the desk sidebar completely. Those pages look exactly as they do without the app. Isoft app pages are not listed in the sidebar, and Isoft app workspaces (Business AI, Itec Integrations, HP, HP Partnership) are left out at the source; users reach them from the ISOFT applications launcher. There is no Isoft Apps group.
- **Below 992px:** the sidebar becomes a 272px off-canvas drawer with a 45% slate backdrop, opened from a 36px button in the top bar. The rail is desktop-only.
- **Module page:** the header has the title, a context line (company · month) and up to 3 New buttons on the right. The most-created DocType is the primary button. The body is a column with 28px gaps: the waiting tiles (auto-fit, min 176px, 12px gap, at most 5), a wrapping row of quick links (8px gap), at most one chart, and a 4-column link index (28px row gap, 32px column gap). The index drops to 3 columns below 1280px, 2 below 992px and 1 below 576px, where the tiles go to 2 columns. A 96px bottom pad and a 64px right pad keep the floating assistant button off the last links.
- **List and Report views:** the core page header is unchanged. The card holds one toolbar line (10/14px padding) over the table and a paging footer; the Filter By column starts hidden. Below 768px the search takes the full width, chips and "+ Add filter" wrap under it, sort drops to its own line, and the filter panel is fixed to the bottom of the screen in one column.
- **Query and script reports:** core's page head stays (title, the report's links to other reports, refresh, menu). The card below holds, in order, the filters (folded to a value-chip row with 10/14px padding, or open as a grid with "Hide filters" on its own row under it), the report's summary, its chart band and the grid. Open filters fill auto columns at least 180px wide (10px row and 14px column gaps, 14px padding), bottom-aligned so checks line up with inputs. Below 768px the filters go one per row, chips may run the full width, and the grid's scroll area takes the screen height less 260px (at least 320px) instead of core's 40vw.
- **Forms:** core's sticky page head, then the Connections row and the totals strip (12px apart, 12px above the links), the section links sticky right under the head, then core's sections as cards 12px apart. Below 768px the head grows with a wrapped title and the totals cells go two per row.
- **Rhythm:** 4, 8, 12, 16, 28 and 32px. Sidebar rows are 30px (items) and 34px (groups). The sidebar head is 52px.
- **Login:** the vault layout is core's (doors full height, six chips per side, the card centred on the seam). The light variant changes no dimension.
- **Loading screen:** one fixed full-screen surface for both the splash and the boot cover. The title block is centred at 45% of the height, where the vault centres its core. The 520px glow is centred on the same point, and the 46px square grid is masked by a radial fade from that point to 70%, matching the vault.

### Named Rules
**The Structure Is The DocType's Rule.** The DocType and Customize Form own a form's structure: field order, sections, column breaks, collapsible sections, hidden and depends_on, read-only and mandatory, permissions and child-table column widths. Nothing in the desk moves, hides, folds, regroups or resizes a field. It only reads the form (its fields, its sections and their visibility, the dashboard's link counts) and calls core's own methods: `scroll_to_field` from a totals cell, `Section.collapse(false)` from a section link, and the dashboard's own badge links from a Connections chip. Read-only values keep core's own look, muted text on core's disabled fill, because the user asked for it after a restyle made them look editable. Editable inputs are white (Surface) with a Rule Strong border, and on focus a Logo Blue Bright border with a 3px Blue Tint halo. A missing mandatory or invalid value shows a State Bad border and a State Bad label.

**The Filters Are The Report's Rule.** A query or script report owns its filters (which ones, their order, defaults, mandatory, depends_on and on_change) and its chart (colours and type). The desk labels the filters with the report's own labels, folds them and reads their values for the chips; it never adds, removes, reorders, resizes or re-defaults a filter, and never recolours or re-types a chart. A chip opens the filters and focuses core's own control; Set Chart, Create Card and Add Chart to Dashboard stay core's menu actions. The only thing the desk adds to a chart is a number format for its tooltips and legend values, and only when the report sets none.

## Elevation & Depth

The shell is flat. Depth comes from tone (cool ground under white surfaces, or slate under slate-blue in dark mode) and from 1px rules. The core chart and onboarding widgets lose their card shadow and pseudo-element chrome.

### Shadow Vocabulary
- **Menu** (`0 8px 24px rgba(15,34,54,0.18), 0 2px 6px rgba(15,34,54,0.12)`; dark: `0 8px 24px rgba(0,0,0,0.5), 0 2px 6px rgba(0,0,0,0.4)`): the company menu, rail flyouts, the top-bar menus (Help, user, notifications), the search results list, the applications launcher, the list filter panel and disabled-link tooltips only.
- **Focus halo** (`0 0 0 3px` Blue Tint): top-bar search, list search, list filter-panel inputs, editable form inputs and report filter inputs on focus.
- **Head band** (`0 6px 12px -8px rgba(15,34,54,0.18)` under a 1px Rule line): the stuck form section links, carrying over the shadow of core's sticky page head, which is removed while they are stuck.

- **Login card** (`0 12px 40px rgba(15,34,54,0.12), 0 0 60px rgba(0,140,210,0.08)`), **login chip** (`inset 0 1px 0 #fff, 0 6px 16px rgba(15,34,54,0.08)`), **login button** (`0 6px 18px rgba(0,121,194,0.25)`) and **core disc** (`0 0 22px rgba(0,140,210,0.35), inset 0 0 14px rgba(255,255,255,0.4)`): the light vault's versions of core's dark-vault glows, on the login page only.
- **Core title glow** (`text-shadow: 0 0 32px`, Core Dark Glow at 60% or Login Glow at 25%): the loading-screen title only. It holds still.
- **Core glow** (a 520px radial disc, `filter: blur(10px)`, breathing over 3.6s between opacity 0.55 and 0.9 and scale 1 and 1.12): the light behind the loading-screen title, as in the vault interior.

### Named Rules
**The Only Menus Float Rule.** In the desk shell, a surface gets a shadow only if it floats over other content and closes again. Tiles, the top bar, the sidebar, form section cards and the report card with its value chips stay shadowless. The one carried shadow is core's own: core's sticky form head casts a shadow once the page scrolls, and when the section links stick under it they take that shadow over (the head's is removed), so the head and the links cast one shadow as one band. The login vault is outside the shell and keeps the glow and lift that core's vault is built from, recoloured.

## Shapes

Gently rounded corners at one radius (6px) for items, tiles, buttons, inputs, quick links and tooltips. Every menu is slightly softer (8px): sidebar menus, top-bar dropdowns, search results and the launcher panel. The skeleton uses 4px and the scrollbar thumb 3px. Borders are 1px. Open groups show their items behind a 1px left rule indented 19px, which acts as a quiet tree line. A one-module group has no tree line because it has no items to show. Nothing is clipped into special shapes. Two containers never clip at all, because Link suggestions and date pickers open inside them: a form's child tables and the list's filter panel have no hidden overflow and no scroll box of their own.

## Components

### Navigation (Sidebar)
Calm, theme-following and always present on desk routes.
- **Head:** the ISOFT ERP logo lockup (22px tall) with the version (12px, Side Ink Muted, "v2.0.0") aligned to the bottom of the wordmark. The lockup links to /app/home, and its tooltip carries "ISOFT ERP v…". On the rail only the icon mark shows (28px).
- **Search:** a 32px field on Hover Wash with a leading search icon and a Logo Blue Bright border on focus. It filters groups and items with accent-insensitive matching. With no match, or no modules at all, a short Side Ink Muted message stands in.
- **Groups:** directly under the search, with no section label. Each group button has an icon, two-line text and a chevron that rotates 180° in 160ms. The group holding the active page opens automatically. Items sit indented behind the left tree rule.
- **One-module groups:** a group that holds a single workspace is not a folder. Its row is a direct link (no chevron, no item list) that opens that workspace in one click, and it is active when that workspace is open. Group rows and direct links share one inset (7px top and bottom, 10px left and right) so the icons line up. While searching, a group the filter has narrowed to one item still expands, because it is not a one-module group.
- **States:** hover = Hover Wash + Side Strong. Active (an item or a direct link) = Blue Tint + the active text shade (Logo Blue, or Sky Active in dark mode), weight 600, with the icon in the same shade. Focus: a click draws no outline or ring (Bootstrap's dark button ring is removed), and keyboard focus (`:focus-visible`) shows the hover background (Hover Wash, `--isd-side-2`) with Side Strong text. The same applies inside sidebar menus.
- **Foot:** the company switcher (company name, with "Company" in 11px below) and a 32px collapse/expand button, above a 1px top rule.
- **Rail:** 60px, icons only. Group buttons open a flyout menu. Direct links stay links, centred, with 8px vertical padding.
- **Drawer:** below 992px, 272px wide, slides in over 220ms with the shared ease.

### Menus (company switcher, rail flyouts)
Fixed-position panels on the sidebar colour, min 220px and max 300px wide, 70vh tall at most, with 6px padding, an 8px radius and the Menu shadow. An optional title uses Label Small. Options have a Hover Wash hover, and the current option shows Blue Tint with accent text. Keyboard focus looks like hover, and a click draws no ring.

### Top-Bar Menus (Help, user menu, notifications, search results, launcher)
Core's menus on the desk's surfaces, in both themes. Only colours, borders, radii and spacing change; markup and behaviour stay core's.
- **Dropdowns (Help, user menu):** Surface, a 1px Rule border, an 8px radius, 6px padding and the Menu shadow. Items are 13px Ink with 7/10px padding and a 6px radius; hover and focus give Hover Wash with no outline. Dividers are Rule, inset 4px.
- **Toggles (Help, notifications bell):** Ink Muted with a 6px radius at rest; Hover Wash and Ink when hovered or open.
- **Notifications panel:** a Surface header over a 1px Rule. Tabs are 500-weight Ink Muted, turning Ink on hover; the active tab is Ink over a 2px Logo Blue Bright underline. Items are inset 2/6px with a 6px radius and a Hover Wash hover; subjects are 600 Ink and timestamps Ink Faint. Unread shows as core's dot in Logo Blue Bright and nothing else: no fill, so a busy inbox does not turn blue. The footer link is 500-weight text accent over a 1px Rule. Command Center update rows take the same treatment.
- **Search results:** the list under the top-bar search opens 6px below it with the dropdown's surface, border, 8px radius, 6px padding and shadow. Rows are 8/10px with a 6px radius; hover and the keyboard-selected row get Hover Wash. Matched letters are 600 in the text accent with no highlight fill.
- **ISOFT applications launcher:** the launcher (from isoft_command_center_client) reads its colours from `--cca-*` variables, and the shell points every one at a desk token (surface, ground, rule, ink shades, hover, accent, accent hover, Blue Tint, OK, Menu shadow), so it changes with the theme without its own palette. Its panel gets a 1px Rule border and the 8px radius. A tile on hover or keyboard focus shows Hover Wash and no ring. App icon tones keep their own hues.

### Top Bar
White with a 1px bottom rule and no shadow. The core brand is hidden because the sidebar carries it, and breadcrumbs are Ink Muted. Search sits on Cool Ground and turns white on focus, with a Logo Blue Bright border and a 3px Blue Tint halo. Its menus are described under Top-Bar Menus. Other Isoft apps' navbar buttons (POS, Command Center, Insights, Invenza, FE, Angola HR, Permission Manager, launcher) get one treatment: a 34px square, transparent, Ink Muted icon, and Hover Wash on hover. The bar reads as one row of tools.

### Buttons
Core buttons, recoloured. The primary is a solid Logo Blue fill with white text and icons in both themes, and Logo Blue Deep on hover or press (darker in light mode, lighter in dark mode). Secondary buttons stay core. New buttons read "+ DocType" (a plus icon instead of "New {0}", which gendered languages cannot translate).

### Waiting Tiles (signature)
The module page's lead. Each tile is a link to the filtered list: a white surface with a 1px Rule border, a 6px radius and 14/16/13px padding. It shows the count (Count type), the label (Title) and the DocType (Meta, Ink Muted). On hover the border turns Logo Blue Bright over 140ms. On focus it gets a 2px Logo Blue Bright outline with a 2px offset. While loading, a 48x26 shimmer skeleton stands in for the count (static under reduced motion). An unavailable count shows "—". Tone states: **zero** (Ink Faint), **bad** (State Bad), **warn** (State Warn). A tone applies only when the count is above zero. Counts use the user's default company when the DocType has a company field. Catalogue sizes are never shown as waiting.

### Quick Links
Inline chips: 30px minimum height, 5/12px padding, a Rule Strong border on Surface, 13px/500 text. On hover the border turns Logo Blue Bright and the text turns to the text accent. Shortcuts already counted as tiles are left out.

### Chart
At most one core chart widget, with a 1px Rule border, a 6px radius and no shadow or chrome. Series 1 is Logo Blue Bright, series 2 Ink Faint, series 3 Rule Strong, legend dots match, and there is no region fill.

### Login Vault (light variant)
Core's vault, recoloured (see Colors, Login Surface). It covers the login, email-login, forgot-password and sign-up cards. Selectors start at `html[data-isd-login="light"]` so they outrank core's login stylesheet and its inline critical style, both of which load later. Ground and body backgrounds use `!important` for the same reason.

### Theme Memory
The login page knows no user, so the browser remembers the theme. On every desk load and every theme switch, the desk writes `localStorage["isoft_theme"]` (`light` or `dark` only) for every desk user, pilot or not. An inline script in the login page's `<head>` reads it before the first paint and sets `data-isd-login`. If the value is missing or storage is blocked, it falls back to `prefers-color-scheme`. The script is injected only while Isoft Desk Settings is enabled; when it is off, the login page is core's dark vault.

### Loading Screen (signature)
The vault's interior, held on screen, built from the vault's own recipe. Core's splash (every desk load or refresh) and the post-login boot cover both become one full-screen surface in three layers: the core ground, the 46px grid at 50% opacity masked to a radial fade from the centre, and a 520px blurred glow. In its centre is "ISOFT ERP" (Core Title) over "ENTERPRISE CORE · ONLINE" (Core Sub), 12px apart. Core's splash image and the boot cover's progress bar are hidden; the text is drawn by pseudo-elements, so there is no image, no chip, no ring and no progress indicator. The only motion is the glow breathing (3.6s ease-in-out, infinite, opacity 0.55 to 0.9, scale 1 to 1.12), the same breath as the vault. Under `prefers-reduced-motion` the glow stands still, centred. After sign-in, the doors open onto this exact interior and it stays until the desk is ready. It follows the server-rendered `html[data-theme]`, dark or light. Because it paints before any script runs, it cannot see the pilot or the settings switch and applies site-wide wherever the app is installed. Core's star watermark is hidden only while the splash is on screen.

### Link Index
Four columns of cards. A heading is Label type in Ink Muted over a 1px Rule Strong line. Links are 13px rows with 7px vertical padding, each over a 1px Rule. Hover turns the text to the text accent. A disabled link is Ink Faint with a help cursor and shows a dark tooltip (Ink background, Surface text, 12px, Menu shadow) on hover or focus.

### List and Report views (signature)
Every DocType's List view and Report view, rebuilt as one toolbar line over a full-height table. The toolbar is made from core's own filter controls, moved into place and never copied, so filtering, saved filters, bulk actions, sorting, paging and permissions behave exactly as core.
- **Toolbar:** a Surface band with a 1px Rule underneath. On the left, a 30px search (6px radius, Rule Strong border, 32px left inset for the search icon, Logo Blue Bright border and Blue Tint halo on focus) that is the list's own title-field filter, or the ID filter when the title field is not a standard filter; its placeholder reads "Search {label}". Then one chip per active filter, then "+ Add filter". On the right, core's own Filter button (any field, any condition, opening core's filter popover in one click), group-by in Report view and sort, as 30px Surface buttons with a Rule Strong border and Hover Wash hover; with advanced filters applied, the Filter button names their count on Blue Tint with text-accent ink. Search is 280px wide on its own and gives up width (160 to 280px) once chips appear, so search, the usual three chips and "+ Add filter" share one line at 1366px.
- **"+ Add filter":** a 28px text button in the text accent (13px/500) with a plus icon and Hover Wash on hover or while open. It opens a panel holding every other standard filter of the list: core's own controls, each with its label above it (12px/500, Ink Muted; checkboxes keep their inline label), in two columns. The panel is never a scroll box, because a Link filter's suggestions and date pickers open inside it and would be cut. It is Surface with a 1px Rule border, an 8px radius, 12px padding and the Menu shadow, up to 560px wide, 6px under the bar. A click outside, Escape (focus returns to the button) or a route change closes the panel; date pickers count as inside.
- **Chips:** Blue Tint with text-accent ink (Logo Blue; Sky Link Blue in dark mode), 28px, a 6px radius, 13px/500 text, capped at 220px with an ellipsis and the full text as the tooltip. Text reads "Label: value", "Label: not value", "Label: set" / "Label: not set", "Label: a, b" for lists, "Label: from – to" for ranges, and the first letter is capitalised. Values are named as the list column names them, through the list's formatters (an AGT status "I" reads "Invalid"); Document Status reads Draft / Submitted / Cancelled, dates use the user's format and checks read Yes / No. A field from a child table carries its DocType in brackets. The search filter and hidden filters get no chip. The × (26px) removes exactly that one filter. Clicking the text edits it: a standard filter opens the panel focused on its field, any other opens the advanced popover. Hover on either part is a 14% Logo Blue Bright wash; keyboard focus is a 2px inset Logo Blue Bright ring.
- **Table:** 36px rows (also in compact density) at 13px with tabular figures, a 1px Rule between rows and Hover Wash on hover. The header is 34px, Surface, 12px/500 Ink Muted, sticky, over a 1px Rule Strong underline. The title column takes the largest share (flex 3) in Ink at 500 weight, above the Ink Muted links of the other columns, and ends in an ellipsis. Right-aligned figures sit in fixed 8.75rem columns in Ink, wide enough for a nine-digit amount and never cut; text columns give way first. A 104px activity column on the right is shared by the header (the "20 of 30" count, 12px Ink Muted) and the rows, so the columns to its left line up. The like heart, the comment count and an empty assignment avatar are hidden; the modified time stays, Ink Faint at 12px.
- **Status:** core's filled pill becomes a 7px dot plus its word at 13px/500, both in the state colour: green is OK, red and pink are Bad, orange and yellow are Warn, and blue, light-blue, cyan and purple are neutral Ink Muted (the One Accent Rule). On phones, where core shows a bare dot, the dot carries its word too (12px/500), because colour alone does not name a state.
- **Height:** core sizes the rows area to fill the window; under the card it leaves the 16px side gutter instead of core's 60px, so no empty band sits under the list. While rows are selected, the card keeps 84px under it instead, room for core's floating bulk-action bar (fixed 24px from the bottom), so the bar never covers the paging footer.
- **Paging:** a footer over a 1px Rule with 10/14px padding. Page sizes are a segmented group of 30px Surface buttons with Rule Strong borders; the current size is Blue Tint with text-accent ink at 600. "Load More" uses the same button.
- **Report view grid** (shared by every query and script report's grid): core's datatable takes the desk through its `--dt-*` properties (Rule borders, Surface cells and header, Ink text, Hover Wash as its light background, Blue Tint selection, Logo Blue Bright as its primary), with 36px rows, 13px tabular figures, a 12px/500 Ink Muted header over a Rule Strong line and Ink cell links. The per-column filter row is quiet: 24px fields centred in the cell, Cool Ground fill with no border at rest, a Rule Strong border on hover, Surface with a Logo Blue Bright border while typing, 6px radius, 12px text; the tick-box and row-number columns show no field, since they filter nothing. The comparison hint in the footer stays, quiet: one line, Ink Faint, 12px, ending in an ellipsis.
- **Filter By column:** hidden by default in List and Report views. Core's sidebar toggle still opens it, and the choice is remembered in `localStorage["isd_list_sidebar"]`, apart from core's key, which the other views keep using.
- **Phones (below 768px):** search on its own full-width line with 16px input text (iOS does not zoom on focus), chips and "+ Add filter" wrapping beneath it, the panel fixed 12px from the bottom and sides of the screen in one column.

### Query and Script Reports (signature)
Every query and script report (`/app/query-report/<name>`, page wrapper class `isd-qr`), ERPNext's and the Isoft apps'. Core runs the report as always; the desk names its filters, folds them once the report has data, and puts the summary, chart, grid and totals on the desk's surfaces (The Filters Are The Report's Rule).
- **Report card:** Surface in both themes for the filters, the fold row, the summary, the chart band and the grid; core paints it grey in dark mode.
- **Fold row:** with the filters folded, one wrapping row (6px by 8px gaps, 10/14px padding, a 1px Rule under it) of value chips followed by "Edit filters". The chips follow the list chip grammar: Blue Tint with text-accent ink (Sky Link Blue in dark mode), 28px, 0/10px padding, a 6px radius, 13px/500, capped at 220px with an ellipsis and the full text as the tooltip, and a 14% Logo Blue Bright wash on hover. Text reads "Label: value" under the report's own label, translated: dates in the user's format, a date range as "from – to", Select values translated, numbers (Currency, Float, Int, Percent) formatted as the table formats them, lists joined with commas, and a ticked check as its label alone. Empty, unticked and hidden filters get no chip. Chips have no ×: clicking one opens the filters with focus in that filter's control. With many filters the chips wrap onto further lines, as list chips do, so every value stays visible.
- **Toggle:** "Edit filters" / "Hide filters", a 28px text button (0/8px, 13px/500, text accent, Hover Wash on hover) carrying `aria-expanded`. Open, the row holds only "Hide filters", right-aligned under the filter grid with 6px vertical padding. Before the first run with data there is nothing to fold back to, so the toggle is hidden.
- **When it folds:** the first run that returns data after the report's filters are set up folds them; after that they stay as the user leaves them, across refreshes. A report that returns no data stays open, and so does a background (prepared) report while it has no result to show.
- **Open filters:** core's own controls in a grid of auto-filled columns at least 180px wide (10px by 14px gaps, 14px padding, a 1px Rule under it), bottom-aligned. Each control has its name above it (12px/500 Ink Muted, one line with an ellipsis); checks keep their inline label (Ink, 30px tall). Inputs are 30px, Surface, a 1px Rule Strong border, a 6px radius, 13px Ink and Ink Faint placeholders; focus gives a Logo Blue Bright border and the 3px Blue Tint halo. An empty mandatory filter shows a State Bad border. Core's 10px per-filter indent, which set names off their inputs, and core's name tooltip, which covered the input on focus, are removed; the label says it now.
- **Header:** core's page head keeps the report's own links to other reports (such as "Accounts Receivable Summary") and its primary action. Set Chart, Create Card and Add Chart to Dashboard leave the header and live only in the menu (Add Chart to Dashboard only when the report has a chart); where core made them buttons only, the desk adds them to the menu.
- **Summary:** a Surface band with 12/14px padding and a 1px Rule under it, tabular figures; labels 12px Ink Muted, values 17px/600.
- **Chart band:** Surface, 8/14/0px padding, a 1px Rule under it. Series colours and chart type are the report's; axis and legend text is Ink Muted. When the report sets no number format, tooltip values, and the legend values of pie and percentage charts (frappe-charts formats both with the same function), read in the user's number format, as the table does.
- **Grid and totals:** the Report view grid rules (36px rows, 13px tabular figures, the 12px/500 Ink Muted header over a Rule Strong line, real filter-row inputs). The totals row is Surface over a 1px Rule Strong line, 600 Ink. The footer and status messages are Ink Faint.
- **Keyboard focus:** chips and the toggle show a 2px inset Logo Blue Bright ring on `:focus-visible` and no ring on click.
- **Phones (below 768px):** one filter per row with 16px input text (iOS does not zoom on focus), chips up to the full width, and the grid's scroll area filling the screen (100vh less 260px, at least 320px) instead of core's 40vw, which showed four rows.

### Forms (signature)
Every DocType's form (`Form` route, body class `isd-form`), Isoft apps' included. Above core's layout the desk adds three things built from what the form already holds: a Connections row, a totals strip and the section links, in that order, 12px apart, under core's sticky page head. Below them core's sections, fields and child tables keep their places (The Structure Is The DocType's Rule) and take the desk's surfaces. Body figures are tabular.
- **Connections row:** one wrapping row (8px by 16px gaps) of 28px chips, one for each link of core's Connections block that has records, in core's order. A chip is Surface with a 1px Rule Strong border, a 6px radius, 0/10px padding, the name in 13px Ink and the count at 600 with tabular figures; on hover the border turns Logo Blue Bright. A link back to the form's own DocType, or a DocType listed in two groups, is named by its group heading in core's block ("Returns 1"), with the DocType as its tooltip. A click fires core's own badge link. After the chips, "Show all connections" (13px/500 text accent, transparent, underlined on hover) opens core's full block and becomes "Hide connections". The activity heatmap folds with the block. Only those two fold, and the dashboard itself is never hidden: Connections are hidden outright, while the heatmap folds to zero height (no margin, padding or border, hidden) and not to `display: none`, so frappe-charts can still measure its width and draws it right the first time. Other dashboard parts (progress, Stock Levels, indicators, custom sections) stay where core puts them. The row is absent on new documents and wherever core shows neither a Connections block nor a heatmap.
- **Totals strip:** only on DocTypes with a visible Grand Total field. One Surface band with a 1px Rule border and a 6px radius, split into cells by 1px Rule lines. Cells, in order: net total; taxes (only when non-zero); grand total; outstanding (submitted documents only); the first visible and filled of due date, valid till, schedule date and delivery date; and "Lines", the item count. Each label comes from the DocType (12px Ink Muted, first letter capitalised) without ERPNext's trailing currency code ("Grand Total (AKZ)" reads "Grand Total", since the value carries it); each value is 17px/600 tabular Ink. Money is formatted by core in the document's currency, dates in the user's format. Outstanding turns State Bad only when the due date has passed with money owed, and the due-date cell then adds "N days late" (12px/500, State Bad) beside the date. A cell is a button (10/18/11px padding, Hover Wash on hover) that scrolls to its own field through core. On drafts the strip follows every change to the document. A hidden field never gets a cell.
- **Section links:** the form's own labelled, visible sections, in the DocType's order and under its own labels; unlabelled sections get no link, and a form with fewer than two gets no row. Scripts that show or hide sections after load (toggle_display, depends_on) are followed by watching the sections' own class and style. Each link is a 28px text button (0/10px, 6px radius, 13px Ink Muted, first letter capitalised), Hover Wash with Ink on hover; the current link is Blue Tint with the text accent at 500. The row sits on Cool Ground with 6px vertical padding and sticks under core's page head. Once stuck it joins the head as one white band: Surface reaching over the 16px page gutter on both sides, a 1px Rule under it, the head's shadow taken over, and a strip of Surface covering the 2px seam core's head leaves under itself. No link is current until the page scrolls past the first labelled section; after that the current link is the last section whose head has passed the line under the band, and it is kept in view along the row. When more links run past the right edge, the row fades out over its last 48px. A click opens a collapsed section through core and lands its head just under the band, with a smooth scroll, or an instant jump under reduced motion. Link colours change over 150ms on the shared ease (none under reduced motion).
- **Sections:** core's card sections and dashboard sections become flat cards: Surface, a 1px Rule border, a 6px radius, no shadow, 12px apart. Section heads are 13px/600 Ink; a collapsed head turns to the text accent on hover, and its chevron is Ink Faint. Field labels are 12px/500 Ink Muted; help text and section descriptions are Ink Faint.
- **Fields:** editable inputs are Surface with a 1px Rule Strong border, Ink text and Ink Faint placeholders; focus gives a Logo Blue Bright border and the 3px Blue Tint halo. A missing mandatory or invalid value shows a State Bad border and label. Read-only values stay exactly as core draws them.
- **Child tables:** a 1px Rule border with a 6px radius; the header is Surface, 12px/500 Ink Muted over a 1px Rule Strong line; rows are separated by 1px Rule and get Hover Wash on hover; right-aligned figures are tabular and row numbers Ink Faint. Cell editors stay core's borderless ones, and column widths stay the DocType's. The table never clips (no hidden overflow, no scroll box), because a cell's Link suggestions and date pickers open inside it.
- **Head status:** in light mode the status in the page head stays core's tinted pill. In dark mode, where core fills it solid and louder than the strip, it becomes a 7px dot and its word in the state colour (green OK, red and pink Bad, orange and yellow Warn, every other colour Ink Muted), as in lists.
- **Comments and timeline:** the comment box is a flat card (Surface, 1px Rule, 6px radius, no shadow); timeline text is Ink Muted.
- **Keyboard focus:** chips, the toggle, totals cells and section links show a 2px inset Logo Blue Bright ring on `:focus-visible` and no ring on click.
- **Phones (below 768px):** the page head grows with its title, which wraps at 17px; the status wraps beside it and the actions take their own line, right-aligned. Totals cells go two per row with wrapping labels and 15px values. Inputs use 16px text, so iOS does not zoom on focus.

## Do's and Don'ts

### Do:
- **Do** scope every selector under `body.isd-on` (or the `.isd-` shell elements it creates), so switching the app off restores the standard desk. Two documented exceptions: the light vault (`html[data-isd-login="light"]`, set only while the app is enabled) and the loading screen (html-level, site-wide, because it paints before boot).
- **Do** use the `--isd-*` custom properties, never literal hex, so light and dark both follow the desk theme. The login and loading-screen stylesheets are the exception: the `--isd-*` tokens are not loaded there, so they use literal values from the Login Surface palette or their own `--isd-core-*` properties.
- **Do** settle the login theme before first paint (remembered desk theme, then the OS preference), so the vault never flashes the other variant.
- **Do** keep the loading screen identical to the vault interior it continues (title, subtitle, grid, glow and ground), so the hand-off from the doors is invisible. Under reduced motion the glow holds still.
- **Do** keep the logo blue for where-you-are, the primary action, focus and links, and pick its shade by job: fill, line or text. Nothing else is blue.
- **Do** colour a count only through a definition's tone, and only when it is above zero.
- **Do** translate added strings with context "ISOFT Desk".
- **Do** hide the desk sidebar on any page that draws its own fixed sidebar, and add the route to the hidden list instead of restyling the page.
- **Do** build list UI from core's own controls, moved into place and never copied (the search is the title filter control, the panel holds core's standard filters, chips remove and edit core's filters), so filtering, saving, sorting, paging and permissions behave as core.
- **Do** leave a form's structure to the DocType and Customize Form: read the form and call core's own methods (`scroll_to_field`, `Section.collapse`, the dashboard's badge links), never move, hide, fold, regroup or resize a field, and leave read-only values in core's look.
- **Do** leave a query or script report's filters and chart to the report: label the filters, fold them and read their values, never add, remove, reorder, resize or re-default one, and never recolour or re-type its chart.
- **Do** fold a report's filters only after its first run with data, and keep the user's choice after that; a report with no data, or a background report with no result yet, stays open.
- **Do** show report filter values in the list chip grammar ("Label: value", 28px Blue Tint, 220px with an ellipsis and a tooltip), formatted as the report's table formats them.
- **Do** let Link suggestions and date pickers open freely: a form's child tables and the list filter panel are never clipping or scrolling containers.
- **Do** fold the form dashboard's parts and never the dashboard: Connections hide, and the heatmap folds to zero height so frappe-charts can still measure it.
- **Do** keep 84px under the list card while rows are selected, so core's floating bulk-action bar never covers the paging footer.
- **Do** honour `prefers-reduced-motion` for the chevron, drawer, skeleton and form section-link scrolling. The shared ease is `cubic-bezier(0.16, 1, 0.3, 1)`.

### Don't:
- **Don't** restyle Kanban, Image, Tree or Calendar views or dialogs in this phase.
- **Don't** change a form's layout from the desk (order, sections, columns, visibility, widths, collapsing), or dress read-only values as inputs. Forms get the Connections row, totals strip and section links on top and the desk's surfaces on core's own parts.
- **Don't** add, remove, reorder, resize or re-default a report's filters, or put Set Chart, Create Card or Add Chart to Dashboard back in the report header.
- **Don't** give a container that holds Link fields or date pickers (child tables, the list filter panel) hidden overflow or a scroll box, and don't hide the form dashboard whole.
- **Don't** list Isoft app pages in the sidebar. They live in the applications launcher.
- **Don't** bring back the v13 cyan-topped card grid, the star watermark or a flat module list.
- **Don't** add shadows to tiles, cards, form sections, the top bar or the sidebar. Only floating menus and tooltips cast one, plus the stuck section links, which carry core's own page-head shadow.
- **Don't** give other apps' navbar buttons or menus their own colours inside the shell. The launcher's app icon tones are the only hues kept, because each names an app.
- **Don't** fill the module page chart's areas or give it more than one accent-coloured series. A query or script report's chart keeps its own colours and type.
- **Don't** restyle the dark vault from this app, or move, resize or re-animate any part of the vault in the light variant. Change colours only. The glow-centring repair (same breath, translate kept) is the one change that reaches both vaults.
- **Don't** draw an outline or ring on a clicked sidebar or menu control. Keyboard focus shows as the hover background.
