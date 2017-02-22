import React, { PropTypes } from 'react';
import firebase from 'actions/database';
import Dialog from 'material-ui/Dialog';
import { lightBlack } from 'material-ui/styles/colors';
import autoBind from 'react-autobind';
import { addUser } from "actions/userActions";
import { addMessage } from "actions/messageActions";
import { getPhoto, uploadFile } from "utils/Api";
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

  onError(error, type) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(type, " errorCode: ", errorCode, " errorMessage: ", errorMessage);
  }

  onSuccess(result) {
    const user = result.user;
    let userData = {
      name: user.displayName,
      uid: user.uid,
      email: user.email,
      photo: user.photoURL,
    };
    getPhoto()
    .then(blob => {
      return uploadFile(blob);
    })
    .then(url => {
      userData.coverPhoto = url;
      store.dispatch(addUser(userData));
      store.dispatch(addMessage(userData.uid, "7hJGDkRieEfhPiMnu1HGDF8w59V2", "Welcome to Erfara!", new Date()));
      firebase.onAuthSuccess(user.uid);
    })
    .catch(error => {
      alert("oops!");
    });
  }

  handleSignUpFacebook() {
    this.props.handleClose();
    const provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then(this.onSuccess)
      .catch(this.onError.bind(null, "Facebook"));
  }

  handleSignUpGoogle() {
    this.props.handleClose();
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then(this.onSuccess)
      .catch(this.onError.bind(null, "Google"));
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
