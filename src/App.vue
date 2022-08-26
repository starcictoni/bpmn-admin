<template>
	<v-app class="background">
		<v-navigation-drawer class="nav-border" app floating permanent mini-variant expand-on-hover>
			<v-list>
				<v-list-item class="pl-2" two-line>
					<v-list-item-avatar>
						<img src="https://randomuser.me/api/portraits/lego/6.jpg" />
					</v-list-item-avatar>
					<v-list-item-content>
						<v-list-item-title>Administrator</v-list-item-title>
						<v-list-item-subtitle>admin@unipu.hr</v-list-item-subtitle>
					</v-list-item-content>
				</v-list-item>
			</v-list>
			<v-divider></v-divider>
			<v-list nav dense>
				<v-list-item link to="/processes">
					<v-list-item-icon>
						<v-icon>mdi-file</v-icon>
					</v-list-item-icon>
					<v-list-item-title>Models</v-list-item-title>
				</v-list-item>
				<v-list-item link to="/services">
					<v-list-item-icon>
						<v-icon>mdi-api</v-icon>
					</v-list-item-icon>
					<v-list-item-title>Services</v-list-item-title>
				</v-list-item>
				<v-list-item link @click="goToModeler()">
					<v-list-item-icon>
						<v-icon>mdi-yoga</v-icon>
					</v-list-item-icon>
					<v-list-item-title>Modeler</v-list-item-title>
				</v-list-item>
			</v-list>
			<template v-slot:append>
				<v-list-item>
					<v-list-item-action>
						<v-checkbox @change="changeTheme()"></v-checkbox>
					</v-list-item-action>
				</v-list-item>
			</template>
		</v-navigation-drawer>
		<v-main>
			<router-view :key="$route.fullPath"></router-view>
		</v-main>
	</v-app>
</template>

<script>
export default {
	name: "App",
	components: {},
	data() {
		return {};
	},
	methods: {
		changeTheme() {
			this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
			localStorage.setItem("theme", this.$vuetify.theme.dark ? "dark" : "light");
		},
		goToModeler() {
			if (this.$route.path != "/processes/new/-1" && this.$route.path != "/editor/new/-1") {
				this.$router.push({ name: "editor", params: { id: "-1", type: "definition" } });
			}
		},
	},
	beforeCreate() {},
	created() {},
	beforeMount() {},
	mounted() {},
	beforeUpdate() {},
	updated() {},
	beforeDestroy() {},
	destroyed() {},
};
</script>
<style lang="scss">
.bjs-container {
	.user_task:not(.djs-connection) {
		.djs-visual > :nth-child(1) {
			fill: lightgray !important;
		}

		cursor: pointer !important; /* color elements as green */
	}
	.highlight:not(.djs-connection) .djs-visual > :nth-child(1) {
		fill: yellow !important; /* color elements as green */
	}
}
.nav-border {
	border-right: 1px solid rgba(0, 0, 0, 0.12);
}
// .v-expansion-panel:not(:first-child)::after {
//     border-top: none !important;
// }
// .v-expansion-panel::after {
//     border-top: none !important;
// }
</style>
