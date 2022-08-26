<template>
	<v-row>
		<v-col cols="12" class="col-no-bottom-padding">
			<div class="card-title connector-title-margin">CONNECTOR</div>
			<v-select
				class="input-remove-border"
				v-model="serviceItem"
				append-outer-icon="mdi-api"
				item-text="name"
				label="Select a service"
				dense
				clearable
				outlined
				cache-items
				return-object
				:loading="areServicesLoading"
				:disabled="areServicesLoading"
				:items="services"
				@click:clear="clearServiceInput()"
			></v-select>
			<!-- @change="getServiceMeta" -->
		</v-col>
		<v-col cols="12" class="warning-col" v-show="isWarningVisible">
			<div class="warning-outter-fill">
				<div class="warning-frame">
					<v-sheet elevation="0" color="yellow darken-2" class="warning-text white--text"
						>The selected service is not online; therefore its selection is not available. You can check service statuses in the service overview
						option.</v-sheet
					>
				</div>
			</div>
		</v-col>
		<v-col cols="4" class="col-no-top-padding">
			<v-select
				class="input-remove-border"
				v-model="methodItem"
				append-outer-icon="mdi-routes"
				item-text="url"
				label="Available methods"
				dense
				clearable
				outlined
				return-object
				:loading="areMethodsLoading"
				:disabled="areMethodsDisabled"
				:items="methods"
				@click:clear="clearMethodInput()"
			></v-select>
		</v-col>
		<v-col cols="8" class="col-no-top-padding">
			<v-select
				class="input-remove-border"
				v-model="routeItem"
				append-outer-icon="mdi-routes"
				item-text="url"
				label="Available routes"
				dense
				clearable
				outlined
				return-object
				:loading="areRoutesLoading"
				:disabled="areRoutesDisabled"
				:items="routes"
			></v-select>
		</v-col>
		<v-col cols="12" class="col-no-top-padding">
			<div class="form-header">
				<div class="form-header-text" v-text="mapText"></div>
				<div class="form-header-btn">
					<v-btn @click="addEntry()" icon color="yellow accent-3">
						<v-icon class="icon-medium">mdi-plus-box</v-icon>
					</v-btn>
				</div>
			</div>
			<div class="form-body-property" v-for="(param, idx) in parameters" :key="'key-' + idx" :ref="'parameter-' + idx">
				<v-text-field
					v-model="param.key"
					class="form-field-horizontal input-remove-border"
					clearable
					outlined
					dense
					label="Parameter Key"
				></v-text-field>
				<v-text-field v-model="param.value" class="input-remove-border" clearable outlined dense label="Parameter Value"></v-text-field>
				<v-btn class="form-field-horizontal-btn" color="red accent-4" @click="removeEntry(param, idx)" icon tile>
					<v-icon class="icon-medium">mdi-close-box</v-icon>
				</v-btn>
			</div>
		</v-col>
		<snackbar :show="showSnackbar" :color="snackbarColor" :text="snackbarText"></snackbar>
	</v-row>
</template>

<script>
import { BpmnXml } from "@/utils/bpmn.js";
import { WebService } from "@/services/index";
import { DialogConfig } from "../utils/config.js";
import Snackbar from "@/components/Snackbar.vue";
export default {
	components: {
		Snackbar,
	},
	name: "service-selector",
	props: ["connectorData", "context"],
	data() {
		return {
			connector: null,
			//prefilled data
			service: null,
			params: null,
			method: null,
			route: null,
			//Snackbar
			showSnackbar: false,
			snackbarColor: null,
			snackbarText: null,
			//General
			mapText: DialogConfig.serviceConfiguration.connectorParams.title,
			isWarningVisible: false,
			//services
			areServicesLoading: false,
			services: [],
			serviceItem: {},
			//methods
			methods: [],
			methodItem: {},
			areMethodsLoading: false,
			areMethodsDisabled: true,
			//routes
			routes: [],
			routeItem: {},
			areRoutesLoading: false,
			areRoutesDisabled: true,
			availableRoutes: [],
			//
			parameters: [],
		};
	},
	watch: {
		serviceItem: async function(newValue) {
			this.isWarningVisible = false;
			if (newValue != null) {
				this.$emit("setService", newValue.name, newValue);
				if (newValue.status == false) {
					this.isWarningVisible = true;
					this.clearServiceInput();
				} else {
					await this.getServiceMeta(newValue); //setMethodsState poziva meta
				}
			} else {
				this.$emit("setService", null, null);
				this.clearServiceInput();
			}
		},
		methodItem: function(newValue) {
			if (newValue != null) {
				this.$emit("setMethod", newValue);
				this.setRoutesState(newValue);
			} else {
				this.$emit("setMethod", null);
				this.clearMethodInput();
			}
		},
		routeItem: function(newValue) {
			if (newValue != null) {
				this.$emit("setRoute", newValue);
			} else {
				this.$emit("setRoute", null);
			}
		},
		parameters: {
			handler: function() {
				if (this.parameters.length == 0) {
					let urlParameter = this.createUrlParameter();
					this.parameters.push(urlParameter);
				}
				this.$emit("setUrlParameters", this.params);
			},
			deep: true,
		},
	},
	async mounted() {
		this.setData();
	},
	methods: {
		async setData() {
			this.connector = this.connectorData;
			await this.getServices(); //<- this.services
			if (this.connector && this.connector.connectorId) {
				let serviceItem = this.services.find((x) => x.name.toUpperCase() == this.connector.connectorId.toUpperCase());
				this.serviceItem = this.services.find((x) => x.name.toUpperCase() == this.connector.connectorId.toUpperCase());
				if (serviceItem?.status) {
					await this.getServiceMeta(serviceItem); //<- this.availableRoutes
					this.method = this.connector.inputOutput.inputParameters.find((x) => x.name == "method");
					this.methodItem = this.method?.value;
					this.route = this.connector.inputOutput.inputParameters.find((x) => x.name == "url");
					this.routeItem = this.route?.value;
				} else {
					this.isWarningVisible = true;
					this.clearServiceInput();
				}
			} else {
				let moddle = this.context.modeler.get("moddle");
				let parent = this.context.bpmnElement.businessObject.extensionElements;
				this.connector = BpmnXml.createSpecialConnector(moddle, parent);
			}
			this.params = this.connector?.inputOutput.inputParameters.find((x) => x.name == "url_parameter");
			if (!this.params) {
				this.params = this.createUrlParameter();
			}
			this.parameters = this.params.definition.entries;
		},
		createUrlParameter() {
			let moddle = this.context.modeler.get("moddle");
			let urlParameter = BpmnXml.createSpecialConnectorInputIrregular(moddle, this.connector.inputOutput);
			return urlParameter;
		},
		addEntry() {
			let moddle = this.context.modeler.get("moddle");
			let entry = BpmnXml.createEntry(moddle, this.parameters);
			this.parameters.push(entry);
		},
		removeEntry(item, index) {
			if (!item) return;
			this.parameters.splice(index, 1);
		},
		async getServices() {
			this.setServicesLoadingState(true);
			let response = await WebService.getServices();
			this.handleSnackbar(response.show, response.message, response.color);
			this.services = response.data;
			this.setServicesLoadingState(false);
		},
		async getServiceMeta(selectedService) {
			this.setMethodsLoadingState(true);
			this.setRoutesLoadingState(true);
			let response = await WebService.getServiceMeta(selectedService.address);
			this.handleSnackbar(response.show, response.message, response.color);
			this.availableRoutes = response.data;
			if (this.availableRoutes.length != 0) {
				this.setMethodsState();
			}
			this.setMethodsLoadingState(false);
			this.setRoutesLoadingState(false);
		},

		setMethodsState() {
			this.methods = [...new Set(this.availableRoutes.map((x) => x.method))];
			this.setMethodsDisabledState(false);
		},
		setRoutesState(method) {
			let filteredRoutes = this.availableRoutes.filter((x) => x.method == method).map((x) => x.url);
			this.routes = filteredRoutes; //.map((x) => x.url);
			this.setRoutesDisabledState(false);
		},
		//Clear
		clearServiceInput() {
			this.methodItem = null;
			this.routeItem = null;
			this.setMethodsDisabledState(true);
			this.setRoutesDisabledState(true);
		},
		clearMethodInput() {
			this.routeItem = null;
			this.setRoutesDisabledState(true);
		},
		//Loading
		setServicesLoadingState(value) {
			this.areServicesLoading = value;
		},
		setMethodsLoadingState(value) {
			this.areMethodsLoading = value;
		},
		setRoutesLoadingState(value) {
			this.areRoutesLoading = value;
		},
		//Disabled
		setMethodsDisabledState(value) {
			this.areMethodsDisabled = value;
		},
		setRoutesDisabledState(value) {
			this.areRoutesDisabled = value;
		},
		//Snackbar
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
.checkbox-top {
	margin-top: 0px !important;
	padding-top: 0% !important;
}

.form-map-center {
	display: flex;
	justify-content: flex-start;
	align-items: center;
}
.warning-outter-fill {
	background-color: #fbc02d;
	border: 1px solid white;
}
.warning-frame {
	margin: 2%;
	border: 2px solid whitesmoke;
}
.warning-text {
	padding: 1%;
	font-size: 15px;
}
.warning-col {
	padding-top: 0% !important;
	margin-bottom: 2%;
}
.form-header-text-conn {
	display: flex;
	min-width: 240px;
	align-items: flex-end;
	font-family: Helvetica, Arial, sans-serif;
	font-size: 30px;
	letter-spacing: -3px;
	font-weight: 600;
}
.form-body-property {
	display: flex;
	flex-direction: row;
}
.data-table {
	flex-grow: 1;
}
</style>
