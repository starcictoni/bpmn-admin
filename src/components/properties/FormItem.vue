<template>
    <v-card>
        <v-card-title class="text-h5">
            Edit form field
        </v-card-title>

        <v-card-text>
            <v-form>
                <v-container>
                    <v-text-field v-model="data.id" label="Id" filled dense></v-text-field>
                    <v-textarea v-model="data.label" label="Label" filled dense></v-textarea>
                    <v-select v-model="data.type" :items="types" item-value="type" item-text="name" label="Item type">
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
            <v-btn color="blue darken-1" text @click="$emit('save')">
                Apply
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
<script>
import { FormItemMetaModel } from '@/utils/bpmn';
export default {
    name: 'properties-form-item',
    props: ['data', 'context'],
    data() {
        return {
            type: null,
            originalData: null,
            types: Object.values(FormItemMetaModel),
            modeler: this.context.modeler,
        };
    },
};
</script>
