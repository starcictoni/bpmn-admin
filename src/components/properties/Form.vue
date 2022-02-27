<template>
    <div v-if="this.data">
        <v-list>
            <!-- <v-subheader>FIELDS</v-subheader> -->
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
                        <v-btn icon @click.stop="open(c.$bpmn)">
                            <v-icon color="grey lighten-1">mdi-pencil</v-icon>
                        </v-btn>
                    </v-list-item-action>
                </v-list-item>
                
            </draggable>
        </v-list>
        <v-btn color="grey darken-4" tile text @click="add()"> ADD NEW </v-btn>
        <v-btn v-if="changed" color="darken-1" text @click="setState()">
            CANCEL
        </v-btn>
        <v-btn v-if="changed" color="blue darken-1" text @click="save()">
            APPLY
        </v-btn>

        <v-dialog v-model="dialogShown1" max-width="600">
            <new-form-item @send-results="save" :data1="newFormItem" @close="dialogShown1 = false" :context1="context"></new-form-item>
        </v-dialog>

        <v-dialog v-model="dialogShown" max-width="600">
            <form-item :data="formItem" @close="dialogShown = false" :context="context"></form-item>
        </v-dialog>
    </div>
</template>
<script>
import { FormItemMetaModel } from '@/utils/bpmn';
import draggable from 'vuedraggable';

export default {
    name: 'properties-form',
    props: ['data', 'context', 'data1', 'context1'],
    components: { 
        draggable, 
        formItem: () => import('@/components/properties/FormItem.vue') ,
        //newFormItem: () => import('@/components/properties/NewFormItem.vue')
        
        },
    created() {
        this.setState();
    },
    data() {
        let modeler = this.context.modeler;
        return {
            modeler,
            selectedItem: null,
            dialogShown: false,
            dialogShown1: false,
            formItem: null,
            newFormItem: null,
            cs: modeler.get('commandStack'),
            state: [],
        };
    },
    watch: {
        data: function() {
            //debugger;
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
            debugger;
            let fields = [];
            //UserTask
            if (this.data.formData.$type == "camunda:formData") {
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
                                case 'camunda:constraint':
                                    break;
                                // TODO, finish parsing this
                            }
                        }
                    }
                    fields.push(field);
                }
            }
            this.state = fields;
        },
        add() {
            this.newFormItem = {
                id: null,
                label: null,
                type: null,
                validation: null,
            }
            this.dialogShown1 = true;
        },

        open(formItem) {
            debugger;
            this.formItem = formItem;
            this.dialogShown = true;
        },
        getIconFor(type) {
            // debugger;
            // console.log(FormItemMetaModel) -> model_01.bpmn -> param type is long?
            return FormItemMetaModel[type].icon;
        },
        save() {
            debugger;
            let temp = {}
            if(this.newFormItem != null) {
                if(this.newFormItem.validation == null) {
                    this.newFormItem.validation = false;
                }
                temp = {
                    $bpmn: this.newFormItem,
                    id: this.newFormItem.id,
                    label: this.newFormItem.label,
                    type: this.newFormItem.type,
                    icon: this.getIconFor(this.newFormItem.type),
                    validation:  {
                        required: this.newFormItem.validation,
                    },

                }
                this.state.push(temp)
            }
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
