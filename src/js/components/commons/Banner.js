import React from 'react';

import TrianglifyRenderer from './TrianglifyRenderer';
import TrianglifySVG from './TrianglifySVG';
import PIXIRenderer from './PIXIRenderer';
import Navigation from './Navigation';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionUI from '../../actions/actionUI';

@connect(state => {
  return {UI: state.UI}
}, dispatch => {
  return {actionUI: bindActionCreators(actionUI, dispatch)}
})
export default class Banner extends React.Component {
  constructor(props, context) {
    super(props);
    this.state = {
      preloaded: false
    }
  }

  componentDidMount() {
    this.refs.bannerTrianglify.Trianglify.addEventListener('mouseenter', this.props.actionUI.bannerTouchAvatar.bind(this));
    this.refs.bannerTrianglify.Trianglify.addEventListener('mouseleave', this.props.actionUI.bannerUntouchAvatar.bind(this));
  }

  componentWillUnmount() {
    this.refs.bannerTrianglify.Trianglify.removeEventListener('mouseenter', this.props.actionUI.bannerTouchAvatar.bind(this));
    this.refs.bannerTrianglify.Trianglify.removeEventListener('mouseleave', this.props.actionUI.bannerUntouchAvatar.bind(this));
  }

  render() {
    return (
      <div ref="banner" className="app-banner">
        <PIXIRenderer {...this.props} ref="bannerBackground" options={{height: 720}}/>
        <TrianglifySVG {...this.props} ref="bannerTrianglify"
                       className="app-avatar-bg" options={{height: 720}}/>
        <TrianglifyRenderer {...this.props} ref="bannerLine" className="app-banner-line" mode="canvas"
                            options={{height: 10}}/>
        <Navigation/>
      </div>
    )
  }
}
