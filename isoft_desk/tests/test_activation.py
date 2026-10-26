import unittest

from isoft_desk.activation import is_active_for


def settings(**kw):
	base = {"enabled": 1, "rollout": "Pilot", "pilot_users": [], "pilot_roles": []}
	base.update(kw)
	return base


class TestActivation(unittest.TestCase):
	def test_disabled_is_inactive(self):
		self.assertFalse(is_active_for("a@x.ao", [], settings(enabled=0, rollout="Everyone")))

	def test_pilot_empty_is_inactive(self):
		self.assertFalse(is_active_for("a@x.ao", ["System Manager"], settings()))

	def test_pilot_user(self):
		s = settings(pilot_users=["a@x.ao"])
		self.assertTrue(is_active_for("a@x.ao", [], s))
		self.assertFalse(is_active_for("b@x.ao", [], s))

	def test_pilot_role(self):
		s = settings(pilot_roles=["Accounts User"])
		self.assertTrue(is_active_for("b@x.ao", ["Accounts User"], s))
		self.assertFalse(is_active_for("b@x.ao", ["Stock User"], s))

	def test_everyone(self):
		self.assertTrue(is_active_for("a@x.ao", [], settings(rollout="Everyone")))

	def test_guest_never(self):
		self.assertFalse(is_active_for("Guest", ["Guest"], settings(rollout="Everyone")))


class TestSettingsSave(unittest.TestCase):
	def test_new_sites_default_to_everyone(self):
		import frappe

		self.assertEqual(frappe.get_meta("Isoft Desk Settings").get_field("rollout").default, "Everyone")

	def test_save_clears_boot_cache(self):
		import frappe

		frappe.cache().hset("bootinfo", "isoft-desk-probe", {"x": 1})
		frappe.get_doc("Isoft Desk Settings").save(ignore_permissions=True)
		self.assertIsNone(frappe.cache().hget("bootinfo", "isoft-desk-probe"))
