// eslint-disable-next-line no-unused-vars
import React, { createContext, useState } from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

export const Context = createContext({ isAuthorized: false});

const AppWrapper = () =>{
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState({});

  return(
    <Context.Provider value={{isAuthorized, setIsAuthorized, user, setUser}}>
         <App />
    </Context.Provider>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppWrapper/>
  </StrictMode>,
)
