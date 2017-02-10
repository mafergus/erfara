import firebase from "firebase";

export function getEvents() {
  return dispatch => {
    return firebase.database().ref('/events').once('value', snap => {
      const events = snap.val();
      dispatch({type: "GET_EVENTS_SUCCESS", events})
    })
    .catch((error) => {
      console.log(error);
    });
  }
}

export function getEvent(id) {
  return dispatch => {
    return firebase.database().ref(`/events/${id}`).once('value', snap => {
      const event = snap.val();
      dispatch({type: "GET_EVENT_SUCCESS", event})
    })
    .catch((error) => {
      console.log(error);
    });
  }
}

export function addEvent(title, description, photo, date, locationString, userId) {
  return dispatch => {
    var eventData = {
      title,
      description,
      photo,
      date,
      locationString,
      userId,
      attendees: [userId],
    };

    var newEventKey = firebase.database().ref().child('events').push().key;

    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};
    updates["/events/" + newEventKey] = eventData;
    updates["/users/" + userId + "/events/" +  newEventKey] = eventData;

    return firebase.database().ref().update(updates);
  }
}

export function addEventMessage(eventId, userId, message) {
  return dispatch => {
    const url = `/events/${eventId}/feed/`;
    const messageData = {
      message,
      userId,
    };
    const newEventMessageKey = firebase.database().ref().child(url).push().key;

    var updates = {};
    updates[url + newEventMessageKey] = messageData;

    return firebase.database().ref().update(updates);
  }
}

export function addEventPhoto(eventId, pixabayId) {
  return dispatch => {
    fetch(`https://pixabay.com/api/?key=4423887-ab96e540ffbe404d644032133&id=${pixabayId}&pretty=true`).then(function(response) {
      if (response.ok) {
        return response.json();
      }
    }).then(function(json) {
      if (json && json.hits && json.hits.length > 0) {
        dispatch({ type: "GET_EVENT_PHOTO_SUCCESS", id: eventId, photoURL: json.hits[0].webformatURL } );
      }
    }).catch(function(error) {
      console.log("UH OH SHIT FUCKED UP: ", error);
    });
  }
}

export function rsvp(event, eventId, userId, rsvpStatus) {
  return dispatch => {
    if (!event.attendees) { event.attendees = []; }
    if (rsvpStatus && !event.attendees.includes(userId)) {
      event.attendees.push(userId);
    } else {
      const index = event.attendees.indexOf(userId);
      if (index > -1) {
        event.attendees.splice(index, 1);
      }
    }

    var updates = {};
    updates["/events/" + eventId + "/attendees"] = event.attendees;
    return firebase.database().ref().update(updates);
  }
}
