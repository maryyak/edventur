import React from 'react';
import {Alert, Button, Card, Flex, Form, Input, Typography, Upload, message} from "antd";
import {UploadOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";
import {getToken} from "../utils/token";
import {uploadProps} from "../utils/uploadProps";
import useAuth from "../hooks/api/users/authUser";
import UniversityPanel from "./PartnerUniversities/components/UniversityPanel";

const API_URL = process.env.REACT_APP_API_URL;

const Settings = () => {
    const [form] = Form.useForm();
    const {user, fetchUser: mutate} = useAuth()

    const [messageApi, contextHolder] = message.useMessage();

    const handleUpdateUser = async (values) => {

        try {
            const token = getToken()
            const response = await fetch(`${API_URL}/user/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(values)
            });

            if (!response.ok) {
                // 3) В случае ошибки бросаем, чтобы сразу попасть в catch
                throw new Error("Не удалось обновить информацию о пользователе");
            }

            // 4) Успешное уведомление
            messageApi.success("Информация обновлена");

            // 5) После уведомления обновляем данные на странице
            await mutate();
        } catch (err) {
            // 6) Ошибка запроса или throw
            messageApi.error(err.message || "Произошла непредвиденная ошибка");
        }
    }

    const settings = user?.role === 'student' ?
        <Flex gap={20} vertical style={{width: '100%'}}>
            <Typography.Title level={1}>Личный кабинет</Typography.Title>
            <Alert message="Информация"
                   description="Заполни информацию о себе, чтобы видеть подобранные специально для тебя программы"
                   type="info" showIcon closable/>
            <Card>
                <Form
                    layout="vertical"
                    form={form}
                    name="info"
                    initialValues={user}
                    onFinish={(values) => handleUpdateUser(values)}
                >
                    <Form.Item
                        name="fio"
                        label="ФИО"
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        name="university"
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
                        <Flex gap={16} align="center">
                            <Form.Item name="score" noStyle>
                                <Input style={{maxWidth: 100}}/>
                            </Form.Item>
                            {user?.scoreDoc && <a href={`${API_URL}/${user.scoreDoc}`}>Просмотреть</a>}
                            <Upload {...uploadProps('scoreDoc', mutate)}>
                                <Button icon={
                                    <UploadOutlined/>}>{user?.scoreDoc ? "Обновить" : "Загрузите выписку из зачетной книжки"}</Button>
                            </Upload>
                        </Flex>
                    </Form.Item>

                    <Form.Item
                        name="studyplan"
                        label="Учебный план"
                    >
                        {user?.studyplan ?
                            <Flex gap={10} align="center">
                                <Typography.Text>Учебный план загружен</Typography.Text>
                                <Upload {...uploadProps('studyplan')}>
                                    <Button icon={<UploadOutlined/>}>Обновить</Button>
                                </Upload>
                            </Flex>
                            :
                            <Upload {...uploadProps('studyplan')}>
                                <Button icon={<UploadOutlined/>}>Загрузите ваш учебный план</Button>
                            </Upload>
                        }
                    </Form.Item>

                    <Form.Item label={null}>
                        <Button type="primary" htmlType="submit">
                            Сохранить
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </Flex>
        :
        user?.role === 'representative' ?
            <Flex gap={20} vertical style={{width: '100%'}}>
                <Typography.Title level={2}>Личный кабинет представителя ВУЗа</Typography.Title>
                <Card>
                    <Form
                        layout="vertical"
                        form={form}
                        name="info"
                        initialValues={user}
                        onFinish={(values) => handleUpdateUser(values)}
                    >
                        <Form.Item
                            name="fio"
                            label="ФИО"
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            name="university"
                            label="ВУЗ"
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label="Адрес электронной почты"
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item label={null}>
                            <Button type="primary" htmlType="submit">
                                Сохранить
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
                <Card>
                    <UniversityPanel university={user?.University}/>
                </Card>

            </Flex>
            : (!user || !user.role) ?
                <Flex vertical align="center" justify="center" style={{width: '100%'}}>
                    <Typography.Title level={2}>Для просмотра личного кабинета необходимо
                        авторизоваться</Typography.Title>
                    <Link to="/login">
                        <Button style={{backgroundColor: " #318d25", color: "#fff"}}>
                            Вход
                        </Button>
                    </Link>
                </Flex>
                : <></>

    return (
        <>
            {contextHolder}
            <Flex gap={50}>
                {settings}
                <img src="/settings-img.png" alt="student" style={{'height': 'fit-content', maxWidth: "290px"}}/>
            </Flex>
        </>
    )
};

export default Settings;