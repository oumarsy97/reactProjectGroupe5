import React from 'react';
import { useAuth } from '../context/AuthContext'; // Utilisation du contexte d'authentification
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService'; // Service pour gérer la déconnexion

const HomePage = () => {
    const { user, logout: setUserLogout } = useAuth(); // Utilisateur connecté et méthode logout
    const navigate = useNavigate();

    const handleLogout = () => {
        AuthService.logout(); // Déconnexion via le service
        setUserLogout(); // Déconnexion dans le contexte
        navigate('/'); // Redirection vers la page de connexion
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-teal-400">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
                <h1 className="text-4xl font-bold text-center mb-6 text-gray-700">Bienvenue, {user.name}!</h1>

                <div className="text-center mb-8">
                    <p className="text-lg text-gray-600">Email : {user.email}</p>
                    {/* Vous pouvez ajouter plus d'informations utilisateur ici */}
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full bg-red-500 text-white p-3 rounded-lg shadow-md font-bold hover:bg-red-600 focus:outline-none transition duration-300"
                >
                    Se déconnecter
                </button>
            </div>
        </div>
    );
};

export default HomePage;
