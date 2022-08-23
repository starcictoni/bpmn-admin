<template>
	<div>
		<v-form v-model="valid" ref="generalInformation">
			<v-text-field
				class="input-remove-border"
				height="10"
				:rules="[rules.notEmpty]"
				label="ID"
				outlined
				dense
				clearable
				v-model="form.id"
			></v-text-field>
			<v-text-field
				class="input-remove-border input-top-negative-margin"
				label="Name"
				height="10"
				dense
				:rules="[rules.notEmpty]"
				outlined
				clearable
				v-model="form.name"
			></v-text-field>
			<div v-show="areButtonsVisible">
				<v-btn color="darken-1" text @click="cancel()">
					Cancel
				</v-btn>
				<v-btn color="blue darken-1" text @click="handleApply()">
					Apply
				</v-btn>
			</div>
		</v-form>
	</div>
</template>
<script>
import * as common from "@/utils/common.js";
import _ from "lodash";

export default {
	name: "properties-general",
	props: ["data", "context"],
	data() {
		return {
			valid: null,
			areButtonsVisible: false,
			isApplyButtonDisabled: true,
			form: {
				id: null,
				name: null,
			},
			defaultForm: {
				id: null,
				name: null,
			},
			rules: {
				notEmpty: (field) => {
					return common.isInputValid(field) || "Cannot be empty.";
				},
			},
		};
	},
	watch: {
		form: {
			handler: function() {
				this.compareData();
			},
			deep: true,
		},
		valid: function(newValue) {
			this.handleButtonState(newValue);
		},
	},
	created() {
		this.setData();
	},
	methods: {
		setData() {
			this.form.id = this.data.id;
			this.defaultForm.id = this.data.id;
			this.form.name = this.data.name;
			this.defaultForm.name = this.data.name;
		},
		compareData() {
			let isEqual = _.isEqual(this.form, this.defaultForm);
			let areFieldsEmpty = Object.values(this.form).some((x) => x == undefined);
			this.handleButtonVisibility(!isEqual && !areFieldsEmpty);
		},
		handleButtonVisibility(newValue) {
			this.areButtonsVisible = newValue;
		},
		handleButtonState(newValue) {
			this.isApplyButtonDisabled = !newValue;
		},
		cancel() {
			this.form = { ...this.defaultForm };
		},
		handleApply() {
			this.handleButtonVisibility(false);
			this.handleButtonState(false);
			this.$emit("generalOk", this.form, this.defaultForm.id);
		},
	},
	// save() {
	// 	let updates = [];
	// 	for (let att in this.state) {
	// 		if (this.state[att] != this.data[att]) {
	// 			updates.push({
	// 				cmd: "bpmn-update",
	// 				context: {
	// 					element: this.context.bpmnElement,
	// 					businessObject: this.context.bpmnElement.businessObject,
	// 					properties: { [att]: this.state[att] },
	// 				},
	// 			});
	// 		}
	// 	}
	// 	this.cs.execute("bpmn-multi-update", updates);
	// },
};
</script>
