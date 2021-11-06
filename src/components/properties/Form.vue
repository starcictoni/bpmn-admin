<template>
    <div v-if="this.data">
        <v-list>
            <v-subheader>FIELDS</v-subheader>
            <draggable v-model="data.formData.$children" draggable=".v-list-item" v-bind="{ animation: 200 }">
                <v-list-item v-for="c in data.formData.$children" :key="c.id">
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
    props: ['data', 'context'],
    data() {
        let modeler = this.context.modeler;
        return {
            modeler,
            selectedItem: null,
            dialogShown: false,
            formItem: null,
            cs: modeler.get('commandStack'),
        };
    },
    methods: {
        open(formItem) {
            this.formItem = formItem;
            this.dialogShown = true;
        },
        getIconFor(type) {
            return FormItemMetaModel[type].icon;
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
