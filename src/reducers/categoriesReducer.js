import Immutable from "immutable";

export function categoriesReducer(state = Immutable.Map(), action) {
  switch (action.type) {
    case "GET_CATEGORIES_SUCCESS": {
      Object.entries(action.categories).forEach(entry => {
        state = state.set(entry[0], entry[1]);
      });
      return state;
    }
    case "GET_CATEGORIES_SEARCH_RESULTS_SUCCESS": {
      state = state.delete("searchResults");
      Object.entries(action.categories).forEach(entry => {
        state = state.setIn(["searchResults", entry[0]], entry[1]);
      });
      return state;
    }
    default:
      return state;
  }
}