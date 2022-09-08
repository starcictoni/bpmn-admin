<template>
	<v-container fill-height fluid class="background">
		<v-row align="center" justify="center">
			<v-col align="center" justify="center" cols="12">
				<v-card elevation="0" class="card-padding" tile outlined max-width="1200">
					<v-card-title>
						<div class="card-title" v-text="text"></div>
						<div class="card-header-action">
							<v-tooltip slot="append" right>
								<template #activator="{ on }">
									<v-btn v-on="on" icon color="yellow accent-4">
										<v-icon large @click="showAndHideDialog(null, 'add')">mdi-plus-box</v-icon>
									</v-btn>
								</template>
								<span>Add a new service</span>
							</v-tooltip>
						</div>
						<v-spacer></v-spacer>
						<v-text-field
							v-model="serviceSearch"
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
							tile
							outlined
							loading-text="Loading..."
							:search="serviceSearch"
							:loading="isServiceDataTableLoading"
							:headers="serviceHeaders"
							:items="serviceTableData"
							:items-per-page="10"
							:footer-props="footerProps"
							:header-props="headerProps"
							sort-by="address"
							:sort-desc="false"
							item-key="id"
						>
							<!-- Status -->
							<template #[`item.status`]="{ item }">
								<v-tooltip slot="append" top>
									<template #activator="{ on }">
										<v-icon :color="setColor(item.is_active, item.status)" v-on="on" slot="activator">{{
											item.is_active == "Yes" ? (item.status ? "mdi-arrow-up-bold-box" : "mdi-arrow-down-bold-box") : "mdi-tools"
										}}</v-icon>
									</template>
									<span v-text="setText(item.is_active, item.status)">Activate</span>
								</v-tooltip>
							</template>

							<!-- Header tooltip -->
							<template v-for="(h, idx) in serviceHeaders" v-slot:[`header.${h.value}`]="{}">
								<v-tooltip top :key="idx">
									<template v-slot:activator="{ on }">
										<span v-on="on">{{ h.text }}</span>
									</template>
									<span>{{ h.explanation }}</span>
								</v-tooltip>
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
										<v-icon dense v-on="on" slot="activator" @click.stop="showAndHideDialog(item, 'edit')">
											mdi-pencil
										</v-icon>
									</template>
									<span>Edit</span>
								</v-tooltip>

								<v-tooltip slot="append" top>
									<template #activator="{ on }">
										<v-icon dense v-on="on" slot="activator" @click.stop="showAndHideDialog(item, 'delete')">
											mdi-trash-can
										</v-icon>
									</template>
									<span>Delete</span>
								</v-tooltip>
							</template>
						</v-data-table>
					</v-card-text>
				</v-card>

				<div v-if="isVisibleEditDialog">
					<service-add-edit-dialog
						ref="addDialog"
						:model="isVisibleEditDialog"
						:title="config.edit.title"
						:text="config.edit.text"
						:btnColor="config.edit.buttonColor"
						:formData="data"
						type="edit"
						@cancel="isVisibleEditDialog = false"
						@ok="handleAddAndEdit"
					></service-add-edit-dialog>
				</div>
				<div v-if="isVisibleAddDialog">
					<service-add-edit-dialog
						ref="addDialog"
						:model="isVisibleAddDialog"
						:title="config.add.title"
						:text="config.add.text"
						:btnColor="config.add.buttonColor"
						:formData="data"
						type="add"
						@cancel="isVisibleAddDialog = false"
						@ok="handleAddAndEdit"
					></service-add-edit-dialog>
				</div>
				<div v-if="isVisibleActivateDialog">
					<generic-dialog
						ref="activateDialog"
						:model="isVisibleActivateDialog"
						:title="config.active.title"
						:text="config.active.text"
						:btnColor="config.active.buttonColor"
						type="active"
						@cancel="isVisibleActivateDialog = false"
						@ok="handleOk"
					></generic-dialog>
				</div>
				<div v-if="isVisibleDeactivateDialog">
					<generic-dialog
						ref="deactivateDialog"
						:model="isVisibleDeactivateDialog"
						:title="config.inactive.title"
						:text="config.inactive.text"
						:btnColor="config.inactive.buttonColor"
						type="inactive"
						@cancel="isVisibleDeactivateDialog = false"
						@ok="handleOk"
					></generic-dialog>
				</div>
				<div v-if="isVisibleDeleteDialog">
					<generic-dialog
						ref="deleteDialog"
						:model="isVisibleDeleteDialog"
						:title="config.delete.title"
						:text="config.delete.text"
						:btnColor="config.delete.buttonColor"
						type="delete"
						@cancel="isVisibleDeleteDialog = false"
						@ok="handleOk"
					></generic-dialog>
				</div>
			</v-col>
			<snackbar :show="showSnackbar" :color="snackbarColor" :text="snackbarText"></snackbar>
		</v-row>
	</v-container>
</template>
<script>
import * as common from "@/utils/common.js";
import { WebService } from "@/services/index.js";
import { HeaderConfig, FooterConfig, DialogConfig, TitleConfig } from "../utils/config.js";
import GenericDialog from "@/components/dialogs/GenericDialog.vue";
import ServiceAddEditDialog from "@/components/dialogs/WebServiceAddEdit.vue";
import Snackbar from "@/components/Snackbar.vue";
export default {
	name: "Services",
	components: {
		GenericDialog,
		ServiceAddEditDialog,
		Snackbar,
	},
	data() {
		return {
			text: TitleConfig.services,
			config: DialogConfig.service,
			data: null,
			isVisibleDeleteDialog: false,
			isVisibleActivateDialog: false,
			isVisibleDeactivateDialog: false,
			isVisibleAddDialog: false,
			isVisibleEditDialog: false,
			serviceSearch: null,
			isServiceDataTableLoading: false,
			footerProps: FooterConfig.footerProps,
			headerProps: HeaderConfig.headerProps,
			serviceHeaders: HeaderConfig.serviceTableHeaders,
			serviceTableData: [],
			//Snackbar
			showSnackbar: false,
			snackbarColor: null,
			snackbarText: null,
		};
	},
	async mounted() {
		this.getDataTableData();
	},
	methods: {
		showAndHideDialog(data, type) {
			this.data = data;
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
		setColor(active, status) {
			if (active == "No") return "yellow accent-4 ";
			return (status = status ? "green accent-3" : "red accent-3");
		},
		setText(active, status) {
			if (active == "No") return "Service is under maintenance";
			return (status = status ? "Service is up" : "Service is down");
		},
		applyChanges(response, type) {
			this.serviceTableData = common.reMapDataTableValues(this.serviceTableData);
			this.setColor(response.is_active, response.status);
			this.setText(response, response.is_active, response.status);
			this.isServiceDataTableLoading = false;
			this.showAndHideDialog(null, type);
		},
		async handleOk(type) {
			this.isServiceDataTableLoading = true;
			let response = null;
			if (type === "delete") {
				response = await WebService.deleteService(this.data.id);
				this.handleSnackbar(response.show, response.message, response.color);
				if (response.data) {
					let idx = this.serviceTableData.findIndex((x) => x.id == response.data.id);
					this.serviceTableData.splice(idx, 1);
				}
			} else {
				response = await WebService.changeServiceStatus(this.data.id);
				this.handleSnackbar(response.show, response.message, response.color);
				if (response.data) {
					let idx = this.serviceTableData.findIndex((x) => x.id == response.data.id);
					this.serviceTableData.splice(idx, 1, response.data);
				}
			}
			this.applyChanges(response, type);
		},
		async handleAddAndEdit(type, data) {
			this.isServiceDataTableLoading = true;
			if (type == "add") {
				let response = await WebService.addService(data);
				this.handleSnackbar(response.show, response.message, response.color);
				if (response.data) {
					this.serviceTableData.splice(0, 0, response.data);
				}
				this.applyChanges(response, type);
			} else {
				let response = await WebService.updateService(data);
				this.handleSnackbar(response.show, response.message, response.color);
				if (response.data) {
					let idx = this.serviceTableData.findIndex((x) => x.id == response.data.id);
					this.serviceTableData.splice(idx, 1, response.data);
				}
				this.applyChanges(response, type);
			}
		},
		async getDataTableData() {
			this.isServiceDataTableLoading = true;
			let response = await WebService.getServices();
			this.handleSnackbar(false, response.message, response.color);
			this.serviceTableData = common.reMapDataTableValues(response.data);
			this.isServiceDataTableLoading = false;
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
.background {
	/* background-color: cornsilk !important; */
	/* background-color: ghostwhite !important; */
	/* background-color: floralwhite !important; */
	/* background-color: whitesmoke !important; */
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
.card-padding {
	padding: 2%;
}
</style>
