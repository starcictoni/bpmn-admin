<template>
	<v-row>
		<v-col cols="12">
			<v-card ref="properties" class="up" hover tile outlined :height="panelHeight" :width="panelWidth">
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
								<v-icon dense v-on="on" @click="test()">mdi-ab-testing</v-icon>
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
							<div v-if="p.visible">
								<v-expansion-panel-header class="panel-header">
									{{ p.label.toUpperCase() }}
								</v-expansion-panel-header>
								<v-expansion-panel-content>
									<component
										:is="p.module"
										:key="propertyData.id"
										:data="propertyData"
										:process="process"
										:processType="processType"
										:context="{ modeler, bpmnElement }"
										@infoOk="handleProcessInfoChange"
										@generalOk="handleGeneralInfoChange"
									></component>
								</v-expansion-panel-content>
							</div>
						</v-expansion-panel>
					</v-expansion-panels>
				</div>
			</v-card>
			<div v-if="hasDiagramArrived">
				<vue-bpmn-modeler ref="bpmn" :processId="processId" :xml="diagramXML" :process="process" v-on:shown="onShown"></vue-bpmn-modeler>
			</div>
		</v-col>
	</v-row>
</template>

<script>
import { BpmnUI, BpmnXml } from "@/utils/bpmn";
import { UpdateBusinessObjectHandler, UpdateBusinessObjectListHandler, MultiCommandHandler } from "@/utils/handlers";
import { ProcessDefinition, ProcessVersion } from "../services/index.js";
import { newFile, PanelsConfig } from "../utils/config.js";
import * as common from "@/utils/common.js";
import VueBpmnModeler from "@/components/BpmnModeler";
import ServiceTaskPanel from "@/components/properties/ServiceTaskPanel.vue";
import SendTaskPanel from "@/components/properties/SendTaskPanel.vue";
import UserTaskPanel from "@/components/properties/UserTaskPanel.vue";

export default {
	name: "editor",
	components: {
		VueBpmnModeler,
		ServiceTaskPanel,
		SendTaskPanel,
		UserTaskPanel,
		propGeneral: () => import("@/components/properties/General.vue"),
		propForm: () => import("@/components/properties/Form.vue"),
		// propService: () => import("@/components/properties/Service.vue"),
		propProcessInfo: () => import("@/components/properties/ProcessInfo.vue"),
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
		};
	},
	watch: {
		search: function(newVal) {
			this.searchElements(newVal);
		},
		bpmnElement: function(newVal) {
			console.log("BPMN element -", newVal);
		},
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
		setBpmnElement(element) {
			this.bpmnElement = element;
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
			// debugger;
		},
		updatePanels() {
			if (!this.bpmnElement) return;
			let bpmnObject = this.bpmnElement.businessObject;
			BpmnUI.showPanel(this.panels, bpmnObject.$type);
			BpmnUI.setLabelOntoPanel(this.panels, bpmnObject.$type);
		},

		//
		//
		//
		//
		xTest() {
			debugger;
			window.moddle = this.moddle.create("bpmn:ExtensionElements").get("values");
			window.modeler = this.modeler;
			console.log(window.modeler);
		},
		async test() {
			const test = await this.moddle.toXML(this.modeler._definitions);
			console.log(test.xml);
		},
		//
		//
		//
		//
		//
		//
		//
		//
		//
		//
		//
		//
		//
		//
		//
		//
		//
		//
		//
		//
		async onShown() {
			this.setReferences();
			this.commandStack.registerHandler("bpmn-update", UpdateBusinessObjectHandler);
			this.commandStack.registerHandler("bpmn-list-update", UpdateBusinessObjectListHandler);
			this.commandStack.registerHandler("bpmn-multi-update", MultiCommandHandler);
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
			if (this.utils.isItemProcessDefinition(this.process)) {
				this.process.process_definition_name = form.name;
			} else {
				this.process.process_version_name = form.name;
			}
			this.process.file_name = form.filename;
		},
		handleGeneralInfoChange(form, oldId) {
			let element = this.elementRegistry.get(oldId);
			console.log(element);
			this.modeling.updateProperties(element, { id: form.id, name: form.name });
		},
		expandProperties() {
			this.isPropPanelExpanded = !this.isPropPanelExpanded;
			this.panelHeight = "auto";
			if (this.isPropPanelExpanded) {
				this.panelWidth = 360;
				this.preselectElementIfNoneSelected();
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
		preselectElementIfNoneSelected() {
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
		undo() {
			this.modeler.get("commandStack").undo();
		},
		redo() {
			this.modeler.get("commandStack").redo();
		},
		async propertiesDownload() {
			let name = this.utils.isItemProcessDefinition(this.process) ? this.process.process_definition_name : this.process.process_version_name;
			const model = await this.moddle.toXML(this.modeler._definitions);
			this.utils.exportDiagram(name, model.xml);
		},
		globalSave() {
			debugger;
			let modeling = this.modeler.get("modeling");
			let moddle = this.modeler.get("moddle");
			let formData = BpmnXml.getExtension(this.bpmnElement.businessObject, "camunda:formData");
			if (formData) {
				this.propertyData.extensionElements = moddle.create("bpmn:ExtensionElements");
				this.propertyData.extensionElements.get("values").push(formData);
				delete this.propertyData.formData;
			}
			modeling.updateProperties(this.bpmnElement, this.propertyData);
			this.setPropertyData();
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
				this.diagramXML = newFile.xml_definition;
				this.hasDiagramArrived = true;
			} else if (this.processType == "definition") {
				this.process = await ProcessDefinition.getProcessDefinition(this.process.process_definition_id);
				console.log("Editor - def", this.process);
				this.diagramXML = this.process.xml_definition;
				this.hasDiagramArrived = true;
			} else if (this.processType == "version") {
				this.process = await ProcessVersion.getProcessVersion(this.processId);
				this.diagramXML = this.process.xml_definition;
				this.hasDiagramArrived = true;
			}
		},
	},
};
</script>
<style scoped>
.v-expansion-panel-content__wrap {
	padding-bottom: 0px !important;
}

.djs-palette {
	background: "#ffffff" !important;
	/* border-color var(--color-cccccc) */
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
