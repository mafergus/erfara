import Immutable from "immutable";

export function userCategoriesReducer(state = Immutable.Map(), action) {
  switch (action.type) {
    case "GET_USER_CATEGORIES_SUCCESS": {
      let newState = state;
      Object.entries(action.userCategories).forEach(entry => {
        newState = newState.set(entry[0], entry[1]);
      });
      return newState;
    }
    default:
      return state;
  }
}