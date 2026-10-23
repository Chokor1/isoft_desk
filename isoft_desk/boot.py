import frappe
from frappe.desk.desktop import get_desk_sidebar_items

from isoft_desk.activation import get_settings, is_active_for
from isoft_desk.navigation import HIDDEN_ROUTES, RAIL_ROUTES, build_groups


def boot_session(bootinfo):
	user = frappe.session.user
	if not is_active_for(user, frappe.get_roles(user), get_settings()):
		bootinfo.isoft_desk = {"active": False}
		return

	page_info = bootinfo.get("page_info") or {}
	bootinfo.isoft_desk = {
		"active": True,
		"groups": build_groups(
			get_desk_sidebar_items(),
			list(page_info),
			{name: info.get("title") for name, info in page_info.items()},
		),
		"rail_routes": RAIL_ROUTES,
		"hidden_routes": HIDDEN_ROUTES,
		"count_workspaces": [],
	}
