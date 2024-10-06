import React from 'react';
import { useAuth } from '../../context/AuthContext';  // Assure-toi que le chemin est correct

const ProfileCard = () => {
    const { user } = useAuth();  // Récupérer les données de l'utilisateur connecté

    return (
        <div className="text-center mb-6">
            <div className="h-20 w-20 mx-auto rounded-full bg-gradient-to-r from-rose-400 to-purple-400 p-1">
                <div className="h-full w-full rounded-full bg-white p-0.5">
                    <img
                        src={user?.photo || "/api/placeholder/100/100"}  // Afficher la photo de profil ou un placeholder par défaut
                        alt="Profile"
                        className="rounded-full object-cover w-full h-full"  // Assurer que l'image s'adapte bien dans le cercle
                    />
                </div>
            </div>
            <h2 className="mt-4 font-serif text-xl">{user?.firstname} {user?.lastname}</h2>
            <p className="text-gray-600">{user?.specialty || 'Spécialité de l\'utilisateur'}</p>
        </div>
    );
};

export default ProfileCard;
