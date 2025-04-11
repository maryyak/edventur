import {
    Button, Card, Col, Collapse, Flex, Form, Input, message, Row,
    Table, Typography, Upload
} from "antd";
import React, { useState } from "react";
import { programs, universities, userInfo } from "../utils/mock";
import {UploadOutlined} from "@ant-design/icons";

const { Panel } = Collapse;

const PartnerUniversities = () => {
    const [universitiesList, setUniversitiesList] = useState(universities);
    const [usersList, setUsersList] = useState(userInfo);

    const [newUniversityName, setNewUniversityName] = useState("");
    const [openRepForms, setOpenRepForms] = useState({});
    const [openProgForms, setOpenProgForms] = useState({});
    const [programList, setProgramList] = useState(programs);

    const handleUpdateRepresentative = (university, updatedValues) => {
        const updatedUsersList = usersList.map(user =>
            user.uni === university && user.role === "agent"
                ? { ...user, ...updatedValues }
                : user
        );
        setUsersList(updatedUsersList);
        message.success("Данные представителя обновлены");
        setOpenRepForms(prev => ({ ...prev, [university]: false }));
    };

    const props = {
        name: 'file',
        // action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload', реализовываешь апи для загрузки файлов(можно поглядеть как в конструкторе программ сделано)
        headers: {
            authorization: 'authorization-text',
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };

    return (
        <Flex vertical gap={24} >
            <Typography.Title level={2}>Наши ВУЗы-партнеры</Typography.Title>
            <Flex gap={30} style={{ justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Card title="Добавить новый ВУЗ" style={{ flex: 2 }}>
                    <Flex style={{ width: '100%' }} gap={20}>
                        <Input
                            placeholder="Введите название ВУЗа"
                            value={newUniversityName}
                            onChange={(e) => setNewUniversityName(e.target.value)}
                            style={{ flex: 1 }}
                        />
                        <Button
                            type="primary"
                            onClick={() => {
                                if (!newUniversityName.trim()) return message.warning("Введите название ВУЗа");
                                if (universitiesList.includes(newUniversityName)) return message.warning("ВУЗ уже существует");

                                setUniversitiesList([...universitiesList, newUniversityName]);
                                setOpenRepForms(prev => ({ ...prev, [newUniversityName]: false }));
                                setOpenProgForms(prev => ({ ...prev, [newUniversityName]: false }));
                                setNewUniversityName("");
                            }}
                        >
                            Добавить
                        </Button>
                    </Flex>
                </Card>

                <img
                    src="/sberkot_student.png"
                    alt="Сберкот"
                    style={{
                        width: 200,
                        height: 'auto',
                        objectFit: 'cover',
                        marginRight: 90,
                    }}
                />
            </Flex>

            <Collapse accordion>
                {universitiesList.map((university) => {
                    const universityPrograms = programList.filter(p => p.university === university);
                    const representative = usersList.find(u => u.role === "agent" && u.uni === university);

                    return (
                        <Panel header={university} key={university}>
                            {representative ? (
                                <Form
                                    layout="vertical"
                                    initialValues={representative}
                                    onFinish={(values) => handleUpdateRepresentative(university, values)}
                                >
                                    <Typography.Title level={4}>Представитель ВУЗа</Typography.Title>
                                    <Form.Item name="fio" label="ФИО" rules={[{ required: true }]}>
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="email" label="Email" rules={[{ required: true }]}>
                                        <Input />
                                    </Form.Item>
                                    <Button type="primary" htmlType="submit">Обновить</Button>
                                </Form>
                            ) : openRepForms[university] ? (
                                <Form
                                    layout="vertical"
                                    onFinish={(values) => {
                                        const newRep = {
                                            id: Date.now(),
                                            role: "agent",
                                            uni: university,
                                            ...values
                                        };
                                        setUsersList([...usersList, newRep]);
                                        setOpenRepForms({ ...openRepForms, [university]: false });
                                        message.success("Представитель добавлен");
                                    }}
                                >
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Form.Item name="fio" label="ФИО" rules={[{ required: true }]}>
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item name="email" label="Email" rules={[{ required: true }]}>
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Button type="primary" htmlType="submit">Сохранить</Button>
                                </Form>
                            ) : (
                                <Button
                                    onClick={() => setOpenRepForms({ ...openRepForms, [university]: true })}
                                    style={{ marginBottom: 20 }}
                                >
                                    Добавить представителя
                                </Button>
                            )}

                            <Typography.Title level={4}>Образовательные программы</Typography.Title>

                            <Collapse accordion>
                                {universityPrograms.map((program) => {
                                    return (
                                        <Panel header={program.title} key={program.id}>
                                            <Card>
                                                <Form
                                                    layout="vertical"
                                                    initialValues={program}
                                                    onFinish={(values) => {
                                                        const updated = [...programList];
                                                        updated[programList.findIndex(p => p.id === program.id)] = { ...updated[programList.findIndex(p => p.id === program.id)], ...values };
                                                        setProgramList(updated);
                                                        message.success("Сохранено");
                                                    }}
                                                >
                                                    <Form.Item name="title" label="Название">
                                                        <Input />
                                                    </Form.Item>
                                                    <Form.Item name="description" label="Описание">
                                                        <Input.TextArea rows={3} />
                                                    </Form.Item>
                                                    <Form.Item name="level" label="Уровень">
                                                        <Input />
                                                    </Form.Item>
                                                    <Form.Item name="form" label="Форма обучения">
                                                        <Input />
                                                    </Form.Item>
                                                    <Form.Item name="duration" label="Срок обучения">
                                                        <Input />
                                                    </Form.Item>
                                                    <Form.Item name="seats" label="Количество мест">
                                                        <Input />
                                                    </Form.Item>
                                                    <Form.Item name="additionally" label="Дополнительно">
                                                        <Input />
                                                    </Form.Item>
                                                    <Collapse accordion>
                                                        {program.studyplan.semesters.map((semester) => (
                                                            <Collapse.Panel header={`Семестр ${semester.semester}`} key={semester.semester}>
                                                                <Table
                                                                    dataSource={semester.courses}
                                                                    rowKey={(record) => record.name}
                                                                    pagination={false}
                                                                    size="middle"
                                                                    columns={[
                                                                        { title: "Дисциплина", dataIndex: "name", key: "name" },
                                                                        { title: "Часы", dataIndex: "hours", key: "hours", align: "center" },
                                                                        { title: "Тип занятий", dataIndex: "type", key: "type" },
                                                                        { title: "Форма контроля", dataIndex: "assessment", key: "assessment", align: "center" }
                                                                    ]}
                                                                />
                                                            </Collapse.Panel>
                                                        ))}
                                                    </Collapse>
                                                    <Form.Item style={{ marginTop: 20 }}>
                                                        <Upload {...props}>
                                                            <Button icon={<UploadOutlined />}>Загрузите новый учебный план программы</Button>
                                                        </Upload>
                                                    </Form.Item>
                                                    <Flex style={{ marginTop: 20,justifyContent:'space-between' }}>
                                                        <Button type="primary" htmlType="submit">Сохранить</Button>
                                                        <Button
                                                            danger
                                                            htmlType="submit"
                                                        >
                                                            Удалить
                                                        </Button>
                                                    </Flex>
                                                </Form>
                                            </Card>
                                        </Panel>
                                    );
                                })}
                            </Collapse>

                            {openProgForms[university] ? (
                                <Form
                                    layout="vertical"
                                    onFinish={(values) => {
                                        const newProgram = {
                                            id: Date.now(),
                                            university,
                                            ...values
                                        };
                                        setProgramList([...programList, newProgram]);
                                        setOpenProgForms({ ...openProgForms, [university]: false });
                                        message.success("Программа добавлена");
                                    }}
                                    style={{ marginTop: 20 }}
                                >
                                    <Typography.Title level={4}>Новая программа</Typography.Title>
                                    <Form.Item name="title" label="Название" rules={[{ required: true }]}>
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="description" label="Описание">
                                        <Input.TextArea />
                                    </Form.Item>
                                    <Form.Item name="level" label="Уровень">
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="form" label="Форма">
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="duration" label="Срок">
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="seats" label="Мест">
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="additionally" label="Дополнительно">
                                        <Input />
                                    </Form.Item>
                                    <Form.Item style={{ marginTop: 20 }}>
                                        <Upload {...props}>
                                            <Button icon={<UploadOutlined />}>Загрузите учебный план программы</Button>
                                        </Upload>
                                    </Form.Item>
                                        <Button type="primary" htmlType="submit">Добавить</Button>
                                </Form>
                            ) : (
                                <Button
                                    type="dashed"
                                    onClick={() => setOpenProgForms({ ...openProgForms, [university]: true })}
                                    style={{ marginTop: 16 }}
                                    block
                                >
                                    + Добавить программу
                                </Button>
                            )}
                        </Panel>
                    );
                })}
            </Collapse>
        </Flex>
    );
};

export default PartnerUniversities;
