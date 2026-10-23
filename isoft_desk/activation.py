"""Who sees the new desk: a site switch plus a pilot list of users and roles."""
import frappe

SETTINGS_CACHE_KEY = "isoft_desk_settings"


def is_active_for(user, roles, settings):
	if user == "Guest" or not settings.get("enabled"):
		return False
	if settings.get("rollout") == "Everyone":
		return True
	if user in settings.get("pilot_users", []):
		return True
	return bool(set(roles) & set(settings.get("pilot_roles", [])))


def get_settings():
	cached = frappe.cache().get_value(SETTINGS_CACHE_KEY)
	if cached:
		return cached
	doc = frappe.get_cached_doc("Isoft Desk Settings")
	settings = {
		"enabled": doc.enabled,
		"rollout": doc.rollout or "Pilot",
		"pilot_users": [row.user for row in doc.pilot_users],
		"pilot_roles": [row.role for row in doc.pilot_roles],
	}
	frappe.cache().set_value(SETTINGS_CACHE_KEY, settings)
	return settings


def clear_settings_cache():
	frappe.cache().delete_value(SETTINGS_CACHE_KEY)
	# boot payloads are cached per user; drop them so the next reload re-decides
	frappe.cache().delete_key("bootinfo")
