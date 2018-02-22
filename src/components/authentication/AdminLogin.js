import React from 'react';
import firebase from 'firebase';
import keydown from 'react-keydown';
import admin from '../../images/admin.png';
const classNames = require('./AdminLogin.css');

export default class AdminLogin extends React.Component {

    constructor() {
        super();

        this.state = {
            error: null
          };

        this.userLogin = 'garciandres.15@gmail.com';
        this.handleAuth = this.handleAuth.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.handleLoginKeyPress = this.handleLoginKeyPress.bind(this);
    }

    handleLoginKeyPress(event) {
        if (event.key == 'Enter') {
            this.handleAuth(event);
        }
    }

    handleAuth(event) {
        //Email & Password provider
        var email = this.userLogin;
        var password = this.refs.password.value;
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then(result => {
            console.log(`Admin has logged in!`);
            this.setState({
                error: null
            });
        }).catch(error => {
            console.log(`Error ${error.code}: ${error.message}`);
            this.setState({
                error: `Invalid password`
            });
        }).then(() => this.refs.password.value = null);
    }

    handleLogout() {
        firebase.auth().signOut()
            .then(result => console.log(`Admin has logged out!`))
            .catch(error => console.log(`Error ${error.code}: ${error.message}`));
    }

    renderLoginButton() {
        //Check login status
        if (this.props.user) {
            return (
                <div className={classNames.loggedIn}>
                    <img className={classNames.urlPhoto} src={admin} alt={this.props.user.email} />
                    <span>Welcome Administrator!</span>
                    <button className="btn btn-default" onClick={this.handleLogout}>Log out</button>
                </div>
            );
        } else {
            return (
                <div className={classNames.notLoggedIn}>
                    <em htmlFor="password">{this.state.error}</em>
                    <div className="input-group">
                        <input className="form-control" type="password" placeholder="Password" ref="password" onKeyPress={this.handleLoginKeyPress}/>
                        <button className="btn" onClick={this.handleAuth}>Admin</button>
                    </div>
                </div>
            );
        }
    }

    render() {
        return (
            <div className={classNames.loginContainer}>
                {this.renderLoginButton()}
            </div>
        );
    }

}