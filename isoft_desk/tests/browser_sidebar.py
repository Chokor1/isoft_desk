"""Browser check: the sidebar is drawn on every kind of desk address.

    cd ~/frappe-bench && env/bin/python -I apps/isoft_desk/isoft_desk/tests/browser_sidebar.py dev.isoft.ao

Exits 1 when the sidebar list is empty on a route (the bare /app address once
skipped the first draw), or when /app does not highlight the workspace it shows.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from browser_sweep import login  # noqa: E402

ROUTES = ["/app", "/app/home", "/app/sales-invoice", "/app/sales-invoice/new"]
STATE = """(() => ({
	groups: document.querySelectorAll('.isd-scroll .isd-group').length,
	active: [...document.querySelectorAll('.isd-scroll .is-active')].map(e => e.textContent.trim()).join(','),
}))()"""


def main(site):
	os.chdir(os.path.expanduser("~/frappe-bench/sites"))
	import frappe
	from playwright.sync_api import sync_playwright

	frappe.init(site=site)
	frappe.connect()
	sid = login(site, "Administrator")
	frappe.destroy()

	failures = []
	with sync_playwright() as p:
		browser = p.chromium.launch(args=[f"--host-resolver-rules=MAP {site} 127.0.0.1"])
		context = browser.new_context(ignore_https_errors=True, viewport={"width": 1440, "height": 900})
		context.add_cookies([{"name": "sid", "value": sid, "domain": site, "path": "/"}])
		page = context.new_page()
		for route in ROUTES:
			page.goto(f"https://{site}{route}", wait_until="networkidle", timeout=90000)
			page.wait_for_timeout(2000)
			state = page.evaluate(STATE)
			print(route, state)
			if not state["groups"]:
				failures.append(f"{route}: sidebar is empty")
			if route == "/app" and not state["active"]:
				failures.append("/app: the workspace it shows is not highlighted")
		browser.close()

	for failure in failures:
		print("FAIL", failure)
	print("OK" if not failures else "FAILED")
	sys.exit(1 if failures else 0)


if __name__ == "__main__":
	main(sys.argv[1])
