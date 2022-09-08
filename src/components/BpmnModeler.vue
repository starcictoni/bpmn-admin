<template>
	<div :options="options" ref="container" class="vue-bpmn-modeler-container"></div>
</template>

<script>
import BpmnModeler from "bpmn-js/lib/Modeler";
import { BpmnPropertiesPanelModule, BpmnPropertiesProviderModule, CamundaPlatformPropertiesProviderModule } from "bpmn-js-properties-panel";
import CamundaBpmnModdle from "camunda-bpmn-moddle/resources/camunda.json";
import { TextConfig } from "../utils/config.js";
export default {
	name: "vue-bpmn-modeler",
	props: ["processId", "xml", "process"],
	data() {
		return {
			explanationMessage: TextConfig.explanations.viewer,
			goBackMessage: TextConfig.explanations.goBack,
			BpmnModeler: null,
			options: {
				additionalModules: [BpmnPropertiesPanelModule, BpmnPropertiesProviderModule, CamundaPlatformPropertiesProviderModule],
				moddleExtensions: {
					camunda: CamundaBpmnModdle,
				},
			},
			eventBus: null,
			isValid: null,
			errorMessage: "Unparsable content detected, going back.",
		};
	},
	async mounted() {
		await this.setData();
	},
	methods: {
		async setData() {
			this.BpmnModeler = new BpmnModeler({
				additionalModules: [BpmnPropertiesPanelModule, BpmnPropertiesProviderModule, CamundaPlatformPropertiesProviderModule],
				moddleExtensions: {
					camunda: CamundaBpmnModdle,
				},
			});
			await this.importDiagram();
			this.$emit("shown");
		},
		goBack() {
			this.$router.back();
		},
		async importDiagram() {
			try {
				await this.BpmnModeler.importXML(this.xml);
				this.BpmnModeler.attachTo(this.$refs.container);
				this.BpmnModeler.get("canvas").zoom(0.9);
				this.isValid = true;
				this.$emit("checkValidity", this.isValid);
			} catch (error) {
				this.isValid = false;
				this.$emit("checkValidity", this.isValid);
			}
		},
	},
	beforeDestroy() {
		this.BpmnModeler.destroy();
	},
};
</script>

<style>
.vue-bpmn-modeler-container {
	height: 100%;
	width: 100%;
	background-color: whitesmoke !important;
}
.djs-palette {
	background: white !important;
}
</style>
