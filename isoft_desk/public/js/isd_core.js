// Frappe-free helpers for the ISOFT Desk sidebar, unit-tested with Node
// (isoft_desk/tests/isd_core.test.js). Loads before isd_shell.js.
(function (root, factory) {
	if (typeof module === "object" && module.exports) {
		module.exports = factory();
	} else {
		root.isd_core = factory();
	}
})(typeof self !== "undefined" ? self : this, function () {
	function fold(text) {
		return String(text || "")
			.normalize("NFD")
			.replace(/[̀-ͯ]/g, "")
			.toLowerCase();
	}

	// "hidden" on full-screen apps, "rail" on pages with their own sidebar
	function route_mode(route, rail_routes, hidden_routes) {
		const first = (route && route[0]) || "";
		if (hidden_routes.includes(first)) return "hidden";
		if (rail_routes.includes(first)) return "rail";
		return "normal";
	}

	function find_active(groups, route) {
		if (!route || !route.length) return null;
		const is_workspace = route[0] === "Workspaces";
		const target = is_workspace ? route[1] : route[0];
		for (const group of groups) {
			for (const item of group.items) {
				const hit = is_workspace
					? item.type === "workspace" && item.name === target
					: item.type === "page" && item.route === target;
				if (hit) return { group_key: group.key, item_name: item.name };
			}
		}
		return null;
	}

	function filter_groups(groups, term) {
		const needle = fold(term).trim();
		if (!needle) return groups;
		return groups
			.map(group => Object.assign({}, group, {
				items: group.items.filter(item =>
					fold(item.label).includes(needle) || fold(item.name).includes(needle)),
			}))
			.filter(group => group.items.length);
	}

	function favorite_items(groups, pinned) {
		const by_name = {};
		groups.forEach(group => group.items.forEach(item => { by_name[item.name] = item; }));
		return pinned.map(name => by_name[name]).filter(Boolean);
	}

	return { route_mode, find_active, filter_groups, favorite_items };
});
