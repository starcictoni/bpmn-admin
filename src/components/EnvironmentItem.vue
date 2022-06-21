<template>
	<div class="items">
		<div class="action-items-health">
			<v-icon :color="originalData.color" round>mdi-server</v-icon>
		</div>
		<div class="form-item">
			<v-text-field
				v-model="originalData.name"
				label="Name"
				dense
				required
				outlined
				:disabled="originalData.disabled"
			></v-text-field>
		</div>
		<div class="form-item">
			<v-text-field
				v-model="originalData.type"
				label="Type"
				dense
				required
				outlined
				:disabled="originalData.disabled"
			></v-text-field>
		</div>
		<div class="form-item">
			<v-text-field
				v-model="originalData.url"
				label="URL"
				dense
				required
				outlined
				:disabled="originalData.disabled"
			></v-text-field>
		</div>
		<div class="action-items">
			<v-btn ref="editButton" :outlined="!isEditClicked" @click="handleEditButtonOnClick(originalData)" icon>
				<v-icon>mdi-pencil</v-icon>
			</v-btn>
		</div>
		<div class="action-items">
			<v-btn ref="deleteButton" @click="handleDeleteButtonOnClick(originalData)" icon>
				<v-icon>mdi-delete</v-icon>
			</v-btn>
		</div>
	</div>
</template>

<script>
//import _ from 'lodash';
import Vue from "vue";
export default {
	name: "environment-item",
	props: ["field", "index"],
	data() {
		return {
			isEditClicked: false,
			originalData: null,
		};
	},
	watch: {
		changed(newValue, oldValue) {
			newValue
				? Vue.set(this.originalData, "changed", newValue)
				: Vue.set(this.originalData, "changed", newValue);
			this.$emit("fieldHasChanged", newValue, oldValue, this.originalData.id, this.originalData);
		},
	},
	computed: {
		changed() {
			for (let att in this.originalData) {
				if (att && att != "disabled" && att != "changed" && this.originalData[att] != this.field[att]) {
					return true;
				}
			}
			return false;
		},
	},
	created() {
		this.originalData = { ...this.field };
	},
	methods: {
		handleEditButtonOnClick(data) {
			this.isEditClicked = !this.isEditClicked;
			this.$emit("edit", data);
		},
		handleDeleteButtonOnClick(data) {
			this.$emit("delete", data);
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
.items {
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
}
.form-item {
	margin-left: 1%;
	margin-right: 1%;
	flex-grow: 1;
}
.action-items {
	margin-left: 1%;
}
.action-items-health {
	margin: 1% 1% 0% 1%;
}
.form-buttons {
	margin: 0% 4% 3% 0%;
}
.form-button {
	margin-left: 2% !important;
}
</style>
