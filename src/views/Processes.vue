<template>
	<v-container class="align-start" fluid fill-height>
		<v-row>
			<importer @save="saveImport" :key="importerKey"></importer>
			<v-col cols="12">
				<v-card class="card-padding" tile outlined>
					<v-card-title class="card-header-margin">
						<div class="card-title" v-text="titleText.processDefinitions"></div>
						<div class="card-header-action">
							<v-tooltip slot="append" right>
								<template #activator="{ on }">
									<v-btn @click="goToModeler()" v-on="on" icon color="yellow accent-4">
										<v-icon class="add-icon-large">mdi-plus-box</v-icon>
									</v-btn>
								</template>
								<span v-text="explanationText.goToPModeler"></span>
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
							item-key="id"
							outlined
							loading-text="Loading..."
							:loading="isMainTableLoading"
							:search="mainSearch"
							:headers="mainTableHeaders"
							:items="mainTableData"
							:expanded.sync="expanded"
							:items-per-page="10"
							@item-expanded="getProcessVersionData"
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
											<div class="card-title" v-text="titleText.processVersions"></div>
											<div class="card-header-action">
												<v-tooltip slot="append" right>
													<template #activator="{ on }">
														<v-btn v-on="on" icon color="yellow accent-4">
															<v-icon class="add-icon-large" @click="showAndHideDialog(item, 'add')">mdi-plus-box</v-icon>
														</v-btn>
													</template>
													<span v-text="explanationText.addNewProcess"></span>
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
												:item-id="item.id"
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
												sort-by="number"
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
												<template #[`item.filename`]="{ item }">
													<router-link :to="{ name: 'viewer', params: { id: item.id, type: 'version', obj: item } }">
														{{ item.filename }}
													</router-link>
												</template>
												<!-- Actions -->
												<template #[`item.actions`]="{ item }">
													<v-tooltip slot="append" top>
														<template #activator="{ on }">
															<v-icon :disabled="item.is_active == 'Yes'" dense v-on="on" slot="activator" @click="showAndHideDialog(item, 'active')">
																mdi-check-bold
															</v-icon>
														</template>
														<span>Activate</span>
													</v-tooltip>
													<v-tooltip slot="append" top>
														<template #activator="{ on }">
															<v-icon :disabled="item.is_active == 'No'" dense v-on="on" slot="activator" @click="showAndHideDialog(item, 'inactive')">
																mdi-close-thick
															</v-icon>
														</template>
														<span>Deactivate</span>
													</v-tooltip>
													<v-tooltip slot="append" top>
														<template #activator="{ on }">
															<v-icon dense v-on="on" slot="activator" @click="showAndHideDialog(item, 'edit')">
																mdi-pencil
															</v-icon>
														</template>
														<span>Edit</span>
													</v-tooltip>
													<v-tooltip slot="append" top>
														<template #activator="{ on }">
															<v-icon dense v-on="on" slot="activator" @click="showAndHideDialog(item, 'delete')">
																mdi-trash-can
															</v-icon>
														</template>
														<span>Delete</span>
													</v-tooltip>
													<v-tooltip slot="append" top>
														<template #activator="{ on }">
															<v-icon dense v-on="on" slot="activator" @click="utils.exportItem(item)">
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
							<template #[`item.filename`]="{ item }">
								<router-link :to="{ name: 'viewer', params: { id: item.id, type: 'definition' } }">
									{{ item.filename }}
								</router-link>
							</template>
							<!-- Actions -->
							<template #[`item.actions`]="{ item }">
								<v-tooltip slot="append" top>
									<template #activator="{ on }">
										<v-icon :disabled="item.is_active == 'Yes'" dense v-on="on" slot="activator" @click="showAndHideDialog(item, 'active')">
											mdi-check-bold
										</v-icon>
									</template>
									<span>Activate</span>
								</v-tooltip>
								<v-tooltip slot="append" top>
									<template #activator="{ on }">
										<v-icon :disabled="item.is_active == 'No'" dense v-on="on" slot="activator" @click="showAndHideDialog(item, 'inactive')">
											mdi-close-thick
										</v-icon>
									</template>
									<span>Deactivate</span>
								</v-tooltip>
								<v-tooltip slot="append" top>
									<template #activator="{ on }">
										<v-icon dense v-on="on" slot="activator" @click="showAndHideDialog(item, 'edit')">
											mdi-pencil
										</v-icon>
									</template>
									<span>Edit</span>
								</v-tooltip>
								<v-tooltip slot="append" top>
									<template #activator="{ on }">
										<v-icon dense v-on="on" slot="activator" @click="showAndHideDialog(item, 'delete')">
											mdi-trash-can
										</v-icon>
									</template>
									<span>Delete</span>
								</v-tooltip>
								<v-tooltip slot="append" top>
									<template #activator="{ on }">
										<v-icon dense v-on="on" slot="activator" @click="utils.exportItem(item)">
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
				<div v-if="isVisibleDeactivateDialog">
					<generic-dialog
						ref="deactivateDialog"
						:model="isVisibleDeactivateDialog"
						:title="config.inactive.title"
						:text="config.inactive.text"
						:btnColor="config.inactive.buttonColor"
						type="inactive"
						@cancel="isVisibleDeactivateDialog = false"
						@ok="handleDeactivate"
					></generic-dialog>
				</div>
				<!-- delete -->
				<div v-if="isVisibleDeleteDialog">
					<generic-dialog
						ref="deleteDialog"
						:model="isVisibleDeleteDialog"
						:title="config.delete.title"
						:text="config.delete.text"
						:btnColor="config.delete.buttonColor"
						type="delete"
						@cancel="isVisibleDeleteDialog = false"
						@ok="handleDelete"
					>
					</generic-dialog>
				</div>
				<!-- edit -->
				<div v-if="isVisibleEditDialog">
					<model-edit-dialog
						:model="isVisibleEditDialog"
						:formData="selectedProcess"
						:defaultValues="selectedProcess"
						@cancel="isVisibleEditDialog = false"
						@ok="handleEdit"
					></model-edit-dialog>
				</div>
				<!-- active -->
				<div v-if="isVisibleActivateDialog">
					<model-activate-dialog
						:model="isVisibleActivateDialog"
						:data="selectedProcess"
						@cancel="isVisibleActivateDialog = false"
						@ok="handleActivate"
					></model-activate-dialog>
				</div>
				<!-- add -->
				<div v-if="isVisibleAddDialog">
					<model-add-dialog :model="isVisibleAddDialog" :data="selectedProcess" @cancel="isVisibleAddDialog = false"></model-add-dialog>
				</div>
				<snackbar :show="showSnackbar" :color="snackbarColor" :text="snackbarText"></snackbar>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import { ProcessDefinition, ProcessVersion } from "@/services";
import { HeaderConfig, FooterConfig, DialogConfig, TitleConfig, TextConfig } from "@/utils/config.js";
import Importer from "@/components/Importer.vue";
import GenericDialog from "@/components/dialogs/GenericDialog.vue";
import ModelEditDialog from "@/components/dialogs/ModelEdit.vue";
import ModelActivateDialog from "@/components/dialogs/ModelActivate.vue";
import ModelAddDialog from "@/components/dialogs/ModelAdd.vue";
import Snackbar from "@/components/Snackbar.vue";
import * as common from "../utils/common.js";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";

export default {
	name: "Processes",
	components: {
		Importer,
		GenericDialog,
		ModelEditDialog,
		ModelActivateDialog,
		ModelAddDialog,
		Snackbar,
	},
	data() {
		return {
			//Configuration
			importerKey: 0,
			titleText: TitleConfig,
			explanationText: TextConfig.explanations,
			utils: common,
			config: DialogConfig.model,
			footerProps: FooterConfig.footerProps,
			headerProps: HeaderConfig.headerProps,
			//Dialogs
			selectedProcess: null,
			isVisibleAddDialog: false,
			isVisibleDeactivateDialog: false,
			isVisibleDeleteDialog: false,
			isVisibleEditDialog: false,
			isVisibleActivateDialog: false,
			//Definitions
			expanded: [],
			mainSearch: null,
			mainTableData: [],
			isMainTableLoading: true,
			mainTableHeaders: HeaderConfig.mainTableHeaders,
			//Versions
			expandSearch: null,
			expandTableData: [],
			isExpandTableDataLoading: true,
			expandTableHeaders: HeaderConfig.expandTableHeaders,
			//Snackbar
			showSnackbar: false,
			snackbarColor: null,
			snackbarText: null,
		};
	},
	async mounted() {
		await this.getProcessDefinitionData();
	},
	methods: {
		goToModeler() {
			if (this.$route.path != "/processes/new/-1") {
				this.$router.push({ name: "editor", params: { id: "-1", type: "definition" } });
			}
		},
		showAndHideDialog(data, type) {
			if (data != null) {
				this.selectedProcess = Object.assign({}, this.selectedProcess, data);
			}
			switch (type) {
				case "add":
					this.isVisibleAddDialog = !this.isVisibleAddDialog;
					break;
				case "active":
					this.isVisibleActivateDialog = !this.isVisibleActivateDialog;
					break;
				case "inactive":
					this.isVisibleDeactivateDialog = !this.isVisibleDeactivateDialog;
					break;
				case "edit":
					this.isVisibleEditDialog = !this.isVisibleEditDialog;
					break;
				case "delete":
					this.isVisibleDeleteDialog = !this.isVisibleDeleteDialog;
					break;
			}
		},
		async handleDelete(type) {
			if (common.isItemProcessDefinition(this.selectedProcess)) {
				let response = await ProcessDefinition.deleteProcessDefinition(this.selectedProcess.id);
				this.handleSnackbar(response.show, response.message, response.color);
				this.mainTableData = common.findAndRemove(this.mainTableData, response.data);
			} else {
				let response = await ProcessVersion.deleteProcessVersion(this.selectedProcess.id);
				this.handleSnackbar(response.show, response.message, response.color);
				let process_definition = response.data.process_definition;
				let process_version = response.data.process_version;
				if (process_definition == null) {
					this.expandTableData = common.findAndRemove(this.expandTableData, process_version);
				} else if (process_definition != null && typeof process_definition == "object") {
					this.mainTableData = common.findAndReplace(this.mainTableData, process_definition);
					this.expandTableData = common.findAndRemove(this.expandTableData, process_version);
				} else {
					this.expandTableData = common.findAndRemove(this.expandTableData, process_version);
					this.mainTableData = common.findAndRemove(this.mainTableData, process_definition);
				}
			}
			this.showAndHideDialog(null, type);
		},
		async handleEdit(id, data, processType, type) {
			if (processType == "definition") {
				let response = await ProcessDefinition.updateProcessDefinitionInformation(id, data.name, data.filename);
				this.handleSnackbar(response.show, response.message, response.color);
				this.mainTableData = common.findAndReplace(this.mainTableData, response.data);
			} else {
				let response = await ProcessVersion.updateProcessVersionInformation(id, data.name, data.filename);
				this.handleSnackbar(response.show, response.message, response.color);
				if (response.process_definition != null) {
					this.mainTableData = common.findAndReplace(this.mainTableData, response.data.process_definition);
				}
				this.expandTableData = common.findAndReplace(this.expandTableData, response.data.process_version);
			}
			this.showAndHideDialog(null, type);
		},
		async handleActivate(data, type) {
			let response = await ProcessVersion.activateProcessVersion(data.definition, data.id);
			this.mainTableData = common.findAndReplace(this.mainTableData, response.data.process_definition);
			if (this.expanded.length > 0) {
				response.data.process_version.forEach((processVersion) => {
					this.expandTableData = common.findAndReplace(this.expandTableData, processVersion);
				});
			}
			this.handleSnackbar(response.show, response.message, response.color);
			this.showAndHideDialog(null, type);
		},
		async handleDeactivate(type) {
			if (this.expanded.length > 0) {
				let response = await ProcessVersion.deactivateProcessVersion(this.selectedProcess.definition, this.selectedProcess.id);
				this.handleSnackbar(response.show, response.message, response.color);
				this.mainTableData = common.findAndReplace(this.mainTableData, response.data.process_definition);
				this.expandTableData = common.findAndReplace(this.expandTableData, response.data.process_version);
			} else {
				let response = await ProcessDefinition.deactivateProcessDefinition(this.selectedProcess.id);
				this.handleSnackbar(response.show, response.message, response.color);
				this.mainTableData = common.findAndReplace(this.mainTableData, response.data);
			}
			this.showAndHideDialog(null, type);
		},
		async saveImport(data, fnClearInput) {
			this.importerKey += 1;
			let response = await ProcessDefinition.addProcessDefinition(data);
			this.handleSnackbar(response.show, response.message, response.color);
			this.mainTableData.unshift(response.data);
			this.mainTableData = common.reMapDataTableValues(this.mainTableData);
			fnClearInput();
		},
		async getProcessDefinitionData() {
			this.isMainTableLoading = true;
			let response = await ProcessDefinition.getProcessDefinitions();
			this.handleSnackbar(response.show, response.message, response.color);
			this.mainTableData = common.reMapDataTableValues(response.data);
			this.isMainTableLoading = false;
		},
		async getProcessVersionData(row) {
			if (row.value == false) return;
			this.isExpandTableDataLoading = true;
			let response = await ProcessVersion.getProcessVersions(row.item.id);
			this.handleSnackbar(response.show, response.message, response.color);
			this.expandTableData = common.reMapDataTableValues(response.data);
			this.isExpandTableDataLoading = false;
		},
		handleSnackbar(show, text, color) {
			this.showSnackbar = show;
			this.snackbarText = text;
			this.snackbarColor = color;
			setTimeout(() => {
				this.showSnackbar = false;
			}, 3000);
		},
	},
};
</script>

<style>
.add-icon-large {
	font-size: 34px !important;
}
.import-btn-margin {
	margin-left: 3%;
}

.dialog-card-padding {
	padding: 3%;
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
	margin: 2% 2% 2% 1%;
	background: linear-gradient(rgba(142, 200, 200, 0.15), rgba(0, 0, 0, 0.11));
	border-radius: 0px !important;
}
.dialog-card-body {
	margin-top: 4%;
}
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
	margin-left: 0.3%;
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
	padding-right: 2%;
	flex-grow: 9;
}

.form-item-file-input-margin {
	margin-right: 1%;
}

.form-item-file-general {
	margin-top: 3%;
}
.form-item-btn-import {
	width: 100%;
	flex-grow: 3;
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
.import-card-padding {
	padding: 1%;
}

.process-import-info {
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	margin-left: 1.5%;
	margin-right: 1.5%;
}
.process-import-info-cancel {
	margin-right: 1%;
}
.process-import-info-save {
	margin-right: 1%;
}

.v-text-field > .v-input__control > .v-input__slot {
	cursor: pointer;
}
</style>
