"""Sidebar groups: which workspace or Isoft desk Page sits under which heading."""
from frappe import _

# (key, label, icon from the frappe sprite), in sidebar order
GROUPS = [
	("home", "Home", "home"),
	("finance", "Finance", "accounting"),
	("sales", "Sales", "sell"),
	("purchasing", "Purchasing", "buying"),
	("stock", "Stock", "stock"),
	("people", "People", "hr"),
	("projects", "Projects & Support", "projects"),
	("isoft", "Isoft Apps", "integration"),
	("settings", "Settings", "setting"),
	("more", "More", "folder-normal"),
]

WORKSPACE_GROUP = {
	"Home": "home",
	"Accounting": "finance",
	"Assets": "finance",
	"Loans": "finance",
	"Isoft Angola Tax Compliance": "finance",
	"Selling": "sales",
	"CRM": "sales",
	"Retail": "sales",
	"POS Awesome": "sales",
	"CS-Cart Integration": "sales",
	"Buying": "purchasing",
	"Stock": "stock",
	"Manufacturing": "stock",
	"Quality": "stock",
	"HR": "people",
	"Payroll": "people",
	"Projects": "projects",
	"Support": "projects",
	"Isoft Business AI": "isoft",
	"Itec Integrations": "isoft",
	"HP": "isoft",
	"HP Partnership": "isoft",
	"Build": "settings",
	"Settings": "settings",
	"Users": "settings",
	"Customization": "settings",
	"Integrations": "settings",
	"Tools": "settings",
	"Utilities": "settings",
	"Website": "settings",
	"ERPNext Settings": "settings",
	"ERPNext Integrations": "settings",
	"ERPNext Integrations Settings": "settings",
}

# Isoft desk Pages that have no workspace; only these Pages are listed.
PAGE_GROUP = {
	"isoft-invenza": "stock",
	"isoft-location-manager": "stock",
	"saft-center": "finance",
	"fe-angola-dashboard": "finance",
	"angola-hr-dashboard": "people",
	"isoft-insights": "home",
	"command-center": "settings",
	"isoft-permission-manager": "settings",
	"intelize-dashboard": "sales",
	"isoft-cscart": "sales",
	"business-assistant": "isoft",
}

# Pages that draw their own sidebar: the desk sidebar collapses to its rail there.
RAIL_ROUTES = [
	"isoft-invenza",
	"saft-center",
	"isoft-insights",
	"angola-hr-dashboard",
	"isoft-location-manager",
	"command-center",
	"intelize-dashboard",
	"fe-angola-dashboard",
]

# Full-screen apps where the desk sidebar is hidden.
HIDDEN_ROUTES = ["posapp"]


def slug(name):
	# same as frappe.router.slug in the desk
	return name.lower().replace(" ", "-")


def _workspace_group(workspace):
	if workspace["name"] in WORKSPACE_GROUP:
		return WORKSPACE_GROUP[workspace["name"]]
	if workspace.get("category") == "Administration":
		return "settings"
	return "more"


def build_groups(workspaces, pages, page_titles):
	items = {key: [] for key, _label, _icon in GROUPS}

	for workspace in workspaces:
		items[_workspace_group(workspace)].append({
			"type": "workspace",
			"name": workspace["name"],
			"label": _(workspace["name"]),
			"route": slug(workspace["name"]),
			"icon": workspace.get("icon") or "folder-normal",
		})

	for page in pages:
		if page not in PAGE_GROUP:
			continue
		items[PAGE_GROUP[page]].append({
			"type": "page",
			"name": page,
			"label": _(page_titles.get(page) or page),
			"route": page,
			"icon": "file",
		})

	return [
		{"key": key, "label": _(label), "icon": icon, "items": items[key]}
		for key, label, icon in GROUPS
		if items[key]
	]
