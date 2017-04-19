import Immutable from "immutable";

export function feedReducer(state = Immutable.Map(), action) {
  switch (action.type) {
    case "GET_FEEDS_SUCCESS": {
      let newState = state;
      Object.entries(action.feeds).forEach(entry => {
        newState = newState.set(entry[0], Immutable.fromJS(entry[1]));
      });
      return newState;
    }
    default:
      return state;
  }
}