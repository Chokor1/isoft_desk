import frappe

from isoft_desk.activation import get_settings, is_active_for


def boot_session(bootinfo):
	user = frappe.session.user
	if not is_active_for(user, frappe.get_roles(user), get_settings()):
		bootinfo.isoft_desk = {"active": False}
		return

	bootinfo.isoft_desk = {
		"active": True,
		"groups": [],
		"rail_routes": [],
		"hidden_routes": [],
		"count_workspaces": [],
	}
