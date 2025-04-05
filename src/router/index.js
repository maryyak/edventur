import HomePage from "../pages/HomePage";
import EducationPrograms from "../pages/EducationPrograms";
import Registration from "../pages/Registration";
import Login from "../pages/Login";
import Recommendations from "../pages/Recommendations";
import SingleProgram from "../pages/SingleProgram/SingleProgram";
import Settings from "../pages/Settings";

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
        path: '/recommendations',
        element: <Recommendations/>,
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
    }
]