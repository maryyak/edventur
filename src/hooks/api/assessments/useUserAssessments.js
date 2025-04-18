import {useEffect, useState} from 'react';
import {getToken} from "../../../utils/token";

const API_URL = process.env.REACT_APP_API_URL;

const useUserAssessments = (id) => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAssessments = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_URL}/user-assessments/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            });
            if (!response.ok) {
                throw new Error(`Ошибка: ${response.status}`);
            }

            const data = await response.json();
            setData(data);
        } catch (err) {
            setError(err.message || 'Неизвестная ошибка');
        } finally {
            console.log(1)
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!id) return
        fetchAssessments();
    }, [id]);

    return {data, loading, error, mutate: fetchAssessments};
}

export default useUserAssessments;
