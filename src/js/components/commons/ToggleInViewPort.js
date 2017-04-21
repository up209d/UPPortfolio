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
    this.firingHandler = utils.fThrottle(this.firingHandler.bind(this),50);
  }

  init() {
    this.DOM = ReactDOM.findDOMNode(this);
    this.firingHandler();
    this.assumeHeight();
  }

  assumeHeight() {
    let data = this.DOM.getBoundingClientRect();
    let oldHeight = this.state.style.height ? this.state.style.height : 0;
    // console.log(data);
    if ((data.height > oldHeight)) {
      // console.log('SetNow');
      this.setState({
        style: {
          ...this.state.style,
          minHeight:data.height
        }
      });
    }
    // console.log(this.state);
  }


  firingHandler() {
    // console.log("Scrolled",this.DOM.getBoundingClientRect());
    let data = this.DOM.getBoundingClientRect();
    if ((data.top-window.innerHeight < 0) && (data.bottom > 0)) {
      if (this.state.isIn != true) {
        this.setState({
          isIn:true
        });
        if (!this.props.willReset) {
          window.removeEventListener("scroll",this.firingHandler);
          window.removeEventListener("resize",this.firingHandler);
        }
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
    // console.log('Did Update','Will Reset: ', this.props.willReset,'IsIn: ', this.state.isIn);
    this.init();
  }

  shouldComponentUpdate(props,state) {
    return !isEqual(props,this.props) || !isEqual(state,this.state);
  }

  render() {
    // console.log('ReReRender');
    return this.state.isIn ?
      <div className="app-toggle-viewport" style={this.state.style}>
        {this.props.children}
      </div> :
      <div className="app-toggle-viewport" style={this.state.style}/>;
  }
}

ToggleInViewPort.defaultProps = {
  willReset: true
};

export default ToggleInViewPort;