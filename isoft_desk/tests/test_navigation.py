import unittest

from isoft_desk.navigation import build_groups


def ws(name, category="Modules", icon="folder-normal"):
	return {"name": name, "category": category, "icon": icon}


def keys(groups):
	return [g["key"] for g in groups]


class TestNavigation(unittest.TestCase):
	def test_mapped_and_ordered(self):
		groups = build_groups([ws("Selling"), ws("Accounting"), ws("Home")])
		self.assertEqual(keys(groups), ["home", "finance", "sales"])

	def test_fallback_by_category(self):
		groups = build_groups([ws("Frisko"), ws("X Admin", "Administration")])
		by_key = {g["key"]: [i["name"] for i in g["items"]] for g in groups}
		self.assertEqual(by_key["more"], ["Frisko"])
		self.assertEqual(by_key["settings"], ["X Admin"])

	def test_empty_groups_dropped(self):
		groups = build_groups([ws("Stock")])
		self.assertEqual(keys(groups), ["stock"])

	def test_isoft_pages_are_not_listed(self):
		# the user reaches Isoft app pages from the ISOFT applications launcher
		groups = build_groups([ws("Stock")])
		self.assertEqual([i["type"] for g in groups for i in g["items"]], ["workspace"])

	def test_route_slug_with_spaces(self):
		groups = build_groups([ws("Isoft Angola Tax Compliance")])
		item = groups[0]["items"][0]
		self.assertEqual(groups[0]["key"], "finance")
		self.assertEqual(item["route"], "isoft-angola-tax-compliance")
		self.assertEqual(item["type"], "workspace")

	def test_items_follow_mapping_order(self):
		groups = build_groups([ws("CRM"), ws("Selling")])
		self.assertEqual([i["name"] for i in groups[0]["items"]], ["Selling", "CRM"])

	def test_own_sidebar_pages_hide_the_desk_sidebar(self):
		from isoft_desk.navigation import HIDDEN_ROUTES

		self.assertIn("isoft-invenza", HIDDEN_ROUTES)
		self.assertIn("posapp", HIDDEN_ROUTES)

	def test_forms_collapse_the_sidebar(self):
		from isoft_desk.navigation import RAIL_ROUTES

		self.assertIn("Form", RAIL_ROUTES)
