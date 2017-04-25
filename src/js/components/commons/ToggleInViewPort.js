import React from 'react';
import ReactDOM from 'react-dom';
import utils from "../../utils";

import isEqual from 'lodash.isequal';

class ToggleInViewPort extends React.Component{
  constructor(props,context) {
    super(props);
    this.state = {
      isIn: false,
      style: {
        minHeight: this.props.height ? this.props.height : 100
      },
      timeout: 0
    };
    // Scrolling have to be throttling otherwise it will fire quickly and flood,crash the render stream
    this.firingHandler = utils.fThrottle(this.firingHandler.bind(this),30);
  }

  init() {
    this.DOM = ReactDOM.findDOMNode(this);

    // let data = this.DOM.getBoundingClientRect();
    // let testDiv = document.createElement('div');
    // testDiv.style.width = data.width + 'px';
    // testDiv.style.height = data.height + 'px';
    // testDiv.style.top = data.top + 'px';
    // testDiv.style.left = data.left + 'px';
    // testDiv.style.zIndex = 999999;
    // testDiv.style.background = '#EF5000';
    // testDiv.style.position = 'absolute';
    // document.body.appendChild(testDiv);
    // console.log(data,testDiv);

    this.firingHandler();
    // this.assumeHeight();
  }

  // assumeHeight() {
  //   let data = this.DOM.getBoundingClientRect();
  //   let oldHeight = this.state.style.height ? this.state.style.height : 0;
  //   console.log(data.height);
  //   if ((data.height > oldHeight)) {
  //     this.setState({
  //       style: {
  //         ...this.state.style,
  //         minHeight:data.height
  //       }
  //     });
  //   }
  // }


  firingHandler() {
    let data = this.DOM.getBoundingClientRect();
    if ((data.top-window.innerHeight < 0) && (data.bottom > 0)) {
      if (this.state.isIn != true) {
        if (!this.props.willReset) {
          window.removeEventListener("scroll",this.firingHandler);
          window.removeEventListener("resize",this.firingHandler);
        }
        this.setState({
          isIn:true
        });
      }
    } else {
      if (this.state.isIn != false) {
        this.setState({isIn:false});
      }
    }
  }

  componentDidMount() {
    window.addEventListener("scroll",this.firingHandler);
    window.addEventListener("resize",this.firingHandler);
    this.init();
  }

  componentWillUnmount() {
    window.removeEventListener("scroll",this.firingHandler);
    window.removeEventListener("resize",this.firingHandler);
  }

  componentDidUpdate() {
    this.init();
  }

  shouldComponentUpdate(props,state) {
    return !isEqual(props,this.props) || !isEqual(state,this.state);
  }

  render() {
    return this.state.isIn ?
      <div className={`app-toggle-viewport ${this.props.className || ''}`} style={this.state.style}>
        {this.props.children}
      </div> :
      <div className={`app-toggle-viewport ${this.props.className || ''}`} style={this.state.style}/>;
  }
}

ToggleInViewPort.defaultProps = {
  willReset: false
};

export default ToggleInViewPort;