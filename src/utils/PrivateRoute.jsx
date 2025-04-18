import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import {useUserInfo} from "../context/UserInfoContext";

const PrivateRoute = () => {
    const { userInfo } = useUserInfo();
    const location = useLocation();

    if (!userInfo) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;