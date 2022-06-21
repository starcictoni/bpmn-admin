<template>
	<v-container class="align-start" fluid fill-height>
		<v-row>
			<v-col cols="12">
				<v-data-table
					:loading="loading"
					loading-text="Učitavam"
					:headers="headers"
					:items="models"
					:items-per-page="5"
					class="elevation-1"
				>
					<template v-slot:item.model_path="{ item }">
						<router-link :to="{ name: 'model-editor', params: { id: item.model_path } }">
							{{ item.model_path }}
						</router-link>
					</template>
				</v-data-table>
			</v-col>
			<v-col cols="12">
				<v-card style="padding: 24px;">
					<!-- error, error messages, hint, loading, messages, persistent hint, rules, show-size, success, success-messages  -->
					<!-- blur, change  -->
					<div class="items">
						<v-file-input
							class="form-item-file-input"
							ref="bpmnInput"
							v-model="bpmnImportFile"
							accept="text/bpmn"
							type="file"
							outlined
							clearable
							dense
							show-size
							label="Select a BPMN model"
							:error="fileElementData.error"
							:error-messages="fileElementData.errorMessages"
							:disabled="fileElementData.disabled"
							:persistent-hint="true"
							:hint="fileElementData.hint"
							:loading="fileElementData.loading"
							:success="fileElementData.success"
							:success-messages="fileElementData.successMessages"
						>
						</v-file-input>
						<v-btn class="form-item-btn-import" :disabled="isImportButtonDisabled" @click="importBPMN()"
							>Import</v-btn
						>
					</div>
					<div style="margin-top: 24px;" v-if="isFileImported">
						<v-text-field label="Name" dense outlined v-model="importedFileGeneralInfo.name"></v-text-field>
						<v-text-field label="Size" dense outlined v-model="importedFileGeneralInfo.size"></v-text-field>
						<v-text-field
							label="Modified Date"
							dense
							outlined
							v-model="importedFileGeneralInfo.lastModifiedDate"
						></v-text-field>
					</div>
					<div ref="container" class="vue-bpmn-modeler-container"></div>
				</v-card>
			</v-col>
			<v-col cols="12"> </v-col>
		</v-row>
	</v-container>
</template>

<script>
import { Model } from "@/services";
import BpmnViewer from "bpmn-js/dist/bpmn-viewer.production.min.js";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";

export default {
	name: "Models",
	data() {
		return {
			models: [],
			data: null,
			loading: true,
			headers: [
				{ text: "File", value: "model_path" },
				{ text: "Process Id", value: "main_process.id" },
				{ text: "Process", value: "main_process.name" },
				{ text: "Active instances", value: "instances.length" },
				{ text: "Tasks", value: "tasks.length" },
			],
			options: {
				height: 400,
			},
			bpmnImportFile: null,
			importedFileGeneralInfo: {
				name: null,
				size: null,
				lastModifiedDate: null,
			},
			isFileImported: false,
			fileElementData: {
				error: false,
				errorMessages: [],
				disabled: false,
				hint: null,
				loading: false,
				success: false,
				successMessages: [],
			},
			isImportButtonDisabled: false,
		};
	},
	watch: {
		bpmnImportFile: function(newInputFile) {
			this.handleFileInput(newInputFile);
		},
	},
	async mounted() {
		let models = await Model.search();
		this.models = models;
		this.loading = false;
	},
	methods: {
		//prebaci u importer.js
		importBPMN() {
			if (this.bpmnImportFile == null) return;
			let reader = new FileReader();
			this.importedFileGeneralInfo.name = this.bpmnImportFile.name;
			this.importedFileGeneralInfo.size = this.bpmnImportFile.size;
			this.importedFileGeneralInfo.lastModifiedDate = new Date(
				this.bpmnImportFile.lastModifiedDate
			).toLocaleString();
			this.fileElementData.loading = true;
			reader.readAsText(this.bpmnImportFile);
			reader.onload = () => {
				debugger;
				reader;
				this.importModel(reader.result);
				console.log(reader.readyState);
			};
		},
		handleFileInput(newInputFile) {
			debugger;
			//spageti - no regreti
			let validInputType = false;
			if (newInputFile == null) {
				validInputType = true;
			} else if (newInputFile?.type == "" && newInputFile?.name != null) {
				let fileExtensionName = newInputFile.name.split(".").pop();
				if (fileExtensionName == "bpmn") {
					validInputType = true;
				}
			} else if (newInputFile?.type == "text/bpmn" || newInputFile?.type == "text/xml") {
				validInputType = true;
			}
			if (validInputType) {
				this.fileElementData.hint = "";
				this.fileElementData.error = false;
				this.isImportButtonDisabled = false;
				this.$refs.bpmnInput.blur();
			} else {
				this.fileElementData.hint =
					"It seems that the selected item is not valid. Please change it into .bpmn file format.";
				this.fileElementData.error = true;
				this.isImportButtonDisabled = false;
			}
		},
		handleImportSuccess() {
			if (this.fileElementData == null) {
				return null;
			}
			this.fileElementData.loading = false;
			this.fileElementData.success = true;
			this.fileElementData.successMessages.push("The model is imported successfully.");
			this.fileElementData.error = false;
			this.fileElementData.errorMessages = [];
		},
		handleImportError() {
			if (this.fileElementData == null) {
				return null;
			}
			this.fileElementData.loading = false;
			this.fileElementData.success = false;
			this.fileElementData.successMessages = [];
			this.fileElementData.error = true;
			this.fileElementData.errorMessages.push("The import of the BPMN model has failed.");
		},

		async importModel(parsedXml) {
			var container = this.$refs.container;
			var _options = Object.assign({ container: container }, this.options);
			this.BpmnModeler = new BpmnViewer(_options);
			try {
				await this.BpmnModeler.importXML(parsedXml);
				this.BpmnModeler.get("canvas").zoom("fit-viewport");
				this.isFileImported = true;
				this.handleImportSuccess();
			} catch (error) {
				this.isFileImported = false;
				this.handleImportError();
			}
		},
	},
};
</script>

<style>
.items {
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
}
.form-item-file-input {
	margin-left: 1%;
	margin-right: 1%;
	flex-grow: 11;
}
.form-item-btn-import {
	margin-left: 1%;
	margin-right: 1%;
	flex-grow: 1;
}
</style>
