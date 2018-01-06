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

  static onSuccess(result) {
    const { user } = result;
    let userData = {
      name: user.displayName,
      uid: user.uid,
      email: user.email,
      photo: user.photoURL,
    };

    FB.api(
      '/me',
      'GET',
      { "fields": "id,name,email" },
      (response) => {
        if (!response || response.error) {
          alert("Couldn't get FB info");
        } else {
          userData = { ...userData, email: response.email};

          checkUserExists(user.uid)
          .then(() => getPhoto(), user => {
            store.dispatch({ type: "ADD_AUTHED_USER_SUCCESS", user });
            firebase.onAuthSuccess(user.uid);
          })
          .then(blob => uploadFile(blob))
          .then(url => {
            userData.coverPhoto = url;
            store.dispatch(addUser(userData));
          });
        }
      }
    );
  }

  constructor() {
    super();
    autoBind(this);
  }

  componentDidMount() {
    window.fbAsyncInit = function() {
      window.FB.init({
        appId: "1686372394915080",
        cookie: true,  // enable cookies to allow the server to access
                          // the session
        xfbml: true,  // parse social plugins on this page
        version: "v2.1" // use version 2.1
      });
  
      // Now that we've initialized the JavaScript SDK, we call
      // FB.getLoginStatus().  This function gets the state of the
      // person visiting this page and can return one of three states to
      // the callback you provide.  They can be:
      //
      // 1. Logged into your app ('connected')
      // 2. Logged into Facebook, but not your app ('not_authorized')
      // 3. Not logged into Facebook and can't tell if they are logged into
      //    your app or not.
      //
      // These three cases are handled in the callback function.
      window.FB.getLoginStatus((response) => {
        this.statusChangeCallback(response);
      });
    }.bind(this);
    
    // Load the SDK asynchronously
    (function(d, s, id) {
      let js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }

  statusChangeCallback(response) {
    // console.log('statusChangeCallback');
    // console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // this.testAPI();
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
    }
  }
  
  checkLoginState() {
    window.FB.getLoginStatus((response) => {
      this.statusChangeCallback(response);
    });
  }

  // testAPI() {
  //   console.log('Welcome!  Fetching your information.... ');
  //   window.FB.api('/me', function(response) {
  //     console.log('Successful login for: ' + response.name);
  //   });
  // }

  handleSignUpFacebook() {
    this.props.handleClose();
    const provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope("user_birthday");
    provider.addScope("user_hometown");
    provider.addScope("user_location");
    provider.addScope("user_about_me");
    provider.addScope("email");
    provider.addScope("public_profile");
    provider.setCustomParameters({
      'display': 'popup'
    });
    firebase.auth().signInWithPopup(provider)
    .then(result => AuthModal.onSuccess(result))
    .catch(error => {
      if (error.code === "auth/account-exists-with-different-credential") {
        alert(error.message);
      }
    });
  }

  // handleSignUpGoogle() {
  //   this.props.handleClose();
  //   const provider = new firebase.auth.GoogleAuthProvider();
  //   firebase.auth().signInWithPopup(provider)
  //   .then(AuthModal.onSuccess)
  //   .catch(error => {
  //     if (error.code === "auth/account-exists-with-different-credential") {
  //       alert(error.message);
  //     }
  //   });
  // }

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
