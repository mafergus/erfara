
export function addCategories(categories) {
  return dispatch => dispatch({ type: "GET_CATEGORIES_SUCCESS", categories });
}

export function addCategorySearchResults(categories) {
  return dispatch => dispatch({ type: "GET_CATEGORIES_SEARCH_RESULTS_SUCCESS", categories });
}