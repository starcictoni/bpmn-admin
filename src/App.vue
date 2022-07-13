<template>
	<!-- App.vue -->

	<v-app>
		<v-navigation-drawer app floating permanent mini-variant expand-on-hover>
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
				<!-- <v-list-item class="px-2">
                    <v-list-item-avatar>
                        <v-img src="https://randomuser.me/api/portraits/lego/5.jpg"></v-img >
                    </v-list-item-avatar>
                </v-list-item>

                <v-list-item link>
                    <v-list-item-content>
                        <v-list-item-title class="text-h6">
                            Administrator
                        </v-list-item-title>
                        <v-list-item-subtitle>admin@unipu.hr</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item> -->
				<!-- <template v-slot:append>
					<div class="pa-2">
						<v-btn block>
							Logout
						</v-btn>
					</div>
				</template> -->
			</v-list>
			<v-divider></v-divider>

			<v-list nav dense>
				<v-list-item link to="/models">
					<v-list-item-icon>
						<v-icon>mdi-folder</v-icon>
					</v-list-item-icon>
					<v-list-item-title>Models</v-list-item-title>
				</v-list-item>
				<v-list-item link to="/instances">
					<v-list-item-icon>
						<v-icon>mdi-text-search</v-icon>
					</v-list-item-icon>
					<v-list-item-title>Running instances</v-list-item-title>
				</v-list-item>

				<v-list-item link to="/environment">
					<v-list-item-icon>
						<v-icon>mdi-star</v-icon>
					</v-list-item-icon>
					<v-list-item-title>Environment</v-list-item-title>
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

		<!-- <v-app-bar app>
            <v-app-bar-title>
                <router-link to="/" custom v-slot="{ navigate }" style="cursor: pointer">
                    <span @click="navigate">Python BPMN engine Admin v1.0</span>
                </router-link>
            </v-app-bar-title>
        </v-app-bar> -->

		<!-- Sizes your content based upon application components -->
		<v-main>
			<!-- Provides the application the proper gutter -->

			<!-- If using vue-router -->
			<router-view></router-view>
		</v-main>

		<!-- <v-footer app>
        </v-footer> -->
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
// .v-expansion-panel:not(:first-child)::after {
//     border-top: none !important;
// }
// .v-expansion-panel::after {
//     border-top: none !important;
// }
</style>
