

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
    if(isAuthenticated){
        navigate("/")
    }

    useEffect(() => {
        const checkAuth = async () => {
            const token = getToken();
            if (token && !isAuthenticated) {
                try {
                    await loadUserData(token);
                    navigate('/');
                    setIsAuthenticated(true);
                } catch (err) {
                    handleLogout();
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
                navigate('/home');
                AlertService.success("Connexion réussie");
            } else {
                // Logique d'inscription (le composant Signup prend en charge cela)
            }
        } catch (err) {
            setError("Une erreur est survenue. Veuillez réessayer.");
        } finally {
            setLoading(false);
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
    // ... le reste de votre composant (rendu, gestion des inputs, etc.)


    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
            <div className="max-w-8xl w-1/2 h-[700px] bg-white pl-8 rounded-xl shadow-lg flex">
                <div className="w-[30%] z-[2] flex flex-col justify-center items-center">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {isLoginMode ? 'Se Connecter' : 'S\'inscrire'}
                        </h2>
                    </div>
                    {isLoginMode ? (
                        // Formulaire de connexion
                        <div className="space-y-4 w-full ml-6">
                            <div>
                                <label htmlFor="email" className="sr-only">Email address</label>
                                <input
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                    placeholder="Email address"
                                    value={credentials.email}
                                    onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">Password</label>
                                <input
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                    placeholder="Password"
                                    value={credentials.password}
                                    onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                                />
                            </div>
                            <div className="">
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="w-full z-20 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                >
                                    {loading ? 'Connexion en cours...' : 'Se connecter'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        // Formulaire d'inscription (le composant Signup est utilisé ici)
                        <Signup />
                    )}

                    <div className="mb-6 mt-6">
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
                </div>

                <div
                    className="relative rounded-r-xl w-[75%] h-full flex items-center overflow-hidden bg-gradient-to-r from-purple-900 to-indigo-900">
                    <img
                        src="./images/ciseau.png"
                        alt="ciseau"
                        className="ml-[-320px] mt-2 h-[108%]"
                    />
                    <img src="./images/logoo.png" alt="Logo" className="w-60 ml-12"/>
                </div>
            </div>
        </div>
    );
};

export default Login;
