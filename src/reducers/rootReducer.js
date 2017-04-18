import { combineReducers } from "redux";
import { responsiveStateReducer } from 'redux-responsive';
import { eventsReducer } from 'reducers/eventsReducer';
import { authedUserReducer } from "reducers/authedUserReducer";
import { usersReducer } from "reducers/usersReducer";
import { locationSearchReducer } from "reducers/locationSearchReducer";
import { categoriesReducer } from "reducers/categoriesReducer";
import { imagesReducer } from "reducers/imagesReducer";
import { conversationsReducer } from "reducers/conversationsReducer";
import { feedReducer } from "reducers/feedReducer";

const appReducer = combineReducers({
  authedUser: authedUserReducer,
  categories: categoriesReducer,
  conversations: conversationsReducer,
  events: eventsReducer,
  feeds: feedReducer,
  images: imagesReducer,
  locationSearch: locationSearchReducer,
  browser: responsiveStateReducer,
  users: usersReducer,
});

 const rootReducer = (state, action) => {
  let newState = state;
  if (action.type === "SIGN_OUT_USER") {
    newState = undefined;
  }

  return appReducer(newState, action);
};

export default rootReducer;