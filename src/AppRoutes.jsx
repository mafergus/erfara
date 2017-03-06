import React from 'react';
import {
  Route,
  IndexRoute,
} from 'react-router';

import App from "components/App";
import MainPage from "components/MainPage";
import HomePage from "components/HomePage";
import EventPage from "components/EventPage/EventPage";
import MessagingPage from "components/Messaging/MessagingPage";
import UserPage from "components/UserPage/UserPage";

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
  return <Route path="/" component={App}>
    <IndexRoute component={MainPage} />
    <Route path="messages" component={MessagingPage} />
    <Route path="event/:id" component={EventPage} />
    <Route path="users/:id" component={UserPage} />
    <Route path="home" component={HomePage} />
  </Route>;
}
