import Immutable from "immutable";

const INITIAL_STATE = Immutable.Map().set("unreadMessages", 0).set("selectedConversation", 0).set("map", new Immutable.Map());

export function conversationsReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "ADD_CONVERSATIONS_SUCCESS": {
      Object.entries(action.conversations).forEach(entry => {
        state = state.setIn(["map", entry[0]], entry[1]);
      });
      return state;
    }
    case "SET_UNREAD_MESSAGE_COUNT": return state.set("unreadMessages", action.count);
    case "SET_SELECTED_CONVERSATION": return state.set("selectedConversation", action.index);
    default:
      return state;
  }
}
