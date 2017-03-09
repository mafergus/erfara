import { combineReducers } from "redux";
import { eventsReducer } from 'reducers/eventsReducer';
import { authedUserReducer } from "reducers/authedUserReducer";
import { usersReducer } from "reducers/usersReducer";
import { locationSearchReducer } from "reducers/locationSearchReducer";

const rootReducer = combineReducers({
  authedUser: authedUserReducer,
  locationSearch: locationSearchReducer,
  events: eventsReducer,
  users: usersReducer,
});

export default rootReducer;