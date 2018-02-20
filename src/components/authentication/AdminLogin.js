import React from 'react';
import firebase from 'firebase';
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
            .catch(error => console.log(`Error ${error.code}: ${error.message}`));
    }

    renderLoginButton() {
        //Check login status
        if (this.props.user) {
            return (
                <div className={classNames.login}>
                    <img className={classNames.urlPhoto} src={admin} alt={this.props.user.email} />
                    <span>Welcome Administrator!</span>
                    <button className={classNames.logoutButton} onClick={this.handleLogout}>Log out</button>
                </div>
            );
        } else {
            return (
                <div className={classNames.login}>
                    <em htmlFor="password">{this.state.error}<br />
                        <input type="password" placeholder="Password" id="password" ref="password" /></em>
                    <button className={classNames.loginButton} onClick={this.handleAuth}>Admin</button>
                </div>
            );
        }
    }

    render() {
        return (
            <div>
                {this.renderLoginButton()}
            </div>
        );
    }

}