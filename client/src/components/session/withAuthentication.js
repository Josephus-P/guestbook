import React from 'react';
import AuthUserContext from './Context';
import { withFirebase } from '../firebase';
import axios from 'axios';

const withAuthentication = Component => {
  class withAuthentication extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        authUser: null,
        authTokenRecieved: false,
      };
    }

    componentDidMount() {
      this.listener = this.props.firebase.auth.onAuthStateChanged(authUser => {
        console.log(authUser);
        if (authUser) {
          this.props.firebase.auth.currentUser.getIdToken().then(idToken => {
            axios.defaults.headers.common['Authorization'] = idToken;

            this.setState({
              authUser: authUser,
              authTokenRecieved: true,
            });
          });
        } else {
          // localStorage.setItem('authUser', null);
          this.setState({ authUser: null, authTokenRecieved: false });
        }
      });
    }

    componentWillUnmount() {
      this.listener();
    }

    render() {
      return (
        <AuthUserContext.Provider value={this.state}>
          <Component {...this.props} />
        </AuthUserContext.Provider>
      );
    }
  }

  return withFirebase(withAuthentication);
};

export default withAuthentication;
