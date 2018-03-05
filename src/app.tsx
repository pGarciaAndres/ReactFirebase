import * as React from 'react';
import * as firebase from 'firebase';
import { Header, Footer, Home } from './components/index';
const classNames = require('./app.css');

interface Props {}

interface State {
  user: Object;
}

export const App: React.StatelessComponent<{}> = (props) => {
    return (
      <div className={classNames.app}>
        <Header />
        {props.children}
        <Footer />
      </div>
    );
}