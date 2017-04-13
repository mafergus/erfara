import { combineReducers } from "redux";
import { responsiveStateReducer } from 'redux-responsive';
import { eventsReducer } from 'reducers/eventsReducer';
import { authedUserReducer } from "reducers/authedUserReducer";
import { usersReducer } from "reducers/usersReducer";
import { locationSearchReducer } from "reducers/locationSearchReducer";
import { categoriesReducer } from "reducers/categoriesReducer";
import { imagesReducer } from "reducers/imagesReducer";
import { conversationsReducer } from "reducers/conversationsReducer";

const appReducer = combineReducers({
  authedUser: authedUserReducer,
  categories: categoriesReducer,
  conversations: conversationsReducer,
  events: eventsReducer,
  images: imagesReducer,
  locationSearch: locationSearchReducer,
  browser: responsiveStateReducer,
  users: usersReducer,
});

 const rootReducer = (state, action) => {
  if (action.type === "SIGN_OUT_USER") {
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;