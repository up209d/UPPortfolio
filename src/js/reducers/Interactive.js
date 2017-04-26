import * as types from '../actions/actionTypes';

const prefix = 'Redux Mouse & Touch Detection: ';

const Interactive = (
  state = {
    mouseX: 0,
    mouseY: 0,
    isMouseMoving: false,
    isTouching: false,
    touchX: 0,
    touchY: 0
  },
  action = {}
) => {
  switch (action.type) {
    case types.ON_MOUSE_MOVE:
      return {
        mouseX: action.mouseX,
        mouseY: action.mouseY,
        isMouseMoving: true,
        isTouching: false
      };
    case types.ON_TOUCH_MOVE:
      return {
        touchX: action.mouseX,
        touchY: action.mouseY,
        isMouseMoving: false,
        isTouching: true
      };
    case types.ON_SCROLLING:
      return {
        scrollX: action.scrollX,
        scrollY: action.scrollY,
      };
    default:
      return state;
  }

};

export default Interactive;