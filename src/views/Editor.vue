<template>
	<v-row>
		<v-col cols="12">
			<v-card v-show="isValid" ref="properties" class="up" hover tile outlined :height="panelHeight" :width="panelWidth">
				<div :class="[isPropPanelExpanded ? extraPadded : '']" class="properties-icons-wrapper">
					<div class="properties-icons">
						<v-tooltip bottom>
							<template #activator="{ on }">
								<v-btn icon tile>
									<v-icon class="btn-group-space-around" v-on="on" @click="undo()">mdi-undo</v-icon>
								</v-btn>
							</template>
							<span>Undo</span>
						</v-tooltip>
						<v-divider vertical></v-divider>
						<v-tooltip bottom>
							<template #activator="{ on }">
								<v-btn icon tile>
									<v-icon class="btn-group-space-around" v-on="on" @click="redo()">mdi-redo</v-icon>
								</v-btn>
							</template>
							<span>Redo</span>
						</v-tooltip>
						<v-divider vertical></v-divider>
						<v-tooltip bottom>
							<template #activator="{ on }">
								<v-btn icon tile>
									<v-icon dense v-on="on" @click="propertiesDownload()">
										mdi-download
									</v-icon>
								</v-btn>
							</template>
							<span>Download</span>
						</v-tooltip>
						<v-divider vertical></v-divider>
						<v-tooltip bottom>
							<template #activator="{ on }">
								<v-btn icon tile>
									<v-icon class="btn-group-space-around" v-on="on" @click="globalSave()">mdi-content-save</v-icon>
								</v-btn>
							</template>
							<span>Save</span>
						</v-tooltip>
						<v-divider vertical></v-divider>
						<v-tooltip bottom>
							<template #activator="{ on }">
								<v-btn icon tile>
									<v-icon dense v-on="on" @click="showPropertiesSearch()">mdi-magnify</v-icon>
								</v-btn>
							</template>
							<span>Search</span>
						</v-tooltip>
						<!-- <v-divider vertical></v-divider>
						<v-tooltip bottom>
							<template #activator="{ on }">
								<v-icon v-on="on" @click="test()">mdi-heart</v-icon>
							</template>
							<span>Test</span>
						</v-tooltip>
						<v-divider vertical></v-divider>
						<v-tooltip bottom>
							<template #activator="{ on }">
								<v-icon v-on="on" @click="xTest()">mdi-heart</v-icon>
							</template>
							<span>xTest</span>
						</v-tooltip> -->
						<v-divider vertical></v-divider>
						<v-tooltip bottom>
							<template #activator="{ on }">
								<v-btn icon tile>
									<v-icon dense v-on="on" @click="expandProperties()">mdi-arrow-expand</v-icon>
								</v-btn>
							</template>
							<span>Expand</span>
						</v-tooltip>
					</div>
				</div>
				<div v-show="isSearchShown">
					<v-text-field
						v-model="search"
						clearable
						class="input-remove-border-sans-serif properties-search-padding"
						outlined
						dense
						prepend-inner-icon="mdi-magnify"
						placeholder=" Search by ID"
						single-line
						hide-details
					></v-text-field>
				</div>
				<div v-show="isPropPanelExpanded">
					<v-expansion-panels inset multiple outlined flat accordion>
						<v-expansion-panel v-for="p in panels" :key="p.label">
							<div v-show="p.visible">
								<v-expansion-panel-header class="panel-header">
									{{ p.label.toUpperCase() }}
								</v-expansion-panel-header>
								<v-expansion-panel-content eager>
									<component
										:key="propertyData.id"
										:is="p.module"
										:data="propertyData"
										:process="process"
										:processType="processType"
										:context="{ modeler, bpmnElement }"
										@infoOk="handleProcessInfoChange"
										@generalOk="handleGeneralInfoChange"
										@setProcessData="setProcessData"
										@setElementIdCheck="setElementIdCheck"
									></component>
								</v-expansion-panel-content>
							</div>
						</v-expansion-panel>
					</v-expansion-panels>
				</div>
			</v-card>
			<v-sheet light>
				<div v-if="hasDiagramArrived">
					<vue-bpmn-modeler
						ref="bpmn"
						:key="$router.fullPath"
						:processId="processId"
						:xml="diagramXML"
						:process="process"
						v-on:shown="onShown"
						@checkValidity="showPropsIfValid"
					></vue-bpmn-modeler>
				</div>
			</v-sheet>
			<snackbar :show="showSnackbar" :color="snackbarColor" :text="snackbarText"></snackbar>
		</v-col>
	</v-row>
</template>

<script>
import VueBpmnModeler from "@/components/BpmnModeler";
import ServiceTaskPanel from "@/components/panels/ServiceTaskPanel.vue";
import SendTaskPanel from "@/components/panels/SendTaskPanel.vue";
import UserTaskPanel from "@/components/panels/UserTaskPanel.vue";
import GeneralPanel from "@/components/panels/GeneralPanel.vue";
import ProcessInfoPanel from "@/components/panels/ProcessInfoPanel.vue";
import Snackbar from "@/components/Snackbar.vue";
import { BpmnUI, BpmnXml } from "@/utils/bpmn";
import { ProcessDefinition, ProcessVersion } from "@/services/index.js";
import { newFile, PanelsConfig } from "@/utils/config.js";
import * as common from "@/utils/common.js";
import _ from "lodash";
export default {
	name: "editor",
	components: {
		VueBpmnModeler,
		ServiceTaskPanel,
		SendTaskPanel,
		UserTaskPanel,
		GeneralPanel,
		ProcessInfoPanel,
		Snackbar,
	},
	data() {
		return {
			utils: common,
			modeler: null,
			canvas: null,
			commandStack: null,
			elementRegistry: null,
			moddle: null,
			eventBus: null,
			modeling: null,
			//Properties panel
			panels: PanelsConfig,
			extraPadded: "properties-icons-extra-space",
			panelHeight: "auto",
			panelWidth: 300,
			isPropPanelExpanded: false,
			//Diagram
			hasDiagramArrived: false,
			processId: null,
			processType: null,
			process: null, //Process data, not diagram data
			processName: null,
			processFilename: null,
			diagramXML: null,
			bpmnElement: null,
			propertyData: {
				docs: {},
				formData: {},
				connector: {},
				inputOutput: {},
			},
			//search
			isSearchShown: false,
			search: null,
			searchItems: null,
			otherItems: null,
			//Snackbar
			showSnackbar: false,
			snackbarColor: null,
			snackbarText: null,
			//Valid
			isValid: null,
			errorMessage: "Unparsable content detected, going back.",
			isDisabledSaveButton: true,
		};
	},
	watch: {
		isValid: function(newValue) {
			if (!newValue) {
				this.goBackIfNotValid();
			}
		},
		search: function(newVal) {
			this.searchElements(newVal);
		},
		// bpmnElement: function(newVal) {
		// 	newVal;
		// },
	},
	async mounted() {
		this.hasDiagramArrived = false;
		let params = this.$route.params;
		this.processId = params.id;
		this.processType = params.type;
		this.process = params.obj;
		await this.getDiagram();
	},
	methods: {
		setElementIdCheck(oldForm, newForm) {
			if (oldForm && oldForm.id && newForm && newForm.id) {
				let element = this.elementRegistry.get(oldForm.id);
				this.modeling.setColor(element, { stroke: "black", fill: "white" });
				return;
			}
			if (oldForm && oldForm.id && !newForm.id) {
				let element = this.elementRegistry.get(oldForm.id);
				if (element.type != "bpmn:Collaboration") {
					this.modeling.setColor(element, { stroke: "red", fill: "white" });
				}
			}
		},

		async getCurrentDiagram() {
			try {
				const result = await this.modeler.saveXML({ format: true });
				const { xml } = result;
				this.diagramXML = xml;
			} catch (err) {
				console.error(err);
			}
		},
		async goBackIfNotValid() {
			this.handleSnackbar(true, this.errorMessage, "red darken-3");
			await new Promise((resolve) => setTimeout(resolve, 3000));
			try {
				this.$router.push({ name: "processes" });
			} catch (e) {
				e;
			}
		},
		showPropsIfValid(value) {
			this.isValid = value;
		},
		setBpmnElement(element) {
			this.bpmnElement = element;
		},

		async onShown() {
			this.setReferences();
			this.eventBus.on("element.hover", () => {});
			this.eventBus.on("element.out", () => {});
			var self = this;
			this.eventBus.on("element.click", (e) => {
				self.setBpmnElement(e.element);
				self.handlePanels();
			});
		},
		setReferences() {
			this.modeler = this.$refs.bpmn.BpmnModeler;
			this.canvas = this.modeler.get("canvas");
			this.commandStack = this.modeler.get("commandStack");
			this.elementRegistry = this.modeler.get("elementRegistry");
			this.moddle = this.modeler.get("moddle");
			this.eventBus = this.modeler.get("eventBus");
			this.modeling = this.modeler.get("modeling");
		},
		handleProcessInfoChange(form) {
			if (_.isEmpty(this.process)) return;
			this.setProcessData(form);
		},
		setProcessData(form) {
			this.processName = form.name;
			this.processFilename = form.filename;
		},
		handleGeneralInfoChange(form, oldId) {
			//needs fire over commandstack
			let element = this.elementRegistry.get(oldId);
			this.modeling.updateProperties(element, { id: form.id, name: form.name });
		},
		async expandProperties() {
			this.isPropPanelExpanded = !this.isPropPanelExpanded;
			this.panelHeight = "auto";
			if (this.isPropPanelExpanded) {
				this.panelWidth = 360;
				await this.preselectElementIfNoneSelected();
			} else {
				this.panelWidth = 300;
			}
		},
		showPropertiesSearch() {
			this.isSearchShown = !this.isSearchShown;
		},
		highlightElements(items) {
			items.forEach((element) => {
				this.modeling.setColor(element, { stroke: "black", fill: "yellow" });
			});
		},
		unhighlightElements(items) {
			items.forEach((element) => {
				this.modeling.setColor(element, null);
			});
		},
		async preselectElementIfNoneSelected() {
			let selectedElements = this.modeler.get("selection").get();
			if (selectedElements.length > 0) {
				this.handlePanels();
			} else {
				let elements = this.elementRegistry.getAll();
				let startEvent = elements.find((x) => x.type == "bpmn:StartEvent");
				if (startEvent) {
					this.setBpmnElement(startEvent);
					this.handlePanels();
				}
			}
		},
		searchElements(id) {
			if (id == null) return;
			var allElements = this.elementRegistry.getAll();
			var filteredElements = allElements.filter(
				(x) => x.type != "bpmn:Collaboration" && x.type != "bpmn:Participant" && x.type != "bpmn:Lane"
			);
			if (id == "") {
				this.unhighlightElements(filteredElements);
				return;
			}
			this.searchItems = filteredElements.filter((x) => x.id.includes(id));
			this.highlightElements(this.searchItems);
			this.otherItems = filteredElements.filter((x) => !x.id.includes(id));
			this.unhighlightElements(this.otherItems);
		},
		async getDiagram() {
			if (this.processId === undefined) return null;
			if (this.processId == "-1") {
				this.diagramXML = newFile.xml;
				this.hasDiagramArrived = true;
			} else if (this.processType == "definition") {
				if (_.isEmpty(this.process)) {
					this.handleSnackbar(true, "Selected route is not valid.", "yellow darken-3");
					return null;
				}
				let response = await ProcessDefinition.getProcessDefinition(this.process.id);
				this.handleSnackbar(response.show, response.message, response.color);
				if (!response.data) this.diagramXML = "";
				else this.diagramXML = response.data?.xml;
				this.process = response.data;
				this.hasDiagramArrived = true;
			} else if (this.processType == "version") {
				let response = await ProcessVersion.getProcessVersion(this.processId);
				this.handleSnackbar(response.show, response.message, response.color);
				if (!response.data) this.diagramXML = "";
				else this.diagramXML = response.data?.xml;
				this.process = response.data;
				this.hasDiagramArrived = true;
			}
		},
		//Diagram

		//Properties
		undo() {
			this.modeler.get("commandStack").undo();
		},
		redo() {
			this.modeler.get("commandStack").redo();
		},
		async propertiesDownload() {
			try {
				const result = await this.modeler.saveXML({ format: true });
				const { xml } = result;
				this.diagramXML = xml;
			} catch (err) {
				console.error(err);
			}
			common.exportDiagram("NewFile", this.diagramXML);
		},
		handleSnackbar(show, text, color) {
			this.showSnackbar = show;
			this.snackbarText = text;
			this.snackbarColor = color;
			setTimeout(() => {
				this.showSnackbar = false;
			}, 3000);
		},
		async globalSave() {
			await this.preselectElementIfNoneSelected();
			if (!this.processName || !this.processFilename) {
				this.handleSnackbar(true, "Please, check the process info.", "yellow darken-4");
				return;
			}
			await this.getCurrentDiagram(); //this.diagramXML
			if (this.processId == "-1" && this.processType == "version") {
				let data = {
					id: this.process.definition,
					name: this.processName,
					filename: this.processFilename,
					is_active: false,
					xml: this.diagramXML,
				};
				let response = await ProcessVersion.addProcessVersion(data);
				this.handleSnackbar(response.show, response.message, response.color);
			} else if (this.processId == "-1" && this.processType == "definition") {
				let data = {
					name: this.processName,
					filename: this.processFilename,
					is_active: false,
					xml: this.diagramXML,
				};
				let response = await ProcessDefinition.addProcessDefinition(data);
				this.handleSnackbar(response.show, response.message, response.color);
			} else if (this.processId != "-1" && this.processType == "version") {
				let data = {
					id: this.process.definition,
					name: this.processName,
					filename: this.processFilename,
					is_active: false,
					xml: this.diagramXML,
				};
				console.log(this);
				console.log(data);
				let response = await ProcessVersion.addProcessVersion(data);
				this.handleSnackbar(response.show, response.message, response.color);
			}
			await new Promise((resolve) => setTimeout(resolve, 3000));
			this.$router.push({ name: "processes" });
		},
		handlePanels() {
			this.resetPanels();
			this.resetPropertyData();
			this.setPropertyData();
			this.updatePanels();
		},
		resetPanels() {
			Object.values(this.panels).map((x) => (x.visible = false));
		},
		resetPropertyData() {
			Object.keys(this.propertyData).map((x) => this.$delete(this.propertyData, x));
		},
		setPropertyData() {
			if (!this.bpmnElement) return;
			let element = BpmnXml.handleElement(this.moddle, this.bpmnElement);
			let bpmnObject = element.businessObject;
			this.propertyData = Object.assign({}, this.propertyData, {
				id: bpmnObject.id,
				name: bpmnObject.name,
			});
			let documentation = BpmnXml.getDocumentation(bpmnObject);
			if (documentation) {
				this.propertyData.docs = Object.assign({}, this.propertyData.docs, documentation);
			}
			let formData = BpmnXml.getExtension(bpmnObject, "camunda:FormData");
			if (formData) {
				this.propertyData.formData = Object.assign({}, this.propertyData.formData, formData);
			}

			let connector = BpmnXml.getExtension(bpmnObject, "camunda:Connector");
			if (connector) {
				this.propertyData.connector = Object.assign({}, this.propertyData.connector, connector);
			}

			let inputOutput = BpmnXml.getExtension(bpmnObject, "camunda:InputOutput");
			if (inputOutput) {
				this.propertyData.inputOutput = Object.assign({}, this.propertyData.inputOutput, inputOutput);
			}
		},
		updatePanels() {
			if (!this.bpmnElement) return;
			let bpmnObject = this.bpmnElement.businessObject;
			BpmnUI.showPanel(this.panels, bpmnObject.$type);
			BpmnUI.setLabelOntoPanel(this.panels, bpmnObject.$type);
		},
		disableSaveButton(value) {
			this.isDisabledSaveButton = value;
		},
		// async test() {
		// 	try {
		// 		const result = await this.modeler.saveXML({ format: true });
		// 		const { xml } = result;
		// 		console.log(xml);
		// 	} catch (err) {
		// 		console.log(err);
		// 	}
		// },
	},
};
</script>
<style scoped>
.v-expansion-panel-content__wrap {
	padding-bottom: 0px !important;
}
.djs-palette {
	background: "#ffffff" !important;
}
.djs-palette--open {
	background: "#ffffff" !important;
}
.properties-search-padding {
	padding: 2% !important;
}
.properties-icons-wrapper {
	padding: 5px;
}
.properties-icons-extra-space {
	padding-bottom: 10px;
}
.properties-icons {
	display: flex;
	flex-direction: row;
	justify-content: space-evenly;
	align-items: center;
}
.card-no-padding {
	padding: 10px 0px 0px 0px;
}
.input-top-negative-margin {
	margin-top: -5% !important;
}
.input-remove-border {
	border-radius: 0px !important;
	height: 70px;
}
.card-padding {
	padding: 15px;
}
.up {
	top: 10px;
	right: 10px;
	position: absolute;
	z-index: 2;
}
.vue-bpmn-modeler-container {
	z-index: 1;
	position: absolute;
	background: lightgray;
	height: 100%;
	padding: 15px;
}
.panel-header {
	font-weight: 500;
	font-size: 15px;
	border-top: 1px solid #cccc;
}
.col-pad {
	padding-left: 0;
	padding-bottom: 0;
}
.btn-group-space-around {
	margin-left: 1%;
}
</style>
