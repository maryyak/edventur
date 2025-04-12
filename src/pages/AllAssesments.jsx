import React, { useState } from "react";
import {
    Collapse,
    Form,
    Input,
    Button,
    Typography,
    message,
    Radio,
    Flex,
} from "antd";
import { assessments, programs, userInfo } from "../utils/mock";
import { useNavigate } from "react-router-dom";

const { Panel } = Collapse;

const AssessmentEditor = () => {
    const navigate = useNavigate();
    const [assessmentsList, setAssessmentsList] = useState(assessments);
    const [form] = Form.useForm();

    const currentUser = userInfo.find((u) => u.id === 2);

    let groupedAssessments = {};

    if (currentUser.role === "agent") {
        const agentUniversity = currentUser.uni;
        const relatedAssessments = programs
            .filter((p) => p.university === agentUniversity && p.assessment)
            .map((p) => assessmentsList.find((a) => a.id === p.assessment))
            .filter(Boolean);

        groupedAssessments[agentUniversity] = relatedAssessments;
    } else if (currentUser.role === "admin") {
        programs.forEach((p) => {
            if (p.assessment) {
                const assessment = assessmentsList.find((a) => a.id === p.assessment);
                if (assessment) {
                    if (!groupedAssessments[p.university]) groupedAssessments[p.university] = [];
                    groupedAssessments[p.university].push(assessment);
                }
            }
        });
    }

    const updateAssessment = (id, updatedAssessment) => {
        const updatedList = assessmentsList.map((a) =>
            a.id === id ? { ...a, ...updatedAssessment } : a
        );
        setAssessmentsList(updatedList);
        message.success("Ассессмент обновлен");
    };

    return (
        <Flex vertical style={{ marginTop: 40 }}>
            <Flex style={{justifyContent:"space-between", alignItems:"center"}}>
                <Typography.Title level={4} style={{ alignSelf: "center" }}>
                    Редактировать ассессменты
                    {currentUser.role === "admin" ? " ВУЗов-партнеров" : ` ${currentUser.uni}`}
                </Typography.Title>

                {currentUser.role === "agent" ? (
                    <Button
                        type="primary"
                        htmlType="submit"
                        onClick={() => navigate("/createAssesment")}
                    >
                        Создать новый ассесмент
                    </Button>
                ) : null}

            </Flex>


            {currentUser.role === "agent" ? (
                <Flex vertical>
                    <Collapse accordion>
                        {groupedAssessments[currentUser.uni]?.map((assessment) => {
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
                                            <Flex vertical
                                                key={q.id}
                                                style={{
                                                    border: "1px solid #eee",
                                                    padding: 16,
                                                    marginBottom: 20,
                                                }}
                                            >
                                                <Typography.Text strong>{`Вопрос ${idx + 1}`}</Typography.Text>
                                                <Form.Item name={`q_${idx}_text`} label="Формулировка вопроса">
                                                    <Input />
                                                </Form.Item>

                                                <Form.Item
                                                    name={`q_${idx}_correct`}
                                                    label="Выберите правильный вариант"
                                                    rules={[{ required: true, message: "Выберите правильный ответ" }]}
                                                >
                                                    <Radio.Group style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                                        {q.options.map((opt, optIdx) => (
                                                            <Radio value={opt.id} key={opt.id} style={{ display: "flex", alignItems: "center" }}>
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
                                                <Button danger htmlType="submit">
                                                    Удалить
                                                </Button>
                                            </Flex>
                                        </Form.Item>
                                    </Form>
                                </Panel>
                            );
                        })}
                    </Collapse>
                </Flex>
            ) : (
                <Collapse accordion>
                    {Object.entries(groupedAssessments).map(([university, assessments]) => (
                        <Panel header={university} key={university}>
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
                                                    <Flex vertical
                                                        key={q.id}
                                                        style={{
                                                            border: "1px solid #eee",
                                                            padding: 16,
                                                            marginBottom: 20,
                                                        }}
                                                    >
                                                        <Typography.Text strong>{`Вопрос ${idx + 1}`}</Typography.Text>
                                                        <Form.Item name={`q_${idx}_text`} label="Формулировка вопроса">
                                                            <Input />
                                                        </Form.Item>

                                                        <Form.Item
                                                            name={`q_${idx}_correct`}
                                                            label="Выберите правильный вариант"
                                                            rules={[{ required: true, message: "Выберите правильный ответ" }]}
                                                        >
                                                            <Radio.Group style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                                                {q.options.map((opt, optIdx) => (
                                                                    <Radio value={opt.id} key={opt.id} style={{ display: "flex", alignItems: "center" }}>
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
                                                        <Button danger htmlType="submit">
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
    );
};

export default AssessmentEditor;
