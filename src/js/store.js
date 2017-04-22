import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { browserHistory, hashHistory } from 'react-router';
import { routerMiddleware, syncHistoryWithStore } from 'react-router-redux';

import appReducers from './reducers';

// It should be here due to the structure of our code, in server rendering,
// the first component is imported is store.js
if (!process.env.BROWSER) {
  global.window = {};
}

const store = createStore(
  appReducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(
    thunk,
    routerMiddleware(browserHistory)
  )
);

export const storeHistory = process.env.BROWSER ? syncHistoryWithStore(browserHistory, store) : null;

console.log('Store inited: ', store.getState());
export default store;
