import { useEffect, useState } from 'react';
const API_URL = process.env.REACT_APP_API_URL;

const useAssessments = () => {
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAssessments = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`${API_URL}/assessments`);
                if (!response.ok) {
                    throw new Error(`Ошибка: ${response.status}`);
                }

                const data = await response.json();
                setAssessments(data);
            } catch (err) {
                setError(err.message || 'Неизвестная ошибка');
            } finally {
                setLoading(false);
            }
        };

        fetchAssessments();
    }, []);

    return { assessments, loading, error };
}

export default useAssessments;
