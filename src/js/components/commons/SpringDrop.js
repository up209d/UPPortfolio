import React from 'react';

import isEqual from 'lodash.isequal';
import utils from '../../utils';

class SpringDrop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight,
      particle_count: 1500,
      colors: ["#000"], //['#4ECDC4','#F45800','#FF6B6B']
      scanning: 3, // Number of pixel skipping each text analyzing
      areaRadius: 100, // The distance between mouse and dots moving
      dropRadius: 1.8, // Size of each particel
      springConstant: 0.01,
      damperConstant: 0.08,
      textRender: "ULTIMATE PEACE",
      textSize: 150,
      textFont: "Roboto",
      relocate: true, // Relocate particle after its own lifecycle (Slow Performance)
      rotateSpeed: 0.00001,
      shape: ["leaf"],
      randomOffset: 0,
      lifespan: 100, // 1 - 500
      ...this.props.options
    };
  }

  init() {
    this.canvas.style.pointerEvents = 'none';
    this.ctx = this.canvas.getContext('2d');
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
            ctx: this.ctx,
            textArray: this.textArray,
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

  animationComp() {
    this.ctx.clearRect(0, 0, this.state.width, this.state.height);
    // Draw a frame of all particle inside by save and restore
    this.particleArray.map((particle) => {
      particle.ctxDraw();
    });
    this.ctx.globalCompositeOperation = "source-over";
    // Then update all particle position again for next frame
    this.particleArray.map((particle) => {
      particle.ctxUpdate();
    });
  }

  ticker() {
    this.animationComp();
    this.frameCount += 1;
    if (this.frameCount > 60) {
      this.frameCount = 1;
    }
    requestAnimationFrame(this.ticker.bind(this));
  }

  onMouseMove(e) {
    let mPosX = e.clientX || e.screenX || e.pageX;
    let mPosY = e.clientY || e.screenY || e.pageY;
    this.particleArray.map((particle) => {
      let offsetX = particle.state.currentX - mPosX;
      let offsetY = particle.state.currentY - mPosY;
      let distance = Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2));
      if (distance <= this.state.areaRadius) {
        particle.state.speedX += offsetX * 0.1;
        particle.state.speedY += offsetY * 0.1;
      }
    });
  }

  changeText(text = {
    textRender: 'ULTIMATE PEACE',
    textSize: 200,
    textFont: 'Arial'
  }) {
    this.setState({...text});
  }

  updateOnResize(props) {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
      ...props.options
    });
  }

  shouldComponentUpdate(nextProps,nextState) {
    // Props is handle to affect state in componentWillReceiveProps so here we just need to care about the state only
    return !isEqual(this.state,nextState);
  }

  componentDidMount() {
    this.init();
    // Ticker can only be call "1 TIME", if calling is loop somewhere
    // it will slow down animation performance very badly
    this.ticker();
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
    // window.addEventListener('resize', utils.fDebounce(this.updateOnResize.bind(this),250));
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.onMouseMove.bind(this));
    // window.removeEventListener('resize', utils.fDebounce(this.updateOnResize.bind(this),250));
  }

  // componentWillReceiveProps is call before new props assign to component, so we can have do something before that event, exp: if your state base on props, you definitely to setState before the component update, so the new props can affect the state and then component update base on its state
  componentWillReceiveProps(props) {
    this.updateOnResize(props);
  }

  componentDidUpdate() {
    this.update();
  }


  render() {
    return (
      <canvas ref={canvas => this.canvas = canvas} width={this.state.width} height={this.state.height} />
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
        ...e
      };
      this.reState();
      this.reLocation();
    }
  }

  ctxDraw() {
    this.state.ctx.save();
    this.state.ctx.translate(
      this.state.currentX + this.state.dropRadius,
      this.state.currentY + this.state.dropRadius
    );

    if (this.state.rotateSpeed != 0) {
      this.state.ctx.rotate(this.state.rotation * Math.PI / 180);
    }

    this.state.ctx.scale(
      this.state.scaleX,
      this.state.scaleY
    );

    this.state.ctx.globalAlpha = this.state.alpha;
    this.state.ctx.fillStyle = this.state.color;
    this.state.ctx.beginPath();
    switch (this.state.shape) {
      case "circle":
        this.state.ctx.arc(0, 0, this.state.dropRadius, 0, 2 * Math.PI, true);
        break;
      case "square":
        this.state.ctx.moveTo(-this.state.dropRadius, -this.state.dropRadius);
        this.state.ctx.lineTo(-this.state.dropRadius, this.state.dropRadius);
        this.state.ctx.lineTo(this.state.dropRadius, this.state.dropRadius);
        this.state.ctx.lineTo(this.state.dropRadius, -this.state.dropRadius);
        break;
      case "triangle":
        this.state.ctx.moveTo(0, -this.state.dropRadius);
        this.state.ctx.lineTo(-0.866*this.state.dropRadius, 0.5*this.state.dropRadius);
        this.state.ctx.lineTo(0.866*this.state.dropRadius, 0.5*this.state.dropRadius);
        break;
      case "leaf":
        this.state.ctx.moveTo(0, -this.state.dropRadius);
        this.state.ctx.lineTo(this.state.dropRadius / 15, this.state.dropRadius / 2);
        this.state.ctx.lineTo(this.state.dropRadius / 15, this.state.dropRadius * 1.5);
        this.state.ctx.lineTo(this.state.dropRadius, this.state.dropRadius * 2);
        this.state.ctx.lineTo(this.state.dropRadius * 1.93, this.state.dropRadius * 1.5);
        this.state.ctx.lineTo(this.state.dropRadius * 1.93, this.state.dropRadius / 2);
        break;
      default:
        this.state.ctx.arc(0, 0, this.state.dropRadius, 0, 2 * Math.PI, true);
    }
    this.state.ctx.closePath();
    this.state.ctx.fill();
    this.state.ctx.restore();
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
    this.state.speedX += this.accX;
    this.state.speedY += this.accY;
    this.state.alpha -= 1/this.state.lifespan;
    this.state.scaleX = this.state.scaleY += 0.05;
    this.state.currentX += this.state.speedX;
    this.state.currentY += this.state.speedY;

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

    if (this.state.rotateSpeed != 0) {
      this.state.rotation = Math.random() * 360;
    }

    if (relocate) {
      this.reLocation();
    }
  }

  reLocation() {
    let coordinate = this.state.textArray[~~(Math.random() * this.state.textArray.length)];
    this.state.originX = this.state.currentX = coordinate.x + ~~(this.state.randomOffset / 2 - Math.random() * this.state.randomOffset);
    this.state.originY = this.state.currentY = coordinate.y + ~~(this.state.randomOffset / 2 - Math.random() * this.state.randomOffset);
  }

}

export default SpringDrop;