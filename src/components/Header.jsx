import React from 'react';
import {Badge, Dropdown, Flex, Layout, Menu} from "antd";
import {
    ArrowRightOutlined,
    BellOutlined, UserOutlined
} from "@ant-design/icons";
import {Link} from "react-router-dom";
import {notifications, userInfo} from "../utils/mock";
const user = userInfo.find((u) => u.id === 2);
//тут надо еще добавить механизм выхода из аккаунта
const Header = () => {
    const menu = (
        <Menu>
            <Menu.Item key="account">
                <Link to="/settings">
                    <Flex gap={16}>
                        {user.fio}
                        <ArrowRightOutlined/>
                    </Flex>
                </Link>
            </Menu.Item>
            <Menu.Divider/>
            <Menu.Item key="logout" danger>
                Выйти
            </Menu.Item>
        </Menu>
    );

    return (
        <Layout.Header>
            <Flex gap={20} justify="flex-end" style={{marginRight: 103, marginTop: 10}}>
                <Link to={'/'}>
                    <Badge count={notifications.length} color="#08a652">
                        <BellOutlined style={{fontSize: 24, color: 'gray'}}/>
                    </Badge>
                </Link>
                <Dropdown overlay={menu} trigger={['hover']} placement="bottomCenter">
                    <UserOutlined style={{fontSize: 24, color: "#08a652", cursor: 'pointer'}}/>
                </Dropdown>
            </Flex>
        </Layout.Header>
    );
};

export default Header;