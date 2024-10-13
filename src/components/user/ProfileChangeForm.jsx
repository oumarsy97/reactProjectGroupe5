import React, { useState } from 'react';
import useCrud from "../../hooks/useCrudAxios";
import AlertService from "../../services/notifications/AlertService";
import { useActor } from "../../context/ActorContext";
import { useAuth} from "../../context/AuthContext";

const ProfileChangeForm = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const {setActor} = useActor();
    const {token} = useAuth();
    const {setUser} = useAuth();

    const [formData, setFormData] = useState({
        profileType: '',
        address: '',
        bio: ''
    });
    const {create:createTailor} = useCrud('users/becometailor');
    const {create:createVendor} = useCrud('users/becomevendor');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });

    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);

        const formPayload = new FormData();
        Object.keys(formData).forEach(key => formPayload.append(key, formData[key]));

    let data;
        if (formData.profileType === 'TAILOR') {
             data = await createTailor( {bio:formData.bio, address:formData.address})
        } else if (formData.profileType === 'VENDOR') {
             data = await createVendor( {bio:formData.bio, address:formData.address})
        }
        console.log(data)
        setActor(data);
        setUser(data.user);
        AlertService.success("vous est maintenant " + formData.profileType + " vous avez 50 credits !!!", 3000)
        setIsFormOpen(false);
    };

    return (
        <div className="w-full max-w-xs mx-auto font-sans bg-blue-950">
            <button
                onClick={() => setIsFormOpen(!isFormOpen)}
                className="w-full mb-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-4 rounded-full transition duration-300"
            >
                {isFormOpen ? "Fermer" : "Changer de profil"}
            </button>

            {isFormOpen && (
                <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg px-6 pt-4 pb-6">
                    <div className="mb-3">
                        <select
                            name="profileType"
                            value={formData.profileType}
                            onChange={handleChange}
                            className="w-full text-black border-b border-gray-300 focus:border-indigo-500 outline-none py-1"
                            required
                        >
                            <option value="">Type de profil</option>
                            <option value="VENDOR">VENDOR</option>
                            <option value="TAILOR">TAILOR</option>
                        </select>
                    </div>
                    <div className="mb-3 text-black">
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Adresse"
                            className="w-full text-sm border-b border-gray-300 focus:border-indigo-500 outline-none py-1"
                            required
                        />
                    </div>
                    <div className="mb-4 text-black">
            <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Bio"
                className="w-full text-sm border-b border-gray-300 focus:border-indigo-500 outline-none py-1 resize-none"
                rows="2"
                required
            />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-4 rounded-full transition duration-300"
                    >
                        Enregistrer
                    </button>
                </form>
            )}
        </div>
    );
};

export default ProfileChangeForm;