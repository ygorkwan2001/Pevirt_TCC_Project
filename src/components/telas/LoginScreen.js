import React from 'react';
import Login from '../Login';
import '../estilos/login.css';

const LoginScreen = ({ setIsAuthenticated,setCurrentUser  }) => {
  return (
    <div className="login-screen">
      <Login setIsAuthenticated={setIsAuthenticated} setCurrentUser={setCurrentUser} />
    </div>
  );
};

export default LoginScreen;

