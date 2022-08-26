<template>
	<v-dialog
		content-class="dialog-border"
		transition="scale-transition"
		hide-overlay
		overlay-color="black"
		overlay-opacity="0.6"
		open-delay="500"
		close-delay="1000"
		v-model="model"
		persistent
		max-width="800"
	>
		<v-card tile class="dialog-card-padding">
			<v-card-text>
				<v-form class="form-vertical" v-model="valid">
					<div class="form-horizontal">
						<div class="form-header-form-field">
							<div class="form-header-text" v-text="sectionText.formFieldText"></div>
						</div>
						<div class="form-body-form-field">
							<v-text-field
								v-model="form.id"
								:rules="[rules.notEmpty]"
								class="input-remove-border"
								clearable
								outlined
								dense
								label="Id"
							></v-text-field>
							<v-text-field
								v-model="form.label"
								:rules="[rules.notEmpty]"
								class="input-remove-border"
								clearable
								outlined
								dense
								label="Label"
							></v-text-field>
							<v-text-field v-model="form.defaultValue" class="input-remove-border" clearable outlined dense label="Default Value"></v-text-field>
							<v-select
								class="input-remove-border"
								v-model="form.type"
								:rules="[rules.notEmpty]"
								label="Item type"
								dense
								clearable
								outlined
								return-object
								:items="types"
							></v-select>
							<div v-show="form.type == 'autocomplete-string'">
								<service-selector
									:connectorData="null"
									:context="context"
									@setService="setServiceValue"
									@setMethod="setMethodValue"
									@setRoute="setRouteValue"
									@setUrlParameters="setUrlParams"
								></service-selector>
							</div>
						</div>
					</div>
					<div class="form-horizontal">
						<div class="form-header">
							<div class="form-header-text" v-text="sectionText.propertiesText"></div>
							<div class="form-header-btn">
								<v-btn @click="addProperty()" icon color="yellow accent-3">
									<v-icon class="icon-medium">mdi-plus-box</v-icon>
								</v-btn>
							</div>
						</div>
						<div class="form-body-property" v-for="(property, idx) in form.properties.values" :key="'key-' + idx" :ref="'property-' + idx">
							<v-text-field
								v-model="property.id"
								class="form-field-horizontal input-remove-border"
								clearable
								outlined
								dense
								label="Property id"
							></v-text-field>
							<v-text-field v-model="property.value" class="input-remove-border" clearable outlined dense label="Value"></v-text-field>
							<v-btn class="form-field-horizontal-btn" color="red accent-4" @click="removeProperty(property, idx)" icon tile>
								<v-icon class="icon-medium">mdi-close-box</v-icon>
							</v-btn>
						</div>
					</div>
					<div class="form-horizontal">
						<div class="form-header">
							<div class="form-header-text" v-text="sectionText.validationText"></div>
							<div class="form-header-btn">
								<v-btn @click="addConstraint()" icon color="yellow accent-3">
									<v-icon class="icon-medium">mdi-plus-box</v-icon>
								</v-btn>
							</div>
						</div>
						<div
							class="form-body-validation"
							v-for="(constraint, idx) in form.validation.constraints"
							:key="'key-' + idx"
							:ref="'validation-' + idx"
						>
							<v-text-field
								v-model="constraint.name"
								class="form-field-horizontal input-remove-border"
								clearable
								outlined
								dense
								label="Name"
							></v-text-field>
							<v-text-field v-model="constraint.config" class="input-remove-border" clearable outlined dense label="Config"></v-text-field>
							<div class="form-field-horizontal-btn">
								<v-btn color="red accent-4" @click="removeConstraint(constraint, idx)" icon tile>
									<v-icon class="icon-medium" large>mdi-close-box</v-icon>
								</v-btn>
							</div>
						</div>
					</div>
				</v-form>
			</v-card-text>
			<v-card-actions class="btns-align-right">
				<v-btn class="dialog-card-action-btn black--text" large depressed tile color="white" @click="cancel()">BACK</v-btn>
				<v-btn class="dialog-card-action-btn white--text" :disabled="isApplyButtonDisabled" :color="btnColor" large depressed tile @click="ok()"
					>APPLY</v-btn
				>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>
<script>
import { BpmnXml } from "../../utils/bpmn.js";
import { FormItemMetaModel } from "../../utils/bpmn.js";
import { DialogConfig } from "../../utils/config.js";
import ServiceSelector from "@/components/ServiceSelector.vue";
import * as common from "../../utils/common.js";
import _ from "lodash";
export default {
	name: "properties-user-task-add-edit",
	props: ["model", "btnColor", "type", "title", "data", "context"],
	components: { ServiceSelector },
	data() {
		return {
			sectionText: DialogConfig.model.addUserField,
			rules: {
				notEmpty: (field) => {
					return common.isInputValid(field) || "Cannot be empty.";
				},
			},
			valid: null,
			form: {
				id: null,
				label: null,
				defaultValue: null,
				type: null,
				validation: {
					constraints: [],
				},
				properties: {
					values: [],
				},
			},
			types: Object.keys(FormItemMetaModel),
			isApplyButtonDisabled: true,
			//service
			service: {},
			serviceItem: {},
			methodItem: {},
			routeItem: {},
			urlParams: [],
		};
	},
	watch: {
		form: {
			handler: function() {
				this.compareData();
			},
			deep: true,
		},
	},
	mounted() {
		this.setData();
	},
	methods: {
		handleButtonState(newValue) {
			this.isApplyButtonDisabled = newValue;
		},
		compareData() {
			let arePropsEqual = _.isEqual(this.form.properties.values, this.data.properties.values);
			let areConstraintsEqual = _.isEqual(this.form.validation.constraints, this.data.validation.constraints);
			let formComp = {
				id: this.form.id,
				label: this.form.label,
				defaultValue: this.form.defaultValue,
				type: this.form.type,
			};
			let dataComp = {
				id: this.data.id,
				label: this.data.label,
				defaultValue: this.data.defaultValue,
				type: this.data.type,
			};
			let isGeneralInfoEqual = _.isEqual(formComp, dataComp);
			let isApplyBtnDisabled = arePropsEqual && areConstraintsEqual && isGeneralInfoEqual && this.valid;
			this.handleButtonState(isApplyBtnDisabled);
		},
		setData() {
			this.form.id = this.data.id;
			this.form.label = this.data.label;
			this.form.defaultValue = this.data.defaultValue;
			this.form.type = this.data.type;
			this.form.validation.constraints = _.cloneDeep(this.data.validation.constraints);
			this.form.properties.values = _.cloneDeep(this.data.properties.values);
		},
		copyDataBack() {
			this.data.id = this.form.id;
			this.data.label = this.form.label;
			this.data.defaultValue = this.form.defaultValue;
			this.data.type = this.form.type;
			this.data.validation.constraints = _.cloneDeep(this.form.validation.constraints);
			this.data.properties.values = _.cloneDeep(this.form.properties.values);
		},
		removeProperty(item, index) {
			if (!item.id && !item.value && index == undefined) {
				return;
			} else if (!item.id && !item.value) {
				this.form.properties.values.splice(index, 1);
			} else {
				let element = item.id + item.value;
				let idx = this.form.properties.values.findIndex((x) => element == x.id + x.value);
				this.form.properties.values.splice(idx, 1);
			}
			if (this.form.properties.values.length == 0) {
				this.preventEmptyFields("prop");
			}
		},
		removeConstraint(item, index) {
			if (!item.name && !item.config && index == undefined) {
				return;
			} else if (!item.name && !item.config) {
				this.form.validation.constraints.splice(index, 1);
			} else {
				let element = item.name + item.config;
				let idx = this.form.validation.constraints.findIndex((x) => element == x.name + x.config);
				this.form.validation.constraints.splice(idx, 1);
			}
			if (this.form.validation.constraints.length == 0) {
				this.preventEmptyFields("val");
			}
		},
		preventEmptyFields(type) {
			type == "prop" ? this.addProperty() : this.addConstraint();
		},
		addProperty() {
			let moddle = this.context.modeler.get("moddle");
			let property = BpmnXml.createProperty(moddle, this.form.properties);
			this.form.properties.values.push(property);
		},
		addConstraint() {
			let moddle = this.context.modeler.get("moddle");
			let constraint = BpmnXml.createConstraint(moddle, this.form.validation);
			this.form.validation.constraints.push(constraint);
		},
		cancel() {
			this.$emit("cancel");
		},
		ok() {
			this.copyDataBack();
			this.$emit("ok", this.data);
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
		setUrlParams(urlParams) {
			this.urlParams = urlParams;
		},
	},
};
</script>
<style>
.icon-medium {
	height: 30px !important;
	font-size: 30px !important;
	width: 30px !important;
}
.form-vertical {
	display: flex;
	flex-direction: column;
}
.form-horizontal {
	display: flex;
	flex-direction: column;
}
.form-header {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	margin-top: 2%;
	margin-bottom: 2%;
}
.form-header-text {
	display: flex;
	align-items: flex-end;
	font-family: Helvetica, Arial, sans-serif;
	font-size: 30px;
	letter-spacing: -3px;
	font-weight: 600;
}
.form-header-form-field {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	margin-top: 5%;
	margin-bottom: 4%;
}
.form-header-btn {
	margin-left: 0.5%;
	margin-bottom: 0.8%;
}
.form-body-form-field {
	display: flex;
	flex-direction: column;
}
.form-body-property {
	display: flex;
	flex-direction: row;
}
.form-body-validation {
	display: flex;
	flex-direction: row;
}
.form-field-horizontal {
	margin-right: 3% !important;
}
.form-field-horizontal-btn {
	display: flex;
	justify-content: center;
	align-items: flex-start;
	margin-left: 2%;
}
</style>
