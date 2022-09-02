<template>
	<v-snackbar timeout="3000" elevation="0" multi-line v-model="show" :color="color" tile>
		<div class="snackbar-frame">
			<div class="snackbar-text" v-text="text"></div>
		</div>
		<template v-slot:action="{ attrs }">
			<v-btn class="border" tile color="white" text v-bind="attrs" @click="show = false">
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
<style>
.snackbar-text {
	font-size: 16px !important;
	font-weight: 500 !important;
	text-transform: uppercase !important;
	/* margin: 3% 0%; */
	padding: 1% 3%;
}
.snackbar-frame {
	margin-left: 5%;
	/* border: 1px solid white; */
	display: flex;
	justify-content: center;
	align-items: center;
}
.border {
	border: 1px solid white;
}
</style>
