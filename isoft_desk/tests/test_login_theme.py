import unittest

import frappe

from isoft_desk import login_theme


def settings(enabled):
	return {"enabled": enabled, "rollout": "Pilot", "pilot_users": [], "pilot_roles": []}


class TestLoginTheme(unittest.TestCase):
	def run_hook(self, path, enabled, head_html=None, template=None):
		original = login_theme.get_settings
		login_theme.get_settings = lambda: settings(enabled)
		try:
			if template is None:
				template = "www/login.html" if path == "login" else "www/%s.html" % path
			context = frappe._dict(path=path, head_html=head_html, template=template)
			return login_theme.update_website_context(context)
		finally:
			login_theme.get_settings = original

	def test_login_gets_the_early_theme_script(self):
		values = self.run_hook("login", 1, "<meta name=keep>")
		self.assertIn("<meta name=keep>", values["head_html"])
		self.assertIn("data-isd-login", values["head_html"])
		self.assertIn("isoft_theme", values["head_html"])

	def test_site_root_serving_the_login_page(self):
		# logout redirects to "/", which renders login when it is the home page
		values = self.run_hook("", 1, template="www/login.html")
		self.assertIn("data-isd-login", values["head_html"])

	def test_switched_off_leaves_login_alone(self):
		self.assertIsNone(self.run_hook("login", 0))

	def test_other_website_pages_untouched(self):
		self.assertIsNone(self.run_hook("about", 1))
