"""Browser check: query and script reports keep their own filters, name them,
fold them to value chips after the first run and keep the header's tools in
the menu.

    cd ~/frappe-bench && env/bin/python -I apps/isoft_desk/isoft_desk/tests/browser_report.py dev.isoft.ao [user] [--shots DIR]

Reports are run read-only; one tab moves between reports, as people do, since
every query report shares a single page. Exits 1 when an expectation breaks.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from browser_sweep import login  # noqa: E402
from browser_list import ON_TOP  # noqa: E402

REPORTS = ["General Ledger", "Accounts Receivable", "Stock Balance", "Gross Profit", "Sales Analytics"]

STATE = """(() => {
	const qr = frappe.query_report, form = qr.page.page_form[0];
	const own = (qr.report_settings.filters || []).filter(df => df.fieldtype !== 'Break').map(df => df.fieldname);
	const dom = [...form.querySelectorAll('.frappe-control[data-fieldname]')].map(e => e.dataset.fieldname);
	const visible = el => el && !el.hidden && el.offsetParent !== null;
	return {
		report: qr.report_name,
		same_filters: JSON.stringify(own) === JSON.stringify(dom),
		unlabelled: qr.filters.filter(f => f.df.fieldtype !== 'Check' && !f.$wrapper.parent().hasClass('isd-rf-item')).map(f => f.df.fieldname),
		wrappers: form.querySelectorAll('.isd-rf-item').length,
		empty_wrappers: [...form.querySelectorAll('.isd-rf-item')].filter(e => !e.querySelector('.frappe-control')).length,
		folded: qr.page.wrapper.hasClass('isd-rf-folded'),
		form_shown: visible(form),
		chips: [...qr.page.wrapper.find('.isd-rf-chip')].filter(visible).map(e => e.textContent),
		rows: (qr.data || []).length,
		header_tools: [...qr.page.wrapper.find('.page-actions .btn')].filter(visible).map(e => e.textContent.trim()).filter(t => ['Set Chart', 'Create Card', 'Add Chart to Dashboard'].includes(t)),
		menu: [...qr.page.menu.find('.dropdown-item')].map(e => e.textContent.trim()),
		set_chart_in_menu: [...qr.page.menu.find('.dropdown-item')].some(e => e.textContent.trim() === __('Set Chart')),
		fold_rows: qr.page.wrapper.find('.isd-rfold').length,
		rail: document.body.classList.contains('isd-rail'),
	};
})()"""


def main(site, user="Administrator", shots=None):
	os.chdir(os.path.expanduser("~/frappe-bench/sites"))
	import frappe

	frappe.init(site=site)
	frappe.connect()
	sid = login(site, user)
	frappe.destroy()

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
			# only errors raised in ISOFT Desk code fail the check; others are listed
			# (ERPNext's Sales Analytics draws an empty line chart that frappe-charts
			# rejects with "yPositions" until rows are ticked)
			page.on("pageerror", lambda e: errors.append(str(e) + " @ " + (getattr(e, "stack", "") or "")))
			tag = f"{theme}-{w}"
			page.goto(f"https://{site}/app/query-report/{REPORTS[0]}", wait_until="networkidle", timeout=120000)
			for i, report in enumerate(REPORTS):
				if i:
					page.evaluate("r => frappe.set_route('query-report', r)", report)
				page.wait_for_timeout(4500)
				page.evaluate(f"document.documentElement.setAttribute('data-theme','{theme}')")
				s = page.evaluate(STATE)
				print(tag, s["report"], {k: v for k, v in s.items() if k not in ("menu",)})
				check(s["report"] == report, f"{tag}: expected {report}, got {s['report']}")
				check(s["same_filters"], f"{tag} {report}: filters differ from the report's own")
				check(not s["unlabelled"], f"{tag} {report}: unlabelled filters {s['unlabelled']}")
				check(not s["empty_wrappers"], f"{tag} {report}: {s['empty_wrappers']} empty label wrappers left behind")
				check(s["fold_rows"] == 1, f"{tag} {report}: {s['fold_rows']} fold rows")
				if w > 991:
					check(s["rail"], f"{tag} {report}: the sidebar did not collapse to its rail")
				check(not s["header_tools"], f"{tag} {report}: tools still in the header {s['header_tools']}")
				if s["rows"]:
					check(s["folded"] and not s["form_shown"] and s["chips"], f"{tag} {report}: filters did not fold to chips")
					check(s["set_chart_in_menu"], f"{tag} {report}: Set Chart missing from the menu")
				if shots:
					page.screenshot(path=os.path.join(shots, f"{report.replace(' ', '_')}-{tag}.png"))

			if w > 800 and theme == "light":
				# a user without access to a report gets core's message; close it first
				page.evaluate("$('.modal.show').modal('hide')")
				page.wait_for_timeout(600)
				# Edit filters opens the grid; a Link filter's suggestions show; Hide folds again
				page.click(".isd-rf-toggle")
				page.wait_for_timeout(400)
				s = page.evaluate(STATE)
				check(s["form_shown"] and not s["folded"], "Edit filters did not open the filters")
				link = page.locator(".page-form input[data-fieldname=company]").first
				if link.count():
					link.click()
					link.fill("IT")
					page.wait_for_timeout(1800)
					check(page.evaluate(ON_TOP, ".page-form [data-fieldname=company] .awesomplete ul"), "company filter suggestions not visible")
					if shots:
						page.screenshot(path=os.path.join(shots, f"open-{tag}.png"))
					# put the value back without running anything new: Escape, then core's own setter
					page.keyboard.press("Escape")
					page.evaluate("frappe.query_report.get_filter('company').set_input(frappe.query_report.get_filter('company').last_value || frappe.defaults.get_user_default('Company'))")
				page.click(".isd-rf-toggle")
				page.wait_for_timeout(400)
				check(page.evaluate(STATE)["folded"], "Hide filters did not fold them")

			for e in errors:
				if "isd_" not in e:
					print("core/other:", e[:160])
			if w > 991:
				# leaving the reports gives a list the full sidebar back
				page.evaluate("frappe.set_route('List', 'Sales Invoice')")
				page.wait_for_timeout(2500)
				check(not page.evaluate("document.body.classList.contains('isd-rail')"), f"{tag}: the rail stayed on a list")

			check(not [e for e in errors if "isd_" in e], f"{tag}: ISOFT Desk errors {[e[:200] for e in errors if 'isd_' in e][:3]}")
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
