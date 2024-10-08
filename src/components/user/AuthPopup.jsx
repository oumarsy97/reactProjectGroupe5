import React, { useState } from 'react';
import { X } from 'lucide-react';
import {useAuth} from "../../context/AuthContext";
import {RegisterForm} from "./RegisterForm";
import Login from "../Login";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "./Dialog";

const AuthPopup = ({
  isOpen,
  onClose,
  initialForm = null,
  onLogin,
  onRegister
}) => {
  const [activeForm, setActiveForm] = useState(initialForm);
  const { isAuthenticated } = useAuth();

  // Réinitialiser le formulaire actif quand la popup se ferme
  React.useEffect(() => {
    if (!isOpen) {
      setActiveForm(null);
    } else if (initialForm) {
      setActiveForm(initialForm);
    }
  }, [isOpen, initialForm]);

  // Fermer la popup si l'utilisateur est authentifié
  React.useEffect(() => {
    if (isAuthenticated) {
      onClose();
    }
  }, [isAuthenticated, onClose]);

  const handleLoginSuccess = (userData) => {
    if (onLogin) {
      onLogin(userData);
    }
    onClose();
  };

  const handleRegisterSuccess = (userData) => {
    if (onRegister) {
      onRegister(userData);
    }
    onClose();
  };

  const renderContent = () => {
    switch (activeForm) {
      case 'login':
        return (
          <Login
            onSuccess={handleLoginSuccess}
            onClose={onClose}
            onBack={() => setActiveForm(null)}
            onSwitchForm={() => setActiveForm('register')}
          />
        );
      case 'register':
        return (
          <RegisterForm
            onSuccess={handleRegisterSuccess}
            onClose={onClose}
            onBack={() => setActiveForm(null)}
            onSwitchForm={() => setActiveForm('login')}
          />
        );
      default:
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
            <div className="max-w-8xl w-1/2 h-[600px] bg-white pl-8 rounded-xl shadow-lg flex">
              <div className="w-[30%] z-[2] flex flex-col justify-center items-center">
                <h2 className="text-2xl mb-10 font-bold text-gray-900">Page de Connexion</h2>
                <div className="mb-6">
                </div>
                <div className="flex flex-col space-y-4">
                  <button
                    onClick={() => setActiveForm('login')}
                    className="bg-gray-500 text-purple-900 text-2xl px-12 py-2 rounded hover:bg-purple-100 transition-colors"
                  >
                    Se connecter
                  </button>
                  <button
                    onClick={() => setActiveForm('register')}
                    className="bg-gray-500 text-purple-900 text-2xl px-8 py-2 rounded hover:bg-purple-100 transition-colors"
                  >
                    Créer un compte
                  </button>
                  <button
                    onClick={onClose}
                    className="bg-gray-500 text-purple-900 text-2xl px-8 py-2 rounded hover:bg-purple-100 transition-colors"
                  >
                    Rester sur la page
                  </button>
                </div>

                <div className="mt-6 w-full">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-3">
                    <div>
                      <a href="#" className="w-full inline-flex justify-center py-2 px-4 border border-green-300 rounded-md shadow-sm bg-white text-sm font-medium text-green-500 hover:bg-gray-50">
                        <span className="sr-only">Sign in with Google</span>
                        <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                        </svg>
                      </a>
                    </div>

                    <div>
                      <a href="#" className="w-full inline-flex justify-center py-2 px-4 border border-blue-300 rounded-md shadow-sm bg-white text-sm font-medium text-blue-800 hover:bg-gray-50">
                        <span className="sr-only">Sign in with Facebook</span>
                        <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
                        </svg>
                      </a>
                    </div>

                    <div>
                      <a href="#" className="w-full inline-flex justify-center pt-1 px-4 border border-gray-900 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        <span className="sr-only">Sign in with Apple</span>
                        <svg className="w-8 h-8" aria-hidden="true" fill="currentColor" viewBox="0 0 30 30">
                          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                        </svg>
                      </a>
                    </div>
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
                <img src="ciseau.png" alt="ciseau" className='ml-[-320px] mt-2 h-[108%]' />
                <img src='logoo.png' alt="Logo" className='w-60 ml-12' />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-b from-black to-purple-900 text-white max-w-md w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">
            {activeForm === 'login' ? 'Connexion' :
              activeForm === 'register' ? 'Inscription' :
                'Connexion / Inscription'}
          </DialogTitle>
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-white hover:text-purple-300 transition-colors"
          >
            <X size={24} />
          </button>
        </DialogHeader>
        <div className="p-4">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthPopup;