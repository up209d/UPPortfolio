import React from 'react';

export default class DelayRender extends React.Component {
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

  componentDidUpdate() {

  }

  render() {
    return this.state.isShow && this.props.children
  }
}