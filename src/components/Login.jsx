import React, { useState } from 'react';
import AuthService from '../services/AuthService';
import { fetchUserData } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Signup from './user/Signup';
import Swal from 'sweetalert2';
import AlertService from "../services/notifications/AlertService";
import {getToken} from "../utils/tokenUtils";

const Login = () => {
    const { login: setUser } = useAuth();
    const navigate = useNavigate();
    if(getToken()){

       navigate('/home');
    }

    const [isLoginMode, setIsLoginMode] = useState(true);
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const showSuccessAlert = () => {
        Swal.fire({
            title: 'Connexion réussie!',
            text: 'Vous allez être redirigé...',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
            background: '#fff',
            customClass: {
                popup: 'rounded-xl',
                title: 'text-xl font-bold text-gray-900',
                text: 'text-gray-600'
            }
        });
    };
    const showErrorAlert = () => {
        Swal.fire({
            title: 'Erreur de connexion',
            text: 'Vérifiez votre login et mot de passe',
            icon: 'error',
            timer: 2000,
            showConfirmButton: false,
            background: '#fff',
            customClass: {
                popup: 'rounded-xl',
                title: 'text-xl font-bold text-gray-900',
                text: 'text-gray-600'
            }
        });
    }

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        try {
            if (isLoginMode) {
                await AuthService.login(credentials.email, credentials.password);
                const userData = await fetchUserData();
                setUser(userData);
                await AlertService.success("connexion successful");
                navigate('/home');
            } else {
                // Logique d'inscription si nécessaire
            }
        } catch (err) {
            if (err.response && err.response.status === 401) {
                await showErrorAlert()
                setError("Login ou mot de passe incorrect");
            } else {
                setError("Une erreur est survenue. Veuillez réessayer.");
            }
        } finally {
            setLoading(false);
        }


};

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
