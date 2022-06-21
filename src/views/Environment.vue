<template>
	<v-container fill-height fluid class="background">
		<v-row align="center" justify="center">
			<v-col cols="12" class="d-flex justify-center align-center">
				<v-card elevation="2" outlined min-width="900">
					<v-card-title class="d-flex justify-start form-title">
						CRUD - Services
					</v-card-title>
					<v-card-subtitle class="form-subtitle">
						Placeholder for the subtitle
					</v-card-subtitle>
					<v-card-text class="form-wrap">
						<v-form>
							<div class="alert-wrap" v-if="hasResponseArrived">
								<div v-for="(item, idx) in responseMessages" :key="idx">
									<v-alert dense type="success" :value="alert">
										{{ item }}
									</v-alert>
								</div>
							</div>
							<div v-if="isDataLoaded">
								<div v-for="service in services" :key="service.id">
									<environment-item
										ref="environmentItem"
										:field="service"
										@edit="editItem"
										@delete="deleteItem"
										@fieldHasChanged="updateServices"
									>
									</environment-item>
								</div>
							</div>
						</v-form>
						<div class="d-flex justify-end align-center">
							<!-- TODO: fix styling -->
							<v-btn @click.stop="addItem()" icon>
								<v-icon>mdi-plus</v-icon>
							</v-btn>
						</div>
					</v-card-text>
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
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import Vue from "vue";
import { WebService } from "../services/index.js";

export default {
	name: "Environment",
	components: {
		environmentItem: () => import("@/components/EnvironmentItem.vue"),
	},
	data() {
		return {
			service: null,
			alert: false,
			isDataLoaded: false,
			isChanged: false,
			hasResponseArrived: null,
			serviceStatuses: [],
			services: [],
			originalData: [],
			editedFields: [],
			changedServices: [],
			responseMessages: [],
		};
	},
	async mounted() {
		this.serviceStatuses = await this.getHealth();
		this.originalData = await this.getServices();
		this.changedServices = [...this.originalData];
		this.isDataLoaded = true;
	},
	watch: {
		services: {
			handler: function(newServices) {
				if (newServices.length != this.originalData.length) {
					return (this.isChanged = true);
				}
				for (let att in newServices) {
					if (newServices[att] != this.originalData[att]) {
						return (this.isChanged = true);
					}
				}
				return (this.isChanged = false);
			},
			deep: true,
			immediate: true,
		},
		isDataLoaded: function() {
			this.isDataLoaded
				? ((this.services = [...this.originalData]), this.setServiceHpStatus(), this.disableItems())
				: (this.isDataLoaded = false);
		},
		alert: function() {
			setTimeout(() => {
				this.alert = false;
			}, 2000);
		},
	},
	methods: {
		async getServices() {
			let services = await WebService.get();
			return services;
		},
		async getHealth() {
			let status = await WebService.getHealth();
			return status;
		},
		async save() {
			debugger;
			this.hasResponseArrived = false;
			let response = await WebService.sendData(this.services, this.originalData);
			if (response) {
				this.originalData = [...this.services];
				this.hasResponseArrived = true;
				this.showResponseMessages(response);
			}
		},
		async showResponseMessages(messages) {
			debugger;
			this.responseMessages = messages.message;
			this.alert = true;
		},
		cancel() {
			this.services = [...this.originalData];
			this.disableItems();
		},
		removeElement(item, arr) {
			arr.splice(
				arr.findIndex((x) => item.id === x.id),
				1
			);
		},
		updateServices(newVal, oldVal, id, childData) {
			debugger;
			let isNew = this.originalData.find((item) => item.id === childData.id);
			if (!isNew) Vue.delete(childData, "changed");

			Object.assign(
				this.changedServices,
				this.changedServices.map((el) => (el.id === childData.id ? childData : el))
			);
			//Object.assign(this.services, this.services.map(el => el.id === childData.id ? childData : el));
			newVal && !oldVal ? this.editedFields.push(id) : this.removeElement(id, this.editedFields);
			this.editedFields.length !== 0 ? (this.isChanged = true) : (this.isChanged = false);
		},
		addItem() {
			this.service = {
				id: this.incrementGeneratedKey(),
				name: "New service",
				type: "http-connector",
				url: "http://127.0.0.1:xxxx",
				disabled: true,
				color: null,
			};
			// this.editItem(this.service);
			this.changedServices.push(this.service);
			this.services.push(this.service);
		},
		editItem(formField) {
			// this.service = formField;
			formField.disabled = !formField.disabled;
		},
		deleteItem(formField) {
			this.services.splice(
				this.services.findIndex((x) => formField.id === x.id),
				1
			);
		},
		disableItems() {
			if (this.services == undefined) return;
			this.services.map((item) => (item["disabled"] = true));
		},
		setServiceHpStatus() {
			if (this.serviceStatuses == undefined) return;
			for (const [name, status] of Object.entries(this.serviceStatuses)) {
				let service = this.services.find((x) => x.name === name);
				service != null
					? status
						? this.$set(service, "color", "green")
						: this.$set(service, "color", "red")
					: this.$set(service, "color", "red");
			}
		},
		incrementGeneratedKey() {
			let biggestId = Math.max(...this.services.map((x) => x.id));
			return biggestId + 1;
		},
	},
};
</script>

<style scoped>
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
.form-buttons {
	margin: 0% 4% 3% 0%;
}
.form-button {
	margin-left: 2% !important;
}
.alert-wrap {
	margin-bottom: 4%;
}
/* .background {
	background: rgb(2, 0, 36);
	background: linear-gradient(
		90deg,
		rgba(2, 0, 36, 1) 0%,
		rgba(121, 16, 9, 1) 0%,
		rgba(76, 89, 100, 1) 54%,
		rgba(0, 212, 255, 1) 100%
	);
} */
</style>
