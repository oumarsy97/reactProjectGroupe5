import { useState, useCallback, useMemo } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const useCrud = (baseURL = API_BASE_URL) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Passer un objet avec baseURL au lieu d'une string
    const api = useMemo(() => axios.create({ baseURL: `${baseURL}/users` }), [baseURL]);

    const request = useCallback(async (method, endpoint = '', payload = null) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api[method](endpoint, payload);
            setData(response.data);
            return response.data;
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
