sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device",
	"ZWITHDRAWAL_APP/ZWITHDRAWAL_APP/UTILS/dataManager"
], function (JSONModel, Device, dataManager) {
	"use strict";

	return {

		createDeviceModel: function () {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		initModel: function () {
			var sUrl = "/sap/opu/odata/sap/zslcm_refund_srv/";
			var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
			dataManager.init(oModel);
		}
	};
});