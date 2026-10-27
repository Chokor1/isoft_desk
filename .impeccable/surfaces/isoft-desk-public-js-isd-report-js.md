---
version: 1
slug: "isoft-desk-public-js-isd-report-js"
primary_target: "isoft_desk/public/js/isd_report.js"
related_targets: ["isoft_desk/public/css/isd_report.css"]
---

Scope: ISOFT Desk phase 4, every query and script report (/app/query-report/<name>), ERPNext's and the Isoft apps'. Visitor mode: Operate.

Audience and job: finance, sales and stock users on 1366x768 laptops (pt/en) who set a few filters, read a table of figures, and export or print it.

Rule (carried from forms): each report owns its filters (which, order, defaults, mandatory, depends_on, on_change). The desk only labels, folds and reads them; it never adds, removes, reorders or resizes one. Charts keep the report's own colours and type.

Decisions (2026-10-27): filters labelled and folded to value chips after the first run with data (Edit filters / Hide filters; a report with no data or a background report keeps them open); report-to-report links stay as header buttons, Set Chart / Create Card / Add Chart to Dashboard live in the menu only (core already lists them there); all query and script reports in scope.

## Direction contract

THESIS: The figures first: filters say what they are and step aside once the report has run, so the table starts under one line of value chips; refuses rows of unlabelled grey boxes pushing the table 360px down and a header crowded with tools.
OWN-WORLD: ISOFT Desk tokens: white card on the cool ground, 1px rules, Blue Tint chips with text-accent ink (as list filters), 12/500 Ink Muted filter labels over white inputs with a Rule Strong border and Logo Blue Bright focus, Inter tabular figures, the Report view grid rules shared (36px rows, real filter-row inputs, figures right-aligned), totals row on a Rule Strong line at 600.
STORY: The user sees which company, period and options the figures are for, changes one in a click, and reads the table without scrolling past the filters.
FIRST VIEWPORT: Core page head (title, report links, refresh, menu); the value chips (Company: ITEC LDA, From Date, To Date...) with Edit filters, wrapping to a second line when a report has many filters, as list chips do (every value stays visible); the report's summary and chart if it has them; the grid.
FORM: Labelled filters folding to chips: decided in the answer round as an extension of the list chip grammar inside the established world; seed: none (answer-round extension, no roll)
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
