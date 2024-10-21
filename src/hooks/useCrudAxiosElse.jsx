import { useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useTokenService } from '../utils/tokenUtils'; // Assurez-vous que le chemin est correct

const API_BASE_URL = "http://localhost:5000/api/v1";

const useCrud = (baseURL) => {
    const { getToken } = useTokenService(); // Récupérer le token depuis utils
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const api = useMemo(() => {
        // Créer une instance d'axios avec un intercepteur pour ajouter le token
        const instance = axios.create({ baseURL: `${API_BASE_URL}/${baseURL}` });

        instance.interceptors.request.use(
            config => {
                const token = getToken(); // Obtenir le token
               // console.log(token);
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`; // Ajouter le token aux en-têtes
                }
                return config;
            },
            error => {
                return Promise.reject(error);
            }
        );

        return instance;
    }, [baseURL, getToken]);

    const request = useCallback(async (method, endpoint = '', payload = null) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api[method](endpoint, payload);
           // console.log(response.data.data)
            setData(response.data.data);
            return response.data.data;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [api]);

    const get = useCallback((id = '') => request('get', `/${id}`), [request]);
    const create = useCallback((payload) => request('post', '/', payload), [request]);
    const update = useCallback((id, payload) => request('put', `/${id}`, payload), [request]);
    const remove = useCallback((id) => request('delete', `/${id}`), [request]);

    return {
        data,
        loading,
        error,
        get,
        create,
        update,
        remove,
    };
};

export default useCrud;
