import {useState, useEffect} from 'react';

const API_URL = process.env.REACT_APP_API_URL;

const useUniversityPrograms = (universityId) => {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPrograms = async () => {
        setLoading(true);
        setError(null);  // Сбрасываем предыдущие ошибки
        if (!universityId) return;  // Если нет universityId, не делаем запрос

        try {
            const response = await fetch(`${API_URL}/university-programs/university/${universityId}/programs`);
            if (!response.ok) {
                throw new Error('Ошибка при загрузке программ');
            }
            const data = await response.json();
            setPrograms(data);  // Обновляем состояние с полученными данными
        } catch (err) {
            setError(err.message);  // Сохраняем ошибку
        } finally {
            setLoading(false);  // Устанавливаем загрузку в false, когда запрос завершен
        }
    };

    useEffect(() => {
        fetchPrograms();
    }, [universityId]);

    return {programs, loading, error, mutate: fetchPrograms};
};

export default useUniversityPrograms;
