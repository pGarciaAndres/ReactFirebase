import React, { Component } from 'react';
import firebase from 'firebase';
import FileUpload from './FileUpload';
import logo from './logo.svg';
import admin from './admin.png';
import './App.css';

class App extends Component {

  constructor() {
    super();
    //In React, components have state!
    //React state: If change, the component will be reloaded! (Interesting)
    this.state = {
      user: null,
      error: null
    };

    this.handleAuth = this.handleAuth.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  //Life cicle method launched when component is rendered in DOM (Firebase Listener).
  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ 
        user: user,
        error: null
      });

      //Awesome ES6 Syntax: If user == new user, will not change and eoc will be overwrited.
      // this.setState({ user });
    });
  }
  
  handleAuth(event) {
    //Email & Password provider
    var email = 'garciandres.15@gmail.com';
    var password = this.refs.password.value;
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(result => console.log(`Admin has logged in!`))
      .catch(error => {
        console.log(`Error ${error.code}: ${error.message}`);
        this.setState({
          error: `Invalid password`
        });
      });
  }

  handleLogout() {
    firebase.auth().signOut()
      .then(result => console.log(`Admin has logged out!`))
      .catch(error => console.log(`Error ${error.code}: ${error.message}`));
  }

  renderLoginButton() {
    if (this.state.user) {
      //If user is logged
      return (
        <div>
          <img className="Url-photo" src={admin} alt={this.state.user.email} />
          <span>Welcome Administrator!</span>
          <button className="logout" onClick={this.handleLogout}>Log out</button>
          <FileUpload />
        </div>
      );
    } else {
      //If user is not logged
      return (
        <div>
          <em htmlFor="password">{this.state.error}<br/>
          <input type="password" placeholder="Password" id="password" ref="password"/></em>
          <button onClick={this.handleAuth}>Admin</button>
        </div>
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
