import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as firebase from 'firebase';
import './index.css';
import { AppRouter } from './router';

//Firebase configuration
firebase.initializeApp({
    apiKey: "AIzaSyAvx2aAGLyy7fwebLHNakrUrarTVp-j-xw",
    authDomain: "reactfirebase-d23fe.firebaseapp.com",
    databaseURL: "https://reactfirebase-d23fe.firebaseio.com",
    projectId: "reactfirebase-d23fe",
    storageBucket: "reactfirebase-d23fe.appspot.com",
    messagingSenderId: "806980862354"
});

ReactDOM.render(<AppRouter />, document.getElementById('root'));
