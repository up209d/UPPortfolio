import React from 'react';
import ReactDOM from 'react-dom';
import Trianglify from 'trianglify';
import Snap from 'snapsvg';
import { TweenMax } from 'gsap';

// For Debounce Function
import utils from '../../utils';

class TrianglifyRenderer extends React.Component {

  constructor(props, context) {
    super(props);
    let defaultOptions = this.defaultProps();
    this.state = {
      ...defaultOptions,
      width: window.innerWidth,
      height: window.innerHeight,
      seed: 'u.p',
      cell_size: 32, // parseInt(window.innerWidth/30)
      color_space: 'lab',
      x_colors: ["#FFFDAE", "#ff6e47", "#E90029"],
      y_colors: ["#FFFDAE", "#ff6e47", "#E90029"],
      ...this.props.options,
    }
    this.pattern = Trianglify(this.state);
    this.polys = [];
  }

  defaultProps() {
    return Trianglify.defaults;
  }

  updateTrianglify(e = {}) {
    let TrianglifyDOM = ReactDOM.findDOMNode(this.Trianglify);
    let options = {
      ...this.state,
      ...this.props.options,
      ...e
    };
    this.pattern = Trianglify(options);

    switch (this.props.mode) {
      case "canvas": {
        this.pattern.canvas(TrianglifyDOM);
        break;
      }
      case "div": {
        TrianglifyDOM.style.width = `${this.state.width}px`;
        TrianglifyDOM.style.height = `${this.state.height}px`;
        TrianglifyDOM.style.backgroundImage = `url(${this.pattern.png()})`;
        break;
      }
      case "img": {
        TrianglifyDOM.src = this.pattern.png();
        break;
      }
      case "svg": {
        break;
      }
      default: {
        this.pattern.canvas(TrianglifyDOM);
      }
    }
  }

  animatePoly(){
    if (this.props.mode == "svg") {
      // TweenMax.to(this.polys[0].points[0],2,{
      //   x: "+=99",
      //   y: "-=99",
      //   easing: Back.easeOut,
      //   repeat:1,
      //   yoyo: true
      // })
      this.polys.map((poly,index)=>{
        console.log(poly.nodeName,index);
      });
      this.polys.filter((x,i,a)=>{

      })
    }
  }

  updateOnResize() {
    let newState = {
      ...this.state,
      width: window.innerWidth,
      height: window.innerHeight,
      ...this.props.options,
    };
    if (JSON.stringify(newState) != JSON.stringify(this.state)) {
      this.setState({
        ...newState
      });
    }
  }

  onWindowResize() {
    return utils.fDebounce(this.updateOnResize.bind(this), 100);
  }

  componentDidMount() {
    window.addEventListener('resize', this.onWindowResize());
    this.updateTrianglify();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize());
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
    // return (JSON.stringify(nextState) != JSON.stringify(this.state));
  }

  componentWillUpdate() {

  }

  componentDidUpdate() {
    this.updateTrianglify();
  }

  render() {
    switch (this.props.mode) {
      case "canvas": {
        return <canvas className={this.props.className ? 'app-trianglify ' + this.props.className : 'app-trianglify'}
                       ref={Trianglify => this.Trianglify = Trianglify}/>
      }
      case "div": {
        return <div className={this.props.className ? 'app-trianglify ' + this.props.className : 'app-trianglify'}
                    ref={Trianglify => this.Trianglify = Trianglify}/>
      }
      case "img": {
        return <img className={this.props.className ? 'app-trianglify ' + this.props.className : 'app-trianglify'}
                    ref={Trianglify => this.Trianglify = Trianglify}/>
      }
      case "svg": {
        return (
          <svg width={this.state.width} height={this.state.height}
               className={this.props.className ? 'app-trianglify ' + this.props.className : 'app-trianglify'}
               ref={Trianglify => this.Trianglify = Trianglify}>
            <g>
              {this.pattern.polys.map((poly,index)=>{
                return (
                  <polygon
                    ref={eachPolygon => this.polys.push(eachPolygon)}
                    key={index}
                    style={{
                      fill: poly[0],
                      stroke: poly[0]
                    }}
                    points={`${poly[1].join(' ')}`}
                  />
                )
              })}
            </g>
            {/*<g>*/}
              {/*<polygon ref={poly => this.polys.push(poly)} points={this.pattern.polys[119][1].join(' ')} style={{fill: "#00FF00"}} />*/}
            {/*</g>*/}
          </svg>
        )
      }
      default: {
        return <canvas className={this.props.className ? 'app-trianglify ' + this.props.className : 'app-trianglify'}
                       ref={Trianglify => this.Trianglify = Trianglify}/>
      }
    }
  }

}

export default TrianglifyRenderer;
