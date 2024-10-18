import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_API_URL || 5000; // L'URL de ton backend

export const useSocket = (userId) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io(SOCKET_URL, {
            query: { userId },
            transports: ['websocket'],
        });

        setSocket(newSocket);

        newSocket.emit('user_connect', userId);

        return () => {
            newSocket.disconnect();
        };
    }, [userId]);

    return socket;
};
