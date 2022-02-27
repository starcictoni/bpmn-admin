<template>
    <v-card>
        <v-card-title class="text-h5">
            Add New form field
        </v-card-title>
        <v-card-text>
            <v-form>
                <v-container>
                    <v-text-field v-model="data1.id" label="Id" filled dense></v-text-field>
                    <v-textarea v-model="data1.label" label="Label" filled dense></v-textarea>
                    <v-select v-model="data1.type" :items="types" item-value="type" item-text="name" label="Item type">
                        <template v-slot:item="{ item }">
                            <v-list-item-icon>
                                <v-icon v-text="item.icon"></v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title v-text="item.name"></v-list-item-title>
                            </v-list-item-content>
                        </template>
                    </v-select>
                </v-container>
            </v-form>
        </v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="$emit('close')">
                Close
            </v-btn>
            <v-btn color="blue darken-1" text @click="sendResults">
                Apply
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
<script>
import { FormItemMetaModel } from '@/utils/bpmn';
export default {
    name: 'properties-new-form-item',
    props: ['data1', 'context1'],
    data() {
        return {
            type: null,
            originalData: null,
            types: Object.values(FormItemMetaModel),
            modeler: this.context1.modeler,
        };
    },
    watch: {
        data: function() {
            this.debug();
        },
    },
    methods: {
        sendResults() {
            this.$emit('send-results', 'data1');
        },
    },
    mounted() {
        debugger;
        console.log("yes yes!")
    }
};
</script>
