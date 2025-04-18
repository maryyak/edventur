import { useEffect, useState } from 'react';
import { message } from 'antd';
import {useUserInfo} from "../../../context/UserInfoContext";
import {getToken} from "../../../utils/token";

const API_URL = process.env.REACT_APP_API_URL;

/**
 * Хук для отправки клика по программе на сервер
 * @param {number|string} programId
 * @returns {{ error: string|null }}
 */
const useAddProgramClick = (programId) => {
    const [error, setError] = useState(null);
    const {userInfo} = useUserInfo()

    useEffect(() => {
        if (!programId) return;

        const sendClick = async () => {
            try {
                const response = await fetch(
                    `${API_URL}/user-programs/${programId}`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${getToken()}`,
                        },
                    }
                );
                if (!response.ok) {
                    throw new Error(`Ошибка: ${response.status}`);
                }
                // можно обработать ответ, если API возвращает clicks
                // const result = await response.json();
                // console.log('Clicks:', result.clicks);
            } catch (err) {
                const msg = err.message || 'Не удалось сохранить клик';
                setError(msg);
                message.error(msg);
            }
        };

        if (userInfo?.role === "student") {
            sendClick();
        }
    }, [programId]);

    return { error };
};

export default useAddProgramClick;
