/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"ZWITHDRAWAL_APP/ZWITHDRAWAL_APP/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});