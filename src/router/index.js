import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import SearchInstances from '../views/SearchInstances.vue';
import ProcessInstance from '../views/ProcessInstance.vue';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home,
    },
    {
        path: '/instances',
        name: 'instances',
        component: SearchInstances,
    },
    {
        path: '/instance/:id',
        name: 'instance',
        component: ProcessInstance,
        props: true,
    },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

export default router;
