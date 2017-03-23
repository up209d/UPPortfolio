import * as types from '../actions/actionTypes';
import utils from '../utils'

const UI = (state = {
  handheld: utils.browserDetection.isHandHeld(),
  banner: {
    touch_avatar: false
  }
}, action = {}) => {
  switch (action.type) {
    case types.BANNER_TOUCH_AVATAR:
      return {
        ...state,
        banner: {
          touch_avatar: true
        }
      };
    case types.BANNER_UNTOUCH_AVATAR:
      return {
        ...state,
        banner: {
          touch_avatar: false
        }
      };
    default:
      return state;
  }
};

export default UI;