import React, { useState } from 'react';
import { X } from 'lucide-react';

const UserItem = ({ user, isFollowing }) => (
  <div className="flex items-center justify-between py-2">
    <div className="flex items-center">
      <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-full mr-3" />
      <div>
        <p className="font-semibold">{user.username}</p>
        <p className="text-sm text-gray-500">{user.fullName}</p>
      </div>
    </div>
    <button className={`px-3 py-1 rounded ${isFollowing ? 'bg-gray-200 text-black' : 'bg-red-500 text-white'}`}>
      {isFollowing ? 'Suivre' : 'Abonné'}
    </button>
  </div>
);

const FollowersPopup = ({ onClose, initialTab }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [users, setUsers] = useState({
    followers: [
      { id: 1, username: 'FATFIT', fullName: 'faty.fit', avatar: '/api/placeholder/30/30' },
      { id: 2, username: 'Angelique Boyer', fullName: 'angeliqueboyertiktok', avatar: '/api/placeholder/30/30' },
      // ... autres followers
    ],
    following: [
      { id: 3, username: 'Lastgirlbree', fullName: 'lastgirlbree001', avatar: '/api/placeholder/30/30' },
      { id: 4, username: 'Liinda_beautyy', fullName: 'liinda_beautyy', avatar: '/api/placeholder/30/30' },
      // ... autres following
    ],
    suggested: [
      { id: 5, username: 'Lyricsen_221', fullName: 'lyrics_senegal_221', avatar: '/api/placeholder/30/30' },
      { id: 6, username: 'Sophia Diamond beauty', fullName: 'sophiadiamondbeautyspa', avatar: '/api/placeholder/30/30' },
      // ... autres suggestions
    ]
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-96 max-h-[80vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">khadijahh_g20</h2>
          <button onClick={onClose}><X /></button>
        </div>
        <div className="flex border-b">
          <button
            className={`flex-1 py-2 ${activeTab === 'followers' ? 'border-b-2 border-black' : ''}`}
            onClick={() => setActiveTab('followers')}
          >
            Abonnés 14.3K
          </button>
          <button
            className={`flex-1 py-2 ${activeTab === 'following' ? 'border-b-2 border-black' : ''}`}
            onClick={() => setActiveTab('following')}
          >
            Abonnements 205
          </button>
          <button
            className={`flex-1 py-2 ${activeTab === 'suggested' ? 'border-b-2 border-black' : ''}`}
            onClick={() => setActiveTab('suggested')}
          >
            Suggérés
          </button>
        </div>
        <div className="overflow-y-auto max-h-[60vh] p-4">
          {users[activeTab].map(user => (
            <UserItem key={user.id} user={user} isFollowing={activeTab !== 'followers'} />
          ))}
        </div>
      </div>
    </div>
  );
};

const PopupButtons = ({ onOpenPopup }) => (
  <div className="flex space-x-4">
    <button onClick={() => onOpenPopup('followers')} className="bg-blue-500 text-white px-4 py-2 rounded">
      Abonnés
    </button>
    <button onClick={() => onOpenPopup('following')} className="bg-green-500 text-white px-4 py-2 rounded">
      Abonnements
    </button>
    <button onClick={() => onOpenPopup('suggested')} className="bg-purple-500 text-white px-4 py-2 rounded">
      Voir plus
    </button>
  </div>
);

const App = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [activeTab, setActiveTab] = useState('followers');

  const handleOpenPopup = (tab) => {
    setActiveTab(tab);
    setShowPopup(true);
  };

  return (
    <div className="p-4">
      <PopupButtons onOpenPopup={handleOpenPopup} />
      {showPopup && <FollowersPopup onClose={() => setShowPopup(false)} initialTab={activeTab} />}
    </div>
  );
};

export default App;