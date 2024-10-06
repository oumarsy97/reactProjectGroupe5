import React from 'react';
import { Scissors, Search, Grid, Users, Star, MessageCircle } from 'lucide-react';
import SearchBar from './SearchBar';
import NavItem from './NavItem';

const Navbar = () => (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-8">
                    <div className="flex items-center">
                        <Scissors className="h-8 w-8 text-rose-500" />
                        <span className="ml-2 text-2xl font-serif font-bold bg-gradient-to-r from-rose-500 to-purple-500 bg-clip-text text-transparent">
                            CoutureConnect
                        </span>
                    </div>
                    <SearchBar />
                </div>
                <div className="flex items-center space-x-6">
                    <NavItem icon={<Grid />} text="Explorer" />
                    <NavItem icon={<Users />} text="Communauté" />
                    <NavItem icon={<Star />} text="Favoris" />
                    <NavItem icon={<MessageCircle />} text="Messages" />
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-rose-400 to-purple-400 p-0.5">
                        <div className="h-full w-full rounded-full bg-white p-0.5">
                            <img src="/api/placeholder/100/100" alt="Profile" className="rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </nav>
);

export default Navbar;
