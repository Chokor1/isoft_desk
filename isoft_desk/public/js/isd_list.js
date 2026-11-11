// ISOFT Desk list toolbar for the List and Report views: the list's standard
// filters always in view, in core's order, and one chip per filter set through core's
// Filter button. It is built from core's own filter controls (moved, never
// copied), so filtering behaves exactly as in core.
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
			setup_fit(this);
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

	// the table fills the window, so the floating bulk-action bar (core edit, fixed
	// 24px from the bottom) would cover the paging footer; while it shows, the list
	// makes room for it and core sizes the rows again
	const update_bulk_bar = list_proto.update_bulk_bar;
	if (update_bulk_bar) {
		list_proto.update_bulk_bar = function (...args) {
			const out = update_bulk_bar.apply(this, args);
			if (restyled(this) && this.$bulk_bar) {
				const open = this.$bulk_bar.css("display") !== "none";
				if (open !== this.page.wrapper.hasClass("isd-bulk-open")) {
					this.page.wrapper.toggleClass("isd-bulk-open", open);
					this.set_result_height && this.set_result_height();
				}
			}
			return out;
		};
	}

	// the card ends a small margin above the window's bottom edge whatever the
	// rows: the part that shows (rows, the "nothing found" message or the Report
	// view grid's scroll area) stretches or shrinks to fill the room left. Core's
	// sizing measures scrollHeight, which is never below the window, so a short
	// list stopped at 240px; and the Report view grid used a fixed calc(100vh - 250px)
	// that ignored the toolbar, so its card ran past the window
	const FIT_MARGIN = 16;

	function fit_to_window(list) {
		if (!restyled(list) || !list.$frappe_list) return;
		const card = list.$frappe_list.closest(".layout-main-section")[0];
		if (!card || !card.offsetParent) return;
		const $grid = list.view_name === "Report" && list.$result.is(":visible")
			? list.$result.find(".dt-scrollable").first() : $();
		const $box = $grid.length ? $grid : [list.$result, list.$no_result].find($el => $el && $el.is(":visible"));
		if (!$box || !$box.length) return;
		const box = $box[0];
		if ($grid.length) {
			// the result wraps the grid: it takes the grid's height, the grid scrolls
			list.$result.css({ height: "", "min-height": "0", "overflow-y": "", "overflow-x": "" });
		}
		const room = window.innerHeight - FIT_MARGIN - (card.getBoundingClientRect().bottom + window.scrollY);
		const height = Math.max(Math.round(box.getBoundingClientRect().height + room), $grid.length ? 160 : 240);
		if (Math.abs(height - box.getBoundingClientRect().height) < 1) return;
		box.style.setProperty("height", `${height}px`, "important");
		box.style.setProperty("min-height", "0", "important");
		box.style.setProperty("max-height", "none", "important");
		if (!$grid.length) {
			box.style.overflowY = "auto";
			box.style.overflowX = "hidden";
		}
	}

	function setup_fit(list) {
		if (!restyled(list) || list.isd_fit) return;
		let frame = null;
		list.isd_fit = () => {
			if (frame) return;
			frame = requestAnimationFrame(() => {
				frame = null;
				fit_to_window(list);
			});
		};
		// core's resize handler, after_render and the bulk bar call this name
		list.set_result_height = list.isd_fit;
		$(window).on(`resize.isd_fit_${frappe.scrub(list.doctype)}_${list.view_name}`, list.isd_fit);
		if (window.ResizeObserver) {
			// rows arriving, a rebuilt Report grid, its chart, filters wrapping
			const watch = new ResizeObserver(list.isd_fit);
			list.page.wrapper.find(".page-form, .layout-main-section").each((i, el) => watch.observe(el));
		}
		list.isd_fit();
	}

	// the List view sets up core's own sizing after the filter area: take the name back
	const setup_scrollable_result = list_proto.setup_scrollable_result;
	if (setup_scrollable_result) {
		list_proto.setup_scrollable_result = function (...args) {
			const out = setup_scrollable_result.apply(this, args);
			if (this.isd_fit) this.set_result_height = this.isd_fit;
			return out;
		};
	}

	// filters are settled when a refresh starts, so the chips follow every change
	wrap("refresh", function (orig, args) {
		this.isd_bar && this.isd_bar.update();
		return orig.apply(this, args);
	});

	class ListBar {
		constructor(list) {
			this.list = list;
			this.fields = list.page.fields_dict;
			this.make();
			this.update();
			list.set_result_height && list.set_result_height();
		}

		make() {
			const $form = this.list.page.page_form;
			const $standard = $form.find(".standard-filter-section");
			this.$bar = $(`
				<div class="isd-lbar">
					<ul class="isd-chips" aria-label="${t("Active filters")}"></ul>
				</div>
			`).prependTo($form);

			// the list's standard filters stay in view in core's order (ID, title, then
			// the DocType's own), each named by its placeholder and hover title as in core
			$standard.prependTo(this.$bar);
			this.$chips = this.$bar.find(".isd-chips");
			this.bind();
		}

		bind() {
			this.$chips.on("click", ".isd-chip-x", e => {
				this.remove($(e.currentTarget).closest(".isd-chip").data("chip"));
			});
			this.$chips.on("click", ".isd-chip-text", () => this.open_advanced());
		}

		// core's popover closes on any click outside it, so it opens after this click is done
		open_advanced() {
			const $button = this.list.filter_area.filter_button;
			setTimeout(() => $button.popover("show"), 0);
		}

		// chips name only the filters set through core's Filter button; the
		// standard ones already show their value in their own field
		update() {
			const fa = this.list.filter_area;
			if (!fa || !fa.filter_list) return;
			const chips = core.filter_chips(fa.get(), {
				standard_fields: Object.keys(this.fields),
				label_of: (fieldname, doctype) => this.label_of(fieldname, doctype),
				value_of: (fieldname, value, doctype) => this.value_of(fieldname, value, doctype),
				words: { set: t("set"), not_set: t("not set"), not: t("not") },
			});
			Object.values(this.fields).forEach(field => {
				field.$input && field.$input.toggleClass("isd-filled", Boolean(field.get_value()));
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

		find_filter(chip) {
			const same = JSON.stringify([chip.fieldname, chip.condition, chip.value]);
			return this.list.filter_area.filter_list.filters.find(f =>
				f.field && JSON.stringify(f.get_value().slice(1, 4)) === same);
		}

		remove(chip) {
			const filter = this.find_filter(chip);
			if (filter) {
				filter.remove();
				this.list.filter_area.filter_list.apply();
			}
		}
	}
})();
