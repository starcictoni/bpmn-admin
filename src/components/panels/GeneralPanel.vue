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
				outlined
				clearable
				v-model="form.name"
			></v-text-field>
			<!-- :rules="[rules.notEmpty]" -->
			<div class="btns-align-right" v-if="areButtonsVisible">
				<v-spacer></v-spacer>
				<v-btn color="red darken-4" text @click="cancel()">
					Cancel
				</v-btn>
				<v-btn :disabled="isApplyButtonDisabled" color="grey darken-4" text @click="handleApply()">
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
				this.$emit("setElementIdCheck", this.form);
				this.compareData();
			},
			deep: true,
		},
		valid: function(newValue) {
			if (this.areButtonsVisible) this.handleButtonState(newValue);
		},
	},
	mounted() {
		this.handleButtonVisibility(false);
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
			let isIdEmpty = !!this.form.id;
			if (!isEqual) {
				this.handleButtonVisibility(true);
			} else if (!isEqual && !isIdEmpty) {
				this.handleButtonState(false);
			}
		},
		handleButtonState(newValue) {
			this.isApplyButtonDisabled = !newValue;
		},
		handleButtonVisibility(newValue) {
			this.areButtonsVisible = newValue;
		},
		cancel() {
			this.form = { ...this.defaultForm };
			this.handleButtonVisibility(false);
			this.handleButtonState(false);
		},
		handleApply() {
			this.handleButtonVisibility(false);
			this.handleButtonState(false);
			this.$emit("generalOk", this.form, this.defaultForm.id);
		},
	},
};
</script>
