// src/context/AuthContext.js
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Gérer les données utilisateur manuellement

    const login = (userData) => {
        setUser(userData); // Mettre à jour les données utilisateur
    };

    const logout = () => {
        setUser(null); // Réinitialiser l'utilisateur

    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook pour accéder au contexte utilisateur
export const useAuth = () => {
    return useContext(AuthContext);
};
