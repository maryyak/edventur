import React from 'react';
import {Avatar, Button, Card, Col, Collapse, Descriptions, Flex, Rate, Row, Table, Tag, Typography} from "antd";
import styles from "./SingleProgram.module.scss"
import {UserOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";

//с бэка по айди программа(айди берем из ссылки через useParams(аналогичное есть в конструкторе нашем)
const program = {
    id: 1,
    title: "Фуллстек разработка",
    description: "В рамках профиля ведётся подготовка специалистов, которые умеют производить разработку программного обеспечения с использованием различных языков программирования: С++, Python, Javascript, Go, C# и др., а также с применением разнообразных паттернов и фреймворков. Выпускники способны работать с ключевыми технологиями программной разработки, а потому они наиболее востребованы на IT-рынке.",
    university: "РТУ МИРЭА", //многие ко многим должна быть связка и название будет из таблицы самого вуза брать
    level: "Бакалавриат",
    form: "Очная",
    seats: 100,
    duration: "2 года",
    additionally: "2 диплома - НИУ ВШЭ и ВУЗа партнера",
    studyplan: { //не знаю, в каком формате подгружать разрешим, но компилить и хранить будем в json
        "program": "Программная инженерия",
        "degree": "Бакалавриат",
        "duration_years": 4,
        "semesters": [
            {
                "semester": 1,
                "courses": [
                    {
                        "name": "Математика",
                        "hours": 144,
                        "type": "Лекции + Практика",
                        "assessment": "Экзамен"
                    },
                    {
                        "name": "Информатика",
                        "hours": 108,
                        "type": "Лекции + Лабораторные",
                        "assessment": "Зачёт"
                    },
                    {
                        "name": "История",
                        "hours": 72,
                        "type": "Лекции",
                        "assessment": "Зачёт"
                    },
                    {
                        "name": "Иностранный язык",
                        "hours": 72,
                        "type": "Практика",
                        "assessment": "Зачёт"
                    }
                ]
            },
            {
                "semester": 2,
                "courses": [
                    {
                        "name": "Математический анализ",
                        "hours": 144,
                        "type": "Лекции + Практика",
                        "assessment": "Экзамен"
                    },
                    {
                        "name": "Алгоритмы и структуры данных",
                        "hours": 108,
                        "type": "Лекции + Лабораторные",
                        "assessment": "Экзамен"
                    },
                    {
                        "name": "Физика",
                        "hours": 108,
                        "type": "Лекции + Лабораторные",
                        "assessment": "Зачёт"
                    },
                    {
                        "name": "Философия",
                        "hours": 72,
                        "type": "Лекции",
                        "assessment": "Зачёт"
                    }
                ]
            },
            {
                "semester": 3,
                "courses": [
                    {
                        "name": "ООП и языки программирования",
                        "hours": 108,
                        "type": "Лекции + Лабораторные",
                        "assessment": "Экзамен"
                    },
                    {
                        "name": "Базы данных",
                        "hours": 108,
                        "type": "Лекции + Практика",
                        "assessment": "Экзамен"
                    },
                    {
                        "name": "Теория вероятностей и математическая статистика",
                        "hours": 72,
                        "type": "Лекции",
                        "assessment": "Зачёт"
                    },
                    {
                        "name": "Проектная деятельность",
                        "hours": 72,
                        "type": "Проект",
                        "assessment": "Зачёт"
                    }
                ]
            }
        ]
    },
    reviews: [
        {
            "id": 1,
            "name": "Александр Смирнов", //не знаю надо ли тут многое ко многим, но как-будто пофиг, просто пусть тоже jsonчиком хранится
            "year": 3,
            "rating": 5,
            "comment": "Программа супер! Отличные преподаватели и много практики. Особенно понравился курс по алгоритмам.",
            "date": "2024-03-15"
        },
        {
            "id": 2,
            "name": "Екатерина Иванова",
            "year": 2,
            "rating": 4,
            "comment": "Курсы интересные, но хотелось бы больше живых проектов. В остальном всё отлично!",
            "date": "2024-02-10"
        },
        {
            "id": 3,
            "name": "Максим Кузнецов",
            "year": 4,
            "rating": 5,
            "comment": "Очень доволен программой! Глубокая теоретическая база и современные технологии.",
            "date": "2024-01-28"
        },
        {
            "id": 4,
            "name": "Анна Петрова",
            "year": 1,
            "rating": 3,
            "comment": "Не хватает практических занятий в начале обучения, но преподаватели стараются донести материал понятно.",
            "date": "2024-04-02"
        }
    ]
}

//Вот это должно через нейронку прокидываться и выдавать программы, подходящие пользователю(если прям в идеале то те, которые могут понравиться пользователю, если ему понравилась текущая, которую он просматривает)
const programs = [
    {
        id: 2,
        title: "Искусственный интеллект",
        description:
            "Программа нацелена на подготовку специалистов в области машинного обучения, анализа данных и нейронных сетей. Выпускники могут работать в сферах автоматизации, предсказательной аналитики и AI-исследований.",
        university: "МГУ",
        level: "Магистратура",
        form: "Очная"
    },
    {
        id: 3,
        title: "Кибербезопасность",
        description:
            "Студенты изучают методы защиты информации, криптографию, анализ уязвимостей и методы предотвращения кибератак. Подготовка специалистов ведётся в тесном взаимодействии с ведущими IT-компаниями.",
        university: "РТУ МИРЭА",
        level: "Бакалавриат",
        form: "Очно-заочная"
    },
    {
        id: 4,
        title: "Разработка мобильных приложений",
        description:
            "Обучение направлено на разработку мобильных приложений под iOS и Android с использованием современных технологий, таких как Swift, Kotlin и Flutter.",
        university: "СПбГУ",
        level: "Бакалавриат",
        form: "Очная"
    }
]

const SingleProgram = () => {
    return (
        <Flex vertical gap={30}>
            <Typography.Title>{program.title}</Typography.Title>
            <Flex gap={30} style={{width: "100%"}} align="center">
                <Flex vertical gap={30}>
                    <Typography.Title level={2}>Про образовательную программу</Typography.Title>
                    <Typography.Text>{program.description}</Typography.Text>
                    <Tag className={styles.tag} color="success">{program.level}</Tag>
                </Flex>
                <div className={styles.shortDescription}>
                    <Descriptions column={1}>
                        <Descriptions.Item label="Бюджетных мест">
                            <Typography.Text strong>{program.seats}</Typography.Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Продолжительность">{program.duration}</Descriptions.Item>
                        <Descriptions.Item label="Форма обучения">{program.form}</Descriptions.Item>
                        <Descriptions.Item>{program.additionally}</Descriptions.Item>
                    </Descriptions>
                </div>
            </Flex>
            <Typography.Title level={2}>Учебный план</Typography.Title>
            <Collapse accordion>
                {program.studyplan.semesters.map((semester) => (
                    <Collapse.Panel header={`Семестр ${semester.semester}`} key={semester.semester}>
                        <Table
                            dataSource={semester.courses}
                            rowKey={(record) => record.name}
                            pagination={false}
                            size="middle"
                            columns={[
                                {
                                    title: "Дисциплина",
                                    dataIndex: "name",
                                    key: "name"
                                },
                                {
                                    title: "Часы",
                                    dataIndex: "hours",
                                    key: "hours",
                                    align: "center"
                                },
                                {
                                    title: "Тип занятий",
                                    dataIndex: "type",
                                    key: "type"
                                },
                                {
                                    title: "Форма контроля",
                                    dataIndex: "assessment",
                                    key: "assessment",
                                    align: "center"
                                }
                            ]}
                        />
                    </Collapse.Panel>
                ))}
            </Collapse>
            <Flex justify="space-between" align="center">
                <Typography.Title level={2}>Отзывы о программе</Typography.Title>
                <Button color="primary" variant="outlined">Оставить отзыв</Button>
            </Flex>
            <div className={styles.reviewsGrid}>
                {program.reviews.map((review) => (
                    <Card>
                        <Flex justify="space-between" align="center">
                            <Flex gap={16} align="center">
                                <Avatar icon={<UserOutlined/>}/>
                                <Flex vertical>
                                    <Typography.Text strong>{review.name} ({review.year} курс)</Typography.Text>
                                    <Typography.Text
                                        type="secondary">{new Date(review.date).toLocaleDateString()}</Typography.Text>
                                </Flex>
                            </Flex>
                            <Rate disabled defaultValue={review.rating}/>
                        </Flex>
                        <Typography.Text
                            style={{display: "block", marginTop: 16, height: "100%"}}>{review.comment}</Typography.Text>
                    </Card>
                ))}
            </div>
            <Typography.Title level={2}>Возможно вас заинтересуют</Typography.Title>
            <Row gutter={16}>
                {programs.map((program) => (
                    <Col span={8} key={program.id}>
                        <Card
                            title={program.title}
                            style={{background: "#f6ffed"}}
                        >
                            <Flex vertical gap={16}>
                                <Descriptions column={1}>
                                    <Descriptions.Item
                                        label="Описание">{program.description.slice(0, 100)}...</Descriptions.Item>
                                    <Descriptions.Item label="Уровень обучения">{program.level}</Descriptions.Item>
                                    <Descriptions.Item label="Форма обучения">{program.form}</Descriptions.Item>
                                </Descriptions>
                                <Flex gap={16}>
                                    <Button type="primary">
                                        Подать заявку
                                    </Button>
                                    <Button>
                                        <Link to={`/programs/${program.id}`}>Узнать подробнее</Link>
                                    </Button>
                                </Flex>
                            </Flex>
                        </Card>
                    </Col>
                ))}
            </Row>
            <Flex className={styles.banner} justify="center" align="center" gap={100}>
                <Flex vertical gap={30}>
                    <Typography.Title level={2}>Хочешь подать заявку на обучение?</Typography.Title>
                    <Button type="primary">Подать заявку</Button>
                </Flex>
                <img src="/homepage_img.png" alt="student" style={{width: 304}}/>
            </Flex>
        </Flex>
    );
};

export default SingleProgram;