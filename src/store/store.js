import thunk from 'redux-thunk';
import createLogger from "redux-logger";
import { responsiveStoreEnhancer } from 'redux-responsive'; 
import rootReducer from '../reducers/rootReducer';
import { createStore, applyMiddleware, compose } from 'redux';

const logger = createLogger();

// const store = createStore(rootReducer, 
//   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
//   applyMiddleware(thunk, logger)
// );

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  rootReducer,
  composeEnhancers(
    responsiveStoreEnhancer,
    applyMiddleware(thunk, logger),
  )
);

export default store;