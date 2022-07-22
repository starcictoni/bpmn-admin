<template>
	<v-row justify="center">
		<v-dialog ref="versionDialog" v-model="model" persistent :max-width="versionDialogMaxWidth">
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
<script>
import { ProcessVersion } from "@/services";
import { HeaderConfig, FooterConfig, DialogConfig } from "../../utils/config.js";
import * as common from "../../utils/common.js";
export default {
	name: "ModelAddDialog",
	props: ["model", "data"],
	data() {
		return {
			config: DialogConfig.model,
			footerProps: FooterConfig.footerProps,
			headerProps: HeaderConfig.headerProps,

			newVersionDialog: false,
			versionDialogMaxWidth: 660,
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
		};
	},
	created() {
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
		cancelAction() {
			this.$emit("cancel");
		},
		okAction() {
			this.$emit("ok", this.data, this.type);
		},
		goBackToVersionDialog() {
			this.isVersionDataTableVisible = false;
			this.versionDialogMaxWidth = "660";
		},
		closeNewVersionDialog() {
			this.newVersionDialog = false;
			this.versionDialogMaxWidth = "660";
		},
		async showVersionDataTable() {
			this.versionDialogMaxWidth = "660";
			this.isVersionDataTableVisible = false;
			this.isVersionTableDataLoading = true;
			this.versionTableData = await ProcessVersion.getProcessVersions(this.data.process_definition_id);
			this.versionTableData = common.reMapDataTableValues(this.versionTableData);
			this.versionDialogMaxWidth = "960";
			this.isVersionTableDataLoading = false;
			this.isVersionDataTableVisible = true;
		},
	},
};
</script>
<style></style>
