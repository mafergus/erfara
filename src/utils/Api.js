import firebase from 'actions/database';

const PIXABAY_KEY = "4423887-ab96e540ffbe404d644032133";

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

export function addFeedReply(eventId, userId, message, timestamp, parentId) {
  const url = `/events/${eventId}/feed/${parentId}/replies/`;
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

export function rsvp(event, eventId, userId, rsvpStatus) {
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

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
