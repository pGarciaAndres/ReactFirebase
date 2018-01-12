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
      error: null,
      images: [] 
    };

    this.handleAuth = this.handleAuth.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
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

    firebase.database().ref('images').on('child_added', snapshot => {
      this.setState({
        images: this.state.images.concat(snapshot.val())
      });
    });
  }

  /**
   * Handle Authentication
   * @param {*} event 
   */
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
      .catch(error => console.log(`Error ${ error.code }: ${ error.message }`));
  }
  
  handleUpload(event) {
    if (event.target.files.length) {
        //Get the file from the event.
        const file = event.target.files[0];
        //Receive the reference.
        const storageRef = firebase.storage().ref(`/images/${file.name}`);
        //Task to upload the file to Firebase.
        const task = storageRef.put(file);
        //Firebase utility to receive the file status.
        task.on('state_changed', snapshot => {
            let percentage = (snapshot.bytesTransferred /snapshot.totalBytes) * 100;
            this.setState({
                uploadValue: percentage
            })
        }, error => { 
            console.log(error.message);
        }, () => { //Image already uploaded.
            const record = {
              id: task.snapshot.metadata.generation,
              name: task.snapshot.metadata.name,
              image: task.snapshot.downloadURL
            };

            const dbRef = firebase.database().ref('images');
            const newImage = dbRef.push();
            newImage.set(record);
        });
    }
  }
  
  renderLoginButton() {
    if (this.state.user) {
      //If user is logged
      return (
        <div>
          <div>
            <img className="Url-photo" src={ admin } alt={ this.state.user.email } />
            <span>Welcome Administrator!</span>
            <button className="logout" onClick={ this.handleLogout }>Log out</button>
          </div>
          <FileUpload onUpload={ this.handleUpload } />
          {
            this.state.images.map(image => (
              <img className="image-gallery" src={ image.image } key={ image.id } alt=""/>
            )).reverse()
          }
        </div>
      );
    } else {
      //If user is not logged
      return (
        <div>
          <div>
            <em htmlFor="password">{ this.state.error }<br/>
            <input type="password" placeholder="Password" id="password" ref="password"/></em>
            <button onClick={ this.handleAuth }>Admin</button>
          </div>
          {
            this.state.images.map(image => (
              <img className="image-gallery" src={ image.image } key={ image.id } alt=""/>
            )).reverse()
          }
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
        </div>
      </div>
    );
  }
}

export default App;
