import React, { PropTypes } from 'react';
import firebase from 'actions/database';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
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
  };

  constructor() {
    super();
    autoBind(this);

    this.state = {
      open: false,
    };
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
    this.handleClose();
    const provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then(this.onSuccess)
      .catch(this.onError.bind(null, "Facebook"));
  }

  handleSignUpGoogle() {
    this.handleClose();
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then(this.onSuccess)
      .catch(this.onError.bind(null, "Google"));
  }

  handleOpen() {
    this.setState({open: true});
  }

  handleClose() {
    this.setState({open: false});
  }

  render() {
    const { title } = this.props;

    return (
      <span>
        <FlatButton 
          label={title}
          primary={true}
          onTouchTap={this.handleOpen} />
        <Dialog
          contentStyle={{textAlign: "center", width: "40%", marginBottom: "300px"}}
          title={title}
          titleStyle={{ fontSize: "1.1em", textAlign: "left", padding: "12px 0px 12px 25px", color: lightBlack }}
          modal={false}
          onRequestClose={this.handleClose}
          open={this.state.open}>
          <button
            style={{margin: "3em 8em 3em 0em", verticalAlign: "middle"}}
            className="googleSignUpButton"
            onClick={this.handleSignUpGoogle}></button>
          <button
            style={{verticalAlign: "middle"}}
            className="facebookSignUpButton"
            onClick={this.handleSignUpFacebook}></button>
        </Dialog>
      </span>
    );
  }
}
