import React, { useState } from 'react';
import dayjs from 'dayjs'; // Utilisé pour formater les dates

const ChatComponent = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [currentUser, setCurrentUser] = useState('user1');

    // Fonction pour envoyer un message
    const sendMessage = () => {
        if (inputMessage.trim() === '') return;

        const newMessage = {
            text: inputMessage,
            sender: currentUser,
            status: 'sent',
            timestamp: new Date(), // Ajout de la date et heure d'envoi
        };

        setMessages([...messages, newMessage]);
        setInputMessage('');
    };

    // Permuter l'utilisateur actuel
    const toggleUser = () => {
        setCurrentUser(currentUser === 'user1' ? 'user2' : 'user1');
    };

    // Fonction pour envoyer un message avec la touche "Entrée"
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    // Fonction pour formater la date
    const formatDate = (date) => {
        return dayjs(date).format('HH:mm '); // Format : Heure:Minute AM/PM
    };

    return (
        <div className="flex flex-col h-[900px] w-1/3 mr-0 bg-gray-100">
            {/* En-tête */}
            <div className="flex justify-between items-center p-4 bg-blue-600 text-white">
                <h1 className="text-xl font-bold">Discussion</h1>
                <button
                    onClick={toggleUser}
                    className="bg-white text-blue-600 px-4 py-2 rounded-lg"
                >
                    Switch User ({currentUser === 'user1' ? 'User 1' : 'User 2'})
                </button>
            </div>

            {/* Zone d'affichage des messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex ${
                            message.sender === currentUser ? 'justify-end' : 'justify-start'
                        } my-2`}
                    >
                        <div
                            className={`p-3 rounded-3xl max-w-xs shadow-md ${
                                message.sender === currentUser
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-300 text-black'
                            }`}
                        >
                            <p className="text-sm">{message.text}</p>
                            <div className="flex justify-end mt-2">
                <span className="text-xs text-white">
                  {formatDate(message.timestamp)}
                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Barre d'entrée de message */}
            <div className="flex p-4 bg-white border-t border-gray-300">
                <input
                    type="text"
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyPress} // Ajout de la gestion de la touche "Entrée"
                    placeholder="Écrivez un message..."
                />
                <button
                    onClick={sendMessage}
                    className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                    Envoyer
                </button>
            </div>
        </div>
    );
};

export default ChatComponent;
