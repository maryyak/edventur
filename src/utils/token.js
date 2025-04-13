import {getItemStorage, setItemStorage} from "./localStorageAccess";

export const getToken = () => {
    const token = getItemStorage("token");

    return token;
}

export const setToken = (token) => {
    setItemStorage("token", token);
}