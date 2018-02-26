import * as React from 'react';
import * as firebase from 'firebase';
import { ImageGallery } from "./components/gallery/imageGallery";
import { AdminLogin } from "./components/authentication/adminLogin";
const logo = require('./images/logo.png');
const classNames = require('./app.css');

interface Props {}

interface State {
  user: Object;
}

export class App extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      user: null
    };
  }

  //Life cicle method launched when component is rendered in DOM (Firebase Listener).
  componentWillMount() {
    firebase.auth().onAuthStateChanged((user: Object) => {
      this.setState({ user });
    });
  }

  public render() {
    return (
      <div className={classNames.app}>
        <header className={classNames.appHeader}>
          <img src={logo} className={classNames.appLogo} alt="logo" />
          <h1 className={classNames.appTitle}>React & Firebase</h1>
        </header>
        <div className={classNames.appIntro}>
          <ImageGallery user={this.state.user} />
        </div>
      </div>
    );
  }
}