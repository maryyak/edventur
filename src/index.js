import React from 'react';
import {ConfigProvider} from "antd";
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import "@fontsource/montserrat";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/900.css";

const theme = {
    token: {
        fontFamily: "Montserrat, sans-serif",
        colorPrimary: "#08a652",
        colorPrimaryBg: "#f1f5f2",
        colorBgLayout: "none",
        colorLink: "#08a652",
    },
    components: {
        Layout: {
            headerBg: "none"
        },
        Button: {
            fontWeight: 500,
            controlHeight: 43,
        }
    },
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <ConfigProvider theme={theme}>
        <App />
    </ConfigProvider>
  // </React.StrictMode>
);
