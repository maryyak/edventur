import React, {useEffect, useState} from "react";
import {
    Collapse,
    Form,
    Input,
    Button,
    Typography,
    message,
    Radio,
    Flex, Spin, Alert,
} from "antd";
import { useNavigate } from "react-router-dom";
import { useUserInfo } from "../context/UserInfoContext";
import useAssessments from "../hooks/api/assessments/useAssessments";

const { Panel } = Collapse;

const AssessmentEditor = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const { userInfo } = useUserInfo();
    const { assessments: assessmentsList , loading, error} = useAssessments();
    const [ AssessmentsData, setAssessmentsData] = useState([]);
    let groupedAssessments = {};

    useEffect(() => {
        setAssessmentsData(assessmentsList);
    }, [assessmentsList]);

    if (userInfo?.role === "representative") {
        const agentUniversityId = userInfo.universityId;
        const relatedAssessments = assessmentsList.filter(
            (assessment) => assessment.universityId === agentUniversityId
        );
        console.log('relatedAssessments', relatedAssessments);
        groupedAssessments[agentUniversityId] = relatedAssessments;
    } else if (userInfo?.role === "admin") {
        assessmentsList.forEach((assessment) => {
            const uniName = assessment.University?.name;
            if (uniName){
                if (!groupedAssessments[uniName]) {
                    groupedAssessments[uniName] = [];
                }
                groupedAssessments[uniName].push(assessment);
            }
        });
    }
    const updateAssessment = (id, updatedAssessment) => {
        const updatedList = assessmentsList.map((a) =>
            a.id === id ? { ...a, ...updatedAssessment } : a
        );
        setAssessmentsData(updatedList);
        message.success("Ассессмент обновлен");
    };

    return (
        <Flex vertical style={{ marginTop: 40 }}>
            <Spin spinning={loading}>
                {
                    error && <Alert message="Ошибка при загрузке образовательной программы" type="error"/>
                }
                <Flex style={{ justifyContent: "space-between", alignItems: "center" }}>
                    <Typography.Title level={4}>
                        Редактировать ассессменты{" "}
                        {userInfo?.role === "admin" ? "ВУЗов-партнеров" : ` ${userInfo?.uni}`}
                    </Typography.Title>

                    {userInfo?.role === "representative" && (
                        <Button
                            type="primary"
                            onClick={() => navigate("/createAssesment")}
                        >
                            Создать новый ассессмент
                        </Button>
                    )}
                </Flex>

                <Flex vertical>
                    {userInfo?.role === "representative" ? (
                        <Collapse accordion>
                            {(groupedAssessments[userInfo?.universityId] || []).map((assessment) => {
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
                                                <Input />
                                            </Form.Item>

                                            <Form.Item name="description" label="Описание">
                                                <Input.TextArea rows={2} />
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
                                                        <Input />
                                                    </Form.Item>

                                                    <Form.Item
                                                        name={`q_${idx}_correct`}
                                                        label="Выберите правильный вариант"
                                                        rules={[{ required: true, message: "Выберите правильный ответ" }]}
                                                    >
                                                        <Radio.Group
                                                            style={{ display: "flex", flexDirection: "column", gap: 10 }}
                                                        >
                                                            {q.options.map((opt, optIdx) => (
                                                                <Radio value={opt.id} key={opt.id}>
                                                                    <Form.Item
                                                                        name={`q_${idx}_opt_${optIdx}`}
                                                                        noStyle
                                                                        rules={[{ required: true, message: "Введите текст варианта" }]}
                                                                    >
                                                                        <Input placeholder={`Вариант ${opt.id}`} />
                                                                    </Form.Item>
                                                                </Radio>
                                                            ))}
                                                        </Radio.Group>
                                                    </Form.Item>
                                                </Flex>
                                            ))}

                                            <Form.Item>
                                                <Flex style={{ justifyContent: "space-between" }}>
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
                                                            <Input />
                                                        </Form.Item>

                                                        <Form.Item name="description" label="Описание">
                                                            <Input.TextArea rows={2} />
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
                                                                    <Input />
                                                                </Form.Item>

                                                                <Form.Item
                                                                    name={`q_${idx}_correct`}
                                                                    label="Выберите правильный вариант"
                                                                    rules={[{ required: true, message: "Выберите правильный ответ" }]}
                                                                >
                                                                    <Radio.Group
                                                                        style={{ display: "flex", flexDirection: "column", gap: 10 }}
                                                                    >
                                                                        {q.options.map((opt, optIdx) => (
                                                                            <Radio value={opt.id} key={opt.id}>
                                                                                <Form.Item
                                                                                    name={`q_${idx}_opt_${optIdx}`}
                                                                                    noStyle
                                                                                    rules={[{ required: true, message: "Введите текст варианта" }]}
                                                                                >
                                                                                    <Input placeholder={`Вариант ${opt.id}`} />
                                                                                </Form.Item>
                                                                            </Radio>
                                                                        ))}
                                                                    </Radio.Group>
                                                                </Form.Item>
                                                            </Flex>
                                                        ))}

                                                        <Form.Item>
                                                            <Flex style={{ justifyContent: "space-between" }}>
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
    );
};

export default AssessmentEditor;
