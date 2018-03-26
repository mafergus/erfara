import React from 'react';
import {
  Route,
  IndexRoute,
} from 'react-router';

import App from "./components/App";
import MainPage from "./components/MainPage";
import EventPage from "./components/EventPage/EventPage";
import MessagingPage from "./components/Messaging/MessagingPage";
import UserPage from "./components/UserPage/UserPage";
import AdminPage from "./components/Admin/AdminPage";
import CategoriesPage from "./components/Admin/CategoriesPage";
import UserManagementPage from "./components/Admin/UserManagementPage";
import MobileConversationList from "./components/Messaging/MobileConversationList";
import MobileMessagingPage from "./components/Messaging/MobileMessagingPage";
import store from "store/store";
import { FB_APP_ID } from 'utils/constants';

/**
 * Routes: https://github.com/reactjs/react-router/blob/master/docs/API.md#route
 *
 * Routes are used to declare your view hierarchy.
 *
 * Say you go to http://material-ui.com/#/components/paper
 * The react router will search for a route named 'paper' and will recursively render its
 * handler and its parent handler like so: Paper > Components > App
 */
export default function routes() {
  const state = store.getState();
  const isMobile = state.browser.is.extraSmall;

  const redirectUrl = "http://localhost:3000/handleAuth";
  const URL = `https://www.facebook.com/v2.12/dialog/oauth?client_id=${FB_APP_ID}&redirect_uri=${redirectUrl}&state={"{st=state123abc,ds=123456789}"}`;

  return <Route path="/" component={App}>
    <IndexRoute component={MainPage} />
    <Route path='privacy-policy' component={() => window.location = URL}/>
    <Route path="handleAuth" render={(props) => {
      debugger;
      <App {...props} />
    }} />
    <Route path="messages">
      <IndexRoute component={isMobile ? MobileConversationList : MessagingPage} />
      <Route path="(:id)" component={isMobile ? MobileMessagingPage : MessagingPage} />
    </Route>
    <Route path="event/:id" component={EventPage} />
    <Route path="users/:id" component={UserPage} />
    <Route path="admin">
      <IndexRoute component={AdminPage} />
      <Route path="categories" component={CategoriesPage} />
      <Route path="users" component={UserManagementPage} />
    </Route>
  </Route>;
}
