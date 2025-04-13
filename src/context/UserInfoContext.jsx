import React, {createContext, useContext, useEffect, useState} from "react";
import {getItemStorage, removeItemStorage, setItemStorage} from "../utils/localStorageAccess";

// Создание контекста
const UserInfoContext = createContext(null);

// Хук для удобного использования
export const useUserInfo = () => useContext(UserInfoContext);

// Провайдер
export const UserInfoProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(() => {
        // при первой загрузке читаем из localStorage
        const storedUser = getItemStorage("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    useEffect(() => {
        if (userInfo) {
            setItemStorage("user", JSON.stringify(userInfo));
        } else {
            removeItemStorage("user");
        }
    }, [userInfo]);

    return (
        <UserInfoContext.Provider value={{ userInfo, setUserInfo }}>
            {children}
        </UserInfoContext.Provider>
    );
};
