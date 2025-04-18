import React from "react";
import {
    Collapse,
    Form,
    Input,
    Button,
    Typography,
    message,
    Radio,
    Flex, Spin, Alert, Popconfirm,
} from "antd";
import {useNavigate} from "react-router-dom";
import useAssessments from "../hooks/api/assessments/useAssessments";
import ContactsMailLinkWrapper from "../components/ContactsMailLinkWrapper";
import useAuth from "../hooks/api/users/authUser";

const API_URL = process.env.REACT_APP_API_URL;

const {Panel} = Collapse;

const AssessmentEditor = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const {user} = useAuth()
    const userUniversity = user?.University
    const isAdmin = user?.role === "admin"
    const {data: assessments, loading, error, mutate} = useAssessments();
    let groupedAssessments = {};

    if (user?.role === "representative") {
        const agentUniversityId = user.universityId;
        groupedAssessments[agentUniversityId] = assessments?.filter(
            (assessment) => assessment.universityId === agentUniversityId
        );
    } else if (isAdmin) {
        assessments?.forEach((assessment) => {
            const uniName = assessment.University?.name;
            if (uniName) {
                if (!groupedAssessments[uniName]) {
                    groupedAssessments[uniName] = [];
                }
                groupedAssessments[uniName].push(assessment);
            }
        });
    }

    const [messageApi, contextHolder] = message.useMessage();

    const updateAssessment = async (id, updatedAssessment) => {
        try {
            const res = await fetch(`${API_URL}/assessments/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedAssessment),
            });

            if (!res.ok) throw new Error("Ошибка при обновлении");

            messageApi.success("Ассессмент обновлён");
        } catch (err) {
            console.error(err);
            messageApi.error("Ошибка при обновлении ассессмента");
        }
    };

    const handleDeleteAssessment = async (id) => {
        try {
            const res = await fetch(`${API_URL}/assessments/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Ошибка при удалении");

            messageApi.success("Ассессмент удалён");
            mutate();
        } catch (err) {
            console.error(err);
            messageApi.error("Ошибка при удалении ассессмента");
        }
    };


    if (!userUniversity && !isAdmin) return (
        <Flex vertical align="center">
            <Typography.Title level={2}>Вы не прикреплены ни к одному университету!</Typography.Title>
            <ContactsMailLinkWrapper><Button type="primary">Связаться с поддержкой</Button></ContactsMailLinkWrapper>
        </Flex>
    );

    return (
        <>
            {contextHolder}
            <Flex vertical style={{marginTop: 40}}>
                <Spin spinning={loading}>
                    {
                        error && <Alert message="Ошибка при загрузке ассесментов" type="error"/>
                    }
                    <Flex style={{justifyContent: "space-between", alignItems: "center"}}>
                        <Typography.Title level={4}>
                            Редактировать ассессменты{" "}
                            {isAdmin ? "ВУЗов-партнеров" : ` ${userUniversity?.name}`}
                        </Typography.Title>

                        {user?.role === "representative" && (
                            <Button
                                type="primary"
                                onClick={() => navigate("/create-assessment")}
                            >
                                Создать новый ассессмент
                            </Button>
                        )}
                    </Flex>

                    <Flex vertical>
                        {user?.role === "representative" ? (
                            <Collapse accordion>
                                {(groupedAssessments[user?.universityId] || []).map((assessment) => {
                                    const initialValues = {
                                        title: assessment.title,
                                        description: assessment.description,
                                    };

                                    assessment.questions.forEach((q, idx) => {
                                        initialValues[`q_${idx}_text`] = q.text;
                                        initialValues[`q_${idx}_correct`] = q.correctOptionId;
                                        q.options.forEach((opt, optIdx) => {
                                            initialValues[`q_${idx}_opt_${optIdx}`] = opt.text;
                                        });
                                    });

                                    return (
                                        <Panel header={assessment.title} key={assessment.id}>
                                            <Form
                                                layout="vertical"
                                                form={form}
                                                initialValues={initialValues}
                                                onFinish={(values) => {
                                                    const updatedQuestions = assessment.questions.map((q, idx) => ({
                                                        ...q,
                                                        text: values[`q_${idx}_text`],
                                                        options: q.options.map((opt, optIdx) => ({
                                                            ...opt,
                                                            text: values[`q_${idx}_opt_${optIdx}`],
                                                        })),
                                                        correctOptionId: values[`q_${idx}_correct`],
                                                    }));

                                                    const updatedAssessment = {
                                                        ...assessment,
                                                        title: values.title,
                                                        description: values.description,
                                                        questions: updatedQuestions,
                                                    };

                                                    updateAssessment(assessment.id, updatedAssessment);
                                                }}
                                            >
                                                <Form.Item name="title" label="Название">
                                                    <Input/>
                                                </Form.Item>

                                                <Form.Item name="description" label="Описание">
                                                    <Input.TextArea rows={2}/>
                                                </Form.Item>

                                                {assessment.questions.map((q, idx) => (
                                                    <Flex
                                                        vertical
                                                        key={q.id}
                                                        style={{
                                                            border: "1px solid #eee",
                                                            padding: 16,
                                                            marginBottom: 20,
                                                        }}
                                                    >
                                                        <Typography.Text strong>
                                                            {`Вопрос ${idx + 1}`}
                                                        </Typography.Text>

                                                        <Form.Item name={`q_${idx}_text`} label="Формулировка вопроса">
                                                            <Input/>
                                                        </Form.Item>

                                                        <Form.Item
                                                            name={`q_${idx}_correct`}
                                                            label="Выберите правильный вариант"
                                                            rules={[{
                                                                required: true,
                                                                message: "Выберите правильный ответ"
                                                            }]}
                                                        >
                                                            <Radio.Group
                                                                style={{
                                                                    display: "flex",
                                                                    flexDirection: "column",
                                                                    gap: 10
                                                                }}
                                                            >
                                                                {q.options.map((opt, optIdx) => (
                                                                    <Radio value={opt.id} key={opt.id}>
                                                                        <Form.Item
                                                                            name={`q_${idx}_opt_${optIdx}`}
                                                                            noStyle
                                                                            rules={[{
                                                                                required: true,
                                                                                message: "Введите текст варианта"
                                                                            }]}
                                                                        >
                                                                            <Input placeholder={`Вариант ${opt.id}`}/>
                                                                        </Form.Item>
                                                                    </Radio>
                                                                ))}
                                                            </Radio.Group>
                                                        </Form.Item>
                                                    </Flex>
                                                ))}

                                                <Form.Item>
                                                    <Flex style={{justifyContent: "space-between"}}>
                                                        <Button type="primary" htmlType="submit">
                                                            Сохранить
                                                        </Button>
                                                        <Popconfirm
                                                            title="Удалить ассессмент?"
                                                            description="Вы уверены, что хотите удалить этот ассессмент?"
                                                            onConfirm={() => handleDeleteAssessment(assessment.id)}
                                                            okText="Да"
                                                            cancelText="Нет"
                                                        >
                                                            <Button danger>Удалить</Button>
                                                        </Popconfirm>
                                                    </Flex>
                                                </Form.Item>
                                            </Form>
                                        </Panel>
                                    );
                                })}
                            </Collapse>
                        ) : (
                            <Collapse accordion>
                                {Object.entries(groupedAssessments).map(([universityName, assessments]) => (
                                    <Panel header={universityName} key={universityName}>
                                        <Collapse accordion>
                                            {assessments.map((assessment) => {
                                                const initialValues = {
                                                    title: assessment.title,
                                                    description: assessment.description,
                                                };

                                                assessment.questions.forEach((q, idx) => {
                                                    initialValues[`q_${idx}_text`] = q.text;
                                                    initialValues[`q_${idx}_correct`] = q.correctOptionId;
                                                    q.options.forEach((opt, optIdx) => {
                                                        initialValues[`q_${idx}_opt_${optIdx}`] = opt.text;
                                                    });
                                                });

                                                return (
                                                    <Panel header={assessment.title} key={assessment.id}>
                                                        <Form
                                                            layout="vertical"
                                                            form={form}
                                                            initialValues={initialValues}
                                                            onFinish={(values) => {
                                                                const updatedQuestions = assessment.questions.map((q, idx) => ({
                                                                    ...q,
                                                                    text: values[`q_${idx}_text`],
                                                                    options: q.options.map((opt, optIdx) => ({
                                                                        ...opt,
                                                                        text: values[`q_${idx}_opt_${optIdx}`],
                                                                    })),
                                                                    correctOptionId: values[`q_${idx}_correct`],
                                                                }));

                                                                const updatedAssessment = {
                                                                    ...assessment,
                                                                    title: values.title,
                                                                    description: values.description,
                                                                    questions: updatedQuestions,
                                                                };

                                                                updateAssessment(assessment.id, updatedAssessment);
                                                            }}
                                                        >
                                                            <Form.Item name="title" label="Название">
                                                                <Input/>
                                                            </Form.Item>

                                                            <Form.Item name="description" label="Описание">
                                                                <Input.TextArea rows={2}/>
                                                            </Form.Item>

                                                            {assessment.questions.map((q, idx) => (
                                                                <Flex
                                                                    vertical
                                                                    key={q.id}
                                                                    style={{
                                                                        border: "1px solid #eee",
                                                                        padding: 16,
                                                                        marginBottom: 20,
                                                                    }}
                                                                >
                                                                    <Typography.Text strong>
                                                                        {`Вопрос ${idx + 1}`}
                                                                    </Typography.Text>

                                                                    <Form.Item name={`q_${idx}_text`}
                                                                               label="Формулировка вопроса">
                                                                        <Input/>
                                                                    </Form.Item>

                                                                    <Form.Item
                                                                        name={`q_${idx}_correct`}
                                                                        label="Выберите правильный вариант"
                                                                        rules={[{
                                                                            required: true,
                                                                            message: "Выберите правильный ответ"
                                                                        }]}
                                                                    >
                                                                        <Radio.Group
                                                                            style={{
                                                                                display: "flex",
                                                                                flexDirection: "column",
                                                                                gap: 10
                                                                            }}
                                                                        >
                                                                            {q.options.map((opt, optIdx) => (
                                                                                <Radio value={opt.id} key={opt.id}>
                                                                                    <Form.Item
                                                                                        name={`q_${idx}_opt_${optIdx}`}
                                                                                        noStyle
                                                                                        rules={[{
                                                                                            required: true,
                                                                                            message: "Введите текст варианта"
                                                                                        }]}
                                                                                    >
                                                                                        <Input
                                                                                            placeholder={`Вариант ${opt.id}`}/>
                                                                                    </Form.Item>
                                                                                </Radio>
                                                                            ))}
                                                                        </Radio.Group>
                                                                    </Form.Item>
                                                                </Flex>
                                                            ))}

                                                            <Form.Item>
                                                                <Flex style={{justifyContent: "space-between"}}>
                                                                    <Button type="primary" htmlType="submit">
                                                                        Сохранить
                                                                    </Button>
                                                                    <Button danger>
                                                                        Удалить
                                                                    </Button>
                                                                </Flex>
                                                            </Form.Item>
                                                        </Form>
                                                    </Panel>
                                                );
                                            })}
                                        </Collapse>
                                    </Panel>
                                ))}
                            </Collapse>
                        )}
                    </Flex>
                </Spin>
            </Flex>
        </>
    );
};

export default AssessmentEditor;
