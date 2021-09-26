<template>
    <v-simple-table>
        <thead>
            <tr>
                <th>Variable</th>
                <th>Value</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(v, k) in variables" v-bind:key="k">
                <td>
                    {{ k }}
                </td>
                <td>
                    {{ v }}
                </td>
            </tr>
        </tbody>
    </v-simple-table>
</template>
<script>
export default {
    name: 'Home',
    props: ['variables'],
};
</script>
