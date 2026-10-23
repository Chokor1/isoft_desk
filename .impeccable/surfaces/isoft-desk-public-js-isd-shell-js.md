---
version: 1
slug: "isoft-desk-public-js-isd-shell-js"
primary_target: "isoft_desk/public/js/isd_shell.js"
related_targets: ["isoft_desk/public/js/isd_workspace.js"]
---

Scope: ISOFT Desk v1, the Frappe v13 desk shell (sidebar + top bar) and module pages (/app/<workspace>). Visitor mode: Operate.

Audience and job: accounting, sales/counter, stock and management users on small laptops (1366x768) who open a module to see what is waiting, create a document, or reach a list or report, then leave. Labels follow each user's language (pt/en).

Constraints: plain CSS/JS in app isoft_desk, everything under body.isd-on, no core edits, pilot rollout, Isoft app pages untouched, POS hidden, rail on Isoft pages with own sidebars.

## Direction contract

THESIS: The category standard played straight at Odoo 17 / Linear / Stripe Dashboard / ERPNext v15 polish; refuses the v13 desk's cyan-topped card grid, watermark and flat 20-item module list.
OWN-WORLD: Navy sidebar (#0F2236 family) with tinted light ink; cool off-white ground; white work surfaces separated by 1px tinted rules; ISOFT cyan-blue as the one accent (active item, primary action, focus, links); semantic green/amber/red only for state; Inter with tabular figures; 6px radii; no shadows except menus.
STORY: The user sees where they are (active group open, item highlighted), sees what is waiting in their company (counts that open the filtered list), and gets to any DocType or report in two clicks.
FIRST VIEWPORT: Left, 232px navy sidebar: logo, search, Favorites, groups, company + collapse in the foot. Right: slim top bar (breadcrumbs, Ctrl+G search, icons, user). Module page: title + company/month line left, up to 3 New buttons right; one row of up to 5 waiting tiles (count large, label below, whole tile clickable); quick links row; optional chart; 4-column link index with uppercase card headings and ruled rows.
FORM: Category standard (canon), chosen by the user over Sona/Kwanza/Wayfinding; position: canon card; seed:760cded26c3143f4.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
