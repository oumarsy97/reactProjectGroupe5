import React from 'react';
import { CardHeader,Avatar, AvatarImage, AvatarFallback } from '../ui';

import ChatInterface from './ChatInterface';

const ChatWindow = ({ conversation, messages, onSendMessage }) => {
  return (
    <>
      <CardHeader className="border-b">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={conversation.recipient.avatar} alt={conversation.recipient.name} />
            <AvatarFallback>{conversation.recipient.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold">{conversation.recipient.name}</h2>
            <p className="text-sm text-gray-500">
              {conversation.recipient.isOnline ? 'En ligne' : 'Hors ligne'}
            </p>
          </div>
        </div>
      </CardHeader>
      <ChatInterface
        conversationId={conversation.id}
        recipient={conversation.recipient}
        messages={messages}
        onSendMessage={onSendMessage}
      />
    </>
  );
};

export default ChatWindow;