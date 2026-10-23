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
  dark-slate-side: "#121c26"
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
  login-blue: "#006fad"
  login-blue-deep: "#005a8c"
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
  core-dark-fade: "#080e19"
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
    fontFamily: "Inter, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "3rem"
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
    backgroundColor: "{colors.dark-slate-side}"
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
    backgroundColor: "{colors.login-blue}"
    textColor: "{colors.on-accent}"
  login-button-hover:
    backgroundColor: "{colors.login-blue-deep}"
  loading-screen:
    backgroundColor: "{colors.login-ground}"
    textColor: "{colors.login-title}"
    typography: "{typography.core-title}"
  loading-screen-dark:
    backgroundColor: "{colors.core-dark-ground}"
    textColor: "{colors.core-dark-title}"
  loading-screen-sub:
    typography: "{typography.core-sub}"
---

# Design System: ISOFT Desk

## Overview

**Creative North Star: "The Category Standard, Played Straight"**

ISOFT Desk is a shell, not a skin. It replaces the Frappe v13 desk's navigation and module pages with the polish users already know from Odoo 17, Linear, Stripe Dashboard and ERPNext v15: a theme-following sidebar on the left, a slim white top bar, and module pages that answer "what is waiting for me in this company" before anything else. The people using it are accounting, sales, stock and management staff on 1366x768 laptops, working in Portuguese or English. They arrive with a job, do it and leave. Density is moderate (13px body, 30 to 34px rows), and every surface is flat, white or slate, and separated by 1px tinted rules.

The world is quiet so that state can be loud. ISOFT cyan-blue is the only accent. It marks where you are, the primary action, focus and links. Green, amber and red appear only when a count means something needs attention. The v13 desk's cyan-topped card grid, star watermark and flat 20-item module list are removed on purpose.

The scope is deliberately narrow. Everything lives under `body.isd-on`, so a user outside the pilot, or a site with the app switched off, sees the standard desk unchanged. Lists, forms and reports keep core styling inside the shell. The only changes there are the accent on the primary button and, on forms, the collapsed rail with the core left column hidden.

Two surfaces sit before the shell and follow different rules. The login page is the incumbent core "vault" (two doors, module chips wired into an authentication core, the card at the seam), and core's dark vault is its design, not this app's. The app only adds a light recolouring of it, picked from the theme this browser last used on the desk. The loading screen (core's splash and the post-login boot cover) is drawn as the vault's own interior, "ISOFT ERP" over "ENTERPRISE CORE · ONLINE" on the gridded, glowing core ground, so after login the room the doors open onto simply stays on screen until the desk is ready: one screen, not two. Both paint before the shell exists, so they carry literal colours from this palette instead of the `--isd-*` tokens.

**Key Characteristics:**
- Theme-following sidebar: a white panel with a 1px rule in light mode, deep slate in dark mode.
- One accent, the ISOFT ERP logo's blue, in three strengths: a fill, a line and a text shade. Semantic colours carry state only.
- Inter with tabular figures. Counts are large, and labels sit below them.
- 6px radii everywhere. Menus and popovers are the only things with a shadow.
- Fully scoped (`body.isd-on`). Core lists, forms and reports are not restyled.
- The login vault opens in the browser's last desk theme; the light vault is a recolour, never a relayout.
- Every load shows the vault interior, light or dark, in the desk theme the server rendered.

## Colors

A cool slate-and-white neutral field with one saturated blue, and semantic hues kept for state. Each light token has a dark counterpart, which is swapped in under `[data-theme="dark"]`.

### Primary
The accent is tuned to the ISOFT ERP logo and split by job, because one blue cannot be both a white-ink fill and a 3:1 hairline on white.
- **Logo Blue** (isoft-blue / dark-blue): the solid fill of the primary button, with white ink (on-accent) in both themes. In light mode the same shade is the text accent: links, quick-link hover text, the active sidebar item and core's `--primary`.
- **Logo Blue Deep** (isoft-blue-deep / dark-blue-hover): the primary button on hover and press. In dark mode it lightens instead of darkening.
- **Logo Blue Bright** (isoft-blue-strong / dark-blue-strong): lines, never text. Tile and quick-link hover borders, the 2px tile focus outline, the top-bar and sidebar search focus borders, the first chart series and its legend dot. It is also the brand blue of the sidebar's own highlights.
- **Sky Link Blue** (dark-blue-text): the dark-mode text accent for links and core's `--primary`. The dark active sidebar item uses the paler **Sky Active** (dark-side-active).
- **Blue Tint** (isoft-blue-tint / dark-blue-tint): the active sidebar item background, the current option in a menu, the 3px focus halo on top-bar search, and the sidebar scrollbar thumb.

### Neutral
- **Cool Ground** (cool-ground / dark-ground): the page ground behind all work surfaces, also painted on `html` so overscroll never flashes another colour.
- **Surface** (surface / dark-surface): the top bar, tiles, quick links and chart widget. In light mode it is also the sidebar and menu background.
- **Deep Slate Side** (dark-slate-side): the sidebar and menus in dark mode.
- **Ink, Ink Muted, Ink Faint**: primary text; secondary text (context line, breadcrumbs, index headings, tile DocType line); and zero counts, disabled links and placeholders.
- **Side Ink / Side Ink Muted / Side Strong**: sidebar text at rest; section labels, the version number and icons; hovered and open-group text.
- **Rule / Rule Strong**: 1px separators. Rule sits between index rows, around tiles and around the top bar. Rule Strong goes under index headings and around quick links.
- **Hover Wash**: the hover background in the sidebar and the top bar, and the sidebar search field.

### State
- **OK / Warn / Bad** (state-ok, state-warn, state-bad and their dark counterparts): only for counts and states that need action. Shipped counts use `bad` (overdue invoices, rejected by AGT). The stylesheet also supports `warn`.

### Login Surface (light vault)
Cool and pale, so the vault reads as the same room with the lights on. Defined in `isd_login.css` under `html[data-isd-login="light"]`; the dark vault's colours stay in core's `login.scss`.
- **Login Ground** (login-ground): the page and vault background behind the doors.
- **Door Steel** (login-door, login-door-mid, login-door-seam): the door gradient, pale at the edges and darkest at the 50% seam, over a faint 3px Login Shade line texture. The inner edge of each door is a 1px Login Blue rule at 24%.
- **Interior** (login-door to login-interior-floor): the revealed core behind the doors, a vertical gradient under a 9% Login Blue radial wash, with 46px gridlines in Login Blue at 7%.
- **Core Glow** (login-glow): the one glow hue of the light vault. It lights the core halo (22%), the core disc shadow (35%), the interior glow (18%), the title text-shadow (25%) and the card's outer halo (8%).
- **Core Disc** (surface to login-core-mid to login-core-deep): a radial sphere, white highlight at 38% from the top. Its ring is Login Blue at 30% and its label is Login Core Label.
- **Module Chips**: Surface to a pale cool white, a 1px Login Blue border at 22%, Login Blue icons and Login Chip Ink labels. The traces that wire them to the core are Login Trace at 32%.
- **Title** (login-title): the interior title; its subtitle is the same ink at 62%.
- **Login Blue** (login-blue, login-blue-deep): the light vault's accent. It is the shade the desk used before the logo re-tune and has not moved with it; every blue percentage in this section is this hue.
- **Card, inputs, button**: the card is Surface at 86% with an Login Blue border at 20% and Login Chip Ink text; its heading and subtitle are Side Ink. Inputs are Surface with a Rule Strong border, Ink text, Ink Faint placeholders and icons, and an Login Blue border with a 3px 15% halo on focus. The button is Login Blue on white with a soft blue shadow, Login Blue Deep on hover. Show/forgot/sign-up links are Login Blue, and the sign-up line is Ink Muted.
- **Login Shade** (login-shade): the cool ink behind every light-vault shadow and door rule. It is never used as a fill.

### Loading Screen (the vault interior)
Defined in `isd_loader.css` as `--isd-core-*` properties on `html`, switched by `data-theme`. Both themes are the vault's interior, the dark one copied from core's `login.scss` and the light one from the light vault.
- **Dark:** a vertical gradient from Core Dark Top to Core Dark Ground under a 10% Core Dark Glow radial wash, 46px gridlines in Core Dark Glow at 7%, a 260px core glow at 22%, and a fade to Core Dark Fade at 70% of the radius. The title is Core Dark Title with a Core Dark Glow text-shadow at 60%. The subtitle is Core Dark Sub at 70%.
- **Light:** the same layers from the light vault: Login Door to Login Interior Floor under a 9% Login Blue wash, gridlines in Login Blue at 7%, a core glow in Login Glow at 16%, a fade to Login Ground, the title in Login Title with a Login Glow shadow at 25%, and the subtitle in Login Title at 62%.
- **Page behind the boot cover:** Core Dark Ground in dark mode and Login Ground in light mode, so nothing flashes between the vault and the cover.

### Named Rules
**The One Accent Rule.** Inside the desk shell, ISOFT blue is the only hue that is not about state. A second brand colour, a gradient or a coloured section header does not belong there. The login vault and the loading screen are blue worlds too: their glow hues are blues from the same family, never a second hue.

**The Fill, Line, Text Rule.** Each accent job has its own shade. Fills carry white ink (Logo Blue, about 4.8:1). Lines, borders, focus outlines and chart series use Logo Blue Bright, which holds 3:1 against the surface but is too light for text. Text uses the text shade (Logo Blue in light mode, Sky Link Blue in dark mode). Never set text in the line shade, and never use the fill shade for hairlines.

**The Vault Is Core's Rule.** The dark vault (core `login.scss` and `www/login.html`) is the incumbent design and stays where it is. This app only recolours it, under `html[data-isd-login="light"]`. Doors, chips, traces, core and card keep core's geometry, motion and gradients, and the light variant swaps their colours one for one.

**The Colour Is State Rule.** A tile count turns red or amber only when its definition carries a tone and the count is above zero. A zero count goes faint, never green. Charts draw series 1 in Logo Blue Bright and further series in Ink Faint and Rule Strong, with no area fill.

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

Page titles, form headings and every other text size come from core.

### Loading Screen Type
- **Core Title** (800, 3rem, 1.2, 6px tracking): "ISOFT ERP", as the vault interior's title, in core's font stack.
- **Core Sub** (400, 12px, 4px tracking, monospace): "ENTERPRISE CORE · ONLINE", 12px below the title. It is the only monospace in the app, copied from the vault interior.

### Named Rules
**The Names Read As Names Rule.** Some core translations start in lowercase ("cotação"). Tile labels, DocType lines, quick links, index links and index headings capitalise their first letter, through CSS `::first-letter` or, for New buttons, in JS.

**The Own Context Rule.** Every interface string the app adds is translated with context "ISOFT Desk" (`__(text, replace, "ISOFT Desk")`), so it never overrides another app's translation of the same English word. Labels that belong to core (DocType names, workspace labels) use plain `__()`.

**The Two Lines Rule.** Sidebar labels wrap to at most two lines and never truncate to one. Long Portuguese names stay readable.

## Layout

- **Shell:** a fixed left sidebar 232px wide, and `.main-section` offset by the same width. On forms (the `Form` route) the sidebar collapses to a 60px rail, the core left column (attachments, tags, shares) starts hidden, and the form takes the full remaining width. Core's own sidebar toggle can still reopen that column. Users can also collapse to the rail by choice, and the preference persists.
- **Hidden routes:** the full-screen POS (`posapp`) and Isoft pages that draw their own fixed sidebar (Invenza, SAF-T Center, Insights, Angola HR dashboard, Location Manager, Command Center, Intelize, FE Angola dashboard) hide the desk sidebar completely. Those pages look exactly as they do without the app. Isoft app pages are not listed in the sidebar; users reach them from the ISOFT applications launcher.
- **Below 992px:** the sidebar becomes a 272px off-canvas drawer with a 45% slate backdrop, opened from a 36px button in the top bar. The rail is desktop-only.
- **Module page:** the header has the title, a context line (company · month) and up to 3 New buttons on the right. The most-created DocType is the primary button. The body is a column with 28px gaps: the waiting tiles (auto-fit, min 176px, 12px gap, at most 5), a wrapping row of quick links (8px gap), at most one chart, and a 4-column link index (28px row gap, 32px column gap). The index drops to 3 columns below 1280px, 2 below 992px and 1 below 576px, where the tiles go to 2 columns. A 96px bottom pad and a 64px right pad keep the floating assistant button off the last links.
- **Rhythm:** 4, 8, 12, 16, 28 and 32px. Sidebar rows are 30px (items) and 34px (groups). The sidebar head is 52px.
- **Login:** the vault layout is core's (doors full height, six chips per side, the card centred on the seam). The light variant changes no dimension.
- **Loading screen:** one fixed full-screen surface for both the splash and the boot cover. The title block is centred, with a 10vh bottom pad so it sits where the vault centres its core (45% of the height). The glow and fade are centred on the same point, and the grid is 46px square, matching the vault.

## Elevation & Depth

The shell is flat. Depth comes from tone (cool ground under white surfaces, or slate under slate-blue in dark mode) and from 1px rules. The core chart and onboarding widgets lose their card shadow and pseudo-element chrome.

### Shadow Vocabulary
- **Menu** (`0 8px 24px rgba(15,34,54,0.18), 0 2px 6px rgba(15,34,54,0.12)`; dark: `0 8px 24px rgba(0,0,0,0.5), 0 2px 6px rgba(0,0,0,0.4)`): the company menu, rail flyouts and disabled-link tooltips only.
- **Focus halo** (`0 0 0 3px` Blue Tint): top-bar search on focus.

- **Login card** (`0 12px 40px rgba(15,34,54,0.12), 0 0 60px rgba(0,140,210,0.08)`), **login chip** (`inset 0 1px 0 #fff, 0 6px 16px rgba(15,34,54,0.08)`), **login button** (`0 6px 18px rgba(0,111,173,0.25)`) and **core disc** (`0 0 22px rgba(0,140,210,0.35), inset 0 0 14px rgba(255,255,255,0.4)`): the light vault's versions of core's dark-vault glows, on the login page only.
- **Core title glow** (`text-shadow: 0 0 32px` at rest, breathing from 22px to 44px; Core Dark Glow at 60% or Login Glow at 25%): the loading-screen title only.

### Named Rules
**The Only Menus Float Rule.** In the desk shell, a surface gets a shadow only if it floats over other content and closes again. Tiles, the top bar and the sidebar stay shadowless. The login vault is outside the shell and keeps the glow and lift that core's vault is built from, recoloured.

## Shapes

Gently rounded corners at one radius (6px) for items, tiles, buttons, inputs, quick links and tooltips. Menus are slightly softer (8px). The skeleton uses 4px and the scrollbar thumb 3px. Borders are 1px. Open groups show their items behind a 1px left rule indented 19px, which acts as a quiet tree line. A one-module group has no tree line because it has no items to show. Nothing is clipped into special shapes.

## Components

### Navigation (Sidebar)
Calm, theme-following and always present on desk routes.
- **Head:** the ISOFT ERP logo lockup (22px tall) with the version (12px, Side Ink Muted, "v1.3.0") aligned to the bottom of the wordmark. The lockup links to /app/home, and its tooltip carries "ISOFT ERP v…". On the rail only the icon mark shows (28px).
- **Search:** a 32px field on Hover Wash with a leading search icon and a Logo Blue Bright border on focus. It filters groups and items with accent-insensitive matching. With no match, or no modules at all, a short Side Ink Muted message stands in.
- **Groups:** directly under the search, with no section label. Each group button has an icon, two-line text and a chevron that rotates 180° in 160ms. The group holding the active page opens automatically. Items sit indented behind the left tree rule.
- **One-module groups:** a group that holds a single workspace is not a folder. Its row is a direct link (no chevron, no item list) that opens that workspace in one click, and it is active when that workspace is open. Group rows and direct links share one inset (7px top and bottom, 10px left and right) so the icons line up. While searching, a group the filter has narrowed to one item still expands, because it is not a one-module group.
- **States:** hover = Hover Wash + Side Strong. Active (an item or a direct link) = Blue Tint + the active text shade (Logo Blue, or Sky Active in dark mode), weight 600, with the icon in the same shade. Focus: a click draws no outline or ring (Bootstrap's dark button ring is removed), and keyboard focus (`:focus-visible`) shows the hover background (Hover Wash, `--isd-side-2`) with Side Strong text. The same applies inside sidebar menus.
- **Foot:** the company switcher (company name, with "Company" in 11px below) and a 32px collapse/expand button, above a 1px top rule.
- **Rail:** 60px, icons only. Group buttons open a flyout menu. Direct links stay links, centred, with 8px vertical padding.
- **Drawer:** below 992px, 272px wide, slides in over 220ms with the shared ease.

### Menus (company switcher, rail flyouts)
Fixed-position panels on the sidebar colour, min 220px and max 300px wide, 70vh tall at most, with 6px padding, an 8px radius and the Menu shadow. An optional title uses Label Small. Options have a Hover Wash hover, and the current option shows Blue Tint with accent text. Keyboard focus looks like hover, and a click draws no ring.

### Top Bar
White with a 1px bottom rule and no shadow. The core brand is hidden because the sidebar carries it, and breadcrumbs are Ink Muted. Search sits on Cool Ground and turns white on focus, with a Logo Blue Bright border and a 3px Blue Tint halo. Other Isoft apps' navbar buttons (POS, Command Center, Insights, Invenza, FE, Angola HR, Permission Manager, launcher) get one treatment: a 34px square, transparent, Ink Muted icon, and Hover Wash on hover. The bar reads as one row of tools.

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
The vault's interior, held on screen. Core's splash (every desk load or refresh) and the post-login boot cover both become one full-screen surface: the core ground with its 46px grid, radial glow and the fade that hides the grid towards the edges, and in its centre "ISOFT ERP" (Core Title) over "ENTERPRISE CORE · ONLINE" (Core Sub). Core's splash image and the boot cover's progress bar are hidden; the text is drawn by pseudo-elements, so there is no image, no chip, no ring and no progress indicator. The only motion is the title glow breathing (22px to 44px text-shadow, 3.6s ease-in-out, infinite). Under `prefers-reduced-motion` it stands still, glow included. After sign-in, the doors open onto this exact interior and it stays until the desk is ready. It follows the server-rendered `html[data-theme]`, dark or light. Because it paints before any script runs, it cannot see the pilot or the settings switch and applies site-wide wherever the app is installed. Core's star watermark is hidden only while the splash is on screen.

### Link Index
Four columns of cards. A heading is Label type in Ink Muted over a 1px Rule Strong line. Links are 13px rows with 7px vertical padding, each over a 1px Rule. Hover turns the text to the text accent. A disabled link is Ink Faint with a help cursor and shows a dark tooltip (Ink background, Surface text, 12px, Menu shadow) on hover or focus.

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
- **Do** honour `prefers-reduced-motion` for the chevron, drawer and skeleton. The shared ease is `cubic-bezier(0.16, 1, 0.3, 1)`.

### Don't:
- **Don't** restyle core lists, forms or reports inside the shell. Only the primary-button accent and the form full-width rule reach them.
- **Don't** list Isoft app pages in the sidebar. They live in the applications launcher.
- **Don't** bring back the v13 cyan-topped card grid, the star watermark or a flat module list.
- **Don't** add shadows to tiles, cards, the top bar or the sidebar. Only floating menus and tooltips cast one.
- **Don't** give other apps' navbar buttons their own colours inside the shell.
- **Don't** fill chart areas or use more than one accent-coloured series.
- **Don't** restyle the dark vault from this app, or move, resize or re-animate any part of the vault in the light variant. Change colours only.
- **Don't** draw an outline or ring on a clicked sidebar or menu control. Keyboard focus shows as the hover background.
