import * as React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import { App } from './app';
import { Home, News, ImageGallery, Contact, About } from './components';

export const AppRouter: React.StatelessComponent<{}> = () => {
    return (
        <Router history={hashHistory}>
            <Route path="/" component={App}>
                <IndexRoute component={ImageGallery} />
                <Route path="/" component={ImageGallery} />
                <Route path="/home" component={Home} />
                <Route path="/news" component={News} />
                <Route path="/contact" component={Contact} />
                <Route path="/about" component={About} />
            </Route>
        </Router>
    );
}