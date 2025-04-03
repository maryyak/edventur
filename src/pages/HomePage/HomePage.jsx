import React, { useState } from "react";
import {Typography, Row, Col, Card, Avatar, Flex, Steps, Button, Collapse} from "antd";
import styles from "./HomePage.module.scss";
import type { CollapseProps } from "antd/es/collapse";
const universities = [
    { id: 1, name: "РТУ МИРЭА", logo: "/MIREA_GERB.png" },
    { id: 2, name: "РТУ МИРЭА", logo: "/MIREA_GERB.png" },
    { id: 3, name: "РТУ МИРЭА", logo: "/MIREA_GERB.png" },
    { id: 4, name: "РТУ МИРЭА", logo: "/MIREA_GERB.png" },
    { id: 5, name: "РТУ МИРЭА", logo: "/MIREA_GERB.png" },
];

const steps = [
    {
        title: "Заявка",
        description: "Пройдите регистрацию на нашем портале и подайте заявку",
        image: "/step1.png",
    },
    {
        title: "Ассесмент",
        description: "Пройдите предложенный Вам ассесмент",
        image: "/step2.png",
    },
    {
        title: "Ответ",
        description: "Ожидайте ответ по вашей заявке. Успехов!",
        image: "/step3.png",
    },
];

const items: CollapseProps["items"] = [
    {
        key: "1",
        label: "Что такое Edventure?",
        children: <Typography.Text>Edventure (educational adventure) – это цифровая платформа, которая помогает студентам находить подходящие программы внутрироссийского семестрового обмена и участвовать в них.</Typography.Text>,
        style: { marginBottom: "20px" },
    },
    {
        key: "2",
        label: "Как подать заявку на обмен?",
        children: <Typography.Text>Вы можете зарегистрироваться на платформе и заполнить заявку в личном кабинете.</Typography.Text>,
        style: { marginBottom: "20px" },
    },
    {
        key: "3",
        label: "Как вуз может стать партнером платформы?",
        children: <Typography.Text></Typography.Text>,
        style: { marginBottom: "20px" },
    },
    {
        key: "4",
        label: "Какие документы нужны для участия в обмене?",
        children: <Typography.Text></Typography.Text>,
        style: { marginBottom: "20px" },
    },
    {
        key: "5",
        label: "Сколько стоит участие в программе обмена?",
        children: <Typography.Text></Typography.Text>,
    },
];


const HomePage = () => {

    return (
        <Flex vertical  gap={100} style={{ padding: 103, backgroundColor: "#e6f0e4" }}>
            <Flex  align="center" gap={41} justify="space-between">
                <div>
                    <Typography.Title level={1}>
                        Добро пожаловать <span style={{ color: "#08A652" }}>в Edventure</span>
                    </Typography.Title>
                    <Typography.Text >
                        Цифровая интерактивная академическая платформа для участия в программах внутрисоссийского
                        семестрового обмена
                    </Typography.Text>
                </div>
                <img src="/sberkot.png" alt="Edventure Mascot" className={styles.mascot} />
            </Flex>

            <Card>
                <Flex vertical gap={20}>
                    <Typography.Title level={3} style={{ textAlign: "center", margin: 0 }}>
                        Наши ВУЗы-партнеры
                    </Typography.Title>
                    <Row justify="center" gutter={[16, 16]}>
                        {universities.map((uni) => (
                            <Col key={uni.id} xs={12} sm={8} md={6} lg={4}>
                                <Flex vertical align="center">
                                    <Avatar src={uni.logo} size={104} />
                                    <Typography.Text>{uni.name}</Typography.Text>
                                </Flex>
                            </Col>
                        ))}
                    </Row>
                </Flex>
            </Card>


            <Flex gap={20} wrap="wrap" justify="center">
                <Typography.Title level={3} style={{ textAlign: "center" }}>
                    Как это работает?
                </Typography.Title>
                <Steps
                    labelPlacement="vertical"
                    current={0}
                    items={steps.map(() => ({ title: "", description: "" }))}
                />
                {steps.map((step, index) => (
                    <Card key={index} title={step.title} style={{ width: 300 }}>
                        <Typography.Text>{step.description}</Typography.Text>
                        <img
                            src={step.image}
                            alt={step.title}
                            style={{width: "100%",marginTop: 25}}
                        />

                    </Card>
                ))}
            </Flex>


            <Flex style={{backgroundColor: "#D4EED7"}}>
                <Flex vertical style={{padding:100}}>
                    <Typography.Title level={2} >Начните с бесплатной регистрации!</Typography.Title>
                    <Flex gap={20}>
                        <Button style={{backgroundColor:" #318d25", color:"#fff"}}>Регистрация</Button>
                        <Button style={{backgroundColor:" #318d25", color:"#fff"}}>Вход</Button>
                    </Flex>
                </Flex>
                <img src="/homepage_img.png" alt="student" style={{ width: 304, marginRight:74}} />
            </Flex>


            <Flex gap={37}>
                <Flex vertical>
                    <Typography.Title level={2}>Отвечаем на частые вопросы</Typography.Title>
                    <Button  style={{
                        backgroundColor: "#318d25",
                        color: "#fff",
                        width: "fit-content",
                        padding: "18px 28px",
                    }}>Задать вопрос</Button>
                    <img src="/homepage_quastion.png" alt="student" style={{width: 304}} />
                </Flex>
                <Collapse
                    accordion
                    style={{ width: "100%" }}
                    items={items}
                    defaultActiveKey={["1"]}
                />
            </Flex>
        </Flex>
    );
};

export default HomePage;
