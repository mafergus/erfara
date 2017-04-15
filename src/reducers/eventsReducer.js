import Immutable from "immutable";

export function eventsReducer(state = Immutable.Map(), action) {
  switch (action.type) {
    case "GET_EVENTS_SUCCESS": {
      let newState = state;
      Object.entries(action.events).forEach(entry => {
        newState = newState.set(entry[0], entry[1]);
      });
      return newState;
    }
    case "GET_EVENT_SUCCESS": return state.set(action.id, action.event);
    default:
      return state;
  }
}