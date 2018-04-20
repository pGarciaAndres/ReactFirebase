import * as React from 'react';
import * as firebase from 'firebase';
const admin = require('../../../images/admin.png');
const classNames = require('./adminLogin.css');
const userLogin = 'garciandres.15@gmail.com';

interface Props {
}

interface State {
    user: Object;
    error: string;
}

export class AdminLogin extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            user: null,
            error: null
        };
    }

    //Life cicle method launched when component is rendered in DOM (Firebase Listener).
    componentWillMount() {
        firebase.auth().onAuthStateChanged((user: Object) => {
            this.setState({ user });
        });
    }

    handleLoginKeyPress(event) {
        if (event.key == 'Enter') {
            this.handleAuth(event);
        }
    }

    handleAuth = (event) => {
        //Email & Password provider
        let email : string = userLogin;
        let password : string = event.currentTarget[0].value;
        event.preventDefault();
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
            }).then(() => this.refs.password = null);
            
    }

    handleLogout() {
        firebase.auth().signOut()
            .then(result => console.log(`Admin has logged out!`))
            .catch(error => console.log(`Error ${error.code}: ${error.message}`));
    }

    renderLoginButton() {
        //Check login status
        if (this.state.user) {
            return (
                <div className={classNames.loggedIn}>
                    <img className={classNames.urlPhoto} src={admin} alt="Admin" />
                    <span>Welcome Administrator!</span>
                    <button className="btn" onClick={this.handleLogout}>Log out</button>
                </div>
            );
        } else {
            return (
                <div className={classNames.notLoggedIn}>
                    <em>{this.state.error}</em>
                    <div className="input-group">
                        <form onSubmit={this.handleAuth}>
                            <input className="form-control" type="password" placeholder="Password" ref="password" id="password" />
                            <input type="submit" className="btn" value="Sign in"/>
                        </form>
                    </div>
                </div>
            );
        }
    }

    public render() {
        return (
            <div className={classNames.loginContainer}>
                {this.renderLoginButton()}
            </div>
        );
    }

}