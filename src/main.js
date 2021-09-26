import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';

import router from './router';
import pv from './components/ProcessVariables.vue';

import 'vuetify/dist/vuetify.min.css';

Vue.config.productionTip = false;

Vue.component('process-variables', pv);

new Vue({
    vuetify,
    router,
    render: (h) => h(App),
}).$mount('#app');
