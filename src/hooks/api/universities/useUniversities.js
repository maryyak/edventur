import { useState, useEffect } from 'react';
const API_URL = process.env.REACT_APP_API_URL;


const useUniversities = () => {
    const [universities, setUniversities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const response = await fetch(`${API_URL}/universities`);
                if (!response.ok) {
                    throw new Error('Ошибка при загрузке программ');
                }
                const data = await response.json();
                setUniversities(data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchPrograms();
    }, []);

    return { universities, loading, error };
};

export default useUniversities;
