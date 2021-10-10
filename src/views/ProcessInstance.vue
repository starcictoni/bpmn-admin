<template>
    <v-container fluid v-if="model_url">
        <v-layout row wrap>
            <v-flex xs12 sm9 offset-sm1 mt-3>
                <vue-bpmn ref="bpmn" :url="model_url" :options="options" v-on:shown="onShown"></vue-bpmn>
                <v-card elevation="2" v-if="instance">
                    <v-card-title>{{ instance.model.model_path }}</v-card-title>
                    <v-card-subtitle>{{ instance.id }}</v-card-subtitle>
                    <v-card-text>
                        <process-variables :variables="instance.variables" />
                    </v-card-text>
                    <v-card-actions></v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import { ProcessInstance } from '@/services';
import VueBpmn from 'vue-bpmn';
//import VueBpmnModeler from '@/components/BpmnModeler';

export default {
    name: 'ProcessInstance',
    props: ['id'],
    components: {
        VueBpmn,
        //VueBpmnModeler,
    },

    data: () => ({
        instance: null,
        promise: null,
        user_tasks_ids: new Set(),
        model_url: null,
        options: {
            height: 280,
        },
    }),

    async mounted() {
        this.promise = ProcessInstance.get(this.id);
        this.instance = await this.promise;

        await this.promise;

        this.model_url = process.env.VUE_APP_BPMN_SERVER + '/model/' + this.instance.model.model_path;
    },

    methods: {
        async onShown() {
            await this.promise;
            let viewer = this.$refs.bpmn.bpmnViewer;
            var canvas = viewer.get('canvas');

            for (let next_task of this.instance.pending) {
                canvas.addMarker(next_task, 'highlight');
            }

            for (let task of this.instance.model.tasks) {
                this.user_tasks_ids.add(task._id);
                canvas.addMarker(task._id, 'user_task');
            }

            var eventBus = viewer.get('eventBus');

            eventBus.on('element.click', (e) => {
                let bpmn_object = e.element.businessObject;
                let task_id = bpmn_object.id;
                if (this.user_tasks_ids.has(task_id)) {
                    window.open(`${this.instance.env._frontend_url}/form/${this.instance.id}/${task_id}`, '_blank');
                }
            });
        },
    },
};
</script>
<style scoped>
.vue-bpmn-diagram-container {
    background: lightgray;
    height: 280px;
}
</style>
