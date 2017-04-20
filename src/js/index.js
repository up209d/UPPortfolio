import WebFontLoader from 'webfontloader';

WebFontLoader.load({
  google: {
    families: ['Roboto']
  }
});

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin({
  shouldRejectClick: (lastTouchTimeStamp, clickTimeStamp) => {
    return true;
  }
});

if (process.env.NODE_ENV !== 'production') {
  const {whyDidYouUpdate} = require('why-did-you-update');
  whyDidYouUpdate(
    React,
    {
      include: /^pure/,
      exclude: /^Measure/
    });
}

import '../scss/app.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';


import store from './store';
import storeHistory from './store';

import App from './components/app';

import utils from './utils';

window.requestAnimationFrame = window.requestAnimationFrame
  || window.mozRequestAnimationFrame
  || window.webkitRequestAnimationFrame
  || window.msRequestAnimationFrame
  || function(f){return setTimeout(f, 1000/30)};

window.addEventListener('resize',utils.fDebounce(store.dispatch.bind(this,{type: 'ON_RESIZE_WINDOW'}),250));

const DOMRenderer = () => {
  ReactDOM.render(
    <Provider store={store}>
      <App appHistory={storeHistory}/>
    </Provider>,
    document.getElementById('root')
  );
};

DOMRenderer();
