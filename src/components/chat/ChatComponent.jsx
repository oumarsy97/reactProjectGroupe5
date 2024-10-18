import React, { useState, useEffect } from 'react';
import { Send, Users } from 'lucide-react';
import io from 'socket.io-client';
import useCrud from "../../hooks/useCrudAxios";

const ChatApp = () => {
    const [socket, setSocket] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const { data: messages, create: createMessage } = useCrud('chats');
    const [users, setUsers] = useState([
        {
            id: 1,
            name: 'Marie Dupont',
            status: 'en ligne',
            image: 'ousseynouODC.jpeg'
        },
        // Ajoutez d'autres utilisateurs ici si nécessaire
    ]);

    useEffect(() => {
        const newSocket = io('http://localhost:3000');
        setSocket(newSocket);

        newSocket.on('newMessage', (message) => {
            if (message.recipient === selectedUser?.id || message.sender === 'me') {
                createMessage(message);
            }
        });

        newSocket.on('updateUsers', (updatedUsers) => {
            setUsers(updatedUsers);
        });

        return () => newSocket.close();
    }, [selectedUser, createMessage]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedUser) return;
        const newMessageObj = {
            sender: 'me',
            recipient: selectedUser.id,
            content: newMessage,
            timestamp: new Date().toISOString()
        };

        await createMessage(newMessageObj);
        socket.emit('sendMessage', newMessageObj);
        setNewMessage('');
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <div className="w-1/3 bg-white border-r border-gray-200">
                <div className="p-4 border-b border-gray-200">
                    <h1 className="text-xl font-semibold">Messages</h1>
                </div>
                <div className="overflow-y-auto">
                    {users.map(user => (
                        <div
                            key={user.id}
                            className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 ${selectedUser?.id === user.id ? 'bg-gray-100' : ''}`}
                            onClick={() => setSelectedUser(user)}
                        >
                            <img
                                src={user.image}
                                alt={user.name}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            <div className="ml-4">
                                <h3 className="font-semibold">{user.name}</h3>
                                <p className="text-sm text-gray-500">{user.status}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex-1 flex flex-col">
                {selectedUser ? (
                    <>
                        <div className="p-4 border-b border-gray-200 bg-white">
                            <div className="flex items-center">
                                <img
                                    src={selectedUser.image}
                                    alt={selectedUser.name}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div className="ml-4">
                                    <h2 className="font-semibold">{selectedUser.name}</h2>
                                    <p className="text-sm text-gray-500">{selectedUser.status}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                            {messages
                                .filter(msg => msg.sender === selectedUser.id || msg.recipient === selectedUser.id)
                                .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
                                .map((message, index) => (
                                    <div
                                        key={index}
                                        className={`flex mb-4 ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`rounded-lg p-3 max-w-xs ${message.sender === 'me' ? 'bg-blue-500 text-white' : 'bg-white'}`}>
                                            {message.content}
                                            <div className="text-xs mt-1 opacity-70">
                                                {new Date(message.timestamp).toLocaleTimeString()}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                        <div className="p-4 bg-white border-t border-gray-200">
                            <div className="flex items-center space-x-4">
                                <input
                                    type="text"
                                    placeholder="Écrivez un message..."
                                    className="flex-1 p-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                />
                                <button
                                    className="p-2 text-white bg-blue-500 rounded-full hover:bg-blue-600"
                                    onClick={handleSendMessage}
                                >
                                    <Send size={24} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-gray-50">
                        <p className="text-gray-500">Sélectionnez une conversation pour commencer</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatApp;