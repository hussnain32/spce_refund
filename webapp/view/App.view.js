sap.ui.jsview("ZWITHDRAWAL_APP.ZWITHDRAWAL_APP.view.App", {

	getControllerName: function () {
		return "ZWITHDRAWAL_APP.ZWITHDRAWAL_APP.controller.App";
	},

	createContent: function (oController) {

		// to avoid scroll bars on desktop the root view must be set to block display
		this.setDisplayBlock(true);

		// create app
		this.app = new sap.m.App();

		// load the master page
		var master = sap.ui.xmlview("main", "ZWITHDRAWAL_APP.ZWITHDRAWAL_APP.view.main");
		master.getController().nav = this.getController();
		this.app.addPage(master, true);

		// load the empty page
		//var empty = sap.ui.xmlview("Empty", "WF_STAGE2.Z_FAF_WF_STAGE.view.Empty");
		//this.app.addPage(empty, false);

		// wrap app with shell
		return new sap.m.Shell("Shell", {
			title: "{i18n>title}",
			showLogout: false,
			app: this.app
		});
	}
});