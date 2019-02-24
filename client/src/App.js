import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { withAuthentication } from './components/session';
import Home from './components/home/Home';
import Chat from './components/chat/Chat';

class App extends Component {
  render() {
    const { firebase } = this.props;

    return (
      <div className="App">
        <Route
          exact
          path="/"
          render={() => <Home signInGoogle={firebase.doSignInWithGoogle} />}
        />
        <Route
          path="/chat"
          render={() => <Chat signOut={firebase.doSignOut} />}
        />
      </div>
    );
  }
}

export default withAuthentication(App);
