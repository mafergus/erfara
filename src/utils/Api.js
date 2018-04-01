import firebase from 'actions/database';
import { DEFAULT_LOCATION } from "utils/constants";

const PIXABAY_KEY = "4423887-ab96e540ffbe404d644032133";
const PLACES_API_KEY = "AIzaSyDcJGLjFf1tCJxOPHYU6mu_oFDDMsd1-zk";
const PLACEHOLDER_PHOTO = "https://s-media-cache-ak0.pinimg.com/originals/96/bb/de/96bbdef0373c7e8e7899c01ae11aee91.jpg";
const CATEGORY_PLACEHOLDER = "https://firebasestorage.googleapis.com/v0/b/erfara-2aa21.appspot.com/o/categoryImages%2F1491252804492?alt=media&token=0704b77e-b184-4be9-8ce7-26d4b33434bf";

export function getFacebookInfo(accessToken) {
  return new Promise((resolve, reject) => {
    fetch(`https://graph.facebook.com/me?fields=id,name,about,age_range,location,hometown,birthday&access_token=${accessToken}`).then(response => {
      if (response.ok) {
        return response.json();
      }
      reject(new Error(response.statusText));
    }).then(json => {
      resolve(json);
    });
  });
}

export function fetchUser(uuid) {
  return firebase.database().ref("/users/" + uuid).once("value");
}

export function fetchUsers() {
  return firebase.database().ref("/users").once("value");
}

export function fetchWikipediaDescription(searchTerm) {
  return new Promise((resolve, reject) => {
    const baseUrl = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&explaintext=1&origin=*";
    const term = encodeURIComponent(searchTerm);
    fetch(`${baseUrl}&titles=${term}`).then(response => {
      if (response && response.ok) {
        return response.json();
      }
    })
    .then(json => resolve(Object.values(json.query.pages)[0].extract.split("\n")[0]))
    .catch(error => reject(new Error(error)));
  });
}

export function addMessage(recipientId, senderId, message, date) {
  const messageData = {
    message,
    date,
    from: senderId,
  };
  const newMessageKey = firebase.database().ref().child("/conversations/users/" + recipientId + senderId + "/messages").push().key;
  const updates = {};
  updates["/conversations/users/" + recipientId + "/" + senderId + "/messages/" + newMessageKey] = messageData;
  updates["/conversations/users/" + senderId + "/" + recipientId + "/messages/" + newMessageKey] = messageData;

  return firebase.database().ref().update(updates).then(() => readMessage(senderId, recipientId, newMessageKey));
}

export function readMessage(userId, conversationId, messageId) {
  if (!userId || !conversationId || !messageId || userId === conversationId) { return; }
  const updates = {};
  updates["/conversations/users/" + userId + "/" + conversationId + "/lastReadMessage"] = messageId;
  firebase.database().ref().update(updates);
}

export function searchCategories(searchTerm) {
  return new Promise((resolve, reject) => {
    firebase.database().ref("/categories")
      .orderByChild("name")
      .startAt(searchTerm)
      .endAt(searchTerm+"\uf8ff").once("value", snap => {
        const categories = [];
        snap.forEach(child => {
          const value = child.val();
          categories.push({ ...value, id: child.key });
        });
        resolve(categories);
    }).catch(error => reject(error));
  });
}

export function getCategories() {
  return new Promise((resolve, reject) => {
    firebase.database().ref("/categories").orderByChild("name").once("value", snap => {
      const categories = {};
      snap.forEach(child => {
        const value = child.val();
        categories[child.key] = { ...value, id: child.key };
      });
      resolve(categories);
    }).catch(error => reject(error));
  });
}

export function autoAddCategory(name) {
  return new Promise((resolve) => {
    getPhoto(name)
    .then(blob => uploadFile(blob, "categoryImages/"))
    .then(url => {
      const categoryKey = firebase.database().ref().child("categories").push().key;
      updateCategory(categoryKey, name, url).then(category => resolve(category));
    }).catch(() => {
      const categoryKey = firebase.database().ref().child("categories").push().key;
      updateCategory(categoryKey, name, CATEGORY_PLACEHOLDER).then(category => resolve(category));
    });
  });
}

export function deleteCategory(key) {
  const updates = {};
  updates["categories/" + key] = null;

  return firebase.database().ref().update(updates);
}

export function updateCategory(key, name, image) {
  return new Promise((resolve, reject) => {
    const update = {};
    update["categories/" + key + "/image"] = image;
    update["categories/" + key + "/name"] = name;

    firebase.database().ref().update(update)
    .then(() => resolve({ id: key, name, image }))
    .catch(error => reject(error));
  });
}

export function getPlaces(searchTerm) {
  return new Promise(() => {
    fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${DEFAULT_LOCATION}&radius=50000&name=${searchTerm}&key=${PLACES_API_KEY}`,
      {mode: 'cors'});
  });
}

export function getCoordinates(searchTerm) {
  return new Promise((resolve, reject) => {
    fetch(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${searchTerm}&key=${PLACES_API_KEY}`,
      {mode: 'cors'}).then(response => {
        if (response.ok) {
          return response.json();
        }
        reject(new Error(response.statusText));
      }).then(json => {
        resolve(json);
      });
  });
}

export function autoCompletePlaces(searchTerm) {
  return new Promise((resolve, reject) => {
    fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?location=${DEFAULT_LOCATION}&radius=50000&input=${searchTerm}&types=geocode&key=${PLACES_API_KEY}`,
      {mode: 'cors'}).then(response => {
        if (response.ok) {
          return response.json();
        }
        reject(new Error(response.statusText));
      }).then(json => {
        resolve(json);
      });
  });
}

export function getUser(uid) {
  return new Promise((resolve, reject) => {
    firebase.database().ref(`/users/${uid}`).once('value', snapshot => {
      if (!user) {
        reject(new Error("No user"));
      } else {
        resolve(snapshot.val());  
      }
    });
  });
}

export function checkUserExists(uid) {
  return new Promise((resolve, reject) => {
    firebase.database().ref(`/users/${uid}`).once('value', snapshot => {
      const user = snapshot.val();
      if (user) {
        reject(user);
      } else {
        resolve(user);
      }
    });
  });
}

export function addUser(user) {
  return dispatch => {
    if (Object.keys(user).length === 0) { return dispatch({ type: "ADD_AUTHED_USER_SUCCESS", user }); }

    // debugger;
    
    const updates = {};
    updates["users/" + user.uid + "/name"] = user.name;
    updates["users/" + user.uid + "/uid"] = user.uid;
    updates["users/" + user.uid + "/email"] = user.email;
    updates["users/" + user.uid + "/photo"] = user.photo;
    updates["users/" + user.uid + "/fbUid"] = user.fbUid;
    updates["users/" + user.uid + "/birthday"] = user.birthday || "";
    updates["users/" + user.uid + "/hometown"] = user.hometown || "";
    updates["users/" + user.uid + "/location"] = user.location || "";
    updates["users/" + user.uid + "/coverPhoto"] = user.coverPhoto || PLACEHOLDER_PHOTO;

    firebase.database().ref().update(updates).then(() => {
      dispatch({ type: "ADD_AUTHED_USER_SUCCESS", user });
      firebase.onAuthSuccess(user.uid);
    });
  };
}

export function deleteUser(userId) {
  const updates = {};
  updates["users/" + userId] = null;
  updates["conversations/" + userId] = null;

  return firebase.database().ref().update(updates);
}

export function followUser(followerId, userId) {
  const updates = {};
  updates["/users/" + userId + "/followers/" + followerId] = true;
  updates["/users/" + followerId + "/following/" + userId] = true;
  return firebase.database().ref().update(updates);
}

export function unfollowUser(followerId, userId) {
  const updates = {};
  updates["/users/" + userId + "/followers/" + followerId] = null;
  updates["/users/" + followerId + "/following/" + userId] = null;
  return firebase.database().ref().update(updates);
}

export function addUserFeedback(senderId, recipientId, message, timestamp) {
  const url = `/users/${recipientId}/feed/`;
  const feedData = {
    message,
    userId: senderId,
    timestamp,
  };
  const newUserFeedbackKey = firebase.database().ref().child(url).push().key;

  const updates = {};
  updates[url + newUserFeedbackKey] = feedData;

  return firebase.database().ref().update(updates);
}

export function addUserFeedReply(senderId, userId, message, timestamp, parentId) {
  const url = `/users/${userId}/feed/${parentId}/replies/`;
  const messageData = {
    message,
    userId: senderId,
    timestamp,
  };
  const newEventMessageKey = firebase.database().ref().child(url).push().key;

  const updates = {};
  updates[url + newEventMessageKey] = messageData;

  return firebase.database().ref().update(updates);
}

export function addUserSkill(userId, categoryId, categoryName) {
  const newUserCategoryKey = firebase.database().ref("/user-categories/").push().key;
  const updates = {};
  updates[`/user-categories/${newUserCategoryKey}/userId`] = userId;
  updates[`/user-categories/${newUserCategoryKey}/categoryId`] = categoryId;
  updates[`/users/${userId}/skills/${newUserCategoryKey}`] = true;

  const strArray = categoryName.split(" ");
  let title = "";
  strArray.forEach((str, index) => {
    if (index === 0) {
      title = str.charAt(0).toUpperCase() + str.slice(1) + " ";
      return;
    }
    title = title.concat(str.toLowerCase() + " ");
  });

  return fetchWikipediaDescription(title).then(description => {
    updates[`/user-categories/${newUserCategoryKey}/description`] = description;
    return firebase.database().ref().update(updates);
  }).catch(() => {
    updates[`/user-categories/${newUserCategoryKey}/description`] = "Update me!";
    return firebase.database().ref().update(updates);
  });
}

export function getPhotoUrl(searchTerm, isThumbnail=false) {
  const photoParam = searchTerm ? `&q=${searchTerm}` : "";
  return new Promise((resolve, reject) => {
    fetch(`https://pixabay.com/api/?key=${PIXABAY_KEY}${photoParam}&image_type=photo`).then(response => {
      if (response.ok) {
        return response.json();
      }
      reject(new Error(response.statusText));
    }).then(json => {
      if (json && json.hits && json.hits.length > 0) {
        const urlType = isThumbnail ? "previewURL" : "webformatURL";
        const url = searchTerm ? 
          json.hits[0][urlType] : 
          json.hits[getRandomInt(0, json.hits.length)][urlType];
        resolve(url);
      } else {
        reject(new Error("Fuck this shiet"));
      }
    }).catch(error => resolve(error));
  });
}

export function getPhotos(searchTerm) {
  const photoParam = searchTerm ? `&q=${searchTerm}` : ""; 
  return new Promise((resolve, reject) => {
    fetch(`https://pixabay.com/api/?key=${PIXABAY_KEY}${photoParam}&image_type=photo`).then(response => {
      if (response.ok) {
        return response.json();
      }
      reject(new Error(response.statusText));
    }).then(json => {
      if (json && json.hits && json.hits.length > 0) {
        resolve(json);
      }
    }).catch(error => {
      resolve(error);
    });
  });
}

export function getPhoto(searchTerm) {
  return new Promise((resolve, reject) => {
    getPhotoUrl(searchTerm)
    .then(url => fetch(url))
    .then(response => {
      if (response && response.ok) {
        return response.blob();
      }
      reject(new Error(response.statusText));
    }).then(blob => resolve(blob))
    .catch(error => reject(error));
  });
}

export function addFeedMessage(feedId, userId, message, timestamp) {
  const messageData = {
    message,
    userId,
    timestamp,
  };
  const newFeedItemKey = firebase.database().ref(`feeds/${feedId}`).push().key;
  const updates = {};
  updates[`feeds/${feedId}/` + newFeedItemKey] = messageData;

  return firebase.database().ref().update(updates);
}

export function addFeedMessageReply(feedId, feedItemId, userId, message, timestamp) {
  const url = `feeds/${feedId}/${feedItemId}/replies/`;
  const messageData = {
    message,
    userId,
    timestamp,
  };
  const newFeedItemKey = firebase.database().ref(url).push().key;
  const updates = {};
  updates[url + newFeedItemKey] = messageData;

  return firebase.database().ref().update(updates);
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
    const updates = {};
    updates[url + newEventMessageKey] = messageData;

    return firebase.database().ref().update(updates);
  };
}

export function uploadFile(file, directory="images/") {
  return new Promise((resolve, reject) => {
    const storageRef = firebase.storage().ref();
    // Create the file metadata
    const metadata = {
      contentType: file.hasOwnProperty("type") ? file.type : "image/jpeg",
    };

    const uploadTask = storageRef.child(directory + new Date().getTime()).put(file, metadata);
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
      null,
      error => reject(error),
      () => resolve(uploadTask.snapshot.downloadURL)
    );
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

  const updates = {};
  updates[url + newEventMessageKey] = messageData;

  return firebase.database().ref().update(updates);
}

export function joinEvent(eventId, userId) {
  const updates = {};
  updates["/events/" + eventId + "/attendees/" + userId] = true;
  updates["/users/" + userId + "/attending/" + eventId] = true;
  return firebase.database().ref().update(updates);
}

export function leaveEvent(eventId, userId) {
  const updates = {};
  updates["/events/" + eventId + "/attendees/" + userId] = null;
  updates["/users/" + userId + "/attending/" + eventId] = null;
  return firebase.database().ref().update(updates);
}

export function addEvent(title, description, photo, date, startTime, endTime, advices, locationString, userId, geoCoordinates) {
  const attendees = {};
  attendees[userId] = true;
  const eventData = {
    title,
    description,
    photo,
    date,
    startTime,
    endTime,
    advices,
    locationString,
    userId,
    geoCoordinates,
    attendees,
  };
  const newEventKey = firebase.database().ref().child('events').push().key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  const updates = {};
  updates["/events/" + newEventKey] = eventData;
  updates["/users/" + userId + "/events/" + newEventKey] = eventData;

  return firebase.database().ref().update(updates);
}

export function putEventPhoto(url, eventId) {
  const update = {};
  update["/events/" + eventId + "/photo"] = url;
  
  return firebase.database().ref().update(update);
}

export function getFeeds() {
  return firebase.database().ref("feeds").once("value").then(snap => {
    const feeds = snap.val();
    if (feeds) {
      return feeds;
    }
  });
}

function getRandomInt(min, max) {
  const minVal = Math.ceil(min);
  const maxVal = Math.floor(max);
  return Math.floor(Math.random() * (maxVal - minVal)) + minVal;
}
