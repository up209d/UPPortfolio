import React from 'react';

import TrianglifySVG from './TrianglifySVG';
import SpringDrop from './SpringDrop';
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

  }

  componentWillUnmount() {

  }

  render() {
    return (
      <div ref="banner" className="app-banner">
        <TrianglifySVG {...this.props} ref="bannerTrianglify"
                       className="app-avatar-bg" options={{height: 720}}/>
        <SpringDrop/>
        <Navigation/>
      </div>
    )
  }
}
