import React from 'react';
import { Router, browserHistory } from 'react-router';
import store from 'store/store';
import { Provider } from 'react-redux';
import routes from '../AppRoutes';

export default class RootElement extends React.Component {
  render() {
    return <Provider><Router history={browserHistory} onUpdate={() => window.scrollTo(0, 0)}>{routes(store)}</Router></Provider>;
    // return <Provider store={store}>
    //   <Router
    //     history={browserHistory}
    //     onUpdate={() => window.scrollTo(0, 0)}
    //   >
    //     {routes(store)}
    //   </Router>
    // </Provider>;
  }  
}