import { useToken } from '../context/TokenContext';

 export  const useTokenService = () => {
    const { token, setToken } = useToken();

    const getToken = () => {
        return token; // Récupérer le token du contexte
    };

    const setNewToken = (newToken) => {
        setToken(newToken); // Mettre à jour le token dans le contexte
    };

    const removeToken = () => {
        setToken(null); // Réinitialiser le token dans le contexte
    };

    return { getToken, setNewToken, removeToken };
};

// Utiliser cette fonction pour gérer le token
export const getTimeDifference = (dateString) => {
    // Convertir la chaîne de caractères en objet Date
    const givenDate = new Date(dateString);

    // Obtenir la date actuelle du système
    const currentDate = new Date();

    // Calculer la différence en millisecondes
    const differenceInMilliseconds = currentDate - givenDate;

    // Convertir les millisecondes en minutes, heures, et jours
    const differenceInMinutes = Math.floor(differenceInMilliseconds / 1000 / 60);
    const differenceInHours = Math.floor(differenceInMinutes / 60);
    const differenceInDays = Math.floor(differenceInHours / 24);

    // Retourner la bonne unité en fonction de la durée
    if (differenceInMinutes < 60) {
        return `${differenceInMinutes} minute(s)`;
    } else if (differenceInHours < 24) {
        return `${differenceInHours} heure(s)`;
    } else {
        return `${differenceInDays} jour(s)`;
    }
};
