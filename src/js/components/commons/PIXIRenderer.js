import React from 'react';
import ReactDOM from 'react-dom';
import * as PIXI from 'pixi.js'; // or const PIXI = require('pixi.js');
import { TweenMax } from 'gsap';

import backgroundImage from '../../../assets/images/bg_train.jpg';
import lightleakImage from '../../../assets/images/bokeh.jpg';

// console.log(window.devicePixelRatio);
// For Debounce Function
import utils from '../../utils';

class PIXIRenderer extends React.Component {
  constructor(props, context) {
    super(props);
    this.defaultState = {
      width: window.innerWidth,
      height: window.innerHeight,
      options: {
        backgroundColor: 0x000000
      }
    };
    this.state = {
      ...this.defaultState,
      ...this.props.options
    };
  }

  initRenderer() {
    let canvas = ReactDOM.findDOMNode(this.canvas);
    if (this.Application) {
      this.Application.stop();
      delete this.Application;
    }

    this.Application = new PIXI.Application(
      this.state.width,
      this.state.height,
      {
        ...this.state.options,
        view: canvas
      }
    );

    // Background Image
    this.backgroundContainer = new PIXI.Container();
    this.backgroundTexture = PIXI.Texture.fromImage(backgroundImage);
    this.backgroundSprite = new PIXI.Sprite(this.backgroundTexture);
    this.backgroundSprite.anchor.set(0.5);
    this.backgroundSprite.position.set(window.innerWidth / 2, 300);
    // Wiggle shaking train effect
    this.wiggle(this.backgroundSprite, this.backgroundSprite.x, this.backgroundSprite.y);
    // Add to compositon
    this.backgroundContainer.addChild(this.backgroundSprite);
    this.Application.stage.addChild(this.backgroundContainer);

    // Apply Blur Filter
    this.blurFilter = new PIXI.filters.BlurFilter();
    this.blurFilter.blur = 0;
    this.backgroundSprite.filters = [this.blurFilter];

    // // LightLeak Effect
    // this.lightleakTexture = PIXI.Texture.fromImage(lightleakImage);
    // this.lightleakSprite = new PIXI.Sprite(this.lightleakTexture);
    // this.lightleakSprite.anchor.set(0.5);
    // this.lightleakSprite.alpha = 0.35;
    // this.lightleakSprite.position.set(window.innerWidth/2,360);
    // this.lightleakSprite.scale.set(-5);
    // this.lightleakSprite.blendMode= PIXI.BLEND_MODES.ADD;
    // TweenMax.to(this.lightleakSprite,5,{
    //   alpha: 0.1,
    //   repeat:-1,
    //   yoyo: true,
    //   easing: Power3.easeInOut
    // });
    // this.Application.stage.addChild(this.lightleakSprite);

    // Shadow Top with Canvas Overlay Gradient
    // Offscreen Canvas Texture
    let offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = 1;
    offscreenCanvas.height = this.state.height;
    let ctx = offscreenCanvas.getContext('2d');
    let gradient = ctx.createLinearGradient(0, 0, 1, this.state.height);
    gradient.addColorStop(0, 'black');
    gradient.addColorStop(0.1, "black");
    gradient.addColorStop(0.8, "white");
    gradient.addColorStop(1, 'white');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1, this.state.height)
    // Shadow Sprite on Top
    this.shadowTexture = PIXI.Texture.fromCanvas(offscreenCanvas);
    this.shadowSprite = new PIXI.extras.TilingSprite(this.shadowTexture, this.state.width, this.state.height);
    this.shadowSprite.blendMode = PIXI.BLEND_MODES.MULTIPLY;
    this.shadowSprite.alpha = 0.4;
    // Add to compositon
    this.Application.stage.addChild(this.shadowSprite);
    this.dimTopLight();
    // Get Black Layer
    this.brightnessSprite = new PIXI.Graphics();
    this.brightnessSprite.beginFill(0x000000);
    this.brightnessSprite.drawRect(0, 0, this.state.width, this.state.height);
    this.brightnessSprite.alpha = 0.4;
    // Add to composition
    this.Application.stage.addChild(this.brightnessSprite);
    this.dimBrightness();
  }

  dimTopLight() {
    let duration = Math.random() + 1;
    let timeout = (Math.random() * 2 + 1) * 1000;
    let dimamount = Math.random() * 0.4 + 0.4;

    TweenMax.killTweensOf(this.shadowSprite);
    TweenMax.to(this.shadowSprite, duration, {
      alpha: dimamount,
      repeat: 1,
      yoyo: true,
      easing: Back.easeIn,
      onComplete: utils.fDebounce(this.dimTopLight.bind(this), timeout)
    });
  }

  dimBrightness() {
    let duration = Math.random() + 2;
    let timeout = (Math.random() * 2 + 1) * 1000;
    let dimamount = Math.random() * 0.4 + 0.4;

    TweenMax.killTweensOf(this.brightnessSprite);
    TweenMax.to(this.brightnessSprite, duration, {
      alpha: dimamount,
      repeat: 1,
      yoyo: true,
      easing: Back.easeIn,
      onComplete: utils.fDebounce(this.dimBrightness.bind(this), timeout)
    });
  }

  blurIn(e = 5) {
    TweenMax.killTweensOf(this.blurFilter);
    TweenMax.to(this.blurFilter, 0.5, {
      blur: e,
      easing: Back.easeOut
    });
  }

  blurOut(e = 5) {
    TweenMax.killTweensOf(this.blurFilter);
    TweenMax.to(this.blurFilter, 0.5, {
      blur: 0,
      easing: Back.easeOut
    });
  }

  wiggle(e, x, y) {

    TweenMax.killTweensOf(e);
    TweenMax.killTweensOf(e.position);
    TweenMax.killTweensOf(e.scale);

    let positionOffset = 3;
    let duration = Math.random() * 0.5 + 0.5;
    let scaleOffset = Math.random() * 0.0025;

    TweenMax.to(e.position, duration, {
      x: x + Math.random() * positionOffset * 2 - positionOffset,
      y: y + Math.random() * positionOffset * 2 - positionOffset,
      repeat: 1,
      yoyo: true,
      easing: Back.easeOut
    });


    TweenMax.to(e.scale, duration, {
      x: 1 + scaleOffset,
      y: 1 + scaleOffset,
      repeat: 1,
      yoyo: true,
      easing: Back.easeOut
    });

    TweenMax.to(e, duration * 0.5, {
      rotation: (Math.random() * positionOffset * 2 - positionOffset) * 0.0005,
      easing: Power2.easeOut,
      repeat: 1,
      yoyo: true,
      onComplete: this.wiggle.bind(this),
      onCompleteParams: [e, x, y]
    });
  }

  updateOnResize(e = {}) {
    let newState = {
      ...this.state,
      width: window.innerWidth,
      height: window.innerHeight,
      options: {
        backgroundColor: 0x000000
      },
      ...this.props.options,
      ...e
    };
    if (JSON.stringify(newState) != JSON.stringify(this.state)) {
      this.setState({
        ...newState
      });
      // this.Application.renderer.resize(this.state.width,this.state.height);
    }
  }

  onWindowResize() {
    return utils.fDebounce(this.updateOnResize.bind(this), 100)
  }

  onMouseMove(e) {
    let offsetAmount = 50;
    let x = this.backgroundContainer.pivot.x;
    let y = this.backgroundContainer.pivot.y;

    let offsetX = ((e.clientX - window.innerWidth) / window.innerWidth) * offsetAmount;
    let offsetY = ((e.clientY - window.innerHeight) / window.innerHeight) * offsetAmount;

    // this.backgroundContainer.pivot.set(offsetX,offsetY);
    let duration = Math.abs((e.clientX - window.innerWidth / 2) / window.innerWidth) + 0.25;
    TweenMax.killTweensOf(this.backgroundContainer.pivot);
    TweenMax.to(this.backgroundContainer.pivot, duration, {
      x: offsetX,
      y: offsetY,
      easing: Power2.easeOut
    });
  }

  componentDidMount() {
    this.initRenderer();
    window.addEventListener('resize', this.onWindowResize());
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize());
    window.removeEventListener('mousemove', this.onMouseMove.bind(this));
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (JSON.stringify(nextState) != JSON.stringify(this.state));
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps.UI.banner) != JSON.stringify(this.props.UI.banner)) {
      if (nextProps.UI.banner.touch_avatar == true) {
        this.blurIn(9);
      } else {
        this.blurOut(9)
      }
    }
  }

  componentDidUpdate() {
    this.initRenderer();
  }

  render() {
    return <canvas className="app-pixi" ref={canvas => this.canvas = canvas}/>
  }
}

export default PIXIRenderer;