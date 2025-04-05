import {Button, Card, Col, Descriptions, Divider, Flex, Row, Select, Space} from "antd";
import {useState} from "react";
import {StarOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";

const programs = [
    {
        id: 1,
        title: "Фуллстек разработка",
        description: "В рамках профиля ведётся подготовка специалистов, которые умеют производить разработку программного обеспечения с использованием различных языков программирования: С++, Python, Javascript, Go, C# и др., а также с применением разнообразных паттернов и фреймворков. Выпускники способны работать с ключевыми технологиями программной разработки, а потому они наиболее востребованы на IT-рынке.",
        university: "РТУ МИРЭА", //многие ко многим должна быть связка и название будет из таблицы самого вуза брать
        level: "Бакалавриат",
        form: "Очная"
    },
    {
        id: 2,
        title: "Искусственный интеллект",
        description:
            "Программа нацелена на подготовку специалистов в области машинного обучения, анализа данных и нейронных сетей. Выпускники могут работать в сферах автоматизации, предсказательной аналитики и AI-исследований.",
        university: "МГУ",
        level: "Магистратура",
        form: "Очная"
    },
    {
        id: 3,
        title: "Кибербезопасность",
        description:
            "Студенты изучают методы защиты информации, криптографию, анализ уязвимостей и методы предотвращения кибератак. Подготовка специалистов ведётся в тесном взаимодействии с ведущими IT-компаниями.",
        university: "РТУ МИРЭА",
        level: "Бакалавриат",
        form: "Очно-заочная"
    },
    {
        id: 4,
        title: "Разработка мобильных приложений",
        description:
            "Обучение направлено на разработку мобильных приложений под iOS и Android с использованием современных технологий, таких как Swift, Kotlin и Flutter.",
        university: "СПбГУ",
        level: "Бакалавриат",
        form: "Очная"
    },
    {
        id: 5,
        title: "Бизнес-информатика",
        description:
            "Программа сочетает IT и бизнес-аналитику, позволяя выпускникам заниматься разработкой и внедрением информационных систем в бизнес-процессы компаний.",
        university: "МГУ",
        level: "Магистратура",
        form: "Заочная"
    }
]

const universities = [
    "РТУ МИРЭА", "МГУ", "СПбГУ" //тоже с бэка из таблицы уников
]

const EducationPrograms = () => {
    const [selectedUniversity, setSelectedUniversity] = useState(null);
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [selectedForm, setSelectedForm] = useState(null);

    // Фильтрация программ по выбранным критериям
    const filteredPrograms = programs.filter(program =>
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
            <Button type={"primary"} icon={<StarOutlined/>} style={{width: "fit-content"}}>
                <Link to={"/recommendations"}>Подобрать при помощи Искусственного Интеллекта</Link>
            </Button>
            {Object.entries(groupedByUniversity).map(([university, programs], i) => (
                <Row gutter={16} key={i}>
                    <Divider orientation="left">{university}</Divider>
                    {programs.map((program) => (
                        <Col span={12} key={program.id}>
                            <Card
                                title={program.title}
                            >
                                <Flex vertical gap={16}>
                                    <Descriptions column={1}>
                                        <Descriptions.Item
                                            label="Описание">{program.description.slice(0, 100)}...</Descriptions.Item>
                                        <Descriptions.Item label="Уровень обучения">{program.level}</Descriptions.Item>
                                        <Descriptions.Item label="Форма обучения">{program.form}</Descriptions.Item>
                                    </Descriptions>
                                    <Flex gap={16}>
                                        <Button type="primary">
                                            Подать заявку
                                        </Button>
                                        <Button>
                                            <Link to={`/programs/${program.id}`}>Узнать подробнее</Link>
                                        </Button>
                                    </Flex>
                                </Flex>
                            </Card>
                        </Col>
                    ))}
                </Row>
            ))}
        </Flex>
    );
};


export default EducationPrograms;