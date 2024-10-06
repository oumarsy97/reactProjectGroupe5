// src/services/AuthService.js
import axios from 'axios';
import { setToken, getToken, removeToken } from '../utils/tokenUtils';

const API_BASE_URL = process.env.REACT_APP_API_URL;


class AuthService {
    login(email, password) {
        return axios.post(API_BASE_URL + '/users/login', {
            email,
            password
        })
            .then(response => {
                if (response.data.token) {
                    setToken(response.data.token); // Stockage du token
                }
                return response.data; // Retour des données utilisateur
            });
    }

    logout() {
        removeToken(); // Suppression du token
    }

    getToken() {
        return getToken(); // Récupération du token
    }
}

export default new AuthService();
