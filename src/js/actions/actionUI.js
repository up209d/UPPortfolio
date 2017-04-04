import * as types from './actionTypes';

export function bannerTouchAvatar() {
  return {
    type: types.BANNER_TOUCH_AVATAR
  }
}

export function bannerUntouchAvatar() {
  return {
    type: types.BANNER_UNTOUCH_AVATAR
  }
}

export function Nothing() {
  return {
    type: 'Nothing'
  }
}

export function onResizeWindow() {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
    type: types.ON_RESIZE_WINDOW
  }
};
