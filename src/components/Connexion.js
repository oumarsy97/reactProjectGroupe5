import React, { useState } from 'react';
import axios from 'axios';

function Connexion() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Validation des champs
        if (!email || !password) {
            setError("Veuillez remplir tous les champs.");
            setLoading(false);
            return;
        }

        try {
            // Requête vers le backend
            const response = await axios.post('https://votre-api.com/api/auth/login', {
                email,
                password,
            });

            // Stocker le token en cas de succès
            localStorage.setItem('token', response.data.token);

            // Rediriger ou effectuer une autre action
            alert("Connexion réussie !");
            setLoading(false);
        } catch (err) {
            // Gestion des erreurs
            setError("Échec de la connexion : " + (err.response?.data || "Une erreur est survenue."));
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

export default Connexion;
