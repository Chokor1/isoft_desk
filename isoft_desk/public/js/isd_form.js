// ISOFT Desk forms: a compact Connections row, a totals strip on transactions and
// links to the form's own sections. Fields, sections and columns stay exactly as
// the DocType and Customize Form define them: nothing here moves, hides or
// regroups a field; it only reads the form and calls core's own methods.
(function () {
	const conf = (frappe.boot && frappe.boot.isoft_desk) || {};
	if (!conf.active || !frappe.ui.form.Dashboard) return;

	const core = window.isd_core;
	const t = (text, replace) => __(text, replace, "ISOFT Desk");
	const SUMMARY_FIELDS = [
		"net_total", "total_taxes_and_charges", "grand_total", "outstanding_amount",
		"due_date", "valid_till", "schedule_date", "delivery_date", "items",
	];
	const reduced_motion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	const plain = html => $("<div>").html(html).text().trim();

	$(document).on("form-refresh", (e, frm) => {
		if (!frm || !frm.layout || !frm.layout.wrapper) return;
		(frm.isd_head || (frm.isd_head = new FormHead(frm))).refresh();
	});

	// link counts arrive after the dashboard has drawn; the compact row follows them
	const set_badge_count = frappe.ui.form.Dashboard.prototype.set_badge_count;
	frappe.ui.form.Dashboard.prototype.set_badge_count = function (...args) {
		const out = set_badge_count.apply(this, args);
		this.frm && this.frm.isd_head && this.frm.isd_head.soon();
		return out;
	};

	class FormHead {
		constructor(frm) {
			this.frm = frm;
			this.open = false;
			this.$head = $(`
				<div class="isd-fhead">
					<div class="isd-conn" hidden>
						<span class="isd-conn-links"></span>
						<button type="button" class="isd-conn-toggle" aria-expanded="false"></button>
					</div>
					<div class="isd-sum" hidden></div>
				</div>
			`);
			this.$nav = $(`
				<nav class="isd-secnav" aria-label="${t("Sections")}" hidden>
					<div class="isd-secnav-track"></div>
				</nav>
			`);
			const $message = frm.layout.wrapper.children(".form-message").first();
			if ($message.length) {
				this.$head.insertAfter($message);
			} else {
				this.$head.prependTo(frm.layout.wrapper);
			}
			this.$nav.insertAfter(this.$head);
			this.bind();
		}

		bind() {
			this.$head.on("click", ".isd-conn-toggle", () => {
				this.open = !this.open;
				this.render_connections();
				// a heatmap drawn while folded has no width; draw it again now it shows
				if (this.open && this.frm.dashboard.data && this.frm.dashboard.data.heatmap) {
					this.frm.dashboard.render_heatmap();
				}
			});
			this.$head.on("click", ".isd-conn-link", e => {
				$(e.currentTarget).data("link").find(".badge-link").trigger("click");
			});
			this.$head.on("click", ".isd-sum-cell", e => {
				this.frm.scroll_to_field($(e.currentTarget).attr("data-fieldname"));
			});
			this.$nav.on("click", ".isd-secnav-link", e => {
				this.go_to(Number($(e.currentTarget).attr("data-index")));
			});
			this.$nav.find(".isd-secnav-track").on("scroll", () => this.spy());

			frappe.model.on(this.frm.doctype, "*", (fieldname, value, doc) => {
				if (doc && this.frm.doc && doc.name === this.frm.doc.name) this.soon();
			});

			let ticking = false;
			$(window).on("scroll resize", () => {
				if (ticking || !this.is_current()) return;
				ticking = true;
				requestAnimationFrame(() => {
					ticking = false;
					this.spy();
				});
			});
		}

		is_current() {
			return window.cur_frm === this.frm && this.frm.page.wrapper.is(":visible");
		}

		soon() {
			clearTimeout(this.timer);
			this.timer = setTimeout(() => this.refresh(), 150);
		}

		refresh() {
			this.render_connections();
			this.render_summary();
			this.render_nav();
		}

		// ---- Connections: one row of the links that have records ----
		render_connections() {
			const dash = this.frm.dashboard;
			const $dash = this.frm.layout.wrapper.find(".form-dashboard").first();
			const $links = $dash.find(".form-links");
			const has_links = !this.frm.is_new() && $links.length && $links[0].style.display !== "none";
			const has_heatmap = !this.frm.is_new() && dash.data && dash.data.heatmap;
			const $row = this.$head.find(".isd-conn");

			if (!has_links && !has_heatmap) {
				$row.prop("hidden", true);
				$dash.removeClass("isd-dash-folded isd-dash-empty");
				return;
			}

			const $chips = $row.find(".isd-conn-links").empty();
			const $all = $links.find(".document-link");
			$all.each((i, el) => {
				const $link = $(el);
				const count = $link.find(".count:not(.hidden)").text().trim();
				if (!count) return;
				// a link back to this DocType ("Sales Invoice" under Returns) or one listed in
				// two groups is named by its group, as core's block heads it
				const doctype = $link.attr("data-doctype");
				const name = $link.find(".badge-link").text().trim();
				const twice = $all.filter(`[data-doctype="${CSS.escape(doctype)}"]`).length > 1;
				const group = $link.closest(".col-md-4").find(".form-link-title").first().text().trim();
				const text = (doctype === this.frm.doctype || twice) && group ? group : name;
				$(`<button type="button" class="isd-conn-link"><span></span><b></b></button>`)
					.data("link", $link)
					.attr("title", name)
					.find("span").text(text).end()
					.find("b").text(count).end()
					.appendTo($chips);
			});

			const $toggle = $row.find(".isd-conn-toggle");
			$toggle.text(this.open ? t("Hide connections") : t("Show all connections"));
			$toggle.attr("aria-expanded", String(this.open));
			$row.prop("hidden", false);

			// the folded card disappears when nothing else of the dashboard (progress,
			// indicators, a custom section) is showing
			$dash.toggleClass("isd-dash-folded", !this.open);
			const others = $dash.children(".form-dashboard-section")
				.not(".form-links, .form-heatmap")
				.filter((i, el) => el.style.display !== "none" && !$(el).hasClass("hidden"));
			$dash.toggleClass("isd-dash-empty", !this.open && !others.length);
		}

		// ---- totals strip on transactions ----
		summary_fields() {
			const fields = {};
			SUMMARY_FIELDS.forEach(fieldname => {
				const field = this.frm.fields_dict[fieldname];
				if (!field || !field.df || field.df.hidden || field.disp_status === "None") return;
				fields[fieldname] = { label: __(field.df.label) };
			});
			return fields;
		}

		render_summary() {
			const doc = this.frm.doc;
			const cells = core.form_summary(doc, this.summary_fields(), frappe.datetime.get_today());
			const $sum = this.$head.find(".isd-sum").empty().prop("hidden", !cells.length);

			cells.forEach(cell => {
				const df = this.frm.fields_dict[cell.fieldname].df;
				let value;
				if (cell.kind === "money") value = plain(frappe.format(doc[cell.fieldname], df, { inline: true }, doc));
				else if (cell.kind === "date") value = frappe.datetime.str_to_user(doc[cell.fieldname]);
				else value = String(cell.count);

				const $cell = $(`<button type="button" class="isd-sum-cell">
					<span class="isd-sum-label"></span>
					<span class="isd-sum-value"></span>
				</button>`).attr("data-fieldname", cell.fieldname).toggleClass("is-bad", cell.tone === "bad");
				// ERPNext appends the currency to money labels ("Grand Total (AKZ)") while the
				// value already carries it; the line count is named apart from the Items section
				const label = cell.kind === "money" ? cell.label.replace(/\s*\([A-Z]{3}\)$/, "")
					: cell.kind === "count" ? t("Lines") : cell.label;
				$cell.find(".isd-sum-label").text(label);
				$cell.find(".isd-sum-value").text(value);
				if (cell.late_days) {
					$(`<span class="isd-sum-late"></span>`)
						.text(cell.late_days === 1 ? t("1 day late") : t("{0} days late", [cell.late_days]))
						.appendTo($cell.find(".isd-sum-value"));
				}
				$sum.append($cell);
			});
		}

		// ---- links to the form's own sections ----
		render_nav() {
			const sections = this.frm.layout.sections || [];
			this.links = core.section_links(sections.map((section, index) => ({
				index,
				label: section.df && section.df.label ? __(section.df.label) : null,
				visible: section.wrapper && !section.wrapper.hasClass("empty-section")
					&& !section.wrapper.hasClass("hide-control") && section.wrapper.css("display") !== "none",
			})));

			// form scripts show and hide sections after the refresh (toggle_display,
			// depends_on); the links follow the sections' own class and style
			this.observer = this.observer || new MutationObserver(() => this.soon());
			sections.forEach(section => {
				if (section.wrapper && !section.isd_watched) {
					this.observer.observe(section.wrapper[0], { attributes: true, attributeFilter: ["class", "style"] });
					section.isd_watched = true;
				}
			});

			// a single section needs no navigation
			this.$nav.prop("hidden", this.links.length < 2);
			const $track = this.$nav.find(".isd-secnav-track").empty();
			this.links.forEach(link => {
				$(`<button type="button" class="isd-secnav-link"></button>`)
					.attr("data-index", link.index)
					.text(link.label)
					.appendTo($track);
			});
			this.place_nav();
			this.spy();
		}

		// the links stick under core's sticky page head
		place_nav() {
			const head = this.frm.page.wrapper.find(".page-head")[0];
			if (!head) return;
			const top = (parseFloat(getComputedStyle(head).top) || 0) + head.offsetHeight;
			this.$nav.css("top", `${top}px`);
		}

		// the reading line just under the links once they stick (not where they sit
		// before the page scrolls, or a jump would stop short by the head's height)
		line() {
			return (parseFloat(this.$nav.css("top")) || 0) + this.$nav[0].offsetHeight + 8;
		}

		go_to(index) {
			const section = this.frm.layout.sections[index];
			if (!section) return;
			if (section.is_collapsed && section.is_collapsed()) section.collapse(false);
			// land the section's head just under the links, where spy() counts it as current
			const top = section.wrapper[0].getBoundingClientRect().top + window.scrollY - this.line() + 1;
			window.scrollTo({ top: Math.max(0, top), behavior: reduced_motion() ? "auto" : "smooth" });
		}

		spy() {
			if (!this.links || this.$nav.prop("hidden")) return;
			// stuck under the head, the links join it: one white band, one rule
			const stuck = this.$nav[0].getBoundingClientRect().top <= (parseFloat(this.$nav.css("top")) || 0) + 0.5
				&& window.scrollY > 0;
			this.$nav.toggleClass("is-stuck", stuck);
			this.frm.page.wrapper.toggleClass("isd-secnav-stuck", stuck);
			const track = this.$nav.find(".isd-secnav-track")[0];
			this.$nav.toggleClass("has-more", track.scrollLeft + track.clientWidth < track.scrollWidth - 1);
			const sections = this.frm.layout.sections;
			// a section hidden since the links were drawn has no box; it never counts as passed
			const tops = this.links.map(link => {
				const el = sections[link.index].wrapper[0];
				return el.offsetParent && el.offsetHeight ? el.getBoundingClientRect().top : Infinity;
			});
			// before the links stick, the line sits under them where they are, so nothing
			// above them on the first screen is called current
			const line = Math.max(this.line(), this.$nav[0].getBoundingClientRect().bottom + 8);
			const active = core.active_section(tops, line);
			const $buttons = this.$nav.find(".isd-secnav-link");
			$buttons.removeClass("is-active").removeAttr("aria-current");
			if (active < 0) return;
			const $active = $buttons.eq(active).addClass("is-active").attr("aria-current", "true");
			const el = $active[0];
			// keep the current link in view along the row without scrolling the page
			if (el.offsetLeft < track.scrollLeft || el.offsetLeft + el.offsetWidth > track.scrollLeft + track.clientWidth) {
				track.scrollLeft = el.offsetLeft - 16;
			}
		}
	}
})();
