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

        const formPayload = new FormData();  // Create FormData
        Object.keys(formData).forEach(key => formPayload.append(key, formData[key]));
        if (photo) {
            formPayload.append('photo', photo);  // Append photo to FormData
        }

        try {
            let data ;
            if (formData.role === 'CLIENT') {
             //   data = await createUser(formPayload);  // Send as FormData
               data = await createUser(formPayload, true);
               console.log(data);

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
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
            <div className="max-w-8xl w-1/2 h-[700px] bg-white pl-8 rounded-xl shadow-lg flex">
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <div className="w-[50%] z-[2] flex flex-col justify-center items-center">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Inscription</h2>
                    </div>
                    <form className="w-full grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
                        <div>
                            <input
                                type="text"
                                name="firstname"
                                placeholder="Entrer votre prénom"
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                value={formData.firstname}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                name="lastname"
                                placeholder="Entrer votre nom"
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                value={formData.lastname}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <input
                                type="email"
                                name="email"
                                placeholder="Entrer votre email"
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                name="phone"
                                placeholder="Entrer votre numéro de téléphone"
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                value={formData.phone}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                name="password"
                                placeholder="Entrer votre mot de passe"
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirmer votre mot de passe"
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="col-span-2 flex items-center space-x-4">
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
                                        <img src={photoPreview} alt="Preview"
                                             className="w-full h-full object-cover rounded-full"/>
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
                        <div>
                            <select
                                name="genre"
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                value={formData.genre}
                                onChange={handleInputChange}
                            >
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>

                            </select>
                        </div>
                        <div>
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
                                <div className="col-span-2">
                      <textarea
                          name="bio"
                          placeholder="Décrivez-vous"
                          className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                          value={formData.bio}
                          onChange={handleInputChange}
                          rows="3"
                      />
                                </div>
                                <div className="col-span-2">
                                    <input
                                        name="address"
                                        type="text"
                                        className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                        placeholder="Entrer votre adresse"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </>
                        )}
                        <div className="col-span-2">
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                            >
                                {loading ? 'Inscription en cours...' : 'S\'inscrire'}
                            </button>

                        </div>
                    </form>

                    {/* Add toggle buttons */}
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
                    <img src="./images/ciseau.png" alt="ciseau" className='ml-[-320px] mt-2 h-[108%]'/>
                    <img src='./images/logoo.png' alt="Logo" className='w-60 ml-12'/>
                </div>
            </div>
        </div>
    );
};

export default Signup;