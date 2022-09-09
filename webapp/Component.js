sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"ZWITHDRAWAL_APP/ZWITHDRAWAL_APP/model/models",
	"ZWITHDRAWAL_APP/ZWITHDRAWAL_APP/UTILS/dataManager"
], function (UIComponent, Device, models, dataManager) {
	"use strict";

	return UIComponent.extend("ZWITHDRAWAL_APP.ZWITHDRAWAL_APP.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();

			// set the device model
			// sap.ui.getCore().setModel(models.createDeviceModel(), "device");
			this.setModel(models.createDeviceModel(), "device");
			var sUrl = "/sap/opu/odata/sap/ZSLCM_REFUND_SRV/";
			var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
			sap.ui.getCore().setModel(oModel);
			dataManager.init(oModel);
			// models.initModel();
		}
	});
});