import React from 'react';
import { useFetch } from '../hooks/useFetch';  // Importation du hook
import { fetchUserData } from '../services/userService';  // Importation de la fonction API

const UserProfile = () => {
    // Utiliser useFetch avec la fonction fetchUserData qui retourne une promesse
    const { data: user, loading, error } = useFetch(fetchUserData);


    if (loading) {
        return <p>Chargement des données utilisateur...</p>;
    }

    if (error) {
        return <p>Erreur : {error.message}</p>;
    }

    return (
        <div>
            <h1>Profil de l'utilisateur</h1>
            <p>Nom : {user.firstname}</p>
            <p>Email : {user.email}</p>
        </div>
    );
};

export default UserProfile;
