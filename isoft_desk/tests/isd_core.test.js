// Run: node --test isoft_desk/tests/isd_core.test.js
const test = require('node:test');
const assert = require('node:assert');
const core = require('../public/js/isd_core.js');

const R = ['isoft-invenza', 'saft-center'];
const H = ['posapp'];
const groups = [
	{ key: 'home', label: 'Home', items: [{ type: 'workspace', name: 'Home', label: 'Home', route: 'home' }] },
	{ key: 'finance', label: 'Finance', items: [
		{ type: 'workspace', name: 'Accounting', label: 'Contabilidade', route: 'accounting' },
		{ type: 'workspace', name: 'Isoft Angola Tax Compliance', label: 'Isoft Angola Tax Compliance', route: 'isoft-angola-tax-compliance' },
	] },
	{ key: 'sales', label: 'Sales', items: [
		{ type: 'workspace', name: 'Selling', label: 'Comércio', route: 'selling' },
		{ type: 'page', name: 'intelize-dashboard', label: 'Intelize', route: 'intelize-dashboard' },
	] },
];

test('route_mode', () => {
	assert.strictEqual(core.route_mode(['posapp'], R, H), 'hidden');
	assert.strictEqual(core.route_mode(['isoft-invenza'], R, H), 'rail');
	assert.strictEqual(core.route_mode(['List', 'Sales Invoice'], R, H), 'normal');
	assert.strictEqual(core.route_mode(['Workspaces', 'Selling'], R, H), 'normal');
	assert.strictEqual(core.route_mode([], R, H), 'normal');
});

test('find_active matches workspaces with spaces and pages', () => {
	assert.deepStrictEqual(core.find_active(groups, ['Workspaces', 'Isoft Angola Tax Compliance']),
		{ group_key: 'finance', item_name: 'Isoft Angola Tax Compliance' });
	assert.deepStrictEqual(core.find_active(groups, ['intelize-dashboard']),
		{ group_key: 'sales', item_name: 'intelize-dashboard' });
	assert.strictEqual(core.find_active(groups, ['List', 'Sales Invoice']), null);
});

test('filter_groups is accent and case insensitive', () => {
	const out = core.filter_groups(groups, 'COMER');
	assert.deepStrictEqual(out.map(g => g.key), ['sales']);
	assert.deepStrictEqual(out[0].items.map(i => i.name), ['Selling']);
	assert.strictEqual(core.filter_groups(groups, '').length, 3);
});


test('landing_workspace falls back to the user\'s own first workspace, not a hard-coded Home', () => {
	const stock_only = [{ key: 'stock', items: [{ type: 'page', name: 'isoft-invenza' }, { type: 'workspace', name: 'Stock' }] }];
	assert.strictEqual(core.landing_workspace(undefined, null, null, stock_only), 'Stock');
	assert.strictEqual(core.landing_workspace(undefined, null, 'POS Awesome', stock_only), 'POS Awesome');
	assert.strictEqual(core.landing_workspace(undefined, 'Selling', 'Home', stock_only), 'Selling');
	assert.strictEqual(core.landing_workspace('Accounting', 'Selling', 'Home', stock_only), 'Accounting');
	assert.strictEqual(core.landing_workspace(undefined, null, null, []), 'Home');
});

test('theme_to_remember keeps only light or dark', () => {
	assert.strictEqual(core.theme_to_remember('dark'), 'dark');
	assert.strictEqual(core.theme_to_remember('Light'), 'light');
	assert.strictEqual(core.theme_to_remember('automatic'), null);
	assert.strictEqual(core.theme_to_remember(null), null);
});

test('direct_item: a group with one module opens it in one click', () => {
	assert.strictEqual(core.direct_item(groups[0]).name, 'Home');
	assert.strictEqual(core.direct_item(groups[1]), null);
	// still direct while searching, judged on the full group, not the filtered one
	const filtered = core.filter_groups(groups, 'contab');
	assert.strictEqual(core.direct_item(filtered[0]), null);
});


test('favorites are gone from the core', () => {
	assert.strictEqual(core.favorite_items, undefined);
	assert.strictEqual(core.side_mode, undefined);
});

test('fullscreen_toggle describes the action the button will take', () => {
	assert.deepStrictEqual(core.fullscreen_toggle(false), { icon: 'expand', label: 'Full screen' });
	assert.deepStrictEqual(core.fullscreen_toggle(true), { icon: 'collapse', label: 'Exit full screen' });
});

test('effective_route: bare /app means the workspace it shows', () => {
	assert.deepStrictEqual(core.effective_route([''], 'Home'), ['Workspaces', 'Home']);
	assert.deepStrictEqual(core.effective_route([], 'Home'), ['Workspaces', 'Home']);
	assert.deepStrictEqual(core.effective_route(['Workspaces'], 'Stock'), ['Workspaces', 'Stock']);
	assert.deepStrictEqual(core.effective_route(['Workspaces', 'Selling'], 'Home'), ['Workspaces', 'Selling']);
	assert.deepStrictEqual(core.effective_route(['List', 'Item'], 'Home'), ['List', 'Item']);
});

const LABELS = { company: 'Company', status: 'Status', grand_total: 'Grand Total', posting_date: 'Date', docstatus: 'Document Status', title: 'Title' };
const opts = {
	standard_fields: ['name', 'title', 'customer'],
	label_of: f => LABELS[f] || f,
	value_of: (f, v) => (f === 'docstatus' ? ({ 0: 'Draft', 1: 'Submitted', 2: 'Cancelled' })[v] : v),
	words: { set: 'set', not_set: 'not set', not: 'not' },
};
const texts = filters => core.filter_chips(filters, opts).map(c => c.text);

test('filter_chips: equals and like read as Label: value', () => {
	assert.deepStrictEqual(texts([
		['Sales Invoice', 'company', '=', 'ITEC LDA'],
		['Sales Invoice', 'status', 'like', '%Overdue%'],
	]), ['Company: ITEC LDA', 'Status: Overdue']);
});

test('filter_chips: standard filter fields and hidden filters get no chip', () => {
	assert.deepStrictEqual(texts([
		['Sales Invoice', 'title', 'like', '%mango%'],
		['Sales Invoice', 'customer', '=', 'ACME'],
		['Sales Invoice', 'company', '=', 'ITEC LDA', true],
		['Sales Invoice', 'status', '=', 'Paid', false],
	]), ['Status: Paid']);
});

test('filter_chips: a standard field set through the Filter button with another condition keeps its chip', () => {
	assert.deepStrictEqual(texts([
		['Sales Invoice', 'customer', '!=', 'ACME'],
		['Sales Invoice', 'customer', 'in', ['A', 'B']],
	]), ['customer: not ACME', 'customer: A, B']);
});

test('filter_chips: comparisons, lists, ranges and set/not set', () => {
	assert.deepStrictEqual(texts([
		['Sales Invoice', 'grand_total', '>', 1000],
		['Sales Invoice', 'status', 'in', ['Overdue', 'Unpaid']],
		['Sales Invoice', 'status', 'not in', 'Paid,Return'],
		['Sales Invoice', 'posting_date', 'Between', ['2026-01-01', '2026-03-31']],
		['Sales Invoice', 'company', 'is', 'set'],
		['Sales Invoice', 'company', 'is', 'not set'],
		['Sales Invoice', 'status', '!=', 'Paid'],
	]), [
		'Grand Total > 1000',
		'Status: Overdue, Unpaid',
		'Status: not Paid, Return',
		'Date: 2026-01-01 – 2026-03-31',
		'Company: set',
		'Company: not set',
		'Status: not Paid',
	]);
});

test('filter_chips: docstatus values read as names; each chip keeps its filter', () => {
	const chips = core.filter_chips([['Sales Invoice', 'docstatus', '=', '1', false]], opts);
	assert.strictEqual(chips[0].text, 'Document Status: Submitted');
	assert.strictEqual(chips[0].fieldname, 'docstatus');
	assert.strictEqual(chips[0].condition, '=');
});

test('filter_chips: labels and values are looked up on the filter\'s own DocType', () => {
	const seen = [];
	const chips = core.filter_chips([['Sales Invoice Item', 'item_code', '=', 'KIT-1']], Object.assign({}, opts, {
		label_of: (f, dt) => { seen.push(dt); return `${f}@${dt}`; },
		value_of: (f, v, dt) => `${v}@${dt}`,
	}));
	assert.strictEqual(chips[0].text, 'item_code@Sales Invoice Item: KIT-1@Sales Invoice Item');
	assert.strictEqual(chips[0].doctype, 'Sales Invoice Item');
});

const SI_FIELDS = {
	net_total: { label: 'Net Total' }, total_taxes_and_charges: { label: 'Total Taxes and Charges' },
	grand_total: { label: 'Grand Total' }, outstanding_amount: { label: 'Outstanding Amount' },
	due_date: { label: 'Payment Due Date' }, items: { label: 'Items' },
};
const SI_DOC = {
	docstatus: 1, net_total: 595361.76, total_taxes_and_charges: 83350.65, grand_total: 678712.41,
	outstanding_amount: 450370.41, due_date: '2026-02-11', items: new Array(23).fill({}),
};

test('form_summary: an overdue invoice reads totals, red outstanding and days late', () => {
	const cells = core.form_summary(SI_DOC, SI_FIELDS, '2026-10-26');
	assert.deepStrictEqual(cells.map(c => c.fieldname),
		['net_total', 'total_taxes_and_charges', 'grand_total', 'outstanding_amount', 'due_date', 'items']);
	assert.strictEqual(cells.find(c => c.fieldname === 'outstanding_amount').tone, 'bad');
	assert.strictEqual(cells.find(c => c.fieldname === 'due_date').late_days, 257);
	assert.strictEqual(cells.find(c => c.fieldname === 'items').count, 23);
	assert.strictEqual(cells[0].label, 'Net Total');
});

test('form_summary: only fields the form shows; none without a grand total', () => {
	const fields = Object.assign({}, SI_FIELDS);
	delete fields.total_taxes_and_charges;
	delete fields.outstanding_amount;
	const cells = core.form_summary(SI_DOC, fields, '2026-10-26');
	assert.deepStrictEqual(cells.map(c => c.fieldname), ['net_total', 'grand_total', 'due_date', 'items']);
	assert.strictEqual(cells.find(c => c.fieldname === 'due_date').late_days, null);
	assert.deepStrictEqual(core.form_summary({ docstatus: 0 }, { items: { label: 'Items' } }, '2026-10-26'), []);
});

test('form_summary: a draft shows no outstanding; zero tax and empty dates are left out', () => {
	const doc = Object.assign({}, SI_DOC, { docstatus: 0, total_taxes_and_charges: 0, due_date: null });
	assert.deepStrictEqual(core.form_summary(doc, SI_FIELDS, '2026-10-26').map(c => c.fieldname),
		['net_total', 'grand_total', 'items']);
});

test('form_summary: a paid or not yet due invoice is not red', () => {
	const paid = Object.assign({}, SI_DOC, { outstanding_amount: 0 });
	assert.strictEqual(core.form_summary(paid, SI_FIELDS, '2026-10-26').find(c => c.fieldname === 'outstanding_amount').tone, null);
	const future = Object.assign({}, SI_DOC, { due_date: '2026-11-30' });
	const cells = core.form_summary(future, SI_FIELDS, '2026-10-26');
	assert.strictEqual(cells.find(c => c.fieldname === 'outstanding_amount').tone, null);
	assert.strictEqual(cells.find(c => c.fieldname === 'due_date').late_days, null);
});

test('section_links: visible sections with a label, in the DocType order', () => {
	assert.deepStrictEqual(core.section_links([
		{ index: 0, label: null, visible: true },
		{ index: 1, label: 'FE Angola Status', visible: true },
		{ index: 2, label: 'Currency and Price List', visible: false },
		{ index: 3, label: '  ', visible: true },
		{ index: 4, label: 'Items', visible: true },
	]), [{ index: 1, label: 'FE Angola Status' }, { index: 4, label: 'Items' }]);
});

test('active_section: the last section whose top has passed the line', () => {
	assert.strictEqual(core.active_section([400, 900, 1500], 200), -1);
	assert.strictEqual(core.active_section([400, 900, 1500], 400), 0);
	assert.strictEqual(core.active_section([400, 900, 1500], 1200), 1);
	assert.strictEqual(core.active_section([400, 900, 1500], 5000), 2);
});
