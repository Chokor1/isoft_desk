---
version: 1
slug: "isoft-desk-public-js-isd-list-js"
primary_target: "isoft_desk/public/js/isd_list.js"
related_targets: ["isoft_desk/public/css/isd_list.css"]
---

Scope: ISOFT Desk phase 2, the Frappe v13 List view and Report view of every DocType, inside the desk shell. Visitor mode: Operate.

Audience and job: finance, sales and stock users on 1366x768 laptops (pt/en) who open a list to find records, read their state and amounts, and open one. Today's lists lose that to 2-3 rows of filter boxes, a 190px Filter By column, 46px rows and cut amounts.

Constraints: plain CSS/JS in app isoft_desk under body.isd-on; built from core's own filter controls (moved, never copied) so filtering, saving, bulk actions, sorting, paging and permissions behave as core; Kanban, Image, Tree, Calendar untouched; rollout to every user.

Decisions (2026-10-26): scope List + Report; Filter By column hidden by default, the sidebar toggle still opens it (own localStorage key isd_list_sidebar); rows drop the like heart and comment count, keep the modified time.

## Direction contract

THESIS: One toolbar line and a full-height table: filters become visible, removable chips instead of rows of grey boxes; refuses core's wrapping filter-field grid, the always-open Filter By column and full-colour status pills.
OWN-WORLD: ISOFT Desk tokens unchanged: white surface on the cool ground, 1px rules, Logo Blue fill/line/text split, Blue Tint chips with text-accent ink, Inter tabular figures, 6px radii, menu shadow only on the filter panel; status as a 7px dot plus its word in the state colour.
STORY: The user reads every active filter at a glance, removes one with a click, adds one from the panel, and scans 12+ rows whose amounts are never cut.
FIRST VIEWPORT: Page header unchanged. Card: toolbar (search on the list's title field, chips, "+ Add filter", sort right); sticky 34px header; 36px rows; right-aligned figures in fixed 8.75rem columns; title column with the largest share; paging footer.
FORM: Filter chips, card B of the surface roll (option 1; dealt structure 5 of my ranked list); seed:4061fe41e5e49bfa.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
