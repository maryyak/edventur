import React from 'react';
import {Alert, Button, Card, Flex, Form, Input, message, Typography, Upload} from "antd";
import {UploadOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";

//тоже мок для подтягивания из бд, надо еще реализовать механизм для сохранения новых данных
import {userInfo} from "../utils/mock";

//зачетку еще надо с бэка подтягивать и рисовать, если есть
const Settings = () => {
    const [form] = Form.useForm();

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

    const settings = userInfo.role === 'student' ?
        <Flex gap={20} vertical style={{width:'100%'}}>
            <Typography.Title level={1}>Личный кабинет</Typography.Title>
            <Alert message="Информация"
                   description="Заполни информацию о себе, чтобы видеть подобранные специально для тебя программы"
                   type="info" showIcon closable/>
            <Card>
                <Form
                    layout="vertical"
                    form={form}
                    name="info"
                    initialValues={userInfo}
                >
                    <Form.Item
                        name="fio"
                        label="ФИО"
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        name="uni"
                        label="ВУЗ"
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        name="course"
                        label="Текущий курс обучения"
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        name="direction"
                        label="Направление подготовки"
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        label="Средний балл за последнюю сессию"
                    >
                        <Flex gap={16}>
                            <Form.Item name="score" noStyle>
                                <Input style={{maxWidth: 100}}/>
                            </Form.Item>
                            <Upload {...props}>
                                <Button icon={<UploadOutlined/>}>Загрузите выписку из зачетной книжки</Button>
                            </Upload>
                        </Flex>
                    </Form.Item>

                    <Form.Item label={null}>
                        <Button type="primary" htmlType="submit">
                            Сохранить
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </Flex>
        : userInfo.role === '' ?
            <></>
            : <Flex vertical align="center" justify="center" style={{width:'100%'}}>
                <Typography.Title level={2}>Для просмотра личного кабинета необходимо авторизоваться</Typography.Title>
                <Button style={{backgroundColor: " #318d25", color: "#fff"}}>
                    <Link to="/login">Вход</Link>
                </Button>
            </Flex>

    return (
        <Flex gap={50}>
            {settings}
            <img src="/settings-img.png" alt="student" style={{'height': 'fit-content', maxWidth: "340px"}} />
        </Flex>
    )
};

export default Settings;