<template>
	<v-dialog v-model="model" persistent max-width="1000">
		<v-card tile class="dialog-card-padding title-margin">
			<v-card-text>
				<v-form ref="serviceInformation">
					<service-selector
						:prefilledService="prefillServiceName"
						:prefilledMethod="prefillMethod"
						:prefilledRoute="prefillRoute"
						:connector="connector"
						:context="context"
						@setService="setServiceValue"
						@setMethod="setMethodValue"
						@setRoute="setRouteValue"
					></service-selector>
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
								:items="parameters"
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
								<template #[`item.$type`]="{ item }">
									<div v-if="item.$type == 'camunda:InputParameter'">
										Input
									</div>
									<div v-if="item.$type == 'camunda:OutputParameter'">
										Output
									</div>
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
			<task-add-edit
				ref="addEditDialog"
				:title="title"
				:btnColor="buttonColor"
				:model="isVisibleAddEditDialog"
				:context="context"
				:data="item"
				:type="itemType"
				@cancel="isVisibleAddEditDialog = false"
				@ok="handleAddEdit"
			>
			</task-add-edit>
		</div>
	</v-dialog>
</template>
<script>
import { HeaderConfig, FooterConfig, DialogConfig } from "../../utils/config.js";
import GenericDialog from "../dialogs/GenericDialog.vue";
import TaskAddEdit from "../dialogs/ServiceTaskAddEditDialog.vue";
import ServiceSelector from "../ServiceSelector.vue";
import * as common from "@/utils/common.js";
import _ from "lodash";
export default {
	name: "properties-edit-service",
	components: {
		GenericDialog,
		ServiceSelector,
		TaskAddEdit,
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
			connectorData: null,
			inputOutputData: null,
			parameters: [],
			defaultParameters: [],
			isApplyButtonDisabled: true,
			rules: {
				notEmpty: (field) => {
					return common.isInputValid(field) || "Cannot be empty.";
				},
			},
			//delete dialog
			isVisibleDeleteDialog: false,
			item: null,
			isVisibleAddEditDialog: false,
			itemType: null,
			buttonColor: null,
			title: null,
			//service
			service: {},
			serviceItem: {},
			methodItem: {},
			routeItem: {},
		};
	},
	watch: {
		parameters: function(newValue) {
			console.log("Parameters watch -", newValue);
			this.compareData();
		},
		connectorData: function(newValue) {
			console.log("Connector watch selector-", newValue);
			this.compareData();
		},
	},
	mounted() {
		this.setData();
	},
	methods: {
		setData() {
			if (this.connector && this.connector.connectorId == null) {
				this.connectorData = [];
				this.inputOutputData = [];
				this.parameters = [];
			} else {
				// debugger;
				this.connectorData = _.cloneDeep(this.connector);
				this.inputOutputData = _.cloneDeep(this.inputOutput);
				if (this.inputOutputData.inputParameters) {
					this.parameters = this.inputOutputData.inputParameters.concat(this.inputOutputData.outputParameters);
				} else {
					this.parameters = this.inputOutputData.outputParameters;
				}
			}
			this.defaultParameters = _.cloneDeep(this.parameters);
		},

		compareData() {
			let areParamsEqual = _.isEqual(this.parameters, this.defaultParameters);
			let isConnectorEqual = _.isEqual(this.connector, this.connectorData);
			this.setApplyButtonState(!isConnectorEqual || !areParamsEqual);
		},
		setApplyButtonState(value) {
			this.isApplyButtonDisabled = value;
		},
		//Add & Edit
		showAddEditDialog(item, type) {
			if (type == "add") {
				this.buttonColor = this.serviceConfig.add.buttonColor;
				this.title = this.serviceConfig.add.title;
			} else {
				this.buttonColor = this.serviceConfig.edit.buttonColor;
				this.title = this.serviceConfig.edit.title;
			}
			this.item = item;
			this.itemType = type;
			this.isVisibleAddEditDialog = true;
		},
		closeAddAndEditDialog() {
			this.isVisibleAddEditDialog = false;
		},
		handleAddEdit(item, type) {
			//Nije dobro, sto ako se promijeni name
			if (type == "edit") {
				let idx = this.parameters.findIndex((x) => x.name == item.name);
				this.parameters.splice(idx, 1, item);
			} else {
				this.parameters.push(item);
			}
			this.closeAddAndEditDialog();
		},
		//Delete
		showDeleteDialog(item) {
			this.item = item;
			this.isVisibleDeleteDialog = true;
		},
		handleDelete() {
			this.isVisibleDeleteDialog = false;
			let idx = this.parameters.findIndex((x) => x.name == this.deleteItem.name);
			this.parameters.splice(idx, 1);
		},
		cancel() {
			this.$emit("cancel");
		},
		ok() {
			let data = null;
			this.$emit("ok", data);
		},
		//Service
		setServiceValue(service, serviceName) {
			this.service = service;
			this.serviceItem = serviceName;
		},
		setMethodValue(methodName) {
			this.methodItem = methodName;
		},
		setRouteValue(routeName) {
			this.routeItem = routeName;
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
