"""Login page theme: light or dark from the last desk session in this browser.

The desk saves the user's theme in localStorage["isoft_theme"] on every load and
theme switch (public/js/isd_theme_memory.js). The login page knows no user, so
an inline script in <head> reads that value before the first paint (no flash)
and falls back to the operating system preference. isd_login.css styles the
light variant from the data-isd-login attribute it sets.
"""
from isoft_desk.activation import get_settings

EARLY_SCRIPT = """<script>(function () {
	var theme = null;
	try { theme = localStorage.getItem("isoft_theme"); } catch (e) {}
	if (theme !== "light" && theme !== "dark") {
		theme = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
	}
	document.documentElement.setAttribute("data-isd-login", theme);
})();</script>"""


def update_website_context(context):
	# match the template, not the URL: logout goes to "/", which renders the
	# login page when it is the website home page
	if context.get("template") != "www/login.html" or not get_settings().get("enabled"):
		return None
	return {"head_html": (context.get("head_html") or "") + EARLY_SCRIPT}
