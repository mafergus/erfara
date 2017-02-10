import Immutable from "immutable";

export function eventsReducer(state = Immutable.Map(), action) {
  switch (action.type) {
    case "GET_EVENTS_SUCCESS": {
      Object.entries(action.events).forEach(entry => {
        state = state.set(entry[0], entry[1]);
      });
      return state;
    }
    case "GET_EVENT_SUCCESS": return state.set(action.id, action.event);
    case "GET_EVENT_PHOTO_SUCCESS": {
      let event = state.get(action.id);
      event.photoURL = action.photoURL;
      return state.set(action.id, event);
    }
    case "GET_EVENT_FEED_SUCCESS": {
      debugger;
      return state.setIn([action.eventId, "feed"], action.feed);
    }
    default:
      return state;
  }
}