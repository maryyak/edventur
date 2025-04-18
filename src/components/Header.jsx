import React from 'react';
import {Button, Dropdown, Flex, Layout, Menu} from "antd";
import {
    ArrowRightOutlined,
    UserOutlined
} from "@ant-design/icons";
import {Link, useNavigate} from "react-router-dom";
import {useUserInfo} from "../context/UserInfoContext";
import useAuth from "../hooks/api/users/authUser";

const Header = () => {
    const { userInfo } = useUserInfo();
    const { logout } = useAuth();
    const navigate = useNavigate();
    const menu = (
        <Menu>
            {userInfo && userInfo?.username ? (
                <>
                    <Menu.Item key="account">
                        <Link to="/settings">
                            <Flex gap={16}>
                                {userInfo?.username}
                                <ArrowRightOutlined/>
                            </Flex>
                        </Link>
                    </Menu.Item>
                    <Menu.Divider/>
                    <Menu.Item key="logout" danger onClick={logout}>
                        Выйти
                    </Menu.Item>
                </>
            ) : (
                <Menu.Item key="login" style={{backgroundColor: " #318d25", color: "#fff"}} >
                    <Link to="/login">Войти</Link>
                </Menu.Item>
            )}
        </Menu>
    );

    return (
        <Layout.Header>
            {userInfo && userInfo?.username ? (
                <>
                    <Flex gap={20} justify="flex-end" style={{marginRight: 103, marginTop: 10}}>
                        <Dropdown overlay={menu} trigger={['hover']} placement="bottomCenter">
                            <UserOutlined style={{fontSize: 24, color: "#08a652", cursor: 'pointer'}}/>
                        </Dropdown>
                    </Flex>
                </>
            ) : (
                <Flex gap={20} justify="flex-end" style={{marginRight: 103, marginTop: 10}}>
                    <Button type="primary" onClick={() => navigate('/login')}>
                        Войти
                    </Button>
                </Flex>
            )}
        </Layout.Header>
    );
};

export default Header;