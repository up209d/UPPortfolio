import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

if (!process.env.BROWSER) {
  global.window = {};
}

import UI from './UI';

const appReducers = combineReducers({
  UI,
  routing: routerReducer
});

export default appReducers;
