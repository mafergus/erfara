import Immutable from "immutable";

export function usersReducer(state = Immutable.Map(), action) {
  switch (action.type) {
    case "GET_USER_SUCCESS": {
      return state.set(action.user.uid, action.user);
    }
    case "GET_USERS_SUCCESS": {
      if (!action.users) { return state; }
      const newState = state;
      Object.entries(action.users).forEach(item => newState = newState.set(item[0], item[1]));
      return newState;
    }
    default:
      return state;
  }
}