import React, { useEffect, useState } from 'react';
import { getMessages } from '../services/apiService';  // Import du service API

const Test = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getMessages();
                setMessages(response.data);  // Met à jour l'état avec les messages reçus
            } catch (err) {
                setError('Erreur lors de la récupération des données');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <p>Chargement des messages...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1 className={"bg-amber-600 text-white w-1/3"}>Messages du backend</h1>
            <ul>
                {messages.map((message, index) => (
                    <li key={index}>{message.email} à {message.email}</li>  // Affiche les messages
                ))}
            </ul>
        </div>
    );
};

export default Test;
