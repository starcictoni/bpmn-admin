<template>
    <!-- TODO: Save state to Collab and SeqFlow -->
    <!-- Lane(id, name); ManualTask(id, name); StartEvent(id, name); EndEvent(id, name); ExclusiveGateway(id, name); Participant(id, name); -->
    <!-- Collaboration(id, participants[0].id, participants[0].name); ParallelGateway(id, name? - CamModeler ima field za name); -->
    <!-- SequenceFlow(id, name, ?conditionExpression.$type == bpmn:FormalExpression - body) -->
    <v-form>
        <v-text-field v-model="state.id" label="Id" filled dense></v-text-field>
        <v-text-field v-model="state.name" label="Name" filled dense></v-text-field>
        <v-text-field v-show="showBody" v-model="state.body" label="Body" filled dense></v-text-field>
        <v-btn v-if="changed" color="blue darken-1" text @click="save()"> Apply </v-btn>
        <v-btn v-if="changed" color="red darken-1" text @click="setState()"> Cancel </v-btn>
    </v-form>
</template>
<script>
export default {
    name: 'properties-general',
    props: ['data', 'context'],
    created() {
        this.setState();
    },
    data() {
        let modeler = this.context.modeler;
        return {
            modeler: modeler,
            showBody: false,
            state: {
                id: null,
                name: null,
                body: null,
            },
            cs: modeler.get('commandStack'),
        };
    },
    watch: {
        data() {
            this.setState();
        },
    },
    computed: {
        changed() {
            debugger;
            let bpmnType = this.data.bpmn.$type || undefined;
            for (let att in this.state) {
                //Collaboration
                if(bpmnType != undefined && bpmnType == "bpmn:Collaboration") {
                    if(this.state[att] != this.data.bpmn.participants[0][att]) {
                        return true;
                    }
                    // else {
                    //     return false;
                    // }
                }
                //Sequence Flow
                else if(bpmnType != undefined && bpmnType == "bpmn:SequenceFlow") {
                    //Strange behaviour id-name
                    if(this.state?.body != this.data.bpmn?.conditionExpression?.body) {
                        return true;
                    }
                    else if(this.state['id'] != this.data['id']) {
                        return true;
                    }
                    else if(this.state['name'] != this.data['name']) {
                        return true;
                    }
                    // else {
                    //     return false;
                    // }
                }
                //Everything else
                else {
                    if (this.state[att] != this.data[att]) {
                        return true;
                    }
                    // else {
                    //     return false;
                    // }
                }
            }
            return false;
        },
    },
    methods: {
        setState() {
            let bpmnType = this.data.bpmn.$type || undefined;
            this.showBody = false;
            for (let att in this.state) {
                //Collaboration
                if(bpmnType != undefined && bpmnType == "bpmn:Collaboration") {
                    this.state[att] = this.data.bpmn.participants[0][att];
                }
                //Sequence Flow
                else if(bpmnType != undefined && bpmnType == "bpmn:SequenceFlow") {
                    //Condition Expression
                    if(this.data.bpmn.conditionExpression != undefined && att == "body") {
                        this.state[att] = this.data.bpmn.conditionExpression.body;
                        this.showBody = true;
                    }
                    else {
                        this.state[att] = this.data[att];
                    }
                }
                //Everything else
                else {
                    this.state[att] = this.data[att];
                }
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
                            businessObject: this.context.bpmnElement.businessObject,
                            properties: { [att]: this.state[att] },
                        },
                    });
                }
            }
            this.cs.execute('bpmn-multi-update', updates);
        },
    },
};
</script>
