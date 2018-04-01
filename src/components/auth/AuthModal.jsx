import React from 'react';
import PropTypes from 'prop-types';
import firebase from 'actions/database';
import Dialog from 'material-ui/Dialog';
import { lightBlack } from 'material-ui/styles/colors';
import autoBind from 'react-autobind';
import { addUser, getPhoto, uploadFile, checkUserExists } from "utils/Api";
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

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  // static onSuccess(result) {
  //   const { user } = result;
  //   let userData = {
  //     name: user.displayName,
  //     uid: user.uid,
  //     email: user.email,
  //     photo: user.photoURL,
  //   };

  //   // debugger;

  //   FB.api(
  //     '/me',
  //     'GET',
  //     { "fields": "id,name,email" },
  //     (response) => {
  //       if (!response || response.error) {
  //         alert("Couldn't get FB info");
  //       } else {
  //         // debugger;
  //         userData = { 
  //           ...userData,
  //           email: response.email,
  //           fbUid: response.id
  //         };

  //         checkUserExists(user.uid)
  //         .catch(user => {
  //           // debugger;
  //           store.dispatch({ type: "ADD_AUTHED_USER_SUCCESS", user });
  //           firebase.onAuthSuccess(user.uid);
  //           throw new Error("User exists, logging in");
  //         })
  //         .then(() => getPhoto())
  //         .then(blob => uploadFile(blob))
  //         .then(url => {
  //           // debugger;
  //           userData.coverPhoto = url;
  //           store.dispatch(addUser(userData));
  //         })
  //         .catch(err => {
  //           console.log(err);
  //         });
  //       }
  //     }
  //   );
  // }

  constructor() {
    super();
    autoBind(this);
  }


  handleSignUpFacebook() {
    let userData = {};

    this.props.handleClose();
    const provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope("user_location");
    provider.addScope("email");
    provider.addScope("public_profile");
    firebase.auth().signInWithPopup(provider)
    .then(result => { 
      const email = result.additionalUserInfo.profile.email;
      const fbUid = result.additionalUserInfo.profile.id;
      userData = {
        name: result.user.displayName,
        uid: result.user.uid,
        email,
        photo: result.user.photoURL,
        fbUid,
      };
      return userData;
    }).then(userData => checkUserExists(userData.uid))
    .catch(user => {
      store.dispatch({ type: "ADD_AUTHED_USER_SUCCESS", user });
      firebase.onAuthSuccess(user.uid);
      throw new Error("User exists, logging in");
    })
    .then(() => getPhoto())
    .then(blob => uploadFile(blob))
    .then(url => {
      userData.coverPhoto = url;
      store.dispatch(addUser(userData));
    })
    .catch(error => {
      if (error.code === "auth/account-exists-with-different-credential") {
        alert(error.message);
      }
    });
  }

  render() {
    const { title, isOpen, handleClose } = this.props;

    return (
      <Dialog
        contentStyle={{ width: "30%" }}
        title={title}
        titleStyle={{ fontSize: "1.1em", textAlign: "left", padding: "12px 0px 12px 25px", color: lightBlack }}
        modal={false}
        onRequestClose={handleClose}
        open={isOpen}>
        <div style={{ height: "100%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 40, marginBottom: 40 }}>
          <button
            className="facebookSignUpButton"
            onTouchTap={this.handleSignUpFacebook}></button>
        </div>
      </Dialog>
    );
  }
}
