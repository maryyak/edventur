import { useState, useEffect } from 'react';
const API_URL = process.env.REACT_APP_API_URL;


const usePrograms = () => {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const response = await fetch(`${API_URL}/programs`);
                if (!response.ok) {
                    throw new Error('Ошибка при загрузке программ');
                }
                const data = await response.json();
                setPrograms(data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchPrograms();
    }, []);

    return { programs, loading, error };
};

export default usePrograms;
