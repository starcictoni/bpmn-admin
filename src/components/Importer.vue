<template>
	<v-col class cols="12">
		<v-card class="card-padding" tile outlined>
			<v-row>
				<v-col class="pb-0" cols="12">
					<v-card-title>
						<div class="card-title">
							PROCESS DEFINITION IMPORT
						</div>
					</v-card-title>
					<v-card-text class="card-text">
						<div class="items">
							<div class="form-item-file-input">
								<v-file-input
									class="form-item-file-input-margin input-remove-border"
									ref="bpmnInput"
									v-model="bpmnImportFile"
									prepend-icon=""
									prepend-inner-icon="mdi-paperclip"
									type="file"
									clearable
									outlined
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
							</div>
							<div v-if="!isFileImported">
								<v-btn class="form-item-btn-import" outlined tile :disabled="isImportButtonDisabled" @click="importBPMN()">Import</v-btn>
							</div>
						</div>
					</v-card-text>
				</v-col>

				<v-col class="pt-0" v-show="isFileImported" cols="4">
					<v-card elevation="0" class="import-card-padding" tile>
						<v-card-title>
							<div class="card-title">
								INFO
							</div>
						</v-card-title>
						<v-card-text class="card-text">
							<div class="form-item-file-general" v-if="isFileImported">
								<v-text-field class="input-remove-border" label="Process Name" dense outlined tile v-model="importedName"></v-text-field>
								<v-text-field class="input-remove-border" label="File Name" dense outlined v-model="importedFileName"></v-text-field>
								<v-checkbox v-model="importedActivate" color="primary" label="Active"> </v-checkbox>
							</div>
						</v-card-text>
						<v-card-actions class="process-import-info">
							<v-spacer></v-spacer>
							<v-btn class="process-import-info-cancel" @click="handleClearFileInput()" large outlined tile>Cancel</v-btn>
							<v-btn class="process-import-info-save" @click="saveImport()" large outlined tile>Save</v-btn>
						</v-card-actions>
					</v-card>
				</v-col>
				<v-col class="pt-0" v-show="interception" cols="8">
					<v-card elevation="0" class="import-card-padding" tile>
						<v-card-title>
							<div class="card-title">
								PREVIEW
							</div>
						</v-card-title>
						<v-card-text class="card-text">
							<div ref="container" class="vue-bpmn-modeler-container"></div>
						</v-card-text>
					</v-card>
				</v-col>
			</v-row>
		</v-card>
	</v-col>
</template>
<script>
import * as common from "../utils/common.js";
import BpmnViewer from "bpmn-js/dist/bpmn-viewer.production.min.js";

export default {
	name: "Importer",
	props: [],
	data() {
		return {
			interception: false,
			BpmnViewer: null,
			options: {
				height: 400,
			},
			//file
			bpmnImportFile: null,
			//file info
			importedName: null,
			importedFileName: null,
			importedFileSize: null,
			importedFileLastModifiedDate: null,
			importedFileXml: null,
			importedActivate: false,
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
			this.importedName = null;
			this.importedFileName = null;
			this.importedFileSize = null;
			this.importedFileLastModifiedDate = null;
			Object.assign(this.bpmnImportFile, null);
			this.BpmnViewer.detach();
			this.isFileImported = false;
			this.interception = false;
			this.isImportButtonDisabled = false;
		},
		importBPMN() {
			if (this.bpmnImportFile == null) {
				return null;
			}
			this.importedName = common.getNameFromFile(this.bpmnImportFile);
			this.importedFileName = this.bpmnImportFile.name;
			this.importedFileSize = this.bpmnImportFile.size;
			this.importedFileLastModifiedDate = new Date(this.bpmnImportFile.lastModifiedDate).toLocaleString();

			this.fileElementLoading = true;
			this.fileElementDisabled = true;
			this.isImportButtonDisabled = true;

			const reader = new FileReader();
			reader.readAsText(this.bpmnImportFile);
			reader.onload = () => {
				this.importedFileXml = reader.result;
				this.importModel(reader.result);
			};
		},
		saveImport() {
			var data = {
				process_definition_name: this.importedName,
				file_name: this.importedFileName,
				is_active: this.importedActivate,
				xml_definition: this.importedFileXml,
			};
			this.$emit("save", data, this.handleClearFileInput);
		},
		async importModel(parsedXml) {
			if (this.BpmnViewer != null) {
				this.BpmnViewer.detach();
			}
			this.interception = true;
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
				this.interception = false;
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
<style></style>
