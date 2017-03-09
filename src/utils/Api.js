import firebase from 'actions/database';
import { DEFAULT_LOCATION } from "utils/constants";

const PIXABAY_KEY = "4423887-ab96e540ffbe404d644032133";
const PLACES_API_KEY = "AIzaSyDcJGLjFf1tCJxOPHYU6mu_oFDDMsd1-zk";
const PLACEHOLDER_PHOTO = "https://s-media-cache-ak0.pinimg.com/originals/96/bb/de/96bbdef0373c7e8e7899c01ae11aee91.jpg";

export function getPlaces(searchTerm) {
  return new Promise(() => {
    fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${DEFAULT_LOCATION}&radius=50000&name=${searchTerm}&key=${PLACES_API_KEY}`,
      {mode: 'cors'});
  });
}

export function autoCompletePlaces(searchTerm) {
  return new Promise((resolve, reject) => {
    fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?location=${DEFAULT_LOCATION}&radius=50000&input=${searchTerm}&types=geocode&key=${PLACES_API_KEY}`,
      {mode: 'cors'}).then(response => {
        if (response.ok) {
          return response.json();
        } else {
          reject(new Error(response.statusText));
        }
      }).then(json => {
        resolve(json);
      });
  });
}

export function checkUserExists(uid) {
  return new Promise((resolve, reject) => {
    firebase.database().ref(`/users/${uid}`).once('value', function(snapshot) {
      const user = snapshot.val();
      if (user) {
        reject(new Error("User exists!"));
      } else {
        resolve(user);
      }
    });
  });
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

    firebase.database().ref().update(updates).then(() => {
      dispatch({ type: "ADD_AUTHED_USER_SUCCESS", user });
      firebase.onAuthSuccess(user.uid);
    });
  }
}

export function addUserFeedback(senderId, recipientId, feedback, timestamp) {
  return () => {
    const url = `/users/${recipientId}/feed/`;
    const feedData = {
      feedback,
      userId: senderId,
      timestamp,
    };
    const newUserFeedbackKey = firebase.database().ref().child(url).push().key;

    var updates = {};
    updates[url + newUserFeedbackKey] = feedData;

    return firebase.database().ref().update(updates);
  }
}

export function getPhoto(searchTerm) {
  const photoParam = searchTerm ? `&q=${searchTerm}` : ""; 
  return new Promise((resolve, reject) => {
    fetch(`https://pixabay.com/api/?key=${PIXABAY_KEY}${photoParam}&image_type=photo`).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        reject(new Error(response.statusText));
      }
    }).then(json => {
      if (json && json.hits && json.hits.length > 0) {
        const url = searchTerm ? 
          json.hits[0].webformatURL : 
          json.hits[getRandomInt(0, json.hits.length)].webformatURL;
        return fetch(url);
      }
    }).then(response => {
      if (response && response.ok) {
        return response.blob();
      } else {
        reject(new Error(response.statusText));
      }
    }).then(blob => {
      resolve(blob);
    }).catch(error => {
      resolve(error);
    });
  });
}

export function addEventMessage(eventId, userId, message, timestamp) {
  return () => {
    const url = `/events/${eventId}/feed/`;
    const messageData = {
      message,
      userId,
      timestamp,
    };
    const newEventMessageKey = firebase.database().ref().child(url).push().key;

    var updates = {};
    updates[url + newEventMessageKey] = messageData;

    return firebase.database().ref().update(updates);
  }
}

export function rsvp(event, eventId, userId, rsvpStatus) {
  return () => {
    if (!event.attendees) { event.attendees = {}; }
    if (rsvpStatus && !Object.keys(event.attendees).includes(userId)) {
      event.attendees[userId] = true;
    } else {
      delete event.attendees[userId];
    }

    var updates = {};
    updates["/events/" + eventId + "/attendees"] = event.attendees;
    return firebase.database().ref().update(updates);
  }
}

export function uploadFile(file) {
  return new Promise((resolve, reject) => {
    var storageRef = firebase.storage().ref();
    // Create the file metadata
    var metadata = {
      contentType: 'image/jpeg'
    };

    // Upload file and metadata to the object 'images/mountains.jpg'
    var uploadTask = storageRef.child('images/' + new Date().getTime()).put(file, metadata);
    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
      snapshot => {
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED:
            break;
          case firebase.storage.TaskState.RUNNING:
            break;
          default: break;
        }
      }, error => {
      switch (error.code) {
        case 'storage/unauthorized':
        case 'storage/canceled':
        case 'storage/unknown': 
        default: break;
      }
      reject(error);
    }, function() {
      resolve(uploadTask.snapshot.downloadURL);
    });
  });
}

export function addEvent(title, description, photo, date, startTime, endTime, advices, locationString, userId) {
  return () => {
    let attendees = {};
    attendees[userId] = true;
    var eventData = {
      title,
      description,
      photo,
      date,
      startTime,
      endTime,
      advices,
      locationString,
      userId,
      attendees,
    };

    var newEventKey = firebase.database().ref().child('events').push().key;

    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};
    updates["/events/" + newEventKey] = eventData;
    updates["/users/" + userId + "/events/" +  newEventKey] = eventData;

    return firebase.database().ref().update(updates);
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
