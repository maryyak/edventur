import { useState, useEffect } from 'react';
const API_URL = process.env.REACT_APP_API_URL;


const useProgramRepresentative = (id) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const response = await fetch(`${API_URL}/programs/${id}/representative`);
                if (!response.ok) {
                    throw new Error('Ошибка при загрузке представителя');
                }
                const data = await response.json();
                setData(data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchPrograms();
    }, [id]);

    return { data, loading, error };
};

export default useProgramRepresentative;
