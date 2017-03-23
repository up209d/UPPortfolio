import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { browserHistory } from 'react-router';
import { routerMiddleware, syncHistoryWithStore } from 'react-router-redux';

import appReducers from './reducers';

const store = createStore(
  appReducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(
    thunk,
    routerMiddleware(browserHistory)
  )
);

export const storeHistory = syncHistoryWithStore(browserHistory, store);

console.log('Store inited: ', store.getState());
export default store;
