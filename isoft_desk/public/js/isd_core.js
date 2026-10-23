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
				// remember the full size: a filtered group is not a one-module group
				size: group.size || group.items.length,
				items: group.items.filter(item =>
					fold(item.label).includes(needle) || fold(item.name).includes(needle)),
			}))
			.filter(group => group.items.length);
	}

	// /app with no workspace in the route: the remembered one, else the one core
	// maps "home" to for this user, else their first workspace, else Home
	function landing_workspace(route_name, remembered, home_name, groups) {
		if (route_name) return route_name;
		if (remembered) return remembered;
		if (home_name) return home_name;
		for (const group of groups) {
			const item = group.items.find(i => i.type === "workspace");
			if (item) return item.name;
		}
		return "Home";
	}

	// the desk theme the login page should open in next time
	function theme_to_remember(value) {
		const theme = String(value || "").toLowerCase();
		return theme === "light" || theme === "dark" ? theme : null;
	}

	// a group holding a single module opens it directly instead of expanding
	function direct_item(group) {
		const size = group.size || group.items.length;
		return size === 1 && group.items.length === 1 ? group.items[0] : null;
	}


	return {
		route_mode, find_active, filter_groups, landing_workspace, theme_to_remember, direct_item,
	};
});
