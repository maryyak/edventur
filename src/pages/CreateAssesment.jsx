import React, { useState } from 'react';
import { Form, Input, Button, Card, Space, Typography, Divider, Flex, Checkbox } from 'antd';

const CreateAssessment = () => {
    const [questions, setQuestions] = useState([
        { text: '', options: ['', ''], correctOptions: [] }
    ]);
    const addQuestion = () => {
        setQuestions([...questions, { text: '', options: ['', ''], correctOptions: [] }]);
    };
    const updateQuestionText = (index, value) => {
        const updated = [...questions];
        updated[index].text = value;
        setQuestions(updated);
    };
    const updateOptionText = (qIndex, oIndex, value) => {
        const updated = [...questions];
        updated[qIndex].options[oIndex] = value;
        setQuestions(updated);
    };
    const updateCorrectOptions = (qIndex, oIndex) => {
        const updated = [...questions];
        const correctOptions = updated[qIndex].correctOptions;

        if (correctOptions.includes(oIndex)) {
            updated[qIndex].correctOptions = correctOptions.filter(index => index !== oIndex);
        } else {
            updated[qIndex].correctOptions.push(oIndex);
        }

        setQuestions(updated);
    };
    const addOption = (qIndex) => {
        const updated = [...questions];
        updated[qIndex].options.push('');
        setQuestions(updated);
    };



    return (
        <Flex vertical gap={32} style={{ width:'100%'}}>
            <Typography.Title level={2} style={{alignSelf:'center'}}>Конструктор ассесмента</Typography.Title>
            <Card>
                <Form layout="vertical" >
                    <Form.Item name="title" label="Название ассесмента" >
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Описание">
                        <Input.TextArea rows={3} />
                    </Form.Item>

                    <Divider>Вопросы</Divider>

                    {questions.map((q, qIndex) => (
                        <Card key={qIndex} style={{ marginBottom: 24 }} type="inner" title={`Вопрос ${qIndex + 1}`}>
                            <Form.Item label="Текст вопроса">
                                <Input
                                    value={q.text}
                                    onChange={(e) => updateQuestionText(qIndex, e.target.value)}
                                />
                            </Form.Item>
                            <Flex vertical>
                                <Typography.Text strong>Варианты ответа:</Typography.Text>
                                <Typography.Text>(Отметьте верный вариант галочкой)</Typography.Text>
                            </Flex>
                            <Space direction="vertical" style={{ display: 'flex', marginTop: 8 }}>
                                {q.options.map((opt, oIndex) => (
                                    <Flex key={oIndex} align="center" gap={10}>
                                        <Checkbox
                                            checked={q.correctOptions.includes(oIndex)}
                                            onChange={() => updateCorrectOptions(qIndex, oIndex)}
                                        />
                                        <Input
                                            value={opt}
                                            placeholder={`Вариант ${oIndex + 1}`}
                                            onChange={(e) => updateOptionText(qIndex, oIndex, e.target.value)}
                                            style={{ flex: 1 }}
                                        />
                                    </Flex>
                                ))}

                                <Button type="link" onClick={() => addOption(qIndex)}>
                                    + Добавить вариант
                                </Button>
                            </Space>

                        </Card>
                    ))}

                    <Button onClick={addQuestion} style={{ marginBottom: 20 }}>
                        + Добавить вопрос
                    </Button>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Сохранить ассесмент
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </Flex>
    );
};

export default CreateAssessment;
