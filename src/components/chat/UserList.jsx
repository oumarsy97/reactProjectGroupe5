import React, { useState } from 'react';
import { useQuery } from 'react-query';
import useCrud from "../../hooks/useCrudAxios";
import { MessageCircle, Search } from 'lucide-react';
import { useAuth } from "../../context/AuthContext";
import Load from "./Load";

const UserList = ({ onSelectUser, onShowDiscussion }) => {
    const { user: currentUser } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');

    // Utilisation du hook useCrud pour récupérer les chats et tous les utilisateurs
    const { get: getChats } = useCrud('chats/mychats');
    const { get: getAllUsers } = useCrud('users'); // Endpoint pour tous les utilisateurs

    // Utilisation de useQuery pour gérer la récupération des messages
    const { data: chats = [], isLoading: isChatsLoading, isError: isChatsError } = useQuery(
        ['chats', currentUser.id],
        () => getChats(),
        { refetchInterval: 500 }
    );

    // Récupération de tous les utilisateurs quand il y a un terme de recherche
    const { data: users = [], isLoading: isUsersLoading, isError: isUsersError } = useQuery(
        ['users', searchTerm],
        () => getAllUsers(),
        { enabled: searchTerm.length > 0 } // Ne charger que lorsque la recherche est active
    );

    // Logique de regroupement des messages par utilisateur
    const groupedChats = chats.reduce((acc, chat) => {
        const otherUser = chat.sender.id === currentUser.id ? chat.receiver : chat.sender;
        const userId = otherUser.id;

        if (userId !== currentUser.id) {
            if (!acc[userId]) {
                acc[userId] = { user: otherUser, lastMessage: chat };
            } else if (new Date(chat.createdAt) > new Date(acc[userId].lastMessage.createdAt)) {
                acc[userId].lastMessage = chat;
            }
        }
        return acc;
    }, {});

    // Liste des utilisateurs des chats filtrée selon le terme de recherche
    const filteredChats = Object.values(groupedChats).filter(({ user }) =>
        `${user.firstname} ${user.lastname}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Si aucun utilisateur n'est trouvé dans les chats, chercher parmi tous les utilisateurs
    const filteredUsers = users.filter(user =>
        `${user.firstname} ${user.lastname}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Combiner les résultats des chats et des utilisateurs
    const combinedResults = filteredChats.length > 0 ? filteredChats : filteredUsers.map(user => ({
        user,
        lastMessage: { message: 'Pas de message récent' } // Si aucun message n'existe
    }));

    // Affichage du loader si les données sont en cours de chargement
    if (isChatsLoading || (searchTerm && isUsersLoading)) {
        return (
            <div className="flex justify-center items-center h-full">
                <Load /> {/* Un spinner ou un indicateur de chargement */}
            </div>
        );
    }

    if (isChatsError || (searchTerm && isUsersError)) {
        return <p>Erreur lors du chargement des données.</p>;
    }

    return (
        <div className="w-full bg-white border-r border-gray-200 h-[32rem] flex flex-col">
            <div className="p-4 border-b border-gray-200">
                <h1 className="text-xl font-bold text-gray-800 mb-4">Messages</h1>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        className="w-full py-2 pl-10 pr-4 text-gray-700 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                </div>
            </div>

            {/* Conteneur des utilisateurs et des messages avec overflow-y-auto pour éviter le débordement */}
            <div className="overflow-y-auto flex-grow">
                {combinedResults.map(({ user, lastMessage }) => (
                    <div
                        key={user.id}
                        className="flex items-center p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100"
                        onClick={() => onSelectUser(user)}
                    >
                        <img
                            src={user.photo}
                            alt={`${user.firstname} ${user.lastname}`}
                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                        />
                        <div className="ml-4 flex-grow">
                            <h3 className="font-semibold text-gray-800">{`${user.firstname} ${user.lastname}`}</h3>
                            <p className="text-sm text-gray-500 truncate">{lastMessage.message}</p>
                        </div>
                        <span className="text-xs text-gray-400">
                            {new Date(lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                ))}
            </div>

            {/* Bouton pour commencer une nouvelle discussion */}
            <div className="p-4 border-t border-gray-200">
                <button
                    onClick={onShowDiscussion}
                    className="w-full py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors flex items-center justify-center"
                    title="Afficher la discussion"
                >
                    <MessageCircle size={20} className="mr-2" />
                    <span>Nouvelle discussion</span>
                </button>
            </div>
        </div>
    );
};

export default UserList;
