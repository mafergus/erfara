
export function locationSearchReducer(state = [], action) {
  switch (action.type) {
    case "GET_LOCATION_SEARCH_SUCCESS": {
      return action.results;
    }
    default:
      return state;
  }
}
