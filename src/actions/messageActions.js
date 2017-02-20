import firebase from "firebase";

export function addMessage(recipientId, senderId, message, date) {
  return dispatch => {
    var messageData = {
      message,
      isRead: false,
      date,
      from: senderId,
    };

    var newMessageKey = firebase.database().ref().child("/users/" + recipientId + "/conversations/" + senderId + "/messages").push().key;

    var updates = {};
    updates["/users/" + recipientId + "/conversations/" + senderId + "/messages/" + newMessageKey] = messageData;
    updates["/users/" + senderId + "/conversations/" + recipientId + "/messages/" + newMessageKey] = messageData;

    return firebase.database().ref().update(updates).then(snap => {
      dispatch({ type: "ADD_MESSAGE_SUCCESS", messageData });
    });
  }
}
