import React, { useState } from 'react';
import { Scissors, Grid, Users, Star, MessageCircle, Moon, Sun } from 'lucide-react';
import SearchBar from './SearchBar';
import NavItem from './NavItem';
import { useAuth } from '../../context/AuthContext';
import LogoutButton from "../user/LogoutButton";
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { user } = useAuth(); // Récupérer les données de l'utilisateur connecté
    const [darkMode, setDarkMode] = useState(false); // État pour le mode sombre
    const navigate = useNavigate();
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.body.classList.toggle('dark', !darkMode); // Appliquer la classe 'dark' au corps
    };

    return (
        <nav className={`shadow-md fixed w-full top-0 z-50 ${darkMode ? 'bg-gray-800' : 'bg-gradient-to-r from-rose-500 to-purple-500'}`}>
            <div className="max-w-7xl mx-auto px-8 flex items-center justify-between h-16">
                <div className="flex items-center space-x-4">
                    <Scissors className="h-10 w-10 text-white" />
                    <span className={`text-3xl font-serif font-bold ${darkMode ? 'text-white' : 'text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-yellow-400'}`}>
                      <button type="button"  onClick={()=>{ navigate("/home")}}> CoutureConnect</button>
                </span>
                </div>
                <SearchBar />
                <div className="flex items-center space-x-8 text-black">
                    <NavItem icon={<Grid className="text-white" />} text="Ajouter un Post" />
                    <NavItem icon={<Users className="text-white" />} text="Communauté" />
                    <NavItem icon={<Star className="text-white" />} text="Favoris" />
                    <NavItem icon={<MessageCircle className="text-white" />} text="Messages" />
                    <LogoutButton />
                    <div className="relative h-10 w-10 rounded-full overflow-hidden">
                        <img
                            src={user?.photo || "/api/placeholder/100/100"} // Utiliser la photo de l'utilisateur ou un placeholder
                            alt="Profile"
                            className="object-cover h-full w-full rounded-full transition-transform transform hover:scale-110"
                        />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
