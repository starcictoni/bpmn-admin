<template>
    <v-card>
        <v-card-title class="text-h5">
            Edit form field
        </v-card-title>

        <v-card-text>
            <v-form>
                <v-text-field v-model="data.id" label="Id" outlined dense></v-text-field>
                <v-textarea v-model="data.label" label="Label" outlined dense></v-textarea>
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
            </v-form>
        </v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="$emit('close')">
                Close
            </v-btn>
            <!-- <v-btn color="blue darken-1" text @click="$emit('cancel')">
                Apply
            </v-btn> -->
        </v-card-actions>
    </v-card>
</template>
<script>
import { FormItemMetaModel } from '@/utils/bpmn';
export default {
    name: 'properties-form-item',
    props: ['data'],
    data() {
        return {
            type: null,
            originalData: null,
            types: Object.values(FormItemMetaModel),
        };
    },
};
</script>
