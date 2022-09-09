function _arrayBufferToBase64(buffer) {
	var binary = '';
	var bytes = new Uint8Array(buffer);
	var len = bytes.byteLength;
	for (var i = 0; i < len; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	return window.btoa(binary);
}
var fileObject = {};

function buff(e) {
	var base64 = _arrayBufferToBase64(e.target.result);
	fileObject.CONTENT = base64;
}
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/Token",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/Text",
	"sap/m/Label",
	"sap/m/TextArea",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/core/Fragment",
	"ZWITHDRAWAL_APP/ZWITHDRAWAL_APP/UTILS/dataManager",
	"ZWITHDRAWAL_APP/ZWITHDRAWAL_APP/model/formatter"
	// "sap/ui/core/BusyIndicator"
], function (Controller, JSONModel, Token, Dialog, Button, Text, Label, TextArea, MessageToast, MessageBox, Fragment, dataManager,
	formatter) {
	"use strict";

	return Controller.extend("ZWITHDRAWAL_APP.ZWITHDRAWAL_APP.controller.main", {
		reader: {},
		arr_attachment: [],
		arr_attachment_oth: [],
		oF4Intake: {},
		formatter: formatter,
		onInit: function () {
			var oBusy = new sap.m.BusyDialog();
			oBusy.open();
			var oView = this.getView();

			var oPanel = sap.ui.getCore().byId("main").byId("pnlHeader");
			oPanel.setVisible(false);
			oPanel = sap.ui.getCore().byId("main").byId("pnlData");
			oPanel.setVisible(false);
			oPanel = sap.ui.getCore().byId("main").byId("pnlUpload");
			oPanel.setVisible(false);
			oPanel = sap.ui.getCore().byId("main").byId("note1");
			oPanel.setVisible(false);
			var oBtn = sap.ui.getCore().byId("main").byId("submit");
			oBtn.setVisible(false);

			var oVouchList = oView.byId("vouchList");
			// add oDataidator
			var fnValidator = function (args) {
				var text = args.text;

				return new Token({
					key: text,
					text: text
				});
			};
			oVouchList.addValidator(fnValidator);

			oBusy.close();
		},
		onAfterRendering: function () {
			debugger;
			var that = this;
			var oBusy = new sap.m.BusyDialog();
			oBusy.open();

			var oShell = sap.ui.getCore().byId('Shell');

			var oModel = {
				intake_no: '',
				student12: '',
				program_id: '',
				course_id: '',
				begda: '',
				endda: '',
				msg_typ: '',
				msg: ''
			};
			var oSelectionModel = new JSONModel(oModel);
			oShell.setModel(oSelectionModel, "SelData");

			dataManager.getF4Intake(function (response) {
				var oData = JSON.parse(response.IvJson);
				var oModel = new JSONModel(oData);
				sap.ui.getCore().byId("main").setModel(oModel, 'oF4Intake');
			}, function (error) {
				console.log("error");
			});

			var that = this;
			this.reader = new FileReader();
			this.reader.onload = buff;

			oBusy.close();
		},
		b64toBlob: function (b64Data, contentType, sliceSize) {
			contentType = contentType || '';
			sliceSize = sliceSize || 512;
			var byteCharacters = atob(b64Data);
			var byteArrays = [];
			for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
				var slice = byteCharacters.slice(offset, offset + sliceSize);
				var byteNumbers = new Array(slice.length);
				for (var i = 0; i < slice.length; i++) {
					byteNumbers[i] = slice.charCodeAt(i);
				}
				var byteArray = new Uint8Array(byteNumbers);
				byteArrays.push(byteArray);
			}
			var blob = new Blob(byteArrays, {
				type: contentType
			});
			return blob;
		},
		UploadedFileShow: function (oEvent) {
			debugger;
			var that = this;
			var selectedFile = oEvent.getParameters().listItem.mProperties.title;
			that.arr_attachment.forEach(function (item, index) {
				if (item.filename === selectedFile) {
					if (that.arr_attachment[index].mimetype.toLowerCase() === 'jpeg' || that.arr_attachment[index].mimetype.toLowerCase() === 'jpg') {
						var blob = that.b64toBlob(that.arr_attachment[index].value, 'image/jpeg');
						var blobUrl = URL.createObjectURL(blob);
						window.open(blobUrl);
					} else if (that.arr_attachment[index].mimetype.toLowerCase() === 'pdf') {
						var blob = that.b64toBlob(that.arr_attachment[index].value, 'application/pdf');
						var blobUrl = URL.createObjectURL(blob);
						window.open(blobUrl);
					} else if (that.arr_attachment[index].mimetype.toLowerCase() === 'png') {
						var blob = that.b64toBlob(that.arr_attachment[index].value, 'image/png');
						var blobUrl = URL.createObjectURL(blob);
						window.open(blobUrl);
					} else if (that.arr_attachment[index].mimetype.toLowerCase() === 'xls' || that.arr_attachment[index].mimetype.toLowerCase() ===
						'xlsx') {
						var blob = that.b64toBlob(that.arr_attachment[index].value, 'application/vnd.ms-excel');
						var blobUrl = URL.createObjectURL(blob);
						window.open(blobUrl);
					} else if (that.arr_attachment[index].mimetype.toLowerCase() === 'doc' || that.arr_attachment[index].mimetype.toLowerCase() ===
						'docx') {
						var blob = that.b64toBlob(that.arr_attachment[index].value, 'application/msword');
						var blobUrl = URL.createObjectURL(blob);
						window.open(blobUrl);
					} else if (that.arr_attachment[index].mimetype.toLowerCase() === 'ppt') {
						var blob = that.b64toBlob(that.arr_attachment[index].value, 'application/vnd.ms-powerpoint');
						var blobUrl = URL.createObjectURL(blob);
						window.open(blobUrl);
					}
				}
			})
		},
		handleFileDelete: function (oEvent) {
			var fileName = oEvent.mParameters.listItem.mProperties.title;
			var that = this;
			var dialog = new Dialog({
				title: 'Confirm',
				type: 'Message',
				content: new Text({
					text: 'Do You Want To Delete File: ' + fileName + "?"
				}),
				beginButton: new Button({
					type: sap.m.ButtonType.Emphasized,
					text: 'Yes',
					press: function () {
						dialog.close();
						for (var i = 0; i < that.arr_attachment.length; i++) {
							if (that.arr_attachment[i].filename === fileName) {
								that.arr_attachment.splice(i, 1);
							}
						}

						var Attachment = new sap.ui.model.json.JSONModel();
						Attachment.setData(that.arr_attachment);
						Attachment = sap.ui.getCore().byId("main").getModel('AttachList').refresh();
						MessageToast.show('File ' + fileName + ' Deleted');
					}
				}),
				endButton: new Button({
					text: 'No',
					press: function () {
						dialog.close();
					}
				}),
				afterClose: function () {
					dialog.destroy();
				}
			});
			dialog.open();
		},

		handleUploadComplete: function (oEvent, oValue) {
			var oBusy = new sap.m.BusyDialog();
			oBusy.open();

			var that = this;

			var sInput = this.getView().byId('vouchAttach');
			sInput.setValueState("None");

			var oFile = oEvent.getParameter("files")[0];
			fileObject = {};
			that.reader.readAsArrayBuffer(oFile);
			// console.log(fileObject);
			debugger;
			var filedetail = oFile.name.split('.', 3)
				// var pernr = sap.ui.getCore().byId('Shell').getModel('oSelectePernr').getData().empNo;
			setTimeout(function () {
				console.log(fileObject.CONTENT);

				var obj = {
					"fid": '',
					"rfid": '',
					"atype": 'VO',
					"filename": filedetail[0],
					"endda": '',
					"mimetype": filedetail[filedetail.length - 1].toLowerCase(),
					"sydats": '',
					"sytims": '',
					"uname": '',
					"value": fileObject.CONTENT
				};

				that.arr_attachment.push(obj);
				var Attachment = new sap.ui.model.json.JSONModel();
				Attachment.setData(that.arr_attachment);
				sap.ui.getCore().byId("main").setModel(Attachment, 'AttachList');
				oBusy.close();
			}, 5000);

		},
		oth_UploadedFileShow: function (oEvent) {
			debugger;
			var that = this;
			var selectedFile = oEvent.getParameters().listItem.mProperties.title;
			that.arr_attachment_oth.forEach(function (item, index) {
				if (item.filename === selectedFile) {
					if (that.arr_attachment_oth[index].mimetype.toLowerCase() === 'jpeg' || that.arr_attachment_oth[index].mimetype.toLowerCase() ===
						'jpg') {
						var blob = that.b64toBlob(that.arr_attachment_oth[index].value, 'image/jpeg');
						var blobUrl = URL.createObjectURL(blob);
						window.open(blobUrl);
					} else if (that.arr_attachment_oth[index].mimetype.toLowerCase() === 'pdf') {
						var blob = that.b64toBlob(that.arr_attachment_oth[index].value, 'application/pdf');
						var blobUrl = URL.createObjectURL(blob);
						window.open(blobUrl);
					} else if (that.arr_attachment_oth[index].mimetype.toLowerCase() === 'png') {
						var blob = that.b64toBlob(that.arr_attachment_oth[index].value, 'image/png');
						var blobUrl = URL.createObjectURL(blob);
						window.open(blobUrl);
					} else if (that.arr_attachment_oth[index].mimetype.toLowerCase() === 'xls' || that.arr_attachment_oth[index].mimetype.toLowerCase() ===
						'xlsx') {
						var blob = that.b64toBlob(that.arr_attachment_oth[index].value, 'application/vnd.ms-excel');
						var blobUrl = URL.createObjectURL(blob);
						window.open(blobUrl);
					} else if (that.arr_attachment_oth[index].mimetype.toLowerCase() === 'doc' || that.arr_attachment_oth[index].mimetype.toLowerCase() ===
						'docx') {
						var blob = that.b64toBlob(that.arr_attachment_oth[index].value, 'application/msword');
						var blobUrl = URL.createObjectURL(blob);
						window.open(blobUrl);
					} else if (that.arr_attachment_oth[index].mimetype.toLowerCase() === 'ppt') {
						var blob = that.b64toBlob(that.arr_attachment_oth[index].value, 'application/vnd.ms-powerpoint');
						var blobUrl = URL.createObjectURL(blob);
						window.open(blobUrl);
					}
				}
			})
		},
		oth_handleFileDelete: function (oEvent) {
			var fileName = oEvent.mParameters.listItem.mProperties.title;
			var that = this;
			var dialog = new Dialog({
				title: 'Confirm',
				type: 'Message',
				content: new Text({
					text: 'Do You Want To Delete File: ' + fileName + '?'
				}),
				beginButton: new Button({
					type: sap.m.ButtonType.Emphasized,
					text: 'Yes',
					press: function () {
						dialog.close();
						for (var i = 0; i < that.arr_attachment_oth.length; i++) {
							if (that.arr_attachment_oth[i].filename === fileName) {
								that.arr_attachment_oth.splice(i, 1);
							}
						}

						var Attachment = new sap.ui.model.json.JSONModel();
						Attachment.setData(that.arr_attachment_oth);
						Attachment = sap.ui.getCore().byId("main").getModel('othAttachList').refresh();
						MessageToast.show('File' + fileName + '  Deleted');
					}
				}),
				endButton: new Button({
					text: 'No',
					press: function () {
						dialog.close();
					}
				}),
				afterClose: function () {
					dialog.destroy();
				}
			});
			dialog.open();
		},

		oth_handleUploadComplete: function (oEvent, oValue) {
			debugger;
			var oBusy = new sap.m.BusyDialog();
			oBusy.open();
			var that = this;
			var oFile = oEvent.getParameter("files")[0];
			fileObject = {};
			that.reader.readAsArrayBuffer(oFile);
			// console.log(fileObject);
			var filedetail = oFile.name.split('.', 3)
				// var pernr = sap.ui.getCore().byId('Shell').getModel('oSelectePernr').getData().empNo;
			setTimeout(function () {
				console.log(fileObject.CONTENT);
				// var obj = {
				// 	"picname": filedetail[0],
				// 	"mimetype": filedetail[1],
				// 	"value": fileObject.CONTENT
				// };

				var obj = {
					"fid": '',
					"rfid": '',
					"atype": 'OT',
					"filename": filedetail[0],
					"endda": '',
					"mimetype": filedetail[filedetail.length - 1].toLowerCase(),
					"sydats": '',
					"sytims": '',
					"uname": '',
					"value": fileObject.CONTENT
				};

				that.arr_attachment_oth.push(obj);
				var Attachment = new sap.ui.model.json.JSONModel();
				Attachment.setData(that.arr_attachment_oth);
				sap.ui.getCore().byId("main").setModel(Attachment, 'othAttachList');
				oBusy.close();
			}, 5000);

		},

		onOverflowToolbarPressSelection: function () {
			var oPanel = this.byId("pnlSelection");
			oPanel.setExpanded(!oPanel.getExpanded());
		},

		onOverflowToolbarPressHeader: function () {
			var oPanel = this.byId("pnlHeader");
			oPanel.setExpanded(!oPanel.getExpanded());
		},

		onOverflowToolbarPressData: function () {
			var oPanel = this.byId("pnlData");
			oPanel.setExpanded(!oPanel.getExpanded());
		},

		onOverflowToolbarPressUpload: function () {
			var oPanel = this.byId("pnlUpload");
			oPanel.setExpanded(!oPanel.getExpanded());
		},
		returnIdListOfRequiredSel: function () {
			let requiredInputs;
			return requiredInputs = ['st_no', 'program_id', 'course_id', 'begda', 'endda'];
		},
		returnIdListOfRequiredFields: function () {
			let requiredInputs;
			return requiredInputs = ['appli_date', 'payee_branch', 'payee_ac_no', 'payee_name'];
		},
		returnIdListOfRequiredTextareaFields: function () {
			let requiredInputs;
			return requiredInputs = ['st_rf_reason'];
		},

		returnIdListOfRequiredMultiInputFields: function () {
			let requiredMultiInputs;
			return requiredMultiInputs = ['vouchList'];
		},
		validateEventFeedbackForm: function (requiredInputs, requiredMultiInputs, requiredTextarea) {
			var _self = this;
			var valid = true;
			debugger;
			requiredInputs.forEach(function (input) {
				var sInput = _self.getView().byId(input);
				if (sInput.getValue() == "" || sInput.getValue() == undefined) {
					valid = false;
					sInput.setValueState("Warning");
				} else {
					sInput.setValueState("None");
				}
			});
			requiredMultiInputs.forEach(function (input) {
				var sInput = _self.getView().byId(input);
				if (sInput.getTokens().length == "" || sInput.getTokens().length == 0 || sInput.getValue() == undefined) {
					valid = false;
					sInput.setValueState("Warning");
				} else {
					sInput.setValueState("None");
				}
			});
			requiredTextarea.forEach(function (textarea) {
				var sInput = _self.getView().byId(textarea);
				if (sInput.getValue() == "" || sInput.getValue() == undefined) {
					valid = false;
					sInput.setValueState("Warning");
				} else {
					sInput.setValueState("None");
				}
			});
			return valid;
		},
		InvalidateEventFeedbackForm: function (requiredInputs, requiredMultiInputs, requiredTextarea) {
			var _self = this;
			var valid = true;
			requiredInputs.forEach(function (input) {
				var sInput = _self.getView().byId(input);
				if (sInput.getValue() == "" || sInput.getValue() == undefined) {
					valid = false;
					sInput.setValueState("None");
				} else {
					sInput.setValueState("None");
				}
			});
			requiredMultiInputs.forEach(function (input) {
				var sInput = _self.getView().byId(input);
				if (sInput.getTokens().length == "" || sInput.getTokens().length == 0 || sInput.getValue() == undefined) {
					valid = false;
					sInput.setValueState("None");
				} else {
					sInput.setValueState("None");
				}
			});
			requiredTextarea.forEach(function (textarea) {
				var sInput = _self.getView().byId(textarea);
				if (sInput.getValue() == "" || sInput.getValue() == undefined) {
					valid = false;
					sInput.setValueState("None");
				} else {
					sInput.setValueState("None");
				}
			});
			return valid;
		},

		onSubmit: function (oEvent) {
			var that = this;

			var requiredInputs = that.returnIdListOfRequiredFields();
			var requiredMultiInputs = that.returnIdListOfRequiredMultiInputFields();
			var requiredTextarea = that.returnIdListOfRequiredTextareaFields();
			var passedValidation = that.validateEventFeedbackForm(requiredInputs, requiredMultiInputs, requiredTextarea);
			if (passedValidation === false) {
				MessageToast.show("Fill all mandatory fields.");
				return false;
			}

			if (that.arr_attachment.length < 1 || that.arr_attachment.length == undefined) {
				var sInput = this.getView().byId('vouchAttach');
				sInput.setValueState("Warning");

				MessageToast.show("Please Attach Voucher.");
				return false;
			}

			var dialog = new Dialog({
				title: "Submit",
				type: "Message",
				state: "Success",
				content: [
					new Label({
						text: "Do you want to Submit Application?" //,
							// labelFor: "approveNote"
					}) //,
					// new TextArea("approveNote", {
					// 	width: "100%",
					// 	placeholder: "Add note (optional)"
					// })
				],
				beginButton: new Button({
					type: sap.m.ButtonType.Emphasized,
					text: "Yes",
					press: function () {
						//submit Data
						var oBusy = new sap.m.BusyDialog();
						oBusy.open();

						var dataToPost = sap.ui.getCore().byId('Shell').getModel('RFData').oData;
						var oVouchList = sap.ui.getCore().byId('main').byId('vouchList');

						var VouchListStr = '';
						oVouchList.getTokens().forEach(function (item, index) {
							console.log(item.mProperties.key);
							(VouchListStr === '') ? VouchListStr = item.mProperties.key: VouchListStr = VouchListStr + ',' + item.mProperties.key;
						});

						dataToPost.voucher = VouchListStr;
						dataToPost.msg_typ = '';
						dataToPost.msg = '';

						that.arr_attachment.forEach(function (item, index) {
							dataToPost.t_attach.push(JSON.stringify(item))

						});

						that.arr_attachment_oth.forEach(function (item, index) {
							dataToPost.t_attach.push(JSON.stringify(item))
						});
						debugger;
						dataManager.postRF(dataToPost,
							function (response) {
								debugger;
								oBusy.close();
								switch (JSON.parse(response.IvJson).msg_typ) {
								case "S":
									sap.m.MessageBox.show(JSON.parse(response.IvJson).msg, {
										icon: sap.m.MessageBox.Icon.SUCCESS,
										title: "Success",
										actions: [sap.m.MessageBox.Action.CLOSE],
										onClose: function (oAction) {}
									});
									break;
								case "E":
									sap.m.MessageBox.show(JSON.parse(response.IvJson).msg, {
										icon: sap.m.MessageBox.Icon.ERROR,
										title: "Error",
										actions: [sap.m.MessageBox.Action.CLOSE],
										onClose: function (oAction) {}
									});
									break;
								default:
									break;
								}

							},
							function (response) {
								debugger;
								oBusy.close();
								// MessageToast.show('OData Failed!');
								sap.m.MessageBox.show(response.message, {
									icon: sap.m.MessageBox.Icon.ERROR,
									title: "Error",
									actions: [sap.m.MessageBox.Action.CLOSE],
									onClose: function (oAction) {}
								});

							});
						dialog.close();
					}

				}),
				endButton: new Button({
					text: "No",
					press: function () {
						dialog.close();
					}
				}),
				afterClose: function () {
					dialog.destroy();
				}
			});
			dialog.open();
		},

		onClose: function (oEvent) {
			var dialog = new Dialog({
				title: "Exit application",
				type: "Message",
				state: "Warning",
				content: [
					new Label({
						text: "Do you want to Close Application?"
					})
				],
				beginButton: new Button({
					type: sap.m.ButtonType.Emphasized,
					text: "Yes",
					press: function () {
						//Close app
						window.close();
					}

				}),
				endButton: new Button({
					text: "No",
					press: function () {
						dialog.close();
					}
				}),
				afterClose: function () {
					dialog.destroy();
				}
			});
			dialog.open();
		},

		onFetch: function (oEvent) {
			var that = this;

			var dataToPost = sap.ui.getCore().byId('main').getModel('SelData').oData;
			if (dataToPost.intake_no === "" || dataToPost.intake_no == undefined) {
				var requiredInputs = that.returnIdListOfRequiredSel();
				var passedValidation = that.validateEventFeedbackForm(requiredInputs, [], []);
				if (passedValidation === false) {
					MessageToast.show("Fill all mandatory fields.");
					return false;
				}
			} else {
				passedValidation = that.InvalidateEventFeedbackForm(that.returnIdListOfRequiredSel(), [], []);
			}

			var oBusy = new sap.m.BusyDialog();
			oBusy.open();

			//submit Data
			dataToPost.msg_typ = '';
			dataToPost.msg = '';

			dataManager.postSel(dataToPost,
				function (response) {
					var oData = JSON.parse(JSON.parse(response.IvJson).spce_sel);
					switch (oData.msg_typ) {
					case "0":
					case "S":
						var oShell = sap.ui.getCore().byId('Shell');

						var oModel = {
							intake_no: oData.intake_no,
							student12: oData.student12,
							program_id: oData.program_id,
							course_id: oData.course_id,
							begda: oData.begda,
							endda: oData.endda,
							msg_typ: oData.msg_typ,
							msg: oData.msg
						};
						var oSelectionModel = new JSONModel(oModel);
						oShell.setModel(oSelectionModel, "SelData");

						//
						var oHData = JSON.parse(response.IvJson);
						try {
							var oVoucherList = oHData.voucher.split(',');
						} catch (err) {
							oVoucherList = oHData.voucher;
						}

						var oModel = {
							rfid: oHData.rfid,
							student12: oHData.student12,
							st_name: oHData.st_name,
							stobjid: oHData.stobjid,
							depart_t: oHData.depart_t,
							cs_objid: oHData.cs_objid,
							cs_objid_s: oHData.cs_objid_s,
							cs_objid_l: oHData.cs_objid_l,
							campus_id: oHData.campus_id,
							campus_t: oHData.campus_t,
							fact_id: oHData.fact_id,
							fact_t: oHData.fact_t,
							st_rf_reson: oHData.st_rf_reson,
							payee_name: oHData.payee_name,
							payee_ac_no: oHData.payee_ac_no,
							payee_branch: oHData.payee_branch,
							voucher: oVoucherList,
							appli_date: oHData.appli_date,
							status: oHData.status,
							t_attach: [],
							msg_typ: oHData.msg_typ,
							msg: oHData.msg
						};

						var oStudentModel = new JSONModel(oModel);
						oShell.setModel(oStudentModel, "RFData");
						break;
					default:
						break;
					}

					switch (oData.msg_typ) {
					case "0":
						oPanel = sap.ui.getCore().byId("main").byId("pnlHeader");
						oPanel.setVisible(true);
						oPanel = sap.ui.getCore().byId("main").byId("pnlData");
						oPanel.setVisible(true);
						oPanel = sap.ui.getCore().byId("main").byId("pnlUpload");
						oPanel.setVisible(true);
						oPanel = sap.ui.getCore().byId("main").byId("note1");
						oPanel.setVisible(true);
						var oBtn = sap.ui.getCore().byId("main").byId("submit");
						oBtn.setVisible(true);

						MessageToast.show(oData.msg);
						break;
					case "S":
						var oPanel = sap.ui.getCore().byId("main").byId("pnlSelection");
						oPanel.setExpanded(!oPanel.getExpanded());
						oPanel = sap.ui.getCore().byId("main").byId("pnlHeader");
						oPanel.setVisible(true);
						oPanel = sap.ui.getCore().byId("main").byId("pnlData");
						oPanel.setVisible(true);
						oPanel = sap.ui.getCore().byId("main").byId("pnlUpload");
						oPanel.setVisible(true);
						oPanel = sap.ui.getCore().byId("main").byId("note1");
						oPanel.setVisible(true);
						var oBtn = sap.ui.getCore().byId("main").byId("submit");
						oBtn.setVisible(true);

						MessageToast.show(oData.msg);
						break;
					case "E":
						sap.m.MessageBox.show(oData.msg, {
							icon: sap.m.MessageBox.Icon.ERROR,
							title: "Error",
							actions: [sap.m.MessageBox.Action.CLOSE],
							onClose: function (oAction) {}
						});
						break;
					default:
						break;
					}

				});
			// end of postSel
			oBusy.close();
		},

		onF4Intake: function (oEvent) {
			window.helpinput = oEvent.getParameters().id;

			var oCols = function () {
				return [
					new sap.m.Column({
						hAlign: "Left",
						header: new sap.m.Label({
							text: "Intake#"
						})
					}),
					new sap.m.Column({
						hAlign: "Center",
						header: new sap.m.Label({
							text: "Student Number"
						})
					})
				];
			};

			var oTabDialog = new sap.m.TableSelectDialog("", {
				title: "Select Intake Number",
				noDataText: "No Records Found",
				contentWidth: "50%",
				search: function (oEvent) {
					var sValue = oEvent.mParameters.value;
					var oFilter = new sap.ui.model.Filter('intake_no', sap.ui.model.FilterOperator.Contains, sValue);
					var oBinding = oEvent.getSource().getBinding("items");
					oBinding.filter([oFilter]);
					if (oBinding.aIndices.length == 0) {
						var oFilter = new sap.ui.model.Filter('student12', sap.ui.model.FilterOperator.Contains, sValue);
						var oBinding = oEvent.getSource().getBinding("items");
						oBinding.filter([oFilter]);
					}
					if (sValue === "") {
						oBinding.filter([]);
					}
				},
				liveChange: function (oEvent) {
					var sValue = oEvent.mParameters.value;
					var oFilter = new sap.ui.model.Filter('intake_no', sap.ui.model.FilterOperator.Contains, sValue);
					var oBinding = oEvent.getSource().getBinding("items");
					oBinding.filter([oFilter]);
					if (oBinding.aIndices.length == 0) {
						var oFilter = new sap.ui.model.Filter('student12', sap.ui.model.FilterOperator.Contains, sValue);
						var oBinding = oEvent.getSource().getBinding("items");
						oBinding.filter([oFilter]);
					}
					if (sValue === "") {
						oBinding.filter([]);
					}
				},
				columns: [oCols()]
			});

			var oItemTemplate = new sap.m.ColumnListItem({
				type: "Active",
				unread: false,
				cells: [
					new sap.m.Label({
						text: "{intake_no}"
					}),
					new sap.m.Label({
						text: "{student12}"
					})
				]
			});

			var oModel = new sap.ui.model.json.JSONModel();
			var oData = sap.ui.getCore().byId("main").getModel('oF4Intake').oData;
			oModel.setData(oData);

			oTabDialog.setModel(oModel);
			oTabDialog.bindAggregation("items", "/", oItemTemplate);

			// attach confirm listener
			oTabDialog.attachConfirm(function (oEvent) {
				debugger;
				var selectedItem = oEvent.getParameter("selectedItem");
				if (selectedItem) {
					//Get all the cells and pull back the first one which will be the name content
					var oCells = selectedItem.getCells();
					//Now update the input with the value
					sap.ui.getCore().byId(window.helpinput).setValue(oCells[0].getText());
					sap.ui.getCore().byId("main--st_no").setValue(oCells[1].getText());
					// oInput1.setValue("Item selected is : " + oCell.getText());
				}
			});
			oTabDialog.open();
		},

		onF4Program: function (oEvent) {
			window.helpinput = oEvent.getParameters().id;

			var oCols = function () {
				return [
					new sap.m.Column({
						hAlign: "Left",
						header: new sap.m.Label({
							text: "Program ID"
						})
					}),
					new sap.m.Column({
						hAlign: "Left",
						header: new sap.m.Label({
							text: "Program Code"
						})
					}),
					new sap.m.Column({
						hAlign: "Left",
						header: new sap.m.Label({
							text: "Program Descr."
						})
					})
				];
			};

			var oTabDialog = new sap.m.TableSelectDialog("", {
				title: "Select Program",
				noDataText: "No Records Found",
				contentWidth: "50%",
				search: function (oEvent) {
					var sValue = oEvent.mParameters.value;
					var oFilter = new sap.ui.model.Filter('objid', sap.ui.model.FilterOperator.Contains, sValue);
					var oBinding = oEvent.getSource().getBinding("items");
					oBinding.filter([oFilter]);
					if (oBinding.aIndices.length == 0) {
						var oFilter = new sap.ui.model.Filter('short', sap.ui.model.FilterOperator.Contains, sValue);
						var oBinding = oEvent.getSource().getBinding("items");
						oBinding.filter([oFilter]);

						var oFilter = new sap.ui.model.Filter('stext', sap.ui.model.FilterOperator.Contains, sValue);
						var oBinding = oEvent.getSource().getBinding("items");
						oBinding.filter([oFilter]);
					}
					if (sValue === "") {
						oBinding.filter([]);
					}
				},
				liveChange: function (oEvent) {
					var sValue = oEvent.mParameters.value;
					var oFilter = new sap.ui.model.Filter('objid', sap.ui.model.FilterOperator.Contains, sValue);
					var oBinding = oEvent.getSource().getBinding("items");
					oBinding.filter([oFilter]);
					if (oBinding.aIndices.length == 0) {
						var oFilter = new sap.ui.model.Filter('short', sap.ui.model.FilterOperator.Contains, sValue);
						var oBinding = oEvent.getSource().getBinding("items");
						oBinding.filter([oFilter]);

						var oFilter = new sap.ui.model.Filter('stext', sap.ui.model.FilterOperator.Contains, sValue);
						var oBinding = oEvent.getSource().getBinding("items");
						oBinding.filter([oFilter]);
					}
					if (sValue === "") {
						oBinding.filter([]);
					}
				},
				columns: [oCols()]
			});

			var oItemTemplate = new sap.m.ColumnListItem({
				type: "Active",
				unread: false,
				cells: [
					new sap.m.Label({
						text: "{objid}"
					}),
					new sap.m.Label({
						text: "{short}"
					}),
					new sap.m.Label({
						text: "{stext}"
					})
				]
			});

			debugger;
			var dataToPost = sap.ui.getCore().byId('main').getModel('SelData').oData;
			var oData = {
				objid: '',
				short: '',
				stext: '',
				sobid: '',
				st_no: dataToPost.student12
			};

			dataManager.getF4Program(oData,
				function (response) {
					var oData = JSON.parse(response.IvJson);
					var oModel = new JSONModel(oData);
					sap.ui.getCore().byId("main").setModel(oModel, 'oF4Program');
				});

			var oModel = new sap.ui.model.json.JSONModel();
			var oData = sap.ui.getCore().byId("main").getModel('oF4Program').oData;
			oModel.setData(oData);

			oTabDialog.setModel(oModel);
			oTabDialog.bindAggregation("items", "/", oItemTemplate);

			// attach confirm listener
			oTabDialog.attachConfirm(function (oEvent) {
				var selectedItem = oEvent.getParameter("selectedItem");
				if (selectedItem) {
					//Get all the cells and pull back the first one which will be the name content
					var oCells = selectedItem.getCells();
					//Now update the input with the value
					sap.ui.getCore().byId(window.helpinput).setValue(oCells[0].getText());
				}
			});
			oTabDialog.open();
		},

		onF4Course: function (oEvent) {
			window.helpinput = oEvent.getParameters().id;

			var oCols = function () {
				return [
					new sap.m.Column({
						hAlign: "Left",
						header: new sap.m.Label({
							text: "Course ID"
						})
					}),
					new sap.m.Column({
						hAlign: "Left",
						header: new sap.m.Label({
							text: "Course Code"
						})
					}),
					new sap.m.Column({
						hAlign: "Left",
						header: new sap.m.Label({
							text: "Course Descr."
						})
					})
				];
			};

			var oTabDialog = new sap.m.TableSelectDialog("", {
				title: "Select Course",
				noDataText: "No Records Found",
				contentWidth: "50%",
				search: function (oEvent) {
					var sValue = oEvent.mParameters.value;
					var oFilter = new sap.ui.model.Filter('objid', sap.ui.model.FilterOperator.Contains, sValue);
					var oBinding = oEvent.getSource().getBinding("items");
					oBinding.filter([oFilter]);
					if (oBinding.aIndices.length == 0) {
						var oFilter = new sap.ui.model.Filter('short', sap.ui.model.FilterOperator.Contains, sValue);
						var oBinding = oEvent.getSource().getBinding("items");
						oBinding.filter([oFilter]);

						var oFilter = new sap.ui.model.Filter('stext', sap.ui.model.FilterOperator.Contains, sValue);
						var oBinding = oEvent.getSource().getBinding("items");
						oBinding.filter([oFilter]);
					}
					if (sValue === "") {
						oBinding.filter([]);
					}
				},
				liveChange: function (oEvent) {
					var sValue = oEvent.mParameters.value;
					var oFilter = new sap.ui.model.Filter('intake_no', sap.ui.model.FilterOperator.Contains, sValue);
					var oBinding = oEvent.getSource().getBinding("items");
					oBinding.filter([oFilter]);
					if (oBinding.aIndices.length == 0) {
						var oFilter = new sap.ui.model.Filter('short', sap.ui.model.FilterOperator.Contains, sValue);
						var oBinding = oEvent.getSource().getBinding("items");
						oBinding.filter([oFilter]);

						var oFilter = new sap.ui.model.Filter('stext', sap.ui.model.FilterOperator.Contains, sValue);
						var oBinding = oEvent.getSource().getBinding("items");
						oBinding.filter([oFilter]);
					}
					if (sValue === "") {
						oBinding.filter([]);
					}
				},
				columns: [oCols()]
			});

			var oItemTemplate = new sap.m.ColumnListItem({
				type: "Active",
				unread: false,
				cells: [
					new sap.m.Label({
						text: "{objid}"
					}),
					new sap.m.Label({
						text: "{short}"
					}),
					new sap.m.Label({
						text: "{stext}"
					})
				]
			});

			var dataToPost = sap.ui.getCore().byId('main').getModel('SelData').oData;
			var oData = {
				objid: '',
				short: '',
				stext: '',
				sobid: dataToPost.program_id,
				st_no: dataToPost.student12
			};

			dataManager.getF4Course(oData,
				function (response) {
					var oData = JSON.parse(response.IvJson);
					var oModel = new JSONModel(oData);
					sap.ui.getCore().byId("main").setModel(oModel, 'oF4Course');
				});

			var oModel = new sap.ui.model.json.JSONModel();
			var oData = sap.ui.getCore().byId("main").getModel('oF4Course').oData;
			oModel.setData(oData);

			oTabDialog.setModel(oModel);
			oTabDialog.bindAggregation("items", "/", oItemTemplate);

			// attach confirm listener
			oTabDialog.attachConfirm(function (oEvent) {
				var selectedItem = oEvent.getParameter("selectedItem");
				if (selectedItem) {
					//Get all the cells and pull back the first one which will be the name content
					var oCells = selectedItem.getCells();
					//Now update the input with the value
					sap.ui.getCore().byId(window.helpinput).setValue(oCells[0].getText());
				}
			});
			oTabDialog.open();
		},

		onReset: function () {
			var oBusy = new sap.m.BusyDialog();
			oBusy.open();
			var oView = this.getView();

			var oPanel = sap.ui.getCore().byId("main").byId("pnlHeader");
			oPanel.setVisible(false);
			oPanel = sap.ui.getCore().byId("main").byId("pnlData");
			oPanel.setVisible(false);
			oPanel = sap.ui.getCore().byId("main").byId("pnlUpload");
			oPanel.setVisible(false);
			oPanel = sap.ui.getCore().byId("main").byId("note1");
			oPanel.setVisible(false);
			var oBtn = sap.ui.getCore().byId("main").byId("submit");
			oBtn.setVisible(false);

			var oShell = sap.ui.getCore().byId('Shell');
			var oModel = {
				intake_no: '',
				student12: '',
				program_id: '',
				course_id: '',
				begda: '',
				endda: '',
				msg_typ: '',
				msg: ''
			};
			var oSelectionModel = new JSONModel(oModel);
			oShell.setModel(oSelectionModel, "SelData");

			oBusy.close();
		}

		//
	});
});