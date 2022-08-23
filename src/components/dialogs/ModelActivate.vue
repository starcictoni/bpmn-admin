<template>
	<v-dialog v-model="model" persistent max-width="900">
		<v-card class="dialog-card-padding" tile>
			<v-card-title class="dialog-card-title" v-text="config.active.title"></v-card-title>
			<v-card-text>
				<div class="dialog-card-text" v-text="config.active.text"></div>
				<!-- <v-text-field
						v-model="activateSearch"
						class="input-remove-border-sans-serif form-search-bottom-margin"
						outlined
						dense
						prepend-inner-icon="mdi-magnify"
						placeholder=" Search"
						single-line
						hide-details
					></v-text-field> -->
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
			<v-card-actions class="btns-align-right">
				<v-btn class="black--text" large depressed tile color="white" @click="cancelAction()">
					CANCEL
				</v-btn>
				<v-btn class="white--text" :disabled="selected.length == 0" large depressed tile color="green darken-3" @click="okAction()">
					ACTIVATE
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import { HeaderConfig, FooterConfig, DialogConfig } from "../../utils/config.js";
import { ProcessVersion } from "@/services";
import * as common from "../../utils/common.js";
export default {
	name: "ModelActivateDialog",
	props: ["model", "data"],
	data() {
		return {
			config: DialogConfig.model,
			isActivateDataTableLoading: true,
			activateTableHeaders: HeaderConfig.activateTableHeaders,
			footerProps: FooterConfig.footerProps,
			headerProps: HeaderConfig.headerProps,
			activateSearch: null,
			activateTableData: [],
			isActivateBtnDisabled: true,
			selected: [], //state of selected rows
			type: "active",
		};
	},
	async created() {
		this.setData();
	},
	methods: {
		async setData() {
			this.isActivateDataTableLoading = true;
			if (common.isItemProcessDefinition(this.data)) {
				let versions = await ProcessVersion.getProcessVersions(this.data.process_definition_id);
				this.activateTableData = common.reMapDataTableValues(versions);
			} else {
				this.activateTableData.splice(0, 0, this.data);
			}
			this.isActivateDataTableLoading = false;
		},
		cancelAction() {
			this.$emit("cancel");
		},
		okAction() {
			this.$emit("ok", this.selected[0], this.type);
		},
	},
};
</script>

<style>
.dialog-card-title {
	font-family: Helvetica, Arial, sans-serif !important;
	font-size: 25px !important;
	letter-spacing: -1px !important;
	font-weight: 800 !important;
}
</style>
