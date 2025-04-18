import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Card,
    Radio,
    Button,
    Typography,
    Space,
    Flex,
    Spin,
} from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import style from './Assesment.module.scss';
import { Modal } from 'antd';
import useAssessments from "../../hooks/api/assessments/useAssessments";
import {getToken} from "../../utils/token";

const API_URL = process.env.REACT_APP_API_URL;

const Assessment = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: assessment, loading } = useAssessments(id);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [result, setResult] = useState(null);
    const [timeLeft, setTimeLeft] = useState(2 * 60 * 60);
    const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
    const timeoutRef = useRef(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        const savedEndTime = localStorage.getItem(`assessment_end_time_${id}`);
        const endTime = savedEndTime
            ? Number(savedEndTime)
            : Date.now() + 2 * 60 * 60 * 1000;
        if (!savedEndTime) {
            localStorage.setItem(`assessment_end_time_${id}`, endTime.toString());
        }

        const updateTimer = () => {
            const now = Date.now();
            const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
            setTimeLeft(remaining);
            if (remaining === 0) {
                clearInterval(timer);
                handleSubmit();
            }
        };

        updateTimer();
        const timer = setInterval(updateTimer, 1000);

        // Load saved answers
        const savedAnswers = localStorage.getItem(`assessment_answers_${id}`);
        if (savedAnswers) {
            try {
                setAnswers(JSON.parse(savedAnswers));
            } catch (e) {
                console.error('Failed to parse saved answers', e);
            }
        }

        return () => {
            clearInterval(timer);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [id]);

    useEffect(() => {
        localStorage.setItem(`assessment_answers_${id}`, JSON.stringify(answers));
    }, [answers, id]);

    const sendAnswers = async () => {
        try {
            const response = await fetch(`${API_URL}/assessments/${id}/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`,
                },
                body: JSON.stringify({ answers }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Error submitting answers', error);
            return null;
        }
    };

    const formatTime = (seconds) => {
        const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const s = String(seconds % 60).padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    const handleAnswerChange = (questionId, optionId) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: optionId,
        }));
    };

    const handleSubmit = async () => {
        setSubmitted(true);
        const resultData = await sendAnswers();
        setResult(resultData);

        localStorage.removeItem(`assessment_end_time_${id}`);
        localStorage.removeItem(`assessment_answers_${id}`);

        timeoutRef.current = setTimeout(() => {
            navigate('/');
        }, 10000);
    };

    const handleNextQuestion = () => {
        if (selectedQuestionIndex < (assessment?.questions?.length || 0) - 1) {
            setSelectedQuestionIndex(selectedQuestionIndex + 1);
        }
    };

    return (
        <Spin spinning={loading}>
            <Flex vertical style={{ minHeight: '100vh' }}>
                <Modal
                    title="Вы уверены, что хотите завершить ассесмент?"
                    open={isModalVisible}
                    onOk={() => {
                        setIsModalVisible(false);
                        handleSubmit();
                    }}
                    onCancel={() => setIsModalVisible(false)}
                    okText="Да, завершить"
                    cancelText="Отмена"
                    okButtonProps={{ danger: true }}
                >
                    <Typography.Text>
                        После завершения вы не сможете вернуться к вопросам.
                    </Typography.Text>
                </Modal>

                {!submitted && (
                    <Flex justify="space-between" align="center" className={style.header}>
                        <Typography.Title level={2} style={{ margin: 0 }}>
                            {assessment?.title}
                        </Typography.Title>
                        <Flex align="center" gap={10}>
                            <ClockCircleOutlined />
                            <Typography.Text strong style={{ fontSize: 18 }}>
                                Время: {formatTime(timeLeft)}
                            </Typography.Text>
                        </Flex>
                    </Flex>
                )}

                {!submitted && (
                    <Flex wrap="wrap" gap={8} className={style.header}>
                        {assessment?.questions?.map((q, index) => (
                            <Button
                                key={q.id}
                                size="small"
                                type={selectedQuestionIndex === index ? 'primary' : 'default'}
                                onClick={() => setSelectedQuestionIndex(index)}
                                style={{ fontSize: 12 }}
                            >
                                Вопрос {q.id}
                            </Button>
                        ))}
                        <Button
                            size="small"
                            type="default"
                            danger
                            onClick={() => setIsModalVisible(true)}
                            style={{ fontSize: 12 }}
                        >
                            Завершить
                        </Button>
                    </Flex>
                )}

                <Flex vertical gap={24} style={{ paddingTop: '20px' }}>
                    {!submitted ? (
                        <Card
                            key={assessment?.questions[selectedQuestionIndex]?.id}
                            title={`Вопрос ${assessment?.questions[selectedQuestionIndex]?.id}`}
                            style={{ borderRadius: 16 }}
                            headStyle={{ borderBottom: '3px solid #08a652' }}
                        >
                            <Typography.Title level={5}>
                                {assessment?.questions[selectedQuestionIndex]?.text}
                            </Typography.Title>

                            <Radio.Group
                                value={answers[assessment?.questions[selectedQuestionIndex]?.id]}
                                onChange={(e) =>
                                    handleAnswerChange(
                                        assessment.questions[selectedQuestionIndex].id,
                                        e.target.value
                                    )
                                }
                                style={{ display: 'block', marginTop: 16 }}
                            >
                                <Space direction="vertical">
                                    {assessment?.questions[selectedQuestionIndex]?.options.map((opt) => (
                                        <Radio key={opt.id} value={opt.id}>
                                            {opt.text}
                                        </Radio>
                                    ))}
                                </Space>
                            </Radio.Group>

                            <Flex justify="end" style={{ marginTop: 24 }}>
                                {selectedQuestionIndex < (assessment?.questions?.length || 0) - 1 ? (
                                    <Button type="primary" onClick={handleNextQuestion}>
                                        Далее
                                    </Button>
                                ) : (
                                    <Button type="primary" onClick={() => setIsModalVisible(true)}>
                                        Завершить
                                    </Button>
                                )}
                            </Flex>
                        </Card>
                    ) : (
                        <Card style={{ borderRadius: 16, textAlign: 'center' }}>
                            <Typography.Title level={3}>Результаты</Typography.Title>
                            {result ? (
                                <div style={{ marginBottom: '20px' }}>
                                    <Typography.Paragraph>
                                        Всего вопросов: <strong>{result.totalQuestions}</strong>
                                    </Typography.Paragraph>
                                    <Typography.Paragraph>
                                        Правильных ответов: <strong>{result.correctAnswers}</strong>
                                    </Typography.Paragraph>
                                    <Typography.Paragraph>
                                        Балл: <strong>{result.score}%</strong>
                                    </Typography.Paragraph>
                                </div>
                            ) : (
                                <Typography.Paragraph>
                                    Произошла ошибка при получении результатов.
                                </Typography.Paragraph>
                            )}
                            <Typography.Text>
                                Вы будете перенаправлены на главную через 10 секунд.
                            </Typography.Text>
                        </Card>
                    )}
                </Flex>
            </Flex>
        </Spin>
    );
};

export default Assessment;
