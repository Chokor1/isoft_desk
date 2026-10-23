import unittest

import frappe

from isoft_desk import counts
from isoft_desk.api import get_counts


class TestCounts(unittest.TestCase):
	def setUp(self):
		frappe.set_user("Administrator")
		self._defaults = counts.DEFAULT_COUNTS

	def tearDown(self):
		counts.DEFAULT_COUNTS = self._defaults

	def use(self, *definitions):
		counts.DEFAULT_COUNTS = [dict(d, workspace="Probe") for d in definitions]

	def test_missing_doctype_skipped(self):
		self.use(
			{"doctype": "No Such Doctype", "filters": [], "label": "x"},
			{"doctype": "Sales Invoice", "filters": [["docstatus", "=", 0]], "label": "Drafts"},
		)
		rows = get_counts("Probe")
		self.assertEqual([r["doctype"] for r in rows], ["Sales Invoice"])

	def test_missing_field_skipped(self):
		self.use({"doctype": "Sales Invoice", "filters": [["no_such_field", "=", 1]], "label": "x"})
		self.assertEqual(get_counts("Probe"), [])

	def test_company_filter_added(self):
		self.use(
			{"doctype": "Sales Invoice", "filters": [["docstatus", "=", 1]], "label": "a"},
			{"doctype": "Asset Maintenance Log", "filters": [["maintenance_status", "=", "Planned"]], "label": "b"},
		)
		rows = {r["doctype"]: r for r in get_counts("Probe", "ITEC LDA")}
		self.assertIn(["company", "=", "ITEC LDA"], rows["Sales Invoice"]["filters"])
		self.assertNotIn(["company", "=", "ITEC LDA"], rows["Asset Maintenance Log"]["filters"])

	def test_dedupe_against_shortcuts(self):
		doctypes = [d["doctype"] for d in counts.definitions_for("Selling", ["Quotation"])]
		self.assertNotIn("Quotation", doctypes)
		self.assertIn("Delivery Note", doctypes)

	def test_counts_are_ints(self):
		rows = get_counts("Accounting", "ITEC LDA")
		self.assertTrue(rows)
		for row in rows:
			self.assertIsInstance(row["count"], int)
			self.assertGreaterEqual(row["count"], 0)

	def test_overdue_and_rejected_carry_the_bad_tone(self):
		rows = {r["label"]: r for r in get_counts("Accounting", "ITEC LDA")}
		self.assertEqual(rows["Overdue invoices"]["tone"], "bad")
		self.assertEqual(rows["Rejected by AGT"]["tone"], "bad")
		self.assertIsNone(rows["Draft journal entries"]["tone"])
