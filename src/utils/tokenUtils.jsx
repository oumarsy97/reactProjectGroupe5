export const getToken = () => localStorage.getItem('token');

export const setToken = (token) => localStorage.setItem('token', token);

export const removeToken = () => localStorage.removeItem('token');
export const  getTimeDifference = (dateString) => {
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


