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


	// the top-bar full-screen button shows the action a click will take
	function fullscreen_toggle(is_full) {
		return is_full
			? { icon: "collapse", label: "Exit full screen" }
			: { icon: "expand", label: "Full screen" };
	}

	// /app (route [""]) and /app/workspace show a workspace without naming it
	function effective_route(route, landing) {
		const r = route || [];
		if (!r.length || r[0] === "" || (r[0] === "Workspaces" && !r[1])) return ["Workspaces", landing];
		return r;
	}

	// the list search box filters on the title field when the list offers it, else on ID
	function list_search_field(title_field, standard_fields) {
		return title_field && standard_fields.includes(title_field) ? title_field : "name";
	}

	function as_list(value) {
		return Array.isArray(value) ? value : String(value).split(",").map(v => v.trim()).filter(Boolean);
	}

	// one chip per active list filter ([doctype, field, condition, value, hidden]);
	// labels, value names and the few words are passed in so they arrive translated
	function filter_chips(filters, opts) {
		const words = opts.words;
		return (filters || [])
			.filter(f => !f[4])
			.filter(f => !(f[1] === opts.search_field && (f[2] === "like" || f[2] === "=")))
			.map(([doctype, fieldname, condition, value]) => {
				const label = opts.label_of(fieldname, doctype);
				const name = v => String(opts.value_of(fieldname, v, doctype));
				let text;
				if (condition === "is") {
					text = `${label}: ${value === "set" ? words.set : words.not_set}`;
				} else if (condition === "in" || condition === "not in") {
					const values = as_list(value).map(name).join(", ");
					text = `${label}: ${condition === "in" ? "" : words.not + " "}${values}`;
				} else if (condition === "Between" && Array.isArray(value)) {
					text = `${label}: ${name(value[0])} – ${name(value[1])}`;
				} else if (condition === "!=") {
					text = `${label}: ${words.not} ${name(value)}`;
				} else if (condition === "=" || condition === "like" || condition === "Timespan") {
					text = `${label}: ${name(String(value).replace(/^%|%$/g, ""))}`;
				} else {
					text = `${label} ${condition} ${name(value)}`;
				}
				return { doctype, fieldname, condition, value, text };
			});
	}

	return {
		route_mode, find_active, filter_groups, landing_workspace, theme_to_remember, direct_item,
		fullscreen_toggle, effective_route, list_search_field, filter_chips,
	};
});
