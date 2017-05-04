import React from 'react';
import * as PIXI from 'pixi.js';
import isEqual from 'lodash.isequal';
import utils from '../../utils';

class PixiSpringDrop extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight,
      particleCount: 2222, // Auto or Number
      colors: ['#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#E50000'], //['#4ECDC4','#F45800','#FF6B6B']
      scanning: 3, // Number of pixel skipping each text analyzing
      areaRadius: 100, // The distance between mouse and dots moving
      dropRadius: 0.1, // Size of each particle
      springConstant: 0.01,
      damperConstant: 0.05,
      textWords: [
        "FRONT-END",
        "WEB/APP",
        "UI/UX"
      ],
      timeOut: 5000,
      textSize: "auto", // 135 // Can be a number or 'auto' (90% of canvas width)
      maxTextSizeWidth: 960, // maxTextSizeWidth when textSize is auto
      textFont: "Roboto",
      relocate: true, // Relocate particle after its own lifecycle (Slow Performance)
      rotateSpeed: 0.01,
      shape: ["leaf"],
      randomOffset: 0,
      lifespan: 79, // 1 - 500
      ...this.props.options
    };

    // Scrolling have to be throttling
    this.onScrolling = utils.fThrottle(this.onScrolling.bind(this),30);

    this.onMouseMove = this.onMouseMove.bind(this);
    this.animationComp = this.animationComp.bind(this);
  }

  init() {
    if (this.App) {
      this.App.renderer.resize(this.state.width, this.state.height);
      //Update off canvas width and height to the Real Canvas
      this.offCanvas.width = this.state.width;
      this.offCanvas.height = this.state.height;

    } else {

      this.activeCanvas = this.canvas;
      this.App = new PIXI.Application(this.state.width, this.state.height, {
        view: this.canvas,
        transparent: true,
        // backgroundColor: 0xffffff, //0xffe500
        resolution: window.devicePixelRatio
      });

      // Avoid Flash of Black Screen by render stage immediately
      this.App.renderer.render(this.App.stage);

      this.paticleTexture = new PIXI.Texture.fromImage(require('Images/particle.png'));
      this.offCanvas = document.createElement('canvas');
      this.offCanvas.width = this.state.width;
      this.offCanvas.height = this.state.height;
      this.ctx = this.offCanvas.getContext('2d');
      this.frameCount = 0;

    }

    this.update();
  }

  changeView(view) {
    if (view) {
      // console.log('Change Canvas View');
      this.activeCanvas = view;
      this.App.ticker.destroy();
      this.App.stage.destroy({
        children: true,
        texture: false,
        baseTexture: false
      });
      delete this.App;
      // Beware that when re-create new PIXI Application, mean the Ticker is new
      // Thus, the old ticker still work and we dont have any ref to the old ticker
      // so we can remove the animation update function in the old ticker
      // Calling destroy the old ticker before set new PIXI Application is wise
      // Re-add the animation to new ticker
      this.App = new PIXI.Application(this.state.width, this.state.height, {
        view: view,
        transparent: true,
        // backgroundColor: 0xffffff, //0xffe500
        resolution: window.devicePixelRatio
      });

      view.style.width = this.state.width + 'px';
      view.style.height = this.state.height + 'px';
      view.style.pointerEvents = 'none';

      // Avoid Flash of Black Screen by render stage immediately
      this.App.renderer.render(this.App.stage);

      this.update();
      this.App.ticker.add(this.animationComp);

    } else {
      return false;
    }
  }


  update() {
    this.activeCanvas.style.width = this.state.width + 'px';
    this.activeCanvas.style.height = this.state.height + 'px';

    this.App.stage.removeChildren(0, this.App.stage.children.length);

    if (this.particleArray) {
      this.particleArray.map((particle) => {
        particle.destroy();
      });
      this.particleArray.splice(0, this.particleArray.length)
    }
    else {
      this.particleArray = [];
    }

    this.textArray = this.renderText(this.state.textWords[0]);

    if (this.textArray.length) {
      for (let i = 0; i < this.state.particleCount; i++) {
        this.particleArray.push(
          new Particle({
            container: this.App.stage,
            texture: this.paticleTexture,
            getTextArray: () => {
              return this.textArray
            },
            dropRadius: this.state.dropRadius,
            springConstant: this.state.springConstant,
            damperConstant: this.state.damperConstant,
            colors: this.state.colors,
            relocate: this.state.relocate,
            rotateSpeed: Math.random() * this.state.rotateSpeed - this.state.rotateSpeed / 2,
            randomOffset: this.state.randomOffset,
            lifespan: this.state.lifespan,
            shape: this.state.shape[~~(Math.random() * this.state.shape.length)]
          })
        );
      }
    }
  }

  updateOnResize(props) {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
      ...props.options
    });
  }

  animationComp() {
    // console.log("Animating");
    this.particleArray.map((particle) => {
      particle.ctxUpdate();
    });
  }

  renderText(text) {

    // Text is being rendered on OffCanvas one, so dont forget to update
    // the width and height of OffCanvas to match the real Canvas

    let textSize = this.state.textSize == 'auto' ?
      this.state.width > this.state.maxTextSizeWidth ?
        1.5 * this.state.maxTextSizeWidth / text.length :
        1.5 * this.state.width / text.length : this.state.textSize;

    textSize = textSize > 140 ? 140 : textSize;

    this.ctx.clearRect(0, 0, this.state.width, this.state.height);
    this.ctx.textBaseline = "top";
    this.ctx.textAlign = "center";
    this.ctx.font = `${textSize}px ${this.state.textFont}`;
    this.ctx.fillText(text, this.state.width / 2, this.state.height / 2 - textSize);

    // Get Max Value in Array
    // let maxLength = this.state.textWords.reduce((a, b) => {
    //   return a.length > b.length ? a.length : b.length;
    // });

    // Test Draw Picture
    // let picture = new Image();
    // picture.src = require('Images/cat.svg');
    // this.ctx.clearRect(0, 0, this.state.width, this.state.height);
    // this.ctx.drawImage(
    //   picture,
    //   this.state.width/2 - Math.min(this.state.width ,this.state.height)/2,
    //   this.state.height/2 - Math.min(this.state.width ,this.state.height)/2
    // );


    let textArray = [];
    let data = this.ctx.getImageData(0, 0, this.state.width, this.state.height).data;
    for (let i = 0; i <= this.state.height; i += this.state.scanning) {
      for (let j = 0; j <= this.state.width; j += this.state.scanning) {
        // data[0]  = red channel of first pixel on first row
        // data[1]  = green channel of first pixel on first row
        // data[2]  = blue channel of first pixel on first row
        // data[3]  = alpha channel of first pixel on first row
        //
        // data[4]  = red channel of second pixel on first row
        // data[5]  = green channel of second pixel on first row
        // data[6]  = blue channel of second pixel on first row
        // data[7]  = alpha channel of second pixel on first row
        //
        // data[8]  = red channel of third pixel on first row
        // data[9]  = green channel of third pixel on first row
        // data[10] = blue channel of third pixel on first row
        // data[11] = alpha channel of third pixel on first row
        let eachPixelAlpha = ((i * this.state.width + j) * 4) + 3;
        // 0 4 8 12 ... ( Red Channel of each Pixel )
        // Our target is 3 7 11 15 19 which is +3
        if (data[eachPixelAlpha]) {
          textArray.push({x: j, y: i});
        }
      }
    }
    this.ctx.clearRect(0, 0, this.state.width, this.state.height);
    return textArray;
  }


  onMouseMove(e) {
    let mOffsetX = window.scrollX || window.pageXOffset;
    let mOffsetY = window.scrollY || window.pageYOffset;

    let mPosX = (e.clientX || e.screenX || e.pageX) + mOffsetX;
    let mPosY = (e.clientY || e.screenY || e.pageY) + mOffsetY;

    let movementX = e.movementX || 0;
    let movementY = e.movementY || 0;

    // movementX and Y might not stable when mouse move out of viewport
    // make some weird animation, so better to set the maxSpeed of acceptation
    let mSpeedX = Math.abs(movementX) < 50 ? movementX : 50 || 0;
    let mSpeedY = Math.abs(movementY) < 50 ? movementY : 50 || 0;

    mSpeedX = mSpeedX/(window.devicePixelRatio || 1);
    mSpeedY = mSpeedY/(window.devicePixelRatio || 1);


    let canvas = (this.activeCanvas || this.canvas).getBoundingClientRect();
    let body = document.body.getBoundingClientRect();


    let canvasOffsetX = canvas.left - body.left;
    let canvasOffsetY = canvas.top - body.top;

    this.particleArray.map((particle) => {
      let offsetX = canvasOffsetX + particle.state.currentX - mPosX;
      let offsetY = canvasOffsetY + particle.state.currentY - mPosY;
      let distance = Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2));
      if (distance <= this.state.areaRadius) {
        particle.state.speedX += offsetX * 0.05 + mSpeedX * 0.3;
        particle.state.speedY += offsetY * 0.05 + mSpeedY * 0.6;
      }
    });
  }

  onScrolling() {
    // let data = this.canvas.getBoundingClientRect();
    // if (data.bottom < 0) {
    if (window.scrollY >= 1800) {
      if (!this.isDownCanvas) {
        this.isDownCanvas = true;
        this.changeView(document.getElementById('FooterCanvas'));
        this.oldTextWords = this.state.textWords;
        this.setState({
          textWords: ['NICE TO MEET YOU!'],
          colors: ['#FFFFFF']
        });
      }
    } else {
      if (this.isDownCanvas) {
        this.isDownCanvas = false;
        this.changeView(this.canvas);
        this.setState({
          textWords: this.oldTextWords,
          colors: ['#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#E50000']
        });
      }
    }
  };

  shouldComponentUpdate(nextProps, nextState) {
    // Props is handle to affect state in componentWillReceiveProps so here we just need to care about the state only
    // console.log(this.props,nextProps);
    return !isEqual(this.state, nextState) || !isEqual(this.props, nextProps);
  }

  // componentWillReceiveProps is call before new props assign to component, so we can have do something before that event, exp: if your state base on props, you definitely to setState before the component update, so the new props can affect the state and then component update base on its state
  componentWillReceiveProps(props) {
    this.updateOnResize(props);
  }

  componentDidMount() {
    this.init();
    this.App.ticker.add(this.animationComp);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('scroll', this.onScrolling);

    let currentIndex = 0;
    this.interval = setInterval(() => {
      if (currentIndex >= this.state.textWords.length) {
        currentIndex = 0;
      }
      this.textArray = this.renderText(this.state.textWords[currentIndex]);
      currentIndex++;
      // this.changeText({textRender: this.state.textArray[currentIndex]});
      // console.log(this.state.textWords[currentIndex]);
    }, this.state.timeOut);

    // setTimeout(()=>{
    //   console.log('Stop');
    //   this.App.ticker.stop();
    // },5000);
    // setTimeout(()=>{
    //   console.log('Start');
    //   this.App.ticker.start();
    // },7000);

  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('scroll', this.onScrolling);
    this.App.ticker.remove(this.animationComp);
    clearInterval(this.interval);
  }

  componentWillUpdate() {

  }

  componentDidUpdate() {
    this.init();
  }

  render() {
    return (
      <canvas ref={canvas => this.canvas = canvas} style={{width: this.state.width, height: this.state.height}}/>
    )
  }

}

class Particle {
  constructor(e) {
    if (e) {
      this.state = {
        willDestroy: false,
        currentX: 0,
        currentY: 0,
        originX: 0,
        originY: 0,
        speedX: 25 - Math.random() * 50,
        speedY: 25 - Math.random() * 50,
        color: "#ffffff",
        alpha: 1,
        scaleX: 0,
        scaleY: 0,
        accX: 0,
        accY: 0,
        rotation: 0,
        weight: 1,
        ...e
      };
      this.reLocation();
      this.reState();
      this.Sprite = new PIXI.Sprite(this.state.texture);
      this.Sprite.anchor.set(0.5);
      this.Sprite.position.set(this.state.currentX, this.state.currentY);
      this.Sprite.alpha = this.state.alpha;
      this.Sprite.scale.set(this.state.scaleX, this.state.scaleY);
      this.Sprite.tint = "0x" + this.state.color.substring(1, this.state.color.length);
      this.state.container.addChild(this.Sprite);
    }
  }

  ctxUpdate() {
    // F = m*a => m is 1 here as no weight care so F = a = delta Velocity (acc), F = F(kx) - F(ms) Fx = -k*dx - b*Vx
    // k: spring constant, b: damper constant
    // dx: the distance from currentX and originX
    // Vx: the current velocity of X
    // m*a = -k*x -b*Vx, m = 1 - cuz we dont care about weight
    // so ax = -k*dx - b+Vx, ax is accleration of X
    this.accX = -this.state.springConstant * (this.state.currentX - this.state.originX) - this.state.damperConstant * this.state.speedX;
    this.accY = -this.state.springConstant * (this.state.currentY - this.state.originY) - this.state.damperConstant * this.state.speedY;
    this.state.speedX += this.accX / this.state.weight;
    this.state.speedY += this.accY / this.state.weight;
    this.state.alpha -= 1 / this.state.lifespan;
    this.state.scaleX = this.state.scaleY += 0.005;
    this.state.weight += 0.005; // Weight is bigger so acceleration will be smaller, cuz it s big so harder to change momentum
    this.state.currentX += this.state.speedX;
    this.state.currentY += this.state.speedY;

    // Apply State to Composition
    this.Sprite.position.set(this.state.currentX, this.state.currentY);
    this.Sprite.alpha = this.state.alpha;
    this.Sprite.rotation = this.state.rotation;
    this.Sprite.scale.set(this.state.scaleX, this.state.scaleY);

    if (this.state.rotateSpeed != 0) {
      this.state.rotation += this.state.rotateSpeed;
    }

    if (this.state.alpha <= 0) {
      if (!this.state.willDestroy) {
        this.reState(this.state.relocate);
      } else {
        this.destroy();
      }
    }

  }

  reState(relocate = false) {
    this.state.color = this.state.colors[~~(Math.random() * this.state.colors.length)];
    this.state.scaleX = this.state.scaleY = 0;
    this.state.alpha = Math.random();
    this.state.weight = 1;

    if (this.state.rotateSpeed != 0) {
      this.state.rotation = Math.random() * 360;
    }

    if (relocate) {
      this.reLocation();
    }
  }

  reLocation() {
    let textArray = this.state.getTextArray();
    let coordinate = textArray[~~(Math.random() * textArray.length)];
    this.state.originX = this.state.currentX = coordinate.x + ~~(this.state.randomOffset / 2 - Math.random() * this.state.randomOffset);
    this.state.originY = this.state.currentY = coordinate.y + ~~(this.state.randomOffset / 2 - Math.random() * this.state.randomOffset);
  }

  _destroy() {
    this.state.willDestroy = true;
  }

  // Self Destroy, un-reference it
  // If you store it anywhere like in an Array,
  // there's still null object left in array,
  // just free or Pop that Array
  // So all data will go to gabage-allocation
  destroy() {
    this.Sprite.destroy();
    delete this;
  }

}

export default PixiSpringDrop;