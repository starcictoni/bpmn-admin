<template>
	<v-dialog content-class="dialog-border" v-model="model" persistent max-width="660">
		<v-card tile class="dialog-card-padding">
			<v-card-title class="dialog-card-title-generic" v-text="title"></v-card-title>
			<v-card-text class="dialog-card-text" v-text="text"> </v-card-text>
			<v-card-actions class="btns-align-right">
				<v-btn class="dialog-card-action-btn black--text" large depressed tile color="white" @click="cancelAction()">BACK</v-btn>
				<v-btn class="dialog-card-action-btn white--text" large depressed tile color="green" @click="okAction()">OK</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
export default {
	name: "GenericDialog",
	props: ["model", "title", "text", "btnColor", "type"],
	data() {
		return {};
	},
	methods: {
		cancelAction() {
			this.$emit("cancel");
		},
		okAction() {
			this.$emit("ok", this.type);
		},
	},
};
</script>

<style>
.dialog-border {
	border-radius: 0px !important;
}
.dialog-card-padding {
	padding: 1.5%;
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
