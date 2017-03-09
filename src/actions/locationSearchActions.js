export function addLocationSearchResults(results) {
  return dispatch => dispatch({ type: "GET_LOCATION_SEARCH_SUCCESS", results });
}