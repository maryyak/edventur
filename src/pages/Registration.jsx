import React, {useEffect, useState} from 'react';
import {
    Alert,
    Button, Flex,
    Form,
    Input,
    Radio, Spin, Typography,
} from 'antd';
import Logo from "../components/Logo";
import useAuth from "../hooks/api/users/authUser";
import {useNavigate} from "react-router-dom";

const Registration = () => {
    const [form] = Form.useForm();
    const {register, loading, error} = useAuth();
    const navigate = useNavigate();
    const [user, setUser] = useState()

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    const onFinish = async (values) => {
        try {
            console.log(values)
            setUser(await register(values))
        } catch (err) {
            console.error("Ошибка при регистрации:", err);
        }
    };

    return (
        <Flex gap={106} style={{justifyContent: 'center'}}>
            <Flex vertical>
                <Logo color={'#08A652'}/>
                <Typography.Title level={1}>Регистрация</Typography.Title>
                <Typography.Text type="secondary">Откройте дверь новым возможностям</Typography.Text>

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
                            name="fio"
                            label="ФИО"
                            rules={[
                                {
                                    required: true,
                                    message: 'Введите ФИО!',
                                },
                            ]}
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label="Почта"
                            rules={[
                                {
                                    type: 'email',
                                    message: 'The input is not valid E-mail!',
                                },
                                {
                                    required: true,
                                    message: 'Please input your E-mail!',
                                },
                            ]}
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            name="radio-button"
                            label="Роль"
                            rules={[{required: true, message: 'Выберите свою роль!'}]}
                        >
                            <Radio.Group>
                                <Radio.Button value="student">Студент</Radio.Button>
                                <Radio.Button value="representative">Представитель ВУЗа</Radio.Button>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item
                            name="uni"
                            label="ВУЗ"
                            rules={[
                                {
                                    required: true,
                                    message: 'Введите Ваш ВУЗ!',
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
                                    message: 'Please input your password!',
                                },
                            ]}
                            hasFeedback
                        >
                            <Input.Password/>
                        </Form.Item>

                        <Form.Item
                            name="confirm"
                            label="Пароль еще раз"
                            dependencies={['password']}
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Please confirm your password!',
                                },
                                ({getFieldValue}) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('The new password that you entered do not match!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password/>
                        </Form.Item>
                        <Form.Item label={null}>
                            <Button type="primary" htmlType="submit">
                                Продолжить
                            </Button>
                        </Form.Item>

                    </Form>
                </Spin>
                {error && <Alert type="error" message="Ошибка регистрации"/>}
            </Flex>
            <img src="/door.png" alt="Door" style={{height: '456px', alignSelf: 'center'}}/>
        </Flex>
    );
};
export default Registration;