import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useActor } from "../../context/ActorContext";
import { MapPin, CreditCard, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfileCard = () => {
    const { user } = useAuth();
    const { actor } = useActor();
    const navigate = useNavigate();

    if (!user) return null;

    return (
        <div className="bg-[#fffcf7] shadow-lg rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-[#ff9046] to-[#122a48] p-4">
                <div className="relative mx-auto h-24 w-24 rounded-full border-4 border-[#fffcf7] shadow-lg">
                    <img
                        src={user?.photo || "/api/placeholder/100/100"}
                        alt="Profile"
                        className="rounded-full object-cover w-full h-full"
                    />
                    {user.role !== 'USER' && (
                        <span className="absolute bottom-0 right-0 block h-6 w-6 rounded-full bg-[#ff9046] border-2 border-[#fffcf7]" title="En ligne"></span>
                    )}
                </div>
            </div>

            <div className="p-4">
                <h2 className="text-2xl font-semibold text-center text-[#122a48]">{user?.firstname} {user?.lastname}</h2>
                <p className="text-[#ff9046] text-center mt-1">{user.role}</p>

                {user.role !== 'USER' && actor && (
                    <div className="mt-4 space-y-3">
                        <div className="flex items-center text-[#122a48]">
                            <MapPin className="w-5 h-5 mr-2 text-[#ff9046]"/>
                            <span>{actor.address || 'Pas d\'adresse'}</span>
                        </div>

                        <div className="flex items-center text-[#122a48]">
                            <CreditCard className="w-5 h-5 mr-2 text-[#ff9046]"/>
                            <span>Crédits restants: {actor.credits || 0}</span>
                        </div>

                        <div className="flex items-start text-[#122a48]">
                            <User className="w-5 h-5 mr-2 text-[#ff9046] mt-1"/>
                            <p className="flex-1">{actor.bio || 'Pas de bio disponible'}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileCard;