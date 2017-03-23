import React from 'react';
import Trianglify from 'trianglify';
import { TweenMax } from 'gsap';

// For Debounce Function
import utils from '../../utils';

class TrianglifySVG extends React.Component {

  constructor(props, context) {
    super(props);
    let defaultOptions = this.defaultProps();
    this.state = {
      ...defaultOptions,
      width: window.innerWidth,
      height: window.innerHeight,
      seed: 'u.p',
      cell_size: Math.sqrt(window.innerWidth)*2.5, // parseInt(window.innerWidth/30)
      color_space: 'lab',
      variance: "0.5",
      x_colors: ["#000","#000","#FFF","#000","#000"],
      y_colors: ["#000","#000","#FFF","#000","#000"],
      // y_colors: ["#FFFDAE", "#ff6e47", "#E90029"],
      ...this.props.options
    };
    this.pattern = Trianglify(this.state);
    this.polys = [];
  }

  defaultProps() {
    return Trianglify.defaults;
  }

  animateSVG() {
    // console.log(this.polys);
    // No Animation in phone
    if (!this.props.UI.handheld) {
      let vertexs = [];
      // For Chrome SVG Point is avaiable, but for IE SVG Point have to get by getItem(index) method
      // So vertexs.push(poly.points[0]); will not work for IE instead of poly.points.getItem(0)
      this.polys.map((poly) => {
        // Avoid null Poly, idk why there s null Poly here
        if (poly) {
          vertexs.push(poly.points.getItem(0));
          vertexs.push(poly.points.getItem(1));
          vertexs.push(poly.points.getItem(2));
        }
      });
      // console.log(this.polys[10].points);
      let vertexSets = [];
      vertexs.forEach((vertex, index) => {
        let vertexSet = vertexs.filter((matchVertex)=>{
          return vertex.x == matchVertex.x && vertex.y == matchVertex.y
        });

        if(!vertexSets.some((matchVertexSet)=>{
            return matchVertexSet[0].x == vertexSet[0].x && matchVertexSet[0].y == vertexSet[0].y
          })) {
          vertexSets.push(vertexSet);
        }
      });
      // console.log(vertexSets);
      vertexSets.forEach((vertexSet,index)=>{
        let duration = Math.random()*4+4;
        let offsetX = Math.random()*400-200;
        let offsetY = Math.random()*400-200;
        vertexSet.map((eachVertex)=>{
          TweenMax.killTweensOf(eachVertex);
          TweenMax.from(eachVertex,duration,{
            x: "+="+offsetX,
            y: "+="+offsetY,
            easing: Power3.easeInOut,
            repeat:-1,
            yoyo: true,
            immediateRender: true
          })
        });
      });
    }
  }

  updateOnResize() {
    let options = {
      ...this.state,
      width: window.innerWidth,
      height: window.innerHeight,
      cell_size: Math.sqrt(window.innerWidth)*2.5,
      ...this.props.options
    };
    this.pattern = Trianglify(options);
    this.setState({
      ...options
    });
  }

  onWindowResize() {
    return utils.fDebounce(this.updateOnResize.bind(this), 250);
  }

  componentDidMount() {
    window.addEventListener('resize', this.onWindowResize());
    this.animateSVG();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(nextState) != JSON.stringify(this.state);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize());
  }

  componentWillUpdate() {
    this.polys = [];
  }

  componentDidUpdate() {
    // console.log(this.polys);
    this.animateSVG();
  }

  polygonOnHover(e,type) {
    let colorArray = ["#ffffcc","#ffeda0","#fed976","#feb24c","#fd8d3c","#fc4e2a","#e31a1c","#bd0026","#800026"];
    let randomColor = colorArray[Math.abs(parseInt(Math.sin((new Date()).getTime()*0.001)*colorArray.length))];
    switch (type) {
      case 'enter': {
        TweenMax.killTweensOf(e.target.style);
        TweenMax.to(e.target.style,0.1,{
          fill: randomColor,
          stroke: randomColor,
          fillOpacity: 0.5,
          strokeOpacity: 0.9,
          easing: Power3.easeOut
        });
        break;
      }
      case 'leave': {
        TweenMax.killTweensOf(e.target.style);
        TweenMax.to(e.target.style,2,{
          fill: JSON.parse(e.target.getAttribute('data-style')).fill,
          stroke: JSON.parse(e.target.getAttribute('data-style')).stroke,
          fillOpacity: 0.05,
          strokeOpacity: 0.1,
          easing: Power3.easeIn
        });
        break;
      }
      default:
        break;
    }
  }

  render() {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg" version="1.1"
        width={this.state.width} height={this.state.height}
        className={this.props.className ? 'app-trianglify ' + this.props.className : 'app-trianglify'}
        ref={Trianglify => this.Trianglify = Trianglify}>
        <g style={{clipPath: "url(#hexagonal-mask)"}}>
          {this.pattern.polys.map((poly, index) => {
            let originColor = `rgba(${utils.hexToRgb(poly[0]).r},${utils.hexToRgb(poly[0]).g},${utils.hexToRgb(poly[0]).b},1)`;
            let originStrokeColor = `rgba(${utils.hexToRgb(poly[0]).r},${utils.hexToRgb(poly[0]).g},${utils.hexToRgb(poly[0]).b},1)`;
            return (
              <polygon
                key={index}
                data-style={`{"fill": "${originColor}","stroke": "${originStrokeColor}"}`}
                style={{fill: originColor,fillOpacity: 0.05,stroke: originStrokeColor,strokeOpacity: 0.1}}
                onMouseEnter={ (e)=>{this.polygonOnHover(e,'enter')} }
                onMouseLeave={ (e)=>{this.polygonOnHover(e,'leave')} }
                points={`${poly[1].join(' ')}`}
                ref={eachPolygon => {this.polys[index] = eachPolygon}}
              />
            )
          })}
        </g>
      </svg>
    )
  }
}

export default TrianglifySVG;
