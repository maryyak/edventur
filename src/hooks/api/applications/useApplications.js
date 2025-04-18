import {useEffect, useState} from 'react';

const API_URL = process.env.REACT_APP_API_URL;

const useApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchApplications = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_URL}/applications`);
            if (!response.ok) {
                throw new Error(`Ошибка: ${response.status}`);
            }

            const data = await response.json();
            setApplications(data);
        } catch (err) {
            setError(err.message || 'Неизвестная ошибка');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    return {applications, loading, error, mutate: fetchApplications};
}

export default useApplications;