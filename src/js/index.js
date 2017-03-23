import '../css/app.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';

import store from './store';
import storeHistory from './store';

import App from './components/app'

const DOMRenderer = () => {
  ReactDOM.render(
    <Provider store={store}>
      <App appHistory={storeHistory}/>
    </Provider>,
    document.getElementById('root')
  );
}

DOMRenderer();
