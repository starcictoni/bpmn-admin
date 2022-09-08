<template>
	<v-dialog
		content-class="dialog-border"
		v-model="model"
		persistent
		tile
		max-width="900"
		overlay-opacity="0.65"
		transition="scale-transition"
		open-delay="500"
		close-delay="1000"
	>
		<v-card class="dialog-card-padding" tile>
			<v-card-title class="dialog-card-title-generic" v-text="config.title"></v-card-title>
			<v-card-text>
				<v-data-table
					ref="activeDataTable"
					v-model="selected"
					:single-select="true"
					:show-select="true"
					item-key="id"
					outlined
					loading-text="Loading..."
					:loading="isActivateDataTableLoading"
					:headers="activateTableHeaders"
					:items="activateTableData"
					:items-per-page="5"
					:footer-props="footerProps"
					:header-props="headerProps"
					sort-by="number"
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
				<v-btn class="dialog-card-action-btn black--text" large depressed tile color="white" @click="cancelAction()">
					CANCEL
				</v-btn>
				<v-btn
					class="dialog-card-action-btn white--text"
					large
					depressed
					tile
					:disabled="selected.length == 0"
					:color="config.buttonColor"
					@click="okAction()"
				>
					ACTIVATE
				</v-btn>
			</v-card-actions>
		</v-card>
		<snackbar :show="showSnackbar" :color="snackbarColor" :text="snackbarText"></snackbar>
	</v-dialog>
</template>

<script>
import { HeaderConfig, FooterConfig, DialogConfig } from "../../utils/config.js";
import Snackbar from "@/components/Snackbar.vue";
import { ProcessVersion } from "@/services";
import * as common from "../../utils/common.js";
export default {
	name: "ModelActivateDialog",
	props: ["model", "data"],
	components: {
		Snackbar,
	},
	data() {
		return {
			config: DialogConfig.model.active,
			isActivateDataTableLoading: true,
			activateTableHeaders: HeaderConfig.activateTableHeaders,
			footerProps: FooterConfig.footerProps,
			headerProps: HeaderConfig.headerProps,
			activateTableData: [],
			isActivateBtnDisabled: true,
			selected: [],
			type: "active",
			//Snackbar
			showSnackbar: false,
			snackbarColor: null,
			snackbarText: null,
		};
	},
	async created() {
		this.setData();
	},
	methods: {
		async setData() {
			this.isActivateDataTableLoading = true;
			if (common.isItemProcessDefinition(this.data)) {
				let response = await ProcessVersion.getProcessVersions(this.data.id);
				this.handleSnackbar(response.show, response.message, response.color);
				this.activateTableData = common.reMapDataTableValues(response.data);
			} else {
				this.activateTableData.splice(0, 0, this.data);
			}
			this.isActivateDataTableLoading = false;
		},
		cancelAction() {
			this.$emit("cancel");
		},
		okAction() {
			this.$emit("ok", this.selected[0], "active");
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
	font-weight: 800 !important;
}
</style>
