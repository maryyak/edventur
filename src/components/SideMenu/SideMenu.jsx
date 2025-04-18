import React from 'react';
import {Button, Flex, Layout, Menu} from "antd";
import styles from "./SideMenu.module.scss";
import {
    HomeOutlined, PhoneOutlined,
    ReadOutlined, SettingOutlined,
    SolutionOutlined, BookOutlined, SnippetsOutlined
} from "@ant-design/icons";
import {useLocation, useNavigate} from "react-router-dom";
import Logo from "../Logo";
import {useUserInfo} from "../../context/UserInfoContext";
import ContactsMailLinkWrapper from "../ContactsMailLinkWrapper";

const SideMenu = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {userInfo} = useUserInfo();

    const unauthorizedItems = [
        {
            key: '/',
            icon: <HomeOutlined/>,
            label: 'Главная',
        },
        {
            key: '/programs',
            icon: <ReadOutlined/>,
            label: 'Образовательные программы',
        },
    ];

    const studentItems = [
        {
            key: '/',
            icon: <HomeOutlined/>,
            label: 'Главная',
        },
        {
            key: '/programs',
            icon: <ReadOutlined/>,
            label: 'Образовательные программы',
        },
        {
            key: '/applications',
            icon: <SolutionOutlined/>,
            label: 'Мои заявки',
        },
        {
            key: '/settings',
            icon: <SettingOutlined/>,
            label: 'Настройки аккаунта',
        },
    ];

    const representativeItems = [
        {
            key: '/',
            icon: <HomeOutlined/>,
            label: 'Главная',
        },
        {
            key: '/programs-statistic',
            icon: <ReadOutlined/>,
            label: 'Аналитика программ',
        },
        {
            key: '/university-applications',
            icon: <SolutionOutlined/>,
            label: 'Заявки от студентов',
        },
        {
            key: '/all-assessments',
            icon: <SnippetsOutlined/>,
            label: 'Ассесменты',
        },
        {
            key: '/settings',
            icon: <SettingOutlined/>,
            label: 'Настройки профиля',
        },

    ];

    const adminItems = [
        {
            key: '/',
            icon: <HomeOutlined/>,
            label: 'Главная',
        },
        {
            key: '/programs-statistic',
            icon: <ReadOutlined/>,
            label: 'Аналитика программ',
        },
        {
            key: '/all-assessments',
            icon: <SnippetsOutlined/>,
            label: 'Ассесменты',
        },
        {
            key: '/partner-universities',
            icon: <BookOutlined/>,
            label: 'ВУЗы-партнеры',
        },

    ];

    const menuItems = userInfo?.role === 'student'
        ? studentItems
        : userInfo?.role === 'representative'
            ? representativeItems
            : userInfo?.role === 'admin'
                ? adminItems
                : unauthorizedItems;

    const onClick = (item) => {
        navigate(item.key);
    };

    return (
        <Layout.Sider width="360px">
            <Flex vertical justify="space-between" className={styles.siderMenu}>
                <Flex vertical gap={50}>
                    <Logo style={{padding: '0 16px'}} color={'#08A652'}/>
                    <Menu
                        onClick={onClick}
                        selectedKeys={[location.pathname]}
                        items={menuItems}
                    />
                </Flex>
                <ContactsMailLinkWrapper>
                    <Button
                        variant="outlined"
                        color="primary"
                        icon={<PhoneOutlined/>}
                        style={{width:'100%'}}
                    >
                        Связаться с поддержкой
                    </Button>
                </ContactsMailLinkWrapper>
            </Flex>
        </Layout.Sider>
    );
};

export default SideMenu;
