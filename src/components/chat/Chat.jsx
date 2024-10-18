import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const Chat = ({ userId, recipientId }) => {
    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // Connecter au serveur Socket.IO
        const newSocket = io('http://localhost:5000');
        setSocket(newSocket);

        // Informer le serveur de la connexion de l'utilisateur
        newSocket.emit('user_connect', userId);

        // Écouter les messages entrants
        newSocket.on('receive_message', (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        // Nettoyer la connexion lors du démontage du composant
        return () => newSocket.close();
    }, [userId]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (message.trim() && socket) {
            socket.emit('send_message', { recipientId, message });
            setMessages((prevMessages) => [...prevMessages, { senderId: userId, message }]);
            setMessage('');
        }
    };

    return (
        <div>
            <div style={{ height: '300px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px' }}>
                {messages.map((msg, index) => (
                    <div key={index} style={{ textAlign: msg.senderId === userId ? 'right' : 'left' }}>
                        <strong>{msg.senderId}: </strong>{msg.message}
                    </div>
                ))}
            </div>
            <form onSubmit={sendMessage}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tapez votre message..."
                />
                <button type="submit">Envoyer</button>
            </form>
        </div>
    );
};

export default Chat;