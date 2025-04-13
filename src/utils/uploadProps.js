import {message} from "antd";
import {getToken} from "./token";

const API_URL = process.env.REACT_APP_API_URL;

const token = getToken();

export const uploadProps= (type) => ({
    name: 'file',
    action: `${API_URL}/upload?type=${type}`,
    headers: {
        Authorization: `Bearer ${token}`
    },
    onChange(info) {
        if (info.file.status === 'done') {
            message.success(`${info.file.name} успешно загружен`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} не удалось загрузить`);
        }
    },
});