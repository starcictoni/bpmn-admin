<template>
    <div>
        <v-data-table
            :loading="loading"
            loading-text="Učitavam"
            :headers="headers"
            :items="models"
            :items-per-page="5"
            class="elevation-1"
        >
            <template v-slot:item.model_path="{ item }">
                <router-link :to="{ name: 'model-editor', params: { id: item.model_path } }">
                    {{ item.model_path }}
                </router-link>
            </template>
        </v-data-table>
    </div>
</template>
<script>
import { Model } from '@/services';

export default {
    name: 'Models',
    data() {
        return {
            models: [],
            loading: true,
            headers: [
                { text: 'File', value: 'model_path' },
                { text: 'Process Id', value: 'main_process.id' },
                { text: 'Process', value: 'main_process.name' },
                { text: 'Active instances', value: 'instances.length' },
                { text: 'Tasks', value: 'tasks.length' },
            ],
        };
    },
    async mounted() {
        let models = await Model.search();
        this.models = models;
        this.loading = false;
        console.log(models);
    },
};
</script>
