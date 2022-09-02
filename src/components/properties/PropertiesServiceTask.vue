<template>
	<v-dialog content-class="dialog-border" v-model="model" persistent max-width="1000">
		<v-card tile class="dialog-card-padding title-margin">
			<v-card-text>
				<v-form ref="serviceInformation">
					<service-selector
						:connectorData="connector"
						:context="context"
						@setService="setServiceValue"
						@setMethod="setMethodValue"
						@setRoute="setRouteValue"
						@setUrlParameters="setUrlParams"
					></service-selector>
					<v-row>
						<v-col cols="12" class="col-no-top-padding">
							<div class="form-header">
								<div class="form-header-text">PARAMETERS</div>
								<div class="form-header-btn">
									<v-btn @click="showAddEditDialog(null, 'add')" icon color="yellow accent-3">
										<v-icon class="icon-medium">mdi-plus-box</v-icon>
									</v-btn>
								</div>
								<div class="form-header-search">
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
			<service-task-add-edit
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
			</service-task-add-edit>
		</div>
	</v-dialog>
</template>
<script>
import { HeaderConfig, FooterConfig, DialogConfig } from "../../utils/config.js";
import GenericDialog from "@/components/dialogs/GenericDialog.vue";
import ServiceTaskAddEdit from "@/components/dialogs/ServiceTaskAddEdit.vue";
import ServiceSelector from "@/components/ServiceSelector.vue";
import * as common from "@/utils/common.js";
import _ from "lodash";
import { BpmnXml } from "../../utils/bpmn.js";
export default {
	name: "properties-edit-service",
	components: {
		GenericDialog,
		ServiceSelector,
		ServiceTaskAddEdit,
	},
	props: ["model", "context", "connector", "inputOutput"],
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
			parameters: [], //inputOutput Params
			defaultParameters: [],
			isApplyButtonDisabled: true,
			isVisibleDeleteDialog: false,
			isVisibleAddEditDialog: false,
			item: null,
			itemType: null,
			buttonColor: null,
			title: null,
			//service
			serviceSelectorData: {
				serviceItem: {},
				methodText: {},
				routeText: {},
				urlParams: [],
			},
			serviceDefault: {},
			methodDefault: {},
			routeDefault: {},
			urlParamsDefault: [],
			rules: {
				notEmpty: (field) => {
					return common.isInputValid(field) || "Cannot be empty.";
				},
			},
		};
	},
	watch: {
		parameters: function() {
			this.checkDataAndDisableButtonIfNeeded();
		},
		serviceSelectorData: {
			handler: function() {
				this.checkDataAndDisableButtonIfNeeded();
			},
			deep: true,
		},
	},
	mounted() {
		this.setData();
	},
	methods: {
		setData() {
			this.connectorData = this.connector.connectorId != null ? _.cloneDeep(this.connector) : [];
			this.inputOutputData = this.inputOutput != null ? _.cloneDeep(this.inputOutput) : [];
			this.parameters =
				this.inputOutput != null
					? this.inputOutputData.inputParameters
						? this.inputOutputData.inputParameters.concat(this.inputOutputData.outputParameters)
						: (this.parameters = this.inputOutputData.outputParameters)
					: [];
			this.defaultParameters = _.cloneDeep(this.parameters);
			this.serviceDefault = this.connector.connectorId || {};
			this.methodDefault = this.connector.inputOutput.inputParameters.find((x) => x.name == "method")?.value || {};
			this.routeDefault = this.connector.inputOutput.inputParameters.find((x) => x.name == "url")?.value || {};
			let urlParamsDefault = this.connector.inputOutput.inputParameters;
			if (_.has(urlParamsDefault, "definition")) {
				this.urlParamsDefault = urlParamsDefault?.definition.entries.find((x) => x.name == "url_parameter") || [];
			} else {
				this.urlParamsDefault = [];
			}
		},
		compareData() {
			let isConnectorDataEqual = true;
			if (typeof this.serviceDefault == "string" && _.has(this.serviceSelectorData.serviceItem, "name")) {
				isConnectorDataEqual =
					this.serviceDefault?.toUpperCase() == this.serviceSelectorData.serviceItem?.name.toUpperCase() &&
					this.methodDefault == this.serviceSelectorData.methodText &&
					this.routeDefault == this.serviceSelectorData.routeText;
			}
			let urlParamsCheck = this.urlParamsDefault.find((x) => x.key == null && x.value == null);
			if (urlParamsCheck && this.urlParamsDefault.length == 1) urlParamsCheck = [];
			let areUrlParamsEq = _.isEqual(this.urlParamsDefault, urlParamsCheck);
			let areParamsEqual = _.isEqual(this.parameters, this.defaultParameters);
			let isApplyButtonDisabled = isConnectorDataEqual && areUrlParamsEq && areParamsEqual;
			this.setApplyButtonState(isApplyButtonDisabled);
		},
		checkDataAndDisableButtonIfNeeded() {
			let isApplyButtonDisabled = this.compareData();
			this.setApplyButtonState(isApplyButtonDisabled);
		},
		setApplyButtonState(value) {
			this.isApplyButtonDisabled = value;
		},
		//Dialogs
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
		handleAddEdit(item, oldItem, type) {
			if (type == "edit") {
				let idx = this.parameters.findIndex((x) => x.name == oldItem.name);
				this.parameters.splice(idx, 1, item);
				if (oldItem.$type == "camunda:InputParameter") {
					idx = this.inputOutput.inputParameters.findIndex((x) => x.name == oldItem.name);
					this.inputOutput.inputParameters.splice(idx, 1, item);
				} else {
					idx = this.inputOutput.outputParameters.findIndex((x) => x.name == oldItem.name);
					this.inputOutput.outputParameters.splice(idx, 1, item);
				}
			} else {
				this.parameters.push(item);
				if (item.$type == "camunda:InputParameter") {
					this.inputOutput.inputParameters.push(item);
				} else {
					this.inputOutput.outputParameters.push(item);
				}
			}
			this.closeAddAndEditDialog();
		},
		showDeleteDialog(item) {
			this.item = item;
			this.isVisibleDeleteDialog = true;
		},
		handleDelete() {
			this.isVisibleDeleteDialog = false;
			let idx = this.parameters.findIndex((x) => x.name == this.item.name);
			this.parameters.splice(idx, 1);
			if (this.item.$type == "camunda:InputParameter") {
				idx = this.inputOutput.inputParameters.findIndex((x) => x.name == this.item.name);
				this.inputOutput.inputParameters.splice(idx, 1);
			} else {
				idx = this.inputOutput.outputParameters.findIndex((x) => x.name == this.item.name);
				this.inputOutput.outputParameters.splice(idx, 1);
			}
		},
		cancel() {
			this.$emit("cancel");
		},
		ok() {
			this.connector.connectorId = _.has(this.serviceSelectorData.serviceItem, "name") ? this.serviceSelectorData.serviceItem.name : null;
			let method = this.connector.inputOutput.inputParameters.find((x) => x.name == "method");
			method.value = this.serviceSelectorData.methodText;
			let url = this.connector.inputOutput.inputParameters.find((x) => x.name == "url");
			url.value = this.serviceSelectorData.routeText;
			let urlParameter = this.connector?.inputOutput.inputParameters.find((x) => x.name == "url_parameter");
			if (!urlParameter) {
				let moddle = this.context.modeler.get("moddle");
				let inputParameter = BpmnXml.createSpecialConnectorInputIrregular(moddle, this.connector.inputOutput);
				inputParameter.definition.entries = this.serviceSelectorData.urlParams;
				this.connector.inputOutput.inputParameters.push(inputParameter);
			}
			this.$emit("ok", this.connector, this.inputOutput);
		},
		setServiceValue(service, serviceName) {
			this.service = service;
			this.serviceSelectorData.serviceItem = serviceName;
		},
		setMethodValue(methodName) {
			this.serviceSelectorData.methodText = methodName;
		},
		setRouteValue(routeName) {
			this.serviceSelectorData.routeText = routeName;
		},
		setUrlParams(urlParams) {
			this.serviceSelectorData.urlParams = urlParams.definition.entries;
		},
	},
};
</script>
<style>
.form-header {
	display: flex;
	flex-direction: row;
	align-items: center;
	margin-top: 2%;
	margin-bottom: 2%;
}
.form-header-search {
	display: flex;
	justify-content: flex-end !important;
	align-items: center;
	flex-grow: 1;
}
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

.connector-title-margin {
	margin-top: 4%;
	margin-bottom: 3%;
}
.parameter-title-margin {
	margin-top: 3%;
	margin-bottom: 2%;
}
</style>
