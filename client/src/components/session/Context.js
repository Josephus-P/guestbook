import React from 'react';

const AuthUserContext = React.createContext(null);

export const withAuthUser = Component => props => (
  <AuthUserContext.Consumer>
    {({ authUser, authTokenRecieved }) => (
      <Component
        {...props}
        authUser={authUser}
        authTokenRecieved={authTokenRecieved}
      />
    )}
  </AuthUserContext.Consumer>
);

export default AuthUserContext;
