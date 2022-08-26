<template>
	<v-dialog content-class="dialog-border" v-model="model" persistent max-width="660">
		<v-card tile class="dialog-card-padding">
			<v-card-title class="dialog-card-title-generic" v-text="title"></v-card-title>
			<v-card-text>
				<v-form v-model="valid" class="service-form">
					<v-text-field
						placeholder="Service name"
						class="input-remove-border"
						v-model="form.name"
						label="Name"
						dense
						outlined
						tile
						:rules="[rules.notEmpty]"
					></v-text-field>
					<v-text-field
						placeholder="http://127.0.0.1:9999"
						class="input-remove-border"
						label="Address"
						type="URL"
						dense
						outlined
						tile
						v-model="form.address"
						:rules="[rules.notEmpty]"
					></v-text-field>
					<v-checkbox
						class="service-form-checkbox input-remove-border"
						v-model="form.is_active"
						color="amber darken-5"
						label="Active"
						v-if="type == 'add'"
					></v-checkbox>
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
import * as common from "@/utils/common.js";
export default {
	name: "ServiceAddAndEditDialog",
	props: ["model", "title", "text", "btnColor", "type", "formData"],
	data() {
		return {
			valid: null,
			form: {
				id: null,
				name: null,
				address: null,
				is_active: false,
			},
			rules: {
				notEmpty: (field) => {
					return common.isInputValid(field) || "Cannot be empty.";
				},
			},
			isOkButtonDisabled: true,
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
		setData() {
			if (this.type == "edit") {
				this.form.id = this.formData.id;
				this.form.name = this.formData.name;
				this.form.address = this.formData.address;
				this.form.is_active = this.formData.is_active;
			}
		},
		compareData() {
			if (this.type === "edit") {
				debugger;
				let isEqual =
					this.form.name == this.formData.name && this.form.address == this.formData.address && this.form.is_active == this.formData.is_active;
				this.setButtonState(isEqual);
			} else {
				let isNull = this.checkForEmpty();
				this.setButtonState(isNull);
			}
		},
		checkForEmpty() {
			if (!this.form.name || !this.form.address) return true;
			return false;
		},
		setButtonState(newValue) {
			this.isOkButtonDisabled = newValue;
		},
		cancelAction() {
			this.$emit("cancel");
		},
		okAction() {
			this.$emit("ok", this.type, this.form);
		},
	},
};
</script>

<style>
.service-form {
	margin-top: 5%;
	display: flex;
	flex-direction: column;
}
.service-form-checkbox {
	margin-top: 0% !important;
	align-items: center;
	justify-content: flex-end;
}
.dialog-border {
	border-radius: 0px !important;
}
.dialog-card-padding {
	padding: 1.5% !important;
}
.dialog-card-title-generic {
	font-family: Helvetica, Arial, sans-serif !important;
	font-size: 24px !important;
	letter-spacing: -1px !important;
	font-weight: 800 !important;
	padding: 2% !important;
}
.dialog-card-action-generic {
	padding: 1.5% !important;
	margin-bottom: 1% !important;
	margin-left: 2%;
	margin-right: 2%;
	border-radius: 0px !important;
	background: linear-gradient(rgba(142, 200, 200, 0.15), rgba(0, 0, 0, 0.11));
	justify-content: flex-end;
	align-items: center;
}
.dialog-card-action-btn {
	font-size: 16px !important;
	font-weight: 700 !important;
	width: 18%;
}
</style>
