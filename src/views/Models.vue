<template>
	<v-container class="align-start" fluid fill-height>
		<v-row>
			<v-col cols="12">
				<v-data-table
					outlined
					:loading="isDataTableLoading"
					loading-text="Učitavam"
					:headers="headers"
					:items="models"
					:items-per-page="5"
					class="elevation-1"
				>
					<template #[`item.model_path`]="{ item }">
						<router-link :to="{ name: 'model-editor', params: { id: item.model_path } }">
							{{ item.model_path }}
						</router-link>
					</template>
				</v-data-table>
			</v-col>
			<v-col cols="12">
				<v-card class="card-padding">
					<div class="items">
						<v-file-input
							class="form-item-file-input"
							ref="bpmnInput"
							v-model="bpmnImportFile"
							type="file"
							outlined
							clearable
							dense
							show-size
							label="Select a BPMN model"
							:error="fileElementError"
							:error-messages="fileElementErrorMessages"
							:disabled="fileElementDisabled"
							:hint="fileElementHint"
							:loading="fileElementLoading"
							:success="fileElementSuccess"
							:success-messages="fileElementSuccessMessages"
							@click:clear="handleClearFileInput()"
						>
						</v-file-input>
						<v-btn class="form-item-btn-import" outlined :disabled="isImportButtonDisabled" @click="importBPMN()">Import</v-btn>
					</div>
					<div class="form-item-file-general" v-if="isFileImported">
						<v-text-field label="Name" dense outlined v-model="importedFileName"></v-text-field>
						<v-text-field label="Modified Date" dense outlined v-model="importedFileLastModifiedDate"></v-text-field>
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
import * as common from "../utils/common.js";
import BpmnViewer from "bpmn-js/dist/bpmn-viewer.production.min.js";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";

export default {
	name: "Models",
	data() {
		return {
			models: [],
			data: null,
			isDataTableLoading: true,
			headers: [
				{ text: "File", value: "model_path" },
				{ text: "Process Id", value: "main_process.id" },
				{ text: "Process", value: "main_process.name" },
				{ text: "Active instances", value: "instances.length" },
				{ text: "Tasks", value: "tasks.length" },
			],
			BpmnViewer: null,
			options: {
				height: 400,
			},
			//file
			bpmnImportFile: null,
			//file info
			importedFileName: null,
			importedFileSize: null,
			importedFileLastModifiedDate: null,
			//file input
			fileElementError: false,
			fileElementErrorMessages: [],
			fileElementDisabled: false,
			fileElementHint: null,
			fileElementLoading: false,
			fileElementSuccess: false,
			fileElementSuccessMessages: [],
			//flags
			isFileImported: false,
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
		this.isDataTableLoading = false;
	},
	methods: {
		handleFileInput(newInputFile) {
			let isValidInputType = common.isInputFileValid(newInputFile);
			this.showInputFeedback(isValidInputType);
		},
		showInputFeedback(isValidInputType) {
			if (isValidInputType == true) {
				this.fileElementHint = "";
				this.fileElementError = false;
				this.fileElementDisabled = false;
				this.isImportButtonDisabled = false;
				this.$refs.bpmnInput.blur();
			} else {
				this.fileElementHint = "It seems that the selected item is not valid. Please change it into .bpmn or .xml file format.";
				this.fileElementError = true;
				this.isImportButtonDisabled = true;
			}
		},
		handleClearFileInput() {
			if (this.BpmnViewer == null) {
				return null;
			}
			this.importedFileName = null;
			this.importedFileSize = null;
			this.importedFileLastModifiedDate = null;

			this.BpmnViewer.detach();
			this.isFileImported = false;
			this.isImportButtonDisabled = false;
		},
		importBPMN() {
			if (this.bpmnImportFile == null) {
				return null;
			}
			this.importedFileName = this.bpmnImportFile.name;
			this.importedFileSize = this.bpmnImportFile.size;
			this.importedFileLastModifiedDate = new Date(this.bpmnImportFile.lastModifiedDate).toLocaleString();

			this.fileElementLoading = true;
			this.fileElementDisabled = true;
			this.isImportButtonDisabled = true;

			const reader = new FileReader();
			reader.readAsText(this.bpmnImportFile);
			reader.onload = () => {
				this.importModel(reader.result);
			};
		},
		async importModel(parsedXml) {
			if (this.BpmnViewer != null) {
				this.BpmnViewer.detach();
			}
			const options = Object.assign({ container: this.$refs.container }, this.options);
			this.BpmnViewer = new BpmnViewer(options);
			try {
				await this.BpmnViewer.importXML(parsedXml);
				this.BpmnViewer.attachTo(this.$refs.container);
				this.BpmnViewer.get("canvas").zoom("fit-viewport");
				this.isFileImported = true;
				this.handleImportSuccess();
			} catch (error) {
				this.isFileImported = false;
				this.handleImportError();
			}
		},
		handleImportSuccess() {
			this.isImportButtonDisabled = false;
			this.fileElementLoading = false;
			this.fileElementDisabled = false;
			this.fileElementSuccess = true;
			this.fileElementSuccessMessages.splice(0, 1, "The model is imported successfully.");
			this.fileElementError = false;
			this.fileElementErrorMessages.splice(0, 1);
			setTimeout(
				() => {
					this.fileElementSuccess = false;
					this.fileElementSuccessMessages.splice(0, this.fileElementSuccessMessages.length);
				},
				4000,
				this
			);
		},
		handleImportError() {
			this.isImportButtonDisabled = false;
			this.fileElementLoading = false;
			this.fileElementDisabled = false;
			this.fileElementSuccess = false;
			this.fileElementSuccessMessages.splice(0, 1);
			this.fileElementError = true;
			this.fileElementErrorMessages.splice(0, 1, "The import of the BPMN model has failed.");
			setTimeout(
				() => {
					this.fileElementError = false;
					this.fileElementErrorMessages.splice(0, this.fileElementSuccessMessages.length);
				},
				4000,
				this
			);
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
.form-item-file-general {
	margin-top: 3%;
}
.form-item-btn-import {
	margin-left: 1%;
	margin-right: 1%;
	flex-grow: 1;
	min-height: 40px;
}
.card-padding {
	padding: 3%;
}

.v-text-field > .v-input__control > .v-input__slot {
	cursor: pointer;
}
</style>
