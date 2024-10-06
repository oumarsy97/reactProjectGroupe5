import React, { useState } from 'react';
import AuthService from '../services/AuthService'; // Assurez-vous que le chemin est correct
import { fetchUserData } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Signup from './user/Signup'; // Assurez-vous que le chemin est correct

const Login = () => {
    const { login: setUser } = useAuth();
    const navigate = useNavigate();

    const [isLoginMode, setIsLoginMode] = useState(true);
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const toggleMode = () => {
        setIsLoginMode(!isLoginMode);
        setCredentials({ email: '', password: '' });
        setError(null);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        try {
            if (isLoginMode) {
                // Connexion
                await AuthService.login(credentials.email, credentials.password);
                const userData = await fetchUserData();
                setUser(userData);
                navigate('/home');
            } else {
                // Inscription : le composant Signup gère cela
                // Naviguez vers la page d'accueil ou gérez le redirection après inscription si nécessaire
            }
        } catch (err) {
            if (err.response && err.response.status === 401) {
                setError("Login ou mot de passe incorrect");
            } else {
                setError("Une erreur est survenue. Veuillez réessayer.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-indigo-500">
            <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md">
                <div className="mb-6">
                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={() => setIsLoginMode(true)}
                            className={`text-lg font-bold ${isLoginMode ? 'text-indigo-600' : 'text-gray-400'} focus:outline-none`}
                        >
                            Connexion
                        </button>
                        <button
                            onClick={() => setIsLoginMode(false)}
                            className={`text-lg font-bold ${!isLoginMode ? 'text-indigo-600' : 'text-gray-400'} focus:outline-none`}
                        >
                            Inscription
                        </button>
                    </div>
                </div>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                {isLoginMode ? (
                    <>
                        {/* Formulaire de connexion */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Entrer votre email"
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-indigo-500"
                                value={credentials.email}
                                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                            />
                        </div>

                        <div className="mb-4 ">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                id="password"
                                placeholder="Entrer votre mot de passe"
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-indigo-500"
                                value={credentials.password}
                                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            />
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className={`w-full bg-indigo-500 text-white p-3 rounded-lg shadow-md font-bold hover:bg-indigo-600 focus:outline-none transition duration-300 ${
                                loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {loading ? 'Connexion en cours...' : 'Se connecter'}
                        </button>
                    </>
                ) : (
                    <Signup />
                )}

                {isLoginMode && (
                    <div className="mt-4 text-center">
                        <a href="#" className="text-indigo-500 hover:text-indigo-700 text-sm">
                            Mot de passe oublié ?
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
