import React from 'react';
import ReactDOM from 'react-dom';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionUI from '../actions/actionUI';
import utils from '../utils';
import styled from 'styled-components';

import Banner from './commons/Banner';
import Avatar from './commons/Avatar';
import SideNav from './commons/SideNav';
import BarChartSVG from './commons/BarChartSVG';
import ToggleInViewPort from './commons/ToggleInViewPort';
import SnapSVGImage from './commons/SnapSVGImage';

import { Row, Column } from 'react-foundation';

const mapStateToProps = (state) => {
  return {
    UI: state.UI,
    Interactive: state.Interactive
  }
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

  scrollTo(e) {
    let y = {
      value: window.scrollY
    };
    TweenMax.to(y,0.5,{
      value: e,
      ease: Power3.easeOut,
      onUpdate: function() {
        window.scrollTo(0,y.value);
      }
    });
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
          <Row className="app-resume__content">
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
                      <h3>Bachelor of Computer Sciences</h3>
                      <p>Information Technology</p>
                      <p><span>Vietnam - National Economics University</span></p>
                    </li>
                    <li>
                      <h3>Web Developer</h3>
                      <p>Freelancer</p>
                      <p><span>WeCan Grp. Technological Solution & Communication</span></p>
                    </li>
                    <li>
                      <h3>Web/UI Developer</h3>
                      <p>Full Time</p>
                      <p><span>CMC Telecom - Infracstructure Online Department</span></p>
                    </li>
                    <li>
                      <h3>Front-end Developer</h3>
                      <p>Full Time</p>
                      <p><span>DataArts Pty Ltd.</span></p>
                    </li>
                  </ul>
                  <p><a style={{fontSize:'0.85rem',color:'#E50000'}} href={'CV.pdf'}>Download Resume</a></p>
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
          <Row>
            <Column small={12}>
              <ul>
                <li>
                  <a href="https://github.com/up209d/">
                    <SnapSVGImage src={require('Images/github.svg')}/>
                    Github
                  </a>
                </li>
                <li>
                  <a href="https://www.behance.net/up209d">
                    <SnapSVGImage src={require('Images/behance.svg')}/>
                    Behance
                  </a>
                </li>
                <li>
                  <a href="https://500px.com/up209d">
                    <SnapSVGImage src={require('Images/500px.svg')}/>
                    500px
                  </a>
                </li>
              </ul>
            </Column>
          </Row>
        </div>
        <div className="app-block app-contact">
          <h1>CONTACT ME</h1>
          <div className="row">
            <div className="small-12">
              <ul>
                <li><a href="https://au.linkedin.com/in/duc-duong-158015142" target="_blank">My Linkedin</a></li>
                <li>|</li>
                <li><a href="mailto:up209d@gmail.com" target="_blank">up209d@gmail.com</a></li>
                <li>|</li>
                <li><a href="tel:+61451872009" target="_blank">+61 451 87 2009</a></li>
              </ul>
            </div>
          </div>
          <canvas id="FooterCanvas" />
        </div>
        <div className="app-block app-footer">
          <p>Copyright U.P 2017. All rights reserved.</p>
        </div>
        <FakeScrollbar TimeOut={250}/>
      </div>
    )
  }
}

// Chrome Only Fake Scroll Bar

const FakeScrollbarStyled = styled.div`
  ${props => {
    if (window.chrome) {
      return `
        width: 6px;
        
        div {
          width: 6px
        }
        
        &::-webkit-scrollbar {
         width: 6px;
        }
      
        &::-webkit-scrollbar-track {
         background-color: rgba(0,0,0,0.05);
         border-radius: 3px;
        }
      
        &::-webkit-scrollbar-thumb {
         background-color: rgba(99,99,99,0.5);
         border-radius: 3px;
        }
      `
    }
  }}
`;

class FakeScrollbar extends React.Component{
  constructor(props,context) {
    super(props);
    this.state = {
      isShow: false
    };
    this.onWindowScrolling = this.onWindowScrolling.bind(this);
    this.debounceDisappear = utils.fDebounce(this.debounceDisappear.bind(this),this.props.TimeOut);
  }

  debounceDisappear() {
    this.setState({
      isShow: false
    });
  }

  onWindowScrolling() {
    this.DOM.scrollTop = window.scrollY;
    if (!this.state.isShow) {
      this.setState({
        isShow: true
      });
    }
    this.debounceDisappear();
  }

  componentDidMount() {
    this.DOM = ReactDOM.findDOMNode(this);
    window.addEventListener('scroll',this.onWindowScrolling);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll',this.onWindowScrolling);
  }

  render() {
    return (
        <FakeScrollbarStyled className="app-scrollbar" style={{
          height: document.body.clientHeight,
          opacity: this.state.isShow ? 1 : 0
        }}>
          <div className="app-scrollbar__core" style={{
            height: document.documentElement.scrollHeight
          }}>
          </div>
        </FakeScrollbarStyled>
      ) || null;
  }
}

FakeScrollbar.defaultProps = {
  TimeOut: 150
};