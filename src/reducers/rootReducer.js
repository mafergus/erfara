import { combineReducers } from "redux";
import { eventsReducer } from './eventsReducer';
import { messagesReducer } from "./messagesReducer";
import { authedUserReducer } from "./authedUserReducer";
import { conversationsReducer } from "./conversationsReducer";
import { usersReducer } from "./usersReducer";
import { feedReducer } from "./feedReducer";

const rootReducer = combineReducers({
  authedUser: authedUserReducer,
  conversations: conversationsReducer,
  events: eventsReducer,
  feed: feedReducer,
  messages: messagesReducer,
  users: usersReducer,
});

export default rootReducer;