---
version: 1
slug: "isoft-desk-public-js-isd-form-js"
primary_target: "isoft_desk/public/js/isd_form.js"
related_targets: ["isoft_desk/public/css/isd_form.css"]
---

Scope: ISOFT Desk phase 3, every Frappe v13 form (all DocTypes, Isoft apps' included) inside the desk shell. Visitor mode: Operate.

Audience and job: finance, sales and stock users on 1366x768 laptops (pt/en) who open a record to read its state and totals, edit a draft, and act on it.

Hard rule (user, 2026-10-26): the DocType and Customize Form own the structure: field order, sections, column breaks, collapsible sections, hidden/depends_on, read-only/mandatory, permissions and child-table column widths. Nothing here moves, hides, folds, regroups or resizes a field; it only reads the form and calls core's own methods (scroll_to_field, Section.collapse, the dashboard's badge links). Read-only values keep core's own look (muted text on core's disabled fill): the user asked for that after a restyle made them look editable.

Decisions (2026-10-26): Connections as one compact row on top (only links with records, "Show all connections" opens core's block; heatmap folded with it); a totals strip under the title on DocTypes with a Grand Total; section links built from the DocType's own labelled sections; labels stay above values; read-only values stay core's look.

## Direction contract

THESIS: The record's state first, its structure untouched: a strip of the numbers people check and a row of the form's own sections, over core's layout; refuses a Connections block filling the first screen and a 5,000px scroll with totals 3,700px down.
OWN-WORLD: ISOFT Desk tokens: white surfaces with 1px rules on the cool ground, 6px radii, Inter tabular figures, Blue Tint for the current section link, State Bad for an overdue outstanding and its days late; editable inputs white with a Rule Strong border and a Logo Blue Bright focus ring; read-only values core's.
STORY: The user sees what the document is worth, what is still owed and how late, jumps to any section in one click, and reaches linked documents from one row.
FIRST VIEWPORT: Core's sticky page head (title, status, actions); a row of linked-document chips with counts plus "Show all connections"; the totals strip (net, taxes, grand total, outstanding, due date + days late, lines), each cell scrolling to its field; the section links, sticky under the head as one white band; then core's sections.
FORM: Totals strip and section links over core's layout: card C's composition (option 2) with the user's constraint applied; seed:2ed1d0eae40b8e84.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
