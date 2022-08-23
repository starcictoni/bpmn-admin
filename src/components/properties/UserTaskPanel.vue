<template>
	<v-row class="row-margin">
		<div class="panel-container">
			<div class="panel-column-1">
				<div class="panel-form">
					<div class="fields-count" v-if="showFormMessage" v-text="formDataCount"></div>
					<div class="fields-text-user" v-text="formMessage"></div>
				</div>
				<div class="panel-form">
					<v-icon class="icon-sm" v-show="!documentationExists" color="red darken-4">mdi-close-thick</v-icon>
					<v-icon class="icon-sm" v-show="documentationExists" color="green darken-3">mdi-check-bold</v-icon>
					<div class="documentation-text" v-text="docsMessage"></div>
				</div>
			</div>
			<div class="panel-column-2">
				<div class="panel-btn">
					<v-tooltip slot="append" top>
						<template #activator="{ on }">
							<v-btn tile v-on="on" slot="activator" outlined icon @click="handleDialogState(true)">
								<v-icon>
									mdi-playlist-edit
								</v-icon>
							</v-btn>
						</template>
						<span>Edit fields</span>
					</v-tooltip>
				</div>
			</div>
		</div>
		<div v-if="isEditDialogShown">
			<properties-edit-user
				@ok="applyChanges"
				@cancel="handleDialogState"
				:formData="formData"
				:documentation="documentation"
				:model="isEditDialogShown"
				:context="context"
			></properties-edit-user>
		</div>
	</v-row>
</template>
<script>
import * as common from "@/utils/common.js";
import PropertiesEditUser from "../dialogs/PropertiesUserTask.vue";
export default {
	name: "UserTaskPanel",
	props: ["data", "context"],
	components: {
		PropertiesEditUser,
	},
	data() {
		return {
			isEditDialogShown: false,
			utils: common,
			formData: null,
			formDataCount: null,
			documentation: null,
			formMessage: "",
			docsMessage: "DOCUMENTATION",
			showFormMessage: false,
			documentationExists: false,
		};
	},
	mounted() {
		this.setState();
		this.setPropertiesPanelData();
	},
	methods: {
		setState() {
			this.formData = this.data.formData;
			this.documentation = this.data.docs;
		},
		setPropertiesPanelData() {
			this.formData != null ? this.handleFormFieldMessage(true) : this.handleFormFieldMessage(false);
			this.documentation != null ? this.showDocumentationIcons(true) : this.showDocumentationIcons(false);
		},
		handleFormFieldMessage(value) {
			if (!this.formData.fields) {
				return;
			}
			if (value) {
				this.formDataCount = this.formData.fields.length;
				this.formMessage = this.formDataCount == 1 ? " FORM FIELD" : " FORM FIELDS";
			} else {
				this.formMessage = "NO FORM FIELDS";
			}
			this.showFormMessage = value;
		},
		showDocumentationIcons(value) {
			this.documentationExists = value;
		},
		handleDialogState(newValue) {
			this.isEditDialogShown = newValue;
		},
		applyChanges(formFields, documentation) {
			this.data.formData.fields = formFields;
			this.documentation = documentation;
			//+ save changes to xml
			debugger;
			this.setPropertiesPanelData();
			this.handleDialogState(false);
		},
	},
};
</script>
<style>
.row-margin {
	margin: 2% 0% !important;
	padding: 5% !important;
	border: 1px solid #cccc;
}
.panel-container {
	display: flex;
	flex-direction: row;
	width: 100%;
}
.panel-column-1 {
	display: flex;
	flex-direction: column;
	margin-left: 5%;
}
.panel-column-2 {
	display: flex;
	margin-left: auto !important;
	flex-direction: row;
	align-items: center;
	margin-right: 2%;
}
.panel-form {
	display: flex;
	flex-direction: row;
}
.panel-btn {
	display: flex;
	flex-direction: row;
}
.documentation-text {
	margin-left: 5%;
	letter-spacing: -1px;
	font-size: 16px;
	font-weight: 500;
}
.fields-text-user {
	letter-spacing: -1px;
	font-size: 16px;
	font-weight: 500;
	margin-left: 10%;
}
.fields-count {
	margin-left: 2%;
	font-size: 17px;
	font-weight: 700;
}
.icon-sm {
	font-size: 19px !important;
}
</style>
