import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import SearchInstances from '../views/SearchInstances.vue';
import ModelEditor from '../views/ModelEditor.vue';
import ProcessInstance from '../views/ProcessInstance.vue';
import Models from '../views/Models.vue';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home,
    },
    {
        path: '/models',
        name: 'models',
        component: Models,
    },
    {
        path: '/models/:id',
        name: 'model-editor',
        component: ModelEditor,
        props: true,
    },
    {
        path: '/instances/:id',
        name: 'instance',
        component: ProcessInstance,
        props: true,
    },
    {
        path: '/instances',
        name: 'instances',
        component: SearchInstances,
    },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

export default router;
