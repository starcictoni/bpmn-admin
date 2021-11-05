<template>
    <v-form>
        <v-text-field v-model="id" label="Id" filled dense></v-text-field>
        <v-text-field v-model="name" label="Name" filled dense></v-text-field>
        <v-btn v-if="changed" color="darken-1" text @click="revert()">
            Cancel
        </v-btn>
        <v-btn v-if="changed" color="blue darken-1" text @click="save()">
            Apply
        </v-btn>
    </v-form>
</template>
<script>
export default {
    name: 'properties-general',
    props: ['data', 'context'],
    created() {
        this.revert();
    },
    data() {
        let modeler = this.context.modeler;
        return {
            modeler: modeler,
            id: null,
            name: null,
            cs: modeler.get('commandStack'),
            attributes: ['id', 'name'],
        };
    },
    watch: {
        data: function() {
            this.revert();
        },
    },
    computed: {
        changed() {
            for (let att of this.attributes) {
                if (this[att] != this.data[att]) return true;
            }

            return false;
        },
    },
    methods: {
        revert() {
            for (let att of this.attributes) {
                this[att] = this.data[att];
            }
        },
        save() {
            let updates = [];
            console.log(this.id);
            for (let att of this.attributes) {
                if (this[att] != this.data[att]) {
                    updates.push({
                        cmd: 'bpmn-update',
                        context: {
                            element: this.context.bpmnElement,
                            businessObject: this.context.bpmnElement.businessObject,
                            properties: { [att]: this[att] },
                        },
                    });
                }
            }
            this.cs.execute('bpmn-multi-update', updates);
        },
    },
};
</script>
