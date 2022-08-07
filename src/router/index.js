import Vue from 'vue';
import VueRouter from 'vue-router';
import Environment from '../views/Environment.vue'
import Editor from '../views/Editor.vue';
import Viewer from '../views/Viewer.vue'
import Service from '../views/Service.vue'
import Processes from '../views/Processes.vue';

Vue.use(VueRouter);

const routes = [
    {
        path: '/environment',
        name: 'environment',
        component: Environment,
    },
    {
        path: '/processes',
        name: 'processes',
        component: Processes,
    },
    {
        path: '/editor/:type/:id',
        name: 'editor',
        component: Editor,
        props: true,
    },
    {
        path: '/viewer/:type/:id',
        name: 'viewer',
        component: Viewer,
        props: true
    },
    {
        path: '/services',
        name: 'service',
        component: Service
    },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

export default router;
