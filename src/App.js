import React, { Component } from 'react';
import firebase from 'firebase';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  constructor() {
    super();
    //In React, components have state!
    //React state: If change, the component will be reloaded! (Interesting)
    this.state = {
      user: null
    };

    this.handleAuth = this.handleAuth.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  //Life cicle method launched when component is rendered in DOM (Firebase Listener).
  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      // this.setState({
      //   user: user
      // });

      //Awesome ES6 Syntax: If user == new user, will not change and eoc will be overwrited.
      this.setState({ user });
    });
  }
  
  handleAuth() {
    //Google login provider
    const provider = new firebase.auth.GoogleAuthProvider();
    //This return a promise...
    firebase.auth().signInWithPopup(provider)
      //Now we are using ES6 (ArrowFunction & TemplateString)
      .then(result => console.log(`${result.user.email} has logged in!`))
      .catch(error => console.log(`Error ${error.code}: ${error.message}`));
  }

  handleLogout() {
    firebase.auth().signOut()
      .then(result => console.log(`${result.user.email} has logged out!`))
      .catch(error => console.log(`Error ${error.code}: ${error.message}`));
  }

  renderLoginButton() {
    //If user is logged
    if (this.state.user) {
      return (
        <div>
          <img className="Url-photo" src={this.state.user.photoURL} alt={this.state.user.displayName} />
          <p>Welcome {this.state.user.displayName}!</p>
          <button onClick={this.handleLogout}>Log out</button>
        </div>
      );
    } else {
      return (
      //If user is not logged
      <button onClick={this.handleAuth}>Log in</button>
      );
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">React & Firebase</h1>
        </header>
        <div className="App-intro">
          { this.renderLoginButton() }
        </div>
      </div>
    );
  }
}

export default App;
