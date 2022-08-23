<template>
	<v-dialog content-class="dialog-border" v-model="model" persistent max-width="660">
		<v-card tile class="dialog-card-padding">
			<v-card-title class="dialog-card-title-generic no-bottom-padding" v-text="title"></v-card-title>
			<v-card-text class="no-bottom-padding">
				<v-form v-model="valid" class="service-form">
					<v-text-field
						class="input-remove-border"
						:rules="[rules.notEmpty]"
						v-model="form.name"
						label="Name"
						dense
						outlined
						tile
					></v-text-field>
					<v-text-field class="input-remove-border" v-model="form.value" label="Value" dense outlined tile></v-text-field>
					<div class="dialog-card-radio-header">SELECT TYPE</div>
					<v-radio-group row v-model="form.$type" mandatory>
						<v-radio color="orange" label="Input" value="camunda:InputParameter"></v-radio>
						<v-radio color="orange darken-3" label="Output" value="camunda:OutputParameter"></v-radio>
					</v-radio-group>
				</v-form>
			</v-card-text>
			<v-card-actions class="btns-align-right">
				<v-btn class="dialog-card-action-btn black--text" large depressed tile color="white" @click="cancelAction()">BACK</v-btn>
				<v-btn
					class="dialog-card-action-btn white--text"
					:disabled="isOkButtonDisabled"
					large
					depressed
					tile
					:color="btnColor"
					@click="okAction()"
					>OK</v-btn
				>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>
<script>
import { BpmnXml } from "../../utils/bpmn.js";
import * as common from "@/utils/common.js";
import _ from "lodash";
export default {
	name: "service-task-add-edit",
	props: ["model", "parameters", "context", "type", "data", "btnColor", "title"],
	data() {
		return {
			valid: false,
			isOkButtonDisabled: true,
			form: {
				$type: "camunda:InputParameter",
				name: null,
				value: null,
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
			if (!newValue) {
				this.setButtonState(true);
			}
		},
	},
	mounted() {
		this.setData();
	},
	methods: {
		setData() {
			if (this.type === "edit") this.form = _.cloneDeep(this.data);
		},
		checkForEmpty() {
			if (this.form.name == null) return true;
			return false;
		},
		compareData() {
			if (this.type === "edit") {
				let isEqual = _.isEqual(this.form, this.data);
				this.setButtonState(isEqual);
			} else {
				let isNull = this.checkForEmpty();
				this.setButtonState(isNull);
			}
		},
		setButtonState(newState) {
			this.isOkButtonDisabled = newState;
		},
		cancelAction() {
			this.$emit("cancel");
		},
		okAction() {
			if (this.type === "edit") {
				this.data.$type = this.form.$type;
				this.data.name = this.form.name;
				this.data.value = this.form.value;
				this.$emit("ok", this.data, this.type);
			} else {
				let moddle = this.context.modeler.get("moddle");
				let property =
					this.form.$type == "camunda:InputParameter"
						? BpmnXml.createInputParameter(moddle, this.parameters)
						: BpmnXml.createOutputParameter(moddle, this.parameters);
				property.name = this.form.name;
				property.value = this.form.value;
				this.$emit("ok", property, this.type);
			}
		},
	},
};
</script>
<style scoped>
.no-bottom-padding {
	padding-bottom: 0px !important;
}
.dialog-card-radio-header {
	font-family: Helvetica, Arial, sans-serif !important;
	font-size: 15px !important;
	font-weight: 800 !important;
	color: rgba(0, 0, 0, 0.87);
}
</style>
