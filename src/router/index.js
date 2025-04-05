import HomePage from "../pages/HomePage";
import EducationPrograms from "../pages/EducationPrograms";
import Recommendations from "../pages/Recommendations";
import SingleProgram from "../pages/SingleProgram/SingleProgram";

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
    }
]