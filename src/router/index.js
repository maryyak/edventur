import HomePage from "../pages/HomePage/HomePage";
import EducationPrograms from "../pages/EducationPrograms/EducationPrograms";

export const routes = [
    {
        path: '/',
        element: <HomePage/>,
    },
    {
        path: '/programs',
        element: <EducationPrograms/>,
    }
]