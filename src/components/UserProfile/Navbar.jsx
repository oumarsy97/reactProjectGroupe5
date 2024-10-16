import React, { useState } from 'react';
import { Scissors, Users, Star, MessageCircle, Moon, Sun, Bell } from 'lucide-react';
import SearchBar from './SearchBar';
import NavItem from './NavItem';
import { useAuth } from '../../context/AuthContext';
import LogoutButton from "../user/LogoutButton";
import { useNavigate } from 'react-router-dom';
import AddPostModal from "../Post/RegistePost";
import { useActor } from "../../context/ActorContext";
import AddProduitModal from "../Produits/AddProduit";

const Navbar = () => {
    const { user } = useAuth();
    const [darkMode, setDarkMode] = useState(false);
    const navigate = useNavigate();
    const { actor } = useActor();


    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.body.classList.toggle('dark', !darkMode);
    };

    return (
        <nav className={`shadow-md fixed w-full top-0 z-50 ${
            darkMode
                ? 'bg-gray-900 text-gray-200'
                : 'bg-gradient-to-r from-violet-300 to-gray-300 text-gray-800'
        }`}>
            <div className="max-w-7xl mx-auto px-8 flex items-center justify-between h-16">
                <div className="flex items-center space-x-4">
                    <Scissors className={`h-10 w-10 ${darkMode ? 'text-violet-300' : 'text-violet-600'}`} />
                    <span className={`text-3xl font-serif font-bold ${
                        darkMode ? 'text-violet-300' : 'text-violet-600'
                    }`}>
                        <button type="button" onClick={() => navigate("/")}>CoutureConnect</button>
                    </span>
                </div>
                <SearchBar />
                <div className="flex items-center space-x-6">
                    {actor && (user.role === "VENDOR" ? <AddProduitModal /> : <AddPostModal />)}
                    <NavItem icon={<Users size={20} />} text="Communauté" />
                    <NavItem icon={<Star size={20} />} text="Favoris" />
                    <NavItem icon={<MessageCircle size={20} />} text="Messages" />
                    <button className="relative p-2 mb- rounded-full hover:bg-violet-200 hover:bg-opacity-50">
                        <Bell size={20} />
                        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                            4
                        </span>
                    </button>
                    <LogoutButton />

                    <div className="relative">
                        <img
                            src={user?.photo || "/api/placeholder/100/100"}
                            alt="Profile"
                            className="h-10 w-10 rounded-full object-cover border-2 border-violet-400 transition-transform transform hover:scale-110"
                        />
                        <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 border-2 border-white"></span>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;