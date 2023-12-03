import React, { useEffect, useState } from 'react';
import './App.css';
import { JwtPayload, extractJwtPayload, jwtLocalStorageKey } from './utils/jwtUtils';
import Login from './login/Login';
import MainPage from './mainPage/MainPage';

function App() {

  const [jwtExpired, setJwtExpired] = useState(true);

  const checkTokenExpiration = () => {
    const jwt = localStorage.getItem(jwtLocalStorageKey);
    if (jwt) {

      const decoded: JwtPayload = extractJwtPayload(jwt);
      const expiration = decoded.exp * 1000;

      if (Date.now() > expiration) {
        setJwtExpired(true);
      } else {
        setJwtExpired(false);
      }
    } else {
      setJwtExpired(true);
    }
  };

  useEffect(() => {
    checkTokenExpiration();
  });


  return jwtExpired ? (
      <Login checkExpiration={checkTokenExpiration}/>
    ) : (
      <MainPage />
    );
}

export default App;
