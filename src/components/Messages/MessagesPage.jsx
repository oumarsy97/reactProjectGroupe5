import React, { useState, useEffect } from 'react';
import ConversationList from './ConversationList';
import { Card } from '../ui';

import ChatWindow from './ChatWindow';
import { useChat } from '../../hooks/useChat';
import Navbar from '../UserProfile/Navbar';  // Assurez-vous que ce chemin est correct

const MessagesPage = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const { conversations, messages, sendMessage, loadConversations, loadMessages } = useChat();

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleSendMessage = (message) => {
    if (selectedConversation) {
      sendMessage(selectedConversation.id, message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="pt-24 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-4">
            <Card>
              <ConversationList
                conversations={conversations}
                selectedConversation={selectedConversation}
                onSelectConversation={handleConversationSelect}
              />
            </Card>
          </div>
          <div className="col-span-8">
            <Card className="h-[700px]">
              {selectedConversation ? (
                <ChatWindow
                  conversation={selectedConversation}
                  messages={messages}
                  onSendMessage={handleSendMessage}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  Sélectionnez une conversation pour commencer à chatter
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;