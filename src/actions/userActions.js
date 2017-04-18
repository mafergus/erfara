import firebase from "firebase";

export function addUser(user) {
  return dispatch => dispatch({ type: "GET_USER_SUCCESS", user });
}

export function addUsers(users) {
  return dispatch => dispatch({ type: "GET_USERS_SUCCESS", users });
}
