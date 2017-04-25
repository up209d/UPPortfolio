import React from 'react';
import ReactDOM from 'react-dom';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionUI from '../actions/actionUI';
import { createSelector } from 'reselect'

import Banner from './commons/Banner';
import Avatar from './commons/Avatar';
import SideNav from './commons/SideNav';
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
    this.onScrolling = this.onScrolling.bind(this);
  }

  onScrolling(e) {
    if (window.scrollY <= 750) {
      document.querySelector('.app-resume').style.backgroundColor = `rgba(255,255,255,${
        Math.min(1,(window.scrollY+720*0.88)/720)
        })`;
      document.querySelector('.app-banner-content').style.transform = `translateY(${
      -window.scrollY/3
        }px)`;
      if (document.querySelector('.app-banner-mid canvas')) {
        document.querySelector('.app-banner-mid canvas').style.transform = `translateY(${
        -window.scrollY/4
          }px)`;
      }
      document.querySelector('.app-navigation').style.transform = `translateY(${
        (window.scrollY > 600 ? -window.scrollY/2 + 300 : 0)
        }px)`;
      document.querySelector('.app-banner').style.display = 'block';
    } else {
      document.querySelector('.app-banner').style.display = 'none';
    }
  }

  componentDidMount() {
    let actionUI = this.props.actionUI;
    // setTimeout(()=>{
    //   actionUI.toggleBanner(true);
    // },5000);
    window.addEventListener('scroll',this.onScrolling);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll',this.onScrolling);
  }

  render() {
    return (
      <div className="app">
        <SideNav/>
        <Banner {...this.props}/>
        <div className="app-block app-resume">
          <h1 className="medium-pb-20">ABOUT ME</h1>
          <Row>
            <Column className="small-pb-20 medium-pb-60" small={12} medium={8} centerOnMedium>
              <p className="text-center">I have years of experience in web industry. I like to work in this area, where i can balance between design and coding. There is nothing more interesting than what you made in static visual images turning into live, by the art of math and logic underneath the coding lines.</p>
            </Column>
          </Row>
          <Row>
            <Column small={12} centerOnSmall>
              <Row>
                <Column className="app-resume__image text-center medium-text-right" small={12} medium={4} offsetOnMedium={2}>
                  <div className="medium-mt-10">
                    <Avatar width={250}/>
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
        <ToggleInViewPort height={705} willReset={!this.props.UI.handheld}>
          <div className="app-block app-skills">
            <h1>MY SKILLS</h1>
            <BarChartSVG isVertical={this.props.UI.width < 1024}/>
          </div>
        </ToggleInViewPort>
        <div className="app-block app-works">
          <h1>MY WORKS</h1>
        </div>
        <div className="app-block app-contact">
          <h1>CONTACT ME</h1>
          <div className="row">
            <div className="small-12">
              <ul>
                <li><a href="#">Github</a></li>
                <li>|</li>
                <li><a href="#">up209d@gmail.com</a></li>
                <li>|</li>
                <li><a href="#">+61 451 87 2009</a></li>
              </ul>
            </div>
          </div>
          <canvas id="FooterCanvas" />
        </div>
        <div className="app-block app-footer">
          <p>Copyright U.P 2017. All rights reserved.</p>
        </div>
      </div>
    )
  }
}
