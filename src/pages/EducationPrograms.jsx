import {Button, Card, Col, Descriptions, Divider, Flex, message, Row, Select, Space, Typography, Upload} from "antd";
import React, {useState} from "react";
import {StarFilled, UploadOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";

//c бэка приходит список программ с процентом схожести с учебным планом студента
import {programs, universities} from "../utils/mock";

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

const EducationPrograms = () => {
    const [selectedUniversity, setSelectedUniversity] = useState(null);
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [selectedForm, setSelectedForm] = useState(null);

    const sortedPrograms = [...programs].sort((a, b) => {
        const aBelowThreshold = a.similarity < a.min_similarity;
        const bBelowThreshold = b.similarity < b.min_similarity;

        if (aBelowThreshold !== bBelowThreshold) {
            return aBelowThreshold ? 1 : -1;
        }
        return b.similarity - a.similarity;
    });

    // Фильтрация программ по выбранным критериям
    const filteredPrograms = sortedPrograms.filter(program =>
        (!selectedUniversity || program.university === selectedUniversity) &&
        (!selectedLevel || program.level === selectedLevel) &&
        (!selectedForm || program.form === selectedForm)
    );

    // Группировка отфильтрованных программ по университетам
    const groupedByUniversity = filteredPrograms.reduce((acc, program) => {
        if (!acc[program.university]) acc[program.university] = [];
        acc[program.university].push(program);
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
            <Upload {...props}>
                <Button type={"primary"} icon={<UploadOutlined/>}>Загрузите ваш учебный план</Button>
            </Upload>
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
                                                <Typography.Text
                                                    type={program.similarity >= program.min_similarity ? "success" : "danger"}>
                                                    Схожесть: {program.similarity * 100}%
                                                </Typography.Text>
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
                                                label="Описание">{program.description.slice(0, 100)}...</Descriptions.Item>
                                            <Descriptions.Item
                                                label="Уровень обучения">{program.level}</Descriptions.Item>
                                            <Descriptions.Item label="Форма обучения">{program.form}</Descriptions.Item>
                                        </Descriptions>
                                        <Flex gap={16}>
                                            <Button type="primary">
                                                <Link to={`/request/${program.id}`}>
                                                    Подать заявку
                                                </Link>
                                            </Button>
                                            <Button>
                                                <Link to={`/programs/${program.id}`}>Узнать подробнее</Link>
                                            </Button>
                                        </Flex>
                                    </Flex>
                                </Card>
                            </Col>
                        )
                    })}
                </Row>
            ))}
        </Flex>
    );
};


export default EducationPrograms;