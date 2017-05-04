import MobileDetect from 'mobile-detect';

class Utilities {
  constructor() {
    // Browser Detection
    if (process.env.BROWSER) {
      this.browserDetection = new MobileDetect(window.navigator.userAgent);
      this.browserDetection.OSName="Unknown OS";
      if (window.navigator.appVersion.indexOf("Win")!=-1) this.browserDetection.OSName="Windows";
      if (window.navigator.appVersion.indexOf("Mac")!=-1) this.browserDetection.OSName="MacOS";
      if (window.navigator.appVersion.indexOf("X11")!=-1) this.browserDetection.OSName="UNIX";
      if (window.navigator.appVersion.indexOf("Linux")!=-1) this.browserDetection.OSName="Linux";
      this.browserDetection.isHandHeld = () => {
        if (this.browserDetection.mobile() || this.browserDetection.phone()) {
          return true;
        } else {
          return false;
        }
      }
    } else {
      this.browserDetection = {
        isHandHeld: () => {return false}
      };
    }
  }

  fDebounce(func, wait, immediate) {
    var timeout;
    return function () {
      var context = this, args = arguments;
      var later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    }
  }
  fThrottle(func, delay) {
    var wait = false;
    return function () {
      var context = this, args = arguments;
      if (!wait) {
        func.apply(context, args);
        wait = true;
        setTimeout(function () {
          wait = false;
        }, delay)
      }
    }
  }
  fDelay(func, immediate) {
    var timeout;
    immediate = typeof immediate !== 'undefined' ? immediate : false;
    return function () {
      var context = this, args = arguments;
      args[0] = typeof args[0] !== 'undefined' ? args[0] : 100;
      var later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, args[0]);
      if (callNow) func.apply(context, args);
    }
  }
  hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }
  reMapRange(value,from,to,newFrom,newTo) {
    if (to == from) { return to }
    return (((value-from)/(to-from))*(newTo-newFrom))+newFrom;
  }
}

const utils =  new Utilities();

export default utils;