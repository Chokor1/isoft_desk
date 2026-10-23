"""Sidebar groups: which workspace sits under which heading."""
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

# Pages that draw their own fixed sidebar: the desk sidebar would cover it, so
# it is hidden there and the page looks exactly as it does without this app.
OWN_SIDEBAR_ROUTES = [
	"isoft-invenza",
	"saft-center",
	"isoft-insights",
	"angola-hr-dashboard",
	"isoft-location-manager",
	"command-center",
	"intelize-dashboard",
	"fe-angola-dashboard",
]

# Routes where the desk sidebar is hidden: full-screen POS plus the pages above.
HIDDEN_ROUTES = ["posapp"] + OWN_SIDEBAR_ROUTES

# Routes where the sidebar collapses to its rail: forms get the full width.
RAIL_ROUTES = ["Form"]

WORKSPACE_ORDER = {name: index for index, name in enumerate(WORKSPACE_GROUP)}

# Isoft app workspaces stay out of the sidebar: the user opens Isoft apps from
# the ISOFT applications launcher in the top bar.
HIDDEN_WORKSPACES = {"Isoft Business AI", "Itec Integrations", "HP", "HP Partnership"}


def slug(name):
	# same as frappe.router.slug in the desk
	return name.lower().replace(" ", "-")


def _workspace_group(workspace):
	if workspace["name"] in WORKSPACE_GROUP:
		return WORKSPACE_GROUP[workspace["name"]]
	if workspace.get("category") == "Administration":
		return "settings"
	return "more"


def build_groups(workspaces):
	"""Workspaces only: Isoft app pages are reached from the ISOFT applications launcher."""
	items = {key: [] for key, _label, _icon in GROUPS}

	workspaces = [w for w in workspaces if w["name"] not in HIDDEN_WORKSPACES]
	ordered = sorted(workspaces, key=lambda w: (WORKSPACE_ORDER.get(w["name"], len(WORKSPACE_ORDER)), w["name"]))
	for workspace in ordered:
		items[_workspace_group(workspace)].append({
			"type": "workspace",
			"name": workspace["name"],
			"label": _(workspace["name"]),
			"route": slug(workspace["name"]),
			"icon": workspace.get("icon") or "folder-normal",
		})

	return [
		{"key": key, "label": _(label, context="ISOFT Desk"), "icon": icon, "items": items[key]}
		for key, label, icon in GROUPS
		if items[key]
	]
