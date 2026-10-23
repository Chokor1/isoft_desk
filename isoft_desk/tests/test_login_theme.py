import unittest

import frappe

from isoft_desk import login_theme


def settings(enabled):
	return {"enabled": enabled, "rollout": "Pilot", "pilot_users": [], "pilot_roles": []}


class TestLoginTheme(unittest.TestCase):
	def run_hook(self, path, enabled, head_html=None):
		original = login_theme.get_settings
		login_theme.get_settings = lambda: settings(enabled)
		try:
			context = frappe._dict(path=path, head_html=head_html)
			return login_theme.update_website_context(context)
		finally:
			login_theme.get_settings = original

	def test_login_gets_the_early_theme_script(self):
		values = self.run_hook("login", 1, "<meta name=keep>")
		self.assertIn("<meta name=keep>", values["head_html"])
		self.assertIn("data-isd-login", values["head_html"])
		self.assertIn("isoft_theme", values["head_html"])

	def test_switched_off_leaves_login_alone(self):
		self.assertIsNone(self.run_hook("login", 0))

	def test_other_website_pages_untouched(self):
		self.assertIsNone(self.run_hook("about", 1))
