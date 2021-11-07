<template>
    <div v-if="this.data">
        <v-list>
            <v-subheader>FIELDS</v-subheader>
            <draggable v-model="state" draggable=".v-list-item" v-bind="{ animation: 200 }">
                <v-list-item v-for="c in state" :key="c.id">
                    <v-list-item-icon>
                        <v-icon>{{ getIconFor(c.type) }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title v-text="c.id"></v-list-item-title>
                        <v-list-item-subtitle v-text="c.label"></v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                        <v-btn icon @click.stop="open(c)">
                            <v-icon color="grey lighten-1">mdi-pencil</v-icon>
                        </v-btn>
                    </v-list-item-action>
                </v-list-item>
            </draggable>
        </v-list>
        <v-btn v-if="changed" color="darken-1" text @click="setState()">
            Cancel
        </v-btn>
        <v-btn v-if="changed" color="blue darken-1" text @click="save()">
            Apply
        </v-btn>

        <v-dialog v-model="dialogShown" max-width="600">
            <form-item ref="formItem" :data="formItem" @close="closeDialog()" :context="context"></form-item>
        </v-dialog>
    </div>
</template>
<script>
import { FormItemMetaModel } from '@/utils/bpmn';
import draggable from 'vuedraggable';

export default {
    name: 'properties-form',
    props: ['data', 'context'],
    created() {
        this.setState();
    },
    data() {
        let modeler = this.context.modeler;
        return {
            modeler,
            selectedItem: null,
            dialogShown: false,
            formItem: null,
            cs: modeler.get('commandStack'),
            state: [],
        };
    },
    watch: {
        data: function() {
            this.setState();
        },
    },
    computed: {
        changed() {
            let state = this.state.reduce((a, x) => a + ';' + x.id, '');
            let data = this.data.formData.$children.reduce((a, x) => a + ';' + x.id, '');
            return state != data;
        },
    },
    methods: {
        setState() {
            let fields = [];
            for (let formItem of this.data.formData.$children) {
                let field = {
                    $bpmn: formItem,
                    id: formItem.id,
                    label: formItem.label,
                    type: formItem.type,
                    validation: {
                        required: false,
                    },
                };
                if (formItem.$children) {
                    for (let child of formItem.$children) {
                        switch (child.$type) {
                            case 'camunda:properties':
                                // console.log('properties', child.$children);
                                break;
                            case 'camunda:validation':
                                // console.log('validation', child.$children);
                                break;
                            // TODO, finish parsing this
                        }
                    }
                }
                fields.push(field);
            }
            this.state = fields;
        },
        open(formItem) {
            this.formItem = formItem.$bpmn;
            this.dialogShown = true;
            if (this.$refs.formItem) this.$refs.formItem.setState();
        },
        closeDialog() {
            this.dialogShown = false;
        },
        getIconFor(type) {
            return FormItemMetaModel[type].icon;
        },
        save() {
            let values = this.state.map((x) => x.$bpmn);

            let cs = this.modeler.get('commandStack');
            cs.execute('bpmn-list-update', {
                element: this.context.bpmnElement,
                currentObject: this.data.formData,
                propertyName: '$children',
                updatedObjectList: values,
            });
        },
    },
    components: { draggable, formItem: () => import('@/components/properties/FormItem.vue') },
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
