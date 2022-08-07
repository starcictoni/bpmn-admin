<template>
	<div>
		<v-form ref="processInformation">
			<div v-if="processType == 'definition' || processType == 'new'">
				<v-text-field
					class="input-remove-border"
					:rules="[rules.notEmpty]"
					label="Name"
					outlined
					clearable
					dense
					v-model="processDefintionName"
				></v-text-field>
			</div>
			<div v-if="processType == 'version'">
				<v-text-field
					class="input-remove-border"
					height="10"
					:rules="[rules.notEmpty]"
					label="Name"
					outlined
					dense
					clearable
					v-model="processVersionName"
				></v-text-field>
			</div>
			<v-text-field
				class="input-remove-border input-top-negative-margin"
				label="Filename"
				height="10"
				dense
				:rules="[rules.notEmpty]"
				outlined
				clearable
				v-model="filename"
			></v-text-field>
		</v-form>
		<div v-show="areButtonsVisible">
			<v-btn color="darken-1" text @click="setState()">
				Cancel
			</v-btn>
			<v-btn color="blue darken-1" text @click="save()">
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
	props: ["data", "process", "context"],
	data() {
		let modeler = this.context.modeler;
		return {
			utils: common,
			formData: null,
			processDefinitionName: "Default definition name",
			processVersionName: "Default version name",
			filename: "fileV1.bpmn",
			processType: null,
			rules: {
				notEmpty: (field) => {
					return common.isInputValid(field) || "Cannot be empty.";
				},
				extension: (filename) => {
					return common.isExtensionValid(filename) || "Invalid file extension name.";
				},
			},
			modeler: modeler,
			cs: modeler.get("commandStack"),
			areButtonsVisible: false,
		};
	},
	mounted() {
		this.setData();
	},
	methods: {
		setData() {
			debugger;
			//tu trebaju podaci
			this.formData = _.cloneDeep(this.data);
		},
		cancelAction() {
			this.processType = null;
			this.$emit("cancel");
		},
		okAction() {
			this.$emit("ok", this.data, this.processType, this.type);
		},
		handleButtonsVisiblity() {
			if (JSON.stringify(this.data) == JSON.stringify(this.formData)) return true;
			if (this.$refs.editDialogFormInput === undefined) return;
			let isFormValid = !this.$refs.editDialogFormInput.inputs.every((x) => x.valid == true);
			return isFormValid;
		},
		save() {
			let updates = [];
			for (let att in this.state) {
				if (this.state[att] != this.data[att]) {
					updates.push({
						cmd: "bpmn-update",
						context: {
							element: this.context.bpmnElement,
							businessObject: this.context.bpmnElement.businessObject,
							properties: { [att]: this.state[att] },
						},
					});
				}
			}
			this.cs.execute("bpmn-multi-update", updates);
		},
	},
};
</script>
