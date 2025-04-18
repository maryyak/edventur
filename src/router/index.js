import HomePage from "../pages/HomePage";
import EducationPrograms from "../pages/EducationPrograms";
import Registration from "../pages/Registration";
import Login from "../pages/Login";
import SingleProgram from "../pages/SingleProgram/SingleProgram";
import Settings from "../pages/Settings";
import Request from "../pages/Request";
import Assessment from "../pages/Assesment/Assessment";
import Applications from "../pages/Applications";
import UniversityApplications from "../pages/UniversityApplications";
import CreateAssesment from "../pages/CreateAssesment";
import PartnerUniversities from "../pages/PartnerUniversities/PartnerUniversities";
import AllAssesments from "../pages/AllAssesments";
import ProgramsStatistic from "../pages/ProgramsStatistic";
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
]

export const privateRoutes = [
    {
        path: '/assessment/:id',
        element: <Assessment/>
    },
    {
        path: '/applications',
        element: <Applications/>
    },
    {
        path: '/university-applications',
        element: <UniversityApplications/>
    },
    {
        path: '/create-assessment',
        element: <CreateAssesment/>
    },
    {
        path: '/partner-universities',
        element: <PartnerUniversities/>
    },
    {
        path: '/all-assessments',
        element: <AllAssesments/>
    },
    {
        path: '/programs-statistic',
        element: <ProgramsStatistic/>
    }
]