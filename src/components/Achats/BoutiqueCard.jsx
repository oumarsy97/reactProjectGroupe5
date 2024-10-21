import React from 'react';
import { MapPin, Star, Phone } from 'lucide-react';

const BoutiqueCard = ({user}) => {
    return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="bg-gradient-to-br from-purple-600 to-[#2E1734] p-4 flex justify-between">
                <div className='flex flex-col space-y-3'>
                    <h2 className="text-2xl font-semibold text-center text-indigo-200">{user?.user.firstname} {user?.user.lastname}</h2>
                    <p className="text-indigo-100 text-center mt-1">{user.role}</p>
                </div>
                <div className="relative h-24 w-24 rounded-full border-4 border-blue-500 shadow-lg">
                    <img
                        src={user.user.photo || "/api/placeholder/100/100"}
                        alt="Profile"
                        className="rounded-full object-cover w-full h-full"
                    />
                </div>
            </div>

            <div className="p-4">
                <div className="mt-4 flex justify-between space-y-3">
                    <div className="flex items-center text-gray-600">
                        <MapPin className="w-5 h-5 mr-2 text-violet-500"/>
                        <span>{user.address || 'Pas d\'adresse'}</span>
                    </div>

                    <div className="flex items-center text-gray-600">
                        <Star className="w-5 h-5 mr-2 text-yellow-500 font-black"/>
                        <b> {user.votes || 0} </b>
                    </div>

                    <div className="flex items-start text-gray-600">
                        <Phone className="w-5 h-5 mr-2 text-violet-500 mt-1"/>
                        <p className="flex-1">{user.user.phone || 'Pas de bio disponible'}</p>
                    </div>

                </div>
            </div>


        </div>
    );
};

export default BoutiqueCard;