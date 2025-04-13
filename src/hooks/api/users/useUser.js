import { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL;  // Убедитесь, что у вас правильный URL для API

const useUser = (userId, token) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) return;  // Если ID не передан, не делаем запрос

        const fetchUser = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`${API_URL}/user/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                });

                if (!response.ok) {
                    throw new Error('User not found');
                }

                const data = await response.json();
                setUser(data);  // Сохраняем данные пользователя
            } catch (error) {
                setError(error.message);  // Обрабатываем ошибку
            } finally {
                setLoading(false);  // Заканчиваем загрузку
            }
        };

        fetchUser();
    }, [userId, token]);  // Хук перезапустится при изменении userId или token

    return { user, loading, error };
};

export default useUser;
