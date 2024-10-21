import React, { useState } from 'react';
import { Scissors, Users, User, Settings, Star, ShoppingCart, MessageCircle, Bell, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useActor } from "../../context/ActorContext";
import AddPostModal from "../Post/RegistePost";
import AddProduitModal from "../Produits/AddProduit";
import ProgressiveUserSearch from "../search/ProgressiveUserSearch";
import { useToken } from "../../context/TokenContext";
import AlertService from "../../services/notifications/AlertService";
import ChatApp from "../chat/ChatApp";

const Navbar = () => {
    const { user, logout } = useAuth();
    const { setToken, getToken, setNewToken } = useToken();
    const navigate = useNavigate();
    const { actor, logout: decon } = useActor();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

    const handleLogout = () => {
        setShowLogoutConfirmation(true);
    };

    const confirmLogout = () => {
        logout();
        decon();
        setNewToken(null);
        setShowLogoutConfirmation(false);
        AlertService.success("Successfully logged out,");
    };

    function hundlenavigate(profile) {
        navigate(`/${profile}`);
    }

    return (
        <nav className="shadow-lg fixed w-full top-0 z-50 bg-gradient-to-b from-black to-purple-900 text-white">
            {/* Navbar pour les grands écrans */}
            <div className="hidden xl:flex max-w-7xl mx-auto px-4 md:px-6 xl:px-6 items-center justify-between h-16">
                {/* Logo et nom du site */}
                <div className="flex items-center space-x-4">
                    <Scissors className="h-8 w-8 text-white" />
                    <span className="text-2xl font-serif font-bold text-white">
                        <button type="button" onClick={() => navigate("/")}>CoutureConnect</button>
                    </span>
                </div>

                {/* Champ de recherche */}
                <div className="flex-1 max-w-xl mx-4">
                    <ProgressiveUserSearch />
                </div>

                {/* Profil utilisateur et boutons de navigation */}
                <div className="flex items-center space-x-2">
                    {actor && (user.role === "VENDOR" ? <AddProduitModal /> : <AddPostModal />)}
                    <NavItem icon={<Users size={20} />} text="Communauté" />
                    <NavItem icon={<Star size={20} />} text="Favoris" />
                    <ChatApp />
                    <NavItem icon={<ShoppingCart size={20} />} text="Achats" />

                    <button className="relative p-2 rounded-full hover:bg-purple-700 transition-colors duration-200">
                        <Bell size={20} />
                        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                            4
                        </span>
                    </button>

                    <div className="relative">
                        <button
                            className="flex items-center space-x-2 focus:outline-none"
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                        >
                            <img
                                src={user?.photo || "/api/placeholder/40/40"}
                                alt="Profile"
                                className="h-8 w-8 rounded-full object-cover border-2 border-purple-500"
                            />
                            <span className="hidden md:inline font-medium">{user?.firstname}</span>
                            <ChevronDown size={16} />
                        </button>
                        {showProfileMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50">
                                <button onClick={() => hundlenavigate('profile')} className="w-full flex ml-0 px-4 py-2 text-sm text-gray-300 hover:bg-purple-700 hover:text-white">
                                    <User size={16} className="mr-2" />
                                    Profil
                                </button>
                                <button onClick={() => hundlenavigate('parametre')} className="w-full flex px-4 py-2 text-sm text-gray-300 hover:bg-purple-700 hover:text-white">
                                    <Settings size={16} className="mr-2" />
                                    Paramètres
                                </button>
                                <button onClick={() => setShowLogoutConfirmation(true)} className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-purple-700 hover:text-white">
                                    <LogOut size={16} className="mr-2" />
                                    Déconnexion
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Navbar pour les petits écrans (mobile/tablette) */}
            <div className="xl:hidden flex items-center justify-between h-16 px-4">
                {/* Logo et nom du site */}
                <div className="flex items-center space-x-4">
                    <Scissors className="h-8 w-8 text-white" onClick={() => navigate("/")} />
                </div>

                {/* Champ de recherche */}
                <div className="flex-1 max-w-xl mx-4">
                    <ProgressiveUserSearch />
                </div>

                {/* Profil utilisateur */}
                <div className="relative">
                    <button
                        className="flex items-center space-x-2 focus:outline-none"
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                    >
                        <img
                            src={user?.photo || "/api/placeholder/40/40"}
                            alt="Profile"
                            className="h-8 w-8 rounded-full object-cover border-2 border-purple-500"
                        />
                    </button>
                    {showProfileMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50">
                            <button onClick={() => hundlenavigate('profile')} className="w-full flex ml-0 px-4 py-2 text-sm text-gray-300 hover:bg-purple-700 hover:text-white">
                                <User size={16} className="mr-2" />
                                Profil
                            </button>
                            <button onClick={() => hundlenavigate('parametre')} className="w-full flex px-4 py-2 text-sm text-gray-300 hover:bg-purple-700 hover:text-white">
                                <Settings size={16} className="mr-2" />
                                Paramètres
                            </button>
                            <button onClick={() => setShowLogoutConfirmation(true)} className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-purple-700 hover:text-white">
                                <LogOut size={16} className="mr-2" />
                                Déconnexion
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer pour les petits écrans (mobile/tablette) */}
            <div className="xl:hidden fixed bottom-0 left-0 w-full bg-purple-900 p-2 flex justify-around shadow-lg">
                {actor && (user.role === "VENDOR" ? <AddProduitModal /> : <AddPostModal />)}
                <NavItem icon={<Users size={20} />} text="Communauté" />
                <NavItem icon={<Star size={20} />} text="Favoris" />
                <NavItem icon={<ShoppingCart size={20} />} text="Achats" />
                <ChatApp />
                <button className="relative p-2 rounded-full hover:bg-purple-700 transition-colors duration-200">
                    <Bell size={20} />
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">4</span>
                </button>
            </div>

            {showLogoutConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-lg p-6 max-w-sm w-full text-white">
                        <h2 className="text-xl font-bold mb-4">Confirmer la déconnexion</h2>
                        <p className="text-gray-300 mb-6">Êtes-vous sûr de vouloir vous déconnecter ?</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setShowLogoutConfirmation(false)}
                                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={confirmLogout}
                                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                            >
                                Déconnexion
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>

    );
};

const NavItem = ({ icon, text }) => (
    <button
        className="flex flex-col items-center space-x-1 p-2 rounded-full hover:bg-[#0077be] hover:bg-opacity-50 transition-colors duration-200">
        {icon}
        <span className="hidden md:inline text-sm">{text}</span>
    </button>
);

export default Navbar;