import React from 'react';
import { Motion, spring, presets } from 'react-motion';
import { Row, Column } from 'react-foundation';

import TrianglifySVG from './TrianglifySVG';
import SpringDrop from './SpringDrop';
import Navigation from './Navigation';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionUI from '../../actions/actionUI';

// For Debounce Function
import utils from '../../utils';

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
    };

    // setTimeout(()=>{
    //   this.props.actionUI.bannerTouchAvatar();
    // },5000);
    // setTimeout(()=>{
    //   this.props.actionUI.bannerUntouchAvatar();
    // },10000);
  }

  render() {
    return (
      <div ref="banner" className="app-banner">
        <TrianglifySVG {...this.props} ref="bannerTrianglify"
                       className="app-avatar-bg" options={{height: 720}}/>
        {!this.props.UI.handheld && (
        <SpringDrop className="app-drops" options={{
          textRender: "FRONT-END",
          width: this.props.UI.width,
          height: 720
        }}/>
      )}
        <Navigation/>
        <BannerContent {...this.props}/>
      </div>
    )
  }
}

const BannerContent = (props) => (
  <div className="app-banner-content">
    <Row>
      <Column className="text-center" small={12} centerOnSmall>
        <Motion defaultStyle={{ value: -1000 }} style={{ value: spring(0, presets.wobbly) }}>
          {item => (
            <h1 className="content-greeting" style={{transform: `translateY(${item.value}px)`}}>Hi there! I am U.P</h1>
          )}
        </Motion>
        <Motion defaultStyle={{ value: -window.innerWidth }} style={{ value: spring(0, presets.wobbly) }}>
          {item => (
            <h1 className="content-design" style={{transform: `translateX(${item.value}px)`}}>Designer</h1>
          )}
        </Motion>
        {props.UI.handheld && (
          <Motion defaultStyle={{ value: -9000 }} style={{ value: spring(0, presets.wobbly) }}>
            {item => (
              <h1 className="content-frontend" style={{transform: `translateY(${item.value}px)`}}>Front-end</h1>
            )}
          </Motion>
        )}
        <Motion defaultStyle={{ value: 0 }} style={{ value: spring(1, presets.wobbly) }}>
          {item => (
            <div className="content-linebreak" style={{transform: `scaleX(${item.value})`}}></div>
          )}
        </Motion>
        <Motion defaultStyle={{ value: window.innerWidth }} style={{ value: spring(0, presets.wobbly) }}>
          {item => (
            <h1 className="content-develop" style={{transform: `translateX(${item.value}px)`}}>{`[Developer]`}</h1>
          )}
        </Motion>
      </Column>
    </Row>
  </div>
);
