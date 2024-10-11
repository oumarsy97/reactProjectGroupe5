// src/context/ActorContext.js
import React, { createContext, useContext, useState } from 'react';

const ActorContext = createContext();

export const ActorProvider = ({ children }) => {
    const [actor, setActor] = useState(null); // Gérer les données utilisateur manuellement

    const login = (userData) => {
        setActor(userData); // Mettre à jour les données utilisateur
    };

    const logout = () => {
        setActor(null); // Réinitialiser l'utilisateur
    };

    return (
        <ActorContext.Provider value={{ actor, setActor,logout,login }}>
            {children}
        </ActorContext.Provider>
    );
};

// Hook pour accéder au contexte des acteurs
export const useActor = () => {
    return useContext(ActorContext);
};
