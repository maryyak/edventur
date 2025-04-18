import {useEffect, useState} from "react";

const API_URL = process.env.REACT_APP_API_URL;


const usePrograms = (id) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPrograms = async () => {
        try {
            const response = await fetch(id ? `${API_URL}/programs/${id}` : `${API_URL}/programs`);
            if (!response.ok) {
                throw new Error('Ошибка при загрузке программ');
            }
            const data = await response.json();
            setData(data);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrograms();
    }, [id]);

    return {data, loading, error, mutate: fetchPrograms};
};

export default usePrograms;
