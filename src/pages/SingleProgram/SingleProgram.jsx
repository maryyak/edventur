import React from 'react';
import {Avatar, Card, Collapse, Descriptions, Flex, List, Rate, Table, Tag, Typography} from "antd";
import styles from "./SingleProgram.module.scss"
import {UserOutlined} from "@ant-design/icons";

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

const SingleProgram = () => {
    return (
        <Flex vertical>
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
            <Typography.Title level={2}>Отзывы о программе</Typography.Title>
            <List
                grid={{
                    gutter: 15,
                    column: 2
                }}
                dataSource={program.reviews}
                renderItem={(review) => (
                    <List.Item>
                        <Card style={{marginBottom: 15}}>
                            <Flex justify="space-between" align="center">
                                <List.Item.Meta
                                    avatar={<Avatar icon={<UserOutlined/>}/>}
                                    title={<Typography.Text strong>{review.name} ({review.year} курс)</Typography.Text>}
                                    description={<Typography.Text
                                        type="secondary">{new Date(review.date).toLocaleDateString()}</Typography.Text>}
                                />
                                <Rate disabled defaultValue={review.rating}/>
                            </Flex>
                            <Typography.Text
                                style={{display: "block", marginTop: 10, height: "100%"}}>{review.comment}</Typography.Text>
                        </Card>
                    </List.Item>
                )}
            />
        </Flex>
    );
};

export default SingleProgram;