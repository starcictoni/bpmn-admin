<template>
    <!-- App.vue -->

    <v-app>
        <v-navigation-drawer app>
            <!-- -->
        </v-navigation-drawer>

        <v-app-bar app>
            <v-app-bar-title>
                <router-link to="/" custom v-slot="{ navigate }" style="cursor: pointer">
                    <span @click="navigate">Python BPMN engine Admin v1.0</span>
                </router-link>
            </v-app-bar-title>
        </v-app-bar>

        <!-- Sizes your content based upon application components -->
        <v-main>
            <!-- Provides the application the proper gutter -->
            <v-container fluid>
                <!-- If using vue-router -->
                <router-view></router-view>
            </v-container>
        </v-main>

        <v-footer app>
            <!-- -->
        </v-footer>
    </v-app>
</template>

<script>
export default {
    name: 'App',

    components: {},

    data: () => ({
        //
    }),
};
</script>
<style lang="scss">
.bjs-container .highlight:not(.djs-connection) .djs-visual > :nth-child(1) {
    fill: yellow !important; /* color elements as green */
}
</style>
