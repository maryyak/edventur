import {useEffect, useState} from 'react';

const API_URL = process.env.REACT_APP_API_URL;

const useUserApplications = (userId) => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAssessments = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_URL}/applications/user/${userId}`);
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
        if (!userId) return;
        fetchAssessments();
    }, [userId]);

    return {applications, loading, error, mutate: fetchAssessments};
}

export default useUserApplications;