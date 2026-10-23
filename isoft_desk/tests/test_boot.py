import unittest

import frappe

from isoft_desk import boot


class TestBoot(unittest.TestCase):
	def test_active_admin_gets_groups(self):
		original = boot.get_settings
		boot.get_settings = lambda: {"enabled": 1, "rollout": "Everyone", "pilot_users": [], "pilot_roles": []}
		try:
			frappe.set_user("Administrator")
			bootinfo = frappe._dict(page_info={"isoft-invenza": {"title": "Invenza"}})
			boot.boot_session(bootinfo)
		finally:
			boot.get_settings = original
		payload = bootinfo.isoft_desk
		self.assertTrue(payload["active"])
		self.assertIn("posapp", payload["hidden_routes"])
		routes = [i["route"] for g in payload["groups"] for i in g["items"]]
		self.assertIn("selling", routes)
		self.assertIn("isoft-invenza", routes)

	def test_inactive_gets_only_flag(self):
		original = boot.get_settings
		boot.get_settings = lambda: {"enabled": 1, "rollout": "Pilot", "pilot_users": [], "pilot_roles": []}
		try:
			bootinfo = frappe._dict()
			boot.boot_session(bootinfo)
		finally:
			boot.get_settings = original
		self.assertEqual(bootinfo.isoft_desk, {"active": False})
