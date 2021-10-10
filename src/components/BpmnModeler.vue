<template>
    <div ref="container" class="vue-bpmn-modeler-container"></div>
</template>

<script>
import BpmnModeler from 'bpmn-js/dist/bpmn-modeler.production.min.js';

import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';

export default {
    name: 'vue-bpmn-modeler',
    props: {
        url: {
            type: String,
            required: true,
        },
        options: {
            type: Object,
        },
    },
    data: function() {
        return {
            diagramXML: null,
        };
    },
    mounted: function() {
        var container = this.$refs.container;

        var self = this;
        var _options = Object.assign(
            {
                container: container,
            },
            this.options
        );
        this.BpmnModeler = new BpmnModeler(_options);

        this.BpmnModeler.on('import.done', function(event) {
            var error = event.error;
            var warnings = event.warnings;

            if (error) {
                self.$emit('error', error);
            } else {
                self.$emit('shown', warnings);
            }

            self.BpmnModeler.get('canvas').zoom('fit-viewport');
        });

        if (this.url) {
            this.fetchDiagram(this.url);
        }
    },
    beforeDestroy: function() {
        this.BpmnModeler.destroy();
    },
    watch: {
        url: function(val) {
            this.$emit('loading');
            this.fetchDiagram(val);
        },
        diagramXML: function(val) {
            this.BpmnModeler.importXML(val);
        },
    },
    methods: {
        fetchDiagram: function(url) {
            var self = this;

            fetch(url)
                .then(function(response) {
                    return response.text();
                })
                .then(function(text) {
                    self.diagramXML = text;
                })
                .catch(function(err) {
                    self.$emit('error', err);
                });
        },
    },
};
</script>

<style>
.vue-bpmn-modeler-container {
    height: 100%;
    width: 100%;
}
</style>
