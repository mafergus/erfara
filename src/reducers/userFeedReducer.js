import Immutable from "immutable";

export function userFeedReducer(state = Immutable.Map(), action) {
  switch (action.type) {
    case "GET_USER_FEED_SUCCESS": {
      Object.entries(action.feedback).forEach(entry => {
        state = state.set(entry[0], entry[1]);
      });
      return state;
    }
    default:
      return state;
  }
}