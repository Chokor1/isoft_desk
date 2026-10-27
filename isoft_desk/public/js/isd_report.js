// ISOFT Desk query and script reports: every filter gets its name above it, and
// once the report has data the filters fold to one line of value chips. The
// filters themselves stay the report's own (which ones, order, defaults,
// mandatory, depends_on): this only labels, folds and reads them.
(function () {
	const conf = (frappe.boot && frappe.boot.isoft_desk) || {};
	if (!conf.active || !frappe.views || !frappe.views.QueryReport) return;

	const t = (text, replace) => __(text, replace, "ISOFT Desk");
	const proto = frappe.views.QueryReport.prototype;
	const plain = html => $("<div>").html(html).text().trim();

	function wrap(name, fn) {
		const orig = proto[name];
		if (!orig) return;
		proto[name] = function (...args) {
			return fn.call(this, orig, args);
		};
	}

	wrap("setup_filters", function (orig, args) {
		// core clears its own fields; the labels around them go with them
		this.page.page_form.find(".isd-rf-item").each((i, el) => {
			const $el = $(el);
			$el.children(".frappe-control").insertBefore($el);
			$el.remove();
		});
		const out = orig.apply(this, args);
		this.page.wrapper.addClass("isd-qr");
		this.isd_autofold = true;
		this.isd_folds().open(true);
		this.isd_folds().label();
		this.isd_folds().render();
		return out;
	});

	wrap("refresh", function (orig, args) {
		const out = orig.apply(this, args);
		Promise.resolve(out).then(() => {
			const folds = this.isd_folds();
			// the first run with data folds the filters; after that they stay as the user left them
			if (this.isd_autofold && this.data && this.data.length) {
				this.isd_autofold = false;
				folds.open(false);
			}
			folds.render();
		});
		return out;
	});

	// amounts read in full: a number column the report sized too narrow
	// ("11 282 625,2…") grows to its widest formatted value. Only the screen
	// changes; the report's own definition and text columns are left alone
	const NUMERIC = ["Currency", "Float", "Int", "Percent"];
	wrap("render_datatable", function (orig, args) {
		const out = orig.apply(this, args);
		try {
			fit_number_columns(this);
		} catch (e) {
			// a report with an unusual grid keeps core's widths
		}
		return out;
	});

	function fit_number_columns(report) {
		const dt = report.datatable;
		if (!dt || !dt.getColumns) return;
		const sample = dt.bodyScrollable && dt.bodyScrollable.querySelector(".dt-cell__content");
		const canvas = fit_number_columns.canvas || (fit_number_columns.canvas = document.createElement("canvas"));
		const ctx = canvas.getContext("2d");
		const style = sample ? getComputedStyle(sample) : null;
		ctx.font = style ? `${style.fontWeight} ${style.fontSize} ${style.fontFamily}` : "13px Inter";
		const pad = style ? parseFloat(style.paddingLeft) + parseFloat(style.paddingRight) + 4 : 20;
		const rows = (report.data || []).slice(0, 1000);

		dt.getColumns().forEach(col => {
			const df = col.docfield || col;
			if (!NUMERIC.includes(df.fieldtype) || !col.id || !rows.length) return;
			let widest = 0;
			rows.forEach(row => {
				const value = row[col.id];
				if (value === null || value === undefined || value === "") return;
				const text = plain(frappe.format(value, df, { always_show_decimals: true }, row));
				widest = Math.max(widest, ctx.measureText(text).width);
			});
			const needed = Math.ceil(widest + pad);
			if (needed > (col.width || 0)) {
				col.width = needed;
				dt.columnmanager.setColumnHeaderWidth(col.colIndex);
				dt.columnmanager.setColumnWidth(col.colIndex);
			}
		});
	}

	// a chart with no number format of its own shows raw floats ("793046833.46");
	// it reads them in the user's number format, as the table does
	wrap("get_chart_options", function (orig, args) {
		const options = orig.apply(this, args);
		if (options && !(options.tooltipOptions && options.tooltipOptions.formatTooltipY)) {
			options.tooltipOptions = Object.assign({}, options.tooltipOptions, {
				formatTooltipY: value => (typeof value === "number" ? format_number(value) : value),
			});
		}
		return options;
	});

	// Set Chart, Create Card and Add Chart to Dashboard are already in core's menu;
	// the header keeps report links and drops these duplicates
	wrap("add_chart_buttons_to_toolbar", function (orig, args) {
		const out = orig.apply(this, args);
		[this.create_chart_button, this.add_to_dashboard_button].forEach($b => $b && $b.addClass("isd-in-menu"));
		this.isd_menu_items();
		return out;
	});

	wrap("add_card_button_to_toolbar", function (orig, args) {
		const out = orig.apply(this, args);
		this.page.wrapper.find(".page-actions .btn").filter((i, el) => $(el).text().trim() === __("Create Card"))
			.addClass("isd-in-menu");
		this.isd_menu_items();
		return out;
	});

	// keep the three tools in the menu even where core only made them buttons
	proto.isd_menu_items = function () {
		const items = [
			[__("Set Chart"), () => this.open_create_chart_dialog(), true],
			[__("Create Card"), () => this.add_card_to_dashboard(), true],
			[__("Add Chart to Dashboard"), () => this.add_chart_to_dashboard(), Boolean(this.chart_fields || this.chart_options)],
		];
		const have = this.page.menu.find(".dropdown-item").map((i, el) => $(el).text().trim()).get();
		items.forEach(([label, action, show]) => {
			if (show && !have.includes(label)) this.page.add_menu_item(label, action);
		});
	};

	proto.isd_folds = function () {
		return this.isd_fold || (this.isd_fold = new Folds(this));
	};

	class Folds {
		constructor(report) {
			this.report = report;
			this.$row = $(`
				<div class="isd-rfold" hidden>
					<div class="isd-rf-chips"></div>
					<button type="button" class="isd-rf-toggle" aria-expanded="true"></button>
				</div>
			`).insertBefore(report.page.page_form);
			this.$row.on("click", ".isd-rf-toggle", () => this.open(!this.is_open));
			this.$row.on("click", ".isd-rf-chip", e => {
				this.open(true);
				const field = this.report.get_filter($(e.currentTarget).attr("data-fieldname"));
				field && field.$input && field.$input.trigger("focus");
			});
		}

		// core builds report filters without labels (the placeholder is the label),
		// so a filled filter ("30", "Due Date") would not say what it is
		label() {
			(this.report.filters || []).forEach(field => {
				if (!field.$wrapper || field.df.fieldtype === "Check" || field.$wrapper.parent().hasClass("isd-rf-item")) return;
				field.$wrapper
					.wrap(`<div class="isd-rf-item"></div>`)
					.before($(`<label class="isd-rf-label"></label>`).text(__(field.df.label || field.df.fieldname)));
				// core names the filter in a tooltip that covers the input on focus; the label says it now
				field.$wrapper.removeAttr("title data-original-title");
				field.$wrapper.tooltip && field.$wrapper.tooltip("dispose");
			});
		}

		open(open) {
			this.is_open = open;
			// open, the row ("Hide filters") follows the filters; folded, it replaces them
			const $form = this.report.page.page_form;
			if (open) this.$row.insertAfter($form);
			else this.$row.insertBefore($form);
			this.report.page.wrapper.toggleClass("isd-rf-folded", !open);
			this.render();
		}

		chips() {
			return (this.report.filters || []).map(field => {
				const df = field.df || {};
				if (df.hidden || field.$wrapper.hasClass("hide-control") || field.$wrapper.css("display") === "none") return null;
				let value = field.get_value();
				if (value === null || value === undefined || value === "" || (Array.isArray(value) && !value.length)) return null;
				const label = __(df.label || df.fieldname);
				if (df.fieldtype === "Check") return value ? { fieldname: df.fieldname, text: label } : null;
				if (df.fieldtype === "Date") value = frappe.datetime.str_to_user(value);
				else if (df.fieldtype === "DateRange" && Array.isArray(value)) value = value.map(v => frappe.datetime.str_to_user(v)).join(" – ");
				else if (Array.isArray(value)) value = value.join(", ");
				else if (df.fieldtype === "Select") value = __(value);
				else if (["Currency", "Float", "Int", "Percent"].includes(df.fieldtype)) value = plain(frappe.format(value, df));
				return { fieldname: df.fieldname, text: `${label}: ${value}` };
			}).filter(Boolean);
		}

		render() {
			const filters = this.report.filters || [];
			this.$row.prop("hidden", !filters.length);
			const $chips = this.$row.find(".isd-rf-chips").empty();
			if (!this.is_open) {
				this.chips().forEach(chip => {
					$(`<button type="button" class="isd-rf-chip"></button>`)
						.attr("data-fieldname", chip.fieldname)
						.attr("title", chip.text)
						.text(chip.text)
						.appendTo($chips);
				});
			}
			const $toggle = this.$row.find(".isd-rf-toggle");
			$toggle.text(this.is_open ? t("Hide filters") : t("Edit filters"));
			$toggle.attr("aria-expanded", String(Boolean(this.is_open)));
			// nothing to fold back to before the first run with data
			$toggle.prop("hidden", this.is_open && !(this.report.data && this.report.data.length));
		}
	}
})();
