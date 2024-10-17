import React from 'react';
import { ScrollArea, Avatar, AvatarImage, AvatarFallback } from '../ui';


const ConversationList = ({ conversations, selectedConversation, onSelectConversation }) => {
  return (
    <ScrollArea className="h-[700px]">
      {conversations.map((conversation) => (
        <div
          key={conversation.id}
          className={`flex items-center space-x-4 p-4 hover:bg-gray-100 cursor-pointer ${
            selectedConversation?.id === conversation.id ? 'bg-gray-200' : ''
          }`}
          onClick={() => onSelectConversation(conversation)}
        >
          <Avatar>
            <AvatarImage src={conversation.recipient.avatar} alt={conversation.recipient.name} />
            <AvatarFallback>{conversation.recipient.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <h3 className="font-semibold">{conversation.recipient.name}</h3>
            <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
          </div>
          {conversation.unreadCount > 0 && (
            <div className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {conversation.unreadCount}
            </div>
          )}
        </div>
      ))}
    </ScrollArea>
  );
};

export default ConversationList;