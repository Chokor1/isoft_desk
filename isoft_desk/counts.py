"""Default "waiting" tiles for module pages that define no counts of their own.

Labels are translated at request time. Definitions whose DocType or fields do
not exist on a site are skipped, so client sites without an app still work.
"""
from frappe.model import default_fields

MAX_TILES = 5

# a definition may set "tone": "bad" for states that need action (overdue,
# rejected); the tile shows its count in the state colour when it is above 0

DEFAULT_COUNTS = [
	{"workspace": "Home", "doctype": "Sales Order", "filters": [["status", "in", ["To Deliver and Bill", "To Deliver"]]], "label": "To deliver"},
	{"workspace": "Home", "doctype": "Sales Invoice", "filters": [["status", "=", "Overdue"]], "label": "Overdue invoices", "tone": "bad"},
	{"workspace": "Home", "doctype": "Purchase Order", "filters": [["status", "in", ["To Receive and Bill", "To Receive"]]], "label": "To receive"},
	{"workspace": "Home", "doctype": "Material Request", "filters": [["docstatus", "=", 1], ["status", "=", "Pending"]], "label": "Material requests pending"},

	{"workspace": "Accounting", "doctype": "Sales Invoice", "filters": [["status", "=", "Overdue"]], "label": "Overdue invoices", "tone": "bad"},
	{"workspace": "Accounting", "doctype": "Sales Invoice", "filters": [["docstatus", "=", 1], ["outstanding_amount", ">", 0]], "label": "Unpaid sales invoices"},
	{"workspace": "Accounting", "doctype": "Purchase Invoice", "filters": [["docstatus", "=", 1], ["outstanding_amount", ">", 0]], "label": "Unpaid purchase invoices"},
	{"workspace": "Accounting", "doctype": "Journal Entry", "filters": [["docstatus", "=", 0]], "label": "Draft journal entries"},
	{"workspace": "Accounting", "doctype": "Sales Invoice", "filters": [["docstatus", "=", 1], ["fe_angola_document_status", "=", "I"]], "label": "Rejected by AGT", "tone": "bad"},

	{"workspace": "Selling", "doctype": "Quotation", "filters": [["status", "=", "Open"]], "label": "Open quotations"},
	{"workspace": "Selling", "doctype": "Delivery Note", "filters": [["status", "=", "To Bill"]], "label": "Delivered, not billed"},

	{"workspace": "Buying", "doctype": "Purchase Receipt", "filters": [["status", "=", "To Bill"]], "label": "Received, not billed"},
	{"workspace": "Buying", "doctype": "Supplier Quotation", "filters": [["docstatus", "=", 0]], "label": "Draft supplier quotations"},

	{"workspace": "Stock", "doctype": "Delivery Note", "filters": [["docstatus", "=", 0]], "label": "Draft deliveries"},
	{"workspace": "Stock", "doctype": "Stock Entry", "filters": [["docstatus", "=", 0]], "label": "Draft stock entries"},

	{"workspace": "CRM", "doctype": "Lead", "filters": [["status", "=", "Open"]], "label": "Open leads"},
	{"workspace": "CRM", "doctype": "Opportunity", "filters": [["status", "=", "Open"]], "label": "Open opportunities"},

	{"workspace": "Assets", "doctype": "Asset", "filters": [["docstatus", "=", 0]], "label": "Draft assets"},
	{"workspace": "Assets", "doctype": "Asset Maintenance Log", "filters": [["maintenance_status", "=", "Planned"]], "label": "Maintenance due"},

	{"workspace": "HR", "doctype": "Leave Application", "filters": [["status", "=", "Open"]], "label": "Open leave applications"},
	{"workspace": "Payroll", "doctype": "Isoft Salary Slip", "filters": [["docstatus", "=", 0]], "label": "Draft salary slips"},
]


def definitions_for(workspace, shortcut_doctypes):
	return [
		d for d in DEFAULT_COUNTS
		if d["workspace"] == workspace and d["doctype"] not in shortcut_doctypes
	]


def workspaces_with_counts():
	return sorted({d["workspace"] for d in DEFAULT_COUNTS})


def is_usable(meta, filters):
	return all(f[0] in default_fields or meta.get_field(f[0]) for f in filters)
