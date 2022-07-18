<template>
	<div ref="container" class="vue-bpmn-modeler-container"></div>
</template>

<script>
import BpmnModeler from "bpmn-js/dist/bpmn-modeler.production.min.js";
// import common from "../utils/common.js";
import { ProcessDefinition, ProcessVersion } from "../services/index.js";
import { newFile } from "../utils/config.js";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";

export default {
	name: "vue-bpmn-modeler",
	props: {
		url: {
			type: String,
			required: true,
		},
		processId: null,
		options: {
			type: Object,
		},
		process: {
			type: Object,
		},
	},
	data() {
		return {
			diagramXML: null,
		};
	},
	//was async
	mounted() {
		debugger;
		var container = this.$refs.container;
		var options = Object.assign({ container: container }, this.options);
		this.BpmnModeler = new BpmnModeler(options);
		//console.log("EventBus listeners", this.BpmnModeler.get("eventBus")._listeners);

		var self = this;
		this.BpmnModeler.on("import.done", function(event) {
			var error = event.error;
			var warnings = event.warnings;
			error ? self.$emit("error", error) : self.$emit("shown", warnings);
			self.BpmnModeler.get("canvas").zoom("fit-viewport");
		}); //<- this?

		this.getDiagram();

		var eventBus = this.BpmnModeler.get("eventBus");
		var events = ["element.hover", "element.out", "element.click", "element.dblclick", "element.mousedown", "element.mouseup"];
		events.forEach(function(event) {
			eventBus.on(event, function(e) {
				// e.element = the model element
				// e.gfx = the graphical element
				console.log(event, "on", e.element.id);
			});
		});
	},
	beforeDestroy() {
		this.BpmnModeler.destroy();
	},
	watch: {
		url(val) {
			debugger;
			this.$emit("loading");
			this.getDiagram(val);
		},
		diagramXML(val) {
			this.BpmnModeler.importXML(val);
		},
	},
	methods: {
		getDiagram() {
			debugger;
			if (this.processId === undefined) return null; //napravi nesto da se zna da nema dijagrama
			this.processId == "-1" ? this.getNewLocalDiagram() : this.getNewDiagram();
		},
		getNewLocalDiagram() {
			this.diagramXML = newFile.xml_definition;
		},
		async getNewDiagram() {
			if (this.process.process_version_id === undefined) {
				let definition = await ProcessDefinition.getProcessDefinition(this.process.process_definition_id);
				console.log(definition);
				this.diagramXML = definition.xml_definition;
			} else {
				let version = await ProcessVersion.getProcessVersion(this.process.process_version_id);
				console.log(version);
				this.diagramXML = version.xml_definition;
				//if no - no error
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
