<template>
	<v-container class="align-start" fluid fill-height>
		<v-row>
			<importer @save="saveImport"></importer>
			<v-col cols="12">
				<v-card class="card-padding" tile outlined>
					<v-card-title class="card-header-margin">
						<v-tooltip slot="append" bottom>
							<template #activator="{ on }">
								<div v-on="on" class="card-title">
									PROCESS DEFINITIONS
								</div>
							</template>
							<span>Definition of the process definition.</span>
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
															<v-icon large @click="showAndHideDialog(item, 'add')">mdi-plus-box</v-icon>
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
							<template #[`item.file_name`]="{ item }">
								<router-link :to="{ name: 'model-editor', params: { id: item.process_definition_id, obj: item } }">
									{{ item.file_name }}
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
						:formData="data1"
						:defaultValues="data1"
						@cancel="isVisibleEditDialog = false"
						@ok="handleEdit"
					></model-edit-dialog>
				</div>
				<!-- active -->
				<div v-if="isVisibleActivateDialog">
					<model-activate-dialog
						:model="isVisibleActivateDialog"
						:data="data1"
						@cancel="isVisibleActivateDialog = false"
						@ok="handleActivate"
					></model-activate-dialog>
				</div>
				<!-- add -->
				<div v-if="isVisibleAddDialog">
					<model-add-dialog :model="isVisibleAddDialog" :data="data1" @cancel="isVisibleAddDialog = false" @ok="handleAdd"></model-add-dialog>
				</div>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import { ProcessDefinition, ProcessVersion } from "@/services";
import { HeaderConfig, FooterConfig, DialogConfig } from "../utils/config.js";
import Importer from "../components/Importer.vue";
import GenericDialog from "../components/dialogs/GenericDialog.vue";
import ModelEditDialog from "../components/dialogs/ModelEditDialog.vue";
import ModelActivateDialog from "../components/dialogs/ModelActivateDialog.vue";
import ModelAddDialog from "../components/dialogs/ModelAddDialog.vue";
import * as common from "../utils/common.js";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";

export default {
	name: "Models",
	components: {
		Importer,
		GenericDialog,
		ModelEditDialog,
		ModelActivateDialog,
		ModelAddDialog,
	},
	//TODO: need to add loading to the dialogs
	data() {
		return {
			utils: common,
			config: DialogConfig.model,
			footerProps: FooterConfig.footerProps,
			headerProps: HeaderConfig.headerProps,

			data1: null,
			isVisibleDeactivateDialog: false,
			isVisibleDeleteDialog: false,
			isVisibleEditDialog: false,
			isVisibleActivateDialog: false,
			isVisibleAddDialog: false,

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
		};
	},
	async mounted() {
		this.isMainTableLoading = true;
		let processes = await ProcessDefinition.getProcessDefinitions();
		this.mainTableData = common.reMapDataTableValues(processes);
		this.isMainTableLoading = false;
	},
	methods: {
		showAndHideDialog(data, type) {
			if (data != null) {
				this.data1 = Object.assign({}, this.data1, data);
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
		async handleAdd() {
			debugger;
		},
		//OK
		async handleDelete(type) {
			if (common.isItemProcessDefinition(this.data1)) {
				let processDefinition = await ProcessDefinition.deleteProcessDefinition(this.data1.process_definition_id);
				this.mainTableData = common.findAndRemove(this.mainTableData, processDefinition, "definition"); //id
			} else {
				let response = await ProcessVersion.deleteProcessVersion(this.data1.process_version_id);
				let process_definition = response.process_definition;
				let process_version = response.process_version;
				if (process_definition == null) {
					this.expandTableData = common.findAndRemove(this.expandTableData, process_version, "version");
				} else if (process_definition != null && typeof process_definition == "object") {
					this.mainTableData = common.findAndReplace(this.mainTableData, process_definition, "definition");
					this.expandTableData = common.findAndRemove(this.expandTableData, process_version, "version");
				} else {
					this.expandTableData = common.findAndRemove(this.expandTableData, process_version, "version");
					this.mainTableData = common.findAndRemove(this.mainTableData, process_definition, "definition");
				}
			}
			this.showAndHideDialog(null, type);
		},
		async handleEdit(data, processType, type) {
			if (processType == "definition") {
				let processDefinition = await ProcessDefinition.updateProcessDefinitionInformation(
					data.process_definition_id,
					data.process_definition_name,
					data.file_name
				);
				this.mainTableData = common.findAndReplace(this.mainTableData, processDefinition, "definition");
			} else {
				let response = await ProcessVersion.updateProcessVersionInformation(data.process_version_id, data.process_version_name, data.file_name);
				if (response.process_definition != null) {
					this.mainTableData = common.findAndReplace(this.mainTableData, response.process_definition, "definition");
				}
				this.expandTableData = common.findAndReplace(this.expandTableData, response.process_version, "version");
			}
			this.showAndHideDialog(null, type);
		},
		async handleActivate(data, type) {
			let response = await ProcessVersion.activateProcessVersion(data.process_definition_id, data.process_version_id);
			this.mainTableData = common.findAndReplace(this.mainTableData, response.process_definition, "definition");
			if (this.expanded.length > 0) {
				response.process_version.forEach((processVersion) => {
					this.expandTableData = common.findAndReplace(this.expandTableData, processVersion, "version");
				});
			}
			this.showAndHideDialog(null, type);
		},
		async handleDeactivate(type) {
			if (this.expanded.length > 0) {
				let response = await ProcessVersion.deactivateProcessVersion(this.data1.process_definition_id, this.data1.process_version_id);
				this.mainTableData = common.findAndReplace(this.mainTableData, response.process_definition, "definition");
				this.expandTableData = common.findAndReplace(this.expandTableData, response.process_version, "version");
			} else {
				let processDefinition = await ProcessDefinition.deactivateProcessDefinition(this.data1.process_definition_id);
				this.mainTableData = common.findAndReplace(this.mainTableData, processDefinition, "definition");
			}
			this.showAndHideDialog(null, type);
		},
		async saveImport(data, fnClearInput) {
			let result = await ProcessDefinition.addProcessDefinition(data);
			this.mainTableData.unshift(result);
			this.mainTableData = common.reMapDataTableValues(this.mainTableData);
			fnClearInput();
		},
		async expandClickHandler(row) {
			if (row.value == false) return;
			this.isExpandTableDataLoading = true;
			let versions = await ProcessVersion.getProcessVersions(row.item.process_definition_id);
			this.expandTableData = common.reMapDataTableValues(versions);
			this.isExpandTableDataLoading = false;
		},
	},
};
</script>

<style>
.import-btn-margin {
	margin-left: 3%;
}

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
	margin: 2% 2% 2% 1%;
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
