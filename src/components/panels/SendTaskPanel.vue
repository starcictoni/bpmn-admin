<template>
	<v-row class="row-margin">
		<div class="panel-container">
			<div class="panel-column-s-0">
				<v-icon>mdi-api</v-icon>
			</div>
			<div class="panel-column-s-1">
				<div class="panel-form-col" v-show="apiConfigured">
					<div class="panel-form-row">
						<div class="fields-text-name" v-text="apiServiceName"></div>
					</div>
					<div class="panel-form-row">
						<div class="fields-text-method" v-text="apiServiceMethod"></div>
						<div class="fields-text-route" v-text="apiServiceRoute"></div>
					</div>
				</div>
				<div class="panel-form-row" v-show="!apiConfigured">
					<div class="fields-text" v-text="apiNotConfigureMessage"></div>
					<v-icon small color="red darken-4">mdi-close-thick</v-icon>
				</div>
			</div>
			<div class="panel-column-s-2">
				<div class="panel-btn">
					<v-tooltip slot="append" top>
						<template #activator="{ on }">
							<v-btn tile v-on="on" slot="activator" outlined icon @click="showDialog()">
								<v-icon>
									mdi-playlist-edit
								</v-icon>
							</v-btn>
						</template>
						<span>Edit task</span>
					</v-tooltip>
				</div>
			</div>
		</div>
		<div v-if="isEditDialogShown">
			<properties-send-task
				@ok="applyChanges"
				@cancel="closeDialog"
				:model="isEditDialogShown"
				:context="context"
				:connector="connector"
				:inputOutput="inputOutput"
				:prefillServiceName="apiServiceName"
				:prefillMethod="apiServiceMethod"
				:prefillRoute="apiServiceRoute"
			></properties-send-task>
		</div>
	</v-row>
</template>
<script>
import * as common from "@/utils/common.js";
import PropertiesSendTask from "@/components/properties/PropertiesSendTask.vue";

export default {
	name: "SendTaskPanel",
	props: ["data", "context"],
	components: {
		PropertiesSendTask,
	},
	data() {
		return {
			utils: common,
			connector: null,
			inputOutput: null,
			isNew: true,
			apiNotConfigureMessage: "NOT CONFIGURED",
			apiConfigured: false,
			apiServiceName: null,
			apiServiceMethod: null,
			apiServiceRoute: null,
			isEditDialogShown: false,
		};
	},
	mounted() {
		this.setState();
		this.setPropertiesPanelData();
	},
	methods: {
		setState() {
			this.connector = this.data.connector;
			this.inputOutput = this.data.inputOutput;
		},
		showDialog() {
			this.isEditDialogShown = true;
		},
		applyChanges(data) {
			console.log(data);
			this.closeDialog();
		},
		closeDialog() {
			this.isEditDialogShown = false;
		},
		setPropertiesPanelData() {
			if (this.data.connector !== undefined) {
				this.apiConfigured = true;
				this.apiServiceName = this.data.connector.connectorId;
				this.apiServiceName = this.apiServiceName.toUpperCase();
				//capitalizeFirstLetter();
				let io = this.data.connector.inputOutput.inputParameters;
				this.apiServiceMethod = io.find((x) => x.name == "method").value;
				this.apiServiceRoute = io.find((x) => x.name == "url").value;
			} else {
				this.apiConfigured = false;
			}
		},
	},
};
</script>
<style>
.row-margin {
	margin: 2% 0% !important;
	padding: 5% !important;
	border: 1px solid #cccc;
}
.panel-container {
	display: flex;
	flex-direction: row;
	width: 100%;
	height: 100%;
}
.panel-column-s-0 {
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	margin-left: 2% !important;
}
.panel-column-s-1 {
	display: flex;
	flex-direction: row;
	margin-left: 10% !important;
}
.panel-column-s-2 {
	display: flex;
	margin-left: auto !important;
	flex-direction: row;
	align-items: center;
	margin-right: 2%;
}
.panel-form-col {
	display: flex;
	flex-direction: column;
}
.panel-form-row {
	display: flex;
	flex-direction: row;
}
.fields-text {
	display: flex;
	flex-direction: row;
	letter-spacing: -1px;
	font-size: 16px;
	font-weight: 400;
}
.fields-text-name {
	color: #3f4242;
	letter-spacing: -1px;
	font-size: 16px;
	font-weight: 500;
}
.fields-text-method {
	letter-spacing: -1px;
	font-size: 16px;
	font-weight: 500;
}
.fields-text-route {
	letter-spacing: 0px;
	font-size: 15px;
	font-weight: 400;
}
</style>
