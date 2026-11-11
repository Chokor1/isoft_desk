"""Browser check: switching modules never paints the old v13 desk.

    cd ~/frappe-bench && env/bin/python -I apps/isoft_desk/isoft_desk/tests/browser_module_switch.py dev.isoft.ao [user] [--shots DIR]

Each module page loads its data on the first visit. The page's data call is
held back 1.5 s in the browser so the loading state stays on screen long enough
to be seen; every animation frame records any element of core's old workspace
look. Exits 1 when one ever shows, or a module page never finishes loading.
Read-only: it only opens pages.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from browser_sweep import login  # noqa: E402

# core's v13 workspace skeleton and widget cards, outside the desk's own chart/onboarding slots
OLD = ".workspace-skeleton, .skeleton-card, .desk-page, .layout-side-section .desk-sidebar"

WATCH = """(sel) => {
	window.__old = [];
	const rec = () => {
		document.querySelectorAll(sel).forEach(e => {
			if (e.offsetParent && e.getBoundingClientRect().width > 0)
				window.__old.push([location.pathname, String(e.className).slice(0, 60)]);
		});
		requestAnimationFrame(rec);
	};
	rec();
	// hold each module's data back so its loading state is on screen for a while
	const xcall = frappe.xcall;
	frappe.xcall = function (method, ...rest) {
		const call = () => xcall.call(this, method, ...rest);
		return method === "frappe.desk.desktop.get_desktop_page"
			? new Promise(r => setTimeout(r, 1500)).then(call) : call();
	};
}"""


def main(site, user="Administrator", shots=None):
	os.chdir(os.path.expanduser("~/frappe-bench/sites"))
	import frappe
	from playwright.sync_api import sync_playwright

	frappe.init(site=site)
	frappe.connect()
	sid = login(site, user)
	frappe.destroy()

	failures = []

	def check(cond, msg):
		if not cond:
			failures.append(msg)
			print("FAIL", msg)

	with sync_playwright() as p:
		browser = p.chromium.launch(args=[f"--host-resolver-rules=MAP {site} 127.0.0.1"])
		for theme in ["light", "dark"]:
			context = browser.new_context(ignore_https_errors=True, viewport={"width": 1366, "height": 768})
			context.add_cookies([{"name": "sid", "value": sid, "domain": site, "path": "/"}])
			page = context.new_page()
			page.goto(f"https://{site}/app/home", wait_until="networkidle", timeout=90000)
			page.evaluate(f"document.documentElement.setAttribute('data-theme','{theme}')")
			page.wait_for_timeout(1500)
			routes = page.evaluate("""[...new Set([...document.querySelectorAll('.isd-scroll a[href^="/app/"]')]
				.map(a => a.getAttribute('href')).filter(h => h !== '/app/home' && h.split('/').length === 3))]""")[:5]
			check(len(routes) >= 2, f"{theme}: too few module links in the sidebar {routes}")
			page.evaluate(WATCH, OLD)
			for i, route in enumerate(routes):
				page.evaluate("r => frappe.set_route(r.slice(5))", route)
				page.wait_for_timeout(500)
				loading = page.evaluate("!!document.querySelector('.isd-ws:not([style*=\"none\"]) .isd-ws-skeleton')")
				if shots and i == 0:
					page.screenshot(path=os.path.join(shots, f"module-loading-{theme}.png"))
				page.wait_for_timeout(2000)
				done = page.evaluate("!!document.querySelector('.isd-ws:not([style*=\"none\"]) .isd-index .isd-card, .isd-ws:not([style*=\"none\"]) .isd-waiting .isd-tile:not(.isd-tile-skel)')")
				print(theme, route, "loading shown:", loading, "rendered:", done)
				check(done, f"{theme} {route}: module page never rendered")
			old = page.evaluate("window.__old")
			check(not old, f"{theme}: old desk painted during switches {sorted(set(map(tuple, old)))[:5]}")
			context.close()
		browser.close()

	print("OK" if not failures else "FAILED")
	sys.exit(1 if failures else 0)


if __name__ == "__main__":
	args = sys.argv[1:]
	shots = None
	if "--shots" in args:
		i = args.index("--shots")
		shots = args[i + 1]
		del args[i:i + 2]
	main(*args[:2], shots=shots)
