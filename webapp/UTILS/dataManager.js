sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function () {
	"use strict";

	var oModel = null;
	return {
		init: function (oDataModel) {
			oModel = oDataModel;
			oModel.setCountSupported(false);
		},

		getRFData: function (successCallBack, errorCallBack) {
			var sPath = "REFUND_DATASet(IvAction='01',IvGet='')";
			oModel.read(sPath, null, null, true, function (success) {
				successCallBack(success);
			}, function (error) {
				errorCallBack(error);
			});
		},
		postRFData: function (sPath, oContext, sucessCallback, errorCallback) {
			oModel.create(sPath, oContext, null, sucessCallback, errorCallback);
		},
		_postData: function (sPath, oContext, sucessCallback, errorCallback) {
			oModel.create(sPath, oContext, null, sucessCallback, errorCallback);
		},
		postRF: function (oObject, sucessCallback, errorCallback) {
			var sPath = "Refund_createDataSet";
			var oJson = JSON.stringify(oObject);
			this._postData(sPath, {
					"IvAction": "02",
					"IvGet": oJson
				},
				function (objResponse) {
					sucessCallback(objResponse);
				},
				function (objResponse) {
					errorCallback(objResponse);
				});
		},

		postSel: function (oObject, sucessCallback, errorCallback) {
			var sPath = "Refund_createDataSet";
			var oJson = JSON.stringify(oObject);
			this._postData(sPath, {
					"IvAction": "32",
					"IvGet": oJson
				},
				function (objResponse) {
					sucessCallback(objResponse);
				},
				function (objResponse) {
					errorCallback(objResponse);
				});
		},

		getF4Intake: function (successCallBack, errorCallBack) {
			var sPath = "REFUND_DATASet(IvAction='41',IvGet='')";
			oModel.read(sPath, null, null, true, function (success) {
				successCallBack(success);
			}, function (error) {
				errorCallBack(error);
			});
		},
		getF4Program: function (oObject, sucessCallback, errorCallback) {
			var sPath = "Refund_createDataSet";
			var oJson = JSON.stringify(oObject);
			this._postData(sPath, {
					"IvAction": "42",
					"IvGet": oJson
				},
				function (objResponse) {
					sucessCallback(objResponse);
				},
				function (objResponse) {
					errorCallback(objResponse);
				});
		},
		getF4Course: function (oObject, sucessCallback, errorCallback) {
			var sPath = "Refund_createDataSet";
			var oJson = JSON.stringify(oObject);
			this._postData(sPath, {
					"IvAction": "43",
					"IvGet": oJson
				},
				function (objResponse) {
					sucessCallback(objResponse);
				},
				function (objResponse) {
					errorCallback(objResponse);
				});
		}
	};
});