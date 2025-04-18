import {
    Button,
    Card,
    Col,
    Descriptions,
    Divider,
    Row,
    Select,
    Space,
    Statistic,
    Tooltip,
    Typography,
    Tag,
    List,
    Flex,
} from "antd";
import React, {useEffect, useState} from "react";
import {
    StarFilled,
    FileAddFilled,
    EyeFilled,
} from "@ant-design/icons";
import {Link} from "react-router-dom";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
} from "recharts";
import {useUserInfo} from "../context/UserInfoContext";
import usePrograms from "../hooks/api/programs/usePrograms";
import useApplications from "../hooks/api/applications/useApplications";
import useUniversities from "../hooks/api/universities/useUniversities";
import ContactsMailLinkWrapper from "../components/ContactsMailLinkWrapper";
const {Text} = Typography;

const API_URL = process.env.REACT_APP_API_URL;

const ProgramsStatistic = () => {
    const {userInfo} = useUserInfo()
    const isAdmin = userInfo?.role === "admin";
    const userUniversity = userInfo?.universityId;
    const {data: programs} = usePrograms();
    const {applications} = useApplications();
    const {universities} = useUniversities();

    const [selectedUniversity, setSelectedUniversity] = useState(null);
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [selectedForm, setSelectedForm] = useState(null);
    const [showReviews, setShowReviews] = useState({});

    const getTotalClicks = () =>
        programs.reduce((total, program) => {
            const clicks = program.UserPrograms?.reduce((sum, up) => {
                return sum + (up.clicks || 0);
            }, 0) || 0;
            return total + clicks;
        }, 0);


    const getProgramApplicationsData = (programId) => {
        const program = programs.find((p) => p.id === programId);
        if (!program) return [];
        const programApplications = applications.filter(
            (app) => app.programId === programId
        );
        return [
            {name: "Клики", value: program.UserPrograms?.reduce((sum, up) => sum + (up.clicks || 0), 0) || 0},
            {name: "Заявки", value: programApplications.length},
        ];
    };

    const [representatives, setRepresentatives] = useState({});

    useEffect(() => {
        const fetchRepresentatives = async () => {
            const reps = {};

            for (const uni of universities) {
                try {
                    const response = await fetch(`${API_URL}/universities/${uni.id}/representative`);
                    if (response.ok) {
                        const data = await response.json();
                        reps[uni.id] = data;
                    } else {
                        reps[uni.id] = null;
                    }
                } catch (error) {
                    reps[uni.id] = null;
                }
            }

            setRepresentatives(reps);
        };

        if (universities.length) {
            fetchRepresentatives();
        }
    }, [universities]);


    const toggleReviews = (id) => {
        setShowReviews((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const sortedPrograms = [...programs].sort((a, b) => {
        const aBelow = a.similarity < a.min_similarity;
        const bBelow = b.similarity < b.min_similarity;
        if (aBelow !== bBelow) return aBelow ? 1 : -1;
        return b.similarity - a.similarity;
    });

    const filteredPrograms = sortedPrograms.filter(
        (program) =>
            (isAdmin || program?.Universities[0]?.id === userUniversity) &&
            (!selectedUniversity || program?.Universities[0]?.name === selectedUniversity) &&
            (!selectedLevel || program?.level === selectedLevel) &&
            (!selectedForm || program?.form === selectedForm)
    );

    const groupedByUniversity = filteredPrograms.reduce((acc, program) => {
        if (!acc[program.Universities[0]?.name]) acc[program.Universities[0]?.name] = [];
        acc[program.Universities[0]?.name].push(program);
        return acc;
    }, {});
    const COLORS = ["#8884d8", "#82ca9d"];

    const programMap = filteredPrograms.reduce((acc, p, i) => {
        acc[i + 1] = p.title;
        return acc;
    }, {});

    const chartData = filteredPrograms.map((p, i) => ({
        name: `${i + 1}`,
        Заявки: applications.filter((app) => app.programId === p.id).length,
        Клики: p.UserPrograms?.reduce((sum, up) => sum + (up.clicks || 0), 0) || 0,
    }));


    const renderPrograms = (programs) =>
        programs.map((program) => {
            const clicks = program.UserPrograms?.reduce((sum, up) => sum + (up.clicks || 0), 0) || 0;
            const appCount = applications.filter(
                (app) => app.programId === program.id
            ).length;
            const effectiveness =
                clicks > 0 ? ((appCount / clicks) * 100).toFixed(1) : "—";
            const averageRating =
                program.reviews?.length > 0
                    ? (
                        program.reviews.reduce((sum, r) => sum + r.rating, 0) /
                        program.reviews.length
                    ).toFixed(1)
                    : null;

            return (
                <Card
                    key={program.id}
                    style={{marginBottom: 24}}
                    title={
                        <Space>
                            <Text strong>{program.title}</Text>
                            <Tooltip title="Эффективность: заявок на 100 кликов">
                                <Tag color="blue">{effectiveness}%</Tag>
                            </Tooltip>
                            {averageRating && (
                                <Tag icon={<StarFilled/>} color="gold">
                                    {averageRating}
                                </Tag>
                            )}
                        </Space>
                    }
                    extra={
                        <Link to={`/programs/${program.id}`}>
                            <Button type="link">Смотреть программу</Button>
                        </Link>
                    }
                >
                    <Row gutter={16}>
                        <Col span={16}>
                            <Descriptions column={1} size="small" bordered>
                                <Descriptions.Item label="Описание">
                                    {program?.description?.slice(0, 100)}...
                                </Descriptions.Item>
                                <Descriptions.Item label="Уровень обучения">
                                    {program?.level}
                                </Descriptions.Item>
                                <Descriptions.Item label="Форма обучения">
                                    {program?.form}
                                </Descriptions.Item>
                                <Descriptions.Item label="Клики">
                                    {clicks}
                                </Descriptions.Item>
                                <Descriptions.Item label="Заявки">
                                    {appCount}
                                </Descriptions.Item>
                                {isAdmin && (
                                    <Descriptions.Item label="Представитель">
                                        {(() => {
                                            const agent = representatives[program.Universities[0]?.id];
                                            return agent ? (
                                                <Space direction="vertical" size={0}>
                                                    <Text>{agent.fio}</Text>
                                                    <Text type="secondary">{agent.email}</Text>
                                                </Space>
                                            ) : (
                                                <Tag color="default">Не назначен</Tag>
                                            );
                                        })()}
                                    </Descriptions.Item>
                                )}
                            </Descriptions>

                            <Button
                                type="link"
                                style={{marginTop: 12}}
                                onClick={() => toggleReviews(program.id)}
                            >
                                {showReviews[program.id]
                                    ? "Скрыть отзывы"
                                    : `Показать отзывы (${program.reviews?.length || 0})`}
                            </Button>

                            {showReviews[program.id] && (
                                <List
                                    style={{marginTop: 8}}
                                    size="small"
                                    bordered
                                    dataSource={program.reviews || []}
                                    locale={{emptyText: "Нет отзывов"}}
                                    renderItem={(item) => (
                                        <List.Item>
                                            <Space direction="vertical" size={0}>
                                                <Text strong>
                                                    {item.name}, Курс {item.year}
                                                </Text>
                                                <Text type="secondary">{item.date}</Text>
                                                <Text>Оценка: {item.rating} / 5</Text>
                                                <Text>{item.comment}</Text>
                                            </Space>
                                        </List.Item>
                                    )}
                                />
                            )}
                        </Col>

                        <Col span={8}>
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={getProgramApplicationsData(program.id)}
                                        dataKey="value"
                                        nameKey="name"
                                        outerRadius={80}
                                    >
                                        {getProgramApplicationsData(program.id).map(
                                            (entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={COLORS[index % COLORS.length]}
                                                />
                                            )
                                        )}
                                    </Pie>
                                    <Tooltip/>
                                    <Legend/>
                                </PieChart>
                            </ResponsiveContainer>
                        </Col>
                    </Row>
                </Card>
            );
        });

    if (!userUniversity && !isAdmin) return (
        <Flex vertical align="center">
            <Typography.Title level={2}>Вы не прикреплены ни к одному университету!</Typography.Title>
            <ContactsMailLinkWrapper><Button type="primary">Связаться с поддержкой</Button></ContactsMailLinkWrapper>
        </Flex>
    );

    return (
        <Flex vertical style={{padding: 32}}>
            <Row gutter={16}>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Всего заявок"
                            value={
                                isAdmin
                                    ? applications.length
                                    : applications.filter((app) => app.University.id === userUniversity).length // Для представителя — только по его вузу
                            }
                            prefix={<FileAddFilled/>}
                        />
                    </Card>
                </Col>

                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Всего кликов"
                            value={
                                isAdmin
                                    ? getTotalClicks()
                                    : programs
                                        .filter((program) => program.Universities[0]?.id === userUniversity)
                                        .reduce((acc, program) => acc + (
                                            program.UserPrograms?.reduce((sum, up) => sum + (up.clicks || 0), 0) || 0
                                        ), 0)
                            }
                            prefix={<EyeFilled/>}
                        />
                    </Card>
                </Col>

                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Программ"
                            value={isAdmin ? programs.length : programs.filter((program) => program.Universities[0]?.id === userUniversity).length}
                        />
                    </Card>
                </Col>

                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Университетов"
                            value={isAdmin ? universities.length : 1}
                        />
                    </Card>
                </Col>

            </Row>

            <Card title="Сводная аналитика по программам" style={{marginTop: 32}}>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}

                    >
                        <XAxis dataKey="name"/>
                        <YAxis/>
                        <Tooltip/>
                        <Legend/>
                        <Bar dataKey="Клики" fill="#8884d8"/>
                        <Bar dataKey="Заявки" fill="#82ca9d"/>
                    </BarChart>
                </ResponsiveContainer>
                <List
                    size="small"
                    header={<Text>Легенда</Text>}
                    bordered
                    dataSource={Object.entries(programMap).map(([key, title]) => `${key} — ${title}`)}
                    renderItem={(item) => <List.Item>{item}</List.Item>}
                    style={{marginTop: 16}}
                />

            </Card>

            <Card style={{marginTop: 24}} title="Фильтры">
                <Space wrap>
                    {isAdmin && (
                        <Select
                            placeholder="ВУЗ"
                            style={{width: 180}}
                            allowClear
                            options={universities.map((uni) => ({
                                label: uni.name,
                                value: uni.name,
                            }))}
                            onChange={setSelectedUniversity}
                        />
                    )}
                    <Select
                        placeholder="Уровень"
                        style={{width: 180}}
                        allowClear
                        onChange={setSelectedLevel}
                        options={[
                            {label: "Бакалавриат", value: "Бакалавриат"},
                            {label: "Магистратура", value: "Магистратура"},
                        ]}
                    />
                    <Select
                        placeholder="Форма обучения"
                        style={{width: 180}}
                        allowClear
                        onChange={setSelectedForm}
                        options={[
                            {label: "Очная", value: "Очная"},
                            {label: "Очно-заочная", value: "Очно-заочная"},
                            {label: "Заочная", value: "Заочная"},
                        ]}
                    />
                </Space>
            </Card>

            {isAdmin ? (
                Object.entries(groupedByUniversity).map(([university, programs]) => (
                    <Flex vertical key={university}>
                        <Divider orientation="left">{university}</Divider>
                        {renderPrograms(programs)}
                    </Flex>
                ))
            ) : (
                <Flex vertical style={{marginTop: 20}}>
                    {renderPrograms(filteredPrograms)}
                </Flex>
            )}
        </Flex>
    );
};

export default ProgramsStatistic;
