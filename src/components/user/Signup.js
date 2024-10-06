import React, { useState } from 'react';
import { createUser } from '../../services/userService';
import { createActor } from '../../services/ActorService';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        genre: 'MALE',
        role: 'CLIENT',
        bio: '',
        photo: null,
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            photo: e.target.files[0],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            setLoading(false);
            return;
        }

        const { firstname, lastname, email, password, phone, genre, role, bio, photo } = formData;

        try {
            if (role === 'CLIENT') {
                await createUser({
                    firstname,
                    lastname,
                    email,
                    password,
                    phone,
                    genre,
                    photo,
                });
            } else {
                await createActor({
                    firstname,
                    lastname,
                    email,
                    password,
                    phone,
                    genre,
                    role,
                    bio,
                    photo,
                });
            }

            navigate('/home');
        } catch (err) {
            setError('Une erreur est survenue. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center  justify-center w-[600px] bg-gradient-to-r from-green-400 to-blue-500">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
                <h1 className="text-4xl font-extrabold text-center mb-6 text-gray-800">Inscription</h1>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Prénom */}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstname">
                            Prénom
                        </label>
                        <input
                            type="text"
                            id="firstname"
                            name="firstname"
                            placeholder="Entrer votre prénom"
                            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-green-500 transition duration-300"
                            value={formData.firstname}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Nom de famille */}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastname">
                            Nom
                        </label>
                        <input
                            type="text"
                            id="lastname"
                            name="lastname"
                            placeholder="Entrer votre nom"
                            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-green-500 transition duration-300"
                            value={formData.lastname}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Entrer votre email"
                            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-green-500 transition duration-300"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Mot de passe */}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Mot de passe
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Entrer votre mot de passe"
                            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-green-500 transition duration-300"
                            value={formData.password}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Confirmer mot de passe */}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                            Confirmer le mot de passe
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="Confirmer votre mot de passe"
                            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-green-500 transition duration-300"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Téléphone */}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                            Téléphone
                        </label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            placeholder="Entrer votre numéro de téléphone"
                            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-green-500 transition duration-300"
                            value={formData.phone}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Genre */}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Genre</label>
                        <select
                            name="genre"
                            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-green-500 transition duration-300"
                            value={formData.genre}
                            onChange={handleInputChange}
                        >
                            <option value="MALE">Homme</option>
                            <option value="FEMALE">Femme</option>
                            <option value="OTHER">Autre</option>
                        </select>
                    </div>

                    {/* Rôle */}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Type de compte</label>
                        <select
                            name="role"
                            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-green-500 transition duration-300"
                            value={formData.role}
                            onChange={handleInputChange}
                        >
                            <option value="CLIENT">Client</option>
                            <option value="TAILOR">Tailleur</option>
                            <option value="VENDOR">Vendeur</option>
                        </select>
                    </div>

                    {/* Bio pour Tailor ou Vendor */}
                    {formData.role !== 'CLIENT' && (
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bio">
                                Biographie
                            </label>
                            <textarea
                                id="bio"
                                name="bio"
                                placeholder="Décrivez-vous"
                                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-green-500 transition duration-300"
                                value={formData.bio}
                                onChange={handleInputChange}
                            />
                        </div>

                    )}

                    {/* Photo */}
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Photo de profil</label>
                        <input
                            type="file"
                            id="photo"
                            name="photo"
                            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-green-500 transition duration-300"
                            onChange={handleFileChange}
                        />
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-green-500 text-white p-4 rounded-lg shadow-md font-bold transition duration-300 ${
                                loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'
                            }`}
                        >
                            {loading ? 'Inscription en cours...' : 'S\'inscrire'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;
