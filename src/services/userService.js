import axios from 'axios';
import { getToken } from '../utils/tokenUtils';  // Pour récupérer le token depuis utils

const API_BASE_URL = process.env.REACT_APP_API_URL;

export const fetchUserData = async () => {
    const token = getToken();
    const response = await axios.get(`${API_BASE_URL}/users/monprofile`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    console.log(response.data.data);
    return response.data.data;
};

export const createUser = async (userData) => {
    const response = await axios.post(`${API_BASE_URL}/users`, userData);
    return response.data;
};

export const updateUser = async (userId, userData) => {
    const token = getToken();
    const response = await axios.put(`${API_BASE_URL}/users/${userId}`, userData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const deleteUser = async (userId) => {
    const token = getToken();
    await axios.delete(`${API_BASE_URL}/users/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}
