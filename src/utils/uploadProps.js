import {message} from "antd";
import {getToken} from "./token";

const API_URL = process.env.REACT_APP_API_URL;

const token = getToken();

export const uploadProps= (type, onDownload, values= {}) => ({
    name: 'file',
    action: `${API_URL}/upload?type=${type}`,
    headers: {
        Authorization: `Bearer ${token}`
    },
    data: values,
    onChange(info) {
        const { status } = info.file;
        if (status === 'done') {
            message.success(`${info.file.name} загружен.`);
            // Данные обновились на сервере — обновляем локальный кэш
            onDownload && onDownload()
        } else if (status === 'error') {
            message.error(`${info.file.name} не удалось загрузить.`);
        }
    }
});