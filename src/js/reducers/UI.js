import * as types from '../actions/actionTypes';
import utils from '../utils';

// Normally the switch need break in each case, but because we just use return
// return will escape switch and function immediately so that why we dont need break

const prefix = 'Redux UI Reducer: ';

const UI = (state = {
  width: window.innerWidth || 0,
  height: window.innerHeight || 0,
  browser: utils.browserDetection,
  handheld: utils.browserDetection.isHandHeld() || (window.innerWidth<=640),
  mouseX: 0,
  mouseY: 0,
  openBanner: false,
  openResume: false,
  openSkills: false,
  openWorks: false,
  openContact: false
}, action = {}) => {
  switch (action.type) {
    case types.TOGGLE_BANNER:
      console.log('Toggle Banner');
      if (action.value != state.openBanner) {
        return {
          ...state,
          openBanner: action.value
        };
      } else {
        return state;
      }
    case types.TOGGLE_RESUME:
      console.log('Toggle Resume');
      if (action.value != state.openResume) {
        return {
          ...state,
          openResume: action.value
        };
      } else {
        return state;
      }
    case types.TOGGLE_SKILLS:
      console.log('Toggle Skills');
      if (action.value != state.openSkills) {
        return {
          ...state,
          openSkills: action.value
        };
      } else {
        return state;
      }
    case types.TOGGLE_WORKS:
      console.log('Toggle Works');
      if (action.value != state.openWorks) {
        return {
          ...state,
          openWorks: action.value
        };
      } else {
        return state;
      }
    case types.TOGGLE_CONTACT:
      console.log('Toggle Contact');
      if (action.value != state.openContact) {
        return {
          ...state,
          openContact: action.value
        };
      } else {
        return state;
      }
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