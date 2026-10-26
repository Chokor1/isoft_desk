// ISOFT Desk list toolbar for the List and Report views: a search box, one chip
// per active filter and "+ Add filter". It is built from core's own filter
// controls (moved, never copied), so filtering behaves exactly as in core.
(function () {
	const conf = (frappe.boot && frappe.boot.isoft_desk) || {};
	if (!conf.active || !frappe.views || !frappe.views.BaseList) return;

	const core = window.isd_core;
	const t = (text, replace) => __(text, replace, "ISOFT Desk");
	const VIEWS = ["List", "Report"];
	const SIDEBAR_KEY = "isd_list_sidebar";
	const DOCSTATUS = { 0: "Draft", 1: "Submitted", 2: "Cancelled" };

	function storage(key, value) {
		try {
			if (value === undefined) return localStorage.getItem(key);
			localStorage.setItem(key, value);
		} catch (e) {
			return null;
		}
	}

	const restyled = list => VIEWS.includes(list.view_name);
	const sidebar_open = () => storage(SIDEBAR_KEY) === "1";

	const base = frappe.views.BaseList.prototype;
	function wrap(name, fn) {
		const orig = base[name];
		base[name] = function (...args) {
			return fn.call(this, orig, args);
		};
	}

	// the Filter By column starts hidden; the sidebar toggle still opens it, and
	// the choice is remembered apart from core's key, which other views keep using
	wrap("show_or_hide_sidebar", function (orig, args) {
		if (!restyled(this)) return orig.apply(this, args);
		$(document.body).toggleClass("no-list-sidebar", !sidebar_open());
	});

	wrap("toggle_side_bar", function (orig, args) {
		if (!restyled(this)) return orig.apply(this, args);
		storage(SIDEBAR_KEY, sidebar_open() ? "0" : "1");
		this.show_or_hide_sidebar();
		$(document.body).trigger("toggleListSidebar");
	});

	wrap("setup_filter_area", function (orig, args) {
		const out = orig.apply(this, args);
		if (restyled(this) && this.filter_area && !this.hide_page_form) {
			this.page.wrapper.addClass("isd-list");
			this.isd_bar = new ListBar(this);
		}
		return out;
	});

	// on phones core shows the status as a bare dot; colour alone does not name a
	// state, so the dot carries its word
	const list_proto = frappe.views.ListView.prototype;
	const indicator_dot = list_proto.get_indicator_dot;
	list_proto.get_indicator_dot = function (doc) {
		if (!restyled(this)) return indicator_dot.call(this, doc);
		const indicator = frappe.get_indicator(doc, this.doctype);
		if (!indicator) return "";
		return `<span class="indicator ${indicator[1]} isd-status-xs">${frappe.utils.escape_html(__(indicator[0]))}</span>`;
	};

	// filters are settled when a refresh starts, so the chips follow every change
	wrap("refresh", function (orig, args) {
		this.isd_bar && this.isd_bar.update();
		return orig.apply(this, args);
	});

	class ListBar {
		constructor(list) {
			this.list = list;
			this.fields = list.page.fields_dict;
			this.search_field = core.list_search_field(list.meta.title_field, Object.keys(this.fields));
			this.make();
			this.update();
			list.set_result_height && list.set_result_height();
		}

		make() {
			const $form = this.list.page.page_form;
			const $standard = $form.find(".standard-filter-section");
			this.$bar = $(`
				<div class="isd-lbar">
					<div class="isd-lbar-search">${frappe.utils.icon("search", "sm")}</div>
					<ul class="isd-chips" aria-label="${t("Active filters")}"></ul>
					<div class="isd-add-wrap">
						<button type="button" class="isd-add" aria-expanded="false">
							${frappe.utils.icon("add", "xs")}<span>${t("Add filter")}</span>
						</button>
					</div>
					<div class="isd-lpanel" role="dialog" aria-label="${t("Add filter")}" hidden>
						<div class="isd-lpanel-fields"></div>
						<div class="isd-lpanel-foot">
							<button type="button" class="isd-advanced">${t("Advanced filters")}</button>
						</div>
					</div>
				</div>
			`).prependTo($form);

			// the search box is the list's own title (or ID) filter control
			const search = this.fields[this.search_field];
			if (search) {
				this.$bar.find(".isd-lbar-search").append(search.$wrapper);
				const label = this.search_field === "name" ? __("ID") : __(search.df.label);
				search.$input.attr("placeholder", t("Search {0}", [label]));
			}

			// every other standard filter lives in the panel; core's filter button sits
			// invisibly under "+ Add filter" so its popover opens in the same place
			this.$panel = this.$bar.find(".isd-lpanel");
			this.$panel.find(".isd-lpanel-fields").append($standard);
			// core draws these controls without labels (the placeholder is the label),
			// so a filled field would not say what it filters; the label sits outside
			// the control, whose select arrow and placeholder are positioned inside it
			Object.values(this.fields).forEach(field => {
				if (field === search || field.df.fieldtype === "Check" || !field.$wrapper) return;
				field.$wrapper
					.wrap(`<div class="isd-lpanel-item"></div>`)
					.before($(`<label class="isd-lpanel-label"></label>`).text(__(field.df.label)));
			});
			this.$add = this.$bar.find(".isd-add");
			this.$add.parent().append($form.find(".filter-selector"));
			this.$chips = this.$bar.find(".isd-chips");
			this.bind();
		}

		bind() {
			this.$add.on("click", () => this.toggle_panel(this.$panel.prop("hidden")));
			this.$panel.find(".isd-advanced").on("click", () => this.open_advanced());

			this.$chips.on("click", ".isd-chip-x", e => {
				this.remove($(e.currentTarget).closest(".isd-chip").data("chip"));
			});
			this.$chips.on("click", ".isd-chip-text", e => {
				this.edit($(e.currentTarget).closest(".isd-chip").data("chip"));
			});

			const ns = `.isd_lbar_${frappe.scrub(this.list.doctype)}_${this.list.view_name}`;
			$(document).on(`mousedown${ns}`, e => {
				if (this.$panel.prop("hidden")) return;
				const $t = $(e.target);
				// date pickers open outside the panel, on the body
				if ($t.closest(".isd-lpanel, .isd-add, .datepicker").length) return;
				this.toggle_panel(false);
			});
			$(document).on(`keydown${ns}`, e => {
				if (e.key === "Escape" && !this.$panel.prop("hidden")) {
					this.toggle_panel(false);
					this.$add.trigger("focus");
				}
			});
			frappe.router.on("change", () => this.toggle_panel(false));
		}

		toggle_panel(open) {
			this.$panel.prop("hidden", !open);
			this.$add.attr("aria-expanded", String(open));
			this.$bar.toggleClass("is-open", open);
		}

		// core's popover closes on any click outside it, so it opens after this click is done;
		// core centres it 100px left of the button, under the desk sidebar, so it opens
		// from the button's left edge instead
		open_advanced() {
			this.toggle_panel(false);
			const $button = this.list.filter_area.filter_button;
			const popover = $button.data("bs.popover");
			if (popover && popover.config) popover.config.offset = "50%p - 50%r, 6";
			setTimeout(() => $button.popover("show"), 0);
		}

		update() {
			const fa = this.list.filter_area;
			if (!fa || !fa.filter_list) return;
			const chips = core.filter_chips(fa.get(), {
				search_field: this.search_field,
				label_of: (fieldname, doctype) => this.label_of(fieldname, doctype),
				value_of: (fieldname, value, doctype) => this.value_of(fieldname, value, doctype),
				words: { set: t("set"), not_set: t("not set"), not: t("not") },
			});
			this.$chips.empty();
			chips.forEach(chip => {
				$(`<li class="isd-chip">
					<button type="button" class="isd-chip-text"></button>
					<button type="button" class="isd-chip-x" aria-label="${t("Remove filter")}">
						${frappe.utils.icon("close", "xs")}
					</button>
				</li>`)
					.data("chip", chip)
					.appendTo(this.$chips)
					.find(".isd-chip-text").text(chip.text).attr("title", chip.text);
			});
			this.$bar.toggleClass("has-chips", chips.length > 0);
		}

		label_of(fieldname, doctype) {
			if (fieldname === "docstatus") return __("Document Status");
			if (fieldname === "name") return __("ID");
			const label = __(frappe.meta.get_label(doctype, fieldname) || fieldname);
			return doctype && doctype !== this.list.doctype ? `${label} (${__(doctype)})` : label;
		}

		value_of(fieldname, value, doctype) {
			if (fieldname === "docstatus") return __(DOCSTATUS[value] || value);
			const df = frappe.meta.get_docfield(doctype, fieldname) || {};
			// a list formatter (e.g. AGT status "I" -> "Invalid") names the value as the column does
			const format = doctype === this.list.doctype && (this.list.settings.formatters || {})[fieldname];
			if (format) {
				try {
					const text = $("<div>").html(format(value, df, {})).text().trim();
					if (text) return text;
				} catch (e) {
					// a formatter that needs the whole row falls back to the stored value
				}
			}
			if (["Date", "Datetime"].includes(df.fieldtype)) return frappe.datetime.str_to_user(value);
			if (df.fieldtype === "Check") return value == 1 ? __("Yes") : __("No");
			if (df.fieldtype === "Select") return __(value);
			return value;
		}

		is_standard(chip) {
			const field = this.fields[chip.fieldname];
			return Boolean(field && ["=", "like"].includes(chip.condition) && field.get_value());
		}

		find_filter(chip) {
			const same = JSON.stringify([chip.fieldname, chip.condition, chip.value]);
			return this.list.filter_area.filter_list.filters.find(f =>
				f.field && JSON.stringify(f.get_value().slice(1, 4)) === same);
		}

		remove(chip) {
			if (this.is_standard(chip)) {
				// clearing a standard filter fires its own onchange, which refreshes the list
				this.fields[chip.fieldname].set_value("");
				return;
			}
			const filter = this.find_filter(chip);
			if (filter) {
				filter.remove();
				this.list.filter_area.filter_list.apply();
			}
		}

		edit(chip) {
			if (this.is_standard(chip)) {
				this.toggle_panel(true);
				this.fields[chip.fieldname].$input && this.fields[chip.fieldname].$input.trigger("focus");
			} else {
				this.open_advanced();
			}
		}
	}
})();
