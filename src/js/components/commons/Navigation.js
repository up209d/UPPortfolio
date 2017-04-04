import React from 'react';
import { Row, Column } from 'react-foundation';
import { TransitionMotion, Motion, spring } from 'react-motion';

class Navigation extends React.PureComponent {
  constructor(props, context) {
    super(props);
  }

  render() {
    return (
      <div className="app-navigation">
        <Row className="show-for-medium">
          <Column small={12} medium={10} large={8} centerOnSmall>
            <ul className="app-navigation-menu">
              <li><a href="#">Resume</a></li>
              <li><a href="#">My Skills</a></li>
              <li className="app-logo">
                <a href="#">
                  <img src={require('Images/damg.svg')} alt="DAMGLOGO"/>
                </a>
              </li>
              <li><a href="#">My Work</a></li>
              <li><a href="#">Contact Me</a></li>
            </ul>
          </Column>
        </Row>
        <Row className="show-for-small-only">
          <Column small={12} centerOnSmall>
            <ul className="app-navigation-menu">
              <li className="app-logo">
                <a href="#" onClick={()=>{this.refs.hiddenMenu.toggleMenu()}}>
                  <img src={require('Images/damg.svg')} alt="DAMGLOGO"/>
                </a>
              </li>
            </ul>
          </Column>
        </Row>
        <NavigationHiddenMenu ref="hiddenMenu"/>
      </div>
    )
  }
}

class NavigationHiddenMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showMenu: false
    }
  }

  toggleMenu() {
    let showMenu = this.state.showMenu ? false : true;
    this.setState({ showMenu });
  }


  willEnter() {
    return {
      // this will be the initial value
      top: -500
    }
  }

  willLeave() {
    return {
      // this will be the value by the end of component life
      top: spring(-500)
    }
  }

  render() {
    return (
      <TransitionMotion
        styles={this.state.showMenu ? [
            {
              key: 'sideMenu',
              data: {},
              style: {
                // this will be the value when component is created
                top: spring(0)
              }
            }
          ] : []}
        willEnter={this.willEnter}
        willLeave={this.willLeave}>
        {(items) => {
          if (items.length) {
            let { key, style } = items[0];
            return (
              <div key={key} style={style} className="app-sideMenu show-for-small-only">
                <Row>
                  <Column small={12} centerOnSmall>
                    <ul>
                      <li><a href="#">Resume</a></li>
                      <li><a href="#">My Skills</a></li>
                      <li><a href="#">My Work</a></li>
                      <li><a href="#">Contact Me</a></li>
                      <li><a href="#" onClick={this.toggleMenu.bind(this)}>[ Close ]</a></li>
                    </ul>
                  </Column>
                </Row>
              </div>
            )
          } else {
            return null;
          }
        }
        }
      </TransitionMotion>
    )
  }
}

export default Navigation;