import json

import frappe
from frappe import _

from isoft_desk import counts


@frappe.whitelist()
def get_counts(workspace, company=None, exclude=None):
	"""Counts for the app's default tiles of one workspace, permission-filtered."""
	if isinstance(exclude, str):
		exclude = json.loads(exclude)

	rows = []
	for definition in counts.definitions_for(workspace, exclude or []):
		doctype = definition["doctype"]
		if not frappe.db.exists("DocType", doctype):
			continue
		meta = frappe.get_meta(doctype)
		if not counts.is_usable(meta, definition["filters"]):
			continue

		filters = [list(f) for f in definition["filters"]]
		if company and meta.get_field("company"):
			filters.append(["company", "=", company])

		try:
			result = frappe.get_list(doctype, filters=filters, fields=["count(name) as n"])
			count = int(result[0].n) if result else 0
		except frappe.PermissionError:
			continue
		except Exception:
			count = None

		rows.append({"doctype": doctype, "label": _(definition["label"], context="ISOFT Desk"), "count": count, "filters": filters})
		if len(rows) == counts.MAX_TILES:
			break
	return rows
