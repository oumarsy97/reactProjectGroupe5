import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Edit2, Mail, Phone, MapPin, Star, Grid, Bookmark, Heart, MessageCircle, Repeat } from 'lucide-react';
import Navbar from "./Navbar";
import { useAuth } from "../../context/AuthContext";
import { useActor } from "../../context/ActorContext";
import FollowersPopup from '../sideBar/FollowersPopup';

const UserProfile = () => {
  const { login: setUser, user } = useAuth();
  const { actor } = useActor();
  const [showFollowersPopup, setShowFollowersPopup] = useState(false);
  const [activeTabe, setActiveTabe] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [activeTab, setActiveTab] = useState('produits');
  const [nbreVote, setNbreVote] = useState(actor.posts ? actor.posts.reduce((acc, post) => acc + post.notes.length, 0) : 0);
  const [nbreLike, setNbreLike] = useState(actor.posts ? actor.posts.reduce((sum, post) => sum + post.likes.length, 0) : 0);

  const handleOpenPopup = (tab) => {
    setActiveTabe(tab);
    setShowFollowersPopup(true);
  };

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

  const ResponsiveEditButton = ({ isEditing, onClick }) => {
    return (
      <motion.button
        onClick={onClick}
        className="px-4 sm:px-6 py-2 bg-purple-600 text-white rounded-full flex items-center gap-2 hover:bg-purple-700 shadow-md hover:shadow-lg transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Edit2 className="w-5 h-5" />
        <span className="hidden sm:inline">
          {isEditing ? 'Sauvegarder' : 'Modifier le profil'}
        </span>
      </motion.button>
    );
  };

  const ResponsiveTabNavigation = ({ activeTab, setActiveTab, actor }) => {
    const tabs = [
      { id: 'produits', icon: Grid, label: actor.role !== 'VENDOR' ? 'Posts' : 'Produits' },
      { id: 'liked', icon: Heart, label: 'Liked' },
      { id: 'saved', icon: Bookmark, label: 'Saved' },
      { id: 'reposts', icon: Repeat, label: 'Reposts' }
    ];

    return (
      <div className="flex gap-2 sm:gap-4 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center justify-center gap-2 p-2 sm:px-4 sm:py-3 rounded-full transition-all ${activeTab === tab.id
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <tab.icon className="sm:flex sm:w-5 sm:h-5 w-3 h-3" />
            <span className="sm:inline text-sm">{tab.label}</span>
          </motion.button>
        ))}
      </div>
    );
  };

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({ ...prev, [name]: value }));
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

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 bg-gradient-to-b from-purple-50 to-white min-h-screen pt-20 pb-20 ">
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
                {isEditing && (
                  <motion.label
                    className="absolute bottom-2 right-2 p-3 bg-purple-600 rounded-full cursor-pointer hover:bg-purple-700 shadow-lg"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Camera className="w-5 h-5 text-white" />
                    <input type="file" className="hidden" />
                  </motion.label>
                )}
              </div>
            </motion.div>

            <div className="flex-grow">
              <motion.div
                className="flex items-center justify-between mb-6"
                {...fadeInUp}
              >
                {isEditing ? (
                  <div className="flex gap-2 w-full">
                    <input
                      type="text"
                      name="firstname"
                      value={editedUser.firstname}
                      onChange={handleInputChange}
                      className="text-3xl font-bold bg-purple-50 border-b-2 border-purple-300 focus:outline-none focus:border-purple-500 px-2 py-1 w-1/2"
                    />
                    <input
                      type="text"
                      name="lastname"
                      value={editedUser.lastname}
                      onChange={handleInputChange}
                      className="text-3xl font-bold bg-purple-50 border-b-2 border-purple-300 focus:outline-none focus:border-purple-500 px-2 py-1 w-1/2"
                    />
                  </div>
                ) : (
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                    {user.firstname} {user.lastname}
                  </h1>
                )}
                <ResponsiveEditButton
                  isEditing={isEditing}
                  onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                />
              </motion.div>

              <motion.div
                className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6"
                {...fadeInUp}
                transition={{ delay: 0.1 }}
              >
                <div
                  className="bg-purple-50 p-4 rounded-xl text-center hover:bg-purple-100 transition-colors cursor-pointer"
                  onClick={() => handleOpenPopup('followers')}
                >
                  <div className="font-bold text-2xl text-purple-600">{actor.follow.length}</div>
                  <div className="text-purple-600 text-sm">Abonnés</div>
                </div>

                <div
                  className="bg-purple-50 p-4 rounded-xl text-center hover:bg-purple-100 transition-colors cursor-pointer"
                  onClick={() => handleOpenPopup('following')}
                >
                  <div className="font-bold text-2xl text-purple-600">{user.follow.length}</div>
                  <div className="text-purple-600 text-sm">Abonnements</div>
                </div>
                {user.role === 'TAILOR' && (
                  <div className="bg-purple-50 p-4 rounded-xl text-center hover:bg-purple-100 transition-colors">
                    <div className="font-bold text-2xl text-purple-600">{nbreLike}</div>
                    <div className="text-purple-600 text-sm">Likes</div>
                  </div>
                )}
                <div className="bg-purple-50 p-4 rounded-xl text-center hover:bg-purple-100 transition-colors">
                  <div className="font-bold text-2xl text-purple-600 flex items-center justify-center gap-1">
                    <Star className="w-5 h-5 text-yellow-400" />
                    {nbreVote > 0 ? (actor.votes / nbreVote).toFixed(1) : 0}
                  </div>
                  <div className="text-purple-600 text-sm">{nbreVote} avis</div>
                </div>
              </motion.div>

              <motion.div
                className="space-y-3"
                {...fadeInUp}
                transition={{ delay: 0.2 }}
              >
                {[
                  { icon: Mail, name: 'email', value: user.email },
                  { icon: Phone, name: 'phone', value: user.phone },
                  { icon: MapPin, name: 'address', value: actor.address }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                    whileHover={{ x: 10 }}
                  >
                    <item.icon className="w-5 h-5 text-purple-500" />
                    {isEditing ? (
                      <input
                        type="text"
                        name={item.name}
                        value={editedUser[item.name]}
                        onChange={handleInputChange}
                        className="flex-grow bg-transparent focus:outline-none"
                      />
                    ) : (
                      item.value
                    )}
                  </motion.div>
                ))}
                <motion.div
                  className="text-gray-600 bg-gray-50 p-4 rounded-lg italic"
                  whileHover={{ scale: 1.02 }}
                >
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={editedUser.bio}
                      onChange={handleInputChange}
                      className="w-full bg-transparent focus:outline-none resize-none"
                      rows="3"
                    />
                  ) : (
                    `"${actor.bio}"`
                  )}
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-2xl shadow-xl p-6"
          {...scaleUp}
          transition={{ delay: 0.3 }}
        >
          <ResponsiveTabNavigation
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            actor={actor}
          />
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'produits' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                  {(actor.role === 'VENDOR' ? actor.produits : actor.posts).map((item, index) => (
                    <motion.div
                      key={item.id}
                      className="relative group aspect-[3/4] rounded-xl overflow-hidden shadow-lg"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <img
                        src={item.photo || item.image}
                        alt={`Item ${item.id}`}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                          <div className="flex justify-center space-x-6">
                            <div className="flex items-center">
                              <Heart className="w-5 h-5 mr-2" fill="white" />
                              {item.likes?.length || item.likes || 0}
                            </div>
                            <div className="flex items-center">
                              <MessageCircle className="w-5 h-5 mr-2" />
                              {item.comments?.length || item.comments || 0}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
              {activeTab === 'liked' && (
                <div className="text-center text-gray-500">
                  Contenu "Liked" à implémenter
                </div>
              )}
              {activeTab === 'saved' && (
                <>
                  {user.favoris && user.favoris.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                      {user.favoris.map((fav, index) => (
                        <motion.div
                          key={fav.post.id}
                          className="relative group aspect-[3/4] rounded-xl overflow-hidden shadow-lg"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <img
                            src={fav.post.photo}
                            alt={`Post ${fav.post.id}`}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                              <div className="flex justify-center space-x-6">
                                <div className="flex items-center">
                                  <Heart className="w-5 h-5 mr-2" fill="white" />
                                  {fav.post.likes?.length || 0}
                                </div>
                                <div className="flex items-center">
                                  <MessageCircle className="w-5 h-5 mr-2" />
                                  {fav.post.comments?.length || 0}
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">
                      Aucun post favori trouvé.
                    </div>
                  )}
                </>
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

        {showFollowersPopup && (
          <FollowersPopup
            onClose={() => setShowFollowersPopup(false)}
            initialTab={activeTabe}
          />
        )}
      </div>
    </>
  );
};

export default UserProfile;