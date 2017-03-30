import React, { PropTypes } from 'react';
import firebase from 'actions/database';
import Dialog from 'material-ui/Dialog';
import { lightBlack } from 'material-ui/styles/colors';
import autoBind from 'react-autobind';
import { addUser, getFacebookInfo } from "utils/Api";
import { addMessage } from "actions/messageActions";
import { getPhoto, uploadFile, checkUserExists } from "utils/Api";
import store from "store/store";

/**
 * A modal dialog can only be closed by selecting one of the actions.
 */
export default class AuthModal extends React.Component {

  static propTypes = {
    title: PropTypes.string.isRequired,
    isOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    autoBind(this);
  }

  onSuccess(result) {
    const user = result.user;
    let userData = {
      name: user.displayName,
      uid: user.uid,
      email: user.email,
      photo: user.photoURL,
    };
    checkUserExists(user.uid)
    .then(() => getFacebookInfo(result.credential.accessToken))
    .then(json => {
      userData["birthday"] = json.birthday;
      userData["location"] = json.location.name;
      userData["hometown"] = json.hometown.name;
    })
    .then(() => getPhoto(), () => {
      store.dispatch({ type: "ADD_AUTHED_USER_SUCCESS", user: userData });
      firebase.onAuthSuccess(userData.uid);
    })
    .then(blob => {
      return uploadFile(blob)
    })
    .then(url => {
      userData.coverPhoto = url;
      store.dispatch(addUser(userData));
      store.dispatch(addMessage(userData.uid, "swB4xIn0FQNtdWUpMInJuFup6AD3", "Welcome to Erfara!", new Date()));
    });
  }

  handleSignUpFacebook() {
    this.props.handleClose();
    const provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope("user_birthday");
    provider.addScope("user_hometown");
    provider.addScope("user_location");
    provider.addScope("user_about_me");
    firebase.auth().signInWithPopup(provider)
    .then(this.onSuccess)
    .catch(error => {
      if (error.code == "auth/account-exists-with-different-credential") {
        alert(error.message);
      }
    });
  }

  handleSignUpGoogle() {
    this.props.handleClose();
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/plus.login');
    firebase.auth().signInWithPopup(provider)
    .then(this.onSuccess)
    .catch(error => {
      if (error.code == "auth/account-exists-with-different-credential") {
        alert(error.message);
      }
    });
  }

  render() {
    const { title, isOpen, handleClose } = this.props;

    return (
      <Dialog
        contentStyle={{textAlign: "center", width: "40%", marginBottom: "300px"}}
        title={title}
        titleStyle={{ fontSize: "1.1em", textAlign: "left", padding: "12px 0px 12px 25px", color: lightBlack }}
        modal={false}
        onRequestClose={handleClose}
        open={isOpen}>
        <button
          style={{margin: "3em 8em 3em 0em", verticalAlign: "middle"}}
          className="googleSignUpButton"
          onClick={this.handleSignUpGoogle}></button>
        <button
          style={{verticalAlign: "middle"}}
          className="facebookSignUpButton"
          onClick={this.handleSignUpFacebook}></button>
      </Dialog>
    );
  }
}
