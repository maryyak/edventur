import { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL;

const useUniversityPrograms = (universityId) => {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!universityId) return;  // Если нет universityId, не делаем запрос

        const fetchPrograms = async () => {
            setLoading(true);
            setError(null);  // Сбрасываем предыдущие ошибки

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

        fetchPrograms();
    }, [universityId]);  // Хук будет повторно запускаться, если universityId изменится

    return { programs, loading, error };
};

export default useUniversityPrograms;
