import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { assessments } from '../../utils/mock';
import {
    Card,
    Radio,
    Button,
    Typography,
    Space,
    Flex,
} from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import style from './Assesment.module.scss';

const Assessment = () => {
    const { id } = useParams();
    const assessment = assessments.find((a) => a.id === Number(id));
    const navigate = useNavigate();
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(2 * 60 * 60);
    const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);

    useEffect(() => {
        const savedEndTime = localStorage.getItem(`assessment_end_time_${id}`);
        const endTime = savedEndTime ? Number(savedEndTime) : Date.now() + 2 * 60 * 60 * 1000;
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
        return () => clearInterval(timer);
    }, [id]);


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

    const handleSubmit = () => {
        setSubmitted(true);
        localStorage.removeItem(`assessment_end_time_${id}`);
        setTimeout(() => {
            navigate('/');
        }, 10000);
    };


    const handleNextQuestion = () => {
        if (selectedQuestionIndex < assessment.questions.length - 1) {
            setSelectedQuestionIndex(selectedQuestionIndex + 1);
        }
    };

    return (
        <Flex vertical style={{ minHeight: '100vh' }}>
            {!submitted && (
                <Flex
                    justify="space-between"
                    align="center"
                    className={style.header}
                >
                    <Typography.Title level={2} style={{ margin: 0 }}>
                        {assessment.title}
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
                <Flex
                    wrap="wrap"
                    gap={8}
                    className={style.header}
                >
                    {assessment.questions.map((q, index) => (
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
                        onClick={handleSubmit}
                        style={{ fontSize: 12 }}
                    >
                        Завершить
                    </Button>
                </Flex>
            )}

            <Flex vertical gap={24} style={{ paddingTop: '20px' }}>
                {!submitted ? (
                    <Card
                        key={assessment.questions[selectedQuestionIndex].id}
                        title={`Вопрос ${assessment.questions[selectedQuestionIndex].id}`}
                        style={{ borderRadius: 16 }}
                        headStyle={{
                            borderBottom: '3px solid #08a652',
                        }}
                    >
                        <Typography.Title level={5}>
                            {assessment.questions[selectedQuestionIndex].text}
                        </Typography.Title>

                        <Radio.Group
                            value={answers[assessment.questions[selectedQuestionIndex].id]}
                            onChange={(e) =>
                                handleAnswerChange(
                                    assessment.questions[selectedQuestionIndex].id,
                                    e.target.value
                                )
                            }
                            style={{ display: 'block', marginTop: 16 }}
                        >
                            <Space direction="vertical">
                                {assessment.questions[selectedQuestionIndex].options.map((opt) => (
                                    <Radio key={opt.id} value={opt.id}>
                                        {opt.text}
                                    </Radio>
                                ))}
                            </Space>
                        </Radio.Group>

                        <Flex justify="end" style={{ marginTop: 24 }}>
                            {selectedQuestionIndex < assessment.questions.length - 1 ? (
                                <Button type="primary" onClick={handleNextQuestion}>
                                    Далее
                                </Button>
                            ) : (
                                <Button type="primary" onClick={handleSubmit}>
                                    Завершить
                                </Button>
                            )}
                        </Flex>
                    </Card>
                ) : (
                    <Card style={{borderRadius: 16, textAlign: 'center'}}>
                        <Typography.Title level={3}>Тест отправлен</Typography.Title>
                        <Typography.Title level={5} style={{fontWeight: 'normal'}}>
                            Ожидайте результатов. Мы уведомим Вас, как только они будут готовы.
                        </Typography.Title>
                        <img src="/sberkot_student.png" alt="srudent" style={{height: '300px', alignSelf: 'center'}}/>
                    </Card>
                )}
            </Flex>
        </Flex>
    );
};

export default Assessment;
