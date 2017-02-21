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
    debugger;

    return firebase.database().ref().update(updates).then(snap => {
      debugger;
      dispatch(readMessage(senderId, recipientId, newMessageKey));
    });
  }
}

export function readMessage(userId, conversationId, messageId) {
  return dispatch => {
    debugger;
    var updates = {};
    updates["/users/" + userId + "/conversations/" + conversationId + "/lastReadMessage"] = messageId;
    return firebase.database().ref().update(updates).then(snap => {
      // dispatch({ type: "ADD_MESSAGE_SUCCESS", messageData });
    });
  }
}
