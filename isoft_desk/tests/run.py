"""Run isoft_desk tests without `bench run-tests`.

`bench run-tests` re-enables the scheduler and runs other apps' before_tests
hooks, which wipe data on a live site. This runner only connects, runs the
tests and rolls back:

    cd ~/frappe-bench/sites && ../env/bin/python -m isoft_desk.tests.run dev.isoft.ao [module]
"""
import sys
import unittest

import frappe


def main(site, module=None):
	frappe.init(site=site)
	frappe.connect()
	try:
		loader = unittest.TestLoader()
		if module:
			suite = loader.loadTestsFromName("isoft_desk.tests." + module)
		else:
			suite = loader.discover(frappe.get_app_path("isoft_desk", "tests"), top_level_dir=frappe.get_app_path("isoft_desk", ".."))
		result = unittest.TextTestRunner(verbosity=2).run(suite)
	finally:
		frappe.db.rollback()
		frappe.destroy()
	sys.exit(0 if result.wasSuccessful() else 1)


if __name__ == "__main__":
	main(*sys.argv[1:])
