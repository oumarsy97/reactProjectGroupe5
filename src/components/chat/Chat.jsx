import React, { useState, useRef, useEffect } from 'react';
import { Send, ImagePlus, Smile, ArrowLeft } from 'lucide-react';
import { useAuth } from "../../context/AuthContext";
import useCrud from "../../hooks/useCrudAxios";
import { useQuery, useQueryClient } from 'react-query';

const Chat = ({ selectedUser, onBackToList }) => {

    const [newMessage, setNewMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { get: getChats } = useCrud(`chats/${user.id}/${selectedUser.id}`);
    const { create: createChat }  = useCrud(`chats/${selectedUser.id}`);

    // Requête pour récupérer les messages
    const { data: messages = [] } = useQuery(
        ['chats', user.id, selectedUser.id],
        () => getChats(),
        {
            refetchInterval: 500, // Polling toutes les secondes
        }
    );

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSendMessage = async (type = 'text', content = null) => {
        if ((!newMessage.trim() && type === 'text') || !selectedUser) return;
        let messageContent = content || newMessage;

        const messageData = {
            senderId: user.id,
            receiverId: selectedUser.id,
            message: messageContent,
            type: type
        };

        try {
            // Envoi direct du message
            await createChat(messageData, true);

            // Invalide la requête pour refetch les messages
            queryClient.invalidateQueries(['chats', user.id, selectedUser.id]);

            // Réinitialisation du message après l'envoi
            setNewMessage('');
        } catch (error) {
            console.error("Erreur lors de l'envoi du message :", error);
        }
    };

    return selectedUser && (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-200 text-black flex items-center">
                <button
                    onClick={onBackToList}
                    className="mr-4 text-gray-500 hover:text-gray-700"
                >
                    <ArrowLeft size={24} />
                </button>
                <img
                    src={selectedUser.photo}
                    alt={selectedUser.name}
                    className="w-10 h-10 rounded-full object-cover"
                />
                <div className="ml-4">
                    <h2 className="font-semibold">{selectedUser.firstname} {selectedUser.lastname}</h2>
                    <p className="text-sm text-gray-500">{selectedUser.status || 'en ligne'}</p>
                </div>
            </div>
            <div className="flex-grow overflow-y-auto p-4 bg-gray-50"
                 style={{backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')"}}>
                {messages.map(message => (
                    <div
                        key={message.id}
                        className={`flex mb-4 ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`rounded-lg p-3 max-w-xs ${message.senderId === user.id ? 'bg-purple-500 text-white' : 'bg-white text-black'}`}>
                            {message.type === 'image' ? (
                                <div>
                                    <img src={message.message} alt="Image envoyée" className="rounded-lg max-w-xs"/>
                                    {message.caption && (
                                        <p className="mt-2 text-sm">{message.caption}</p>
                                    )}
                                </div>
                            ) : (
                                message.message
                            )}
                            <div className="text-xs mt-1 opacity-70">
                                {new Date(message.createdAt).toLocaleTimeString()}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="py-4 bg-purple-200 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                    <button
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <ImagePlus size={24}/>
                    </button>
                    <button
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                        <Smile size={24}/>
                    </button>
                    <input
                        type="text"
                        placeholder="Écrivez un message..."
                        className="flex-1 p-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 text-black"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage('text')}
                    />
                    <button
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                        onClick={() => handleSendMessage('text')}
                    >
                        <Send size={24}/>
                    </button>
                </div>
            </div>
            {showEmojiPicker && (
                <div className="absolute bottom-20 right-4 bg-white rounded-lg shadow-lg p-4">
                    <div className="grid grid-cols-6 gap-2">
                        {['😊', '😂', '❤️', '👍', '🎉', '🔥', '😎', '🤔', '👋', '🙌', '💪', '🌟'].map(emoji => (
                            <button
                                key={emoji}
                                className="text-2xl hover:bg-gray-100 p-2 rounded"
                                onClick={() => {
                                    setNewMessage(prev => prev + emoji);
                                    setShowEmojiPicker(false);
                                }}
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chat;
