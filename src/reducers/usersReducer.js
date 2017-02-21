import Immutable from "immutable";

export function usersReducer(state = Immutable.Map(), action) {
  console.log("eventsReducer() state: ", state, " action: ", action);
  switch (action.type) {
    case "GET_USER_SUCCESS": {
      return state.set(action.user.uid, action.user);
    }
    case "GET_USERS_SUCCESS": {
      if (!action.users) { return state; }
      Object.entries(action.users).forEach(item => state = state.set(item[0], item[1]));
      return state;
    }
    default:
      return state;
  }
}