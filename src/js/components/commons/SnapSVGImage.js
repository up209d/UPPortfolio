import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Snap from 'snapsvg';
import styled from 'styled-components';

const ImageContainer = styled.div`
  svg {
    path {
      transition: all 0.3s ease-out;
    }
  }
`;

class SnapSVGImage extends React.Component{
  constructor(props,context) {
    super(props);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  onMouseEnter() {
    if (this.props.colorHover) {
      let result = this.SVG.querySelectorAll('path');
      if (result.length) {
        result = Array.prototype.slice.call(result);
        result.map((item)=>{
          item.setAttribute('fill',this.props.colorHover);
        });
      }
    }
  }

  onMouseLeave() {
    if (this.props.colorHover) {
      let result = this.SVG.querySelectorAll('path');
      if (result.length) {
        result = Array.prototype.slice.call(result);
        result.map((item)=>{
          item.setAttribute('fill',this.props.color);
        });
      }
    }
  }

  componentDidMount() {
    this.DOM = ReactDOM.findDOMNode(this);
    this.Snap = Snap(this.DOM);

    if (this.props.src.substr(0,4) == 'data') {
      this.Snap.append(Snap.parse(atob(this.props.src.split(",")[1])));
      this.SVG = this.Snap.select('svg').node;

      // Reset Width Height
      this.SVG.removeAttribute('height');
      this.SVG.setAttribute('width',this.props.width);

      if (this.props.color) {
        let result = this.SVG.querySelectorAll('path');
        if (result.length) {
          result = Array.prototype.slice.call(result);
          result.map((item)=>{
            item.setAttribute('fill',this.props.color);
          });
        }
      }
      this.SVG.addEventListener('mouseenter',this.onMouseEnter);
      this.SVG.addEventListener('mouseleave',this.onMouseLeave);

    } else {
      Snap.load(this.props.src,(svg)=>{
        this.Snap.append(svg);
        this.SVG = this.Snap.select('svg').node;

        // Reset Width Height
        this.SVG.removeAttribute('height');
        this.SVG.setAttribute('width',this.props.width);

        if (this.props.color) {
          let result = this.SVG.querySelectorAll('path');
          if (result.length) {
            result = Array.prototype.slice.call(result);
            result.map((item)=>{
              item.setAttribute('fill',this.props.color);
            });
          }
        }
        this.SVG.addEventListener('mouseenter',this.onMouseEnter);
        this.SVG.addEventListener('mouseleave',this.onMouseLeave);
      });
    }
  }

  componentWillUnmount() {
    this.SVG.removeEventListener('mouseenter',this.onMouseEnter);
    this.SVG.removeEventListener('mouseleave',this.onMouseLeave);
  }

  render() {
    return (
      <ImageContainer></ImageContainer>
    )
  }
}

SnapSVGImage.defaultProps = {
  color: '#000',
  colorHover: '#E50000',
  width: 64,
};

SnapSVGImage.propTypes = {
  src: PropTypes.string.isRequired
};

export default SnapSVGImage;