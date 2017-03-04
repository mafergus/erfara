import firebase from "firebase";

export function getEvents() {
  return dispatch => {
    return firebase.database().ref('/events').once('value', snap => {
      const events = snap.val();
      dispatch({type: "GET_EVENTS_SUCCESS", events})
    });
  }
}

export function getEvent(id) {
  return dispatch => {
    return firebase.database().ref(`/events/${id}`).once('value', snap => {
      const event = snap.val();
      dispatch({type: "GET_EVENT_SUCCESS", event})
    });
  }
}

export function addEvent(title, description, photo, date, startTime, endTime, advices, locationString, userId) {
  return () => {
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
