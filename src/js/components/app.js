import React from 'react';
import ReactDOM from 'react-dom';

import Banner from './commons/Banner';
import BarChartSVG from './commons/BarChartSVG';

class App extends React.Component {
  constructor(props, context) {
    super(props);

  }

  componentDidMount() {

  }

  render() {
    return (
      <div className="app">
        <Banner/>
        <div className="app-block app-resume">
          <h1>RESUME</h1>
        </div>
        <div className="app-block app-skills">
          <h1>MY SKILLS</h1>
          <BarChartSVG/>
        </div>
        <div className="app-block app-works">
          <h1>MY WORKS</h1>
        </div>
        <div className="app-block app-contact">
          <h1>CONTACT ME</h1>
        </div>
      </div>
    )
  }
}

export default App;
