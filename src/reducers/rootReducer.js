import { combineReducers } from "redux";
import { responsiveStateReducer } from 'redux-responsive';
import { eventsReducer } from 'reducers/eventsReducer';
import { authedUserReducer } from "reducers/authedUserReducer";
import { usersReducer } from "reducers/usersReducer";
import { categoriesReducer } from "reducers/categoriesReducer";
import { imagesReducer } from "reducers/imagesReducer";
import { conversationsReducer } from "reducers/conversationsReducer";
import { feedReducer } from "reducers/feedReducer";
import { onboardingReducer } from "reducers/onboardingReducer";

const appReducer = combineReducers({
  authedUser: authedUserReducer,
  categories: categoriesReducer,
  conversations: conversationsReducer,
  events: eventsReducer,
  feeds: feedReducer,
  images: imagesReducer,
  onboarding: onboardingReducer,
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