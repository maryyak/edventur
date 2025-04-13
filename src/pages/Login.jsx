import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {
    Alert,
    Button, Flex,
    Form,
    Input, Spin, Typography,
} from 'antd';
import Logo from "../components/Logo";
import useAuth from "../hooks/api/users/authUser";

const Login = () => {
    const [form] = Form.useForm();
    const {login, loading, error} = useAuth();
    const navigate = useNavigate();
    const [user, setUser] = useState()

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    const onFinish = async (values) => {
        try {
            setUser(await login(values.email, values.password))
        } catch (err) {
            console.error("Ошибка при логине:", err);
        }
    };

    return (
        <Flex gap={106} style={{justifyContent: 'center'}}>
            <Flex vertical>
                <Logo color={'#08A652'}/>
                <Typography.Title level={1}>Вход в кабинет</Typography.Title>
                <Typography.Text type="secondary">Ура! Вы снова с нами!</Typography.Text>

                <Spin spinning={loading}>
                    <Form
                        layout="vertical"
                        form={form}
                        name="register"
                        style={{maxWidth: 407, marginTop: 40}}
                        scrollToFirstError
                        onFinish={onFinish}
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
                                <Link to="/" style={{color: 'inherit', textDecoration: 'none'}}>
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
                </Spin>
                {error && <Alert type="error" message="Ошибка авторизации"/>}
            </Flex>
            <img src="/door.png" alt="Door" style={{height: '456px', alignSelf: 'center'}}/>
        </Flex>
    );
};
export default Login;