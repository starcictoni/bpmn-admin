<template>
	<div v-if="this.data">
		<v-card class="mt-4" tile outlined>
			<v-card-text>
				<div class="d-flex justify-start align-center">
					<div
						v-if="connectorGeneralInfo.$body != null"
						class="text-header"
						v-text="connectorGeneralInfo.$body.toUpperCase() + ' SERVICE'"
					></div>
					<div v-if="connectorGeneralInfo.$body == null" class="text-header" v-text="'SERVICE'"></div>
					<v-btn tile icon @click.stop="openDialog(connectorGeneralInfo, connectorParameters, 'connector')">
						<v-icon class="header-btn-icon">mdi-pencil</v-icon>
					</v-btn>
				</div>
				<v-list class="pa-0" v-for="cp in connectorParameters" :key="cp.id">
					<v-divider class="ml-3 mr-3"></v-divider>
					<v-list-item disabled class="list-margin">
						<v-list-item-icon>
							<v-icon disabled>{{ getIconFor(cp.type) }}</v-icon>
						</v-list-item-icon>
						<v-list-item-content>
							<v-list-item-title v-text="cp.name"></v-list-item-title>
							<v-list-item-subtitle v-text="cp.body"></v-list-item-subtitle>
						</v-list-item-content>
					</v-list-item>
				</v-list>
			</v-card-text>
			<div v-if="isChanged" class="d-flex justify-end form-buttons">
				<v-card-actions>
					<v-btn @click.stop="save()" :loading="hasResponseArrived != null && hasResponseArrived === false" class="black--text" large outlined
						>SAVE</v-btn
					>
					<v-btn @click.stop="cancel()" class="form-button white--text" color="red" depressed large>CANCEL</v-btn>
				</v-card-actions>
			</div>
		</v-card>

		<v-card class="mt-4" tile outlined>
			<v-card-text>
				<div class="d-flex justify-start align-center">
					<div class="text-header">INPUT VARIABLES</div>
					<v-btn tile icon @click.stop="openDialog(connectorGeneralInfo, inputParameters, 'inputParams')">
						<v-icon>mdi-pencil</v-icon>
					</v-btn>
				</div>
				<v-list class="pa-0" v-for="ip in inputParameters" :key="ip.id">
					<v-divider class="ml-3 mr-3"></v-divider>
					<v-list-item disabled class="list-margin">
						<v-list-item-icon>
							<v-icon disabled>{{ getIconFor(ip.type) }}</v-icon>
						</v-list-item-icon>
						<v-list-item-content>
							<v-list-item-title v-text="ip.name"> </v-list-item-title>
							<v-list-item-subtitle v-text="ip.body"></v-list-item-subtitle>
						</v-list-item-content>
					</v-list-item>
				</v-list>
			</v-card-text>
			<div v-if="isChanged" class="d-flex justify-end form-buttons">
				<v-card-actions>
					<v-btn @click.stop="save()" :loading="hasResponseArrived != null && hasResponseArrived === false" class="black--text" large outlined
						>SAVE</v-btn
					>
					<v-btn @click.stop="cancel()" class="form-button white--text" color="red" depressed large>CANCEL</v-btn>
				</v-card-actions>
			</div>
		</v-card>

		<v-card class="mt-4" tile outlined>
			<v-card-text>
				<div class="d-flex justify-start align-center">
					<div class="text-header">OUTPUT VARIABLES</div>
					<v-btn tile icon @click.stop="openDialog(connectorGeneralInfo, outputParameters, 'outputParams')">
						<v-icon>mdi-pencil</v-icon>
					</v-btn>
				</div>
				<v-list class="pa-0" v-for="op in outputParameters" :key="op.id">
					<v-divider class="ml-3 mr-3"></v-divider>
					<v-list-item disabled class="list-margin">
						<v-list-item-icon>
							<v-icon disabled>{{ getIconFor(op.type) }}</v-icon>
						</v-list-item-icon>
						<v-list-item-content>
							<v-list-item-title v-text="op.name"></v-list-item-title>
							<v-list-item-subtitle v-text="op.body"></v-list-item-subtitle>
						</v-list-item-content>
					</v-list-item>
				</v-list>
			</v-card-text>
			<div v-if="isChanged" class="d-flex justify-end form-buttons">
				<v-card-actions>
					<v-btn @click.stop="save()" :loading="hasResponseArrived != null && hasResponseArrived === false" class="black--text" large outlined
						>SAVE</v-btn
					>
					<v-btn @click.stop="cancel()" class="form-button white--text" color="red" depressed large>CANCEL</v-btn>
				</v-card-actions>
			</div>
		</v-card>

		<v-dialog :key="isDialogShown" v-model="isDialogShown" @click:outside="closeDialog" max-width="700">
			<service-item
				ref="serviceItem"
				@close="closeDialog"
				:connectorData="propConnectorGeneral"
				:serviceItemData="serviceItemData"
				:context="context"
				:serviceType="serviceFormType"
			>
			</service-item>
		</v-dialog>
	</div>
</template>
<script>
import { ServiceItemMetaModel } from "@/utils/bpmn";

export default {
	name: "properties-service",
	props: ["data", "context"],
	components: {
		serviceItem: () => import("@/components/properties/ServiceItem.vue"),
	},
	created() {
		this.setState();
	},
	data() {
		let modeler = this.context.modeler;
		return {
			cs: modeler.get("commandStack"),
			isChanged: false,
			generatedId: 0,
			isDialogShown: false,
			inputParameters: [],
			outputParameters: [],
			connectorGeneralInfo: {},
			connectorParameters: [],
			serviceItemData: {},
			serviceFormType: null,
			propConnectorGeneral: {},
		};
	},
	watch: {
		data() {
			this.setState();
		},
	},
	computed: {
		changed() {
			let state = this.state.reduce((a, x) => a + ";" + x.id, "");
			let data = this.data.formData.$children.reduce((a, x) => a + ";" + x.id, "");
			return state != data;
		},
	},
	methods: {
		setState() {
			debugger;
			if (!Array.isArray(this.data)) return;
			this.initializeData();

			let inputOutputs = this.data.find((item) => item.$type == "camunda:inputOutput")?.$children;
			if (inputOutputs != null) {
				for (let inputOutput of inputOutputs) {
					let field = {
						$bpmn: inputOutput,
						id: this.incrementGeneratedKey(inputOutputs),
						name: inputOutput.name,
						type: inputOutput.$type,
						body: inputOutput.$body || "No available data", // || null
					};
					field.type === "camunda:inputParameter" ? this.inputParameters.push(field) : this.outputParameters.push(field);
				}
			}

			let connector = this.data.find((item) => item.$type == "camunda:connector")?.$children;
			if (connector != null) {
				this.connectorGeneralInfo = connector.find((item) => item.$type == "camunda:connectorId");

				let connectorInputParameters = connector.find((item) => item.$type == "camunda:inputOutput")?.$children;
				for (let connectorInputParam of connectorInputParameters) {
					let field = {
						$bpmn: connectorInputParam,
						id: this.incrementGeneratedKey(connectorInputParameters),
						name: connectorInputParam.name,
						type: connectorInputParam.$type,
						body: connectorInputParam.$body || null,
					};
					this.connectorParameters.push(field);
				}
			}
		},
		initializeData() {
			this.connectorGeneralInfo = {};
			this.inputParameters = [];
			this.outputParameters = [];
			this.connectorParameters = [];
		},
		getIconFor(type) {
			return ServiceItemMetaModel[type].icon;
		},
		incrementGeneratedKey() {
			return this.generatedId++;
		},
		openDialog(connectorData, serviceData, type) {
			this.propConnectorGeneral = connectorData;
			this.connectorGeneralInfo = connectorData;
			this.serviceItemData = serviceData;
			this.serviceFormType = type;
			this.isDialogShown = true;
		},
		closeDialog() {
			this.propConnectorGeneral = null;
			this.serviceItemData = null;
			this.isDialogShown = false;
		},
	},
};
</script>

<style scoped>
.list-margin {
	margin-top: 1%;
	margin-left: 5%;
	margin-right: 5%;
}
.text-header {
	font-weight: 500;
	font-size: 14px;
	padding: 4% 3% 3% 6%;
	color: #5f5f5f;
}
</style>
