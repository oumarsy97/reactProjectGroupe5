import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { X, Send, Users } from 'lucide-react';
import useCrud from "../../hooks/useCrudAxios";

const ChatPopup = ({ currentUserId }) => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const crudProduits = useCrud('chats/create');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const newSocket = io('http://localhost:3000');
        setSocket(newSocket);

        newSocket.on('newMessage', (message) => {
            if (message.sender === selectedUser?.id || message.sender === currentUserId) {
                setMessages((prevMessages) => [...prevMessages, message]);
            }
        });

        newSocket.on('updateUsers', (updatedUsers) => {
            setUsers(updatedUsers.filter(user => user.id !== currentUserId));
        });

        return () => newSocket.close();
    }, [currentUserId, selectedUser]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {
        if (inputMessage.trim() !== '' && selectedUser) {
            const newMessage = {
                sender: currentUserId,
                recipient: selectedUser.id,
                content: inputMessage,
                timestamp: new Date(),
            };

            await crudProduits.create(newMessage);
            socket.emit('sendMessage', newMessage);
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            setInputMessage('');
        }
    };

    const selectUser = (user) => {
        setSelectedUser(user);
        setMessages([]); // Clear messages when switching users
        // Here you would typically load the chat history for the selected user
    };

    return (
        <div className="fixed bottom-0 right-0 mb-4 mr-4 z-50">
            {!isOpen ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-blue-500 text-white rounded-full p-3 shadow-lg hover:bg-blue-600"
                >
                    <Users size={24} />
                </button>
            ) : (
                <div className="bg-white rounded-lg shadow-xl w-80 flex flex-col h-[500px]">
                    <div className="flex justify-between items-center p-4 border-b">
                        <h2 className="text-lg font-semibold">Chat</h2>
                        <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="flex-1 flex">
                        <div className="w-1/3 border-r overflow-y-auto">
                            {users.map((user) => (
                                <div
                                    key={user.id}
                                    onClick={() => selectUser(user)}
                                    className={`p-3 cursor-pointer hover:bg-gray-100 ${
                                        selectedUser?.id === user.id ? 'bg-gray-200' : ''
                                    }`}
                                >
                                    {user.name}
                                </div>
                            ))}
                        </div>
                        <div className="w-2/3 flex flex-col">
                            {selectedUser ? (
                                <>
                                    <div className="flex-1 overflow-y-auto p-4">
                                        {messages.map((message, index) => (
                                            <div
                                                key={index}
                                                className={`mb-2 ${
                                                    message.sender === currentUserId
                                                        ? 'text-right'
                                                        : 'text-left'
                                                }`}
                                            >
                        <span
                            className={`inline-block p-2 rounded-lg ${
                                message.sender === currentUserId
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-800'
                            }`}
                        >
                          {message.content}
                        </span>
                                            </div>
                                        ))}
                                        <div ref={messagesEndRef} />
                                    </div>
                                    <div className="border-t p-4 flex">
                                        <input
                                            type="text"
                                            value={inputMessage}
                                            onChange={(e) => setInputMessage(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                            className="flex-1 border rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Tapez un message..."
                                        />
                                        <button
                                            onClick={sendMessage}
                                            className="bg-blue-500 text-white rounded-r-lg px-4 py-2 hover:bg-blue-600"
                                        >
                                            <Send size={20} />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-500">
                                    Sélectionnez un utilisateur pour démarrer une conversation
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatPopup;