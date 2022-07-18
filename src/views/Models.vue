<template>
	<v-container class="align-start" fluid fill-height>
		<v-row>
			<v-col cols="12">
				<v-card class="card-padding" tile outlined>
					<v-card-title class="card-header-margin">
						<v-tooltip slot="append" bottom>
							<template #activator="{ on }">
								<div v-on="on" class="card-title">
									PROCESS DEFINITIONS
								</div>
							</template>
							<span>Some long long long long long information about process definition.</span>
						</v-tooltip>
						<div class="card-header-action">
							<v-tooltip slot="append" right>
								<template #activator="{ on }">
									<v-btn @click="$router.push({ name: 'model-editor', params: { id: '-1' } })" v-on="on" icon color="yellow accent-3">
										<v-icon large>mdi-plus-box</v-icon>
									</v-btn>
								</template>
								<span>Add a new process defintion.</span>
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
							item-key="process_definition_id"
							outlined
							loading-text="Loading..."
							:loading="isMainTableLoading"
							:search="mainSearch"
							:headers="mainTableHeaders"
							:items="mainTableData"
							:expanded.sync="expanded"
							:items-per-page="10"
							@item-expanded="expandClickHandler"
							:footer-props="footerProps"
							:header-props="headerProps"
							sort-by="number_of_versions"
							:sort-desc="true"
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
															<v-icon large @click="showNewVersionDialog(item)">mdi-plus-box</v-icon>
														</v-btn>
													</template>
													<span>Add new process version</span>
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
												:footer-props="footerProps"
												:header-props="headerProps"
												sort-by="process_version_number"
												:sort-desc="false"
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
													<router-link :to="{ name: 'model-editor', params: { id: item.process_version_id, obj: item } }">
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
															<v-icon dense v-on="on" slot="activator" @click.stop="showEditDialog(item)">
																mdi-pencil
															</v-icon>
														</template>
														<span>Edit</span>
													</v-tooltip>
													<v-tooltip v-if="item.is_active" slot="append" top>
														<template #activator="{ on }">
															<v-icon dense v-on="on" slot="activator" @click.stop="showDeletionDialog(item)">
																mdi-trash-can
															</v-icon>
														</template>
														<span>Delete</span>
													</v-tooltip>
													<v-tooltip slot="append" top>
														<template #activator="{ on }">
															<v-icon dense v-on="on" slot="activator" @click="exportItem(item)">
																mdi-file
															</v-icon>
														</template>
														<span>Export</span>
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
								<router-link :to="{ name: 'model-editor', params: { id: item.process_definition_id, obj: item } }">
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
										<v-icon dense v-on="on" slot="activator" @click="exportItem(item)">
											mdi-file
										</v-icon>
									</template>
									<span>Export</span>
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

								<v-card-text>
									<div v-text="deactivateText"></div>
									<!-- Notifikacija -->
									<v-banner
										class="banner"
										v-model="showBanner"
										sticky
										:icon="bannerIcon"
										:icon-color="bannerIconColor"
										single-line
										:color="bannerColor"
										tile
										><div class="banner-text" v-text="bannerText"></div>
										<template v-slot:actions>
											<v-btn icon color="white" @click="showBanner = false"><v-icon>mdi-close</v-icon></v-btn>
										</template></v-banner
									>
								</v-card-text>
								<v-card-actions class="dialog-card-action">
									<v-spacer></v-spacer>
									<v-btn class="black--text" large depressed tile color="white" @click="deactivateDialog = false">
										CANCEL
									</v-btn>
									<v-btn
										class="white--text"
										large
										depressed
										tile
										color="red darken-3"
										@click="deactivateItem(deactivationItem, expanded, mainTableData, expandTableData)"
									>
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
						<v-dialog v-model="activateDialog" persistent max-width="900">
							<v-card class="dialog-card-padding">
								<v-card-title class="dialog-card-title">ACTIVATION</v-card-title>
								<!-- Notifikacija -->
								<v-card-text>
									<div class="dialog-card-text" v-text="activateText"></div>
									<v-banner
										class="banner"
										v-model="showBanner"
										sticky
										:icon="bannerIcon"
										:icon-color="bannerIconColor"
										single-line
										:color="bannerColor"
										tile
										><div class="banner-text" v-text="bannerText"></div>
										<template v-slot:actions>
											<v-btn icon color="white" @click="showBanner = false"><v-icon>mdi-close</v-icon></v-btn>
										</template></v-banner
									>
									<v-data-table
										ref="activeDataTable"
										v-model="selected"
										:single-select="true"
										:show-select="true"
										item-key="process_version_id"
										outlined
										loading-text="Loading..."
										:loading="isActivateDataTableLoading"
										:search="activateSearch"
										:headers="activateTableHeaders"
										:items="activateTableData"
										:items-per-page="5"
										:footer-props="footerProps"
										:header-props="headerProps"
										sort-by="process_version_number"
									>
										<!-- Header tooltip -->
										<template v-for="(h, idx) in activateTableHeaders" v-slot:[`header.${h.value}`]="{}">
											<v-tooltip top :key="idx">
												<template v-slot:activator="{ on }">
													<span v-on="on">{{ h.text }}</span>
												</template>
												<span>{{ h.explanation }}</span>
											</v-tooltip>
										</template>
									</v-data-table>
								</v-card-text>
								<v-card-actions class="dialog-card-action">
									<v-spacer></v-spacer>
									<v-btn class="black--text" large depressed tile color="white" @click="activateCancel()">
										CANCEL
									</v-btn>
									<v-btn
										class="white--text"
										:disabled="selected.length == 0"
										large
										depressed
										tile
										color="green darken-3"
										@click="activateItem(selected, expanded, mainTableData, expandTableData)"
									>
										ACTIVATE
									</v-btn>
								</v-card-actions>
							</v-card>
						</v-dialog>
					</v-row>
				</template>

				<!-- edit  -->
				<template>
					<v-row justify="center">
						<v-dialog v-model="editDialog" persistent max-width="600">
							<v-card class="dialog-card-padding">
								<v-card-title class="dialog-card-title">EDIT INFO</v-card-title>
								<v-card-text class="dialog-card-body">
									<v-form ref="editDialogFormInput">
										<v-text-field
											class="input-remove-border"
											:rules="[rules.notEmpty]"
											label="Name"
											outlined
											clearable
											v-model="editInput.name"
										></v-text-field>
										<v-text-field
											class="input-remove-border"
											label="Filename"
											:rules="[rules.extension, rules.notEmpty]"
											outlined
											clearable
											v-model="editInput.filename"
										></v-text-field>
									</v-form>
								</v-card-text>
								<v-card-actions class="dialog-card-action">
									<v-spacer></v-spacer>
									<v-btn class="black--text" large depressed tile color="white" @click="editDialog = false">
										CANCEL
									</v-btn>
									<v-btn
										class="white--text"
										:disabled="isSaveEditButtonDisabled"
										large
										depressed
										tile
										color="teal darken-1"
										@click="editItem(editInput, mainTableData, expandTableData)"
									>
										SAVE
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
									<v-btn
										class="white--text"
										large
										depressed
										tile
										color="red darken-3"
										@click="deleteItem(deletionItem, mainTableData, expandTableData)"
									>
										DELETE
									</v-btn>
								</v-card-actions>
							</v-card>
						</v-dialog>
					</v-row>
				</template>

				<!-- new process version -->
				<template>
					<v-row justify="center">
						<v-dialog ref="versionDialog" v-model="newVersionDialog" persistent :max-width="versionDialogMaxWidth">
							<v-card class="dialog-card-padding">
								<v-card-title class="dialog-card-title">NEW PROCESS VERSION</v-card-title>
								<v-card-text>
									<div v-if="!isVersionDataTableVisible" class="dialog-card-text">Please, pick an option.</div>
									<div class="card-padding" v-if="isVersionDataTableVisible">
										<v-text-field
											v-model="versionTableSearch"
											class="input-remove-border-sans-serif form-search-bottom-margin"
											outlined
											dense
											prepend-inner-icon="mdi-magnify"
											placeholder=" Search"
											single-line
											hide-details
										></v-text-field>

										<v-data-table
											ref="versionTableData"
											v-model="selected"
											:single-select="true"
											:show-select="true"
											item-key="process_version_id"
											tile
											outlined
											loading-text="Loading..."
											:search="versionTableSearch"
											:loading="isVersionTableDataLoading"
											:headers="versionTableHeaders"
											:items="versionTableData"
											:items-per-page="5"
											:footer-props="footerProps"
											:header-props="headerProps"
											sort-by="process_version_number"
											:sort-desc="false"
										>
											<!-- Header tooltip -->
											<template v-for="(h, idx) in versionTableHeaders" v-slot:[`header.${h.value}`]="{}">
												<v-tooltip top :key="idx">
													<template v-slot:activator="{ on }">
														<span v-on="on">{{ h.text }}</span>
													</template>
													<span>{{ h.explanation }}</span>
												</v-tooltip>
											</template>
										</v-data-table>
									</div>
								</v-card-text>
								<v-card-actions v-if="isVersionDataTableVisible" class="dialog-card-action">
									<v-spacer></v-spacer>
									<v-btn class="black--text" large depressed tile color="white" @click="goBackToVersionDialog()">
										BACK
									</v-btn>
									<v-btn
										@click="$router.push({ name: 'model-editor', params: { id: selected[0].process_version_id, obj: selected[0] } })"
										class="white--text form-btn-margin"
										large
										:disabled="selected.length < 1"
										depressed
										tile
										color="blue lighten-1"
										>NEW VERSION</v-btn
									>
								</v-card-actions>
								<v-card-actions v-if="!isVersionDataTableVisible" class="dialog-card-action">
									<v-btn class="black--text" large depressed tile color="white" @click="closeNewVersionDialog()">
										BACK
									</v-btn>
									<v-spacer></v-spacer>
									<v-tooltip slot="append" top>
										<template #activator="{ on }">
											<v-btn
												@click="$router.push({ name: 'model-editor', params: { id: '-1' } })"
												class="white--text form-btn-margin"
												v-on="on"
												large
												depressed
												tile
												color="blue lighten-3"
												>NEW VERSION</v-btn
											>
										</template>
										<span>The default diagram will taken as a template.</span>
									</v-tooltip>

									<v-tooltip slot="append" top>
										<template #activator="{ on }">
											<v-btn
												@click="$router.push({ name: 'model-editor', params: { id: versionItem.active_version_id, obj: versionItem } })"
												class="white--text form-btn-margin"
												:disabled="isDisabledActiveVersionBtn"
												v-on="on"
												large
												depressed
												tile
												color="blue lighten-1"
												>ACTIVE VERSION</v-btn
											>
										</template>
										<span>The active version will taken as a template.</span>
									</v-tooltip>

									<v-tooltip slot="append" top>
										<template #activator="{ on }">
											<v-btn
												@click="showVersionDataTable(versionItem)"
												v-on="on"
												class="white--text form-btn-margin-right"
												:disabled="isDisabledMultipleVersionsBtn"
												large
												depressed
												tile
												color="blue darken-3"
												>PICK A VERSION</v-btn
											>
										</template>
										<span>The version you choose will be taken as a template.</span>
									</v-tooltip>
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
							<v-checkbox v-model="importedActivate" color="primary" label="RED"> </v-checkbox>
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
import { ProcessDefinition, ProcessVersion } from "@/services";
import { HeaderConfig, FooterConfig } from "../utils/config.js";
import * as common from "../utils/common.js";
import BpmnViewer from "bpmn-js/dist/bpmn-viewer.production.min.js";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";

export default {
	name: "Models",
	data() {
		return {
			//AddVersion
			versionDialogMaxWidth: 660,
			versionItem: null,
			versionTableSearch: null,
			isVersionTableDataLoading: true,
			versionTableHeaders: HeaderConfig.activateTableHeaders, //change if needed
			versionTableData: null,

			isVersionDataTableVisible: false,
			isDisabledActiveVersionBtn: true,
			isDisabledMultipleVersionsBtn: true,
			//AddDefinition
			exportFile: null,
			//Delete
			isDeleteLoading: true,
			deletionItem: null,
			deleteText: null,
			//Edit
			editText: null, //TODO
			isEditLoading: true, //not used, TODO: add loading to edit
			editInput: {
				type: null,
				id: null,
				name: null,
				filename: null,
			},
			defaultEditInput: null,
			rules: {
				notEmpty: (field) => {
					return common.isInputValid(field) || "Cannot be empty.";
				},
				extension: (filename) => {
					return common.isExtensionValid(filename) || "Invalid file extension name.";
				},
			},
			//Banner
			showBanner: true,
			bannerIcon: "mdi-lock", //null,
			bannerIconColor: "white", //null,
			bannerColor: "red", //null,
			bannerText: "Some random text", //null,
			//Activation dialog
			activateText: null,
			isActivateDataTableLoading: true,
			activateSearch: null,
			activateTableHeaders: HeaderConfig.activateTableHeaders,
			activateTableData: [],
			isActivateBtnDisabled: true,
			selected: [], //state of selected rows
			//temp data for dialogs
			deactivateText: null,
			deactivationItem: null,
			//Dialogs
			activateDialog: false,
			deactivateDialog: false,
			editDialog: false,
			deleteDialog: false,
			newDefinitionDialog: false,
			newVersionDialog: false,
			//Main table
			expanded: [], //state of expanded rows
			mainSearch: null,
			mainTableData: [],
			isMainTableLoading: true,
			mainTableHeaders: HeaderConfig.mainTableHeaders,
			//Expand table
			expandSearch: null,
			expandTableData: [],
			isExpandTableDataLoading: true,
			expandTableHeaders: HeaderConfig.expandTableHeaders,
			//v-data-table-footer
			footerProps: FooterConfig.footerProps,
			//v-data-table-header
			headerProps: HeaderConfig.headerProps,
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
	computed: {
		isSaveEditButtonDisabled() {
			if (this.defaultEditInput == null) return;
			if (JSON.stringify(this.editInput) == this.defaultEditInput) return true;
			let isFormValid = !this.$refs.editDialogFormInput.inputs.every((x) => x.valid == true);
			return isFormValid;
		},
	},
	watch: {
		selected: function(val) {
			console.log(val);
			debugger;
		},
		bpmnImportFile: function(newInputFile) {
			this.handleFileInput(newInputFile);
		},
	},
	async mounted() {
		this.isMainTableLoading = true;
		let processes = await ProcessDefinition.getProcessDefinitions();
		this.mainTableData = common.reMapDataTableValues(processes);
		this.isMainTableLoading = false;
	},
	methods: {
		goBackToVersionDialog() {
			this.isVersionDataTableVisible = false;
			this.versionDialogMaxWidth = "660";
		},
		closeNewVersionDialog() {
			this.versionDialogMaxWidth = "660";
			this.isVersionDataTableVisible = false;
			this.isVersionTableDataLoading = true;
		},
		async showVersionDataTable(item) {
			this.versionDialogMaxWidth = "660";
			this.isVersionDataTableVisible = false;
			this.isVersionTableDataLoading = true;
			this.versionTableData = await ProcessVersion.getProcessVersions(item.process_definition_id);
			this.versionTableData = common.reMapDataTableValues(this.versionTableData);
			debugger;
			this.versionDialogMaxWidth = "960";
			console.log(this.$refs.versionDialog);
			console.log(this.versionDialogMaxWidth);
			this.isVersionTableDataLoading = false;
			this.isVersionDataTableVisible = true;
			console.log(item);
		},
		showNewVersionDialog(item) {
			this.isDisabledActiveVersionBtn = true;
			this.isDisabledMultipleVersionsBtn = true;
			this.isVersionDataTableVisible = false;
			debugger;
			this.versionItem = item;
			this.newVersionDialog = true;
			if (item?.versions.length > 0) this.isDisabledMultipleVersionsBtn = false;
			if (item?.active_version_id != null) {
				this.isDisabledActiveVersionBtn = false;
			}
		},
		showNewDefinitionDialog() {
			this.newDefinitionDialog = true;
		},

		exportItem(item) {
			let binaryFile = new Blob([item.xml_definition], { type: "text/bpmn" });
			let a = document.createElement("a");
			if (common.isItemProcessDefinition(item)) {
				a.download = item.process_definition_name + ".bpmn";
			} else {
				a.download = item.process_version_name + ".bpmn";
			}
			a.href = window.URL.createObjectURL(binaryFile);
			a.click();
		},
		showDeletionDialog(item) {
			this.deleteDialog = true;
			this.deletionItem = item;
		},
		async deleteItem(deletionItem, mainTableData, expandTableData) {
			debugger;
			if (common.isItemProcessDefinition(deletionItem)) {
				let processDefinition = await ProcessDefinition.deleteProcessDefinition(deletionItem.process_definition_id);
				let pdIdx = mainTableData.findIndex((x) => x.process_definition_id == processDefinition.process_definition);
				mainTableData.splice(pdIdx, 1);
				mainTableData = common.reMapDataTableValues(mainTableData);
			} else {
				let response = await ProcessVersion.deleteProcessVersion(deletionItem.process_version_id);
				if (response.process_definition == null) {
					let processVersionId = response.process_version;
					let pvIdx = expandTableData.findIndex((x) => x.process_version_id == processVersionId);
					expandTableData.splice(pvIdx, 1);
					expandTableData = common.reMapDataTableValues(expandTableData);
				} else if (response.process_definition != null && typeof response.process_definition == "object") {
					let processDefinition = response.process_definition;
					let pdIdx = mainTableData.findIndex((x) => x.process_definition_id == processDefinition.process_definition_id);
					mainTableData.splice(pdIdx, 1, processDefinition);
					mainTableData = common.reMapDataTableValues(mainTableData);

					let processVersion = response.process_version;
					let pvIdx = expandTableData.findIndex((x) => x.process_version_id == processVersion.process_version_id);
					expandTableData.splice(pvIdx, 1);
					expandTableData = common.reMapDataTableValues(expandTableData);
				} else {
					let processVersion = response.process_version;
					let pvIdx = expandTableData.findIndex((x) => x.process_version_id == processVersion.process_version_id);
					expandTableData.splice(pvIdx, 1);
					expandTableData = common.reMapDataTableValues(expandTableData);

					let processDefinition = response.process_definition;
					let pdIdx = mainTableData.findIndex((x) => x.process_definition_id == processDefinition.process_definition_id);
					mainTableData.splice(pdIdx, 1);
					mainTableData = common.reMapDataTableValues(mainTableData);
				}
			}
			this.isDeleteLoading = false;
			this.deleteDialog = false;
		},
		showEditDialog(row) {
			this.editDialog = true;
			if (common.isItemProcessDefinition(row)) {
				this.editInput.id = row.process_definition_id;
				this.editInput.name = row.process_definition_name;
			} else {
				this.editInput.id = row.process_version_id;
				this.editInput.name = row.process_version_name;
			}
			this.editInput.type = row;
			this.editInput.filename = row.file_name;
			this.defaultEditInput = JSON.stringify(this.editInput);
		},
		async editItem(editInput, mainTableData, expandTableData) {
			if (common.isItemProcessDefinition(editInput.type)) {
				let processDefinition = await ProcessDefinition.updateProcessDefinitionInformation(editInput.id, editInput.name, editInput.filename);
				let pdIdx = mainTableData.findIndex((x) => x.process_definition_id == processDefinition.process_definition_id);
				mainTableData.splice(pdIdx, 1, processDefinition);
				mainTableData = common.reMapDataTableValues(mainTableData);
			} else {
				let response = await ProcessVersion.updateProcessVersionInformation(editInput.id, editInput.name, editInput.filename);
				if (response.process_definition != null) {
					let processDefinition = response.process_definition;
					let pdIdx = mainTableData.findIndex((x) => x.process_definition_id == processDefinition.process_definition_id);
					mainTableData.splice(pdIdx, 1, processDefinition);
					mainTableData = common.reMapDataTableValues(mainTableData);
				}
				let processVersion = response.process_version;
				let pvIdx = expandTableData.findIndex((x) => x.process_version_id == processVersion.process_version_id);
				expandTableData.splice(pvIdx, 1, processVersion);
				expandTableData = common.reMapDataTableValues(expandTableData);
			}
			this.editDialog = false;
		},

		showDeactivationDialog(row) {
			this.deactivateDialog = true;
			this.deactivateText = common.showCorrespondingDeactivateText(row);
			this.deactivationItem = row;
		},
		async deactivateItem(row, expanded, mainTableData, expandTableData) {
			if (expanded.length > 0) {
				let response = await ProcessVersion.deactivateProcessVersion(row.process_definition_id, row.process_version_id);
				let processDefinition = response.process_definition;
				let pdIdx = mainTableData.findIndex((x) => x.process_definition_id == processDefinition.process_definition_id);
				mainTableData.splice(pdIdx, 1, processDefinition);
				mainTableData = common.reMapDataTableValues(mainTableData);
				let processVersion = response.process_version;
				let pvIdx = expandTableData.findIndex((x) => x.process_version_id == processVersion.process_version_id);
				expandTableData.splice(pvIdx, 1, processVersion);
				expandTableData = common.reMapDataTableValues(expandTableData);
			} else {
				let processDefinition = await ProcessDefinition.deactivateProcessDefinition(row.process_definition_id);
				let pdIdx = mainTableData.findIndex((x) => x.process_definition_id == processDefinition.process_definition_id);
				mainTableData.splice(pdIdx, 1, processDefinition);
				mainTableData = common.reMapDataTableValues(mainTableData);
			}
			this.deactivateDialog = false;
			this.deactivationItem = null;
		},
		activateCancel() {
			this.activateTableData.splice(0);
			this.selected.splice(0);
			this.activateDialog = false;
		},
		async showActivationDialog(row) {
			this.activateDialog = true;
			this.isActivateDataTableLoading = false;
			this.activateText = common.showCorrespondingActivateText(row);
			if (common.isItemProcessDefinition(row)) {
				let versions = await ProcessVersion.getProcessVersions(row.process_definition_id);
				this.activateTableData = common.reMapDataTableValues(versions);
			} else {
				this.activateTableData.splice(0, 0, row);
			}
			this.isActivateDataTableLoading = false;
		},
		async activateItem(row, expanded, mainTableData, expandTableData) {
			let response = await ProcessVersion.activateProcessVersion(row[0].process_definition_id, row[0].process_version_id);
			let processDefinition = response.process_definition;
			let pdIdx = mainTableData.findIndex((x) => x.process_definition_id == processDefinition.process_definition_id);
			mainTableData.splice(pdIdx, 1, processDefinition);
			mainTableData = common.reMapDataTableValues(mainTableData);
			if (expanded.length > 0) {
				response.process_version.forEach((element) => {
					let processVersion = element;
					let pvIdx = expandTableData.findIndex((x) => x.process_version_id == processVersion.process_version_id);
					expandTableData.splice(pvIdx, 1, processVersion);
					expandTableData = common.reMapDataTableValues(expandTableData);
				});
			}
			this.activateCancel();
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
	margin-bottom: 1%;
	background: linear-gradient(rgba(142, 200, 200, 0.15), rgba(0, 0, 0, 0.11));
	border-radius: 0px !important;
}
.dialog-card-body {
	margin-top: 4%;
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
.input-remove-border {
	border-radius: 0px !important;
}

.input-remove-border-sans-serif {
	border-radius: 0px !important;
	font-size: 15px !important;
	font-weight: 400;
	font-family: Helvetica, Arial, sans-serif;
	letter-spacing: 0px;
}
.items {
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
}
.banner {
	margin: 2% 0% 0% 0%;
}
.banner-text {
	font-size: 17px !important;
	font-weight: 500 !important;
	font-family: Helvetica, Arial, sans-serif;
	letter-spacing: 0px;
	color: white;
}

.form-btn-margin {
	margin-left: 1%;
	margin-right: 1%;
}

.form-btn-margin-right {
	margin-left: 1%;
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
.form-search-bottom-margin {
	margin-bottom: 5% !important;
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
