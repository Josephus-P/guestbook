import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Home from './components/Home';
import Chat from './components/Chat';
import { Button } from 'antd';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Route exact path="/" component={Home} />
        <Route path="/chat" component={Chat} />
        <Button type="primary">Primary</Button>
      </div>
    );
  }
}

export default App;
