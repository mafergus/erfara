import firebase from "firebase";

const PLACEHOLDER_PHOTO = "https://s-media-cache-ak0.pinimg.com/originals/96/bb/de/96bbdef0373c7e8e7899c01ae11aee91.jpg";

export function getUser(uuid) {
  return dispatch => {
    return firebase.database().ref('/users/' + uuid).once('value', snap => {
      const user = snap.val();
      dispatch({type: "GET_USER_SUCCESS", user});
    })
    .catch((error) => {
      console.log(error);
    });
  }
}

export function getUsers() {
  return dispatch => {
    return firebase.database().ref('/users').once('value', snap => {
      const users = snap.val();
      dispatch({type: "GET_USERS_SUCCESS", users});
    })
    .catch((error) => {
      console.log(error);
    });
  }
}

export function addUser(user) {
  return dispatch => {
    if (Object.keys(user).length === 0) { return dispatch({ type: "ADD_AUTHED_USER_SUCCESS", user }); }

    let updates = {};
    updates["users/" + user.uid + "/name"] = user.name;
    updates["users/" + user.uid + "/uid"] = user.uid;
    updates["users/" + user.uid + "/email"] = user.email;
    updates["users/" + user.uid + "/photo"] = user.photo;
    updates["users/" + user.uid + "/coverPhoto"] = user.coverPhoto || PLACEHOLDER_PHOTO;

    firebase.database().ref().update(updates).then(snap => {
      dispatch({ type: "ADD_AUTHED_USER_SUCCESS", user });
      firebase.onAuthSuccess(user.uid);
    });
  }
}
