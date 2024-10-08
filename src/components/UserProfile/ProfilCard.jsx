import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';  // Assure-toi que le chemin est correct
import { fetActorByUserId } from '../../services/ActorService';  // Fonction pour récupérer les infos de l'acteur
import { LocationMarkerIcon, CreditCardIcon } from '@heroicons/react/solid';  // Import des icônes

const ProfileCard = () => {
    const { user } = useAuth();  // Récupérer les données de l'utilisateur connecté
    const [actor, setActor] = useState(null); // État pour stocker les données de l'acteur

    useEffect(() => {
        // Vérifie si l'utilisateur est connecté et s'il n'est pas un client
        if (user && user.role !== 'USER') {
            const fetchActorData = async () => {
                try {
                    const actorData = await fetActorByUserId(user.id); // Récupérer les données de l'acteur via l'ID utilisateur
                    setActor(actorData); // Mettre à jour l'état avec les données de l'acteur
                } catch (error) {
                    console.error('Erreur lors de la récupération des données de l\'acteur :', error);
                }
            };
            fetchActorData();
        }
    }, [user]);

    if (!user) return null;  // Si l'utilisateur n'est pas connecté, renvoyer null

    return (
        <div className="text-center mb-6">
            {/* Photo de profil */}
            <div className="h-20 w-20 mx-auto rounded-full bg-gradient-to-r from-rose-400 to-purple-400 p-1">
                <div className="h-full w-full rounded-full bg-white p-0.5">
                    <img
                        src={user?.photo || "/api/placeholder/100/100"}  // Afficher la photo de profil ou un placeholder par défaut
                        alt="Profile"
                        className="rounded-full object-cover w-full h-full"  // Assurer que l'image s'adapte bien dans le cercle
                    />
                </div>
            </div>

            {/* Nom de l'utilisateur */}
            <h2 className="mt-4 font-serif text-xl">{user?.firstname} {user?.lastname}</h2>

            {/* Afficher les informations supplémentaires si l'utilisateur n'est pas un client */}
            {user.role !== 'USER' && actor && (
                <div className="mt-3 space-y-2">
                    {/* Adresse */}
                    <p className="text-gray-600 text-xl flex items-center">
                        <LocationMarkerIcon className="w-5 h-5 mr-2" />
                        Adresse: {actor.address || 'Pas d\'adresse'}
                    </p>

                    {/* Crédits restants */}
                    <p className="text-gray-600 text-xl flex items-center">
                        <CreditCardIcon className="w-5 h-5 mr-2" />
                        Crédits restant: {actor.credits || 0}
                    </p>

                    {/* Bio */}
                    <p className="text-gray-600 text-xl flex items-center">Bio: {actor.bio || 'Pas de bio disponible'}</p>
                </div>
            )}
        </div>
    );
};

export default ProfileCard;
