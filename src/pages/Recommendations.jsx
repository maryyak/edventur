import React from 'react';
import {UploadOutlined} from "@ant-design/icons";
import {Button, message, Upload} from "antd";

const Recommendations = () => {
    const props = {
        name: 'file',
        // action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload', реализовываешь апи для загрузки файлов(можно поглядеть как в конструкторе программ сделано)
        headers: {
            authorization: 'authorization-text',
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };

    return (
        <>
            <Upload {...props}>
                <Button icon={<UploadOutlined />}>Загрузите ваш учебный план</Button>
            </Upload>
        </>
    );
};

export default Recommendations;