<template>
	<v-container class="align-start" fluid fill-height>
		<v-row>
			<v-col cols="12">
				<v-card class="card-padding" tile outlined>
					<v-card-title class="card-header-margin">
						<div class="card-title">
							PROCESS DEFINITIONS
						</div>
						<div class="card-header-action">
							<v-tooltip slot="append" bottom>
								<template #activator="{ on }">
									<v-btn v-on="on" icon color="yellow accent-3">
										<v-icon large>mdi-plus-box</v-icon>
									</v-btn>
								</template>
								<span>Add new process definition</span>
							</v-tooltip>
							<v-tooltip slot="append" bottom>
								<template #activator="{ on }">
									<v-btn v-on="on" icon color="amber accent-3">
										<v-icon large>mdi-import</v-icon>
									</v-btn>
								</template>
								<span>Import new process definition</span>
							</v-tooltip>
						</div>
						<v-spacer></v-spacer>
						<v-text-field
							v-model="mainSearch"
							class="input-remove-border-sans-serif"
							outlined
							dense
							prepend-inner-icon="mdi-magnify"
							placeholder=" Search"
							single-line
							hide-details
						></v-text-field>
					</v-card-title>
					<v-card-text class="card-text">
						<v-data-table
							ref="mainDataTable"
							:single-expand="true"
							:show-expand="true"
							item-key="process_definition_key"
							outlined
							loading-text="Loading..."
							:loading="isMainTableLoading"
							:search="mainSearch"
							:headers="mainTableHeaders"
							:items="mainTableData"
							:expanded.sync="expanded"
							:items-per-page="5"
							@item-expanded="expandClickHandler"
							:footer-props="{
								showFirstLastPage: true,
								firstIcon: 'mdi-chevron-left',
								lastIcon: 'mdi-chevron-right',
								prevIcon: 'mdi-minus',
								nextIcon: 'mdi-plus',
								'items-per-page-text': 'Processes per page',
							}"
							:header-props="{
								sortIcon: 'mdi-sort',
							}"
						>
							<!-- Expand -->
							<template v-slot:expanded-item="{ headers, item }">
								<td class="table-data-remove-padding" :colspan="headers.length">
									<v-card class="expand-table-border" tile>
										<v-card-title class="card-header-margin">
											<div class="card-title">
												PROCESS VERSIONS
											</div>
											<div class="card-header-action">
												<v-tooltip slot="append" right>
													<template #activator="{ on }">
														<v-btn v-on="on" icon color="yellow accent-4">
															<v-icon large>mdi-plus-box</v-icon>
														</v-btn>
													</template>
													<span>Add new process version</span>
												</v-tooltip>
												<v-tooltip slot="append" bottom>
													<template #activator="{ on }">
														<v-btn v-on="on" icon color="red accent-4">
															<v-icon large>mdi-import</v-icon>
														</v-btn>
													</template>
													<span>Import new process version</span>
												</v-tooltip>
											</div>
											<v-spacer></v-spacer>
											<v-text-field
												v-model="expandSearch"
												class="input-remove-border-sans-serif"
												outlined
												dense
												prepend-inner-icon="mdi-magnify"
												placeholder=" Search"
												single-line
												hide-details
											></v-text-field>
										</v-card-title>
										<v-card-text>
											<v-data-table
												:item-id="item.process_version_id"
												tile
												outlined
												loading-text="Loading..."
												:search="expandSearch"
												:loading="isExpandTableDataLoading"
												:headers="expandTableHeaders"
												:items="expandTableData"
												:items-per-page="5"
												:footer-props="{
													showFirstLastPage: true,
													firstIcon: 'mdi-chevron-left',
													lastIcon: 'mdi-chevron-right',
													prevIcon: 'mdi-minus',
													nextIcon: 'mdi-plus',
													'items-per-page-text': 'Versions per page',
												}"
											>
												<!-- Header tooltip -->
												<template v-for="(h, idx) in expandTableHeaders" v-slot:[`header.${h.value}`]="{}">
													<v-tooltip top :key="idx">
														<template v-slot:activator="{ on }">
															<span v-on="on">{{ h.text }}</span>
														</template>
														<span>{{ h.explanation }}</span>
													</v-tooltip>
												</template>

												<!-- Link -->
												<template #[`item.file_name`]="{ item }">
													<router-link :to="{ name: 'model-editor', params: { id: item.file_name } }">
														{{ item.file_name }}
													</router-link>
												</template>

												<!-- Actions -->
												<template #[`item.actions`]="{ item }">
													<v-tooltip slot="append" top>
														<template #activator="{ on }">
															<v-icon :disabled="item.is_active == 'Yes'" dense v-on="on" slot="activator" @click="showActivationDialog(item)">
																mdi-check-bold
															</v-icon>
														</template>
														<span>Activate</span>
													</v-tooltip>
													<v-tooltip slot="append" top>
														<template #activator="{ on }">
															<v-icon :disabled="item.is_active == 'No'" dense v-on="on" slot="activator" @click="showDeactivationDialog(item)">
																mdi-close-thick
															</v-icon>
														</template>
														<span>Deactivate</span>
													</v-tooltip>
													<v-tooltip v-if="item.is_active" slot="append" top>
														<template #activator="{ on }">
															<v-icon dense v-on="on" slot="activator" @click.stop="editItem(item)">
																mdi-pencil
															</v-icon>
														</template>
														<span>Edit</span>
													</v-tooltip>
													<v-tooltip v-if="item.is_active" slot="append" top>
														<template #activator="{ on }">
															<v-icon dense v-on="on" slot="activator" @click.stop="deleteItem(item)">
																mdi-trash-can
															</v-icon>
														</template>
														<span>Delete</span>
													</v-tooltip>
													<v-tooltip slot="append" top>
														<template #activator="{ on }">
															<v-icon dense v-on="on" slot="activator" @click="exportItemToPdf(item)">
																mdi-file-pdf-box
															</v-icon>
														</template>
														<span>Export PDF</span>
													</v-tooltip>
													<v-tooltip slot="append" top>
														<template #activator="{ on }">
															<v-icon dense v-on="on" slot="activator" @click="exportItemToFile(item)">
																mdi-file
															</v-icon>
														</template>
														<span>Export File</span>
													</v-tooltip>
												</template>
											</v-data-table>
										</v-card-text>
									</v-card>
								</td>
							</template>

							<!-- Header tooltip -->
							<template v-for="(h, idx) in mainTableHeaders" v-slot:[`header.${h.value}`]="{}">
								<v-tooltip top :key="idx">
									<template v-slot:activator="{ on }">
										<span v-on="on">{{ h.text }}</span>
									</template>
									<span>{{ h.explanation }}</span>
								</v-tooltip>
							</template>

							<!-- Link -->
							<template #[`item.file_name`]="{ item }">
								<router-link :to="{ name: 'model-editor', params: { id: item.file_name } }">
									{{ item.file_name }}
								</router-link>
							</template>

							<!-- Actions -->
							<template #[`item.actions`]="{ item }">
								<v-tooltip slot="append" top>
									<template #activator="{ on }">
										<v-icon :disabled="item.is_active == 'Yes'" dense v-on="on" slot="activator" @click="showActivationDialog(item, mainTableData)">
											mdi-check-bold
										</v-icon>
									</template>
									<span>Activate</span>
								</v-tooltip>
								<v-tooltip slot="append" top>
									<template #activator="{ on }">
										<v-icon :disabled="item.is_active == 'No'" dense v-on="on" slot="activator" @click="showDeactivationDialog(item, mainTableData)">
											mdi-close-thick
										</v-icon>
									</template>
									<span>Deactivate</span>
								</v-tooltip>

								<v-tooltip slot="append" top>
									<template #activator="{ on }">
										<v-icon dense v-on="on" slot="activator" @click="showEditDialog(item)">
											mdi-pencil
										</v-icon>
									</template>
									<span>Edit</span>
								</v-tooltip>

								<v-tooltip v-if="item.is_active" slot="append" top>
									<template #activator="{ on }">
										<v-icon dense v-on="on" slot="activator" @click="showDeletionDialog(item)">
											mdi-trash-can
										</v-icon>
									</template>
									<span>Delete</span>
								</v-tooltip>

								<v-tooltip slot="append" top>
									<template #activator="{ on }">
										<v-icon dense v-on="on" slot="activator" @click="exportPdf(item)">
											mdi-file-pdf-box
										</v-icon>
									</template>
									<span>Export PDF</span>
								</v-tooltip>

								<v-tooltip slot="append" top>
									<template #activator="{ on }">
										<v-icon dense v-on="on" slot="activator" @click="exportFile(item)">
											mdi-file
										</v-icon>
									</template>
									<span>Export File</span>
								</v-tooltip>
							</template>
						</v-data-table>
					</v-card-text>
				</v-card>

				<!-- deactivate -->
				<template>
					<v-row justify="center">
						<v-dialog v-model="deactivateDialog" persistent max-width="660">
							<v-card class="dialog-card-padding">
								<v-card-title class="dialog-card-title">DEACTIVATION</v-card-title>
								<v-card-text class="dialog-card-text">Are you sure you want to deactivate this item?</v-card-text>
								<v-card-actions class="dialog-card-action">
									<v-spacer></v-spacer>
									<v-btn class="black--text" large depressed tile color="white" @click="deactivateDialog = false">
										CANCEL
									</v-btn>
									<v-btn class="white--text" large depressed tile color="red darken-3" @click="deactivateItem(item, items, expanded)">
										DEACTIVATE
									</v-btn>
								</v-card-actions>
							</v-card>
						</v-dialog>
					</v-row>
				</template>

				<!-- activate -->
				<template>
					<v-row justify="center">
						<v-dialog v-model="activateDialog" persistent max-width="660">
							<v-card class="dialog-card-padding">
								<v-card-title class="dialog-card-title">ACTIVATION</v-card-title>
								<v-card-text class="dialog-card-text">Are you sure you want to activate this item?</v-card-text>
								<v-card-actions class="dialog-card-action">
									<v-spacer></v-spacer>
									<v-btn class="black--text" large depressed tile color="white" @click="activateDialog = false">
										CANCEL
									</v-btn>
									<v-btn class="white--text" large depressed tile color="green darken-3" @click="activateItem(item, items, expanded)">
										ACTIVATE
									</v-btn>
								</v-card-actions>
							</v-card>
						</v-dialog>
					</v-row>
				</template>

				<!-- delete -->
				<template>
					<v-row justify="center">
						<v-dialog v-model="deleteDialog" persistent max-width="660">
							<v-card class="dialog-card-padding">
								<v-card-title class="dialog-card-title">DELETION</v-card-title>
								<v-card-text class="dialog-card-text">Are you sure you want to delete this item?</v-card-text>
								<v-card-actions class="dialog-card-action">
									<v-spacer></v-spacer>
									<v-btn class="black--text" large depressed tile color="white" @click="deleteDialog = false">
										CANCEL
									</v-btn>
									<v-btn class="white--text" large depressed tile color="red darken-3" @click="deleteItem()">
										DELETE
									</v-btn>
								</v-card-actions>
							</v-card>
						</v-dialog>
					</v-row>
				</template>

				<!-- edit  -->
				<template>
					<v-row justify="center">
						<v-dialog v-model="editDialog" persistent max-width="660">
							<v-card class="dialog-card-padding">
								<v-card-title class="dialog-card-title">EDIT</v-card-title>
								<v-card-text class="dialog-card-text">Are you sure you want to activate this item?</v-card-text>
								<v-card-actions class="dialog-card-action">
									<v-spacer></v-spacer>
									<v-btn class="black--text" large depressed tile color="white" @click="activateDialog = false">
										CANCEL
									</v-btn>
									<v-btn class="white--text" large depressed tile color="green darken-3" @click="activateItem()">
										ACTIVATE
									</v-btn>
								</v-card-actions>
							</v-card>
						</v-dialog>
					</v-row>
				</template>

				<!-- new process definition addNewProcessDialog -->
				<template>
					<v-row justify="center">
						<v-dialog v-model="addNewProcessDialog" persistent max-width="660">
							<v-card class="dialog-card-padding">
								<v-card-title class="dialog-card-title">NEW PROCESS DEFINITION</v-card-title>
								<v-card-text class="dialog-card-text">Are you sure you want to activate this item?</v-card-text>
								<v-card-actions class="dialog-card-action">
									<v-spacer></v-spacer>
									<v-btn class="black--text" large depressed tile color="white" @click="activateDialog = false">
										CANCEL
									</v-btn>
									<v-btn class="white--text" large depressed tile color="green darken-3" @click="activateItem()">
										ACTIVATE
									</v-btn>
								</v-card-actions>
							</v-card>
						</v-dialog>
					</v-row>
				</template>

				<!-- new process version -->
				<template>
					<v-row justify="center">
						<v-dialog v-model="addNewVersionDialog" persistent max-width="660">
							<v-card class="dialog-card-padding">
								<v-card-title class="dialog-card-title">NEW PROCESS VERSION</v-card-title>
								<v-card-text class="dialog-card-text">Are you sure you want to activate this item?</v-card-text>
								<v-card-actions class="dialog-card-action">
									<v-spacer></v-spacer>
									<v-btn class="black--text" large depressed tile color="white" @click="activateDialog = false">
										CANCEL
									</v-btn>
									<v-btn class="white--text" large depressed tile color="green darken-3" @click="activateItem()">
										ACTIVATE
									</v-btn>
								</v-card-actions>
							</v-card>
						</v-dialog>
					</v-row>
				</template>
			</v-col>

			<v-col cols="12">
				<v-card class="card-padding" tile outlined>
					<v-card-title>
						<div class="card-title">
							PROCESS IMPORT
						</div>
					</v-card-title>
					<v-card-text class="card-text">
						<div class="items">
							<v-file-input
								class="form-item-file-input input-remove-border"
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
							<div v-if="!isFileImported">
								<v-btn class="form-item-btn-import" outlined tile :disabled="isImportButtonDisabled" @click="importBPMN()">Import</v-btn>
							</div>
							<div v-if="isFileImported">
								<!-- Show buttons only when the process is imported -->
								<!-- For testing purposes -->
							</div>
							<v-btn class="form-item-btn-import" outlined tile>Save & Continue Editing</v-btn>
							<v-btn class="form-item-btn-import" outlined tile>Save</v-btn>

							<v-btn class="form-item-btn-import" outlined tile>Export - Not here</v-btn>
							<!-- Move to the editor component -->
							<v-btn class="form-item-btn-import" outlined tile>Save As New Version - Not here</v-btn>
						</div>
						<div class="form-item-file-general" v-if="isFileImported">
							<v-text-field class="input-remove-border" label="Process Name" dense outlined tile v-model="importedName"></v-text-field>
							<v-text-field class="input-remove-border" label="File Name" dense outlined v-model="importedFileName"></v-text-field>
							<v-text-field
								class="input-remove-border"
								label="Last Modified Date"
								disabled
								dense
								outlined
								v-model="importedFileLastModifiedDate"
							></v-text-field>
						</div>
						<div ref="container" class="vue-bpmn-modeler-container"></div>
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import { Model, ProcessVersion } from "@/services";
import * as common from "../utils/common.js";
import BpmnViewer from "bpmn-js/dist/bpmn-viewer.production.min.js";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";

export default {
	name: "Models",
	data() {
		return {
			item: null,
			items: null,
			//Dialogs
			activateDialog: false,
			deactivateDialog: false,
			editDialog: false,
			deleteDialog: false,
			addNewProcessDialog: false,
			addNewVersionDialog: false,
			//Main table
			expanded: [], //state of expanded rows
			mainSearch: null,
			mainTableData: [],
			isMainTableLoading: true,
			mainTableHeaders: [
				{ text: "Process Name", value: "process_definition_name", explanation: "Process definition name", divider: true, align: "left" },
				{ text: "Process Key", value: "process_definition_key", explanation: "Internal process definition UUID", divider: true, align: "left" },
				{ text: "Filename", value: "file_name", explanation: "Filename", divider: true, align: "left" },
				{ text: "Active", value: "is_active", explanation: "Is the process deployed?", sortable: false, divider: true, align: "left" },
				{
					text: "Active Version",
					value: "active_version_name",
					explanation: "Deployed version name",
					sortable: false,
					divider: true,
					align: "left",
				},
				{ text: "Active Version Nr.", value: "active_version_number", explanation: "Deployed version nr.", divider: true, align: "left" },
				{ text: "Versions", value: "number_of_versions", explanation: "Number of versions", divider: true, align: "left" },
				{ text: "Created", value: "created", explanation: "Created timestamp", divider: true, align: "left" },
				{ text: "Actions", value: "actions", explanation: "Edit process definition actions", sortable: false, align: "left" },
			],
			//Expand table
			expandSearch: null,
			expandTableData: [],
			isExpandTableDataLoading: true,
			expandTableHeaders: [
				{ text: "Version Nr.", value: "process_version_number", explanation: "Deployed version number", divider: true, align: "left" },
				{ text: "Process Version Name", value: "process_version_name", explanation: "Version name", divider: true, align: "left" },
				{ text: "Filename", value: "file_name", explanation: "Filename", divider: true, align: "left" },
				{ text: "Process Version Key", value: "process_version_key", explanation: "Internal process UUID", divider: true, align: "left" },
				{ text: "Created", value: "created", explanation: "Created timestamp", divider: true, align: "left" },
				{
					text: "Last Modified",
					value: "last_modified_date",
					explanation: "Last modified date",
					divider: true,
					align: "left",
				},
				{ text: "Active", value: "is_active", explanation: "Is the version deployed?", divider: true, align: "left" },
				{ text: "Actions", value: "actions", explanation: "Edit process version actions", sortable: false, divider: true, align: "left" },
			],

			//Importer
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
		mainTableData: function() {
			debugger;
		},
	},
	async mounted() {
		this.isMainTableLoading = true;
		let processes = await Model.getProcessDefinitions();
		this.mainTableData = common.reMapDataTableValues(processes);
		this.isMainTableLoading = false;
	},
	methods: {
		//Metoda za check je li item definicija ili verzija

		showDeactivationDialog(item, items) {
			this.deactivateDialog = true;
			this.item = item;
			this.items = items;
		},

		async deactivateItem(item, items, expanded) {
			if (common.isItemProcessDefinition(item)) {
				expanded.splice(0);
				item = await Model.deactivateProcessDefinition(item.process_definition_id);
				let idx = items.findIndex((x) => x.process_definition_id == item.process_definition_id);
				items.splice(idx, 1, item);
				//tu baca invalid date
				items = common.reMapDataTableValues(items);
			} else {
				item = await ProcessVersion.deactivateProcessVersion(item.process_definition_id, item.process_version_id);
			}
			this.deactivateDialog = false;
		},

		showActivationDialog(item, items) {
			this.activateDialog = true;
			this.item = item;
			this.items = items;
		},
		async activateItem(item, items, expanded) {
			//Definicija
			//1. Ako ima vise verzija
			//2. Ako je samo jedna
			debugger;
			expanded.splice(0);

			item = await Model.activateProcessDefinition(item.process_definition_id);
			let idx = items.findIndex((x) => x.process_definition_id == item.process_definition_id);
			items.splice(idx, 1, item);
			items = common.reMapDataTableValues(items);
			//Verzija
			//
			debugger;
			if (common.isItemProcessDefinition(item)) {
				console.log("1", item);
			}
			console.log("2", items);
			this.activateDialog = false;
		},

		showDeletionDialog(item) {
			this.deleteDialog = true;
			this.item = item;
		},

		editItem(item) {
			debugger;
			console.log(item);
		},
		deleteItem(item) {
			this.deactivateAndDeleteDialog = true;
			debugger;
			console.log(item);
		},
		exportItemToPdf(item) {
			debugger;
			console.log(item);
		},
		exportItemToFile(item) {
			debugger;
			console.log(item);
		},
		async expandClickHandler(row) {
			if (row.value == false) return;
			this.isExpandTableDataLoading = true;
			let versions = await ProcessVersion.getProcessVersions(row.item.process_definition_id);
			this.expandTableData = common.reMapDataTableValues(versions);
			this.isExpandTableDataLoading = false;
		},

		//----------------------------------------------------------------------------------------------------------------
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
			(this.importedName = null), (this.importedFileName = null);
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
.dialog-card-padding {
	padding: 2%;
	border-radius: 0px !important;
}
.dialog-card-title {
	font-family: Helvetica, Arial, sans-serif !important;
	font-size: 25px !important;
	letter-spacing: -1px !important;
	font-weight: 600 !important;
}
.dialog-card-text {
	font-size: 17px !important;
	font-weight: 500 !important;
	font-family: Helvetica, Arial, sans-serif;
	letter-spacing: 0px;
}
.dialog-card-action {
	margin-left: 2%;
	margin-right: 2%;
	margin-top: 2%;
	background: linear-gradient(rgba(142, 200, 200, 0.15), rgba(0, 0, 0, 0.11));
	border-radius: 0px !important;
}

/* :not(.expand-table-border) {
	background: linear-gradient(rgba(0, 0, 0, 0.001), rgba(0, 0, 0, 0.005));
} */
.v-data-table-header th {
	white-space: nowrap;
}
.v-data-table > .v-data-table__wrapper > table > thead > tr > th {
	font-size: 15px !important;
	font-weight: 700;
	font-family: Helvetica, Arial, sans-serif;
	letter-spacing: 0px;
}
.v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
	font-size: 12px !important;
	font-weight: 500;
	font-family: Verdana, Geneva, Tahoma, sans-serif;
	/* font-family: Helvetica, Arial, sans-serif; */
	letter-spacing: 0px;
}
.v-data-table > .v-data-footer {
	font-size: 12px !important;
	font-weight: 500;
	font-family: Helvetica, Arial, sans-serif;
	letter-spacing: 0px;
}

.table-data-remove-padding {
	padding: 0 !important;
}
.expand-table-border {
	padding: 2% !important;
	box-shadow: none !important;
}

.card-title {
	font-family: Helvetica, Arial, sans-serif;
	font-size: 30px;
	letter-spacing: -3px;
	font-weight: 600;
}
.card-text {
	margin-top: 1%;
}

.card-header-action {
	margin-left: 0.5%;
}

.input-remove-border-sans-serif {
	border-radius: 0px !important;
	font-size: 15px !important;
	font-weight: 600;
	font-family: Helvetica, Arial, sans-serif;
	letter-spacing: 0px;
}

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
.card-header-margin {
	margin-bottom: 2%;
}
.card-padding {
	padding: 2%;
}

.v-text-field > .v-input__control > .v-input__slot {
	cursor: pointer;
}
</style>
