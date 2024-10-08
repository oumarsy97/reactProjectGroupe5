import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { login, register } from '../../services/apiService';
import { setToken } from '../../utils/tokenUtils';
import { X, Camera } from 'lucide-react';

export function RegisterForm({ onClose, onSwitchForm, onBack }) {
  const { login: authLogin } = useAuth();
  const [alertInfo, setAlertInfo] = useState({ message: '', type: 'error' });
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    photo: '',
    genre: 'MALE',
    role: 'USER',
    biography: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    if (formData.role === 'USER') {
      setFormData(prev => ({ ...prev, biography: '', address: '' }));
    }
  }, [formData.role]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
      setPhotoPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setAlertInfo({ message: 'Les mots de passe ne correspondent pas', type: 'error' });
      return;
    }

    setLoading(true);
    setAlertInfo({ message: '', type: 'error' });

    try {
      const { confirmPassword, ...registrationData } = formData;
      const response = await register(registrationData);
      if (response.token) {
        setToken(response.token);
        authLogin(response.user);
        setAlertInfo({ message: 'Inscription réussie !', type: 'success' });
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
      <div className="max-w-8xl w-1/2 h-[700px] bg-white pl-8 rounded-xl shadow-lg flex">

        <div className="w-[50%] z-[2] flex flex-col justify-center items-center">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Inscription</h2>
          </div>
          <form className="w-full ml-6 grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
            <div>
              <input
                name="firstname"
                type="text"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="First Name"
                value={formData.firstname}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                name="lastname"
                type="text"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="Last Name"
                value={formData.lastname}
                onChange={handleChange}
              />
            </div>
            <div>
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
            <div>
              <input
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                name="phone"
                type="tel"
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="col-span-2 flex items-center space-x-4">
              <div className="relative">
                <input
                  name="photo"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="photo-upload"
                  onChange={handleChange}
                />
                <label
                  htmlFor="photo-upload"
                  className="cursor-pointer flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-full hover:border-purple-500 transition-colors duration-300"
                >
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <Camera className="w-12 h-12 text-gray-400" />
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
                onChange={handleChange}
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <select
                name="role"
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="USER">User</option>
                <option value="TAILOR">Tailleur</option>
                <option value="VENDOR">Vendeur</option>
              </select>
            </div>
            {(formData.role === 'TAILOR' || formData.role === 'VENDOR') && (
              <>
                <div className="col-span-2">
                  <textarea
                    name="biography"
                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    placeholder="Biography"
                    value={formData.biography}
                    onChange={handleChange}
                    rows="3"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    name="address"
                    type="text"
                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}
            <div className='col-span-2'>
              <button
                type="submit"
                disabled={loading}
                className="w-full z-20 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                {loading ? 'Inscription...' : 'S\'inscrire'}
              </button>
            </div>
          </form>
          <div className="mt-4 text-center">
            <button
              onClick={onBack}
              className="text-purple-600 hover:text-purple-700 text-sm"
            >
              Retour
            </button>
            <div className="mt-2">
              <span className="text-gray-600">Déjà un compte ?</span>{' '}
              <button
                onClick={onSwitchForm}
                className="font-medium text-purple-600 hover:text-purple-500"
              >
                Se Connecter
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
          <img src="./images/ciseau.png" alt="ciseau" className='ml-[-320px] mt-2 h-[108%]' />
          <img src='./images/logoo.png' alt="Logo" className='w-60 ml-12' />
        </div>
      </div>
    </div>
  );
}