import React from 'react';
import ReactDOM from 'react-dom';

// adding ! to a request will disable configured preLoaders
// require("!raw!./script.coffee")
// adding !! to a request will disable all loaders specified in the configuration
// require("!!raw!./script.coffee")
// adding -! to a request will disable configured preLoaders and loaders but not the postLoaders
// require("-!raw!./script.coffee")
// https://github.com/webpack/webpack/issues/1747
import avatarSVGContent from '!!raw-loader!Images/avatar.svg';
import styled from 'styled-components';


const StyledAvatar = styled.div`
  &>svg {
    max-width: 280px;
    &>svg {
      overflow: visible;
    }
  }
  
  g {
    transform-origin: ${props => props.vWidth / 2}px ${props => props.vHeight / 2}px;
    transform: scale(1.75,1.75);
    transition: all 0.3s cubic-bezier(.17,.67,.19,1.11);
   
    
    /* STYLED COMPONENT IS AWESOME */
    /* ----------------------------------
    path {
      transition: all 0.5s cubic-bezier(.17,.67,.19,1.11);
    }
    ${props => {
      let css = '';
      for (let i=0;i<=props.pathCount;i++) {
        css = css + `path:nth-child(${i}) {
                transition: all ${Math.random()*0.5}s cubic-bezier(.17,.67,.19,1.11);
              }
    
            `
      }
      return css;
    }} --------------------------------- */
    
  }
   
  &:hover {
    g {
      transform: scale(1.2,1.2);
    }
  }
`;

class Avatar extends React.Component {
  constructor(props, context) {
    super(props);
    this.state = {
      width: 0,
      height: 0
    }
    this.MouseEnter = this.MouseEnter.bind(this);
    this.MouseLeave = this.MouseLeave.bind(this);
    this.onWindowScroll = this.onWindowScroll.bind(this);
    this.changeColor = this.changeColor.bind(this);
    this.frame = 0;
  }

  onWindowScroll() {
    let data = this.DOM.getBoundingClientRect();
    let offset = 200;
    let y = -data.top < -500 ? -500 : -data.top;
    y = y > 400 ? 400 : y;
    this.ChildSVG.setAttribute("y",y);
  }

  MouseEnter() {
    this.changeColor();
  }

  MouseLeave() {
    this.cancelChangeColor();
  }

  changeColor() {
    this.frame = this.frame > 60 ? 0 : this.frame + 1;
    if (this.frame % 9 == 0) {
      this.PathGroups[0].map((child, index) => {
        child.setAttribute("fill", `rgba(${~~(Math.random() * 255)},${~~(Math.random() * 255)},${~~(Math.random() * 255)},${Math.random()})`);
        child.setAttribute("stroke", child.getAttribute("fill"));
      });
    }
    // this.ChildSVG.setAttribute("y",Math.random()*2-1);
    // this.ChildSVG.setAttribute("x",Math.random()*2-1);
    this.animation = requestAnimationFrame(this.changeColor);
  }

  cancelChangeColor() {
    cancelAnimationFrame(this.animation);
    this.PathGroups[0].map((child, index) => {
      let color = this.FillGroups[0][index].fill;
      child.setAttribute("fill", color);
      child.setAttribute("stroke", color);
    });
  }

  componentDidMount() {
    let self = ReactDOM.findDOMNode(this);
    this.DOM = self;
    this.SVG = self.querySelector('svg');
    this.ChildSVG = self.querySelector('svg svg');

    this.SVGGroups = this.SVG.querySelectorAll('svg>g');
    this.SVGGroups = Array.prototype.slice.call(this.SVGGroups);
    // // Array-like objects slice method can also be called to convert Array-like objects
    // // developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
    this.PathGroups = this.SVGGroups.map((group) => {
      let childrenArray = Array.prototype.slice.call(group.childNodes);
      let result = childrenArray.filter((child) => {
        return child.nodeName == 'path'
      });
      return result;
    });

    this.FillGroups = [];
    this.PathGroups.map((PathGroup,index) => {
      this.FillGroups[index] = [];
      PathGroup.map((eachPath,indexindex) => {
        eachPath.setAttribute("stroke", eachPath.getAttribute("fill"));
        this.FillGroups[index][indexindex] = {fill: eachPath.getAttribute("fill")};
      });
    });

    this.SVGViewBox = this.SVG.getAttribute("viewBox").split(' ');
    this.setState({
      width: parseFloat(this.SVGViewBox[2]),
      height: parseFloat(this.SVGViewBox[3]),
      count: this.FillGroups[0].length
    });

    self.addEventListener('mouseenter', this.MouseEnter);
    self.addEventListener('mouseleave', this.MouseLeave);
    // window.addEventListener('scroll', this.onWindowScroll);
  }

  render() {
    return (
      <StyledAvatar vPathCount={this.state.count} vWidth={this.state.width} vHeight={this.state.height}
                    dangerouslySetInnerHTML={{__html: avatarSVGContent}}/>
    )
  }
}

export default Avatar;