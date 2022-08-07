<template>
	<div ref="container" class="vue-bpmn-modeler-container"></div>
</template>

<script>
import BpmnModeler from "bpmn-js/dist/bpmn-modeler.production.min.js";
import { ProcessDefinition, ProcessVersion } from "../services/index.js";
import { newFile } from "../utils/config.js";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";

export default {
	name: "vue-bpmn-modeler",
	props: ["url", "processId", "type", "process", "options"],
	data() {
		return {
			BpmnModeler: null,
		};
	},
	// watch: {
	// 	url: function() {
	// 		this.getDiagram();
	// 	},
	// },
	async mounted() {
		this.BpmnModeler = new BpmnModeler(this.options);
		if (this.process != null || this.process != undefined) {
			this.importDiagram(this.process.xml_definition);
		} else {
			this.process = await this.getDiagram();
			console.log(this.process);
		}
		this.$emit("shown");
		console.log(this.processId, this.type, this.process);
		// var events = ["element.hover", "element.out", "element.click", "element.dblclick", "element.mousedown", "element.mouseup"];
		// events.forEach(function(event) {
		// 	eventBus.on(event, function(e) {
		// 		// e.element = the model element
		// 		// e.gfx = the graphical element
		// 		console.log(event, "on", e.element.id);
		// 	});
		// });
	},
	beforeDestroy() {
		this.BpmnModeler.destroy();
	},
	methods: {
		async getDiagram() {
			if (this.processId === undefined) return null; //TODO: add feedback
			let xml = null;
			if (this.processId == "-1") {
				xml = newFile.xml_definition;
			} else if (this.type == "definition") {
				let response = await ProcessDefinition.getProcessDefinition(this.process.process_definition_id);
				this.process = response;
				xml = response.xml_definition;
			} else if (this.type == "version") {
				let response = await ProcessVersion.getProcessVersion(this.processId); //or this.process.process_version_id TODO: check
				this.process = response;
				xml = response.xml_definition;
			}
			if (xml != null) {
				this.importDiagram(xml);
			}
		},
		async importDiagram(xml) {
			try {
				await this.BpmnModeler.importXML(xml);
				this.BpmnModeler.attachTo(this.$refs.container);
				this.BpmnModeler.get("canvas").zoom(0.9);
			} catch (error) {
				console.error(error);
				//this.isValid = false;
			}
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
