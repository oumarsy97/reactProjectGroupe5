import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import UserList from './UserList';
import Chat from './Chat';

const ChatApp = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [groupedChats, setGroupedChats] = useState({});

    const handleToggleChat = () => {
        setIsOpen(!isOpen);
    };

    const handleSelectUser = (user, chats) => {
        setSelectedUser(user);
        setGroupedChats(chats);
    };

    const handleBackToList = () => {
        setSelectedUser(null);
    };

    if (!isOpen) {
        return (
            <button
                onClick={handleToggleChat}
                className="fixed bottom-4 right-4 p-4 bg-purple-800 text-white rounded-full shadow-lg hover:bg-purple-950 transition-colors"
            >
                <MessageCircle size={24} />
            </button>
        );
    }

    return (
        <div className="fixed bottom-4 right-4 w-110 h-[32rem] bg-white rounded-lg shadow-xl flex flex-col">
            <div className="p-4 bg-purple-900 text-white rounded-t-lg flex justify-between items-center">
                <h2 className="text-xl font-semibold">Chat</h2>
                <button onClick={handleToggleChat} className="text-white">
                    <X size={24} />
                </button>
            </div>
            <div className="flex-1 overflow-hidden">
                {selectedUser ? (
                    <Chat
                        selectedUser={selectedUser}
                        onBackToList={handleBackToList}
                        groupedChats={groupedChats}
                    />
                ) : (
                    <UserList onSelectUser={handleSelectUser} />
                )}
            </div>
        </div>
    );
};

export default ChatApp;