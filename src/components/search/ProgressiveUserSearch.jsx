import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useCrud from "../../hooks/useCrudAxios";

const ProgressiveUserSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
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
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setResults([]);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    return (
        <div className="relative w-full max-w-md" ref={searchRef}>
            <div className="relative">
                <input
                    type="text"
                    className="w-[300px] ml-3 px-4 py-2 pl-10 pr-4 text-[#122a48] bg-white border border-[#ebeef5] rounded-full focus:outline-none focus:ring-2 focus:ring-[#ff9046] focus:border-transparent"
                    placeholder="Rechercher un utilisateur..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-[#122a48] w-5 h-5" />
            </div>
            {isLoading && (
                <div className="absolute w-full mt-1 bg-white border border-[#ebeef5] rounded-md shadow-lg">
                    <div className="px-4 py-2 text-[#122a48]">Chargement...</div>
                </div>
            )}
            {results.length > 0 && (
                <div className="absolute w-full mt-1 bg-white border border-[#ebeef5] rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {results.map(user => (
                        <div
                            key={user.id}
                            className="flex items-center px-4 py-2 hover:bg-[#fffcf7] cursor-pointer"
                            onClick={() => handleUserSelect(user.id)}
                        >
                            <img src={user.photo} alt={user.firstname} className="w-10 h-10 rounded-full mr-3" />
                            <div>
                                <div className="font-semibold text-[#122a48]">{`${user.firstname} ${user.lastname}`}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProgressiveUserSearch;