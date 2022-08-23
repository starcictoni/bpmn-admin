<template>
	<div>
		<v-form v-model="valid" ref="processInformation">
			<v-text-field
				class="input-remove-border"
				height="10"
				:rules="[rules.notEmpty]"
				label="Name"
				outlined
				clearable
				dense
				v-model="form.name"
			></v-text-field>
			<v-text-field
				class="input-remove-border input-top-negative-margin"
				label="Filename"
				height="10"
				dense
				:rules="[rules.notEmpty, rules.extension]"
				outlined
				clearable
				v-model="form.filename"
			></v-text-field>
		</v-form>
		<div v-show="areButtonsVisible">
			<v-btn color="darken-1" text @click="cancel()">
				Cancel
			</v-btn>
			<v-btn :disabled="isApplyButtonDisabled" color="blue darken-1" text @click="handleApply()">
				Apply
			</v-btn>
		</div>
	</div>
</template>
<script>
import * as common from "@/utils/common.js";
import _ from "lodash";
export default {
	name: "properties-process-info",
	props: ["process", "processType"],
	data() {
		return {
			utils: common,
			rules: {
				notEmpty: (field) => {
					return common.isInputValid(field) || "Cannot be empty.";
				},
				extension: (filename) => {
					return common.isExtensionValid(filename) || "Invalid file extension name.";
				},
			},
			valid: null,
			areButtonsVisible: false,
			isApplyButtonDisabled: true,
			form: {
				name: null,
				filename: null,
			},
			defaultForm: {
				name: null,
				filename: null,
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
			if (this.processType == "definition") {
				this.form.name = this.process.process_definition_name;
				this.defaultForm.name = this.process.process_definition_name;
				this.form.filename = this.process.file_name;
				this.defaultForm.filename = this.process.file_name;
			} else if (this.processType == "version") {
				this.form.name = this.process.process_version_name;
				this.defaultForm.name = this.process.process_version_name;
				this.form.filename = this.process.file_name;
				this.defaultForm.filename = this.process.file_name;
			} else {
				this.form.name = "New process name";
				this.defaultForm.name = "New process name";
				this.form.filename = "newFilename.bpmn";
				this.defaultForm.filename = "newFilename.bpmn";
			}
		},
		compareData() {
			let isEqual = _.isEqual(this.form, this.defaultForm);
			this.handleButtonVisibility(!isEqual);
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
			this.$emit("infoOk", this.form);
		},
	},
};
</script>
