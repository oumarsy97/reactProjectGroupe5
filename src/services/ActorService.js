import axios from 'axios';
import { getToken } from '../utils/tokenUtils';  // Pour récupérer le token depuis utils

const API_BASE_URL = process.env.REACT_APP_API_URL;


export const createActor = async (actorData) => {
    const response = await axios.post(`${API_BASE_URL}/actors/create`, actorData);
    return response.data;
}

export const fetchActors = async () => {
    const token = getToken();
    const response = await axios.get(`${API_BASE_URL}/actors/getactors`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data.data;
}