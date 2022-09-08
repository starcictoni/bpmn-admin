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
		<div class="btns-align-right" v-if="areButtonsVisible">
			<v-btn color="red darken-4" text @click="cancel()">
				Cancel
			</v-btn>
			<v-btn :disabled="isApplyButtonDisabled" color="grey darken-4" text @click="handleApply()">
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
			changed: false,
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
				this.$emit("setProcessData", this.form);
				this.compareData();
			},
			deep: true,
		},
		valid: function(newValue) {
			this.handleButtonState(newValue);
		},
	},
	mounted() {
		this.setData();
		this.handleButtonVisibility(false);
	},
	methods: {
		setData() {
			if (_.isEmpty(this.process)) return;
			let routeParams = this.$route.params;
			let id = routeParams.id;
			let type = routeParams.type;
			if (id == "-1" && type == "definition") {
				this.form.name = "New process name";
				this.defaultForm.name = "New process name";
				this.form.filename = "newFilename.bpmn";
				this.defaultForm.filename = "newFilename.bpmn";
			} else if (id != "-1" && type == "definition") {
				this.form.name = this.process.name;
				this.defaultForm.name = this.process.name;
				this.form.filename = this.process.filename;
				this.defaultForm.filename = this.process.filename;
			} else if (type == "version") {
				this.form.name = this.process.name;
				this.defaultForm.name = this.process.name;
				this.form.filename = this.process.filename;
				this.defaultForm.filename = this.process.filename;
			}
		},
		handleButtonState(newValue) {
			this.isApplyButtonDisabled = !newValue;
		},
		handleButtonVisibility(newValue) {
			this.areButtonsVisible = newValue;
		},
		compareData() {
			let isEqual = _.isEqual(this.form, this.defaultForm);
			let isIdEmpty = _.isEmpty(this.form.id);
			if (!isEqual) {
				this.handleButtonVisibility(true);
			} else if (!isEqual && !isIdEmpty) {
				this.handleButtonState(false);
			}
		},
		cancel() {
			this.form = { ...this.defaultForm };
			this.handleButtonVisibility(false);
			this.handleButtonState(false);
		},
		handleApply() {
			this.handleButtonVisibility(false);
			this.handleButtonState(false);
			this.$emit("infoOk", this.form);
		},
	},
};
</script>
