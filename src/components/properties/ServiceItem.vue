<template>
	<v-card>
		<v-card-title class="d-flex justify-start form-title">
			Placeholder for the title
		</v-card-title>
		<v-card-subtitle class="form-subtitle">
			Placeholder for the subtitle
		</v-card-subtitle>
		<v-card-text>
			<div v-if="showConnectorForm">
				<div class="pa-5">
					<div class="form-item">
						<v-select
							append-outer-icon="mdi-api"
							dense
							outlined
							:items="services"
							item-text="name"
							@change="getServiceMeta"
							cache-items
							label="Select a service"
							return-object
						></v-select>
					</div>
					<div class="items">
						<div class="connector-item">
							<h5>{{ typeOfMethod }}</h5>
						</div>
						<div class="form-item">
							<v-select
								append-outer-icon="mdi-routes"
								clearable
								dense
								:disabled="isRoutesDisabled"
								outlined
								:items="routes"
								item-text="url"
								@change="compareData"
								label="Available routes"
								return-object
							></v-select>
						</div>
					</div>
				</div>
				<div v-if="showConnectorSave">
					<v-card-actions class="d-flex justify-end form-buttons">
						<v-btn @click.stop="connectorSave()" class="black--text" large outlined>SAVE</v-btn>
						<v-btn
							@click.stop="connectorCancel()"
							class="form-button white--text"
							color="red"
							depressed
							large
							>CANCEL</v-btn
						>
					</v-card-actions>
				</div>
			</div>

			<div v-if="!showConnectorForm">
				<v-list class="items" v-for="(serviceItem, idx) in serviceItems" :key="serviceItem.id">
					<div class="form-item">
						<v-text-field
							v-model="serviceItem.name"
							label="Name"
							dense
							required
							outlined
							:disabled="disabledRows[idx]"
						></v-text-field>
					</div>
					<div class="form-item">
						<v-text-field
							v-model="serviceItem.body"
							label="Body"
							dense
							required
							outlined
							:disabled="disabledRows[idx]"
						></v-text-field>
					</div>
					<div class="action-items">
						<v-btn ref="editButton" :outlined="!disabledRows[idx]" @click="editItem(serviceItem, idx)" icon>
							<v-icon>mdi-pencil</v-icon>
						</v-btn>
					</div>
					<div class="action-items">
						<v-btn ref="deleteButton" @click="deleteItem(serviceItem, idx)" icon>
							<v-icon>mdi-delete</v-icon>
						</v-btn>
					</div>
				</v-list>
				<div class="d-flex justify-end align-center">
					<v-btn @click.stop="addItem()" icon>
						<v-icon>mdi-plus</v-icon>
					</v-btn>
				</div>
				<div v-if="isChanged">
					<v-card-actions class="d-flex justify-end form-buttons">
						<v-btn
							@click.stop="save()"
							:loading="hasResponseArrived != null && hasResponseArrived === false"
							class="black--text"
							large
							outlined
							>SAVE</v-btn
						>
						<v-btn @click.stop="cancel()" class="form-button white--text" color="red" depressed large
							>CANCEL</v-btn
						>
					</v-card-actions>
				</div>
			</div>
		</v-card-text>
	</v-card>
</template>

<script>
import _ from "lodash";
import { WebService } from "@/services/index";

export default {
	name: "properties-service-item",
	props: ["connectorData", "serviceItemData", "context", "serviceType"],
	data() {
		return {
			hasResponseArrived: null,
			isChanged: false,
			serviceApi: {},
			serviceItems: [],
			disabledRows: [],
			showConnectorForm: false,
			services: [],
			routes: [],
			isRoutesDisabled: true,
			typeOfMethod: "GET",
			showConnectorSave: false,
			selectedService: null,
			selectedRoute: null,
		};
	},
	watch: {
		routes() {
			this.isRoutesDisabled = this.routes.length === 0 ? true : false;
		},
		changed(newValue) {
			this.isChanged = newValue;
		},
	},
	computed: {
		changed() {
			if (!Array.isArray(this.serviceItems) || !this.serviceItems.length) return;

			if (this.serviceItems.length != this.serviceItemData.length) return true;

			let arraysEqual = _.isEqual(this.serviceItems, this.serviceItemData);
			if (!arraysEqual) return true;

			for (let i = 0; i < this.serviceItems.length; i++) {
				let serviceItem = JSON.stringify(this.serviceItems[i]);
				let parentItem = JSON.stringify(this.serviceItemData[i]);
				if (serviceItem !== parentItem) {
					return true;
				}
			}
			return false;
		},
	},
	created() {
		this.serviceApi = _.cloneDeep(this.connectorData);
		this.serviceItems = _.cloneDeep(this.serviceItemData);
		this.showCorrespondingServiceForm();
		this.setRowsInNonEditableMode();
	},
	methods: {
		compareData(selectedRoute) {
			this.selectedRoute = selectedRoute;
			if (selectedRoute == null) {
				this.showConnectorSave = false;
				return;
			}
			this.showConnectorSave = this.serviceItems.some((x) => x.body !== selectedRoute);
		},
		showCorrespondingServiceForm() {
			let typeOfForm = this.serviceType;
			if (typeOfForm == "connector") {
				this.showConnectorForm = true;
				this.getServices();
			} else {
				this.showConnectorForm = false;
			}
		},
		async getServiceMeta(selectedService) {
			this.selectedService = selectedService;
			this.setBackToDefault();
			if (selectedService == null) return;
			this.routes = await WebService.getServiceMeta(selectedService.url);
			console.log("Routes: ", this.routes);
		},
		async getServices() {
			let services = await WebService.get();
			this.services = services;
			console.log("Services: ", this.services);
		},

		setRowsInNonEditableMode() {
			if (!Array.isArray(this.serviceItems) || !this.serviceItems.length) return;
			let disabledRowsLength = this.serviceItems.length;
			this.disabledRows = new Array(disabledRowsLength).fill(true);
		},
		setEditMode(disabledIdx) {
			this.disabledRows.splice(disabledIdx, 1, !this.disabledRows[disabledIdx]);
		},
		addNewNonEditableRow() {
			this.disabledRows.push(true);
		},
		deleteRow(idx) {
			this.disabledRows.splice(idx, 1);
		},
		async save() {
			this.$emit("close");

			//TODO: save to DB
		},
		cancel() {
			this.serviceItems = _.cloneDeep(this.serviceItemData);
			this.setRowsInNonEditableMode();
		},
		addItem() {
			let serviceItem = {
				id: this.incrementGeneratedKey(),
				name: "New service item",
				body: "No available data",
				type: this.getTypeOfServiceItem(),
				disabled: true,
			};
			this.serviceItems.push(serviceItem);
			this.disabledRows.push(true);
		},
		editItem(formField, disabledIdx) {
			this.setEditMode(disabledIdx);
			this.serviceItems.splice(
				this.serviceItems.findIndex((x) => formField.id === x.id),
				0
			);
		},
		deleteItem(formField, idx) {
			this.serviceItems.splice(
				this.serviceItems.findIndex((x) => formField.id === x.id),
				1
			);
			this.deleteRow(idx);
		},
		incrementGeneratedKey() {
			let biggestId = Math.max(...this.serviceItems.map((x) => x.id));
			return biggestId + 1;
		},
		getTypeOfServiceItem() {
			if (this.serviceItems == null) return;
			return this.serviceItems.find((x) => x.type).type;
		},
		connectorSave() {
			let method = this.serviceItemData.find((x) => x.name == "method");
			method["body"] = this.selectedRoute.method;
			let url = this.serviceItemData.find((x) => x.name == "url");
			url["body"] = this.selectedRoute.url;

			this.connectorData["$body"] = this.selectedService.name;
			this.$emit("close");

			//TODO: save to DB
		},
		connectorCancel() {
			window.alert("Need to define the behavior");
			this.serviceItems = _.cloneDeep(this.serviceItemData);
		},
		setBackToDefault() {
			this.routes = [];
			this.showConnectorSave = false;
		},
	},
};
</script>

<style>
h5 {
	font-weight: bold;
	font-size: 15px;
	letter-spacing: -0.5px;
}
.connector-item {
	margin-top: 1.4%;
	margin-left: 1%;
}
.center {
	display: flex;
	justify-content: center;
	align-items: center;
}
.form-title {
	padding: 4% 4% 2% 4%;
}
.form-subtitle {
	padding: 4% 4% 2% 4%;
}
.form-wrap {
	margin-top: 2%;
	padding: 4% 4% 2% 4%;
}
.items {
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
}
.form-item {
	margin-left: 1%;
	margin-right: 1%;
	padding-top: 0px !important;
	flex-grow: 1;
}
.action-items {
	margin-left: 1%;
}
.action-items-health {
	margin: 1% 1% 0% 1%;
}
.form-buttons {
	padding: 0% 4% 2% 0%;
}
.form-button {
	margin-left: 2% !important;
}
.v-list.items.v-sheet.theme--light {
	padding-top: 0% !important;
	padding-bottom: 0% !important;
}
</style>
