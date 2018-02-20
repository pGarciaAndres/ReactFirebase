import React from 'react';
import firebase from 'firebase';
import ImageGallery from './components/gallery/ImageGallery';
import logo from './images/logo.png';
const classNames = require('./App.css');

export default class App extends React.Component {

  constructor() {
    super();
    //In React, components have state!
    //React state: If change, the component will be reloaded! (Interesting)
    this.state = {
      user: null,
      images: []
    };
  }

  //Life cicle method launched when component is rendered in DOM (Firebase Listener).
  componentWillMount() { 
    firebase.auth().onAuthStateChanged(user => {
      //Awesome ES6 Syntax: If user == new user, will not change and eoc will be overwrited.
      this.setState({ user });
    });
  }

  render() {
    return (
      <div className={classNames.app}>
        <header className={classNames.appHeader}>
          <img src={ logo } className={classNames.appLogo} alt="logo" />
          <h1 className={classNames.appTitle}>React & Firebase</h1>
        </header>
        <div className={classNames.appIntro}>
          <ImageGallery user={ this.state.user } />
        </div>
      </div>
    );
  }
}