<template>
	<v-container fill-height fluid class="background">
		<v-row>
			<v-col align="center" justify="center" cols="12">
				<v-card elevation="0" class="card-padding" tile outlined height="95vh" v-if="isValid">
					<v-card-title>
						<v-tooltip slot="append" right>
							<template #activator="{ on }">
								<div v-text="headerText" v-on="on" class="card-title"></div>
							</template>
							<span v-text="explanationMessage"></span>
						</v-tooltip>
						<v-tooltip slot="append" right>
							<template #activator="{ on }">
								<v-btn v-on="on" depressed color="yellow accent-3" class="go-back-btn white--text" @click="goBack()">
									<v-icon>mdi-arrow-left-bold</v-icon>
								</v-btn>
							</template>
							<span v-text="goBackMessage"></span>
						</v-tooltip>
					</v-card-title>
					<v-card-text class="v-card-text-height">
						<div v-if="isValid" ref="container" class="vue-bpmn-modeler-container"></div>
						<!-- <div v-if="!isValid" v-text="errorMessage"></div> -->
					</v-card-text>
				</v-card>
				<snackbar :show="showSnackbar" :color="snackbarColor" :text="snackbarText"></snackbar>
			</v-col>
		</v-row>
	</v-container>
</template>
<script>
import BpmnViewer from "bpmn-js/dist/bpmn-viewer.production.min.js";
import Snackbar from "@/components/Snackbar.vue";
import { TextConfig } from "../utils/config.js";
import { ProcessDefinition, ProcessVersion } from "../services/index.js";
export default {
	name: "viewer",
	components: {
		Snackbar,
	},
	data() {
		return {
			errorMessage: "Unparsable content detected, going back.",
			headerText: "PROCESS VIEWER",
			explanationMessage: TextConfig.explanations.viewer,
			goBackMessage: TextConfig.explanations.goBack,
			BpmnViewer: null,
			process: null,
			isValid: true,
			id: null,
			type: null,
			//Snackbar
			showSnackbar: false,
			snackbarColor: null,
			snackbarText: null,
		};
	},
	watch: {
		isValid: function(valid) {
			if (!valid) this.goBackIfNotValid();
		},
	},
	async mounted() {
		let params = this.$route?.params;
		this.id = params.id;
		this.type = params.type;
		if (this.id == null || this.id == undefined) return;
		await this.getDiagram(this.id);
		await this.importModel();
	},
	methods: {
		async importModel() {
			this.isValid = true;
			if (this.BpmnViewer != null) {
				this.BpmnViewer.detach();
			}
			const options = Object.assign({ container: this.$refs.container }, { width: "100%", height: "100%" });
			this.BpmnViewer = new BpmnViewer(options);
			try {
				await this.BpmnViewer.importXML(this.process.xml_definition);
				this.BpmnViewer.attachTo(this.$refs.container);
				this.BpmnViewer.get("canvas").zoom("fit-viewport");
			} catch (e) {
				this.isValid = false;
			}
		},
		async getDiagram() {
			if (this.type == "definition") {
				let response = await ProcessDefinition.getProcessDefinition(this.id);
				this.handleSnackbar(response.show, response.message, response.color);
				this.process = response.data;
			} else {
				let response = await ProcessVersion.getProcessVersion(this.id);
				this.handleSnackbar(response.show, response.message, response.color);
				this.process = response.data;
			}
		},
		goBack() {
			this.$router.back();
		},
		handleSnackbar(show, text, color) {
			this.showSnackbar = show;
			this.snackbarText = text;
			this.snackbarColor = color;
			setTimeout(() => {
				this.showSnackbar = false;
			}, 3000);
		},
		async goBackIfNotValid() {
			this.handleSnackbar(true, this.errorMessage, "red darken-3");
			await new Promise((resolve) => setTimeout(resolve, 3000));
			this.$router.push({ name: "processes" });
		},
	},
};
</script>
<style>
.v-card-text-height {
	height: 95%;
}
.go-back-btn {
	margin-left: 1%;
	padding: 0px !important;
	min-width: 36px !important;
	max-height: 30px;
}
</style>
