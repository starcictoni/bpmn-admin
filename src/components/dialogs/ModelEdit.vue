<template>
	<v-row justify="center">
		<v-dialog v-model="model" persistent max-width="600">
			<v-card class="dialog-card-padding">
				<v-card-title class="dialog-card-title">EDIT INFORMATION</v-card-title>
				<v-card-text class="dialog-card-body">
					<v-form ref="editDialogFormInput">
						<div v-if="this.type == 'definition'">
							<v-text-field
								class="input-remove-border"
								:rules="[rules.notEmpty]"
								label="Name"
								outlined
								clearable
								v-model="data.process_definition_name"
							></v-text-field>
						</div>
						<div v-if="this.type == 'version'">
							<v-text-field
								class="input-remove-border"
								:rules="[rules.notEmpty]"
								label="Name"
								outlined
								clearable
								v-model="data.process_version_name"
							></v-text-field>
						</div>
						<v-text-field
							class="input-remove-border"
							label="Filename"
							:rules="[rules.extension, rules.notEmpty]"
							outlined
							clearable
							v-model="data.file_name"
						></v-text-field>
					</v-form>
				</v-card-text>
				<v-card-actions class="btns-align-right">
					<v-btn class="black--text" large depressed tile color="white" @click="cancelAction()">
						CANCEL
					</v-btn>
					<v-btn class="white--text" :disabled="isSaveEditButtonDisabled" large depressed tile color="teal darken-1" @click="okAction()">
						SAVE
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-row>
</template>
<script>
import * as common from "../../utils/common.js";
import _ from "lodash";
export default {
	name: "ModelEditDialog",
	props: ["model", "formData"],
	data() {
		return {
			data: null,
			processType: null,
			type: "edit",
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
	//mounted is too late
	created() {
		this.setData();
	},
	computed: {
		isSaveEditButtonDisabled() {
			if (JSON.stringify(this.data) == JSON.stringify(this.formData)) return true;
			if (this.$refs.editDialogFormInput === undefined) return;
			let isFormValid = !this.$refs.editDialogFormInput.inputs.every((x) => x.valid == true);
			return isFormValid;
		},
	},
	methods: {
		setData() {
			this.data = _.cloneDeep(this.formData);
			if (common.isItemProcessDefinition(this.formData)) {
				this.processType = "definition";
			} else {
				this.processType = "version";
			}
		},
		cancelAction() {
			this.processType = null;
			this.$emit("cancel");
		},
		okAction() {
			this.$emit("ok", this.data, this.processType, this.type);
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
</style>
