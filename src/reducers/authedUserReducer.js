export function authedUserReducer(state = {}, action) {
  switch (action.type) {
    case "ADD_AUTHED_USER_SUCCESS": {
      return action.user;
    }
    case "SIGN_OUT_USER": {
      return {};
    }
    default:
      return state;
  }
}
