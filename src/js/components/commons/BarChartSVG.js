import React from 'react';
import TweenMax from 'gsap';

class BarChartSVG extends React.Component{
  constructor(props,context) {
    super();
  }
  render(){
    return (
      <svg className="app-barchart" width={`100%`} height={500}>
        <BarGroup/>
      </svg>
    )
  }
}

const BarGroup = (props) => {
  return (
    <g>
      <circle cx={250} cy={500} r={25} fill="#000"/>
      <path d={`M0,500h500C250,375,250,500,250,500S250,375,0,500z`} fill="#000"/>
    </g>
  )
}

export default BarChartSVG;