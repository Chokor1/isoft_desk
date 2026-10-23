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
