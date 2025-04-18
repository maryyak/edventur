import {
    Alert,
    Button,
    Card,
    Col,
    Descriptions,
    Divider,
    Flex,
    Row,
    Select,
    Space,
    Spin,
    Typography,
    Upload
} from "antd";
import React, {useState} from "react";
import {StarFilled, UploadOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";

import usePrograms from "../hooks/api/programs/usePrograms";
import useUniversities from "../hooks/api/universities/useUniversities";
import {uploadProps} from "../utils/uploadProps";
import {useUserInfo} from "../context/UserInfoContext";

const EducationPrograms = () => {
    const [selectedUniversity, setSelectedUniversity] = useState(null);
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [selectedForm, setSelectedForm] = useState(null);
    const { userInfo } = useUserInfo();

    const {data: programs, loading, error, mutate} = usePrograms();
    const {universities} = useUniversities();

    const processedPrograms = programs.map(program => {
        const userProgram = program.UserPrograms.find(up => up.userId === userInfo?.id);

        return {
            ...program,
            similarity: userProgram ? userProgram.similarityPercentage : null
        };
    });

    const sortedPrograms = [...processedPrograms].sort((a, b) => {
        const aBelowThreshold = a.similarity < a.min_similarity;
        const bBelowThreshold = b.similarity < b.min_similarity;

        if (aBelowThreshold !== bBelowThreshold) {
            return aBelowThreshold ? 1 : -1;
        }
        return (b.similarity ?? 0) - (a.similarity ?? 0);
    });

    // Фильтрация программ по выбранным критериям
    const filteredPrograms = sortedPrograms.filter(program =>
        (!selectedUniversity || program.Universities[0].name === selectedUniversity) &&
        (!selectedLevel || program.level === selectedLevel) &&
        (!selectedForm || program.form === selectedForm)
    );

    // Группировка отфильтрованных программ по университетам
    const groupedByUniversity = filteredPrograms.reduce((acc, program) => {
        const uni = program?.Universities?.[0];
        const uniName = uni?.name;

        if (!uniName) return acc;

        if (!acc[uniName]) acc[uniName] = [];
        acc[uniName].push(program);

        return acc;
    }, {});


    const universityOptions = universities.map((uni) => ({
        label: uni,
        value: uni,
    }));

    return (
        <Flex vertical gap={16}>
            <Space wrap>
                <Select
                    placeholder="ВУЗ"
                    style={{width: 120}}
                    allowClear
                    options={universityOptions}
                    onChange={setSelectedUniversity}
                />
                <Select
                    placeholder="Уровень обучения"
                    style={{width: 200}}
                    allowClear
                    onChange={setSelectedLevel}
                    options={[
                        {value: "Бакалавриат", label: "Бакалавриат"},
                        {value: "Магистратура", label: "Магистратура"},
                    ]}
                />
                <Select
                    placeholder="Форма обучения"
                    style={{width: 200}}
                    allowClear
                    onChange={setSelectedForm}
                    options={[
                        {value: "Очная", label: "Очная"},
                        {value: "Очно-заочная", label: "Очно-заочная"},
                        {value: "Заочная", label: "Заочная"},
                    ]}
                />
            </Space>
            {userInfo?.id &&
                <Upload {...uploadProps('studyplan', mutate)}>
                    <Button type={"primary"} icon={<UploadOutlined/>}>Загрузите ваш учебный план</Button>
                </Upload>
            }
            <Spin spinning={loading}>
                {
                    error && <Alert message="Ошибка при загрузке образовательных программ" type="error"/>
                }
                {Object.entries(groupedByUniversity).map(([university, programs], i) => (
                    <Row gutter={16} key={i}>
                        <Divider orientation="left">{university}</Divider>
                        {programs.map((program) => {
                            const averageRating =
                                program.reviews && program.reviews.length > 0
                                    ? (
                                        program.reviews.reduce((sum, review) => sum + review.rating, 0) /
                                        program.reviews.length
                                    ).toFixed(1)
                                    : null;

                            return (
                                <Col span={12} key={program.id}>
                                    <Card
                                        title={
                                            <Flex justify="space-between" align="center">
                                                {program.title}
                                                <Flex align="center" gap={16}>
                                                    {program.similarity && (
                                                        <Typography.Text
                                                            type={program.similarity >= program.min_similarity ? "success" : "danger"}>
                                                            Схожесть: {(program.similarity * 100).toFixed()}%
                                                        </Typography.Text>
                                                    )}
                                                    {averageRating && (
                                                        <span style={{color: "#fadb14", fontSize: 16}}>
                                                    <StarFilled/> {averageRating}
                                                </span>
                                                    )}
                                                </Flex>
                                            </Flex>
                                        }
                                    >
                                        <Flex vertical gap={16}>
                                            <Descriptions column={1}>
                                                <Descriptions.Item
                                                    label="Описание">{program.description?.slice(0, 100)}...</Descriptions.Item>
                                                <Descriptions.Item
                                                    label="Уровень обучения">{program.level}</Descriptions.Item>
                                                <Descriptions.Item
                                                    label="Форма обучения">{program.form}</Descriptions.Item>
                                            </Descriptions>
                                            <Flex gap={16}>
                                                <Link to={`/request/${program.id}`}>
                                                    <Button type="primary">
                                                        Подать заявку
                                                    </Button>
                                                </Link>
                                                <Link to={`/programs/${program.id}`}>
                                                    <Button>
                                                        Узнать подробнее
                                                    </Button>
                                                </Link>
                                            </Flex>
                                        </Flex>
                                    </Card>
                                </Col>
                            )
                        })}
                    </Row>
                ))}
            </Spin>
        </Flex>
    );
};


export default EducationPrograms;