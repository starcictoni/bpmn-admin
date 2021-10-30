<template>
    <v-container fluid v-if="model_url">
        <v-layout row wrap>
            <v-flex xs12 sm8 mt-3>
                <v-btn @click="test()" elevation="2">Import</v-btn>
                <v-btn @click="testPanel = 'propForm'" elevation="2">Save</v-btn>
                {{ selectedElement }}
                <br />
                <br />
                <vue-bpmn-modeler
                    ref="bpmn"
                    :url="model_url"
                    :options="options"
                    v-on:shown="onShown"
                ></vue-bpmn-modeler>
            </v-flex>
            <v-flex xs12 sm4 pa-3 pr-0>
                <v-expansion-panels accordion>
                    <v-expansion-panel v-for="p in panels" :key="p.label">
                        <div v-if="p.visible">
                            <v-expansion-panel-header>
                                {{ p.label }}
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <component :is="p.module" :data="propertyData"></component>
                            </v-expansion-panel-content>
                        </div>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import { BpmnXml } from '@/utils/bpmn';
import VueBpmnModeler from '@/components/BpmnModeler';

export default {
    name: 'model-editor',
    props: ['id'],
    components: {
        VueBpmnModeler,
        propGeneral: () => import('@/components/properties/General.vue'),
        propForm: () => import('@/components/properties/Form.vue'),
    },

    data: () => ({
        instance: null,
        promise: null,
        user_tasks_ids: new Set(),
        model_url: null,
        modeler: null,
        options: {
            height: 800,
        },
        selectedElement: '',
        panels: {
            general: {
                label: 'General',
                visible: false,
                module: 'propGeneral',
            },
            form: {
                label: 'Form',
                visible: false,
                module: 'propForm',
            },
        },
        bpmnObject: null,
        propertyData: {
            formData: {},
        },
    }),

    async mounted() {
        this.model_path = this.id;
        this.model_url = process.env.VUE_APP_BPMN_SERVER + '/model/' + this.model_path;
    },

    methods: {
        async test() {
            let elementRegistry = this.modeler.get('elementRegistry');
            let modeling = this.modeler.get('modeling');

            let e = elementRegistry.get('Activity_0bms7wc');
            modeling.updateProperties(e, { name: 'Foo' });
        },
        async onShown() {
            this.modeler = this.$refs.bpmn.BpmnModeler;
            var eventBus = this.modeler.get('eventBus');

            eventBus.on('element.hover', (e) => {
                let bpmn_object = e.element.businessObject;
                let task_id = bpmn_object.id;
                this.selectedElement = task_id;
            });
            eventBus.on('element.out', () => {
                this.selectedElement = '';
            });
            eventBus.on('element.click', (e) => {
                this.resetPanels();
                this.bpmnObject = e.element.businessObject;
                this.propertyData.id = this.bpmnObject.id;
                this.propertyData.name = this.bpmnObject.name;
                let formData = BpmnXml.getExtension(this.bpmnObject, 'camunda:formData');
                if (formData) {
                    this.propertyData.formData = formData;
                    this.panels.form.visible = true;
                }
                this.panels.general.visible = true;
            });
        },
        resetPanels() {
            for (let p in this.panels) {
                this.panels[p].visible = false;
            }
            this.propertyData = {};
        },
        onDataUpdate(event) {
            console.log('DATA', event);
        },
    },
};
</script>
<style scoped>
.vue-bpmn-modeler-container {
    background: lightgray;
    height: 800px;
}
</style>
