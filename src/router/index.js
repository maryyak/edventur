import HomePage from "../pages/HomePage";
import EducationPrograms from "../pages/EducationPrograms";
import Registration from "../pages/Registration";
import Login from "../pages/Login";
import SingleProgram from "../pages/SingleProgram/SingleProgram";
import Settings from "../pages/Settings";
import Request from "../pages/Request";
import Assessment from "../pages/Assessment";

export const routes = [
    {
        path: '/',
        element: <HomePage/>,
    },
    {
        path: '/programs',
        element: <EducationPrograms/>,
    },
    {
        path: '/programs/:id',
        element: <SingleProgram />,
    },
    {
        path: '/registration',
        element: <Registration/>,
    },
    {
        path: '/login',
        element: <Login/>
    },
    {
        path: '/settings',
        element: <Settings/>
    },
    {
        path: '/request/:id',
        element: <Request/>
    },
    {
        path: '/assessment/:id',
        element: <Assessment/>
    }
]