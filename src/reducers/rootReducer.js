import { combineReducers } from "redux";
import { responsiveStateReducer } from 'redux-responsive'
import { eventsReducer } from 'reducers/eventsReducer';
import { authedUserReducer } from "reducers/authedUserReducer";
import { usersReducer } from "reducers/usersReducer";
import { locationSearchReducer } from "reducers/locationSearchReducer";
import { categoriesReducer } from "reducers/categoriesReducer";
import { imagesReducer } from "reducers/imagesReducer";
import { conversationsReducer } from "reducers/conversationsReducer";

const rootReducer = combineReducers({
  authedUser: authedUserReducer,
  categories: categoriesReducer,
  conversations: conversationsReducer,
  events: eventsReducer,
  images: imagesReducer,
  locationSearch: locationSearchReducer,
  browser: responsiveStateReducer,
  users: usersReducer,
});

export default rootReducer;