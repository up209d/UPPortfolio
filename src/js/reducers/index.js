import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

if (!process.env.BROWSER) {
  global.window = {};
}

import UI from './UI';
import Interactive from './Interactive';

const appReducers = combineReducers({
  UI,
  Interactive,
  routing: routerReducer
});

export default appReducers;
