<template>
	<v-dialog v-model="model" persistent max-width="900">
		<v-card tile class="dialog-card-padding title-margin">
			<v-card-text>
				<v-form ref="serviceInformation">
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
								@change="getServiceMeta"
								@click:clear="clearServiceInput()"
							></v-select>
						</v-col>
						<v-col cols="3" class="col-no-top-padding">
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
								@change="compareData"
								@click:clear="clearMethodInput()"
							></v-select>
						</v-col>
						<v-col cols="9" class="col-no-top-padding">
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
								@change="compareData"
							></v-select>
						</v-col>
					</v-row>

					<v-row>
						<v-col cols="12" class="col-no-top-padding">
							<div class="card-wrap parameter-title-margin">
								<div class="card-title">PARAMETERS</div>
								<div class="card-add-button">
									<v-btn @click="showAddEditDialog(null, 'add')" icon color="yellow accent-3">
										<v-icon large>mdi-plus-box</v-icon>
									</v-btn>
								</div>
								<v-text-field
									v-model="search"
									class="input-remove-border-sans-serif card-search"
									outlined
									dense
									prepend-inner-icon="mdi-magnify"
									placeholder=" Search"
									single-line
									hide-details
								></v-text-field>
							</div>
						</v-col>
						<v-col cols="12" class="col-no-top-padding">
							<v-data-table
								tile
								outlined
								item-key="name"
								loading-text="Loading..."
								:search="search"
								:headers="serviceConfigurationTableHeaders"
								:items="remappedParameters"
								:items-per-page="5"
								:footer-props="footerProps"
								:header-props="headerProps"
								sort-by="name"
								:sort-desc="false"
							>
								<!-- Header tooltip -->
								<template v-for="(h, idx) in serviceConfigurationTableHeaders" v-slot:[`header.${h.value}`]="{}">
									<v-tooltip top :key="idx">
										<template v-slot:activator="{ on }">
											<span v-on="on">{{ h.text }}</span>
										</template>
										<span>{{ h.explanation }}</span>
									</v-tooltip>
								</template>
								<template #[`item.actions`]="{ item }">
									<v-tooltip slot="append" top>
										<template v-slot:activator="{ on }">
											<v-icon dense v-on="on" slot="activator" @click="showAddEditDialog(item, 'edit')">
												mdi-pencil
											</v-icon>
										</template>
										<span>Edit</span>
									</v-tooltip>
									<v-tooltip slot="append" top>
										<template v-slot:activator="{ on }">
											<v-icon dense v-on="on" slot="activator" @click="showDeleteDialog(item)">
												mdi-trash-can
											</v-icon>
										</template>
										<span>Delete</span>
									</v-tooltip>
								</template>
							</v-data-table>
						</v-col>
					</v-row>
				</v-form>
			</v-card-text>
			<v-card-actions class="btns-align-right">
				<v-btn class="dialog-card-action-btn black--text" large depressed tile color="white" @click="cancel()">BACK</v-btn>
				<v-btn class="dialog-card-action-btn white--text" :disabled="isApplyButtonDisabled" large depressed tile color="amber" @click="ok()"
					>APPLY</v-btn
				>
			</v-card-actions>
		</v-card>
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
		<div v-if="isVisibleAddEditDialog">
			<service-task-add-edit
				ref="addEditDialog"
				:title="title"
				:btnColor="buttonColor"
				:model="isVisibleAddEditDialog"
				:data="item"
				:type="itemType"
				@cancel="isVisibleAddEditDialog = false"
				@ok="handleAddEdit"
			>
			</service-task-add-edit>
		</div>
	</v-dialog>
</template>
<script>
import { WebService } from "@/services/index";
import { HeaderConfig, FooterConfig, DialogConfig } from "../../utils/config.js";
import GenericDialog from "@/components/dialogs/GenericDialog.vue";
import ServiceTaskAddEdit from "@/components/dialogs/ServiceTaskAddEdit.vue";
import * as common from "@/utils/common.js";
import _ from "lodash";
export default {
	name: "properties-edit-send",
	components: {
		GenericDialog,
		ServiceTaskAddEdit,
	},
	props: ["model", "context", "connector", "inputOutput", "prefillServiceName", "prefillMethod", "prefillRoute"],
	data() {
		return {
			//Table
			search: null,
			serviceConfig: DialogConfig.serviceConfiguration,
			config: DialogConfig.model,
			footerProps: FooterConfig.footerProps,
			headerProps: HeaderConfig.headerProps,
			serviceConfigurationTableHeaders: HeaderConfig.serviceConfigurationTableHeaders,
			//Params
			remappedParameters: [],
			parameters: null,
			param: {
				label: "Input",
				name: null,
				value: null,
			},
			isNew: false,
			allAvailableRoutes: null,
			//serviceName
			//serviceMethod
			//serviceRoute
			connectorData: null,
			inputOutputData: null,

			//other
			isApplyButtonDisabled: true,
			rules: {
				notEmpty: (field) => {
					return common.isInputValid(field) || "Cannot be empty.";
				},
			},
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
			isRouteSelectDisabled: true,
			//delete dialog
			isVisibleDeleteDialog: false,
			item: null,
			isVisibleAddEditDialog: false,
			itemType: null,
			buttonColor: null,
			title: null,
		};
	},
	watch: {
		paramType: function(newValue) {
			if (newValue) {
				this.paramLabel = "Input";
			} else {
				this.paramLabel = "Output";
			}
		},
		serviceItem: function(newValue) {
			this.serviceItem = newValue;
			console.log("Service watch", newValue);
		},
		methodItem: function(newValue) {
			this.methodItem = newValue;
			this.setRoutesState(newValue);
		},
		routeItem: function(newValue) {
			this.routeItem = newValue;
			console.log("Route watch", newValue);
		},
		remappedParameters: function(newValue) {
			console.log("Remap watch", newValue);
			this.compareData();
			debugger;
		},
		connectorData: function(newValue) {
			console.log("Connector watch", newValue);
			debugger;
		},
	},
	mounted() {
		this.setData();
		this.getServices();
	},
	methods: {
		camundifyData() {
			debugger;
			console.log(this.parameters);
			console.log(this.remappedParameters);
			let modeler = this.context.modeler;
			let moddle = modeler.get("moddle");
			for (let rem of this.remappedParameters) {
				if (rem.type == "Input") {
					moddle.create("camunda:InputParameter");
				} else {
					moddle.create("camunda:OutputParameter");
				}
			}
		},
		compareData() {
			debugger;
			this.camundifyData();
			let areParamsEqual = _.isEqual(this.parameters, this.remappedParameters);
			let isConnectorEqual = _.isEqual(this.connector, this.connectorData);
			// let isInputOutputEqual = _.isEqual(this.inputOutputData, this.inputOutput);
			this.setApplyButtonState(!isConnectorEqual || !areParamsEqual);
		},
		setData() {
			if (this.connector === undefined && this.inputOutput === undefined) {
				this.isNew = true;
			}
			if (this.isNew) {
				this.connectorData = [];
				this.inputOutputData = [];
				this.parameters = [];
			} else {
				this.connectorData = this.connector;
				this.inputOutputData = this.inputOutput;
				this.parameters = this.inputOutputData.inputParameters.concat(this.inputOutputData.outputParameters);
				this.prefillParameterValues();
			}
		},
		prefillParameterValues() {
			for (let p of this.parameters) {
				let parameter = {
					type: p.$type == "camunda:InputParameter" ? "Input" : "Output",
					name: p.name,
					value: p.value || null,
				};
				this.remappedParameters.push(parameter);
			}
		},
		async prefillConnectorValues() {
			let connectorIdName = this.prefillServiceName.toUpperCase();
			let selected = this.services.find((x) => x.name.toUpperCase() == connectorIdName);
			this.serviceItem = selected;
			await this.getServiceMeta(this.serviceItem);
			if (this.allAvailableRoutes != 0) {
				let selectedRoute = this.allAvailableRoutes.find((x) => x.url == this.prefillRoute);
				this.methodItem = selectedRoute.method;
				this.routeItem = selectedRoute.url;
			}
		},
		async getServices() {
			this.setServicesLoadingState(true);
			this.services = await WebService.getServices();
			if (!this.isNew) {
				this.prefillConnectorValues();
			}
			this.setServicesLoadingState(false);
		},
		async getServiceMeta(selectedService) {
			this.serviceItem = selectedService;
			if (selectedService == null) {
				return;
			}
			this.allAvailableRoutes = await WebService.getServiceMeta(selectedService.address);
			if (this.allAvailableRoutes != 0) {
				//Vrati notification da je service down
				this.setMethodsState();
			}
		},
		//
		//
		//
		//
		//
		//
		//
		//
		//
		//
		clearServiceInput() {
			this.setMethodsDisabledState(true);
			this.methodItem = null;
			this.setRoutesDisabledState(true);
			this.routeItem = null;
		},
		clearMethodInput() {
			this.setRoutesDisabledState(true);
			this.routeItem = null;
		},
		setMethodsState() {
			this.methods = [...new Set(this.allAvailableRoutes.map((x) => x.method))];
			this.setMethodsDisabledState(false);
		},
		setRoutesState(method) {
			if (method == null) {
				this.clearMethodInput();
				return;
			}
			let filteredRoutes = this.allAvailableRoutes.filter((x) => x.method == method);
			this.routes = filteredRoutes.map((x) => x.url);
			this.setRoutesDisabledState(false);
		},
		setServicesLoadingState(value) {
			this.areServicesLoading = value;
		},
		setMethodsLoadingState(value) {
			this.areMethodsLoading = value;
		},
		setRoutesLoadingState(value) {
			this.areRoutesLoading = value;
		},
		setMethodsDisabledState(value) {
			this.areMethodsDisabled = value;
		},
		setRoutesDisabledState(value) {
			this.areRoutesDisabled = value;
		},
		setApplyButtonState(newValue) {
			this.isApplyButtonDisabled = !newValue;
		},
		//Dialogs
		showAddEditDialog(item, type) {
			this.item = item;
			if (type == "add") {
				this.buttonColor = this.serviceConfig.add.buttonColor;
				this.title = this.serviceConfig.add.title;
			} else {
				this.buttonColor = this.serviceConfig.edit.buttonColor;
				this.title = this.serviceConfig.edit.title;
			}
			this.itemType = type;
			this.isVisibleAddEditDialog = true;
		},
		handleAddEdit(item, type) {
			if (type == "edit") {
				let idx = this.remappedParameters.findIndex((x) => x.name == item.name);
				this.remappedParameters.splice(idx, 1, item);
			} else {
				this.remappedParameters.push(item);
			}
			this.closeAddAndEditDialog();
		},
		closeAddAndEditDialog() {
			this.isVisibleAddEditDialog = false;
		},
		showDeleteDialog(item) {
			this.item = item;
			this.isVisibleDeleteDialog = true;
		},
		handleDelete() {
			this.isVisibleDeleteDialog = false;
			let idx = this.remappedParameters.findIndex((x) => x.name == this.deleteItem.name);
			this.remappedParameters.splice(idx, 1);
		},
		cancel() {
			this.$emit("cancel");
		},
		ok() {
			let data = null;
			this.$emit("ok", data);
		},
	},
};
</script>
<style>
.input-remove-border {
	border-radius: 0px !important;
}
.btns-align-right {
	display: flex !important;
	justify-content: flex-end !important;
}

.col-no-top-padding {
	padding-top: 0px !important;
	padding-bottom: 0px !important;
}
.col-no-bottom-padding {
	padding-bottom: 0px !important;
}
.card-wrap {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
}
.card-search {
	margin-left: 20% !important;
}
.card-add-button {
	margin-bottom: 1%;
	margin-left: 1%;
}
.connector-title-margin {
	margin-top: 4%;
	margin-bottom: 3%;
}
.parameter-title-margin {
	margin-top: 3%;
	margin-bottom: 2%;
}
.dialog-card-padding {
	padding: 5% !important;
}
</style>
