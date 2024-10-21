import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import UserList from './UserList';
import Chat from './Chat';

const ChatApp = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [groupedChats, setGroupedChats] = useState({});
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024); // Adjust breakpoint as needed
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

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
                className="fixed lg:bottom-4 bottom-20 right-4 p-4 bg-purple-800 text-white rounded-full shadow-lg hover:bg-purple-950 transition-colors z-50"
            >
                <MessageCircle size={24} />
            </button>
        );
    }

    const chatContent = (
        <>
            <div className="p-4 lg:w-full bg-purple-900 text-white flex justify-between items-center">
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
        </>
    );

    if (isMobile) {
        return (
            <div className="fixed inset-0 bg-white z-50 flex flex-col">
                {chatContent}
            </div>
        );
    }

    return (
        <div className="fixed bottom-4 right-4 w-[28rem] h-[32rem] bg-white rounded-lg shadow-xl flex flex-col">
            {chatContent}
        </div>
    );
};

export default ChatApp;