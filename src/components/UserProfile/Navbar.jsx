import React, { useState } from 'react';
import { Scissors, Users,User,Settings, Star, MessageCircle, Bell, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useActor } from "../../context/ActorContext";
import AddPostModal from "../Post/RegistePost";
import AddProduitModal from "../Produits/AddProduit";
import ProgressiveUserSearch from "../search/ProgressiveUserSearch";
import {useToken} from "../../context/TokenContext";

const Navbar = () => {
    const { user, logout } = useAuth();
    const { setToken, getToken, setNewToken } = useToken();
    const navigate = useNavigate();
    const { actor,logout: decon } = useActor();
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
    };

    function hundlenavigate(profile) {
        navigate(`/${profile}`);
    }

    return (
        <nav className="shadow-md fixed w-full top-0 z-50 bg-gradient-to-r from-[#003366] to-[#0077be] text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
                <div className="flex items-center space-x-4">
                    <Scissors className="h-8 w-8 text-white" />
                    <span className="text-2xl font-serif font-bold text-white">
                        <button type="button" onClick={() => navigate("/")}>CoutureConnect</button>
                    </span>
                </div>
                <div className="flex-1 max-w-xl mx-4">
                    <ProgressiveUserSearch />
                </div>
                <div className="flex items-center space-x-4">
                    {actor && (user.role === "VENDOR" ? <AddProduitModal /> : <AddPostModal />)}
                    <NavItem icon={<Users size={20} />} text="Communauté" />
                    <NavItem icon={<Star size={20} />} text="Favoris" />
                    <NavItem icon={<MessageCircle size={20} />} text="Messages" />
                    <button className="relative p-2 rounded-full hover:bg-[#0077be] hover:bg-opacity-50 transition-colors duration-200">
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
                                className="h-8 w-8 rounded-full object-cover border-2 border-[#0077be]"
                            />
                            <span className="hidden md:inline font-medium">{user?.firstname}</span>
                            <ChevronDown size={16} />
                        </button>
                        {showProfileMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                                <button onClick={() =>{hundlenavigate('profile')}} className="w-full flex ml-0 px-4 py-2 text-sm text-gray-700 hover:bg-[#0077be] hover:text-white">
                                    <User size={16} className="mr-2" />
                                    Profil
                                </button>
                                <button onClick={() =>hundlenavigate('parametre')} className="w-full flex px-4 py-2 text-sm text-gray-700 hover:bg-[#0077be] hover:text-white">
                                    <Settings size={16} className="mr-2" />
                                    Paramètres
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#0077be] hover:text-white"
                                >
                                    <LogOut size={16} className="mr-2" />
                                    Déconnexion
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showLogoutConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Confirmer la déconnexion</h2>
                        <p className="text-gray-700 mb-6">Êtes-vous sûr de vouloir vous déconnecter ?</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setShowLogoutConfirmation(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={confirmLogout}
                                className="px-4 py-2 bg-[#003366] text-white rounded hover:bg-[#0077be] transition-colors"
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
    <button className="flex items-center space-x-1 p-2 rounded-full hover:bg-[#0077be] hover:bg-opacity-50 transition-colors duration-200">
        {icon}
        <span className="hidden md:inline text-sm">{text}</span>
    </button>
);

export default Navbar;