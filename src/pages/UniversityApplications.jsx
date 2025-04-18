import React, { useState } from 'react';
import {
    Card, Typography, Space, Button, Modal, Input, Collapse, Select, Flex, Divider, message
} from 'antd';
import {useUserInfo} from "../context/UserInfoContext";
import ContactsMailLinkWrapper from "../components/ContactsMailLinkWrapper";
import useApplications from "../hooks/api/applications/useApplications";
import {statusTag} from "./Applications";
const { Panel } = Collapse;

const API_URL = process.env.REACT_APP_API_URL;

const UniversityApplications = () => {
    const {userInfo} = useUserInfo()
    const isAdmin = userInfo?.role === "admin";
    const userUniversity = userInfo?.universityId;

    const {applications, mutate} = useApplications();
    const [modalVisible, setModalVisible] = useState(false);
    const [currentAppId, setCurrentAppId] = useState(null);
    const [rejectionComment, setRejectionComment] = useState('');
    const [selectedActiveProgram, setSelectedActiveProgram] = useState(null);
    const [selectedArchiveProgram, setSelectedArchiveProgram] = useState(null);

    const [messageApi, contextHolder] = message.useMessage();

    const handleChangeApplicationStatus = async (id, values) => {
        try {
            const response = await fetch(`${API_URL}/applications/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values)
            });

            if (!response.ok) {
                throw new Error("Не удалось изменить статус заявки");
            }

            messageApi.success("Статус заявки изменен");
            mutate();

        } catch (err) {
            messageApi.error(err.message || "Произошла непредвиденная ошибка");
        }
    };

    const handleReject = (id) => {
        setCurrentAppId(id);
        setModalVisible(true);
    };

    const confirmRejection = async () => {
        await handleChangeApplicationStatus(currentAppId, {
            status: 'отказано',
            comment: rejectionComment
        })
        setModalVisible(false);
        setRejectionComment('');
        setCurrentAppId(null);
    };

    const activeApplications = applications.filter(app => app.status === 'на рассмотрении');
    const archivedApplications = applications.filter(app => app.status !== 'на рассмотрении');

    const getProgramsFromApplications = (apps) => {
        const map = new Map();
        apps.forEach(app => {
            const prog = app.Program;
            if (app.universityId === userUniversity && !map.has(prog.title)) {
                map.set(prog.title, prog);
            }
        });
        return Array.from(map.values());
    };
    const activePrograms = getProgramsFromApplications(activeApplications);
    const archivePrograms = getProgramsFromApplications(archivedApplications);

    const groupByProgram = (apps) =>
        apps.reduce((acc, app) => {
            const title = app.Program.title;
            if (!acc[title]) acc[title] = [];
            acc[title].push(app);
            return acc;
        }, {});

    const groupedActive = groupByProgram(activeApplications);
    const groupedArchive = groupByProgram(archivedApplications);

    const filteredGrouped = (grouped, selectedProgram) =>
        selectedProgram === null || selectedProgram === 'Все программы'
            ? Object.entries(grouped)
            : Object.entries(grouped).filter(([title]) => title === selectedProgram);


    const renderApplications = (apps) => (
        apps.map((app) => {
            const user = app.User
            return <Panel
                key={app.id}
                style={{borderRadius: 16}}
                header={
                    <Flex justify="space-between" align="center" style={{width: '100%'}}>
                        <Typography.Text>Заявка от {user.fio}</Typography.Text>
                        {statusTag(app.status)}
                    </Flex>
                }
            >

                <Card bordered style={{borderRadius: 16}}>
                    <Space direction="vertical" size="small" style={{width: '100%'}}>
                        <Typography.Text strong>Программа:</Typography.Text>
                        <Typography.Text>{app.Program.title}</Typography.Text>

                        <Typography.Text type="secondary">Дата подачи:</Typography.Text>
                        <Typography.Text>{new Date(app.createdAt).toLocaleString("ru-RU")}</Typography.Text>

                        <Typography.Text type="secondary">ФИО студента:</Typography.Text>
                        <Typography.Text>{user.fio}</Typography.Text>

                        <Typography.Text type="secondary">Университет:</Typography.Text>
                        <Typography.Text>{user.university}</Typography.Text>

                        <Typography.Text type="secondary">Курс:</Typography.Text>
                        <Typography.Text>{user.course}</Typography.Text>

                        <Typography.Text type="secondary">Направление:</Typography.Text>
                        <Typography.Text>{user.direction}</Typography.Text>

                        <Typography.Text type="secondary">Средний балл:</Typography.Text>
                        <Typography.Text>{user.score}</Typography.Text>

                        {app.Program.assessment && (
                            <>
                                <Typography.Text type="secondary">Результаты ассесмента:</Typography.Text>
                                <Typography.Text>{app.assesment}</Typography.Text>
                            </>
                        )}

                        {
                            app.User.scoreDoc && (
                                <>
                                    <Typography.Text type="secondary">Выписка из зачетки:</Typography.Text>
                                    <a href={`${API_URL}/${app.User.scoreDoc}`} target="_blank" rel="noopener noreferrer">Открыть</a>
                                </>
                            )
                        }

                        {app.document && (
                            <>
                                <Typography.Text type="secondary">Заявление:</Typography.Text>
                                <a href={`${API_URL}/${app.document}`} target="_blank" rel="noopener noreferrer">Открыть</a>
                            </>
                        )}

                        {app.status === 'на рассмотрении' && (
                            <Space>
                                <Button type="primary" onClick={() => handleChangeApplicationStatus(app.id, {status: 'принято'})}>Одобрить</Button>
                                <Button danger onClick={() => handleReject(app.id)}>Отклонить</Button>
                            </Space>
                        )}
                    </Space>
                </Card>
            </Panel>
        })
    );

    if (!userUniversity && !isAdmin) return (
        <Flex vertical align="center">
            <Typography.Title level={2}>Вы не прикреплены ни к одному университету!</Typography.Title>
            <ContactsMailLinkWrapper><Button type="primary">Связаться с поддержкой</Button></ContactsMailLinkWrapper>
        </Flex>
    );

    return (
        <>
            {contextHolder}
            <Typography.Title>Заявки студентов</Typography.Title>
            <Divider orientation="left"  style={{ borderColor: 'black' }}><Typography.Title level={3}>На рассмотрении</Typography.Title></Divider>

            <Select
                placeholder="Фильтр по программе"
                style={{ width: 200, marginBottom: 20 }}
                allowClear
                onChange={setSelectedActiveProgram}
                value={selectedActiveProgram}
                options={[
                    { label: 'Все программы', value: 'Все программы' },
                    ...activePrograms.map((program) => ({
                        label: program.title,
                        value: program.title
                    }))
                ]}
            />
            {filteredGrouped(groupedActive, selectedActiveProgram).map(([programTitle, apps]) => (
                <Flex vertical key={programTitle} style={{ marginBottom: 32 }}>
                    <Typography.Title level={4}>{programTitle}</Typography.Title>
                    <Collapse accordion>
                        {renderApplications(apps)}
                    </Collapse>
                </Flex>
            ))}

            <Flex vertical style={{opacity:0.8}}>
                <Divider orientation="left"  style={{ borderColor: 'black' }}><Typography.Title level={3}>Архив заявок</Typography.Title></Divider>

                <Select
                placeholder="Фильтр по программе"
                style={{ width: 200, marginBottom: 20}}
                allowClear
                onChange={setSelectedArchiveProgram}
                value={selectedArchiveProgram}
                options={[
                    { label: 'Все программы', value: 'Все программы' },
                    ...archivePrograms.map((program) => ({
                        label: program.title,
                        value: program.title
                    }))
                ]}
            />
            {filteredGrouped(groupedArchive, selectedArchiveProgram).map(([programTitle, apps]) => {
                const sortedApps = [...apps].sort((a, b) => {
                    if (a.status === 'Одобрено' && b.status === 'Отказано') return -1;
                    if (a.status === 'Отказано' && b.status === 'Одобрено') return 1;
                    return 0;
                });

                return (
                    <Flex vertical key={programTitle} style={{ marginBottom: 32}}>
                        <Typography.Title level={4}>{programTitle}</Typography.Title>
                        <Collapse accordion style={{opacity: 0.6}}>
                            {renderApplications(sortedApps)}
                        </Collapse>
                    </Flex>
                );
            })}
            </Flex>

            <Modal
                title="Причина отказа"
                open={modalVisible}
                onOk={confirmRejection}
                onCancel={() => setModalVisible(false)}
                okText="Отклонить"
                cancelText="Отмена"
                okButtonProps={{ danger: true }}
            >
                <Input.TextArea
                    rows={4}
                    placeholder="Введите причину отказа"
                    value={rejectionComment}
                    onChange={(e) => setRejectionComment(e.target.value)}
                />
            </Modal>
        </>
    );
};

export default UniversityApplications;
