if (window) {
  window.onbeforeunload = () => {
    window.scrollTo(0,0);
  };
}

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

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import '../scss/app.scss';

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

// Font load can cause a flash of unloaded font & css,
// that will bring uncorrect size and position detecting
// thus, size and position detect in componentDidMount
// Wont be accurate and as expected, make sure the font is truly load,
// before anything kick in

import WebFontLoader from 'webfontloader';

WebFontLoader.load({
  google: {
    families: ['Roboto']
  },
  active: ()=>{
    // Prevent "the flash unstyle state" of the site in beginning,
    // it will make every position size detection wrong,
    // also causes the scroll terrible behavior
    setTimeout(()=>{
      let preload = document.getElementById('preload');
      preload.parentNode.removeChild(preload);
      DOMRenderer();
    },100);
  }
});



// If you want to make an preloading you can make it here,
// otherwise inside the app.js components


