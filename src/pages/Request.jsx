import React, {useEffect, useState} from 'react';
import {Alert, Button, Card, Col, Flex, Form, Input, message, Row, Spin, Typography, Upload} from "antd";
import {Link, useParams} from "react-router-dom";
import {UploadOutlined} from "@ant-design/icons";
import {useUserInfo} from "../context/UserInfoContext";
import usePrograms from "../hooks/api/programs/usePrograms";
import useProgramRepresentative from "../hooks/api/programs/useProgramRepresentative";
import {getToken} from "../utils/token";
import {uploadProps} from "../utils/uploadProps";
import useUserApplications from "../hooks/api/applications/useUserApplications";
import useUserAssessments from "../hooks/api/assessments/useUserAssessments";

const API_URL = process.env.REACT_APP_API_URL;

const Request = () => {
    const {id} = useParams();
    const {data: program, loading: programLoading} = usePrograms(id);
    const {userInfo} = useUserInfo();
    const assessmentId = program?.assessment;

    const {data: userAssessment, mutate: refetchUserAssessments, loading} = useUserAssessments(assessmentId);

    const [needAssessment, setNeedAssessment] = useState(false);

    useEffect(() => {
        if (assessmentId) {
            refetchUserAssessments();
        }
    }, [assessmentId]);

    useEffect(() => {
        if (!loading && !programLoading) {
            setNeedAssessment(assessmentId && !userAssessment);
        }
    }, [assessmentId, userAssessment]);

    const [form] = Form.useForm();
    const {data: representative} = useProgramRepresentative(id);
    const {applications, mutate} = useUserApplications(userInfo?.id)
    const [currentApplication, setCurrentApplication] = React.useState();

    useEffect(() => {
        if (applications) {
            setCurrentApplication(applications.find((application) => application.programId.toString() === id));
        }
    }, [applications]);

    const [messageApi, contextHolder] = message.useMessage();

    const handleRequestSend = async (values) => {
        try {
            const token = getToken()
            const response = await fetch(`${API_URL}/applications/program/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(values)
            });

            if (!response.ok) {
                throw new Error("Не удалось отправить заявку");
            }

            messageApi.success("Заявка отправлена");
            mutate();

        } catch (err) {
            messageApi.error(err.message || "Произошла непредвиденная ошибка");
        }
    }

    return (
        <>
            {contextHolder}
            <Spin spinning={loading || programLoading}>
                <Flex vertical gap={30}>
                    {needAssessment ? <>
                            <Typography.Title>{program.title}</Typography.Title>
                            <Alert message="Информация"
                                   description="Для подачи заявления на данную программу для начала пройдите ассесмент"
                                   type="info" showIcon
                                   action={
                                       <Link to={`/assessment/${program.assessment}`}>
                                           <Button>
                                               Пройти
                                           </Button>
                                       </Link>
                                   }
                            />
                        </>
                        :
                        <Row gutter={30}>
                            <Col span={8}>
                                <Typography.Title style={{marginTop: 0}}>Подача заявки</Typography.Title>
                                <Flex vertical gap={30}>
                                    <Card>
                                        <Flex gap={30} align="center">
                                            <Flex vertical>
                                                <Typography.Text style={{fontSize: 20, fontWeight: 500}}>Представитель
                                                    ВУЗа</Typography.Text>
                                                <Typography.Text
                                                    style={{fontSize: 18}}>{representative.fio}</Typography.Text>
                                                <Typography.Link underline href={`mailto:${representative.email}`}>
                                                    {representative.email}
                                                </Typography.Link>
                                            </Flex>
                                        </Flex>
                                    </Card>
                                    <Card>
                                        <Flex gap={30} align="center">
                                            <div style={{width: '40px'}}>
                                                <img style={{width: '100%'}} src="/request_icon.png"
                                                     alt="request_icon"/>
                                            </div>
                                            <Flex vertical>
                                                <Typography.Text style={{fontSize: 20, fontWeight: 500}}>Шаблон
                                                    заявления</Typography.Text>
                                                <Typography.Link underline>
                                                    Скачать
                                                </Typography.Link>
                                            </Flex>
                                        </Flex>
                                    </Card>
                                </Flex>
                            </Col>
                            <Col span={16}>
                                <Card>
                                    <Typography.Title level={3}>Заявка на образовательную программу:{" "}
                                        {program.title}</Typography.Title>
                                    <Typography.Text>Заполните заявление на участие в академической
                                        мобильности</Typography.Text>
                                    <Form
                                        layout="vertical"
                                        form={form}
                                        name="info"
                                        initialValues={userInfo}
                                        style={{marginTop: 30}}
                                        onFinish={(values) => handleRequestSend(values)}
                                    >
                                        {!currentApplication && (
                                            <Form.Item
                                                name="phone"
                                                label="Контактный номер телефона"
                                            >
                                                <Input/>
                                            </Form.Item>
                                        )}

                                        <Form.Item>
                                            <Flex gap={16}>
                                                {!currentApplication && (
                                                    <Button type="primary" htmlType="submit">
                                                        Хочу участвовать
                                                    </Button>
                                                )}
                                                {currentApplication && (
                                                    <Flex vertical gap={16}>
                                                        {currentApplication.document &&
                                                            <a href={`${API_URL}/${currentApplication.document}`}>Текущее
                                                                заявление</a>}
                                                        <Upload {...uploadProps('application', mutate, {programId: id})}>
                                                            <Button icon={<UploadOutlined/>}>Прикрепить или обновить
                                                                заявление</Button>
                                                        </Upload>
                                                    </Flex>
                                                )}
                                            </Flex>
                                        </Form.Item>
                                    </Form>
                                </Card>
                            </Col>
                        </Row>
                    }
                </Flex>
            </Spin>
        </>
    );
};

export default Request;