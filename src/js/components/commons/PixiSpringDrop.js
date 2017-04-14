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
      particle_count: 1500,
      colors: ['#000', '#000', '#000', '#000', '#000', '#000', '#E50000'], //['#4ECDC4','#F45800','#FF6B6B']
      scanning: 3, // Number of pixel skipping each text analyzing
      areaRadius: 100, // The distance between mouse and dots moving
      dropRadius: 1.5, // Size of each particle
      springConstant: 0.01,
      damperConstant: 0.08,
      textRender: this.props.options.textWords[0] ? this.props.options.textWords[0] : "ULTIMATE PEACE",
      textWords: ["ULTIMATE PEACE"],
      timeOut: 5000,
      textSize: 135,
      textFont: "Roboto",
      relocate: true, // Relocate particle after its own lifecycle (Slow Performance)
      rotateSpeed: 0.00001,
      shape: ["leaf"],
      randomOffset: 0,
      lifespan: 120, // 1 - 500
      ...this.props.options
    };
    this.onMouseMove = this.onMouseMove.bind(this);
    this.animationComp = this.animationComp.bind(this);
  }

  init() {
    this.App = new PIXI.Application(this.state.width, this.state.height, {
      view: this.canvas,
      backgroundColor : 0xffe500,
      resolution: window.devicePixelRatio
    });
    this.offCanvas = document.createElement('canvas');
    this.offCanvas.width = this.state.width;
    this.offCanvas.height = this.state.height;
    this.ctx = this.offCanvas.getContext('2d');
    this.frameCount = 0;
    this.update();
  }

  update() {
    this.textArray = this.renderText(this.state.textRender);
    if (this.particleArray) {
      this.particleArray.splice(0, this.particleArray.length)
    }
    else {
      this.particleArray = [];
    }
    if (this.textArray.length) {
      for (let i = 0; i <= this.state.particle_count; i++) {
        this.particleArray.push(
          new Particle({
            stage: this.App.stage,
            getTextArray: ()=>{return this.textArray},
            dropRadius: this.state.dropRadius,
            springConstant: this.state.springConstant,
            damperConstant: this.state.damperConstant,
            colors: this.state.colors,
            relocate: this.state.relocate,
            rotateSpeed: this.state.rotateSpeed,
            randomOffset: this.state.randomOffset,
            lifespan: this.state.lifespan,
            shape: this.state.shape[~~(Math.random()*this.state.shape.length)]
          })
        );
      }
    }
  }

  animationComp() {
    this.particleArray.map((particle) => {
      particle.ctxUpdate();
    });
  }

  renderText(text) {
    this.ctx.clearRect(0, 0, this.state.width, this.state.height);
    this.ctx.textBaseline = "top";
    this.ctx.textAlign = "center";
    this.ctx.font = `${this.state.textSize}px ${this.state.textFont}`;
    this.ctx.fillText(text, this.state.width / 2, this.state.height / 2 - this.state.textSize);

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
    let mPosX = e.clientX || e.screenX || e.pageX;
    let mPosY = e.clientY || e.screenY || e.pageY;
    let mSpeedX = e.movementX || 0;
    let mSpeedY = e.movementY || 0;

    this.particleArray.map((particle) => {
      let offsetX = particle.state.currentX - mPosX;
      let offsetY = particle.state.currentY - mPosY;
      let distance = Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2));
      if (distance <= this.state.areaRadius) {
        particle.state.speedX += offsetX * 0.05 + mSpeedX * 0.15;
        particle.state.speedY += offsetY * 0.05 + mSpeedY * 0.30;
      }
    });
  }

  componentDidMount(){
    this.init();
    this.App.ticker.add(this.animationComp);
    window.addEventListener('mousemove', this.onMouseMove);
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.onMouseMove);
  }

  render() {
    return (
      <canvas ref={canvas => this.canvas = canvas} style={{width:this.state.width,height:this.state.height}}/>
    )
  }

}

class Particle {
  constructor(e) {
    if (e) {
      this.state = {
        currentX: 0,
        currentY: 0,
        originX: 0,
        originY: 0,
        speedX: 25 - Math.random() * 50,
        speedY: 25 - Math.random() * 50,
        color: "#fff",
        alpha: 1,
        scaleX: 1,
        scaleY: 1,
        accX: 0,
        accY: 0,
        rotation: 0,
        weight: 1,
        ...e
      };
      this.reLocation();
      this.reState();
      this.Sprite = new PIXI.Sprite.fromImage(require('Images/particle.png'));
      this.Sprite.anchor.set(0.5);
      this.Sprite.position.set(this.state.currentX,this.state.currentY);
      this.Sprite.alpha = this.state.alpha;
      this.Sprite.scale.set(this.state.scaleX,this.state.scaleY);
      this.state.stage.addChild(this.Sprite);
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
    this.state.speedX += this.accX/this.state.weight;
    this.state.speedY += this.accY/this.state.weight;
    this.state.alpha -= 1/this.state.lifespan;
    this.state.scaleX = this.state.scaleY += 0.005;
    this.state.weight += 0.005; // Weight is bigger so acceleration will be smaller, cuz it s big so harder to change momentum
    this.state.currentX += this.state.speedX;
    this.state.currentY += this.state.speedY;

    this.Sprite.position.set(this.state.currentX,this.state.currentY);
    this.Sprite.alpha = this.state.alpha;
    this.Sprite.rotation = this.state.rotation;
    this.Sprite.scale.set(this.state.scaleX,this.state.scaleY);

    if (this.state.rotateSpeed != 0) {
      this.state.rotation += this.state.rotateSpeed;
    }

    if (this.state.alpha <= 0) {
      this.reState(this.state.relocate);
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

}

export default PixiSpringDrop;