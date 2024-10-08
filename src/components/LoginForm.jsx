// components/LoginForm.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function LoginForm() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await login({ email, password });
            setLoading(false);
            alert("Connexion réussie !");
        } catch (err) {
            // Gestion des erreurs
            if (err.response && err.response.status === 401) {
                setError("Login ou mot de passe incorrect");
            } else {
                setError("Une erreur est survenue. Veuillez réessayer.");
            }
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-lg w-80">
                <h2 className="text-2xl font-bold mb-4 text-center">Connexion</h2>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <div className="mb-4">
                    <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="email">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Entrer votre email"
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="password">
                        Mot de passe
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Entrer votre mot de passe"
                    />
                </div>

                <button
                    type="submit"
                    className={`w-full p-2 mt-4 bg-blue-500 text-white rounded ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
                    disabled={loading}
                >
                    {loading ? 'Connexion en cours...' : 'Se connecter'}
                </button>
            </form>
        </div>
    );
}

export default LoginForm;
