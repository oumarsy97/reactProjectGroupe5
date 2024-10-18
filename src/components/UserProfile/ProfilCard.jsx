import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useActor } from "../../context/ActorContext";
import { MapPin, CreditCard, User } from 'lucide-react';

const ProfileCard = () => {
    const { user } = useAuth();
    const { actor } = useActor();

    if (!user) return null;

    return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-violet-300 to-gray-200 p-4">
                <div className="relative mx-auto h-24 w-24 rounded-full border-4 border-white shadow-lg">
                    <img
                        src={user?.photo || "/api/placeholder/100/100"}
                        alt="Profile"
                        className="rounded-full object-cover w-full h-full"
                    />
                    {/* <StoryApp /> */}
                    {user.role !== 'USER' && (
                        <span className="absolute bottom-0 right-0 block h-6 w-6 rounded-full bg-green-400 border-2 border-white" title="En ligne"></span>
                    )}
                </div>
            </div>

            <div className="p-4">
                <h2 className="text-2xl font-semibold text-center text-gray-800">{user?.firstname} {user?.lastname}</h2>
                <p className="text-violet-600 text-center mt-1">{user.role}</p>

                {user.role !== 'USER' && actor && (
                    <div className="mt-4 space-y-3">
                        <div className="flex items-center text-gray-600">
                            <MapPin className="w-5 h-5 mr-2 text-violet-500"/>
                            <span>{actor.address || 'Pas d\'adresse'}</span>
                        </div>



                        <div className="flex items-start text-gray-600">
                            <User className="w-5 h-5 mr-2 text-violet-500 mt-1"/>
                            <p className="flex-1">{actor.bio || 'Pas de bio disponible'}</p>
                        </div>

                    </div>
                )}
            </div>


        </div>
    );
};

export default ProfileCard;