import {Button, Card, Col, Descriptions, Divider, Flex, Row, Select, Space, Typography} from "antd";

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
    const groupedByUniversity = programs.reduce((acc, item) => {
        if (!acc[item.university]) {
            acc[item.university] = [];
        }
        acc[item.university].push(item);
        return acc;
    }, {});

    return (
        <>
            <Space wrap>
                <Select
                    defaultValue="ВУЗ"
                    style={{ width: 120 }}
                    options={universities}
                />
                <Select
                    defaultValue="lucy"
                    style={{ width: 120 }}
                    disabled
                    options={[{ value: 'lucy', label: 'Lucy' }]}
                />
                <Select
                    defaultValue="lucy"
                    style={{ width: 120 }}
                    loading
                    options={[{ value: 'lucy', label: 'Lucy' }]}
                />
                <Select
                    defaultValue="lucy"
                    style={{ width: 120 }}
                    allowClear
                    options={[{ value: 'lucy', label: 'Lucy' }]}
                    placeholder="select it"
                />
            </Space>
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
                                        <Button type="primary">Подать заявку</Button>
                                        <Button>Узнать подробнее</Button>
                                    </Flex>
                                </Flex>
                            </Card>
                        </Col>
                    ))}
                </Row>
            ))}
        </>
    );
};


export default EducationPrograms;