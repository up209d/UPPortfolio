import React from 'react';
import ReactDOM from 'react-dom';
import utils from "../../utils";

import isEqual from 'lodash.isequal';

class ToggleInViewPort extends React.Component{
  constructor(props,context) {
    super(props);
    this.state = {
      isIn: false,
      height: this.props.height ? this.props.height : 100,
      timeout: 0
    };
    this.firingHandler = utils.fThrottle(this.firingHandler.bind(this),50);
    console.log();
  }

  init() {
    this.DOM = ReactDOM.findDOMNode(this);
    this.firingHandler();
    this.assumeHeight();
  }

  assumeHeight() {
    let data = this.DOM.getBoundingClientRect();
    if ((data.height > this.state.height)) {
      console.log('SetNow');
      this.setState({
        height:data.height
      });
    }
  }


  firingHandler() {
    // console.log("Scrolled",this.DOM.getBoundingClientRect());
    let data = this.DOM.getBoundingClientRect();
    console.log(data.bottom);
    if ((data.top-window.innerHeight < 0) && (data.bottom > 0)) {
        if (this.state.isIn != true) {
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
    this.init();
    window.addEventListener("scroll",this.firingHandler);
    window.addEventListener("resize",this.firingHandler);
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
    return this.state.isIn ? this.props.children : <div style={{height:this.state.height}}></div>;
  }
}

export default ToggleInViewPort;