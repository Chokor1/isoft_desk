"""Screenshot sweep of the ISOFT Desk on a live site (no assertions; for review).

    cd ~/frappe-bench && env/bin/python -I apps/isoft_desk/isoft_desk/tests/browser_sweep.py \
        dev.isoft.ao OUT_DIR [--lang pt] [--theme dark] [--user Administrator]

Logs in by creating a server-side session (no password), reaches the site through
nginx by mapping the hostname to 127.0.0.1, and writes one PNG per route and
viewport plus desktop.png / mobile.png. The user must be in the pilot. A --lang
other than the user's own is set for the run and restored afterwards.
"""
import argparse
import os

ROUTES = [
	("home", "/app/home"),
	("selling", "/app/selling"),
	("accounting", "/app/accounting"),
	("stock", "/app/stock"),
	("si-list", "/app/sales-invoice"),
	("si-form", "/app/sales-invoice/new"),
	("invenza", "/app/isoft-invenza"),
	("pos", "/app/posapp"),
]
VIEWPORTS = [("1366", 1366, 768), ("1440", 1440, 900), ("390", 390, 844)]


def login(site, user):
	import frappe
	from frappe.auth import CookieManager, LoginManager
	from werkzeug.test import EnvironBuilder
	from werkzeug.wrappers import Request

	frappe.local.request = Request(EnvironBuilder(path="/", method="GET").get_environ())
	frappe.local.request_ip = "127.0.0.1"
	frappe.local.cookie_manager = CookieManager()
	LoginManager().login_as(user)
	sid = frappe.session.sid
	frappe.db.commit()
	return sid


def main():
	parser = argparse.ArgumentParser()
	parser.add_argument("site")
	parser.add_argument("out")
	parser.add_argument("--lang")
	parser.add_argument("--theme", choices=["light", "dark"])
	parser.add_argument("--user", default="Administrator")
	args = parser.parse_args()

	os.chdir(os.path.expanduser("~/frappe-bench/sites"))
	os.makedirs(args.out, exist_ok=True)

	import frappe
	from playwright.sync_api import sync_playwright

	frappe.init(site=args.site)
	frappe.connect()
	original_lang = frappe.db.get_value("User", args.user, "language")
	if args.lang:
		frappe.db.set_value("User", args.user, "language", args.lang, update_modified=False)
		frappe.db.commit()
		frappe.cache().delete_key("bootinfo")
		frappe.cache().hdel("lang", args.user)  # get_user_lang caches the language per user

	errors = []
	try:
		sid = login(args.site, args.user)
		with sync_playwright() as p:
			browser = p.chromium.launch(args=[f"--host-resolver-rules=MAP {args.site} 127.0.0.1"])
			for label, width, height in VIEWPORTS:
				context = browser.new_context(ignore_https_errors=True, viewport={"width": width, "height": height})
				context.add_cookies([{"name": "sid", "value": sid, "domain": args.site, "path": "/"}])
				page = context.new_page()
				page.on("pageerror", lambda e: errors.append(str(e)))
				for name, path in ROUTES:
					page.goto(f"https://{args.site}{path}", wait_until="networkidle", timeout=90000)
					if args.theme:
						page.evaluate(f"document.documentElement.setAttribute('data-theme', '{args.theme}')")
					page.wait_for_timeout(2500)
					page.screenshot(path=f"{args.out}/{name}-{label}.png")
				if label == "390":
					page.goto(f"https://{args.site}/app/selling", wait_until="networkidle")
					page.wait_for_timeout(2000)
					page.click(".isd-drawer-btn")
					page.wait_for_timeout(600)
					page.screenshot(path=f"{args.out}/mobile.png")
				if label == "1440":
					page.goto(f"https://{args.site}/app/selling", wait_until="networkidle")
					page.wait_for_timeout(2500)
					page.screenshot(path=f"{args.out}/desktop.png", full_page=True)
				context.close()
			browser.close()
	finally:
		if args.lang:
			frappe.db.set_value("User", args.user, "language", original_lang, update_modified=False)
			frappe.db.commit()
			frappe.cache().delete_key("bootinfo")
			frappe.cache().hdel("lang", args.user)  # get_user_lang caches the language per user
		frappe.destroy()

	for error in errors[:20]:
		print("PAGEERROR", error[:300])
	print("page errors:", len(errors))


if __name__ == "__main__":
	main()
