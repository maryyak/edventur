import {BrowserRouter} from "react-router-dom";
import AppLayout from "./components/AppLayout";
import {UserInfoProvider} from "./context/UserInfoContext";

function App() {

    return (
        <BrowserRouter>
            <UserInfoProvider>
                <AppLayout />
            </UserInfoProvider>
        </BrowserRouter>
    );
}

export default App;
