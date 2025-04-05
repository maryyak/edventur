import React from 'react';
import {Layout, Row, Col, Typography,Flex} from "antd";
import Logo from "./Logo";
import {Link, useNavigate} from "react-router-dom";

const Footer = () => {
    const navigate = useNavigate();

    return (
        <Layout.Footer style={{ background: "#318d25", color: "white", padding: "60px 100px" ,paddingBottom: 0,  position: "relative"}}>
                <Row gutter={[16, 16]} justify="space-between" style={{ paddingBottom: "100px" }}>
                    <Col xs={20} sm={10} md={6}>
                        <Flex vertical gap={20}>
                            <Logo color="white"/>
                            <Typography.Text style={{color: "#e3e3e3", maxWidth: 300}}>
                                Цифровая интерактивная академическая платформа для участия в программах
                                внутрироссийского семестрового обмена
                            </Typography.Text>
                        </Flex>

                    </Col>

                    <Col xs={22} sm={12} md={10}>
                        <Flex gap={100} justify="flex-end">
                            <Flex vertical gap={10} style={{ alignItems: "flex-end" }}>
                                <Typography.Text style={{ color: 'white', whiteSpace: 'nowrap' }}>
                                    Обучение
                                </Typography.Text>
                                <Link to={'/application'} style={{ color: '#e3e3e3', whiteSpace: 'nowrap', cursor: "pointer" }}>
                                    Подать заявку
                                </Link>
                                <Link to={'/partners'} style={{ color: '#e3e3e3', whiteSpace: 'nowrap', cursor: "pointer" }}>
                                    ВУЗ-ы партнеры
                                </Link>
                                <Link to={'/programs'} style={{ color: '#e3e3e3', whiteSpace: 'nowrap', cursor: "pointer" }}>
                                    Образовательные программы
                                </Link>
                            </Flex>

                            <Flex vertical gap={10} style={{ alignItems: "flex-end" }}>
                                <Typography.Text style={{ color: 'white', whiteSpace: 'nowrap' }}>Информация</Typography.Text>
                                <span onClick={() => navigate('/#about')} style={{ color: '#e3e3e3', whiteSpace: 'nowrap' }}>
                                    О нас
                                </span>
                                <span onClick={() => navigate('/#faq')} style={{ color: '#e3e3e3', whiteSpace: 'nowrap' }}>
                                    Частые вопросы
                                </span>
                            </Flex>
                        </Flex>
                    </Col>
                </Row>

            <Flex
                style={{
                    padding: "12px",
                }}
            >
                <Row style={{ width: "100%" }} justify="space-between" align="middle">
                    <Typography.Text style={{ color: "#e3e3e3" }}>© 2025 Edventur</Typography.Text>
                    <Flex gap={15}>
                        <Link style={{ color: "#e3e3e3" }}>Пользовательское соглашение</Link>
                        <Link style={{ color: "#e3e3e3" }}>Политика конфиденциальности</Link>
                    </Flex>
                </Row>
            </Flex>

        </Layout.Footer>
    );
};

export default Footer;