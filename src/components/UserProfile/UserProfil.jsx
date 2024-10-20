import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Edit2, MapPin, Mail, Phone, Star, Grid, Bookmark, Heart, MessageCircle, Repeat, Bell, X, ArrowLeft, Shield, Lock } from 'lucide-react';
import Navbar from "./Navbar";
import { useAuth } from "../../context/AuthContext";
import { useActor } from "../../context/ActorContext";

const UserProfile = () => {
  const { login: setUser } = useAuth();
  const { user } = useAuth();
  const { actor } = useActor();

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 }
  };

  const scaleUp = {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { type: "spring", stiffness: 300, damping: 30 }
  };

  const [reposts] = useState([
    {
      id: 1,
      image: '/api/placeholder/300/400',
      likes: 156,
      comments: 23,
      originalAuthor: 'Marie Dubois',
      originalDate: 'il y a 2 jours'
    },
    {
      id: 2,
      image: '/api/placeholder/300/400',
      likes: 89,
      comments: 12,
      originalAuthor: 'Pierre Martin',
      originalDate: 'il y a 1 semaine'
    }
  ]);

  const [currentPage, setCurrentPage] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [activeTab, setActiveTab] = useState('produits');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const notifications = [
    { id: 1, message: 'Nouveau message de Marie', time: 'Il y a 5min' },
    { id: 2, message: 'Pierre a aimé votre publication', time: 'Il y a 1h' },
    { id: 3, message: 'Nouvelle commande reçue', time: 'Il y a 2h' },
  ];

  const [posts] = useState([
    { id: 1, image: '/api/placeholder/300/400', likes: 234, comments: 45 },
    { id: 2, image: '/api/placeholder/300/400', likes: 187, comments: 32 },
    { id: 3, image: '/api/placeholder/300/400', likes: 543, comments: 89 },
  ]);

  const handleSaveProfile = () => {
    setUser({
      ...editedUser,
      showToast: true
    });
    setIsEditing(false);
    setTimeout(() => {
      setUser(prev => ({ ...prev, showToast: false }));
    }, 3000);
  };

  const PageHeader = ({ title, onBack }) => (
    <div className="flex items-center gap-4 mb-6 p-4 border-b">
      <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
        <ArrowLeft className="w-6 h-6" />
      </button>
      <h2 className="text-xl font-semibold">{title}</h2>
    </div>
  );

  const PrivacyPage = () => (
    <div className="max-w-7xl mx-auto bg-white">
      <PageHeader
        title="Confidentialité"
        onBack={() => setCurrentPage('profile')}
      />
      <div className="p-4 space-y-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Compte privé</h3>
                  <p className="text-sm text-gray-500">Seuls vos abonnés peuvent voir vos publications</p>
                </div>
                <input type="checkbox" className="toggle" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Masquer le statut en ligne</h3>
                  <p className="text-sm text-gray-500">Les autres ne verront pas quand vous êtes en ligne</p>
                </div>
                <input type="checkbox" className="toggle" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const NotificationsPage = () => (
    <div className="max-w-7xl mx-auto bg-white">
      <PageHeader
        title="Notifications"
        onBack={() => setCurrentPage('profile')}
      />
      <div className="p-4 space-y-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 space-y-4">
            <div className="space-y-4">
              {notifications.map(notif => (
                <div key={notif.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{notif.message}</p>
                    <p className="text-sm text-gray-500">{notif.time}</p>
                  </div>
                  <button className="text-red-500 hover:text-red-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const SecurityPage = () => (
    <div className="max-w-7xl mx-auto bg-white">
      <PageHeader
        title="Sécurité"
        onBack={() => setCurrentPage('profile')}
      />
      <div className="p-4 space-y-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 space-y-4">
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-gray-600" />
                  <div>
                    <h3 className="font-medium">Changer le mot de passe</h3>
                    <p className="text-sm text-gray-500">Dernière modification il y a 3 mois</p>
                  </div>
                </div>
              </button>
              <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-gray-600" />
                  <div>
                    <h3 className="font-medium">Authentification à deux facteurs</h3>
                    <p className="text-sm text-gray-500">Sécurisez davantage votre compte</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const EditFormPopup = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative w-full max-w-lg bg-white rounded-lg shadow-xl">
        <div className="w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Modifier le profil</h2>
            <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Prénom</label>
                  <input
                    type="text"
                    value={editedUser.firstname}
                    onChange={(e) => setEditedUser({ ...editedUser, firstname: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nom</label>
                  <input
                    type="text"
                    value={editedUser.lastname}
                    onChange={(e) => setEditedUser({ ...editedUser, lastname: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <div className="relative">
                  <input
                    type="email"
                    value={editedUser.email}
                    onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  />
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Téléphone</label>
                <div className="relative">
                  <input
                    type="tel"
                    value={user.phone}
                    onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  />
                  <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Adresse</label>
                <div className="relative">
                  <input
                    type="text"
                    value={actor.address}
                    onChange={(e) => setEditedUser({ ...editedUser, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  />
                  <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bio</label>
                <textarea
                  value={editedUser.bio}
                  onChange={(e) => setEditedUser({ ...editedUser, bio: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const handleSettingsClick = (page) => {
    setCurrentPage(page);
    setShowSettings(false);
  };

  if (currentPage === 'privacy') return <PrivacyPage />;
  if (currentPage === 'notifications') return <NotificationsPage />;
  if (currentPage === 'security') return <SecurityPage />;

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 bg-gradient-to-b from-purple-50 to-white min-h-screen">
        <motion.div
          className="mb-6 flex justify-end gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <button
            className="p-2 hover:bg-white hover:shadow-lg rounded-full transition-all duration-300 relative group"
            onClick={() => handleSettingsClick('notifications')}
          >
            <Bell className="w-6 h-6 text-purple-600 group-hover:scale-110 transition-transform" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </button>
        </motion.div>

        <motion.div
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
          {...scaleUp}
        >
          <div className="flex flex-col lg:flex-row gap-8">
            <motion.div
              className="flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="relative w-48 h-48">
                <img
                  src={user.photo}
                  alt={`${user.firstname} ${user.lastname}`}
                  className="w-full h-full object-cover rounded-full ring-4 ring-purple-100 shadow-lg"
                />
                <motion.label
                  className="absolute bottom-2 right-2 p-3 bg-purple-600 rounded-full cursor-pointer hover:bg-purple-700 shadow-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Camera className="w-5 h-5 text-white" />
                  <input type="file" className="hidden" />
                </motion.label>
              </div>
            </motion.div>

            <div className="flex-grow">
              <motion.div
                className="flex items-center justify-between mb-6"
                {...fadeInUp}
              >
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                  {user.firstname} {user.lastname}
                </h1>
                <motion.button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 bg-purple-600 text-white rounded-full flex items-center gap-2 hover:bg-purple-700 shadow-md hover:shadow-lg transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Edit2 className="w-4 h-4" />
                  Modifier le profil
                </motion.button>
              </motion.div>

              <motion.div
                className="grid grid-cols-3 gap-6 mb-6"
                {...fadeInUp}
                transition={{ delay: 0.1 }}
              >
                <div className="bg-purple-50 p-4 rounded-xl text-center hover:bg-purple-100 transition-colors">
                  <div className="font-bold text-2xl text-purple-600">{actor.follow.length}</div>
                  <div className="text-purple-600 text-sm">Abonnés</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl text-center hover:bg-purple-100 transition-colors">
                  <div className="font-bold text-2xl text-purple-600">{user.follow.length}</div>
                  <div className="text-purple-600 text-sm">Abonnements</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl text-center hover:bg-purple-100 transition-colors">
                  <div className="font-bold text-2xl text-purple-600 flex items-center justify-center gap-1">
                    <Star className="w-5 h-5 text-yellow-400" />
                    {user.rating}
                  </div>
                  <div className="text-purple-600 text-sm">4.5K avis</div>
                </div>
              </motion.div>

              <motion.div
                className="space-y-3"
                {...fadeInUp}
                transition={{ delay: 0.2 }}
              >
                {[
                  { icon: Mail, value: user.email },
                  { icon: Phone, value: user.phone },
                  { icon: MapPin, value: actor.address }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                    whileHover={{ x: 10 }}
                  >
                    <item.icon className="w-5 h-5 text-purple-500" />
                    {item.value}
                  </motion.div>
                ))}
                <motion.p
                  className="text-gray-600 bg-gray-50 p-4 rounded-lg italic"
                  whileHover={{ scale: 1.02 }}
                >
                  "{actor.bio}"
                </motion.p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-2xl shadow-xl p-6"
          {...scaleUp}
          transition={{ delay: 0.3 }}
        >
          <div className="flex gap-6 mb-6 overflow-x-auto">
            {['produits', 'liked', 'saved', 'reposts'].map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all ${activeTab === tab
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab === 'produits' && <Grid className="w-5 h-5" />}
                {tab === 'liked' && <Heart className="w-5 h-5" />}
                {tab === 'saved' && <Bookmark className="w-5 h-5" />}
                {tab === 'reposts' && <Repeat className="w-5 h-5" />}
                {tab === 'produits' && actor.role !== 'VENDOR' ? 'Posts' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'produits' && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {actor.posts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      className="relative group aspect-[3/4] rounded-xl overflow-hidden shadow-lg"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <img
                        src={post.photo}
                        alt={`Post ${post.id}`}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                          <div className="flex justify-center space-x-6">
                            <div className="flex items-center">
                              <Heart className="w-5 h-5 mr-2" fill="white" />
                              {post.likes.length}
                            </div>
                            <div className="flex items-center">
                              <MessageCircle className="w-5 h-5 mr-2" />
                              {post.comments.length}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
              {activeTab === 'reposts' && (
                <>
                  {user.reposts && user.reposts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {user.reposts.map((repost, index) => {
                        // Déterminer la source de l'image et des informations du post
                        const postData = repost.post || repost;

                        // Ajout de vérification pour l'URL de l'image
                        const imageUrl = postData?.photo || postData?.image;

                        // Log spécifique pour mieux comprendre le problème
                        // console.log("PostData:", postData);
                        // console.log("Image URL:", imageUrl);

                        const likesCount = postData?.likes?.length || 0;
                        const commentsCount = postData?.comments?.length || 0;

                        return (
                          <motion.div
                            key={postData?.id || index}
                            className="relative group aspect-[3/4] rounded-xl overflow-hidden shadow-lg"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={`Repost ${index + 1}`}
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                onError={(e) => {
                                  // Afficher une image par défaut si le chargement échoue
                                  e.target.onerror = null;
                                  e.target.src = '/path/to/default-image.jpg';
                                }}
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500">No Image</span>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                <div className="flex justify-center space-x-6">
                                  <div className="flex items-center">
                                    <Heart className="w-5 h-5 mr-2" fill="white" />
                                    {likesCount}
                                  </div>
                                  <div className="flex items-center">
                                    <MessageCircle className="w-5 h-5 mr-2" />
                                    {commentsCount}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">
                      Aucun repost trouvé.
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {user.showToast && (
            <motion.div
              className="fixed bottom-4 right-4 z-50"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
            >
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg shadow-lg">
                <p className="text-green-800 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Profil mis à jour avec succès !
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {isEditing && <EditFormPopup />}
      </div>
    </>
  );
};

export default UserProfile;