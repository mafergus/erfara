require('./stylesheets/main.scss');
import routes from './AppRoutes';
import React from 'react';
import ReactDOM from 'react-dom';
import store from './store/store';
import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

// Create the mount point and attach it to the DOM
const mountNode = document.createElement('div');
mountNode.setAttribute("id", "mountNode");
document.body.appendChild(mountNode);
// var s = document.createElement('script');
// s.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyChUwoYCrqOAWuO3YW-f_4bShyyH7UkbEc&libraries=places";
// document.head.appendChild(s);

const main = <Provider store={store}>
  <Router
    history={browserHistory}
    onUpdate={() => window.scrollTo(0, 0)}
  >
    {routes(store)}
  </Router>
</Provider>;

ReactDOM.render(main, document.getElementById("mountNode"));