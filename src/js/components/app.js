import React from 'react';
import ReactDOM from 'react-dom';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionUI from '../actions/actionUI';
import { createSelector } from 'reselect'

import WebFontLoader from 'webfontloader';

import Banner from './commons/Banner';
import BarChartSVG from './commons/BarChartSVG';
import ToggleInViewPort from './commons/ToggleInViewPort';

import { Row, Column } from 'react-foundation';

const mapStateToProps = (state) => {
  return {UI: state.UI}
};

const mapDispatchToProps = (dispatch) => {
  return {actionUI: bindActionCreators(actionUI, dispatch)}
};

@connect(mapStateToProps,mapDispatchToProps)
export default class App extends React.Component {
  constructor(props, context) {
    super(props);
    this.state = {
      isFontLoaded: false
    };
    WebFontLoader.load({
      google: {
        families: ['Roboto']
      },
      active: ()=>{
        this.setState({isFontLoaded: true});
      }
    });
  }

  componentDidMount() {
    let actionUI = this.props.actionUI;
    setTimeout(()=>{
      actionUI.toggleBanner(true);
    },5000);
  }

  render() {
    return (
      <div className="app" style={this.state.isFontLoaded ? {opacity:1} : {opacity:0}}>
        <Banner {...this.props}/>
        <ToggleInViewPort height={1162} willReset={false}>
        <div className="app-block app-resume">
          <h1 className="medium-pb-20">ABOUT ME</h1>
          <Row>
            <Column className="small-pb-20 medium-pb-60" small={12} medium={8} centerOnMedium>
              <p className="text-center">I have years experience in web industry. I like working in this area, where i can balance between design and coding. There is nothing more interesting than what you made in static visual images turning into live, by the art of math and logic underneath the coding lines.</p>
            </Column>
          </Row>
          <Row>
            <Column small={12} centerOnSmall>
              <Row>
                <Column className="app-resume__image text-center medium-text-right" small={12} medium={4} offsetOnMedium={2}>
                  <div className="medium-mt-10">
                    <img width="250" src={require('Images/avatarN.jpg')} alt="My Avatar"/>
                  </div>
                </Column>
                <Column className="app-resume__content text-center medium-text-left" small={12} medium={6}>
                  <ul className="small-mt-40 medium-mt-0">
                    <li>
                      <h3>Master of Arts</h3>
                      <p>Multimedia & Interactive Design</p>
                      <p><span>Monash University</span></p>
                    </li>
                    <li>
                      <h3>Bachelor of Computer Science</h3>
                      <p>Information Technology</p>
                      <p><span>Vietnam - National Economic University</span></p>
                    </li>
                    <li>
                      <h3>Diploma of Design</h3>
                      <p>Digital Animation & Motion Graphics</p>
                      <p><span>FPT Omega School Of Design</span></p>
                    </li>
                    <li>
                      <h3>Web Developer</h3>
                      <p>Full Time / Part Time</p>
                      <p><span>WeCan Grp. Technological Solution & Communication</span></p>
                    </li>
                    <li>
                      <h3>Web/UI Designer</h3>
                      <p>Full Time</p>
                      <p><span>CMC Telecom - Infracstructure Online Department</span></p>
                    </li>

                  </ul>
                </Column>
              </Row>
            </Column>
          </Row>
        </div>
        </ToggleInViewPort>
        <ToggleInViewPort height={715} willReset={true}>
          <div className="app-block app-skills">
            <h1>MY SKILLS</h1>
            <BarChartSVG isVertical={(this.props.UI.width < this.props.UI.height)}/>
          </div>
        </ToggleInViewPort>
        <div className="app-block app-works">
          <h1>MY WORKS</h1>
        </div>
        <div className="app-block app-contact">
          <h1>CONTACT ME</h1>
        </div>
        <div className="app-block app-footer">
          <canvas id="FooterCanvas" />
        </div>
      </div>
    )
  }
}
