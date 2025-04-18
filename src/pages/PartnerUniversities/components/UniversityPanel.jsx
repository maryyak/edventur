import {
    Alert,
    Button,
    Card,
    Collapse,
    Flex,
    Form,
    Input,
    message,
    Select,
    Spin,
    Typography,
    Upload
} from "antd";
import {UploadOutlined} from "@ant-design/icons";
import useUniversityPrograms from "../../../hooks/api/universityPrograms/useUniversityPrograms";
import useAuth from "../../../hooks/api/users/authUser";
import {useEffect, useState} from "react";
import {uploadProps} from "../../../utils/uploadProps";
import useUniversityAssessments from "../../../hooks/api/universities/useUniversityAssesments";
import {getToken} from "../../../utils/token";

const API_URL = process.env.REACT_APP_API_URL;

const UniversityPanel = ({university, isAdmin}) => {
    const {programs, loading, error, mutate} = useUniversityPrograms(university.id)
    const {users, fetchUsers} = useAuth()

    const [representative, setRepresentative] = useState(null);
    const [representatives, setRepresentatives] = useState(null);

    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        setRepresentative(users?.find(u => (u.role === "representative" && u.universityId === university.id)));
        setRepresentatives(users?.filter(u => u.role === "representative"));
    }, [users]);

    const {assessments} = useUniversityAssessments(university.id)

    const [openNewProgramFields, setOpenNewProgramFields] = useState(false);

    const handleUpdateRepresentative = async () => {
        try {
            const token = getToken()
            const response = await fetch(`${API_URL}/user/${representative.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({universityId: university.id})
            });

            if (!response.ok) {
                messageApi.error('Не удалось добавить представителя ')
            }
            // 4) Успешное уведомление
            messageApi.success("Информация обновлена");

            // 5) После уведомления обновляем данные на странице
            await fetchUsers();
        } catch (err) {
            // 6) Ошибка запроса или throw
            messageApi.error(err.message || "Произошла непредвиденная ошибка");
        }
    };

    const handleUpdateProgram = async (program, values) => {
        const preparedValues = {
            ...values,
            min_similarity: values.min_similarity / 100
        };
        try {
            const response = await fetch(`${API_URL}/programs/${program.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(preparedValues)
            });

            if (!response.ok) {
                messageApi.error('Не удалось обновить программу ')
            }

            // 4) Успешное уведомление
            messageApi.success("Информация обновлена");

            // 5) После уведомления обновляем данные на странице
            await mutate();
        } catch (err) {
            // 6) Ошибка запроса или throw
            messageApi.error(err.message || "Произошла непредвиденная ошибка");
        }
    }

    const handleAddNewProgram = async (values) => {
        const preparedValues = {
            ...values,
            min_similarity: values.min_similarity / 100
        };
        try {
            const response = await fetch(`${API_URL}/university-programs/university/${university.id}/programs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(preparedValues)
            });

            if (!response.ok) {
                messageApi.error('Не удалось добавить программу ')
            }

            messageApi.success("Программа добавлена");

            // 5) После уведомления обновляем данные на странице
            await mutate();
        } catch (err) {
            // 6) Ошибка запроса или throw
            messageApi.error(err.message || "Произошла непредвиденная ошибка");
        }
    }

    const handleDeleteProgram = async (program) => {
        try {
            const response = await fetch(`${API_URL}/programs/${program.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                messageApi.error('Не удалось удалить программу ')
            }
            // 4) Успешное уведомление
            messageApi.success("Программа удалена");

            // 5) После уведомления обновляем данные на странице
            await mutate();
        } catch (err) {
            // 6) Ошибка запроса или throw
            messageApi.error(err.message || "Произошла непредвиденная ошибка");
        }
    }

    return (
        <>
            {contextHolder}
            {error && <Alert message="Ошибка при загрузке информации о вузе" type="error"/>}
            <Spin spinning={loading}>
                {isAdmin &&
                    <Flex gap={10}>
                        <Select
                            showSearch
                            placeholder="Выберите представителя"
                            optionFilterProp="children"
                            onChange={(value) => {
                                const selected = representatives?.find(r => r.id === value);
                                setRepresentative(selected); // если хочешь обновлять состояние выбранного
                            }}
                            filterOption={(input, option) =>
                                (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            value={representative?.id}
                            style={{width: '100%', height: 'auto'}}
                        >
                            {representatives?.map(rep => (
                                <Select.Option key={rep.id} value={rep.id}>
                                    {rep.fio} ({rep.email})
                                </Select.Option>
                            ))}
                        </Select>
                        <Button type="primary" onClick={handleUpdateRepresentative}>Сохранить</Button>
                    </Flex>
                }

                {/* Программы */}
                <Typography.Title level={4}>Программы</Typography.Title>
                <Collapse accordion>
                    {programs.map((program) => (
                        <Collapse.Panel header={program.title} key={program.id}>
                            <Card>
                                <Form
                                    layout="vertical"
                                    initialValues={{
                                        ...program,
                                        min_similarity: Math.round(program.min_similarity * 100)
                                    }}
                                    onFinish={(values) => {
                                        handleUpdateProgram(program, values)
                                    }}
                                >
                                    <Form.Item name="title" label="Название" rules={[{required: true}]}>
                                        <Input/>
                                    </Form.Item>
                                    <Form.Item name="description" label="Описание">
                                        <Input.TextArea/>
                                    </Form.Item>
                                    <Form.Item name="level" label="Уровень образования" rules={[{required: true}]}>
                                        <Input/>
                                    </Form.Item>
                                    <Form.Item name="form" label="Форма" rules={[{required: true}]}>
                                        <Input/>
                                    </Form.Item>
                                    <Form.Item name="duration" label="Срок" rules={[{required: true}]}>
                                        <Input/>
                                    </Form.Item>
                                    <Form.Item name="seats" label="Мест" rules={[{required: true}]}>
                                        <Input/>
                                    </Form.Item>
                                    <Form.Item name="min_similarity" label="Минимальный процент схожести"
                                               rules={[{required: true}]}>
                                        <Input/>
                                    </Form.Item>
                                    <Form.Item name="additionally" label="Дополнительно">
                                        <Input/>
                                    </Form.Item>
                                    <Form.Item name="assessment" label="Ассесмент">
                                        <Select
                                            placeholder="Выберите ассесмент"
                                            style={{width: 250}}
                                            allowClear
                                            options={assessments.map(item => ({
                                                label: item.title,
                                                value: item.id,
                                            }))}
                                        />
                                    </Form.Item>
                                    <Upload {...uploadProps('programStudyplan', mutate, {
                                        programId: program.id,
                                    })}>
                                        <Button icon={<UploadOutlined/>}>{program.studyplan ? "Обновите учебный план" : "Загрузите учебный план"}</Button>
                                    </Upload>
                                    <Flex style={{marginTop: 20, justifyContent: "space-between"}}>
                                        <Button type="primary" htmlType="submit">Сохранить</Button>
                                        <Button danger onClick={() => handleDeleteProgram(program)}>Удалить</Button>
                                    </Flex>
                                </Form>
                            </Card>
                        </Collapse.Panel>
                    ))}
                </Collapse>

                {/* Новая программа */}
                {openNewProgramFields ? (
                    <Form
                        layout="vertical"
                        onFinish={(values) => {
                            handleAddNewProgram(values)
                            setOpenNewProgramFields(false);
                        }}
                    >
                        <Typography.Title level={4}>Новая программа</Typography.Title>
                        <Form.Item name="title" label="Название" rules={[{required: true}]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item name="description" label="Описание">
                            <Input.TextArea/>
                        </Form.Item>
                        <Form.Item name="level" label="Уровень образования" rules={[{required: true}]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item name="form" label="Форма" rules={[{required: true}]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item name="duration" label="Срок" rules={[{required: true}]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item name="seats" label="Мест" rules={[{required: true}]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item name="min_similarity" label="Минимальный процент схожести"
                                   rules={[{required: true}]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item name="additionally" label="Дополнительно">
                            <Input/>
                        </Form.Item>
                        <Button type="primary" htmlType="submit" style={{marginTop: 16}}>
                            Добавить программу
                        </Button>
                    </Form>
                ) : (
                    <Button
                        onClick={() => setOpenNewProgramFields(true)}
                        style={{marginTop: 20}}
                    >
                        Добавить программу
                    </Button>
                )}
            </Spin>
        </>
    );
};

export default UniversityPanel;