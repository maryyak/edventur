import React from 'react';
import {Button, Flex, Layout, Menu} from "antd";
import styles from "./SideMenu.module.scss"
import {
    BookOutlined,
    HomeOutlined, PhoneOutlined,
    ReadOutlined,
    SettingOutlined,
    SolutionOutlined
} from "@ant-design/icons";
import {useLocation, useNavigate} from "react-router-dom";
import Logo from "../Logo";

const menuItems = [
    {
        key: '/',
        icon: <HomeOutlined/>,
        label: 'Главная',
    },
    {
        key: '/1',
        icon: <SolutionOutlined/>,
        label: 'Подать заявку',
    },
    {
        key: '/2',
        icon: <ReadOutlined/>,
        label: 'Образовательные программы',
    },
    {
        key: '/3',
        icon: <BookOutlined/>,
        label: 'ВУЗы-партнеры',
    },
    {
        key: '/4',
        icon: <SettingOutlined/>,
        label: 'Настройки аккаунта',
    },
]

const SideMenu = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const onClick = (item) => {
        navigate(item.key)
    };

    return (
        <Layout.Sider width="360px" className={styles.siderMenu}>
            <Flex vertical gap={50}>
                <Logo/>
                <Menu
                    onClick={(event) => onClick(event)}
                    selectedKeys={[location.pathname]}
                    items={menuItems}/>
                <Button
                    variant="outlined"
                    color="primary"
                    icon={<PhoneOutlined/>}

                >
                    Связаться с поддержкой
                </Button>
            </Flex>
        </Layout.Sider>
    );
};

export default SideMenu;