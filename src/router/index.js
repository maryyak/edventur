import HomePage from "../pages/HomePage/HomePage";
import EducationPrograms from "../pages/EducationPrograms/EducationPrograms";
import Registration from "../pages/Registration/Registration";
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
        path: '/registration',
        element: <Registration/>,
    }
]