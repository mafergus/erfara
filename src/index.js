require('./stylesheets/main.scss');
import React from 'react';
import ReactDOM from 'react-dom';
import store from './store/store';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import routes from './AppRoutes';

injectTapEventPlugin();

// Create the mount point and attach it to the DOM
const mountNode = document.createElement('div');
mountNode.setAttribute("id", "mountNode");
document.body.appendChild(mountNode);

ReactDOM.render(
  <Provider store={store}><Router history={browserHistory} onUpdate={() => window.scrollTo(0, 0)}>{routes(store)}</Router></Provider>,
  document.getElementById("mountNode")
  );