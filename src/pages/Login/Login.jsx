import React from 'react';
import { Link } from 'react-router-dom';
import {
    Button, Flex,
    Form,
    Input, Typography,
} from 'antd';
import Logo from "../../components/Logo";

const Login = () => {
    const [form] = Form.useForm();

    return (
        <Flex gap={106} style={{justifyContent: 'center'}}>
            <Flex vertical >
                <Logo/>
                <Typography.Title level={1}>Вход в кабинет</Typography.Title>
                <Typography.Text type="secondary">Ура! Вы снова с нами!</Typography.Text>

                <Form
                    layout="vertical"
                    form={form}
                    name="register"
                    style={{maxWidth: 407, marginTop: 40}}
                    scrollToFirstError
                >

                    <Form.Item
                        name="email"
                        label="Почта"
                        rules={[
                            {
                                type: 'email',
                                message: 'Неподходящие формат email!',
                            },
                            {
                                required: true,
                                message: 'ведите Ваш email!',
                            },
                        ]}
                    >
                        <Input/>
                    </Form.Item>


                    <Form.Item
                        name="password"
                        label="Пароль"
                        rules={[
                            {
                                required: true,
                                message: 'Введите Ваш пароль!',
                            },
                        ]}
                        hasFeedback
                    >
                        <Input.Password/>
                    </Form.Item>

                    <Form.Item
                        name="forgot"
                        label=""
                        style={{justifySelf: 'right'}}
                    >
                        <Typography.Text type="secondary">
                            <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
                                Забыли пароль?
                            </Link>
                        </Typography.Text>
                    </Form.Item>
                    <Form.Item label={null}>
                        <Button type="primary" htmlType="submit">
                            Продолжить
                        </Button>
                    </Form.Item>
                </Form>
            </Flex>
            <img src="/door.png" alt="Door" style={{ height: '456px', alignSelf: 'center' }} />
        </Flex>
    );
};
export default Login;