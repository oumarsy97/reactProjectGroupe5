// src/context/TokenContext.js
import React, { createContext, useContext, useState } from 'react';

const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
    const [token, setToken] = useState(null);

    const getToken = () => {
        return token;
    };

    const setNewToken = (newToken) => {
        setToken(newToken);
    };

    return (
        <TokenContext.Provider value={{ token, setToken, getToken , setNewToken}}>
            {children}
        </TokenContext.Provider>
    );
};

// Hook pour accéder au contexte du token
export const useToken = () => {
    return useContext(TokenContext);
};
