import './stylesheets/main.css';
require('./stylesheets/main.scss');
import AppRoutes from './AppRoutes';
import React from 'react';
import ReactDOM from 'react-dom';
import store from './store/store';
import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

// Create the mount point and attach it to the DOM
var mountNode = document.createElement('div');
mountNode.setAttribute("id", "mountNode");
document.body.appendChild(mountNode);

const main = (
  <Provider store={store}>
    <Router
      history={browserHistory}
      onUpdate={() => window.scrollTo(0, 0)}>
      {AppRoutes}
    </Router>
  </Provider>
);

ReactDOM.render(main, document.getElementById("mountNode"));