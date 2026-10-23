"""Browser check: module-page header buttons belong to the page on screen.

    cd ~/frappe-bench && env/bin/python -I apps/isoft_desk/isoft_desk/tests/browser_header.py dev.isoft.ao

Exits 1 when (a) a slow first load of another workspace writes its "New" buttons
onto the workspace the user switched back to, or (b) reloading a page
(Reset Customizations) duplicates its buttons or menu entries.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from browser_sweep import login  # noqa: E402

BUTTONS = """[...document.querySelectorAll('.page-container[data-page-route="Workspaces"] .page-actions button')]
	.filter(b => b.offsetParent).map(b => b.textContent.trim()).filter(Boolean).join(' | ')"""
MENU = """[...document.querySelectorAll('.page-container[data-page-route="Workspaces"] .dropdown-menu .dropdown-item')]
	.map(a => a.textContent.trim()).filter(t => t.startsWith('New')).length"""
SLOW_ACCOUNTING = """(() => {
	const xcall = frappe.xcall;
	frappe.xcall = (method, args) => {
		const call = xcall(method, args);
		if (method === "frappe.desk.desktop.get_desktop_page" && args.page === "Accounting") {
			return new Promise(resolve => setTimeout(() => resolve(call), 2000));
		}
		return call;
	};
})()"""


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
		page.goto(f"https://{site}/app/selling", wait_until="networkidle")
		page.wait_for_timeout(2500)
		baseline, baseline_menu = page.evaluate(BUTTONS), page.evaluate(MENU)

		page.evaluate(SLOW_ACCOUNTING)
		page.evaluate('frappe.set_route("accounting")')
		page.wait_for_timeout(300)
		page.evaluate('frappe.set_route("selling")')
		page.wait_for_timeout(3500)
		after_race = page.evaluate(BUTTONS)
		if after_race != baseline:
			failures.append(f"race: expected [{baseline}] got [{after_race}]")

		page.evaluate('frappe.workspace.pages["Selling"].reload()')
		page.wait_for_timeout(2500)
		after_reload, after_reload_menu = page.evaluate(BUTTONS), page.evaluate(MENU)
		if after_reload != baseline or after_reload_menu != baseline_menu:
			failures.append(
				f"reload: expected [{baseline}] menu {baseline_menu}, got [{after_reload}] menu {after_reload_menu}"
			)
		browser.close()

	print("baseline:", baseline)
	for failure in failures:
		print("FAIL", failure)
	print("OK" if not failures else "FAILED")
	sys.exit(1 if failures else 0)


if __name__ == "__main__":
	main(sys.argv[1])
