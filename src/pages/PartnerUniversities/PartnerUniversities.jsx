import {
    Alert, Button, Card, Collapse, Flex, Input, message, Spin,
    Typography
} from "antd";
import React, { useState } from "react";
import useUniversities from "../..//hooks/api/universities/useUniversities";
import UniversityPanel from "./components/UniversityPanel";

const PartnerUniversities = () => {
    const { universities, loading, error, mutate } = useUniversities();
    const [newUniversityName, setNewUniversityName] = useState("");

    const handleAddUniversity = async () => {
        if (!newUniversityName.trim()) return message.warning("Введите название ВУЗа");
        if (universities.some(u => u.name === newUniversityName)) return message.warning("ВУЗ уже существует");

        const newUniversity = {
            name: newUniversityName
        };

        const API_URL = process.env.REACT_APP_API_URL;

        try {
            const response = await fetch(`${API_URL}/universities`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body : JSON.stringify(newUniversity)
            });

            if (!response.ok) {
                message.error('Не удалось добавить университет ')
            }

        } finally {
            mutate();
        }
        setNewUniversityName("");
    };

    return (
        <Flex vertical gap={24}>
            <Typography.Title level={2}>Наши ВУЗы-партнеры</Typography.Title>
            <Flex gap={30} style={{ justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Card title="Добавить новый ВУЗ" style={{ flex: 2 }}>
                    <Flex gap={20}>
                        <Input
                            placeholder="Введите название ВУЗа"
                            value={newUniversityName}
                            onChange={(e) => setNewUniversityName(e.target.value)}
                        />
                        <Button type="primary" onClick={handleAddUniversity}>
                            Добавить
                        </Button>
                    </Flex>
                </Card>
                <img src="/sberkot_student.png" alt="Сберкот" style={{ width: 200, marginRight: 90 }} />
            </Flex>

            {error && <Alert message="Ошибка при загрузке вузов" type="error" />}
            <Spin spinning={loading}>
                <Collapse accordion>
                    {universities.map((university) =>
                        <Collapse.Panel header={university.name} key={university.id}>
                            <UniversityPanel university={university} isAdmin={true}/>
                        </Collapse.Panel>)}
                </Collapse>
            </Spin>
        </Flex>
    );
};

export default PartnerUniversities;