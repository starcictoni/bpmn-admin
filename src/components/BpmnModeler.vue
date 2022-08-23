<template>
	<div ref="container" :options="options" class="vue-bpmn-modeler-container"></div>
</template>

<script>
//import BpmnModeler from "bpmn-js/dist/bpmn-modeler.production.min.js";
//import { BpmnPropertiesPanelModule, BpmnPropertiesProviderModule } from "bpmn-js-properties-panel";
//import "bpmn-js/dist/assets/diagram-js.css";
//import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
// import camundaModdle from "camunda-bpmn-moddle/resources/camunda.json";
// import * as camundaPropertiesProvider from "bpmn-js-properties-panel/lib/provider/camunda";

//CAMUNDA OPTION
import BpmnModeler from "bpmn-js/lib/Modeler";
import { BpmnPropertiesPanelModule, BpmnPropertiesProviderModule, CamundaPlatformPropertiesProviderModule } from "bpmn-js-properties-panel";
import CamundaBpmnModdle from "camunda-bpmn-moddle/resources/camunda.json";

export default {
	name: "vue-bpmn-modeler",
	props: ["processId", "xml", "process"],
	data() {
		return {
			BpmnModeler: null,
			options: {
				additionalModules: [BpmnPropertiesPanelModule, BpmnPropertiesProviderModule, CamundaPlatformPropertiesProviderModule],
				moddleExtensions: {
					camunda: CamundaBpmnModdle,
				},
			},
			eventBus: null,
		};
	},
	async mounted() {
		//this.BpmnModeler = new BpmnModeler();
		//CAMUNDA OPTION
		this.BpmnModeler = new BpmnModeler({
			// container: "container",
			// propertiesPanel: {
			// 	parent: "#js-properties-panel",
			// },
			additionalModules: [BpmnPropertiesPanelModule, BpmnPropertiesProviderModule, CamundaPlatformPropertiesProviderModule],
			moddleExtensions: {
				camunda: CamundaBpmnModdle,
			},
		});

		await this.importDiagram();
		this.$emit("shown");
		// var events = ["element.hover", "element.out", "element.click", "element.dblclick", "element.mousedown", "element.mouseup"]
		// events.forEach(function(event) {
		// 	eventBus.on(event, function(e) {
		// 		// e.element = the model element
		// 		// e.gfx = the graphical element
		// 		console.log(event, "on", e.element.id);
		// 	});
		// });
	},
	methods: {
		async importDiagram() {
			try {
				await this.BpmnModeler.importXML(this.xml);
				this.BpmnModeler.attachTo(this.$refs.container);
				this.BpmnModeler.get("canvas").zoom(0.9);
			} catch (error) {
				console.error(error);
				//this.isValid = false;
			}
		},
		beforeDestroy() {
			this.BpmnModeler.destroy();
		},
	},
};
</script>

<style>
.vue-bpmn-modeler-container {
	height: 100%;
	width: 100%;
}
</style>
