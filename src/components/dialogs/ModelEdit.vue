<template>
	<v-dialog content-class="dialog-border" v-model="model" persistent tile max-width="600">
		<v-card class="dialog-card-padding-activate" tile>
			<v-card-title class="dialog-card-title-generic">EDIT INFORMATION</v-card-title>
			<v-card-text class="dialog-card-body">
				<v-form v-model="valid" ref="editDialogFormInput">
					<v-text-field
						class="input-remove-border text-field-margin"
						:rules="[rules.notEmpty]"
						label="Name"
						outlined
						clearable
						v-model="form.name"
					></v-text-field>
					<v-text-field
						class="input-remove-border text-field-margin"
						label="Filename"
						:rules="[rules.extension, rules.notEmpty]"
						outlined
						clearable
						v-model="form.filename"
					></v-text-field>
				</v-form>
			</v-card-text>
			<v-card-actions class="btns-align-right">
				<v-btn class="dialog-card-action-btn black--text" large depressed tile color="white" @click="cancelAction()">
					CANCEL
				</v-btn>
				<v-btn
					class="dialog-card-action-btn white--text"
					:disabled="isOkButtonDisabled"
					large
					depressed
					tile
					color="amber darken-3"
					@click="okAction()"
				>
					SAVE
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>
<script>
import * as common from "../../utils/common.js";
export default {
	name: "ModelEditDialog",
	props: ["model", "formData"],
	data() {
		return {
			isOkButtonDisabled: true,
			valid: null,
			type: null,
			form: {
				name: null,
				filename: null,
			},
			rules: {
				notEmpty: (field) => {
					return common.isInputValid(field) || "Cannot be empty.";
				},
				extension: (filename) => {
					return common.isExtensionValid(filename) || "Invalid file extension name.";
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
			this.type = common.isItemProcessDefinition(this.formData) ? "definition" : "version";
			if (this.type == "definition") {
				this.form.name = this.formData.process_definition_name;
			} else {
				this.form.name = this.formData.process_version_name;
			}
			this.form.filename = this.formData.file_name;
		},
		compareData() {
			let isEqual = null;
			if (this.type === "edit") {
				isEqual = this.form.name == this.formData.process_definition_name && this.form.filename == this.formData.file_name;
			} else {
				isEqual = this.form.name == this.formData.process_version_name && this.form.filename == this.formData.file_name;
			}
			this.setButtonState(isEqual);
		},
		setButtonState(newState) {
			this.isOkButtonDisabled = newState;
		},
		cancelAction() {
			this.$emit("cancel");
		},
		okAction() {
			if (this.type == "definition") {
				this.formData.process_definition_name = this.form.name;
			} else {
				this.formData.process_version_name = this.form.name;
			}
			this.form.filename = this.formData.file_name;
			this.$emit("ok", this.formData, this.type, "edit");
		},
	},
};
</script>

<style>
.dialog-card-title {
	font-family: Helvetica, Arial, sans-serif !important;
	font-size: 25px !important;
	letter-spacing: -1px !important;
	font-weight: 600 !important;
}
.text-field-margin {
	margin-left: 5% !important;
	margin-right: 5% !important;
}
</style>
