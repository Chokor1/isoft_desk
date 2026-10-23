// ISOFT Desk module pages: replaces the v13 workspace renderer for pilot users.
// Same routes (/app/<workspace>) and the same data (get_desktop_page), new layout:
// header actions, what is waiting, quick links, one chart, the link index.
(function () {
	const conf = (frappe.boot && frappe.boot.isoft_desk) || {};
	if (!conf.active) return;

	const MAX_TILES = 5;
	const MAX_NEW_BUTTONS = 3;
	// documents people create every day come first among the "New" buttons
	const TRANSACTIONS = [
		"Sales Invoice", "Sales Order", "Quotation", "Delivery Note", "Payment Entry",
		"Purchase Invoice", "Purchase Order", "Purchase Receipt", "Material Request",
		"Journal Entry", "Stock Entry", "Stock Reconciliation", "Lead", "Opportunity",
		"Leave Application", "Isoft Salary Slip", "Asset", "Task", "Issue",
	];
	// interface strings carry their own context so they never override other apps' translations
	const t = (text, replace) => __(text, replace, "ISOFT Desk");
	const esc = (text) => frappe.utils.escape_html(String(text == null ? "" : text));

	function company() {
		return frappe.defaults.get_user_default("Company") || "";
	}

	// [[field, op, value]] -> {field: value | [op, value]} for frappe.route_options
	function to_route_options(filters) {
		const options = {};
		(filters || []).forEach(([field, op, value]) => {
			options[field] = op === "=" ? value : [op, value];
		});
		return options;
	}

	// "{} To Deliver" -> "To Deliver", translated as a whole format when the
	// dictionary has it, otherwise as the bare label
	function tile_label(shortcut) {
		if (!shortcut.format) return __(shortcut.label);
		const whole = __(shortcut.format);
		if (whole !== shortcut.format) return whole.replace(/{}/g, "").trim();
		return __(shortcut.format.replace(/{}/g, "").trim());
	}

	function stats_filter(shortcut) {
		if (shortcut.type !== "DocType" || !shortcut.stats_filter) return null;
		try {
			// same evaluation as core's shortcut widget; the expression is workspace config
			return new Function(`return ${shortcut.stats_filter}`)() || null;
		} catch (e) {
			return null;
		}
	}

	frappe.standard_pages["Workspaces"] = function () {
		const wrapper = frappe.container.add_page("Workspaces");
		frappe.ui.make_app_page({ parent: wrapper, name: "Workspaces", title: t("Workspace") });
		frappe.workspace = new IsdWorkspace(wrapper);
		$(wrapper).bind("show", () => frappe.workspace.show());
	};

	class IsdWorkspace {
		constructor(wrapper) {
			this.wrapper = $(wrapper);
			this.page = wrapper.page;
			this.body = this.wrapper.find(".layout-main-section");
			this.pages = {};
		}

		page_to_show() {
			let remembered = null;
			try {
				remembered = localStorage.current_workspace;
			} catch (e) {
				// storage blocked: fall through to Home
			}
			const home = frappe.workspaces && frappe.workspaces.home;
			return window.isd_core.landing_workspace(frappe.get_route()[1], remembered, home && home.name, conf.groups || []);
		}

		show() {
			const name = this.page_to_show();
			if (this.current && this.current !== this.pages[name]) this.current.hide();
			try {
				localStorage.current_workspace = name;
			} catch (e) {
				// not remembered; harmless
			}
			this.page.set_title(__(name));
			this.setup_menu(name);
			this.current = this.pages[name] || (this.pages[name] = new IsdModulePage(this, name));
			this.current.show();
		}

		setup_menu(name) {
			this.page.clear_menu();
			this.page.clear_actions();
			this.page.clear_custom_actions();
			if (frappe.user.has_role("System Manager")) {
				this.page.add_menu_item(t("Edit Workspace"), () => frappe.set_route("Form", "Workspace", name));
			}
			this.page.add_menu_item(t("Reset Customizations"), () => {
				frappe.xcall("frappe.desk.desktop.reset_customization", { page: name }).then(() => {
					frappe.show_alert({ message: t("Removed page customizations"), indicator: "green" });
					this.pages[name].reload();
				});
			});
		}
	}

	class IsdModulePage {
		constructor(parent, name) {
			this.parent = parent;
			this.name = name;
			this.$el = $(`<div class="isd-ws" data-workspace="${esc(name)}"></div>`).appendTo(parent.body);
			this.$el.on("click", ".isd-tile", (e) => {
				e.preventDefault();
				const tile = this.shown_tiles[Number($(e.currentTarget).attr("data-index"))];
				frappe.route_options = Array.isArray(tile.filters) ? to_route_options(tile.filters) : tile.filters;
				frappe.set_route("List", tile.doctype);
			});
			this.reload();
		}

		show() {
			this.$el.show();
			this.set_header_actions();
			if (this.data) this.load_counts();
		}

		hide() {
			this.$el.hide();
		}

		reload() {
			this.$el.html(`<div class="isd-ws-loading">${esc(t("Loading..."))}</div>`);
			frappe.xcall("frappe.desk.desktop.get_desktop_page", { page: this.name }).then((data) => {
				if (!data || !Object.keys(data).length) {
					// no access or no such workspace: same fallback as core
					try {
						delete localStorage.current_workspace;
					} catch (e) {
						// ignore
					}
					frappe.set_route("workspace");
					return;
				}
				this.data = data;
				this.render();
			});
		}

		// ---- header ----
		set_header_actions() {
			// the page head is shared by every module page: only the one on screen may
			// write to it, and it starts from a clean head so reloads never duplicate
			if (this.parent.current !== this) return;
			this.parent.setup_menu(this.name);
			const page = this.parent.page;
			const name = company();
			// page.set_title_sub targets an element this desk's page template lacks
			this.parent.wrapper.find(".page-head .sub-heading").first()
				.html(`<span class="isd-ws-context">${esc(name ? name + " · " : "")}${esc(__(moment().format("MMMM")) + " " + moment().format("YYYY"))}</span>`)
				.removeClass("hide");
			if (!this.data) return;

			const candidates = [];
			const consider = (type, doctype) => {
				if (type === "DocType" && doctype && !candidates.includes(doctype)) candidates.push(doctype);
			};
			this.data.shortcuts.items.forEach((s) => consider(s.type, s.link_to));
			this.data.cards.items.forEach((card) => (card.links || []).forEach((l) => consider(l.link_type, l.link_to)));
			const rank = (doctype) => {
				const index = TRANSACTIONS.indexOf(doctype);
				return index === -1 ? TRANSACTIONS.length + candidates.indexOf(doctype) : index;
			};
			const creatable = candidates
				.filter((doctype) => TRANSACTIONS.includes(doctype) || this.data.shortcuts.items.some((s) => s.link_to === doctype))
				.filter((doctype) => frappe.model.can_create(doctype))
				.sort((a, b) => rank(a) - rank(b));
			// frappe places the primary button last, so the most important one goes first here
			creatable.slice(0, MAX_NEW_BUTTONS).forEach((doctype, index) => {
				const label = t("New {0}", [__(doctype)]);
				const go = () => frappe.new_doc(doctype);
				if (index === 0) page.set_primary_action(label, go);
				else page.add_button(label, go);
			});
		}

		// ---- body ----
		render() {
			this.tiles = this.data.shortcuts.items
				.map((s) => ({ shortcut: s, filters: stats_filter(s) }))
				.filter((entry) => entry.filters)
				.slice(0, MAX_TILES)
				.map((entry) => ({
					doctype: entry.shortcut.link_to,
					label: tile_label(entry.shortcut),
					filters: entry.filters,
					count: undefined,
				}));
			const counted = this.tiles.map((entry) => entry.doctype);
			const quick = this.data.shortcuts.items.filter((s) => !(s.type === "DocType" && counted.includes(s.link_to)));

			this.$el.html(`
				<div class="isd-ws-onboarding"></div>
				<section class="isd-waiting" aria-label="${esc(t("What is waiting"))}"></section>
				${quick.length ? `<nav class="isd-quick" aria-label="${esc(t("Shortcuts"))}">
					${quick.map((s) => `<a class="isd-quick-link" href="${esc(this.shortcut_route(s))}">${esc(__(s.label))}</a>`).join("")}
				</nav>` : ""}
				<section class="isd-ws-chart"></section>
				<section class="isd-index">${this.index_html()}</section>
			`);

			this.make_onboarding();
			this.make_chart();
			this.set_header_actions();
			this.load_counts();
		}

		shortcut_route(s) {
			return frappe.utils.generate_route({
				route: s.route,
				name: s.link_to,
				type: s.type,
				is_query_report: s.is_query_report,
				doctype: s.ref_doctype,
				doc_view: s.doc_view,
			});
		}

		index_html() {
			return this.data.cards.items
				.filter((card) => card.links && card.links.length)
				.map((card) => `<div class="isd-card">
					<h2>${esc(__(card.label))}</h2>
					<ul>${card.links.map((link) => `<li>${this.link_html(link)}</li>`).join("")}</ul>
				</div>`)
				.join("");
		}

		link_html(link) {
			const label = esc(__(link.label || link.link_to));
			if (link.dependencies && link.incomplete_dependencies) {
				// same rule as core links_widget: visible, greyed, explains what is missing
				const missing = link.incomplete_dependencies.map((d) => __(d)).join(", ");
				return `<span class="isd-link is-disabled" tabindex="0">${label}
					<span class="isd-pop" role="tooltip">${esc(t("You need to create these first: "))}${esc(missing)}</span>
				</span>`;
			}
			const opts = {
				name: link.link_to,
				type: link.link_type,
				doctype: link.doctype,
				is_query_report: link.is_query_report,
			};
			if ((link.link_type || "").toLowerCase() === "report" && !link.is_query_report) {
				opts.doctype = link.dependencies;
			}
			return `<a class="isd-link" href="${esc(frappe.utils.generate_route(opts))}">${label}</a>`;
		}

		// ---- counts ----
		load_counts() {
			const name = company();
			const shortcut_tiles = this.tiles.map((tile) => this.count_shortcut(tile, name));
			let defaults = Promise.resolve([]);
			if ((conf.count_workspaces || []).includes(this.name) && this.tiles.length < MAX_TILES) {
				defaults = frappe.xcall("isoft_desk.api.get_counts", {
					workspace: this.name,
					company: name,
					exclude: JSON.stringify(this.tiles.map((tile) => tile.doctype)),
				}).catch(() => []);
			}
			this.render_tiles(true);
			Promise.all([Promise.all(shortcut_tiles), defaults]).then(([, rows]) => {
				const extra = (rows || []).slice(0, MAX_TILES - this.tiles.length).map((row) => ({
					doctype: row.doctype,
					label: row.label,
					filters: row.filters,
					count: row.count,
				}));
				this.all_tiles = this.tiles.concat(extra);
				this.render_tiles(false);
			});
		}

		count_shortcut(tile, company_name) {
			// with_doctype returns a jQuery deferred; wrap it so .catch exists
			return Promise.resolve(frappe.model.with_doctype(tile.doctype)).then(() => {
				let filters = tile.filters;
				if (company_name && !Array.isArray(filters) && !("company" in filters)
					&& frappe.meta.has_field(tile.doctype, "company")) {
					filters = Object.assign({}, filters, { company: company_name });
					tile.filters = filters;
				}
				return frappe.db.count(tile.doctype, { filters });
			}).then((count) => {
				tile.count = count;
			}).catch(() => {
				tile.count = null;
			});
		}

		render_tiles(loading) {
			const tiles = loading ? this.tiles : this.all_tiles;
			const $waiting = this.$el.find(".isd-waiting");
			if (!loading && !tiles.length) {
				$waiting.remove();
				return;
			}
			$waiting.html(tiles.map((tile, index) => {
				let count = `<span class="isd-skel"></span>`;
				if (!loading || tile.count !== undefined) {
					count = tile.count == null ? "—" : esc(format_number(tile.count, null, 0));
				}
				return `<a class="isd-tile${tile.count ? "" : " is-zero"}" href="/app/${esc(frappe.router.slug(tile.doctype))}"
						data-index="${index}">
					<span class="isd-tile-count">${count}</span>
					<span class="isd-tile-label">${esc(tile.label)}</span>
					<span class="isd-tile-doctype">${esc(__(tile.doctype))}</span>
				</a>`;
			}).join(""));
			this.shown_tiles = tiles;
		}

		// ---- core widgets kept as they are ----
		make_onboarding() {
			const onboarding = this.data.onboarding;
			if (!onboarding || !onboarding.items || !onboarding.items.length) return;
			frappe.widget.make_widget({
				label: onboarding.label || t("Let's Get Started"),
				subtitle: onboarding.subtitle,
				steps: onboarding.items,
				success: onboarding.success,
				docs_url: onboarding.docs_url,
				user_can_dismiss: onboarding.user_can_dismiss,
				widget_type: "onboarding",
				container: this.$el.find(".isd-ws-onboarding"),
				options: {
					allow_sorting: false,
					allow_create: false,
					allow_delete: false,
					allow_hiding: false,
					allow_edit: false,
					max_widget_count: 2,
				},
			});
		}

		make_chart() {
			const chart = this.data.charts.items[0];
			if (!chart) {
				this.$el.find(".isd-ws-chart").remove();
				return;
			}
			frappe.dashboard_utils.get_dashboard_settings().then((settings) => {
				const config = settings.chart_config ? JSON.parse(settings.chart_config) : {};
				chart.chart_settings = config[chart.chart_name] || {};
				frappe.widget.make_widget(Object.assign({}, chart, {
					widget_type: "chart",
					container: this.$el.find(".isd-ws-chart"),
					options: {
						allow_sorting: false,
						allow_create: false,
						allow_delete: false,
						allow_hiding: false,
						allow_edit: true,
					},
				}));
			});
		}
	}
})();
