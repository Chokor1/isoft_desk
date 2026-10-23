import unittest

from isoft_desk.navigation import build_groups


def ws(name, category="Modules", icon="folder-normal"):
	return {"name": name, "category": category, "icon": icon}


def keys(groups):
	return [g["key"] for g in groups]


class TestNavigation(unittest.TestCase):
	def test_mapped_and_ordered(self):
		groups = build_groups([ws("Selling"), ws("Accounting"), ws("Home")], [], {})
		self.assertEqual(keys(groups), ["home", "finance", "sales"])

	def test_fallback_by_category(self):
		groups = build_groups([ws("Frisko"), ws("X Admin", "Administration")], [], {})
		by_key = {g["key"]: [i["name"] for i in g["items"]] for g in groups}
		self.assertEqual(by_key["more"], ["Frisko"])
		self.assertEqual(by_key["settings"], ["X Admin"])

	def test_empty_groups_dropped(self):
		groups = build_groups([ws("Stock")], [], {})
		self.assertEqual(keys(groups), ["stock"])

	def test_pages_added_only_when_allowed(self):
		groups = build_groups([ws("Stock")], ["isoft-invenza"], {"isoft-invenza": "Invenza"})
		items = groups[0]["items"]
		page = [i for i in items if i["type"] == "page"]
		self.assertEqual(len(page), 1)
		self.assertEqual(page[0]["route"], "isoft-invenza")
		self.assertEqual(page[0]["label"], "Invenza")
		all_routes = [i["route"] for g in groups for i in g["items"]]
		self.assertNotIn("saft-center", all_routes)

	def test_route_slug_with_spaces(self):
		groups = build_groups([ws("Isoft Angola Tax Compliance")], [], {})
		item = groups[0]["items"][0]
		self.assertEqual(groups[0]["key"], "finance")
		self.assertEqual(item["route"], "isoft-angola-tax-compliance")
		self.assertEqual(item["type"], "workspace")
