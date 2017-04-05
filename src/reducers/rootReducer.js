import { combineReducers } from "redux";
import { eventsReducer } from 'reducers/eventsReducer';
import { authedUserReducer } from "reducers/authedUserReducer";
import { usersReducer } from "reducers/usersReducer";
import { locationSearchReducer } from "reducers/locationSearchReducer";
import { categoriesReducer } from "reducers/categoriesReducer";
import { imagesReducer } from "reducers/imagesReducer";

const rootReducer = combineReducers({
  authedUser: authedUserReducer,
  categories: categoriesReducer,
  events: eventsReducer,
  images: imagesReducer,
  locationSearch: locationSearchReducer,
  users: usersReducer,
});

export default rootReducer;