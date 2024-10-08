// services/apiService.jsx
import axios from 'axios';
//import {getToken} from "../utils/tokenUtils";

const API_BASE_URL = process.env.REACT_APP_API_URL;

export const login = async (credentials) => {
    const response = await axios.post(`${API_BASE_URL}/users/login`, credentials);
    console.log(response.data);
    return response.data;
};

export const register = async (user) => {
    const response = await axios.post(`${API_BASE_URL}/users/register`, user);
    console.log(response.data);
    return response.data;
}


// Exemple d'autres fonctions existantes
export const getMessages = async () => {
    const response = await axios.get(`${API_BASE_URL}/users`);
    return response.data;
};

export const sendMessage = async (message) => {
    const response = await axios.post(`${API_BASE_URL}/messages`, { message });
    return response.data;
};
