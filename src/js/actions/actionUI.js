import * as types from './actionTypes';

export function toggleBanner(e=false) {
  return {
    type: types.TOGGLE_BANNER,
    value: e
  }
}

export function toggleResume(e=false) {
  return {
    type: types.TOGGLE_RESUME,
    value: e
  }
}

export function toggleSkills(e=false) {
  return {
    type: types.TOGGLE_SKILLS,
    value: e
  }
}

export function toggleWorks(e=false) {
  return {
    type: types.TOGGLE_WORKS,
    value: e
  }
}

export function toggleContact(e=false) {
  return {
    type: types.TOGGLE_CONTACT,
    value: e
  }
}

export function onResizeWindow() {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
    type: types.ON_RESIZE_WINDOW
  }
}