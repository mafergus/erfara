import firebase from 'firebase';
import store from "../store/store";

const config = {
  apiKey: 'AIzaSyDcJGLjFf1tCJxOPHYU6mu_oFDDMsd1-zk',
  authDomain: 'erfara-2aa21.firebaseapp.com',
  databaseURL: 'https://erfara-2aa21.firebaseio.com/',
  storageBucket: 'gs://erfara-2aa21.appspot.com'
};

firebase.initializeApp(config);

firebase.database().ref('/events').on('value', function(snapshot) {
  const events = snapshot.val();
  console.log("Update events: ", snapshot.val());
  store.dispatch({ type: "GET_EVENTS_SUCCESS", events });
});

firebase.database().ref('/users').on('value', function(snapshot) {
  const users = snapshot.val();
  console.log("Update users: ", snapshot.val());
  store.dispatch({ type: "GET_USERS_SUCCESS", users });
});

firebase.onAuthSuccess = (userId) => {
  firebase.database().ref("/users/" + userId).on('value', function(snapshot) {
    const user = snapshot.val();
    console.log("Update authed user: ", user);
    if (user) {
      store.dispatch({ type: "ADD_AUTHED_USER_SUCCESS", user });
    }
  });
};

export default firebase;