import React from 'react';
import { Button, Flex, Layout, Menu } from "antd";
import styles from "./SideMenu.module.scss";
import {
    HomeOutlined, PhoneOutlined,
    ReadOutlined, SettingOutlined,
    SolutionOutlined, BookOutlined, SnippetsOutlined
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../Logo";
import { userInfo } from "../../utils/mock";

const SideMenu = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = userInfo.find((u) => u.id === 3);

    const commonItems = [
        {
            key: '/',
            icon: <HomeOutlined />,
            label: 'Главная',
        },
        {
            key: '/programs',
            icon: <ReadOutlined />,
            label: 'Образовательные программы',
        },

    ];

    const studentItems = [
        {
            key: '/applications',
            icon: <SolutionOutlined />,
            label: 'Мои заявки',
        },
        {
            key: '/settings',
            icon: <SettingOutlined />,
            label: 'Настройки аккаунта',
        },
    ];

    const agentItems = [
        {
            key: '/universityApplications',
            icon: <SolutionOutlined />,
            label: 'Заявки от студентов',
        },
        {
            key: '/allAssesments',
            icon: <SnippetsOutlined />,
            label: 'Ассесменты',
        },
        {
            key: '/settings',
            icon: <SettingOutlined />,
            label: 'Настройки профиля',
        },

    ];

    const adminItems = [
        {
            key: '/allAssesments',
            icon: <SnippetsOutlined />,
            label: 'Ассесменты',
        },
        {
            key: '/partnerUniversities',
            icon: <BookOutlined />,
            label: 'ВУЗы-партнеры',
        },

    ];

    const menuItems = user?.role === 'student'
        ? [...commonItems, ...studentItems]
        : user?.role === 'agent'
            ? [...commonItems, ...agentItems]
            :user?.role === 'admin'
                ? [...commonItems, ...adminItems]
            : [...commonItems];

    const onClick = (item) => {
        navigate(item.key);
    };

    return (
        <Layout.Sider width="360px">
            <Flex vertical justify="space-between" className={styles.siderMenu}>
                <Flex vertical gap={50}>
                    <Logo style={{ padding: '0 16px' }} color={'#08A652'} />
                    <Menu
                        onClick={onClick}
                        selectedKeys={[location.pathname]}
                        items={menuItems}
                    />
                </Flex>
                <Button
                    variant="outlined"
                    color="primary"
                    icon={<PhoneOutlined />}
                >
                    Связаться с поддержкой
                </Button>
            </Flex>
        </Layout.Sider>
    );
};

export default SideMenu;
