import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Home from './components/home/Home';
import Chat from './components/chat/Chat';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Route exact path="/" component={Home} />
        <Route path="/chat" component={Chat} />
      </div>
    );
  }
}

export default App;
