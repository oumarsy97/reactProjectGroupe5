import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useCrud from "../../hooks/useCrudAxios";

const ProgressiveUserSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false); // Gère l'affichage du champ de recherche en popup
    const searchRef = useRef(null);
    const navigate = useNavigate();
    const { get: searchUsers } = useCrud('users');

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm) {
                setIsLoading(true);
                fetchUsers();
            } else {
                setResults([]);
                setIsLoading(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const fetchUsers = async () => {
        try {
            const data = await searchUsers(`search/${searchTerm}`);
            setResults(data);
        } catch (error) {
            console.error("Erreur lors de la recherche d'utilisateurs:", error);
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleUserSelect = (id) => {
        navigate(`/users/${id}`);
        setSearchTerm('');
        setResults([]);
        setIsSearchOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchOpen(false); // Fermer la popup si on clique en dehors
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative w-full max-w-md" ref={searchRef}>
            {/* Icône de recherche en mode mobile */}
            <div className="md:hidden">
                <Search
                    className="absolute left-5 top-1/2 transform -translate-y-1/2 text-white w-5 h-5 cursor-pointer"
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                />
            </div>

            {/* Popup de recherche en mobile */}
            {isSearchOpen && (
                <div className="absolute top-full -ml-16 mt-8 w-full z-50 bg-purple-200 py-1 px-2 border border-[#ebeef5] rounded-lg shadow-xl md:hidden">
                    <input
                        type="text"
                        className="w-full px-4 py-2 text-[#122a48] bg-white border border-[#ebeef5] rounded-full focus:outline-none focus:ring-2 focus:ring-[#ff9046] focus:border-transparent"
                        placeholder="Rechercher un utilisateur..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    {isLoading && (
                        <div className="mt-2 text-[#122a48]">Chargement...</div>
                    )}
                    {results.length > 0 && (
                        <div className="mt-2 max-h-64 no-scrollbar overflow-y-auto">
                            {results.map(user => (
                                <div
                                    key={user.id}
                                    className="flex items-center px-4 py-2 hover:bg-[#fffcf7] cursor-pointer"
                                    onClick={() => handleUserSelect(user.id)}
                                >
                                    <img src={user.photo} alt={user.firstname} className="w-10 h-10 rounded-full mr-3" />
                                    <div className="font-semibold text-[#122a48]">
                                        {`${user.firstname} ${user.lastname}`}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Champ de recherche normal pour desktop */}
            <div className="hidden md:block relative">
                <input
                    type="text"
                    className="w-[300px] px-4 py-2 pl-10 pr-4 text-[#122a48] bg-white border border-[#ebeef5] rounded-full focus:outline-none focus:ring-2 focus:ring-[#ff9046] focus:border-transparent"
                    placeholder="Rechercher un utilisateur..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#122a48] w-5 h-5" />
            </div>

            {/* Liste des résultats en desktop */}
            {results.length > 0 && (
                <div className="absolute w-full mt-1 bg-white border border-[#ebeef5] rounded-md shadow-lg max-h-60 overflow-y-auto hidden md:block">
                    {results.map(user => (
                        <div
                            key={user.id}
                            className="flex items-center px-4 py-2 hover:bg-[#fffcf7] cursor-pointer"
                            onClick={() => handleUserSelect(user.id)}
                        >
                            <img src={user.photo} alt={user.firstname} className="w-10 h-10 rounded-full mr-3" />
                            <div className="font-semibold text-[#122a48]">{`${user.firstname} ${user.lastname}`}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProgressiveUserSearch;
