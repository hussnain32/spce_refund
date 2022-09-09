sap.ui.define([],
	function () {

		return {
		
			attachIcon: function (sValue) {
				if (sValue === "jpg" || sValue === "jpeg" || sValue === "png") {
					return "sap-icon://background";
				}
				if (sValue === "pdf") {
					return "sap-icon://pdf-attachment";
				}
				if (sValue === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || sValue === "application/msword" || sValue ===
					"doc" || sValue === "docx") {
					return "sap-icon://doc-attachment";
				}
				if (sValue === "plain") {
					return "sap-icon://document-text";
				}
				if (sValue === "vnd.openxmlformats-officedocument.spreadsheetml.sheet" || sValue === "application/vnd.ms-excel" || sValue === "xls" ||
					sValue === "xlsx") {
					return "sap-icon://excel-attachment";
				} else {
					return "sap-icon://document";
				}
			}

		};
	});