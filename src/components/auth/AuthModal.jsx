import React, { PropTypes } from 'react';
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
    const { user, credential } = result;
    let userData = {
      name: user.displayName,
      uid: user.uid,
      email: user.email,
      photo: user.photoURL,
    };
    console.log("LE FIRST RESULT: ", result);
    fetch(`https://graph.facebook.com/v2.11/me?fields=id%2Cname%2Cemail&access_token=${credential.accessToken}`).then(response => { 
      if (response && response.ok) {
        return response.json();
      }
    })
    .then(json => { userData = { ...userData, email: json.email }; console.log("email: ", json.email); })
    .then(() => checkUserExists(user.uid))
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

  constructor() {
    super();
    autoBind(this);
  }

  componentDidMount() {
    console.log("SHOULD GET FB GRAPH API CONNECTED");

    window.fbAsyncInit = function() {
      window.FB.init({
        appId            : "1686372394915080",
        autoLogAppEvents : true,
        xfbml            : true,
        version          : "v2.11"
      });
    };

    // window.FB.getLoginStatus(function(response) {
    //   this.statusChangeCallback(response);
    // }.bind(this));

    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "https://connect.facebook.net/en_US/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));
  }

  statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      // this.testAPI();
      console.log("CONNECTED");
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      // document.getElementById('status').innerHTML = 'Please log ' +
        // 'into this app.';
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      // document.getElementById('status').innerHTML = 'Please log ' +
      // 'into Facebook.';
    }
  }

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
