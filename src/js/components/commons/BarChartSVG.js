import React from 'react';
import TweenMax from 'gsap';
import utils from '../../utils';
import { Motion, spring } from 'react-motion';

class BarChartSVG extends React.Component{
  constructor(props,context) {
    super();
    this.state = {
      width : 100,
      height: 500,
      data: [
        {
          name: "HTML5",
          percentage: 92
        },
        {
          name: "CSS3",
          percentage: 79
        },
        {
          name: "Javascript",
          percentage: 81
        }
      ]
    };
    this.offsetRatio = (this.state.data.length*this.state.width - window.innerWidth)/window.innerWidth;
  }

  componentDidMount() {

  }

  render(){
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="app-barchart" width={`100%`} height={500}>
        {this.state.data.map((value,index)=>(
          <BarGroup
            refs="BarGroup"
            key={index} width={this.state.width}
            height={this.state.height}
            offset={this.state.width*index}
            percentage={value.percentage} />
        ))}
      </svg>
    )
  }
}

const BarGroup = (props) => {
  return (
    <svg x={props.offset}>
      <path d={`M${
        // Move to first point X Pos
        0
        },${
          // Move to first point Y Pos
          props.height
        }h${
          // Horizontal Move To (so skipping Y value) this is just X value
          props.width
        }C${
          // The Right Curves Hander X Pos
          props.width/2
        },${
          // The Right Curves Handler Y Pos
          props.height
        },${
          // The Center Point Current X Position
          props.width/2
        },${
          // The Center Point Current Y Position
          props.height - props.percentage/100*props.height
        },${
          // The Center Point Current X Poisiton
          props.width/2
        },${
          // The Center Point Current Y Position
          props.height - props.percentage/100*props.height
        }S${
          // The Right Curves Hander X Pos
          props.width/2
        },${
          // The Right Curves Handler Y Pos
          props.height
        },${
          // Close at point X Pos
          0
        },${
          // Close at point Y Pos
          props.height
        }z`} fill="rgba(0,0,0,0.5)"/>
      <circle cx={props.width/2} cy={props.height - props.percentage/100*props.height} r={props.width/10} fill="rgba(0,0,0,0.5)"/>
    </svg>
  )
}

// <path d={`M0,500h500C250,500,250,500,250,500S250,500,0,500z`} fill="#000"/>

export default BarChartSVG;