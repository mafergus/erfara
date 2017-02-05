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

    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};
    updates["/users/" + recipientId + "/conversations/" + senderId + "/messages/" + newMessageKey] = messageData;
    updates["/users/" + senderId + "/conversations/" + recipientId + "/messages/" + newMessageKey] = messageData;

    return firebase.database().ref().update(updates);
  }
}
