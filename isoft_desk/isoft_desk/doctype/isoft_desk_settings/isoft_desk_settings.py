from frappe.model.document import Document

from isoft_desk.activation import clear_settings_cache


class IsoftDeskSettings(Document):
	def on_update(self):
		clear_settings_cache()
