import Immutable from "immutable";

export function imagesReducer(state = Immutable.Map(), action) {
  switch (action.type) {
    case "GET_IMAGES_SUCCESS": return action.images;
    default:
      return state;
  }
}