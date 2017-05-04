import React from 'react';
import { connect } from 'react-redux';
import { TransitionMotion, spring } from 'react-motion';
import TweenMax from 'gsap';


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

  scrollTo(e) {
    let y = {
      value: window.scrollY
    };
    TweenMax.to(y,1,{
      value: e,
      ease: Power3.easeOut,
      onUpdate: function() {
        window.scrollTo(0,y.value);
      }
    });
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
                  {/* onClick or any event work same way with setTimeout
                      that inside with contain an expression instead of function
                       in setTimeout if we want a function with parameters we have to call it in
                       a defined function or anonymous function ()=>{ ourFunc(params); }
                       const x = () => { outFunc(params); }
                  */}
                  <li onClick={()=>this.scrollTo(0)}>
                    <h1>T</h1>
                    <span>op</span>
                  </li>
                  <li onClick={()=>this.scrollTo(700)}>
                    <h1>A</h1>
                    <span>bout</span>
                  </li>
                  <li onClick={()=>this.scrollTo(1800)}>
                    <h1>S</h1>
                    <span>kills</span>
                  </li>
                  <li onClick={()=>this.scrollTo(2500)}>
                    <h1>W</h1>
                    <span>orks</span>
                  </li>
                  <li onClick={()=>this.scrollTo(3000)}>
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