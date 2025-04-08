import React from 'react';
import {Alert, Button, Card, Col, Flex, Form, Input, message, Row, Typography, Upload} from "antd";
import {Link, useParams} from "react-router-dom";
import {programs, userInfo} from "../utils/mock";
import {UploadOutlined} from "@ant-design/icons";

const Request = () => {
    const {id} = useParams();
    const program = programs.find((p) => p.id === Number(id));
    const needAssessment = program.assessment && !userInfo.assessments.includes(program.assessment);
    const [form] = Form.useForm();

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

    // TODO: представителя вуза брать из бд
    return (
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
                                    <div style={{width: '40px'}}>
                                        <img style={{width: '100%'}} src="/university_representative.jpg"
                                             alt="university representative"/>
                                    </div>
                                    <Flex vertical>
                                        <Typography.Text style={{fontSize: 20, fontWeight: 500}}>Представитель
                                            ВУЗа</Typography.Text>
                                        <Typography.Text style={{fontSize: 18}}>Яковенко Мария
                                            Сергеевна</Typography.Text>
                                        <Typography.Link underline href="mailto:university_representative@gmail.com">
                                            university_representative@gmail.com
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
                            <Typography.Text>Проверьте ваши данные и заполните заявление на участие в академической
                                мобильности</Typography.Text>
                            <Form
                                layout="vertical"
                                form={form}
                                name="info"
                                initialValues={userInfo}
                                style={{marginTop: 30}}
                            >
                                <Form.Item
                                    name="fio"
                                    label="ФИО"
                                >
                                    <Input/>
                                </Form.Item>

                                <Form.Item
                                    name="phone"
                                    label="Контактный номер телефона"
                                >
                                    <Input/>
                                </Form.Item>

                                <Form.Item>
                                    <Flex gap={16}>
                                        <Upload {...props}>
                                            <Button icon={<UploadOutlined/>}>Прикрепить заявление</Button>
                                        </Upload>
                                        <Form.Item label={null}>
                                            <Button type="primary" htmlType="submit">
                                                Сохранить
                                            </Button>
                                        </Form.Item>
                                    </Flex>
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            }
        </Flex>
    );
};

export default Request;