// src/services/AuthService.jsx
import axios from 'axios';
import { setToken, getToken, removeToken } from '../utils/tokenUtils';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = process.env.REACT_APP_API_URL;


class AuthService {
    // Récupération de l'instance de AuthContext pour utiliser ses méthodes


    login(email, password) {
        return axios.post(API_BASE_URL + '/users/login', {
            email,
            password
        })
            .then(response => {
                if (response.data.token) {
                   // setToken(response.data.token); // Stockage du token
                }
                return response.data; // Retour des données utilisateur
            });
    }



}

export default new AuthService();
