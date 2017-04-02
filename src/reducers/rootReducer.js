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
  images: imagesReducer,
  locationSearch: locationSearchReducer,
  events: eventsReducer,
  users: usersReducer,
});

export default rootReducer;