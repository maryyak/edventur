import React, { useState } from 'react';
import {
    Card, Typography, Tag, Space, Button, Modal, Input, Collapse, Select, Flex
} from 'antd';
import {
    ClockCircleOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined
} from '@ant-design/icons';
import { universityApplications, userInfo, programs } from "../utils/mock";

const { Panel } = Collapse;

const statusTag = (status) => {
    switch (status) {
        case 'На рассмотрении':
            return <Tag icon={<ClockCircleOutlined />} color="processing">{status}</Tag>;
        case 'Одобрено':
            return <Tag icon={<CheckCircleOutlined />} color="success">{status}</Tag>;
        case 'Отказано':
            return <Tag icon={<CloseCircleOutlined />} color="error">{status}</Tag>;
        default:
            return <Tag>{status}</Tag>;
    }
};

const UniversityApplications = () => {
    const [applications, setApplications] = useState(universityApplications);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentAppId, setCurrentAppId] = useState(null);
    const [rejectionComment, setRejectionComment] = useState('');
    const [selectedActiveProgram, setSelectedActiveProgram] = useState(null);
    const [selectedArchiveProgram, setSelectedArchiveProgram] = useState(null);

    const handleApprove = (id) => {
        setApplications(prev =>
            prev.map(app =>
                app.id === id ? { ...app, status: 'Одобрено' } : app
            )
        );
    };

    const handleReject = (id) => {
        setCurrentAppId(id);
        setModalVisible(true);
    };

    const confirmRejection = () => {
        setApplications(prev =>
            prev.map(app =>
                app.id === currentAppId
                    ? { ...app, status: 'Отказано', comment: rejectionComment }
                    : app
            )
        );
        setModalVisible(false);
        setRejectionComment('');
        setCurrentAppId(null);
    };

    const activeApplications = applications.filter(app => app.status === 'На рассмотрении');
    const archivedApplications = applications.filter(app => app.status !== 'На рассмотрении');

    const getProgramsFromApplications = (apps) => {
        const map = new Map();
        apps.forEach(app => {
            const prog = app.program;
            if (prog.university === 'РТУ МИРЭА' && !map.has(prog.title)) { //Типа представитель РТУ МИРЭА
                map.set(prog.title, prog);
            }
        });
        return Array.from(map.values());
    };
    const activePrograms = getProgramsFromApplications(activeApplications);
    const archivePrograms = getProgramsFromApplications(archivedApplications);

    const groupByProgram = (apps) =>
        apps.reduce((acc, app) => {
            const title = app.program.title;
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
        apps.map((app) => (
            <Panel
                key={app.id}
                style={{ borderRadius: 16 }}
                header={
                    <Flex justify="space-between" align="center" style={{ width: '100%' }}>
                        <Typography.Text>Заявка от {userInfo.fio}</Typography.Text>
                        {statusTag(app.status)}
                    </Flex>
                }
            >

            <Card bordered style={{ borderRadius: 16 }}>
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <Typography.Text strong>Программа:</Typography.Text>
                        <Typography.Text>{app.program.title}</Typography.Text>

                        <Typography.Text type="secondary">Дата подачи:</Typography.Text>
                        <Typography.Text>{new Date(app.date).toLocaleString("ru-RU")}</Typography.Text>

                        <Typography.Text type="secondary">Статус:</Typography.Text>
                        {statusTag(app.status)}

                        <Typography.Text type="secondary">ФИО студента:</Typography.Text>
                        <Typography.Text>{userInfo.fio}</Typography.Text>

                        <Typography.Text type="secondary">Университет:</Typography.Text>
                        <Typography.Text>{userInfo.uni}</Typography.Text>

                        <Typography.Text type="secondary">Курс:</Typography.Text>
                        <Typography.Text>{userInfo.course}</Typography.Text>

                        <Typography.Text type="secondary">Направление:</Typography.Text>
                        <Typography.Text>{userInfo.direction}</Typography.Text>

                        <Typography.Text type="secondary">Средний балл:</Typography.Text>
                        <Typography.Text>{userInfo.score}</Typography.Text>

                        {app.program.assessment && (
                            <>
                                <Typography.Text type="secondary">Результаты ассесмента:</Typography.Text>
                                <Typography.Text>{app.assesment}</Typography.Text>
                            </>
                        )}


                            <>
                                <Typography.Text type="secondary">Выписка из зачетки:</Typography.Text>
                                <a href={userInfo.file} target="_blank" rel="noopener noreferrer">Открыть</a>
                            </>

                        {app.file && (
                            <>
                                <Typography.Text type="secondary">Заявление:</Typography.Text>
                                <a href={app.file} target="_blank" rel="noopener noreferrer">Открыть</a>
                            </>
                        )}

                        {app.status === 'На рассмотрении' && (
                            <Space>
                                <Button type="primary" onClick={() => handleApprove(app.id)}>Одобрить</Button>
                                <Button danger onClick={() => handleReject(app.id)}>Отклонить</Button>
                            </Space>
                        )}
                    </Space>
                </Card>
            </Panel>
        ))
    );

    return (
        <>
            <Typography.Title>Заявки студентов</Typography.Title>
            <Typography.Title level={3}>На рассмотрении</Typography.Title>
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
            <Typography.Title level={4}>Архив заявок</Typography.Title>
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
