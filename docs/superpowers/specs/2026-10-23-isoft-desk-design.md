# ISOFT Desk — new desk shell and module pages (v1)

Status: approved by the user 2026-10-23 ("check and start"). Product truth: `/home/frappe/frappe-bench/PRODUCT.md`.

## Intent

The Frappe v13 desk on ISOFT ERP sites looks dated and inconsistent: a flat list of 20+ workspaces, cyan-topped cards, a star watermark behind every screen, coloured icon tiles in the navbar, link cards that hide what is waiting. The user wants a new desk style that is "unique, smart and easy to use", built so ISOFT controls on which sites it runs.

Success: any DocType or report is two clicks from the sidebar; every module page says what is waiting (with counts that open the filtered list); the desk reads as one modern product at the polish of Odoo 17, Linear, Stripe Dashboard and ERPNext v15.

## Goals

1. A global navy sidebar on every desk route, with workspaces grouped into ~8 collapsible groups.
2. A slimmer, calmer top bar.
3. New module pages (the `/app/<workspace>` routes) built from the same workspace data.
4. Everything in a new, separate Frappe app; installing it turns the new desk on, uninstalling (or switching it off) restores the old desk exactly.

## Non-goals (v1)

- Restyling list views, forms, report views, dialogs (they keep today's look inside the new shell; phase 2).
- Changing any Isoft app page (Invenza, Angola HR console, Insights, Intelize, SAF-T Center, Command Center…), POS Awesome, chat, the Business AI button.
- Editing Frappe/ERPNext core files, or changing any workspace/document data.

## Anti-goals (failure even if it looks good)

- Any change in document behaviour, permissions or data.
- A user losing access to a workspace, link or report they can reach today.
- Text cut off in Portuguese, or actions hidden at 1366×768.
- A site that cannot get the old desk back.

## Constraints

- Frappe v13 desk (rollup build, jQuery, Bootstrap 4), Python 3.8 venv, Node 20. Frappe core already carries hand edits to desk SCSS/JS (workspace rail sidebar, favorites, command palette, navbar logo); the app must work on top of them and not depend on them where avoidable.
- Assets: plain CSS/JS under `isoft_desk/public/` loaded through `app_include_css` / `app_include_js` (no SCSS, so no sass toolchain). Shipping a change needs `touch sites/.build` (memory: desk asset cache busting).
- Labels go through `__()` / `_()` and follow each user's language; add `pt` translations.
- Light theme is the norm; `[data-theme="dark"]` must work.
- Boot data is cached per user in redis (`bootinfo`); settings saves must clear it.

## Approaches considered

1. **New app with a global shell + overridden Workspaces page (chosen).** One app injects the sidebar and module-page renderer; reversible by install/uninstall or a settings switch. No core edits.
2. **Further edits to Frappe core SCSS/JS** (the path used so far). Fast, but not per-site, not reversible, and conflicts with the user's "new app for control and testing" requirement. Rejected.
3. **A separate desk Page (`/app/isoft-home`) beside the old workspaces.** Safe, but leaves two navigations and doesn't replace the module pages. Rejected.

## Visual direction (decided via impeccable)

The category standard, played straight (Operate mode). Benchmarks: Odoo 17, Linear, Stripe Dashboard, ERPNext v15 (Espresso). ISOFT identity only in three places: the ISOFT ERP logo, a dark navy sidebar, ISOFT cyan-blue as the single accent (active item, primary button, focus, links). Everything else neutral and tinted (no pure greys), Inter (already shipped by Frappe), tabular figures, thin 1px rules instead of accent bars, 6–8px radii, no card shadows by default, no watermark.

## How it works

### App and switch

- App `isoft_desk` (title "ISOFT Desk", module "Isoft Desk", publisher ISOFT LDA).
- Single DocType **Isoft Desk Settings** (user decision 2026-10-23: pilot first):
  - `enabled` (Check, default 1): site-wide kill switch.
  - `rollout` (Select `Pilot` / `Everyone`, default `Pilot`).
  - `pilot_users` (Table MultiSelect → User) and `pilot_roles` (Table MultiSelect → Role).
  - A fresh install is therefore inert: nobody sees the new desk until a user or role is added, or rollout is set to Everyone.
  - `on_update` clears `bootinfo` for all users.
- `boot_session` hook computes `active` for the session user (enabled AND (Everyone OR user in pilot_users OR shares a pilot role)) and adds `bootinfo.isoft_desk = {active, groups, rail_routes, hidden_routes, counts}`. When not active, it sends only `{active: false}`.
- JS does nothing unless `frappe.boot.isoft_desk.active`; it then adds `isd-on` to `<body>`. All CSS is scoped under `body.isd-on`, so switching off restores the old desk without uninstalling.

### Navigation model

- `isoft_desk/navigation.py` owns a default mapping of workspace name → group, for the ~8 groups: **Home, Finance** (Accounting, Assets, Loans, Isoft Angola Tax Compliance…), **Sales** (Selling, CRM, Retail, POS Awesome, CS-Cart…), **Purchasing** (Buying), **Stock** (Stock, Manufacturing, Quality…), **People** (HR, Payroll), **Projects & Support**, **Isoft Apps** (Isoft Business AI, Itec Integrations, HP, HP Partnership…), **Settings** (Build, Settings, Users, Customization, Integrations, Tools, Utilities, Website…).
- Groups are filled from `frappe.boot.allowed_workspaces` (already permission-filtered) **plus Isoft desk Pages** the user may open (`frappe.boot.page_info`, user decision): Invenza → Stock, Isoft Location Manager → Stock, SAF-T Center → Finance, FE Angola dashboard → Finance, Angola HR → People, Insights → Home, Command Center → Settings, Intelize → Sales, plus other Isoft Pages by app. Pages link to `/app/<page-route>`; their own UI stays untouched. A workspace missing from the mapping falls into a group by its `category` (Administration → Settings, Domains/other → "More"), so no client site loses a workspace. Empty groups are hidden.
- Group labels and workspace labels pass through `__()`.

### Shell

- **Sidebar** (`aside.isd-sidebar`, appended to `body` once at desk start): navy; logo at top (`/assets/frappe/images/isoft_erp_v3.svg` treated for a dark ground); a search box filtering workspaces and pages (while typing, every matching group shows open); **Favorites** above the groups, reusing the existing pins in `localStorage.workspace_sidebar_pinned` and a pin toggle on each item (builder's call: carry over what users have today); the group list; footer with the **company switcher** (sets the user's default company, as the core session-defaults dialog does) and the collapse toggle. Expanded width 232px; collapsed rail 60px. Only one group open at a time; the group holding the current route opens automatically and its item is highlighted. In the rail, a group opens as a small flyout menu beside its icon. Collapse state persists per user (`localStorage`, wrapped in try/catch).
- Main content shifts right by the sidebar width (`body.isd-on .main-section` padding / `.page-container` margin), no overlap with frappe's sticky navbar.
- **Routes:** on POS Awesome (`/app/posapp`) and other `hidden_routes` the sidebar is hidden; on Isoft app pages with their own sidebar (`rail_routes`: isoft-invenza, angola-hr-dashboard, isoft-insights, intelize-dashboard, …) the sidebar auto-collapses to the rail. Route changes are tracked with `frappe.router.on('change')`.
- **Below 992px:** the sidebar is an off-canvas drawer opened by a menu button added to the navbar; tapping outside closes it.
- **Top bar:** the logo leaves the navbar (it lives in the sidebar), breadcrumbs stay, search keeps Ctrl+G, the coloured icon buttons other apps inject are restyled as one consistent neutral icon-button row, user/help menus unchanged.
- The core watermark (`body::before`) and the core workspace sidebar (`.desk-sidebar` in the Workspaces page) are hidden under `isd-on`.

### Module pages

- `frappe.standard_pages['Workspaces']` is replaced (only when enabled) by an ISOFT renderer for the same routes. Data: `frappe.desk.desktop.get_desktop_page` (respects per-user workspace copies and permissions).
- Layout, top to bottom:
  1. **Header:** workspace title, company/date context line, up to 3 "New <DocType>" buttons for DocType shortcuts the user can create.
  0. **Onboarding:** when the workspace has incomplete onboarding, the core onboarding widget renders above the waiting row (builder's call: keep what users see today).
  2. **Waiting row** (max 5 tiles): first the workspace's own shortcuts with a `stats_filter` (count + the shortcut's `format` label, e.g. "34 To Deliver"); then the app's **default count definitions** for that workspace (user decision: ship defaults so every main page is useful), skipping DocTypes already shown. Defaults live in `isoft_desk/counts.py` as data: `{workspace, doctype, filters, label}`; label is translatable. Initial set (builder confirms field names on dev):
     - Home: Sales Orders to deliver; Sales Invoices overdue; Purchase Orders to receive; Material Requests pending.
     - Accounting: Sales Invoices overdue; Sales Invoices unpaid; Purchase Invoices unpaid; Journal Entries in draft; Sales Invoices not yet validated by FE Angola (`fe_angola_document_status` empty on submitted invoices, only when that field exists).
     - Buying, Stock, Selling, CRM: fill to the cap from the obvious open states (to receive, to bill, open leads/opportunities) when their own shortcuts give fewer than 3 tiles.
     - Assets: assets in draft; maintenance due. HR: leave applications open. Payroll: Isoft Salary Slip drafts (payroll runs on Isoft Salary Slip, not ERPNext Salary Slip).
     - Isoft and Settings workspaces: none unless an obvious open state exists.
  - Counts are computed server-side in one call per page (`isoft_desk.api.get_counts`) with `frappe.get_list(..., fields=["count(name)"])` so user permissions apply; a definition whose DocType or field doesn't exist on the site is skipped silently. **Company scope** (builder's call): when the DocType has a `company` field, counts filter on the user's current default company, which the header names; the same filter is added to the list route the tile opens. Tiles with zero show a calm "0"; loading shows a skeleton; a failed count shows "—".
  3. **Quick links:** remaining shortcuts as a compact row of links.
  4. **Chart:** at most the first workspace chart, full width, if the workspace defines one.
  5. **Link index:** workspace cards as columns (4 at ≥1280px, 3, 2, 1), card label as a small uppercase heading, links as rows with thin rules. Links blocked by onboarding dependencies stay visible, greyed, with the core "You need to create these first" popover; links core hides (permissions, `only_for`, `hidden`) stay hidden. Same behaviour as core `links_widget.js`.
- Page menu keeps "Edit workspace" (opens the Workspace document, System Manager only) and "Reset customizations". In-page drag-and-drop Customize is not offered in v1.
- An empty workspace (no access) redirects as core does today.

## Sites

v1 targets this bench (dev.isoft.ao and its sibling sites), whose Frappe core carries the hand edits listed above. CSS must hide both the edited and the stock core workspace sidebar. Before installing on erp.isoft.ao or client benches, their core is checked first; that is outside v1.

## States and ranges

- Workspaces per user: 5–40; groups 3–9; links per card 1–25; cards per page 1–12.
- Counts: loading, 0, thousands (`2 181`), failed (show "—", no error toast).
- Long Portuguese labels wrap within two lines in the sidebar; never ellipsis on the active item.
- Collapsed / expanded / drawer; light / dark; 1366×768, 1440×900, 1920×1080, 390px phone.

## Testing

- Python: unit tests for the group-mapping function (mapping, fallback by category, empty groups dropped, labels kept) run ONLY with `bench --site <site> run-tests --app isoft_desk` (never without `--app`; memory: run-tests wipes Item Price etc.).
- JS logic that can be pure (grouping, route classification) lives in a Frappe-free file unit-tested with Node, like `target_total_math.js`.
- Browser: Playwright sweep on dev.isoft.ao (server-side sid, nginx host mapping) over Home, Selling, Accounting, Stock, a list, a form, Invenza, POS route; light + dark; 1366×768 and 1440×900; plus switch-off check (settings `enabled=0` → old desk).
- impeccable: detector on changed files, finish review by `impeccable-finish-reviewer`, then `DESIGN.md` by `impeccable-documenter`.

## Left to the builder

- Exact token values within the direction above; icon choice per group from Frappe's built-in sprite.
- File split inside `public/js` and `public/css`.
- Confirm the `rail_routes` list found so far by screenshot (pages that draw their own sidebar): isoft-invenza, saft-center, isoft-insights, angola-hr-dashboard, isoft-location-manager, command-center, intelize-dashboard, fe-angola-dashboard; check isoft-cscart. `hidden_routes`: posapp.
