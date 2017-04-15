import Immutable from "immutable";

export function categoriesReducer(state = Immutable.Map(), action) {
  switch (action.type) {
    case "GET_CATEGORIES_SUCCESS": {
      let newState = state;
      Object.entries(action.categories).forEach(entry => {
        newState = newState.set(entry[0], entry[1]);
      });
      return newState;
    }
    case "GET_CATEGORIES_SEARCH_RESULTS_SUCCESS": {
      let newState = state.delete("searchResults");
      Object.entries(action.categories).forEach(entry => {
        newState = newState.setIn(["searchResults", entry[0]], entry[1]);
      });
      return newState;
    }
    default:
      return state;
  }
}