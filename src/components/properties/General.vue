<template>
	<v-form>
		<v-text-field v-model="state.id" label="ID" outlined dense></v-text-field>
		<v-text-field v-model="state.name" label="Name" outlined dense></v-text-field>
		<v-btn v-if="changed" color="darken-1" text @click="setState()">
			Cancel
		</v-btn>
		<v-btn v-if="changed" color="blue darken-1" text @click="save()">
			Apply
		</v-btn>
	</v-form>
</template>
<script>
export default {
	name: "properties-general",
	props: ["data", "context"],
	created() {
		this.setState();
	},
	data() {
		let modeler = this.context.modeler;
		return {
			modeler: modeler,
			state: {
				id: null,
				name: null,
			},
			cs: modeler.get("commandStack"),
		};
	},
	watch: {
		data: function() {
			this.setState();
		},
	},
	computed: {
		changed() {
			for (let att in this.state) {
				if (this.state[att] != this.data[att]) return true;
			}

			return false;
		},
	},
	methods: {
		setState() {
			for (let att in this.state) {
				this.state[att] = this.data[att];
			}
		},
		save() {
			let updates = [];
			for (let att in this.state) {
				if (this.state[att] != this.data[att]) {
					updates.push({
						cmd: "bpmn-update",
						context: {
							element: this.context.bpmnElement,
							businessObject: this.context.bpmnElement.businessObject,
							properties: { [att]: this.state[att] },
						},
					});
				}
			}
			this.cs.execute("bpmn-multi-update", updates);
		},
	},
};
</script>
