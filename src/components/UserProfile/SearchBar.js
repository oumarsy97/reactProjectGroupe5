import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = () => (
    <div className="relative">
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        <input
            type="text"
            placeholder="Rechercher des patrons, créateurs..."
            className="pl-10 pr-4 py-2 bg-gray-50 rounded-full w-72 focus:outline-none focus:ring-2 focus:ring-rose-300 border border-gray-200"
        />
    </div>
);

export default SearchBar;
