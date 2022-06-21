<template>
	<v-col v-if="modelUrl">
		<v-row>
			<v-col ref="headerColumn" class="col-pad">
				<div class="header">
					<v-btn class="btn-group-space-around" tile large depressed @click="save()">Save</v-btn>
					<v-btn class="btn-group-space-around" tile large depressed @click="undo()">Undo</v-btn>
					<v-btn class="btn-group-space-around" tile large depressed @click="undo()">Redo</v-btn>
					<v-btn class="btn-group-space-around" tile large depressed @click="test()">Test</v-btn>
					<v-btn class="btn-group-space-around" tile large depressed @click="undo()">Focus</v-btn>
				</div>
			</v-col>
		</v-row>
		<v-row>
			<v-col cols="9">
				<vue-bpmn-modeler ref="bpmn" :url="modelUrl" :options="options" v-on:shown="onShown"></vue-bpmn-modeler
			></v-col>
			<v-col cols="3">
				<div v-if="this.bpmnElement != null">
					<v-expansion-panels accordion tile>
						<v-expansion-panel v-for="p in panels" :key="p.label" class="panel-max-height">
							<div v-if="p.visible">
								<v-expansion-panel-header class="panel-header">
									{{ p.label.toUpperCase() }}
								</v-expansion-panel-header>
								<v-expansion-panel-content>
									<component
										:is="p.module"
										:key="propertyData.id"
										:data="propertyData"
										:context="{ modeler, bpmnElement }"
									></component>
								</v-expansion-panel-content>
							</div>
						</v-expansion-panel>
					</v-expansion-panels></div
			></v-col>
		</v-row>
	</v-col>
	<!-- <v-layout row wrap>
			<v-flex xs12 sm9 mt-3>
				<v-btn tile large depressed class="ml-0.5 mr-3 mb-3" @click="save()">Save</v-btn>
				<v-btn tile large depressed class="mr-3 mb-3" @click="undo()">Undo</v-btn>
				<v-btn tile large depressed class="mb-3" @click="test()">Test</v-btn>
				<vue-bpmn-modeler ref="bpmn" :url="modelUrl" :options="options" v-on:shown="onShown"></vue-bpmn-modeler>
			</v-flex>
			<v-flex xs12 sm3 mt-15 pa-2>
				<div v-if="this.bpmnElement != null">
					<v-expansion-panels accordion tile>
						<v-expansion-panel v-for="p in panels" :key="p.label" class="panel-max-height">
							<div v-if="p.visible">
								<v-expansion-panel-header class="panel-header">
									{{ p.label.toUpperCase() }}
								</v-expansion-panel-header>
								<v-expansion-panel-content>
									<component
										:is="p.module"
										:key="propertyData.id"
										:data="propertyData"
										:context="{ modeler, bpmnElement }"
									></component>
								</v-expansion-panel-content>
							</div>
						</v-expansion-panel>
					</v-expansion-panels>
				</div>
			</v-flex>
		</v-layout>
	</v-container> -->
</template>

<script>
import { BpmnUI, BpmnXml } from "@/utils/bpmn";
import { UpdateBusinessObjectHandler, UpdateBusinessObjectListHandler, MultiCommandHandler } from "@/utils/handlers";
import VueBpmnModeler from "@/components/BpmnModeler";

export default {
	name: "model-editor",
	props: ["id"],
	components: {
		VueBpmnModeler,
		propGeneral: () => import("@/components/properties/General.vue"),
		propForm: () => import("@/components/properties/Form.vue"),
		propService: () => import("@/components/properties/Service.vue"),
	},
	data() {
		return {
			modelUrl: null,
			modeler: null,
			options: {
				height: 850,
			},
			bpmnElement: null,
			propertyData: {
				formData: {},
			},
			panels: {
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
	// updated() {
	// 	this.getHeight();
	// },
	async mounted() {
		this.model_path = this.id;
		this.modelUrl = process.env.VUE_APP_BPMN_SERVER + "/model/" + this.model_path;
	},

	methods: {
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
			if (!this.bpmnElement) return;

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
		async test() {
			let modeling = this.modeler.get("modeling");
			let moddle = this.modeler.get("moddle");
			let elementRegistry = this.modeler.get("elementRegistry");
			let bpmnFactory = this.modeler.get("bpmnFactory");
			let e = elementRegistry.get("odabiranje_zadatka_student");

			this.bpmnElement = e;
			debugger;
			let formData = BpmnXml.getExtension(e.businessObject, "camunda:formData");

			//let extensionElements;
			// if (formData) {
			//     extensionElements = moddle.create('bpmn:ExtensionElements');
			//     extensionElements.get('values').push(formData);
			// }
			//modeling.updateProperties(e, { extensionElements });
			modeling;
			bpmnFactory;
			moddle;

			let cs = this.modeler.get("commandStack");
			cs.execute("bpmn-update", {
				element: e,
				businessObject: formData.$children[0],
				properties: { label: "NEW LABEL!" },
				//oldProperties: { label: 'asdfasdf' },
			});
		},
		async onShown() {
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
.vue-bpmn-modeler-container {
	background: lightgray;
	height: 100%;
}
.panel-header {
	font-weight: 500;
	font-size: 15px;
}
.header {
	display: flex;
	justify-content: flex-start;
	align-items: center;
}
.col-pad {
	padding-left: 0;
	padding-bottom: 0;
}
.btn-group-space-around {
	margin-left: 1%;
}
</style>
