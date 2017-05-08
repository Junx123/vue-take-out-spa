import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import App from './App';
import goods from 'components/goods/goods.vue';
import seller from 'components/seller/seller.vue';
import ratings from 'components/ratings/ratings.vue';

import './common/stylus/index.styl';

Vue.use(VueRouter);
Vue.use(VueResource);

window.bus = new Vue();

const routes = [
    {path: '/goods', component: goods},
    {path: '/ratings', component: ratings},
    {path: '/seller', component: seller}
];

const router = new VueRouter({
    routes,
    linkActiveClass: 'active'
});

/* eslint-disable */
new Vue({
    el: '#app',
    router,
    render: h => h(App)
});
/* eslint-disable */