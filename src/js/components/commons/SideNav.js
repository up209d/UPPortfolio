import React from 'react';
import { connect } from 'react-redux';
import { TransitionMotion, spring } from 'react-motion';


@connect((state)=>({
  handheld: state.UI.handheld
}))
export default class SideNav extends React.Component{
  constructor(props,context) {
    super(props);
    this.state = {
      isShow: false
    };
    this.onScrolling = this.onScrolling.bind(this);
  }

  onScrolling() {
    if (window.scrollY > 550 && !this.state.isShow) {
      this.setState({
        isShow: true
      })
    }
    if (window.scrollY < 550 && this.state.isShow) {
      this.setState({
        isShow: false
      })
    }
  }

  componentDidMount() {
    window.addEventListener('scroll',this.onScrolling);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll',this.onScrolling);
  }

  render() {
    return !this.props.handheld &&
      <TransitionMotion styles={
        this.state.isShow ? [
          {
            key: 'SideNav',
            data: {},
            style: {
              value: spring(0)
            }
          }
          ] : []
      }
        willEnter={()=>(
          {
            value: 200
          }
        )}
        willLeave={()=> (
          {
            value: spring(200)
          }
        )}
      >
        {items => {
          if (items.length) {
            let key = items[0].key;
            let style = items[0].style;
            return (
              <div key={key} className="app-sideNav" style={{
                transform: `translateX(${style.value}px)`,
                opacity: Math.abs(style.value-200)/200
              }}>
                <ul>
                  <li>
                    <h1>T</h1>
                    <span>op</span>
                  </li>
                  <li>
                    <h1>A</h1>
                    <span>bout</span>
                  </li>
                  <li>
                    <h1>S</h1>
                    <span>kills</span>
                  </li>
                  <li>
                    <h1>W</h1>
                    <span>orks</span>
                  </li>
                  <li>
                    <h1>C</h1>
                    <span>ontact</span>
                  </li>
                </ul>
              </div>
            )
          }
          return null;
        }}
      </TransitionMotion>
  }
}