import React from 'react';
import isEqual from 'lodash.isequal';

export default class DelayRender extends React.PureComponent {
  constructor(props, context) {
    super(props);
    this.state = {
      isShow: false
    }
  }

  componentDidMount() {
    this.timeOut = setTimeout(() => {
      this.setState({isShow: true});
    }, this.props.wait);
  }

  componentWillUnmount() {
    clearTimeout(this.timeOut);
  }

  render() {
    return this.state.isShow ? this.props.children : null;
  }
}