import React from 'react';
import {applications} from "../utils/mock"
import {Card, Col, Row, Space, Tag, Typography} from "antd";
import {CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, StopOutlined} from "@ant-design/icons";

const statusTag = (status) => {
    switch (status) {
        case "На рассмотрении":
            return <Tag icon={<ClockCircleOutlined/>} color="processing">На рассмотрении</Tag>;
        case "Одобрено":
            return <Tag icon={<CheckCircleOutlined/>} color="success">Одобрено</Tag>;
        case "Отказано":
            return <Tag icon={<CloseCircleOutlined/>} color="error">Отказано</Tag>;
        case "Отменено":
            return <Tag icon={<StopOutlined/>} color="default">Отменено</Tag>;
        default:
            return <Tag color="default">{status}</Tag>;
    }
};

const Applications = () => {
    return (
        <Row gutter={[16, 16]}>
            {applications.map((app) => (
                <Col xs={24} sm={12} md={8} key={app.id}>
                    <Card
                        title={app.program.name}
                        bordered={false}
                        style={{borderRadius: "16px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)"}}
                    >
                        <Space direction="vertical" size="small">
                            <Typography.Text strong style={{fontSize: 20}}>{app.program.title}</Typography.Text>
                            <Typography.Text type="secondary">Дата подачи:</Typography.Text>
                            <Typography.Text>{new Date(app.date).toLocaleString("ru-RU")}</Typography.Text>

                            <Typography.Text type="secondary">Статус:</Typography.Text>
                            {statusTag(app.status)}

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
    );
};

export default Applications;