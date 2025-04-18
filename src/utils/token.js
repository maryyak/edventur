import {getItemStorage, removeItemStorage, setItemStorage} from "./localStorageAccess";

export const getToken = () => {
    const token = getItemStorage("token");
    const expiresAt = getItemStorage("tokenExpiresAt");

    if (!token || !expiresAt) return null;

    if (Date.now() > Number(expiresAt)) {
        removeItemStorage("token");
        removeItemStorage("tokenExpiresAt");
        removeItemStorage("user");
        return null;
    }

    return token;
};

export const setToken = (token, expiresAt) => {
    setItemStorage("token", token);
    setItemStorage("tokenExpiresAt", expiresAt);
}