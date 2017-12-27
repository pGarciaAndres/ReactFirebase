import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

//Firebase configuration
firebase.initializeApp({
    apiKey: "AIzaSyAvx2aAGLyy7fwebLHNakrUrarTVp-j-xw",
    authDomain: "reactfirebase-d23fe.firebaseapp.com",
    databaseURL: "https://reactfirebase-d23fe.firebaseio.com",
    projectId: "reactfirebase-d23fe",
    storageBucket: "reactfirebase-d23fe.appspot.com",
    messagingSenderId: "806980862354"
});

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
