import React,{ useState }  from 'react';
import {Alert, Button, Card, Flex, Form, Input, message, Typography, Upload, Collapse, Select,} from "antd";
import {UploadOutlined, PlusOutlined} from "@ant-design/icons";
import {Link, useNavigate,} from "react-router-dom";
//тоже мок для подтягивания из бд, надо еще реализовать механизм для сохранения новых данных
import {assessments} from "../utils/mock";
import universityPrograms from "../hooks/api/universityPrograms/useUniversityPrograms";
import {getToken} from "../utils/token";
import useUser from "../hooks/api/users/useUser";
import {useUserInfo} from "../context/UserInfoContext";

const { Panel } = Collapse;
const Settings = () => {
    const [form] = Form.useForm();
    const { userInfo } = useUserInfo();
    const { user } = useUser(userInfo?.id, getToken());
    const navigate = useNavigate();
    const { programs: fetchedPrograms, loading, error } = universityPrograms(user?.universityId);

    const [localPrograms, setLocalPrograms] = useState([]);

    const allPrograms = [
        ...(Array.isArray(fetchedPrograms) ? fetchedPrograms : []),
        ...localPrograms
    ];

    const handleAddProgram = () => {
        setLocalPrograms((prev) => [
            ...prev,
            {
                title: '',
                description: '',
                university: user?.uni,
                level: '',
                form: '',
                seats: '',
                duration: '',
                additionally: '',
                min_similarity: '',
                assessment: '',
            },
        ]);
    };

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

    const settings = user?.role === 'student' ?
        <Flex gap={20} vertical style={{width:'100%'}}>
            <Typography.Title level={1}>Личный кабинет</Typography.Title>
            <Alert message="Информация"
                   description="Заполни информацию о себе, чтобы видеть подобранные специально для тебя программы"
                   type="info" showIcon closable/>
            <Card>
                <Form
                    layout="vertical"
                    form={form}
                    name="info"
                    initialValues={user}
                >
                    <Form.Item
                        name="fio"
                        label="ФИО"
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        name="university"
                        label="ВУЗ"
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        name="course"
                        label="Текущий курс обучения"
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        name="direction"
                        label="Направление подготовки"
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        label="Средний балл за последнюю сессию"
                    >
                        <Flex gap={16}>
                            <Form.Item name="score" noStyle>
                                <Input style={{maxWidth: 100}}/>
                            </Form.Item>
                            <Upload {...props}>
                                <Button icon={<UploadOutlined/>}>Загрузите выписку из зачетной книжки</Button>
                            </Upload>
                        </Flex>
                    </Form.Item>

                    <Form.Item
                        name="studyplan"
                        label="Учебный план"
                    >
                        <Upload {...props}>
                            <Button icon={<UploadOutlined/>}>Загрузите ваш учебный план</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item label={null}>
                        <Button type="primary" htmlType="submit">
                            Сохранить
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </Flex>
        :user?.role === 'representative'?
            <Flex gap={20} vertical style={{width:'100%'}}>
                <Typography.Title level={2}>Личный кабинет представителя ВУЗа</Typography.Title>
                <Card>
                    <Form
                        layout="vertical"
                        form={form}
                        name="info"
                        initialValues={user}
                    >
                        <Form.Item
                            name="fio"
                            label="ФИО"
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            name="university"
                            label="ВУЗ"
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label="Адрес электронной почты"
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item label={null}>
                            <Button type="primary" htmlType="submit">
                                Сохранить
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
                <Card>
                    <Flex style={{  justifyContent: 'space-between', alignItems: 'center', marginBottom: 20}}>
                        <Typography.Title level={3} style={{ margin: 0 }}>
                            Образовательные программы
                        </Typography.Title>
                        <Button
                            icon={<PlusOutlined />}
                            onClick={handleAddProgram}
                            type="dashed"
                        >
                            Добавить
                        </Button>
                    </Flex>

                    <Collapse accordion>
                        {allPrograms.map((program, index) => (
                            <Panel header={program.title || `Новая программа ${index + 1}`} key={index}>
                                <Form
                                    layout="vertical"
                                    initialValues={program}
                                >
                                    <Form.Item name="title" label="Название">
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="description" label="Описание">
                                        <Input.TextArea rows={4} />
                                    </Form.Item>
                                    <Form.Item name="level" label="Уровень">
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="form" label="Форма обучения">
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="duration" label="Срок обучения">
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="additionally" label="Дополнительно">
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="seats" label="Количество мест">
                                        <Input />
                                    </Form.Item>
                                    <Form.Item
                                        label="Учебный план"
                                    >
                                            <Upload {...props}>
                                                <Button icon={<UploadOutlined/>}>Загрузите учебный план программы</Button>
                                            </Upload>
                                    </Form.Item>
                                    <Flex gap={20} align="center">
                                        <Form.Item name="assessment" label="Ассесмент">
                                            <Select
                                                placeholder="Выберите ассесмент"
                                                style={{ width: 250 }}
                                                allowClear
                                                options={assessments.map((item) => ({
                                                    label: item.title,
                                                    value: item.id,
                                                }))}
                                            />
                                        </Form.Item>

                                        <Form.Item style={{ margin: 0 }}>
                                            <Button type="dashed" htmlType="submit" onClick={() => navigate("/createAssesment")}>
                                                Создать
                                            </Button>
                                        </Form.Item>
                                    </Flex>


                                    <Form.Item>
                                        <Flex style={{justifyContent:'space-between'}}>
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
                        ))}
                    </Collapse>
                </Card>

            </Flex>
        : (!user || !user.role) ?
            <Flex vertical align="center" justify="center" style={{width:'100%'}}>
                <Typography.Title level={2}>Для просмотра личного кабинета необходимо авторизоваться</Typography.Title>
                <Button style={{backgroundColor: " #318d25", color: "#fff"}}>
                    <Link to="/login">Вход</Link>
                </Button>
            </Flex>
            : <></>

    return (
        <Flex gap={50}>
            {settings}
            <img src="/settings-img.png" alt="student" style={{'height': 'fit-content', maxWidth: "340px"}} />
        </Flex>
    )
};

export default Settings;