import firebase from 'firebase';
import store from "store/store";
import { getUnreadMessageCount } from "utils/helpers";

const config = {
  apiKey: 'AIzaSyDcJGLjFf1tCJxOPHYU6mu_oFDDMsd1-zk',
  authDomain: 'erfara-2aa21.firebaseapp.com',
  databaseURL: 'https://erfara-2aa21.firebaseio.com/',
  storageBucket: 'gs://erfara-2aa21.appspot.com'
};

firebase.initializeApp(config);

firebase.database().ref('events').on('value', snapshot => {
  const events = snapshot.val();
  if (events) {
    store.dispatch({ type: "GET_EVENTS_SUCCESS", events });
  }
});

firebase.database().ref('users').on('value', snapshot => {
  const users = snapshot.val();
  if (users) {
    store.dispatch({ type: "GET_USERS_SUCCESS", users });
  }
});

firebase.database().ref('feeds').on('value', snapshot => {
  const feeds = snapshot.val();
  if (feeds) {
    store.dispatch({ type: "GET_FEEDS_SUCCESS", feeds });
  }
});

firebase.database().ref("categories").on("value", snapshot => {
  const categories = snapshot.val();
  if (categories) {
    store.dispatch({ type: "GET_CATEGORIES_SUCCESS", categories });
  }
});

firebase.database().ref("user-categories").on("value", snapshot => {
  const userCategories = snapshot.val();
  if (userCategories) {
    store.dispatch({ type: "GET_USER_CATEGORIES_SUCCESS", userCategories });
  }
});

firebase.onAuthSuccess = (userId) => {
  if (!userId) { return; }
  firebase.database().ref("/users/" + userId).on('value', snapshot => {
    const user = snapshot.val();
    if (user) {
      store.dispatch({ type: "ADD_AUTHED_USER_SUCCESS", user });
    }
  });

  firebase.database().ref('/conversations/users/' + userId).on('value', snapshot => {
    const conversations = snapshot.val();
    if (conversations) {
      store.dispatch({ type: "ADD_CONVERSATIONS_SUCCESS", conversations });
      const unreadMessageCount = getUnreadMessageCount(store.getState());
      store.dispatch({ type: "SET_UNREAD_MESSAGE_COUNT", count: unreadMessageCount });
    }
  });

};

export default firebase;