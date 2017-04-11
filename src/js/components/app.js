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
        <BarChartSVG/>
      </div>
    )
  }
}

export default App;
