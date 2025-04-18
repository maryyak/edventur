import React from 'react';
import {Alert, Card, Col, Row, Space, Spin, Tag, Typography} from "antd";
import {CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined} from "@ant-design/icons";
import useUserApplications from "../hooks/api/applications/useUserApplications";
import {useUserInfo} from "../context/UserInfoContext";

//Здесь по-хорошему надо добавить отображение страницы по типу "У вас пока нет заявок", если applications - пустой массив
export const statusTag = (status) => {
    switch (status) {
        case "на рассмотрении":
            return <Tag icon={<ClockCircleOutlined/>} color="processing">На рассмотрении</Tag>;
        case "принято":
            return <Tag icon={<CheckCircleOutlined/>} color="success">Одобрено</Tag>;
        case "отказано":
            return <Tag icon={<CloseCircleOutlined/>} color="error">Отказано</Tag>;
        default:
            return <Tag color="default">{status}</Tag>;
    }
};

const Applications = () => {
    const { userInfo } = useUserInfo();
    const { applications, loading, error } = useUserApplications(userInfo?.id);
    return (
        <Spin spinning={loading}>
            {
                error && <Alert message="Ошибка при загрузке образовательной программы" type="error"/>
            }
            <Row gutter={[16, 16]}>
                {applications.map((app) => (
                    <Col xs={24} sm={12} md={8} key={app?.id}>
                        <Card
                            // title={app.Program?.name} У таблицы Programs в бд нет колонки name, название программы - это колонка title
                            bordered={false}
                            style={{borderRadius: "16px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)"}}
                        >
                            <Space direction="vertical" size="small">
                                <Typography.Text strong style={{fontSize: 20}}>{app.Program?.title}</Typography.Text>
                                <Typography.Text type="secondary">Дата подачи:</Typography.Text>
                                <Typography.Text>{new Date(app?.createdAt).toLocaleString("ru-RU")}</Typography.Text>

                                <Typography.Text type="secondary">Статус:</Typography.Text>
                                {statusTag(app?.status)}

                                {app.comment && (
                                    <>
                                        <Typography.Text type="secondary">Комментарий:</Typography.Text>
                                        <Typography.Text>{app.comment}</Typography.Text>
                                    </>
                                )}
                            </Space>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Spin>
        );
};

export default Applications;