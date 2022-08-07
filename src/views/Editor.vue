<template>
	<v-row>
		<v-col cols="12">
			<v-card ref="properties" class="up" hover tile outlined :height="panelHeight" :width="panelWidth">
				<div :class="[isPropPanelExpanded ? extraPadded : '']" class="properties-icons-wrapper">
					<div class="properties-icons">
						<v-tooltip bottom>
							<template #activator="{ on }">
								<v-icon class="btn-group-space-around" v-on="on" @click="save()">mdi-content-save</v-icon>
							</template>
							<span>Save</span>
						</v-tooltip>
						<v-divider vertical></v-divider>
						<v-tooltip bottom>
							<template #activator="{ on }">
								<v-icon class="btn-group-space-around" v-on="on" @click="undo()">mdi-undo</v-icon>
							</template>
							<span>Undo</span>
						</v-tooltip>
						<v-divider vertical></v-divider>
						<v-tooltip bottom>
							<template #activator="{ on }">
								<v-icon class="btn-group-space-around" v-on="on" @click="redo()">mdi-redo</v-icon>
							</template>
							<span>Redo</span>
						</v-tooltip>
						<v-divider vertical></v-divider>
						<v-tooltip bottom>
							<template #activator="{ on }">
								<v-icon dense v-on="on" @click="utils.exportItem()">
									mdi-download
								</v-icon>
							</template>
							<span>Download</span>
						</v-tooltip>
						<v-divider vertical></v-divider>
						<v-tooltip bottom>
							<template #activator="{ on }">
								<v-icon dense v-on="on" @click="test()">mdi-ab-testing</v-icon>
							</template>
							<span>Test</span>
						</v-tooltip>
						<v-divider vertical></v-divider>
						<v-tooltip bottom>
							<template #activator="{ on }">
								<v-icon dense v-on="on" @click="xTest()">mdi-ab-testing</v-icon>
							</template>
							<span>xTest</span>
						</v-tooltip>
						<v-divider vertical></v-divider>
						<v-tooltip bottom>
							<template #activator="{ on }">
								<v-icon dense v-on="on" @click="expand()">mdi-arrow-expand</v-icon>
							</template>
							<span>Expand</span>
						</v-tooltip>
					</div>
				</div>
				<div v-show="isPropPanelExpanded">
					<v-expansion-panels inset multiple outlined flat accordion>
						<v-expansion-panel v-for="p in panels" :key="p.label">
							<v-divider></v-divider>
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
									></component>
								</v-expansion-panel-content>
							</div>
						</v-expansion-panel>
					</v-expansion-panels>
				</div>
			</v-card>
			<div>
				<vue-bpmn-modeler
					ref="bpmn"
					:url="url"
					:processId="processId"
					:type="processType"
					:process="process"
					:options="options"
					v-on:shown="onShown"
				></vue-bpmn-modeler>
			</div>
		</v-col>
	</v-row>
</template>

<script>
//TODO: local save into localstorage - continue where you left off
import { BpmnUI, BpmnXml } from "@/utils/bpmn";
import { UpdateBusinessObjectHandler, UpdateBusinessObjectListHandler, MultiCommandHandler } from "@/utils/handlers";
import VueBpmnModeler from "@/components/BpmnModeler";
export default {
	name: "editor",
	components: {
		VueBpmnModeler,
		propGeneral: () => import("@/components/properties/General.vue"),
		propForm: () => import("@/components/properties/Form.vue"),
		propService: () => import("@/components/properties/Service.vue"),
		propProcessInfo: () => import("@/components/properties/ProcessInfo.vue"),
	},
	data() {
		let modeler = VueBpmnModeler;
		return {
			extraPadded: "properties-icons-extra-space",
			isSearchShown: false,
			panelHeight: "auto",
			panelWidth: 250,
			isPropPanelExpanded: false,
			processId: null,
			processType: null,
			process: null,
			url: null,
			modeler: modeler,
			options: {
				height: 900,
			},
			bpmnElement: null,
			propertyData: {
				formData: {},
			},
			panels: {
				processInformation: {
					label: "Process info", //Definition or Version
					visible: false,
					module: "propProcessInfo",
				},
				general: {
					label: "General",
					visible: false,
					module: "propGeneral",
				},
				form: {
					label: "Form",
					visible: false,
					module: "propForm",
				},
				service: {
					label: "Service Task",
					visible: false,
					module: "propService",
				},
			},
		};
	},
	//was async
	mounted() {
		debugger;
		let params = this.$route.params;
		this.processId = params.id;
		this.processType = params.type;
		this.process = params.obj;
		this.url = process.env.VUE_APP_BPMN_SERVER + "/editor/" + params.type + "/" + params.id;
	},
	methods: {
		expand() {
			this.isPropPanelExpanded = !this.isPropPanelExpanded;
			this.panelHeight = "auto";
			if (this.isPropPanelExpanded) {
				this.panelWidth = 330;
				this.preselectFirst();
			} else {
				this.panelWidth = 250;
			}
		},
		showSearch() {
			this.isSearchShown = !this.isSearchShown;
		},
		preselectFirst() {
			debugger;
			let elements = this.modeler.get("elementRegistry").getAll();
			let startEvent = elements.find((x) => x.type == "bpmn:StartEvent");
			if (startEvent) {
				this.bpmnElement = startEvent;
				this.resetPanels();
				this.setPropertyData();
				this.updatePanels();
			}
		},
		xTest() {
			var element = this.modeler.get("elementRegistry").get("id");
			console.log(this.modeler.get("moddle").toXML(element, {}));
		},
		test() {
			// eslint-disable-next-line no-unused-vars
			//window.x = this.modeler.get("canvas");
			window.x = this.modeler.get("eventBus");
			window.y = this.modeler.get("moddle");

			console.log("Canvas", this.modeler.get("canvas"));
			console.log("ElementRegistry", this.modeler.get("elementRegistry"));

			console.log("EventBus", this.modeler.get("eventBus"));
			console.log("Moddle", this.modeler.get("moddle"));
			console.log("CommandStack", this.modeler.get("commandStack"));

			//not needed console.log("Modeling", this.modeler.get("modeling"));
			//not needed console.log("BPMNFactory", this.modeler.get("bpmnFactory"));

			this.modeler.get("canvas").getSize();
			this.modeler.get("canvas").viewbox();
			this.modeler.get("canvas").zoom(1);

			this.modeler.get("elementRegistry").get(); // param string id //if not null - javi da treba drugi id
			this.modeler.get("elementRegistry").getAll();
			this.modeler.get("elementRegistry").getGraphics(); // param string id //selects the element - idea - search by id

			// this.modeler.get("commandStack").undo();
			// this.modeler.get("commandStack").redo();
			// this.modeler.get("commandStack").clear(); //clears the stack

			// this.modeler.get("moddle").fromXML(); //xmlStr, typeName, options
			// this.modeler.get("moddle").toXML(); //element, options
			// this.modeler.get("moddle");

			//Canvas - adding, removing elements, lifecycle, zoom, scroll
			//EventBus - communication channel
			//ElementFactory - for creating shapes and connections
			//ElementRegistry - knows all elements and provides APIs for retrieving them by id
			//GraphicsFactory - creating graphical representations
			//Modeling - APIs for updating elements on canvas
			//Overlays - APIs for attaching additional info to elements
			//Palette
			//moddle fromXML, toXML
		},
		getHeight() {
			let containerHeight = this.$refs.bpmn.$refs.container.clientHeight;
			let headerHeight = this.$refs.headerColumn.clientHeight;
			this.$refs.bpmn.$refs.container.style.height = containerHeight - headerHeight + "px";
		},
		updatePanels() {
			let bpmnObject = this.bpmnElement.businessObject;
			BpmnUI.showPanel(this.panels, bpmnObject.$type);
			BpmnUI.setLabelOntoPanel(this.panels, bpmnObject.$type);
		},
		setPropertyData() {
			//if (!this.bpmnElement) return;
			let bpmnObject = this.bpmnElement.businessObject;
			this.propertyData = {
				id: bpmnObject.id,
				name: bpmnObject.name,
				//$bpmn: bpmnObject,
			};

			let formData = BpmnXml.getExtension(bpmnObject, "camunda:formData");
			if (formData) {
				this.propertyData.formData = formData;
				window.propertyData = this.propertyData;
			}

			if (bpmnObject.$type == "bpmn:ServiceTask") {
				this.propertyData = bpmnObject.extensionElements.values;
				window.propertyData = this.propertyData;
			}

			// let canvas = this.modeler.get("canvas");
			// if (bpmnObject.$type != "bpmn:Collaboration") canvas.addMarker(this.propertyData.id, "highlight");
		},
		undo() {
			this.modeler.get("commandStack").undo();
		},
		redo() {
			this.modeler.get("commandStack").redo();
		},
		save() {
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
		// async test() {
		// 	let modeling = this.modeler.get("modeling");
		// 	let moddle = this.modeler.get("moddle");
		// 	let elementRegistry = this.modeler.get("elementRegistry");
		// 	let bpmnFactory = this.modeler.get("bpmnFactory");
		// 	let e = elementRegistry.get("odabiranje_zadatka_student");

		// 	this.bpmnElement = e;
		// 	debugger;
		// 	let formData = BpmnXml.getExtension(e.businessObject, "camunda:formData");

		// 	//let extensionElements;
		// 	// if (formData) {
		// 	//     extensionElements = moddle.create('bpmn:ExtensionElements');
		// 	//     extensionElements.get('values').push(formData);
		// 	// }
		// 	//modeling.updateProperties(e, { extensionElements });
		// 	modeling;
		// 	bpmnFactory;
		// 	moddle;

		// 	let cs = this.modeler.get("commandStack");
		// 	cs.execute("bpmn-update", {
		// 		element: e,
		// 		businessObject: formData.$children[0],
		// 		properties: { label: "NEW LABEL!" },
		// 		//oldProperties: { label: 'asdfasdf' },
		// 	});
		// },

		//Kada se modeler pojavi, napravi sve ove watchere. Na Click postavi bpmn element i postavi ga u property panel
		async onShown() {
			debugger;
			this.modeler = this.$refs.bpmn.BpmnModeler;
			var eventBus = this.modeler.get("eventBus");
			var commandStack = this.modeler.get("commandStack");
			window.commandStack = commandStack;

			commandStack.registerHandler("bpmn-update", UpdateBusinessObjectHandler);
			commandStack.registerHandler("bpmn-list-update", UpdateBusinessObjectListHandler);
			commandStack.registerHandler("bpmn-multi-update", MultiCommandHandler);

			eventBus.on("commandStack.changed", () => {
				this.setPropertyData();
			});
			eventBus.on("element.hover", () => {});
			eventBus.on("element.out", () => {});
			eventBus.on("element.click", (e) => {
				this.resetPanels();
				this.bpmnElement = e.element;
				this.setPropertyData();
				this.updatePanels();
			});
		},
		resetPanels() {
			var canvas = this.modeler.get("canvas");

			if (this.propertyData && this.propertyData.id) {
				canvas.removeMarker(this.propertyData.id, "highlight");
			}
			for (let p in this.panels) {
				this.panels[p].visible = false;
			}
			this.propertyData = {};
		},
		onDataUpdate(event) {
			console.log("DATA", event);
		},
	},
};
</script>
<style scoped>
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
}

.col-pad {
	padding-left: 0;
	padding-bottom: 0;
}
.btn-group-space-around {
	margin-left: 1%;
}
</style>
