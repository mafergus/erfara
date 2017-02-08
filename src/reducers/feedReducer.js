import Immutable from "immutable";

export function feedReducer(state = Immutable.Map(), action) {
  switch (action.type) {
    case "GET_FEED_SUCCESS": {
      Object.entries(action.feed).forEach(entry => {
        state = state.set(entry[0], entry[1]);
      });
      return state;
    }
    default:
      return state;
  }
}