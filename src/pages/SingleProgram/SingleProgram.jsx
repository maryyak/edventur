import React from 'react';
import {Avatar, Button, Card, Col, Collapse, Descriptions, Flex, Rate, Row, Table, Tag, Typography} from "antd";
import styles from "./SingleProgram.module.scss"
import {UserOutlined} from "@ant-design/icons";
import {Link, useParams} from "react-router-dom";

import {programs} from "../../utils/mock";

const SingleProgram = () => {
    const {id} = useParams();
    const program = programs.find((p) => p.id === Number(id));

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
            <Typography.Title level={2}>Похожие программы</Typography.Title>
            <Row gutter={16}>
                {program.similarPrograms.map((program) => {
                    const similarProgram = programs.find((p) => p.id === Number(program.id));
                    return (
                        <Col span={8} key={similarProgram.id}>
                            <Card
                                title={similarProgram.title}
                                style={{background: "#f6ffed"}}
                            >
                                <Flex vertical gap={16}>
                                    <Descriptions column={1}>
                                        <Descriptions.Item
                                            label="Университет">{similarProgram.university}</Descriptions.Item>
                                        <Descriptions.Item
                                            label="Описание">{similarProgram.description.slice(0, 100)}...</Descriptions.Item>
                                        <Descriptions.Item
                                            label="Уровень обучения">{similarProgram.level}</Descriptions.Item>
                                        <Descriptions.Item
                                            label="Форма обучения">{similarProgram.form}</Descriptions.Item>
                                    </Descriptions>
                                    <Flex gap={16}>
                                        <Button type="primary">
                                            Подать заявку
                                        </Button>
                                        <Button>
                                            <Link to={`/programs/${similarProgram.id}`}>Узнать подробнее</Link>
                                        </Button>
                                    </Flex>
                                </Flex>
                            </Card>
                        </Col>
                    )
                })}
            </Row>
            <Flex className={styles.banner} justify="center" align="center" gap={100}>
                <Flex vertical gap={30}>
                    <Typography.Title level={2}>Хочешь подать заявку на обучение?</Typography.Title>
                    <Link to={`/request/${program.id}`}>
                        <Button type="primary" style={{width:'100%'}}>
                            Подать заявку
                        </Button>
                    </Link>
                </Flex>
                <img src="/homepage_img.png" alt="student" style={{width: 304}}/>
            </Flex>
        </Flex>
    );
};

export default SingleProgram;