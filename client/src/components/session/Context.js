import React from 'react';

const AuthUserContext = React.createContext(null);

export const withAuthUser = Component => props => (
  <AuthUserContext.Consumer>
    {({ authUser, authTokenRecieved, loading }) => (
      <Component
        {...props}
        authUser={authUser}
        authTokenRecieved={authTokenRecieved}
        loading={loading}
      />
    )}
  </AuthUserContext.Consumer>
);

export default AuthUserContext;
