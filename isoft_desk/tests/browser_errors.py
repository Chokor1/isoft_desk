"""Browser sweep: open common desk screens and report every JavaScript error,
naming the ones whose stack runs through ISOFT Desk files.

    cd ~/frappe-bench && env/bin/python -I apps/isoft_desk/isoft_desk/tests/browser_errors.py dev.isoft.ao [user]

Read-only: lists, the latest record and an unsaved new draft of each DocType,
workspaces, query reports and Isoft pages. Exits 1 when an error comes from
an isd_ file.
"""
import os
import sys
from urllib.parse import quote

sys.path.insert(0, os.path.dirname(__file__))
from browser_sweep import login  # noqa: E402

DOCTYPES = [
	"Sales Invoice", "Sales Order", "Quotation", "Delivery Note", "Purchase Invoice", "Purchase Order",
	"Purchase Receipt", "Payment Entry", "Journal Entry", "Stock Entry", "Material Request", "Item",
	"Customer", "Supplier", "Employee", "Warehouse", "Company", "User", "Pricing Rule", "ToDo",
]
PAGES = [
	"/app", "/app/accounting", "/app/selling", "/app/stock",
	"/app/query-report/General Ledger", "/app/query-report/Accounts Receivable",
	"/app/query-report/Stock Balance", "/app/account/view/tree", "/app/isoft-invenza",
]
NOISE = ("socket.io", "favicon", "ERR_CONNECTION", "net::", "Failed to load resource")


def slug(doctype):
	return doctype.lower().replace(" ", "-")


def main(site, user="Administrator"):
	os.chdir(os.path.expanduser("~/frappe-bench/sites"))
	import frappe

	frappe.init(site=site)
	frappe.connect()
	sid = login(site, user)
	routes = list(PAGES)
	for dt in DOCTYPES:
		routes.append(f"/app/{slug(dt)}")
		latest = frappe.get_all(dt, order_by="modified desc", limit=1, pluck="name")
		if latest:
			routes.append(f"/app/{slug(dt)}/{quote(latest[0], safe='')}")
		routes.append(f"/app/{slug(dt)}/new")
	frappe.destroy()

	from playwright.sync_api import sync_playwright

	ours, theirs = [], []
	with sync_playwright() as p:
		browser = p.chromium.launch(args=[f"--host-resolver-rules=MAP {site} 127.0.0.1"])
		context = browser.new_context(ignore_https_errors=True, viewport={"width": 1366, "height": 768})
		context.add_cookies([{"name": "sid", "value": sid, "domain": site, "path": "/"}])
		page = context.new_page()
		current = {"route": None}

		def record(text, stack=""):
			if any(n in text for n in NOISE):
				return
			entry = f"{current['route']}: {text[:240]}"
			(ours if "isd_" in (stack + text) else theirs).append(entry)

		page.on("pageerror", lambda e: record(str(e), getattr(e, "stack", "") or ""))
		page.on("console", lambda m: m.type == "error" and record(m.text, " ".join(
			str(loc.get("url", "")) for loc in [m.location] if loc)))
		for route in routes:
			current["route"] = route
			try:
				page.goto(f"https://{site}{route}", wait_until="networkidle", timeout=60000)
				page.wait_for_timeout(1500)
			except Exception as e:  # a slow page is reported, not fatal
				theirs.append(f"{route}: load {str(e)[:120]}")
		browser.close()

	print(f"{len(routes)} screens")
	for e in theirs:
		print("core/other:", e)
	for e in ours:
		print("ISOFT DESK:", e)
	print("OK" if not ours else "FAILED")
	sys.exit(1 if ours else 0)


if __name__ == "__main__":
	main(*sys.argv[1:3])
