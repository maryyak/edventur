import {useEffect, useState} from 'react';

const API_URL = process.env.REACT_APP_API_URL;

const useAssessments = (id) => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAssessments = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(id ? `${API_URL}/assessments/${id}` : `${API_URL}/assessments`);
            if (!response.ok) {
                throw new Error(`Ошибка: ${response.status}`);
            }

            const data = await response.json();
            setData(data);
        } catch (err) {
            setError(err.message || 'Неизвестная ошибка');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssessments();
    }, [id]);

    return {data, loading, error, mutate: fetchAssessments};
}

export default useAssessments;
