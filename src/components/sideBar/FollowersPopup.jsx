import React, { useState } from 'react';
import { X } from 'lucide-react';

// Composant pour afficher un seul utilisateur dans la liste
const UserItem = ({ user, isFollowing }) => (
  <div className="flex items-center justify-between py-2">
    <div className="flex items-center">
      <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-full mr-3" />
      <div>
        <p className="font-semibold text-gray-700">{user.username}</p>
        <p className="text-sm text-gray-500">{user.fullName}</p>
      </div>
    </div>
    <button className={`px-3 py-1 rounded ${isFollowing ? 'bg-gray-200 text-black' : 'bg-purple-600 text-white hover:bg-purple-700 transition duration-200'}`}>
      {isFollowing ? 'Suivi' : 'Abonné'}
    </button>
  </div>
);

// Composant principal du popup
const FollowersPopup = ({ onClose, initialTab }) => {
  // État pour gérer l'onglet actif
  const [activeTab, setActiveTab] = useState(initialTab);

  // Données simulées des utilisateurs (à remplacer par des données réelles)
  const [users, setUsers] = useState({
    followers: [
      { id: 1, username: 'FATFIT', fullName: 'faty.fit', avatar: '/api/placeholder/30/30' },
      { id: 2, username: 'Angelique Boyer', fullName: 'angeliqueboyertiktok', avatar: '/api/placeholder/30/30' },
    ],
    following: [
      { id: 3, username: 'Lastgirlbree', fullName: 'lastgirlbree001', avatar: '/api/placeholder/30/30' },
      { id: 4, username: 'Liinda_beautyy', fullName: 'liinda_beautyy', avatar: '/api/placeholder/30/30' },
    ],
    suggested: [
      { id: 5, username: 'Lyricsen_221', fullName: 'lyrics_senegal_221', avatar: '/api/placeholder/30/30' },
      { id: 6, username: 'Sophia Diamond beauty', fullName: 'sophiadiamondbeautyspa', avatar: '/api/placeholder/30/30' },
    ]
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[9999] transition-opacity duration-300">
      <div className="bg-white rounded-lg w-[500px] max-h-[80vh] h-[700px] overflow-hidden shadow-2xl">
        {/* En-tête du popup */}
        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white">
          <h2 className="text-lg font-semibold">khadijahh_g20</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200 transition">
            <X className="w-6 h-6" />
          </button>
        </div>
        {/* Onglets */}
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
        {/* Liste des utilisateurs */}
        <div className="overflow-y-auto max-h-[60vh] p-4 space-y-4">
          {users[activeTab].map(user => (
            <UserItem key={user.id} user={user} isFollowing={activeTab !== 'followers'} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FollowersPopup;
