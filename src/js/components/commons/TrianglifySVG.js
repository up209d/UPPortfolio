import React from 'react';
import Trianglify from 'trianglify';
import isEqual from 'lodash.isequal';
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
      cell_size: Math.sqrt(window.innerWidth)*5, // parseInt(window.innerWidth/30)
      color_space: 'lab',
      variance: "0.5",
      x_colors: ["#000","#000","#FFF","#000","#000"],
      y_colors: ["#000","#000","#FFF","#000","#000"],
      // y_colors: ["#FFFDAE", "#ff6e47", "#E90029"],
      ...this.props.options
    };
    this.pattern = Trianglify(this.state);
    this.polys = [];
    this.vertexSets = [];
  }

  defaultProps() {
    return Trianglify.defaults;
  }

  vertexCollect() {
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
    vertexs.forEach((vertex) => {
      let vertexSet = vertexs.filter((matchVertex)=>{
        return vertex.x == matchVertex.x && vertex.y == matchVertex.y
      });

      if(!vertexSets.some((matchVertexSet)=>{
          return matchVertexSet[0].x == vertexSet[0].x && matchVertexSet[0].y == vertexSet[0].y
        })) {
        vertexSets.push(vertexSet);
      }
    });
    this.vertexSets = vertexSets;
  }

  animateSVG() {
    // Only run in Chrome
    if (window.chrome) {
      // console.log(this.polys);
      // No Animation in phone
      if (!this.props.UI.handheld) {
        // console.log(vertexSets);
        this.vertexSets.forEach((vertexSet,index)=>{
          if (Math.random()>0.5) {
            let duration = Math.random()*6+6;
            let offsetX = Math.random()*400-200;
            let offsetY = Math.random()*400-200;
            //Tween an array
            TweenMax.killTweensOf(vertexSet);
            TweenMax.to(vertexSet,duration,{
              x: "+="+offsetX,
              y: "+="+offsetY,
              ease: Power1.easeInOut,
              repeat:-1,
              yoyo: true,
              immediateRender: true
            });
          }
        });
      } else {
        this.vertexSets.forEach((vertexSet,index)=>{
          let duration = Math.random()*5+3;
          let offsetX = Math.random()*100-50;
          let offsetY = Math.random()*100-50;
          TweenMax.killTweensOf(vertexSet);
          TweenMax.to(vertexSet,duration,{
            delay: 5,
            x: "+="+offsetX,
            y: "+="+offsetY,
            ease: Power1.easeInOut,
            immediateRender: true
          }); // Delay 1s then start animation
        });
      }
    }
  }

  killAllVertexTween() {
    this.vertexSets.forEach((vertexSet)=>{
      vertexSet.map((eachVertex)=>{
        TweenMax.killTweensOf(eachVertex);
      });
    });
  }

  updateOnResize() {
    let options = {
      ...this.state,
      width: window.innerWidth,
      height: window.innerHeight,
      cell_size: Math.sqrt(window.innerWidth)*5,
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

  shouldComponentUpdate(nextProps,nextState) {
    // Props is handle to affect state in componentWillReceiveProps so here we just need to care about the state only
    return !isEqual(this.state,nextState) || !isEqual(this.props,nextProps);
  }

  componentDidMount() {
    window.addEventListener('resize', this.onWindowResize());
    this.vertexCollect();
    this.animateSVG();
  }

  componentWillUnmount() {
    this.killAllVertexTween();
    window.removeEventListener('resize', this.onWindowResize());
  }

  componentWillUpdate() {
    this.killAllVertexTween();
    this.polys = [];
  }

  componentDidUpdate() {
    console.log('Trianglify Updated');
    this.vertexCollect();
    this.animateSVG();
  }

  polygonOnHover(e,type) {
    let colorArray = ["#000"]; // ["#ffffcc","#ffeda0","#fed976","#feb24c","#fd8d3c","#fc4e2a","#e31a1c","#bd0026","#800026"];
    let randomColor = colorArray[Math.abs(parseInt(Math.sin((new Date()).getTime()*0.001)*colorArray.length))];
    switch (type) {
      case 'enter': {
        TweenMax.killTweensOf(e.target.style);
        TweenMax.to(e.target.style,0.1,{
          fill: randomColor,
          stroke: randomColor,
          fillOpacity: 0.9,
          strokeOpacity: 0.9,
          ease: Power3.easeOut
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
          ease: Power3.easeOut
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
        <g>
          {this.pattern.polys.map((poly, index) => {
            let originColor = `rgba(${utils.hexToRgb(poly[0]).r},${utils.hexToRgb(poly[0]).g},${utils.hexToRgb(poly[0]).b},1)`;
            let originStrokeColor = `rgba(${utils.hexToRgb(poly[0]).r},${utils.hexToRgb(poly[0]).g},${utils.hexToRgb(poly[0]).b},1)`;
            return (
              <polygon
                key={index}
                data-style={`{"fill": "${originColor}","stroke": "${originStrokeColor}"}`}
                style={{fill: originColor,fillOpacity: 0.05,stroke: originStrokeColor,strokeOpacity: 0.1}}
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
