import React, {useEffect, useState} from 'react';
import SideMenu from "./SideMenu/SideMenu";
import {Layout} from "antd";
import ScrollToHash from "../utils/ScrollToHash";
import AppRouter from "./AppRouter";
import Footer from "./Footer";
import {useLocation} from "react-router-dom";
import Header from "./Header";
const AppLayout = () => {
    const location = useLocation();
    const hideLayoutPaths = ["/login", "/registration"];
    const [showLayout, setShowLayout] = useState(true);

    useEffect(() => {
        setShowLayout(!hideLayoutPaths.includes(location.pathname));
    }, [location.pathname]);

    return (
        <Layout>
            {showLayout &&
                <SideMenu/>
            }
            <Layout style={{minHeight: "100vh"}}>
                {showLayout &&
                    <Header/>
                }
                <Layout.Content>
                    <ScrollToHash/>
                    <AppRouter/>
                </Layout.Content>
                {showLayout &&
                    <Footer/>
                }
            </Layout>
        </Layout>
    );
};

export default AppLayout;