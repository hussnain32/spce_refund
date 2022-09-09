sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("ZWITHDRAWAL_APP.ZWITHDRAWAL_APP.controller.App", {
		to: function (pageId, context) {
			var app = this.getView().app;

			// load page on demand
			var master = (pageId === "main");
			var page = null;
			if (app.getPage(pageId, master) === null) {
				page = sap.ui.view({
					id: pageId,
					viewName: "ZWITHDRAWAL_APP.ZWITHDRAWAL_APP.view." + pageId,
					type: "XML"
				});
				page.getController().nav = this;
				app.addPage(page, master);
				jQuery.sap.log.info("app controller > loaded page: " + pageId);
			}

			// show the page
			app.to(pageId);

			// set data context on the page
			if (context) {
				page = app.getPage(pageId);
				page.setBindingContext(context);
			}
		},

		/**
		 * Navigates back to a previous page
		 * @param {string} pageId The id of the next page
		 */
		back: function (pageId) {
			this.getView().app.backToPage(pageId);
		}
	});
});