import firebase from "firebase";

export function getEvents() {
  return dispatch => {
    return firebase.database().ref('/events').once('value', snap => {
      const events = snap.val();
      if (events) {
        dispatch({ type: "GET_EVENTS_SUCCESS", events });
      }
    });
  }
}

export function getEvent(id) {
  return dispatch => {
    return firebase.database().ref(`/events/${id}`).once('value', snap => {
      const event = snap.val();
      if (event) {
        dispatch({ type: "GET_EVENT_SUCCESS", event });
      }
    });
  }
}
