import * as types from './actionTypes';

export function onMouseMove(e) {
  return {
    mouseX: (e.clientX || e.screenX || e.pageX),
    mouseY: (e.clientY || e.screenY || e.pageY),
    type: types.ON_MOUSE_MOVE
  }
}


export function onTouchMove(e) {
  return {
    touchX: (e.clientX || e.screenX || e.pageX),
    touchY: (e.clientY || e.screenY || e.pageY),
    type: types.ON_TOUCH_MOVE
  }
}

export function onScrolling() {
  return {
    scrollX: window.scrollX,
    scrollY: window.scrollY,
    type: types.ON_SCROLLING
  }
}