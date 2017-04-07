import * as types from '../actions/actionTypes';
import utils from '../utils';

// Normally the switch need break in each case, but because we just use return
// return will escape switch and function immediately so that why we dont need break

const prefix = 'Redux UI Reducer: '

const UI = (state = {
  width: window.innerWidth || 0,
  height: window.innerHeight || 0,
  handheld: utils.browserDetection.isHandHeld() || (window.innerWidth<=640),
  mouseX: 0,
  mouseY: 0,
  banner: {
    touch_avatar: false
  }
}, action = {}) => {
  switch (action.type) {
    case types.BANNER_TOUCH_AVATAR:
      console.log(prefix+'Banner Touched');
      return {
        ...state,
        banner: {
          touch_avatar: true
        }
      };
    case types.BANNER_UNTOUCH_AVATAR:
      console.log(prefix+'Banner Untouched');
      return {
        ...state,
        banner: {
          touch_avatar: false
        }
      };
    case types.ON_RESIZE_WINDOW:
      console.log(prefix+'Window Resized');
      return {
        ...state,
        width: window.innerWidth,
        height: window.innerHeight,
        handheld: utils.browserDetection.isHandHeld() || (window.innerWidth<=640)
      };
    default:
      return state;
  }
};

export default UI;