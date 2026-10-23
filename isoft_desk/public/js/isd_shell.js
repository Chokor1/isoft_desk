// ISOFT Desk shell: the navy sidebar shown on every desk route.
// Inert unless the boot payload says this user is in the pilot.
(function () {
	const conf = (frappe.boot && frappe.boot.isoft_desk) || {};
	if (!conf.active) return;

	const core = window.isd_core;
	const PINS_KEY = "workspace_sidebar_pinned"; // shared with the core sidebar
	const RAIL_KEY = "isd_rail";
	const DESKTOP = window.matchMedia("(min-width: 992px)");

	// interface strings carry their own context so they never override other apps' translations
	const t = (text, replace) => __(text, replace, "ISOFT Desk");
	const esc = (text) => frappe.utils.escape_html(String(text == null ? "" : text));
	const icon = (name, size) => frappe.utils.icon(name, size || "md");

	function read_store(key, fallback) {
		try {
			const raw = localStorage.getItem(key);
			return raw == null ? fallback : JSON.parse(raw);
		} catch (e) {
			return fallback;
		}
	}

	function write_store(key, value) {
		try {
			localStorage.setItem(key, JSON.stringify(value));
		} catch (e) {
			// private window or full storage: the setting just isn't remembered
		}
	}

	document.body.classList.add("isd-on");
	// html paints the canvas below short pages; it needs the ground colour too
	document.documentElement.classList.add("isd-on");

	const shell = {
		groups: conf.groups || [],
		open_key: null,
		active: null,
		term: "",

		init() {
			this.$side = $(`
				<aside class="isd-sidebar" aria-label="${esc(t("Main navigation"))}">
					<div class="isd-head">
						<a class="isd-brand-link" href="/app/home" title="ISOFT ERP v${esc(frappe.boot.version || "")}">
							<img class="isd-logo-full" src="/assets/isoft_desk/images/isoft_erp_logo.png" alt="ISOFT ERP">
							<img class="isd-logo-mark" src="/assets/isoft_desk/images/isoft_mark.png" alt="ISOFT ERP">
							${frappe.boot.version ? `<span class="isd-version">v${esc(frappe.boot.version)}</span>` : ""}
						</a>
					</div>
					<div class="isd-search">
						${icon("search", "sm")}
						<input type="search" placeholder="${esc(t("Search modules"))}"
							aria-label="${esc(t("Search modules"))}" autocomplete="off">
					</div>
					<nav class="isd-scroll"></nav>
					<div class="isd-foot">
						<button class="isd-company" type="button" aria-haspopup="menu"></button>
						<button class="isd-collapse" type="button"></button>
					</div>
				</aside>
			`).prependTo(document.body);
			this.$nav = this.$side.find(".isd-scroll");

			this.$drawer_btn = $(`
				<button class="isd-drawer-btn" type="button" aria-label="${esc(t("Open navigation"))}">
					${icon("menu")}
				</button>
			`).prependTo($(".navbar .container").first());

			this.bind();
			this.render_company();
			this.apply_rail(read_store(RAIL_KEY, false));
			this.on_route();
		},

		bind() {
			this.$side.find(".isd-search input").on("input", frappe.utils.debounce((e) => {
				this.term = e.target.value;
				this.render();
			}, 120)).on("keydown", (e) => {
				if (e.key === "Escape") {
					e.target.value = "";
					this.term = "";
					this.render();
				} else if (e.key === "Enter") {
					const first = this.$nav.find(".isd-item").get(0);
					if (first) first.click();
				}
			});

			this.$nav.on("click", ".isd-group-btn", (e) => {
				const key = $(e.currentTarget).closest(".isd-group").attr("data-key");
				if (this.is_rail()) {
					this.open_flyout(key, e.currentTarget);
				} else {
					this.open_key = this.open_key === key ? null : key;
					this.render();
				}
			});

			this.$side.on("click", ".isd-pin", (e) => {
				e.preventDefault();
				e.stopPropagation();
				this.toggle_pin($(e.currentTarget).attr("data-name"));
			});

			this.$side.on("click", ".isd-item", () => this.close_drawer());
			this.$side.find(".isd-collapse").on("click", () => this.apply_rail(!this.rail_pref));
			this.$side.find(".isd-company").on("click", (e) => this.open_company_menu(e.currentTarget));
			this.$drawer_btn.on("click", () => this.open_drawer());

			$(document).on("click", (e) => {
				if (!$(e.target).closest(".isd-menu, .isd-group-btn, .isd-company").length) this.close_menu();
			});
			$(document).on("keydown", (e) => {
				if (e.key === "Escape") {
					this.close_menu();
					this.close_drawer();
				}
			});

			frappe.router.on("change", () => this.on_route());
			$(document).on("page-change", () => this.on_route());
			DESKTOP.addListener(() => this.apply_rail(this.rail_pref));
		},

		// ---- route ----
		on_route() {
			const route = frappe.get_route() || [];
			const mode = core.route_mode(route, conf.rail_routes || [], conf.hidden_routes || []);
			document.body.classList.toggle("isd-hidden", mode === "hidden");
			const is_form = route[0] === "Form";
			document.body.classList.toggle("isd-form", is_form);
			if (is_form) {
				// core draws the toggle icon for a visible column; refresh it for the hidden one
				setTimeout(() => {
					const page = window.cur_frm && cur_frm.page;
					if (page && page.update_sidebar_icon) page.update_sidebar_icon();
				}, 300);
			}
			this.forced_rail = mode === "rail";
			this.apply_rail(this.rail_pref);

			this.active = core.find_active(this.groups, route);
			if (this.active && !this.term) this.open_key = this.active.group_key;
			this.render();
			this.close_menu();
		},

		// ---- rail ----
		is_rail() {
			return document.body.classList.contains("isd-rail");
		},

		apply_rail(pref) {
			this.rail_pref = !!pref;
			write_store(RAIL_KEY, this.rail_pref);
			const rail = DESKTOP.matches && (this.rail_pref || this.forced_rail);
			document.body.classList.toggle("isd-rail", rail);
			const label = rail ? t("Expand sidebar") : t("Collapse sidebar");
			this.$side.find(".isd-collapse")
				.attr({ title: label, "aria-label": label })
				.html(icon(rail ? "sidebar-expand" : "sidebar-collapse"));
			// the window's width changed for every page layout listening to resize
			$(window).trigger("resize");
		},

		// ---- render ----
		render() {
			const groups = core.filter_groups(this.groups, this.term);
			const searching = !!this.term.trim();
			let html = "";

			if (!searching) {
				const favorites = core.favorite_items(this.groups, read_store(PINS_KEY, []));
				if (favorites.length) {
					html += `<div class="isd-favorites">
						<div class="isd-label">${esc(t("Favorites"))}</div>
						<ul class="isd-items">${favorites.map((item) => this.item_html(item)).join("")}</ul>
					</div>`;
				}
			}

			html += `<div class="isd-label">${esc(t("Modules"))}</div>`;
			html += groups.map((group) => {
				const open = searching || group.key === this.open_key;
				const has_active = this.active && this.active.group_key === group.key;
				return `<div class="isd-group${open ? " is-open" : ""}${has_active ? " has-active" : ""}"
						data-key="${esc(group.key)}">
					<button class="isd-group-btn" type="button" aria-expanded="${open}"
						title="${esc(group.label)}">
						${icon(group.icon)}
						<span class="isd-text">${esc(group.label)}</span>
						<span class="isd-chevron">${icon("small-down", "sm")}</span>
					</button>
					<ul class="isd-items">${group.items.map((item) => this.item_html(item)).join("")}</ul>
				</div>`;
			}).join("");

			if (!groups.length) {
				html += `<div class="isd-empty">${esc(t("No modules match"))}</div>`;
			}
			this.$nav.html(html);
		},

		item_html(item) {
			const pinned = read_store(PINS_KEY, []).includes(item.name);
			const is_active = this.active && this.active.item_name === item.name;
			const pin_label = pinned ? t("Remove from favorites") : t("Add to favorites");
			return `<li class="isd-row">
				<a class="isd-item${is_active ? " is-active" : ""}" href="/app/${esc(item.route)}"
					${is_active ? 'aria-current="page"' : ""}>
					<span class="isd-text">${esc(item.label)}</span>
				</a>
				<button class="isd-pin${pinned ? " is-pinned" : ""}" type="button" data-name="${esc(item.name)}"
					title="${esc(pin_label)}" aria-label="${esc(pin_label)}">${icon("star", "sm")}</button>
			</li>`;
		},

		toggle_pin(name) {
			const pins = read_store(PINS_KEY, []);
			write_store(PINS_KEY, pins.includes(name) ? pins.filter((n) => n !== name) : pins.concat(name));
			this.render();
		},

		// ---- menus ----
		place_menu($menu, anchor, below) {
			const rect = anchor.getBoundingClientRect();
			$menu.appendTo(document.body);
			const height = $menu.outerHeight();
			let top = below ? rect.top - height - 6 : rect.top;
			top = Math.max(8, Math.min(top, window.innerHeight - height - 8));
			$menu.css({ top, left: rect.right + 8 });
		},

		open_flyout(key, anchor) {
			const group = this.groups.find((g) => g.key === key);
			this.close_menu();
			const $menu = $(`<div class="isd-menu" role="menu">
				<div class="isd-menu-title">${esc(group.label)}</div>
				${group.items.map((item) => `<a class="isd-item" role="menuitem" href="/app/${esc(item.route)}">
					<span class="isd-text">${esc(item.label)}</span></a>`).join("")}
			</div>`);
			$menu.on("click", ".isd-item", () => this.close_menu());
			this.place_menu($menu, anchor, false);
			this.$menu = $menu;
		},

		close_menu() {
			if (this.$menu) {
				this.$menu.remove();
				this.$menu = null;
			}
		},

		// ---- company ----
		company() {
			return frappe.defaults.get_user_default("Company") || frappe.defaults.get_default("company") || "";
		},

		render_company() {
			const name = this.company();
			this.$side.find(".isd-company").attr("title", name).html(`
				${icon("organization")}
				<span class="isd-text">${esc(name || t("No company"))}<small>${esc(t("Company"))}</small></span>
			`);
		},

		open_company_menu(anchor) {
			if (this.$menu) return this.close_menu();
			frappe.db.get_list("Company", { fields: ["name"], limit: 100, order_by: "name asc" }).then((rows) => {
				const current = this.company();
				const $menu = $(`<div class="isd-menu" role="menu">
					<div class="isd-menu-title">${esc(t("Switch company"))}</div>
					${rows.map((row) => `<button class="isd-menu-option${row.name === current ? " is-current" : ""}"
						type="button" role="menuitemradio" aria-checked="${row.name === current}"
						data-company="${esc(row.name)}">${esc(row.name)}</button>`).join("")}
				</div>`);
				$menu.on("click", ".isd-menu-option", (e) => this.set_company($(e.currentTarget).attr("data-company")));
				this.place_menu($menu, anchor, true);
				this.$menu = $menu;
			});
		},

		set_company(name) {
			this.close_menu();
			frappe.call({
				method: "frappe.core.doctype.session_default_settings.session_default_settings.set_session_default_values",
				args: { default_values: { company: name } },
			}).then(() => {
				// same as core's Session Defaults dialog: reload so every form and report picks it up
				frappe.show_alert({ message: t("Company set to {0}", [name]), indicator: "green" });
				frappe.ui.toolbar.clear_cache();
			});
		},

		// ---- drawer (below 992px) ----
		open_drawer() {
			document.body.classList.add("isd-drawer-open");
			this.$backdrop = $('<div class="isd-backdrop"></div>').appendTo(document.body)
				.on("click", () => this.close_drawer());
			this.$side.find(".isd-search input").trigger("focus");
		},

		close_drawer() {
			document.body.classList.remove("isd-drawer-open");
			if (this.$backdrop) {
				this.$backdrop.remove();
				this.$backdrop = null;
			}
		},

		refresh() {
			this.render();
		},
	};

	window.isd_shell = shell;
	$(document).on("app_ready", () => shell.init());
})();
