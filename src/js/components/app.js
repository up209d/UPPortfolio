import React from 'react';
import ReactDOM from 'react-dom';

import Banner from './commons/Banner';

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
      </div>
    )
  }
}

export default App;
