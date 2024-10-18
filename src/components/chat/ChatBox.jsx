import React, { useState, useEffect } from 'react';
import { useSocket } from './useSocket';
import { useAuth } from "../../context/AuthContext";
import useCrud from "../../hooks/useCrudAxios"; // Pour faire des requêtes API

const ChatBox = ({ recipientId }) => {
    const { user } = useAuth(); // Utilisateur connecté
    const socket = useSocket(user.id); // Connexion Socket.IO
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const { create: createChat } = useCrud('chats/create'); // Pour sauvegarder les messages
    const { get: getChat } = useCrud('chats/', recipientId); // Pour récupérer l'historique des messages

    // Charger les messages à partir de l'API lorsque le composant est monté
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await getChat(); // Appel via useCrud
                setMessages(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des messages', error);
            }
        };
        fetchMessages();
    }, []);

    // Récupérer les messages en temps réel via Socket.IO
    useEffect(() => {
        if (socket) {
            socket.on('new_message', (message) => {
                setMessages((prevMessages) => [...prevMessages, message]);
            });
        }
    }, [socket]);

    // Envoyer un message
    const sendMessage = async () => {
        if (newMessage.trim() !== '') {
            const messageData = {
                initiatorId: user.id,
                recipientId,
                text: newMessage,
            };

            // Envoyer le message via Socket.IO en premier
            socket.emit('send_message', messageData);

            // Ensuite, sauvegarder le message dans la base de données via l'API
            try {
                const savedMessage = await createChat(messageData);
                setMessages((prevMessages) => [...prevMessages, savedMessage.data]);
                setNewMessage(''); // Réinitialiser le champ de message
            } catch (error) {
                console.error('Erreur lors de la sauvegarde du message', error);
            }
        }
    };
    return (
        <div className="chat-container bg-gray-100 p-6 rounded-lg shadow-lg">
            <div className="messages-container overflow-y-auto h-64 p-4 bg-white rounded-lg">
                {messages.map((message, index) => (
                    <div key={index} className={`message-item ${message.sender === user.id ? 'self' : 'other'} my-2`}>
                        <div className="message-content p-2 bg-blue-500 text-white rounded-lg">
                            {message.text}
                        </div>
                    </div>
                ))}
            </div>

            <div className="message-input flex items-center mt-4">
                <input
                    type="text"
                    className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Écrire un message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button
                    onClick={sendMessage}
                    className="ml-2 p-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-700"
                >
                    Envoyer
                </button>
            </div>
        </div>
    );
};

export default ChatBox;
