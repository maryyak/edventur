import React from "react";
import {Typography, Row, Col, Card, Avatar, Flex, Steps, Button, Collapse, Spin, Alert} from "antd";
import {Link} from "react-router-dom";
import useUniversities from "../hooks/api/universities/useUniversities";
import ContactsMailLinkWrapper from "../components/ContactsMailLinkWrapper";


const steps = [
    {
        title: "Программа",
        description: "Пройдите регистрацию на нашем портале и выберите понравившуюся программу",
        image: "/step1.png",
    },
    {
        title: "Ассесмент",
        description: "Пройдите предложенный Вам ассесмент",
        image: "/step2.png",
    },
    {
        title: "Заявка",
        description: "Подайте заявление на программу. Успехов!",
        image: "/step3.png",
    },
];

const items = [
    {
        key: "1",
        label: "Что такое Edventure?",
        children: <Typography.Text>
            Edventure (educational adventure) – это цифровая платформа, которая помогает студентам находить
            подходящие программы внутрироссийского семестрового обмена и участвовать в них.
        </Typography.Text>,
        style: {marginBottom: "20px"},
    },
    {
        key: "2",
        label: "Как подать заявку на обмен?",
        children: <Typography.Text>
            Вы можете зарегистрироваться на платформе и заполнить заявку в личном кабинете.
        </Typography.Text>,
        style: {marginBottom: "20px"},
    },
    {
        key: "3",
        label: "Как вуз может стать партнером платформы?",
        children: <Typography.Text>
            Вузу необходимо оставить заявку на сотрудничество через форму обратной связи на сайте или связаться
            с командой Edventure напрямую. После согласования условий партнёрства будет подписано соглашение о
            взаимодействии.
        </Typography.Text>,
        style: {marginBottom: "20px"},
    },
    {
        key: "4",
        label: "Какие документы нужны для участия в обмене?",
        children: <Typography.Text>
            Обычно требуются: паспорт, справка об успеваемости, мотивационное письмо и заявление от родного вуза.
            Точный список документов зависит от принимающего университета.
        </Typography.Text>,
        style: {marginBottom: "20px"},
    },
    {
        key: "5",
        label: "Сколько стоит участие в программе обмена?",
        children: <Typography.Text>
            Участие в программе обмена, как правило, бесплатное. Студент продолжает обучаться на бюджете или по
            контракту в своем вузе. Однако могут возникнуть дополнительные расходы, такие как проживание и проезд.
        </Typography.Text>,
    },
];


const HomePage = () => {
    const {universities, loading: universityLoading, error: universityError} = useUniversities();

    return (
        <Flex vertical gap={100} style={{padding: 103}}>
            <Flex align="center" gap={41} justify="space-between">
                <div>
                    <Typography.Title level={1}>
                        Добро пожаловать <span style={{color: "#08A652"}}>в Edventure</span>
                    </Typography.Title>
                    <Typography.Text id='about'>
                        Цифровая интерактивная академическая платформа для участия в программах внутрисоссийского
                        семестрового обмена
                    </Typography.Text>
                </div>
                <img src="/sberkot.png" alt="Edventure Mascot"/>
            </Flex>

            <Card>
                <Flex vertical gap={20}>
                    <Typography.Title level={3} style={{textAlign: "center", margin: 0}}>
                        Наши ВУЗы-партнеры
                    </Typography.Title>
                    {
                        universityError && <Alert message="Ошибка при загрузке вузов-партнеров" type="error"/>
                    }
                    <Spin spinning={universityLoading}>
                        <Row justify="center" gutter={[16, 16]}>
                            {universities.map((uni) => (
                                <Col key={uni?.id} xs={12} sm={8} md={6} lg={4}>
                                    <Flex vertical align="center">
                                        <Avatar src={uni?.logo} size={104}/>
                                        <Typography.Text>{uni?.name}</Typography.Text>
                                    </Flex>
                                </Col>
                            ))}
                        </Row>
                    </Spin>
                </Flex>
            </Card>


            <Flex gap={20} wrap="wrap" justify="center">
                <Typography.Title level={3} style={{textAlign: "center"}}>
                    Как это работает?
                </Typography.Title>
                <Steps
                    labelPlacement="vertical"
                    current={0}
                    items={steps.map(() => ({title: "", description: ""}))}
                />
                <Row gutter={16}>
                    {steps.map((step, index) => (
                        <Col span={8} key={index}>
                            <Card key={index} title={step.title} style={{width: "100%", height: "100%"}}>
                                <Typography.Text>{step.description}</Typography.Text>
                                <img
                                    src={step.image}
                                    alt={step.title}
                                    style={{width: "100%", marginTop: 25}}
                                />

                            </Card>
                        </Col>
                    ))}
                </Row>
            </Flex>


            <Flex style={{backgroundColor: "#D4EED7"}}>
                <Flex vertical style={{padding: 100}}>
                    <Typography.Title level={2}>Начните с бесплатной регистрации!</Typography.Title>
                    <Flex gap={20}>
                        <Link to="/registration">
                            <Button style={{backgroundColor: " #318d25", color: "#fff"}}>
                                Регистрация
                            </Button>
                        </Link>
                        <Link to="/login">
                            <Button style={{backgroundColor: " #318d25", color: "#fff"}}>
                                Вход
                            </Button>
                        </Link>
                    </Flex>
                </Flex>
                <img
                    src="/homepage_img.png"
                    alt="student"
                    style={{width: 346, marginRight: 74}}
                />

            </Flex>


            <Flex gap={37}>
                <Flex vertical>
                    <Typography.Title level={2} id='faq'>Отвечаем на частые вопросы</Typography.Title>
                    <ContactsMailLinkWrapper>
                        <Button style={{
                            backgroundColor: "#318d25",
                            color: "#fff",
                            width: "fit-content",
                            padding: "18px 28px",
                        }}>Задать вопрос</Button>
                    </ContactsMailLinkWrapper>
                    <img src="/homepage_quastion.png" alt="student" style={{width: 304}}/>
                </Flex>
                <Collapse
                    accordion
                    style={{width: "100%"}}
                    items={items}
                    defaultActiveKey={["1"]}
                />
            </Flex>
        </Flex>
    );
};

export default HomePage;
