<template>
	<v-dialog
		content-class="dialog-border"
		ref="versionDialog"
		v-model="model"
		persistent
		:max-width="versionDialogMaxWidth"
		overlay-opacity="0.65"
		transition="scale-transition"
		open-delay="500"
		close-delay="1000"
	>
		<v-card class="dialog-card-padding" tile>
			<v-card-title class="dialog-card-title-generic" v-text="text"></v-card-title>
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
						item-key="id"
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
						sort-by="number"
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
			<v-card-actions v-if="isVersionDataTableVisible" class="btns-align-right">
				<v-btn class="dialog-card-action-btn black--text" large depressed tile color="white" @click="goBackToVersionDialog()">
					BACK
				</v-btn>
				<v-btn
					@click="goToModeler(selected[0].id, selected[0])"
					class="white--text form-btn-margin"
					large
					:disabled="selected.length < 1"
					depressed
					tile
					color="amber darken-1"
					>NEW VERSION</v-btn
				>
			</v-card-actions>
			<v-card-actions v-if="!isVersionDataTableVisible" class="btns-align-right">
				<v-btn class="dialog-card-action-btn black--text" large depressed tile color="white" @click="closeNewVersionDialog()">
					BACK
				</v-btn>
				<v-spacer></v-spacer>
				<v-tooltip slot="append" top>
					<template #activator="{ on }">
						<v-btn
							@click="goToModeler('-1', versionItem)"
							class="white--text form-btn-margin"
							v-on="on"
							large
							depressed
							tile
							color="amber darken-2"
							>NEW VERSION</v-btn
						>
					</template>
					<span>The default diagram will taken as a template.</span>
				</v-tooltip>

				<v-tooltip slot="append" top>
					<template #activator="{ on }">
						<v-btn
							@click="goToModeler(versionItem.active_version_id, versionItem)"
							class="white--text form-btn-margin"
							:disabled="isDisabledActiveVersionBtn"
							v-on="on"
							large
							depressed
							tile
							color="amber darken-3"
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
							color="amber darken-4"
							>PICK A VERSION</v-btn
						>
					</template>
					<span>The version you choose will be taken as a template.</span>
				</v-tooltip>
			</v-card-actions>
		</v-card>
		<snackbar :show="showSnackbar" :color="snackbarColor" :text="snackbarText"></snackbar>
	</v-dialog>
</template>
<script>
import { ProcessVersion } from "@/services";
import Snackbar from "@/components/Snackbar.vue";
import { HeaderConfig, FooterConfig, DialogConfig, TitleConfig } from "../../utils/config.js";
import * as common from "../../utils/common.js";
export default {
	name: "ModelAddDialog",
	props: ["model", "data"],
	components: {
		Snackbar,
	},
	data() {
		return {
			text: TitleConfig.newVersion,
			config: DialogConfig.model,
			footerProps: FooterConfig.footerProps,
			headerProps: HeaderConfig.headerProps,

			newVersionDialog: false,
			versionDialogMaxWidth: 720,
			versionItem: null,
			versionTableSearch: null,
			isVersionTableDataLoading: true,
			versionTableHeaders: HeaderConfig.activateTableHeaders, //change if needed
			versionTableData: [],
			isVersionDataTableVisible: false,
			isDisabledActiveVersionBtn: true,
			isDisabledMultipleVersionsBtn: true,
			activateTableData: [],
			isActivateBtnDisabled: true,
			selected: [], //state of selected rows
			//Snackbar
			showSnackbar: false,
			snackbarColor: null,
			snackbarText: null,
		};
	},
	mounted() {
		this.isDisabledActiveVersionBtn = true;
		this.isDisabledMultipleVersionsBtn = true;
		this.isVersionDataTableVisible = false;
		this.versionItem = this.data;
		this.newVersionDialog = true;
		if (this.data?.versions.length > 0) this.isDisabledMultipleVersionsBtn = false;
		if (this.data?.active_version_id != null) {
			this.isDisabledActiveVersionBtn = false;
		}
	},
	methods: {
		goToModeler(id, obj) {
			this.$router.push({ name: "editor", params: { id: id, type: "version", obj: obj } });
		},
		goBackToVersionDialog() {
			this.isVersionDataTableVisible = false;
			this.versionDialogMaxWidth = "720";
		},
		closeNewVersionDialog() {
			this.newVersionDialog = false;
			this.versionDialogMaxWidth = "720";
			this.$emit("cancel");
		},
		async showVersionDataTable() {
			this.versionDialogMaxWidth = "720";
			this.isVersionDataTableVisible = false;
			this.isVersionTableDataLoading = true;
			let response = await ProcessVersion.getProcessVersions(this.data.id);
			this.handleSnackbar(response.show, response.message, response.color); //maybe not ok, move to parent or smth
			this.versionTableData = response.data;
			this.activateTableData = common.reMapDataTableValues(response.data);
			this.versionTableData = common.reMapDataTableValues(this.versionTableData);
			this.versionDialogMaxWidth = "960";
			this.isVersionTableDataLoading = false;
			this.isVersionDataTableVisible = true;
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
.dialog-card-title {
	font-family: Helvetica, Arial, sans-serif !important;
	font-size: 25px !important;
	letter-spacing: -1px !important;
	font-weight: 600 !important;
}
</style>
