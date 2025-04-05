import React from 'react';
import {Button, Flex, Layout, Menu} from "antd";
import styles from "./SideMenu.module.scss"
import {
    HomeOutlined, PhoneOutlined,
    ReadOutlined,
    SettingOutlined,
    SolutionOutlined, StarOutlined
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
        key: '/programs',
        icon: <ReadOutlined/>,
        label: 'Образовательные программы',
    },
    {
        key: '/recommendations',
        icon: <StarOutlined/>,
        label: 'Индивидуальный подбор',
    },
    {
        key: '/3',
        icon: <SolutionOutlined/>,
        label: 'Мои заявки',
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
        <Layout.Sider width="360px">
            <Flex vertical justify={"space-between"} className={styles.siderMenu}>
                <Flex vertical gap={50}>
                    <Logo style={{padding:'0 16px'}} color={'#08A652'} />
                    <Menu
                        onClick={(event) => onClick(event)}
                        selectedKeys={[location.pathname]}
                        items={menuItems}/>
                </Flex>
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