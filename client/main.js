import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import Layout from './js/components/common/Layout';
import HomePage from './js/components/home/HomePage';
import SliderPage from './js/components/slider/SliderPage';
import BoxPage from './js/components/box/BoxPage';

const routes = {
    path: '/',
    component: Layout,
    indexRoute: { component: HomePage },
    childRoutes: [
        { path: 'slider', component: SliderPage },
        { path: 'box', component: BoxPage }
    ]
};
ReactDOM.render(<Router history={browserHistory} routes={routes} />, document.getElementById('main'));