

import React, { useState, useEffect } from 'react';
import AuthService from '../services/AuthService';
import { useAuth } from '../context/AuthContext';
import { useActor } from '../context/ActorContext';
import { useNavigate } from 'react-router-dom';
import Signup from './user/Signup';
import { useToken } from '../context/TokenContext';
import useCrud from '../hooks/useCrudAxios';
import AlertService from "../services/notifications/AlertService";

const Login = () => {
    const { login: setUser, logout: clearUser } = useAuth();
    const { setToken, getToken, clearToken } = useToken();
    const { login: setActor, logout: clearActor } = useActor();
    const navigate = useNavigate();
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const { get: getUserProfile } = useCrud('users/monprofile');
    const { get: getActorProfile } = useCrud('actors/monprofile');
    if (isAuthenticated) {
        navigate("/")
    }

    useEffect(() => {
        const checkAuth = async () => {
            const token = getToken();
            if (token && !isAuthenticated) {
                try {
                    await loadUserData(token);
                    setIsAuthenticated(true);
                    navigate('/');
                    AlertService.success("Vous êtes maintenant connecté");
                } catch (err) {
                    handleLogout();
                    await AlertService.error("Vous avez été déconnecté");
                }
            }
        };
        checkAuth();
        // eslint-disable-next-line no-use-before-define
    }, [getToken]);

    const loadUserData = async (token) => {
        try {
            const user = await getUserProfile();
            setUser(user);
            if (user.role !== 'USER') {
                const actor = await getActorProfile();
                setActor(actor);
            }
        } catch (error) {
            throw new Error('Failed to load user data');
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        try {
            if (isLoginMode) {
                const data = await AuthService.login(credentials.email, credentials.password);
                setToken(data.token);
                await loadUserData(data.token);
                setIsAuthenticated(true);
                navigate('/');
                AlertService.success("Connexion réussie");
            } else {
                // Logique d'inscription (le composant Signup prend en charge cela)
            }
        } catch (err) {
            setError("Une erreur est survenue. Veuillez réessayer.");
        } finally {
            // setLoading(false);
        }
    };

    const handleLogout = () => {
        clearToken();
        clearUser();
        clearActor();
        setIsAuthenticated(false);
        navigate('/login');
        AlertService.success("Déconnexion réussie");
    };
    return (
        <>
            {isLoginMode ? (
                <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center p-4">
                    <div className="max-w-3xl w-full bg-white rounded-xl shadow-lg flex flex-col lg:flex-row">
                        <div className="w-full lg:w-1/2 p-8 flex flex-col justify-center">
                            <div className="mb-6 text-center">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {isLoginMode ? 'Se Connecter' : 'S\'inscrire'}
                                </h2>
                            </div>
                            <div className="space-y-4 w-full">
                                <input
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                    placeholder="Adresse email"
                                    value={credentials.email}
                                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                                />
                                <input
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                    placeholder="Mot de passe"
                                    value={credentials.password}
                                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                />
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                >
                                    {loading ? 'Connexion en cours...' : 'Se connecter'}
                                </button>
                            </div>
                            <div className="mt-6 grid grid-cols-3 gap-3">
                                <button className="w-full inline-flex justify-center items-center py-2 px-4 border border-green-300 rounded-md shadow-sm bg-white text-sm font-medium text-green-500 hover:bg-gray-50">
                                    <span className="sr-only">Sign in with Google</span>
                                    <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                                    </svg>
                                </button>
                                <button className="w-full inline-flex justify-center items-center py-2 px-4 border border-blue-300 rounded-md shadow-sm bg-white text-sm font-medium text-blue-800 hover:bg-gray-50">
                                    <span className="sr-only">Sign in with Facebook</span>
                                    <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                <button className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-900 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                    <span className="sr-only">Sign in with Apple</span>
                                    <svg className="w-7 h-7" aria-hidden="true" fill="currentColor" viewBox="0 0 30 30">
                                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                                    </svg>
                                </button>
                            </div>
                            <div className="mt-6 flex justify-center space-x-4">
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

                        <div className="hidden lg:block w-1/2 relative rounded-r-xl overflow-hidden bg-gradient-to-r from-purple-900 to-indigo-900">
                            <img
                                src="./images/ciseau.png"
                                alt="ciseau"
                                className="absolute left-0 top-0 h-full object-cover transform -translate-x-1/2 "
                            />
                            <img
                                src="./images/logoo.png"
                                alt="Logo"
                                className="absolute top-1/2 left-2/3 transform -translate-x-1/2 -translate-y-1/2 w-48"
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <Signup />
            )}
        </>
    );
};

export default Login;
