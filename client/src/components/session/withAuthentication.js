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
        loading: true,
      };
    }

    componentDidMount() {
      this.listener = this.props.firebase.auth.onAuthStateChanged(authUser => {
        if (authUser) {
          return this.props.firebase.auth.currentUser
            .getIdToken()
            .then(idToken => {
              axios.defaults.headers.common['Authorization'] = idToken;

              axios
                .post('/login', {
                  displayName: authUser.displayName,
                  photoURL: authUser.photoURL,
                })
                .then(response => {
                  this.setState({
                    authUser: authUser,
                    authTokenRecieved: true,
                    loading: false,
                  });
                })
                .catch(err => {
                  console.log(err);
                  this.props.firebase.doSignOut();
                  this.setState({ loading: false });
                });
            });
        } else {
          this.setState({
            authUser: null,
            authTokenRecieved: false,
            loading: false,
          });
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
