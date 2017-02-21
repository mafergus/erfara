import Immutable from "immutable";

export function messagesReducer(state = Immutable.Map(), action) {
  switch (action.type) {
    case "GET_MESSAGES_SUCCESS": {
      Object.entries(action.messages).forEach(entry => {
        state = state.set(entry[0], entry[1]);
      });
      break;
    }
    default: return state;
  }
  return state;
}