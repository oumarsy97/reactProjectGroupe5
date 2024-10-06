// hooks/useFetch.js
import { useEffect, useState } from 'react';

export const useFetch = (apiCall) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await apiCall();
                setData(result);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData().then(r =>
        // Clear error after 5 seconds
        setTimeout(() => setError(null), 5000));
    }, [apiCall]);

    return { data, loading, error };
};
