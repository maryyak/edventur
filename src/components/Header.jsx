import React from 'react';
import { Badge, Flex, Layout} from "antd";
import {
    BellFilled, UserOutlined
} from "@ant-design/icons";
import {Link} from "react-router-dom";


const notifications = ['Уведомление 1', 'Уведомление 2', 'Уведомление 3', 'Уведомление 4', 'Уведомление 5'];
const Header = () => {



    return (
        <Layout.Header>
            <Flex gap={20} justify="flex-end" style={{marginRight: 103,marginTop: 10}}>
                <Link to={'/'}>
                    <Badge count={notifications.length} color="#08a652">
                        <BellFilled style={{ fontSize: 24, color: 'gray' }} />
                    </Badge>
                </Link>
                <Link to={'/'}>
                    <UserOutlined style={{ fontSize: 24,color:"#08a652" }} />
                </Link>
            </Flex>
        </Layout.Header>
    );
};

export default Header;