"""Browser check: the List and Report views' toolbar, chips and table.

    cd ~/frappe-bench && env/bin/python -I apps/isoft_desk/isoft_desk/tests/browser_list.py dev.isoft.ao [user] [--shots DIR]

Core remembers each list's last filters in the user's settings, so the check
snapshots those settings first and puts them back when it ends. Exits 1 when
an expectation breaks.
"""
import os
import re
import sys

sys.path.insert(0, os.path.dirname(__file__))
from browser_sweep import login  # noqa: E402

DOCTYPES = ["Sales Invoice", "Item"]
STATE = """(() => {
	const l = cur_list, bar = l.isd_bar;
	const cut = [...document.querySelectorAll('.isd-list .result .list-row-col.text-right .ellipsis')]
		.filter(e => e.offsetParent && e.scrollWidth > e.clientWidth + 1).length;
	return {
		view: l.view_name,
		bar: !!document.querySelector('.isd-list:not([style*="display: none"]) .isd-lbar') && !!bar,
		search: bar ? bar.search_field : null,
		chips: [...document.querySelectorAll('.page-container:not([style*="display: none"]) .isd-chip-text')]
			.filter(e => e.offsetParent).map(e => e.textContent),
		filters: l.filter_area.get().length,
		sidebar_hidden: document.body.classList.contains('no-list-sidebar'),
		standard_in_panel: !!document.querySelector('.isd-lpanel .standard-filter-section'),
		cut_amounts: cut,
		row_h: (document.querySelector('.isd-list .result .list-row') || {}).offsetHeight || null,
		gap_below: (() => { const c = document.querySelector('.page-container:not([style*="display: none"]) .isd-list .layout-main-section, .isd-list .layout-main-section');
			return c ? Math.round(innerHeight - c.getBoundingClientRect().bottom) : null; })(),
		bar_h: [...document.querySelectorAll('.isd-lbar')].filter(e => e.offsetParent).map(e => e.offsetHeight)[0] || null,
		misaligned: (() => {
			const pos = el => el ? [...el.querySelectorAll(':scope > .level-left > .list-row-col:not(.hide)')]
				.map(c => c.getBoundingClientRect().left) : [];
			const head = pos(document.querySelector('.isd-list .list-row-head'));
			const row = pos(document.querySelector('.isd-list .result .list-row'));
			return head.length ? Math.max(0, ...head.map((x, i) => Math.abs(x - (row[i] ?? x)))) : 0;
		})(),
	};
})()"""

# a dropdown counts as open only when it is the top element at its own position
# (a clipped or covered list is in the DOM but nobody can click it)
ON_TOP = """(sel) => {
	const el = [...document.querySelectorAll(sel)].find(e => !e.hidden && e.offsetParent !== null && e.getBoundingClientRect().height > 0);
	if (!el) return false;
	const r = el.getBoundingClientRect(), hit = document.elementFromPoint(r.left + Math.min(20, r.width / 2), r.top + Math.min(12, r.height / 2));
	return !!hit && el.contains(hit);
}"""


def main(site, user="Administrator", shots=None):
	os.chdir(os.path.expanduser("~/frappe-bench/sites"))
	import frappe

	frappe.init(site=site)
	frappe.connect()
	sid = login(site, user)
	saved = {dt: frappe.cache().hget("_user_settings", f"{dt}::{user}") for dt in DOCTYPES}
	frappe.destroy()
	try:
		failures = run(site, sid, shots)
	finally:
		frappe.init(site=site)
		frappe.connect()
		for dt, value in saved.items():
			if value is None:
				frappe.cache().hdel("_user_settings", f"{dt}::{user}")
			else:
				frappe.cache().hset("_user_settings", f"{dt}::{user}", value)
		frappe.destroy()

	print("OK" if not failures else "FAILED")
	sys.exit(1 if failures else 0)


def run(site, sid, shots):
	from playwright.sync_api import sync_playwright

	failures = []

	def check(cond, msg):
		if not cond:
			failures.append(msg)
			print("FAIL", msg)

	with sync_playwright() as p:
		browser = p.chromium.launch(args=[f"--host-resolver-rules=MAP {site} 127.0.0.1"])
		for theme, w, h in [("light", 1366, 768), ("dark", 1366, 768), ("light", 390, 844)]:
			context = browser.new_context(ignore_https_errors=True, viewport={"width": w, "height": h})
			context.add_cookies([{"name": "sid", "value": sid, "domain": site, "path": "/"}])
			page = context.new_page()
			errors = []
			page.on("pageerror", lambda e: errors.append(str(e)))
			tag = f"{theme}-{w}"
			for route in ["/app/sales-invoice", "/app/item", "/app/sales-invoice/view/report"]:
				page.goto(f"https://{site}{route}", wait_until="networkidle", timeout=90000)
				page.evaluate(f"document.documentElement.setAttribute('data-theme','{theme}')")
				page.wait_for_timeout(2000)
				s = page.evaluate(STATE)
				print(tag, route, s)
				check(s["bar"], f"{tag} {route}: no toolbar")
				check(s["standard_in_panel"], f"{tag} {route}: standard filters not in the panel")
				check(s["sidebar_hidden"], f"{tag} {route}: Filter By column is open")
				if w > 800 and "report" not in route:
					check(s["cut_amounts"] == 0, f"{tag} {route}: {s['cut_amounts']} amounts cut")
					check(s["row_h"] == 36, f"{tag} {route}: rows are {s['row_h']}px")
					check(s["bar_h"] and s["bar_h"] <= 32, f"{tag} {route}: toolbar wraps ({s['bar_h']}px)")
					check(s["gap_below"] is not None and s["gap_below"] <= 24, f"{tag} {route}: {s['gap_below']}px empty under the list")
					check(s["misaligned"] <= 2, f"{tag} {route}: header and row columns {s['misaligned']}px apart")
				if shots:
					name = route.strip("/").replace("/", "_")
					page.screenshot(path=os.path.join(shots, f"{name}-{tag}.png"))

			if w > 800 and theme == "light":
				# chips follow the filters, and × on a chip removes just that filter
				page.goto(f"https://{site}/app/sales-invoice", wait_until="networkidle", timeout=90000)
				page.wait_for_timeout(1500)
				before_chips = page.evaluate(STATE)["chips"]
				page.evaluate("cur_list.filter_area.add([[cur_list.doctype, 'status', '=', 'Overdue']])")
				page.wait_for_timeout(1500)
				s = page.evaluate(STATE)
				new = [c for c in s["chips"] if c not in before_chips]
				check(len(new) == 1, f"adding a filter added chips {new}")
				before = s["filters"]
				if new:
					page.locator(".isd-chip").filter(has=page.locator(".isd-chip-text", has_text=re.compile("^" + re.escape(new[0]) + "$"))).locator(".isd-chip-x").click()
					page.wait_for_timeout(1500)
					s = page.evaluate(STATE)
					check(s["filters"] == before - 1, f"removing a chip left {s['filters']} filters (was {before})")
					check(s["chips"] == before_chips, f"chips after removal {s['chips']} != {before_chips}")

				# the panel opens with the standard fields and closes on Escape
				page.click(".isd-add")
				page.wait_for_timeout(300)
				check(page.is_visible(".isd-lpanel .standard-filter-section"), "panel did not open")
				if shots:
					page.screenshot(path=os.path.join(shots, f"panel-{tag}.png"))
				# a Link filter in the panel shows its suggestions over the list
				link = page.locator(".isd-lpanel input[data-fieldname=customer]").first
				if link.count():
					link.click(); link.type("CON", delay=60); page.wait_for_timeout(1800)
					check(page.evaluate(ON_TOP, ".isd-lpanel [data-fieldname=customer] .awesomplete ul"), "customer filter suggestions not visible")
					link.fill(""); page.wait_for_timeout(300)
				page.keyboard.press("Escape")
				page.wait_for_timeout(200)
				check(not page.is_visible(".isd-lpanel"), "panel did not close on Escape")

				# core's filter button sits in the toolbar and opens its popover directly
				check(page.is_visible(".page-form .filter-button"), "filter button not visible")
				page.click(".page-form .filter-button")
				page.wait_for_timeout(800)
				check(page.is_visible(".filter-popover"), "advanced popover did not open")
				if shots:
					page.screenshot(path=os.path.join(shots, f"advanced-{tag}.png"))
				page.mouse.click(5, 300)
				page.wait_for_timeout(500)

			check(not errors, f"{tag}: page errors {errors[:3]}")
			context.close()
		browser.close()
	return failures


if __name__ == "__main__":
	args = sys.argv[1:]
	shots = None
	if "--shots" in args:
		i = args.index("--shots")
		shots = args[i + 1]
		del args[i:i + 2]
	main(*args[:2], shots=shots)
