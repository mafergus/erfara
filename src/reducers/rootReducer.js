import { combineReducers } from "redux";
import { eventsReducer } from './eventsReducer';
import { messagesReducer } from "./messagesReducer";
import { authedUserReducer } from "./authedUserReducer";
import { conversationsReducer } from "./conversationsReducer";
import { usersReducer } from "./usersReducer";
import { feedReducer } from "./feedReducer";
import { userFeedReducer} from "./userFeedReducer";

const rootReducer = combineReducers({
  authedUser: authedUserReducer,
  conversations: conversationsReducer,
  events: eventsReducer,
  feed: feedReducer,
  messages: messagesReducer,
  users: usersReducer,
  userFeed: userFeedReducer
});

export default rootReducer;