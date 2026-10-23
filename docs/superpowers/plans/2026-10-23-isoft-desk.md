# ISOFT Desk v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A new Frappe app `isoft_desk` that gives pilot users a navy grouped sidebar on every desk route, a calmer top bar, and new module pages with live "waiting" counts, without touching Frappe/ERPNext core.

**Architecture:** Python side: a Single settings DocType decides who is active; a `boot_session` hook ships groups, route rules and count availability in `frappe.boot.isoft_desk`; `isoft_desk.api.get_counts` computes permission-safe counts. JS side: a Frappe-free core module (pure functions, Node-tested) plus a shell module (sidebar/topbar) and a module-page renderer that replaces `frappe.standard_pages['Workspaces']`. All CSS is scoped under `body.isd-on`.

**Tech Stack:** Frappe v13 desk (jQuery, Bootstrap 4), Python 3.8, plain CSS/JS via `app_include_css`/`app_include_js` (no SCSS, no rollup bundle), Node 20 `node:test`, Playwright (bench venv) for browser checks.

**Spec:** `docs/superpowers/specs/2026-10-23-isoft-desk-design.md`. Product truth: `/home/frappe/frappe-bench/PRODUCT.md`.

## Global Constraints

- No edits to `apps/frappe` or `apps/erpnext`. No changes to Workspace or document data.
- Every CSS rule is under `body.isd-on`; every JS entry point returns early unless `frappe.boot.isoft_desk && frappe.boot.isoft_desk.active`.
- A fresh install is inert: `rollout` defaults to `Pilot` with empty pilot tables.
- Tests run ONLY as `bench --site dev.isoft.ao run-tests --app isoft_desk` (never without `--app`; it wipes Item Price/Leave/Salary Slip data).
- User-facing strings via `__()` (JS) / `_()` (Python); ship `isoft_desk/translations/pt.csv`.
- Shipping JS/CSS changes: `bench build --app isoft_desk` is not needed (plain files); run `touch /home/frappe/frappe-bench/sites/.build` and `bench --site dev.isoft.ao clear-cache`. Python changes need `bench restart` (gunicorn --preload).
- Visual direction: category standard, benchmarks Odoo 17 / Linear / Stripe Dashboard / ERPNext v15; identity = ISOFT ERP logo + navy sidebar + ISOFT cyan-blue single accent; Inter; tabular figures; tinted neutrals; 1px rules, 6–8px radii, no accent bars on cards, no watermark.
- Sidebar 232px expanded, 60px rail, off-canvas drawer below 992px; must fit 1366×768.
- Read `/home/frappe/.claude/skills/impeccable/reference/craft-floor.md` before the first UI edit of Tasks 6 and 7.

## Review Focus

1. A user who can reach only 1–3 workspaces (e.g. a stock clerk): empty groups disappear, no blank headers, no JS errors. Test in Task 3.
2. Per-user workspace copies and names with spaces (`Selling-julia@itec.co.ao`, `Isoft Angola Tax Compliance`): the sidebar links to the route core uses and highlights the right item. Tests in Tasks 3 and 5.
3. A count definition whose DocType or field is missing on a site (no FE Angola app, no Isoft Salary Slip): skipped, the other tiles still render. Test in Task 4.
4. Settings saved while pilot users are logged in: a removed user gets the old desk after reload (bootinfo cleared). Test in Task 2.
5. Long Portuguese labels ("Conformidade Fiscal Angolana", "Gestor de Localizações") in the expanded sidebar and module-page headings: wrap within two lines, never overflow or overlap counts. Checked in Task 8 sweep with `lang=pt`.

---

### Task 1: Scaffold the app

**Files:**
- Create: `apps/isoft_desk/` (via `bench new-app`), `apps/isoft_desk/docs/superpowers/{specs,plans}/` (moved from bench root)
- Modify: `apps/isoft_desk/isoft_desk/hooks.py`, `apps/isoft_desk/isoft_desk/modules.txt` (`Isoft Desk`)

**Interfaces:**
- Produces: package `isoft_desk`, module `Isoft Desk`, git repo at `apps/isoft_desk`.

- [ ] **Step 1:** `cd /home/frappe/frappe-bench && printf 'ISOFT Desk\nNew desk shell and module pages for ISOFT ERP\nISOFT LDA\nai.accounts@isoft.co.ao\nmit\n' | bench new-app isoft_desk` → `apps/isoft_desk/isoft_desk/hooks.py` exists, `app_title = "ISOFT Desk"`.
- [ ] **Step 2:** Move `docs/superpowers/specs/2026-10-23-isoft-desk-design.md` and `docs/superpowers/plans/2026-10-23-isoft-desk.md` from the bench root into `apps/isoft_desk/docs/superpowers/…`.
- [ ] **Step 3:** `cd apps/isoft_desk && git init -b main` (if new-app did not), `git add -A && git commit -m "chore: scaffold isoft_desk app with design spec and plan"`.

Do NOT install on a site yet (Task 2 installs once the settings DocType exists).

---

### Task 2: Settings, activation and boot payload

**Files:**
- Create: `isoft_desk/isoft_desk/doctype/isoft_desk_settings/` (json, py, js), `…/doctype/isoft_desk_pilot_user/` (child: `user` Link User), `…/doctype/isoft_desk_pilot_role/` (child: `role` Link Role)
- Create: `isoft_desk/activation.py`, `isoft_desk/boot.py`
- Modify: `isoft_desk/hooks.py` (`boot_session = "isoft_desk.boot.boot_session"`)
- Test: `isoft_desk/tests/test_activation.py`

**Interfaces:**
- Produces: `is_active_for(user: str, roles: list[str], settings: dict) -> bool` where settings = `{"enabled": 0|1, "rollout": "Pilot"|"Everyone", "pilot_users": [str], "pilot_roles": [str]}`; `get_settings() -> dict` (that shape, cached via `frappe.cache().hget`); `boot_session(bootinfo)` sets `bootinfo.isoft_desk = {"active": False}` or `{"active": True, "groups": …, "rail_routes": …, "hidden_routes": …, "count_workspaces": …}` (the last four filled by Tasks 3–4; until then empty lists).
- Settings fields: `enabled` (Check, default 1), `rollout` (Select `Pilot\nEveryone`, default `Pilot`), `pilot_users` (Table MultiSelect → Isoft Desk Pilot User), `pilot_roles` (Table MultiSelect → Isoft Desk Pilot Role). Permissions: System Manager only.

- [ ] **Step 1: Write failing tests** in `test_activation.py` (plain `unittest.TestCase`, no DB writes):
  - `test_disabled_is_inactive`: enabled 0, rollout Everyone → False.
  - `test_pilot_empty_is_inactive`: enabled 1, Pilot, no users/roles → False.
  - `test_pilot_user`: user `a@x.ao` in pilot_users → True; `b@x.ao` → False.
  - `test_pilot_role`: roles `["Accounts User"]`, pilot_roles `["Accounts User"]` → True.
  - `test_everyone`: enabled 1, Everyone → True.
  - `test_guest_never`: user `Guest`, Everyone → False.
- [ ] **Step 2:** Run `bench --site dev.isoft.ao run-tests --app isoft_desk --module isoft_desk.tests.test_activation` → FAIL (import error).
- [ ] **Step 3:** Implement `is_active_for`, `get_settings`, the DocTypes, and `IsoftDeskSettings.on_update` which deletes the settings cache key and calls `frappe.cache().delete_key("bootinfo")`; `boot_session` uses `frappe.session.user` and `frappe.get_roles()`.
- [ ] **Step 4:** Install and migrate: `bench --site dev.isoft.ao install-app isoft_desk && bench restart`; re-run the tests → 6 passed.
- [ ] **Step 5: Review Focus #4 check:** in `bench --site dev.isoft.ao console`, set `rollout=Everyone`, save, confirm `frappe.cache().hgetall("bootinfo")` is empty; set back to `Pilot`, save. Expected: empty both times.
- [ ] **Step 6:** Commit `feat: settings DocType, pilot activation and boot payload`.

---

### Task 3: Navigation groups

**Files:**
- Create: `isoft_desk/navigation.py`
- Modify: `isoft_desk/boot.py` (fill `groups`, `rail_routes`, `hidden_routes`)
- Test: `isoft_desk/tests/test_navigation.py`

**Interfaces:**
- Consumes: `frappe.boot`-equivalent inputs on the server: `get_desk_sidebar_items()` (from `frappe.desk.desktop`) and `get_allowed_pages()` (from `frappe.boot`).
- Produces: `build_groups(workspaces: list[dict], pages: list[str], page_titles: dict) -> list[dict]` returning ordered `[{"key": str, "label": str, "icon": str, "items": [{"type": "workspace"|"page", "name": str, "label": str, "route": str, "icon": str}]}]`, empty groups removed. `route` = `frappe.scrub(name).replace("_", "-")`-style slug matching `frappe.router.slug` (lowercase, spaces → `-`). Constants `GROUPS` (ordered keys/labels/icons), `WORKSPACE_GROUP` (name → key), `PAGE_GROUP` (page name → key), `RAIL_ROUTES`, `HIDDEN_ROUTES`.
- Group keys in order: `home` Home, `finance` Finance, `sales` Sales, `purchasing` Purchasing, `stock` Stock, `people` People, `projects` Projects & Support, `isoft` Isoft Apps, `settings` Settings, `more` More.
- `WORKSPACE_GROUP`: Home→home; Accounting, Assets, Loans, Isoft Angola Tax Compliance→finance; Selling, CRM, Retail, POS Awesome, CS-Cart Integration→sales; Buying→purchasing; Stock, Manufacturing, Quality→stock; HR, Payroll→people; Projects, Support→projects; Isoft Business AI, Itec Integrations, HP, HP Partnership→isoft; Build, Settings, Users, Customization, Integrations, Tools, Utilities, Website, ERPNext Settings, ERPNext Integrations, ERPNext Integrations Settings→settings. Unmapped: category `Administration`→settings, anything else→more.
- `PAGE_GROUP`: isoft-invenza, isoft-location-manager→stock; saft-center, fe-angola-dashboard→finance; angola-hr-dashboard→people; isoft-insights→home; command-center→settings; intelize-dashboard, isoft-cscart→sales; isoft-permission-manager→settings; business-assistant→isoft. Pages not in `PAGE_GROUP` are not listed.
- `RAIL_ROUTES`: isoft-invenza, saft-center, isoft-insights, angola-hr-dashboard, isoft-location-manager, command-center, intelize-dashboard, fe-angola-dashboard. `HIDDEN_ROUTES`: posapp.

- [ ] **Step 1: Write failing tests:**
  - `test_mapped_and_ordered`: workspaces Accounting, Selling, Home → groups `["home","finance","sales"]` in that order.
  - `test_fallback_by_category`: `{"name":"Frisko","category":"Modules"}` → in `more`; `{"name":"X Admin","category":"Administration"}` → in `settings`.
  - `test_empty_groups_dropped` (Review Focus #1): only `Stock` → exactly one group `stock`.
  - `test_pages_added_only_when_allowed`: pages `["isoft-invenza"]` → stock group contains a `page` item with route `isoft-invenza`; `saft-center` absent when not in pages.
  - `test_route_slug_with_spaces` (Review Focus #2): `Isoft Angola Tax Compliance` → route `isoft-angola-tax-compliance`.
- [ ] **Step 2:** Run the module → FAIL.
- [ ] **Step 3:** Implement `build_groups`; labels pass through `_()`; boot fills `groups`, `rail_routes`, `hidden_routes` only when active.
- [ ] **Step 4:** Run tests → 5 passed. `bench restart`.
- [ ] **Step 5:** Commit `feat: workspace and Isoft page grouping for the sidebar`.

---

### Task 4: Waiting counts

**Files:**
- Create: `isoft_desk/counts.py`, `isoft_desk/api.py`
- Test: `isoft_desk/tests/test_counts.py`

**Interfaces:**
- Produces: `DEFAULT_COUNTS: list[dict]` items `{"workspace": str, "doctype": str, "filters": list, "label": str}`; `definitions_for(workspace: str, shortcut_doctypes: list[str]) -> list[dict]` (app defaults for that workspace minus DocTypes already shown by shortcuts, max 5 − len(shortcut tiles) handled by caller); `@frappe.whitelist() get_counts(workspace: str, company: str = None) -> list[dict]` returning `[{"doctype", "label", "count": int|None, "filters": list}]`, where filters include `["company","=",company]` when the DocType has a `company` field and a company is given; `count` is `None` when the query fails.
- Shortcut stats tiles are counted client-side the way core does (Task 7); `get_counts` covers only `DEFAULT_COUNTS`.
- Initial `DEFAULT_COUNTS` (verify each field on dev before committing; drop any that do not exist):
  - Home: Sales Order `status in (To Deliver and Bill, To Deliver)` "To deliver"; Sales Invoice `status=Overdue` "Overdue invoices"; Purchase Order `status in (To Receive and Bill, To Receive)` "To receive"; Material Request `docstatus=1, status=Pending` "Material requests pending".
  - Accounting: Sales Invoice `Overdue`; Sales Invoice `docstatus=1, outstanding_amount>0` "Unpaid sales invoices"; Purchase Invoice `docstatus=1, outstanding_amount>0` "Unpaid purchase invoices"; Journal Entry `docstatus=0` "Draft journal entries"; Sales Invoice `docstatus=1, fe_angola_document_status in ("", null)` "Not validated by AGT" (only if the field exists).
  - Selling: Quotation `status=Open` "Open quotations"; Delivery Note `status=To Bill` "Delivered, not billed".
  - Buying: Purchase Receipt `status=To Bill` "Received, not billed"; Supplier Quotation `docstatus=0`.
  - Stock: Delivery Note `docstatus=0` "Draft deliveries"; Stock Entry `docstatus=0` "Draft stock entries".
  - CRM: Lead `status=Open`; Opportunity `status=Open`.
  - Assets: Asset `docstatus=0`; Asset Maintenance Log `maintenance_status=Planned` "Maintenance due".
  - HR: Leave Application `status=Open`. Payroll: Isoft Salary Slip `docstatus=0` "Draft salary slips".
- Counting: `frappe.get_list(doctype, filters=…, fields=["count(name) as n"])` (applies permissions; v13 blacklist-safe), wrapped per definition in try/except.

- [ ] **Step 1: Write failing tests:**
  - `test_missing_doctype_skipped` (Review Focus #3): a definition for `"No Such Doctype"` yields no row and no exception; other rows present.
  - `test_missing_field_skipped`: Sales Invoice with filter on `no_such_field` → skipped.
  - `test_company_filter_added`: for Sales Invoice with `company="ITEC LDA"`, returned filters contain `["company","=","ITEC LDA"]`; for Lead (no company field on dev? check meta) not added.
  - `test_dedupe_against_shortcuts`: `definitions_for("Selling", ["Quotation"])` has no Quotation row.
  - `test_counts_are_ints`: `get_counts("Accounting", "ITEC LDA")` as Administrator → every `count` is int ≥ 0.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement; boot adds `count_workspaces = sorted({d["workspace"] for d in DEFAULT_COUNTS})`.
- [ ] **Step 4:** Run tests → 5 passed. `bench restart`.
- [ ] **Step 5:** Commit `feat: permission-safe default waiting counts per workspace`.

---

### Task 5: Frappe-free JS core

**Files:**
- Create: `isoft_desk/public/js/isd_core.js` (UMD-style: `module.exports` under Node, `window.isd_core` in the browser)
- Test: `isoft_desk/tests/isd_core.test.js`

**Interfaces:**
- Produces:
  - `route_mode(route: string[], rail_routes: string[], hidden_routes: string[]) -> "hidden"|"rail"|"normal"` (looks at `route[0]` for Pages; `route[0]==="Workspaces"` → normal).
  - `find_active(groups, route: string[]) -> {group_key, item_name}|null` (Workspaces route `["Workspaces","Selling"]` and per-user copies: match on workspace name, then on slug).
  - `filter_groups(groups, term: string) -> groups` (case- and accent-insensitive: `"comer"` matches `"Comércio"`; groups with no matches dropped).
  - `favorite_items(groups, pinned: string[]) -> items` (keeps pin order, drops pins the user can no longer see).

- [ ] **Step 1: Write failing tests** (`node:test`):
  - `route_mode(["posapp"],R,H)==="hidden"`, `route_mode(["isoft-invenza"],R,H)==="rail"`, `route_mode(["List","Sales Invoice"],R,H)==="normal"`.
  - `find_active` for `["Workspaces","Isoft Angola Tax Compliance"]` returns `finance` (Review Focus #2).
  - `filter_groups(groups,"comer")` keeps an item labelled `Comércio`.
  - `favorite_items(groups,["Selling","Gone"])` returns only Selling.
- [ ] **Step 2:** `node --test isoft_desk/tests/isd_core.test.js` → FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Run → all pass.
- [ ] **Step 5:** Commit `feat: pure JS core for routing, active item, search and favorites`.

---

### Task 6: Shell — sidebar, top bar, drawer

**Files:**
- Create: `isoft_desk/public/js/isd_shell.js`, `isoft_desk/public/css/isd_tokens.css`, `isoft_desk/public/css/isd_shell.css`
- Modify: `isoft_desk/hooks.py` (`app_include_js = ["/assets/isoft_desk/js/isd_core.js", "/assets/isoft_desk/js/isd_shell.js", "/assets/isoft_desk/js/isd_workspace.js"]`, `app_include_css = ["/assets/isoft_desk/css/isd_tokens.css", "/assets/isoft_desk/css/isd_shell.css", "/assets/isoft_desk/css/isd_workspace.css"]`; create empty `isd_workspace.*` placeholders here so the hooks resolve)
- Surface brief: `.claude/skills/impeccable/scripts/impeccable surface-brief write apps/isoft_desk/isoft_desk/public/js/isd_shell.js <body>` with the direction contract (canon, seed reference `seed:760cded26c3143f4`, FINISH line).

**Interfaces:**
- Consumes: `frappe.boot.isoft_desk` (Tasks 2–3), `window.isd_core` (Task 5).
- Produces: `window.isd_shell = { refresh(), set_mode(mode) }`; body classes `isd-on`, `isd-rail`, `isd-hidden`, `isd-drawer-open`; CSS custom properties on `body.isd-on`: `--isd-navy`, `--isd-navy-2`, `--isd-navy-ink`, `--isd-accent` (ISOFT cyan-blue), `--isd-accent-ink`, `--isd-ground`, `--isd-surface`, `--isd-ink`, `--isd-ink-2`, `--isd-rule`, `--isd-ok`, `--isd-warn`, `--isd-bad`, `--isd-side-w` (232px | 60px | 0), `--isd-radius` (6px), with `[data-theme="dark"]` values.

- [ ] **Step 1:** Read the craft floor; write the surface brief; verify it with `surface-brief read`.
- [ ] **Step 2:** Implement the sidebar per spec "Shell": logo, search, Favorites (reads/writes `localStorage.workspace_sidebar_pinned`, try/catch), groups (one open at a time, active auto-open), rail flyouts, footer company switcher (`frappe.defaults.get_user_default("company")`, sets via `frappe.xcall("frappe.client.set_value"…)`-free path: `frappe.defaults.set_user_default_local` + `frappe.call("frappe.core.doctype.session_default_settings.session_default_settings.set_session_default_values")`, then reload counts), collapse toggle persisted in `localStorage.isd_rail`.
- [ ] **Step 3:** Hide core watermark (`body.isd-on::before{display:none}`), core workspace `.layout-side-section` on the Workspaces page, navbar logo; restyle navbar icon row neutral; add drawer button below 992px.
- [ ] **Step 4:** Route handling: on `frappe.router.on("change")` apply `route_mode` and `find_active`.
- [ ] **Step 5: Browser check:** add Administrator to pilot users; `touch sites/.build`; Playwright screenshots of `/app/selling`, `/app/sales-invoice`, `/app/sales-invoice/new`, `/app/isoft-invenza` (rail), `/app/posapp` (no sidebar) at 1440×900 and 1366×768, plus 390×844 drawer open. Expected: no overlap with navbar, content shifted by sidebar width, no horizontal scroll.
- [ ] **Step 6:** `impeccable detect --json apps/isoft_desk/isoft_desk/public` → fix mechanical findings.
- [ ] **Step 7:** Commit `feat: global navy sidebar, top bar and mobile drawer`.

---

### Task 7: Module page renderer

**Files:**
- Modify: `isoft_desk/public/js/isd_workspace.js`, `isoft_desk/public/css/isd_workspace.css`

**Interfaces:**
- Consumes: `frappe.desk.desktop.get_desktop_page`, `isoft_desk.api.get_counts` (Task 4), `frappe.boot.isoft_desk.count_workspaces`, `isd_shell` tokens.
- Produces: when active, `frappe.standard_pages["Workspaces"]` replaced by a function creating `frappe.isd_workspace = new IsdWorkspace(wrapper)` with `show()` reading `frappe.get_route()[1]` (default: `localStorage.current_workspace`, else first `home` item), same as core `get_page_to_show`.

- [ ] **Step 1:** Read the craft floor (if not already in this context).
- [ ] **Step 2:** Implement per spec "Module pages": header (title, `company · Month YYYY`, up to 3 "New X" via `frappe.model.can_create`), onboarding (core `frappe.widget.make_widget({widget_type:"onboarding",…})` when items incomplete), waiting row (shortcut `stats_filter` tiles counted with `frappe.db.count` as core `shortcut_widget.js` does + `get_counts` tiles; cap 5; skeleton/0/"—" states; click → `frappe.set_route("List", doctype, filters)`), quick links (remaining shortcuts), first chart via `frappe.widget.make_widget({widget_type:"chart",…})`, link index (cards as columns; reuse core `links_widget` dependency logic for greyed links + popover). Page menu: "Edit workspace" (System Manager) and "Reset Customizations" (`frappe.desk.desktop.reset_customization`).
- [ ] **Step 3: Browser check:** Playwright on `/app/home`, `/app/selling`, `/app/accounting`, `/app/stock`, `/app/assets` (onboarding), `/app/selling-julia@itec.co.ao` is NOT a route — instead log in as `julia@itec.co.ao` (server-side sid) and open `/app/selling` to confirm her copy renders. Expected: counts match `get_counts` / list counts for ITEC LDA; greyed links show the popover.
- [ ] **Step 4:** `impeccable detect --json` on the changed files → fix mechanical findings.
- [ ] **Step 5:** Commit `feat: module pages with waiting counts, quick links and link index`.

---

### Task 8: Language, theme and full sweep

**Files:**
- Create: `isoft_desk/translations/pt.csv`
- Create: `isoft_desk/tests/browser_sweep.py` (Playwright; run with `env/bin/python -I`)

- [ ] **Step 1:** Add pt translations for every new string (group labels, tile labels, buttons, menu items, empty/failed states).
- [ ] **Step 2:** `browser_sweep.py` captures, for Administrator with `language=pt` and with `en`, light and dark (`desk_theme`), at 1366×768, 1440×900 and 390×844: Home, Selling, Accounting, Stock, Sales Invoice list, a Sales Invoice form, Invenza, POS. Saves to `apps/isoft_desk/.impeccable/review/` (`desktop.png`, `mobile.png` plus per-route files).
- [ ] **Step 3:** Review Focus #5: check Portuguese labels wrap within two lines and never overlap counts in every capture; fix.
- [ ] **Step 4: Switch-off check:** set `enabled=0`, reload as Administrator → today's desk (watermark, core workspace sidebar) returns; set `enabled=1`. Restore Administrator's language/theme.
- [ ] **Step 5:** Commit `feat: Portuguese labels, dark theme pass and browser sweep`.

---

### Task 9: Finish review and DESIGN.md

- [ ] **Step 1:** Spawn `impeccable-finish-reviewer` fresh with: the user's request, confirmed answers (PRODUCT.md), artifact paths, screenshots from Task 8, the direction contract (surface brief), detector findings, craft-floor path; no approved comp (code-led; `.impeccable/mocks/decision/canon.png` rides as critique reference).
- [ ] **Step 2:** Act on the disposition (fix batch → recapture → verdict pass; max two rounds).
- [ ] **Step 3:** Spawn `impeccable-documenter` with project root `apps/isoft_desk`, PRODUCT.md, the contract, and `reference/document.md` → `DESIGN.md` and `.impeccable/design.json`.
- [ ] **Step 4:** Commit `docs: DESIGN.md from the shipped desk`.
