import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import '../scss/app.scss';

import store from './store';
import storeHistory from './store';

import * as actionInteractive from './actions/actionInteractive';

import App from './components/app';

import TweenMax from 'gsap';
import utils from './utils';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin({
  shouldRejectClick: (lastTouchTimeStamp, clickTimeStamp) => {
    return true;
  }
});

if (window) {
  // window.onbeforeunload = () => {
  //   window.scrollTo(0,0);
  // };

  // Firefox, Opera
  window.addEventListener('DOMMouseScroll',function(e){
    // e.preventDefault();
  });

// Edge, Webkit
// Pixi Application conflickr with mousewheel,
// so the scrolling window event make timeout stucking,
// we have to overwrite that
  const handleWheelWebkit = function(e){
    // console.log(e);
    // let y = {value:window.scrollY};
    // let amount = -e.wheelDeltaY || e.deltaY || 0;
    // amount = (amount > 0 && amount < 150) ? 150 : amount;
    // amount = (amount < 0 && amount > -150) ? -150 : amount;
    // TweenMax.to(y,Math.abs(amount)/500,{
    //   value: amount == 0 ? "+=0" : amount > 0 ? "+="+Math.abs(e.deltaY) : "-="+Math.abs(e.deltaY),
    //   ease: Power1.easeOut,
    //   onUpdate: function(){
    //     window.scrollTo(0,y.value);
    //   }
    // });
    // e.preventDefault();
  };
  window.addEventListener('mousewheel',handleWheelWebkit);

  window.requestAnimationFrame = window.requestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.msRequestAnimationFrame
    || function(f){return setTimeout(f, 1000/30)};

  window.addEventListener('resize',utils.fDebounce(store.dispatch.bind(this,{type: 'ON_RESIZE_WINDOW'}),250));
  // window.addEventListener('scroll',(e)=>{
  //   store.dispatch(actionInteractive.onScrolling(e));
  // });
  // window.addEventListener('mousemove',(e)=>{
  //   store.dispatch(actionInteractive.onMouseMove(e));
  // });
  // window.addEventListener('touchmove',(e)=>{
  //   store.dispatch(actionInteractive.onTouchMove(e));
  // });
}

if (process.env.NODE_ENV !== 'production') {
  const {whyDidYouUpdate} = require('why-did-you-update');
  whyDidYouUpdate(
    React,
    {
      include: /^pure/,
      exclude: /^Measure/
    });
}

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