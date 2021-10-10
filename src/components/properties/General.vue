<template>
    <v-form>
        <v-text-field v-model="data.id" label="Id" outlined dense></v-text-field>
        <v-text-field v-model="data.name" label="Name" outlined dense></v-text-field>
    </v-form>
</template>
<script>
export default {
    name: 'properties-general',
    props: ['data'],
};
</script>
