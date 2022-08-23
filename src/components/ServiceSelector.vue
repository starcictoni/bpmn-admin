<template>
	<v-row>
		<!-- 1 -->
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
		<!-- 2 -->
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
			></v-select>
		</v-col>
		<!-- 3 -->
		<v-col :cols="urlParametersColWidth" class="col-no-top-padding">
			<div class="form-header">
				<div class="form-header-text-conn" v-text="sectionText.title"></div>
				<div class="form-header-btn">
					<v-btn @click="showAddEditDialog(null, 'add')" icon color="yellow accent-3">
						<v-icon class="icon-medium">mdi-plus-box</v-icon>
					</v-btn>
				</div>
			</div>
			<div class="form-body-property">
				<div class="data-table">
					<v-data-table
						v-model="selected"
						:single-select="true"
						:show-select="true"
						tile
						outlined
						item-key="name"
						loading-text="Loading..."
						:headers="connectorTableHeaders"
						:items="parameters"
						:items-per-page="5"
						:footer-props="connectorFooterProps"
						:header-props="headerProps"
						sort-by="name"
					>
						<!-- Header tooltip -->
						<template v-for="(h, idx) in connectorTableHeaders" v-slot:[`header.${h.value}`]="{}">
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
				</div>
			</div>
		</v-col>
		<v-col v-show="showMapElement" cols="5" class="col-no-top-padding">
			<div class="form-header">
				<div class="form-header-text" v-text="mapText.title"></div>
				<div class="form-header-btn">
					<v-btn @click="addEntry()" icon color="yellow accent-3">
						<v-icon class="icon-medium">mdi-plus-box</v-icon>
					</v-btn>
				</div>
			</div>
			<div class="form-body-property" v-for="(m, idx) in map" :key="'key-' + idx" :ref="'parameter-' + idx">
				<v-text-field v-model="m.key" class="form-field-horizontal input-remove-border" clearable outlined dense label="Key"></v-text-field>
				<v-text-field v-model="m.value" class="input-remove-border" clearable outlined dense label="Value"></v-text-field>
				<v-btn class="form-field-horizontal-btn" color="red accent-4" @click="removeEntry(m, idx)" icon tile>
					<v-icon class="icon-medium">mdi-close-box</v-icon>
				</v-btn>
			</div>
		</v-col>
		<div v-if="isDeleteDialogVisible">
			<generic-dialog
				ref="deleteDialog"
				:model="isDeleteDialogVisible"
				:title="config.delete.title"
				:text="config.delete.text"
				:btnColor="config.delete.buttonColor"
				type="delete"
				@cancel="isDeleteDialogVisible = false"
				@ok="handleDelete"
			>
			</generic-dialog>
		</div>
		<div v-if="isAddEditDialogVisible">
			<connector-add-edit
				ref="addEditDialog"
				:title="title"
				:btnColor="buttonColor"
				:model="isAddEditDialogVisible"
				:parameters="parameters"
				:context="context"
				:data="item"
				:type="type"
				@cancel="isAddEditDialogVisible = false"
				@ok="handleAddEdit"
			>
			</connector-add-edit>
		</div>
	</v-row>
</template>

<script>
import { BpmnXml } from "@/utils/bpmn.js";
import { WebService } from "@/services/index";
import { HeaderConfig, FooterConfig, DialogConfig } from "../utils/config.js";
import GenericDialog from "../components/dialogs/GenericDialog.vue";
import ConnectorAddEdit from "./dialogs/ConnectorAddEdit.vue";
export default {
	components: {
		GenericDialog,
		ConnectorAddEdit,
	},
	name: "service-selector",
	props: ["connector", "context", "prefilledService", "prefilledMethod", "prefilledRoute"],
	data() {
		return {
			search: null,
			serviceConfig: DialogConfig.serviceConfiguration,
			config: DialogConfig.model,
			userConfig: DialogConfig.userTaskConfiguration,
			footerProps: FooterConfig.footerProps,
			headerProps: HeaderConfig.headerProps,
			serviceConfigurationTableHeaders: HeaderConfig.serviceConfigurationTableHeaders,
			connectorTableHeaders: HeaderConfig.connectorTableHeaders,
			connectorFooterProps: FooterConfig.footerReduced,
			sectionText: DialogConfig.serviceConfiguration.connectorParams,
			mapText: DialogConfig.serviceConfiguration.map,
			connectorConfig: DialogConfig.connectorConfiguration,
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
			allAvailableRoutes: [],
			//New things
			parameters: [],
			selected: [],
			map: [],
			isDeleteDialogVisible: false,
			isAddEditDialogVisible: false,
			item: null,
			type: null,
			title: null,
			buttonColor: null,
			showMapElement: true,
			urlParametersColWidth: "6",
		};
	},
	watch: {
		selected: function(newValue) {
			this.setMap(newValue);
			this.showMap();
		},
		serviceItem: function(newValue) {
			this.checkServiceItemStatus(newValue);
			this.$emit("setService", newValue.name, newValue);
		},
		methodItem: function(newValue) {
			this.$emit("setMethod", newValue);
			this.setRoutesState(newValue);
		},
		routeItem: function(newValue) {
			this.$emit("setRoute", newValue);
		},
	},
	async mounted() {
		this.parameters = this.connector.inputOutput.inputParameters;
		console.log(this.connector);
		debugger;
		this.preselectFirstRow();
		await this.setData();
	},
	methods: {
		//CSS
		showMap() {
			if (!this.selected.length) {
				this.showMapElement = false;
				this.urlParametersColWidth = "9";
			} else {
				this.showMapElement = true;
				this.urlParametersColWidth = "7";
			}
		},
		checkServiceItemStatus(service) {
			debugger;
			service;
			if (service.status == false) {
				//show message
				//check - disable get and routes
			}
		},
		//DIALOGS
		showDeleteDialog(item) {
			this.item = item;
			this.isDeleteDialogVisible = true;
		},
		handleDelete() {
			this.isDeleteDialogVisible = false;
			let idx = this.parameters.findIndex((x) => x.name == this.item.name);
			this.parameters.splice(idx, 1);

			if (this.selected[0].name == this.item.name) {
				this.selected.splice(0, 1);
				if (this.parameters.length > 0) this.preselectFirstRow();
			}
		},
		showAddEditDialog(item, type) {
			if (type == "add") {
				let moddle = this.context.modeler.get("moddle");
				item = BpmnXml.createConnectorInputParameter(moddle, this.parameters);
				this.buttonColor = this.connectorConfig.add.buttonColor;
				this.title = this.connectorConfig.add.title;
			} else {
				this.buttonColor = this.connectorConfig.edit.buttonColor;
				this.title = this.connectorConfig.edit.title;
			}
			this.item = item;
			this.type = type;
			this.isAddEditDialogVisible = true;
		},
		handleAddEdit(item, type, name) {
			if (type == "add") {
				this.parameters.push(item);
			} else {
				let idx = this.parameters.findIndex((x) => x.name == name);
				this.parameters.splice(idx, 1, item);
			}
			this.isAddEditDialogVisible = false;
		},
		preselectFirstRow() {
			this.map = [];
			this.selected.push(this.parameters[this.parameters.length - 1]); //or idx 0 w/e
		},
		setMap(parameter) {
			this.map = [];
			this.map = BpmnXml.getMap(parameter);
		},
		addEntry() {
			let moddle = this.context.modeler.get("moddle");
			let entry = BpmnXml.createEntry(moddle, this.selected[0].definition);
			let paramForUpdate = this.parameters.find((x) => x.name == this.selected[0].name);
			paramForUpdate.definition.entries.push(entry);
		},
		removeEntry(item, index) {
			if (!item) return;
			let paramForUpdate = this.parameters.find((x) => x.name == this.selected[0].name);
			paramForUpdate.definition.entries.splice(index, 1);
		},
		//ALMOST DONE
		async setData() {
			await this.getServices();
			if (this.prefilledService != null) {
				await this.prefillConnectorValues();
			}
		},
		//DONE
		async prefillConnectorValues() {
			let selected = this.services.find((x) => x.name.toUpperCase() == this.prefilledService);
			this.serviceItem = selected;
			await this.getServiceMeta(this.serviceItem);
			if (this.allAvailableRoutes != 0) {
				let selectedRoute = this.allAvailableRoutes.find((x) => x.url == this.prefilledRoute);
				this.methodItem = selectedRoute.method;
				this.routeItem = selectedRoute.url;
			}
		},
		async getServices() {
			this.setServicesLoadingState(true);
			this.services = await WebService.getServices();
			console.log("Services", this.services);
			this.setServicesLoadingState(false);
		},
		async getServiceMeta(selectedService) {
			this.serviceItem = selectedService;
			if (selectedService == null) {
				return;
			}
			this.allAvailableRoutes = await WebService.getServiceMeta(selectedService.address);
			if (this.allAvailableRoutes.length != 0) {
				this.setMethodsState();
			}
			//CHECK checkServiceItemStatus - maybe this part is not needed
			// else {
			// 	this.clearServiceInput();
			// 	//Vrati notification da je service down
			// }
			// debugger;
			// console.log(this.allAvailableRoutes);
		},
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
	},
};
</script>

<style>
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
