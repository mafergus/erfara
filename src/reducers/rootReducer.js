import { combineReducers } from "redux";
import { eventsReducer } from './eventsReducer';
import { authedUserReducer } from "./authedUserReducer";
import { usersReducer } from "./usersReducer";

const rootReducer = combineReducers({
  authedUser: authedUserReducer,
  events: eventsReducer,
  users: usersReducer,
});

export default rootReducer;