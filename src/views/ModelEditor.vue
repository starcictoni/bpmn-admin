<template>
    <v-container fluid v-if="model_url">
        <v-layout row wrap>
            <v-flex xs12 sm8 mt-3>
                <v-btn mr-3 @click="save()" elevation="2">Save</v-btn>
                <v-btn mr-3 @click="undo()" elevation="2">Undo</v-btn>
                <v-btn @click="test()" elevation="2">Test change</v-btn>
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
                                <component
                                    :is="p.module"
                                    :data="propertyData"
                                    :context="{ modeler, bpmnElement }"
                                ></component>
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
import { UpdateBusinessObjectHandler, UpdateBusinessObjectListHandler, MultiCommandHandler } from '@/utils/handlers';
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
        bpmnElement: null,
        propertyData: {
            formData: {},
        },
    }),

    async mounted() {
        this.model_path = this.id;
        this.model_url = process.env.VUE_APP_BPMN_SERVER + '/model/' + this.model_path;
    },

    methods: {
        updatePanels() {
            let bpmnObject = this.bpmnElement.businessObject;
            let formData = BpmnXml.getExtension(bpmnObject, 'camunda:formData');
            if (formData) {
                this.panels.form.visible = true;
            }
            this.panels.general.visible = true;
        },
        setPropertyData() {
            if (!this.bpmnElement) return;

            let bpmnObject = this.bpmnElement.businessObject;

            this.propertyData = {
                id: bpmnObject.id,
                name: bpmnObject.name,
                //$bpmn: bpmnObject,
            };
            var canvas = this.modeler.get('canvas');

            if (bpmnObject.$type != 'bpmn:Collaboration') canvas.addMarker(this.propertyData.id, 'highlight');

            let formData = BpmnXml.getExtension(bpmnObject, 'camunda:formData');
            if (formData) {
                this.propertyData.formData = formData;
                window.propertyData = this.propertyData;
            }
        },
        undo() {
            this.modeler.get('commandStack').undo();
        },
        save() {
            let modeling = this.modeler.get('modeling');
            let moddle = this.modeler.get('moddle');
            let formData = BpmnXml.getExtension(this.bpmnElement.businessObject, 'camunda:formData');
            if (formData) {
                this.propertyData.extensionElements = moddle.create('bpmn:ExtensionElements');
                this.propertyData.extensionElements.get('values').push(formData);
                delete this.propertyData.formData;
            }
            modeling.updateProperties(this.bpmnElement, this.propertyData);

            this.setPropertyData();
        },
        async test() {
            let modeling = this.modeler.get('modeling');
            let moddle = this.modeler.get('moddle');
            let elementRegistry = this.modeler.get('elementRegistry');
            let bpmnFactory = this.modeler.get('bpmnFactory');
            let e = elementRegistry.get('odabiranje_zadatka_student');
            this.bpmnElement = e;

            let formData = BpmnXml.getExtension(e.businessObject, 'camunda:formData');

            //let extensionElements;
            // if (formData) {
            //     extensionElements = moddle.create('bpmn:ExtensionElements');
            //     extensionElements.get('values').push(formData);
            // }
            //modeling.updateProperties(e, { extensionElements });
            modeling;
            bpmnFactory;
            moddle;

            let cs = this.modeler.get('commandStack');
            cs.execute('bpmn-update', {
                element: e,
                businessObject: formData.$children[0],
                properties: { label: 'NEW LABEL!' },
                //oldProperties: { label: 'asdfasdf' },
            });
        },
        async onShown() {
            this.modeler = this.$refs.bpmn.BpmnModeler;
            var eventBus = this.modeler.get('eventBus');
            var commandStack = this.modeler.get('commandStack');
            window.commandStack = commandStack;

            commandStack.registerHandler('bpmn-update', UpdateBusinessObjectHandler);
            commandStack.registerHandler('bpmn-list-update', UpdateBusinessObjectListHandler);
            commandStack.registerHandler('bpmn-multi-update', MultiCommandHandler);

            eventBus.on('commandStack.changed', () => {
                this.setPropertyData();
            });
            eventBus.on('element.hover', () => {});
            eventBus.on('element.out', () => {});
            eventBus.on('element.click', (e) => {
                this.resetPanels();
                this.bpmnElement = e.element;
                this.setPropertyData();
                this.updatePanels();
            });
        },
        resetPanels() {
            var canvas = this.modeler.get('canvas');

            if (this.propertyData && this.propertyData.id) {
                canvas.removeMarker(this.propertyData.id, 'highlight');
            }
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
