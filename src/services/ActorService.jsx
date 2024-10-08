import axios from 'axios';
import { getToken } from '../utils/tokenUtils';  // Pour récupérer le token depuis utils

const API_BASE_URL = process.env.REACT_APP_API_URL;


export const createActor = async (actorData) => {
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    };
    const response = await axios.post(`${API_BASE_URL}/actors/create`, actorData, config);
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

export const fetchActorById = async (actorId) => {
    const token = getToken();
    const response = await axios.get(`${API_BASE_URL}/actors/getactorbyid/${actorId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data.data;
}

export const fetActorByUserId = async () => {
    const token = getToken();
    const response = await axios.get(`${API_BASE_URL}/actors/monprofile/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data.data;
}