<template>
	<v-snackbar v-model="show" tile>
		{{ text }}
		<template v-slot:action="{ attrs }">
			<v-btn color="white" text v-bind="attrs" @click="snackbar = false">
				CLOSE
			</v-btn>
		</template>
	</v-snackbar>
</template>
<script>
export default {
	name: "Snackbar",
	props: ["show", "color", "text"],
	data() {
		return {};
	},
};
</script>
