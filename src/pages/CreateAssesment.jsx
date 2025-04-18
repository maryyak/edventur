import React, {useState} from 'react';
import {
    Form,
    Input,
    Button,
    Card,
    Space,
    Typography,
    Divider,
    Flex,
    Radio,
    message
} from 'antd';
import {useUserInfo} from "../context/UserInfoContext";

const LETTERS = 'abcdefghijklmnopqrstuvwxyz'.split('');

const API_URL = process.env.REACT_APP_API_URL;

const CreateAssessment = () => {
    const {userInfo} = useUserInfo();
    const universityId = userInfo?.universityId
    const [questions, setQuestions] = useState([
        {
            id: 1,
            text: '',
            options: [
                {id: 'a', text: ''},
                {id: 'b', text: ''},
                {id: 'c', text: ''}
            ],
            correctOptionId: null
        }
    ]);
    const [form] = Form.useForm();

    const addQuestion = () => {
        const newId = questions.length + 1;
        setQuestions([
            ...questions,
            {
                id: newId,
                text: '',
                options: [
                    {id: 'a', text: ''},
                    {id: 'b', text: ''},
                    {id: 'c', text: ''}
                ],
                correctOptionId: null
            }
        ]);
    };

    const updateQuestionText = (qIndex, value) => {
        const updated = [...questions];
        updated[qIndex].text = value;
        setQuestions(updated);
    };

    const updateOptionText = (qIndex, oIndex, value) => {
        const updated = [...questions];
        updated[qIndex].options[oIndex].text = value;
        setQuestions(updated);
    };

    const updateCorrectOption = (qIndex, optionId) => {
        const updated = [...questions];
        updated[qIndex].correctOptionId = optionId;
        setQuestions(updated);
    };

    const [messageApi, contextHolder] = message.useMessage();

    const addOption = (qIndex) => {
        const updated = [...questions];
        const currentOptions = updated[qIndex].options;
        const nextLetter = LETTERS[currentOptions.length];
        if (!nextLetter) {
            messageApi.warning('Нельзя добавить больше 26 вариантов');
            return;
        }
        currentOptions.push({id: nextLetter, text: ''});
        setQuestions(updated);
    };

    const handleSubmit = async (values) => {
        const payload = {
            title: values.title,
            description: values.description || '',
            questions: questions,
            universityId: universityId
        };

        try {
            const res = await fetch(`${API_URL}/assessments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error('Ошибка при создании ассессмента');

            messageApi.success('Ассессмент успешно создан!');
            form.resetFields();
            setQuestions([
                {
                    id: 1,
                    text: '',
                    options: [
                        {id: 'a', text: ''},
                        {id: 'b', text: ''},
                        {id: 'c', text: ''}
                    ],
                    correctOptionId: null
                }
            ]);
        } catch (err) {
            console.error(err);
            messageApi.error('Ошибка при создании ассессмента');
        }
    };

    return (
        <>
            {contextHolder}
            <Flex vertical gap={32} style={{width: '100%'}}>
                <Typography.Title level={2} style={{alignSelf: 'center'}}>
                    Конструктор ассессмента
                </Typography.Title>

                <Card>
                    <Form layout="vertical" form={form} onFinish={handleSubmit}>
                        <Form.Item
                            name="title"
                            label="Название ассессмента"
                            rules={[{required: true, message: 'Введите название'}]}
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item name="description" label="Описание">
                            <Input.TextArea rows={3}/>
                        </Form.Item>

                        <Divider>Вопросы</Divider>

                        {questions.map((q, qIndex) => (
                            <Card
                                key={q.id}
                                style={{marginBottom: 24}}
                                type="inner"
                                title={`Вопрос ${qIndex + 1}`}
                            >
                                <Form.Item label="Текст вопроса">
                                    <Input
                                        value={q.text}
                                        onChange={(e) => updateQuestionText(qIndex, e.target.value)}
                                    />
                                </Form.Item>

                                <Typography.Text strong>Варианты ответа:</Typography.Text>
                                <Radio.Group
                                    value={q.correctOptionId}
                                    onChange={(e) => updateCorrectOption(qIndex, e.target.value)}
                                    style={{width: '100%'}}
                                >
                                    <Space direction="vertical" style={{marginTop: 8, width: '100%'}}>
                                        {q.options.map((opt, oIndex) => (
                                            <Flex key={opt.id} align="center" gap={10}>
                                                <Radio value={opt.id}/>
                                                <Input
                                                    value={opt.text}
                                                    placeholder={`Вариант ${opt.id.toUpperCase()}`}
                                                    onChange={(e) =>
                                                        updateOptionText(qIndex, oIndex, e.target.value)
                                                    }
                                                    style={{flex: 1}}
                                                />
                                            </Flex>
                                        ))}
                                    </Space>
                                </Radio.Group>

                                <Button
                                    type="link"
                                    onClick={() => addOption(qIndex)}
                                    style={{marginTop: 8}}
                                >
                                    + Добавить вариант
                                </Button>
                            </Card>
                        ))}

                        <Button onClick={addQuestion} style={{marginBottom: 20}}>
                            + Добавить вопрос
                        </Button>

                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Сохранить ассессмент
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Flex>
        </>
    );
};

export default CreateAssessment;
