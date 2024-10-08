import axios from 'axios';
import { getToken } from '../utils/tokenUtils';  // Pour récupérer le token depuis utils

const API_BASE_URL = process.env.REACT_APP_API_URL;



export const createPost = async (data) => {
    const response = await axios.post(`${API_BASE_URL}/posts/`, data ,{
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
    return response.data.data;
}

export const fetchPosts = async () => {
    const token = getToken();
    const response = await axios.get(`${API_BASE_URL}/posts/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data.data;
}

export const fetchmyposts = async () => {
    const token = getToken();
    const response = await axios.get(`${API_BASE_URL}/posts/myposts/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data.data;
}

//les posts des autres
export const fetchOthersPosts = async (userId) => {
    const token = getToken();
    const response = await axios.get(`${API_BASE_URL}/posts/others`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data.data;
}