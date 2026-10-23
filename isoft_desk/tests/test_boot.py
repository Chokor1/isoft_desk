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
		self.assertNotIn("isoft-invenza", routes)

	def test_inactive_gets_only_flag(self):
		original = boot.get_settings
		boot.get_settings = lambda: {"enabled": 1, "rollout": "Pilot", "pilot_users": [], "pilot_roles": []}
		try:
			bootinfo = frappe._dict()
			boot.boot_session(bootinfo)
		finally:
			boot.get_settings = original
		self.assertEqual(bootinfo.isoft_desk, {"active": False})


class TestBootCounts(unittest.TestCase):
	def test_count_workspaces_listed(self):
		original = boot.get_settings
		boot.get_settings = lambda: {"enabled": 1, "rollout": "Everyone", "pilot_users": [], "pilot_roles": []}
		try:
			frappe.set_user("Administrator")
			bootinfo = frappe._dict(page_info={})
			boot.boot_session(bootinfo)
		finally:
			boot.get_settings = original
		self.assertIn("Accounting", bootinfo.isoft_desk["count_workspaces"])


class TestBootSafetyNet(unittest.TestCase):
	def test_unexpected_error_keeps_the_desk_loading(self):
		original = boot.get_settings

		def broken():
			raise RuntimeError("settings table missing")

		boot.get_settings = broken
		logged = []
		original_log = frappe.log_error
		frappe.log_error = lambda *a, **k: logged.append(a)
		try:
			bootinfo = frappe._dict()
			boot.boot_session(bootinfo)
		finally:
			boot.get_settings = original
			frappe.log_error = original_log
		self.assertEqual(bootinfo.isoft_desk, {"active": False})
		self.assertTrue(logged)
