// ISOFT Desk shell: the sidebar shown on every desk route (follows the desk theme).
// Inert unless the boot payload says this user is in the pilot.
(function () {
	const conf = (frappe.boot && frappe.boot.isoft_desk) || {};
	if (!conf.active) return;

	const core = window.isd_core;
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

			this.make_fullscreen_button();
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

			// one-module groups are links (a.isd-group-btn) and route on their own
			this.$nav.on("click", "button.isd-group-btn", (e) => {
				const key = $(e.currentTarget).closest(".isd-group").attr("data-key");
				if (this.is_rail()) {
					this.open_flyout(key, e.currentTarget);
				} else {
					this.open_key = this.open_key === key ? null : key;
					this.render();
				}
			});

			this.$side.on("click", ".isd-item, .isd-direct-link", () => this.close_drawer());
			this.$side.find(".isd-collapse").on("click", () => this.apply_rail(!this.rail_pref));
			this.$side.find(".isd-company").on("click", (e) => this.open_company_menu(e.currentTarget));
			this.$drawer_btn.on("click", () => this.open_drawer());

			$(document).on("click", (e) => {
				if (!$(e.target).closest(".isd-menu, button.isd-group-btn, .isd-company").length) this.close_menu();
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

		// ---- full screen (top bar) ----
		make_fullscreen_button() {
			const root = document.documentElement;
			if (!document.fullscreenEnabled || !root.requestFullscreen) return; // e.g. iPhone Safari
			this.$fullscreen = $(`<li class="nav-item isd-fullscreen-item">
				<button class="nav-link isd-fullscreen" type="button"></button>
			</li>`);
			this.place_fullscreen_button();
			// other apps (re)insert their tool buttons in front of the bell at start-up and
			// on every route; move ours back beside the bell whenever the list changes
			// (a no-op when it is already there, so this cannot loop)
			const list = this.$fullscreen.parent()[0];
			if (list) new MutationObserver(() => this.place_fullscreen_button()).observe(list, { childList: true });

			const paint = () => {
				const state = core.fullscreen_toggle(!!document.fullscreenElement);
				this.$fullscreen.find("button")
					.attr({ title: t(state.label), "aria-label": t(state.label) })
					.html(icon(state.icon));
			};
			this.$fullscreen.on("click", "button", () => {
				const request = document.fullscreenElement ? document.exitFullscreen() : root.requestFullscreen();
				if (request && request.catch) request.catch(() => {}); // refused (iframe, policy): stay as is
			});
			// F11, Esc and the browser's own controls change it too
			document.addEventListener("fullscreenchange", paint);
			paint();
		},

		// right before the bell, in the tools list (not #navbar-breadcrumbs, which is
		// also .navbar-nav and is redrawn per route)
		place_fullscreen_button() {
			if (!this.$fullscreen) return;
			// those apps' buttons also carry .dropdown-notifications; the bell is the
			// first item holding core's notifications link
			const $bell = $(".navbar .navbar-collapse a.notifications-icon").first().closest("li");
			if ($bell.length) {
				if ($bell.prev()[0] !== this.$fullscreen[0]) this.$fullscreen.insertBefore($bell);
			} else if (!this.$fullscreen.parent().length) {
				this.$fullscreen.prependTo($(".navbar .navbar-collapse .navbar-nav").first());
			}
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
			this.$nav.html(this.modules_html());
		},

		modules_html() {
			const groups = core.filter_groups(this.groups, this.term);
			const searching = !!this.term.trim();
			if (!groups.length) {
				return `<div class="isd-empty">${esc(searching ? t("No modules match") : t("No modules"))}</div>`;
			}
			return groups.map((group) => {
				const has_active = this.active && this.active.group_key === group.key;
				const direct = core.direct_item(group);
				if (direct) return this.direct_html(group, direct, has_active);
				const open = searching || group.key === this.open_key;
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
		},

		// a group with one module: the group row itself opens it
		direct_html(group, item, is_active) {
			return `<div class="isd-group isd-direct${is_active ? " has-active" : ""}" data-key="${esc(group.key)}">
				<a class="isd-group-btn isd-direct-link${is_active ? " is-active" : ""}" href="/app/${esc(item.route)}"
					title="${esc(group.label)}" ${is_active ? 'aria-current="page"' : ""}>
					${icon(group.icon)}
					<span class="isd-text">${esc(group.label)}</span>
				</a>
			</div>`;
		},

		item_html(item) {
			const is_active = this.active && this.active.item_name === item.name;
			return `<li>
				<a class="isd-item${is_active ? " is-active" : ""}" href="/app/${esc(item.route)}"
					title="${esc(item.label)}" ${is_active ? 'aria-current="page"' : ""}>
					<span class="isd-text">${esc(item.label)}</span>
				</a>
			</li>`;
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
