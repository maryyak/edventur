import React from 'react';
import {Routes, Route, Navigate} from "react-router-dom";
import {privateRoutes, routes} from "../router";
import PrivateRoute from "../utils/PrivateRoute";

const AppRouter = () => {
    return (
        <Routes>
            {routes.map(route => (
                <Route
                    path={route.path}
                    element={route.element}
                    key={route.path}
                />
            ))}
            <Route element={<PrivateRoute/>}>
                {privateRoutes.map(route => (
                    <Route
                        path={route.path}
                        element={route.element}
                        key={route.path}
                    />
                ))}
            </Route>
            <Route path="*" element={<Navigate to="/" replace/>}/>
        </Routes>
    );
};

export default AppRouter;