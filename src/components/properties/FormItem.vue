<template>
    <v-card>
        <v-card-title class="text-h5">
            Edit form field
        </v-card-title>

        <v-card-text>
            <v-form>
                <v-container>
                    <v-text-field v-model="state.id" label="Id" filled dense></v-text-field>
                    <v-textarea v-model="state.label" label="Label" filled dense></v-textarea>
                    <v-select v-model="state.type" :items="types" item-value="type" item-text="name" label="Item type">
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
            <v-btn v-if="changed" color="blue darken-1" text @click="save()">
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
    created() {
        this.setState();
    },
    watch: {
        data: function() {
            this.setState();
        },
    },
    data() {
        let modeler = this.context.modeler;
        return {
            type: null,
            originalData: null,
            types: Object.values(FormItemMetaModel),
            modeler: modeler,
            state: {
                id: null,
                label: null,
                type: null,
            },
            cs: modeler.get('commandStack'),
        };
    },
    computed: {
        changed() {
            for (let att in this.state) {
                if (this.state[att] != this.data[att]) return true;
            }

            return false;
        },
    },
    methods: {
        setState() {
            for (let att in this.state) {
                this.state[att] = this.data[att];
            }
        },
        save() {
            let updates = [];
            for (let att in this.state) {
                if (this.state[att] != this.data[att]) {
                    updates.push({
                        cmd: 'bpmn-update',
                        context: {
                            element: this.context.bpmnElement,
                            businessObject: this.data,
                            properties: { [att]: this.state[att] },
                        },
                    });
                }
            }
            this.cs.execute('bpmn-multi-update', updates);

            this.$emit('close');
        },
    },
};
</script>
