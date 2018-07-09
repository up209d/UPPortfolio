import React from 'react';
import TweenMax from 'gsap';
import utils from '../../utils';
import { Motion, spring } from 'react-motion';
import Measure from 'react-measure';
import { Row, Column } from 'react-foundation';
import isEqual from 'lodash.isequal';
import DelayRender from './DelayRender';

class BarChartSVG extends React.Component {
  constructor(props, context) {
    super(props);
    this.state = {
      width: 80,
      height: 400,
      data: [
        {
          name: "HTML5",
          percentage: 85
        },
        {
          name: "CSS3",
          percentage: 79
        },
        {
          name: "JS / NodeJs",
          percentage: 69
        },
        {
          name: "Webpack",
          percentage: 79
        },
        {
          name: "React",
          percentage: 80
        },
        {
          name: "AngularJs",
          percentage: 90
        },
        {
          name: "D3",
          percentage: 64
        },
        {
          name: "ThreeJs",
          percentage: 68
        },
        {
          name: "PHP",
          percentage: 80
        },
        {
          name: "Wordpress",
          percentage: 69
        },
        {
          name: "Photoshop",
          percentage: 63
        },
        {
          name: "Illustrator",
          percentage: 69
        }
      ],
      isShow: true,
    };
  }

  componentDidMount() {

  }

  componentDidUpdate() {
    console.log('BarChartSVG updated, Vertical Direction: ',this.props.isVertical);
  }

  shouldComponentUpdate(props,state) {
    return !isEqual(props,this.props) || !isEqual(state,this.state);
  }

  render() {
    return this.state.isShow && (
        <Row>
          <Column small={12} centerOnSmall>
            <Measure>
              {dimensions => {
                return !this.props.isVertical ?
                  <div style={{height: this.state.height}}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="app-barchart" width={dimensions.width}
                         height={this.state.height}
                         style={{overflow: 'visible'}}>
                      {this.state.data.map((value, index) => (
                        <BarGroup
                          name={value.name}
                          key={index} width={this.state.width}
                          height={this.state.height}
                          offset={((dimensions.width - this.state.width) / (this.state.data.length - 1)) * index}
                          delay={250 * index}
                          isVertical={this.props.isVertical}
                          percentage={value.percentage}/>
                      ))}
                    </svg>
                  </div>
                  :
                  <div style={{height: 1.1 * this.state.width * this.state.data.length}}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="app-barchart" width={dimensions.width}
                         height={dimensions.width}
                         style={{overflow: 'visible',transform:'rotateZ(90deg)'}}>
                      {this.state.data.map((value, index) => (
                        <BarGroup
                          name={value.name}
                          key={index} width={this.state.width}
                          height={dimensions.width}
                          offset={1.1 * this.state.width * index}
                          delay={250 * index}
                          isVertical={this.props.isVertical}
                          percentage={value.percentage}/>
                      ))}
                    </svg>
                  </div>
              }}
            </Measure>
          </Column>
        </Row>
      )
  }
}

class BarGroup extends React.Component {
  constructor(props, context) {
    super(props);
    this.state = {
      defaultStyle: {
        percentage: 0,
        alpha: 0,
        textOpacity: 0,
        colorR: 0,
        colorG: 0,
        colorB: 0
      },
      style: {
        percentage: spring(this.props.percentage, {
          stiffness: this.props.percentage,
          damping: this.props.percentage / 10
        }),
        colorR: spring(0),
        colorG: spring(0),
        colorB: spring(0),
        alpha: spring(utils.reMapRange(this.props.percentage,0,100,1,0.05)),
        textOpacity: spring(1),
        fontWeight: 500
      }
    };
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  componentDidUpdate() {

  }

  onMouseEnter(e) {
    this.previousStyle = this.state.style;
    this.setState({
      style: {
        ...this.state.style,
        colorR: spring(255)
      }
    });
  }

  onMouseLeave(e) {
    this.setState({
      style: {
        ...this.previousStyle
      }
    });
  }

  render() {
    return (
      <DelayRender wait={this.props.delay}>
        <svg ref={svg => this.svg = svg} x={this.props.offset} style={{overflow: "visible"}}>
          <Motion defaultStyle={this.state.defaultStyle} style={this.state.style}>
            {item => {
              let color = `rgba(${~~item.colorR},${~~item.colorG},${~~item.colorB},${item.alpha})`;
              return (
                <g onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
                  <text style={{fontWeight: item.fontWeight}} fill={`rgba(0,0,0,${item.textOpacity})`} textAnchor={this.props.isVertical ? "start" : "middle"} x={this.props.isVertical ? 0 : this.props.width/2} y={this.props.height+20} transform={this.props.isVertical ? `rotate(-90,10,${this.props.height-15})` : `rotate(0,0,0)`}>{this.props.name}</text>
                  {/*<rect width={this.props.width} height={this.props.height} fill={color}/>*/}
                  <path d={`M${
                    // Move to first point X Pos
                    0
                    },${
                    // Move to first point Y Pos
                    this.props.height
                    }h${
                    // Horizontal Move To (so skipping Y value) this is just X value
                    this.props.width
                    }C${
                    // The Right Curves Hander X Pos
                  this.props.width / 2
                    },${
                    // The Right Curves Handler Y Pos
                    this.props.height
                    },${
                    // The Center Point Current X Position
                  this.props.width / 2
                    },${
                    // The Center Point Current Y Position
                  this.props.height - item.percentage / 100 * this.props.height
                    },${
                    // The Center Point Current X Poisiton
                  this.props.width / 2
                    },${
                    // The Center Point Current Y Position
                  this.props.height - item.percentage / 100 * this.props.height
                    }S${
                    // The Right Curves Hander X Pos
                  this.props.width / 2
                    },${
                    // The Right Curves Handler Y Pos
                    this.props.height
                    },${
                    // Close at point X Pos
                    0
                    },${
                    // Close at point Y Pos
                    this.props.height
                    }z`} fill={color}/>
                  <circle cx={this.props.width / 2} cy={this.props.height - item.percentage / 100 * this.props.height}
                          r={this.props.width / 10}
                          fill={color}/>
                </g>
              )
            }}
          </Motion>
        </svg>
      </DelayRender>
    )
  }
};

// <path d={`M0,500h500C250,500,250,500,250,500S250,500,0,500z`} fill="#000"/> <rect width={props.width} height={props.height} fill={color}/>

export default BarChartSVG;