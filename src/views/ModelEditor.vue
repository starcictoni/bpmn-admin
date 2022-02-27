<template>
    <v-container fluid v-if="model_url">
        <v-layout col row wrap>
            <v-flex xs12 sm12 mt-1>
                <!-- <v-btn mr-3 @click="save()" elevation="2">Save</v-btn>
                <v-btn mr-3 @click="undo()" elevation="2">Undo</v-btn>
                <v-btn @click="test()" elevation="2">Test change</v-btn>
                <br />
                <br /> -->
                <v-sheet width="100%" elevation="1">
                    <vue-bpmn-modeler
                        ref="bpmn"
                        :url="model_url"
                        :options="options"
                        v-on:shown="onShown"
                    ></vue-bpmn-modeler>
                </v-sheet>
            </v-flex>
        </v-layout>
        <v-layout col row wrap>
            <!-- <v-flex xs12 sm4 pa-3 pr-0> -->
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
            <!-- </v-flex> -->
        </v-layout>
    </v-container>
</template>

<script>
import { BpmnXml } from '@/utils/bpmn';
import { UpdateBusinessObjectHandler, UpdateBusinessObjectListHandler, MultiCommandHandler } from '@/utils/handlers';
import VueBpmnModeler from '@/components/BpmnModeler';
import SendAndService from '@/components/properties/SendAndService.vue'
import NewFormItemVue from '../components/properties/NewFormItem.vue';

export default {
    name: 'model-editor',
    props: ['id'],
    components: {
        VueBpmnModeler,
        propGeneral: () => import('@/components/properties/General.vue'),
        propForm: () => import('@/components/properties/Form.vue'),
        propSend: SendAndService,
        propNewForm: NewFormItemVue,
    },
    data: () => ({
        instance: null,
        promise: null,
        user_tasks_ids: new Set(),
        model_url: null,
        modeler: null,
        options: {
            height: 600,
        },
        panels: {
            general: {
                label: 'General Item',
                visible: false,
                module: 'propGeneral',
            },
            form: {
                label: 'User Form Task',
                visible: false,
                module: 'propForm',
            },
            sendAndService: {
                label: 'Send/Service Task',
                visible: false,
                module: 'propSend'
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
        updatePanels() { //Pokazi panele ispod ovisno o podacima
            //debugger;
            let bpmnObject = this.bpmnElement.businessObject;
            BpmnXml.showPanel(this.panels, bpmnObject.$type); //Shows the correct panel
            BpmnXml.setLabelOntoPanel(this.panels, bpmnObject.$type);
        },
        setPropertyData() {
            //debugger;
            let bpmnObject = this.bpmnElement.businessObject;
            let bpmnType = this.bpmnElement.businessObject.$type;
            if(bpmnType == "bpmn:Collaboration") {
                console.log("Collaboration")
                //id
                //participants[0].$type
                //participants[0].id
                //participants[0].name
            }
            else if(bpmnType == "bpmn:Lane") {
                //id
                //name
                console.log("Lane")
            }
            else if(bpmnType == "bpmn:UserTask") {
                //id
                //name
                //extensionElements
                //documentation
                console.log("UserTask")
            }
            else if(bpmnType == "bpmn:ServiceTask") {
                //id
                //name
                //extensionElements
                console.log("ServiceTask")
            }
            else if(bpmnType == "bpmn:SendTask") {
                //id
                //name
                //extensionElements
                console.log("SendTask")
            }
            else if(bpmnType == "bpmn:ManualTask") {
                //id
                //name
                console.log("ManualTask")
            }
            else if(bpmnType == "bpmn:StartEvent") {
                //id
                //name
                console.log("StartEvent")
            }
            else if(bpmnType == "bpmn:EndEvent") {
                //id
                //name
                console.log("EndEvent")
            }
            else if(bpmnType == "bpmn:SequenceFlow") {
                console.log("SequenceFlow")
                //id 
                //name
                if(bpmnObject.conditionExpression != null && bpmnObject.conditionExpression.$type == "bpmn:FormalExpression") {
                    console.log("FormalExpression")
                    //bpmnObject.conditionExpression.body = body -> string kao i ime
                }
                else {
                    console.log("BezFormalExpressiona")
                }
            }
            else if(bpmnType == "bpmn:ExclusiveGateway") {
                //id
                //name
                console.log("ExclusiveGateway")
            }
            else if(bpmnType == "bpmn:ParallelGateway") {
                //id
                console.log("ParallelGateway")
            }
            else {
                console.log("Something else")
            }

            // let basicData = BpmnXml.getPropertyData();
            // console.log(basicData);
            let formData = null;
            if(bpmnType != undefined) {
                formData = BpmnXml.getExtension(bpmnObject, bpmnType); //ExtensionData je mozda tocnije od form data
            }
            //Property data se šalje kao props u komponente, dodan bpmn kako bi se razlikovali tipovi - Mozda samo bpmnObject.$type?
            this.propertyData = {
                id: bpmnObject.id,
                name: bpmnObject.name,
                bpmn: bpmnObject,
            };
            if (formData) {
                window.propertyData = this.propertyData; 
                this.propertyData.formData = formData; //ExtensionData je mozda tocnije od form data

            }
        },
        undo() {
            this.modeler.get('commandStack').undo();
            this.setPropertyData();
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
            eventBus.on('element.hover', (e) => {
                this.bpmnElement = e.element;
            });
            eventBus.on('element.out', () => {});
            eventBus.on('element.click', (e) => {
                this.resetPanels();
                this.bpmnElement = e.element;
                this.setPropertyData();
                this.updatePanels();
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
    height: 600px;
}

</style>
