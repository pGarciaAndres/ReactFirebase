import React, { Component } from 'react';
import firebase from 'firebase';
// import FileUpload from './FileUpload';
import ImageGallery from './ImageGallery';
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
      error: null,
      images: [] 
    };

    this.userLogin = 'garciandres.15@gmail.com';
    this.handleAuth = this.handleAuth.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  //Life cicle method launched when component is rendered in DOM (Firebase Listener).
  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      //Awesome ES6 Syntax: If user == new user, will not change and eoc will be overwrited.
      // this.setState({ user });
      this.setState({ 
        user: user,
        error: null
      });
    });
  }

  handleAuth(event) {
    //Email & Password provider
    var email = this.userLogin;
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
      .catch(error => console.log(`Error ${ error.code }: ${ error.message }`));
  }
  
  renderLoginButton() {
    //Check login status
    if (this.state.user) {
      return (
        <div className="login">
          <img className="Url-photo" src={ admin } alt={ this.state.user.email } />
          <span>Welcome Administrator!</span>
          <button className="logout" onClick={ this.handleLogout }>Log out</button>
        </div>
      );
    } else {
      return (
        <div className="login">
          <em htmlFor="password">{ this.state.error }<br/>
          <input type="password" placeholder="Password" id="password" ref="password"/></em>
          <button onClick={ this.handleAuth }>Admin</button>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={ logo } className="App-logo" alt="logo" />
          <h1 className="App-title">React & Firebase</h1>
        </header>
        <div className="App-intro">
          { this.renderLoginButton() }
          <ImageGallery user={ this.state.user }/>
        </div>
      </div>
    );
  }
}

export default App;
