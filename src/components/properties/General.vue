<template>
	<div>
		<v-form ref="generalInformation">
			<v-text-field
				class="input-remove-border"
				height="10"
				:rules="[rules.notEmpty]"
				label="ID"
				outlined
				dense
				clearable
				v-model="state.id"
			></v-text-field>
			<v-text-field
				class="input-remove-border input-top-negative-margin"
				label="Name"
				height="10"
				dense
				:rules="[rules.notEmpty]"
				outlined
				clearable
				v-model="state.name"
			></v-text-field>
			<v-btn v-if="changed" color="darken-1" text @click="setState()">
				Cancel
			</v-btn>
			<v-btn v-if="changed" color="blue darken-1" text @click="save()">
				Apply
			</v-btn>
		</v-form>
	</div>
</template>
<script>
import * as common from "@/utils/common.js";
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
			rules: {
				notEmpty: (field) => {
					return common.isInputValid(field) || "Cannot be empty.";
				},
				extension: (filename) => {
					return common.isExtensionValid(filename) || "Invalid file extension name.";
				},
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
