import { useState, useCallback } from 'react';

export const useChat = () => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);

  const loadConversations = useCallback(() => {
    // Ici, vous feriez un appel API pour charger les conversations
    // Pour l'exemple, nous utilisons des données factices
    setConversations([
      { id: 1, recipient: { name: 'Alice', avatar: '/path/to/avatar1.jpg' }, lastMessage: 'Bonjour !' },
      { id: 2, recipient: { name: 'Bob', avatar: '/path/to/avatar2.jpg' }, lastMessage: 'Comment ça va ?' },
    ]);
  }, []);

  const loadMessages = useCallback((conversationId) => {
    // Ici, vous feriez un appel API pour charger les messages d'une conversation
    // Pour l'exemple, nous utilisons des données factices
    setMessages([
      { id: 1, sender: 'user', content: 'Salut !', timestamp: new Date() },
      { id: 2, sender: 'other', content: 'Bonjour, comment allez-vous ?', timestamp: new Date() },
    ]);
  }, []);

  const sendMessage = useCallback((conversationId, message) => {
    // Ici, vous enverriez le message via une API
    // Pour l'exemple, nous l'ajoutons simplement à l'état local
    setMessages(prevMessages => [...prevMessages, { id: Date.now(), sender: 'user', content: message, timestamp: new Date() }]);
  }, []);

  return { conversations, messages, loadConversations, loadMessages, sendMessage };
};