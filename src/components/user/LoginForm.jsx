import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { login,  } from '../../services/apiService';
import { setToken } from '../../utils/tokenUtils';

import { X } from 'lucide-react';
import {TimedAlert} from "./TimedAlert";

export default function LoginForm({ onClose, onSwitchForm, onBack }) {
  const { login: authLogin } = useAuth();
  const [alertInfo, setAlertInfo] = useState({ message: '', type: 'error' });
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlertInfo({ message: '', type: 'error' });

    try {
      const response = await login(formData);
      if (response.token) {
        setToken(response.token);
        authLogin(response.user);
        setAlertInfo({ message: 'Connexion réussie !', type: 'success' });
        setTimeout(onClose, 3000);
        onClose();
      }
    } catch (err) {
      setAlertInfo({ 
        message: err.response?.data?.message || 'Une erreur est survenue lors de l\'inscription', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="max-w-8xl w-1/2 h-[600px] bg-white pl-8 rounded-xl shadow-lg flex">
        <div
          className="absolute rounded-3xl z-10"
        >
          {alertInfo.message && (
            <TimedAlert 
              message={alertInfo.message} 
              type={alertInfo.type} 
              onClose={() => setAlertInfo({ message: '', type: 'error' })} 
            />
          )}
        </div>
        <div className="w-[30%] z-[2] flex flex-col justify-center items-center">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Se Connecter
            </h2>
          </div>
          <form className="space-y-4 w-full ml-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="">
              <button
                type="submit"
                disabled={loading}
                className="w-full z-20 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                {loading ? "Connexion..." : "Se connecter"}
              </button>
            </div>
          </form>

          <div className="mt-6 w-full">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <div>
                <a
                  href="#"
                  className="w-full inline-flex justify-center py-2 px-4 border border-green-300 rounded-md shadow-sm bg-white text-sm font-medium text-green-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Sign in with Google</span>
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                  </svg>
                </a>
              </div>

              <div>
                <a
                  href="#"
                  className="w-full inline-flex justify-center py-2 px-4 border border-blue-300 rounded-md shadow-sm bg-white text-sm font-medium text-blue-800 hover:bg-gray-50"
                >
                  <span className="sr-only">Sign in with Facebook</span>
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>

              <div>
                <a
                  href="#"
                  className="w-full inline-flex justify-center pt-1 px-4 border border-gray-900 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Sign in with Apple</span>
                  <svg
                    className="w-8 h-8"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 30 30"
                  >
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={onBack}
              className="text-purple-600 hover:text-purple-700 text-sm"
            >
              Retour
            </button>
            <div className="mt-2">
              <span className="text-gray-600">Pas encore de compte ?</span>{' '}
              <button
                onClick={onSwitchForm}
                className="font-medium text-purple-600 hover:text-purple-500"
              >
                S'inscrire
              </button>
            </div>
          </div>
        </div>
        <div className="relative rounded-r-xl w-[75%] h-full flex items-center overflow-hidden bg-gradient-to-r from-purple-900 to-indigo-900">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-700 z-10"
          >
            <X size={24} />
          </button>
          <img
            src="./images/ciseau.png"
            alt="ciseau"
            className="ml-[-320px] mt-2 h-[108%]"
          />
          <img src="./images/logoo.png" alt="Logo" className="w-60 ml-12" />
        </div>
      </div>
    </div>
  );
}
