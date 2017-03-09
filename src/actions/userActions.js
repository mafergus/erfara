import firebase from "firebase";

export function getUser(uuid) {
  return dispatch => {
    return firebase.database().ref('/users/' + uuid).once('value', snap => {
      const user = snap.val();
      if (user) {
        dispatch({type: "GET_USER_SUCCESS", user});
      }
    });
  }
}

export function getUsers() {
  return dispatch => {
    return firebase.database().ref('/users').once('value', snap => {
      const users = snap.val();
      dispatch({type: "GET_USERS_SUCCESS", users});
    });
  }
}
