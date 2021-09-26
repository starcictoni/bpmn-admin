<template>
    <v-container fluid>
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

export default {
    name: 'ProcessInstance',
    props: ['id'],
    components: {
        VueBpmn,
    },

    data: () => ({
        instance: null,
        model_url: process.env.VUE_APP_BPMN_SERVER + '/model',
        options: {
            height: 280,
        },
    }),

    async mounted() {
        this.instance = await ProcessInstance.get(this.id);
    },

    methods: {
        onShown() {
            let viewer = this.$refs.bpmn.bpmnViewer;
            var canvas = viewer.get('canvas');

            console.log(canvas);
            for (let next_task of this.instance.pending) {
                canvas.addMarker(next_task, 'highlight');
            }
        },
    },
};
</script>
<style>
.vue-bpmn-diagram-container {
    background: lightgray;
    height: 280px;
}
.highlight:not(.djs-connection) .djs-visual > :nth-child(1) {
    fill: yellow !important; /* color elements as green */
}
</style>
