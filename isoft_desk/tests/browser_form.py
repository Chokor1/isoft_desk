"""Browser check: forms keep the DocType's layout and gain the Connections row,
the totals strip and the section links.

    cd ~/frappe-bench && env/bin/python -I apps/isoft_desk/isoft_desk/tests/browser_form.py dev.isoft.ao [user] [--shots DIR]

Never saves: the new draft's grand total is set in the browser only. Exits 1
when an expectation breaks.
"""
import datetime
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from browser_sweep import login  # noqa: E402

FORMS = [
	("si", "/app/sales-invoice/FT%20FT3726S2554N%2F26"),
	("pi", None),  # the latest submitted Purchase Invoice, found at run time
	("item", "/app/item/KIT-POSTO-TRAB"),
	("customer", "/app/customer/~CELESTINO%20MANGO"),
	("si_new", "/app/sales-invoice/new"),
]

STATE = """(() => {
	const frm = cur_frm, wrap = frm.layout.wrapper[0];
	// every field control sits in the order core lays out from the DocType and
	// Customize Form (a subsequence of frm.layout.fields)
	const order = frm.layout.fields.map(df => df.fieldname);
	const dom = [...wrap.querySelectorAll('.form-section .frappe-control[data-fieldname]')]
		.filter(el => !el.closest('.form-grid')).map(el => el.dataset.fieldname);
	let i = 0, in_order = true;
	for (const f of dom) { const at = order.indexOf(f, i); if (at < 0) { in_order = false; break; } i = at + 1; }
	const vis = el => el && !el.hidden && el.offsetParent !== null;
	const labelled = frm.layout.sections.filter(s => s.df && s.df.label && !s.wrapper.hasClass('empty-section')
		&& !s.wrapper.hasClass('hide-control') && s.wrapper.css('display') !== 'none').length;
	const head = document.querySelector('.page-head .page-title'), acts = document.querySelector('.page-head .page-actions');
	const a = head && head.getBoundingClientRect(), b = acts && acts.getBoundingClientRect();
	return {
		in_order, fields: dom.length,
		conn: vis(wrap.querySelector('.isd-conn')),
		conn_links: [...wrap.querySelectorAll('.isd-conn-link')].map(e => e.textContent.replace(/\\s+/g, ' ').trim()),
		folded: !!wrap.querySelector('.form-dashboard.isd-dash-folded'),
		links_shown: vis(wrap.querySelector('.form-dashboard .form-links')),
		sum: [...wrap.querySelectorAll('.isd-sum-cell')].filter(vis).map(e => e.dataset.fieldname + (e.classList.contains('is-bad') ? '!' : '') + '=' + e.querySelector('.isd-sum-value').textContent.trim()),
		nav: [...wrap.querySelectorAll('.isd-secnav-link')].map(e => e.textContent),
		labelled,
		current_at_top: window.scrollY === 0 ? (wrap.querySelector('.isd-secnav-link.is-active') || {}).textContent || null : null,
		head_overlap: !!(a && b && b.width && a.right > b.left + 1 && a.bottom > b.top + 1 && b.bottom > a.top + 1),
		head_covers: (() => { const h = [...document.querySelectorAll('.page-head')].find(e => e.offsetParent), f = wrap.querySelector('.isd-fhead');
			return !!(h && f && window.scrollY === 0 && h.getBoundingClientRect().bottom > f.getBoundingClientRect().top + 1); })(),
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
	pi = frappe.get_all("Purchase Invoice", filters={"docstatus": 1}, order_by="modified desc", limit=1, pluck="name")
	frappe.destroy()
	forms = [(k, r if r else (f"/app/purchase-invoice/{pi[0]}" if pi else None)) for k, r in FORMS]
	failures = run(site, sid, [f for f in forms if f[1]], shots)
	print("OK" if not failures else "FAILED")
	sys.exit(1 if failures else 0)


def run(site, sid, forms, shots):
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
			for key, route in forms:
				page.goto(f"https://{site}{route}", wait_until="networkidle", timeout=90000)
				page.evaluate(f"document.documentElement.setAttribute('data-theme','{theme}')")
				page.wait_for_timeout(2500)
				s = page.evaluate(STATE)
				print(tag, key, s)
				check(s["in_order"], f"{tag} {key}: fields out of the DocType's order")
				check(s["labelled"] < 2 or len(s["nav"]) == s["labelled"], f"{tag} {key}: {len(s['nav'])} links for {s['labelled']} sections")
				check(not s["head_overlap"], f"{tag} {key}: title and buttons overlap")
				check(not s["current_at_top"], f"{tag} {key}: '{s['current_at_top']}' is current before any scroll")
				check(not s["head_covers"], f"{tag} {key}: the page head covers the form's first row")
				if key == "si":
					check(s["conn"] and s["folded"] and not s["links_shown"], f"{tag} si: connections not folded into a row")
					check(any(c.endswith("1") and not c.startswith("Sales Invoice") for c in s["conn_links"]), f"{tag} si: the return is not named by its group {s['conn_links']}")
					check(any(c.startswith("outstanding_amount!") for c in s["sum"]), f"{tag} si: outstanding not red {s['sum']}")
					late = str((datetime.date.today() - datetime.date(2026, 2, 11)).days)
					check(any(c.startswith("due_date=") and late in c for c in s["sum"]), f"{tag} si: due date without {late} days late {s['sum']}")
				if key in ("si", "pi"):
					check(any(c.startswith("grand_total=") for c in s["sum"]), f"{tag} {key}: no grand total in the strip")
				if key in ("item", "customer"):
					check(not s["sum"], f"{tag} {key}: a strip on a non-transaction")
				if shots:
					page.screenshot(path=os.path.join(shots, f"{key}-{tag}.png"))

				if key == "si" and w > 800 and theme == "light":
					# show all connections opens core's block; a section link scrolls and lights up
					page.click(".isd-conn-toggle")
					page.wait_for_timeout(600)
					check(page.is_visible(".form-dashboard .form-links"), "show all connections did not open the block")
					if shots:
						page.screenshot(path=os.path.join(shots, f"si-open-{tag}.png"))
					page.click(".isd-conn-toggle")
					links = page.locator(".isd-secnav-link")
					if links.count() > 2:
						target = links.nth(2)
						label = target.text_content()
						target.click()
						page.wait_for_timeout(1200)
						active = page.evaluate("(document.querySelector('.isd-secnav-link.is-active')||{}).textContent")
						check(active == label, f"clicked '{label}' but '{active}' is current")
						if shots:
							page.screenshot(path=os.path.join(shots, f"si-scrolled-{tag}.png"))

				if key == "si_new" and w > 800 and theme == "light":
					# the strip follows the draft as it changes (in the browser only, never saved)
					page.evaluate("cur_frm.doc.grand_total = 0; frappe.model.set_value(cur_frm.doctype, cur_frm.docname, 'grand_total', 1234.5)")
					page.wait_for_timeout(800)
					s = page.evaluate(STATE)
					check(any(c.startswith("grand_total=") and "1" in c for c in s["sum"]), f"draft strip did not update {s['sum']}")
					check(not any(c.startswith("outstanding_amount") for c in s["sum"]), "draft shows an outstanding amount")

					# dropdowns and popups the desk's styles must never clip or cover
					cust = page.locator(".page-container .form-layout input[data-fieldname=customer]").first
					cust.click(); cust.type("CON", delay=60); page.wait_for_timeout(1800)
					check(page.evaluate(ON_TOP, "[data-fieldname=customer] .awesomplete ul"), "customer suggestions not visible")
					page.keyboard.press("Escape"); cust.fill(""); page.wait_for_timeout(300)

					due = page.locator(".page-container .form-layout input[data-fieldname=due_date]").first
					due.click(); page.wait_for_timeout(600)
					check(page.evaluate(ON_TOP, ".datepicker.active"), "due date picker not visible")
					page.keyboard.press("Escape"); page.mouse.click(700, 120); page.wait_for_timeout(300)

					page.evaluate("cur_frm.scroll_to_field('items')"); page.wait_for_timeout(500)
					page.click(".form-grid .rows .grid-row .col[data-fieldname=item_code]"); page.wait_for_timeout(500)
					cell = page.locator(".form-grid .rows .grid-row input[data-fieldname=item_code]").first
					cell.click(); cell.type("KIT", delay=60); page.wait_for_timeout(1800)
					check(page.evaluate(ON_TOP, ".form-grid .awesomplete ul"), "item suggestions in the table not visible")
					if shots:
						page.screenshot(path=os.path.join(shots, f"grid-link-{tag}.png"))
					page.keyboard.press("Escape"); cell.fill(""); page.wait_for_timeout(300)

					page.locator(".form-grid .rows .grid-row .btn-open-row").first.click(); page.wait_for_timeout(900)
					check(page.evaluate(ON_TOP, ".grid-row-open .form-in-grid"), "row edit form not visible")
					page.keyboard.press("Escape"); page.wait_for_timeout(400)

				if key == "customer" and w > 800 and theme == "light":
					# core's quick entry dialog opens over the list's "+" and is not clipped
					page.goto(f"https://{site}/app/customer", wait_until="networkidle", timeout=90000)
					page.wait_for_timeout(1500)
					page.click(".page-head .primary-action")
					page.wait_for_timeout(1200)
					check(page.evaluate(ON_TOP, ".modal.show .modal-dialog"), "quick entry dialog not visible")
					page.keyboard.press("Escape"); page.wait_for_timeout(500)

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
