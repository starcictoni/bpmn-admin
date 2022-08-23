<template>
	<v-dialog v-model="model" max-width="660">
		<v-card>
			<v-card-title class="d-flex justify-start form-title">
				Placeholder for the title
			</v-card-title>
			<v-card-subtitle class="form-subtitle">
				Placeholder for the subtitle
			</v-card-subtitle>
			<v-card-text>
				<v-row>
					<v-col>
						<v-form>
							<v-text-field v-model="state.id" label="ID" outlined dense></v-text-field>
							<v-text-field v-model="state.defaultValue" label="Default Value" outlined dense></v-text-field>
							<v-textarea v-model="state.label" label="Label" outlined dense></v-textarea>
							<v-select
								dense
								v-model="state.type"
								outlined
								:items="types"
								item-value="type"
								item-text="name"
								label="Item Type"
								@change="showFormRightSide"
								return-object
							>
								<template v-slot:item="{ item }">
									<v-list-item-icon>
										<v-icon v-text="item.icon"></v-icon>
									</v-list-item-icon>
									<v-list-item-content>
										<v-list-item-title v-text="item.name"></v-list-item-title>
									</v-list-item-content>
								</template>
							</v-select>
						</v-form>
					</v-col>

					<v-col v-if="isRightSideShown && !loading">
						<div class="form-item">
							<!-- append-outer-icon="mdi-api"  -->
							<v-select
								append-icon="mdi-api"
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
						<!-- append-outer-icon="mdi-routes" -->
						<div class="form-item">
							<v-select
								append-icon="mdi-routes"
								clearable
								dense
								:disabled="isRoutesDisabled"
								outlined
								:items="routes"
								item-text="url"
								label="Available routes"
								return-object
							></v-select>
						</div>
					</v-col>
				</v-row>
			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn color="blue darken-1" text @click="$emit('close')">
					Close
				</v-btn>
				<v-btn v-if="changed" color="blue darken-1" text @click="save()">
					Apply
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>
<script>
import _ from "lodash";
import { FormItemMetaModel } from "@/utils/bpmn";
import { WebService } from "@/services/index";
export default {
	name: "properties-form-item",
	props: ["data", "context", "model"],
	data() {
		let modeler = this.context.modeler;
		return {
			type: null,
			loading: true,
			originalData: null,
			types: Object.values(FormItemMetaModel),
			modeler: modeler,
			isRightSideShown: false,
			serviceValues: [],
			services: [],
			selectedServices: [],
			state: {
				id: null,
				defaultValue: null,
				label: null,
				type: null,
				properties: [],
				validation: [],
			},
			cs: modeler.get("commandStack"),
			selectedService: null,
			selectedRoute: null,
			routes: [],
			isRoutesDisabled: true,
		};
	},
	async mounted() {
		this.services = await WebService.get();
		this.serviceValues = this.services.map((x) => x.name);
		this.loading = false;
	},
	created() {
		this.originalData = _.cloneDeep(this.data);
		this.setState();
	},
	watch: {
		$data: function() {
			this.setState();
		},
		routes() {
			this.isRoutesDisabled = this.routes.length === 0 ? true : false;
		},
	},
	computed: {
		changed() {
			for (let att in this.state) {
				if (this.originalData[att] != this.state[att]) return true;
			}
			return false;
		},
	},
	methods: {
		async getServices() {
			this.response = WebService.get();
			this.services = await this.response;
		},
		async getServiceMeta(selectedService) {
			this.selectedService = selectedService;
			this.setBackToDefault();
			if (selectedService == null) return;
			this.routes = await WebService.getServiceMeta(selectedService.url);
		},
		setBackToDefault() {
			this.routes = [];
			this.showConnectorSave = false;
		},
		showFormRightSide(selectedItem) {
			if (selectedItem == null || !selectedItem?.type) return;

			if (selectedItem.type == "rich-text" || selectedItem.type == "autocomplete-string") {
				this.isRightSideShown = true;
				this.getServices();
			} else {
				this.isRightSideShown = false;
			}
		},
		setState() {
			for (let att in this.state) {
				this.state[att] = this.data[att];
			}
		},
		save() {
			let updates = [];
			for (let att in this.state) {
				if (this.originalData[att] != this.state[att]) {
					updates.push({
						cmd: "bpmn-update",
						context: {
							element: this.context.bpmnElement,
							businessObject: this.data,
							properties: { [att]: this.state[att] },
						},
					});
				}
			}
			this.cs.execute("bpmn-multi-update", updates);

			this.$emit("close");
		},
	},
};
</script>

<style scoped>
.form-title {
	padding: 4% 4% 2% 4%;
}
.form-subtitle {
	padding: 4% 4% 2% 4%;
}
</style>
