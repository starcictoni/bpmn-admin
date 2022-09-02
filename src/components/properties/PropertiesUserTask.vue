<template>
	<v-dialog v-model="model" content-class="dialog-border" persistent max-width="850">
		<v-card tile class="dialog-card-padding title-margin">
			<v-card-text>
				<v-form ref="userTaskInformation">
					<v-row>
						<v-col cols="12" class="col-no-bottom-padding">
							<div class="card-title connector-title-margin" v-text="config.propsUserTask.documentationText"></div>
							<v-textarea
								class="input-remove-border"
								v-model="documentationData"
								full-width
								flat
								outlined
								rows="2"
								row-height="5"
								label="Documentation"
								auto-grow
								clearable
							></v-textarea>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="12" class="col-no-top-padding">
							<div class="card-wrap parameter-title-margin">
								<div class="card-title" v-text="config.propsUserTask.formFieldText"></div>
								<div class="form-header-btn">
									<v-btn @click="showAddEditDialog(null, 'add')" icon color="yellow accent-3">
										<v-icon class="icon-medium">mdi-plus-box</v-icon>
									</v-btn>
								</div>
								<v-text-field
									v-model="search"
									class="input-remove-border card-search"
									outlined
									dense
									prepend-inner-icon="mdi-magnify"
									placeholder=" Search"
									single-line
									hide-details
								></v-text-field>
							</div>
						</v-col>
						<v-col cols="12" class="col-no-top-padding">
							<v-data-table
								tile
								outlined
								item-key="id"
								sort-by="id"
								loading-text="Loading..."
								:search="search"
								:headers="userTaskHeaders"
								:items="formFields"
								:items-per-page="5"
								:footer-props="footerProps"
								:header-props="headerProps"
								:sort-desc="false"
							>
								<!-- Header tooltip -->
								<template v-for="(h, idx) in userTaskHeaders" v-slot:[`header.${h.value}`]="{}">
									<v-tooltip top :key="idx">
										<template v-slot:activator="{ on }">
											<span v-on="on">{{ h.text }}</span>
										</template>
										<span>{{ h.explanation }}</span>
									</v-tooltip>
								</template>
								<template #[`item.actions`]="{ item }">
									<v-tooltip slot="append" top>
										<template v-slot:activator="{ on }">
											<v-icon dense v-on="on" slot="activator" @click="showAddEditDialog(item, 'edit')">
												mdi-pencil
											</v-icon>
										</template>
										<span>Edit</span>
									</v-tooltip>
									<v-tooltip slot="append" top>
										<template v-slot:activator="{ on }">
											<v-icon dense v-on="on" slot="activator" @click="showDeleteDialog(item)">
												mdi-trash-can
											</v-icon>
										</template>
										<span>Delete</span>
									</v-tooltip>
								</template>
							</v-data-table>
						</v-col>
					</v-row>
				</v-form>
			</v-card-text>
			<v-card-actions class="btns-align-right">
				<v-btn class="dialog-card-action-btn black--text" large depressed tile color="white" @click="cancel()">BACK</v-btn>
				<v-btn class="dialog-card-action-btn white--text" :disabled="isApplyButtonDisabled" large depressed tile color="amber" @click="ok()"
					>APPLY</v-btn
				>
			</v-card-actions>
			<div v-if="isVisibleDeleteDialog">
				<generic-dialog
					ref="deleteDialog"
					:model="isVisibleDeleteDialog"
					:title="config.delete.title"
					:text="config.delete.text"
					:btnColor="config.delete.buttonColor"
					type="delete"
					@cancel="isVisibleDeleteDialog = false"
					@ok="handleFormFieldDelete"
				>
				</generic-dialog>
			</div>
			<div v-if="isVisibleAddEditDialog">
				<user-task-add-edit
					:data="formField"
					:context="context"
					:model="isVisibleAddEditDialog"
					:btnColor="buttonColor"
					:title="title"
					:type="itemType"
					@cancel="closeAddAndEditDialog"
					@ok="handleFormFieldData"
				></user-task-add-edit>
			</div>
		</v-card>
	</v-dialog>
</template>
<script>
import { BpmnXml } from "../../utils/bpmn.js";
import UserTaskAddEdit from "../dialogs/UserTaskAddEdit.vue";
import GenericDialog from "@/components/dialogs/GenericDialog.vue";
import { HeaderConfig, FooterConfig, DialogConfig } from "../../utils/config.js";
import _ from "lodash";
export default {
	name: "properties-edit-user",
	props: ["formData", "documentation", "model", "context"],
	components: {
		UserTaskAddEdit,
		GenericDialog,
	},
	data() {
		return {
			config: DialogConfig.model,
			footerProps: FooterConfig.footerProps,
			headerProps: HeaderConfig.headerProps,
			userConfig: DialogConfig.userTaskConfiguration,
			userTaskHeaders: HeaderConfig.userTaskConfigurationTableHeaders,
			isVisibleDeleteDialog: false,
			isVisibleAddEditDialog: false,
			isApplyButtonDisabled: true,
			search: null,
			formFields: [],
			documentationData: null,
			formField: null,
			itemType: null,
			title: null,
			buttonColor: null,
		};
	},
	mounted() {
		this.setData();
	},
	watch: {
		formFields: {
			handler: function() {
				this.compareFields();
			},
			deep: true,
		},
		documentationData: function() {
			this.compareDocumentation();
		},
	},
	methods: {
		setData() {
			this.formFields = _.cloneDeep(this.formData.fields);
			this.documentationData = this.documentation.text;
		},
		compareFields() {
			let isEqual = _.isEqual(this.formFields, this.formData.fields);
			this.handleButtonState(isEqual);
		},
		compareDocumentation() {
			let isEqual = _.isEqual(this.documentationData, this.documentation.text);
			this.handleButtonState(isEqual);
		},
		handleButtonState(newValue) {
			this.isApplyButtonDisabled = newValue;
		},
		//Add/Edit
		handleFormFieldData(formField) {
			let idx = this.formFields.findIndex((x) => x.id == formField.id);
			idx == -1 ? this.formFields.splice(0, 0, formField) : this.formFields.splice(idx, 1, formField);
			this.closeAddAndEditDialog();
		},
		showAddEditDialog(formField, type) {
			if (type == "add") {
				let moddle = this.context.modeler.get("moddle");
				formField = BpmnXml.createFormField(moddle, this.formData);
				this.buttonColor = this.userConfig.add.buttonColor;
				this.title = this.userConfig.add.title;
			} else {
				this.buttonColor = this.userConfig.edit.buttonColor;
				this.title = this.userConfig.edit.title;
			}
			this.formField = formField;
			this.itemType = type;
			this.isVisibleAddEditDialog = true;
		},
		closeAddAndEditDialog() {
			this.isVisibleAddEditDialog = false;
		},
		//Delete
		showDeleteDialog(formField) {
			this.formField = formField;
			this.isVisibleDeleteDialog = true;
		},
		handleFormFieldDelete() {
			this.isVisibleDeleteDialog = false;
			let idx = this.formFields.findIndex((x) => x.id == this.formField.id);
			this.formFields.splice(idx, 1);
		},
		cancel() {
			this.$emit("cancel", false);
		},
		ok() {
			this.formData.fields = this.formFields;
			this.documentation.text = this.documentationData;
			this.$emit("ok");
		},
	},
};
</script>
<style></style>
