---
name: ISOFT Desk
description: The Frappe v13 desk shell for ISOFT ERP, with a theme-following sidebar, a calm top bar and module pages that show what is waiting.
colors:
  isoft-blue: "#006fad"
  isoft-blue-deep: "#005a8c"
  isoft-blue-tint: "#e4f1f9"
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
  dark-blue: "#4cb8f0"
  dark-blue-hover: "#7accf5"
  dark-blue-tint: "#10314a"
  dark-on-accent: "#06141f"
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
  loader-trace: "#c3d0dc"
  loader-chip-rule: "#c9d6e2"
  loader-pulse: "#0a8fd6"
  dark-loader-pulse: "#6cc0f0"
  dark-loader-chip: "#101a26"
  dark-loader-disc: "#0c1520"
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
    textColor: "{colors.dark-blue-hover}"
  sidebar-search:
    backgroundColor: "{colors.hover-wash}"
    textColor: "{colors.side-strong}"
    rounded: "{rounded.md}"
    height: "32px"
    padding: "0 10px 0 32px"
  sidebar-section-label:
    textColor: "{colors.side-ink-muted}"
    typography: "{typography.label-small}"
    padding: "14px 10px 6px"
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
    textColor: "{colors.dark-on-accent}"
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
  boot-cover:
    backgroundColor: "{colors.cool-ground}"
  loader:
    width: "420px"
---

# Design System: ISOFT Desk

## Overview

**Creative North Star: "The Category Standard, Played Straight"**

ISOFT Desk is a shell, not a skin. It replaces the Frappe v13 desk's navigation and module pages with the polish users already know from Odoo 17, Linear, Stripe Dashboard and ERPNext v15: a theme-following sidebar on the left, a slim white top bar, and module pages that answer "what is waiting for me in this company" before anything else. The people using it are accounting, sales, stock and management staff on 1366x768 laptops, working in Portuguese or English. They arrive with a job, do it and leave. Density is moderate (13px body, 30 to 34px rows), and every surface is flat, white or slate, and separated by 1px tinted rules.

The world is quiet so that state can be loud. ISOFT cyan-blue is the only accent. It marks where you are, the primary action, focus and links. Green, amber and red appear only when a count means something needs attention. The v13 desk's cyan-topped card grid, star watermark and flat 20-item module list are removed on purpose.

The scope is deliberately narrow. Everything lives under `body.isd-on`, so a user outside the pilot, or a site with the app switched off, sees the standard desk unchanged. Lists, forms and reports keep core styling inside the shell. The only changes there are the accent on the primary button and, on forms, the collapsed rail with the core left column hidden.

Two surfaces sit before the shell and follow different rules. The login page is the incumbent core "vault" (two doors, module chips wired into an authentication core, the card at the seam), and core's dark vault is its design, not this app's. The app only adds a light recolouring of it, picked from the theme this browser last used on the desk. The loading screen (core's splash and the post-login boot cover) shows one animated loader: circuit traces from six module chips into a ringed core around the ISOFT mark. Both paint before the shell exists, so they carry literal colours from this palette instead of the `--isd-*` tokens.

**Key Characteristics:**
- Theme-following sidebar: a white panel with a 1px rule in light mode, deep slate in dark mode.
- One accent, ISOFT blue. Semantic colours carry state only.
- Inter with tabular figures. Counts are large, and labels sit below them.
- 6px radii everywhere. Menus and popovers are the only things with a shadow.
- Fully scoped (`body.isd-on`). Core lists, forms and reports are not restyled.
- The login vault opens in the browser's last desk theme; the light vault is a recolour, never a relayout.
- One animated loader for every load, in the desk theme the server rendered.

## Colors

A cool slate-and-white neutral field with one saturated blue, and semantic hues kept for state. Each light token has a dark counterpart, which is swapped in under `[data-theme="dark"]`.

### Primary
- **ISOFT Blue** (isoft-blue): the active sidebar item text, the primary button, focus outlines, tile and quick-link hover borders, and the first chart series. In dark mode it becomes **Sky ISOFT Blue** (dark-blue), and the active sidebar item uses the lighter dark-blue-hover.
- **ISOFT Blue Deep** (isoft-blue-deep): the primary button on hover and press.
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
- **Door Steel** (login-door, login-door-mid, login-door-seam): the door gradient, pale at the edges and darkest at the 50% seam, over a faint 3px Login Shade line texture. The inner edge of each door is a 1px ISOFT Blue rule at 24%.
- **Interior** (login-door to login-interior-floor): the revealed core behind the doors, a vertical gradient under a 9% ISOFT Blue radial wash, with 46px gridlines in ISOFT Blue at 7%.
- **Core Glow** (login-glow): the one glow hue of the light vault. It lights the core halo (22%), the core disc shadow (35%), the interior glow (18%), the title text-shadow (25%) and the card's outer halo (8%).
- **Core Disc** (surface to login-core-mid to login-core-deep): a radial sphere, white highlight at 38% from the top. Its ring is ISOFT Blue at 30% and its label is Login Core Label.
- **Module Chips**: Surface to a pale cool white, a 1px ISOFT Blue border at 22%, ISOFT Blue icons and Login Chip Ink labels. The traces that wire them to the core are Login Trace at 32%.
- **Title** (login-title): the interior title; its subtitle is the same ink at 62%.
- **Card, inputs, button**: the card is Surface at 86% with an ISOFT Blue border at 20% and Login Chip Ink text; its heading and subtitle are Side Ink. Inputs are Surface with a Rule Strong border, Ink text, Ink Faint placeholders and icons, and an ISOFT Blue border with a 3px 15% halo on focus. The button is ISOFT Blue on white with a soft blue shadow, ISOFT Blue Deep on hover. Show/forgot/sign-up links are ISOFT Blue, and the sign-up line is Ink Muted.
- **Login Shade** (login-shade): the cool ink behind every light-vault shadow and door rule. It is never used as a fill.

### Loading Screen
Two hand-written SVGs (`isd_loader_light.svg`, `isd_loader_dark.svg`) share one drawing and swap only colour.
- **Light:** traces in Loader Trace (dashed 3/6), chips Surface with a Loader Chip Rule border, pulses and chip lights in Loader Pulse, ring and disc rules in ISOFT Blue at 14 to 32%, a white disc, and a halo in Core Glow at 16%.
- **Dark:** pulses and chip lights in Dark Loader Pulse, chips in Dark Loader Chip, the disc in Dark Loader Disc, and traces, chip borders and rings in pale cool blue at 16 to 40%. The halo is Login Core Mid at 26%.
- **Ground:** the boot cover sits on Cool Ground under an 8% ISOFT Blue radial wash in light mode. The dark ground and the splash ground are core's.

### Named Rules
**The One Accent Rule.** Inside the desk shell, ISOFT blue is the only hue that is not about state. A second brand colour, a gradient or a coloured section header does not belong there. The login vault and the loader are blue worlds too: their glow and pulse hues are lighter blues from the same family, never a second hue.

**The Vault Is Core's Rule.** The dark vault (core `login.scss` and `www/login.html`) is the incumbent design and stays where it is. This app only recolours it, under `html[data-isd-login="light"]`. Doors, chips, traces, core and card keep core's geometry, motion and gradients, and the light variant swaps their colours one for one.

**The Colour Is State Rule.** A tile count turns red or amber only when its definition carries a tone and the count is above zero. A zero count goes faint, never green. Charts draw series 1 in the accent and further series in Ink Faint and Rule Strong, with no area fill.

## Typography

**Body Font:** Inter (core Frappe v13 stack, inherited; the app sets no font-family of its own)

**Character:** One neutral grotesque at small, controlled sizes. Hierarchy comes from weight and from one large number, not from a display face. Module pages turn on tabular figures so counts line up.

### Hierarchy
- **Count** (600, 26px, 1.15, -0.01em, tabular): the number on a waiting tile, the largest type the shell adds.
- **Title** (500, 13px): tile labels, quick links and sidebar group buttons.
- **Body** (400, 13px, 1.35): sidebar items, index links and the module context line ("ITEC LDA · October 2026").
- **Meta** (400, 12px): the tile DocType line, the sidebar version and tooltips.
- **Label** (600, 12px, 0.06em, uppercase): link-index card headings.
- **Label Small** (600, 11px, 0.06em, uppercase): sidebar section labels ("Modules", "Favorites") and menu titles.

Page titles, form headings and every other text size come from core.

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
- **Loader:** one 520x240 drawing, centred, `min(420px, 80vw)` wide at that aspect ratio, for both the splash and the boot cover.

## Elevation & Depth

The shell is flat. Depth comes from tone (cool ground under white surfaces, or slate under slate-blue in dark mode) and from 1px rules. The core chart and onboarding widgets lose their card shadow and pseudo-element chrome.

### Shadow Vocabulary
- **Menu** (`0 8px 24px rgba(15,34,54,0.18), 0 2px 6px rgba(15,34,54,0.12)`; dark: `0 8px 24px rgba(0,0,0,0.5), 0 2px 6px rgba(0,0,0,0.4)`): the company menu, rail flyouts and disabled-link tooltips only.
- **Focus halo** (`0 0 0 3px` Blue Tint): top-bar search on focus.

- **Login card** (`0 12px 40px rgba(15,34,54,0.12), 0 0 60px rgba(0,140,210,0.08)`), **login chip** (`inset 0 1px 0 #fff, 0 6px 16px rgba(15,34,54,0.08)`), **login button** (`0 6px 18px rgba(0,111,173,0.25)`) and **core disc** (`0 0 22px rgba(0,140,210,0.35), inset 0 0 14px rgba(255,255,255,0.4)`): the light vault's versions of core's dark-vault glows, on the login page only.

### Named Rules
**The Only Menus Float Rule.** In the desk shell, a surface gets a shadow only if it floats over other content and closes again. Tiles, the top bar and the sidebar stay shadowless. The login vault is outside the shell and keeps the glow and lift that core's vault is built from, recoloured.

## Shapes

Gently rounded corners at one radius (6px) for items, tiles, buttons, inputs, quick links and tooltips. Menus are slightly softer (8px). The skeleton and pin button use 4px, and the scrollbar thumb 3px. Borders are 1px. Open groups show their items behind a 1px left rule indented 19px, which acts as a quiet tree line. Nothing is clipped into special shapes.

## Components

### Navigation (Sidebar)
Calm, theme-following and always present on desk routes.
- **Head:** the ISOFT ERP logo lockup (22px tall) with the version (12px, Side Ink Muted, "v1.3.0") aligned to the bottom of the wordmark. The lockup links to /app/home, and its tooltip carries "ISOFT ERP v…". On the rail only the icon mark shows (28px).
- **Search:** a 32px field on Hover Wash with a leading search icon. It filters groups and items with accent-insensitive matching.
- **Favorites:** pinned items, shared with the core sidebar's pins. A pin button appears on row hover or focus and stays visible, in the accent, when pinned.
- **Groups:** a section label, then group buttons (icon, two-line text, chevron that rotates 180° in 160ms). The group holding the active page opens automatically. Items sit indented behind the left tree rule.
- **States:** hover = Hover Wash + Side Strong. Active = Blue Tint + accent text, weight 600. Focus: a click draws no outline or ring (Bootstrap's dark button ring is removed), and keyboard focus (`:focus-visible`) shows the hover background (Hover Wash, `--isd-side-2`) with Side Strong text. The same applies inside sidebar menus.
- **Foot:** the company switcher (company name, with "Company" in 11px below) and a 32px collapse/expand button, above a 1px top rule.
- **Rail:** 60px, icons only. Group buttons open a flyout menu.
- **Drawer:** below 992px, 272px wide, slides in over 220ms with the shared ease.

### Menus (company switcher, rail flyouts)
Fixed-position panels on the sidebar colour, min 220px and max 300px wide, 70vh tall at most, with 6px padding, an 8px radius and the Menu shadow. An optional title uses Label Small. Options have a Hover Wash hover, and the current option shows Blue Tint with accent text. Keyboard focus looks like hover, and a click draws no ring.

### Top Bar
White with a 1px bottom rule and no shadow. The core brand is hidden because the sidebar carries it, and breadcrumbs are Ink Muted. Search sits on Cool Ground and turns white with an accent border and halo on focus. Other Isoft apps' navbar buttons (POS, Command Center, Insights, Invenza, FE, Angola HR, Permission Manager, launcher) get one treatment: a 34px square, transparent, Ink Muted icon, and Hover Wash on hover. The bar reads as one row of tools.

### Buttons
Core buttons, recoloured. The primary uses ISOFT Blue with white text and ISOFT Blue Deep on hover or press. In dark mode it uses Sky Blue with near-black text. Secondary buttons stay core. New buttons read "+ DocType" (a plus icon instead of "New {0}", which gendered languages cannot translate).

### Waiting Tiles (signature)
The module page's lead. Each tile is a link to the filtered list: a white surface with a 1px Rule border, a 6px radius and 14/16/13px padding. It shows the count (Count type), the label (Title) and the DocType (Meta, Ink Muted). On hover the border turns to the accent over 140ms. On focus it gets a 2px accent outline with a 2px offset. While loading, a 48x26 shimmer skeleton stands in for the count (static under reduced motion). An unavailable count shows "—". Tone states: **zero** (Ink Faint), **bad** (State Bad), **warn** (State Warn). A tone applies only when the count is above zero. Counts use the user's default company when the DocType has a company field. Catalogue sizes are never shown as waiting.

### Quick Links
Inline chips: 30px minimum height, 5/12px padding, a Rule Strong border on Surface, 13px/500 text. On hover the border and text turn to the accent. Shortcuts already counted as tiles are left out.

### Chart
At most one core chart widget, with a 1px Rule border, a 6px radius and no shadow or chrome. Series 1 is the accent, series 2 Ink Faint, series 3 Rule Strong, legend dots match, and there is no region fill.

### Login Vault (light variant)
Core's vault, recoloured (see Colors, Login Surface). It covers the login, email-login, forgot-password and sign-up cards. Selectors start at `html[data-isd-login="light"]` so they outrank core's login stylesheet and its inline critical style, both of which load later. Ground and body backgrounds use `!important` for the same reason.

### Theme Memory
The login page knows no user, so the browser remembers the theme. On every desk load and every theme switch, the desk writes `localStorage["isoft_theme"]` (`light` or `dark` only) for every desk user, pilot or not. An inline script in the login page's `<head>` reads it before the first paint and sets `data-isd-login`. If the value is missing or storage is blocked, it falls back to `prefers-color-scheme`. The script is injected only while Isoft Desk Settings is enabled; when it is off, the login page is core's dark vault.

### Loading Screen (signature)
One loader replaces core's splash image and the bar of the post-login boot cover. Six module chips (three each side) send light along dashed circuit traces into a core: a dashed ring that turns once every 9s, a fixed outer ring and a disc holding the ISOFT mark. Each trace carries a short pulse on a 1.6s cycle with staggered starts (0 to 1.1s) and the ease `cubic-bezier(.45,0,.2,1)`. As a pulse leaves, its chip light blinks, and the halo breathes and the mark beats once (scale 1.045) on the same 1.6s cycle. Under `prefers-reduced-motion` every animation stops and the pulses hide, leaving a still frame of chips, traces, rings and mark. It follows the server-rendered `html[data-theme]`. Because it paints before any script runs, it cannot see the pilot or the settings switch and applies site-wide wherever the app is installed. Core's star watermark is hidden only while the splash is on screen.

### Link Index
Four columns of cards. A heading is Label type in Ink Muted over a 1px Rule Strong line. Links are 13px rows with 7px vertical padding, each over a 1px Rule. Hover turns the text to the accent. A disabled link is Ink Faint with a help cursor and shows a dark tooltip (Ink background, Surface text, 12px, Menu shadow) on hover or focus.

## Do's and Don'ts

### Do:
- **Do** scope every selector under `body.isd-on` (or the `.isd-` shell elements it creates), so switching the app off restores the standard desk. Two documented exceptions: the light vault (`html[data-isd-login="light"]`, set only while the app is enabled) and the loader (html-level, site-wide, because it paints before boot).
- **Do** use the `--isd-*` custom properties, never literal hex, so light and dark both follow the desk theme. The login and loader stylesheets are the exception: the tokens are not loaded there, so they use literal values from the Login Surface and Loading Screen palette.
- **Do** settle the login theme before first paint (remembered desk theme, then the OS preference), so the vault never flashes the other variant.
- **Do** keep the loader's reduced-motion still frame complete: chips, traces, rings and mark all visible, nothing moving.
- **Do** keep ISOFT blue for where-you-are, the primary action, focus and links. Nothing else is blue.
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
