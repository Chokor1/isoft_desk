// Remembers this browser's last desk theme so the login page can open in it
// (read by the early script from isoft_desk/login_theme.py). Runs for every desk
// user, pilot or not: the login page is shared and knows no user.
(function () {
	const root = document.documentElement;
	function remember() {
		const theme = window.isd_core && window.isd_core.theme_to_remember(root.getAttribute("data-theme"));
		if (!theme) return;
		try {
			localStorage.setItem("isoft_theme", theme);
		} catch (e) {
			// storage blocked: the login page falls back to the system preference
		}
	}
	remember();
	new MutationObserver(remember).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
})();
