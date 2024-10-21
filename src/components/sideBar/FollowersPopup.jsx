import React, { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { useAuth } from "../../context/AuthContext";
import { useActor } from "../../context/ActorContext";
import AlertService from "../../services/notifications/AlertService";
import useCrud from "../../hooks/useCrudAxios";

const UserItem = ({ user, isFollowing, onToggleFollow }) => (
  <div className="flex items-center justify-between py-2">
    <div className="flex items-center">
      <img src={user.photo} alt={user.firstname} className="w-10 h-10 rounded-full mr-3" />
      <div>
        <p className="font-semibold text-gray-700">{user.firstname} {user.lastname}</p>
        <p className="text-sm text-gray-500">{user.role}</p>
      </div>
    </div>
    <button 
      onClick={() => onToggleFollow(user.id, isFollowing)}
      className={`px-3 py-1 rounded ${isFollowing ? 'bg-gray-200 text-black' : 'bg-purple-600 text-white hover:bg-purple-700 transition duration-200'}`}
    >
      {isFollowing ? 'Suivi' : 'Suivre'}
    </button>
  </div>
);

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-48">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
  </div>
);

const FollowersPopup = ({ onClose, initialTab }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const { actor } = useActor();
  const {user} = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [tabData, setTabData] = useState([]);
  
  const followApi = useCrud('follow');
  const [suggestedUsers, setSuggestedUsers] = useState([]);

  // Fonction pour charger les utilisateurs suggérés
  const fetchSuggestedUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const suggested = await followApi.get('/suggested');
      setSuggestedUsers(suggested);
    } catch (error) {
      AlertService.error("Erreur lors du chargement des utilisateurs suggérés");
      console.error("Erreur de chargement:", error);
    } finally {
      setIsLoading(false);
    }
  }, [followApi]);

  // Effet pour charger les données initiales quand l'onglet change
  useEffect(() => {
    const loadTabData = () => {
      setIsLoading(true);
      let data = [];

      // Vérifiez si actor est défini
      if (!actor || !actor.follow) {
        console.warn('actor.follow est vide ou non défini'); // Debug: Vérifier si actor.follow est présent
        setTabData([]);
        setIsLoading(false);
        return;
      }

      switch (activeTab) {
        case 'followers':
          // Les utilisateurs qui suivent l'acteur courant
          data = actor.follow
            .map(follow => ({
              id: follow.user.id, // Utilisation de follow au lieu de user
              firstname: follow.user.firstname,
              lastname: follow.user.lastname,
              photo: follow.user.photo || '',
              role: follow.user.role,
              isFollowing: true // tous ceux qui sont des abonnés sont déjà suivis
            }));
          break;
        case 'following':
          // Les utilisateurs que l'acteur suit
          data = user.follow
            .map(follow => ({
              id: follow.user.id, // Utilisation de follow au lieu de user
              firstname: follow.user.firstname,
              lastname: follow.user.lastname,
              photo: follow.user.photo || '',
              role: follow.user.role,
              isFollowing: true
            }));
          break;
        case 'suggested':
          data = suggestedUsers; // Utilisateurs suggérés
          break;
        default:
          data = [];
      }
      setTabData(data);
      setIsLoading(false);
    };

    loadTabData();
  }, [activeTab, actor, suggestedUsers]);

  const handleToggleFollow = async (userId, isCurrentlyFollowing) => {
    if (!actor) return;
    try {
      if (isCurrentlyFollowing) {
        await followApi.remove(userId);
        // Mettre à jour actor.follow localement
        actor.follow = actor.follow.filter(f => f.user.id !== userId);
      } else {
        const newFollow = await followApi.create({ followedId: userId });
        actor.follow.push(newFollow);
      }
      
      // Recharger les données de l'onglet actif
      if (activeTab === 'suggested') {
        fetchSuggestedUsers();
      } else {
        setTabData(current => 
          current.map(user => 
            user.id === userId 
              ? { ...user, isFollowing: !isCurrentlyFollowing }
              : user
          )
        );
      }
      
      AlertService.success(isCurrentlyFollowing ? "Désabonné avec succès" : "Abonné avec succès");
    } catch (error) {
      AlertService.error("Erreur lors de la modification de l'abonnement");
      console.error("Erreur d'abonnement:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[9999] transition-opacity duration-300">
      <div className="bg-white rounded-lg w-[500px] max-h-[80vh] h-[700px] overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white">
          <h2 className="text-lg font-semibold">Gestion des abonnements</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200 transition">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex bg-gray-100">
          {['followers', 'following', 'suggested'].map((tab) => (
            <button
              key={tab}
              className={`flex-1 py-2 text-center text-gray-600 ${activeTab === tab ? 'bg-white text-purple-600 font-semibold border-b-2 border-purple-600' : 'hover:bg-white'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'followers' ? 'Abonnés' : tab === 'following' ? 'Abonnements' : 'Suggérés'}
            </button>
          ))}
        </div>
        <div className="overflow-y-auto max-h-[60vh] p-4 space-y-4">
          {isLoading ? (
            <LoadingSpinner />
          ) : tabData.length > 0 ? (
            tabData.map(user => (
              <UserItem 
                key={user.id} 
                user={user} 
                isFollowing={user.isFollowing}
                onToggleFollow={handleToggleFollow}
              />
            ))
          ) : (
            <p className="text-center text-gray-500">Aucun utilisateur à afficher</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowersPopup;
