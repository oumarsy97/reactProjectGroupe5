import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken, removeToken } from '../utils/tokenUtils';
import {fetchUserData} from "../services/userService";  // Fonctions pour gérer les tokens

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Effet pour vérifier l'authentification au chargement de l'application
    useEffect(() => {
        const fetchUser = async () => {
            const token = getToken(); // Récupérer le token s'il existe
            if (token) {
                // Si le token existe, récupérer les données utilisateur
                try {
                    const userData = await fetchUserData();  // Fonction pour récupérer les données utilisateur
                    setUser(userData);

                } catch (error) {
                    console.log('Erreur lors de la récupération des données utilisateur :', error);
                    removeToken(); // Supprimer le token s'il y a une erreur
                }
            }
            setLoading(false);
        };

        fetchUser().then(r => fetch);
    }, []);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
        removeToken();  // Supprimer le token à la déconnexion
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook pour accéder au contexte d'authentification
export const useAuth = () => {
    return useContext(AuthContext);
};
