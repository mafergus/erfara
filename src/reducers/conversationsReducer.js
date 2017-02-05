import Immutable from "immutable";

export function conversationsReducer(state = Immutable.Map(), action) {
  switch (action.type) {
    case "GET_CONVERSATIONS_SUCCESS": {
      Object.entries(action.conversations).map(entry => {
        state = state.set(entry[0], entry[1]);
      });
      break;
    }
  }
  return state;
}