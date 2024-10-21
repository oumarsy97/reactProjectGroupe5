import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import Login from '../Login';
import AlertService from "../../services/notifications/AlertService";
import useCrud from "../../hooks/useCrudAxios";

const Signup = () => {
    const [isLoginMode, setIsLoginMode] = useState(false);
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
        photo: '',
    });
    const [photo, setPhoto] = useState(null);  // For file handling
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [photoPreview, setPhotoPreview] = useState(null);
    const { create: createUser } = useCrud('users');
    const { create: createActor } = useCrud('actors/create');

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setPhoto(files[0]);  // Store the file
            setPhotoPreview(URL.createObjectURL(files[0]));  // Preview
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            await AlertService.error('Les mots de passe ne correspondent pas');
            setLoading(false);
            return;
        }

        const formPayload = new FormData();
        Object.keys(formData).forEach(key => formPayload.append(key, formData[key]));
        if (photo) {
            formPayload.append('photo', photo);
        }

        console.log('Form Payload:', photo);

        try {
            let data ;
            console.log(formData);
            if (formData.role === 'CLIENT') {
                //   data = await createUser(formPayload);  // Send as FormData
                data = await createUser(formPayload, true);
                //console.log(data);

            } else {
                //  data = await createActor(formPayload);
                data = await createActor(formPayload, true);

            }
            // setToken(data.token);
            await AlertService.success('Inscription réussie!');
            // navigate('/home');
            // navigate('/home');
        } catch (err) {
            await AlertService.error(err.message);
        } finally {
            setLoading(false);
        }
    };
    if (isLoginMode) {
        return <Login />;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center p-4">
            <div className="max-w-6xl w-full bg-white rounded-xl shadow-lg flex flex-col lg:flex-row">
                <div className="w-full lg:w-1/2 p-8 flex flex-col justify-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Inscription</h2>
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input
                                type="text"
                                name="firstname"
                                placeholder="Prénom"
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                value={formData.firstname}
                                onChange={handleInputChange}
                            />
                            <input
                                type="text"
                                name="lastname"
                                placeholder="Nom"
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                value={formData.lastname}
                                onChange={handleInputChange}
                            />
                        </div>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="phone"
                            placeholder="Numéro de téléphone"
                            className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            value={formData.phone}
                            onChange={handleInputChange}
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input
                                type="password"
                                name="password"
                                placeholder="Mot de passe"
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirmer le mot de passe"
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                            <div className="relative">
                                <input
                                    type="file"
                                    name="photo"
                                    accept="image/*"
                                    className="hidden"
                                    id="photo"
                                    onChange={handleInputChange}
                                />
                                <label
                                    htmlFor="photo"
                                    className="cursor-pointer flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-full hover:border-purple-500 transition-colors duration-300"
                                >
                                    {photoPreview ? (
                                        <img src={photoPreview} alt="Preview" className="w-full h-full object-cover rounded-full"/>
                                    ) : (
                                        <Camera className="w-12 h-12 text-gray-400"/>
                                    )}
                                </label>
                            </div>
                            <div className="flex-grow">
                                <p className="text-sm text-gray-600">Upload your photo</p>
                                <p className="text-xs text-gray-400">JPG, PNG or GIF (MAX. 800x400px)</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <select
                                name="genre"
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                value={formData.genre}
                                onChange={handleInputChange}
                            >
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                            </select>
                            <select
                                name="role"
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                value={formData.role}
                                onChange={handleInputChange}
                            >
                                <option value="CLIENT">Client</option>
                                <option value="TAILOR">Tailleur</option>
                                <option value="VENDOR">Vendeur</option>
                            </select>
                        </div>
                        {formData.role !== 'CLIENT' && (
                            <>
                                <textarea
                                    name="bio"
                                    placeholder="Décrivez-vous"
                                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                    value={formData.bio}
                                    onChange={handleInputChange}
                                    rows="3"
                                />
                                <input
                                    name="address"
                                    type="text"
                                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                    placeholder="Entrer votre adresse"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                />
                            </>
                        )}
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                            {loading ? 'Inscription en cours...' : 'S\'inscrire'}
                        </button>
                    </form>
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
                        className="absolute left-0 top-0 h-full object-cover transform -translate-x-1/2"
                    />
                    <img
                        src='./images/logoo.png'
                        alt="Logo"
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/5 -translate-y-2/3 w-48"
                    />
                </div>
            </div>
        </div>
    );
};

export default Signup;
