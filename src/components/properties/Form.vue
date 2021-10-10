<template>
    <div v-if="this.data">
        <v-list dense>
            <v-subheader>FIELDS</v-subheader>
            <draggable v-model="data.formData.$children" draggable=".v-list-item" v-bind="{ animation: 200 }">
                <v-list-item v-for="c in data.formData.$children" :key="c.id">
                    <v-list-item-icon>
                        <v-icon>mdi-format-text-variant</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title v-text="c.id"></v-list-item-title>
                        <v-list-item-subtitle v-text="c.label"></v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                        <v-btn icon @click.stop="dialogShown = true">
                            <v-icon color="grey lighten-1">mdi-pencil</v-icon>
                        </v-btn>
                    </v-list-item-action>
                </v-list-item>
            </draggable>
        </v-list>

        <v-dialog v-model="dialogShown" max-width="290">
            <v-card>
                <v-card-title class="text-h5">
                    Use Google's location service?
                </v-card-title>

                <v-card-text>
                    Let Google help apps determine location. This means sending anonymous location data to Google, even
                    when no apps are running.
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn color="green darken-1" text @click="dialogShown = false">
                        Disagree
                    </v-btn>

                    <v-btn color="green darken-1" text @click="dialogShown = false">
                        Agree
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
import draggable from 'vuedraggable';

export default {
    name: 'properties-form',
    props: ['data'],
    data() {
        return {
            selectedItem: null,
            dialogShown: false,
        };
    },
    components: { draggable },
};
</script>
<style lang="scss" scoped>
.sortable-chosen {
    border: 1px solid gray !important;
}
.sortable-ghost {
    opacity: 0.2;
    background: #c8ebfb;
    text-shadow: 0 0 8px #000;
}
.v-list-item {
    cursor: move;
    border: 1px solid transparent;
}
</style>
